import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
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
import {DURACION, ESCENAS, FPS, LOGO_DESDE, VOZ, subtitulos} from './guion';

export type PropsReel = {verZonaSegura: boolean};

const tramo = (e: {desde: number; hasta: number}) => ({from: Math.round(e.desde * FPS), durationInFrames: Math.round((e.hasta - e.desde) * FPS)});

export const Reel01: React.FC<PropsReel> = ({verZonaSegura}) => {
  const hayVoz = asset('voz.mp3') !== null; // sin voz no hay subtítulos: el texto en pantalla cuenta la historia
  return (
    <AbsoluteFill style={{backgroundColor: color.piedra}}>
      <Sequence {...tramo(ESCENAS.gancho)} name="1 · Gancho"><Gancho /></Sequence>
      <Sequence {...tramo(ESCENAS.loQueVes)} name="2 · Lo que ves"><LoQueVes /></Sequence>
      <Sequence {...tramo(ESCENAS.iceberg)} name="3 · El iceberg"><Iceberg /></Sequence>
      <Sequence {...tramo(ESCENAS.manos)} name="4 · Manos reales"><ManosReales /></Sequence>
      <Sequence {...tramo(ESCENAS.cierre)} name="5 · Cierre"><Cierre /></Sequence>
      <Sequence from={LOGO_DESDE * FPS} name="Logo"><Logo /></Sequence>
      {hayVoz ? <Subtitulos cues={subtitulos()} /> : null}
      <BandaSonora voz={VOZ} fps={FPS} />
      {verZonaSegura ? <GuiaZonaSegura /> : null}
    </AbsoluteFill>
  );
};

export const DURACION_FRAMES = DURACION * FPS;
