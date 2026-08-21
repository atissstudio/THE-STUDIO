/*
  ══ LA PLATA LÍQUIDA ═════════════════════════════════════════════════════════

  El campo de plata del sitio, pintado por WebGL como METAL FUNDIDO: una colada
  que se derrite y baja despacio, con sus vetas y su brillo.

  ⚠️ POR QUÉ NO VALÍA LO QUE HABÍA. La plata líquida se hacía con tres manchas
  redondas con desenfoque de 40 px moviéndose en bucle (`.reel-liquid`). Una
  mancha difuminada no tiene ni veta ni superficie: da niebla, y por eso el
  campo de la casa se leía como un gris sucio con un halo claro en medio, no
  como un metal.

  ⚠️ Y POR QUÉ ESTO PINTA EN VEZ DE IR ENCIMA. Es la lección del 2026-08-19 con
  el mar, convertida en norma: una capa que va sobre la página puede ponerse
  DELANTE de un color, pero nunca SER ese color, así que en cuanto el campo se
  desvanece o cambia, la textura se queda flotando sobre lo que haya debajo.
  Aquí el lienzo pinta él la plata, con la colada dentro: campo y textura son un
  mismo objeto y no hay nada que sincronizar.

  Cómo se dibuja, y por qué así:

    · DEFORMACIÓN DE DOMINIO (domain warping). Es la técnica establecida para
      fluidos viscosos, mármol y lava: en vez de dibujar ruido, se usa un ruido
      para torcer las coordenadas de otro, dos veces. Lo que sale no son
      manchas, son lenguas que se estiran y se pliegan, que es justo el gesto
      de una colada.

    · ESCALA DE MATERIAL, NO DE PANTALLA. La regla que costó cuatro pasadas con
      el mar: la celda es grande, de tamaño de colada. Un grano fino sobre un
      campo se lee como suciedad en el cristal, no como textura.

    · SE DERRITE HACIA ABAJO. El dominio se arrastra hacia arriba con el tiempo,
      así que el dibujo cae. Muy despacio: es un campo de fondo detrás de texto,
      no un salvapantallas.

  ⚠️ UN SOLO LIENZO PARA TODOS LOS CAMPOS, NO UNO POR CAMPO. Hay siete campos
  de plata clara en el sitio, y un lienzo por sección serían siete contextos
  WebGL en una misma página: los navegadores limitan cuántos permiten y cada
  uno cuesta batería. Así que este lienzo va fijo a la ventana y se le pregunta
  en cada fotograma DÓNDE hay plata ahora mismo. Es el mismo modelo de zonas
  que ya usa `mar.ts`, por el mismo motivo.

  Cada zona lleva su TONO y su FUERZA, porque no todos los campos quieren lo
  mismo: el campo de la casa es plata media y admite una colada marcada; los
  campos claros llevan párrafos encima y la colada tiene que ser más suave, o
  compite con el texto que hay que leer.

  Sin WebGL o con "menos movimiento" no arranca, y el campo se queda con su
  plata plana de CSS. Es mejora progresiva, no dependencia.
*/

/** Un campo de plata, en píxeles CSS relativos al lienzo (0,0 arriba izquierda). */
export type ZonaPlata = {
  top: number;
  bottom: number;
  left: number;
  right: number;
  /**
   * Cuánto se separa la colada de su plata base, de 0 a 1. El campo de la casa
   * va fuerte; los campos de lectura, suaves.
   */
  fuerza: number;
  /** La plata base de este campo, en 0-1. */
  base: [number, number, number];
};

