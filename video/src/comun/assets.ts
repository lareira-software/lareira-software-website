import {getStaticFiles, staticFile} from 'remotion';

/** Devuelve la URL del asset si existe en /video/assets, o null para usar el sustituto. */
export const asset = (nombre: string): string | null => {
  const existe = getStaticFiles().some((f) => f.name === nombre);
  return existe ? staticFile(nombre) : null;
};
