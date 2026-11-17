import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {noise2D} from '@remotion/noise';
import {asset} from '../comun/assets';
import {FondoForno} from './FondoForno';

// Fondo del gancho (y del último frame). Si existe assets/lareira.jpg usa esa foto real;
// si no, el horno de O Forno dibujado en SVG.
export const FOTO_LAREIRA = 'lareira.jpg';
// La foto es horizontal: se ve entera a lo ancho y, detrás, la misma foto muy desenfocada rellena el vertical.
// Así el fuego queda a la derecha, fuera del texto centrado.
const FOTO_ALTO = Math.round((1080 * 462) / 736); // 676 px a 1080 de ancho
const FOTO_Y = 590;
const BORDE = 'linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)';

export const FondoGancho: React.FC<{paraTexto?: boolean}> = ({paraTexto = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const foto = asset(FOTO_LAREIRA);
  if (!foto) return <FondoForno paraTexto={paraTexto} />;

  const t = frame / fps;
  // Push-in lento (1 → 1,08) que se acelera un poco al salir hacia la escena 2
  const base = interpolate(frame, [0, 90], [1, 1.08], {easing: Easing.inOut(Easing.sin), extrapolateRight: 'clamp'});
  const extra = interpolate(frame, [70, 102], [0, 0.07], {easing: Easing.in(Easing.quad), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  // Luz de lumbre: la imagen respira un poco más clara y más oscura, sin ritmo fijo
  const lumbre = 1 + Math.sin((t / 1.5) * Math.PI * 2) * 0.025 + noise2D('lumbre', t * 2.2, 0) * 0.035;

  return (
    <AbsoluteFill style={{backgroundColor: '#14100D', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${base + extra})`, transformOrigin: '55% 50%', filter: `brightness(${lumbre})`}}>
        {/* relleno vertical: la misma foto, muy desenfocada y oscura */}
        <Img src={foto} style={{position: 'absolute', inset: -60, width: 'calc(100% + 120px)', height: 'calc(100% + 120px)', objectFit: 'cover', filter: 'blur(36px) brightness(.55)'}} />
        <Img src={foto} style={{position: 'absolute', left: 0, top: FOTO_Y, width: 1080, height: FOTO_ALTO, filter: paraTexto ? 'blur(4px)' : undefined, WebkitMaskImage: BORDE, maskImage: BORDE}} />
      </AbsoluteFill>
      {paraTexto ? (
        <>
          <AbsoluteFill style={{backgroundColor: 'rgba(22,12,6,.45)'}} />
          {/* refuerzo detrás del texto centrado: el fuego es muy claro */}
          <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(22,12,6,0) 28%, rgba(22,12,6,.38) 42%, rgba(22,12,6,.38) 60%, rgba(22,12,6,0) 74%)'}} />
        </>
      ) : null}
      {/* grano sutil, igual que en la ilustración */}
      <AbsoluteFill style={{opacity: 0.05, pointerEvents: 'none'}}>
        <svg width="100%" height="100%">
          <filter id="granoFoto">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#granoFoto)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
