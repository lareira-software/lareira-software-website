# lareirasoftware.com

Web de Lareira Software & Design. Estática: un solo `index.html` con el CSS y el JS dentro, imágenes en `img/` y la tipografía en `fonts/`.

## Publicar

Cada push a `main` publica la web en https://lareirasoftware.com con GitHub Actions (`.github/workflows/pages.yml`).
Para cambios, crea una rama, abre un pull request contra `main` y haz merge: al entrar en `main` se publica solo.

En cada push y pull request se pasa además la revisión de diseño de Impeccable (`npx impeccable detect index.html`). No bloquea la publicación, pero si sale en rojo, revísalo.

## Documentos

- `PRODUCT.md`: qué es Lareira, oferta y reglas de marca.
- `DESIGN.md`: sistema de diseño v1.0 «Tablilla».
- `REFERENTES.md`: análisis de webs de referencia.

Estos tres no se publican en la web; solo `index.html`, `img/`, `fonts/` y `CNAME`.
