# YAJOS: instrucciones para Claude

E-commerce de camisas con iniciales bordadas (CDMX). El dueño es Jair, socio de YAJOS, y trabaja en Mac.
Habla con él en español, en lenguaje llano: no es programador. Antes de cualquier paso que cueste dinero,
publique algo o toque cuentas (Vercel, Stripe, Supabase, dominio), explica qué va a pasar y pide su ok.

## El negocio en una línea

Camisa a $899 + IVA = **$1,043 MXN**, entrega en 5 días hábiles. El cliente elige modelo, talla, iniciales
(1 a 4 letras), tipografía, color de hilo y posición. El cuello de botella real es la **capacidad de bordado
por día**, no el inventario.

## Stack y comandos

- `web/`: Next.js 16 (App Router), React 19, Tailwind 4 y TypeScript. **Vercel usa `web` como Root Directory.**
- Local: `cd web && npm run dev -- --port 3100`. En Claude Code también existe `.claude/launch.json` (`yajos-web`).
- Antes de subir cambios: `cd web && npm run lint && npm run build`. Los dos deben pasar.
- Next 16 tiene APIs distintas a las de versiones viejas. Si dudas, revisa `web/node_modules/next/dist/docs/`
  o el código existente antes de escribir.
- Despliegue: cada push a `main` en GitHub publica solo en Vercel (ver la skill `/desplegar`).

## Dónde vive cada cosa

- **Catálogo** (fuente única de verdad): `web/src/lib/catalogo.ts`. Contiene modelos (con `disponible`),
  `TALLAS`, `HILOS` (20), `TIPOGRAFIAS` (molde, cursiva, gótica), `POSICIONES` (dos puños y dos lados del
  pecho), `ZONAS`, precio y WhatsApp. El JSON-LD, el `llms.txt` y el configurador se generan de aquí.
- **Pedido**: `web/src/lib/pedido.ts`. `mensajePedido` es la orden de trabajo del bordador y se manda por
  WhatsApp. `desdeIds` valida en el servidor; del navegador **solo llegan identificadores, nunca precios**.
- **Pago**: `web/src/lib/stripe.ts`, `web/src/app/api/checkout/route.ts` y `web/src/app/gracias/page.tsx`.
- **Hero**: `web/src/components/ScrollScrub.tsx` dibuja en un canvas los cuadros de `web/public/scrub/`,
  que salen del video `IMAGESANDVIDEOS/higgsfield/referencias/armado de camisa.mp4` (ver la skill `/video-hero`).
- **Inventario**: `web/supabase/migrations/` (ver la skill `/inventario`).

## Variables de entorno

Viven en Vercel (Settings → Environment Variables) y, para trabajar en local, en `web/.env.local`.
La lista comentada está en `web/.env.example`.

| Variable | Para qué |
|---|---|
| `STRIPE_SECRET_KEY` | Llave secreta de Stripe. Empezar con `sk_test_`. Sin ella el pago se apaga y queda WhatsApp. |
| `NEXT_PUBLIC_PAGOS` | `1` muestra el botón "Pagar con tarjeta". |
| `STRIPE_MSI` | `1` enciende meses sin intereses. |
| `SITE_ENV` | `production` abre la indexación en Google. Cualquier otro valor deja el sitio en `noindex`. |
| `SITE_URL` | URL canónica (por defecto `https://yajos.com.mx`). |

## Reglas que no se rompen

1. **Secretos:** nunca escribas llaves en el código, en commits, en Slack ni en el chat. `.env*` está en
   `.gitignore`, salvo `.env.example`. Si Jair pega una llave en el chat, avísale que la rote.
2. **Stripe primero en modo prueba.** Pasar a llaves `sk_live_` solo cuando esté resuelto todo lo de
   "Antes de cobrar de verdad", más abajo.
3. **No poner `SITE_ENV=production`** mientras el sitio viejo siga vendiendo en yajos.com.mx. Se cambia el
   mismo día que el dominio apunte a Vercel.
4. **El catálogo manda.** No dupliques precios ni opciones en componentes; agrégalos a `catalogo.ts`.
5. **Imágenes del producto:** el dueño rechaza lo que se ve recortado o generado de forma artificial. Las
   piezas y fotos deben ser reales o salir de sus propias imágenes.
6. **Movimiento:** el scroll scrub sigue activo con "reducir movimiento", porque lo mueve el scroll del
   usuario. No lo apagues.
7. Registra cada decisión de producto nueva en `docs/decisiones-producto.md` (con fecha y razón).

## Estado (2026-11-18)

**Hecho:** hero con el video del armado y el logotipo, colección (Blanca y Azul Cielo; Gris Perla aparece
como "Próximamente"), configurador con vista previa de las iniciales, pedido por WhatsApp, y el pago con
Stripe programado pero apagado.

**Antes de cobrar de verdad:**
1. Webhook de Stripe y registro del pedido en Supabase. Hoy el pedido solo vive en el panel de Stripe.
2. Tope de pedidos por día según la capacidad de bordado. **Falta la cifra.**
3. Páginas legales: aviso de privacidad, términos, cambios y devoluciones.
4. Factura (CFDI): no está resuelta. El precio ya incluye IVA.
5. Vercel en plan Pro. El plan Hobby no permite uso comercial.

**Otros pendientes:**
- Conectar el inventario: el sitio aún no lo lee y deja pedir tallas sin piezas.
- Confirmar la talla 4XL y la tabla de medidas.
- Decidir si el video del hero puede mostrar gemelos en lugar de botones.
- Datos de la camisa verde a rayas.
