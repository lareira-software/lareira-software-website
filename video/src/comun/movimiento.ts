import {spring, interpolate, Easing} from 'remotion';

// Spring sin rebote (amortiguación alta): movimiento natural, nada de «boing».
export const SUAVE = {damping: 200, stiffness: 120, mass: 1} as const;
// Algo más vivo para entradas de palabras, todavía sin rebote visible.
export const VIVO = {damping: 26, stiffness: 140, mass: 0.9} as const;

export const entrada = (frame: number, fps: number, desde = 0, config: typeof SUAVE | typeof VIVO = SUAVE, durationInFrames?: number) =>
  spring({frame: frame - desde, fps, config, durationInFrames});

/** Fundido de salida lineal-suave entre dos frames. */
export const salida = (frame: number, desde: number, duracion = 8) =>
  interpolate(frame, [desde, desde + duracion], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.bezier(0.23, 1, 0.32, 1)});

export const s = (segundos: number, fps = 30) => Math.round(segundos * fps);
