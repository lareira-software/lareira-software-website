// Reel 01 · «El iceberg». Todos los tiempos en segundos.
// Para ajustar el reel a la voz grabada, cambia solo este archivo:
// los tramos de VOZ mandan sobre los subtítulos, el .srt, el guion y la bajada de la música.
// (Sin imports: lo usa también scripts/generar-textos.ts con Node.)

export const FPS = 30;
export const DURACION = 26;

export const ESCENAS = {
  gancho: {desde: 0, hasta: 3},
  loQueVes: {desde: 3, hasta: 7},
  iceberg: {desde: 7, hasta: 18},
  manos: {desde: 18, hasta: 23},
  cierre: {desde: 23, hasta: 26},
};

export const LOGO_DESDE = 3;

export const TEXTOS = {
  gancho: ['ChatGPT te hace una web en 5 minutos.', 'Esto es lo que *NO* te hace.'],
  ganchoSegundoGolpe: 1.35, // segundos dentro de la escena
  loQueVes: 'Esto es lo que ves de una web.',
  manos: ['Este vídeo lo ha hecho una IA.', 'Tu web no la dejaríamos solo en sus manos.'],
  manosSegundaFrase: 2.0,
  cierre: '¿Quieres ver el 90%?',
  cierrePie: 'Comenta *LAREIRA*',
};

// Escena 4: tomas reales, una detrás de otra (en assets/). `desde` = segundo del vídeo original
// donde empieza el corte; `dura` = cuánto se ve. Si falta enchufe o cerrar, manos ocupa su tiempo.
export const TOMAS_MANOS = [
  {archivo: 'enchufe.mp4', desde: 1.2, dura: 1.3}, // se enchufa el portátil
  {archivo: 'manos.mp4', desde: 10.0, dura: 2.6}, // manos tecleando con una web en pantalla
  {archivo: 'cerrar.mp4', desde: 1.2, dura: 1.1}, // se cierra la tapa → corte al cierre
];

export const CAPAS = [
  'Que cargue rápido en cualquier móvil',
  'Que el formulario llegue de verdad',
  'Que tus datos estén bien guardados (y sean tuyos)',
  'Que cada cliente vea solo lo suyo',
  'Que nadie pueda entrar probando contraseñas',
  'Que no se caiga el día que te va bien',
  'Que cada cambio se pueda deshacer',
  'Que sepamos cuándo falla',
  'Que haya copias si algo se rompe',
];

// Dentro de la escena del iceberg
export const ICEBERG = {
  bajadaDesde: 1.0, // empieza el paneo bajo el agua
  bajadaDura: 1.9,
  capasDesde: 2.6,
  cadenciaCapas: 0.8,
  noventaDesde: 9.9,
};

export const VOZ = [
  {desde: 3.0, hasta: 6.6, texto: 'Esto es lo que ves de una web.'},
  {desde: 7.0, hasta: 17.6, texto: 'Y esto es todo lo que hace que funcione: que cargue rápido, que nadie vea datos de otro, que no se caiga cuando te va bien, que haya copias si algo se rompe.'},
  {desde: 18.0, hasta: 22.7, texto: 'Este vídeo lo ha hecho una IA. Y nos encanta. Pero tu web no la dejaríamos solo en sus manos.'},
  {desde: 23.0, hasta: 25.8, texto: '¿Quieres ver el 90%? Comenta LAREIRA.'},
];

export type Cue = {desde: number; hasta: number; texto: string};

const MAX_PALABRAS = 6;

// Palabras que no deben quedarse colgando al final de una línea de subtítulo
const DEBILES = new Set(['y', 'o', 'que', 'lo', 'la', 'el', 'los', 'las', 'un', 'una', 'de', 'en', 'si', 'es', 'no', 'se', 'te', 'tu', 'sus', 'a', 'por', 'con', 'pero', 'ha', 'has', 'he', 'nos']);

/** Corta una frase larga en el punto más equilibrado que no deje una palabra débil al final. */
const cortar = (p: string[]): string[][] => {
  if (p.length <= MAX_PALABRAS) return [p];
  let mejor = -1;
  let nota = Infinity;
  for (let k = 1; k < p.length; k++) {
    const izq = Math.min(k, MAX_PALABRAS);
    const desequilibrio = Math.abs(p.length / 2 - k);
    const debil = DEBILES.has(p[k - 1].toLowerCase()) ? 3 : 0;
    const exceso = k > MAX_PALABRAS ? 100 : 0;
    const n = desequilibrio + debil + exceso + (izq < k ? 100 : 0);
    if (n < nota) {
      nota = n;
      mejor = k;
    }
  }
  return [p.slice(0, mejor), ...cortar(p.slice(mejor))];
};

/** Parte un texto en frases de 6 palabras como mucho, cortando por la puntuación cuando se puede. */
export const trocear = (texto: string): string[] => {
  const frases = texto.split(/(?<=[.,:;?!])\s+/).filter(Boolean);
  const trozos = frases.flatMap((f) => cortar(f.split(/\s+/)).map((t) => t.join(' ')));
  // Une trozos muy cortos (1-2 palabras) con el siguiente si caben en 6
  const unidos: string[] = [];
  for (const t of trozos) {
    const ult = unidos[unidos.length - 1];
    if (ult && ult.split(' ').length <= 2 && (ult + ' ' + t).split(' ').length <= MAX_PALABRAS) unidos[unidos.length - 1] = ult + ' ' + t;
    else unidos.push(t);
  }
  return unidos;
};

/** Subtítulos: cada tramo de voz se reparte entre sus frases según el número de palabras. */
export const subtitulos = (): Cue[] => {
  const cues: Cue[] = [];
  for (const tramo of VOZ) {
    const trozos = trocear(tramo.texto);
    const pesos = trozos.map((t) => t.split(' ').length + 0.6);
    const total = pesos.reduce((a, b) => a + b, 0);
    let t = tramo.desde;
    trozos.forEach((texto, i) => {
      const d = ((tramo.hasta - tramo.desde) * pesos[i]) / total;
      cues.push({desde: +t.toFixed(3), hasta: +(t + d).toFixed(3), texto});
      t += d;
    });
  }
  return cues;
};
