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
    highp y no es opcional: el tiempo y la deriva se ACUMULAN mientras la
    pestaña esté abierta, y entran multiplicados en la función de azar. Con
    media precisión, a los pocos minutos el ruido deja de ser ruido y se
    convierte en manchones. Es el mismo fallo que ya se corrigió en el mar.
  */
  precision highp float;
  varying vec2 vUv;

  uniform float uTiempo;
  uniform float uViaje;
  uniform vec2 uMedida;
  uniform vec2 uDeriva;

  /* ── Los materiales del catálogo aprobado ─────────────────────────── */
  const vec3 C_AZUL      = vec3(0.200, 0.294, 0.643); /* azul de barca  #334BA4 */
  const vec3 C_MAR_HONDO = vec3(0.133, 0.216, 0.435); /* mar hondo      #22376F */
  const vec3 C_MAR_ORILL = vec3(0.431, 0.541, 0.816); /* mar de orilla  #6E8AD0 */
  const vec3 C_PICON     = vec3(0.118, 0.118, 0.133); /* picon          #1E1E22 */
  const vec3 C_BASALTO   = vec3(0.231, 0.247, 0.271); /* basalto        #3B3F45 */
  const vec3 C_TOSCA     = vec3(0.788, 0.663, 0.420); /* tosca          #C9A96B */
  const vec3 C_BARRO     = vec3(0.627, 0.353, 0.235); /* barro y teja   #A05A3C */
  const vec3 C_CAL       = vec3(0.957, 0.949, 0.929); /* cal            #F4F2ED */
  const vec3 C_ARENA_N   = vec3(0.220, 0.208, 0.184); /* arena negra    #38352F */
  const vec3 C_PANZA     = vec3(0.776, 0.788, 0.812); /* panza de burro #C6C9CF */
  const vec3 C_NUBES     = vec3(0.933, 0.945, 0.969); /* mar de nubes   #EEF1F7 */

  float azar(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  /*
    Ruido de valor en mosaico. Se da la vuelta ANTES de trocear en celda y
    resto para que lo que llega al azar viva siempre en un rango pequeño,
    dure lo que dure la sesión. El período va sobrado, la repetición no se ve.
  */
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

  /* Cresta afilada: es el ruido con el que se dibuja una montaña, no una loma. */
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

  /* Ventana suave: 1 dentro del tramo, 0 fuera, con los bordes fundidos. */
  float tramo(float v, float desde, float hasta, float pluma) {
    return smoothstep(desde - pluma, desde + pluma, v) *
           (1.0 - smoothstep(hasta - pluma, hasta + pluma, v));
  }

  void main() {
    vec2 uv = vUv;                 /* y: 0 abajo, 1 arriba */
    float rel = uMedida.x / uMedida.y;
    vec2 p = vec2(uv.x * rel, uv.y);
    float t = uTiempo;
    float V = uViaje;

    /* ══ 1 · EL CIELO ══════════════════════════════════════════════════
       Cambia de material con el viaje: azul de altura en el mar, panza de
       burro al subir por la montaña, y arriba del todo el azul limpio que
       hay por encima de las nubes. */
    vec3 cielo = C_AZUL;
    cielo = mix(cielo, C_PANZA, tramo(V, 0.34, 0.80, 0.16) * 0.72);
    cielo = mix(cielo, C_AZUL * 0.86, smoothstep(0.84, 1.0, V));
    /*
      EL SOL. No se dibuja el disco, se dibuja LO QUE HACE, que es lo que el ojo
      reconoce: el cielo se abre cerca de él, el agua devuelve un camino de
      destellos, y la roca tiene un lado iluminado. Sin una dirección de luz
      común a las tres cosas, el paisaje se lee como un dibujo plano por muy
      buena que sea cada textura.
    */
    float solX = mix(0.62, 0.34, smoothstep(0.0, 1.0, V)) * rel;
    float solY = mix(0.78, 0.52, smoothstep(0.0, 1.0, V));

    /* Degradado propio del cielo: más claro cerca del horizonte, siempre. */
    cielo = mix(cielo * 1.18, cielo * 0.82, smoothstep(0.25, 1.0, uv.y));
    /* Halo: el aire alrededor del sol se lava, no se ilumina de golpe. */
    float halo = exp(-pow(distance(vec2(p.x, uv.y), vec2(solX, solY)) * 1.35, 1.6));
    cielo = mix(cielo, vec3(1.0, 0.985, 0.94), halo * 0.55);

    /* Nubes de verdad, lentas y grandes, sin ningún borde duro. */
    float nube = fbm(p * 1.7 + vec2(t * 0.010, -t * 0.004) + uDeriva * 0.35, 5);
    float cuantaNube = 0.30 + 0.55 * tramo(V, 0.30, 0.86, 0.20);
    cielo = mix(cielo, C_NUBES, smoothstep(0.52, 0.86, nube) * cuantaNube);

    vec3 color = cielo;

    /* ══ 2 · EL HORIZONTE ══════════════════════════════════════════════
       Baja según se sube: en el mar está alto, en la cumbre está por los
       pies. Es lo que da la sensación de estar ganando altura. */
    float horizonte = mix(0.56, 0.30, smoothstep(0.0, 0.92, V));

    /* ══ 3 · LA MONTAÑA DE ROCA ════════════════════════════════════════
       Dos filas de crestas a distinta distancia. La de detrás se lava contra
       el cielo (perspectiva aérea), que es lo que hace que se lea lejos.
       Entra desde el archipiélago y manda en la subida. */
    float hayMonte = smoothstep(0.12, 0.42, V) * (1.0 - smoothstep(0.80, 0.96, V));

    float perfilLejos = horizonte + 0.16 * hayMonte *
      (cresta(vec2(p.x * 0.9 + 3.7, 1.3) + uDeriva * 0.05, 4) - 0.18);
    float perfilCerca = horizonte + 0.24 * hayMonte *
      (cresta(vec2(p.x * 1.7 - 1.1, 7.9) + uDeriva * 0.09, 5) - 0.22);

    float enLejos = step(uv.y, perfilLejos) * hayMonte;
    float enCerca = step(uv.y, perfilCerca) * hayMonte;

    /* Roca: bloques grandes, fracturas EN SOMBRA (una grieta no da luz) y
       grano fino encima. Es la receta que se aprobó en el catálogo. */
    float bloque = fbm(p * 7.0, 3);
    float grieta = pow(cresta(p * 12.0, 3), 5.0);
    float granoR = ruido(p * 190.0, vec2(600.0));
    float superficie = 0.60 + bloque * 0.42 - grieta * 0.85 + (granoR - 0.5) * 0.30;
    vec3 roca = C_BASALTO * (1.0 + (superficie - 0.5) * 1.0);
    /*
      La ladera que MIRA AL SOL es la clara, y la contraria queda en sombra. Se
      aproxima con la pendiente del perfil: si el terreno sube hacia el sol, le
      da la luz. Es barato y es lo que hace que la montaña tenga volumen en vez
      de ser una mancha recortada.
    */
    float haciaSol = sign(solX - p.x);
    float pendiente = cresta(vec2((p.x + 0.02 * haciaSol) * 1.7 - 1.1, 7.9), 5) -
                      cresta(vec2(p.x * 1.7 - 1.1, 7.9), 5);
    roca *= 1.0 + clamp(pendiente * 9.0, -0.34, 0.42);
    roca *= 1.0 + 0.30 * smoothstep(perfilCerca - 0.10, perfilCerca, uv.y);

    vec3 rocaLejos = mix(roca * 1.06, cielo, 0.62); /* bruma de distancia */
    color = mix(color, rocaLejos, enLejos);
    color = mix(color, roca, enCerca);

    /* ══ 4 · EL PUEBLO ═════════════════════════════════════════════════
       Una fila de casas contra el horizonte. Cada columna saca su altura y
       su material del azar, así que no hay dos iguales: cal, tosca y barro,
       con el zócalo en azul de barca. */
    float hayPueblo = tramo(V, 0.66, 0.92, 0.09);
    float col = floor(p.x * 26.0);
    float alto = 0.045 + azar(vec2(col, 4.2)) * 0.075;
    float techo = horizonte + alto;
    float enCasa = step(uv.y, techo) * step(horizonte - 0.02, uv.y) * hayPueblo;

    float cual = azar(vec2(col, 9.1));
    vec3 pared = cual < 0.52 ? C_CAL : (cual < 0.80 ? C_TOSCA : C_CAL * 0.94);
    /* Enfoscado: manchado ancho y muy suave, la cal nunca es plana del todo. */
    pared *= 1.0 + (fbm(vec2(p.x * 22.0, uv.y * 60.0), 3) - 0.5) * 0.17;
    /* Zócalo azul de barca y teja de barro, que es lo que se ve de lejos. */
    float esZocalo = step(uv.y, horizonte + 0.016);
    float esTeja = step(techo - 0.014, uv.y);
    pared = mix(pared, C_AZUL, esZocalo * 0.85);
    pared = mix(pared, C_BARRO, esTeja * 0.9);
    color = mix(color, pared, enCasa);

    /* ══ 5 · EL SUELO ══════════════════════════════════════════════════
       De aquí abajo, lo que hay depende de por dónde vaya el viaje: agua al
       principio, arena en la playa, cal en el pueblo y nubes en la cumbre. */
    float enSuelo = 1.0 - step(horizonte, uv.y);

    /* Perspectiva: cerca del horizonte todo se aprieta y se aplana. */
    float lejania = smoothstep(0.0, horizonte, uv.y);
    float escala = mix(1.0, 4.2, lejania);
    float amplitud = mix(1.20, 0.35, lejania);

    /* — El agua. Tres trenes de olas con ruido dentro de la fase, que es lo
         que hace que la cresta ondule en vez de ser una raya. — */
    vec2 w = vec2(p.x, uv.y * escala) + uDeriva;
    float ond = ruido(w * 2.6 + vec2(t * 0.06, 0.0), vec2(24.0)) * 2.2;
    float ola = 0.0;
    ola += sin(w.y * 44.0 + w.x * 6.0 + t * 0.85 + ond) * 0.50;
    ola += sin(w.y * 77.0 - w.x * 12.0 - t * 0.66 + ond * 0.6) * 0.30;
    ola += sin(w.y * 128.0 + w.x * 21.0 + t * 1.25) * 0.15;
    ola *= amplitud;
    /*
      MAR CRUZADO. Con los tres trenes yendo en el mismo sentido la superficie
      se lee como una persiana. El mar de verdad lleva siempre al menos dos
      sistemas de olas cruzados, y basta con uno más, girado y más lento, para
      que se rompa la regularidad.
    */
    vec2 wc = vec2(w.x * 0.62 + w.y * 0.78, w.y * 0.62 - w.x * 0.78);
    float cruce = sin(wc.y * 31.0 + wc.x * 9.0 - t * 0.42 + ond * 0.5) * 0.34 * amplitud;
    ola += cruce;

    float calma = smoothstep(0.35, 0.85, ruido(w * 1.3 + vec2(t * 0.03, 0.0), vec2(13.0)));
    float destello = pow(max(ola * 0.5 + 0.5, 0.0), 9.0);
    float nAgua = clamp(0.5 + ola * 0.20 + destello * (0.10 + 0.40 * calma), 0.0, 1.0);

    /* El agua se aclara al acercarse a la orilla: el fondo devuelve la luz. */
    vec3 agua = mix(C_MAR_HONDO, C_MAR_ORILL, smoothstep(0.34, 0.0, uv.y) * smoothstep(0.30, 0.72, V));
    agua *= 0.72 + nAgua * 0.62;

    /*
      EL CAMINO DEL SOL. Una columna que baja del sol hasta el observador, y que
      se ABRE al acercarse (por eso es un triángulo y no una raya): cuanto más
      cerca, más inclinadas están las caras de las olas que pueden devolver el
      brillo. Es el detalle que hace que un plano azul pase a ser una superficie.
    */
    float anchoCamino = 0.035 + (horizonte - uv.y) * 0.55;
    float camino = exp(-pow(abs(p.x - solX) / max(anchoCamino, 0.001), 2.0));
    float chispa = pow(max(ola * 0.5 + 0.5, 0.0), 22.0);
    agua += vec3(1.0, 0.97, 0.90) * camino * chispa * 1.5;
    /* Y el agua lejana se lava contra el cielo, como todo lo que está lejos. */
    agua = mix(agua, cielo * 0.92, smoothstep(horizonte - 0.10, horizonte, uv.y) * 0.55);

    /* — La arena. Grano a la escala del GRANO, no a la de la pantalla: es la
         regla que salió de bajar cuatro veces la opacidad sin arreglar nada. — */
    float granoFino = ruido(vec2(p.x, uv.y * escala) * 420.0, vec2(900.0));
    float manchas = fbm(vec2(p.x, uv.y * escala) * 9.0, 3);
    vec3 arena = mix(C_PICON, C_ARENA_N, manchas);
    arena *= 0.74 + granoFino * 0.62;
    /* Rizos de viento, aplanados por la perspectiva. */
    arena *= 1.0 + sin(uv.y * escala * 90.0 + fbm(p * 4.0, 2) * 6.0) * 0.05 * amplitud;

    /* Dónde muere el agua y empieza la arena. La orilla sube con el viaje. */
    float orilla = mix(-0.30, 0.62, smoothstep(0.44, 0.76, V));
    float esArena = smoothstep(orilla - 0.05, orilla + 0.05, uv.y * -1.0 + horizonte);
    esArena = smoothstep(0.0, 1.0, clamp((orilla - uv.y) * 6.0, 0.0, 1.0));

    /* Espuma justo en la línea, que es lo que hace que se lea como playa. */
    float bordeEspuma = 1.0 - abs(uv.y - orilla) * 22.0;
    float espuma = clamp(bordeEspuma, 0.0, 1.0) *
      smoothstep(0.35, 0.75, fbm(vec2(p.x * 12.0, uv.y * 26.0 + t * 0.5), 3)) *
      smoothstep(0.40, 0.62, V) * (1.0 - smoothstep(0.78, 0.90, V));

    vec3 suelo = mix(agua, arena, esArena);
    suelo = mix(suelo, C_CAL, espuma * 0.85);

    /* — El suelo del pueblo: tierra apisonada y cal. — */
    vec3 tierra = mix(C_BARRO * 0.72, C_TOSCA * 0.80, fbm(vec2(p.x, uv.y * escala) * 7.0, 3));
    tierra *= 0.82 + granoFino * 0.36;
    suelo = mix(suelo, tierra, tramo(V, 0.70, 0.92, 0.08));

    /* — La cumbre: por debajo ya no hay suelo, hay mar de nubes. — */
    float algodon = fbm(p * 2.2 + vec2(t * 0.012, 0.0), 5);
    vec3 mardeNubes = mix(C_PANZA, C_NUBES, smoothstep(0.30, 0.78, algodon));
    suelo = mix(suelo, mardeNubes, smoothstep(0.86, 1.0, V));

    color = mix(color, suelo, enSuelo);

    /*
      ⚠️ EL FRENO QUE PROTEGE LA VENTA. Todo esto va DEBAJO del texto de la
      web, así que el paisaje se aparta: se lava contra su propio tono medio
      para que ninguna textura compita con una línea de lectura. Lo que se
      busca es un fondo con materia, no un cuadro. Si algún día se sube este
      número, hay que volver a medir el contraste de las 21 páginas.
    */
    vec3 medio = vec3(dot(color, vec3(0.2126, 0.7152, 0.0722)));
    color = mix(color, mix(medio, color, 0.86), 0.22);

    /*
      Viñeta de aire, no de fotografía: cierra un punto los bordes para que el
      centro de la pantalla —que es donde cae el texto— quede el sitio más
      tranquilo del cuadro.
    */
    vec2 c = (uv - 0.5) * vec2(1.06, 1.0);
    color *= 1.0 - dot(c, c) * 0.30;

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
