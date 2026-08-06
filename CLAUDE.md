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
- **Llamada a la acción (cambiado 2026-08-05):** ya no hay botón de cristal. Un **único estilo en toda la web**: texto en versalitas con filete de 1 px debajo, sin caja ni contorno (azul sobre campo claro, plata sobre azul/navy). Convivían dos estilos y no se sabía cuál mandaba.
- **Iconos:** **sin caja**, trazo en plata líquida, **siempre redondeados**. El pico es para las cajas, la curva para los iconos.
- **Líneas (2026-08-05):** el filete de 1 px es elemento de maquetación, no solo separador de tarjetas: abre cada bloque de lectura sobre su enunciado y enmarca el carril de la portada. Utilidad `.filete`.
- **Texto en bandera, nunca justificado ni partido** (cambiado 2026-08-06, sustituye a "justificado con partición por sílabas"). **Ninguna palabra se parte en ninguna parte de la web** — regla cerrada. Las dos cosas van juntas: el justificado solo se sostenía porque `hyphens: auto` partía las palabras largas, y justificar en español sin partir abre ríos de espacio entre palabras. El texto se alinea contra el lado de su bloque (izquierda por defecto, derecha en `.read.right`) y el borde contrario queda irregular. `text-wrap: pretty` evita la última línea de una sola palabra. Los bloques siguen alternando izquierda y derecha para dar continuidad.
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
  - **Qué lleva la home:** portada azul compacta con el logo pegado arriba a sangre, línea blanca y **carril con el claim en manuscrita corriendo de izquierda a derecha** · `.01` la casa cruza de derecha a izquierda **pintándose** mientras la frase se parte en dos sobre campo de plata líquida · `.02`/`.03` lectura en claro · `.04` servicios y `.05` datos como **tarjetas a sangre con el enunciado integrado como celda** · `.06` CTA a pantalla completa que entra como diapositiva · **"928" salvapantallas** a los **7 s** de inactividad (se alargó el 2026-08-03, antes saltaba a 1,5 s y estorbaba al leer).
- **Piezas de la maqueta restauradas (2026-08-03, segunda pasada).** En el primer porte se dejaron fuera por error y Alejandro lo detectó. Ahora sí están, y el menú va **en todas las páginas**, no solo la home:
  - **Menú a pantalla completa** (`Nav.astro`, ampliado 2026-08-03): franja fina fija arriba (fondo blanco, texto azul); al abrirse (ratón, clic o tecla) el panel **azul Atis** (nunca navy) crece de arriba abajo hasta cubrir toda la pantalla, con retícula de enlaces grandes y un muñeco animado (brazos y piernas independientes) que hace de acceso a cuenta y sigue al cursor con la mirada. Se cierra con la equis, con Escape, deslizando hacia abajo o acercando el ratón al borde inferior.
  - **Pantalla de carga** (`Loader.astro`): campo azul y el logo trazándose con una máscara; al terminar, **parpadea y espera un gesto** (no se retira sola). El scroll de la home queda bloqueado hasta que el loader **termina de deslizar del todo** — antes se desbloqueaba en el mismo instante del gesto y se veían las dos cosas moviéndose a la vez.
  - **Pie revelado por debajo:** `footer` fijo detrás, `#page` con `margin-bottom: var(--foot-h)` encima.
