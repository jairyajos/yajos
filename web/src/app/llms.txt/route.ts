import { DIAS_ENTREGA, FICHA, HILOS, MODELOS, MODELOS_DISPONIBLES, POSICIONES, PRECIO_CON_IVA, PRECIO_SIN_IVA, TALLAS, TIPOGRAFIAS, WHATSAPP, ZONAS, mxn } from "@/lib/catalogo";
import { URL_SITIO } from "@/lib/sitio";

// llms.txt generado desde el mismo catálogo que usa la página: lo que lee un agente externo y lo
// que ve un cliente no pueden divergir.
export const dynamic = "force-static";

export function GET() {
  const texto = `# YAJOS

> Camisas de alta costura personalizadas con iniciales bordadas, en Ciudad de México. Corte ${FICHA.corte.toLowerCase()}, ${FICHA.costura.toLowerCase()}. Precio único ${mxn(PRECIO_CON_IVA)} MXN con IVA (${mxn(PRECIO_SIN_IVA)} + IVA), bordado incluido. Entrega en ${DIAS_ENTREGA} días hábiles.

## Producto

- Composición: ${FICHA.composicion}
- Modelos disponibles: ${MODELOS_DISPONIBLES.map((m) => `${m.nombre} (${m.codigo})`).join(", ")}
- Próximamente (aún no se puede pedir): ${MODELOS.filter((m) => !m.disponible).map((m) => m.nombre).join(", ") || "ninguno"}
- Tallas: ${TALLAS.map((t) => t.id).join(", ")}
- Colores de hilo (${HILOS.length}): ${HILOS.map((h) => `#${h.numero} ${h.nombre}`).join(", ")}
- Tipos de letra: ${TIPOGRAFIAS.map((t) => t.nombre).join(", ")}
- Posiciones del bordado: ${POSICIONES.map((p) => p.nombre).join(", ")}
- Iniciales: de 1 a 4 letras

## Entrega

${ZONAS.map((z) => `- ${z.nombre}${z.sinCosto ? ": sin costo" : ""}`).join("\n")}

## Cómo comprar

- Configurador: ${URL_SITIO}/#configura
- WhatsApp: https://wa.me/${WHATSAPP}
- Correo: yajos@yajos.com.mx

## Cuidados

${FICHA.lavado.map((l) => `- ${l}`).join("\n")}
`;
  return new Response(texto, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
