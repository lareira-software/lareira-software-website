import React from 'react';
import {AbsoluteFill} from 'remotion';
import {color} from './tokens';

export const FondoPiedra: React.FC<{children?: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{backgroundColor: color.piedra}}>{children}</AbsoluteFill>
);

/** Rectángulo gris de sustituto para un asset que falta. */
export const Sustituto: React.FC<{texto: string}> = ({texto}) => (
  <AbsoluteFill style={{backgroundColor: '#5D6260', alignItems: 'center', justifyContent: 'flex-start', paddingTop: 520}}>
    <div style={{fontFamily: '"Archivo", sans-serif', fontWeight: 700, fontStretch: '85%', fontSize: 56, color: '#DADDDB', letterSpacing: '0.02em', border: '2px dashed #9AA09D', padding: '28px 40px'}}>{texto}</div>
  </AbsoluteFill>
);
