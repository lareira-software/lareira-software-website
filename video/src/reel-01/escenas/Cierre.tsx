import React from 'react';
import {AbsoluteFill, Easing, Freeze, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {TextoPalabras} from '../../comun/TextoPalabras';
import {color, e, tam} from '../../comun/tokens';
import {BLOQUE_TEXTO, ESCENAS, TARJETA, TEXTOS} from '../guion';
import {FotoTarjeta} from '../FotoTarjeta';
import {Gancho, luzLumbre} from './Gancho';

const BUCLE = 10; // últimos frames: se funde con el frame 0 del gancho

// 5 · CIERRE EN BUCLE: mismo fondo, mismo bloque de texto y misma foto que el gancho.
export const Cierre: React.FC = () => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const total = (ESCENAS.cierre.hasta - ESCENAS.cierre.desde) * fps;
  // La foto sube desvelándose desde abajo y se aleja hasta quedar como en el frame 0
  const desvela = interpolate(frame, [14, 34], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const zoom = interpolate(frame, [14, total], [1.1, 1], {extrapolateLeft: 'clamp', easing: Easing.out(Easing.quad)});
  const bucle = interpolate(frame, [total - BUCLE, total - 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{backgroundColor: color.granito}}>
      <div style={{position: 'absolute', left: BLOQUE_TEXTO.x, top: BLOQUE_TEXTO.y, width: BLOQUE_TEXTO.ancho}}>
        <TextoPalabras texto={TEXTOS.cierre} desde={2} tamano={tam.gancho} colorTexto={color.tinta} />
        <TextoPalabras texto={TEXTOS.cierrePie} desde={Math.round(0.75 * fps)} tamano={tam.titular - 8} colorTexto={color.tinta} estilo={{marginTop: e[4]}} />
      </div>
      <FotoTarjeta rect={TARJETA} zoom={zoom} recorte={desvela} luz={luzLumbre(frame / fps)} />
      {bucle > 0 ? (
        <AbsoluteFill style={{opacity: bucle}}>
          <Freeze frame={0}>
            <Gancho />
          </Freeze>
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
