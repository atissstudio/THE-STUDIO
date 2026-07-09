# The Studio, by Atis — Modelo de decisión (mercado + ICP + pricing)

> Generado el 08/07/2026 a partir de investigación de mejores prácticas contrastadas (no de conclusiones heredadas del TFG). Objetivo: sustituir la intuición por un modelo de decisión multicriterio (MCDA) explícito — no es una ecuación cerrada de una sola salida, es un pipeline de 3 etapas con filtros duros, scores ponderados y validación empírica en cada paso.

**Honestidad de partida**: no existe una fórmula matemática cerrada que determine mercado+precio+público sin intervención humana ni datos reales del mercado. Lo que sigue es la versión rigurosa y real de eso: un modelo con variables explícitas, pesos, umbrales de descarte y pasos de validación con datos — el estándar real de la consultoría estratégica seria (McKinsey/GE, Geoffrey Moore, April Dunford), no heurística de blog.

---

## Etapa 0 — Filtro de encaje con Atis (gate binario, no puntuado)

Antes de puntuar nada, cualquier mercado/nicho/cliente candidato pasa por una única pregunta abierta, no una lista de casillas: **¿esto apoya a Canarias, es neutral (no la apoya pero tampoco la perjudica), o la perjudica?**

- **Apoya** o **neutral** → pasa el filtro, entra en la Etapa 1.
- **Perjudica** → único caso de descarte. No hay más motivos de exclusión en esta etapa.

Deliberadamente abierto y sin sub-criterios cerrados: se evalúa caso por caso (ej. un mismo sector, como inmobiliario, puede ser neutral en un cliente y perjudicial en otro si el proyecto concreto empuja gentrificación o especulación) — no se descartan categorías enteras de mercado a priori, se descartan proyectos/clientes concretos que perjudiquen.

---

## Etapa 1 — Selección de mercado/nicho (scoring de 2 ejes)

Patrón dominante en la literatura contrastada (GE-McKinsey Nine-Box, Segmentation Attractiveness-Fit Matrix): **dos ejes separados**, nunca mezclados en una sola lista de variables — uno mide si el mercado es bueno en sí mismo (externo), el otro si Atis puede ganar en él (interno).

### Eje A — Atractivo del mercado (externo, agnóstico a quién eres)
| Criterio | Peso orientativo |
|---|---|
| Tamaño de mercado / nº de prospectos alcanzables | 20% |
| Tasa de crecimiento | 15% |
| Rentabilidad / disposición a pagar / ticket medio | 25% |
| Intensidad competitiva (nº y fuerza de competidores) | 20% |
| Riesgo / ciclicidad / estabilidad regulatoria | 15% |
(pesos orientativos basados en el modelo publicado más citado —roadtooffer— ajustable según prioridad: si el objetivo inmediato es caja rápida, subir peso de rentabilidad y bajar el de crecimiento)

### Eje B — Encaje / capacidad de ganar (interno, específico de Atis)
| Criterio |
|---|
| Expertise/capacidad ya demostrada (no aspiracional) |
| Diferenciación real posible frente a alternativas |
| Accesibilidad del comprador (¿se puede construir una lista de prospectos real?) |
| Efecto spillover hacia otros módulos futuros de Atis |
| Velocidad de cierre esperada (ciclo de venta) |

Escala 1-5 por criterio en cada eje, máximo 5-8 criterios por eje (más criterios añaden ruido, no señal — hallazgo consistente en las fuentes). Resultado: cada mercado candidato se ubica en una matriz 2D de 9 cuadrantes; solo los que caen en la zona alto-atractivo/alto-encaje pasan a la Etapa 2.

### Filtro duro adicional (umbrales de David C. Baker, específicos de agencias/consultoras — no genéricos)
- **10 a 200 competidores identificables** en el nicho. Menos de 10 → probablemente el nicho no es real o no es sostenible. Más de 200 → no está lo bastante enfocado.
- **2.000 a 10.000 prospectos potenciales**. Menos → mercado insuficiente. Más → hay que estrechar el posicionamiento.
- Si en algún momento se captura más del 3-4% de un nicho, es señal de estar infra-precificando.

Estos umbrales son el único criterio con rango numérico concreto pensado específicamente para negocios de servicios/agencia (no genérico de industria) — se aplican como filtro antes o junto con el scoring de la matriz.

---

## Etapa 2 — Definición del público objetivo / ICP (dentro del mercado ya elegido)

Secuencia (no son alternativas entre sí, cada framework resuelve una pregunta distinta):

1. **JTBD (Jobs-to-be-Done)** — entrevistas a quien *recientemente* contrató algo similar a lo que Atis ofrecería, para identificar qué "trabajo" están intentando resolver (no su demografía). Esto acota el segmento por urgencia real del problema, no por perfil imaginado.
2. **Beachhead checklist de Geoffrey Moore** (*Crossing the Chasm*) — 8 criterios puntuados 1-5 (total 4-20), con regla dura: si un criterio puntúa muy bajo respecto al resto, descarta el segmento aunque el resto encaje ("showstopper"):
   1. Comprador económico identificable con presupuesto y autoridad
   2. Razón de compra convincente
   3. Atis puede entregar el "producto completo" (no una promesa parcial)
   4. Competencia — ¿alguien ya domina este segmento?
   5. Partners/aliados disponibles
   6. Canal de distribución/llegada viable
   7. Precio compatible con el presupuesto real del segmento
   8. Credibilidad de posicionamiento de Atis en ese segmento
