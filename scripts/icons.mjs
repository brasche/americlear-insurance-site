/**
 * Generates favicon.svg, favicon.ico, apple-touch-icon.png, and og-default.png
 * from the original wordmark SVG using sharp. Run: npm run icons
 */
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const out = path.resolve('public');
await mkdir(out, { recursive: true });

const NAVY = '#0B1A33';
const NAVY_DEEP = '#091229';
const IVORY = '#F6F3EC';
const GOLD = '#D6B96B';
const SUB = '#C9C4B6';

const monogram = (bg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  ${bg ? `<rect width="64" height="64" rx="10" fill="${NAVY}"/>` : ''}
  <path d="M32 6 L54 14 V34 C54 47 44 56 32 61 C20 56 10 47 10 34 V14 Z" fill="none" stroke="${GOLD}" stroke-width="3" stroke-linejoin="round"/>
  <text x="32" y="42" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="22" font-weight="700" fill="${IVORY}" letter-spacing="1">AC</text>
</svg>`;

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${NAVY}"/><stop offset="1" stop-color="${NAVY_DEEP}"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#g)"/>
  <rect x="40" y="40" width="1120" height="550" fill="none" stroke="${GOLD}" stroke-opacity="0.35" stroke-width="2"/>
  <g transform="translate(600 150)">
    <path d="M0 0 L52 18 V66 C52 98 28 120 0 132 C-28 120 -52 98 -52 66 V18 Z" fill="none" stroke="${GOLD}" stroke-width="5" stroke-linejoin="round"/>
    <text x="0" y="86" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="52" font-weight="700" fill="${IVORY}" letter-spacing="2">AC</text>
  </g>
  <rect x="536" y="330" width="128" height="2" fill="${GOLD}"/>
  <text x="600" y="405" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="700" fill="${IVORY}" letter-spacing="8">AMERICLEAR</text>
  <text x="600" y="452" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="${SUB}" letter-spacing="10">INSURANCE AGENCY</text>
  <text x="600" y="540" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="${IVORY}" fill-opacity="0.8">Coverage decisions, explained clearly.</text>
</svg>`;

await writeFile(path.join(out, 'favicon.svg'), monogram(true));

const png32 = await sharp(Buffer.from(monogram(true))).resize(32, 32).png().toBuffer();
const png48 = await sharp(Buffer.from(monogram(true))).resize(48, 48).png().toBuffer();
await writeFile(path.join(out, 'favicon.ico'), await pngToIco([png32, png48]));

await sharp(Buffer.from(monogram(true))).resize(180, 180).png().toFile(path.join(out, 'apple-touch-icon.png'));
await sharp(Buffer.from(og)).png().toFile(path.join(out, 'og-default.png'));

console.log('icons written to public/: favicon.svg favicon.ico apple-touch-icon.png og-default.png');
