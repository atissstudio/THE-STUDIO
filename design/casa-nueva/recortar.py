"""
Recorte del fondo de los renders de la casa (2026-08-21).

⚠️ POR QUÉ NO VALE UN RECORTE POR COLOR. Los seis renders no tienen fondo
plano: tienen un DEGRADADO (de azul oscuro arriba a claro abajo, o de gris a
gris). Un recorte por "quita todo lo que se parezca a este color" deja un halo
o se come parte de la casa, según por dónde vaya el degradado.

Lo que se hace es lo que se hace en el oficio para esto: se MODELA el fondo. Se
toman muestras del marco de la imagen (arriba y los laterales, que siempre son
fondo), se ajusta por mínimos cuadrados una superficie suave por canal, y esa
superficie es "cómo sería la imagen si la casa no estuviera". La transparencia
sale de cuánto se aparta cada píxel de ese fondo previsto.

Después: se queda la mancha grande (la casa y su peana) para tirar motas
sueltas, se rellenan los agujeros interiores y se suaviza un píxel el borde,
que es lo que evita el diente de sierra.
"""
import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter

BASE = Path(__file__).resolve().parent


def modelo_de_fondo(rgb: np.ndarray) -> np.ndarray:
    """
    Superficie suave ajustada al marco: cómo sería la imagen sin la casa.

    ⚠️ CÚBICA Y ROBUSTA, y las dos cosas hacen falta. Con una cuadrática el
    modelo no seguía el degradado en las esquinas, y justo ahí quedaban trozos
    de fondo sin quitar. Y el ajuste se repite descartando lo que se desvía
    mucho: si una esquina del marco pilla parte de la casa o su sombra, un
    ajuste normal se va detrás de ella y estropea el modelo entero.
    """
    alto, ancho, _ = rgb.shape
    ys, xs = np.mgrid[0:alto, 0:ancho]
    marco = np.zeros((alto, ancho), bool)
    marco[: int(alto * 0.16), :] = True          # la franja de arriba
    marco[:, : int(ancho * 0.035)] = True        # el canto izquierdo
    marco[:, -int(ancho * 0.035) :] = True       # el canto derecho
    # Y LAS DOS ESQUINAS DE ABAJO. Sin ellas el modelo no tenía ni una muestra
    # del borde inferior y tenía que extrapolar justo donde el degradado es más
    # claro: quedaba una lengua de fondo pegada bajo la peana, visible en tres
    # de las seis. Si alguna esquina pillara la peana, el ajuste robusto la
    # descarta sola.
    marco[-int(alto * 0.07) :, : int(ancho * 0.13)] = True
    marco[-int(alto * 0.07) :, -int(ancho * 0.13) :] = True

    def base(x, y):
        return np.stack(
            [np.ones_like(x), x, y, x * y, x * x, y * y,
             x * x * y, x * y * y, x * x * x, y * y * y],
            axis=-1,
        )

    xm = (xs[marco] / ancho).astype(np.float64)
    ym = (ys[marco] / alto).astype(np.float64)
    Am = base(xm, ym)
    Af = base((xs / ancho).astype(np.float64), (ys / alto).astype(np.float64))

    fondo = np.zeros_like(rgb, dtype=np.float64)
    for c in range(3):
        valores = rgb[marco][:, c].astype(np.float64)
        peso = np.ones_like(valores, bool)
        for _ in range(3):
            coef, *_ = np.linalg.lstsq(Am[peso], valores[peso], rcond=None)
            resto = np.abs(Am @ coef - valores)
            peso = resto < max(np.median(resto) * 3.0, 4.0)
            if peso.sum() < len(valores) * 0.3:
                break
        fondo[..., c] = Af @ coef
    return fondo


def _dilatar(m: np.ndarray) -> np.ndarray:
    """Crece un píxel en las cuatro direcciones."""
    d = m.copy()
    d[1:, :] |= m[:-1, :]
    d[:-1, :] |= m[1:, :]
    d[:, 1:] |= m[:, :-1]
    d[:, :-1] |= m[:, 1:]
    return d