- ~~Botones de cristal~~ **RETIRADOS (2026-08-05).** Convivían dos estilos de CTA en la misma pantalla (píldora de cristal y enlace subrayado) y no se sabía cuál mandaba. Se queda **solo el subrayado**: `GlassButton.astro` (mismo nombre de archivo, ya sin cristal) pinta texto en versalitas con filete de 1 px, azul sobre campo claro y plata sobre azul/navy. Al cambiar el componente, el estilo llega a las 10 páginas que lo usan.
- ~~"Sobre Atis" con vídeo real~~ **VÍDEOS BORRADOS (2026-08-05), ver bloque de esta sesión más abajo.** Lo que sigue queda como histórico: `src/components/SobreAtisHistoria.astro`: 3 vídeos generados (`public/videos/sobre-atis/escena-1/2/3.mp4`) donde el scroll controla directamente el fotograma (no reproducen en bucle). Zoom para tapar la marca de agua del generador, viñeta radial azul-a-negro (de las esquinas al centro) para disimular la calidad. Texto en tarjetas de cristal que alternan de lado y se iluminan al activarse. Al terminar el vídeo 3, se congela en su último fotograma y una tarjeta más grande crece en el centro con el siguiente módulo, para no cortar en seco a una sección de color plano. **No se van a generar más vídeos** (decisión de Alejandro); las escenas 4-5 del guion original quedan como texto normal.
- **Revelado de texto palabra a palabra** (`src/scripts/reveal.ts` + `.rv-*` en tokens.css), referencia **visualidentity.studio**: cada palabra entra atenuada y baja, y se aclara y sube en cascada. Se activa poniendo `data-reveal` en la sección. Parte por **palabras, no por letras** (partir por letras rompe seleccionar, copiar y los lectores de pantalla). Red de seguridad a los 6 s y en impresión, porque el atenuado lo pone el JS y un observador que no dispare dejaría el texto al 12%.
- **Tipografía de lectura subida (2026-08-03):** titulares `clamp(2.1rem, 3.6vw, 3.4rem)` y cuerpo `clamp(1.08rem, 1.35vw, 1.32rem)` en **tinta casi negra** (antes gris medio, se veía lavado). Contraste del cuerpo de 8,7 a **16,1**. El negro entra como **tipografía y bloques**, no como campo de fondo, así que la regla "negro nunca fondo" del manual **sigue vigente** (decisión de Alejandro, 2026-08-03).
- **Sistema v5 compartido en `src/styles/tokens.css`**: `.row12`, campos `.f-azul/.f-claro/.f-blanco/.f-navy`, `.read`, `.cells/.datos/.head-cell`, `.hero-field`, `.closer`, `.pointlist`. Las páginas ya no repiten la base, solo lo propio.
- **Servicios: 7, desde una única fuente.** `src/data/servicios.ts` alimenta `/servicios` y `/servicios/[slug]`. Slugs: `auditoria`, `branding`, `inteligencia-artificial`, `plan-de-marketing`, `plan-de-comunicacion`, `seo-web`, `gestion-editorial`. Las tres páginas sueltas antiguas se borraron.
- **Copy real de Alejandro aplicado (2026-08-03)** en home, `/sobre-atis`, `/como-trabajamos`, los 7 servicios y `/contacto`. Los dos puntos del original se convirtieron en punto o coma (regla de puntuación).
- **Legal:** `/legal/aviso-legal`, `/legal/privacidad` y `/legal/cookies` creadas y **enlazadas desde el pie**, con `LegalLayout`. Formulario con **casilla de consentimiento** obligatoria. Los datos identificativos van marcados como pendientes en pantalla, sin inventar nada.
- **Assets:** casa del negocio en `public/negocio/` · 8 islas de plata en `public/plata/` · **`public/og-default.jpg` generado** (1200×630, logo vectorizado sobre azul Atis).
- **Portal de cliente — YA NO ES MAQUETA (2026-08-05):** `/portal/*` lee datos reales de Supabase con login por contraseña. `noindex` y fuera del sitemap. ⚠️ **`/portal/estado` y `/portal/financieros` siguen mostrando datos INVENTADOS** (hitos con fechas falsas, gráfica con 2.800 € de retorno) y ahora los ve un cliente real — pendiente de resolver, ver §6 bis.
- ⚠️ **`npm run export` ROTO desde el 2026-08-05**, al pasar el sitio a `output: "server"` ya no hay HTML estático que copiar. Como la web está publicada, esa copia offline probablemente ya no hace falta; si se quiere recuperar, hay que hacer que el script cambie `output` temporalmente. Documentación histórica: `npm run export` deja la web entera en **`~/Desktop/The Studio web/`** (doble clic en `index.html`, sin servidor ni internet). El script `scripts/export-offline.mjs` prerenderiza `/contacto` solo para esa copia, pasa los enlaces absolutos a relativos (desde `file://` los absolutos irían a la raíz del disco), incrusta Pinyon Script en base64 y desactiva el formulario con una nota. **Es una foto fija: hay que relanzar `npm run export` tras cada cambio y recargar en Safari.**
- **Verificado el 2026-08-03 (última pasada):** build limpio (21 páginas) · **0 enlaces rotos** · **0 assets rotos** · contraste comprobado en los elementos tocados esta sesión (botones sobre azul 7,8:1, insignia "+" con sombra propia). `npm run export` regenerado tras cada cambio.
- **MÓVIL ADAPTADO Y COMMITEADO (2026-08-04).** Todo el trabajo de v5 (que llevaba semanas sin commitear) más la adaptación móvil quedaron en un solo commit (`6c8217f`). Pendiente de `git push` — lo hace Alejandro, ver siguiente sección.
  - ~~Scroll por diapositivas en todo el móvil~~ **RETIRADO (2026-08-05): el scroll es libre.** `scroll-snap-stop: always` obligaba a frenar en cada campo y la página peleaba contra el dedo. El snap se conserva solo donde la diapositiva es intencionada (historia de Sobre Atis, pasos de Cómo trabajamos). Histórico: cada campo de color (`.f-azul/.f-claro/.f-blanco/.f-navy`) ajusta a pantalla completa vía `scroll-snap-type: y proximity` (no `mandatory` — con `mandatory`, páginas con un solo tramo de snap lejos del principio, como `/sobre-atis` con el bloque de vídeo de 880vh sin marcar como campo, forzaban el scroll hasta el final nada más cargar; `proximity` lo corrige sin perder la sensación de diapositiva). La sección de los 4 pasos de `como-trabajamos.astro` queda fuera del snap a propósito (ya tiene su propio scroll interno).
  - **Barra de navegación flotante abajo** (`Nav.astro`, solo móvil): la franja deja de estar fija arriba y flota como píldora de cristal claro cerca del pulgar. El panel a pantalla completa ahora crece desde abajo hacia arriba (antes desde arriba), gesto táctil de cierre invertido a conjunto.
  - **Logo en móvil:** en el `<h1>` de la portada manda el **SVG oficial vertical** (`public/logo/perfil-blanco.svg`, recortado al trazo); en la **píldora del menú vuelve a ser horizontal** y más grande (2026-08-05, 158 px de 375).
  - Verificado en navegador a 390px en las 8 rutas públicas (home, servicios, `/servicios/auditoria`, casos, contacto, sobre-atis, como-trabajamos, legal) + `/portal/login` (no usa `Nav.astro`, no afectado). Build limpio (`npm run build`, 21 páginas) y `npm run export` regenerado.

