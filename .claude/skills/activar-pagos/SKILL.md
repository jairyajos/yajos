---
name: activar-pagos
description: Conectar, probar o pasar a cobro real los pagos con Stripe de YAJOS (llaves, meses sin intereses, webhook y registro de pedidos). Úsala cuando Jair hable de Stripe, pagos con tarjeta, MSI o de empezar a cobrar.
---

# Pagos con Stripe

**Código:** `web/src/lib/stripe.ts`, `web/src/app/api/checkout/route.ts` y `web/src/app/gracias/page.tsx`.
Usa Stripe Checkout (la página de pago la aloja Stripe) con la librería `stripe` 23. En esa versión el
campo se llama `allowed_payment_method_types`, no `payment_method_types`.

- El precio sale de `PRECIO_CON_IVA` en el servidor, en centavos de MXN. Nunca se toma del navegador.
- La orden del bordador va en `metadata`: nombre, modelo, talla, iniciales, tipografía, hilo, posición y zona.
- Sin `STRIPE_SECRET_KEY`, la ruta responde 503 y el sitio sigue vendiendo por WhatsApp.

## Fase 1: modo de prueba (se puede hacer ya)

1. Jair copia su clave `sk_test_...` (Stripe → Desarrolladores → Claves de API, en modo de prueba) y la pega
   **él mismo** en Vercel como `STRIPE_SECRET_KEY`. No se la pidas en el chat.
2. Tú agregas `NEXT_PUBLIC_PAGOS=1` y, si quiere meses sin intereses, `STRIPE_MSI=1`. Luego redesplegas (ver
   `/desplegar`).
3. Prueba con la tarjeta `4242 4242 4242 4242`. El pago debe aparecer en Stripe con todos los `metadata`, y
   `/gracias` debe decir "Gracias, <nombre>".
4. Para probar en local: `cd web && vercel env pull .env.local` y después `npm run dev -- --port 3100`.

## Fase 2: antes de cobrar de verdad (hay que programarlo)

Hazlo en este orden y confirma cada paso con Jair.

1. **Pedidos en Supabase.** Crea una tabla `pedidos` con los campos de `metadata`, más el id de la sesión de
   Stripe, el estado, el teléfono, el email y la fecha prometida. Va como migración nueva en
   `web/supabase/migrations/`.
2. **Webhook.** Crea `web/src/app/api/stripe/webhook/route.ts`. Debe verificar la firma con
   `STRIPE_WEBHOOK_SECRET` y, con el evento `checkout.session.completed`, marcar el pedido como pagado y
   descontar el inventario. El endpoint se da de alta en Stripe → Desarrolladores → Webhooks.
3. **Tope por capacidad de bordado.** Antes de crear la sesión de pago, cuenta los pedidos pendientes. Si se
   pasa del cupo diario, rechaza el pedido o recorre la fecha de entrega. **Pídele la cifra a Jair; no la
   inventes.**
4. **Páginas legales:** aviso de privacidad, términos, y cambios y devoluciones. Jair revisa y aprueba los
   textos.
5. **Factura (CFDI).** Decide con Jair cómo se va a facturar; por ejemplo, con un formulario después del pago
   o con un servicio de facturación.
6. **Vercel Pro.**

## Fase 3: cobro real

1. Jair activa su cuenta de Stripe en su panel, con sus datos fiscales y su cuenta bancaria.
2. En Vercel, Jair cambia `STRIPE_SECRET_KEY` por la clave `sk_live_...` y agrega el `STRIPE_WEBHOOK_SECRET`
   del webhook en modo real.
3. Redespliega y haz una compra real pequeña para confirmar.
