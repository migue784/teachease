// Voz del navegador: escuchar la pronunciación (síntesis) y evaluar
// lo que dice la persona (reconocimiento). No necesita internet en la
// mayoría de celulares para escuchar; el reconocimiento depende del navegador.

let vozIngles = null;

function elegirVoz() {
  if (!('speechSynthesis' in window)) return null;
  const voces = window.speechSynthesis.getVoices();
  vozIngles =
    voces.find((v) => v.lang === 'en-US' && /samantha|google|natural|aria|jenny/i.test(v.name)) ||
    voces.find((v) => v.lang === 'en-US') ||
    voces.find((v) => v.lang?.startsWith('en')) ||
    null;
  return vozIngles;
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  elegirVoz();
  window.speechSynthesis.addEventListener?.('voiceschanged', elegirVoz);
}

export const puedeHablar = () => typeof window !== 'undefined' && 'speechSynthesis' in window;

export function hablar(texto, { lento = false, volumen = 1 } = {}) {
  if (!puedeHablar()) return false;
  const s = window.speechSynthesis;
  s.cancel();
  const u = new SpeechSynthesisUtterance(texto.replace('…', ''));
  u.lang = 'en-US';
  u.voice = vozIngles || elegirVoz();
  u.rate = lento ? 0.6 : 0.88;
  u.volume = volumen;
  s.speak(u);
  return true;
}

const Reconocimiento = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
export const puedeEscuchar = () => Boolean(Reconocimiento);

// Escucha una vez y devuelve lo que entendió (en inglés)
export function escuchar({ alTerminar, alError }) {
  if (!Reconocimiento) {
    alError?.('no-disponible');
    return () => {};
  }
  const r = new Reconocimiento();
  r.lang = 'en-US';
  r.interimResults = false;
  r.maxAlternatives = 3;
  let entregado = false;
  r.onresult = (e) => {
    entregado = true;
    const opciones = [...e.results[0]].map((a) => a.transcript);
    alTerminar?.(opciones);
  };
  r.onerror = (e) => {
    entregado = true;
    alError?.(e.error);
  };
  r.onend = () => {
    if (!entregado) alError?.('sin-voz');
  };
  try {
    r.start();
  } catch {
    alError?.('no-disponible');
  }
  return () => r.abort();
}

const normalizar = (t) =>
  t
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function distancia(a, b) {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++)
    for (let j = 1; j <= b.length; j++)
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return m[a.length][b.length];
}

// Parecido entre 0 y 100 entre lo que se esperaba y lo que se entendió
export function parecido(esperado, opciones) {
  const e = normalizar(esperado);
  let mejor = 0;
  for (const o of opciones) {
    const n = normalizar(o);
    const largo = Math.max(e.length, n.length) || 1;
    mejor = Math.max(mejor, Math.round((1 - distancia(e, n) / largo) * 100));
  }
  return mejor;
}
