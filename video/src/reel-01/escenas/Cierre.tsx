import React from 'react';
import {useVideoConfig} from 'remotion';
import {FondoPiedra} from '../../comun/Fondo';
import {TextoCentrado} from '../../comun/TextoCentrado';
import {TextoPalabras} from '../../comun/TextoPalabras';
import {e, tam} from '../../comun/tokens';
import {TEXTOS} from '../guion';

// 5 · CIERRE EN BUCLE: mismo fondo, mismo tamaño y mismo centro que el gancho.
export const Cierre: React.FC = () => {
  const {fps} = useVideoConfig();
  return (
    <FondoPiedra>
      <TextoCentrado>
        <TextoPalabras texto={TEXTOS.cierre} desde={3} tamano={tam.gancho} />
        <TextoPalabras texto={TEXTOS.cierrePie} desde={Math.round(0.9 * fps)} tamano={tam.titular - 20} estilo={{marginTop: e[5]}} />
      </TextoCentrado>
    </FondoPiedra>
  );
};
