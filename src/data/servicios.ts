/*
  Catálogo de servicios. Fuente única: de aquí salen /servicios, las páginas
  /servicios/[slug] y las tarjetas de la home. Copy escrito por Alejandro
  (2026-08-03), con la puntuación adaptada a la regla del proyecto (sin guion
  largo, sin dos puntos, sin punto y coma).
*/
export interface Servicio {
  slug: string;
  /** Nombre corto, para tarjetas y navegación */
  title: string;
  /** Titular completo de la página, en caja normal */
  heading: string;
  /** Frase de apoyo bajo el titular */
  lead: string;
  /** Resumen de una línea para las tarjetas */
  card: string;
  /**
   * Lo que te llevas, en una línea corta. Ocupa el sitio donde la referencia
   * (lorolabs.ai) pone el precio, que es lo que cualifica al visitante. Aquí no
   * se pone precio porque no hay cifras cerradas (INV-04 en espera) y no se
   * inventan. Cuando existan, se sustituye este campo sin tocar el diseño.
   */
  entregable: string;
  /**
   * Fotografía de la ficha, 4:3. Todavía no existe (las hace Alejandro). Sin
   * ella, la ficha pinta su campo de color con la isla de plata dentro, que es
   * un estado válido y de marca, no un hueco roto.
   */
  foto?: string;
  /** Cuerpo de la página, un elemento por párrafo */
  body: string[];
  /** Isla de plata que asoma al pasar el ratón por la tarjeta */
  isla: string;
}

export const servicios: Servicio[] = [
  {
    slug: "auditoria",
    title: "Auditoría de negocio",
    heading: "Descubrimos la magia de tu empresa",
    lead: "El punto de partida de todo lo que hacemos juntos.",
    card: "Analizamos tu negocio desde dentro y te damos la hoja de ruta exacta.",
    entregable: "Te llevas la hoja de ruta",
    isla: "/plata/isla-01.webp",
    body: [
      "Hay negocios de toda la vida que tienen un algo especial, y sabemos que el tuyo es uno de ellos. En nuestra auditoría de negocio, nos sentamos contigo, te escuchamos y analizamos tu empresa desde dentro.",
      "Queremos entender por qué tu negocio funciona, cuál es ese valor único que te hace diferente y, lo más importante, enseñarte cómo explotarlo.",
      "No queremos cambiar tu esencia, queremos modernizar tu negocio tradicional y darte la hoja de ruta exacta para que sigas creciendo con fuerza, ya sea mejorando tu imagen, tu comunicación o tus ventas.",
    ],
  },
  {
    slug: "branding",
    title: "Branding",
    heading: "La personalidad de tu negocio",
    lead: "Tu empresa es mucho más que un logotipo bonito.",
    card: "Creamos tu marca y tu identidad para que transmitas confianza y te diferencies.",
    entregable: "Te llevas tu identidad completa",
    isla: "/plata/isla-05.webp",
    body: [
      "El branding es la personalidad de tu negocio, lo que la gente siente y recuerda cuando piensa en ti.",
      "Te ayudamos en toda la creación de marca y el diseño de tu identidad corporativa para que transmitas confianza, te diferencies de la competencia y, sobre todo, conectes de forma genuina con tus clientes ideales.",
    ],
  },
  {
    slug: "inteligencia-artificial",
    title: "Soluciones de IA",
    heading: "Hacemos el trabajo que nadie quiere hacer",
    lead: "El mundo avanza rápido y queremos que vayas un paso por delante.",
    card: "Automatizamos lo repetitivo con IA adaptada a tu día a día.",
    entregable: "Te llevas las horas que te comen",
    isla: "/plata/isla-02.webp",
    body: [
      "Te ayudamos a integrar soluciones de inteligencia artificial para empresas de forma sencilla y adaptada a tu día a día.",
      "Automatizamos tareas repetitivas, mejoramos la atención a tus clientes y optimizamos tus recursos usando las mejores herramientas de IA.",
      "No vamos a quitarle el trabajo a nadie, vamos a hacer el que nadie quiere hacer. No necesitas ser un experto en tecnología, nosotros lo hacemos fácil para ti.",
    ],
  },
  {
    slug: "plan-de-marketing",
    title: "Plan de marketing",
    heading: "La ruta exacta para multiplicar tus ventas",
    lead: "No nos gustan las suposiciones, nos gustan los resultados.",
    card: "La estrategia paso a paso para atraer a tus clientes ideales.",
    entregable: "Te llevas la estrategia paso a paso",
    isla: "/plata/isla-03.webp",
    body: [
      "Un plan de marketing digital es la estrategia paso a paso que diseñamos a medida para tu negocio.",
      "Analizamos tu mercado, definimos tus objetivos y trazamos las acciones de marketing exactas que necesitamos ejecutar para atraer a tus clientes ideales y aumentar tus ingresos de forma medible y sostenida en el tiempo.",
    ],
  },
  {
    slug: "plan-de-comunicacion",
    title: "Plan de comunicación",
    heading: "Encontramos tu voz",
    lead: "Hablar por hablar no sirve de nada si el mensaje no llega a la persona adecuada.",
    card: "Definimos qué contar, en qué tono, en qué canal y en qué momento.",
    entregable: "Te llevas tu mapa de mensajes",
    isla: "/plata/isla-04.webp",
    body: [
      "Un plan de comunicación es tu mapa del tesoro. Define qué vamos a contar, en qué tono, a través de qué canales y en qué momento.",
      "Diseñamos una estrategia de comunicación clara para que cada vez que tu marca hable, el público adecuado preste atención y entienda perfectamente el valor de lo que ofreces.",
    ],
  },
  {
    slug: "seo-web",
    title: "SEO web",
    heading: "Haz que tus clientes te encuentren en Google",
    lead: "De nada sirve tener la página web más bonita del mundo si está escondida en un cajón donde nadie la ve.",
    card: "Llevamos tu negocio a la calle más transitada de internet.",
    entregable: "Te llevas visitas que ya te buscaban",
    isla: "/plata/isla-06.webp",
    body: [
      "Con nuestro servicio de posicionamiento web SEO, trabajamos para llevar a tu negocio a la calle más transitada de internet, los primeros resultados de Google.",
      "Optimizamos tu web para que atraigas más visitas de calidad, es decir, personas que ya están buscando lo que tú vendes.",
    ],
  },
  {
    slug: "gestion-editorial",
    title: "Gestión editorial",
    heading: "Damos vida a tus contenidos",
    lead: "Tú pones la idea, nosotros ponemos las palabras.",
    card: "Nos encargamos del calendario, los temas y la redacción, de principio a fin.",
    entregable: "Te llevas el calendario y los textos",
    isla: "/plata/isla-07.webp",
    body: [
      "Sabemos que mantener un blog, una revista o las publicaciones de tu negocio al día es un dolor de cabeza cuando tienes mil cosas más que hacer.",
      "Con nuestro servicio de gestión editorial, nosotros nos encargamos de todo el proceso. Desde la planificación del calendario y la investigación de temas, hasta la creación de contenidos y la redacción final.",
      "Tú pones la idea, nosotros ponemos las palabras perfectas para enganchar a tu audiencia.",
    ],
  },
];

export const getServicio = (slug: string) => servicios.find((s) => s.slug === slug);
