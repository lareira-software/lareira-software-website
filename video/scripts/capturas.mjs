// Capturas del MP4 final con Playwright (usa el Chrome del Mac, que reproduce H.264).
// Uso: node scripts/capturas.mjs out/reel-01-iceberg.mp4 1 5 12 20 25
// Saca dos imágenes por segundo: la captura limpia y otra con la zona segura de Instagram marcada.
import {chromium} from 'playwright';
import {mkdirSync, writeFileSync} from 'node:fs';
import {resolve, basename} from 'node:path';
import {pathToFileURL} from 'node:url';

const [video, ...segundos] = process.argv.slice(2);
if (!video || !segundos.length) {
  console.error('Uso: node scripts/capturas.mjs <video.mp4> <segundo> [segundo...]');
  process.exit(1);
}
const dir = resolve('out/capturas');
mkdirSync(dir, {recursive: true});
const html = resolve(dir, 'visor.html');
writeFileSync(
  html,
  `<!doctype html><meta charset="utf-8"><style>html,body{margin:0;background:#000}#c{position:relative;width:1080px;height:1920px}video{display:block;width:1080px;height:1920px}
  #z{position:absolute;inset:0;display:none;box-sizing:border-box;border:solid rgba(255,0,80,.35);border-width:250px 60px 380px 60px}</style>
  <div id="c"><video id="v" muted preload="auto" src="${pathToFileURL(resolve(video)).href}"></video><div id="z"></div></div>`,
);

const browser = await chromium.launch({channel: 'chrome'});
const page = await browser.newPage({viewport: {width: 1080, height: 1920}, deviceScaleFactor: 1});
await page.goto(pathToFileURL(html).href);
await page.waitForFunction(() => document.getElementById('v').readyState >= 2);
const nombre = basename(video, '.mp4');
for (const s of segundos) {
  await page.evaluate(
    (t) =>
      new Promise((ok) => {
        const v = document.getElementById('v');
        v.addEventListener('seeked', () => requestAnimationFrame(() => requestAnimationFrame(ok)), {once: true});
        v.currentTime = t;
      }),
    Number(s),
  );
  const marco = page.locator('#c');
  await page.evaluate(() => (document.getElementById('z').style.display = 'none'));
  await marco.screenshot({path: resolve(dir, `${nombre}-s${s}.png`)});
  await page.evaluate(() => (document.getElementById('z').style.display = 'block'));
  await marco.screenshot({path: resolve(dir, `${nombre}-s${s}-zona.png`)});
  console.log(`Captura del segundo ${s}`);
}
await browser.close();