def quitar_lenguas(mask: np.ndarray, radio: int = 5, tope: int = 900) -> np.ndarray:
    """
    Quita las lenguas finas de sombra SIN comerse lo fino de la casa.

    ⚠️ AQUÍ ESTUVO EL RECORTE MORDIDO QUE VIO ALEJANDRO. Antes esto era una
    apertura a secas —encoger y volver a crecer—, y una apertura no distingue
    entre una lengua de sombra y el murete del jardín: los dos son finos, así
    que se llevaba por delante media tapia y dejaba el borde izquierdo
    dentellado.

    Lo correcto es una apertura POR RECONSTRUCCIÓN, que es justo la
    herramienta para esto. El encogido no decide la forma final, solo decide
    QUIÉN SOBREVIVE: lo que queda son semillas. Después esas semillas se dejan
    crecer otra vez, pero solo dentro de la silueta original, hasta que no
    puedan más. Lo que está pegado al cuerpo —el murete, la palmera, los
    escalones— se recupera entero, porque le llega el crecimiento desde la
    semilla. Lo que era una lengua suelta no tiene semilla y no vuelve.
    """
    semilla = mask.copy()
    for _ in range(radio):  # encoger = dilatar el hueco
        semilla = ~_dilatar(~semilla) & mask
    for _ in range(tope):
        crecida = _dilatar(semilla) & mask
        if np.array_equal(crecida, semilla):
            break
        semilla = crecida
    return semilla


def mancha_mayor(mask: np.ndarray) -> np.ndarray:
    """Se queda con la región conectada más grande. Sin scipy: barrido propio."""
    alto, ancho = mask.shape
    etiqueta = np.zeros((alto, ancho), np.int32)
    actual = 0
    mejor, mejor_tam = 0, 0
    pila = []
    for y0 in range(alto):
        for x0 in range(ancho):
            if not mask[y0, x0] or etiqueta[y0, x0]:
                continue
            actual += 1
            tam = 0
            pila.append((y0, x0))
            etiqueta[y0, x0] = actual
            while pila:
                y, x = pila.pop()
                tam += 1
                for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < alto and 0 <= nx < ancho and mask[ny, nx] and not etiqueta[ny, nx]:
                        etiqueta[ny, nx] = actual
                        pila.append((ny, nx))
            if tam > mejor_tam:
                mejor, mejor_tam = actual, tam
    return etiqueta == mejor


def rellenar_huecos(mask: np.ndarray, limite: int = 600) -> np.ndarray:
    """
    Rellena SOLO los agujeros pequeños.

    ⚠️ AQUÍ ESTABA EL MANCHÓN PÁLIDO que se veía a la izquierda de la casa,
    entre la palmera y el muro. Eso es fondo de verdad —se ve el cielo por el
    hueco que dejan la palmera, la tapia y la fachada—, pero como queda
    rodeado de casa por los cuatro lados, un relleno de huecos a secas lo toma
    por interior y lo tapa. Resultado: un trozo del fondo viejo incrustado
    dentro de la silueta, que sobre otro color canta.

    Un agujero que hay que rellenar es una MOTA, cosa de unos cientos de
    píxeles, que viene del ruido del umbral. Un hueco grande es un sitio por
    donde se ve el fondo, y ese tiene que quedar transparente. Así que se
    miden y solo se tapan los pequeños.
    """
    alto, ancho = mask.shape
    fuera = np.zeros((alto, ancho), bool)
    pila = []

    def sembrar(y, x):
        if not mask[y, x] and not fuera[y, x]:
            fuera[y, x] = True
            pila.append((y, x))

    for x in range(ancho):
        sembrar(0, x)
        sembrar(alto - 1, x)
    for y in range(alto):
        sembrar(y, 0)
        sembrar(y, ancho - 1)
    while pila:
        y, x = pila.pop()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < alto and 0 <= nx < ancho and not mask[ny, nx] and not fuera[ny, nx]:
                fuera[ny, nx] = True
                pila.append((ny, nx))

    encerrado = ~mask & ~fuera
    salida = mask.copy()
    visto = np.zeros((alto, ancho), bool)
    ys, xs = np.nonzero(encerrado)
    for y0, x0 in zip(ys, xs):
        if visto[y0, x0]:
            continue
        grupo = [(y0, x0)]
        visto[y0, x0] = True
        pila = [(y0, x0)]
        while pila:
            y, x = pila.pop()
            for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                ny, nx = y + dy, x + dx
                if 0 <= ny < alto and 0 <= nx < ancho and encerrado[ny, nx] and not visto[ny, nx]:
                    visto[ny, nx] = True
                    grupo.append((ny, nx))
                    pila.append((ny, nx))
        if len(grupo) <= limite:
            for y, x in grupo:
                salida[y, x] = True
    return salida


