// Exporta las slides de un carrusel a PNG de 1080 × 1350 (escala 1x) y hace una tira de miniaturas.
//
// Uso, desde la raíz del repo:
//   node content/carruseles/_plantilla/exportar.mjs content/carruseles/13-capas
//
// Usa el Playwright instalado en video/node_modules (o el de la carpeta que indique PLAYWRIGHT_DIR)
// y el Chrome del Mac (channel: 'chrome'): el Chromium que descarga Playwright se rompe
// porque el Escritorio se sincroniza con iCloud.
//
// Además de exportar, comprueba cada slide y avisa si:
//   · la fuente Archivo no ha cargado,
//   · algún texto se sale de la slide o invade la zona libre de 120 px arriba y abajo,
//   · algún párrafo acaba con una palabra sola en la última línea (viuda).

import {createRequire} from 'node:module';
import {readdirSync, mkdirSync, writeFileSync, existsSync} from 'node:fs';
import {resolve, join, dirname} from 'node:path';
import {pathToFileURL, fileURLToPath} from 'node:url';

const aqui = dirname(fileURLToPath(import.meta.url));
const raiz = resolve(aqui, '../../..');
const carpeta = resolve(process.argv[2] ?? '.');
const salida = join(carpeta, 'png');
mkdirSync(salida, {recursive: true});

const require = createRequire(import.meta.url);
const buscar = [process.env.PLAYWRIGHT_DIR, join(raiz, 'video'), raiz].filter(Boolean);
let chromium;
try {
  ({chromium} = require(require.resolve('playwright', {paths: buscar})));
} catch {
  console.error('No encuentro Playwright. Instálalo en video/ (npm install) o indica PLAYWRIGHT_DIR=/ruta/a/carpeta-con-node_modules.');
  process.exit(1);
}

const slides = readdirSync(carpeta).filter(f => /^slide-\d+\.html$/.test(f)).sort();
if (!slides.length) { console.error(`No hay slide-NN.html en ${carpeta}`); process.exit(1); }

const navegador = await chromium.launch({channel: 'chrome'});
const pagina = await navegador.newPage({viewport: {width: 1080, height: 1350}, deviceScaleFactor: 1});
let avisos = 0;
const png = [];

for (const slide of slides) {
  const n = slide.match(/\d+/)[0];
  await pagina.goto(pathToFileURL(join(carpeta, slide)).href);
  await pagina.evaluate(() => document.fonts.ready);

  const informe = await pagina.evaluate(() => {
    const problemas = [];
    if (!document.fonts.check('750 80px Archivo')) problemas.push('la fuente Archivo no ha cargado');
    const textos = [...document.querySelectorAll('.titular, .bajada, .etiqueta, .numero, .pegatina, .logo')];
    for (const el of textos) {
      const r = el.getBoundingClientRect();
      const nombre = el.className;
      if (r.left < 0 || r.right > 1080 || r.top < 0 || r.bottom > 1350) problemas.push(`${nombre} se sale de la slide`);
      if (!el.matches('.logo') && (r.top < 120 || r.bottom > 1230)) problemas.push(`${nombre} invade la zona libre (${Math.round(r.top)}–${Math.round(r.bottom)} px)`);
      if (el.scrollWidth > el.clientWidth + 1) problemas.push(`${nombre} tiene texto cortado`);
      // Viuda: la última línea tiene una sola palabra
      if (el.matches('.titular, .bajada, .etiqueta')) {
        const rango = document.createRange();
        const nodos = [];
        const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
        while (w.nextNode()) nodos.push(w.currentNode);
        const palabras = [];
        for (const nodo of nodos) {
          const re = /\S+/g; let m;
          while ((m = re.exec(nodo.data))) {
            rango.setStart(nodo, m.index); rango.setEnd(nodo, m.index + m[0].length);
            palabras.push({t: m[0], y: Math.round(rango.getClientRects()[0]?.top ?? 0)});
          }
        }
        const lineas = [...new Set(palabras.map(p => p.y))];
        if (lineas.length > 1) {
          const ultima = palabras.filter(p => p.y === lineas.at(-1));
          const enlazadas = ultima.length === 1 && ultima[0].t.includes(' ');
          if (ultima.length === 1 && !enlazadas) problemas.push(`${nombre}: viuda «${ultima[0].t}»`);
        }
      }
    }
    const caja = s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(Math.round); };
    return {problemas, numero: caja('.numero'), logo: caja('.logo')};
  });

  const destino = join(salida, `${n}.png`);
  await pagina.screenshot({path: destino, clip: {x: 0, y: 0, width: 1080, height: 1350}});
  png.push(destino);
  const extra = [informe.numero && `número ${informe.numero}`, `logo ${informe.logo}`].filter(Boolean).join(' · ');
  console.log(`${n}.png  ${extra}`);
  for (const p of informe.problemas) { console.log(`   ⚠ ${p}`); avisos++; }
}

// Tira de miniaturas en una sola imagen
const ancho = 216, alto = 270, hueco = 16;
const html = `<!doctype html><meta charset="utf-8"><style>
  html,body{margin:0;background:#EEF2FB}
  .tira{display:flex;gap:${hueco}px;padding:${hueco}px}
  img{width:${ancho}px;height:${alto}px;display:block;outline:1px solid #D5DBEA}
</style><div class="tira">${png.map(p => `<img src="${pathToFileURL(p).href}">`).join('')}</div>`;
const tmp = join(salida, '.preview.html');
writeFileSync(tmp, html);
const anchoTira = png.length * ancho + (png.length + 1) * hueco;
await pagina.setViewportSize({width: anchoTira, height: alto + 2 * hueco});
await pagina.goto(pathToFileURL(tmp).href);
await pagina.waitForFunction(() => [...document.images].every(i => i.complete));
await pagina.screenshot({path: join(salida, 'preview.png'), fullPage: true});
(await import('node:fs')).rmSync(tmp);

await navegador.close();
console.log(avisos ? `\n${avisos} aviso(s): revísalos antes de publicar.` : '\nSin avisos.');
