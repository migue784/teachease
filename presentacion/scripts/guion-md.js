// Genera presentacion/GUION.md a partir de presentacion/guion.js
const fs = require('fs');
const path = require('path');

const RAIZ = path.resolve(__dirname, '..');
const window = {};
new Function('window', fs.readFileSync(path.join(RAIZ, 'guion.js'), 'utf8'))(window);
const fmt = (t) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const palabras = (s) => s.split(/\s+/).filter(Boolean).length;

let md = `# Guion del video de TeachEase

Duración total: **${fmt(window.DURACION)}**. Cada escena tiene su tiempo exacto: la voz debe caber dentro de ese tiempo.

## Cómo grabar

1. Abran **salida/TeachEase-ensayo.mp4**: es el mismo video con este guion abajo, como teleprompter, y un reloj.
2. Pónganse audífonos, reproduzcan el video de ensayo y graben la voz con el celular (o el computador) leyendo el texto **cuando aparezca**. Así la voz queda sincronizada sola.
3. En CapCut (o el editor que usen) pongan **salida/TeachEase-video.mp4** (el limpio) y encima el audio grabado, empezando en 0:00. Si quieren, música suave a bajo volumen.
4. Si prefieren, envíenme el audio y yo lo uno al video.

Consejos: lugar sin eco (un cuarto con ropa o cortinas sirve), celular a un palmo de la boca, hablar con calma y sonriendo — se nota en la voz. Pueden repartirse las escenas entre varias personas del equipo.

---
`;

let seccion = '';
for (const e of window.GUION) {
  if (e.seccion !== seccion) {
    seccion = e.seccion;
    md += `\n## ${seccion}\n`;
  }
  const dur = e.fin - e.ini;
  md += `\n### ${fmt(e.ini)} – ${fmt(e.fin)} · ${e.titulo}\n\n`;
  md += `**En pantalla:** ${e.pantalla}\n\n`;
  md += `**Voz** (${palabras(e.voz)} palabras, ${dur} s${e.entra ? `, empezar en ${fmt(e.ini + e.entra)}` : ''}):\n\n> ${e.voz}\n`;
}
md += '\n---\nGenerado desde `presentacion/guion.js`. Para cambiar un texto, cámbienlo allí y vuelvan a exportar.\n';
fs.writeFileSync(path.join(RAIZ, 'GUION.md'), md);
console.log('GUION.md listo');
