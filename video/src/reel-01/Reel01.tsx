import React from 'react';
import {AbsoluteFill, interpolate, Sequence, useCurrentFrame} from 'remotion';
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
import {DURACION, ESCENAS, FORNO, FPS, LOGO_DESDE, VOZ, subtitulos} from './guion';
import {FondoForno} from './FondoForno';

export type PropsReel = {verZonaSegura: boolean};

const tramo = (e: {desde: number; hasta: number}) => ({from: Math.round(e.desde * FPS), durationInFrames: Math.round((e.hasta - e.desde) * FPS)});

const HornoGancho: React.FC = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [FORNO.saleDesde, FORNO.saleHasta], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity: o}}>
      <FondoForno paraTexto />
    </AbsoluteFill>
  );
};

export const Reel01: React.FC<PropsReel> = ({verZonaSegura}) => {
  const hayVoz = asset('voz.mp3') !== null; // sin voz no hay subtítulos: el texto en pantalla cuenta la historia
  return (
    <AbsoluteFill style={{backgroundColor: color.piedra}}>
      <Sequence {...tramo(ESCENAS.loQueVes)} name="2 · Lo que ves"><LoQueVes /></Sequence>
      {/* El horno va encima de la escena 2 mientras se funde: así se ve entrar el móvil a través */}
      <Sequence from={0} durationInFrames={FORNO.saleHasta} name="1 · Horno O Forno"><HornoGancho /></Sequence>
      <Sequence {...tramo(ESCENAS.gancho)} name="1 · Gancho (texto)"><Gancho /></Sequence>
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
