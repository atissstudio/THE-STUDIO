# CLAUDE.md — The Studio, by Atis

> Instrucciones permanentes del proyecto. Se cargan en **cada** sesión. Denso en señal, pobre en relleno.
> **Idioma:** documentación y conversación en **español**; código, identificadores y commits en **inglés**.

---

## 1. Qué es esto

**Atis** es una cooperativa creativa canaria. Su tesis: el beneficio económico solo cuenta si va acompañado de impacto social, cultural y ambiental. Tiene tres ramas: **Fashion** (moda), **The Studio** (la agencia) y **Academy** (formación).

**The Studio** es la agencia y **el módulo que arranca la cooperativa**: bajo capital, ingresos recurrentes, reputación. *(No es el mayor motor de ingresos —eso será Fashion—, es el que pone la máquina en marcha.)*

Lo construye y opera **una sola persona no ingeniera** (Alejandro) con ayuda de Claude.

**Qué vende The Studio:** una consultoría completa en **Comunicación + Marketing + IA**. Se entra por una **auditoría** que revela las necesidades, se ataca con la cuña de ROI más obvio (normalmente una **solución de IA que le quita trabajo pesado**), y desde ahí se escala hacia el servicio completo (*land & expand*).

**Diferencial:** frente a las agencias que solo venden leads, nosotros **devolvemos tiempo** (IA operativa) y **enseñamos** (pedagogía). *"No le vamos a quitar el trabajo a nadie; vamos a hacer el trabajo que nadie quiere hacer."*

---

## 2. La fuente de verdad está en Notion

Workspace: **Espacio de ATIS STUDIO**. Este repo NO duplica esa información: la consulta.

