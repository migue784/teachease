// Prueba de nivel corta (12 preguntas, unos 3 minutos).
// tipo: 'leer' muestra el texto; 'escuchar' solo reproduce el audio.

export const PREGUNTAS = [
  { tipo: 'leer', enunciado: '¿Cómo se dice “rojo” en inglés?', texto: 'rojo', opciones: ['Red', 'Read', 'Rod', 'Ride'], correcta: 0 },
  { tipo: 'leer', enunciado: '¿Qué significa “Good morning”?', texto: 'Good morning', opciones: ['Buenas noches', 'Buenos días', 'Hasta luego', 'Buen trabajo'], correcta: 1 },
  { tipo: 'leer', enunciado: '¿Cómo se dice “cuaderno”?', texto: 'cuaderno', opciones: ['Notebook', 'Pencil', 'Backpack', 'Board'], correcta: 0 },
  { tipo: 'escuchar', enunciado: 'Escucha y elige qué significa', audio: 'Thursday', opciones: ['Martes', 'Jueves', 'Sábado', 'Miércoles'], correcta: 1 },
  { tipo: 'leer', enunciado: 'Un estudiante te dice “May I go to the bathroom?”. ¿Qué pide?', texto: 'May I go to the bathroom?', opciones: ['Ir al baño', 'Ir a casa', 'Tomar agua', 'Salir al recreo'], correcta: 0 },
  { tipo: 'leer', enunciado: 'Quieres que trabajen en parejas. ¿Qué dices?', opciones: ['Work in pairs.', 'Work in groups.', 'Work alone.', 'Work in pears.'], correcta: 0 },
  { tipo: 'escuchar', enunciado: 'Escucha la instrucción. ¿Qué deben hacer?', audio: 'Open your books to page twenty.', opciones: ['Cerrar el libro', 'Abrir el libro en la página 20', 'Escribir 20 palabras', 'Leer en voz alta'], correcta: 1 },
  { tipo: 'leer', enunciado: 'Completa: “She ___ a teacher.”', opciones: ['am', 'are', 'is', 'be'], correcta: 2 },
  { tipo: 'leer', enunciado: 'Completa: “I ___ two brothers.”', opciones: ['has', 'have', 'am', 'having'], correcta: 1 },
  { tipo: 'leer', enunciado: '¿Cuál es la forma más amable de pedir silencio?', opciones: ['Shut up!', 'Quiet, please.', 'No talk!', 'Silence you.'], correcta: 1 },
  { tipo: 'leer', enunciado: 'Completa: “Yesterday we ___ a song.”', opciones: ['sing', 'sang', 'sung', 'singing'], correcta: 1 },
  { tipo: 'leer', enunciado: 'Un niño contesta mal. ¿Qué le dices para animarlo?', opciones: ['Wrong!', 'Almost! Try again.', 'No, sit down.', 'Bad answer.'], correcta: 1 },
];

export function nivelPorPuntaje(n) {
  if (n >= 10) return 'avanzado';
  if (n >= 6) return 'intermedio';
  return 'basico';
}
