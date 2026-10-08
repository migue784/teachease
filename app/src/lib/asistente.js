import { FRASES } from '../datos/frases';
import { PALABRAS, TEMAS } from '../datos/temas';

// Asistente de TeachEase.
// 1) Intenta la IA (función /api/asistente, que llama a Claude desde el servidor).
// 2) Si no hay internet o la IA no está configurada, responde con el contenido
//    de la app: así nunca deja a la persona sola en medio de una clase.

const sinTildes = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const limpiar = (t) => sinTildes(t).replace(/[¿?¡!.,;:"“”'’]/g, ' ').replace(/\s+/g, ' ').trim();
const TODO = [...FRASES, ...PALABRAS];

function buscar(texto, campo) {
  const q = limpiar(texto);
  if (!q) return [];
  const palabrasQ = q.split(' ').filter((w) => w.length > 2);
  return TODO.map((f) => {
    const c = limpiar(f[campo]);
    let puntos = 0;
    if (c === q) puntos = 100;
    else if (c.includes(q)) puntos = 70 - Math.min(30, c.length - q.length);
    else puntos = palabrasQ.filter((w) => c.includes(w)).length * 15;
    return { f, puntos };
  })
    .filter((r) => r.puntos > 0)
    .sort((a, b) => b.puntos - a.puntos)
    .slice(0, 3)
    .map((r) => r.f);
}

export function responderLocal(mensaje, perfil) {
  const t = limpiar(mensaje);

  const pideDecir = t.match(/(?:como (?:se )?(?:dice|digo|pregunto)|como le digo|traduce|traduceme|en ingles)\s*(?:en ingles)?\s*(.*)/);
  if (pideDecir) {
    const objetivo = (pideDecir[1] || t).replace(/\ben ingles\b/g, '').replace(/^(que|a mis estudiantes|a los ninos)\s+/, '').trim();
    const encontradas = buscar(objetivo || t, 'es');
    if (encontradas.length) {
      return {
        texto: encontradas.length === 1 ? 'Así se dice:' : 'Te dejo las opciones más cercanas:',
        frases: encontradas,
      };
    }
    return {
      texto: `Todavía no tengo “${objetivo}” en mi banco de frases sin conexión. Cuando el asistente con IA esté activo, te lo traduzco al instante. Mientras tanto, mira el Modo Aula: tiene más de 40 frases para clase.`,
      enlaces: [{ texto: 'Abrir Modo Aula', href: '#/aula' }],
    };
  }

  const pideSignificado = t.match(/(?:que significa|que quiere decir|what does|meaning of)\s+(.*)/);
  if (pideSignificado) {
    const encontradas = buscar(pideSignificado[1].replace(/\bmean\b/, ''), 'en');
    if (encontradas.length) return { texto: 'Significa:', frases: encontradas };
  }

  const tema = TEMAS.find((x) => t.includes(limpiar(x.nombre)) || t.includes(x.id) || x.palabras.some((p) => t.includes(limpiar(p.es)) && limpiar(p.es).length > 3));
  if (tema && /(clase|actividad|ensenar|ensen|juego|idea|preparar|planear)/.test(t)) {
    return {
      texto: `¡Claro! Para ${tema.nombre.toLowerCase()} te armo una clase completa con calentamiento, práctica y cierre. La frase modelo sería: “${tema.modelo.en}” (${tema.modelo.es}).`,
      enlaces: [
        { texto: `Preparar clase de ${tema.nombre}`, href: `#/preparar?tema=${tema.id}` },
        { texto: 'Practicar el vocabulario', href: `#/practicar?tema=${tema.id}` },
      ],
    };
  }

  if (/pronunci|como suena|acento/.test(t)) {
    return {
      texto: 'Un truco: escucha la palabra despacio (botón de la tortuga), repítela en voz alta tres veces y luego grábate en Pronunciación. La “th” se dice con la lengua entre los dientes, como una “z” española.',
      enlaces: [{ texto: 'Ir a practicar pronunciación', href: '#/practicar' }],
    };
  }

  if (/(miedo|nervios|no se ingles|me da pena|inseguro|insegura)/.test(t)) {
    return {
      texto: `Es normal, ${perfil?.nombre || 'profe'}. No necesitas un inglés perfecto para enseñar bien: necesitas preparar las frases que vas a usar. Prepara tu clase aquí y practica solo esas palabras; mañana entras con todo listo.`,
      enlaces: [{ texto: 'Preparar mi clase', href: '#/preparar' }],
    };
  }

  if (/^(hola|hello|hi|buenas|buenos dias|buenas tardes)/.test(t)) {
    return { texto: `¡Hola, ${perfil?.nombre || 'profe'}! ¿Qué vas a enseñar hoy? Pregúntame cómo se dice algo o pídeme una idea para tu clase.` };
  }
  if (/gracias|thank/.test(t)) return { texto: '¡Con gusto! Aquí estoy cuando me necesites. You’re welcome!' };

  return {
    texto: 'Puedo ayudarte con esto:',
    sugerencias: ['¿Cómo se dice “silencio, por favor”?', '¿Qué significa “line up”?', 'Dame una idea de clase de colores', 'Me da miedo hablar en inglés'],
  };
}

export async function responder(historial, perfil) {
  const ultimo = historial[historial.length - 1]?.texto || '';
  if (navigator.onLine) {
    try {
      const control = new AbortController();
      const espera = setTimeout(() => control.abort(), 25000);
      const r = await fetch('/api/asistente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          perfil: { nombre: perfil?.nombre, rol: perfil?.rol, grado: perfil?.grado, nivel: perfil?.nivel },
          mensajes: historial.slice(-12).map((m) => ({ role: m.de === 'yo' ? 'user' : 'assistant', content: m.texto })),
        }),
        signal: control.signal,
      });
      clearTimeout(espera);
      if (r.ok && r.headers.get('content-type')?.includes('application/json')) {
        const datos = await r.json();
        if (datos.texto) return { texto: datos.texto, ia: true };
      }
    } catch {
      /* sin IA: seguimos con la respuesta local */
    }
  }
  return responderLocal(ultimo, perfil);
}
