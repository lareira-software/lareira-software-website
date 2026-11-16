import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {color, fuente} from './tokens';
import {entrada, VIVO} from './movimiento';

/**
 * Texto que entra palabra a palabra. Las palabras entre *asteriscos* van en naranja (acento).
 * `desde`: frame (relativo a la secuencia) en que entra la primera palabra.
 * `cadencia`: frames entre palabra y palabra. `inmediato`: ya visible desde el primer frame.
 */
export const TextoPalabras: React.FC<{
  texto: string;
  desde?: number;
  cadencia?: number;
  inmediato?: boolean;
  tamano: number;
  estilo?: React.CSSProperties;
  colorTexto?: string;
}> = ({texto, desde = 0, cadencia = 3, inmediato = false, tamano, estilo, colorTexto = color.espuma}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const palabras = texto.split(' ');
  return (
    <div style={{fontFamily: fuente.familia, ...fuente.titular, fontSize: tamano, color: colorTexto, textWrap: 'balance', ...estilo}}>
      {palabras.map((p, i) => {
        const acento = /^\*.+\*[.,:;?!]*$/.test(p);
        const limpia = p.replace(/\*/g, '');
        const v = inmediato ? 1 : entrada(frame, fps, desde + i * cadencia, VIVO);
        const y = interpolate(v, [0, 1], [0.28, 0]);
        return (
          <React.Fragment key={i}>
            <span style={{display: 'inline-block', opacity: Math.min(1, v * 1.4), transform: `translateY(${y}em)`, color: acento ? color.lume : undefined}}>
              {/* el signo % de Archivo deja mucho aire a la derecha: se recoge un poco */}
              {limpia.split(/(%)/).map((t, j) => (t === '%' ? <span key={j} style={{letterSpacing: '-0.09em'}}>%</span> : t))}
            </span>
            {i < palabras.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
