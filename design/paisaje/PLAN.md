# El paisaje canario — documento de proyecto

> Estado: **propuesta, sin ejecutar**. Nada de lo que hay aquí está escrito en el sitio todavía.
> Fecha: 2026-08-20. Autor: Claude, a partir del encargo de Alejandro.
> Antes de tocar una línea de código hace falta que Alejandro apruebe la §5 (arquitectura) y la §6 (recorrido).

---

## 1 · Qué se ha pedido

Literal, del encargo:

> «convertir la web en un paisaje y una experiencia animada, aprovechando lo que ya hay, el mar y
> los paisajes canarios, añadir montañas, arena, nubes, y maquetar la página de forma que al
> scrollear vayas navegando por el paisaje canario, sus colores, etc.»

Y, en el mismo encargo, un añadido de **copy** que cambia el mensaje, no solo el decorado:

> «añadir como claim que solucionamos problemas, y explicar que hacemos soluciones a medida de
> procesos, nos adaptamos a lo que haga falta y te ahorramos dinero»

Los dos van juntos y conviene leerlos juntos: **el paisaje es el vehículo, el claim es la carga**.
Un viaje por Canarias que no diga nada nuevo es decoración cara; un claim nuevo metido en la
maqueta de hoy se pierde entre otros seis bloques de texto. La oportunidad real es que el recorrido
del paisaje **sea** el argumento: se entra por el problema y se sale por la solución.

---

## 2 · Inventario: qué hay ya construido

Esto no es una lista de archivos, es una valoración de qué sirve para un paisaje y qué no.

### 2.1 · El mar — `src/scripts/mar.ts` (484 líneas) · **el activo más valioso**

Un shader de agua propio, hecho y depurado en tres vueltas. Lo que ya resuelve, y que **no habría
que volver a resolver**:

| Ya resuelto | Dónde |
|---|---|
| Tres trenes de olas con ruido en la fase (el agua ondula, no es un seno) | `fragment`, `mar +=` |
| **Perspectiva**: la ola se aprieta y se aplana arriba, se abre abajo | `lejos`, `esc`, `amp` |
| Destello de cresta con zonas encendidas y zonas en calma | `cresta`, `calma` |
| Marea que va hacia el puntero, con giro rápido que después se relaja | `CORRIENTE_RATON`, `marea` |
| Deriva acumulada fotograma a fotograma (si se calculara como dirección×tiempo, el mar **salta**) | `deriva` |
| Ruido en mosaico + `highp` para que no se degrade tras minutos abiertos | `ruido()`, nota de precisión |
| **Dos modos: modular un azul ajeno (soft-light) o pintar él el color** | `uPintar` |
| Zonas rectangulares con radio, medidas del DOM en cada fotograma | `Zona`, `cargarZonas` |
| Frenos: sin WebGL no arranca, con `prefers-reduced-motion` no arranca, se para con la pestaña oculta, OGL cargado en diferido | `crearMar` |

El punto clave para este proyecto es el modo `pintar: true`. Nació para arreglar un fallo concreto
de la portada, pero **es exactamente la arquitectura que pide un paisaje**: un lienzo que no adorna
lo que hay debajo, sino que **es** el fondo. Un paisaje que fuese una capa soft-light encima de la
página volvería a tener el mismo problema de raíz que ya se documentó el 2026-08-19.

**Se queda, y crece.** Es la base del escenario.

### 2.2 · Las ocho islas de plata — `public/plata/isla-0*.webp` + `SobreAtisHistoria.astro`

Ocho recortes en plata líquida, colocados en **su longitud y latitud reales**, con un zoom por isla
que termina en plata plana (para no ver el pixelado al ampliar 5,4×). Está medido: cero solapes,
nada cortado, en 1280 / 1440 / 375 / 390.

**Problema:** hoy el archipiélago vive **encerrado en una sola página** (`/sobre-atis`) y en la home
solo aparece como sello decorativo dentro de las tarjetas. Es el elemento gráfico vivo de la marca y
está guardado en un cajón.

