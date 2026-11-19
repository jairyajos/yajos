# YAJOS

Sitio nuevo de [yajos.com.mx](https://www.yajos.com.mx): camisas de línea con iniciales bordadas,
configurador en línea y pago con tarjeta (Stripe). Lo construyó maestria.studio con el método AWD.

- **Si es tu primera vez aquí:** lee [docs/manual-jair.md](docs/manual-jair.md). Ahí está cómo se instala
  todo en Mac, cómo se publica y cómo se conectan Stripe y Supabase.
- **Si trabajas con Claude Code:** [CLAUDE.md](CLAUDE.md) se carga solo, y las skills de
  `.claude/skills/` aparecen como comandos (`/desplegar`, `/activar-pagos`, `/inventario`,
  `/video-hero`, `/cambiar-catalogo`).
- **Por qué está hecho así:** [docs/decisiones-producto.md](docs/decisiones-producto.md).

## Estructura

```
web/                    El sitio: Next.js 16 + React 19 + Tailwind 4 (Vercel usa esta carpeta como raíz)
  src/lib/catalogo.ts   Modelos, tallas, hilos, tipografías, posiciones, zonas y precio
  src/lib/pedido.ts     Validación y mensaje del pedido (la orden de trabajo del bordador)
  src/lib/stripe.ts     Cliente de Stripe (solo servidor)
  src/app/api/checkout  Crea la sesión de pago de Stripe
  src/app/gracias       Página de regreso después de pagar
  src/components/       Hero con scroll scrub, colección y configurador
  scripts/frames.mjs    Convierte el video del hero en cuadros (requiere ffmpeg)
  supabase/migrations/  Tablas de inventario y carga inicial
IMAGESANDVIDEOS/        Fotos y video fuente (el video del hero es "armado de camisa.mp4")
docs/                   Manual y decisiones del producto
.claude/                Configuración y skills para Claude Code
```

## Correr en local

```bash
cd web
npm install
npm run dev -- --port 3100
```

Abre http://localhost:3100.
