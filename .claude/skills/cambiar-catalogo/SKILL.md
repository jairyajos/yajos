---
name: cambiar-catalogo
description: Cambiar lo que vende YAJOS (modelos o colores de camisa, tallas, colores de hilo, tipografías, posiciones del bordado, zonas de entrega, precio, días de entrega o WhatsApp). Úsala para cualquier cambio de oferta o precio.
---

# Cambiar el catálogo

Todo sale de `web/src/lib/catalogo.ts`. De ahí leen el configurador, la colección, el JSON-LD para Google,
`/llms.txt`, el mensaje de WhatsApp y Stripe. **No dupliques datos en los componentes.**

## Casos comunes

- **Precio:** cambia `PRECIO_SIN_IVA`; el precio con IVA se calcula solo. Revisa los textos de
  `web/src/app/page.tsx` que mencionen el precio.
- **Activar un modelo en "Próximamente"** (Gris Perla): ponle `disponible: true` y revisa que tenga foto en
  `web/public/camisas/<codigo>.jpg`. Si ya hay inventario en Supabase, da de alta sus piezas.
- **Modelo nuevo** (por ejemplo, la camisa verde a rayas):
  1. Pídele a Jair el código (`YJ-XXX-00N`), el nombre, la descripción, una foto real y si ya se vende.
  2. Agrégalo a `MODELOS` y pon la foto en `public/camisas/`.
  3. Súmalo a la tabla `modelos` en Supabase con una migración nueva.
- **Hilos:** agrega o quita colores en `HILOS` (nombre, número y color hex). Compara el hex con una foto del
  hilo real.
- **Tallas:** cambia `TALLAS`. Si cambian aquí, actualiza también la tabla `tallas` en Supabase.
- **Días de entrega o WhatsApp:** cambia `DIAS_ENTREGA` o `WHATSAPP`.

## Después de cualquier cambio

1. Corre `cd web && npm run lint && npm run build`.
2. En local, prueba el configurador de punta a punta, incluido el mensaje de WhatsApp.
3. Revisa `http://localhost:3100/llms.txt`.
4. Anota la decisión en `docs/decisiones-producto.md` con fecha y razón.
5. Publica con `/desplegar`.
