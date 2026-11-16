import React from 'react';
import {AbsoluteFill, OffthreadVideo, Sequence, useVideoConfig} from 'remotion';
import {asset} from '../../comun/assets';
import {Sustituto} from '../../comun/Fondo';
import {TextoPalabras} from '../../comun/TextoPalabras';
import {tam} from '../../comun/tokens';
import {ZONA_RECT} from '../../comun/zonaSegura';
import {TEXTOS, TOMAS_MANOS} from '../guion';

/** Tomas que existen en assets/. Si falta alguna, la toma de manos se alarga para ocupar su hueco. */
const tomasDisponibles = () => {
  const hay = TOMAS_MANOS.filter((t) => asset(t.archivo));
  if (!hay.some((t) => t.archivo === 'manos.mp4')) return [];
  const sobra = TOMAS_MANOS.filter((t) => !asset(t.archivo)).reduce((a, t) => a + t.dura, 0);
  return hay.map((t) => (t.archivo === 'manos.mp4' ? {...t, dura: t.dura + sobra} : t));
};

// Sombra suave para leer sobre la toma real
const SOMBRA: React.CSSProperties = {textShadow: '0 2px 8px rgba(0,0,0,.5), 0 0 24px rgba(0,0,0,.35)'};

// 4 · MANOS REALES
export const ManosReales: React.FC = () => {
  const {fps} = useVideoConfig();
  const tomas = tomasDisponibles();
  let inicio = 0;
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      {tomas.length === 0 ? <Sustituto texto="MANOS.MP4 AQUÍ" /> : null}
      {tomas.map((t) => {
        const from = Math.round(inicio * fps);
        const dur = Math.round(t.dura * fps);
        inicio += t.dura;
        return (
          <Sequence key={t.archivo} from={from} durationInFrames={dur} name={t.archivo}>
            <OffthreadVideo src={asset(t.archivo)!} startFrom={Math.round(t.desde * fps)} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          </Sequence>
        );
      })}
      {/* oscurecido suave abajo para poder leer */}
      <AbsoluteFill style={{background: 'linear-gradient(to bottom, rgba(10,14,13,0) 38%, rgba(10,14,13,.55) 62%, rgba(10,14,13,.78) 100%)'}} />
      <div style={{position: 'absolute', left: ZONA_RECT.x, width: ZONA_RECT.ancho, bottom: 560, display: 'flex', flexDirection: 'column', gap: 36, textAlign: 'center', padding: '0 24px', boxSizing: 'border-box'}}>
        <TextoPalabras texto={TEXTOS.manos[0]} desde={6} tamano={tam.titular} estilo={SOMBRA} />
        <TextoPalabras texto={TEXTOS.manos[1]} desde={Math.round(TEXTOS.manosSegundaFrase * fps)} tamano={tam.titular} estilo={SOMBRA} />
      </div>
    </AbsoluteFill>
  );
};
