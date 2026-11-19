import Cabecera from "@/components/Cabecera";
import Coleccion from "@/components/Coleccion";
import Configurador from "@/components/Configurador";
import ScrollScrub from "@/components/ScrollScrub";
import type { Capitulo } from "@/lib/capitulos";
import { COMBINACIONES, DIAS_ENTREGA, FICHA, HILOS, MODELOS_DISPONIBLES, PRECIO_CON_IVA, TALLAS, WHATSAPP, mxn } from "@/lib/catalogo";
import { URL_SITIO } from "@/lib/sitio";

const capitulos: Capitulo[] = [
  {
    desde: 0,
    hasta: 0.24,
    eyebrow: "YAJOS · Ciudad de México",
    titulo: (
      <>
        Pieza por pieza,
        <br />
        <em>a tu medida.</em>
      </>
    ),
    texto: "Alta costura con tus iniciales bordadas. Corte slim, costura francesa.",
  },
  {
    desde: 0.28,
    hasta: 0.5,
    eyebrow: "Tu talla",
    titulo: (
      <>
        De {TALLAS[0].id} a {TALLAS[TALLAS.length - 1].id},
        <br />
        <em>el mismo corte.</em>
      </>
    ),
    texto: `${TALLAS.length} tallas, de ${TALLAS[0].id} a ${TALLAS[TALLAS.length - 1].id}. Corte slim con costura francesa en todas.`,
  },
  {
    desde: 0.54,
    hasta: 0.8,
    eyebrow: "El bordado",
    titulo: (
      <>
        {HILOS.length} hilos.
        <br />
        <em>{COMBINACIONES.toLocaleString("es-MX")} camisas posibles.</em>
      </>
    ),
    texto: "Elige tipo de letra, color y posición: puño o pecho, izquierdo o derecho.",
  },
  {
    desde: 0.84,
    hasta: 1.01,
    eyebrow: `${mxn(PRECIO_CON_IVA)} · IVA incluido`,
    titulo: (
      <>
        Lista en {DIAS_ENTREGA} días
        <br />
        <em>hábiles.</em>
      </>
    ),
    accion: { etiqueta: "Personaliza la tuya", href: "#configura" },
  },
];

// Datos estructurados: un ProductGroup con una variante por modelo. Es la mitad "legible por
// máquinas" de AWD (D-008).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProductGroup",
  name: "Camisa YAJOS de alta costura con iniciales bordadas",
  brand: { "@type": "Brand", name: "YAJOS" },
  description: `Camisa corte ${FICHA.corte.toLowerCase()}, ${FICHA.costura.toLowerCase()}, ${FICHA.composicion}. Iniciales bordadas incluidas.`,
  url: URL_SITIO,
  productGroupID: "YJ",
  variesBy: ["https://schema.org/color", "https://schema.org/size"],
  hasVariant: MODELOS_DISPONIBLES.map((m) => ({
    "@type": "Product",
    sku: m.codigo,
    name: `Camisa YAJOS ${m.nombre}`,
    color: m.nombre,
    image: `${URL_SITIO}${m.imagen}`,
    offers: {
      "@type": "Offer",
      price: PRECIO_CON_IVA,
      priceCurrency: "MXN",
      availability: "https://schema.org/MadeToOrder",
      areaServed: { "@type": "City", name: "Ciudad de México" },
    },
  })),
};

function Encabezado({ eyebrow, titulo, texto, oscuro }: { eyebrow: string; titulo: React.ReactNode; texto?: string; oscuro?: boolean }) {
  return (
    <div className="mb-12 max-w-2xl sm:mb-16">
      <p className={`etiqueta mb-4 ${oscuro ? "text-papel/60" : "text-niebla"}`}>{eyebrow}</p>
      <h2 className="font-serif text-[clamp(2.1rem,4.6vw,3.6rem)] leading-[1.05] tracking-[-0.01em]">{titulo}</h2>
      {texto && <p className={`mt-5 max-w-lg text-[15px] leading-relaxed font-light ${oscuro ? "text-papel/70" : "text-carbon/80"}`}>{texto}</p>}
    </div>
  );
}

