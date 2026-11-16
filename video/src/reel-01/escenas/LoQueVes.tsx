import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {FondoPiedra} from '../../comun/Fondo';
import {Movil} from '../../comun/Movil';
import {TextoPalabras} from '../../comun/TextoPalabras';
import {entrada} from '../../comun/movimiento';
import {color, fuente, tam} from '../../comun/tokens';
import {ZONA_RECT} from '../../comun/zonaSegura';
import {ESCENAS, TEXTOS} from '../guion';
import {MOVIL_ESC2, O_FORNO} from '../web-ejemplo';

/** Título de arriba y etiqueta 10 %: la escena 3 los reutiliza para fundirlos. */
export const TituloLoQueVes: React.FC<{desde?: number; inmediato?: boolean}> = ({desde = 4, inmediato}) => (
  <div style={{position: 'absolute', left: ZONA_RECT.x, top: ZONA_RECT.y + 30, width: ZONA_RECT.ancho, textAlign: 'center'}}>
    <TextoPalabras texto={TEXTOS.loQueVes} desde={desde} inmediato={inmediato} tamano={tam.titular} />
  </div>
);

export const Etiqueta10: React.FC<{v: number}> = ({v}) => (
  <div style={{position: 'absolute', left: 690, top: 840, width: 270, opacity: v, transform: `translateY(${(1 - v) * 16}px)`}}>
    <div style={{fontFamily: fuente.familia, ...fuente.numero, fontSize: 96, color: color.espuma}}>10%</div>
    <div style={{height: 2, background: color.piedraLinea, marginTop: 14, transformOrigin: '0 50%', transform: `scaleX(${v})`}} />
    <div style={{fontFamily: fuente.familia, fontWeight: 600, fontSize: tam.etiqueta - 8, color: color.espuma2, marginTop: 14}}>lo que ves</div>
  </div>
);

export const escalaMovilEsc2 = (frame: number, total: number) =>
  interpolate(frame, [0, total], [MOVIL_ESC2.escalaIni, MOVIL_ESC2.escalaFin], {easing: Easing.inOut(Easing.quad), extrapolateRight: 'clamp'});

// 2 · LO QUE VES
export const LoQueVes: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const total = (ESCENAS.loQueVes.hasta - ESCENAS.loQueVes.desde) * fps;
  const vMovil = entrada(frame, fps, 2);
  const v10 = entrada(frame, fps, 34);
  return (
    <FondoPiedra>
      <TituloLoQueVes />
      <div style={{position: 'absolute', inset: 0, opacity: vMovil, transform: `translateY(${(1 - vMovil) * 50}px)`}}>
        <Movil web={O_FORNO} bx={MOVIL_ESC2.bx} by={MOVIL_ESC2.by} escala={escalaMovilEsc2(frame, total)} />
      </div>
      <Etiqueta10 v={v10} />
    </FondoPiedra>
  );
};
