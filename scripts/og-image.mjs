// Genera public/og-image.png, l'anteprima che compare quando il link del sito viene
// incollato su LinkedIn, in una chat o in una mail. Si rilancia a mano quando cambiano
// foto o testi: `npm run og-image`.
//
// Il PNG è versionato invece di essere generato in build: il rendering del testo dipende
// dai font installati, e l'immagine pubblicata deve essere quella guardata, non quella che
// esce dalla macchina della pipeline.

import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;
const PHOTO = 340;
const BORDER = 8;
const PHOTO_X = 780;
const PHOTO_Y = (HEIGHT - PHOTO) / 2;

// Testi neutri rispetto alla lingua: la stessa immagine serve le pagine italiane e inglesi.
const background = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0f1c2e"/>
      <stop offset="1" stop-color="#1c4a78"/>
    </linearGradient>
    <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="11" cy="11" r="1.2" fill="#ffffff" fill-opacity="0.09"/>
    </pattern>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#dots)"/>
  <g font-family="Segoe UI, Roboto, Helvetica, Arial, sans-serif">
    <text x="80" y="220" fill="#9fc2ee" font-size="24" font-weight="600" letter-spacing="4">FLUTTER · DART · ANDROID · KOTLIN</text>
    <text x="76" y="320" fill="#e8eef7" font-size="92" font-weight="700">Mirco Zanzaro</text>
    <text x="80" y="385" fill="#b4c6dd" font-size="40">Mobile developer</text>
    <text x="80" y="500" fill="#9fc2ee" font-size="26" font-family="Consolas, DejaVu Sans Mono, monospace">zanzaro-mirco.github.io</text>
  </g>
  <circle cx="${PHOTO_X + PHOTO / 2}" cy="${PHOTO_Y + PHOTO / 2}" r="${PHOTO / 2 + BORDER}" fill="#e8eef7"/>
</svg>`;

const circleMask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${PHOTO}" height="${PHOTO}"><circle cx="${PHOTO / 2}" cy="${PHOTO / 2}" r="${PHOTO / 2}"/></svg>`,
);

const portrait = await sharp('src/assets/mirco-zanzaro.png')
  .resize(PHOTO, PHOTO, { fit: 'cover' })
  .composite([{ input: circleMask, blend: 'dest-in' }])
  .png()
  .toBuffer();

await sharp(Buffer.from(background))
  .composite([{ input: portrait, left: PHOTO_X, top: PHOTO_Y }])
  .png({ compressionLevel: 9, palette: false })
  .toFile('public/og-image.png');

console.log(`public/og-image.png ${WIDTH}×${HEIGHT}`);
