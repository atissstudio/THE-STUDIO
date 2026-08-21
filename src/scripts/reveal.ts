/*
  Revelado de texto al hacer scroll (referencia: visualidentity.studio).

  Cada palabra entra atenuada y ligeramente por debajo, y se va aclarando y
  subiendo a su sitio conforme el bloque sube por la pantalla. Las palabras no
  van todas a la vez: cada una arranca un poco después que la anterior, que es
  lo que hace que el párrafo "se escriba" en vez de encenderse de golpe.

  Se parte por palabras, no por letras: partir por letras rompe la selección de
  texto, el copiar y pegar y los lectores de pantalla en textos largos.

  Nunca deja texto oculto. Si algo falla, o el navegador pide menos movimiento,
  el texto se queda visible y ya está.
*/

const SELECTOR = "[data-reveal] h2, [data-reveal] p, [data-reveal] .k";

function partirEnPalabras(el: HTMLElement) {
  // Solo se parte texto plano. Si el elemento lleva marcado dentro
  // (<span class="em">, <b>, enlaces...), se revela entero, sin trocear.
  const soloTexto = Array.from(el.childNodes).every((n) => n.nodeType === Node.TEXT_NODE);
  if (!soloTexto) {
    el.classList.add("rv-bloque");
    return 1;
  }

  const palabras = (el.textContent ?? "").split(/(\s+)/);
  const frag = document.createDocumentFragment();
  let n = 0;

  for (const trozo of palabras) {
    if (/^\s+$/.test(trozo)) {
      frag.appendChild(document.createTextNode(trozo));
      continue;
    }
    if (!trozo) continue;
    const span = document.createElement("span");
    span.className = "rv-w";
    span.style.setProperty("--i", String(n++));
    span.textContent = trozo;
    frag.appendChild(span);
  }

  el.textContent = "";
  el.appendChild(frag);
  return n;
}

/*
  Agrupa cada bloque de lectura en "tramos" de una pantalla (solo móvil).

  Un tramo es una unidad de lectura: el enunciado corto con su titular van
  juntos, y después cada párrafo va solo. Lo hace el JS porque el marcado de
  .read es una lista plana de hermanos (.k, h2, p, p, p) compartida por muchas
  páginas, y agrupar hermanos no se puede solo con CSS sin tocar todas.

  Si esto no llega a ejecutarse, no se rompe nada: sin .rv-panel el texto
  se queda en flujo normal, que es exactamente como se ve en escritorio.
*/
function agruparEnTramos(read: HTMLElement) {
  const hijos = Array.from(read.children) as HTMLElement[];
  if (!hijos.length) return;

  let tramo: HTMLElement | null = null;
  const abrir = () => {
    tramo = document.createElement("div");
    tramo.className = "rv-panel";
    read.appendChild(tramo);
    return tramo;
  };

  for (const hijo of hijos) {
    // El gráfico de la diapositiva no es texto y no abre tramo: si lo hiciera,
    // en móvil se llevaría una pantalla entera para él solo (y encima está
    // oculto ahí, así que sería una pantalla en blanco).
    if (hijo.dataset.art !== undefined) continue;
    /*
      Dos cosas no abren tramo propio, porque solas no llenan una pantalla y
      dejarían un hueco que se lee como un fallo: el titular, que se queda con
      el enunciado que lo precede, y la llamada a la acción, que se queda con
      el texto al que pertenece.
    */
    const continua = tramo && (hijo.tagName === "H2" || hijo.classList.contains("read-cta"));
    if (!continua) abrir();
    tramo!.appendChild(hijo);
  }
}

/*
  Cuánto ocupa de verdad el contenido de un tramo: del borde de arriba del
  primer hijo al borde de abajo del último. No vale medir el tramo, que mide
  una pantalla entera por definición.

  ⚠️ Se mide ANTES de que `prepararBarrido` ponga las clases de paso, porque
  esas clases traen `transform` y `getBoundingClientRect` sobre un elemento
  transformado devuelve la caja ya movida y escalada, no la real.
*/
function altoContenido(tramo: HTMLElement): number {
  let min = Infinity;
  let max = -Infinity;
  for (const hijo of Array.from(tramo.children) as HTMLElement[]) {
    const caja = hijo.getBoundingClientRect();
    if (caja.height < 1) continue;
    min = Math.min(min, caja.top);
    max = Math.max(max, caja.bottom);
  }
  return max > min ? max - min : 0;
}

