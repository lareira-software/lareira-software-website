# Instrucciones para Claude

Web de Lareira Software & Design (lareirasoftware.com). Lee `README.md` para saber cómo está montada y `PRODUCT.md` y `DESIGN.md` antes de tocar textos o diseño.

## Cómo se trabaja

- **Nunca hagas push a `main`.** Todo lo que entra en `main` se publica solo en la web.
- Antes de cambiar nada, ponte al día con `main` (`git checkout main && git pull`) y crea una rama con un nombre corto y descriptivo: `cambio/textos-portada`, `arreglo/menu-movil`...
- Haz commits pequeños con mensajes en español que digan qué cambia.
- Cuando el cambio esté listo, sube la rama y abre un pull request contra `main` con `gh pr create`. En la descripción explica qué cambia y por qué, en lenguaje sencillo.
- No hagas merge del PR: lo revisa y lo mergea Cris. Al entrar en `main` se publica.
- En el PR se pasa la revisión de diseño de Impeccable. Si sale en rojo, revísalo antes de pedir la revisión.

## GitHub CLI

`gh` está instalado en `~/.local/bin/gh`. Si `gh` no se encuentra, usa esa ruta completa.
