import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {color, fuente} from './tokens';
import {entrada, SUAVE} from './movimiento';

/**
 * Texto que entra palabra a palabra con revelado de máscara: cada palabra sube desde detrás de su línea.
 * Las palabras entre *asteriscos* llevan una pegatina naranja (--lume) con texto tinta, que se pinta de izquierda a derecha.
 * `desde`: frame (relativo a la secuencia) de la primera palabra. `cadencia`: frames entre palabras.
 * `inmediato`: ya visible en el primer frame. `sale`: frame en que las palabras se van hacia arriba.
 */
export const TextoPalabras: React.FC<{
  texto: string;
  desde?: number;
  cadencia?: number;
  inmediato?: boolean;
  sale?: number;
  tamano: number;
  estilo?: React.CSSProperties;
  colorTexto?: string;
}> = ({texto, desde = 0, cadencia = 3, inmediato = false, sale, tamano, estilo, colorTexto = color.espuma}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const palabras = texto.split(' ');
  return (
    <div style={{fontFamily: fuente.familia, ...fuente.titular, lineHeight: 1.04, fontSize: tamano, color: colorTexto, textWrap: 'balance', ...estilo}}>
      {palabras.map((p, i) => {
        const acento = /^\*.+\*[.,:;?!¿]*$/.test(p);
        const limpia = p.replace(/\*/g, '');
        const v = inmediato ? 1 : entrada(frame, fps, desde + i * cadencia, SUAVE, 16);
        const fuera = sale === undefined ? 0 : entrada(frame, fps, sale + i * 1, SUAVE, 10);
        const y = interpolate(v, [0, 1], [110, 0]) - fuera * 110;
        const pegatina = acento ? entrada(frame, fps, (inmediato ? 0 : desde + i * cadencia) + 6, SUAVE, 12) : 0;
        const contenido = limpia.split(/(%)/).map((t, j) => (t === '%' ? <span key={j} style={{letterSpacing: '-0.09em'}}>%</span> : t));
        return (
          <React.Fragment key={i}>
            {/* máscara: la palabra solo se ve dentro de su línea */}
            <span style={{display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', padding: '0.06em 0.08em 0.1em', margin: '-0.06em -0.08em -0.1em'}}>
              <span style={{display: 'inline-block', transform: `translateY(${y}%)`, position: 'relative', color: acento ? color.tinta : undefined, padding: acento ? '0 0.14em' : undefined}}>
                {acento ? (
                  <span style={{position: 'absolute', inset: '0.04em 0 0.02em', background: color.lume, borderRadius: 6, transformOrigin: '0 50%', transform: `scaleX(${pegatina})`, zIndex: -1}} />
                ) : null}
                <span style={{position: 'relative'}}>{contenido}</span>
              </span>
            </span>
            {i < palabras.length - 1 ? ' ' : null}
          </React.Fragment>
        );
      })}
    </div>
  );
};
