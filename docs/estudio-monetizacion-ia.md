# Estudio de mercado: monetizar con IA (Claude) — de hoy mismo a vivir de ello

> Documento de trabajo personal, no relacionado con el código de Flora salvo en
> la sección 3.1, donde se analiza monetizar la propia app.

## 0. Tu punto de partida

La mayoría del contenido "gana dinero con IA" está pensado para gente sin
ninguna habilidad previa. Tú no partes de cero:

- Ya sabes construir software real con Claude Code (esta app es la prueba).
- Tienes un producto terminado y funcional (Flora) que sirve como portfolio.
- Eres bilingüe ES/EN, lo que duplica el mercado direccionable en casi todo lo
  de abajo.
- Conoces un nicho (yoga/pilates/fitness/bienestar) con dolor real ya
  identificado.

Esto cambia la estrategia: en vez de "vender humo de IA", puedes vender
**resultados construidos con IA**, que es mucho más defendible y mejor pagado.

## 1. Mapa de oportunidades

| Vía | Tiempo a primer ingreso | Techo de ingresos | Esfuerzo de venta | Competencia |
|---|---|---|---|---|
| Freelance "MVP/automatización con IA" | 3–10 días | Medio (techo por horas) | Bajo (plataformas) | Alta pero poco cualificada |
| Automatización para pymes locales | 1–3 semanas | Alto (recurrente) | Alto (puerta fría) | Baja en tu zona probablemente |
| Copywriting/contenido asistido | 2–7 días | Bajo–medio | Bajo | Muy alta, mal pagado |
| Monetizar Flora | 4–12 semanas | Medio, lento, pasivo | Medio (marketing) | Alta (mercado fitness apps) |
| Micro-SaaS de nicho | 3–8 semanas | Alto si encaja | Medio | Baja si el nicho es estrecho |
| Infoproducto "construye apps con IA" | 2–6 semanas | Medio | Alto (necesita audiencia) | Alta |

La columna importante es la segunda: para **dinero ya** vas a la fila 1 y 2;
para **vivir de ello** necesitas migrar hacia las filas 2, 4 y 5 combinadas.

## 2. Ingresos inmediatos (0–14 días)

### 2.1 Freelance "te construyo tu MVP/automatización con IA"

Con Claude Code puedes entregar en horas lo que a un freelance normal le lleva
días: landing pages, paneles de administración, scrapers, integraciones de
APIs, dashboards internos, bots.

- **Plataformas**: Malt (España, mejor pagado), Workana/Comunidad LATAM,
  Fiverr, Upwork.
- **Paquetes que se venden bien ahora mismo**:
  - Landing page + formulario + email automático: 150–400 €, 1–2 días.
  - MVP de app móvil sencilla (Expo, como esta): 600–2.000 €, 1–2 semanas.
  - Bot de WhatsApp/Instagram con respuestas automáticas (API de Claude): 300–900 € de alta + 50–150 €/mes mantenimiento.
  - Scraping/automatización de datos repetitivos: 200–600 € por proyecto.
- **Acción concreta hoy**: publica 2–3 "gigs" con precio fijo y plazo fijo
  (no por horas — vendes resultado, no tiempo). Usa Flora como pieza de
  portfolio ("app completa construida en N días").

### 2.2 Automatización para pymes locales (la vía mejor pagada a corto plazo)

Negocios físicos (clínicas, gimnasios, academias, restaurantes, asesorías)
pagan bien por quitarse trabajo manual de encima, y casi nadie en tu zona les
está ofreciendo esto todavía.

- **Qué vender**: bot de WhatsApp Business para reservas/FAQs, respuesta
  automática de leads, generación automática de informes/facturas, agente
  que resume y prioriza emails.
- **Cómo se construye**: Claude API + n8n/Make como capa de automatización
  (no necesitas reinventar infraestructura).
- **Precio**: 300–800 € de implementación + 50–150 €/mes de mantenimiento.
  Con 8–10 clientes de mantenimiento ya tienes un colchón mensual estable.
- **Cómo conseguir los primeros clientes**: puerta fría/LinkedIn local,
  no marketplaces (ahí no buscan esto). Ofrece la primera automatización con
  descuento o gratis a 1–2 negocios a cambio de testimonio + caso de uso
  documentado — es tu palanca de venta para el resto.

### 2.3 Copywriting/contenido asistido (relleno, no base)

Rápido de empezar pero el mercado está saturado y mal pagado (la IA ha bajado
el precio del texto genérico a casi cero). Útil solo como ingreso puente
mientras arrancan 2.1/2.2, no como estrategia central.

## 3. Construir activos (2–12 semanas)

Esto es lo que te permite dejar de depender de vender horas/proyectos uno a
uno.

### 3.1 Monetizar Flora

Hoy Flora es 100% local, sin cuentas, sin servidor — cero infraestructura de
cobro. Opciones realistas, de menor a mayor esfuerzo:

1. **Pro de pago único** (Expo IAP / RevenueCat): desbloquea más rutinas,
   estadísticas avanzadas, exportar progreso, sin "anuncio" de marca. Es lo
   más simple de implementar sobre la arquitectura actual.
