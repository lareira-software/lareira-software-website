import React from 'react';
import {Audio, interpolate} from 'remotion';
import {asset} from './assets';
import type {Cue} from './Subtitulos';

const ROCE = 9; // frames de transición al bajar/subir la música

/**
 * Voz en off (si existe voz.mp3) y música (si existe musica.mp3) al 20 %,
 * que baja al 8 % mientras suena la voz (tramos `voz`).
 */
export const BandaSonora: React.FC<{voz: Cue[]; fps: number; volumenMusica?: number; volumenConVoz?: number}> = ({voz, fps, volumenMusica = 0.2, volumenConVoz = 0.08}) => {
  const vozSrc = asset('voz.mp3');
  const musicaSrc = asset('musica.mp3');
  const volumen = (f: number) => {
    if (!vozSrc) return volumenMusica;
    let v = volumenMusica;
    for (const tramo of voz) {
      const a = tramo.desde * fps;
      const b = tramo.hasta * fps;
      const d = interpolate(f, [a - ROCE, a, b, b + ROCE], [volumenMusica, volumenConVoz, volumenConVoz, volumenMusica], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
      v = Math.min(v, d);
    }
    return v;
  };
  return (
    <>
      {musicaSrc ? <Audio src={musicaSrc} volume={volumen} loop /> : null}
      {vozSrc ? <Audio src={vozSrc} /> : null}
    </>
  );
};
