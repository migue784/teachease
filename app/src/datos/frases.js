// Frases para usar en el aula ("classroom language"), organizadas por momento de la clase.
// Son el corazón del Modo Aula: buscar, escuchar y decir en segundos.

export const MOMENTOS = [
  {
    id: 'inicio',
    nombre: 'Empezar la clase',
    frases: [
      { en: 'Good morning, everyone!', es: '¡Buenos días a todos!', fon: 'gud mórnin, évriuan' },
      { en: 'Please sit down.', es: 'Siéntense, por favor.', fon: 'plís sit dáun' },
      { en: 'Let’s begin.', es: 'Empecemos.', fon: 'lets biguín' },
      { en: 'Open your books to page ten.', es: 'Abran sus libros en la página diez.', fon: 'óupen iór buks tu péich ten' },
      { en: 'Take out your notebooks.', es: 'Saquen sus cuadernos.', fon: 'téik áut iór nóutbuks' },
      { en: 'Who is absent today?', es: '¿Quién falta hoy?', fon: 'ju is ábsent tudéi' },
      { en: 'What day is today?', es: '¿Qué día es hoy?', fon: 'uát déi is tudéi' },
    ],
  },
  {
    id: 'instrucciones',
    nombre: 'Dar instrucciones',
    frases: [
      { en: 'Listen carefully.', es: 'Escuchen con atención.', fon: 'lísen kérfuli' },
      { en: 'Repeat after me.', es: 'Repitan después de mí.', fon: 'ripít áfter mi' },
      { en: 'Look at the board.', es: 'Miren el tablero.', fon: 'luk at de bord' },
      { en: 'Work in pairs.', es: 'Trabajen en parejas.', fon: 'uérk in pers' },
      { en: 'Work in groups.', es: 'Trabajen en grupos.', fon: 'uérk in grups' },
      { en: 'Raise your hand.', es: 'Levanten la mano.', fon: 'réis iór jand' },
      { en: 'Write it down.', es: 'Escríbanlo.', fon: 'ráit it dáun' },
      { en: 'Stand up, please.', es: 'Pónganse de pie, por favor.', fon: 'stand ap, plís' },
      { en: 'Come to the front.', es: 'Pasa al frente.', fon: 'kam tu de frant' },
      { en: 'You have five minutes.', es: 'Tienen cinco minutos.', fon: 'iú jav fáiv mínits' },
      { en: 'Close your books.', es: 'Cierren sus libros.', fon: 'klóus iór buks' },
    ],
  },
  {
    id: 'felicitar',
    nombre: 'Felicitar y animar',
    frases: [
      { en: 'Great job!', es: '¡Excelente trabajo!', fon: 'gréit yob' },
      { en: 'Well done!', es: '¡Muy bien hecho!', fon: 'uél dan' },
      { en: 'Very good!', es: '¡Muy bien!', fon: 'véri gud' },
      { en: 'Nice try!', es: '¡Buen intento!', fon: 'náis trái' },
      { en: 'Keep going!', es: '¡Sigue así!', fon: 'kip góuin' },
      { en: 'I’m proud of you.', es: 'Estoy orgulloso(a) de ti.', fon: 'áim práud of iú' },
      { en: 'You can do it!', es: '¡Tú puedes!', fon: 'iú kan du it' },
    ],
  },
  {
    id: 'convivencia',
    nombre: 'Orden y convivencia',
    frases: [
      { en: 'Quiet, please.', es: 'Silencio, por favor.', fon: 'kuáiet, plís' },
      { en: 'Pay attention, please.', es: 'Presten atención, por favor.', fon: 'péi aténshon, plís' },
      { en: 'One at a time, please.', es: 'Uno a la vez, por favor.', fon: 'uán at a táim, plís' },
      { en: 'Wait your turn.', es: 'Espera tu turno.', fon: 'uéit iór tern' },
      { en: 'Please be kind to each other.', es: 'Sean amables entre ustedes.', fon: 'plís bi káind tu ich áder' },
      { en: 'Please line up.', es: 'Hagan la fila, por favor.', fon: 'plís láin ap' },
      { en: 'Eyes on me.', es: 'Mírenme.', fon: 'áis on mi' },
    ],
  },
  {
    id: 'preguntas',
    nombre: 'Preguntar y aclarar',
    frases: [
      { en: 'Do you understand?', es: '¿Entienden?', fon: 'du iú anderstánd' },
      { en: 'Any questions?', es: '¿Alguna pregunta?', fon: 'éni kuéschons' },
      { en: 'Are you ready?', es: '¿Están listos?', fon: 'ar iú rédi' },
      { en: 'Can you repeat, please?', es: '¿Puedes repetir, por favor?', fon: 'kan iú ripít, plís' },
      { en: 'How do you say it in English?', es: '¿Cómo se dice en inglés?', fon: 'jáu du iú séi it in ínglish' },
      { en: 'What does it mean?', es: '¿Qué significa?', fon: 'uát das it min' },
      { en: 'Can you spell it?', es: '¿Lo puedes deletrear?', fon: 'kan iú spel it' },
      { en: 'May I go to the bathroom?', es: '¿Puedo ir al baño?', fon: 'méi ái góu tu de bázrum' },
    ],
  },
  {
    id: 'cierre',
    nombre: 'Cerrar la clase',
    frases: [
      { en: 'Time is up.', es: 'Se acabó el tiempo.', fon: 'táim is ap' },
      { en: 'Let’s review.', es: 'Repasemos.', fon: 'lets riviú' },
      { en: 'Your homework is page twenty.', es: 'La tarea es la página veinte.', fon: 'iór jóumuerk is péich tuénti' },
      { en: 'Clean up, please.', es: 'Ordenen, por favor.', fon: 'klin ap, plís' },
      { en: 'See you tomorrow!', es: '¡Hasta mañana!', fon: 'sí iú tumórou' },
      { en: 'Have a nice day!', es: '¡Que tengan un buen día!', fon: 'jav a náis déi' },
      { en: 'Goodbye, class!', es: '¡Adiós, clase!', fon: 'gud bái, klas' },
    ],
  },
];

export const FRASES = MOMENTOS.flatMap((m) =>
  m.frases.map((f, i) => ({ ...f, id: `${m.id}-${i}`, momento: m.id }))
);
