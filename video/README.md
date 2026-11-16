# Reels de Lareira (Remotion)

Vídeos hechos con código. Esta carpeta no se publica en la web.

## Usar

```bash
cd video
npm install          # solo la primera vez
npm run studio       # abre el Remotion Studio para revisar y ajustar
npm run render       # genera el MP4, la portada, el .srt y el guion de la voz
npm run capturas     # capturas de los segundos 1, 5, 12, 20 y 25 en out/capturas/
```

Para renderizar se usa el Google Chrome del Mac (ver `remotion.config.ts`): el Chrome que descarga Remotion se rompe en una carpeta sincronizada con iCloud.

## Estructura

- `src/comun/`: piezas para todos los reels
  - `tokens.ts`: colores (gris piedra, verde mar, naranja de acento), tipografía Archivo y espacios, sacados de `DESIGN.md`
  - `zonaSegura.tsx`: zona segura de Instagram (250 px arriba, 380 abajo, 60 a los lados) y una guía para verla en el Studio (prop `verZonaSegura`)
  - `TextoPalabras.tsx`: texto que entra palabra a palabra; las palabras entre `*asteriscos*` salen en naranja
  - `TextoCentrado.tsx`, `Logo.tsx`, `Subtitulos.tsx`, `BandaSonora.tsx` (voz y música con bajada), `Movil.tsx`, `Fondo.tsx`, `assets.ts`
- `src/reel-01/`: el reel 1, «El iceberg»
  - `guion.ts`: **todos los tiempos y textos**. Para ajustar el reel a la voz grabada, cambia solo este archivo
  - `escenas/`: un componente por escena
  - `Portada.tsx`: la portada en PNG
- `assets/`: vídeos y audios (ver `assets/LEEME.md`). No se suben a GitHub
- `out/`: lo que se genera. En GitHub solo se guardan el guion y el `.srt`

## Un reel nuevo

1. Copia `src/reel-01/` como `src/reel-02/` y cambia `guion.ts` y las escenas.
2. Añade su `<Composition>` en `src/Root.tsx`.
3. Añade sus comandos de render en `package.json`.
