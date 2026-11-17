import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {huecoFoto, Movil} from '../../comun/Movil';
import {TextoPalabras} from '../../comun/TextoPalabras';
import {entrada, SUAVE} from '../../comun/movimiento';
import {color, fuente, tam} from '../../comun/tokens';
import {ESCENAS, TARJETA, TEXTOS, BLOQUE_TEXTO} from '../guion';
import {FotoTarjeta} from '../FotoTarjeta';
import {MOVIL_ESC2, O_FORNO, fotoOForno} from '../web-ejemplo';

/** Título de arriba y etiqueta 10 %: la escena 3 los reutiliza para fundirlos. */
export const TituloLoQueVes: React.FC<{desde?: number; inmediato?: boolean}> = ({desde = 10, inmediato}) => (
  <div style={{position: 'absolute', left: BLOQUE_TEXTO.x, top: BLOQUE_TEXTO.y, width: BLOQUE_TEXTO.ancho}}>
    <TextoPalabras texto={TEXTOS.loQueVes} desde={desde} inmediato={inmediato} tamano={tam.titular} colorTexto={color.tinta} />
  </div>
);

export const Etiqueta10: React.FC<{v: number}> = ({v}) => (
  <div style={{position: 'absolute', left: 690, top: 840, width: 270, opacity: Math.min(1, v * 1.5), transform: `translateY(${(1 - v) * 16}px)`}}>
    <div style={{fontFamily: fuente.familia, ...fuente.numero, fontSize: 112, color: color.tinta}}>10%</div>
    <div style={{height: 2, background: color.tinta, marginTop: 14, transformOrigin: '0 50%', transform: `scaleX(${v})`}} />
    <div style={{fontFamily: fuente.familia, fontWeight: 600, fontSize: tam.etiqueta - 6, color: color.tinta2, marginTop: 14}}>lo que ves</div>
  </div>
);

export const escalaMovilEsc2 = (frame: number, total: number) =>
  interpolate(frame, [0, total], [MOVIL_ESC2.escalaIni, MOVIL_ESC2.escalaFin], {easing: Easing.inOut(Easing.quad), extrapolateRight: 'clamp'});

const VUELO = 20; // frames que tarda la foto del gancho en encajar en el móvil

// 2 · LO QUE VES. Transición encadenada: la foto de la lareira vuela y se convierte en la foto de su web.
export const LoQueVes: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const total = (ESCENAS.loQueVes.hasta - ESCENAS.loQueVes.desde) * fps;
  const escala = escalaMovilEsc2(frame, total);
  const vuelo = entrada(frame, fps, 0, SUAVE, VUELO);
  const hueco = huecoFoto(MOVIL_ESC2.bx, MOVIL_ESC2.by, escala);
  const rect = {
    x: interpolate(vuelo, [0, 1], [TARJETA.x, hueco.x]),
    y: interpolate(vuelo, [0, 1], [TARJETA.y, hueco.y]),
    ancho: interpolate(vuelo, [0, 1], [TARJETA.ancho, hueco.ancho]),
    alto: interpolate(vuelo, [0, 1], [TARJETA.alto, hueco.alto]),
  };
  // El móvil aparece alrededor de la foto mientras esta llega
  const vMovil = interpolate(frame, [6, VUELO], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});
  const v10 = entrada(frame, fps, 36);
  return (
    <AbsoluteFill style={{backgroundColor: color.granito}}>
      <TituloLoQueVes />
      <div style={{position: 'absolute', inset: 0, opacity: vMovil, transform: `scale(${interpolate(vMovil, [0, 1], [1.04, 1])})`, transformOrigin: `${MOVIL_ESC2.bx}px ${hueco.y + hueco.alto / 2}px`}}>
        <Movil web={{...O_FORNO, foto: fotoOForno()}} bx={MOVIL_ESC2.bx} by={MOVIL_ESC2.by} escala={escala} />
      </div>
      {frame <= VUELO + 1 ? <FotoTarjeta rect={rect} zoom={interpolate(vuelo, [0, 1], [1.12, 1])} radio={interpolate(vuelo, [0, 1], [6, 0])} /> : null}
      <Etiqueta10 v={v10} />
    </AbsoluteFill>
  );
};
