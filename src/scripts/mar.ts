/*
  ══ EL MAR ═══════════════════════════════════════════════════════════════════

  El dibujo del agua (olas, perspectiva, marea que sigue al puntero) vive aquí,
  en un solo sitio, y se monta sobre cualquier lienzo. Antes vivía dentro de
  `ShaderFondo.astro` y solo podía existir de una manera: una capa fija encima
  de toda la página, en fusión soft-light.

  ⚠️ POR QUÉ SE SACÓ DE AHÍ (2026-08-19, y es la raíz de un fallo que se
  parcheó tres veces sin arreglarlo). Una capa que va ENCIMA de la página solo
  puede estar DELANTE del azul; nunca puede ser PARTE del azul. Mientras el
  azul es un campo quieto da igual, el resultado es el mismo. Pero en la
  portada de la home el azul es un velo que se desvanece para destapar la casa,
  y ahí la mentira se ve: la capa de encima se mezcla con lo que haya debajo en
  ese momento —que ya es la plata de la casa—, así que el mar se quedaba
  pintando olas sobre la plata. Se intentó corregir bajándole el alfa al mismo
  ritmo que el velo (no bastó: soft-light no pierde presencia cuando el fondo
  se aclara) y después bajándoselo mucho antes (entonces la textura se iba
  mientras el campo todavía era azul, que es igual de falso).

  No tenía arreglo desde fuera, porque el fallo no era el número: era la
  arquitectura. Un mar que va sobre el azul tiene que **ser** el azul.

  De ahí los dos modos:

    · `pintar: false` (máscara, soft-light) — para los campos azules quietos
      del sitio. La capa va encima y solo modula lo que ya hay. Es lo de antes,
      sin cambios.

    · `pintar: true` (campo) — el lienzo NO modula un azul ajeno: pinta él el
      azul, con el mar ya dentro, y se compone en modo normal. Entonces el azul
      y su mar son un mismo objeto: si ese objeto se desvanece, se van los dos a
      la vez y en la misma proporción, sin cuentas que ajustar. Es lo que usa la
      portada.

  Frenos, a propósito (los de siempre):
    · No se carga nada si el visitante pide menos movimiento.
    · No se carga nada si el navegador no trae WebGL.
    · OGL se importa de forma diferida: no retrasa la primera vista. Se eligió
      OGL y no three.js por peso (cientos de KB frente a más de 20 MB).
    · Se detiene cuando la pestaña no está visible.
*/

/** Un rectángulo de mar, en píxeles CSS y RELATIVOS AL LIENZO (0,0 arriba a la izquierda). */
export type Zona = {
  top: number;
  bottom: number;
  left: number;
  right: number;
  /** Radio de esquina, en píxeles. 0 = caja de siempre. */
  radio?: number;
  /**
   * Cuánto mar lleva esta zona, de 0 a 1. En modo máscara es "cuánto de azul
   * es"; en modo campo es directamente la opacidad con la que se pinta.
   */
  alfa?: number;
};

export type OpcionesMar = {
  /** true = el lienzo pinta el azul con el mar dentro. false = solo modula (soft-light). */
  pintar?: boolean;
  /** El azul del campo, en 0-1. Solo se usa al pintar. */
  azul?: [number, number, number];
  /** Cuánto se nota el mar sobre su azul. Equivale a la opacidad de la capa. */
  fuerza?: number;
  /**
   * Cuánto mide el lienzo, en píxeles CSS.
   *
   * ⚠️ HAY QUE PASARLA CUANDO EL LIENZO NO ES LA VENTANA, y no vale medir el
   * propio lienzo: OGL escribe `style.width/height` en píxeles al cambiar de
   * tamaño, así que a partir del primer fotograma el elemento mide lo que OGL
   * le puso (300×150 de salida) y no lo que dice su CSS. Medirlo daba un mar
   * de 300 px estirado a toda la pantalla. Se mide el hueco que ocupa, no él.
   */
  medida?: () => { ancho: number; alto: number };
  /** Dónde hay mar AHORA MISMO. Se pregunta en cada fotograma. */
  zonas: () => Zona[];
  /** Se llama una vez, tras el primer fotograma pintado de verdad. */
  alArrancar?: () => void;
};

const MAX_ZONAS = 8;

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
  ⚠️ AQUÍ DENTRO NO SE PUEDEN ESCRIBIR COMILLAS INVERTIDAS. El GLSL vive en una
  plantilla de JavaScript y una comilla invertida, aunque sea en un comentario,
  corta la cadena. Ha costado dos compilaciones fallidas, una de ellas hoy.
