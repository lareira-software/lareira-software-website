import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {color, fuente, tam} from './tokens';
import {ZONA} from './zonaSegura';

/** «lareira.» en minúscula con el punto naranja, abajo a la izquierda dentro de la zona segura. */
export const Logo: React.FC<{fundido?: number}> = ({fundido = 12}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, fundido], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: ZONA.lados + 12,
        bottom: ZONA.abajo,
        fontFamily: fuente.familia,
        ...fuente.titular,
        fontSize: tam.logo,
        color: color.espuma,
        opacity: o,
        textShadow: '0 1px 12px rgba(0,0,0,.25)',
      }}
    >
      lareira<span style={{color: color.lume}}>.</span>
    </div>
  );
};
