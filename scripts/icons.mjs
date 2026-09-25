// Generates PWA PNG icons from public/icons/icon.svg (uses sharp, bundled with Next.js)
import sharp from 'sharp';
import fs from 'fs';
const svg = fs.readFileSync(new URL('../public/icons/icon.svg', import.meta.url));
for (const n of [192, 512]) await sharp(svg, { density: 300 }).resize(n, n).png().toFile(new URL(`../public/icons/icon-${n}.png`, import.meta.url).pathname);
console.log('icons ok');
