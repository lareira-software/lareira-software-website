// Genera out/guion-voz.txt y out/reel-01-iceberg.srt a partir de src/reel-01/guion.ts
import {writeFileSync, mkdirSync} from 'node:fs';
import {VOZ, subtitulos, DURACION} from '../src/reel-01/guion.ts';

const reloj = (s: number) => {
  const ms = Math.round(s * 1000);
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const sec = Math.floor((ms % 60000) / 1000);
  const r = ms % 1000;
  const p = (n: number, l = 2) => String(n).padStart(l, '0');
  return `${p(h)}:${p(m)}:${p(sec)},${p(r, 3)}`;
};
const corto = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toFixed(1).padStart(4, '0')}`;

mkdirSync('out', {recursive: true});

const guion = [
  'REEL 01 · «EL ICEBERG» · GUION DE LA VOZ EN OFF',
  `Duración total: ${DURACION} s. Graba un solo archivo de ${DURACION} s y guárdalo como video/assets/voz.mp3.`,
  'Empieza cada frase en su segundo (deja silencio antes). Si no te cuadra, cambia los tiempos en src/reel-01/guion.ts.',
  '',
  ...VOZ.map((v) => `[${corto(v.desde)} – ${corto(v.hasta)}]  (${(v.hasta - v.desde).toFixed(1)} s)\n${v.texto}\n`),
  'Tono: cercano y tranquilo, frases cortas, sin prisa. «LAREIRA» con fuerza al final.',
  '',
].join('\n');
writeFileSync('out/guion-voz.txt', guion);

const srt = subtitulos()
  .map((c, i) => `${i + 1}\n${reloj(c.desde)} --> ${reloj(c.hasta)}\n${c.texto}\n`)
  .join('\n');
writeFileSync('out/reel-01-iceberg.srt', srt);
console.log('Creados out/guion-voz.txt y out/reel-01-iceberg.srt');
