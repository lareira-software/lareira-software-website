import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {color, fuente, tam} from './tokens';
import {ZONA} from './zonaSegura';

/** «lareira.» en minúscula con el punto naranja, abajo a la izquierda dentro de la zona segura. */
export const Logo: React.FC<{fundido?: number; colorTexto?: string}> = ({fundido = 12, colorTexto = color.espuma}) => {
  const frame = useCurrentFrame();
  const o = fundido > 0 ? interpolate(frame, [0, fundido], [0, 1], {extrapolateRight: 'clamp'}) : 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: ZONA.lados + 12,
        bottom: ZONA.abajo,
        fontFamily: fuente.familia,
        ...fuente.titular,
        fontSize: tam.logo,
        color: colorTexto,
        opacity: o,
        textShadow: colorTexto === color.espuma ? '0 1px 12px rgba(0,0,0,.25)' : undefined,
      }}
    >
      lareira<span style={{color: color.lume}}>.</span>
    </div>
  );
};
