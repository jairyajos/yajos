-- Carga inicial del inventario, capturada de las tablas "CAMISA AZUL" y "CAMISA BLANCA" que entregó el
-- socio el 2026-11-10. 33 piezas por modelo, 66 en total.
--
-- Las tallas del socio (ch, m, l, xl, xxl, xxxl, xxxxl) se guardan con los identificadores del sitio
-- (CH, MD, GD, XG, 2XL, 3XL) más 4XL, que es nueva.

insert into public.modelos (codigo, nombre, disponible) values
  ('YJ-BLA-001', 'Blanca', true),
  ('YJ-ACI-002', 'Azul Cielo', true),
  ('YJ-GPE-003', 'Gris Perla', false)
on conflict (codigo) do update set nombre = excluded.nombre, disponible = excluded.disponible;

insert into public.tallas (id, nombre, orden, pecho_cm, cuello_in) values
  ('CH',  'Chica',        1, 52, 15.5),
  ('MD',  'Mediana',      2, 54, 16),
  ('GD',  'Grande',       3, 56, 16.5),
  ('XG',  'Extra grande', 4, 58, 17),
  ('2XL', '2XL',          5, 60, 17.5),
  ('3XL', '3XL',          6, 62, 18),
  ('4XL', '4XL',          7, 64, 18.5)
on conflict (id) do update set nombre = excluded.nombre, orden = excluded.orden, pecho_cm = excluded.pecho_cm, cuello_in = excluded.cuello_in;

insert into public.inventario (modelo_codigo, talla_id, piezas) values
  ('YJ-ACI-002', 'CH',  2),
  ('YJ-ACI-002', 'MD',  9),
  ('YJ-ACI-002', 'GD',  9),
  ('YJ-ACI-002', 'XG',  6),
  ('YJ-ACI-002', '2XL', 5),
  ('YJ-ACI-002', '3XL', 2),
  ('YJ-ACI-002', '4XL', 0),
  ('YJ-BLA-001', 'CH',  2),
  ('YJ-BLA-001', 'MD',  9),
  ('YJ-BLA-001', 'GD',  9),
  ('YJ-BLA-001', 'XG',  6),
  ('YJ-BLA-001', '2XL', 5),
  ('YJ-BLA-001', '3XL', 2),
  ('YJ-BLA-001', '4XL', 0)
on conflict (modelo_codigo, talla_id) do update set piezas = excluded.piezas, actualizado_en = now();
