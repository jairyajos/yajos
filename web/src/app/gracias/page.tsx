import type { Metadata } from "next";
import Link from "next/link";
import { DIAS_ENTREGA, WHATSAPP } from "@/lib/catalogo";
import { stripe } from "@/lib/stripe";

export const metadata: Metadata = { title: "Gracias por tu pedido · YAJOS", robots: { index: false } };

// Página de regreso de Stripe Checkout. Solo confirma lo que Stripe reporta; el registro del pedido
// llega con el webhook (fase B).
export default async function Gracias({ searchParams }: { searchParams: Promise<{ sesion?: string }> }) {
  const { sesion } = await searchParams;
  const datos = stripe && sesion ? await stripe.checkout.sessions.retrieve(sesion).catch(() => null) : null;
  const pagado = datos?.payment_status === "paid";

  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col justify-center px-5 py-24">
      <p className="etiqueta text-niebla">YAJOS</p>
      <h1 className="mt-4 font-serif text-[clamp(2.2rem,6vw,3.6rem)] leading-[1.05]">
        {pagado ? (
          <>
            Gracias, <em>{datos?.metadata?.nombre?.split(" ")[0] ?? "ya es tuya"}.</em>
          </>
        ) : (
          <>Estamos confirmando tu pago.</>
        )}
      </h1>
      <p className="mt-6 text-[15px] leading-relaxed font-light text-carbon/80">
        {pagado
          ? `Recibimos tu pago. Tu camisa entra a bordado y estará lista en ${DIAS_ENTREGA} días hábiles. Te escribimos por WhatsApp para coordinar la entrega.`
          : "Si ya pagaste, en unos minutos te llega la confirmación. Cualquier duda, escríbenos por WhatsApp."}
      </p>
      {datos?.metadata?.iniciales && (
        <dl className="mt-8 grid grid-cols-2 gap-y-2 border-t border-linea pt-6 text-sm">
          <dt className="text-niebla">Modelo</dt>
          <dd className="text-right">{datos.metadata.modelo}</dd>
          <dt className="text-niebla">Talla</dt>
          <dd className="text-right">{datos.metadata.talla}</dd>
          <dt className="text-niebla">Bordado</dt>
          <dd className="text-right">
            {datos.metadata.iniciales} · {datos.metadata.tipografia}
          </dd>
        </dl>
      )}
      <div className="mt-10 flex flex-wrap gap-3">
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener" className="etiqueta bg-tinta px-6 py-4 text-papel">
          Escribir por WhatsApp
        </a>
        <Link href="/" className="etiqueta border border-tinta px-6 py-4">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
