"use client";

import { useEffect, useRef, useState } from "react";
import { clamp, opacidad, type Capitulo } from "@/lib/capitulos";

// Hero con scroll scrub: la secuencia de cuadros que genera `npm run frames` a partir del video
// de IMAGESANDVIDEOS/ se pinta en un <canvas> según el progreso del scroll (D-013, D-019). Al
// final entra el logotipo.
//
// El scrub lo controla el propio scroll del usuario, no corre solo; por eso se mantiene aun con
// "reducir movimiento". Lo que se apaga en ese modo es el desplazamiento de los textos.
type Manifest = { frames: number; pattern: string; width: number; height: number };

const T_LOGO: [number, number] = [0.86, 0.97];

export default function ScrollScrub({ capitulos, alto = 480, logo }: { capitulos: Capitulo[]; alto?: number; logo?: string }) {
  const seccion = useRef<HTMLElement>(null);
  const lienzo = useRef<HTMLCanvasElement>(null);
  const marca = useRef<HTMLImageElement>(null);
  const capas = useRef<(HTMLDivElement | null)[]>([]);
  const cuadros = useRef<HTMLImageElement[]>([]);
  const [listo, setListo] = useState(false);

  // Manifiesto y precarga progresiva de cuadros.
  useEffect(() => {
    let vivo = true;
    fetch("/scrub/manifest.json", { cache: "no-store" })
      .then((r) => (r.ok ? (r.json() as Promise<Manifest>) : Promise.reject()))
      .then((m) => {
        if (!vivo || !m.frames) return;
        cuadros.current = Array.from({ length: m.frames }, (_, i) => {
          const img = new window.Image();
          img.decoding = "async";
          img.src = `/scrub/${m.pattern.replace("%04d", String(i + 1).padStart(4, "0"))}`;
          return img;
        });
        cuadros.current[0].onload = () => vivo && setListo(true);
      })
      .catch(() => {});
    return () => {
      vivo = false;
    };
  }, []);

  useEffect(() => {
    const sec = seccion.current!;
    const reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pendiente = false;
    let ultimo = -1;

    const dibujar = (p: number) => {
      const cv = lienzo.current;
      const lista = cuadros.current;
      if (!cv || !lista.length) return;
      let i = Math.round(p * (lista.length - 1));
      // Si el cuadro exacto no ha cargado, usar el cargado más cercano hacia atrás.
      while (i > 0 && !(lista[i].complete && lista[i].naturalWidth)) i--;
      const img = lista[i];
      if (i === ultimo || !img.naturalWidth) return;
      ultimo = i;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = cv.clientWidth * dpr;
      const h = cv.clientHeight * dpr;
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
      }
      const ctx = cv.getContext("2d")!;
      // "contain": la camisa completa siempre a la vista, sobre el mismo blanco del video.
      const escala = Math.min(w / img.naturalWidth, h / img.naturalHeight);
      const dw = img.naturalWidth * escala;
      const dh = img.naturalHeight * escala;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    };

    const actualizar = () => {
      pendiente = false;
      const r = sec.getBoundingClientRect();
      const p = clamp(-r.top / (r.height - window.innerHeight));
      sec.style.setProperty("--p", p.toFixed(4));
      dibujar(p);
      // Cierre: la camisa sube y se achica un poco para dejarle espacio al logotipo.
      const c = clamp((p - T_LOGO[0]) / (T_LOGO[1] - T_LOGO[0]));
      if (marca.current) marca.current.style.opacity = String(c);
      if (lienzo.current) lienzo.current.style.transform = `translateY(${-9 * c}%) scale(${1 - 0.12 * c})`;
      capitulos.forEach((c, i) => {
        const el = capas.current[i];
        if (!el) return;
        const o = opacidad(p, c.desde, c.hasta, i === 0, i === capitulos.length - 1);
        el.style.opacity = String(o);
        el.style.transform = reducido ? "none" : `translate3d(0, ${(1 - o) * 18}px, 0)`;
        el.style.pointerEvents = o > 0.5 ? "auto" : "none";
      });
    };
    const pedir = () => {
      if (!pendiente) {
        pendiente = true;
        requestAnimationFrame(actualizar);
      }
    };
    const redimensionar = () => {
      ultimo = -1;
      pedir();
    };

    actualizar();
    window.addEventListener("scroll", pedir, { passive: true });
    window.addEventListener("resize", redimensionar);
    return () => {
      window.removeEventListener("scroll", pedir);
      window.removeEventListener("resize", redimensionar);
    };
  }, [listo, capitulos]);

  return (
    <section ref={seccion} aria-label="Presentación" className="relative bg-white" style={{ height: `${alto}svh`, ["--p" as string]: 0 }}>
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden lg:flex-row-reverse">
        <div className="relative min-h-0 flex-1 pt-16 lg:w-1/2 lg:flex-none">
          <div className="relative h-full w-full">
            <canvas ref={lienzo} className="absolute inset-0 h-full w-full" role="img" aria-label="Camisa YAJOS armándose pieza por pieza" />
            {logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                ref={marca}
                src={logo}
                alt="YAJOS"
                className="pointer-events-none absolute inset-x-0 bottom-[5%] mx-auto w-[min(40%,260px)] opacity-0"
              />
            )}
          </div>
        </div>

        <div className="relative h-[38svh] shrink-0 lg:h-auto lg:w-1/2">
          {capitulos.map((c, i) => (
            <div
              key={i}
              ref={(el) => {
                capas.current[i] = el;
              }}
              className="absolute inset-0 flex items-start px-5 pt-2 opacity-0 will-change-transform sm:px-10 lg:items-center lg:px-16 lg:pt-0"
            >
              <div className="max-w-xl">
                <p className="etiqueta mb-3 text-niebla lg:mb-4">{c.eyebrow}</p>
                <h2 className="font-serif text-[clamp(2rem,5.2vw,4.4rem)] leading-[1.02] tracking-[-0.01em]">{c.titulo}</h2>
                {c.texto && <p className="mt-3 max-w-md text-[15px] leading-relaxed font-light text-carbon/80 lg:mt-5">{c.texto}</p>}
                {c.accion && (
                  <a
                    href={c.accion.href}
                    className="etiqueta mt-5 inline-flex items-center gap-3 bg-tinta px-7 py-4 text-papel transition-transform duration-300 ease-(--ease-seda) hover:-translate-y-0.5 lg:mt-8"
                  >
                    {c.accion.etiqueta} <span aria-hidden>→</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