### Sesión 2026-08-05/06 — panel interno, portal real y rediseño (HECHA)

**El portal como empleado ya está construido y conectado**, así que la misión que había aquí queda cumplida. Resumen de lo que existe hoy:

- **Supabase es el motor.** Proyecto `rejsavvlflmfvrazzpsu`. Tablas `clientes`, `documentos`, `facturas` con RLS (el admin lo ve todo; cada cliente, solo lo suyo) y bucket privado `documentos`. Esquema en `supabase/schema.sql` y `supabase/schema_client_login.sql`. **Supabase es la fuente de verdad OPERATIVA; Notion se queda con lo estratégico** (decisión 2026-08-05, para no sincronizar dos sistemas sin clientes todavía).
- **`/admin/*`** (`AdminLayout.astro` + `src/lib/requireAdmin.ts`): resumen, alta y ficha de clientes, facturas con numeración correlativa, subida de documentos y lista de herramientas externas. Un solo admin, identificado por correo en `is_admin()`.
- **`/portal/*`** conectado a datos reales, con `src/lib/requireClient.ts`. Login por **contraseña**, con "crear cuenta" e "iniciar sesión" (antes enlace mágico: metía fricción y dejaba el portal intestable con buzones que no existen).
- **Cortina de acceso REAL** (`src/middleware.ts` + `/entrar`): contraseña en `SITE_GATE_PASSWORD`, solo en servidor, cookie `HttpOnly`. ⚠️ **Corregida el 2026-08-06: llevaba desde el principio sin tapar nada en producción.** Leía la variable con `import.meta.env`, que Vite sustituye **al compilar**, no al ejecutarse: en Vercel (sin `.env`) quedaba `undefined`, y la cortina entonces **se abría sola**. Ahora se lee con `astro:env/server` (declarada en `astro.config.mjs`) y **falla cerrada**: si falta la contraseña, cierra y avisa. Para abrir la web al público **hay que declararlo: `SITE_PUBLIC=true` en Vercel**; borrar la contraseña ya NO abre el sitio.

**Tres hallazgos técnicos que conviene no volver a tropezar:**

