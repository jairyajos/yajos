"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const ENLACES = [
  { href: "#coleccion", texto: "Colección" },
  { href: "#configura", texto: "Configura" },
  { href: "#como-comprar", texto: "Cómo comprar" },
  { href: "#contacto", texto: "Contacto" },
];

export default function Cabecera() {
  const [solida, setSolida] = useState(false);
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    const alScroll = () => setSolida(window.scrollY > 24);
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${solida || abierto ? "border-b border-linea bg-papel/90 backdrop-blur-md" : "bg-transparent"}`}
    >
      <div className="flex h-16 items-center justify-between px-5 sm:px-10 lg:px-16">
        <a href="#inicio" aria-label="YAJOS, inicio">
          <Image src="/yajos-logo-transparente.png" alt="YAJOS" width={96} height={29} priority className="h-6 w-auto" />
        </a>
        <nav className="hidden gap-9 md:flex" aria-label="Principal">
          {ENLACES.map((e) => (
            <a key={e.href} href={e.href} className="etiqueta text-niebla transition-colors hover:text-tinta">
              {e.texto}
            </a>
          ))}
        </nav>
        <a href="#configura" className="etiqueta hidden bg-tinta px-5 py-3 text-papel md:inline-block">
          Personaliza la tuya
        </a>
        <button
          type="button"
          className="-mr-2 p-2 md:hidden"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
          onClick={() => setAbierto((v) => !v)}
        >
          <span className={`block h-px w-6 bg-tinta transition-transform ${abierto ? "translate-y-[3px] rotate-45" : ""}`} />
          <span className={`mt-1.5 block h-px w-6 bg-tinta transition-transform ${abierto ? "-translate-y-[4px] -rotate-45" : ""}`} />
        </button>
      </div>
      {abierto && (
        <nav className="flex flex-col gap-6 border-t border-linea px-5 py-8 md:hidden" aria-label="Móvil">
          {ENLACES.map((e) => (
            <a key={e.href} href={e.href} onClick={() => setAbierto(false)} className="font-serif text-3xl italic">
              {e.texto}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
