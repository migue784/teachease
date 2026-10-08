import { useMemo, useState } from 'react';
import { Share2, Check, Layers, Clock } from 'lucide-react';
import { TEMAS, temaPorId } from '../datos/temas';
import { ACTIVIDADES } from '../datos/actividades';
import { FRASES } from '../datos/frases';
import { ir } from '../lib/ruta';
import { sumarPuntos } from '../lib/progreso';
import { Encabezado, Escuchar, avisar } from '../componentes/comunes';

const DURACIONES = [30, 45, 60];
const PALABRAS_POR_GRADO = { Preescolar: 5, Primaria: 7, Secundaria: 12, Varios: 7 };
const frase = (id) => FRASES.find((f) => f.id === id);

// Arma una clase completa a partir del tema, el grado y la duración
function armarClase(tema, grado, minutos) {
  const reparto = [0.1, 0.15, 0.2, 0.25, 0.2, 0.1].map((x) => Math.max(3, Math.round(x * minutos)));
  const palabras = tema.palabras.slice(0, PALABRAS_POR_GRADO[grado] || 7);
  const [a1, a2, a3] = tema.actividades.map((id) => ({ id, ...ACTIVIDADES[id] }));
  return {
    objetivo: `Al final de la clase, los estudiantes reconocen y dicen ${palabras.length} palabras de “${tema.nombre.toLowerCase()}” y usan la frase: “${tema.modelo.en}”`,
    palabras,
    bloques: [
      { titulo: 'Saludo y rutina', min: reparto[0], pasos: ['Saluda en inglés y pregunta el día.', 'Presenta el tema de hoy con una imagen o un objeto.'], frases: [frase('inicio-0'), frase('inicio-6')] },
      { titulo: `Calentamiento · ${a1.nombre}`, min: reparto[1], pasos: a1.pasos(tema), materiales: a1.materiales },
      { titulo: 'Presentación del vocabulario', min: reparto[2], pasos: ['Di cada palabra dos veces mostrando la imagen (usa los botones de escuchar si quieres).', 'El grupo repite: primero en coro, luego por filas, luego voluntarios.', `Introduce la frase modelo: “${tema.modelo.en}”`], frases: [frase('instrucciones-1'), frase('instrucciones-0')] },
      { titulo: `Práctica · ${a2.nombre}`, min: reparto[3], pasos: a2.pasos(tema), materiales: a2.materiales, frases: [frase('instrucciones-3'), frase('felicitar-0')] },
      { titulo: `Producción · ${a3.nombre}`, min: reparto[4], pasos: a3.pasos(tema), materiales: a3.materiales, frases: [frase('felicitar-4')] },
      { titulo: 'Cierre', min: reparto[5], pasos: ['Repasen juntos las palabras más difíciles.', 'Cada estudiante dice una palabra antes de salir (“exit ticket”).'], frases: [frase('cierre-1'), frase('cierre-4')] },
    ],
  };
}

function comoTexto(tema, clase, minutos) {
  const l = [`Clase de inglés: ${tema.nombre} (${minutos} min) — preparada con TeachEase`, '', `Objetivo: ${clase.objetivo}`, '', 'Vocabulario:'];
  clase.palabras.forEach((p) => l.push(`• ${p.en} — ${p.es} (se dice "${p.fon}")`));
  clase.bloques.forEach((b) => {
    l.push('', `${b.titulo} (${b.min} min)`);
    b.pasos.forEach((s, i) => l.push(`${i + 1}. ${s}`));
    if (b.frases?.length) l.push(`Frases: ${b.frases.map((f) => f.en).join(' / ')}`);
  });
  return l.join('\n');
}

