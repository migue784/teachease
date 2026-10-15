// Genera presentacion/TeachEase-Guion.pdf a partir de presentacion/guion.js
// Uso: npm run guion:pdf
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const RAIZ = path.resolve(__dirname, '..');
const window = {};
new Function('window', fs.readFileSync(path.join(RAIZ, 'guion.js'), 'utf8'))(window);
const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');
const fuentes = path.resolve(RAIZ, '../marca/assets/fuentes');
const logo = path.resolve(RAIZ, '../marca/assets/logo/logo-horizontal.svg');

let seccion = '';
const escenas = window.GUION.map((e, i) => {
  let cab = '';
  if (e.seccion !== seccion) {
    seccion = e.seccion;
    cab = `<h2>${esc(seccion)}</h2>`;
  }
  const palabras = e.voz.split(/\s+/).length;
  return `${cab}
  <article class="escena">
    <div class="tiempo"><b>${fmt(e.ini)}</b><span>${fmt(e.fin)}</span></div>
    <div class="cuerpo">
      <div class="fila"><h3>${i + 1}. ${esc(e.titulo)}</h3><span class="lee">Lee: ______________</span></div>
      <p class="pantalla"><span>En pantalla</span> ${esc(e.pantalla)}</p>
      <p class="voz">${esc(e.voz)}</p>
      <p class="meta">${palabras} palabras · ${e.fin - e.ini} segundos${e.entra ? ` · empezar en ${fmt(e.ini + e.entra)}` : ''}</p>
    </div>
  </article>`;
}).join('\n');

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><style>
@font-face{font-family:Poppins;font-weight:400;src:url(file://${fuentes}/Poppins-Regular.ttf)}
@font-face{font-family:Poppins;font-weight:500;src:url(file://${fuentes}/Poppins-Medium.ttf)}
@font-face{font-family:Poppins;font-weight:600;src:url(file://${fuentes}/Poppins-SemiBold.ttf)}
@page{size:letter;margin:16mm 16mm 18mm}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Poppins,Arial,sans-serif;color:#0C1A5E;font-size:11pt;line-height:1.5}
header{display:flex;justify-content:space-between;align-items:center;padding-bottom:14px;border-bottom:2px solid #E3E6F2;margin-bottom:18px}
header img{height:34px}
header p{font-size:9.5pt;color:#5C6386;text-align:right}
h1{font-size:24pt;font-weight:600;letter-spacing:-.02em;line-height:1.15}
.sub{color:#5C6386;margin-top:4px}
.datos{display:flex;gap:10px;margin:16px 0 18px}
.datos div{background:#F3F5FB;border-radius:10px;padding:10px 14px;flex:1}
.datos b{display:block;font-size:15pt;font-weight:600}
.datos span{font-size:9pt;color:#5C6386}
.como{background:#0C1A5E;color:#fff;border-radius:14px;padding:16px 20px;margin-bottom:8px}
.como h3{font-size:11.5pt;font-weight:600;color:#5FD8C8;margin-bottom:6px}
.como ol{padding-left:18px;font-size:10pt;color:#E3E6F7}
.como li{margin:3px 0}
h2{font-size:10pt;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#5B34EE;margin:20px 0 8px;break-after:avoid}
.escena{display:flex;gap:16px;padding:14px 0;border-top:1px solid #E3E6F2;break-inside:avoid}
.tiempo{width:62px;flex:none;text-align:center;background:#F3F5FB;border-radius:10px;padding:8px 4px;height:fit-content}
.tiempo b{display:block;font-size:13pt;font-weight:600}
.tiempo span{font-size:9pt;color:#5C6386}
.cuerpo{flex:1}
.fila{display:flex;justify-content:space-between;align-items:baseline;gap:10px}
h3{font-size:12pt;font-weight:600}
.lee{font-size:9pt;color:#9AA0BF;white-space:nowrap}
.pantalla{font-size:9.5pt;color:#5C6386;margin:4px 0 8px}
.pantalla span{font-weight:600;color:#3E5BE8;margin-right:4px}
.voz{font-size:13pt;line-height:1.55;font-weight:500;border-left:4px solid #3FBFB0;padding:2px 0 2px 14px}
.meta{font-size:8.5pt;color:#9AA0BF;margin-top:6px}
.equipo{margin-top:28px;break-inside:avoid}
.equipo p{font-size:10.5pt}
</style></head><body>
<header><img src="file://${logo}" alt="TeachEase"><p>Video de presentación<br>Guion para la narración</p></header>
<h1>Guion del video de TeachEase</h1>
<p class="sub">Lo que se dice en cada escena, con sus tiempos. La voz debe caber dentro del tiempo de cada escena.</p>
<div class="datos">
  <div><b>${fmt(window.DURACION)}</b><span>duración total</span></div>
  <div><b>${window.GUION.length}</b><span>escenas</span></div>
  <div><b>${window.GUION.reduce((n, e) => n + e.voz.split(/\s+/).length, 0)}</b><span>palabras a leer</span></div>
</div>
<section class="como">
  <h3>Cómo grabar</h3>
  <ol>
    <li>Reproduzcan <b>TeachEase-ensayo.mp4</b> con audífonos: muestra este mismo texto abajo, como teleprompter, y un reloj.</li>
    <li>Graben la voz con el celular leyendo cada texto <b>cuando aparezca</b>. Así queda sincronizada sola con el video.</li>
    <li>En CapCut (o el editor que usen) pongan <b>TeachEase-video.mp4</b> y encima el audio desde 0:00. Si quieren, música suave a bajo volumen.</li>
    <li>Lugar sin eco, celular a un palmo de la boca, hablar con calma y sonriendo. Pueden repartirse las escenas: escriban arriba de cada una quién lee.</li>
  </ol>
</section>
${escenas}
<section class="equipo"><h2>Equipo</h2><p>Erica Isaza Osorio · Lida Andrea Araque · María José Peña · Paola Duque · Paola Grajales · Valentina López · Valeria Suárez Gutiérrez</p><p class="meta">Institución Universitaria Marco Fidel Suárez</p></section>
</body></html>`;

(async () => {
  const tmp = path.join(RAIZ, 'salida', '_guion.html');
  fs.mkdirSync(path.dirname(tmp), { recursive: true });
  fs.writeFileSync(tmp, html);
  const ejec = '/opt/pw-browsers/chromium';
  const b = await chromium.launch(fs.existsSync(ejec) ? { executablePath: ejec } : {});
  const p = await b.newPage();
  await p.goto('file://' + tmp);
  await p.evaluate(() => document.fonts.ready);
  const destino = path.join(RAIZ, 'TeachEase-Guion.pdf');
  await p.pdf({
    path: destino, format: 'Letter', printBackground: true, preferCSSPageSize: true,
    displayHeaderFooter: true, headerTemplate: '<span></span>',
    footerTemplate: '<div style="width:100%;font-size:8px;color:#9AA0BF;text-align:center;font-family:Arial">TeachEase · tu apoyo silencioso en el aula</div>',
  });
  await b.close();
  fs.unlinkSync(tmp);
  console.log('PDF:', destino);
})();
