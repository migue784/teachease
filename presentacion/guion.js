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
    pantalla: 'Una docente frente al tablero, que saluda en varios idiomas; alrededor aparecen sus dudas.',
    voz: 'Imagina esto: mañana te toca enseñar inglés, francés o portugués… pero nadie te preparó para eso. ¿Cómo se dice? ¿Y si me equivoco? ¿Y si los niños se dan cuenta?',
  },
  {
    id: 'respuesta', ini: 22, fin: 34, seccion: 'Introducción', titulo: 'La respuesta',
    pantalla: 'Aparece el robot de TeachEase con el nombre y la frase de la marca.',
    voz: 'Para eso creamos TeachEase: un aliado que te acompaña en silencio, para que enseñar deje de ser un miedo y se convierta en una oportunidad de crecer.',
  },
  {
    id: 'que-es', ini: 34, fin: 60, seccion: '¿De qué se trata?', titulo: '¿De qué se trata?',
    pantalla: 'La app en un celular, sus ideas clave y los idiomas que cubre.',
    voz: 'TeachEase es una aplicación para docentes y auxiliares educativos que necesitan aprender y fortalecer una segunda lengua: inglés, francés, portugués, alemán, italiano y los demás idiomas principales. Se instala en el celular directamente desde el navegador, sin pasar por ninguna tienda, y sigue funcionando aunque no haya internet. Es práctica, flexible y está pensada para el día a día del aula.',
  },
  {
    id: 'soluciona', ini: 60, fin: 90, seccion: '¿Qué soluciona?', titulo: '¿Qué soluciona?',
    pantalla: 'Comparación: "Hoy" contra "Con TeachEase". Cierra con "Menos miedo. Más confianza."',
    voz: 'Hoy, muchos docentes deben enseñar una segunda lengua sin haber recibido la formación necesaria. Eso trae inseguridad, clases improvisadas y oportunidades laborales que se pierden. Con TeachEase, el docente llega preparado: sabe qué decir, cómo pronunciarlo y qué actividad hacer. Menos miedo. Más confianza.',
  },
  {
    id: 'como', ini: 90, fin: 96, seccion: '¿Cómo funciona?', titulo: '¿Cómo funciona?',
    pantalla: '¿Cómo funciona? y los tres pasos: Aprende · Prepara · Enseña.',
    voz: '¿Cómo funciona? En tres pasos: aprende, prepara y enseña.',
  },
  {
    id: 'aprende', ini: 96, fin: 116, seccion: '¿Cómo funciona?', titulo: 'Paso 1 · Aprende',
    pantalla: 'Tres pantallas: prueba de nivel, una lección y el entrenador de pronunciación.',
    voz: 'Primero, aprendes a tu ritmo. Una prueba corta te ubica en tu nivel y una ruta de lecciones te enseña el idioma que de verdad usas en clase. Y para la pronunciación, puedes grabar tu voz y compararla con el modelo.',
  },
  {
    id: 'prepara', ini: 116, fin: 134, seccion: '¿Cómo funciona?', titulo: 'Paso 2 · Prepara',
    pantalla: 'Tres pantallas: el plan de clase, el bingo y las tarjetas para proyectar.',
    voz: 'Después, preparas tu clase en minutos. Eliges el tema y TeachEase te arma el paso a paso, con actividades, tarjetas para proyectar, bingo y hojas para imprimir.',
  },
  {
    id: 'ensena', ini: 134, fin: 156, seccion: '¿Cómo funciona?', titulo: 'Paso 3 · Enseña',
    pantalla: 'Tres pantallas: Modo Aula con susurro, el temporizador y el semáforo de ruido.',
    voz: 'Y en el aula, llega tu apoyo silencioso. En el Modo Aula escribes lo que quieres decir y la app te dice cómo se dice en el idioma que enseñas, incluso en voz bajita, solo para ti. Además tienes temporizador, ruleta y un semáforo que ayuda a controlar el ruido.',
  },
  {
    id: 'cierre', ini: 156, fin: 172, seccion: 'Cierre', titulo: 'Cierre',
    pantalla: 'Logo, eslogan, código QR para abrir la app y nombres del equipo.',
    voz: 'TeachEase. Tu apoyo silencioso en el aula. Escanea el código y pruébala hoy mismo.',
  },
];

window.DURACION = 172;
