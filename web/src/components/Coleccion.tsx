"use client";

import Image from "next/image";
import { MODELOS, PRECIO_CON_IVA, mxn } from "@/lib/catalogo";
import { EVENTO_MODELO } from "./Configurador";

export default function Coleccion() {
  const elegir = (codigo: string) => {
    window.dispatchEvent(new CustomEvent(EVENTO_MODELO, { detail: codigo }));
    document.getElementById("configura")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <ul className="grid gap-px bg-linea sm:grid-cols-3">
      {MODELOS.map((m, i) => (
        <li key={m.codigo} className="bg-papel">
          <button type="button" disabled={!m.disponible} onClick={() => elegir(m.codigo)} className="group block w-full text-left disabled:cursor-default">
            <span className="relative block aspect-[4/5] overflow-hidden bg-hueso">
              <Image
                src={m.imagen}
                alt={`Camisa YAJOS ${m.nombre}`}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                className={`object-contain p-8 mix-blend-multiply transition-transform duration-[1200ms] ease-(--ease-seda) ${m.disponible ? "group-hover:scale-[1.05]" : "opacity-60"}`}
              />
              <span className="absolute top-5 left-5 font-serif text-sm text-niebla italic">0{i + 1}</span>
            </span>
            <span className="flex items-end justify-between gap-4 px-5 py-6 sm:px-6">
              <span>
                <span className="block text-[10px] tracking-[0.18em] text-niebla uppercase">{m.codigo}</span>
                <span className="mt-1 block font-serif text-2xl">{m.nombre}</span>
              </span>
              <span className="text-right">
                <span className="block text-sm">{mxn(PRECIO_CON_IVA)}</span>
                <span className="etiqueta mt-1 block text-niebla transition-colors group-hover:text-tinta">{m.disponible ? "Personalizar →" : "Próximamente"}</span>
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
