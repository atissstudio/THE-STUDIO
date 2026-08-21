/*
  ══ EL PAISAJE ═══════════════════════════════════════════════════════════════

  Un solo lienzo detrás de toda la página que pinta el paisaje entero, y una
  sola variable que lo gobierna: `--viaje`, de 0 a 1, que escribe el scroll.

  ⚠️ POR QUÉ ESTO VA DEBAJO Y PINTA, Y NO ENCIMA MODULANDO (la lección del
  2026-08-19, que aquí es la decisión de arquitectura entera). Una capa que va
  ENCIMA de la página solo puede ponerse DELANTE del color; nunca puede SER el
  color. Con un campo quieto da igual, pero en cuanto ese campo se desvanece la
  capa se queda pintando sobre lo que haya debajo. Un paisaje tiene que ser el
  fondo, así que va debajo de todo y lo pinta él.

  ⚠️ UN SOLO DUEÑO DEL GESTO. `--viaje` se calcula UNA VEZ por fotograma, aquí,
  y todo lo demás la lee. La home ya tenía cuatro mecánicas de scroll peleando
  por el mismo dedo (la entrada de la portada, la casa, el ajuste por
  diapositivas y las paradas por bloque); esto no añade una quinta.

  ⚠️ MEJORA PROGRESIVA, NO DEPENDENCIA. Si no hay WebGL, o el visitante pide
  menos movimiento, esto no arranca, la clase `paisaje-vivo` no se pone y el
  sitio se queda con sus campos de color planos de siempre. Es la red de
  seguridad que exige el proyecto: nada puede quedar invisible.

  LAS SEIS PARADAS, y qué material manda en cada una:
     0,00  mar abierto ....... mar hondo, cielo azul
     0,20  el archipiélago ... mar hondo, siluetas al fondo
     0,38  la montaña ........ basalto, crestas que suben
     0,58  la playa .......... picón y arena negra, espuma
     0,76  el pueblo ......... cal, tosca, barro, azul de barca
     0,92  la cumbre ......... mar de nubes, azul de altura
*/

export type OpcionesPaisaje = {
  /** Se llama una vez, tras el primer fotograma pintado de verdad. */
  alArrancar?: () => void;
  /** Progreso del viaje, 0 a 1. Se pregunta en cada fotograma. */
  viaje: () => number;
};