*/
const fragment = `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTiempo;
  uniform vec2 uDeriva;
  uniform vec2 uMedida;
  uniform vec4 uZonas[8];
  uniform float uRadio[8];
  uniform float uAlfa[8];
  uniform int uNumZonas;
  uniform float uPintar;
  uniform vec3 uAzul;
  uniform float uFuerza;

  float azar(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float ruido(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(azar(i + vec2(0.0, 0.0)), azar(i + vec2(1.0, 0.0)), u.x),
      mix(azar(i + vec2(0.0, 1.0)), azar(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  /*
    La misma fórmula de soft-light que aplica el navegador en mix-blend-mode
    (la del estándar de composición). Se necesita escrita a mano para el modo
    campo: ahí el lienzo tiene que entregar el color YA mezclado, porque el
    navegador no va a mezclar nada, y el resultado debe ser idéntico al de los
    campos que sí usan la fusión del navegador. Si no fuese la misma fórmula,
    el azul de la portada y el de las demás secciones no casarían.
  */
  float suave1(float b, float s) {
    float d = (b <= 0.25) ? ((16.0 * b - 12.0) * b + 4.0) * b : sqrt(b);
    return (s <= 0.5)
      ? b - (1.0 - 2.0 * s) * b * (1.0 - b)
      : b + (2.0 * s - 1.0) * (d - b);
  }
  vec3 suave(vec3 b, float s) {
    return vec3(suave1(b.r, s), suave1(b.g, s), suave1(b.b, s));
  }

  void main() {
    vec2 uv = vUv;

    /*
      ¿Este píxel lleva mar, y cuánto? La zona es un RECTÁNGULO (arriba, abajo,
      izquierda, derecha) con radio opcional, no una banda de lado a lado:
      desde el 2026-08-11 los encabezados azules son tarjetas con campo claro
      alrededor, y con bandas el mar se derramaba sobre ese marco.

      "Dentro" no es un sí o un no: cuando dos zonas se solapan manda la mayor.
    */
    float dentro = 0.0;
    vec2 px = uv * uMedida;
    for (int i = 0; i < 8; i++) {
      if (i >= uNumZonas) continue;
      vec4 b = uZonas[i];
      /*
        En PÍXELES, no en uv: el radio de una esquina es circular en pantalla,
        y uv está normalizado distinto en cada eje, así que medido en uv una
        esquina redonda saldría ovalada. Fórmula corriente de caja redondeada
        por distancia. Radio 0 da exactamente la caja de siempre.
      */
      vec2 centro = vec2((b.z + b.w) * 0.5, (b.x + b.y) * 0.5) * uMedida;
      vec2 medio = vec2((b.w - b.z) * 0.5, (b.x - b.y) * 0.5) * uMedida;
      float r = min(uRadio[i], min(medio.x, medio.y));
      vec2 q2 = abs(px - centro) - medio + r;
      float dist = length(max(q2, 0.0)) + min(max(q2.x, q2.y), 0.0) - r;
      if (dist < 0.0) dentro = max(dentro, uAlfa[i]);
    }
    if (dentro < 0.004) {
      // Gris medio: en soft-light es el color que no toca nada, por si el
      // compositor llegara a tenerlo en cuenta con alfa 0.
      gl_FragColor = vec4(0.5, 0.5, 0.5, 0.0);
      return;
    }

    float rel = uMedida.x / uMedida.y;
    // El muestreo se estira en horizontal: el mar se ve en escorzo.
    vec2 p = vec2(uv.x * rel * 1.2, uv.y * 0.8);
    float t = uTiempo;

    vec2 q = p;

    /*
      ── El oleaje, que se mueve SIEMPRE ──────────────────────────────────
      Tres trenes de olas cruzados (senos con dirección, frecuencia y velocidad
      propias), que es como se representa el mar en tiempo real desde siempre,
      más ruido fino encima para el detalle. Van a distinta velocidad, así que
      el conjunto nunca repite el mismo dibujo.

      La deriva NO se calcula aquí, llega ya sumada desde el guion (uDeriva):
      es la única forma de que la marea gire sin dar un salto. Ver el bucle.
    */
    vec2 w = q + uDeriva;

    /*
      Dos aprendizajes de mirar capturas, el 2026-08-11:
      1 · La DIRECCIÓN manda más que la frecuencia. Con las crestas corriendo
          en vertical se leía como camuflaje. El mar visto de frente se
          reconoce por bandas HORIZONTALES, así que los senos varían sobre todo
          con y.
      2 · Un seno puro es demasiado regular para ser agua: se le suma ruido
          DENTRO de la fase (deformación del dominio) y la cresta ondula.

      Y la escala era el fallo de fondo: con frecuencias de 3 a 30 cabía una
      onda y media en toda la pantalla, así que solo podía leerse como manchas.
      Van de 46 a 132.

      PERSPECTIVA: la ola no puede medir lo mismo arriba que abajo. Arriba es
      lejos, se aprieta y se aplana; abajo es cerca, y se abre. Es lo que hace
      que se lea como superficie y no como papel pintado.
    */
    float lejos = smoothstep(0.05, 1.0, uv.y);
    float esc = mix(0.55, 3.4, lejos);
    float amp = mix(1.15, 0.45, lejos);

    float ond1 = ruido(w * 2.4 + vec2(t * 0.06, 0.0)) * 2.4 * mix(1.4, 0.5, lejos);
    float ond2 = ruido(w * 4.2 - vec2(0.0, t * 0.05)) * 1.9 * mix(1.4, 0.5, lejos);

    float y = w.y * esc;
    float mar = 0.0;
    mar += sin(y * 46.0 + w.x * 7.0 + t * 0.85 + ond1) * 0.50;
    mar += sin(y * 79.0 - w.x * 13.0 - t * 0.66 + ond2) * 0.30;
    mar += sin(y * 132.0 + w.x * 23.0 + t * 1.25) * 0.15;
    mar *= amp;

    // Detalle fino, viajando con la ola (si no, la superficie es plástico).
    float det = ruido(vec2(w.x, y) * 10.0 + vec2(-t * 0.22, t * 0.10)) * 0.62;
    det += ruido(vec2(w.x, y) * 26.0 + vec2(t * 0.31, -t * 0.18)) * 0.26;

    /*
      Zonas en calma. El brillo de cresta no puede repartirse por igual por toda
      la superficie: el mar tiene tramos encendidos y tramos tranquilos. Una
      mancha grande y muy lenta decide dónde brilla.
    */
    float calma = smoothstep(0.35, 0.85, ruido(w * 1.3 + vec2(t * 0.03, -t * 0.02)));

    float n = 0.5 + mar * 0.20 + (det - 0.44) * 0.24;

    /*
      Cresta: el lomo de la ola brilla mucho más que el resto, y es ese
      destello lo que hace que se lea como agua y no como mancha.
    */
    float cresta = pow(max(mar * 0.5 + 0.5, 0.0), 9.0);
    n += cresta * (0.10 + 0.40 * calma);

    // Contraste. El tope lo pone el texto que cae encima, no el gusto.
    n = clamp(0.5 + (n - 0.5) * 1.55, 0.0, 1.0);

    if (uPintar > 0.5) {
      /*
        MODO CAMPO: aquí no se modula nada ajeno, se entrega el azul con el mar
        ya dentro. El alfa es la opacidad del propio campo, así que cuando el
        campo se desvanece se lleva su mar con él. No hay forma de que la
        textura sobreviva a su azul, que era el fallo de raíz.
      */
      gl_FragColor = vec4(mix(uAzul, suave(uAzul, n), uFuerza), dentro);
      return;
    }

    // MODO MÁSCARA: el alfa lo pone la zona y la fusión la hace el navegador.
    gl_FragColor = vec4(vec3(n), dentro);
  }
`;