**Se queda, y sale del cajón.** En un paisaje continuo, las islas son el horizonte, no una escena.

### 2.3 · La casa del negocio — `public/negocio/*.webp` + `.reel` en `HomeV5.astro`

Cinco fotogramas de una casa que se enciende (`casa-00-dark` → `casa-100-vivid`), sobre campo de
plata líquida, con la frase partida en dos. Es la mejor pieza narrativa que tiene el sitio: dice
"tu negocio ya vale" sin escribirlo.

⚠️ Está **medio scroll sin nada que contar**: la animación termina en y=1070 y el bloque sigue
hasta y=1790 (hallazgo abierto, ya documentado). En un paisaje, esos 720 px vacíos dejan de ser un
defecto y pasan a ser tránsito — pero solo si hay paisaje que atravesar.

**Se queda.** Es la parada "tu negocio" del viaje.

### 2.4 · El marco canario — `MarcoCanario.astro`

Idea y dibujo de Alejandro: el recercado pintado de una casa de pueblo marinero, con el dato que lo
sostiene (el azul de las fachadas es la pintura que sobraba de las barcas). Dos barras cortadas a
escuadra, hueco en medio, figura lisa que las rompe, muesca de cal alrededor.

**Se queda, y es la pieza que más se revaloriza.** Hoy hace de transición entre dos campos de color
planos. En un paisaje, es el elemento **construido** frente al elemento **natural**: la mano del
hombre sobre el terreno. Es lo que evita que el paisaje se lea como un salvapantallas.

### 2.5 · El sistema de campos de color v5 — `src/styles/tokens.css`

`.f-azul` / `.f-claro` / `.f-blanco` / `.f-navy` / `.f-plata`, rejilla de 12, tarjetas a sangre,
`.read`, `.cells`, `.datos`. Es la maquinaria de maquetación de las 21 páginas.

⚠️ **Y es lo que más choca con el encargo.** Un campo de color plano a sangre y un paisaje continuo
son dos ideas opuestas: el campo dice "aquí empieza otra cosa", el paisaje dice "esto no se ha
interrumpido". Ver §4.1.

### 2.6 · Motores de movimiento ya instalados

- **`reveal.ts`** — texto que entra palabra a palabra, con red de seguridad a los 6 s.
- **`entradas.ts`** — `escalonar()` (cascada) y `contarCifras()`.
- **GSAP 3.15** — instalado, con la regla vigente de **usarlo solo para lo nuevo**.
- **CSS `animation-timeline`** — ya en uso en `tokens.css`, con respaldo por `IntersectionObserver`.
- **`scroll-snap`** — cinco diapositivas obligatorias (`scroll-snap-stop: always`) de la casa hacia
  abajo, solo en escritorio.

### 2.7 · Lo que hay que mirar de frente antes de empezar

En la home conviven **cuatro** mecánicas de scroll distintas: la entrada de la portada (variable
`--intro` escrita a mano), la coreografía de la casa (cálculo propio con `innerHeight`), el
`scroll-snap` obligatorio de las cinco diapositivas, y las paradas por bloque de `.03`/`.04`.
Funcionan, están medidas, pero **son cuatro dueños del mismo gesto**. Meter un paisaje encima como
quinta mecánica es la forma más rápida de romper las cuatro. Ver §5.

---

## 3 · Diagnóstico: por qué la web de hoy no es un paisaje

No es falta de piezas, es falta de **continuidad**. Tres razones concretas:

1. **El color va a saltos, no a transiciones.** La página se divide en campos planos a sangre y cada
   sección cambia de color de golpe. Un paisaje no cambia de color, **el color deriva**: el azul del
   mar se aclara hacia la orilla, la arena se calienta al sol, el cielo se apaga al atardecer. De
   hecho ya se probó suavizar los saltos (`--fundido`, degradados entre campos) y **se retiró el
   2026-08-08** porque emborronaba las tarjetas. Ese intento fracasó porque era un parche entre dos
   campos; un paisaje continuo no tiene ese problema, porque no hay dos campos que unir.

