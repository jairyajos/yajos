import { NextResponse } from "next/server";
import { DIAS_ENTREGA, PRECIO_CON_IVA } from "@/lib/catalogo";
import { desdeIds, type PedidoIds } from "@/lib/pedido";
import { MSI, stripe } from "@/lib/stripe";

// Crea una sesión de Stripe Checkout para una camisa configurada. El precio sale del catálogo del
// servidor; del navegador solo llegan identificadores (ver `desdeIds`).
//
// Pendiente (fase B): guardar el pedido en Supabase y confirmarlo por webhook. Mientras tanto, la
// orden de trabajo del bordador viaja en `metadata` y se ve en el panel de Stripe del socio.
export async function POST(req: Request) {
  if (!stripe) return NextResponse.json({ error: "pagos-no-configurados" }, { status: 503 });

  let ids: Partial<PedidoIds>;
  try {
    ids = await req.json();
  } catch {
    return NextResponse.json({ error: "pedido-invalido" }, { status: 400 });
  }
  const pedido = desdeIds(ids);
  if (!pedido) return NextResponse.json({ error: "pedido-invalido" }, { status: 400 });

  const origen = new URL(req.url).origin;
  const bordado = `${pedido.iniciales} · ${pedido.tipografia.nombre} · hilo ${pedido.hilo.nombre} #${pedido.hilo.numero} · ${pedido.posicion.nombre}`;

  const sesion = await stripe.checkout.sessions.create({
    mode: "payment",
    locale: "es-419",
    allowed_payment_method_types: ["card"],
    ...(MSI && { payment_method_options: { card: { installments: { enabled: true } } } }),
    phone_number_collection: { enabled: true },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "mxn",
          unit_amount: PRECIO_CON_IVA * 100, // centavos, IVA incluido
          product_data: {
            name: `Camisa YAJOS ${pedido.modelo.nombre} · talla ${pedido.talla.id}`,
            description: `Bordado: ${bordado}. Entrega en ${DIAS_ENTREGA} días hábiles, ${pedido.zona.nombre}.`,
          },
        },
      },
    ],
    // Orden de trabajo del bordador. Stripe admite hasta 50 llaves de 500 caracteres.
    metadata: {
      nombre: pedido.nombre,
      modelo: pedido.modelo.codigo,
      talla: pedido.talla.id,
      iniciales: pedido.iniciales,
      tipografia: pedido.tipografia.nombre,
      hilo: `${pedido.hilo.nombre} #${pedido.hilo.numero}`,
      posicion: pedido.posicion.nombre,
      zona: pedido.zona.nombre,
    },
    success_url: `${origen}/gracias?sesion={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origen}/#configura`,
  });

  return NextResponse.json({ url: sesion.url });
}
