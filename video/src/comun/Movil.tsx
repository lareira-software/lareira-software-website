import React from 'react';
import {Img} from 'remotion';
import {fuente} from './tokens';

// Móvil dibujado en CSS: marco simple sin marca, radio 30px escalado (DESIGN.md «Móvil de ejemplo»).
export const MOVIL = {ancho: 420, alto: 860} as const;

/** Rectángulo de la foto dentro de la pantalla del móvil, en px del vídeo (para encadenar transiciones). */
export const huecoFoto = (bx: number, by: number, escala = 1) => {
  const x = bx - MOVIL.ancho / 2 + 14;
  const y = by - MOVIL.alto + 14 + 46 + 64;
  return {x: bx + (x - bx) * escala, y: by + (y - by) * escala, ancho: 392 * escala, alto: 330 * escala};
};

export type WebEjemplo = {nombre: string; lugar: string; foto: string; texto: string; boton: string};

/** Posición por el centro de la base del móvil (bx, by) y escala con origen en la base. */
export const Movil: React.FC<{web: WebEjemplo; bx: number; by: number; escala?: number; opacidad?: number}> = ({web, bx, by, escala = 1, opacidad = 1}) => {
  const c = {fondo: '#FBF7F0', texto: '#2A1D12', texto2: '#6B5A4A', boton: '#2A1D12'}; // web de ejemplo (DESIGN.md §9)
  return (
    <div
      style={{
        position: 'absolute',
        left: bx - MOVIL.ancho / 2,
        top: by - MOVIL.alto,
        width: MOVIL.ancho,
        height: MOVIL.alto,
        transform: `scale(${escala})`,
        transformOrigin: '50% 100%',
        opacity: opacidad,
        borderRadius: 56,
        background: '#141615',
        padding: 14,
        boxSizing: 'border-box',
        boxShadow: '0 30px 60px rgba(0,0,0,.28)',
      }}
    >
      <div style={{width: '100%', height: '100%', borderRadius: 44, overflow: 'hidden', background: c.fondo, fontFamily: fuente.familia, color: c.texto, display: 'flex', flexDirection: 'column'}}>
        {/* barra de estado */}
        <div style={{height: 46, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', fontSize: 17, fontWeight: 600}}>
          <span>9:41</span>
          <span style={{width: 92, height: 26, borderRadius: 13, background: '#141615'}} />
          <span style={{letterSpacing: 2}}>●●●</span>
        </div>
        {/* cabecera */}
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 26px', height: 64, boxSizing: 'border-box'}}>
          <span style={{fontWeight: 750, fontStretch: '72%', fontSize: 30, letterSpacing: '-0.02em'}}>{web.nombre}</span>
          <span style={{display: 'flex', flexDirection: 'column', gap: 6}}>
            <span style={{width: 28, height: 2.5, background: c.texto}} />
            <span style={{width: 28, height: 2.5, background: c.texto}} />
          </span>
        </div>
        <Img src={web.foto} style={{width: '100%', height: 330, objectFit: 'cover'}} />
        <div style={{padding: '26px 26px 0', flex: 1, display: 'flex', flexDirection: 'column'}}>
          <div style={{fontSize: 15, fontWeight: 600, color: c.texto2}}>{web.lugar}</div>
          <div style={{fontWeight: 750, fontStretch: '72%', fontSize: 44, lineHeight: 1, letterSpacing: '-0.02em', marginTop: 10}}>{web.texto}</div>
          <div style={{marginTop: 18, height: 10, width: '86%', borderRadius: 5, background: '#E9E1D4'}} />
          <div style={{marginTop: 10, height: 10, width: '64%', borderRadius: 5, background: '#E9E1D4'}} />
          <div style={{marginTop: 'auto', marginBottom: 30, height: 62, borderRadius: 8, background: c.boton, color: c.fondo, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 650}}>{web.boton}</div>
        </div>
      </div>
    </div>
  );
};
