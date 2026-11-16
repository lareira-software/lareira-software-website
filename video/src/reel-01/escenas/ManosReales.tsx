import React from 'react';
import {AbsoluteFill, OffthreadVideo, useVideoConfig} from 'remotion';
import {asset} from '../../comun/assets';
import {Sustituto} from '../../comun/Fondo';
import {TextoPalabras} from '../../comun/TextoPalabras';
import {tam} from '../../comun/tokens';
import {ZONA_RECT} from '../../comun/zonaSegura';
import {TEXTOS} from '../guion';

// 4 · MANOS REALES
export const ManosReales: React.FC = () => {
  const {fps} = useVideoConfig();
  const manos = asset('manos.mp4');
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {manos ? <OffthreadVideo src={manos} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} /> : <Sustituto texto="MANOS.MP4 AQUÍ" />}
      {/* oscurecido suave abajo para poder leer */}
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,14,13,0) 38%, rgba(10,14,13,.55) 62%, rgba(10,14,13,.78) 100%)'}} />
      <div style={{position: 'absolute', left: ZONA_RECT.x, width: ZONA_RECT.ancho, bottom: 560, display: 'flex', flexDirection: 'column', gap: 36, textAlign: 'center', padding: '0 24px', boxSizing: 'border-box'}}>
        <TextoPalabras texto={TEXTOS.manos[0]} desde={6} tamano={tam.titular} />
        <TextoPalabras texto={TEXTOS.manos[1]} desde={Math.round(TEXTOS.manosSegundaFrase * fps)} tamano={tam.titular} />
      </div>
    </AbsoluteFill>
  );
};
