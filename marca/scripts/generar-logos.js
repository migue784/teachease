// Genera todas las piezas del logo de TeachEase en SVG vectorial.
// El texto se convierte a trazos (Poppins) para que el logo se vea igual
// en cualquier equipo, tenga o no la fuente instalada.
//
// Uso: npm run logos

const fs = require('fs');
const path = require('path');
const opentype = require('opentype.js');

const RAIZ = path.resolve(__dirname, '..');
const SALIDA = path.join(RAIZ, 'assets', 'logo');
const FUENTES = path.join(RAIZ, 'assets', 'fuentes');

// Paleta oficial (ver marca/tokens/tokens.json)
const C = {
  azulAula: '#0C1A5E',
  turquesa: '#3FBFB0',
  azulIdea: '#3E5BE8',
  violeta: '#5B34EE',
  lavanda: '#A9AEE3',
  nube: '#F3F5FB',
  blanco: '#FFFFFF',
  // Variantes claras solo para fondos oscuros
  turquesaClaro: '#5FD8C8',
  violetaClaro: '#8E74FF',
};

// Esquemas de color. `cara: null` deja la pantalla calada (transparente).
const ESQUEMAS = {
  color: {
    cabeza: C.azulAula, cara: C.nube, rasgos: C.azulAula, sonrisa: C.turquesa,
    burbuja: [C.turquesa, '#35A7A6'], puntos: C.azulAula,
    arco: [C.turquesa, C.azulIdea, C.violeta],
    paginas: C.turquesa, paginas2: '#8FD9CF', base: C.violeta,
    chispas: [C.turquesa, C.turquesa, C.turquesa],
    teach: C.azulAula, ease: [C.turquesa, C.azulIdea, C.violeta],
    textoEslogan: C.azulAula, destacadoEslogan: C.turquesa,
    guionIzq: C.turquesa, guionDer: C.violeta,
  },
  negativo: {
    cabeza: C.blanco, cara: C.azulAula, rasgos: C.blanco, sonrisa: C.turquesaClaro,
    burbuja: [C.turquesaClaro, C.turquesa], puntos: C.azulAula,
    arco: [C.turquesaClaro, '#6F86FF', C.violetaClaro],
    paginas: C.turquesaClaro, paginas2: '#A7E9E0', base: C.violetaClaro,
    chispas: [C.turquesaClaro, C.turquesaClaro, C.turquesaClaro],
    teach: C.blanco, ease: [C.turquesaClaro, '#6F86FF', C.violetaClaro],
    textoEslogan: C.blanco, destacadoEslogan: C.turquesaClaro,
    guionIzq: C.turquesaClaro, guionDer: C.violetaClaro,
  },
};
function mono(color) {
  return {
    cabeza: color, cara: null, rasgos: color, sonrisa: color,
    burbuja: [color, color], puntos: null,
    arco: [color, color, color],
    paginas: color, paginas2: color, base: color,
    chispas: [color, color, color],
    teach: color, ease: [color, color, color],
    textoEslogan: color, destacadoEslogan: color,
    guionIzq: color, guionDer: color,
  };
}
ESQUEMAS.monoAzul = mono(C.azulAula);
ESQUEMAS.monoBlanco = mono(C.blanco);
ESQUEMAS.monoNegro = mono('#111111');

const f = (n) => +n.toFixed(2);

function degradado(id, colores, x1, x2, y1 = 0, y2 = 0) {
  if (colores.every((c) => c === colores[0])) return '';
  const paradas = colores
    .map((c, i) => `<stop offset="${f(i / (colores.length - 1))}" stop-color="${c}"/>`)
    .join('');
  return `<linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}">${paradas}</linearGradient>`;
}
const pintura = (id, colores) => (colores.every((c) => c === colores[0]) ? colores[0] : `url(#${id})`);

// ---------------------------------------------------------------------------
// ISOTIPO — coordenadas nativas en una retícula de 240 × 240
// Centro de la cabeza: (112, 128). Arco: r = 92 alrededor de ese centro.
// ---------------------------------------------------------------------------
const CABEZA =
  'M98 70H126C150 70 166 84 166 108V132C166 160 142 181 112 206C82 181 58 160 58 132V108C58 84 74 70 98 70Z';
