import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {FondoPiedra} from '../../comun/Fondo';
import {TextoPalabras} from '../../comun/TextoPalabras';
import {TextoCentrado} from '../../comun/TextoCentrado';
import {tam} from '../../comun/tokens';
import {TEXTOS} from '../guion';

// 1 · GANCHO. El primer golpe ya está a la vista en el frame 0 (para el bucle y para la vista previa del feed).
export const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const segundo = Math.round(TEXTOS.ganchoSegundoGolpe * fps);
  return (
    <FondoPiedra>
      <TextoCentrado>
        {frame < segundo ? (
          <TextoPalabras texto={TEXTOS.gancho[0]} inmediato tamano={tam.gancho} />
        ) : (
          <TextoPalabras texto={TEXTOS.gancho[1]} desde={segundo} cadencia={3} tamano={tam.gancho} />
        )}
      </TextoCentrado>
    </FondoPiedra>
  );
};