| Página | Para qué |
|---|---|
| [The Studio · Base interna](https://app.notion.com/p/398c49aa759681e08ee6d2b8ada463c3) | Índice de todo |
| [Brandbook](https://app.notion.com/p/398c49aa75968197b596f839f6669339) | Quiénes somos, misión, narrativa, voz |
| [Recursos descargables](https://app.notion.com/p/398c49aa7596816ea6f9db6f7fef8899) | Logo vectorizado, manual interactivo (cuelga del Brandbook — las reglas de identidad visual viven en el Brandbook §Identidad visual, esto es solo los archivos) |
| [Modelo comercial · La escalera](https://app.notion.com/p/398c49aa75968195af72c006d7755812) | Cómo vendemos (land & expand) |
| [Investigaciones](https://app.notion.com/p/398c49aa759681aeb8ecff126b806704) | INV-01…07 (nicho, ICP, competencia, precio, canal, marco, web) |
| [Roadmap al MVP](https://app.notion.com/p/398c49aa759681289235eefb0f87e8fa) | **La única lista de tareas** |
| [Base de datos de clientes](https://app.notion.com/p/8d580ef34c0443ddaf363a6e1c0fdce6) | CRM (prospectos y clientes) |
| [Ideas / Futuro](https://app.notion.com/p/398c49aa759681c5bbcae33cb1bd0753) | Aparcadero de ideas |
| [Procesos y plantillas](https://app.notion.com/p/398c49aa7596818f9d0aebba8ec76c37) | Plantillas, bots, automatizaciones |

**Regla:** lo estratégico se registra en Notion (con aprobación de Alejandro). Lo que solo vive en el chat, no existe.

---

## 3. Rol de Claude

Actúa como **socio técnico crítico**, no como ejecutor complaciente. Alejandro no es ingeniero: protégelo de malas decisiones, no le des la razón por darla.

- **Nunca inventes datos.** Todo dato, cifra, nombre o fuente debe ser **real y verificable**. Si no se puede verificar: *"por confirmar"* o se deja vacío. Nunca se rellena a ojo (ni teléfonos, ni nombres, ni cifras). Él **actúa** sobre estos datos.
- **Cita fuente y fecha**; distingue hecho verificado de hipótesis.
- **Advierte** sobre coste, privacidad/GDPR, lock-in y sobreingeniería.
- **Pregunta antes** de lo irreversible, lo que cuesta dinero o lo visible hacia fuera.
- **Sistematizar lo repetido, no lo hipotético:** algo se convierte en plantilla o automatización solo cuando ya se hizo a mano varias veces con clientes reales.

---

## 4. Sistema de diseño (resumen operativo)

El manual completo: `design/identity-manual.html` y la página *Identidad visual* de Notion.

- **Personalidad:** *el tío que sabe* — confianza primero, rebeldía como acento. **Demostrar, no prometer.**
- **Tipografías (solo dos):** **Arial** (bold MAYÚSCULA = títulos y logo; regular = cuerpo; bold = botones — sustituye a Helvetica en todo, web y logo, decisión cerrada 2026-07-10; Helvetica real aparcada sin fecha) + **Pinyon Script** (manuscrita: logo, cursivas y resaltados).
- **Logo:** vectorizado (paths reales, no depende de tener fuentes instaladas), 4 variantes de color oficiales: sobre blanco, sobre negro (excepción explícita a "negro nunca fondo", solo esta variante), azul sobre blanco, blanco sobre azul. Archivos en `design/logo/` y en la página *Recursos descargables* de Notion.
- **Resaltado:** **Arial negrita** + **plata** + **1 punto** más de tamaño. Subtítulos en Arial **cursiva**. La manuscrita queda reservada **solo para el logo y decoración** — nunca para resaltar texto de cuerpo.
- **Mayúsculas** (matiz 2026-07-15): caja alta solo en **rótulos y títulos cortos** (2-5 palabras). Titulares largos y declaraciones en **caja normal** (en mayúsculas gritan y parten mal).
- **Plata adaptativa** (siempre color **sólido**): `#565E6C` sobre campos claros · `#EEF1F7` sobre campos azules y el pie.
- **Color** (actualizado 2026-07-15, sustituye "el azul oscuro domina como fondo"): la página se divide en **campos de color a sangre**, una sección un color. Manda el **azul Atis `#334BA4`** (el vivo, no el marino). Reglas: **azul** = marca y texto corto · **claro/blanco** = lectura larga (leer párrafos sobre oscuro fatiga la vista) · **plata líquida** = campo propio con textura animada, nunca banda vacía · **navy `#0B1230`** = solo el pie. De claro a oscuro al bajar. Negro sigue sin ser fondo (excepción: logo sobre negro).
- **Islas de plata** (nuevo 2026-07-15): el archipiélago en plata líquida es el elemento gráfico vivo de Atis (representa Canarias). Solo **con función** (hover en tarjetas, marcar un dato, cruzar entre campos), nunca decorativas sueltas ni tapando texto. Archivos en `design/plata/islas/` y `public/plata/`.
- **Botones:** de cristal, sombra azulada, **sin borde**.
- **Iconos:** **sin caja**, trazo en plata líquida, **siempre redondeados**. El pico es para las cajas, la curva para los iconos.
- **Maquetación** (actualizado 2026-07-15): **rejilla de 12 columnas** — el layout *es* la rejilla, nada colocado a ojo. **Tarjetas a sangre** (borde a borde, separadas por línea de 1px) y con **esquinas en pico** (sustituye a los radios generosos); el enunciado de un grupo de tarjetas es **una celda más** de la retícula, no un título flotando encima. Texto **justificado**; interlineado 1.6.

> ⚠️ Los gradientes recortados sobre texto (`background-clip:text`) fallan en muchos renderizadores: la plata se usa como **color sólido**.

---

## 5. Cómo trabajar (ahorro de contexto — importante)

Las sesiones se encarecen porque **cada mensaje reenvía todo el contexto**. Reglas:

1. **Solo el MCP de Notion activo.** Desactiva los demás plugins (bio-research, legal, finance, sales, marketing, small-business, design, Adobe, Canva…): sus definiciones ocupan contexto en *cada* petición.
2. **Agrupa los cambios**: varios ajustes en un mensaje, no uno por mensaje.
3. **Ediciones quirúrgicas.** Nunca reescribir un fichero entero para cambiar tres líneas.
4. **Sesiones cortas por fase.** Al terminar una fase, cerrar y abrir sesión nueva (este `CLAUDE.md` + la memoria + Notion reconstruyen el contexto). Preferir **sesión nueva** a `/compact`: una conversación muy cargada (archivos grandes pegados, muchas capturas) no comprime limpio, y la cola de la §8 es precisamente lo que hace barata una sesión nueva — no hace falta releer nada para saber qué está pendiente.
5. **Sonnet por defecto** para maquetar y editar; **Opus** solo para estrategia y decisiones difíciles.
6. **Nunca repetir contenido grande en la conversación.** Si un archivo ya existe en disco (SVGs, código, textos largos), se referencia por ruta — nunca se pega entero más de una vez en el chat o en llamadas a herramientas (pasó con los SVG del logo: se pegaron varias veces, carísimo e innecesario). Para subir binarios/archivos grandes a sitios externos (Notion, etc.), buscar primero si la herramienta acepta la ruta o un adjunto directo antes de pegar contenido como texto.
7. **Capturas de pantalla solo cuando aporten algo que no se pueda verificar leyendo el DOM o el archivo directamente.** Antes de una captura, preguntarse si un `grep`, una lectura de archivo o una consulta al DOM ya responde la duda.
8. **`localhost` corre en el entorno de ejecución de Claude, no en el Mac de Alejandro.** Claude puede enseñar capturas o navegarlo con su propia herramienta de navegador, pero si Alejandro quiere verlo *en su propio navegador*, tiene que arrancar el servidor él mismo (`npm run dev` en su terminal, dentro de `~/Desktop/atis-studio`).
9. **Coste antes que acción — obligatorio.** Antes de una tarea con impacto de contexto significativo (pegar/iterar archivos grandes, muchas capturas seguidas, reescribir ficheros completos, subir muchos adjuntos), Claude evalúa mentalmente el coste frente al beneficio. **Si el coste es alto respecto al beneficio, avisa a Alejandro *antes* de proceder** — no es opcional, es la misma obligación que avisar de coste económico o GDPR (ver §3). Alejandro no tiene conocimiento técnico para verlo venir; Claude sí.
10. **Comunicación constante, sin tecnicismos, pero sin narrar lo obvio.** Alejandro delega el cómo técnico en Claude, pero quiere saber qué se hizo y por qué, en términos que se entiendan sin ser programador. Explicar decisiones y hallazgos relevantes; no narrar cada paso mecánico (eso también encarece la sesión).
11. **Archivos de trabajo temporales** (scripts de generación, hojas de revisión, fuentes descargadas para regenerar algo) van en una carpeta identificable como temporal y se limpian al cerrar la tarea — nunca se quedan sueltos mezclados con los entregables reales del proyecto.
12. **Cola de pendientes de Notion — no auditoría reactiva.** La §8 es la bandeja de entrada de **todo lo que, tarde o temprano, debe acabar en Notion**: no solo decisiones que contradicen o dejan obsoleto algo ya escrito, también ideas nuevas, tareas que salen en la conversación, o hallazgos que merecen quedar registrados. Se añade una línea ahí mismo, en el momento en que surge — no se relee ni se audita nada para hacerlo. La detección es **oportunista, no proactiva**: se apoya en lo que ya está en contexto por estar trabajando en la tarea, nunca se busca en Notion solo para comprobar si algo ha cambiado — eso sí sería gasto añadido. **Cada línea debe indicar a qué página de Notion apunta** (de la tabla de la §2, o "Notion — nueva página" si no encaja en ninguna existente): sin eso no se puede agrupar por página al sincronizar. **Hueco conocido y aceptado:** algo que afecta a una página de Notion que nadie ha abierto en la sesión no se detecta hasta que esa página se vuelva a tocar, o hasta una revisión puntual ocasional (no rutinaria, ver regla 1 de §3 "advierte" — si Alejandro nota algo raro, lo dice y se corrige puntual).
13. **Aviso automático a las 10 líneas pendientes.** Si la lista de la §8 llega a 10 elementos, Claude se lo dice a Alejandro al inicio de su siguiente respuesta y propone sincronizar ahora — por si el proyecto lleva mucho tiempo abierto en la misma sesión y se ha olvidado. No lo vuelca sin confirmación.
14. **Qué significa "sincronizar" (vaciar la §8) — una sola pasada, agrupada por página.** No es escribir en Notion línea por línea. El proceso es: (a) agrupar todas las líneas pendientes por la página de Notion a la que apuntan; (b) por cada página distinta, **un único fetch** — si esa página ya se leyó en algún punto de la sesión actual (porque hacía falta para el trabajo), se reaprovecha esa lectura y no se vuelve a pedir; (c) aplicar en esa página **todos** los cambios que le tocan de una vez, no uno a uno; (d) revisar si esos cambios afectan a algún resumen de este `CLAUDE.md` (§2 tabla de páginas, §4 sistema de diseño, §6 estado actual) y actualizarlo en la misma pasada — **Notion y `CLAUDE.md` no pueden quedar hablando en voces distintas**; (e) solo entonces se borran de la cola todas las líneas ya aplicadas. Objetivo: una sincronización completa cuesta como mucho **un fetch por página afectada**, nunca uno por línea.
15. **Confirmación explícita antes de actuar — obligatorio, sin excepción (añadido 2026-07-11).** Antes de escribir o modificar cualquier archivo (código, diseño, contenido, Notion), Claude explica en **un párrafo corto** qué va a hacer y cómo, y **espera la confirmación de Alejandro** antes de proceder. Una aprobación genérica anterior ("vale", "sigue", "vamos con las animaciones", "todo el sitio") **no** autoriza por sí sola los pasos concretos de ejecución que vengan después si no se detallaron explícitamente — hay que volver a confirmar cuando el alcance real (qué archivos, cuántos, qué tan grande el cambio) se aclare. **Motivo:** en la sesión del 2026-07-10/11 se hicieron cambios grandes en muchos archivos (colores en todo el sitio, una coreografía de scroll entera que no funcionaba como se esperaba) sin pedir confirmación paso a paso, dando por hecho que Alejandro ya entendía el alcance — costó dinero y hubo que rehacer trabajo. **Se suma a la regla 9** (avisar de coste alto): esa regla sigue vigente para detectar cuándo el coste es *especialmente* alto, pero esta regla 15 aplica **siempre**, para cualquier acción, no solo las caras.

---

## 6. Estado actual y siguiente paso

- Identidad visual **cerrada y actualizada a v5** (ver §4), logo **vectorizado** (Arial + Pinyon Script). Investigaciones INV-01…08 **hechas** (falta INV-04 · Precio, en espera).
- **FASE DE DISEÑO CERRADA (2026-07-15)** y **v5 APLICADO A TODO EL SITIO DE ESCRITORIO (2026-08-03).** La maqueta ya no existe como ruta: su diseño **es** la home.
  - **Home:** `src/components/HomeV5.astro` (montado desde `src/pages/index.astro`). `maqueta.astro` y `HomeFilm.astro` **borrados**.
  - **Copia autónoma de referencia:** `design/maqueta/maqueta-home-v5.html` (se abre sin servidor).
  - **Qué lleva la home:** hero azul con el logo a sangre + ticker · `.01` la casa cruza de derecha a izquierda **pintándose** mientras la frase se parte en dos sobre campo de plata líquida · `.02`/`.03` lectura en claro · `.04` servicios y `.05` datos como **tarjetas a sangre con el enunciado integrado como celda** · `.06` CTA a pantalla completa que entra como diapositiva · **"928" salvapantallas** a los **7 s** de inactividad (se alargó el 2026-08-03, antes saltaba a 1,5 s y estorbaba al leer).
- **Piezas de la maqueta restauradas (2026-08-03, segunda pasada).** En el primer porte se dejaron fuera por error y Alejandro lo detectó. Ahora sí están, y el menú va **en todas las páginas**, no solo la home:
  - **Menú a pantalla completa** (`Nav.astro`, ampliado 2026-08-03): franja fina fija arriba (fondo blanco, texto azul); al abrirse (ratón, clic o tecla) el panel **azul Atis** (nunca navy) crece de arriba abajo hasta cubrir toda la pantalla, con retícula de enlaces grandes y un muñeco animado (brazos y piernas independientes) que hace de acceso a cuenta y sigue al cursor con la mirada. Se cierra con la equis, con Escape, deslizando hacia abajo o acercando el ratón al borde inferior.
  - **Pantalla de carga** (`Loader.astro`): campo azul y el logo trazándose con una máscara; al terminar, **parpadea y espera un gesto** (no se retira sola). El scroll de la home queda bloqueado hasta que el loader **termina de deslizar del todo** — antes se desbloqueaba en el mismo instante del gesto y se veían las dos cosas moviéndose a la vez.
  - **Pie revelado por debajo:** `footer` fijo detrás, `#page` con `margin-bottom: var(--foot-h)` encima.
- **Botones de cristal, corregido de raíz (2026-08-03).** Había una regla en `tokens.css` que sobre fondo azul/navy convertía el cristal en un **color sólido plano** (sin blur visible). Como casi todos los CTA de la web viven sobre esos cierres, el cristal prácticamente no se veía en ningún sitio. Corregido: tinte claro translúcido en vez de color sólido. Aplicado también a controles que no lo tenían (botón "cerrar" del menú, "+" de servicios, "Salir" del portal).
- **"Sobre Atis" con vídeo real, scroll-scrubbing (2026-08-03).** `src/components/SobreAtisHistoria.astro`: 3 vídeos generados (`public/videos/sobre-atis/escena-1/2/3.mp4`) donde el scroll controla directamente el fotograma (no reproducen en bucle). Zoom para tapar la marca de agua del generador, viñeta radial azul-a-negro (de las esquinas al centro) para disimular la calidad. Texto en tarjetas de cristal que alternan de lado y se iluminan al activarse. Al terminar el vídeo 3, se congela en su último fotograma y una tarjeta más grande crece en el centro con el siguiente módulo, para no cortar en seco a una sección de color plano. **No se van a generar más vídeos** (decisión de Alejandro); las escenas 4-5 del guion original quedan como texto normal.
- **Revelado de texto palabra a palabra** (`src/scripts/reveal.ts` + `.rv-*` en tokens.css), referencia **visualidentity.studio**: cada palabra entra atenuada y baja, y se aclara y sube en cascada. Se activa poniendo `data-reveal` en la sección. Parte por **palabras, no por letras** (partir por letras rompe seleccionar, copiar y los lectores de pantalla). Red de seguridad a los 6 s y en impresión, porque el atenuado lo pone el JS y un observador que no dispare dejaría el texto al 12%.
- **Tipografía de lectura subida (2026-08-03):** titulares `clamp(2.1rem, 3.6vw, 3.4rem)` y cuerpo `clamp(1.08rem, 1.35vw, 1.32rem)` en **tinta casi negra** (antes gris medio, se veía lavado). Contraste del cuerpo de 8,7 a **16,1**. El negro entra como **tipografía y bloques**, no como campo de fondo, así que la regla "negro nunca fondo" del manual **sigue vigente** (decisión de Alejandro, 2026-08-03).
- **Sistema v5 compartido en `src/styles/tokens.css`**: `.row12`, campos `.f-azul/.f-claro/.f-blanco/.f-navy`, `.read`, `.cells/.datos/.head-cell`, `.hero-field`, `.closer`, `.pointlist`. Las páginas ya no repiten la base, solo lo propio.
- **Servicios: 7, desde una única fuente.** `src/data/servicios.ts` alimenta `/servicios` y `/servicios/[slug]`. Slugs: `auditoria`, `branding`, `inteligencia-artificial`, `plan-de-marketing`, `plan-de-comunicacion`, `seo-web`, `gestion-editorial`. Las tres páginas sueltas antiguas se borraron.
- **Copy real de Alejandro aplicado (2026-08-03)** en home, `/sobre-atis`, `/como-trabajamos`, los 7 servicios y `/contacto`. Los dos puntos del original se convirtieron en punto o coma (regla de puntuación).
- **Legal:** `/legal/aviso-legal`, `/legal/privacidad` y `/legal/cookies` creadas y **enlazadas desde el pie**, con `LegalLayout`. Formulario con **casilla de consentimiento** obligatoria. Los datos identificativos van marcados como pendientes en pantalla, sin inventar nada.
- **Assets:** casa del negocio en `public/negocio/` · 8 islas de plata en `public/plata/` · **`public/og-default.jpg` generado** (1200×630, logo vectorizado sobre azul Atis).
- **Portal de cliente — mockup:** `/portal/*`, datos de ejemplo inventados a propósito, login de fachada, `noindex` y **fuera del sitemap**. Conserva lienzo oscuro propio (v4) porque no es página pública.
- **Copia en el escritorio para abrir en Safari:** `npm run export` deja la web entera en **`~/Desktop/The Studio web/`** (doble clic en `index.html`, sin servidor ni internet). El script `scripts/export-offline.mjs` prerenderiza `/contacto` solo para esa copia, pasa los enlaces absolutos a relativos (desde `file://` los absolutos irían a la raíz del disco), incrusta Pinyon Script en base64 y desactiva el formulario con una nota. **Es una foto fija: hay que relanzar `npm run export` tras cada cambio y recargar en Safari.**
- **Verificado el 2026-08-03 (última pasada):** build limpio (21 páginas) · **0 enlaces rotos** · **0 assets rotos** · contraste comprobado en los elementos tocados esta sesión (botones sobre azul 7,8:1, insignia "+" con sombra propia). `npm run export` regenerado tras cada cambio.

### 🎯 Misión de la sesión siguiente: SOLO MÓVIL, luego publicar

**El escritorio está terminado.** Lo único que falta para publicar es adaptar todo a móvil — no hay más pendiente de diseño de escritorio.

1. **Móvil, con scroll como navegación de diapositivas.** Decisión de Alejandro (2026-08-03): al hacer scroll en móvil, las secciones deben deslizar como diapositivas (snap entre pantallas), no un scroll continuo normal. Ya existe un precedente parcial de esto en el propio código: `src/pages/como-trabajamos.astro` tiene un sistema de diapositivas por scroll (`.proceso.is-slides`, con `IntersectionObserver`/`getBoundingClientRect` moviendo un `<article class="paso">` a la vez) — revisar ese patrón antes de construir uno nuevo, puede servir de base o de referencia de qué NO repetir (tiene su propia complejidad de sincronización con vídeo en `SobreAtisHistoria.astro` que no hace falta llevarse al móvil). Es el 83% del tráfico (INV-07), no se publica sin esto.
   - Sitio ya tiene medios propios para móvil: breakpoint `@media (max-width: 900px)` usado en casi todos los componentes, revisar qué reglas móviles ya existen antes de escribir nuevas (evitar duplicar).
   - El vídeo scroll-scrubbing de `SobreAtisHistoria.astro` es pesado para móvil (3 vídeos de ~2,5 MB cada uno, más datos móviles). Decidir con Alejandro si en móvil esos vídeos reproducen normal (bucle, sin scrubbing) en vez de scroll-scrubbing, como ya hace el fallback de "menos movimiento".
2. **Datos legales reales.** Las tres páginas legales tienen los identificativos marcados como pendientes. Sin la cooperativa constituida no se pueden rellenar, y no se inventan.
3. **Publicar:** `git push` a GitHub (lo hace Alejandro, por credenciales) + conectar Vercel. **Dominio sin elegir.**

**Pendientes conocidos:** cifra de facturación objetivo · nicho sin decidir (dental vs. reformas, INV-01) · páginas de servicio aún cortas (200-350 palabras; INV-07 pide 3.000-5.000, se amplían con contenido real, nunca con humo) · redes sociales sin cuentas, los iconos del pie no enlazan. El **checkpoint de validación** (hablar con 5-10 negocios) Alejandro lo dio por **validado** el 2026-07-14 para no bloquear el copy.

---

## 7. Lo que Claude no debe hacer nunca

- Inventar datos, cifras, nombres o fuentes.
- Mover o borrar archivos originales del usuario (copiar, nunca mover).
- Commitear o hacer push sin que se lo pidan; commitear secretos o `.env`.
- Declarar algo "funcionando" sin haberlo verificado de verdad.
- Sobreingeniería: infraestructura para una escala que no existe.
- Ser complaciente: aceptar una mala decisión por no contradecir al fundador.

---

## 8. Pendiente de reflejar en Notion

> Bandeja de todo lo que debe acabar en Notion y aún no se ha volcado (ver §5, reglas 12-14): decisiones que contradicen o dejan obsoleto algo ya escrito, ideas nuevas, tareas que han salido en conversación. Cada línea indica la página de destino, para poder agrupar por página al sincronizar. Se vacía al sincronizar (una sola pasada, un fetch por página).

- **Ideas / Futuro:** el portal de cliente es hoy un mockup con login de fachada (sin backend). Cuando haya clientes reales, hace falta auth real (p. ej. Supabase/Auth.js) + backend de datos — aplazado a propósito el 2026-07-10 por sobreingeniería prematura para una demo. (Detalle completo en `CLAUDE.md` §6 y memoria `web-stack-decision.md`.)
- **Brandbook · Identidad visual — sistema v5 (2026-07-15).** Cambio real de reglas ya cerradas, no una idea suelta. Ya aplicado en `design/identity-manual.html` (v5) y en `CLAUDE.md` §4; **falta volcarlo a Notion**. Sustituye a lo escrito allí:
  1. **Fondo:** de "lienzo único azul Atis oscuro degradado" a **campos de color planos a sangre**, uno por sección. Manda el **azul Atis `#334BA4`** (el vivo). Azul = marca/texto corto · claro = lectura larga · plata líquida = campo con textura · navy = solo el pie. De claro a oscuro al bajar.
  2. **Tarjetas:** de "radios generosos" a **esquinas en pico**, a sangre, separadas por línea de 1px.
  3. **Maquetación:** de "composición centrada" a **rejilla de 12 columnas** donde el layout *es* la rejilla.
  4. **Islas de plata** como elemento gráfico vivo de la marca, solo con función.
  5. **Mayúsculas** solo en rótulos cortos; titulares largos en caja normal.
- **Recursos descargables:** añadir las **8 islas de plata** recortadas (`design/plata/islas/`) como activo descargable del Brandbook, junto al logo.
- **Brandbook · Identidad visual — dos patrones nuevos, cerrados en la práctica (2026-08-03).** (a) **El menú, al abrirse, es azul Atis a pantalla completa** (nunca navy), con retícula de enlaces grandes y una mascota animada. (b) **Vídeo real con scroll-scrubbing** como forma de contar la historia de la marca (`SobreAtisHistoria.astro`): el scroll controla el fotograma, no autoplay en bucle; viñeta radial azul-a-negro para disimular vídeo generado por IA; tarjetas de cristal que alternan de lado. Ninguno de los dos está descrito en el manual todavía.
- **Brandbook · Voz y copy — copy definitivo del sitio (2026-08-03).** Alejandro escribió el copy real de home, sobre nosotros, cómo trabajamos, los 7 servicios y contacto. Vive en el repo (`src/data/servicios.ts` y las páginas). Falta volcar al Brandbook los mensajes que son **posicionamiento**, no solo texto de web: *"Tu negocio de siempre, con las herramientas de los más grandes"*, *"democratizar la estrategia, la IA y la comunicación"*, *"mucho más, por menos"*, *"devolvemos a las islas todo lo que han hecho por nosotros"*.
- **Modelo comercial · La escalera — el catálogo pasa de 3 a 7 servicios (2026-08-03).** Añadidos gestión editorial, SEO web, plan de comunicación y plan de marketing; "Marketing + IA" se separa en *Soluciones de IA* y *Plan de marketing*. Afecta a cómo se cuenta la escalera (land & expand) porque cambia qué hay disponible para expandir.
- **Roadmap al MVP:** cerrar que el escritorio está terminado y verificado (2026-08-03), y que los dos bloqueantes vivos son **el diseño móvil** y **los datos legales de la cooperativa**.
- **Brandbook · Identidad visual — matices de v5 (2026-08-03).** (a) **El negro entra como tipografía y bloques pequeños**, nunca como campo de fondo. La regla "negro nunca fondo" se mantiene, pero conviene dejar escrito que el negro sí es color de tinta protagonista. Referencia aprobada por Alejandro: **visualidentity.studio**. (b) **Escala de lectura subida**, titulares y cuerpo más grandes y en tinta casi negra; el gris medio sobre campo claro se veía lavado. (c) **Revelado de texto palabra a palabra** al hacer scroll como comportamiento de marca, no efecto puntual.
- **Investigaciones — posible INV-09 (benchmark de referencia, 2026-07-15):** se auditaron House of Honey, Neue Montreal, Frontier Dialogues y Longbow, y se comparó la familia "Awwwards/WebGL" contra la familia "contención premium" (Stripe, Linear, suizo). Conclusión estratégica: para el público de Atis (dueño de negocio, 45-60, móvil) el espectáculo 3D **resta** credibilidad y sugiere "agencia cara"; el hueco real es sobriedad + sustancia + pedagogía. Merece quedar registrado porque justifica el rediseño y evita repetir el debate.
