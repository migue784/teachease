// Plantillas de actividades para armar una clase. Cada una recibe el tema
// y devuelve pasos concretos con las palabras de ese tema.

const lista = (t, n = 4) => t.palabras.slice(0, n).map((p) => p.en).join(', ');

export const ACTIVIDADES = {
  tarjetas: {
    nombre: 'Flashcards relámpago',
    tipo: 'Calentamiento',
    materiales: 'Tarjetas con dibujos (o la pantalla de la app)',
    pasos: (t) => [
      `Muestra cada tarjeta 2 segundos y di la palabra: ${lista(t)}.`,
      'El grupo repite en coro. Luego solo una fila, luego la otra.',
      'Muestra la tarjeta sin hablar: el primero que la diga gana un punto para su fila.',
    ],
  },
  cadena: {
    nombre: 'Cadena de voces',
    tipo: 'Práctica oral',
    materiales: 'Ninguno',
    pasos: (t) => [
      `Modela la frase: “${t.modelo.en}”.`,
      'El primer estudiante se la dice al compañero de al lado, que responde y pregunta al siguiente.',
      'La cadena da la vuelta al salón. Si alguien se traba, el grupo le ayuda en coro.',
    ],
  },
  roleplay: {
    nombre: 'Mini diálogos',
    tipo: 'Producción',
    materiales: 'Ninguno',
    pasos: (t) => [
      `Escribe en el tablero un diálogo corto con: ${lista(t, 5)}.`,
      'En parejas, lo practican cambiando los nombres.',
      'Dos o tres parejas voluntarias lo presentan al frente.',
    ],
  },
  muestrame: {
    nombre: '¡Muéstrame!',
    tipo: 'Comprensión',
    materiales: 'Objetos del salón o tarjetas',
    pasos: (t) => [
      `Di “Show me… ${t.palabras[0].en.toLowerCase()}!” y los estudiantes señalan o levantan el objeto.`,
      'Acelera el ritmo. Quien se equivoque se convierte en tu ayudante.',
      'Al final, un estudiante da la orden y el resto responde.',
    ],
  },
  bingo: {
    nombre: 'Bingo',
    tipo: 'Comprensión auditiva',
    materiales: 'Hoja con cuadrícula de 3×3',
    pasos: (t) => [
      `Cada estudiante dibuja o escribe 9 palabras de la lista: ${lista(t, 6)}…`,
      'Dices las palabras en desorden (o usa el botón de escuchar de la app).',
      'Gana quien complete una línea y la lea en voz alta en inglés.',
    ],
  },
  memoria: {
    nombre: 'Juego de memoria',
    tipo: 'Práctica',
    materiales: 'Pares de tarjetas: dibujo y palabra',
    pasos: (t) => [
      `Prepara pares con: ${lista(t, 6)}.`,
      'En grupos de 4, voltean dos tarjetas y dicen la palabra en inglés.',
      'Si forman pareja y la dicen bien, se la quedan.',
    ],
  },
  presentar: {
    nombre: 'Te presento a…',
    tipo: 'Producción',
    materiales: 'Un dibujo de su familia',
    pasos: (t) => [
      'Cada estudiante dibuja a su familia.',
      `Modela: “${t.modelo.en}”.`,
      'En parejas, presentan su dibujo señalando a cada persona.',
    ],
  },
  mimica: {
    nombre: 'Mímica',
    tipo: 'Práctica',
    materiales: 'Tarjetas boca abajo',
    pasos: (t) => [
      `Un estudiante toma una tarjeta (${lista(t)}…) y la representa sin hablar.`,
      'El grupo adivina en inglés.',
      'Quien acierte pasa al frente con la siguiente tarjeta.',
    ],
  },
  simon: {
    nombre: 'Simon says',
    tipo: 'Comprensión',
    materiales: 'Ninguno',
    pasos: (t) => [
      `Di “Simon says: touch your ${t.palabras[0].en.toLowerCase()}!” y todos lo hacen.`,
      'Si das la orden sin “Simon says”, quien la haga sale del juego.',
      'Los últimos tres en pie dirigen la siguiente ronda.',
    ],
  },
  cancion: {
    nombre: 'Canción con ritmo',
    tipo: 'Calentamiento',
    materiales: 'Palmas',
    pasos: (t) => [
      `Di la lista con ritmo y palmas: ${lista(t, 7)}.`,
      'Repítanla más rápido cada vez.',
      'Hagan la versión “susurro”: todos en voz bajita, sin perder el ritmo.',
    ],
  },
};
