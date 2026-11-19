// Catálogo de YAJOS, reescrito desde la especificación del sitio actual (baseline 2026-10-10).
// Fuente temporal: en la fase B estas constantes pasan a tablas de Supabase y la app las lee
// de la base — el agente y la página no deben poder recomendar algo que el catálogo no tiene.

export const IVA = 0.16;
export const PRECIO_SIN_IVA = 899;
export const PRECIO_CON_IVA = Math.round(PRECIO_SIN_IVA * (1 + IVA)); // 1,043
export const DIAS_ENTREGA = 5;
export const WHATSAPP = "525566767660";

// `disponible: false` = se muestra como "Próximamente" y no se puede pedir.
export type Modelo = { codigo: string; nombre: string; imagen: string; tono: string; disponible: boolean };
export type Talla = { id: string; nombre: string };
export type Hilo = { numero: number; nombre: string; hex: string };
export type Tipografia = { id: "molde" | "cursiva" | "gotica"; nombre: string; descripcion: string };
export type Posicion = { id: string; nombre: string };
export type Zona = { id: string; nombre: string; sinCosto: boolean };

export const MODELOS: Modelo[] = [
  { codigo: "YJ-BLA-001", nombre: "Blanca", imagen: "/camisas/yj-bla-001.jpg", tono: "#f4f4f2", disponible: true },
  { codigo: "YJ-ACI-002", nombre: "Azul Cielo", imagen: "/camisas/yj-aci-002.jpg", tono: "#b9cfe6", disponible: true },
  // El socio aún no la produce (Slack #yajos, 2026-10-10).
  { codigo: "YJ-GPE-003", nombre: "Gris Perla", imagen: "/camisas/yj-gpe-003.jpg", tono: "#d6d7d9", disponible: false },
];

// Tallas por letra para toda la línea (socio, Slack #yajos, 2026-10-10; D-020). Sustituyen a las
// tallas de cuello del sitio viejo. Falta la tabla de medidas de cada talla para la guía.
export const TALLAS: Talla[] = [
  { id: "CH", nombre: "Chica" },
  { id: "MD", nombre: "Mediana" },
  { id: "GD", nombre: "Grande" },
  { id: "XG", nombre: "Extra grande" },
  { id: "2XL", nombre: "2XL" },
  { id: "3XL", nombre: "3XL" },
];

export const HILOS: Hilo[] = [
  { numero: 1, nombre: "Blanco", hex: "#F5F0E6" },
  { numero: 2, nombre: "Negro", hex: "#181818" },
  { numero: 3, nombre: "Azul Rey", hex: "#2c46c9" },
  { numero: 4, nombre: "Gris", hex: "#9a9a9a" },
  { numero: 5, nombre: "Azul Marino", hex: "#152c56" },
  { numero: 6, nombre: "Azul", hex: "#2f57a8" },
  { numero: 7, nombre: "Azul Cielo", hex: "#7bafda" },
  { numero: 8, nombre: "Azul Claro", hex: "#b8d4e6" },
  { numero: 9, nombre: "Rosa", hex: "#e8a9b8" },
  { numero: 10, nombre: "Naranja", hex: "#c85a28" },
  { numero: 11, nombre: "Rojo", hex: "#b3312f" },
  { numero: 12, nombre: "Morado", hex: "#6a1f96" },
  { numero: 13, nombre: "Beige", hex: "#d3c3a8" },
  { numero: 14, nombre: "Dorado", hex: "#c8a02e" },
  { numero: 15, nombre: "Café", hex: "#3a1f16" },
  { numero: 16, nombre: "Verde", hex: "#3f8555" },
  { numero: 17, nombre: "Verde Oscuro", hex: "#1b4128" },
  { numero: 18, nombre: "Amarillo", hex: "#e2d64a" },
  { numero: 19, nombre: "Lila", hex: "#b090dc" },
  { numero: 20, nombre: "Morado Oscuro", hex: "#591fa8" },
];

export const TIPOGRAFIAS: Tipografia[] = [
  { id: "molde", nombre: "Molde", descripcion: "Clásica" },
  { id: "cursiva", nombre: "Cursiva", descripcion: "Elegante" },
  // Agregada el 2026-10-10 por decisión del socio (D-015). Pendiente confirmar con el bordador.
  { id: "gotica", nombre: "Gótica", descripcion: "Monograma clásico" },
];

export const POSICIONES: Posicion[] = [
  { id: "puno-izq", nombre: "Puño izquierdo" },
  { id: "puno-der", nombre: "Puño derecho" },
  { id: "pecho-izq", nombre: "Pecho izquierdo" },
  { id: "pecho-der", nombre: "Pecho derecho" },
];

export const ZONAS: Zona[] = [
  { id: "pedregal", nombre: "Pedregal, CDMX", sinCosto: true },
  { id: "san-jeronimo", nombre: "San Jerónimo, CDMX", sinCosto: true },
  { id: "otra", nombre: "Otra zona (coordinar por WhatsApp)", sinCosto: false },
];

export const FICHA = {
  corte: "Slim",
  costura: "Costura francesa",
  composicion: "48% bambú · 48% microfibra · 4% spandex",
  lavado: [
    "Ciclo delicado, agua fría máx. 30 °C",
    "Sin blanqueador ni cloro",
    "Tender a la sombra; no secadora, no exprimir",
    "Planchar a máx. 110 °C con vapor ligero, sin contacto directo con el bordado",
    "No lavado en seco",
  ],
};

export const MODELOS_DISPONIBLES = MODELOS.filter((m) => m.disponible);

export const COMBINACIONES =
  MODELOS_DISPONIBLES.length * TALLAS.length * HILOS.length * TIPOGRAFIAS.length * POSICIONES.length;

export const mxn = (n: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 0 }).format(n);
