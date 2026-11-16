import {Config} from '@remotion/cli/config';

// Los vídeos y audios de cada reel (manos.mp4, voz.mp3...) van en /video/assets.
Config.setPublicDir('./assets');
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);
Config.setCodec('h264');
Config.setCrf(18);
Config.setPixelFormat('yuv420p');

// El escritorio está sincronizado con iCloud y el Chrome que descarga Remotion se rompe ahí.
// Si existe Google Chrome en el Mac, se usa ese para renderizar.
import {existsSync} from 'node:fs';
const CHROME_MAC = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
if (existsSync(CHROME_MAC)) Config.setBrowserExecutable(CHROME_MAC);