1. **`body { overflow-x: hidden }` rompe `position: sticky`** en todos sus descendientes: fuerza `overflow-y: auto` y convierte al body en contenedor de scroll. Rompía las tres coreografías del sitio a la vez. Se usa **`overflow-x: clip`**, que recorta igual sin crear contenedor.
2. **El sitio es `output: "server"`.** No es capricho: en modo estático Astro **no ejecuta el middleware** para páginas ya generadas, así que la cortina no habría tapado nada. Consecuencias: `getStaticPaths` deja de aplicarse (`/servicios/[slug]` resuelve por `Astro.params`), el sitemap necesita `customPages` para los 7 servicios, y `npm run export` queda roto.
3. **En iOS Safari, `vh` mide la ventana grande** (la de después de plegarse la barra). Por eso los campos se salían por abajo. En móvil se usa **`svh`**.

**Rediseño de esta sesión:** portada compacta con carril en manuscrita · casa del reel en 200vh y con margen para no cortarse en portátiles · **Sobre Atis rehecho** (mar en degradado, 8 islas en su geografía real, zoom por isla hasta plata plana con texto en negro, cierre en caja de cristal) · barrido de pizarra en la home móvil · Cómo trabajamos en diapositivas · justificado con partición por sílabas y zigzag · filetes de maquetación · **capa de shader interactiva** (`ShaderFondo.astro`, OGL, fusión soft-light) · CTA unificada.

### Sesión 2026-08-06 — verificación real y tres correcciones (HECHA)

**Se encontró por qué la sesión anterior no pudo verificar nada.** El navegador de Claude mantiene la página en `document.hidden`, y en ese estado el navegador **no dispara eventos de `scroll` ni ejecuta `requestAnimationFrame`**: toda la coreografía se queda congelada en el fotograma cero. Se salta sustituyendo `requestAnimationFrame` por ejecución síncrona y disparando el `scroll` a mano. **Limitación que queda:** las capturas solo rasterizan lo pintado al cargar, así que se puede *medir* cualquier posición pero no *mirarla*. Los juicios estéticos siguen dependiendo de Alejandro.

**Verificado y correcto** (medido, no supuesto): carril de portada (12 copias idénticas, bucle sin costura, izquierda a derecha) · islas de Sobre Atis (cero solapes, nada cortado, separación mínima 40-48 px en 1280/1440/375/390) · zoom por isla (vuelve a 1 entre islas, picos 7,7×/12×/8,9×, plata al 100 %, texto casi negro) · cierre en caja de cristal real · scroll libre en móvil (`proximity`, sin `stop: always`) · pie sin hueco muerto · acceso a cuenta con contraseña · **el `100vh` de `como-trabajamos` está detrás de un `matchMedia` de escritorio, así que NO corta en iOS**.

**Corregido esta sesión:**
- **Fuera la pantalla vacía antes de la CTA de cierre.** Ocupaba dos pantallas: el contenedor medía una y la CTA iba dentro recortada del todo con `clip-path: inset(100%…)`, destapándose solo con un 35 % ya en pantalla. Como el contenedor no tiene fondo, se veía una pantalla entera de campo claro vacío. Ahora ocupa una sola pantalla y entra por su contenido. De paso, `svh` en vez de `vh`.
- **Ni partición ni justificado en toda la web** (ver §4).
- **Una diapositiva por BLOQUE en escritorio**, en los dos bloques claros de la home (`.02` y `.03`), marcados con `data-slides`. **Escritorio y móvil NO hacen lo mismo, a propósito:** en móvil el bloque se trocea párrafo a párrafo (un bloque entero no cabe en un teléfono sin encoger la letra); en escritorio la diapositiva es el bloque completo, con su enunciado, su titular y sus párrafos juntos, a su escala normal de lectura. Trocear también en escritorio convertía la web de PC en la de móvil: ocho pantallas para lo que son dos ideas — **ese fue el error de la primera pasada, corregido en la segunda**. Dos paradas: primero izquierda, luego derecha, emparejadas con la dirección del barrido, y **todo el texto de una diapositiva en el mismo eje** (titular y párrafos). Medida de 62ch en cuerpo, 24ch en titulares. La llamada a la acción viaja con su texto, no se lleva una pantalla para ella sola (el móvil baja de 10 a 8 tramos).
  - ⚠️ **Trampa de especificidad:** las reglas de parada llevan `.rv-panel` en el selector a propósito. Sin él, `.read.right` (0,3,0) le gana a la parada (0,2,0) y la diapositiva coloca el bloque a la derecha con el texto alineado a la izquierda.

