---
name: desplegar
description: Publicar YAJOS en Vercel y administrar sus variables de entorno o su dominio. Úsala cuando Jair pida publicar, subir cambios, ver por qué falló un despliegue, agregar una variable o conectar yajos.com.mx.
---

# Desplegar YAJOS

El proyecto de Vercel `yajos` está conectado al repositorio de GitHub con **Root Directory = `web`**.
**Cada push a `main` se publica solo.** El CLI solo hace falta para las variables o para diagnosticar.

## Publicar cambios

1. Revisa antes: `cd web && npm run lint && npm run build`. Si algo falla, arréglalo antes de seguir.
2. Muéstrale a Jair en español qué cambió (`git status`, `git diff --stat`) y pídele su ok.
3. Haz `git add` solo de los archivos del cambio y comprueba que no se cuele ningún `.env*`. Luego
   `git commit -m "..."` y `git push`.
4. Vercel publica en 1–2 minutos. Revisa que terminó en el panel (Deployments) o con `vercel ls`, desde
   `web/` y después de `vercel link`.

## Variables de entorno

La lista está en `web/.env.example` y en `CLAUDE.md`.
- **Las llaves secretas las pega Jair** en Vercel → Settings → Environment Variables. No las escribas tú ni le
  pidas que las pegue en el chat.
- Las que no son secretas (`NEXT_PUBLIC_PAGOS`, `STRIPE_MSI`, `SITE_ENV`) las puedes poner tú, con su ok:
  `cd web && vercel env add NOMBRE production`.
- Después de cambiar variables hay que redesplegar: `vercel deploy --prod --yes`, o Redeploy en el panel.
- Para usar en local las mismas variables: `cd web && vercel env pull .env.local`.

## Lanzamiento en yajos.com.mx (solo cuando Jair lo decida)

Requisitos: plan Pro de Vercel y, si va a haber cobro, la lista "Antes de cobrar de verdad" de `CLAUDE.md`
completa.

1. En Vercel → Settings → Domains, agrega `yajos.com.mx` y `www.yajos.com.mx`. Vercel muestra los registros
   DNS que pide.
2. Jair cambia esos registros en el proveedor actual del dominio (el cPanel del sitio viejo). Explícale cada
   uno. **Desde ese momento el sitio viejo deja de verse.**
3. Agrega `SITE_ENV=production` y `SITE_URL=https://yajos.com.mx` y redesplega. Esto abre la indexación en
   Google.
4. Revisa `https://yajos.com.mx/robots.txt` y `https://yajos.com.mx/llms.txt`.
