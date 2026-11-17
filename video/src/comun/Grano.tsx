import React from 'react';
import {AbsoluteFill} from 'remotion';

/** Grano fino sobre todo el vídeo para que no parezca digital ni vector frío. */
export const Grano: React.FC<{opacidad?: number}> = ({opacidad = 0.045}) => (
  <AbsoluteFill style={{opacity: opacidad, pointerEvents: 'none', mixBlendMode: 'overlay'}}>
    <svg width="100%" height="100%">
      <filter id="granoGlobal">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#granoGlobal)" />
    </svg>
  </AbsoluteFill>
);