const CARA = { x: 70, y: 92, w: 84, h: 58, rx: 24 };
const MICRO = 'M174 142C174 161 161 168 143 168';

function robot(e, p, { compacto = false } = {}) {
  const defs = [];
  const capas = [];
  // La cabeza se cala con la pantalla y con el contorno del micrófono,
  // así funciona en cualquier fondo y también en una sola tinta.
  defs.push(
    `<mask id="${p}-m" maskUnits="userSpaceOnUse" x="0" y="0" width="240" height="240">` +
      `<rect width="240" height="240" fill="#fff"/>` +
      `<rect x="${CARA.x}" y="${CARA.y}" width="${CARA.w}" height="${CARA.h}" rx="${CARA.rx}" fill="#000"/>` +
      `<path d="${MICRO}" fill="none" stroke="#000" stroke-width="13" stroke-linecap="round"/>` +
      `<rect x="122" y="160" width="24" height="16" rx="8" fill="#000"/>` +
    `</mask>`,
    `<mask id="${p}-o" maskUnits="userSpaceOnUse" x="0" y="0" width="240" height="240">` +
      `<rect width="240" height="240" fill="#fff"/>` +
      `<path d="${CABEZA}" fill="#000" stroke="#000" stroke-width="7"/>` +
    `</mask>`
  );
  // Diadema y auriculares (separados de la cabeza por un aire)
  capas.push(
    `<g mask="url(#${p}-o)">` +
      `<path d="M50 118A62 62 0 0 1 174 118" fill="none" stroke="${e.cabeza}" stroke-width="6.5" stroke-linecap="round"/>` +
    `</g>`,
    `<rect x="40" y="103" width="17" height="42" rx="8.5" fill="${e.cabeza}"/>`,
    `<rect x="167" y="103" width="17" height="42" rx="8.5" fill="${e.cabeza}"/>`,
    `<path d="${CABEZA}" fill="${e.cabeza}" mask="url(#${p}-m)"/>`
  );
  if (e.cara) {
    capas.push(`<rect x="${CARA.x}" y="${CARA.y}" width="${CARA.w}" height="${CARA.h}" rx="${CARA.rx}" fill="${e.cara}"/>`);
  }
  // Rasgos: ojo, guiño y sonrisa
  capas.push(
    `<ellipse cx="96" cy="120" rx="6.2" ry="8.4" fill="${e.rasgos}"/>`,
    `<path d="M123 122.5Q131 112.5 139 122.5" fill="none" stroke="${e.rasgos}" stroke-width="4.6" stroke-linecap="round"/>`,
    `<path d="M104 134.5Q112 141.5 120 134.5" fill="none" stroke="${e.sonrisa}" stroke-width="4.2" stroke-linecap="round"/>`
  );
  // Micrófono
  capas.push(
    `<path d="${MICRO}" fill="none" stroke="${e.cabeza}" stroke-width="5" stroke-linecap="round"/>`,
    `<rect x="126" y="163" width="17" height="10" rx="5" fill="${e.cabeza}"/>`
  );
  return { defs, capas };
}

