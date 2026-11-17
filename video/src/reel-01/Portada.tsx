import React from 'react';
import {AbsoluteFill} from 'remotion';
import {TextoPalabras} from '../comun/TextoPalabras';
import {color, fuente, tam} from '../comun/tokens';
import {ZONA} from '../comun/zonaSegura';
import {BLOQUE_TEXTO, TARJETA, TEXTOS} from './guion';
import {FotoTarjeta} from './FotoTarjeta';

// Portada 1080x1920: el gancho completo con la foto. Lo importante cabe en el recorte 3:4 del perfil.
export const Portada: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: color.granito}}>
    <div style={{position: 'absolute', left: BLOQUE_TEXTO.x, top: BLOQUE_TEXTO.y, width: BLOQUE_TEXTO.ancho}}>
      <TextoPalabras texto={TEXTOS.gancho[0]} inmediato tamano={tam.titular} colorTexto={color.tinta2} />
      <TextoPalabras texto={TEXTOS.gancho[1]} inmediato tamano={tam.gancho - 16} colorTexto={color.tinta} estilo={{marginTop: 28}} />
    </div>
    <FotoTarjeta rect={{...TARJETA, y: TARJETA.y + 40, alto: TARJETA.alto - 40}} zoom={1.06} />
    <div style={{position: 'absolute', left: ZONA.lados + 12, bottom: ZONA.abajo, fontFamily: fuente.familia, ...fuente.titular, fontSize: tam.logo, color: color.tinta}}>
      lareira<span style={{color: color.lume}}>.</span>
    </div>
  </AbsoluteFill>
);