export default function Preparar({ params, perfil }) {
  const [temaId, setTemaId] = useState(params.tema || null);
  const [minutos, setMinutos] = useState(45);
  const [grado, setGrado] = useState(perfil.grado || 'Primaria');
  const tema = temaPorId(temaId);
  const clase = useMemo(() => tema && armarClase(tema, grado, minutos), [tema, grado, minutos]);

  if (!tema) {
    return (
      <>
        <Encabezado titulo="Prepara tu clase" sub="¿Qué tema vas a enseñar?" volver />
        <div className="grid2">
          {TEMAS.map((t) => (
            <button key={t.id} className="tarjeta fila" style={{ border: 0, gap: 10, textAlign: 'left' }} onClick={() => setTemaId(t.id)}>
              <span style={{ fontSize: 26 }} aria-hidden="true">
                {t.emoji}
              </span>
              <b style={{ fontSize: 15, lineHeight: 1.25 }}>{t.nombre}</b>
            </button>
          ))}
        </div>
        <p className="aviso info">Pronto: escribe cualquier tema y el asistente con inteligencia artificial te arma la clase.</p>
      </>
    );
  }

  const compartir = async () => {
    const texto = comoTexto(tema, clase, minutos);
    try {
      if (navigator.share) {
        await navigator.share({ title: `Clase: ${tema.nombre}`, text: texto });
        return;
      }
      await navigator.clipboard.writeText(texto);
      avisar('Clase copiada. Pégala en WhatsApp o en tus notas');
    } catch (e) {
      if (e?.name !== 'AbortError') avisar('No se pudo compartir en este navegador');
    }
  };

  return (
    <>
      <Encabezado titulo={`${tema.emoji} ${tema.nombre}`} sub="Tu clase, paso a paso" volver />

      <div className="pila" style={{ gap: 10 }}>
        <div className="chips" role="group" aria-label="Duración">
          {DURACIONES.map((m) => (
            <button key={m} className="chip" aria-pressed={minutos === m} onClick={() => setMinutos(m)}>
              <Clock size={13} style={{ verticalAlign: -2 }} /> {m} min
            </button>
          ))}
          {Object.keys(PALABRAS_POR_GRADO).map((g) => (
            <button key={g} className="chip" aria-pressed={grado === g} onClick={() => setGrado(g)}>
              {g}
            </button>
          ))}
        </div>
      </div>

      <section className="tarjeta oscura pila" style={{ gap: 6 }}>
        <span className="seccion-titulo" style={{ color: 'var(--turquesa-claro)', margin: 0 }}>
          Objetivo
        </span>
        <p style={{ lineHeight: 1.5 }}>{clase.objetivo}</p>
      </section>

      <section className="tarjeta" style={{ padding: 6 }}>
        <p className="seccion-titulo" style={{ padding: '10px 12px 4px', margin: 0 }}>
          Vocabulario ({clase.palabras.length})
        </p>
        {clase.palabras.map((p, i) => (
          <div key={p.en} className="fila" style={{ padding: '9px 12px', borderTop: i ? '1px solid var(--linea)' : 0 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b>{p.en}</b> <span className="sub">· {p.es}</span>
              <p className="fon">“{p.fon}”</p>
            </div>
            <Escuchar texto={p.en} tam={36} />
          </div>
        ))}
      </section>

      <ol className="pila" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {clase.bloques.map((b, k) => (
          <li key={b.titulo} className="tarjeta pila" style={{ gap: 10 }}>
            <div className="fila" style={{ alignItems: 'flex-start' }}>
              <span style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--violeta)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 600, flex: 'none' }}>
                {k + 1}
              </span>
              <b style={{ flex: 1, lineHeight: 1.35 }}>{b.titulo}</b>
              <span className="sub dato" style={{ whiteSpace: 'nowrap' }}>
                {b.min} min
              </span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {b.pasos.map((s) => (
                <li key={s} style={{ fontSize: 14.5, lineHeight: 1.5 }}>
                  {s}
                </li>
              ))}
            </ul>
            {b.materiales && <p className="sub">Materiales: {b.materiales}</p>}
            {b.frases?.filter(Boolean).map((f) => (
              <div key={f.id} className="fila" style={{ background: 'var(--superficie-2)', borderRadius: 14, padding: '8px 8px 8px 12px', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <b style={{ fontSize: 14.5 }}>{f.en}</b>
                  <p className="sub" style={{ fontSize: 12.5 }}>
                    {f.es}
                  </p>
                </div>
                <Escuchar texto={f.en} tam={36} />
              </div>
            ))}
          </li>
        ))}
      </ol>

      <div className="grid2">
        <button className="boton sec" onClick={compartir}>
          <Share2 size={18} /> Compartir
        </button>
        <button className="boton sec" onClick={() => ir('practicar', { tema: tema.id })}>
          <Layers size={18} /> Practicar
        </button>
      </div>
      <button
        className="boton prim ancho"
        onClick={() => {
          sumarPuntos(20, { clases: 1 });
          avisar('¡Clase lista! Mañana lo vas a hacer muy bien');
          ir('inicio');
        }}
      >
        <Check size={18} /> Marcar como preparada
      </button>
    </>
  );
}
