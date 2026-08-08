/*
  Entradas animadas compartidas (2026-08-06).

  Vive aparte porque lo usan varias páginas —la home, /servicios y /casos— y
  tenerlo repetido en cada `<script>` era pedir que se fueran separando con el
  tiempo. Aquí GSAP se registra una sola vez y las páginas solo dicen QUÉ
  animar, no cómo.

  GSAP entra como dependencia del proyecto, nunca desde un CDN ajeno: así no se
  añade una conexión a un tercero y nada depende de que el servidor de otro
  esté vivo.

  Todo lo de aquí comprueba `prefers-reduced-motion` y, si el visitante pidió
  menos movimiento, no hace nada. Importante: en ese caso el contenido tiene
  que quedar bien igualmente, así que ninguna de estas funciones esconde nada
  desde el CSS — parten de lo que ya está visible y correcto en el HTML.
*/
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const quieto = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

/*
  Una lista que entra escalonada, no de golpe. El escalón es corto a propósito:
  con siete filas, un retardo largo obliga a esperar a que termine el desfile
  para leer la última, y eso irrita más de lo que aporta.
*/
export function escalonar(selector: string, opciones: { desde?: number; escalon?: number } = {}) {
  if (quieto()) return;
  const piezas = gsap.utils.toArray<HTMLElement>(selector);
  if (!piezas.length) return;

  const entrada = gsap.from(piezas, {
    scrollTrigger: { trigger: piezas[0], start: "top 88%", once: true },
    y: opciones.desde ?? 26,
    opacity: 0,
    duration: 0.65,
    ease: "power2.out",
    stagger: opciones.escalon ?? 0.06,
  });

  /*
    Red de seguridad, la misma que reveal.ts. `gsap.from` deja las piezas en
    opacidad cero desde el primer momento y es el observador quien las
    enciende: si algo lo dejara mudo, la lista no se vería NUNCA — y en
    /servicios eso son las siete filas del catálogo. A los 6 s se enciende
    pase lo que pase, y al imprimir también, que ahí no hay scroll.
  */
  const encender = () => {
    if (entrada.progress() === 0) entrada.progress(1);
  };
  setTimeout(encender, 6000);
  addEventListener("beforeprint", encender);
}

/*
  Cifras que cuentan hasta su valor. "Demostrar, no prometer", en movimiento.

  El valor final ya está escrito en el HTML y no se toca hasta que la animación
  arranca: sin JavaScript, o con movimiento reducido, la cifra se lee correcta
  en vez de quedarse en cero. Acepta prefijo y sufijo (80%, x21, 30%).
*/
export function contarCifras(selector: string) {
  if (quieto()) return;
  gsap.utils.toArray<HTMLElement>(selector).forEach((el) => {
    const partes = (el.textContent ?? "").trim().match(/^(\D*)(\d+)(\D*)$/);
    if (!partes) return;
    const [, antes, digitos, despues] = partes;
    const destino = Number(digitos);
    const cuenta = { v: 0 };

    const bueno = `${antes}${destino}${despues}`;

    const subida = gsap.to(cuenta, {
      v: destino,
      duration: 1.1,
      ease: "power2.out",
      scrollTrigger: { trigger: el, start: "top 88%", once: true },
      onUpdate: () => {
        el.textContent = `${antes}${Math.round(cuenta.v)}${despues}`;
      },
      // Se reescribe al acabar: redondear cada fotograma podría dejar la cifra
      // a uno del valor bueno, y aquí el número es el argumento de venta.
      onComplete: () => {
        el.textContent = bueno;
      },
    });

    /*
      Red de seguridad, y aquí es más grave que en una entrada escalonada.

      La cuenta empieza escribiendo un cero en el elemento. Si la animación se
      queda a medias —pestaña en segundo plano, navegador ahorrando batería,
      cualquier cosa que congele los fotogramas— el visitante se queda viendo
      un "0%" que es sencillamente FALSO, y encima en la página que sostiene el
      "no hablamos por hablar". Comprobado el 2026-08-06: en un navegador que
      no avanzaba fotogramas, dos cifras de /casos se quedaron en "0%".

      Una cifra equivocada es mucho peor que una cifra sin animar, así que a
      los 6 s se pone el valor bueno pase lo que pase.
    */
    const rendirse = () => {
      if (!subida.progress || subida.progress() < 1) el.textContent = bueno;
    };
    setTimeout(rendirse, 6000);
    addEventListener("beforeprint", rendirse);
    // Al volver a una pestaña que estuvo en segundo plano, corregir enseguida.
    addEventListener("visibilitychange", () => {
      if (!document.hidden) rendirse();
    });
  });
}
