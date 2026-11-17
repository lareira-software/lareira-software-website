import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {noise2D} from '@remotion/noise';
import {TextoPalabras} from '../../comun/TextoPalabras';
import {color, tam} from '../../comun/tokens';
import {BLOQUE_TEXTO, TARJETA, TEXTOS} from '../guion';
import {FotoTarjeta} from '../FotoTarjeta';

/** Zoom lento hacia el fuego durante el gancho (1 → 1,12). La escena 2 lo continúa. */
export const zoomGancho = (frame: number) => interpolate(frame, [0, 90], [1, 1.12], {easing: Easing.inOut(Easing.sin), extrapolateRight: 'clamp'});
/** Luz de lumbre: la foto respira un poco, sin ritmo fijo. */
export const luzLumbre = (t: number) => 1 + Math.sin((t / 1.5) * Math.PI * 2) * 0.03 + noise2D('lumbre', t * 2.2, 0) * 0.04;

// 1 · GANCHO. Fondo de granito claro, el texto arriba y la foto de la lareira nítida debajo.
// El frame 0 ya está completo (para el bucle y para la vista previa del feed).
export const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const segundo = Math.round(TEXTOS.ganchoSegundoGolpe * fps);
  return (
    <AbsoluteFill style={{backgroundColor: color.granito}}>
      <div style={{position: 'absolute', left: BLOQUE_TEXTO.x, top: BLOQUE_TEXTO.y, width: BLOQUE_TEXTO.ancho}}>
        {frame < segundo + 4 ? (
          <TextoPalabras texto={TEXTOS.gancho[0]} inmediato sale={segundo - 6} tamano={tam.gancho} colorTexto={color.tinta} />
        ) : null}
        {frame >= segundo ? (
          <div style={{position: 'absolute', inset: 0}}>
            <TextoPalabras texto={TEXTOS.gancho[1]} desde={segundo} cadencia={3} sale={80} tamano={tam.gancho} colorTexto={color.tinta} />
          </div>
        ) : null}
      </div>
      <FotoTarjeta rect={TARJETA} zoom={zoomGancho(frame)} luz={luzLumbre(frame / fps)} />
    </AbsoluteFill>
  );
};