function isotipo(e, p, { compacto = false } = {}) {
  const r = robot(e, p, { compacto });
  const defs = [...r.defs];
  const capas = [];
  if (!compacto) {
    // Arco de acompañamiento: de abajo a la izquierda, por encima, hacia la burbuja
    const cx = 112, cy = 128, R = 92;
    const pt = (a) => [cx + R * Math.cos((a * Math.PI) / 180), cy - R * Math.sin((a * Math.PI) / 180)];
    const [x1, y1] = pt(212);
    const [x2, y2] = pt(60);
    defs.push(degradado(`${p}-arco`, e.arco, 22, 168, 150, 60));
    capas.push(
      `<path d="M${f(x1)} ${f(y1)}A${R} ${R} 0 0 1 ${f(x2)} ${f(y2)}" fill="none" stroke="${pintura(`${p}-arco`, e.arco)}" stroke-width="8.5" stroke-linecap="round"/>`
    );
    // Libro abierto
    capas.push(
      `<path d="M112 208C99 199 84 195.5 66 196.5M112 208C125 199 140 195.5 158 196.5" fill="none" stroke="${e.paginas2}" stroke-width="4" stroke-linecap="round"/>`,
      `<path d="M112 215C96 205 78 202 56 204.5M112 215C128 205 146 202 168 204.5" fill="none" stroke="${e.paginas}" stroke-width="5" stroke-linecap="round"/>`,
      `<path d="M112 223C93 212 71 209.5 46 213M112 223C131 212 153 209.5 178 213" fill="none" stroke="${e.base}" stroke-width="6" stroke-linecap="round"/>`
    );
  }
  capas.push(...r.capas);
  if (!compacto) {
    // Burbuja de diálogo
    defs.push(degradado(`${p}-burbuja`, e.burbuja, 170, 224, 40, 90));
    const pb = pintura(`${p}-burbuja`, e.burbuja);
    capas.push(
      `<rect x="170" y="38" width="56" height="38" rx="19" fill="${pb}"/>`,
      `<path d="M181 70L176 90L196 73Z" fill="${pb}" stroke="${pb}" stroke-width="2" stroke-linejoin="round"/>`
    );
    const puntos = e.puntos;
    if (puntos) {
      capas.push(
        [186, 198, 210].map((x) => `<circle cx="${x}" cy="57" r="3.6" fill="${puntos}"/>`).join('')
      );
    } else {
      // En una sola tinta los puntos se calan
      defs.push(
        `<mask id="${p}-pb" maskUnits="userSpaceOnUse" x="0" y="0" width="240" height="240"><rect width="240" height="240" fill="#fff"/>` +
          [186, 198, 210].map((x) => `<circle cx="${x}" cy="57" r="3.6" fill="#000"/>`).join('') +
        `</mask>`
      );
      capas[capas.length - 2] = capas[capas.length - 2].replace('/>', ` mask="url(#${p}-pb)"/>`);
    }
    // Chispas: la idea que se enciende
    capas.push(
      `<g fill="none" stroke-width="4.2" stroke-linecap="round">` +
        `<path d="M199 99.5L210 94.5" stroke="${e.chispas[0]}"/>` +
        `<path d="M201 111H214" stroke="${e.chispas[1]}"/>` +
        `<path d="M199 122.5L210 127.5" stroke="${e.chispas[2]}"/>` +
      `</g>`
    );
  }
  return { defs, capas };
}

// Caja útil del isotipo (con su aire mínimo ya incluido)
const CAJA_ISO = { x: 14, y: 30, w: 216, h: 198 };
const CAJA_COMPACTO = { x: 36, y: 50, w: 152, h: 160 };

// ---------------------------------------------------------------------------
// LOGOTIPO — "Teach" + "Ease" en Poppins SemiBold convertida a trazos
// ---------------------------------------------------------------------------
const semi = opentype.loadSync(path.join(FUENTES, 'Poppins-SemiBold.ttf'));
const medium = opentype.loadSync(path.join(FUENTES, 'Poppins-Medium.ttf'));
const EXTRA_CHISPAS = 22; // lo que sobresalen las chispas a la derecha de la última "e"
const TRACKING = -0.012; // em, apenas más compacto que la fuente original

function trazar(fuente, texto, x, y, tam, tracking = 0) {
  const glifos = fuente.stringToGlyphs(texto);
  const escala = tam / fuente.unitsPerEm;
  let cursor = x;
  const d = [];
  glifos.forEach((g, i) => {
    d.push(g.getPath(cursor, y, tam).toPathData(2));
    let avance = g.advanceWidth * escala + tracking * tam;
    if (i < glifos.length - 1) avance += fuente.getKerningValue(g, glifos[i + 1]) * escala;
    cursor += avance;
  });
  return { d: d.join(''), ancho: cursor - x - tracking * tam };
}

