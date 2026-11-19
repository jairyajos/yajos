# Decisiones del producto

Este registro solo crece: cada decisión lleva fecha y razón. Si una cambia, se agrega otra nueva que la
reemplaza, sin borrar la anterior. Los números entre paréntesis remiten al registro original de
maestria.studio.

---

### Construir de cero (D-001) · 2026-09-10
El sitio anterior es un solo HTML sin backend. Del viejo se rescataron el diseño, la lógica del configurador
y el formato del mensaje del pedido. **Mientras se construye el nuevo, el viejo sigue vendiendo en
yajos.com.mx.**

### Todas las cuentas son de YAJOS (D-002) · 2026-09-10
Stripe, Supabase, Vercel, el dominio y GitHub se abren en cuentas de YAJOS. Así el negocio puede seguir sin
depender de nadie, y los cobros y costos llegan directo a quien vende.

### Proyecto independiente (D-003, D-011) · 2026-10-10
YAJOS no comparte código, base de datos ni cuentas con ningún otro proyecto.

### Next.js 16 (D-004, D-012) · 2026-10-10
Se eligió Next.js porque permite tener una URL por modelo, páginas legales indexables y código de servidor
para cobrar. Se usa la versión 16 porque la 15 tenía vulnerabilidades conocidas.

### Hero con scroll scrub (D-013, D-019) · 2026-10-10
El video "armado de camisa" se hizo en Grok a partir de la imagen "Camisa verde en partes". Se convierte en
una secuencia de cuadros dibujados en un `<canvas>`, porque adelantar un `<video>` con el scroll se ve a
tirones, sobre todo en Safari. Al final del recorrido entra el logotipo.

Se descartaron dos versiones: un despiece hecho en código, que parecía de recortes de revista, y un video
de Higgsfield que deformó las piezas.

**Pendiente:** en el video desaparecen los botones del frente y en los puños salen gemelos. Hay que decidir
si eso representa bien la camisa.

### Tres tipografías: molde, cursiva y gótica (D-014, D-015) · 2026-10-10
La gótica se agregó a las dos que ya tenía el sitio viejo.

### Tallas por letra y modelos disponibles (D-020) · 2026-10-10
Toda la línea usa CH, MD, GD, XG, 2XL y 3XL, en lugar de las tallas de cuello del sitio viejo. Solo se
venden la Blanca y la Azul Cielo. La Gris Perla aparece como "Próximamente" y se reactiva con
`disponible: true` en `catalogo.ts`.

Combinaciones que se pueden pedir: 2 modelos × 6 tallas × 20 hilos × 3 tipografías × 4 posiciones = **2,880**.

### Iniciales en el configurador · 2026-10-10
En el pecho van más pequeñas y más abajo de la clavícula. En los puños van en vertical y no tapan el botón.

### Pago con Stripe Checkout, apagado por defecto (D-021) · 2026-10-10
El precio lo pone siempre el servidor, a partir del catálogo. La orden del bordador viaja en los `metadata`
del pago y se ve en el panel de Stripe. Sin llave de Stripe, el sitio vende por WhatsApp.

Meses sin intereses (D-007): se recomiendan, pero la decisión es del dueño. Se encienden con `STRIPE_MSI=1`.

### Vista previa en Vercel (D-022) · 2026-10-10
Se publicó temporalmente en la cuenta de Ludwig, en yajos.vercel.app. **Pasa a la cuenta de Jair con el
traspaso del 2026-11-18.** Para cobrar hace falta el plan Pro, porque Hobby no permite uso comercial.

### Inventario en Supabase (D-023) · 2026-11-10
Se crearon las tablas `modelos`, `tallas` e `inventario`. La carga inicial tiene 33 piezas de Azul y
33 de Blanca. La base de datos va en la cuenta de Supabase de Jair.

Falta confirmar cuatro cosas:
- Si las dos tablas son de verdad idénticas.
- Si la talla xxxxl se guarda como 4XL.
- Las equivalencias de talla (ch→CH, m→MD, l→GD, xl→XG, xxl→2XL, xxxl→3XL).
- Si el pecho de 52 a 64 cm es el ancho de la camisa en plano o el contorno del cuerpo.

### Capacidad de bordado por día (D-006) · pendiente, bloquea el cobro automático
Falta saber cuántas camisas se pueden bordar al día. Sin ese número, un pago automático podría aceptar
veinte pedidos en un fin de semana prometiendo 5 días a todos.

---

### Traspaso a Jair · 2026-11-18
El código, la publicación y los pagos pasan a cuentas de Jair: el repositorio a su GitHub, el proyecto a su
Vercel y las llaves a su Stripe. El proceso está en [manual-jair.md](manual-jair.md).