3. **"Best-fit customer" de April Dunford** — validación empírica: dentro de los que ya pasaron los dos filtros anteriores, ¿cuáles reaccionarían con entusiasmo desproporcionado al diferencial de Atis? (no "podrían comprar", sino "les importa mucho"). Se valida con clientes reales, no con personas hipotéticas.
4. **MEDDIC / Mahan Khalsa** — se convierte en el checklist de calificación por cuenta una vez se empieza a prospectar dentro del ICP ya definido: dolor identificado (Identify Pain), comprador económico accesible (Economic Buyer), proceso de decisión conocible.
5. **Modelo fit/intent (0-100 ponderado)** — para priorizar prospectos concretos dentro del ICP ya validado: fit firmográfico ~35%, fit tecnográfico/madurez ~25%, triggers de compra ~25%, señales de comportamiento ~15%. Tier A/B/C para ordenar a quién perseguir primero.

**Regla de coherencia**: si el ICP que sale de este proceso no encaja con el mercado elegido en la Etapa 1 (p. ej. el "job" agudo apunta a un segmento sin presupuesto real, o Moore descarta por showstopper), se vuelve a la Etapa 1 — no se fuerza el ICP a encajar en un mercado ya "decidido" de antemano.

---

## Etapa 3 — Pricing (con mercado + ICP ya definidos)

### Techo racional — EVC (Economic Value to the Customer, McKinsey 1979)
```
EVC = Valor de referencia (lo que el cliente pagaría por su mejor alternativa actual:
      freelancer, otra agencia, contratar interno, no hacer nada)
    + Valor de diferenciación (impacto económico incremental estimado:
      ingresos, ahorro, reducción de riesgo — estimado JUNTO al cliente,
      no unilateralmente, en una conversación de descubrimiento)
    − Coste de cambio/adopción para el cliente (fricción, tiempo interno)
```
Es el marco con más trazabilidad académica de todo el corpus (McKinsey + texto de referencia Nagle & Holden).

### Piso — coste real de entrega
Horas estimadas × coste interno real. Se usa **solo como verificación de rentabilidad mínima**, nunca como ancla de venta ni se revela al cliente (lección consistente entre fuentes: mostrar el piso al cliente destruye el value pricing y lo convierte en cost-plus disfrazado).

### Regla de proporción — Alan Weiss (10:1)
El fee no debería superar aproximadamente 1/10 del valor total generado para el cliente. Es el único bound numérico explícito y citable de toda la literatura de value pricing consultada.

### Validación sin histórico propio (cold-start) — Van Westendorp + Gabor-Granger
Dado que The Studio no tiene ventas propias que calibren el modelo:
- **Van Westendorp** (4 preguntas abiertas a una muestra del ICP ya definido: demasiado barato / barato / caro / demasiado caro) → da un corredor de precio aceptable (PMC–PME) antes de vender nada. Idealmente 100-200 respuestas cualificadas para resultado direccional en B2B; con menos, tratar como orientativo, no concluyente.
- **Gabor-Granger** (¿comprarías a precio X?, sobre una serie de precios) dentro de ese corredor, para afinar el precio óptimo y calibrar los saltos entre niveles del paquete.
- Alternativa barata mientras se acumulan datos propios: enunciar el precio más alto **verbalmente** en la primera conversación con cada prospecto real, antes de mandar propuesta escrita — funciona como un Gabor-Granger en vivo, proyecto a proyecto.

### Empaquetado — Good-Better-Best (con efecto ancla/señuelo)
- 3 niveles. El superior se ancla cerca del techo EVC. El inferior se ancla en el piso de rentabilidad + mínimo viable de valor percibido. El nivel medio se calibra deliberadamente para ser la opción más atractiva por comparación (no equidistante en precio, sino diseñado psicológicamente).
- El nivel superior se presenta primero (ancla alta), no el más barato.
- Precedente real ya existente en Atis (caso IMOVIL CANARIAS): Esencial 400€ único / Crecimiento 250€/mes / Completo 600€+250€/mes — útil como referencia de formato de empaquetado, no como precio a copiar (los precios concretos deben salir del EVC + Westendorp del nuevo ICP, no de este precedente).

---

## Cómo se retroalimenta el modelo (para la automatización futura)

Cada conversación real con un prospecto es a la vez: (a) una prueba de la Etapa 2 (¿de verdad reacciona con el entusiasmo que predijo Dunford?), y (b) una prueba de la Etapa 3 (¿el corredor de Westendorp se sostiene en la vida real?). Solo cuando este pipeline se haya corrido manualmente 2-3 veces con clientes reales tiene sentido convertirlo en cuestionario/hoja de cálculo reutilizable — sistematizar antes de tener esa validación es construir una herramienta para un modelo que aún no se ha probado.

---

## Fuentes principales (detalle completo con más referencias en la investigación original)
- Mercado: GE-McKinsey Nine-Box (McKinsey & GE, 1970s); roadtooffer.com Six-Dimension Scorecard; umbrex.com Segmentation Attractiveness-Fit Matrix; David C. Baker, *The Business of Expertise* / punctuation.com.
- ICP: Geoffrey Moore, *Crossing the Chasm*; Clayton Christensen & Bob Moesta, JTBD (*Competing Against Luck*, *Demand-Side Sales 101*); April Dunford, *Obviously Awesome*; MEDDIC/MEDDPICC; Mahan Khalsa, *Let's Get Real or Let's Not Play*.
- Pricing: Economic Value to the Customer (Forbis & Mehta, McKinsey, 1979); Nagle & Holden, *The Strategy and Tactics of Pricing*; Van Westendorp Price Sensitivity Meter; Gabor-Granger; Alan Weiss, *Value-Based Fees*; Blair Enns, *Pricing Creativity* / *The Four Conversations*.