2. **El mar está dentro de cajas, no en un horizonte.** Hoy el shader pregunta al DOM "¿dónde hay
   rectángulos azules?" y pinta olas ahí dentro. Es agua **recortada con la forma de la maquetación**.
   Un mar de verdad necesita una línea de horizonte y un punto de vista, y ninguno de los dos existe.

3. **Cada página es un mundo aparte.** El archipiélago está en `/sobre-atis`, la casa en la home, el
   marco marinero entre dos secciones de la home. No hay un "dónde estoy" compartido.

**Lo que sí está bien y no hay que tocar:** la legibilidad. Cuerpo en tinta casi negra con contraste
16,1, texto en bandera sin partir palabras, plata sólida sobre campo claro. Un paisaje que se coma
esto es un paisaje que hay que rehacer.

---

## 4 · Estado del arte (norma 18)

Lo que sigue viene de fuentes, no de tanteo. Se distingue lo que es práctica establecida de lo que
es decisión nuestra.

### 4.1 · Cómo se construyen hoy los recorridos por un paisaje

Hay tres familias, y no son intercambiables:

| Familia | Cómo funciona | Cuesta | Cuándo se usa |
|---|---|---|---|
| **Capas en parallax** | 3-5 capas (fondo, medio, frente) que se mueven a distinta velocidad con `transform: translateY` | Muy barato, corre en el compositor | Cuando el paisaje es **ilustración fija** y solo hay que darle profundidad |
| **Escena 3D con cámara** | Terreno real renderizado, cámara movida por el scroll | Caro (peso, GPU, tiempo) | Cuando lo importante es **moverse por dentro** del sitio |
| **Paisaje procedimental en un shader** | Un solo lienzo pinta cielo, montañas, agua y nubes con ruido; el scroll mueve parámetros | Un lienzo, coste fijo | Cuando el paisaje debe ser **continuo, vivo y ligero** |

