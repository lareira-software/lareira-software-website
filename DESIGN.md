# Lareira — Sistema de diseño v1.0 «Tablilla»

Sistema base de Lareira y de todas las webs de clientes. Las webs de clientes **heredan** estructura, espaciado, movimiento, componentes y reglas; **cambian** color, tipografía y fotos (ver «Cómo se hereda»).

## 1. La idea

**v0.1 «Atlántico y lume»**: correcta pero previsible (portada azul, móvil a la derecha, tres columnas de precios). Se parecía a cualquier estudio.

**v1.0 «Tablilla»**: los precios a la vista, como en la tablilla de la lonxa, la pescadería o la pizarra del bar. Nada que preguntar, nada escondido. En Galicia todo el mundo sabe leer una tablilla: producto a la izquierda, precio grande a la derecha, una raya debajo. Esa gramática (filas con raya, números grandes y estrechos, una pegatina naranja de precio) sustituye a las tarjetas.

### Las dos direcciones que se plantearon

| | A · Tablilla (elegida) | B · Casco pintado |
|---|---|---|
| Mundo | La tablilla de precios de la lonxa, la pescadería y el bar | Los nombres y matrículas pintados a mano en los cascos de los barcos de Fisterra, Muxía y Camariñas |
| Material | Azaulejo blanco, azul de caixa de lonxa, pegatina naranja, números estrechos | Casco blanco y azul, franja de flotación, letra pintada, boya naranja |
| Primera pantalla | Titular + tira de tres datos en grande (desde 450 €, 7 días, ES/EN) + móvil que se renombra con el negocio del visitante | Titular pintado como nombre de barco, matrícula «CO-» como detalle, móvil en un muelle |
| Por qué funciona | El precio cerrado es lo que más confianza da (ver REFERENTES.md); vale igual para un bar, una peluquería o un taller | Muy reconocible en la costa, mucho carácter |
| Riesgo | Si se exagera, «huele a pescado»: el mundo queda implícito, nunca se dibujan peces ni cajas | Tópico marinero (anclas, cuerdas), poco claro para negocios de interior (Vimianzo), no ayuda a leer precios |

**Por qué A:** gana en los dos ejes que importan: el dueño se reconoce (la tablilla es de todos los oficios, no solo del puerto) y el producto se entiende (el precio es el protagonista). B era más pintoresca, pero vende el paisaje, no la web. De B se queda una disciplina: **números grandes y estrechos que se leen de lejos**, como una matrícula.

## 2. Tokens

```css
:root{
  /* color */
  --mar:#1748E0;        /* azul de caixa: campos de marca (portada, cabecera de tablilla, cierre) */
  --profundo:#0E2C93;   /* azul atlántico: tablilla destacada y barra móvil (antes --mar-fondo #0F34B0) */
  --lume:#FF5A1F;       /* chispa: punto del logo, pegatina de precio. Nunca texto sobre blanco */
  --tinta:#0D1330;      /* texto principal */
  --tinta-2:#4A5170;    /* texto secundario sobre blanco (7,8:1) y neboa (6,9:1) */
  --papel:#FFFFFF;      /* fondo */
  --neboa:#EEF2FB;      /* fondo alterno (frío, nunca crema) */
  --linea:#D5DBEA;      /* rayas de tablilla sobre blanco */
  --sobre-mar:#D3DDFF;  /* texto secundario sobre --mar (5,1:1) y --profundo (8,6:1) */
  --linea-mar:#5B7BEA;  /* rayas sobre azul */
  /* tipografía */
  --f:"Archivo",system-ui,sans-serif;
  --estrecho:72%;       /* font-stretch de titulares y números */
  --t-xxl:clamp(3rem,1.6rem + 6vw,6rem);   /* números de la tablilla */
  --t-xl:clamp(2.4rem,1.5rem + 3.6vw,4.5rem); /* h1 */
  --t-l:clamp(1.9rem,1.3rem + 2.2vw,3.2rem);  /* h2 */
  --t-m:1.375rem; --t-base:1.0625rem; --t-s:.9375rem;
  /* espacio (base 8) */
  --e-1:.5rem; --e-2:1rem; --e-3:1.5rem; --e-4:2rem; --e-5:3rem; --e-6:4.5rem; --e-7:7rem;
  --ancho:75rem; --margen:1rem;  /* 2rem desde 600px, 2,5rem desde 1200px */
  /* forma */
  --r-control:6px; --r-movil:30px;  /* tablillas: esquinas rectas */
  /* movimiento */
  --ease-out:cubic-bezier(.23,1,.32,1);
  --ease-in-out:cubic-bezier(.77,0,.175,1);
}
```

