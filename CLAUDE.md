# Un Deseo — contexto del proyecto

Este archivo lo lee Claude Code automáticamente al abrir el proyecto. Sirve para que tengas todo el contexto sin tener que volver a explicarlo.

## Qué es esto

"Un Deseo" (undeseo.com.ar) es una plataforma de listas de regalos para eventos (baby shower, cumpleaños, casamiento, etc). Los invitados abren un link, ven la lista, y reservan regalos sin necesidad de crear cuenta. Es un proyecto independiente de "Go Baby" (otro negocio de la dueña), intencionalmente sin marca cruzada.

## Sobre mí (la persona que va a pedir los cambios)

- Mi capacidad técnica es limitada — no sé programar. Explicame los pasos manuales (Supabase, Vercel) bien detallados, paso a paso, con nombres exactos de botones.
- Prefiero que vos hagas los cambios de código directo (por eso empecé a usar Claude Code), pero yo sigo teniendo que hacer a mano: correr SQL en Supabase, y a veces confirmar un redeploy en Vercel si no se dispara solo.
- Cuando algo necesite una migración de base de datos, dame el SQL exacto para copiar y pegar en el SQL Editor de Supabase.

## Stack técnico

- Next.js (App Router) + TypeScript + Tailwind CSS v4 (colores como variables CSS en `src/app/globals.css`, no `tailwind.config`)
- Supabase: Auth (Google OAuth + magic link), Postgres, Storage
- Vercel: hosting + deploy automático al hacer push a `main`
- Resend: mails
- PostHog: analytics (eventos clave, session replay)
- Vercel Analytics: activado

## Identidad de marca (ya definida, no cambiar sin que lo pida explícitamente)

- **Verde principal:** `#274734` (medido directo del logo aprobado) — se usa para textos, botones, íconos. Vive en `--color-ink`, `--color-sage` en globals.css.
- **Sage/verde secundario (hover, detalles):** `--color-sage-dark: #1B3226`
- **Rosa:** `#E7A2AC` / dark `#C97F8C`
- **Amarillo (fondos de botones/badges tipo sticker):** `#ECE192` — este es el amarillo "brillante" de marca, tomado de los stickers oficiales. Ojo: hay otro amarillo más pálido (`--color-amber: #E1DAA9`) que se usa en otros lados (menos protagonista); no confundirlos.
- **Celeste nuevo (sumado para los íconos de "cómo funciona"):** `#B3CDF1`, medido del sticker de manitos-corazón.
- **Crema (fondo base):** `#F7F2EB`
- Tipografías: Fraunces (display/títulos), Jost (texto), IBM Plex Mono (precios/labels tipo "PASO 1")
- Logo real en `public/logo.png` (fondo transparente). Debe ser el elemento más grande/protagónico del hero, más que cualquier texto.
- Los "stickers" ondulados tipo nube (ej. el cartel "✦ Sugerido") se hacen con **varios círculos SVG iguales superpuestos en fila** (no con un `<path>` de flor/pétalos — eso quedó irregular y no lo quiere más). Ver `src/app/l/[id]/SponsoredItemCard.tsx` como referencia del patrón correcto.
- Al ajustar tamaños de stickers/badges: la persona quiere texto legible (no diminuto) y el marco bien ajustado al texto, sin espacio en blanco de sobra. Si se reduce el contenedor CSS después de fijar el viewBox, el texto se re-escala hacia abajo sin que se note en el código — verificar el tamaño *real* en pantalla, no solo los números del SVG.

## Eventos soportados (src/lib/events.ts)

Cumpleaños, Baby shower, Nacimiento, Bautismo, Comunión, 15 años, Casamiento, Casa nueva/Mudanza, Graduación/Recibida, Otro. Cada uno con ícono propio en `public/icons/` (línea verde oscura, fondo transparente, mismo estilo — si se agrega un evento nuevo, pedir un dibujo de referencia y procesarlo igual: quitar fondo blanco, recortar, mismo trazo).

## Features implementadas

- Autocompletado de datos de producto al pegar un link (scraping directo + fallback Microlink) — función `fetchLinkPreview` en `src/app/l/[id]/actions.ts`
- Reserva de regalos por invitados sin cuenta
- Multi-lista por usuario vía Supabase Auth
- Borrado de listas con confirmación (`window.confirm`)
- Edición de items ya agregados a una lista (por si el link no trajo foto/precio) — botón "Editar" junto a "Quitar" en cada item
- **Productos patrocinados/sugeridos**: tabla `sponsored_products` en Supabase, con `event_types` (array — un producto puede aplicar a varios eventos o a "todos"), precio, detalle, imagen (subida de archivo server-side vía bucket de Storage `sponsored-products`, o link pegado). Se muestran de forma rotativa dentro de la lista del organizador (no en la pantalla de datos del evento, no en la vista de invitados). Panel de administración en `/admin/patrocinados`, protegido por el mail en la variable de entorno `ADMIN_EMAIL` (server-side check, no es una tabla de roles). Hay botón "Ver todos" que lleva a `/l/[id]/sugeridos` con la grilla completa filtrada por evento.
- Al copiar el link para compartir, se copia también un mensaje explicativo pre-armado (no solo la URL pelada) — `CopyLinkButton.tsx`
- Analítica: PostHog (eventos: `lista_creada`, `invitado_reservo`, `lista_compartida`, pageviews automáticos) + Vercel Analytics

## Pendiente / cosas mencionadas pero no resueltas

- **Bug reportado sin resolver:** el link que se comparte con invitados a veces los lleva a la vista de organizador en vez de la vista de invitado. Se investigó el código de `src/app/l/[id]/page.tsx` (la lógica de `isOwner` parece correcta a primera vista) pero no se terminó de diagnosticar con la persona qué estaba pasando exactamente (¿le pasó a ella logueada en otra pestaña, o a un invitado real sin cuenta?). Retomar preguntando por esto si vuelve a salir el tema.
- Integración de afiliados de Mercado Libre (transformación server-side de links con ID de afiliado) — mencionada como objetivo pero no iniciada.
- Recordatorios de reserva por mail vía Resend + cron de Vercel — no iniciado.
- Plantillas de invitación de Canva por tipo de evento — no iniciado.

## Cómo prefiere trabajar

- Cambios chicos y verificables — corré `tsc --noEmit` y el linter antes de dar algo por terminado.
- Si un cambio visual es subjetivo (colores, formas, tamaños de sticker), ella va a pedir ajustes iterativos varias veces — no es señal de que esté mal hecho, es normal en este proyecto. Tomátelo con calma y ajustá fino cuando lo pida.
- Cuando midas un color de una imagen de referencia que ella suba, usá el valor exacto medido, no una aproximación de memoria.