export type OpcionesPlata = {
  /**
   * Cuánto mide el lienzo, en píxeles CSS.
   *
   * ⚠️ NO VALE MEDIR EL PROPIO LIENZO: OGL le escribe `style.width/height` al
   * cambiar de tamaño, así que a partir del primer fotograma el elemento mide
   * lo que OGL le puso y no lo que dice su CSS. Se mide el hueco que ocupa.
   */
  medida?: () => { ancho: number; alto: number };
  /** Dónde hay plata AHORA MISMO. Se pregunta en cada fotograma. */
  zonas: () => ZonaPlata[];
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
  ⚠️ NI UNA COMILLA INVERTIDA AHÍ DENTRO, tampoco en los comentarios: el GLSL
  vive en una plantilla de JavaScript y una comilla invertida corta la cadena.
  Ya ha costado varias compilaciones rotas, y por eso existe el guardián
  scripts/revisar-shader.mjs. Y GLSL no iza declaraciones: todo se declara
  antes de usarse o el shader no compila, la página se ve sin efecto y no avisa
  nadie.
*/
const fragment = `
  precision highp float;
  varying vec2 vUv;
  uniform float uTiempo;
  uniform vec2 uMedida;
  uniform vec3 uOscuro;
  uniform vec3 uMedio;
  uniform vec3 uClaro;
  uniform vec4 uZonas[8];
  uniform vec3 uBase[8];
  uniform float uFuerza[8];
  uniform int uNumZonas;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float ruido(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      v += amp * ruido(p);
      p *= 2.03;
      amp *= 0.5;
    }
    return v;
  }

  void main() {
    /*
      ¿Cae este píxel dentro de algún campo de plata? Las zonas llegan en
      coordenadas de uv (y de abajo arriba). Si no cae en ninguna, el píxel se
      queda transparente y manda el CSS de debajo: el lienzo NO pinta la
      página entera, solo los campos que le dicen.
    */
    vec3 base = vec3(0.0);
    float fuerza = 0.0;
    float dentro = 0.0;
    for (int i = 0; i < 8; i++) {
      if (i >= uNumZonas) break;
      vec4 z = uZonas[i];
      if (vUv.y <= z.x && vUv.y >= z.y && vUv.x >= z.z && vUv.x <= z.w) {
        base = uBase[i];
        fuerza = uFuerza[i];
        dentro = 1.0;
      }
    }
    if (dentro < 0.5) {
      gl_FragColor = vec4(0.0);
      return;
    }

    vec2 q = vUv;
    // Sin aplastar: la celda tiene que ser igual de ancha que de alta.
    q.x *= uMedida.x / max(uMedida.y, 1.0);

    // Celda de colada, no grano de ruido.
    vec2 p = q * 3.1;
    float t = uTiempo * 0.05;

    // La colada CAE: el dominio se arrastra hacia arriba.
    p.y -= t * 0.85;

    // Deformación de dominio, dos vueltas. Aquí es donde nacen las lenguas.
    vec2 a = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));
    vec2 b = vec2(
      fbm(p + 3.6 * a + vec2(1.7, 9.2) + t * 0.45),
      fbm(p + 3.6 * a + vec2(8.3, 2.8) - t * 0.38)
    );
    float n = fbm(p + 3.6 * b);

    // Tres tramos de plata: el fondo de la colada, la masa y la veta encendida.
    vec3 col = mix(uOscuro, uMedio, smoothstep(0.18, 0.60, n));
    col = mix(col, uClaro, smoothstep(0.58, 0.95, n));

    /*
      EL BRILLO DEL METAL. Donde la deformación se estira más es donde una
      superficie fundida devuelve la luz. Sin esto es una mancha de grises que
      se mueve; con esto tiene filo y parece líquido.
    */
    float brillo = pow(clamp(length(b) - 0.52, 0.0, 1.0), 1.35);
    col += uClaro * brillo * 0.42;

    /*
      Y AQUÍ MANDA LA FUERZA DE LA ZONA. La colada se mezcla con la plata base
      del campo: a fuerza 1 se ve entera, a fuerza baja apenas se separa de su
      color. Es lo que permite que el campo de la casa lleve vetas marcadas y
      los campos de lectura solo un temblor, con un único shader.
    */
    col = mix(base, clamp(col, 0.0, 1.0), fuerza);

    gl_FragColor = vec4(col, 1.0);
  }
`;

export function crearPlata(lienzo: HTMLCanvasElement, opciones: OpcionesPlata) {
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
      // Transparente: fuera de las zonas de plata el lienzo no pinta nada.
      alpha: true,
      // Para una colada suave, la mitad de píxeles se ve igual y cuesta la
      // cuarta parte.
      dpr: Math.min(devicePixelRatio, 1.5),
    });
    const gl = renderer.gl;

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTiempo: { value: 0 },
        uMedida: { value: new Vec2(1, 1) },
        // Los tres tonos de la plata del sistema. Ninguno es nuevo.
        uOscuro: { value: new Vec3(0.478, 0.51, 0.561) },
        uMedio: { value: new Vec3(0.682, 0.71, 0.761) },
        uClaro: { value: new Vec3(0.957, 0.965, 0.98) },
        uZonas: { value: new Array(MAX_ZONAS * 4).fill(0) },
        uBase: { value: new Array(MAX_ZONAS * 3).fill(0) },
        uFuerza: { value: new Array(MAX_ZONAS).fill(0) },
        uNumZonas: { value: 0 },
      },
    });

    const malla = new Mesh(gl, { geometry: new Triangle(gl), program });

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
    const baseBuffer = program.uniforms.uBase.value as number[];
    const fuerzaBuffer = program.uniforms.uFuerza.value as number[];

    const cargarZonas = (ancho: number, alto: number) => {
      const zonas = opciones.zonas();
      let n = 0;
      for (const z of zonas) {
        if (n >= MAX_ZONAS) break;
        // Fuera de pantalla o sin altura: no gasta una plaza de las ocho.
        if (z.bottom <= 0 || z.top >= alto || z.bottom <= z.top) continue;
        if (z.fuerza <= 0.004) continue;
        // Coordenadas del shader: y de abajo (0) a arriba (1), como uv.
        zonasBuffer[n * 4] = 1 - z.top / alto;
        zonasBuffer[n * 4 + 1] = 1 - z.bottom / alto;
        zonasBuffer[n * 4 + 2] = z.left / ancho;
        zonasBuffer[n * 4 + 3] = z.right / ancho;
        baseBuffer[n * 3] = z.base[0];
        baseBuffer[n * 3 + 1] = z.base[1];
        baseBuffer[n * 3 + 2] = z.base[2];
        fuerzaBuffer[n] = z.fuerza;
        n++;
      }
      program.uniforms.uNumZonas.value = n;
    };

    let vivo = true;
    document.addEventListener("visibilitychange", () => {
      // Pestaña oculta: se para. No se gasta batería en un fondo que nadie ve.
      vivo = !document.hidden;
      if (vivo) requestAnimationFrame(bucle);
    });

    /*
      ⚠️ SI SE PIERDE EL CONTEXTO, EL CAMPO RECUPERA SU PLATA. Mientras el
      lienzo pinta, el campo no pinta nada. Un móvil con poca memoria puede
      tirar el contexto WebGL, y sin esto quedaría un hueco. Es la misma
      familia de reglas que las redes de seguridad de las animaciones: ningún
      fallo puede dejar el contenido sin fondo.
    */
    lienzo.addEventListener("webglcontextlost", (e) => {
      e.preventDefault();
      vivo = false;
      document.documentElement.classList.remove("plata-viva");
    });
    lienzo.addEventListener("webglcontextrestored", () => {
      vivo = true;
      document.documentElement.classList.add("plata-viva");
      requestAnimationFrame(bucle);
    });

    const t0 = performance.now();
    let primero = true;

    function bucle(ahora: number) {
      if (!vivo) return;
      const { ancho, alto } = medir();
      cargarZonas(ancho, alto);
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