**Cambios frente a v0.1 y por qué**

- `--mar` se mantiene: es la marca y ya se reconoce. Lo que cambia es **dónde** manda: campos enteros (portada, cabecera de la tablilla, cierre), no botones sueltos sobre blanco.
- `--mar-fondo` → `--profundo #0E2C93`: más oscuro para que la fila recomendada se lea como «la de la pizarra» y la barra móvil contraste con la portada.
- `--lume` pasa de «chispa» genérica a **pegatina de precio** redonda: un objeto concreto. Nunca para texto (3,1:1 sobre blanco). El punto del logo sobre azul (2,2:1) queda cubierto por la excepción de logotipos de WCAG 1.4.3.
- Nuevo `--linea-mar` para rayas sobre azul (la tablilla vive también sobre la portada).
- Texto secundario siempre con color propio (`--tinta-2`, `--sobre-mar`), nunca `opacity`.

## 3. Tipografía

- **Archivo** (Omnibus-Type, OFL), variable de peso 100–900 y anchura 62–125 %, un solo woff2 de 90 KB en `fonts/`.
- **Por qué cambia** (antes Hanken Grotesk): Hanken es correcta pero neutra. Archivo tiene eje de anchura: la misma familia hace de **letra de tablilla** (estrecha, gruesa, números que se leen de lejos) y de **letra de lectura** (anchura normal). Una familia, dos voces, un archivo.
- Titulares: 750, `font-stretch:72%`, `letter-spacing:-0.02em` (la letra estrecha pide menos tracking que la v0.1), `line-height:1.0`, `text-wrap:balance`.
- Números de precio: 800, estrecho 66 %, `font-variant-numeric:tabular-nums`.
- Texto: 400, anchura 100 %, `--t-base`, interlineado 1.6, medida máx. 62ch.
- Etiquetas de tablilla (Plazo, Incluye…): 600, anchura 100 %, `--t-s`, sentence case. **Nunca mayúsculas tracking encima de un titular.**

## 4. Componentes

- **Tablilla** (componente principal): lista de filas con raya inferior `1px var(--linea)`. Cada fila: nombre a la izquierda, número grande a la derecha, detalle debajo. Sustituye a las tarjetas: los precios, los añadidos, el proceso y los pueblos son tablillas. Sin cajas, sin sombras.
- **Fila destacada**: la fila recomendada va sobre `--profundo` a todo el ancho, con texto blanco y `--sobre-mar`.
- **Pegatina**: círculo `--lume` con texto `--tinta` 700 (6:1). Una por pantalla como mucho. Para «Recomendado» o «Precio de lanzamiento».
- **Tira de datos**: tres celdas separadas por rayas verticales, número estrecho grande + palabra. Va en la portada.
- **Botón principal**: fondo `--papel` sobre azul o `--mar` sobre blanco, texto 650, radio 6px, icono de WhatsApp SVG a la izquierda, alto mínimo 52px. Al pulsar `scale(.97)` en 160ms.
- **Botón secundario**: solo texto subrayado (offset .2em, grosor 1.5px).
- **Móvil de ejemplo**: marco de 30px de radio, pantalla con una web de ejemplo marcada «Web de ejemplo». Recibe el nombre del visitante desde un campo y lo pinta en directo.
- **Preguntas**: `<details>` con raya, chevron SVG que gira 180° (200ms ease-out), contenido que se abre con altura animada (interpolate-size donde exista).
- **Barra móvil**: fija abajo, `--profundo`, botón WhatsApp a todo el ancho, aparece al salir la portada (transform 260ms ease-out), respeta `env(safe-area-inset-bottom)`.
- **Hueco de foto**: `<figure class="hueco">` con proporción fija y un fondo `--mar` con el hórreo en `--linea-mar`; se sustituye por `<img>` sin tocar el CSS.

