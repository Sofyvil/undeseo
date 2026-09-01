# Un Deseo — by Go Baby

Listas de regalos para baby shower, nacimiento y otros festejos.

## Qué tiene esta primera versión (Semana 1 del plan)

✅ Crear una lista (nombre del festejo, tipo de evento, fecha/hora/lugar)
✅ Agregar regalos a mano (nombre, precio, link)
✅ Compartir el link de la lista
✅ Reservar un regalo sin necesidad de crear cuenta
✅ Diseño de marca aplicado (colores, tipografías, íconos)

## Qué falta (próximas semanas, según el plan)

⏳ Auto-completado de foto y precio al pegar un link (scraping + integración con Mercado Libre)
⏳ Catálogo propio de Go Baby con alta rápida
⏳ Recordatorio a los 5 días + botón de WhatsApp
⏳ Subida de flyer del evento + link a plantillas de Canva
⏳ Filtro por precio

## Cómo conectarlo (para quien lo despliegue)

1. Crear un proyecto en [Supabase](https://supabase.com)
2. En el **SQL Editor** de Supabase, pegar y ejecutar todo el contenido de `supabase/schema.sql`
3. Copiar `.env.local.example` como `.env.local` y completar con los datos de tu proyecto de Supabase (están en Project Settings → API)
4. Instalar dependencias: `npm install`
5. Correr en modo desarrollo: `npm run dev`
6. Para producción: conectar este repositorio en [Vercel](https://vercel.com) → Import Project, y cargar ahí las mismas variables de entorno del paso 3

## Estructura del proyecto

```
src/
  app/
    page.tsx               → Página principal (crear lista)
    actions.ts              → Lógica para crear una lista nueva
    l/[id]/page.tsx         → Página de cada lista (ver y reservar regalos)
    l/[id]/actions.ts        → Lógica para agregar/reservar/borrar regalos
  components/
    Icon.tsx                 → Íconos de línea de la marca
  lib/supabase/
    client.ts                 → Conexión a la base de datos (navegador)
    server.ts                 → Conexión a la base de datos (servidor)
supabase/
  schema.sql                  → Estructura de la base de datos
```