/*
  ⚠️ EL TROCEO SE MIDE, NO SE CUENTA (2026-08-21).

  Antes la regla era fija —el enunciado con su titular, y después cada párrafo
  solo— y producía justo el fallo que Alejandro veía en el iPhone: pantallas
  vacías. Medido en la home a 390x844, las ocho paradas de lectura estaban
  llenas al 31% de media (una al 15%), o sea dos tercios de campo vacío en
  ocho pantallas seguidas. Un párrafo mide 150-300 px y la pantalla 845: solo
  no la llena nunca.

  Bajar el número de párrafos por tramo o subir el cuerpo de la letra habrían
  sido parches: con un texto más corto o un teléfono más alto vuelve el hueco.
  La causa es que nadie estaba mirando cuánto ocupa el texto. Así que ahora un
  tramo admite párrafos MIENTRAS QUEPAN, y solo abre uno nuevo cuando el
  siguiente ya no entra. No hay ningún número que ajustar y se adapta solo a
  cualquier texto, cualquier pantalla y cualquier página del sitio.

  El sitio disponible se lee del propio tramo (su alto menos su relleno), no de
  una constante: el relleno ES el aire de diseño. La holgura evita que la
  última línea acabe pegada al filo.

  ⚠️ SE MIDE CUANDO EL TEXTO YA TIENE SU FORMA DEFINITIVA, y por eso esta
  función se llama DESPUÉS de `partirEnPalabras` y ANTES de `prepararBarrido`.
  Partir en palabras envuelve cada una en un <span>, y eso mueve dónde caen los
  saltos de línea: midiendo antes, un tramo daba por bueno un párrafo que luego
  crecía y el panel acababa midiendo 908 px en una pantalla de 845, o sea
  asomando 63 px de la parada siguiente. Y `prepararBarrido` trae `transform`,
  que falsea cualquier medida. Medir algo que todavía va a cambiar no vale.
*/
const HOLGURA = 0.94;

function fusionarTramos(read: HTMLElement) {
  const tramos = (Array.from(read.children) as HTMLElement[]).filter((e) =>
    e.classList.contains("rv-panel"),
  );
  if (tramos.length < 2) return;

  const cs = getComputedStyle(tramos[0]);
  /*
    Un tramo mide una pantalla por definición (`min-height`), así que su alto de
    partida ES la pantalla. Si después de meterle un párrafo CRECE por encima de
    esa cifra, es que no cabía: no hay que calcular márgenes ni interlineados,
    lo dice el propio navegador. Esta es la prueba que manda.
  */
  const base = tramos[0].getBoundingClientRect().height;
  /*
    Y esta es la del aire: el contenido tiene que dejar holgura contra el filo,
    o la última línea acaba pegada al borde de la pantalla aunque técnicamente
    quepa. El sitio disponible sale del propio tramo (alto menos relleno), no de
    una constante inventada: el relleno ES el aire de diseño.
  */
  const util =
    (base -
      parseFloat(cs.paddingTop || "0") -
      parseFloat(cs.paddingBottom || "0")) *
    HOLGURA;
  if (!(base > 0) || !(util > 0)) return;

  let actual = tramos[0];
  for (let i = 1; i < tramos.length; i++) {
    const siguiente = tramos[i];
    const mudados = Array.from(siguiente.children) as HTMLElement[];
    mudados.forEach((hijo) => actual.appendChild(hijo));

    const cabe =
      actual.getBoundingClientRect().height <= base + 1 &&
      altoContenido(actual) <= util;

    if (!cabe) {
      // No cabía: se devuelve tal cual estaba y el tramo siguiente sigue vivo.
      mudados.forEach((hijo) => siguiente.appendChild(hijo));
      actual = siguiente;
    } else {
      siguiente.remove();
    }
  }
}

/*
  Barrido de pizarra (solo móvil). Cada tramo entra deslizándose de un lado, y
  al asentarse coloca el texto en un sitio distinto del anterior. La posición
  NO es aleatoria: va emparejada con la dirección del barrido, de modo que el
  texto siempre se detiene en el lado hacia el que venía viajando. Así el
  movimiento se lee como una pizarra que corre, y no como cuatro animaciones
  sueltas.

  Cuatro pasos, y vuelta a empezar:
    0 · entra por la derecha  → se queda abajo, a la izquierda
    1 · entra por la izquierda → se queda arriba, centrado
    2 · entra por la derecha  → se queda en el centro, a la izquierda
    3 · entra por la izquierda → se queda abajo, a la derecha
*/
function prepararBarrido(paneles: HTMLElement[]) {
  paneles.forEach((panel, n) => {
    const paso = n % 4;
    panel.classList.add(`rv-paso-${paso}`);
    // Los pasos impares llegan desde la izquierda; los pares, desde la derecha.
    panel.style.setProperty("--desde", paso % 2 === 0 ? "14vw" : "-14vw");
  });

  const mostrarTodos = () => paneles.forEach((p) => p.classList.add("rv-dentro"));

  if (!("IntersectionObserver" in window)) {
    mostrarTodos();
    return;
  }

  const io = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        // Se rearma al salir del todo, para que el barrido se repita al volver.
        if (e.isIntersecting) e.target.classList.add("rv-dentro");
        else if (e.intersectionRatio === 0) e.target.classList.remove("rv-dentro");
      });
    },
    { threshold: [0, 0.12] }
  );
  paneles.forEach((p) => io.observe(p));

  /*
    Redes de seguridad. El tramo parte invisible y es el observador quien lo
    enciende, así que si algo lo dejara mudo el texto no llegaría a verse
    nunca. A los 6 s se encienden todos pase lo que pase, y al imprimir
    también, donde no hay scroll que dispare nada.
  */
  setTimeout(mostrarTodos, 6000);
  addEventListener("beforeprint", mostrarTodos);
}

