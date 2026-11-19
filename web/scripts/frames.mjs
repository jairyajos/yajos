// Convierte el video del scroll scrub en una secuencia de cuadros WebP para public/scrub/.
//
//   npm run frames                         toma el video más reciente de ../IMAGESANDVIDEOS
//   npm run frames -- ruta/al/video.mp4    usa ese archivo
//   FPS=24 ANCHO=1600 CALIDAD=72 npm run frames
//
// Por qué cuadros y no <video>: buscar currentTime en un MP4 normal salta entre keyframes y se
// ve a tirones, sobre todo en Safari. Una secuencia de imágenes en <canvas> es fluida en todos.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const carpetaMedios = resolve(raiz, "..", "IMAGESANDVIDEOS");
const salida = join(raiz, "public", "scrub");
const FPS = Number(process.env.FPS ?? 24);
const ANCHO = Number(process.env.ANCHO ?? 1600);
const CALIDAD = Number(process.env.CALIDAD ?? 72);
// Los videos generados traen textura gris tenue en el fondo. Los pixeles claros y sin color se
// aclaran hacia blanco puro en rampa (de 218 a 240 de brillo), así la sombra se difumina sin
// orilla y la crema del cuello, que tiene color, no se toca. LIMPIAR=0 lo desactiva.
const LIMPIAR = process.env.LIMPIAR !== "0";
const MIN = "min(min(r(X,Y),g(X,Y)),b(X,Y))";
const MAX = "max(max(r(X,Y),g(X,Y)),b(X,Y))";
const PESO = `lt(${MAX}-${MIN},16)*clip((${MIN}-218)/22,0,1)`;
const canal = (c) => `${c}(X,Y)+(255-${c}(X,Y))*${PESO}`;
const limpiar = `,format=rgb24,geq=r='${canal("r")}':g='${canal("g")}':b='${canal("b")}'`;

function videoMasReciente() {
  if (!existsSync(carpetaMedios)) return null;
  const videos = readdirSync(carpetaMedios)
    .filter((f) => [".mp4", ".mov", ".webm", ".m4v"].includes(extname(f).toLowerCase()))
    .map((f) => join(carpetaMedios, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs);
  return videos[0] ?? null;
}

const entrada = process.argv[2] ? resolve(process.argv[2]) : videoMasReciente();
if (!entrada || !existsSync(entrada)) {
  console.error(`No encontré video. Deja un .mp4/.mov/.webm en ${carpetaMedios} o pasa la ruta.`);
  process.exit(1);
}

rmSync(salida, { recursive: true, force: true });
mkdirSync(salida, { recursive: true });

console.log(`Video: ${entrada}\nCuadros: ${FPS} fps · ${ANCHO}px · calidad ${CALIDAD}`);
execFileSync(
  "ffmpeg",
  ["-hide_banner", "-loglevel", "error", "-i", entrada, "-map", "0:v:0", "-an", "-vf", `fps=${FPS},scale=${ANCHO}:-2:flags=lanczos${LIMPIAR ? limpiar : ""}`, "-c:v", "libwebp", "-quality", String(CALIDAD), join(salida, "frame_%04d.webp")],
  { stdio: "inherit" },
);

const cuadros = readdirSync(salida).filter((f) => f.endsWith(".webp"));
const [w, h] = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height", "-of", "csv=p=0", join(salida, cuadros[0])])
  .toString()
  .trim()
  .split(",")
  .map(Number);
const peso = cuadros.reduce((s, f) => s + statSync(join(salida, f)).size, 0);

writeFileSync(join(salida, "manifest.json"), JSON.stringify({ frames: cuadros.length, pattern: "frame_%04d.webp", width: w, height: h }, null, 2));
console.log(`Listo: ${cuadros.length} cuadros de ${w}×${h}, ${(peso / 1024 / 1024).toFixed(1)} MB en total.`);