function logotipo(e, p, { x = 0, y = 0, tam = 100, chispas = true } = {}) {
  const defs = [];
  const capas = [];
  const teach = trazar(semi, 'Teach', x, y, tam, TRACKING);
  const xE = x + teach.ancho + TRACKING * tam;
  const ease = trazar(semi, 'Ease', xE, y, tam, TRACKING);
  const fin = xE + ease.ancho;
  defs.push(degradado(`${p}-ease`, e.ease, xE, fin));
  capas.push(`<path d="${teach.d}" fill="${e.teach}"/>`);
  capas.push(`<path d="${ease.d}" fill="${pintura(`${p}-ease`, e.ease)}"/>`);
  if (chispas) {
    // Tres chispas sobre la última "e"
    const cx = fin - tam * 0.06, cy = y - tam * 0.6, s = tam / 100;
    const rayo = (ang, r1, r2) => {
      const a = (ang * Math.PI) / 180;
      return `M${f(cx + r1 * s * Math.cos(a))} ${f(cy - r1 * s * Math.sin(a))}L${f(cx + r2 * s * Math.cos(a))} ${f(cy - r2 * s * Math.sin(a))}`;
    };
    capas.push(
      `<g fill="none" stroke-width="${f(6 * s)}" stroke-linecap="round">` +
        `<path d="${rayo(86, 14, 31)}" stroke="${e.chispas[0]}"/>` +
        `<path d="${rayo(50, 15, 30)}" stroke="${e.chispas[1]}"/>` +
        `<path d="${rayo(16, 15, 27)}" stroke="${e.chispas[2]}"/>` +
      `</g>`
    );
  }
  return { defs, capas, ancho: fin - x, inicio: x, fin, alto: tam };
}

function subrayado(e, p, x1, x2, y, s = 1) {
  const xm = (x1 + x2) / 2;
  const defs = [degradado(`${p}-sub`, [e.ease[0], e.ease[2]], x1, x2)];
  const d = `M${f(x1)} ${f(y)}Q${f(xm)} ${f(y - 15 * s)} ${f(x2)} ${f(y)}Q${f(xm)} ${f(y - 5 * s)} ${f(x1)} ${f(y)}Z`;
  return { defs, capas: [`<path d="${d}" fill="${pintura(`${p}-sub`, [e.ease[0], e.ease[2]])}"/>`] };
}

function eslogan(e, { cx, y, tam = 30, alinear = 'centro', x = 0, guiones = true }) {
  const partes = [
    ['tu apoyo ', e.textoEslogan],
    ['silencioso', e.destacadoEslogan],
    [' en el aula', e.textoEslogan],
  ];
  const medidas = partes.map(([t]) => trazar(medium, t, 0, 0, tam).ancho);
  // los espacios finales/iniciales no deben sumar en el centrado
  const total = medidas.reduce((a, b) => a + b, 0);
  const guion = tam * 0.95, aire = tam * 0.5;
  let inicio = alinear === 'centro' ? cx - total / 2 : x + (guiones ? guion + aire : 0);
  const capas = [];
  let cursor = inicio;
  partes.forEach(([t, color], i) => {
    const r = trazar(medium, t, cursor, y, tam);
    capas.push(`<path d="${r.d}" fill="${color}"/>`);
    cursor += medidas[i];
  });
  const fin = cursor;
  if (guiones) {
    const yg = y - tam * 0.33;
    capas.push(
      `<path d="M${f(inicio - aire - guion)} ${f(yg)}H${f(inicio - aire)}" stroke="${e.guionIzq}" stroke-width="${f(tam * 0.12)}" stroke-linecap="round"/>`,
      `<path d="M${f(fin + aire)} ${f(yg)}H${f(fin + aire + guion)}" stroke="${e.guionDer}" stroke-width="${f(tam * 0.12)}" stroke-linecap="round"/>`
    );
  }
  return { capas, inicio: guiones ? inicio - aire - guion : inicio, fin: guiones ? fin + aire + guion : fin };
}

// ---------------------------------------------------------------------------
// Composiciones
// ---------------------------------------------------------------------------
function svg({ vb, defs, cuerpo, titulo, fondo }) {
  const [x, y, w, h] = vb.map(f);
  const d = defs.filter(Boolean).join('');
  const bg = fondo ? `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fondo}"/>` : '';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${w} ${h}" width="${f(w * 2)}" height="${f(h * 2)}" role="img" aria-label="${titulo}">` +
    `<title>${titulo}</title>${d ? `<defs>${d}</defs>` : ''}${bg}${cuerpo}</svg>\n`
  );
}

