"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  DIAS_ENTREGA,
  FICHA,
  HILOS,
  MODELOS,
  MODELOS_DISPONIBLES,
  POSICIONES,
  PRECIO_CON_IVA,
  TALLAS,
  TIPOGRAFIAS,
  ZONAS,
  mxn,
} from "@/lib/catalogo";
import type { Tipografia } from "@/lib/catalogo";
import { aIds, enlaceWhatsApp, faltantes, mensajePedido, normalizarIniciales, type Pedido } from "@/lib/pedido";

// El cobro en línea se enciende cuando el socio conecta su cuenta de Stripe (D-021).
const PAGOS_ACTIVOS = process.env.NEXT_PUBLIC_PAGOS === "1";

// Dónde se dibuja el monograma sobre la foto de la camisa doblada (vista indicativa), en % de la
// foto. Pecho: a la altura del segundo y tercer botón, no junto a la clavícula. Puño: en vertical
// (letras apiladas) sobre la tapa del puño, a la izquierda del botón para no encimarse con él.
type Punto = { top: string; left: string; vertical?: boolean };
const PUNTO: Record<string, Punto> = {
  "pecho-izq": { top: "56%", left: "70%" },
  "pecho-der": { top: "56%", left: "30%" },
  "puno-izq": { top: "70%", left: "67.5%", vertical: true },
  "puno-der": { top: "70%", left: "67.5%", vertical: true },
};

export const EVENTO_MODELO = "yajos:modelo";

const ESTILO_LETRA: Record<Tipografia["id"], React.CSSProperties> = {
  molde: { fontFamily: "var(--font-barlow)", fontWeight: 600, letterSpacing: "0.14em" },
  cursiva: { fontFamily: "var(--font-playfair)", fontStyle: "italic", letterSpacing: "0.04em" },
  gotica: { fontFamily: "var(--font-gotica)", letterSpacing: "0.02em" },
};

function Paso({ n, titulo, children, extra }: { n: number; titulo: string; children: React.ReactNode; extra?: React.ReactNode }) {
  return (
    <fieldset className="border-t border-linea py-8 first:border-t-0 first:pt-0">
      <legend className="sr-only">{titulo}</legend>
      <div className="mb-5 flex items-baseline justify-between gap-4">
        <p className="flex items-baseline gap-3">
          <span className="font-serif text-sm text-niebla italic">{String(n).padStart(2, "0")}</span>
          <span className="etiqueta">{titulo}</span>
        </p>
        {extra}
      </div>
      {children}
    </fieldset>
  );
}

const opcion =
  "border border-linea bg-papel text-tinta transition-colors duration-200 hover:border-tinta aria-pressed:border-tinta aria-pressed:bg-tinta aria-pressed:text-papel focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-tinta";

