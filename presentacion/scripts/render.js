// Exporta video.html a MP4 cuadro a cuadro (1920×1080).
//   node presentacion/scripts/render.js                  → salida/TeachEase-video.mp4
//   node presentacion/scripts/render.js --ensayo         → salida/TeachEase-ensayo.mp4 (con teleprompter)
//   node presentacion/scripts/render.js --muestras 3,15  → PNG de esos segundos, para revisar
//   --fps 30 · --desde 40 · --hasta 70
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { chromium } = require('playwright');

const args = process.argv.slice(2);
const opcion = (n, d) => {
  const i = args.indexOf('--' + n);
  return i >= 0 ? args[i + 1] : d;
};
const ensayo = args.includes('--ensayo');
const fps = Number(opcion('fps', 30));
const muestras = opcion('muestras', null);

const RAIZ = path.resolve(__dirname, '..');
const SALIDA = path.join(RAIZ, 'salida');
fs.mkdirSync(SALIDA, { recursive: true });

(async () => {
  const ejec = '/opt/pw-browsers/chromium';
  const b = await chromium.launch(fs.existsSync(ejec) ? { executablePath: ejec } : {});
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto('file://' + path.join(RAIZ, 'video.html') + '?render' + (ensayo ? '&ensayo' : ''));
  await p.evaluate(() => document.fonts.ready);
  // Precarga todas las imágenes antes de capturar
  await p.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => (i.onload = i.onerror = r))))));
  const duracion = await p.evaluate(() => window.DURACION);

  if (muestras) {
    for (const t of muestras.split(',').map(Number)) {
      await p.evaluate((t) => window.irA(t), t);
      await p.screenshot({ path: path.join(SALIDA, `muestra-${String(t).padStart(5, '0')}.png`) });
    }
    await b.close();
    console.log('Muestras en', SALIDA);
    return;
  }

  const desde = Number(opcion('desde', 0));
  const hasta = Number(opcion('hasta', duracion));
  const nombre = ensayo ? 'TeachEase-ensayo.mp4' : 'TeachEase-video.mp4';
  const destino = path.join(SALIDA, nombre);
  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', destino,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });

  const total = Math.round((hasta - desde) * fps);
  const t0 = Date.now();
  for (let f = 0; f < total; f++) {
    const t = desde + f / fps;
    await p.evaluate((t) => window.irA(t), t);
    const img = await p.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(img)) await new Promise((r) => ff.stdin.once('drain', r));
    if (f % (fps * 10) === 0) console.log(`${Math.round((f / total) * 100)}% · segundo ${Math.round(t)} · ${Math.round((Date.now() - t0) / 1000)} s`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on('close', r));
  await b.close();
  console.log('Listo:', destino);
})();
