// Tokens de los reels de Lareira.
// Heredan del sistema «Tablilla» (DESIGN.md): Archivo, pesos y anchuras, --lume,
// --tinta y las curvas de movimiento. Añaden la paleta de vídeo: gris piedra
// (granito) y verde mar atlántico. El naranja solo como acento.

export const VIDEO = {ancho: 1080, alto: 1920, fps: 30} as const;

export const color = {
  piedra: '#2F3331', // fondo: granito oscuro
  piedraLinea: '#4A504D', // rayas sobre piedra
  mar: '#0B3634', // verde mar atlántico (agua cerca de la superficie)
  abismo: '#051715', // agua profunda
  hielo: '#154A46', // cuerpo del iceberg bajo el agua (naranja 3,2:1 en 220px; blanco 9:1)
  hieloBorde: '#6FA39B', // contorno del iceberg y rayas de tablilla bajo el agua
  lineaAgua: '#9CC3BC',
  espuma: '#F1F3F1', // texto principal sobre fondos oscuros
  espuma2: '#B9C4C0', // texto secundario (7,9:1 sobre piedra)
  lume: '#FF5A1F', // acento de marca: palabras clave y punto del logo
  tinta: '#0D1330',
} as const;

export const fuente = {
  familia: '"Archivo", system-ui, sans-serif',
  // Titulares y números de tablilla (DESIGN.md §3)
  titular: {fontWeight: 750, fontStretch: '72%', letterSpacing: '-0.02em', lineHeight: 1.0},
  numero: {fontWeight: 800, fontStretch: '66%', fontVariantNumeric: 'tabular-nums', lineHeight: 0.9},
  texto: {fontWeight: 500, fontStretch: '85%', letterSpacing: '-0.005em', lineHeight: 1.15},
  subtitulo: {fontWeight: 700, fontStretch: '85%', lineHeight: 1.15},
} as const;

// Tamaños en píxeles de vídeo 1080x1920
export const tam = {gancho: 128, titular: 84, capa: 42, subtitulo: 50, etiqueta: 40, logo: 46, enorme: 220} as const;

// Espacio en base 8 (DESIGN.md: --e-1 … --e-7, aquí en px de vídeo)
export const e = {1: 8, 2: 16, 3: 24, 4: 32, 5: 48, 6: 72, 7: 112} as const;
