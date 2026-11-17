import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {color, fuente, tam} from './tokens';
import {ZONA} from './zonaSegura';

export type Cue = {desde: number; hasta: number; texto: string}; // en segundos

/** Subtítulos quemados: frases cortas, blanco en negrita con sombra suave, encima del logo. */
export const Subtitulos: React.FC<{cues: Cue[]}> = ({cues}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const cue = cues.find((c) => t >= c.desde && t < c.hasta);
  if (!cue) return null;
  const local = frame - cue.desde * fps;
  const o = interpolate(local, [0, 4], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <div
      style={{
        position: 'absolute',
        left: ZONA.lados,
        right: ZONA.lados,
        bottom: ZONA.abajo + 68, // deja sitio al logo
        textAlign: 'center',
        fontFamily: fuente.familia,
        ...fuente.subtitulo,
        fontSize: tam.subtitulo,
        color: color.espuma,
        opacity: o,
        textShadow: '0 2px 6px rgba(0,0,0,.55), 0 0 18px rgba(0,0,0,.35)',
      }}
    >
      {cue.texto}
    </div>
  );
};
