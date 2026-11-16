import {continueRender, delayRender} from 'remotion';
import archivo from '../../../fonts/archivo-var.woff2';

// Archivo variable (la misma de la web): peso 100–900 y anchura 62–125 %.
let cargada = false;
export const cargarFuentes = () => {
  if (cargada || typeof document === 'undefined') return;
  cargada = true;
  const handle = delayRender('Cargando Archivo');
  const ff = new FontFace('Archivo', `url(${archivo}) format("woff2")`, {weight: '100 900', stretch: '62% 125%', style: 'normal'});
  ff.load()
    .then((f) => {
      (document.fonts as unknown as Set<FontFace>).add(f);
      continueRender(handle);
    })
    .catch((err) => {
      console.error('No se pudo cargar Archivo', err);
      continueRender(handle);
    });
};