**Hallazgos abiertos que salieron de la verificación:** ver la lista de la sesión siguiente.

### 🎯 Lo que toca en la sesión siguiente

**1 · Los cuatro hallazgos de la auditoría, sin resolver.** Salieron el 2026-08-05 y siguen abiertos:

- 🔴 **`/portal/estado` y `/portal/financieros` enseñan datos inventados a clientes reales** (hitos con fechas falsas; gráfica con 2.800 € de retorno). Cuando era maqueta daba igual; ahora el login es real. Lo honesto es retirarlas hasta tener datos, o dejarlas con un "todavía sin datos". Igual `/portal/contacto`, cuyo formulario no envía nada.
- 🟠 **La política de cookies es falsa.** Dice que lo que se guarda "no viaja a ningún servidor" y describe un almacenamiento de sesión que ya no existe. Hoy hay dos cookies que sí viajan: `atis_gate` y las de Supabase. Son técnicamente necesarias (sin banner), pero hay que declararlas.
- 🟠 **Objetivos táctiles por debajo del mínimo.** Medido el 2026-08-06: "Menú" mide **36,7 × 16,4** y el **icono de cuenta 26 × 26** (este no estaba en la auditoría original). El mínimo son 44 × 44. Igual en escritorio y en móvil, y es la navegación principal para un público de 45-60 años.
- 🟠 **La tipografía se pide a Google** teniendo los ficheros en `scripts/fonts/`. Confirmado el 2026-08-06: son **cuatro** los archivos que enlazan a Google (`BaseLayout`, `PortalLayout`, `entrar.astro`, `portal/login.astro`) y los `.woff2` **no están en `public/fonts/`**, hay que copiarlos y escribir el `@font-face`.
- 🟠 **`100vh` sin corregir en la home.** `HomeV5.astro:296, 357, 364` (el reel y la CTA) siguen en `vh`. Es el mismo hallazgo de iOS ya documentado, sin aplicar aquí: en Safari de iPhone se pasan de largo por abajo. **Ojo al tocarlo:** la coreografía del reel calcula con `innerHeight`, así que cambiar solo el CSS puede descuadrarla — hay que mover las dos cosas a la vez.
- 🟡 **Las 8 islas de Sobre Atis llevan `loading="lazy"`** siendo lo primero que se ve en la página. Retrasa el primer pintado sin ganar nada.
- 🟡 **`.filete` es código muerto.** La utilidad está definida en `tokens.css:303` y **no se aplica en ningún sitio**. El filete como elemento de maquetación sí está resuelto, pero por otras reglas (`.read .k` abre cada bloque sobre su enunciado, más `.cells`, `.datos`, `.pointlist` y el carril de portada). O se usa la utilidad o se borra.
- 🟡 **Medio scroll sin nada que contar en el reel.** La animación de la casa termina en y=1070 y el bloque sigue hasta y=1790: 720 px en los que la composición ya acabada solo se desliza. No es plata vacía, pero se puede apretar.

**2 · Verificación visual pendiente (mucho menos que antes).** Con el método de la sesión del 2026-08-06 ya se puede medir cualquier posición, pero **no mirarla** (las capturas solo rasterizan lo pintado al cargar). Queda que Alejandro confirme en pantalla lo que es puro juicio estético: si el shader se lee como **grano y no como manchas**, y cómo quedan en movimiento las nuevas diapositivas de escritorio.

**3 · Pendientes de negocio:** cifra de facturación objetivo · nicho sin decidir (dental vs. reformas, INV-01) · páginas de servicio cortas (200-350 palabras; INV-07 pide 3.000-5.000, se amplían con contenido real, nunca con humo) · redes sin cuentas, los iconos del pie no enlazan · datos legales de la cooperativa · dominio sin elegir.

### Pasos que solo puede dar Alejandro (Claude no tiene esas credenciales)

1. **Supabase → Authentication → Sign In / Providers → Email: desactivar "Confirm email".** Sin esto, crear cuenta en el portal sigue mandando al buzón.
2. **Supabase → Authentication → URL Configuration:** poner la Site URL real (`https://the-studio-delta.vercel.app`).
3. **Cambiar la contraseña del admin en Supabase** para que NO sea la misma que la de la cortina: la de la cortina se comparte con quien se le enseñe la web.
4. **Vercel → Environment Variables:** que estén `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SITE_GATE_PASSWORD`, `NOTION_TOKEN` y `NOTION_CLIENTS_DB_ID`. Sin las dos últimas, **el formulario de contacto se pierde en silencio**.
5. **Comprobar que Vercel reconstruye de verdad.** El 2026-08-06 el repositorio iba por delante de lo desplegado y parecía que faltaban cambios que sí estaban subidos.

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

