import { DIAS_ENTREGA, FICHA, HILOS, MODELOS_DISPONIBLES, POSICIONES, PRECIO_CON_IVA, TALLAS, TIPOGRAFIAS, WHATSAPP, ZONAS, mxn, type Hilo, type Modelo, type Posicion, type Talla, type Tipografia, type Zona } from "./catalogo";

export type Pedido = {
  nombre: string;
  modelo: Modelo;
  talla: Talla;
  iniciales: string;
  tipografia: Tipografia;
  hilo: Hilo;
  posicion: Posicion;
  zona: Zona;
};

// Iniciales: 1 a 4 letras, opcionalmente separadas por punto. Es la orden del bordador,
// así que no se aceptan números ni símbolos.
export const normalizarIniciales = (v: string) =>
  v.toUpperCase().replace(/[^A-ZÁÉÍÓÚÑÜ.]/g, "").slice(0, 7);

export const letrasDeIniciales = (v: string) => v.replace(/\./g, "").length;

export function faltantes(p: Pedido): string[] {
  const f: string[] = [];
  if (p.nombre.trim().length < 3) f.push("tu nombre");
  const n = letrasDeIniciales(p.iniciales);
  if (n < 1 || n > 4) f.push("tus iniciales (de 1 a 4 letras)");
  return f;
}

// Formato rescatado del sitio actual: es la orden de trabajo del bordador. Se conserva el
// orden de los bloques; se corrige el total, que ahora incluye IVA.
export function mensajePedido(p: Pedido): string {
  return [
    "¡Hola! Me gustaría hacer un pedido de YAJOS.",
    "",
    `*Nombre:* ${p.nombre.trim()}`,
    "",
    "*Camisa*",
    `• Modelo: ${p.modelo.codigo} · ${p.modelo.nombre}`,
    `• Talla: ${p.talla.id}`,
    `• Corte: ${FICHA.corte} / ${FICHA.costura}`,
    "",
    "*Bordado*",
    `• Iniciales: ${p.iniciales}`,
    `• Tipo de letra: ${p.tipografia.nombre}`,
    `• Color: ${p.hilo.nombre} #${p.hilo.numero}`,
    `• Posición: ${p.posicion.nombre}`,
    "",
    `*Entrega:* ${p.zona.nombre}`,
    `*Tiempo de entrega:* ${DIAS_ENTREGA} días hábiles`,
    `*Total:* ${mxn(PRECIO_CON_IVA)} MXN, IVA incluido`,
  ].join("\n");
}

// Lo que viaja del navegador al servidor: solo identificadores. El servidor los resuelve contra el
// catálogo, así que precio y opciones nunca salen del cliente.
export type PedidoIds = {
  nombre: string;
  modelo: string;
  talla: string;
  iniciales: string;
  tipografia: string;
  hilo: number;
  posicion: string;
  zona: string;
};

export const aIds = (p: Pedido): PedidoIds => ({
  nombre: p.nombre.trim(),
  modelo: p.modelo.codigo,
  talla: p.talla.id,
  iniciales: p.iniciales,
  tipografia: p.tipografia.id,
  hilo: p.hilo.numero,
  posicion: p.posicion.id,
  zona: p.zona.id,
});

export function desdeIds(ids: Partial<PedidoIds>): Pedido | null {
  const modelo = MODELOS_DISPONIBLES.find((m) => m.codigo === ids.modelo);
  const talla = TALLAS.find((t) => t.id === ids.talla);
  const tipografia = TIPOGRAFIAS.find((t) => t.id === ids.tipografia);
  const hilo = HILOS.find((h) => h.numero === ids.hilo);
  const posicion = POSICIONES.find((p) => p.id === ids.posicion);
  const zona = ZONAS.find((z) => z.id === ids.zona);
  if (!modelo || !talla || !tipografia || !hilo || !posicion || !zona || typeof ids.nombre !== "string" || typeof ids.iniciales !== "string") return null;
  const pedido = { nombre: ids.nombre.slice(0, 80), modelo, talla, iniciales: normalizarIniciales(ids.iniciales), tipografia, hilo, posicion, zona };
  return faltantes(pedido).length ? null : pedido;
}

export const enlaceWhatsApp = (p: Pedido) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensajePedido(p))}`;
