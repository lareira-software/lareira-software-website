import React from 'react';
import {Composition} from 'remotion';
import {cargarFuentes} from './comun/Fuentes';
import {VIDEO} from './comun/tokens';
import {Portada} from './reel-01/Portada';
import {FondoForno} from './reel-01/FondoForno';
import {DURACION_FRAMES, Reel01} from './reel-01/Reel01';

cargarFuentes();

// Cada reel nuevo: una carpeta src/reel-NN/ con guion.ts, escenas/ y su composición aquí.
export const Root: React.FC = () => (
  <>
    <Composition id="Reel01Iceberg" component={Reel01} durationInFrames={DURACION_FRAMES} fps={VIDEO.fps} width={VIDEO.ancho} height={VIDEO.alto} defaultProps={{verZonaSegura: false}} />
    {/* Foto del horno sin texto para la web de ejemplo del móvil (npm run foto → assets/o-forno.jpg) */}
    <Composition id="Reel01FotoForno" component={() => <FondoForno conCamara={false} viewBox="100 700 880 740" />} durationInFrames={1} fps={VIDEO.fps} width={1200} height={1010} />
    <Composition id="Reel01HornoLimpio" component={() => <FondoForno />} durationInFrames={90} fps={VIDEO.fps} width={VIDEO.ancho} height={VIDEO.alto} />
    <Composition id="Reel01Portada" component={Portada} durationInFrames={1} fps={VIDEO.fps} width={VIDEO.ancho} height={VIDEO.alto} />
  </>
);
