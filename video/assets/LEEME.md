# Assets de los reels

Pon aquí los archivos con estos nombres exactos. Todos son opcionales: si falta alguno, el vídeo usa un sustituto.

- `manos.mp4`: nuestras manos tecleando en el portátil (escena 4). Sin él sale un rectángulo gris «MANOS.MP4 AQUÍ».
- `enchufe.mp4` y `cerrar.mp4`: enchufar el portátil y cerrar la tapa, antes y después de las manos (opcionales). Los cortes de cada toma están en `src/reel-01/guion.ts` (`TOMAS_MANOS`).
- Los vídeos del iPhone se pasan antes a H.264 vertical 1080x1920, por ejemplo:
  `npx remotion ffmpeg -i IMG_0000.mov -an -vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" -r 30 -c:v libx264 -crf 19 -pix_fmt yuv420p -f mp4 "$PWD/assets/manos.mp4"` (la ruta de salida tiene que ser completa)
- `voz.mp3`: voz en off grabada con `out/guion-voz.txt`. Con ella aparecen los subtítulos.
- `musica.mp3`: música de fondo (al 20 %, baja al 8 % mientras habla la voz).
- `iceberg.mp4`: plano del iceberg de OpenArt para el fondo de la escena 3. Sin él se dibuja en SVG.

`lareira.jpg`: foto de la lareira para el fondo del gancho, el último frame y el móvil (tenemos permiso para usarla). Sin ella sale el horno dibujado.

`o-forno.jpg` no lo pongas tú: es la foto del horno dibujado, se genera con `npm run foto` y sí se sube a GitHub.

Los vídeos y audios no se suben a GitHub (están en `.gitignore`).
