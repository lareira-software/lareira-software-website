import React from 'react';
import {ZonaSegura} from './zonaSegura';

/** Bloque de texto centrado en la zona segura. El gancho y el cierre lo comparten para que el bucle encaje. */
export const TextoCentrado: React.FC<{children: React.ReactNode}> = ({children}) => (
  <ZonaSegura style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 24px', boxSizing: 'border-box'}}>
    {children}
  </ZonaSegura>
);
