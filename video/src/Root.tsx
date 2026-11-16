import React from 'react';
import {Composition} from 'remotion';
import {cargarFuentes} from './comun/Fuentes';
import {VIDEO} from './comun/tokens';
import {Portada} from './reel-01/Portada';
import {DURACION_FRAMES, Reel01} from './reel-01/Reel01';

cargarFuentes();

// Cada reel nuevo: una carpeta src/reel-NN/ con guion.ts, escenas/ y su composición aquí.
export const Root: React.FC = () => (
  <>
    <Composition id="Reel01Iceberg" component={Reel01} durationInFrames={DURACION_FRAMES} fps={VIDEO.fps} width={VIDEO.ancho} height={VIDEO.alto} defaultProps={{verZonaSegura: false}} />
    <Composition id="Reel01Portada" component={Portada} durationInFrames={1} fps={VIDEO.fps} width={VIDEO.ancho} height={VIDEO.alto} />
  </>
);
