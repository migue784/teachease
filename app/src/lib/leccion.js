// Arma los ejercicios de una lección a partir de sus 4 frases:
// aprender → elegir → ordenar → escuchar → decir. Los distractores salen
// de otras frases de la misma unidad o de la ruta completa.
import { puedeEscuchar } from './voz';

export function mezclar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const opciones = (correcta, pool, campo) => {
  const otras = mezclar(pool.filter((x) => x[campo] !== correcta[campo])).slice(0, 3);
  return mezclar([correcta, ...otras]);
};

const ordenable = (fr) => fr.en.split(' ').length >= 3;

export function armarPasos(leccion, pool) {
  const [a, b, c, d] = leccion.frases;
  const pasos = [
    { tipo: 'aprende', frase: a },
    { tipo: 'aprende', frase: b },
    { tipo: 'elige', frase: a, opciones: opciones(a, pool, 'en') },
    ordenable(b) ? { tipo: 'ordena', frase: b, fichas: mezclar(b.en.split(' ')) } : { tipo: 'escucha', frase: b, opciones: opciones(b, pool, 'es') },
    { tipo: 'aprende', frase: c },
    { tipo: 'escucha', frase: c, opciones: opciones(c, pool, 'es') },
    { tipo: 'aprende', frase: d },
    ordenable(d) ? { tipo: 'ordena', frase: d, fichas: mezclar(d.en.split(' ')) } : { tipo: 'elige', frase: d, opciones: opciones(d, pool, 'en') },
    { tipo: 'elige', frase: c, opciones: opciones(c, pool, 'en') },
  ];
  if (puedeEscuchar()) pasos.push({ tipo: 'di', frase: mezclar([a, b, c, d])[0] });
  return pasos;
}

export const esPractica = (paso) => ['elige', 'ordena', 'escucha'].includes(paso.tipo);

export function estrellas(aciertos, total) {
  const r = total ? aciertos / total : 1;
  return r >= 0.95 ? 3 : r >= 0.7 ? 2 : 1;
}
