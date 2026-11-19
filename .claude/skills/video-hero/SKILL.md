---
name: video-hero
description: Cambiar o reprocesar el video del inicio de YAJOS (la camisa que se arma con el scroll) como secuencia de cuadros del scroll scrub. Úsala cuando Jair traiga un video nuevo o el hero se vea mal.
---

# Video del hero (scroll scrub)

`web/src/components/ScrollScrub.tsx` dibuja en un `<canvas>` los cuadros WebP de `web/public/scrub/`
(`manifest.json` los enumera), y el progreso del scroll elige cuál se muestra. Entre el 86 % y el 97 % del
recorrido, la camisa sube y entra el logotipo `/armado/yajos-logo.png`.

## Video nuevo

1. Jair pone el video en `IMAGESANDVIDEOS/higgsfield/referencias/`. Lo ideal: cámara fija, fondo blanco,
   formato vertical y de 10 a 15 s.
2. Revisa el video antes de convertirlo. Saca un cuadro por segundo:
   `ffmpeg -i video.mp4 -vf fps=1 /tmp/revisa-%02d.jpg`. Míralos y busca mangas o botones de más, piezas
   deformes o cortes bruscos. **El dueño rechaza lo que se ve artificial**: avísale antes de seguir.
3. Desde `web/`, convierte el video. Con estos valores, el video actual quedó en unos 181 cuadros y 5.4 MB.
   ```bash
   FPS=12 ANCHO=768 CALIDAD=70 npm run frames -- "../IMAGESANDVIDEOS/higgsfield/referencias/NOMBRE.mp4"
   ```
   El script borra y vuelve a generar `public/scrub/`. También limpia la textura gris del fondo; con
   `LIMPIAR=0` se desactiva.
4. Corre el sitio en local y recorre el hero completo: primer cuadro, el armado y el final con el logotipo.
   Revísalo también con ancho de celular.
5. Si el total pesa más de unos 8 MB, baja `FPS` o `CALIDAD` y vuelve a convertir.
6. Publica con `/desplegar`.

Necesita `ffmpeg` (en Mac: `brew install ffmpeg`).
