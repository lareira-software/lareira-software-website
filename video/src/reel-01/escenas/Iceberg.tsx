import React from 'react';
import {AbsoluteFill, interpolate, OffthreadVideo, useCurrentFrame, useVideoConfig} from 'remotion';
import {asset} from '../../comun/assets';
import {Movil} from '../../comun/Movil';
import {entrada, salida, SUAVE} from '../../comun/movimiento';
import {color, fuente, tam} from '../../comun/tokens';
import {ZONA_RECT} from '../../comun/zonaSegura';
import {CAPAS, ICEBERG} from '../guion';
import {LINEA_AGUA, MOVIL_ESC2, MOVIL_PUNTA, O_FORNO, fotoOForno} from '../web-ejemplo';
import {Etiqueta10, TituloLoQueVes} from './LoQueVes';

const ALTO_MUNDO = 3620;
const BAJADA = 1700; // cuánto desciende la cámara (px)

// Contorno del iceberg en coordenadas del «mundo» (1080 x 3620)
const PUNTA = 'M 404 1180 L 452 1158 L 628 1158 L 684 1180 Z';
const CUERPO =
  'M 404 1180 L 684 1180 L 742 1236 L 812 1262 L 868 1352 L 930 1400 L 962 1520 L 1012 1640 L 1000 1760 L 1036 1900 L 1022 2120 L 1044 2300 L 1010 2520 L 1030 2700 L 992 2900 L 958 3080 L 962 3180 L 880 3330 L 760 3420 L 650 3500 L 520 3520 L 400 3470 L 300 3480 L 210 3380 L 140 3250 L 96 3060 L 60 2880 L 72 2680 L 44 2480 L 58 2260 L 40 2060 L 70 1880 L 62 1720 L 108 1590 L 150 1470 L 214 1400 L 262 1300 L 330 1258 Z';
const FACETAS = ['M 684 1180 L 640 1600 L 780 2100 L 700 2900 L 520 3520', 'M 404 1180 L 380 1500 L 250 1900 L 330 2700 L 520 3520', 'M 1012 1640 L 780 2100', 'M 62 1720 L 250 1900', 'M 72 2680 L 330 2700'];

const Mundo: React.FC<{dibujarIceberg: boolean; vAgua: number}> = ({dibujarIceberg, vAgua}) => (
  <svg width={1080} height={ALTO_MUNDO} viewBox={`0 0 1080 ${ALTO_MUNDO}`} style={{position: 'absolute', left: 0, top: 0}}>
    <defs>
      <linearGradient id="profundidad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={color.mar} />
        <stop offset="1" stopColor={color.abismo} />
      </linearGradient>
    </defs>
    {dibujarIceberg ? (
      <g opacity={vAgua}>
        <rect x={0} y={LINEA_AGUA} width={1080} height={ALTO_MUNDO - LINEA_AGUA} fill="url(#profundidad)" />
        <path d={CUERPO} fill={color.hielo} stroke={color.hieloBorde} strokeWidth={2.5} strokeLinejoin="round" />
        {FACETAS.map((d) => (
          <path key={d} d={d} fill="none" stroke={color.hieloBorde} strokeWidth={1.5} opacity={0.22} />
        ))}
        <path d={PUNTA} fill="#DCE5E2" />
      </g>
    ) : null}
    <line x1={0} x2={1080} y1={LINEA_AGUA} y2={LINEA_AGUA} stroke={color.lineaAgua} strokeWidth={3} strokeDasharray="1080" strokeDashoffset={1080 * (1 - vAgua)} />
  </svg>
);

// 3 · EL ICEBERG
export const Iceberg: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const fondoVideo = asset('iceberg.mp4');

  // A · el móvil se encoge hasta ser la punta y aparece el agua
  const p = entrada(frame, fps, 0, SUAVE, 30);
  const bx = interpolate(p, [0, 1], [MOVIL_ESC2.bx, MOVIL_PUNTA.bx]);
  const by = interpolate(p, [0, 1], [MOVIL_ESC2.by, MOVIL_PUNTA.by]);
  const escala = interpolate(p, [0, 1], [MOVIL_ESC2.escalaFin, MOVIL_PUNTA.escala]);
  const vAgua = entrada(frame, fps, 8, SUAVE, 26);
  const fuera = salida(frame, 0, 10);

  // B · la cámara baja (paneo vertical suave)
  const bajada = entrada(frame, fps, Math.round(ICEBERG.bajadaDesde * fps), SUAVE, Math.round(ICEBERG.bajadaDura * fps));
  const camara = interpolate(bajada, [0, 1], [0, BAJADA]);

  // D · 90 %
  const v90 = entrada(frame, fps, Math.round(ICEBERG.noventaDesde * fps));

  return (
    <AbsoluteFill style={{backgroundColor: color.piedra, overflow: 'hidden'}}>
      {fondoVideo ? (
        <AbsoluteFill style={{opacity: vAgua}}>
          <OffthreadVideo src={fondoVideo} muted style={{width: '100%', height: '100%', objectFit: 'cover'}} />
          <AbsoluteFill style={{backgroundColor: 'rgba(7,31,30,.42)'}} />
        </AbsoluteFill>
      ) : null}

      <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: ALTO_MUNDO, transform: `translateY(${-camara}px)`}}>
        <Mundo dibujarIceberg={!fondoVideo} vAgua={vAgua} />
        <Movil web={{...O_FORNO, foto: fotoOForno()}} bx={bx} by={by} escala={escala} />
      </div>

      <div style={{opacity: fuera}}>
        <TituloLoQueVes inmediato />
        <Etiqueta10 v={1} />
      </div>

      {/* C · capas, una a una, como filas de tablilla */}
      <div style={{position: 'absolute', left: 110, top: ZONA_RECT.y + 20, width: 860}}>
        {CAPAS.map((texto, i) => {
          const v = entrada(frame, fps, Math.round((ICEBERG.capasDesde + i * ICEBERG.cadenciaCapas) * fps));
          return (
            <div key={texto} style={{position: 'relative', padding: '17px 0 15px', opacity: Math.min(1, v * 1.3), transform: `translateY(${(1 - v) * 18}px)`}}>
              <div style={{fontFamily: fuente.familia, ...fuente.texto, fontStretch: '78%', fontSize: tam.capa, color: color.espuma}}>{texto}</div>
              <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 1.5, background: color.hieloBorde, opacity: 0.55, transformOrigin: '0 50%', transform: `scaleX(${v})`}} />
            </div>
          );
        })}
      </div>

      <div
        style={{
          position: 'absolute',
          right: 130,
          top: 1090,
          fontFamily: fuente.familia,
          ...fuente.numero,
          fontSize: tam.enorme,
          color: color.lume,
          opacity: v90,
          transform: `translateY(${(1 - v90) * 30}px)`,
        }}
      >
        90%
      </div>
    </AbsoluteFill>
  );
};
