import React from 'react';
import {AbsoluteFill} from 'remotion';
import {FondoPiedra} from '../comun/Fondo';
import {TextoCentrado} from '../comun/TextoCentrado';
import {TextoPalabras} from '../comun/TextoPalabras';
import {color, e, fuente, tam} from '../comun/tokens';
import {ZONA} from '../comun/zonaSegura';
import {TEXTOS} from './guion';

// Portada 1080x1920 con el gancho. Todo cabe también en el recorte 3:4 de la cuadrícula del perfil.
export const Portada: React.FC = () => (
  <FondoPiedra>
    <TextoCentrado>
      <TextoPalabras texto={TEXTOS.gancho[0]} inmediato tamano={tam.gancho - 16} colorTexto={color.espuma2} />
      <div style={{height: 2, width: 120, background: color.piedraLinea, margin: `${e[6]}px auto`}} />
      <TextoPalabras texto={TEXTOS.gancho[1]} inmediato tamano={tam.gancho - 16} />
    </TextoCentrado>
    <AbsoluteFill>
      <div style={{position: 'absolute', left: ZONA.lados + 12, bottom: 300, fontFamily: fuente.familia, ...fuente.titular, fontSize: tam.logo, color: color.espuma}}>
        lareira<span style={{color: color.lume}}>.</span>
      </div>
    </AbsoluteFill>
  </FondoPiedra>
);
