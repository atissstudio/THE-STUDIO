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
  const float RISCO   = 1.95; /* donde asoma el borde del acantilado */
  const float COSTA   = 3.05; /* donde el risco se hunde en el mar    */
  const float ARENA   = 4.20; /* donde el mar rompe en la arena       */
  const float PUEBLO  = 5.15; /* donde la arena da paso al pueblo     */

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

  /*
    ── LAS FORMAS ────────────────────────────────────────────────────────
    ⚠️ ESTA ES LA CORRECCIÓN DE FONDO (2026-08-21, tercera versión). Las dos
    versiones anteriores dividían el mundo en BANDAS HORIZONTALES: todo era
    función de la altura, así que por bien hechas que estuvieran las texturas,
    lo que se veía era piedra apilada sobre agua apilada sobre arena. Sin
    silueta no hay paisaje. Palabras de Alejandro: "cae sin un orden y no hay
    formas, solo texturas".

    Ahora cada frontera es una CURVA con dibujo propio, y de ellas sale la
    composición: el risco tiene cumbre y baja en diagonal hasta hundirse en el
    agua, y el agua encuentra la arena en una línea de costa, no en un corte.
  */

  /* El perfil del risco: una cumbre que manda, otra menor detrás, y el filo
     picado encima. Restar sube la roca, porque wy crece hacia abajo. */
  float perfilRisco(float x, float rel) {
    float cumbre = exp(-pow((x - 0.36 * rel) / 0.62, 2.0));
    float segunda = exp(-pow((x - 0.86 * rel) / 0.45, 2.0));
    float filo = cresta(vec2(x * 1.9, 5.3), 4) - 0.5;
    return RISCO - 1.35 * cumbre - 0.62 * segunda + 0.30 * filo;
  }

  /* La costa: una diagonal con una bahía. Es lo que ata el risco al mar. */
  float lineaCosta(float x, float rel) {
    return COSTA + 0.62 * (x / rel - 0.5) + 0.26 * sin(x * 1.7 + 1.2)
         + 0.10 * (fbm(vec2(x * 1.4, 8.1), 3) - 0.5);
  }

  /* La orilla: el arco de la playa, cóncavo al revés que la costa para que
     entre las dos quede una lengua de agua que se estrecha. */
  float lineaArena(float x, float rel) {
    return ARENA - 0.34 * (x / rel - 0.5) + 0.30 * sin(x * 1.3 + 0.4)
         + 0.08 * (fbm(vec2(x * 2.2, 3.4), 3) - 0.5);
  }

  float lineaPueblo(float x) {
    return PUEBLO + 0.20 * sin(x * 2.1 + 2.0);
  }

  void main() {
    vec2 uv = vUv;
    float rel = uMedida.x / uMedida.y;
    float t = uTiempo;

    /* La ventana: wy es la altura EN EL MUNDO del píxel. El paisaje está
       quieto; lo que se mueve es la mirada. */
    float wy = uViaje * (MUNDO - 1.0) + (1.0 - uv.y);
    float wx = uv.x * rel;
    vec2 w = vec2(wx, wy) + uDeriva * 0.25;

    /* Grosor del borde en unidades de mundo, para que las siluetas tengan el
       filo justo: ni escalonadas ni difuminadas. */
    float filoPx = 1.6 / uMedida.y;

    /* ══ EL CIELO ══════════════════════════════════════════════════════ */
    vec3 alto = C_AZUL * 0.70;
    vec3 bajo = mix(C_PANZA, C_NUBES, 0.55);
    vec3 cielo = mix(alto, bajo, clamp(wy / (RISCO + 0.6), 0.0, 1.0));

    float solX = 0.74 * rel;
    float solY = 0.34;
    float halo = exp(-pow(distance(vec2(wx, wy), vec2(solX, solY)) * 1.10, 1.5));
    cielo = mix(cielo, vec3(1.0, 0.985, 0.94), halo * 0.60);

    float nube = fbm(vec2(wx * 1.5 + t * 0.008, wy * 1.7), 5);
    float dondeNube = smoothstep(1.30, 0.55, wy) * smoothstep(0.05, 0.42, wy);
    cielo = mix(cielo, C_NUBES, smoothstep(0.50, 0.84, nube) * dondeNube * 0.9);

    vec3 color = cielo;

    /* ══ EL RISCO ══════════════════════════════════════════════════════ */
    float perfil = perfilRisco(wx, rel);
    float costa = lineaCosta(wx, rel);
    float arenaY = lineaArena(wx, rel);
    float puebloY = lineaPueblo(wx);

    float enRisco = smoothstep(perfil - filoPx, perfil + filoPx, wy);

    /* Coladas finas y desiguales, junta de columna, y vetas de tosca. */
    float estrato = fbm(vec2(wx * 0.9, wy * 7.5), 3);
    float pila = wy * 62.0 + fbm(vec2(wx * 0.7, wy * 1.1), 3) * 26.0;
    float capas = pow(sin(pila) * 0.5 + 0.5, 0.7);
    float columna = pow(cresta(vec2(wx * 16.0, wy * 0.35), 3), 7.0);
    float granoR = ruido(vec2(wx, wy) * 150.0, vec2(500.0));

    float caraRoca = 0.50 + estrato * 0.34 + capas * 0.34 - columna * 0.60
                   + (granoR - 0.5) * 0.26;
    vec3 roca = mix(C_BASALTO, C_PICON, smoothstep(0.25, 0.80, capas));
    roca *= 0.52 + caraRoca * 1.05;
    roca = mix(roca, C_TOSCA * 0.78,
      smoothstep(0.62, 0.92, estrato) * smoothstep(0.35, 0.75, capas) * 0.55);
    roca *= 1.0 + smoothstep(0.86, 1.0, capas) * 0.30;

    /*
      LA LUZ VIENE DEL SOL, y la cumbre la recibe primero. La franja pegada al
      perfil se abre y el fondo del risco se hunde: eso es lo que da volumen a
      una silueta en vez de dejarla como un recorte de papel.
    */
    roca *= 1.0 + 0.42 * smoothstep(perfil + 0.55, perfil, wy);
    roca *= 1.0 - 0.30 * smoothstep(costa - 1.2, costa, wy);
    /* La ladera que mira al sol, más clara que la contraria. */
    roca *= 1.0 + clamp((wx - 0.36 * rel) * sign(solX - 0.36 * rel) * 0.10, -0.16, 0.20);
    /* Bruma al pie, donde el risco se mete en el agua. */
    roca = mix(roca, bajo, smoothstep(costa - 0.85, costa, wy) * 0.42);

    color = mix(color, roca, enRisco);

    /* ══ EL MAR ════════════════════════════════════════════════════════
       Ocupa de la costa a la orilla. Las olas corren PARALELAS a la playa,
       no a la pantalla: por eso la fase se mide contra la línea de arena. */
    float enMar = smoothstep(costa - filoPx, costa + filoPx, wy);

    float haciaPlaya = clamp((wy - costa) / max(arenaY - costa, 0.001), 0.0, 1.0);
    float faseOla = (wy - arenaY) * mix(58.0, 24.0, haciaPlaya);
    float ond = ruido(w * 2.6 + vec2(t * 0.06, 0.0), vec2(24.0)) * 2.2;
    float ola = 0.0;
    ola += sin(faseOla + wx * 4.0 + t * 0.85 + ond) * 0.50;
    ola += sin(faseOla * 1.62 - wx * 9.0 - t * 0.66 + ond * 0.6) * 0.30;
    ola += sin(faseOla * 2.55 + wx * 16.0 + t * 1.25) * 0.15;
    ola *= mix(0.55, 1.30, haciaPlaya);

    float calma = smoothstep(0.35, 0.85, ruido(w * 1.2 + vec2(t * 0.03, 0.0), vec2(13.0)));
    float nAgua = clamp(0.5 + ola * 0.20
      + pow(max(ola * 0.5 + 0.5, 0.0), 9.0) * (0.10 + 0.40 * calma), 0.0, 1.0);

    vec3 agua = mix(C_MAR_HONDO, C_MAR_ORILL, haciaPlaya * 0.9);
    agua *= 0.72 + nAgua * 0.62;
    /* Sombra del risco sobre el agua que tiene al lado. */
    agua *= 1.0 - 0.34 * smoothstep(costa + 0.55, costa, wy);
    /* El camino del sol, apagándose hacia la playa: ese brillo se ve mirando
       a lo lejos, no a los pies. */
    float camino = exp(-pow(abs(wx - solX) / (0.07 + (wy - costa) * 0.16), 2.0));
    agua += vec3(1.0, 0.97, 0.90) * camino
          * pow(max(ola * 0.5 + 0.5, 0.0), 26.0) * 1.5 * (1.0 - haciaPlaya);
    /* Rompiente contra el pie del risco. */
    float choque = smoothstep(costa + 0.13, costa, wy) * smoothstep(costa - 0.05, costa + 0.02, wy);
    agua = mix(agua, C_CAL, choque
      * smoothstep(0.45, 0.80, fbm(vec2(wx * 20.0, wy * 40.0 + t * 0.5), 3)) * 0.85);

    color = mix(color, agua, enMar);

    /* ══ LA ARENA ══════════════════════════════════════════════════════
       Empieza donde muere el agua, y las dos se tocan en una rompiente que
       sigue la MISMA curva: es lo que las conecta en vez de apilarlas. */
    float enArena = smoothstep(arenaY - filoPx, arenaY + filoPx, wy);

    float grano = ruido(vec2(wx, wy) * 260.0, vec2(700.0));
    float manchas = fbm(vec2(wx * 4.0, wy * 5.0), 3);
    vec3 arena = mix(C_PICON, C_ARENA_N, smoothstep(0.25, 0.85, manchas));
    arena *= 0.80 + grano * 0.70;
    arena *= 1.0 + sin((wy - arenaY) * 70.0 + fbm(vec2(wx * 3.0, wy), 2) * 6.0) * 0.05;
    /* Arena mojada pegada a la orilla: más oscura y con brillo. */
    float mojada = smoothstep(0.34, 0.0, wy - arenaY);
    arena = mix(arena, arena * 0.52, mojada * 0.75);

    color = mix(color, arena, enArena);

    /* La lengua de espuma vive JUSTO en la línea, mitad en el agua y mitad en
       la arena. Se pinta después de las dos, encima de la costura. */
    float lengua = 1.0 - clamp(abs(wy - arenaY) * 7.0, 0.0, 1.0);
    float encaje = smoothstep(0.35, 0.80,
      fbm(vec2(wx * 9.0, (wy - arenaY) * 30.0 - t * 0.35), 3));
    color = mix(color, C_CAL, lengua * encaje * 0.85);

    /* ══ EL PUEBLO ═════════════════════════════════════════════════════ */
    float enPueblo = smoothstep(puebloY - filoPx, puebloY + filoPx, wy);
    vec3 tierra = mix(C_BARRO * 0.66, C_TOSCA * 0.74, fbm(vec2(wx * 5.0, wy * 6.0), 3));
    tierra *= 0.84 + grano * 0.34;

    /* Las casas se apoyan EN la línea del pueblo, así que suben y bajan con
       ella: un pueblo sigue el terreno, no una regla. */
    float col = floor(wx * 13.0);
    float altoCasa = 0.20 + azar(vec2(col, 4.2)) * 0.24;
    float suelo = lineaPueblo((col + 0.5) / 13.0);
    float techoY = suelo + 0.10;
    float baseY = techoY + altoCasa;
    float enCasa = step(techoY, wy) * step(wy, baseY);
    float cual = azar(vec2(col, 9.1));
    vec3 pared = cual < 0.55 ? C_CAL : (cual < 0.82 ? C_TOSCA : C_CAL * 0.93);
    pared *= 1.0 + (fbm(vec2(wx * 30.0, wy * 30.0), 3) - 0.5) * 0.16;
    pared = mix(pared, C_BARRO, step(wy, techoY + altoCasa * 0.20) * 0.92);
    pared = mix(pared, C_AZUL, step(baseY - altoCasa * 0.16, wy) * 0.80);
    tierra = mix(tierra, pared, enCasa);

    color = mix(color, tierra, enPueblo);

    vec2 c = (uv - 0.5) * vec2(1.06, 1.0);
    color *= 1.0 - dot(c, c) * 0.20;

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