export function revelarTexto() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  /*
    Móvil y escritorio NO hacen lo mismo, a propósito:

    - En móvil el bloque se trocea párrafo a párrafo, porque en una pantalla
      de teléfono un bloque entero no cabe sin encoger la letra.
    - En escritorio el bloque marcado con `data-slides` es UNA diapositiva
      entera, con su enunciado, su titular y sus párrafos juntos. En una
      pantalla ancha sí cabe, y trocearlo convertía la web de escritorio en la
      de móvil: ocho pantallas para lo que son dos ideas.
  */
  const movil = matchMedia("(max-width: 900px)").matches;
  const lecturas = Array.from(
    document.querySelectorAll<HTMLElement>("[data-reveal] .read"),
  );
  if (movil) {
    lecturas.forEach(agruparEnTramos);
  } else {
    document
      .querySelectorAll<HTMLElement>("[data-slides] .read")
      .forEach((read) => read.classList.add("rv-panel"));
  }

  const bloques = document.querySelectorAll<HTMLElement>(SELECTOR);
  bloques.forEach((el) => partirEnPalabras(el));

  /*
    El orden importa y no es negociable: trocear · partir en palabras · MEDIR y
    juntar lo que quepa · animar. Ver el aviso de `fusionarTramos`.
  */
  if (movil) lecturas.forEach(fusionarTramos);

  prepararBarrido(Array.from(document.querySelectorAll<HTMLElement>(".rv-panel")));

  if (!bloques.length) return;

  const mostrar = (el: Element) => el.classList.add("rv-on");
  const apagar = (el: Element) => el.classList.remove("rv-on");

  if (!("IntersectionObserver" in window)) {
    bloques.forEach(mostrar);
    return;
  }

  /*
    Se rearma. Antes se dejaba de observar en cuanto se revelaba una vez, así
    que al volver a subir y bajar ya no pasaba nada. Ahora, cuando el bloque
    sale del todo de pantalla se vuelve a atenuar, y se reproduce cada vez.
  */
  /*
    En móvil el bloque se revela más adentro (cuando ya ha subido hasta el
    tercio inferior), no nada más asomar por el borde. Junto a la separación
    de casi un tercio de pantalla entre párrafos (tokens.css), es lo que hace
    que cada gesto de scroll traiga el párrafo siguiente ya animado, en vez de
    encenderlos todos de golpe al entrar la sección.
  */
  /*
    Dentro de una diapositiva se observa el PANEL, no cada elemento suelto. La
    diapositiva es una unidad y tiene que encenderse entera: observando
    elemento a elemento, lo que queda más abajo (la llamada a la acción, casi
    siempre) no entraba en el margen hasta un gesto de scroll más, y se
    encendía sola con el resto del bloque ya iluminado. La cascada entre
    palabras la sigue dando el retardo por índice, no el observador.
  */
  const enElPanel = (el: Element) =>
    (el as HTMLElement).classList.contains("rv-panel")
      ? Array.from(el.querySelectorAll<HTMLElement>(SELECTOR))
      : [el];

  const io = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((e) => {
        const objetivos = enElPanel(e.target);
        if (e.isIntersecting) objetivos.forEach(mostrar);
        else if (e.intersectionRatio === 0) objetivos.forEach(apagar);
      });
    },
    {
      threshold: [0, 0.2],
      /*
        Donde hay diapositivas (móvil siempre, escritorio en los bloques con
        `data-slides`) el margen es el grande: así el revelado palabra a
        palabra dispara justo cuando cae la diapositiva nueva, y no antes de
        que haya terminado de entrar.
      */
      rootMargin:
        movil || document.querySelector(".rv-panel")
          ? "0px 0px -28% 0px"
          : "0px 0px -8% 0px",
    }
  );

  // Un bloque suelto se observa él; uno que vive en una diapositiva delega en
  // ella, y la diapositiva se observa una sola vez aunque tenga cinco dentro.
  const paneles = new Set<HTMLElement>();
  bloques.forEach((el) => {
    const panel = el.closest<HTMLElement>(".rv-panel");
    if (panel) paneles.add(panel);
    else io.observe(el);
  });
  paneles.forEach((panel) => io.observe(panel));

  // Al imprimir o guardar como PDF no hay scroll: se enciende todo antes.
  addEventListener("beforeprint", () => bloques.forEach(mostrar));
}