## 5. Movimiento (reglas de Emil)

- Una entrada al cargar en la portada: titular, tira de datos y móvil suben 12px y aparecen, 600ms `--ease-out`, escalonados 80ms. Nada más se anima al hacer scroll.
- Respuesta al pulsar: botones `scale(.97)`; enlaces y filas, solo color.
- Hover solo dentro de `@media (hover:hover) and (pointer:fine)`.
- El nombre en el móvil cambia con un fundido corto (150ms) para que se note que responde.
- `prefers-reduced-motion: reduce` → sin traslaciones ni escalas; se mantienen los fundidos cortos (la entrada, la barra móvil) para que el cambio de estado se siga notando.
- Nunca: aparecer al hacer scroll, parallax, carruseles, inclinaciones.

## 6. Reglas siempre

- Contraste AA (≥4,5:1 texto, ≥3:1 grande). Comprobado en el navegador sobre todos los textos de la página: tinta/papel 18,2; tinta-2/papel 7,8; tinta-2/neboa 6,9; papel/mar 6,9; sobre-mar/mar 5,1; papel/profundo 11,7; tinta/lume 5,8.
- Sin eyebrows, brillos, sombras de color, degradados en texto, tarjetas dentro de tarjetas, filas de tarjetas iguales, emojis, fondo crema.
- Fuentes en `fonts/` (woff2), nunca Google Fonts. Nunca Inter, Roboto, Geist, Space Grotesk, Plus Jakarta.
- Interlineado ≥1,5, medida ≤65ch, precios `tabular-nums`.
- Móvil primero, sin scroll horizontal, `-webkit-tap-highlight-color:transparent`, `::selection` en `--mar`/blanco, foco visible `2px solid` + offset 3px, subrayados con `text-underline-offset`.
- No se inventan testimonios, clientes, cifras ni premios.

## 7. Cómo se hereda en webs de clientes

| Se hereda siempre | Cambia por cliente |
|---|---|
| Rejilla, márgenes, escala de espacio | Paleta: `--mar`, `--profundo`, `--lume` (comprobar contraste) |
| Tablilla, tira de datos, preguntas, barra móvil, botón | Tipografía (una familia variable woff2 propia) |
| Movimiento y sus duraciones | Fotos reales del negocio |
| Reglas «siempre» y de contraste | Textos, idioma, horario |

La tablilla sirve igual para la carta de un bar, las tarifas de una peluquería o las habitaciones de un albergue.

## 8. Logo

«lareira.» en minúscula, Archivo 750 estrecha, punto final en `--lume`. Sobre azul, el texto va en blanco y el punto sigue naranja. El hórreo minimalista (SVG de trazo) se usa como favicon y en los huecos de foto, nunca al lado del logo en la cabecera.

## 9. Notas de implementación

- Los rellenos de las secciones se escriben con valores literales (`padding: 7rem 1rem`) y media queries, no con `var()` ni `padding-inline`: el detector estático de Impeccable no los resuelve y daría falsos avisos.
- La muestra del móvil es un ejemplo inventado y lo dice dentro de la pantalla («Web de ejemplo»). El campo de nombre cambia la web en directo y añade el nombre al mensaje de WhatsApp («… Mi negocio es X»); con el campo vacío, el enlace es exactamente el de la marca.
- Web de ejemplo (fuera del sistema, cambia por cliente): fondo `#FBF7F0`, texto `#2A1D12`, foto `img/o-forno.jpg` arriba y el nombre debajo en texto (nunca encima de la foto), etiqueta «Web de ejemplo» junto al nombre.
- Fotos actuales generadas con IA en Canva: `img/o-forno.jpg` (negocio inventado) y `img/escritorio-web.jpg` (hueco de «Quién hace tu web»). Sustituirlas por fotos reales cuando las haya, mismas proporciones (4:3 y 4:5).
- Para añadir una zona: copiar un `<li>` de `.pueblos`, cambiar id, nombre y texto, y añadirla a `areaServed` en el JSON-LD.
