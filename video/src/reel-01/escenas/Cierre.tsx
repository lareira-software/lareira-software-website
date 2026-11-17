import React from 'react';
import {AbsoluteFill, Freeze, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FondoForno} from '../FondoForno';
import {FondoPiedra} from '../../comun/Fondo';
import {TextoCentrado} from '../../comun/TextoCentrado';
import {TextoPalabras} from '../../comun/TextoPalabras';
import {e, tam} from '../../comun/tokens';
import {ESCENAS, FORNO, TEXTOS} from '../guion';

// 5 · CIERRE EN BUCLE: mismo tamaño y centro que el gancho, y el horno de fondo en el último frame.
export const Cierre: React.FC = () => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const total = (ESCENAS.cierre.hasta - ESCENAS.cierre.desde) * fps;
  // Al final vuelve el horno (congelado en su frame 0): el último frame encaja con el primero
  const horno = interpolate(frame, [total - FORNO.vuelveEnCierre, total - 1], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <FondoPiedra>
      {horno > 0 ? (
        <AbsoluteFill style={{opacity: horno}}>
          <Freeze frame={0}>
            <FondoForno paraTexto />
          </Freeze>
        </AbsoluteFill>
      ) : null}
      <TextoCentrado>
        <TextoPalabras texto={TEXTOS.cierre} desde={3} tamano={tam.gancho} />
        <TextoPalabras texto={TEXTOS.cierrePie} desde={Math.round(0.9 * fps)} tamano={tam.titular - 20} estilo={{marginTop: e[5]}} />
      </TextoCentrado>
    </FondoPiedra>
  );
};
