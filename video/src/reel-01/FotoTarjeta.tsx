import React from 'react';
import {Img} from 'remotion';
import {fotoOForno} from './web-ejemplo';

export type Rect = {x: number; y: number; ancho: number; alto: number};

/** La foto de la lareira (o el horno dibujado si falta) en un rectángulo, con zoom interior hacia el fuego. */
export const FotoTarjeta: React.FC<{rect: Rect; zoom?: number; radio?: number; luz?: number; recorte?: number; style?: React.CSSProperties}> = ({rect, zoom = 1, radio = 6, luz = 1, recorte = 0, style}) => (
  <div
    style={{
      position: 'absolute',
      left: rect.x,
      top: rect.y,
      width: rect.ancho,
      height: rect.alto,
      borderRadius: radio,
      overflow: 'hidden',
      background: '#1A120D',
      clipPath: recorte > 0 ? `inset(${recorte * 100}% 0 0 0 round ${radio}px)` : undefined,
      ...style,
    }}
  >
    <Img src={fotoOForno()} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${zoom})`, transformOrigin: '82% 48%', filter: `brightness(${luz})`}} />
  </div>
);
