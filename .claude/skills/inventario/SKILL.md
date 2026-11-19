---
name: inventario
description: Crear o actualizar en Supabase el inventario de camisas de YAJOS (piezas por modelo y talla) y conectarlo al sitio. Úsala cuando Jair mande un inventario nuevo, pregunte cuántas piezas hay o quiera bloquear las tallas agotadas.
---

# Inventario en Supabase

**Esquema** (`web/supabase/migrations/20261110000100_inventario.sql`):
- `modelos`: código, nombre, disponible.
- `tallas`: id, nombre, orden, pecho_cm, cuello_in.
- `inventario`: modelo_codigo, talla_id, piezas (≥ 0).

RLS está encendido y sin políticas, así que solo el servidor lee y escribe, con la llave secreta.

**Carga inicial** (`20261110000200_inventario_inicial.sql`): Azul YJ-ACI-002 y Blanca YJ-BLA-001, 33 piezas
cada una, de CH a 4XL.

## Primera vez

1. Jair crea el proyecto `yajos` en supabase.com, en la región East US, y guarda la contraseña de la base.
2. Pregúntale si ya respondió las cuatro dudas. Ajusta la carga inicial con sus respuestas antes de subirla:
   - ¿Las dos tablas son idénticas?
   - ¿4XL se queda?
   - ¿Las equivalencias de talla son correctas?
   - ¿El pecho está medido en plano o es el contorno?
3. En Terminal, desde `web/`:
   - `supabase login` (abre el navegador).
   - `supabase link --project-ref <REF>`. El ref está en la URL del proyecto. **La contraseña la escribe
     Jair**, no tú.
   - `supabase db push`, que aplica las dos migraciones.
4. Comprueba en Supabase → Table Editor que `inventario` tiene 14 filas.

## Actualizar piezas

No edites las migraciones que ya se aplicaron.
- **Cambios sueltos:** Jair los hace en el Table Editor de Supabase.
- **Inventario completo nuevo:** crea una migración nueva `AAAAMMDDHHMMSS_inventario_<fecha>.sql` con
  `insert ... on conflict (modelo_codigo, talla_id) do update set piezas = excluded.piezas, actualizado_en = now()`
  y luego corre `supabase db push`.

## Conectar el sitio (pendiente)

1. Jair pega en Vercel `SUPABASE_URL` y `SUPABASE_SECRET_KEY` (la llave secreta está en Supabase → Project
   Settings → API keys). Para trabajar en local: `vercel env pull .env.local`.
2. Instala `@supabase/supabase-js` y crea `web/src/lib/supabase.ts` con `import "server-only"`.
3. Lee el inventario en el servidor con una revalidación corta:
   - En el configurador, las tallas con 0 piezas aparecen como "Agotada" y no se pueden elegir.
   - En `/api/checkout`, rechaza la talla si no hay piezas.
4. Si se confirma la 4XL, agrégala a `TALLAS` en `catalogo.ts`.
