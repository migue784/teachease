// Guion del video de presentación de TeachEase.
// Este archivo manda: el video toma de aquí los tiempos de cada escena, la
// versión de ensayo muestra estos textos como teleprompter y GUION.md se genera
// a partir de aquí (npm run guion). Si cambian un texto, cambien solo este archivo.
// ini y fin están en segundos.

window.GUION = [
  {
    id: 'apertura', ini: 0, fin: 7, seccion: 'Introducción', titulo: 'Apertura',
    pantalla: 'Se dibuja un círculo, aparece el robot y luego el nombre con el eslogan.',
    voz: 'Esto es TeachEase: tu apoyo silencioso en el aula.',
    entra: 1.5,
  },
  {
    id: 'gancho', ini: 7, fin: 22, seccion: 'Introducción', titulo: 'El problema',
    pantalla: 'Una docente frente al tablero; alrededor aparecen sus dudas.',
    voz: 'Imagina esto: mañana te toca dar la clase de inglés… pero nadie te preparó para eso. ¿Cómo se dice? ¿Y si me equivoco? ¿Y si los niños se dan cuenta?',
  },
  {
    id: 'respuesta', ini: 22, fin: 34, seccion: 'Introducción', titulo: 'La respuesta',
    pantalla: 'Aparece el robot de TeachEase con el nombre y la frase de la marca.',
    voz: 'Para eso creamos TeachEase: un aliado que te acompaña en silencio, para que enseñar deje de ser un miedo y se convierta en una oportunidad de crecer.',
  },
  {
    id: 'mapa', ini: 34, fin: 42, seccion: 'Introducción', titulo: 'Lo que vas a ver',
    pantalla: 'Tres tarjetas: ¿De qué se trata? · ¿Qué soluciona? · ¿Cómo funciona?',
    voz: 'En los próximos minutos te contamos de qué se trata, qué soluciona y cómo funciona.',
  },
  {
    id: 'que-es', ini: 42, fin: 68, seccion: '1 · ¿De qué se trata?', titulo: '¿De qué se trata?',
    pantalla: 'Título de la sección y luego la app en un celular con sus tres ideas clave.',
    voz: 'TeachEase es una aplicación para docentes y auxiliares educativos que necesitan aprender y fortalecer una segunda lengua, empezando por el inglés. Se instala en el celular directamente desde el navegador, sin pasar por ninguna tienda, y sigue funcionando aunque no haya internet. Es práctica, flexible y está pensada para el día a día del aula.',
  },
  {
    id: 'soluciona', ini: 68, fin: 98, seccion: '2 · ¿Qué soluciona?', titulo: '¿Qué soluciona?',
    pantalla: 'Comparación: "Hoy" contra "Con TeachEase". Cierra con "Menos miedo. Más confianza."',
    voz: 'Hoy, muchos docentes deben enseñar una segunda lengua sin haber recibido la formación necesaria. Eso trae inseguridad, clases improvisadas y oportunidades laborales que se pierden. Con TeachEase, el docente llega preparado: sabe qué decir, cómo pronunciarlo y qué actividad hacer. Menos miedo. Más confianza.',
  },
  {
    id: 'como', ini: 98, fin: 104, seccion: '3 · ¿Cómo funciona?', titulo: '¿Cómo funciona?',
    pantalla: 'Título de la sección y los tres pasos: Aprende · Prepara · Enseña.',
    voz: '¿Cómo funciona? En tres pasos: aprende, prepara y enseña.',
  },
  {
    id: 'aprende', ini: 104, fin: 124, seccion: '3 · ¿Cómo funciona?', titulo: 'Paso 1 · Aprende',
    pantalla: 'Tres pantallas: prueba de nivel, una lección y el entrenador de pronunciación.',
    voz: 'Primero, aprendes a tu ritmo. Una prueba corta te ubica en tu nivel y una ruta de lecciones te enseña el inglés que de verdad usas en clase. Y para la pronunciación, puedes grabar tu voz y compararla con el modelo.',
  },
  {
    id: 'prepara', ini: 124, fin: 142, seccion: '3 · ¿Cómo funciona?', titulo: 'Paso 2 · Prepara',
    pantalla: 'Tres pantallas: el plan de clase, el bingo y las tarjetas para proyectar.',
    voz: 'Después, preparas tu clase en minutos. Eliges el tema y TeachEase te arma el paso a paso, con actividades, tarjetas para proyectar, bingo y hojas para imprimir.',
  },
  {
    id: 'ensena', ini: 142, fin: 164, seccion: '3 · ¿Cómo funciona?', titulo: 'Paso 3 · Enseña',
    pantalla: 'Tres pantallas: Modo Aula con susurro, el temporizador y el semáforo de ruido.',
    voz: 'Y en el aula, llega tu apoyo silencioso. En el Modo Aula escribes lo que quieres decir y la app te dice cómo se dice en inglés, incluso en voz bajita, solo para ti. Además tienes temporizador, ruleta y un semáforo que ayuda a controlar el ruido.',
  },
  {
    id: 'cierre', ini: 164, fin: 180, seccion: 'Cierre', titulo: 'Cierre',
    pantalla: 'Logo, eslogan, código QR para abrir la app y nombres del equipo.',
    voz: 'TeachEase. Tu apoyo silencioso en el aula. Escanea el código y pruébala hoy mismo.',
  },
];

window.DURACION = 180;
