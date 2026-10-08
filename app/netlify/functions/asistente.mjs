// Función del servidor (Netlify) para el asistente con IA de TeachEase.
// La clave de Anthropic vive solo aquí, como variable de entorno ANTHROPIC_API_KEY,
// y nunca llega al celular. Si no está configurada, la app usa sus respuestas locales.
import Anthropic from '@anthropic-ai/sdk';

const SISTEMA = `Eres el asistente de TeachEase, "tu apoyo silencioso en el aula".
Acompañas a docentes y auxiliares educativos hispanohablantes (sobre todo de Colombia) que deben enseñar inglés y todavía están fortaleciendo su propio nivel.

Cómo respondes:
- En español, cercano y paciente, tuteando. Nunca haces sentir mal a la persona por no saber.
- Breve: se lee en un celular, muchas veces en medio de una clase. Máximo 6 líneas salvo que pidan un plan de clase.
- Cuando des una frase en inglés, agrega cómo suena escrita para un hispanohablante y su significado. Formato: Frase en inglés — significado (se dice "pronunciación aproximada").
- Para ideas de clase: actividades concretas, cortas y sin materiales costosos, adaptadas al grado si lo sabes.
- Texto plano sin markdown: nada de asteriscos ni almohadillas. Para listas usa "•".
- Si te preguntan algo que no tiene que ver con enseñar o aprender idiomas, responde amablemente en una línea y vuelve al tema.`;

const json = (cuerpo, status = 200) =>
  new Response(JSON.stringify(cuerpo), { status, headers: { 'Content-Type': 'application/json' } });

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Usa POST' }, 405);
  if (!process.env.ANTHROPIC_API_KEY) return json({ error: 'IA no configurada' }, 503);

  let datos;
  try {
    datos = await req.json();
  } catch {
    return json({ error: 'Cuerpo inválido' }, 400);
  }

  // Solo texto, mensajes cortos y la historia reciente (controla el costo)
  const mensajes = (Array.isArray(datos.mensajes) ? datos.mensajes : [])
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-12)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 1500) }));
  while (mensajes.length && mensajes[0].role !== 'user') mensajes.shift();
  if (!mensajes.length) return json({ error: 'Sin mensajes' }, 400);

  const p = datos.perfil || {};
  const contexto = `Datos de la persona: nombre ${p.nombre || 'sin nombre'}, rol ${p.rol || 'docente'}, enseña en ${p.grado || 'primaria'}, nivel de inglés ${p.nivel || 'básico'}.`;

  const client = new Anthropic();
  try {
    const r = await client.beta.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 16000,
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      output_config: { effort: 'low' },
      system: [
        { type: 'text', text: SISTEMA, cache_control: { type: 'ephemeral' } },
        { type: 'text', text: contexto },
      ],
      messages: mensajes,
    });

    if (r.stop_reason === 'refusal') {
      return json({ texto: 'Esa pregunta no la puedo responder. ¿Te ayudo con algo para tu clase de inglés?' });
    }
    const texto = r.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();
    return json({ texto: texto || 'No logré armar una respuesta. ¿Me lo preguntas de otra forma?' });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) return json({ error: 'Clave de IA inválida' }, 503);
    if (error instanceof Anthropic.RateLimitError) return json({ error: 'Demasiadas preguntas seguidas' }, 429);
    if (error instanceof Anthropic.APIError) return json({ error: `Error de la IA (${error.status})` }, 502);
    return json({ error: 'No se pudo contactar la IA' }, 502);
  }
};

export const config = { path: '/api/asistente' };
