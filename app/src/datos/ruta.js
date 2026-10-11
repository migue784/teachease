// Ruta de aprendizaje del docente: el inglés que se necesita para dar una clase,
// de lo más básico (saludar) a lo más fino (corregir con cariño, cerrar la clase).
// Cada lección tiene 4 frases y un consejo; los ejercicios se arman solos (ver lib/leccion.js).

const f = (en, es, fon) => ({ en, es, fon });

export const UNIDADES = [
  {
    id: 'u1',
    titulo: 'Preséntate con confianza',
    emoji: '👋',
    lecciones: [
      {
        id: 'u1l1',
        titulo: 'Saludar al grupo',
        consejo: '“Good morning” se usa hasta el mediodía; después, “Good afternoon”.',
        frases: [
          f('Good morning, class!', '¡Buenos días, clase!', 'gud mórnin, klas'),
          f('How are you today?', '¿Cómo están hoy?', 'jáu ar iú tudéi'),
          f('I’m fine, thank you. And you?', 'Bien, gracias. ¿Y ustedes?', 'áim fáin, zénk iú. and iú'),
          f('Nice to see you!', '¡Qué bueno verlos!', 'náis tu sí iú'),
        ],
      },
      {
        id: 'u1l2',
        titulo: 'Presentarte',
        consejo: '“Miss” va antes del nombre de una profesora y “Mr.” (míster) antes del de un profesor.',
        frases: [
          f('I’m your English teacher.', 'Soy su profesor(a) de inglés.', 'áim iór ínglish tícher'),
          f('My name is Miss Ana.', 'Me llamo Miss Ana.', 'mái néim is mis ána'),
          f('I’m from Colombia.', 'Soy de Colombia.', 'áim from kolómbia'),
          f('I like music and books.', 'Me gustan la música y los libros.', 'ái láik miúsik and buks'),
        ],
      },
      {
        id: 'u1l3',
        titulo: 'Conocer a tus estudiantes',
        consejo: 'La edad se dice con “to be”: “I am seven”, nunca “I have seven”.',
        frases: [
          f('What’s your name?', '¿Cómo te llamas?', 'uáts iór néim'),
          f('How old are you?', '¿Cuántos años tienes?', 'jáu óuld ar iú'),
          f('Nice to meet you.', 'Mucho gusto.', 'náis tu mít iú'),
          f('Welcome to the class!', '¡Bienvenidos a la clase!', 'uélkam tu de klas'),
        ],
      },
    ],
  },
  {
    id: 'u2',
    titulo: 'Empieza la clase',
    emoji: '🔔',
    lecciones: [
      {
        id: 'u2l1',
        titulo: 'La rutina de inicio',
        consejo: '“Let’s” es la forma corta de “let us”: sirve para decir “vamos a…”.',
        frases: [
          f('Please sit down.', 'Siéntense, por favor.', 'plís sit dáun'),
          f('Take out your notebooks.', 'Saquen sus cuadernos.', 'téik áut iór nóutbuks'),
          f('Let’s start.', 'Empecemos.', 'lets start'),
          f('Today we are going to learn colors.', 'Hoy vamos a aprender los colores.', 'tudéi ui ar góuin tu lern kálors'),
        ],
      },
      {
        id: 'u2l2',
        titulo: 'La fecha y el clima',
        consejo: 'En inglés los días y los meses se escriben con mayúscula: Monday, May.',
        frases: [
          f('What day is today?', '¿Qué día es hoy?', 'uát déi is tudéi'),
          f('Today is Monday.', 'Hoy es lunes.', 'tudéi is mándei'),
          f('How is the weather?', '¿Cómo está el clima?', 'jáu is de uéder'),
          f('It’s sunny today.', 'Hoy está soleado.', 'its sáni tudéi'),
        ],
      },
      {
        id: 'u2l3',
        titulo: 'Llamar a lista',
        consejo: 'Cuando escuchan su nombre, los estudiantes responden “Here!” o “Present!”.',
        frases: [
          f('Let’s take attendance.', 'Vamos a llamar a lista.', 'lets téik aténdans'),
          f('Who is absent today?', '¿Quién falta hoy?', 'ju is ábsent tudéi'),
          f('Raise your hand.', 'Levanten la mano.', 'réis iór jand'),
          f('Everyone is here!', '¡Están todos!', 'évriuan is jir'),
        ],
      },
    ],
  },
  {
    id: 'u3',
    titulo: 'Da instrucciones claras',
    emoji: '📣',
    lecciones: [
      {
        id: 'u3l1',
        titulo: 'Escuchar y mirar',
        consejo: 'Las órdenes en inglés empiezan con el verbo: Listen, Look, Repeat.',
        frases: [
          f('Listen carefully.', 'Escuchen con atención.', 'lísen kérfuli'),
          f('Look at the board.', 'Miren el tablero.', 'luk at de bord'),
          f('Repeat after me.', 'Repitan después de mí.', 'ripít áfter mi'),
          f('Point to the picture.', 'Señalen el dibujo.', 'póint tu de píkcher'),
        ],
      },
      {
        id: 'u3l2',
        titulo: 'A trabajar',
        consejo: 'Página + número: “page ten”, “page twenty-five”.',
        frases: [
          f('Open your books to page ten.', 'Abran sus libros en la página diez.', 'óupen iór buks tu péich ten'),
          f('Work in pairs.', 'Trabajen en parejas.', 'uérk in pers'),
          f('Write your name.', 'Escriban su nombre.', 'ráit iór néim'),
          f('Color the picture.', 'Coloreen el dibujo.', 'kálor de píkcher'),
        ],
      },
      {
        id: 'u3l3',
        titulo: 'A moverse',
        consejo: 'Agregar “please” vuelve amable cualquier orden.',
        frases: [
          f('Stand up, please.', 'Pónganse de pie, por favor.', 'stand ap, plís'),
          f('Make a circle.', 'Hagan un círculo.', 'méik a sérkol'),
          f('Come here, please.', 'Ven aquí, por favor.', 'kam jir, plís'),
          f('Go back to your seat.', 'Vuelve a tu puesto.', 'góu bak tu iór sit'),
        ],
      },
    ],
  },
  {
    id: 'u4',
    titulo: 'Pregunta y comprueba',
    emoji: '❓',
    lecciones: [
      {
        id: 'u4l1',
        titulo: '¿Entendieron?',
        consejo: 'Las preguntas con “Do you…?” se responden “Yes, I do” o “No, I don’t”.',
        frases: [
          f('Do you understand?', '¿Entienden?', 'du iú anderstánd'),
          f('Yes, I do.', 'Sí.', 'iés, ái du'),
          f('No, I don’t.', 'No.', 'nóu, ái dóunt'),
          f('Any questions?', '¿Alguna pregunta?', 'éni kuéschons'),
        ],
      },
      {
        id: 'u4l2',
        titulo: 'Pedir que repitan',
        consejo: '“Louder” es “más duro” (más volumen) y “slowly” es “despacio”.',
        frases: [
          f('Can you repeat, please?', '¿Puedes repetir, por favor?', 'kan iú ripít, plís'),
          f('Louder, please.', 'Más duro, por favor.', 'láuder, plís'),
          f('Slowly, please.', 'Despacio, por favor.', 'slóuli, plís'),
          f('One more time.', 'Una vez más.', 'uán mor táim'),
        ],
      },
      {
        id: 'u4l3',
        titulo: 'Preguntas de clase',
        consejo: 'What = qué · How many = cuántos · Who = quién.',
        frases: [
          f('What color is it?', '¿De qué color es?', 'uát kálor is it'),
          f('How many apples are there?', '¿Cuántas manzanas hay?', 'jáu méni ápols ar der'),
          f('What is this?', '¿Qué es esto?', 'uát is dis'),
          f('Who knows the answer?', '¿Quién sabe la respuesta?', 'ju nóus di ánser'),
        ],
      },
    ],
  },
  {
    id: 'u5',
    titulo: 'Anima y corrige con cariño',
    emoji: '💜',
    lecciones: [
      {
        id: 'u5l1',
        titulo: 'Felicitar',
        consejo: 'Celebrar cada intento en inglés hace que los niños se animen a usarlo.',
        frases: [
          f('Great job!', '¡Excelente trabajo!', 'gréit yob'),
          f('Well done!', '¡Muy bien hecho!', 'uél dan'),
          f('That’s right!', '¡Correcto!', 'dats ráit'),
          f('I’m proud of you.', 'Estoy orgulloso(a) de ti.', 'áim práud of iú'),
        ],
      },
      {
        id: 'u5l2',
        titulo: 'Corregir sin regañar',
        consejo: 'En vez de decir “está mal”, repite la forma correcta y pide que lo intenten de nuevo.',
        frases: [
          f('Almost! Try again.', '¡Casi! Intenta otra vez.', 'ólmoust! trái aguén'),
          f('Good try!', '¡Buen intento!', 'gud trái'),
          f('Listen and repeat.', 'Escucha y repite.', 'lísen and ripít'),
          f('Let’s do it together.', 'Hagámoslo juntos.', 'lets du it tuguéder'),
        ],
      },
      {
        id: 'u5l3',
        titulo: 'Dar ánimo',
        consejo: '“Don’t” (do not) sirve para decir “no hagas…”: Don’t worry = no te preocupes.',
        frases: [
          f('You can do it!', '¡Tú puedes!', 'iú kan du it'),
          f('Don’t worry.', 'No te preocupes.', 'dóunt uórri'),
          f('Take your time.', 'Tómate tu tiempo.', 'téik iór táim'),
          f('Keep trying!', '¡Sigue intentando!', 'kip tráin'),
        ],
      },
    ],
  },
  {
    id: 'u6',
    titulo: 'Maneja el grupo y cierra la clase',
    emoji: '🏁',
    lecciones: [
      {
        id: 'u6l1',
        titulo: 'Orden en el salón',
        consejo: 'Frases cortas y siempre las mismas: el grupo las aprende rápido.',
        frases: [
          f('Quiet, please.', 'Silencio, por favor.', 'kuáiet, plís'),
          f('Eyes on me.', 'Mírenme.', 'áis on mi'),
          f('One at a time, please.', 'Uno a la vez, por favor.', 'uán at a táim, plís'),
          f('Wait your turn.', 'Espera tu turno.', 'uéit iór tern'),
        ],
      },
      {
        id: 'u6l2',
        titulo: 'Cerrar la actividad',
        consejo: '“Time is up” avisa que se acabó el tiempo; úsala con el temporizador del Kit del aula.',
        frases: [
          f('Time is up.', 'Se acabó el tiempo.', 'táim is ap'),
          f('Let’s review.', 'Repasemos.', 'lets riviú'),
          f('Clean up, please.', 'Ordenen, por favor.', 'klin ap, plís'),
          f('Line up at the door.', 'Hagan la fila en la puerta.', 'láin ap at de dor'),
        ],
      },
      {
        id: 'u6l3',
        titulo: 'Despedirte',
        consejo: '“Weekend” es el fin de semana: “Have a nice weekend!” se dice el viernes.',
        frases: [
          f('Your homework is page twenty.', 'La tarea es la página veinte.', 'iór jóumuerk is péich tuénti'),
          f('See you tomorrow!', '¡Hasta mañana!', 'sí iú tumórou'),
          f('Have a nice weekend!', '¡Buen fin de semana!', 'jav a náis uíkend'),
          f('Goodbye, everyone!', '¡Adiós a todos!', 'gud bái, évriuan'),
        ],
      },
    ],
  },
];

export const LECCIONES = UNIDADES.flatMap((u, iu) =>
  u.lecciones.map((l, il) => ({ ...l, unidad: u.id, unidadTitulo: u.titulo, iu, il }))
);
export const leccionPorId = (id) => LECCIONES.find((l) => l.id === id);

// Primera lección que recomienda el diagnóstico según el nivel
export const INICIO_POR_NIVEL = { basico: 'u1l1', intermedio: 'u3l1', avanzado: 'u5l1' };
