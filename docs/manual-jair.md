# Manual de traspaso de YAJOS, para Jair (Mac)

Con este manual quedas con el control completo de YAJOS: el código en tu GitHub, el sitio en tu Vercel y los
cobros en tu Stripe. Los pasos van en orden y cada uno dice cómo comprobar que quedó bien.

> **Regla de oro:** las llaves y contraseñas solo se pegan en los paneles de Vercel, Stripe o Supabase.
> Nunca en Slack, en un correo ni en el chat de Claude.

---

## 1. GitHub: recibir el código

1. En github.com, arriba a la derecha, entra a **+ → New repository**.
   - Nombre: `yajos`
   - Visibilidad: **Private**
   - **No** marques "Add a README", ".gitignore" ni "license". El repositorio debe quedar vacío.
2. En el repositorio, entra a **Settings → Collaborators → Add people** e invita a Ludwig con su usuario de
   GitHub.
3. Mándale a Ludwig por Slack la dirección del repositorio, por ejemplo `github.com/TU-USUARIO/yajos`.
   Él sube el código.

✅ **Para comprobar:** al recargar la página del repositorio ves las carpetas `web`, `docs` e
`IMAGESANDVIDEOS`.

Cuando termine el traspaso, si quieres, puedes quitar a Ludwig de **Collaborators**.

---

## 2. Instalar las herramientas en tu Mac (una sola vez)

Abre la app **Terminal**: presiona ⌘ + espacio y escribe "Terminal". Pega cada bloque y presiona Enter.

**Homebrew**, el instalador de programas para Mac. Al terminar, te pide copiar dos líneas que empiezan con
`echo`; pégalas también.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

**Node, Git, GitHub CLI, ffmpeg y Supabase:**

```bash
brew install node git gh ffmpeg supabase/tap/supabase
```

**Vercel CLI:**

```bash
npm install -g vercel
```

**Inicia sesión en GitHub desde la Mac.** Elige `GitHub.com`, luego `HTTPS` y luego "Login with a web
browser":

```bash
gh auth login
```

**Descarga el proyecto.** Cambia `TU-USUARIO` por tu usuario de GitHub:

```bash
mkdir -p ~/Proyectos && gh repo clone TU-USUARIO/yajos ~/Proyectos/yajos
```

✅ **Para comprobar:** `node -v` muestra una versión 20 o mayor, y existe la carpeta `~/Proyectos/yajos`.

---

## 3. Abrir el proyecto con Claude

1. Abre la app de **Claude** y entra a la pestaña **Code**.
2. Elige la carpeta `~/Proyectos/yajos`.
3. Claude lee automáticamente `CLAUDE.md` (el contexto del negocio y las reglas) y las skills del proyecto.
   No hay que instalar nada más.
4. Para probar que todo funciona, escríbele:
   > Instala las dependencias y corre el sitio en local.

   Te va a mostrar el sitio en el panel del navegador, en http://localhost:3100.

**Skills incluidas** (escribe `/` en el chat para verlas):

| Skill | Para qué sirve |
|---|---|
| `/desplegar` | Publicar cambios y administrar variables en Vercel |
| `/activar-pagos` | Conectar tu Stripe: primero en modo prueba, después cobro real |
| `/inventario` | Subir y actualizar el inventario en Supabase |
| `/video-hero` | Cambiar el video del inicio (el armado de la camisa) |
| `/cambiar-catalogo` | Agregar o quitar modelos, colores de hilo, tallas, o cambiar el precio |

No hace falta saber programar: pídele las cosas en español. Claude te pregunta antes de publicar o de tocar
tus cuentas.

---

## 4. Vercel: publicar el sitio desde tu cuenta

1. Entra a vercel.com/new y elige **Import Git Repository**. Si no ves el repositorio `yajos`, da clic en
   "Adjust GitHub App Permissions" y dale acceso.
2. En la configuración del proyecto:
   - **Project Name:** `yajos`. Si te dice que está ocupado, avisa a Ludwig: primero borra el suyo para que
     tú te quedes con `yajos.vercel.app`.
   - **Root Directory:** `web`. Este paso es importante.
   - Framework: Next.js (se detecta solo).
3. Da clic en **Deploy**. Por ahora no agregues variables: el sitio funciona y vende por WhatsApp.

✅ **Para comprobar:** abre la dirección `.vercel.app` que te da Vercel y haz scroll. La camisa se arma y al
final aparece el logotipo.

**Desde ahora, cada cambio que se suba a GitHub se publica solo.**

**Plan:** para vender con tarjeta necesitas **Vercel Pro**. El plan Hobby gratuito no permite uso comercial.
Puedes cambiar de plan hasta que actives el cobro real.

**Dominio yajos.com.mx:** todavía **no** se mueve, porque el sitio viejo sigue vendiendo ahí. Se conecta en
Vercel (Settings → Domains) el día del lanzamiento. Claude te guía con `/desplegar`.

---

## 5. Stripe: conectar tus cobros (modo prueba)

1. En dashboard.stripe.com, activa el **modo de prueba** con el interruptor de arriba, "Test mode" o
   "Entorno de prueba".
2. Entra a **Desarrolladores → Claves de API** y copia la **clave secreta**. Empieza con `sk_test_`.
3. En Vercel, entra a tu proyecto `yajos` → **Settings → Environment Variables** y agrega:
   - `STRIPE_SECRET_KEY` = la clave que copiaste
   - `NEXT_PUBLIC_PAGOS` = `1`
   - `STRIPE_MSI` = `1`, solo si quieres meses sin intereses
4. Ve a **Deployments**, abre el menú ⋯ del más reciente y da clic en **Redeploy**.

✅ **Para comprobar:** en el configurador aparece el botón **"Pagar con tarjeta"**. Paga con la tarjeta de
prueba `4242 4242 4242 4242`, cualquier fecha futura y cualquier CVC. El pago aparece en Stripe, en modo
prueba, con las iniciales y el hilo en los metadatos.

**No uses la clave real (`sk_live_`) todavía.** Antes hay que terminar lo que dice `CLAUDE.md`, en la
sección "Antes de cobrar de verdad": registro de pedidos, tope por capacidad de bordado, páginas legales y
factura. Pídele a Claude `/activar-pagos` cuando llegue el momento.

---

## 6. Supabase: la base del inventario

1. En supabase.com, crea un proyecto llamado `yajos`, en la región **East US**. Guarda la contraseña de la
   base en tu gestor de contraseñas.
2. Pídele a Claude:
   > /inventario sube el inventario inicial

   Te va a pedir que inicies sesión y que escribas la contraseña tú mismo en la Terminal.

Antes de subir el inventario, contesta las 4 dudas que Ludwig dejó en #yajos sobre las tablas de inventario.

---

## 7. Cierre del traspaso

Ludwig, en su lado:
- Borra el proyecto `yajos` de su cuenta de Vercel, cuando el tuyo ya funcione.
- Deja de tener acceso a tus cuentas, si así lo decides.

Tú:
- Quita a Ludwig de **Collaborators** en GitHub si ya no lo necesitas.
- Guarda en tu gestor de contraseñas los accesos de GitHub, Vercel, Stripe y Supabase.

## Si algo falla

Pega el error en el chat de Claude, dentro del proyecto. Si es un tema de cuentas, escribe en #yajos.