La recomendación general del oficio en 2026 es empezar por lo barato: *"direct scroll with transform
is the clear winner for most projects — library-free, runs on the compositor thread"*
([Builder.io](https://www.builder.io/blog/parallax-scrolling-effect)). WebGL se reserva para cuando
aporta algo que las capas no pueden dar
([Utsubo](https://www.utsubo.com/blog/best-threejs-websites-2026)).

En terreno procedimental, la receta estándar es siempre la misma combinación de ruidos: *FBM* para
lomas, *ridged multifractal* para crestas afiladas, *domain warping* para que nada se lea regular, y
FBM de alta frecuencia para el detalle de superficie. **Nuestro shader del mar ya usa dos de las
cuatro** (ruido dentro de la fase = domain warping; ruido fino encima = detalle), así que no
partimos de cero: partimos de la mitad.

### 4.2 · Con qué se conduce el scroll, hoy

- **CSS scroll-driven animations** (`animation-timeline: scroll()` / `view()`): soporte global ~84%
  a mediados de 2026. Chrome/Edge desde 115 (julio 2023), **Safari 26 desde septiembre 2025** (con
  animaciones en hilo aparte desde 26.4 y precisión corregida en 26.5, junio 2026). **Firefox sigue
  detrás de bandera** en estable a fecha de Firefox 152 ([MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)).
  → **Conclusión para nosotros:** sirve para el adorno (una capa que se desplaza, una opacidad), con
  `@supports` y respaldo. **No sirve** como único conductor de una coreografía que, si falla, deja la
  página rota. Firefox no es opcional para un público de 45-60.
- **GSAP ScrollTrigger** sigue siendo la referencia para secuencias complejas. Ya está instalado.
- La regla de rendimiento no ha cambiado: **solo `transform` y `opacity`**, nada que provoque
  recálculo de maquetación.

### 4.3 · Los frenos que impone el oficio, y que aquí pesan doble

- `prefers-reduced-motion` es **requisito WCAG 2.1**, no cortesía. Ya lo respetamos en el mar; el
  paisaje entero tendrá que respetarlo igual, y eso significa que **debe existir una versión quieta
  y bonita**, no una versión rota.
- *"Si una animación no ayuda al usuario a entender dónde está o qué acaba de pasar, es un coste sin
  retorno"* ([Metabole](https://metabole.studio/en/blog/scrollytelling)). Esta frase es, palabra por
  palabra, la regla que ya escribimos el 2026-08-08 ("la animación explica lo que dice el texto, no
  decora"). Coincide con nosotros: buena señal.
- Una página pesada de scrollytelling hunde el LCP y castiga al móvil de gama media.

### 4.4 · La contradicción con INV-09, por tercera vez

INV-09 concluyó que, para el dueño de negocio de 45-60 años, el espectáculo tipo WebGL **resta**
credibilidad y sugiere "agencia cara"; que el hueco real es sobriedad + sustancia + pedagogía. Ya se
contradijo dos veces a conciencia (los shaders, y los siete movimientos del 2026-08-08).

**Esto sería la tercera y la más grande.** No lo digo para frenarlo: lo digo para que la decisión se
tome sabiendo lo que dice nuestra propia investigación, y para que el criterio de aceptación sea
explícito. Mi lectura, y es una opinión: un paisaje **sobrio y lento** puede jugar a favor donde un
paisaje **espectacular** jugaría en contra. La diferencia práctica está en §8.

---

## 5 · La decisión de arquitectura (lo que hay que aprobar)

### 5.1 · La propuesta: un solo escenario, cinco estaciones

**Un único lienzo fijo detrás de toda la página que pinta el paisaje entero**, gobernado por **una
sola variable de progreso** (`--viaje`, de 0 a 1, escrita por el scroll). La página, con su
maquetación de 12 columnas y su texto, viaja por encima.

```
  ┌─ #paisaje (canvas fijo, z-index 0) ──────────── cielo · nubes · montañas · mar · arena
  │
  ├─ #page (la web de siempre, z-index 2) ───────── texto, tarjetas, formularios
  │     · las secciones dejan de tener campo de color propio y pasan a ser TRANSPARENTES
  │     · lo que hoy es "campo azul" pasa a ser "tramo del viaje en el que el fondo es mar"
  │
  └─ Footer navy (fijo detrás) ──────────────────── se queda como está
```

**Por qué así y no de otra forma:**

1. **Es la única arquitectura que no repite el fallo del 2026-08-19.** Una capa que va *encima* de
   la página solo puede modular lo que encuentre debajo; para *ser* el paisaje hay que ir debajo y
   pintar. Ya está aprendido y ya está resuelto en `mar.ts` (`pintar: true`).
2. **Un solo dueño del gesto.** Hoy hay cuatro mecánicas de scroll. `--viaje` se calcula **una vez
   por fotograma** y todo lo demás lee esa variable: el paisaje, los tránsitos de color, las
   paradas. Es exactamente la norma 19 aplicada por adelantado — no añadir una quinta mecánica que
   habrá que sincronizar con las otras cuatro.
3. **Coste fijo y acotado.** Un lienzo, un shader, un bucle. No crece con el número de secciones.
4. **Degrada bien.** Sin WebGL o con "menos movimiento", el lienzo no arranca y los campos de color
   planos de hoy siguen ahí como respaldo. Igual que hace la portada ahora mismo con `mar-vivo`.

### 5.2 · Lo que descarto, y por qué

- **Capas de imágenes en parallax (PNG/SVG de montañas y nubes).** Es lo más barato de construir y
  lo primero que sale, pero: (a) hacen falta ilustraciones que no existen y que habría que
  encargar; (b) no se funden con el mar que ya tenemos, que es procedimental — se vería la costura
  entre el agua viva y una montaña de cartón; (c) se leen como plantilla. **Salvo** para las nubes,
  ver §7.
- **Escena 3D (three.js, terreno real).** Peso, tiempo y riesgo desproporcionados, y es justo el
  "espectáculo" contra el que avisa INV-09.
- **Un paisaje distinto por página.** Multiplica el trabajo por 9 y rompe la idea de recorrido.

### 5.3 · El precio honesto de esta decisión

No es gratis y conviene decirlo antes, no después:

- **Toca el sistema de maquetación de las 21 páginas.** Si las secciones pasan a transparentes, hay
  que revisar el contraste del texto en cada una. Es el trabajo más largo del proyecto, y es
  aburrido.
- **`ShaderFondo.astro` desaparece o se reduce a nada.** Su trabajo (buscar rectángulos azules en el
  DOM y pintarlos) deja de tener sentido cuando el fondo ya es un paisaje continuo.
- **El `scroll-snap` obligatorio de las cinco diapositivas y el paisaje continuo se pelean.** Un
  paisaje pide deslizarse; `scroll-snap-stop: always` obliga a frenar en cada campo. Hay que elegir.
  Recuerdo el hallazgo del 2026-08-11: **lorolabs.ai no tiene `scroll-snap` en ningún sitio** y la
  sensación de diapositiva que gustó salía de aire, ritmo y una idea por sección. Mi recomendación
  es **retirar el snap obligatorio** en el tramo del paisaje. Es decisión de Alejandro.
- **Hay que decidir colores nuevos de marca** (arena, cielo, roca). Eso es Brandbook, no CSS: no me
  los invento. Ver §7.4.

---

## 6 · El recorrido propuesto

Un viaje real por una isla, de mar a cumbre y de cumbre a pueblo, con el contenido que ya existe
colocado en la estación que le toca, y **el claim nuevo como remate**.

| # | Estación | Paisaje | Qué se cuenta | De dónde sale el contenido |
|---|---|---|---|---|
| 0 | **Mar abierto** | Agua profunda, horizonte alto, sin tierra a la vista. Azul Atis. | Logo + claim en manuscrita. La marca. | Portada actual, **sin tocar** |
| 1 | **El archipiélago** | El horizonte baja, aparecen las ocho islas en plata, en su geografía real | «Somos de aquí, y somos ocho islas». Quiénes somos. | Las islas de `/sobre-atis`, sacadas del cajón |
| 2 | **La orilla / la arena** | El agua se aclara, aparece la arena. Colores cálidos por primera vez. | **El problema.** «Hay cosas de tu negocio que te están comiendo el día.» | **Contenido nuevo** + los datos de `.06` (80%, x21, 30%) |
| 3 | **El pueblo** | El marco marinero. La casa que se enciende. Lo construido. | «Tu negocio ya vale. Vamos a que se note.» | La casa (`.reel`) + `MarcoCanario`, **sin tocar** |
| 4 | **La subida / montaña** | Terreno que asciende, la luz cambia, la niebla de los alisios | **La solución.** Cómo trabajamos, los siete servicios. | `.04` proceso + `.05` servicios |
| 5 | **La cumbre / el mar de nubes** | Por encima de las nubes. El punto más alto y más limpio. | **El claim nuevo** y la llamada a la acción. | **Contenido nuevo** + `.07` |

**Por qué este orden y no otro:** es la escalera comercial que ya está decidida (*land & expand*)
contada como geografía. Se entra por el problema (la orilla, donde el agua te llega a los pies), se
sube por la solución, y se remata arriba. Y tiene una ventaja seca: **el sitio ya va de claro a
oscuro al bajar**, y esto lo sustituye por algo con más sentido — va de mar a cumbre, que es una
dirección que cualquiera entiende sin que se la expliquen.

### 6.1 · El claim nuevo, y dónde vive

Lo pedido: *solucionamos problemas · soluciones a medida de procesos · nos adaptamos a lo que haga
falta · te ahorramos dinero*.

Esto **no es un eslogan de portada**, y conviene no ponerlo ahí: la portada ya tiene el claim de
marca («la p\*ta primera cooperativa creativa»), y dos claims en la misma pantalla se anulan. Su
sitio natural es la **estación 5, la cumbre**, como remate del recorrido, y **contestando** a la
estación 2 (el problema). El paisaje hace el trabajo de conectarlos: el visitante ha subido desde la
orilla hasta aquí.

Redacción propuesta, **pendiente de que Alejandro la repase o la reescriba** (yo no cierro copy suyo):

> **Enunciado:** Qué resolvemos
> **Titular:** No vendemos herramientas. Resolvemos problemas.
> **Cuerpo:** Cada negocio tiene sus propios cuellos de botella, así que no traemos una plantilla.
> Miramos tus procesos, uno a uno, y construimos la solución a la medida de cómo trabajas tú. Nos
> adaptamos a lo que haga falta.
> **Remate:** Y sale más barato de lo que crees, porque lo que te devolvemos son horas.

⚠️ Tres avisos sobre esta redacción:
1. Sin dos puntos ni punto y coma, por la regla de puntuación del proyecto. Cumplido.
2. **«Te ahorramos dinero» es una promesa cuantificable y no tenemos la cifra.** INV-04 (Precio)
   sigue en espera. Por eso el remate habla de horas devueltas —que es el diferencial que ya está
   escrito en el CLAUDE.md— y no de un porcentaje que no podemos sostener. En cuanto INV-04 cierre,
   se puede sustituir por un dato real.
3. Esto es **posicionamiento**, no texto de una página. Va a Notion (Brandbook · Voz).

---

## 7 · Qué se queda, qué cambia, qué se retira

### 7.1 · Se queda tal cual

- `mar.ts` como motor. Se **amplía**, no se sustituye.
- La casa del negocio y su coreografía.
- `MarcoCanario`.
- Las ocho islas (los archivos).
- `reveal.ts`, `entradas.ts`, y sus redes de seguridad a los 6 s.
- La escala de lectura, la tinta casi negra, el texto en bandera sin partir palabras.
- El pie navy fijo detrás.
- El menú y el loader.

### 7.2 · Cambia

- **Los campos de color pasan de "fondo propio" a "tramo del paisaje".** `.f-azul` deja de pintar un
  rectángulo azul y pasa a declarar «aquí el paisaje es mar». Mismo nombre de clase, otro
  significado — con eso las 21 páginas siguen funcionando sin reescribir su marcado.
- **`ShaderFondo.astro` se retira** (su trabajo lo absorbe el paisaje).
- **El zoom por isla de `/sobre-atis`** deja de ser una escena aparte y se integra en la estación 1.
- **`scroll-snap-stop: always`** — recomendado retirar en el tramo del paisaje. **Decisión abierta.**

### 7.3 · Los elementos nuevos, y cómo se hace cada uno

| Elemento | Técnica propuesta | Por qué |
|---|---|---|
| **Cielo** | Degradado en el propio shader, atado a `--viaje` | Es lo más barato que existe y es lo que más "cambia el sitio" |
| **Montañas** | Ruido *ridged* en el shader, dos o tres crestas a distinta distancia con niebla aérea entre ellas | Se funde con el mar (mismo lienzo, mismo grano). Una imagen no se fundiría |
| **Arena** | El mismo campo de agua con el color derivando a cálido y la ola aplanándose | Reutiliza el 100% del mar. Es literalmente la orilla |
| **Nubes** | **Excepción: capas en parallax con `transform`, fuera del shader** | Las nubes volumétricas en shader son caras y aquí no aportan; dos o tres capas suaves dan el mar de nubes de la cumbre por una fracción del coste |
| **Sol / luz** | Un parámetro del shader que mueve el color y el brillo de cresta | Ya existe media maquinaria (`calma`, `cresta`) |

### 7.4 · ⚠️ Colores nuevos: decisión de marca, no técnica

Un paisaje canario necesita al menos **arena** y **cielo**, y ninguno de los dos está en el sistema.
El manual v5 dice, literal, *no inventar valores nuevos de marca aquí*. Así que **no los invento**.

Lo que sí puedo decir es cuál es el marco:
- Tienen que salir del azul Atis y de la plata, no de una paleta de banco de imágenes.
- La arena canaria **no es dorada**, es **negra o tostada oscura** (Las Teresitas es arena importada
  del Sáhara, no de aquí). Una arena dorada sería un error de marca antes que de diseño.
- El negro sigue sin poder ser campo de fondo — y la arena volcánica lo rozaría. Hay que decidirlo
  explícitamente, como se decidió la excepción del logo sobre negro.

**Propuesta de trabajo:** Claude prepara **tres paletas candidatas** aplicadas sobre una captura
real del sitio, Alejandro elige una, y esa entra en el Brandbook como ampliación de v5. No se
escribe una línea de shader antes de eso.

---

## 8 · Las reglas que este proyecto no puede romper

Escritas como criterios de aceptación, para poder verificar contra ellas y no discutirlas después.

1. **El texto manda sobre el paisaje.** Ningún tramo puede bajar el contraste del cuerpo por debajo
   de lo que hay hoy. Si un fondo bonito obliga a aclarar el texto, se cambia el fondo.
2. **Sin WebGL, la web sigue siendo la web.** El paisaje es mejora progresiva. Se verifica quitando
   WebGL, no suponiendo.
3. **Con `prefers-reduced-motion`, hay una versión quieta y digna**, no una versión rota. Requisito
   WCAG, no cortesía.
4. **Ninguna animación puede dejar contenido invisible o con un dato falso** si se interrumpe. Red
   de seguridad a los 6 s, como en todo lo demás. (Ya pasó de verdad con dos cifras de `/casos`.)
5. **Solo `transform` y `opacity`.** Nada que provoque recálculo de maquetación.
6. **Un solo dueño del scroll.** `--viaje` se calcula una vez por fotograma. Nadie más escribe
   estado de scroll.
7. **Sobrio, no espectacular.** El criterio contra INV-09: el paisaje tiene que ser **lento y
   silencioso**. Si en una captura fija el paisaje llama más la atención que el titular, está mal.
8. **Móvil primero en el freno.** Si el teléfono de gama media no lo mueve, se apaga en móvil y se
   queda el sistema de campos de hoy. No se degrada la experiencia de lectura por un adorno.

---

## 9 · Riesgos, ordenados por lo que costaría equivocarse

| Riesgo | Qué pasa si sale mal | Cómo se contiene |
|---|---|---|
| 🔴 **Se rompen las cuatro coreografías existentes** | La home deja de funcionar y hay que rehacerla entera | Fase 1 en página de laboratorio, aislada. No se toca `HomeV5` hasta que el escenario esté aprobado |
| 🔴 **Contraste del texto sobre paisaje** | La web deja de ser legible para el público al que va dirigida | Criterio 1 de §8, medido en cada tramo |
| 🟠 **INV-09: se lee como "agencia cara"** | Resta credibilidad justo con quien queremos vender | Criterio 7. Y una prueba real: enseñárselo a alguien de 45-60 |
| 🟠 **Rendimiento en móvil** | LCP hundido, batería, scroll a tirones | Criterio 8. Presupuesto de fotogramas medido, no supuesto |
| 🟠 **Coste de sesión** | Es el proyecto más grande desde v5. Muchos archivos, muchas iteraciones visuales | Fases cerradas, sesión nueva por fase (§5 regla 4) |
| 🟡 **Los colores nuevos no convencen** | Se rehace el shader entero por una paleta | Por eso la paleta se decide **antes** de escribir el shader (§7.4) |

### 9.1 · Y lo que tengo que decir aunque no se me pregunte

Hay **cuatro hallazgos abiertos** desde el 2026-08-05 que siguen sin resolver, y uno es rojo:
`/portal/estado` y `/portal/financieros` **enseñan datos inventados a clientes reales** (hitos con
fechas falsas, una gráfica con 2.800 € de retorno que no existen). También: la política de cookies
describe cookies que ya no existen y omite las que sí, y los objetivos táctiles del menú miden
36,7×16,4 cuando el mínimo son 44×44 — en la navegación principal, para un público de 45-60.

Este proyecto del paisaje es más grande y más caro que los cuatro juntos. No digo que no se haga.
Digo que **enseñar cifras inventadas a un cliente real es un problema de otro orden** que un fondo
bonito, y que si va a haber una sesión, lo honesto es que esa media hora salga primero.

---

## 10 · Plan por fases

Cada fase cierra con algo verificable y con una sesión nueva (§5 regla 4).

**Fase 0 · Paleta** *(no toca código del sitio)*
Tres paletas candidatas de paisaje derivadas del azul y la plata, aplicadas sobre capturas reales.
Alejandro elige. La elegida entra en el Brandbook.
→ *Cierra cuando:* hay una paleta aprobada por escrito.

**Fase 1 · El escenario, en laboratorio** *(ruta aislada, nada publicado en la home)*
Ampliar `mar.ts` a `paisaje.ts`: cielo, horizonte, montañas por ruido *ridged*, arena, y la variable
`--viaje` recorriendo las seis estaciones. Sin texto encima todavía.
→ *Cierra cuando:* se puede recorrer el paisaje entero con el scroll, medido a 60 fps, y Alejandro lo
ha visto en movimiento y le convence.

**Fase 2 · El texto encima**
Meter la maquetación real de la home sobre el escenario. Contraste medido tramo a tramo. Aquí es
donde se decide lo del `scroll-snap`.
→ *Cierra cuando:* la home entera funciona sobre el paisaje, sin perder legibilidad ni las
coreografías de la casa y la portada.

**Fase 3 · El claim nuevo y las estaciones 2 y 5**
Copy nuevo (problema y solución), maquetado en su estación. Repasado por Alejandro.
→ *Cierra cuando:* el recorrido cuenta el argumento completo, no solo lo enseña.

**Fase 4 · Móvil, frenos y el resto de páginas**
Presupuesto de rendimiento en teléfono, `prefers-reduced-motion`, sin-WebGL, y las otras 8 páginas
públicas colocadas en su tramo del paisaje.
→ *Cierra cuando:* verificado **sobre la web publicada** (norma 16), no en local.

---

## 11 · Lo que hace falta que decida Alejandro antes de la Fase 1

1. **¿Se aprueba la arquitectura de §5** (un solo lienzo de paisaje detrás de toda la página, con las
   secciones transparentes)? Es la decisión que condiciona todo lo demás.
2. **¿Se aprueba el recorrido de §6** (mar → archipiélago → orilla → pueblo → subida → cumbre)?
3. **¿El `scroll-snap` obligatorio se retira** en el tramo del paisaje? (Mi recomendación: sí.)
4. **¿El paisaje es solo de la home, o de las 9 páginas públicas?** (Mi recomendación: home primero,
   el resto en Fase 4.)
5. **¿Se acepta la tercera contradicción de INV-09**, con el criterio de sobriedad de §8.7?
6. **¿El claim nuevo va en la cumbre** como remate, y no en la portada?
7. **¿Los cuatro hallazgos abiertos van antes o después?** (Mi recomendación: los datos inventados
   del portal, antes.)

---

## 12 · Pendiente de reflejar en Notion

- **Brandbook · Voz** — claim nuevo: *solucionamos problemas · soluciones a medida de procesos · nos
  adaptamos · te ahorramos dinero*. Es posicionamiento, no texto de una página. Redacción propuesta
  en §6.1, pendiente del repaso de Alejandro. ⚠️ La parte de "ahorramos dinero" no se puede
  cuantificar hasta que cierre INV-04.
- **Brandbook · Identidad visual** — si se aprueba, v5 pasa de *campos de color planos a sangre* a
  *paisaje continuo con tramos*. Es el cambio de fondo más grande desde v5 y contradice lo escrito.
- **Brandbook · Identidad visual** — colores nuevos de paisaje (arena, cielo, roca). Pendiente de
  elegir paleta (§7.4). Nota de marca: la arena canaria es negra o tostada oscura, no dorada.
- **Roadmap al MVP** — el proyecto del paisaje entra como bloque de trabajo, en 5 fases (§10).
- **Investigaciones · INV-09** — tercera contradicción consciente, esta vez la mayor. Registrar el
  criterio de aceptación (sobriedad) con el que se acepta.
- **Roadmap al MVP** — recordatorio: los cuatro hallazgos del 2026-08-05 siguen abiertos y uno es
  rojo (datos inventados visibles a clientes reales).
