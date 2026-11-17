import React from 'react';
import {AbsoluteFill} from 'remotion';
import {VIDEO} from './tokens';

// Zona segura de Instagram Reels: nada importante fuera de este rectángulo.
export const ZONA = {arriba: 250, abajo: 380, lados: 60} as const;
export const ZONA_RECT = {
  x: ZONA.lados,
  y: ZONA.arriba,
  ancho: VIDEO.ancho - ZONA.lados * 2, // 960
  alto: VIDEO.alto - ZONA.arriba - ZONA.abajo, // 1290
  centroY: ZONA.arriba + (VIDEO.alto - ZONA.arriba - ZONA.abajo) / 2, // 895
} as const;

/** Contenedor que coloca a sus hijos dentro de la zona segura. */
export const ZonaSegura: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div
    style={{
      position: 'absolute',
      left: ZONA_RECT.x,
      top: ZONA_RECT.y,
      width: ZONA_RECT.ancho,
      height: ZONA_RECT.alto,
      ...style,
    }}
  >
    {children}
  </div>
);

/** Guía visual para revisar en el Studio (activar con la prop verZonaSegura). */
export const GuiaZonaSegura: React.FC = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    <div style={{position: 'absolute', inset: 0, borderTop: `${ZONA.arriba}px solid rgba(255,0,80,.18)`, borderBottom: `${ZONA.abajo}px solid rgba(255,0,80,.18)`, borderLeft: `${ZONA.lados}px solid rgba(255,0,80,.18)`, borderRight: `${ZONA.lados}px solid rgba(255,0,80,.18)`}} />
  </AbsoluteFill>
);