export function crearMar(lienzo: HTMLCanvasElement, opciones: OpcionesMar) {
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
    const { Renderer, Program, Mesh, Triangle, Vec2, Vec3 } = await import("ogl");

    const renderer = new Renderer({
      canvas: lienzo,
      alpha: true,
      // En pantallas muy densas no hace falta el doble de píxeles para un
      // ruido suave: la mitad se ve igual y cuesta la cuarta parte.
      dpr: Math.min(devicePixelRatio, 1.5),
    });
    const gl = renderer.gl;

    const azul = opciones.azul ?? [51 / 255, 75 / 255, 164 / 255];
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTiempo: { value: 0 },
        uDeriva: { value: new Vec2(0, 0) },
        uMedida: { value: new Vec2(1, 1) },
        uZonas: { value: new Array(MAX_ZONAS * 4).fill(0) },
        uRadio: { value: new Array(MAX_ZONAS).fill(0) },
        uAlfa: { value: new Array(MAX_ZONAS).fill(1) },
        uNumZonas: { value: 0 },
        uPintar: { value: opciones.pintar ? 1 : 0 },
        uAzul: { value: new Vec3(azul[0], azul[1], azul[2]) },
        uFuerza: { value: opciones.fuerza ?? 0.34 },
      },
    });

    const malla = new Mesh(gl, { geometry: new Triangle(gl), program });

    /*
      Se comprueba en cada fotograma, no solo al hacer `resize`: el lienzo de la
      portada vive dentro del bloque anclado y puede cambiar de alto sin que la
      ventana se mueva.
    */
    const medida = opciones.medida ?? (() => ({ ancho: innerWidth, alto: innerHeight }));
    let anchoPrevio = 0;
    let altoPrevio = 0;
    const medir = () => {
      const { ancho, alto } = medida();
      if (ancho === anchoPrevio && alto === altoPrevio) return { ancho, alto };
      anchoPrevio = ancho;
      altoPrevio = alto;
      renderer.setSize(ancho, alto);
      program.uniforms.uMedida.value.set(ancho, alto);
      return { ancho, alto };
    };

    const zonasBuffer = program.uniforms.uZonas.value as number[];
    const radioBuffer = program.uniforms.uRadio.value as number[];
    const alfaBuffer = program.uniforms.uAlfa.value as number[];

    const cargarZonas = (ancho: number, alto: number) => {
      const zonas = opciones.zonas();
      let n = 0;
      for (const z of zonas) {
        if (n >= MAX_ZONAS) break;
        const alfa = z.alfa ?? 1;
        if (alfa <= 0.004) continue;
        if (z.bottom <= 0 || z.top >= alto || z.bottom <= z.top) continue;
        // Coordenadas del shader: y de abajo (0) a arriba (1), como uv.
        zonasBuffer[n * 4] = 1 - z.top / alto;
        zonasBuffer[n * 4 + 1] = 1 - z.bottom / alto;
        zonasBuffer[n * 4 + 2] = z.left / ancho;
        zonasBuffer[n * 4 + 3] = z.right / ancho;
        radioBuffer[n] = z.radio ?? 0;
        alfaBuffer[n] = alfa;
        n++;
      }
      program.uniforms.uNumZonas.value = n;
    };

    // El puntero se persigue con retardo: el salto seco se vería artificial.
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
      // Pestaña oculta: se para. No tiene sentido gastar batería en un adorno.
      vivo = !document.hidden;
      if (vivo) requestAnimationFrame(bucle);
    });

    /*
      ── LA MAREA VA HACIA EL RATÓN (2026-08-11) ──────────────────────────

      No es un desplazamiento, es una CORRIENTE: el agua sigue yendo hacia el
      cursor todo el rato mientras esté ahí.

      ⚠️ El recorrido se ACUMULA aquí, fotograma a fotograma, en vez de
      calcularse dentro del shader como "dirección × tiempo". Esa fórmula, que
      es la primera que sale, recalcula también el pasado al cambiar de
      dirección, así que el mar entero DA UN SALTO cada vez que mueves el
      ratón. Acumulando, lo ya recorrido queda fijo.

      El giro es rápido y después se relaja: la constante de tiempo se
      interpola con el error de rumbo (unos 0,25 s cuando el rumbo nuevo está
      lejos, hasta ~1,15 s según se acerca), así que termina asentándose y no
      frenando en seco. Cerca del centro la fuerza se desvanece: ahí no hay
      dirección clara y el agua giraría sin motivo al cruzar el medio.
    */
    const CORRIENTE_BASE = { x: 0.01, y: 0.004 };
    // 0,055 contra los 0,010 del mar de fondo: se nota, que es lo que se pidió.
    const CORRIENTE_RATON = 0.055;
    const deriva = { x: 0, y: 0 };
    const marea = { x: 0, y: 0 };
    const t0 = performance.now();
    let tPrev = t0;
    let primero = true;

    function bucle(ahora: number) {
      if (!vivo) return;
      // Con tope: al volver de segundo plano el salto sería de varios segundos
      // y la marea recorrería media pantalla de golpe.
      const dt = Math.min((ahora - tPrev) / 1000, 0.05);
      tPrev = ahora;

      actual.x += (destino.x - actual.x) * 0.06;
      actual.y += (destino.y - actual.y) * 0.06;

      // Del centro de la ventana al puntero, en las unidades estiradas del shader.
      const rel = innerWidth / innerHeight;
      const ox = (actual.x - 0.5) * rel * 1.2;
      const oy = (actual.y - 0.5) * 0.8;
      const largo = Math.hypot(ox, oy);
      const fuerza = Math.min(1, largo / 0.35);
      const dirX = largo > 0.0001 ? (ox / largo) * fuerza : 0;
      const dirY = largo > 0.0001 ? (oy / largo) * fuerza : 0;

      const error = Math.min(1, Math.hypot(dirX - marea.x, dirY - marea.y));
      const constante = 1.15 - 0.9 * error;
      const giro = 1 - Math.exp(-dt / constante);
      marea.x += (dirX - marea.x) * giro;
      marea.y += (dirY - marea.y) * giro;

      /*
        ⚠️ SIGNO INVERTIDO, y no es un despiste. El shader muestrea en
        q + uDeriva, así que mover el muestreo hacia un lado hace que el dibujo
        se vea viajar hacia el CONTRARIO. Para que el agua vaya hacia el
        cursor, la deriva tiene que ir en dirección opuesta a él.
      */
      deriva.x += (CORRIENTE_BASE.x - marea.x * CORRIENTE_RATON) * dt;
      deriva.y += (CORRIENTE_BASE.y - marea.y * CORRIENTE_RATON) * dt;

      const { ancho, alto } = medir();
      cargarZonas(ancho, alto);
      program.uniforms.uDeriva.value.set(deriva.x, deriva.y);
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