const grupo = (capas, transform) => `<g${transform ? ` transform="${transform}"` : ''}>${capas.join('')}</g>`;

function archivoIsotipo(e, p, compacto) {
  const iso = isotipo(e, p, { compacto });
  const c = compacto ? CAJA_COMPACTO : CAJA_ISO;
  return svg({
    vb: [c.x, c.y, c.w, c.h],
    defs: iso.defs,
    cuerpo: grupo(iso.capas),
    titulo: compacto ? 'TeachEase — isotipo compacto' : 'TeachEase — isotipo',
  });
}

function archivoLogotipo(e, p) {
  const l = logotipo(e, p, { x: 0, y: 100, tam: 100 });
  const pad = 6;
  return svg({
    vb: [-pad, 100 - 98 - pad, l.ancho + EXTRA_CHISPAS + pad * 2, 98 + pad * 2],
    defs: l.defs,
    cuerpo: grupo(l.capas),
    titulo: 'TeachEase — logotipo',
  });
}

// Vertical (versión principal): isotipo arriba, nombre, subrayado y eslogan
function archivoVertical(e, p, { conEslogan = true } = {}) {
  const tam = 100;
  const l = logotipo(e, p, { x: 0, y: 0, tam });
  const cx = l.ancho / 2;
  const isoAncho = l.ancho * 0.58; // proporción tomada del logo original
  const k = isoAncho / CAJA_ISO.w;
  const iso = isotipo(e, p);
  // centro óptico: la cabeza (x≈112) va centrada sobre la palabra
  const tx = cx - 112 * k, ty = -tam * 0.86 - 10 - (CAJA_ISO.y + CAJA_ISO.h) * k;
  const defs = [...iso.defs, ...l.defs];
  const capas = [grupo(iso.capas, `translate(${f(tx)} ${f(ty)}) scale(${f(k)})`), ...l.capas];
  let abajo = 14;
  if (conEslogan) {
    const s = subrayado(e, p, l.ancho * 0.08, l.ancho * 0.92, 34);
    defs.push(...s.defs);
    capas.push(...s.capas);
    const es = eslogan(e, { cx, y: 82, tam: 30 });
    capas.push(...es.capas);
    abajo = 92;
  }
  const arriba = ty + CAJA_ISO.y * k;
  const pad = 10;
  return svg({
    vb: [-pad, arriba - pad, l.ancho + EXTRA_CHISPAS + pad * 2, abajo - arriba + pad * 2],
    defs,
    cuerpo: capas.join(''),
    titulo: 'TeachEase — tu apoyo silencioso en el aula',
  });
}

// Horizontal: isotipo a la izquierda, nombre y eslogan a la derecha
function archivoHorizontal(e, p, { conEslogan = true } = {}) {
  const tam = 100;
  const isoAlto = conEslogan ? 200 : 160;
  const k = isoAlto / CAJA_ISO.h;
  const iso = isotipo(e, p);
  const gap = 26;
  const xTexto = CAJA_ISO.w * k + gap;
  const yBase = conEslogan ? 0 : 18;
  const l = logotipo(e, p, { x: xTexto, y: yBase, tam });
  const defs = [...iso.defs, ...l.defs];
  const capas = [];
  let inferior;
  if (conEslogan) {
    const s = subrayado(e, p, xTexto + 4, l.fin - 4, 30, 0.9);
    defs.push(...s.defs);
    const es = eslogan(e, { x: xTexto + 2, y: 74, tam: 28.5, alinear: 'izq', guiones: false });
    capas.push(...s.capas, ...es.capas);
    inferior = 84;
  } else {
    inferior = yBase + 4;
  }
  const superior = conEslogan ? -100 : yBase - 96;
  // centrar el isotipo verticalmente con el bloque de texto
  const centroTexto = (superior + inferior) / 2;
  const ty = centroTexto - (CAJA_ISO.y + CAJA_ISO.h / 2) * k;
  const tx = -CAJA_ISO.x * k;
  capas.unshift(grupo(iso.capas, `translate(${f(tx)} ${f(ty)}) scale(${f(k)})`), ...l.capas);
  const arriba = Math.min(ty + CAJA_ISO.y * k, superior);
  const ab = Math.max(ty + (CAJA_ISO.y + CAJA_ISO.h) * k, inferior);
  const pad = 10;
  return svg({
    vb: [-pad, arriba - pad, l.fin + EXTRA_CHISPAS + pad * 2, ab - arriba + pad * 2],
    defs,
    cuerpo: capas.join(''),
    titulo: 'TeachEase — tu apoyo silencioso en el aula',
  });
}

