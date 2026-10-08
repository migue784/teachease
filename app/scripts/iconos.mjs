// Genera los íconos de la PWA a partir del isotipo oficial (marca/assets/logo)
// y copia los logos que usa la app.
// Uso: npm run iconos   (usa Playwright, instalado en la raíz del repo)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const aqui = path.dirname(fileURLToPath(import.meta.url));
const LOGOS = path.resolve(aqui, '../../marca/assets/logo');
const PUBLICO = path.resolve(aqui, '../public');
const ICONOS_DIR = path.join(PUBLICO, 'icons');
const MARCA_DIR = path.join(PUBLICO, 'marca');

const robot = fs
  .readFileSync(path.join(LOGOS, 'isotipo-compacto-negativo.svg'), 'utf8')
  .replace(/width="[^"]+" height="[^"]+"/, 'width="100%" height="100%"');
const fondo = 'linear-gradient(135deg,#3FBFB0 0%,#3E5BE8 55%,#5B34EE 100%)';

// [archivo, lado en px, parte del lado que ocupa el robot]
// Las "maskable" (Android) necesitan más margen porque el sistema recorta el borde.
const ICONOS = [
  ['icon-192.png', 192, 0.6],
  ['icon-512.png', 512, 0.6],
  ['maskable-512.png', 512, 0.46],
  ['apple-touch-icon.png', 180, 0.58],
  ['favicon-32.png', 32, 0.8],
];

const ejecutable = '/opt/pw-browsers/chromium';
const navegador = await chromium.launch(fs.existsSync(ejecutable) ? { executablePath: ejecutable } : {});
const pagina = await navegador.newPage();
fs.mkdirSync(ICONOS_DIR, { recursive: true });
fs.mkdirSync(MARCA_DIR, { recursive: true });

for (const [nombre, lado, escala] of ICONOS) {
  await pagina.setViewportSize({ width: lado, height: lado });
  await pagina.setContent(
    `<html><body style="margin:0"><div style="width:${lado}px;height:${lado}px;background:${fondo};display:grid;place-items:center">` +
      `<div style="width:${lado * escala}px;height:${lado * escala}px;translate:0 ${lado * 0.015}px">${robot}</div></div></body></html>`
  );
  await pagina.screenshot({ path: path.join(ICONOS_DIR, nombre) });
}
await navegador.close();

fs.copyFileSync(path.join(LOGOS, 'isotipo-compacto.svg'), path.join(PUBLICO, 'favicon.svg'));
for (const f of [
  'logo-horizontal-sin-eslogan.svg',
  'logo-horizontal-sin-eslogan-negativo.svg',
  'logo-vertical.svg',
  'logo-vertical-negativo.svg',
  'isotipo.svg',
  'isotipo-negativo.svg',
  'isotipo-compacto.svg',
  'isotipo-compacto-negativo.svg',
]) {
  fs.copyFileSync(path.join(LOGOS, f), path.join(MARCA_DIR, f));
}
console.log('Íconos y logos listos en app/public');
