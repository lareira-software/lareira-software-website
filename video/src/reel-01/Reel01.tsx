import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import {Grano} from '../comun/Grano';
import {asset} from '../comun/assets';
import {BandaSonora} from '../comun/BandaSonora';
import {Logo} from '../comun/Logo';
import {Subtitulos} from '../comun/Subtitulos';
import {GuiaZonaSegura} from '../comun/zonaSegura';
import {color} from '../comun/tokens';
import {Cierre} from './escenas/Cierre';
import {Gancho} from './escenas/Gancho';
import {Iceberg} from './escenas/Iceberg';
import {LoQueVes} from './escenas/LoQueVes';
import {ManosReales} from './escenas/ManosReales';
import {DURACION, ESCENAS, FPS, LOGO_CLARO_DESDE, LOGO_DESDE, VOZ, subtitulos} from './guion';

export type PropsReel = {verZonaSegura: boolean};

const tramo = (e: {desde: number; hasta: number}) => ({from: Math.round(e.desde * FPS), durationInFrames: Math.round((e.hasta - e.desde) * FPS)});

export const Reel01: React.FC<PropsReel> = ({verZonaSegura}) => {
  const hayVoz = asset('voz.mp3') !== null; // sin voz no hay subtítulos: el texto en pantalla cuenta la historia
  return (
    <AbsoluteFill style={{backgroundColor: color.granito}}>
      <Sequence {...tramo(ESCENAS.gancho)} name="1 · Gancho"><Gancho /></Sequence>
      <Sequence {...tramo(ESCENAS.loQueVes)} name="2 · Lo que ves"><LoQueVes /></Sequence>
      <Sequence {...tramo(ESCENAS.iceberg)} name="3 · El iceberg"><Iceberg /></Sequence>
      <Sequence {...tramo(ESCENAS.manos)} name="4 · Manos reales"><ManosReales /></Sequence>
      <Sequence {...tramo(ESCENAS.cierre)} name="5 · Cierre"><Cierre /></Sequence>
      {/* Logo: tinta sobre granito claro, blanco bajo el agua y sobre las manos */}
      <Sequence from={LOGO_DESDE * FPS} durationInFrames={Math.round((LOGO_CLARO_DESDE - LOGO_DESDE) * FPS)} name="Logo (oscuro)"><Logo colorTexto={color.tinta} /></Sequence>
      <Sequence from={Math.round(LOGO_CLARO_DESDE * FPS)} durationInFrames={Math.round((ESCENAS.cierre.desde - LOGO_CLARO_DESDE) * FPS)} name="Logo (claro)"><Logo colorTexto={color.espuma} fundido={0} /></Sequence>
      <Sequence from={ESCENAS.cierre.desde * FPS} name="Logo (oscuro)"><Logo colorTexto={color.tinta} fundido={0} /></Sequence>
      <Grano />
      {hayVoz ? <Subtitulos cues={subtitulos()} /> : null}
      <BandaSonora voz={VOZ} fps={FPS} />
      {verZonaSegura ? <GuiaZonaSegura /> : null}
    </AbsoluteFill>
  );
};

export const DURACION_FRAMES = DURACION * FPS;