2. **Freemium con suscripción** (RevenueCat + backend mínimo): requiere
   romper el "100% local" actual, más trabajo técnico.
3. **Publicarla en Play Store/App Store** y monetizar con una versión Pro,
   apoyándote en contenido orgánico (Reels/TikTok mostrando rutinas) para
   adquisición — sin presupuesto de ads, el crecimiento será lento.

**Expectativa realista**: el mercado de apps de fitness está dominado por
marcas grandes (Nike Training, Adidas Training, Down Dog, etc.). Sin
inversión en marketing, esto da ingresos modestos y lentos (cientos de €/mes
en el mejor caso a medio plazo), salvo que construyas audiencia en redes en
paralelo. Es un buen activo de portfolio y aprendizaje, no tu plan A para
"vivir de ello" en los próximos meses.

### 3.2 Micro-SaaS de nicho

La jugada con mejor ratio esfuerzo/retorno a medio plazo. Con Claude Code
puedes sacar un MVP vendible en días, no meses. Ejemplos concretos
conectados con lo que ya sabes hacer:

- Generador de rutinas/planificador de clases para **profesores freelance**
  de yoga/pilates (ellos venden a sus alumnos, tú les vendes la herramienta).
- Sistema de reservas + recordatorios automáticos para estudios pequeños que
  no quieren pagar un Mindbody/Glofox caro.
- Panel simple de seguimiento de clientes para entrenadores personales.

Precio objetivo: 15–50 €/mes vía Stripe. Distribución: comunidades de
profesores de yoga/pilates en Facebook/Instagram/Telegram, no SEO (demasiado
lento). Con 30–40 clientes de pago tienes un sueldo.

### 3.3 Infoproducto "construir apps con Claude Code"

Viable pero requiere audiencia previa (no la tienes todavía), así que es una
vía de **meses**, no de semanas. Tiene sentido como subproducto derivado de
documentar públicamente cómo construyes Flora y tus automatizaciones (2.1/2.2),
no como punto de partida.

## 4. Vivir de ello (3–12 meses): la combinación que funciona

El error típico es elegir una sola vía. La combinación realista:

1. **Base de caja**: 1–2 clientes de automatización recurrente (2.2) cubren
   gastos fijos desde el mes 1–2.
2. **Crecimiento**: freelance puntual (2.1) mientras consigues más clientes
   recurrentes.
3. **Apalancamiento**: 1 micro-SaaS (3.2) que empieza pequeño y compone mes a
   mes sin que tengas que vender tu tiempo cada vez.
4. **Marca/portfolio**: Flora (3.1) como demostración pública de lo que
   sabes hacer — te trae clientes de 2.1/2.2 sin que la tengas que monetizar
   directamente tú mismo.

Progresión de ingresos razonable (no garantizada):

- Mes 1: 300–800 € (freelance + primer cliente de automatización).
- Mes 2–3: 1.000–2.000 €/mes (2–3 clientes recurrentes + algún proyecto).
- Mes 4–6: +300–1.000 €/mes adicionales si el micro-SaaS prende.

## 5. Riesgos y realismo

- El mercado de "gurús de IA" vende cursos, no construye productos — no caigas
  en prometer en tu propio marketing más de lo que puedes entregar.
- En España necesitas alta como autónomo (o facturar vía cooperativa/factura
  de otra forma legal) en cuanto haya ingresos recurrentes — no lo dejes para
  el final, Hacienda no perdona retroactivamente.
- El freelance es rápido pero impredecible (mes bueno, mes malo); el SaaS es
  lento al principio pero compone. No abandones 2.2/3.2 tras el primer mes
  flojo — son las que dan estabilidad real.

## 6. Plan de 30 días

- **Semana 1**: perfiles en Malt/Workana + 2–3 paquetes con precio fijo
  definidos; convertir Flora en pieza de portfolio (landing/demo pública);
  lista de 30 negocios locales objetivo para automatización.
- **Semana 2**: contacto con los 30 negocios (puerta fría/LinkedIn, 5–10/día);
  aplicar a 10 ofertas freelance; cerrar el primer proyecto pequeño.
- **Semana 3**: entregar el primer proyecto; empezar el MVP del micro-SaaS o
  la primera automatización piloto (gratis/descuento a cambio de caso de
  estudio).
- **Semana 4**: revisar qué canal convirtió mejor y duplicar esfuerzo ahí;
  fijar precios definitivos de mantenimiento recurrente.

## 7. Cómo usar Claude/Claude Code en cada vía

- **Claude Code**: construir los MVPs y automatizaciones de las secciones
  2.1, 2.2 y 3.2 en días en lugar de semanas — es tu ventaja de velocidad
  frente a otros freelancers.
- **Claude API** (vía n8n/Make o integración directa): el motor de los bots
  de WhatsApp/Instagram y de la clasificación/respuesta automática de
  mensajes en 2.2.
- **Claude (chat/Projects)**: redactar propuestas comerciales, scripts de
  puerta fría, contenido de la landing de Flora, y documentar casos de uso
  para usarlos como prueba social.
