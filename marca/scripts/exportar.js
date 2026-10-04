// Exporta los logos a PNG y el manual a PDF.
// Uso: npm run png   |   npm run pdf
// En la nube de Claude Code Chromium está en /opt/pw-browsers/chromium;
// en otro equipo basta con `npx playwright install chromium`.

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const RAIZ = path.resolve(__dirname, '..');
const LOGOS = path.join(RAIZ, 'assets', 'logo');
const PNG = path.join(LOGOS, 'png');

async function navegador() {
  const ruta = '/opt/pw-browsers/chromium';
  return chromium.launch(fs.existsSync(ruta) ? { executablePath: ruta } : {});
}

// Ancho en píxeles de cada PNG (alto proporcional, fondo transparente)
const ANCHOS = {
  'logo-vertical': 1600,
  'logo-vertical-sin-eslogan': 1600,
  'logo-horizontal': 2000,
  'logo-horizontal-sin-eslogan': 2000,
  'logotipo': 1600,
  'isotipo': 1024,
  'isotipo-compacto': 1024,
};

async function png() {
  fs.mkdirSync(PNG, { recursive: true });
  const b = await navegador();
  const p = await b.newPage();
  const svgs = fs.readdirSync(LOGOS).filter((n) => n.endsWith('.svg'));
  for (const n of svgs) {
    const base = n.replace('.svg', '');
    const pieza = base.replace(/-(negativo|azul|blanco|negro)$/, '');
    const ancho = ANCHOS[pieza] || 1024;
    const svg = fs.readFileSync(path.join(LOGOS, n), 'utf8');
    const [, , w, h] = svg.match(/viewBox="([^"]+)"/)[1].split(' ').map(Number);
    const alto = Math.round((ancho * h) / w);
    await p.setViewportSize({ width: ancho, height: alto });
    await p.setContent(
      `<html><body style="margin:0;background:transparent">${svg.replace(/width="[^"]+" height="[^"]+"/, `width="${ancho}" height="${alto}"`)}</body></html>`
    );
    await p.screenshot({ path: path.join(PNG, base + '.png'), omitBackground: true, clip: { x: 0, y: 0, width: ancho, height: alto } });
  }
  // Favicons
  for (const t of [16, 32, 180, 512]) {
    const svg = fs.readFileSync(path.join(LOGOS, t >= 180 ? 'app-icono.svg' : 'isotipo-compacto.svg'), 'utf8');
    await p.setViewportSize({ width: t, height: t });
    await p.setContent(`<html><body style="margin:0;display:flex;align-items:center;justify-content:center;width:${t}px;height:${t}px">${svg.replace(/width="[^"]+" height="[^"]+"/, `width="${t}" height="${t}" preserveAspectRatio="xMidYMid meet"`)}</body></html>`);
    await p.screenshot({ path: path.join(PNG, `favicon-${t}.png`), omitBackground: true });
  }
  await b.close();
  console.log(`PNG exportados en ${path.relative(process.cwd(), PNG)}`);
}

async function pdf() {
  const b = await navegador();
  const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
  await p.goto('file://' + path.join(RAIZ, 'index.html'));
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(300);
  const salida = path.join(RAIZ, 'TeachEase-Manual-de-Marca.pdf');
  await p.pdf({ path: salida, width: '1280px', height: '800px', printBackground: true, preferCSSPageSize: true });
  await b.close();
  console.log(`PDF en ${path.relative(process.cwd(), salida)}`);
}

const tarea = process.argv[2];
({ png, pdf }[tarea] || (() => console.log('Uso: node exportar.js png|pdf')))().catch((e) => {
  console.error(e);
  process.exit(1);
});
