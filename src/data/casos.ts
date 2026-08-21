/*
  Los datos del sector, en un solo sitio (2026-08-21).

  Vivían escritos a mano dentro de `/casos`, y la home llevaba una copia
  recortada de tres de ellos con el texto ligeramente distinto. Dos versiones
  del mismo dato es como se acaba publicando una cifra vieja en un sitio y la
  nueva en otro, y estas cifras son el argumento de venta.

  ⚠️ NINGUNA CIFRA DE AQUÍ SE INVENTA NI SE REDONDEA. Todas están citadas a
  nuestra propia investigación de mercado (INV-01, INV-02) y NO son resultados
  de clientes de The Studio, que es lo que explica la nota de transparencia de
  `/casos`. Para añadir una línea hace falta una fuente documentada.
*/
export interface Caso {
  sector: string;
  /** La cifra grande. Si es un número limpio, cuenta al entrar en pantalla. */
  big: string;
  query: string;
  /** El texto largo, el de la página de casos. */
  text: string;
  /** La versión corta, para la tarjeta de la home. */
  corto: string;
  source: string;
}

export const casos: Caso[] = [
  {
    sector: "Dental",
    big: "80%",
    query: "Cómo evito que los pacientes falten a la cita",
    text: "Pierdes entre el 20 y el 30% de tus pacientes al año por falta de seguimiento. Un recordatorio automático por WhatsApp reduce los no-shows hasta un 80%.",
    corto: "Un recordatorio automático por WhatsApp corta los no-shows hasta ese porcentaje.",
    source: "INV-01 / INV-02",
  },
  {
    sector: "Reformas",
    big: "x21",
    query: "Cuánto tardo en contestar a un lead",
    text: "Más de la mitad de los leads se pierden por no responder a tiempo. Contactar en menos de 5 minutos multiplica por 21 las posibilidades de cerrar.",
    corto: "Contestar en menos de 5 minutos multiplica por 21 tus opciones de cerrar.",
    source: "INV-01 (HBR)",
  },
  {
    sector: "Dental",
    big: "30%",
    query: "Por qué no aceptan mis presupuestos",
    text: "Solo aceptas entre el 35 y el 50% de los presupuestos que propones. El seguimiento automático sube la aceptación hasta un 30%.",
    corto: "No es el precio, es la confianza. Automatizar el seguimiento sube la aceptación hasta un 30%.",
    source: "INV-01",
  },
  {
    sector: "Dental",
    big: "2.160€",
    query: "Cuánto vale de verdad un paciente",
    text: "Un paciente vale de media 2.160€ para tu clínica. Captarlo cuesta entre 65 y 135€. Automatizar el seguimiento se recupera en el primer mes.",
    corto: "Lo que vale de media un paciente. Captarlo cuesta entre 65 y 135€.",
    source: "INV-01",
  },
  {
    sector: "Reformas",
    big: "3-7%",
    query: "Cuánto margen se me escapa",
    text: "Tu margen neto ronda el 3 y el 7%. Cada presupuesto que se pierde por falta de seguimiento es margen que no vuelve.",
    corto: "Tu margen neto. Cada presupuesto perdido por falta de seguimiento no vuelve.",
    source: "INV-02",
  },
  {
    sector: "Reformas",
    big: "Confianza",
    query: "Precio o confianza, qué pesa más",
    text: "Un presupuesto desglosado y rápido sube la aceptación. En un comprador racional, la confianza pesa más que el precio.",
    corto: "Un presupuesto desglosado y rápido sube la aceptación más que bajar el precio.",
    source: "INV-02",
  },
];
