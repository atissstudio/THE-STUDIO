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
  if (movil) {
    document.querySelectorAll<HTMLElement>("[data-reveal] .read").forEach(agruparEnTramos);
  } else {
    document
      .querySelectorAll<HTMLElement>("[data-slides] .read")
      .forEach((read) => read.classList.add("rv-panel"));
  }
  prepararBarrido(Array.from(document.querySelectorAll<HTMLElement>(".rv-panel")));

  const bloques = document.querySelectorAll<HTMLElement>(SELECTOR);
  if (!bloques.length) return;

  bloques.forEach((el) => partirEnPalabras(el));

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