const vertex = `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

/*
  ⚠️ AQUÍ DENTRO NO SE PUEDEN ESCRIBIR COMILLAS INVERTIDAS, ni en los
  comentarios. El GLSL vive en una plantilla de JavaScript y una comilla
  invertida corta la cadena. Ya ha costado dos compilaciones fallidas.
*/
const fragment = `
  /*
    ⚠️ ESTO ES UN MUNDO VERTICAL, NO UNA CÁMARA QUE VIAJA (2026-08-21, segunda
    versión, y el cambio es de fondo).

    La primera versión morfeaba los materiales de un mismo cuadro según el
    scroll: el mar se convertía en arena, la arena en pueblo. Se veía como un
    telón que cambia de color detrás de la página, con opacidades raras, y no
    como un sitio. Alejandro lo cortó, y con razón.

    Ahora hay UN PAISAJE ENTERO, quieto, mucho más alto que la pantalla, y lo
    que se mueve es la ventana por la que se mira. De arriba abajo, en orden
    natural: cielo · riscos · mar · arena · pueblo. Bajar por la página es
    bajar por el acantilado hasta la orilla. Las texturas se muestrean en
    coordenadas DEL MUNDO, no de la pantalla, así que la misma roca sigue
    siendo la misma roca mientras se baja: eso es lo que lo hace un lugar.

    ⚠️ highp no es opcional: el tiempo se acumula y entra en la función de
    azar. Con media precisión, a los minutos el ruido deja de ser ruido.
  */
  precision highp float;
  varying vec2 vUv;

  uniform float uTiempo;
  uniform float uViaje;
  uniform vec2 uMedida;
  uniform vec2 uDeriva;

  /* Materiales del catálogo aprobado. Ver design/paisaje/materiales.html */
  const vec3 C_AZUL      = vec3(0.200, 0.294, 0.643);
  const vec3 C_MAR_HONDO = vec3(0.133, 0.216, 0.435);
  const vec3 C_MAR_ORILL = vec3(0.431, 0.541, 0.816);
  const vec3 C_PICON     = vec3(0.118, 0.118, 0.133);
  const vec3 C_BASALTO   = vec3(0.231, 0.247, 0.271);
  const vec3 C_TOSCA     = vec3(0.788, 0.663, 0.420);
  const vec3 C_BARRO     = vec3(0.627, 0.353, 0.235);
  const vec3 C_CAL       = vec3(0.957, 0.949, 0.929);
  const vec3 C_ARENA_N   = vec3(0.220, 0.208, 0.184);
  const vec3 C_PANZA     = vec3(0.776, 0.788, 0.812);
  const vec3 C_NUBES     = vec3(0.933, 0.945, 0.969);

  /*
    El mundo mide seis pantallas de alto. Las fronteras van en estas mismas
    unidades, así que se leen como lo que son: dónde acaba el cielo y empieza
    el risco, dónde muere el risco en el agua.
  */
  const float MUNDO   = 6.0;
  const float RISCO   = 1.15; /* donde asoma el borde del acantilado */
  const float ORILLA  = 2.75; /* donde el risco se hunde en el mar    */
  const float ARENA   = 4.05; /* donde el mar rompe en la arena       */
  const float PUEBLO  = 5.10; /* donde la arena da paso al pueblo     */

  float azar(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  /* Ruido en mosaico: se da la vuelta antes de trocear, así lo que llega al
     azar vive siempre en un rango pequeño por larga que sea la sesión. */
  float ruido(vec2 p, vec2 per) {
    p = mod(p, per);
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    vec2 a = mod(i, per);
    vec2 b = mod(i + 1.0, per);
    return mix(
      mix(azar(a), azar(vec2(b.x, a.y)), u.x),
      mix(azar(vec2(a.x, b.y)), azar(b), u.x),
      u.y
    );
  }

  float fbm(vec2 p, int oct) {
    float s = 0.0, a = 0.5, f = 1.0, norma = 0.0;
    for (int i = 0; i < 6; i++) {
      if (i >= oct) break;
      s += a * ruido(p * f, vec2(64.0) * f);
      norma += a;
      f *= 2.0;
      a *= 0.5;
    }
    return s / max(norma, 0.0001);
  }

  /* Cresta afilada: con esto se dibuja una montaña, no una loma. */
  float cresta(vec2 p, int oct) {
    float s = 0.0, a = 0.5, f = 1.0, norma = 0.0;
    for (int i = 0; i < 6; i++) {
      if (i >= oct) break;
      float n = ruido(p * f, vec2(64.0) * f);
      s += a * (1.0 - abs(2.0 * n - 1.0));
      norma += a;
      f *= 2.0;
      a *= 0.5;
    }
    return s / max(norma, 0.0001);
  }

  void main() {
    vec2 uv = vUv;
    float rel = uMedida.x / uMedida.y;
    float t = uTiempo;

    /*
      LA VENTANA. wy es la altura EN EL MUNDO del píxel que se está pintando:
      0 arriba del todo (cielo alto), MUNDO abajo del todo (el pueblo). Como
      todas las texturas se muestrean con wy, el paisaje está quieto y lo que
      se mueve es la mirada.
    */
    float wy = uViaje * (MUNDO - 1.0) + (1.0 - uv.y);
    float wx = uv.x * rel;
    vec2 w = vec2(wx, wy) + uDeriva * 0.25;

    /* ══ EL CIELO ══════════════════════════════════════════════════════ */
    vec3 alto = C_AZUL * 0.72;              /* el azul profundo de la altura */
    vec3 bajo = mix(C_PANZA, C_NUBES, 0.5); /* la calima cerca del horizonte */
    vec3 cielo = mix(alto, bajo, clamp(wy / RISCO, 0.0, 1.0));

    /* El sol, alto y a la derecha. No se dibuja el disco: se dibuja lo que hace. */
    float solX = 0.68 * rel;
    float solY = 0.30;
    float halo = exp(-pow(distance(vec2(wx, wy), vec2(solX, solY)) * 1.15, 1.5));
    cielo = mix(cielo, vec3(1.0, 0.985, 0.94), halo * 0.62);

    /* Nubes: grandes, lentas, sin ningún borde duro. Solo viven en el cielo. */
    float nube = fbm(vec2(wx * 1.6 + t * 0.008, wy * 1.9), 5);
    float dondeNube = smoothstep(0.95, 0.35, wy) * smoothstep(0.02, 0.30, wy);
    cielo = mix(cielo, C_NUBES, smoothstep(0.50, 0.84, nube) * dondeNube * 0.85);

    vec3 color = cielo;

    /* ══ LOS RISCOS ════════════════════════════════════════════════════
       Un acantilado visto de frente, que empieza arriba con su borde contra
       el cielo y baja hasta hundirse en el agua. Los riscos canarios se
       reconocen por sus ESTRATOS horizontales de colada, así que eso es lo
       que se dibuja: capas, no una mancha de ruido. */
    float borde = RISCO + 0.30 * (cresta(vec2(wx * 0.85, 3.1), 4) - 0.5);
    float enRisco = smoothstep(borde - 0.012, borde + 0.012, wy);

    /*
      ⚠️ ESTRATOS FINOS Y DESIGUALES, MÁS JUNTA VERTICAL. Con capas gruesas y
      de grosor constante el acantilado se leía como tela ondulada, no como
      piedra. Un risco canario es una pila de COLADAS finas, cada una de un
      grosor distinto, y encima el basalto se parte en columnas verticales. Las
      dos cosas juntas son lo que lo hace reconocible.
    */
    float estrato = fbm(vec2(wx * 0.9, wy * 7.5), 3);
    /* El grosor de cada colada varía: la fase se deforma con ruido lento. */
    float pila = wy * 62.0 + fbm(vec2(wx * 0.7, wy * 1.1), 3) * 26.0;
    float capas = sin(pila) * 0.5 + 0.5;
    capas = pow(capas, 0.7);
    /* Junta de columna: grietas verticales, finas y oscuras. */
    float columna = pow(cresta(vec2(wx * 16.0, wy * 0.35), 3), 7.0);
    float grietaV = pow(cresta(vec2(wx * 5.5, wy * 1.6), 4), 4.0);
    float granoR = ruido(vec2(wx, wy) * 150.0, vec2(500.0));

    float caraRoca = 0.50 + estrato * 0.34 + capas * 0.34 - grietaV * 0.70
                   - columna * 0.60 + (granoR - 0.5) * 0.26;
    vec3 roca = mix(C_BASALTO, C_PICON, smoothstep(0.25, 0.80, capas));
    roca *= 0.52 + caraRoca * 1.05;
    /* Vetas de tosca: la piedra amarilla asoma entre coladas, a bandas. */
    float veta = smoothstep(0.62, 0.92, estrato) * smoothstep(0.35, 0.75, capas);
    roca = mix(roca, C_TOSCA * 0.78, veta * 0.55);
    /* El canto de cada colada recoge la luz: es lo que da el relieve de pila. */
    roca *= 1.0 + smoothstep(0.86, 1.0, capas) * 0.30;
    /* La luz cae desde el sol: la parte alta del risco y las aristas se abren. */
    float vecino = fbm(vec2(wx * 0.9 + 0.03, wy * 7.5 - 0.02), 3);
    roca *= 1.0 + clamp((vecino - estrato) * 5.0, -0.26, 0.32);
    roca *= 1.0 + 0.30 * smoothstep(borde + 0.35, borde, wy);
    /* Bruma en el pie del acantilado, donde se junta con el agua. */
    roca = mix(roca, bajo, smoothstep(ORILLA - 0.75, ORILLA, wy) * 0.45);

    color = mix(color, roca, enRisco);

    /* ══ EL MAR ════════════════════════════════════════════════════════
       Visto desde arriba del risco: bandas de oleaje que se abren según se
       alejan del pie del acantilado y llegan a la orilla. */
    float enMar = smoothstep(ORILLA - 0.05, ORILLA + 0.05, wy);

    float ond = ruido(w * 2.6 + vec2(t * 0.06, 0.0), vec2(24.0)) * 2.2;
    float abre = smoothstep(ORILLA, ARENA, wy); /* cerca de la orilla la ola crece */
    float ola = 0.0;
    ola += sin(wy * mix(60.0, 26.0, abre) + wx * 5.0 + t * 0.85 + ond) * 0.50;
    ola += sin(wy * mix(97.0, 44.0, abre) - wx * 11.0 - t * 0.66 + ond * 0.6) * 0.30;
    ola += sin(wy * mix(150.0, 78.0, abre) + wx * 19.0 + t * 1.25) * 0.15;
    ola *= mix(0.55, 1.25, abre);

    float calma = smoothstep(0.35, 0.85, ruido(w * 1.2 + vec2(t * 0.03, 0.0), vec2(13.0)));
    float destello = pow(max(ola * 0.5 + 0.5, 0.0), 9.0);
    float nAgua = clamp(0.5 + ola * 0.20 + destello * (0.10 + 0.40 * calma), 0.0, 1.0);

    vec3 agua = mix(C_MAR_HONDO, C_MAR_ORILL, smoothstep(ORILLA, ARENA, wy) * 0.85);
    agua *= 0.72 + nAgua * 0.62;
    /* El camino del sol, que es lo que convierte un azul rayado en agua. */
    /*
      ⚠️ EL DESTELLO SE APAGA HACIA LA ORILLA. Cerca de la playa la ola es
      grande y lenta, así que un exponente alto sobre una ola ancha no daba
      chispas: daba PASTILLAS blancas gordas, que se leen como un defecto de
      lente. Además es lo correcto: el camino del sol se ve mirando hacia el
      sol, a lo lejos, no a los pies. Se estrecha y se apaga al bajar.
    */
    float lejosDelSol = smoothstep(ARENA, ORILLA, wy);
    float camino = exp(-pow(abs(wx - solX) / (0.07 + (wy - ORILLA) * 0.16), 2.0));
    agua += vec3(1.0, 0.97, 0.90) * camino * pow(max(ola * 0.5 + 0.5, 0.0), 26.0)
          * 1.5 * lejosDelSol;
    /* Espuma contra el pie del risco. */
    float rompiente = smoothstep(ORILLA + 0.16, ORILLA, wy) * smoothstep(ORILLA - 0.10, ORILLA + 0.02, wy);
    agua = mix(agua, C_CAL, rompiente * smoothstep(0.45, 0.80, fbm(vec2(wx * 20.0, wy * 40.0 + t * 0.5), 3)) * 0.9);

    color = mix(color, agua, enMar);

    /* ══ LA ARENA ══════════════════════════════════════════════════════
       Picón y arena negra, con el grano A LA ESCALA DEL GRANO. Es la regla
       que salió de bajar cuatro veces la opacidad sin arreglar nada. */
    float enArena = smoothstep(ARENA - 0.10, ARENA + 0.06, wy);

    float grano = ruido(vec2(wx, wy) * 260.0, vec2(700.0));
    float manchas = fbm(vec2(wx * 4.0, wy * 5.0), 3);
    vec3 arena = mix(C_PICON, C_ARENA_N, smoothstep(0.25, 0.85, manchas));
    arena *= 0.80 + grano * 0.70;
    /* Rizos de viento y restos de marea, paralelos a la orilla. */
    arena *= 1.0 + sin(wy * 90.0 + fbm(vec2(wx * 3.0, wy), 2) * 6.0) * 0.05;
    /* La lengua de agua que sube por la arena, y su espuma. */
    float lengua = smoothstep(ARENA + 0.30, ARENA, wy);
    arena = mix(arena, arena * 0.55, lengua * 0.7);
    arena = mix(arena, C_CAL, smoothstep(0.55, 0.85, fbm(vec2(wx * 26.0, wy * 46.0 - t * 0.4), 3)) * lengua * 0.55);

    color = mix(color, arena, enArena);

    /* ══ EL PUEBLO ═════════════════════════════════════════════════════
       Tierra apisonada, y contra ella la fila de casas: cal y tosca con
       tejado de barro y zócalo de azul de barca. */
    float enPueblo = smoothstep(PUEBLO - 0.03, PUEBLO + 0.03, wy);
    vec3 tierra = mix(C_BARRO * 0.66, C_TOSCA * 0.74, fbm(vec2(wx * 5.0, wy * 6.0), 3));
    tierra *= 0.84 + grano * 0.34;

    float col = floor(wx * 14.0);
    float altoCasa = 0.22 + azar(vec2(col, 4.2)) * 0.26;
    float techoY = PUEBLO + 0.16;
    float baseY = techoY + altoCasa;
    float enCasa = step(techoY, wy) * step(wy, baseY);
    float cual = azar(vec2(col, 9.1));
    vec3 pared = cual < 0.55 ? C_CAL : (cual < 0.82 ? C_TOSCA : C_CAL * 0.93);
    pared *= 1.0 + (fbm(vec2(wx * 30.0, wy * 30.0), 3) - 0.5) * 0.16;
    pared = mix(pared, C_BARRO, step(wy, techoY + altoCasa * 0.20) * 0.92);
    pared = mix(pared, C_AZUL, step(baseY - altoCasa * 0.16, wy) * 0.80);
    tierra = mix(tierra, pared, enCasa);

    color = mix(color, tierra, enPueblo);

    /*
      ⚠️ NADA DE LAVAR EL CUADRO ENTERO. La primera versión aplastaba todo
      contra su gris medio para "proteger el texto", y eso es justo lo que se
      veía como una opacidad rara detrás de la página. El texto se protege
      donde vive el texto —con la cal, que es el único material liso—, no
      apagando el paisaje.
    */
    vec2 c = (uv - 0.5) * vec2(1.06, 1.0);
    color *= 1.0 - dot(c, c) * 0.22;

    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
  }
`;

export function crearPaisaje(lienzo: HTMLCanvasElement, opciones: OpcionesPaisaje) {
  const quiereQuieto = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hayWebGL = (() => {
    try {
      return !!document.createElement("canvas").getContext("webgl");
    } catch {
      return false;
    }
  })();
  if (quiereQuieto || !hayWebGL) return;

  const arrancar = async () => {
    const { Renderer, Program, Mesh, Triangle, Vec2 } = await import("ogl");

    const renderer = new Renderer({
      canvas: lienzo,
      alpha: false,
      // La mitad de píxeles se ve igual en un ruido suave y cuesta la cuarta parte.
      dpr: Math.min(devicePixelRatio, 1.5),
    });
    const gl = renderer.gl;

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTiempo: { value: 0 },
        uViaje: { value: 0 },
        uMedida: { value: new Vec2(1, 1) },
        uDeriva: { value: new Vec2(0, 0) },
      },
    });
    const malla = new Mesh(gl, { geometry: new Triangle(gl), program });

    /*
      ⚠️ NO SE MIDE EL LIENZO. OGL le escribe `style.width/height` al cambiar de
      tamaño, así que desde el primer fotograma el elemento mide lo que OGL le
      puso y no lo que dice su CSS. Se mide la ventana, que es su hueco.
    */
    let anchoPrev = 0;
    let altoPrev = 0;
    const medir = () => {
      const ancho = innerWidth;
      const alto = innerHeight;
      if (ancho !== anchoPrev || alto !== altoPrev) {
        anchoPrev = ancho;
        altoPrev = alto;
        renderer.setSize(ancho, alto);
        program.uniforms.uMedida.value.set(ancho, alto);
      }
    };

    // La marea sigue al puntero, con retardo: el salto seco se vería artificial.
    const destino = { x: 0.5, y: 0.5 };
    const actual = { x: 0.5, y: 0.5 };
    addEventListener(
      "pointermove",
      (e) => {
        destino.x = e.clientX / innerWidth;
        destino.y = 1 - e.clientY / innerHeight;
      },
      { passive: true }
    );

    let vivo = true;
    document.addEventListener("visibilitychange", () => {
      vivo = !document.hidden;
      if (vivo) requestAnimationFrame(bucle);
    });

    /*
      ⚠️ EL RECORRIDO SE ACUMULA AQUÍ, fotograma a fotograma. Calcularlo dentro
      del shader como "dirección × tiempo" recalcula también el pasado, así que
      el paisaje entero DA UN SALTO cada vez que se mueve el ratón. Y el signo
      va invertido a propósito: el shader muestrea en q + deriva, así que para
      que el agua vaya HACIA el cursor la deriva tiene que ir al contrario.
    */
    const CORRIENTE_BASE = { x: 0.01, y: 0.004 };
    const CORRIENTE_RATON = 0.04;
    const deriva = { x: 0, y: 0 };
    const marea = { x: 0, y: 0 };
    // El viaje se persigue con retardo para que un salto de scroll no dé un tirón.
    let viajeSuave = opciones.viaje();
    const t0 = performance.now();
    let tPrev = t0;
    let primero = true;

    function bucle(ahora: number) {
      if (!vivo) return;
      // Con tope: al volver de segundo plano el salto sería de varios segundos.
      const dt = Math.min((ahora - tPrev) / 1000, 0.05);
      tPrev = ahora;

      actual.x += (destino.x - actual.x) * 0.06;
      actual.y += (destino.y - actual.y) * 0.06;
      const rel = innerWidth / innerHeight;
      const ox = (actual.x - 0.5) * rel;
      const oy = (actual.y - 0.5) * 0.8;
      const largo = Math.hypot(ox, oy);
      const fuerza = Math.min(1, largo / 0.35);
      const dirX = largo > 0.0001 ? (ox / largo) * fuerza : 0;
      const dirY = largo > 0.0001 ? (oy / largo) * fuerza : 0;
      const error = Math.min(1, Math.hypot(dirX - marea.x, dirY - marea.y));
      const giro = 1 - Math.exp(-dt / (1.15 - 0.9 * error));
      marea.x += (dirX - marea.x) * giro;
      marea.y += (dirY - marea.y) * giro;
      deriva.x += (CORRIENTE_BASE.x - marea.x * CORRIENTE_RATON) * dt;
      deriva.y += (CORRIENTE_BASE.y - marea.y * CORRIENTE_RATON) * dt;

      const objetivo = opciones.viaje();
      viajeSuave += (objetivo - viajeSuave) * Math.min(1, dt * 7.5);

      medir();
      program.uniforms.uDeriva.value.set(deriva.x, deriva.y);
      program.uniforms.uViaje.value = viajeSuave;
      program.uniforms.uTiempo.value = (ahora - t0) / 1000;
      renderer.render({ scene: malla });

      if (primero) {
        primero = false;
        opciones.alArrancar?.();
      }
      requestAnimationFrame(bucle);
    }

    medir();
    requestAnimationFrame(bucle);
  };

  if ("requestIdleCallback" in window) {
    (window as any).requestIdleCallback(arrancar, { timeout: 2500 });
  } else {
    addEventListener("load", () => setTimeout(arrancar, 400));
  }
}