def recortar(entrada: Path, salida: Path, umbral: float = 26.0, abrir: bool = True, ancho_max: int = 1400):
    im = Image.open(entrada).convert("RGB")
    if im.width > ancho_max:
        im = im.resize((ancho_max, round(im.height * ancho_max / im.width)), Image.LANCZOS)
    rgb = np.asarray(im).astype(np.float64)

    """
    ⚠️ PROBADO Y DESCARTADO: separar la sombra por TONO. La idea era que una
    sombra es el fondo con menos luz, así que comparando ya corregido el brillo
    lo que solo cambia de luz es fondo y lo que cambia de tono es casa. Suena
    bien y funciona con las de color, pero DESTRUYE las de arcilla: allí la
    casa es gris sobre fondo gris, o sea que también ella "solo cambia de luz",
    y desaparecían enteras (quedaban en 62x35 px). No volver a intentarlo.

    La sombra se quita por su FORMA, no por su color: es una lengua fina pegada
    al borde, y una apertura morfológica se la lleva sin tocar el cuerpo.
    """
    dist = np.linalg.norm(rgb - modelo_de_fondo(rgb), axis=-1)
    # Rampa suave: el borde no es un sí o un no, y de ahí sale el antialias.
    alfa = np.clip((dist - umbral) / (umbral * 0.75), 0.0, 1.0)

    solido = alfa > 0.55
    # Apertura: se encoge y se vuelve a crecer. Las lenguas de sombra pegadas al
    # borde son finas y no sobreviven al encogido; el cuerpo de la casa sí.
    if abrir:
        solido = quitar_lenguas(solido)
    solido = mancha_mayor(solido)
    solido = rellenar_huecos(solido)
    """
    ⚠️ LA TRANSPARENCIA ES BINARIA, y el borde lo suaviza el desenfoque. Antes
    se conservaba fuera de la mancha hasta un 0,35 de alfa "para el antialias",
    y eso es un tercio del fondo viejo pegado alrededor de la casa: el halo que
    se veía al montarla sobre otro color. El diente de sierra se quita con
    medio píxel de desenfoque, no dejando fondo.
    """
    capa = Image.fromarray((solido * 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.7))
    fuera = Image.merge("RGBA", (*im.split(), capa))
    caja = fuera.getbbox()
    if caja:
        fuera = fuera.crop(caja)
    salida.parent.mkdir(parents=True, exist_ok=True)
    fuera.save(salida, "WEBP", quality=92, method=6)
    cubre = float((np.asarray(capa) > 128).mean())
    print(f"{entrada.name:46} -> {salida.name:22} {fuera.width}x{fuera.height}  ocupa {cubre*100:.1f}%")


if __name__ == "__main__":
    # El umbral va por imagen: las de arcilla son gris sobre gris y con el
    # umbral general se les abrían agujeros en la pared de delante.
    pares = [
        # ⚠️ UMBRALES BAJOS, Y NO ES CAPRICHO. Con 22-26 el recorte MORDÍA la
        # casa: en la de noche las paredes en sombra están cerca del azul
        # oscuro del fondo, así que el corte entraba dentro de la pared y el
        # lado derecho salía dentellado, con trozos sueltos. Comprobado a los
        # tres valores sobre el plata real del sitio: 16 da la silueta entera
        # y limpia, 20 la rompe. El original de Alejandro está perfecto; el
        # dentado lo ponía el umbral.
        ("IMG_5795.JPG", "casa-noche.webp", 16.0),
        ("IMG_5796.JPG", "casa-anochecer.webp", 18.0),
        ("IMG_5797.JPG", "casa-amanecer.webp", 20.0),
        ("7CE3DF3B-878A-4CBD-9946-DE0E9C21BE2B.PNG", "casa-dia.webp", 22.0),
        ("32C7BA67-A658-413E-828A-B56F88D7D9BF.PNG", "casa-barro-oscuro.webp", 11.0),
        ("36A4F1E5-6F85-4815-AE18-246A50B64F7D.PNG", "casa-barro.webp", 11.0),
    ]
    for origen, destino, umbral in pares:
        recortar(BASE / "originales" / origen, BASE / "recortadas" / destino,
                 umbral, abrir="barro" not in destino)
