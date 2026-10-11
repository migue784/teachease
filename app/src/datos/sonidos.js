// Entrenador de pronunciación: los sonidos del inglés que más cuestan
// a quien habla español, con cómo poner la boca, palabras para practicar
// y pares de palabras que solo cambian en ese sonido.

const w = (en, fon, es) => ({ en, fon, es });

export const SONIDOS = [
  {
    id: 'th-suave',
    titulo: 'TH sin voz',
    ejemplo: 'think',
    boca: 'Pon la punta de la lengua entre los dientes y sopla suave. Suena como la “z” de España.',
    palabras: [w('think', 'zink', 'pensar'), w('three', 'zri', 'tres'), w('thank you', 'zénk iú', 'gracias'), w('Thursday', 'zérsdei', 'jueves')],
    pares: [['three', 'tree'], ['think', 'sink'], ['thank', 'tank']],
  },
  {
    id: 'th-voz',
    titulo: 'TH con voz',
    ejemplo: 'this',
    boca: 'Igual que la anterior, lengua entre los dientes, pero con la garganta vibrando. Como una “d” muy suave.',
    palabras: [w('this', 'dis', 'esto'), w('the', 'de', 'el / la'), w('mother', 'máder', 'mamá'), w('brother', 'bráder', 'hermano')],
    pares: [['they', 'day'], ['then', 'den'], ['those', 'doze']],
  },
  {
    id: 'v-b',
    titulo: 'V y B',
    ejemplo: 'very',
    boca: 'En inglés son distintas. Para la V, los dientes de arriba tocan el labio de abajo y vibra. La B se hace con los dos labios.',
    palabras: [w('very', 'véri', 'muy'), w('seven', 'séven', 'siete'), w('five', 'fáiv', 'cinco'), w('vowel', 'váuel', 'vocal')],
    pares: [['very', 'berry'], ['van', 'ban'], ['vest', 'best']],
  },
  {
    id: 'i-ee',
    titulo: 'I corta y EE larga',
    ejemplo: 'ship / sheep',
    boca: 'La “i” de ship es corta y relajada, casi entre i y e. La “ee” de sheep es larga, sonriendo.',
    palabras: [w('sit', 'sit', 'sentarse'), w('seat', 'siit', 'asiento'), w('it', 'it', 'eso'), w('eat', 'iit', 'comer')],
    pares: [['ship', 'sheep'], ['sit', 'seat'], ['live', 'leave'], ['fill', 'feel']],
  },
  {
    id: 'sh-ch',
    titulo: 'SH y CH',
    ejemplo: 'she',
    boca: 'SH: soplas sin tocar nada, como cuando pides silencio (shhh). CH: como en “chocolate”.',
    palabras: [w('she', 'shi', 'ella'), w('shoes', 'shus', 'zapatos'), w('chair', 'cher', 'silla'), w('teacher', 'tícher', 'profesor(a)')],
    pares: [['ship', 'chip'], ['shoes', 'choose'], ['wash', 'watch'], ['sheep', 'cheap']],
  },
  {
    id: 'h',
    titulo: 'H que sí suena',
    ejemplo: 'hello',
    boca: 'La H inglesa suena: es como una “j” muy suave, solo aire que sale de la garganta.',
    palabras: [w('hello', 'jeló', 'hola'), w('house', 'jáus', 'casa'), w('happy', 'jápi', 'feliz'), w('hand', 'jand', 'mano')],
    pares: [['hat', 'at'], ['hand', 'and'], ['hear', 'ear']],
  },
  {
    id: 's-inicial',
    titulo: 'S al comienzo',
    ejemplo: 'school',
    boca: 'Nunca pongas una “e” antes: es “school”, no “eschool”. Empieza directo con la “sss”.',
    palabras: [w('school', 'skul', 'colegio'), w('student', 'stúdent', 'estudiante'), w('Spanish', 'spánish', 'español'), w('star', 'star', 'estrella')],
    pares: [],
  },
  {
    id: 'j-y',
    titulo: 'J y Y',
    ejemplo: 'job',
    boca: 'La J inglesa suena como “dy” fuerte (como la “ll” de Argentina). La Y es suave, como la “i”.',
    palabras: [w('job', 'yob', 'trabajo'), w('juice', 'yus', 'jugo'), w('yes', 'iés', 'sí'), w('yellow', 'iélou', 'amarillo')],
    pares: [['jet', 'yet'], ['jam', 'yam'], ['joke', 'yolk']],
  },
  {
    id: 'w',
    titulo: 'W',
    ejemplo: 'water',
    boca: 'Labios redondos como para dar un beso y luego ábrelos: water suena “uórer”.',
    palabras: [w('water', 'uórer', 'agua'), w('window', 'uíndou', 'ventana'), w('what', 'uát', 'qué'), w('we', 'uí', 'nosotros')],
    pares: [['west', 'vest'], ['wine', 'vine'], ['wet', 'vet']],
  },
  {
    id: 'ed',
    titulo: 'Pasados con -ed',
    ejemplo: 'walked',
    boca: 'La terminación -ed casi nunca suena “ed”. Walked suena “uókt” y played “pléid”. Solo suena “id” después de t o d: wanted = “uántid”.',
    palabras: [w('walked', 'uókt', 'caminó'), w('played', 'pléid', 'jugó'), w('wanted', 'uántid', 'quiso'), w('jumped', 'yampt', 'saltó')],
    pares: [],
  },
];
