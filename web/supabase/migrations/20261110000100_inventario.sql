-- Inventario de YAJOS: modelos, tallas y piezas por modelo × talla (D-023).
-- El bordado no es inventario: es una instrucción de producción que vive en el pedido.

create table public.modelos (
  codigo      text primary key,
  nombre      text not null,
  disponible  boolean not null default true
);

create table public.tallas (
  id         text primary key,
  nombre     text not null,
  orden      smallint not null unique,
  -- Medidas tal como las entrega el socio. `pecho_cm` va de 52 a 64, así que parece el ancho de
  -- pecho en plano y no el contorno; por confirmar antes de publicarlo en una guía de tallas.
  pecho_cm   numeric(4,1),
  cuello_in  numeric(3,1)
);

create table public.inventario (
  modelo_codigo   text not null references public.modelos (codigo),
  talla_id        text not null references public.tallas (id),
  piezas          integer not null default 0 check (piezas >= 0),
  actualizado_en  timestamptz not null default now(),
  primary key (modelo_codigo, talla_id)
);

create index inventario_talla_idx on public.inventario (talla_id);

-- RLS encendido y sin políticas: solo el servidor (service role) lee y escribe. El navegador nunca
-- consulta estas tablas directo.
alter table public.modelos enable row level security;
alter table public.tallas enable row level security;
alter table public.inventario enable row level security;
