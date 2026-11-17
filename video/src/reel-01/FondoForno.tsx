import React, {useMemo} from 'react';
import {AbsoluteFill, Easing, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {noise2D} from '@remotion/noise';
import {color} from '../comun/tokens';

// Horno de leña de O Forno (panadería inventada de Corcubión), dibujado en SVG.
// Ilustración plana: granito, madera, pan. El naranja de marca solo en brasas y resplandor.

const P = {
  pared: '#2A2623',
  paredJunta: '#24201D',
  piedras: ['#6B6761', '#75716A', '#615D57', '#7C776F', '#68635C'],
  junta: '#3A3632',
  boca: '#120E0C',
  solera: '#77726B',
  soleraSombra: '#4F4B46',
  suelo: '#1D1A18',
  madera: '#7A5534',
  maderaClara: '#946840',
  maderaSombra: '#4E3520',
  corteza: '#A8682F',
  cortezaClara: '#C98A49',
  cortezaOscura: '#7C4A1F',
  miga: '#EBD6AE',
  harina: '#EDE5D6',
  tronco: '#2B1A10',
  hollin: '#0E0B09',
  brasaFria: '#7E2A10',
  brasaMedia: '#C2431A',
};

// Centro de la boca del horno
const CX = 540;
const ARRANQUE = 1000; // donde empieza el arco
const R_BOCA = 255;
const R_ARCO = 365;
const SOLERA = 1160;
const PALA_Y = 1392; // apoyo de los panes

type Props = {
  /** Oscurece y desenfoca para que el texto del gancho mande. */
  paraTexto?: boolean;
  /** Recorte de la escena (viewBox SVG). Por defecto el vídeo entero. */
  viewBox?: string;
  /** Acerca la cámara (push-in). */
  conCamara?: boolean;
};

const seed = (s: string | number) => (n: number) => random(`${s}-${n}`);

/** Bloques de granito irregulares de la fachada. */
const usarFachada = () =>
  useMemo(() => {
    const r = seed('fachada');
    const bloques: {x: number; y: number; w: number; h: number; f: string}[] = [];
    let y = 470;
    let fila = 0;
    while (y < SOLERA) {
      const h = 92 + r(fila * 100) * 40;
      let x = 96 - r(fila * 100 + 1) * 70;
      let i = 0;
      while (x < 1080) {
        const w = 120 + r(fila * 100 + i + 2) * 120;
        bloques.push({x, y, w, h, f: P.piedras[Math.floor(r(fila * 100 + i + 50) * P.piedras.length)]});
        x += w;
        i++;
      }
      y += h;
      fila++;
    }
    return bloques;
  }, []);

/** Dovelas del arco: anillo entre R_BOCA y R_ARCO, piezas de ancho irregular. */
const usarDovelas = () =>
  useMemo(() => {
    const r = seed('arco');
    const n = 11;
    const cortes: number[] = [Math.PI];
    for (let i = 1; i < n; i++) cortes.push(Math.PI - (i / n) * Math.PI + (r(i) - 0.5) * 0.08);
    cortes.push(0);
    const pt = (a: number, rad: number) => `${(CX + Math.cos(a) * rad).toFixed(1)} ${(ARRANQUE - Math.sin(a) * rad).toFixed(1)}`;
    return cortes.slice(0, -1).map((a0, i) => {
      const a1 = cortes[i + 1];
      const am = (a0 + a1) / 2;
      const rExt = R_ARCO + (r(i + 30) - 0.5) * 26;
      const d = `M ${pt(a0, R_BOCA)} L ${pt(a0, rExt)} L ${pt(am, rExt + 4)} L ${pt(a1, rExt)} L ${pt(a1, R_BOCA)} L ${pt(am, R_BOCA)} Z`;
      return {d, f: P.piedras[Math.floor(r(i + 60) * P.piedras.length)]};
    });
  }, []);

/** Brasas: montoncito irregular al fondo de la boca. */
const usarBrasas = () =>
  useMemo(() => {
    const r = seed('brasas');
    return Array.from({length: 46}, (_, i) => {
      const u = r(i) * 2 - 1; // -1..1, más brasas en el centro
      return {
      x: CX + u * 175,
      y: SOLERA - 8 - r(i + 100) * 30 * (1 - u * u),
      rx: 6 + r(i + 200) * 10,
      ry: 4 + r(i + 300) * 5,
      tono: r(i + 400),
      fase: r(i + 500) * 10,
      };
    });
  }, []);

const PANES = [
  {x: 352, w: 168, h: 84, corte: 'cruz'},
  {x: 548, w: 186, h: 94, corte: 'hoja'},
  {x: 740, w: 164, h: 80, corte: 'curva'},
] as const;

/** Hogaza redonda vista de frente, con el corte de la corteza abierto. */
const Hogaza: React.FC<{x: number; w: number; h: number; corte: 'cruz' | 'hoja' | 'curva'; luz: number; i: number}> = ({x, w, h, corte, luz, i}) => {
  const y = PALA_Y;
  const l = x - w / 2;
  const cuerpo = `M ${l} ${y} C ${l} ${y - h * 0.82} ${l + w * 0.2} ${y - h} ${x} ${y - h} C ${x + w * 0.3} ${y - h} ${l + w} ${y - h * 0.8} ${l + w} ${y} Z`;
  const cortes: Record<typeof corte, string[]> = {
    cruz: [`M ${x - w * 0.26} ${y - h * 0.72} Q ${x} ${y - h * 0.86} ${x + w * 0.24} ${y - h * 0.6}`, `M ${x - w * 0.16} ${y - h * 0.5} Q ${x + w * 0.02} ${y - h * 0.95} ${x + w * 0.1} ${y - h * 0.9}`],
    hoja: [`M ${x - w * 0.3} ${y - h * 0.58} Q ${x} ${y - h * 1.0} ${x + w * 0.3} ${y - h * 0.66}`],
    curva: [`M ${x - w * 0.24} ${y - h * 0.8} Q ${x + w * 0.05} ${y - h * 0.62} ${x + w * 0.27} ${y - h * 0.74}`],
  };
  const r = seed(`harina-pan-${i}`);
  return (
    <g>
      <ellipse cx={x} cy={y + 4} rx={w * 0.5} ry={8} fill="#000" opacity={0.35} />
      <path d={cuerpo} fill="url(#corteza)" />
      {/* luz cálida del horno desde abajo */}
      <path d={cuerpo} fill="url(#luzPan)" opacity={0.55 + luz * 0.35} />
      {cortes[corte].map((d, k) => (
        <g key={k}>
          <path d={d} fill="none" stroke={P.cortezaOscura} strokeWidth={10} strokeLinecap="round" />
          <path d={d} fill="none" stroke={P.miga} strokeWidth={4.5} strokeLinecap="round" />
        </g>
      ))}
      {Array.from({length: 9}, (_, k) => (
        <circle key={k} cx={x - w * 0.3 + r(k) * w * 0.6} cy={y - h * (0.7 + r(k + 20) * 0.25)} r={1.2 + r(k + 40) * 1.6} fill={P.harina} opacity={0.55} />
      ))}
    </g>
  );
};

export const FondoForno: React.FC<Props> = ({paraTexto = false, viewBox = '0 0 1080 1920', conCamara = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const fachada = usarFachada();
  const dovelas = usarDovelas();
  const brasas = usarBrasas();

  // Brasas que respiran: ciclo de ~1,5 s con un poco de ruido para que no sea mecánico
  const respira = 0.5 + 0.5 * Math.sin((t / 1.5) * Math.PI * 2) * 0.8 + noise2D('respira', t * 0.9, 0) * 0.22;
  const luz = Math.max(0, Math.min(1, respira));

  // Push-in lento (1 → 1,08) que se acelera un poco al final, al salir hacia la escena 2
  const base = interpolate(frame, [0, 90], [1, 1.08], {easing: Easing.inOut(Easing.sin), extrapolateRight: 'clamp'});
  const extra = interpolate(frame, [70, 102], [0, 0.07], {easing: Easing.in(Easing.quad), extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const escala = conCamara ? base + extra : 1;

  // Harina flotando
  const harina = useMemo(() => {
    const r = seed('harina');
    return Array.from({length: 22}, (_, i) => ({x: 140 + r(i) * 800, y: 620 + r(i + 50) * 760, r: 1.3 + r(i + 100) * 1.9, o: 0.25 + r(i + 150) * 0.35}));
  }, []);

  return (
    <AbsoluteFill style={{backgroundColor: P.pared, overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${escala})`, transformOrigin: `${CX}px 1060px`, filter: paraTexto ? 'blur(4px)' : undefined}}>
        <svg width="100%" height="100%" viewBox={viewBox} preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="resplandorBoca" cx={CX} cy={SOLERA - 20} r={300} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor={color.lume} stopOpacity={0.75} />
              <stop offset="0.45" stopColor={P.brasaMedia} stopOpacity={0.28} />
              <stop offset="1" stopColor={P.boca} stopOpacity={0} />
            </radialGradient>
            <radialGradient id="luzFuera" cx={CX} cy={SOLERA} r={620} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor={color.lume} stopOpacity={0.32} />
              <stop offset="0.5" stopColor={color.lume} stopOpacity={0.1} />
              <stop offset="1" stopColor={color.lume} stopOpacity={0} />
            </radialGradient>
            <linearGradient id="corteza" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={P.cortezaClara} />
              <stop offset="0.6" stopColor={P.corteza} />
              <stop offset="1" stopColor={P.cortezaOscura} />
            </linearGradient>
            <linearGradient id="luzPan" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={color.lume} stopOpacity={0.3} />
              <stop offset="0.35" stopColor={color.lume} stopOpacity={0.05} />
              <stop offset="1" stopColor={color.lume} stopOpacity={0} />
            </linearGradient>
            <filter id="vaho" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={9} />
            </filter>
            <filter id="hilo" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation={5} />
            </filter>
            <linearGradient id="fadeVapor" x1="0" y1={PALA_Y - 90} x2="0" y2={PALA_Y - 420} gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#fff" stopOpacity={0} />
              <stop offset="0.15" stopColor="#fff" stopOpacity={1} />
              <stop offset="0.55" stopColor="#fff" stopOpacity={0.7} />
              <stop offset="1" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
            <mask id="desvanece" maskUnits="userSpaceOnUse" x={0} y={0} width={1080} height={1920}>
              <rect x={0} y={0} width={1080} height={1920} fill="url(#fadeVapor)" />
            </mask>
            <clipPath id="boca">
              <path d={`M ${CX - R_BOCA} ${SOLERA} L ${CX - R_BOCA} ${ARRANQUE} A ${R_BOCA} ${R_BOCA} 0 0 1 ${CX + R_BOCA} ${ARRANQUE} L ${CX + R_BOCA} ${SOLERA} Z`} />
            </clipPath>
          </defs>

          {/* pared y fachada de granito */}
          <rect x={0} y={0} width={1080} height={1920} fill={P.pared} />
          {fachada.map((b, i) => (
            <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.f} stroke={P.junta} strokeWidth={4} />
          ))}
          {dovelas.map((d, i) => (
            <path key={i} d={d.d} fill={d.f} stroke={P.junta} strokeWidth={4} strokeLinejoin="round" />
          ))}

          {/* hollín sobre el arco: el humo ha ennegrecido la piedra */}
          <ellipse cx={CX} cy={ARRANQUE - R_BOCA - 30} rx={250} ry={150} fill={P.hollin} opacity={0.3} filter="url(#vaho)" />

          {/* boca del horno con brasas */}
          <g clipPath="url(#boca)">
            <rect x={CX - R_BOCA} y={ARRANQUE - R_BOCA} width={R_BOCA * 2} height={SOLERA - ARRANQUE + R_BOCA} fill={P.boca} />
            <rect x={CX - R_BOCA} y={ARRANQUE - R_BOCA} width={R_BOCA * 2} height={SOLERA - ARRANQUE + R_BOCA} fill="url(#resplandorBoca)" opacity={0.55 + luz * 0.45} />
            {/* dos troncos de leña consumiéndose, con el borde encendido */}
            {[
              {x: CX - 150, y: SOLERA - 44, w: 230, a: -7},
              {x: CX - 40, y: SOLERA - 40, w: 220, a: 9},
            ].map((tr, i) => (
              <g key={`tr${i}`} transform={`rotate(${tr.a} ${tr.x + tr.w / 2} ${tr.y + 16})`}>
                <rect x={tr.x} y={tr.y} width={tr.w} height={32} rx={16} fill={P.tronco} />
                <rect x={tr.x + 10} y={tr.y + 24} width={tr.w - 20} height={6} rx={3} fill={color.lume} opacity={0.45 + luz * 0.5} />
                <ellipse cx={tr.x + tr.w - 6} cy={tr.y + 16} rx={9} ry={14} fill={P.brasaMedia} opacity={0.6 + luz * 0.4} />
              </g>
            ))}
            {brasas.map((b, i) => {
              const vivo = Math.max(0, Math.min(1, luz * 0.7 + noise2D('brasa', b.fase, t * 0.8) * 0.45 + b.tono * 0.2));
              const tono = b.tono > 0.66 ? color.lume : b.tono > 0.3 ? P.brasaMedia : P.brasaFria;
              return <ellipse key={i} cx={b.x} cy={b.y} rx={b.rx} ry={b.ry} fill={tono} opacity={0.55 + vivo * 0.45} />;
            })}
          </g>

          {/* solera de piedra y suelo */}
          <rect x={CX - R_BOCA - 70} y={SOLERA} width={(R_BOCA + 70) * 2} height={38} fill={P.solera} />
          <rect x={CX - R_BOCA - 70} y={SOLERA + 38} width={(R_BOCA + 70) * 2} height={8} fill={P.soleraSombra} />
          <rect x={0} y={1206} width={1080} height={714} fill={P.suelo} />

          {/* luz cálida que sale del horno */}
          <rect x={0} y={760} width={1080} height={900} fill="url(#luzFuera)" opacity={0.6 + luz * 0.4} style={{mixBlendMode: 'screen'}} />

          {/* pala de madera con mango largo */}
          <rect x={230} y={PALA_Y} width={630} height={30} rx={8} fill={P.madera} />
          <rect x={230} y={PALA_Y} width={630} height={6} rx={3} fill={P.maderaClara} />
          <rect x={230} y={PALA_Y + 25} width={630} height={5} fill={P.maderaSombra} />
          <rect x={846} y={PALA_Y + 6} width={300} height={15} rx={6} fill={P.madera} />
          <rect x={846} y={PALA_Y + 18} width={300} height={3} fill={P.maderaSombra} />

          {PANES.map((p, i) => (
            <Hogaza key={i} {...p} luz={luz} i={i} />
          ))}

          {/* vapor subiendo del pan: hilos ondulados que suben y se deshacen arriba */}
          <g filter="url(#hilo)" mask="url(#desvanece)">
            {PANES.map((p, c) =>
              [0, 1].map((k) => {
                const y0 = PALA_Y - p.h + 6;
                const alto = 300;
                const pts: string[] = [];
                for (let j = 0; j <= 24; j++) {
                  const q = j / 24;
                  const y = y0 - q * alto;
                  const amp = 6 + q * 26;
                  const x = p.x + (k - 0.5) * 26 + Math.sin(q * 7 - t * 2.2 + c * 1.7 + k) * amp + noise2D(`vapor-${c}-${k}`, q * 2, t * 0.4) * 10 * q;
                  pts.push(`${x.toFixed(1)} ${y.toFixed(1)}`);
                }
                return <path key={`${c}-${k}`} d={`M ${pts.join(' L ')}`} fill="none" stroke={P.harina} strokeWidth={14 + k * 6} strokeLinecap="round" opacity={0.2 + 0.06 * Math.sin(t * 1.3 + c)} />;
              }),
            )}
          </g>

          {/* harina en el aire */}
          {harina.map((h, i) => (
            <circle
              key={i}
              cx={h.x + noise2D('hx', i, t * 0.25) * 40}
              cy={h.y + noise2D('hy', i, t * 0.25) * 30 - t * 6}
              r={h.r}
              fill={P.harina}
              opacity={h.o}
            />
          ))}
        </svg>
      </AbsoluteFill>

      {paraTexto ? <AbsoluteFill style={{backgroundColor: 'rgba(0,0,0,.45)'}} /> : null}

      {/* grano sutil para que no parezca vector frío */}
      <AbsoluteFill style={{opacity: 0.05, pointerEvents: 'none'}}>
        <svg width="100%" height="100%">
          <filter id="grano">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#grano)" />
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