export default function Configurador() {
  const [nombre, setNombre] = useState("");
  const [modelo, setModelo] = useState(MODELOS_DISPONIBLES[0]);
  const [talla, setTalla] = useState(TALLAS[2]);
  const [iniciales, setIniciales] = useState("");
  const [tipografia, setTipografia] = useState(TIPOGRAFIAS[0]);
  const [hilo, setHilo] = useState(HILOS[4]);
  const [posicion, setPosicion] = useState(POSICIONES[2]);
  const [zona, setZona] = useState(ZONAS[0]);
  const [intento, setIntento] = useState(false);
  const [copiado, setCopiado] = useState(false);

  // La colección de arriba puede preseleccionar un modelo.
  useEffect(() => {
    const alElegir = (e: Event) => {
      const m = MODELOS_DISPONIBLES.find((x) => x.codigo === (e as CustomEvent<string>).detail);
      if (m) setModelo(m);
    };
    window.addEventListener(EVENTO_MODELO, alElegir);
    return () => window.removeEventListener(EVENTO_MODELO, alElegir);
  }, []);

  const pedido: Pedido = { nombre, modelo, talla, iniciales, tipografia, hilo, posicion, zona };
  const pendientes = faltantes(pedido);
  const listo = pendientes.length === 0;
  const mensaje = mensajePedido(pedido);

  const monograma = iniciales || "Y.J.S";
  const estiloMonograma = ESTILO_LETRA[tipografia.id];
  const colorTinta = hilo.hex.toLowerCase() === "#f5f0e6" ? "#b9b4aa" : hilo.hex;

  const [pagando, setPagando] = useState(false);
  const [errorPago, setErrorPago] = useState(false);
  const pagar = async () => {
    if (!listo) return setIntento(true);
    setPagando(true);
    setErrorPago(false);
    try {
      const r = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(aIds(pedido)) });
      const { url } = await r.json();
      if (!r.ok || !url) throw new Error();
      window.location.assign(url);
    } catch {
      setErrorPago(true);
      setPagando(false);
    }
  };

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(mensaje);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2200);
    } catch {
      setCopiado(false);
    }
  };

  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,440px)] lg:gap-20">
      {/* Controles */}
      <form onSubmit={(e) => e.preventDefault()} noValidate>
        <Paso n={1} titulo="Modelo">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {MODELOS.map((m) => (
              <button
                key={m.codigo}
                type="button"
                aria-pressed={m.codigo === modelo.codigo}
                disabled={!m.disponible}
                onClick={() => setModelo(m)}
                className="group border border-linea bg-papel p-2 text-left transition-colors hover:border-tinta disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-linea aria-pressed:border-tinta aria-pressed:ring-1 aria-pressed:ring-tinta"
              >
                <span className="relative block aspect-[4/5] overflow-hidden bg-hueso">
                  <Image src={m.imagen} alt="" fill sizes="(max-width: 640px) 30vw, 180px" className="object-contain mix-blend-multiply transition-transform duration-700 ease-(--ease-seda) group-hover:scale-[1.04]" />
                </span>
                <span className="mt-2 block text-[9px] tracking-[0.16em] text-niebla uppercase">{m.codigo}</span>
                <span className="block text-sm font-medium">{m.nombre}</span>
                {!m.disponible && <span className="mt-1 block text-[10px] tracking-[0.14em] text-niebla uppercase">Próximamente</span>}
              </button>
            ))}
          </div>
        </Paso>

        <Paso n={2} titulo="Talla">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {TALLAS.map((t) => (
              <button key={t.id} type="button" aria-pressed={t.id === talla.id} aria-label={t.nombre} onClick={() => setTalla(t)} className={`${opcion} py-3 text-sm font-medium tracking-[0.06em]`}>
                {t.id}
              </button>
            ))}
          </div>
        </Paso>

        <Paso n={3} titulo="Iniciales">
          <input
            value={iniciales}
            onChange={(e) => setIniciales(normalizarIniciales(e.target.value))}
            placeholder="Y.J.S"
            aria-label="Iniciales a bordar"
            aria-invalid={intento && pendientes.some((p) => p.startsWith("tus iniciales"))}
            autoComplete="off"
            className="w-full border-0 border-b border-linea bg-transparent py-3 text-center text-3xl outline-none placeholder:text-linea focus:border-tinta aria-invalid:border-red-700"
            style={estiloMonograma}
          />
          <p className="mt-2 text-xs text-niebla">De 1 a 4 letras. Los puntos son opcionales.</p>
        </Paso>

        <Paso n={4} titulo="Tipo de letra">
          <div className="grid grid-cols-3 gap-2">
            {TIPOGRAFIAS.map((t) => (
              <button key={t.id} type="button" aria-pressed={t.id === tipografia.id} onClick={() => setTipografia(t)} className={`${opcion} px-4 py-4 text-left`}>
                <span className="block text-xl" style={ESTILO_LETRA[t.id]}>
                  {t.nombre}
                </span>
                <span className="block text-[11px] opacity-60">{t.descripcion}</span>
              </button>
            ))}
          </div>
        </Paso>

        <Paso n={5} titulo="Color de hilo" extra={<span className="text-xs text-niebla">{hilo.nombre} · #{hilo.numero}</span>}>
          <div className="grid max-w-md grid-cols-10 gap-x-2 gap-y-3" role="radiogroup" aria-label="Color de hilo">
            {HILOS.map((h) => (
              <button
                key={h.numero}
                type="button"
                role="radio"
                aria-checked={h.numero === hilo.numero}
                aria-label={`${h.nombre}, número ${h.numero}`}
                title={`${h.nombre} #${h.numero}`}
                onClick={() => setHilo(h)}
                className="aspect-square rounded-full ring-1 ring-black/10 ring-inset transition-transform duration-200 hover:scale-110 aria-checked:scale-110 aria-checked:outline-2 aria-checked:outline-offset-2 aria-checked:outline-tinta"
                style={{ background: h.hex }}
              />
            ))}
          </div>
        </Paso>

        <Paso n={6} titulo="Posición del bordado">
          <div className="grid grid-cols-2 gap-2">
            {POSICIONES.map((p) => (
              <button key={p.id} type="button" aria-pressed={p.id === posicion.id} onClick={() => setPosicion(p)} className={`${opcion} py-3 text-sm`}>
                {p.nombre}
              </button>
            ))}
          </div>
        </Paso>

        <Paso n={7} titulo="Tus datos y entrega">
          <label className="block">
            <span className="text-xs text-niebla">Nombre</span>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoComplete="name"
              placeholder="Carlos Mendoza"
              aria-invalid={intento && pendientes.includes("tu nombre")}
              className="mt-1 w-full border-0 border-b border-linea bg-transparent py-3 text-lg outline-none placeholder:text-linea focus:border-tinta aria-invalid:border-red-700"
            />
          </label>
          <label className="mt-6 block">
            <span className="text-xs text-niebla">Zona de entrega</span>
            <select
              value={zona.id}
              onChange={(e) => setZona(ZONAS.find((z) => z.id === e.target.value)!)}
              className="mt-1 w-full cursor-pointer border-0 border-b border-linea bg-transparent py-3 text-lg outline-none focus:border-tinta"
            >
              {ZONAS.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.nombre}
                  {z.sinCosto ? " — sin costo" : ""}
                </option>
              ))}
            </select>
          </label>
        </Paso>
      </form>

      {/* Vista previa y cierre */}
      <aside className="lg:sticky lg:top-24 lg:self-start" aria-label="Resumen del pedido">
        <div className="bg-hueso p-5 sm:p-7">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[340px]">
            <Image key={modelo.codigo} src={modelo.imagen} alt={`Camisa ${modelo.nombre}`} fill sizes="340px" className="object-contain mix-blend-multiply" />
            <span
              className={`absolute -translate-x-1/2 -translate-y-1/2 leading-none whitespace-nowrap transition-all duration-500 ease-(--ease-seda) ${
                PUNTO[posicion.id].vertical ? "text-[clamp(8px,1vw,11px)] [text-orientation:upright] [writing-mode:vertical-rl]" : "text-[clamp(10px,1.3vw,13px)]"
              }`}
              style={{ ...estiloMonograma, top: PUNTO[posicion.id].top, left: PUNTO[posicion.id].left, color: colorTinta, ...(PUNTO[posicion.id].vertical && { letterSpacing: "0.08em" }) }}
            >
              {/* En vertical las letras van apiladas y sin puntos, como se borda en el puño. */}
              {PUNTO[posicion.id].vertical ? monograma.replace(/\./g, "") : monograma}
            </span>
          </div>
          <p className="mt-2 text-center text-[10px] tracking-[0.18em] text-niebla uppercase">Vista indicativa · {posicion.nombre}</p>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-linea pt-5 text-sm">
            <dt className="text-niebla">Modelo</dt>
            <dd className="text-right">{modelo.nombre}</dd>
            <dt className="text-niebla">Talla</dt>
            <dd className="text-right">{talla.id}</dd>
            <dt className="text-niebla">Bordado</dt>
            <dd className="text-right">
              {tipografia.nombre} · {hilo.nombre}
            </dd>
            <dt className="text-niebla">Entrega</dt>
            <dd className="text-right">{DIAS_ENTREGA} días hábiles</dd>
          </dl>

          <div className="mt-6 flex items-baseline justify-between border-t border-tinta pt-5">
            <span className="etiqueta">Total</span>
            <span className="font-serif text-4xl">
              {mxn(PRECIO_CON_IVA)}
              <span className="ml-2 font-sans text-xs text-niebla">IVA incluido</span>
            </span>
          </div>

          {intento && !listo && (
            <p role="alert" className="mt-4 text-sm text-red-800">
              Falta {pendientes.join(" y ")}.
            </p>
          )}

          {PAGOS_ACTIVOS && (
            <>
              <button
                type="button"
                onClick={pagar}
                disabled={pagando}
                aria-disabled={!listo}
                className="etiqueta mt-5 flex w-full items-center justify-center gap-3 bg-tinta py-4 text-papel transition-opacity hover:opacity-90 disabled:opacity-60 aria-disabled:opacity-40"
              >
                {pagando ? "Abriendo pago seguro…" : "Pagar con tarjeta"}
              </button>
              {errorPago && (
                <p role="alert" className="mt-3 text-sm text-red-800">
                  No pudimos abrir el pago. Intenta de nuevo o envía tu pedido por WhatsApp.
                </p>
              )}
            </>
          )}
          <a
            href={listo ? enlaceWhatsApp(pedido) : undefined}
            target="_blank"
            rel="noopener"
            onClick={(e) => {
              if (!listo) {
                e.preventDefault();
                setIntento(true);
              }
            }}
            aria-disabled={!listo}
            className={`etiqueta flex w-full items-center justify-center gap-3 py-4 transition-opacity hover:opacity-90 aria-disabled:opacity-40 ${
              PAGOS_ACTIVOS ? "mt-2 border border-tinta text-tinta" : "mt-5 bg-tinta text-papel"
            }`}
          >
            Enviar pedido por WhatsApp
          </a>
          <button type="button" onClick={copiar} disabled={!listo} className="mt-2 w-full py-3 text-xs text-niebla underline-offset-4 hover:text-tinta hover:underline disabled:opacity-40">
            {copiado ? "Mensaje copiado" : "Copiar mensaje del pedido"}
          </button>
          <p className="mt-4 border-t border-linea pt-4 text-[11px] leading-relaxed text-niebla">
            {PAGOS_ACTIVOS
              ? "Pago con tarjeta procesado por Stripe. Tus datos de tarjeta nunca pasan por YAJOS."
              : "Pago con tarjeta en línea: en construcción. Por ahora confirmamos disponibilidad y pago por WhatsApp."}
          </p>
        </div>

        <details className="mt-4 border-b border-linea pb-4 text-sm">
          <summary className="etiqueta cursor-pointer py-2">Ficha técnica y cuidados</summary>
          <p className="mt-2 text-carbon">
            Corte {FICHA.corte.toLowerCase()} · {FICHA.costura.toLowerCase()} · {FICHA.composicion}
          </p>
          <ul className="mt-3 space-y-1 text-niebla">
            {FICHA.lavado.map((l) => (
              <li key={l}>— {l}</li>
            ))}
          </ul>
        </details>
      </aside>
    </div>
  );
}
