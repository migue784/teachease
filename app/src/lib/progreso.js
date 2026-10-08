import { leer, guardar } from './almacen';

// Progreso de la persona: puntos, racha de días y repaso espaciado (cajas de Leitner).
const hoy = () => new Date().toLocaleDateString('en-CA'); // AAAA-MM-DD en hora local

const BASE = { puntos: 0, racha: 0, ultimoDia: null, dias: {}, cajas: {}, pronunciadas: 0, clases: 0 };

export const leerProgreso = () => ({ ...BASE, ...leer('progreso', BASE) });

function diasEntre(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

// Suma puntos y mantiene la racha (días seguidos practicando)
export function sumarPuntos(n, extra = {}) {
  const p = leerProgreso();
  const d = hoy();
  if (p.ultimoDia !== d) {
    p.racha = p.ultimoDia && diasEntre(p.ultimoDia, d) === 1 ? p.racha + 1 : 1;
    p.ultimoDia = d;
  }
  p.puntos += n;
  p.dias = { ...p.dias, [d]: (p.dias[d] || 0) + n };
  for (const [k, v] of Object.entries(extra)) p[k] = (p[k] || 0) + v;
  guardar('progreso', p);
  return p;
}

// Repaso espaciado: caja 1 se repasa siempre, caja 5 casi nunca
export function marcarPalabra(id, laSabia) {
  const p = leerProgreso();
  const actual = p.cajas[id] || 1;
  p.cajas = { ...p.cajas, [id]: laSabia ? Math.min(5, actual + 1) : 1 };
  guardar('progreso', p);
}

export function ordenarParaRepaso(palabras, cajas) {
  return [...palabras].sort((a, b) => (cajas[a.id] || 1) - (cajas[b.id] || 1) || Math.random() - 0.5);
}

export const racha = (p) => {
  if (!p.ultimoDia) return 0;
  return diasEntre(p.ultimoDia, hoy()) <= 1 ? p.racha : 0;
};

export const puntosHoy = (p) => p.dias[hoy()] || 0;

// Últimos 7 días para la gráfica de la semana
export function semana(p) {
  return Array.from({ length: 7 }, (_, i) => {
    const f = new Date();
    f.setDate(f.getDate() - (6 - i));
    const clave = f.toLocaleDateString('en-CA');
    return { clave, letra: 'DLMMJVS'[f.getDay()], puntos: p.dias[clave] || 0 };
  });
}

export const dominadas = (p) => Object.values(p.cajas).filter((c) => c >= 4).length;