// Ícono de app / avatar: isotipo compacto sobre fondo
function archivoApp(variante) {
  const p = `app-${variante}`;
  const tam = 512;
  let fondo, e;
  if (variante === 'degradado') {
    e = { ...ESQUEMAS.color, cara: C.nube };
    fondo =
      `<linearGradient id="${p}-bg" x1="0" y1="0" x2="${tam}" y2="${tam}" gradientUnits="userSpaceOnUse">` +
      `<stop offset="0" stop-color="${C.turquesa}"/><stop offset=".55" stop-color="${C.azulIdea}"/><stop offset="1" stop-color="${C.violeta}"/></linearGradient>`;
    e = { ...ESQUEMAS.negativo, cara: C.azulAula, sonrisa: C.turquesaClaro };
  } else if (variante === 'azul') {
    e = ESQUEMAS.negativo;
  } else {
    e = ESQUEMAS.color;
  }
  const colorFondo = variante === 'degradado' ? `url(#${p}-bg)` : variante === 'azul' ? C.azulAula : C.blanco;
  const iso = isotipo(e, p, { compacto: true });
  const k = (tam * 0.62) / CAJA_COMPACTO.h;
  const tx = tam / 2 - 112 * k;
  const ty = tam / 2 - (CAJA_COMPACTO.y + CAJA_COMPACTO.h / 2) * k + tam * 0.01;
  return svg({
    vb: [0, 0, tam, tam],
    defs: [variante === 'degradado' ? fondo : '', ...iso.defs],
    cuerpo: `<rect width="${tam}" height="${tam}" rx="${tam * 0.225}" fill="${colorFondo}"/>` + grupo(iso.capas, `translate(${f(tx)} ${f(ty)}) scale(${f(k)})`),
    titulo: 'TeachEase — ícono de aplicación',
  }).replace(/width="1024" height="1024"/, 'width="512" height="512"');
}

// ---------------------------------------------------------------------------
fs.mkdirSync(SALIDA, { recursive: true });
const archivos = {};
const sufijos = { color: '', negativo: '-negativo', monoAzul: '-azul', monoBlanco: '-blanco', monoNegro: '-negro' };

for (const [nombre, e] of Object.entries(ESQUEMAS)) {
  const s = sufijos[nombre];
  const p = (t) => `te-${t}${s}`;
  archivos[`isotipo${s}.svg`] = archivoIsotipo(e, p('iso'), false);
  archivos[`isotipo-compacto${s}.svg`] = archivoIsotipo(e, p('isoc'), true);
  archivos[`logotipo${s}.svg`] = archivoLogotipo(e, p('logo'));
  archivos[`logo-vertical${s}.svg`] = archivoVertical(e, p('v'));
  archivos[`logo-vertical-sin-eslogan${s}.svg`] = archivoVertical(e, p('vs'), { conEslogan: false });
  archivos[`logo-horizontal${s}.svg`] = archivoHorizontal(e, p('h'));
  archivos[`logo-horizontal-sin-eslogan${s}.svg`] = archivoHorizontal(e, p('hs'), { conEslogan: false });
}
archivos['app-icono.svg'] = archivoApp('degradado');
archivos['app-icono-azul.svg'] = archivoApp('azul');
archivos['app-icono-blanco.svg'] = archivoApp('blanco');

for (const [n, contenido] of Object.entries(archivos)) {
  fs.writeFileSync(path.join(SALIDA, n), contenido);
}
console.log(`${Object.keys(archivos).length} archivos SVG en ${path.relative(process.cwd(), SALIDA)}`);