export default function Inicio() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Cabecera />

      <main id="inicio">
        <ScrollScrub capitulos={capitulos} logo="/armado/yajos-logo.png" />

        <section id="coleccion" className="scroll-mt-16 px-5 py-24 sm:px-10 sm:py-32 lg:px-16">
          <Encabezado
            eyebrow="La colección"
            titulo={
              <>
                Camisas de línea. <em>Una sola regla:</em> que te quede.
              </>
            }
            texto={`Corte ${FICHA.corte.toLowerCase()} con ${FICHA.costura.toLowerCase()}. ${FICHA.composicion}: cae como algodón, no se arruga como algodón.`}
          />
          <Coleccion />
        </section>

        <section id="configura" className="scroll-mt-16 border-t border-linea px-5 py-24 sm:px-10 sm:py-32 lg:px-16">
          <Encabezado
            eyebrow="Configurador"
            titulo={
              <>
                Personaliza <em>tu camisa.</em>
              </>
            }
            texto="Siete decisiones, menos de dos minutos. La vista previa cambia contigo."
          />
          <Configurador />
        </section>

        <section id="como-comprar" className="scroll-mt-16 bg-tinta px-5 py-24 text-papel sm:px-10 sm:py-32 lg:px-16">
          <Encabezado oscuro eyebrow="Cómo comprar" titulo={<>Tres pasos.</>} />
          <ol className="grid gap-10 sm:grid-cols-3 sm:gap-8">
            {[
              ["Personaliza", "Mide tu cuello o tu pecho con la guía y elige iniciales, letra, color y posición."],
              ["Envía tu pedido", "Te llega armado a WhatsApp. Confirmamos disponibilidad y te pasamos el pago."],
              ["Recíbela", `En ${DIAS_ENTREGA} días hábiles. Sin costo en Pedregal y San Jerónimo.`],
            ].map(([t, d], i) => (
              <li key={t} className="border-t border-papel/20 pt-6">
                <span className="font-serif text-sm text-papel/50 italic">0{i + 1}</span>
                <h3 className="mt-3 font-serif text-2xl">{t}</h3>
                <p className="mt-3 max-w-xs text-sm leading-relaxed font-light text-papel/70">{d}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="contacto" className="scroll-mt-16 px-5 py-24 sm:px-10 sm:py-32 lg:px-16">
          <Encabezado eyebrow="Contacto" titulo={<>Park Pedregal Business.</>} />
          <dl className="grid gap-8 text-sm sm:grid-cols-4">
            <div>
              <dt className="etiqueta text-niebla">Dirección</dt>
              <dd className="mt-2 leading-relaxed">
                <a href="https://maps.google.com/?q=Perif%C3%A9rico+Sur+3580,+01900+CDMX" target="_blank" rel="noopener" className="underline-offset-4 hover:underline">
                  Periférico Sur 3580
                  <br />
                  01900, CDMX
                </a>
              </dd>
            </div>
            <div>
              <dt className="etiqueta text-niebla">WhatsApp</dt>
              <dd className="mt-2">
                <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener" className="underline-offset-4 hover:underline">
                  55 6676 7660
                </a>
              </dd>
            </div>
            <div>
              <dt className="etiqueta text-niebla">Correo</dt>
              <dd className="mt-2">
                <a href="mailto:yajos@yajos.com.mx" className="underline-offset-4 hover:underline">
                  yajos@yajos.com.mx
                </a>
              </dd>
            </div>
            <div>
              <dt className="etiqueta text-niebla">Síguenos</dt>
              <dd className="mt-2 flex gap-4">
                <a href="https://instagram.com/yajos_clothing" target="_blank" rel="noopener" className="underline-offset-4 hover:underline">
                  Instagram
                </a>
                <a href="https://tiktok.com/@yajos_clothing" target="_blank" rel="noopener" className="underline-offset-4 hover:underline">
                  TikTok
                </a>
              </dd>
            </div>
          </dl>
        </section>
      </main>

      <footer className="flex flex-col gap-3 border-t border-linea px-5 py-8 text-xs text-niebla sm:flex-row sm:justify-between sm:px-10 lg:px-16">
        <p>© {new Date().getFullYear()} YAJOS · Camisas de alta costura · CDMX</p>
        <p>Precios en pesos mexicanos, IVA incluido.</p>
      </footer>
    </>
  );
}
