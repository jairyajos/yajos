# YAJOS · web

Sitio nuevo de yajos.com.mx. Ver `../README.md` y `../docs/` para el método y las decisiones.

```
src/lib/catalogo.ts        Catálogo (modelos, tallas, hilos, tipografías, posiciones, zonas, precio)
src/lib/pedido.ts          Validación y mensaje del pedido (la orden de trabajo del bordador)
src/components/ScrollScrub Hero con scroll scrub sobre <canvas>
src/components/Configurador
src/app/llms.txt           llms.txt generado del catálogo
src/app/robots.ts          Cerrado salvo SITE_ENV=production
scripts/frames.mjs         Video de ../IMAGESANDVIDEOS → public/scrub/ (requiere ffmpeg)
```

Variables: `SITE_ENV=production` abre la indexación; `SITE_URL` fija la URL canónica.