- **Ideas / Futuro + Modelo comercial — HECHO, ya no es idea (2026-08-05).** El portal de cliente dejó de ser maqueta: hay **Supabase** con auth real, base de datos y almacenamiento, un **panel interno `/admin`** (clientes, facturas con numeración correlativa, documentos) y `/portal/*` leyendo datos reales. Decisión de arquitectura a registrar: **Supabase es la fuente de verdad OPERATIVA y Notion se queda con lo estratégico**, para no mantener dos sistemas sincronizados sin clientes todavía. Sustituye a lo que decía la memoria `web-stack-decision.md`.
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
- **Brandbook · Identidad visual — cambios cerrados el 2026-08-05.** (a) **Fuera el botón de cristal**: había dos estilos de CTA conviviendo y se queda uno solo, texto en versalitas con filete, sin caja. (b) **La línea de 1 px pasa a elemento de maquetación**, no solo separador de tarjetas. (c) **Texto justificado con partición por sílabas** y, en móvil, bloques alternando izquierda y derecha. (d) **La manuscrita puede ir en carriles decorativos repetidos** (el claim de la portada), nunca como texto de lectura. (e) **Capa de shader interactiva** sobre todo el sitio, en fusión soft-light para que se adapte sola a cada campo.
- **Brandbook · Voz — el claim de portada.** *"la p\*ta primera cooperativa creativa"*, con asterisco, en manuscrita y sobre carril en marcha. Es posicionamiento, no decoración de una página.
- **Investigaciones · INV-09 — contradicción consciente.** INV-09 concluyó que el espectáculo tipo WebGL resta credibilidad con dueños de negocio de 45-60. Alejandro pidió shaders interactivos igualmente y se hicieron, deliberadamente sutiles. Conviene dejar escrito que la decisión se tomó **sabiendo** lo que decía la investigación, no por olvido.
- **Roadmap al MVP — cuatro pendientes de la auditoría del 2026-08-05, sin resolver:** datos inventados visibles a clientes reales en `/portal/estado` y `/portal/financieros` · política de cookies desactualizada (describe cookies que ya no existen y omite las que sí) · objetivos táctiles por debajo del mínimo en la barra de móvil · tipografía servida desde Google teniendo el archivo en el repositorio.
- **Brandbook · Identidad visual — LA PARTICIÓN DE PALABRAS QUEDA PROHIBIDA (2026-08-06, decisión de Alejandro).** Contradice y sustituye a lo que se apuntó el 2026-08-05 en esta misma cola ("texto justificado con partición por sílabas"): **eso ya no vale y no debe volcarse a Notion tal cual**. La regla nueva: ninguna palabra se parte en ninguna parte de la web, y por tanto **tampoco se justifica** (justificar en español sin partir abre ríos de espacio). Texto en bandera contra el lado de su bloque, borde contrario irregular.
- **Brandbook · Identidad visual — la diapositiva es el BLOQUE, no el párrafo (2026-08-06).** "Un scroll, una animación, una diapositiva" pasa a patrón de marca, activable por bloque. **Escritorio y móvil se comportan distinto a propósito:** en móvil se trocea párrafo a párrafo porque el bloque no cabe; en escritorio la diapositiva es el bloque entero a su escala normal de lectura. Dos paradas (izquierda, derecha) frente a las cuatro del móvil, con todo el texto de una diapositiva en el mismo eje y medida acotada (62ch cuerpo, 24ch titulares).
- **Brandbook · Identidad visual — ninguna pantalla se queda vacía.** Regla de maquetación salida de dos fallos reales el mismo día: la CTA de cierre enseñaba una pantalla entera de campo vacío antes de aparecer, y la llamada a la acción se llevaba una diapositiva para ella sola. Si un elemento no llena la pantalla, viaja con el texto al que pertenece.
- **Roadmap al MVP — `npm run export` roto** desde que el sitio pasa a render en servidor. Decidir si se recupera o se retira: la web ya está publicada y esa copia offline puede haber dejado de tener sentido.
