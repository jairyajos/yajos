// Textos que aparecen y desaparecen según el progreso del scroll (0 a 1) en los heroes.
export type Capitulo = {
  desde: number;
  hasta: number;
  eyebrow: string;
  titulo: React.ReactNode;
  texto?: string;
  accion?: { etiqueta: string; href: string };
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// Opacidad de un capítulo: entra y sale en el 15% de su tramo. El primero ya está visible al
// cargar y el último no se desvanece al final.
export function opacidad(p: number, desde: number, hasta: number, primero: boolean, ultimo: boolean) {
  const borde = (hasta - desde) * 0.15;
  if ((p < desde && !primero) || (p > hasta && !ultimo)) return 0;
  const entrada = primero ? 1 : clamp((p - desde) / borde);
  const salida = ultimo ? 1 : clamp((hasta - p) / borde);
  return Math.min(entrada, salida);
}
