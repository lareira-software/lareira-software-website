# Plantilla de carruseles de Instagram

Slides de 1080 × 1350 px con el sistema «Tablilla» (`DESIGN.md`). No se publican en la web: `content/` no se copia al publicar.

## Piezas

- `carrusel.css`: estilos comunes (colores, letra Archivo, barra de progreso, logo, pegatina y los tres tipos de slide).
- `portada.html`: portada sobre azul `--mar`, titular enorme, frase de apoyo y una pegatina naranja.
- `fila.html`: una fila de tablilla (frase a la izquierda, nombre técnico debajo, número grande a la derecha y raya). Fondo blanco o `slide--neboa`.
- `cierre.html`: cierre sobre `--profundo` con la llamada a la acción y una pegatina.
- `exportar.mjs`: saca las PNG y la tira de miniaturas, y avisa de textos cortados, viudas o textos en la zona libre.

## Hacer un carrusel nuevo

1. Crea `content/carruseles/<nombre>/` y copia dentro `carrusel.css`.
2. Copia las slides que necesites como `slide-01.html`, `slide-02.html`… (siempre con dos cifras).
3. En cada slide cambia los textos y la barra: `style="--avance:30%"` es la slide 3 de 10.
4. Para pegar dos palabras y evitar que la última quede sola en su línea, usa `&nbsp;` entre ellas.
5. Exporta desde la raíz del repo:

   ```bash
   node content/carruseles/_plantilla/exportar.mjs content/carruseles/<nombre>
   ```

   Necesita Playwright (instalado en `video/node_modules`, o indica la carpeta con `PLAYWRIGHT_DIR=…`) y usa el Chrome del Mac. Deja `png/01.png`… y `png/preview.png`.

## Reglas que no se tocan

- Naranja `--lume` solo en la pegatina redonda (con texto `--tinta`) y en el punto del logo. Una pegatina por slide como mucho, y ninguna en las filas.
- Sin tarjetas, sombras, degradados, iconos, emojis ni textos pequeños en mayúsculas encima de un titular.
- Logo siempre abajo a la izquierda; márgenes de 88 px y 120 px libres arriba y abajo.
