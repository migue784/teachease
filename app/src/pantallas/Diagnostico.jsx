import { useEffect, useState } from 'react';
import { X, Volume2, ArrowRight, Target } from 'lucide-react';
import { PREGUNTAS, nivelPorPuntaje } from '../datos/diagnostico';
import { INICIO_POR_NIVEL, leccionPorId } from '../datos/ruta';
import { guardarNivelPrueba, sumarPuntos } from '../lib/progreso';
import { usePersistente } from '../lib/almacen';
import { hablar } from '../lib/voz';
import { ir } from '../lib/ruta';

const TEXTO_NIVEL = {
  basico: ['Estás empezando', 'Vamos desde lo esencial: saludar, presentarte y empezar la clase. En pocas semanas vas a sentir la diferencia.'],
  intermedio: ['Te defiendes', 'Ya tienes base. Empezamos por dar instrucciones claras y hacer preguntas en clase.'],
  avanzado: ['Tienes buen nivel', 'Vamos a pulir: animar, corregir con cariño y manejar el grupo en inglés.'],
};

export default function Diagnostico() {
  const [i, setI] = useState(-1);
  const [puntos, setPuntos] = useState(0);
  const [elegida, setElegida] = useState(null);
  const [perfil, setPerfil] = usePersistente('perfil', null);
  const q = PREGUNTAS[i];

  useEffect(() => {
    if (q?.tipo === 'escuchar') {
      const t = setTimeout(() => hablar(q.audio), 400);
      return () => clearTimeout(t);
    }
  }, [q]);

  if (i === -1) {
    return (
      <div className="pila" style={{ alignItems: 'center', textAlign: 'center', gap: 16, paddingTop: 30 }}>
        <span style={{ width: 84, height: 84, borderRadius: 28, background: 'var(--degradado)', display: 'grid', placeItems: 'center', color: '#fff' }}>
          <Target size={40} />
        </span>
        <h1 style={{ fontSize: 26, fontWeight: 600 }}>¿Por dónde empezamos?</h1>
        <p className="sub" style={{ maxWidth: 330 }}>
          12 preguntas cortas, unos 3 minutos. Algunas tienen audio: sube el volumen. No es un examen, es para ubicarte.
        </p>
        <button className="boton prim ancho" onClick={() => setI(0)}>
          Empezar <ArrowRight size={18} />
        </button>
        <button className="boton sec ancho" onClick={() => ir('aprender')}>
          Ahora no
        </button>
      </div>
    );
  }

  if (i >= PREGUNTAS.length) {
    const nivel = nivelPorPuntaje(puntos);
    const [titulo, texto] = TEXTO_NIVEL[nivel];
    const primera = leccionPorId(INICIO_POR_NIVEL[nivel]);
    return (
      <div className="pila" style={{ alignItems: 'center', textAlign: 'center', gap: 16, paddingTop: 30 }}>
        <p className="sub">
          {puntos} de {PREGUNTAS.length} respuestas correctas
        </p>
        <h1 style={{ fontSize: 28, fontWeight: 600 }}>{titulo}</h1>
        <p className="sub" style={{ maxWidth: 340, fontSize: 15.5 }}>
          {texto}
        </p>
        <button
          className="boton prim ancho"
          onClick={() => {
            guardarNivelPrueba(nivel);
            if (perfil) setPerfil({ ...perfil, nivel });
            sumarPuntos(20);
            ir('leccion', { id: primera.id });
          }}
        >
          Empezar con “{primera.titulo}” <ArrowRight size={18} />
        </button>
        <button
          className="boton sec ancho"
          onClick={() => {
            guardarNivelPrueba(nivel);
            if (perfil) setPerfil({ ...perfil, nivel });
            ir('aprender');
          }}
        >
          Ver toda la ruta
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="fila" style={{ gap: 12 }}>
        <button className="volver" onClick={() => ir('aprender')} aria-label="Salir de la prueba">
          <X size={20} />
        </button>
        <div className="barra" style={{ flex: 1 }}>
          <i style={{ width: `${(i / PREGUNTAS.length) * 100}%` }} />
        </div>
        <span className="sub dato">
          {i + 1}/{PREGUNTAS.length}
        </span>
      </header>
      <section className="tarjeta pila" style={{ alignItems: 'center', textAlign: 'center', padding: '26px 18px', gap: 14 }}>
        <p style={{ fontSize: 19, fontWeight: 600, lineHeight: 1.35, textWrap: 'balance' }}>{q.enunciado}</p>
        {q.tipo === 'escuchar' && (
          <button className="boton prim" style={{ minWidth: 72, minHeight: 72, borderRadius: 24 }} onClick={() => hablar(q.audio)} aria-label="Escuchar otra vez">
            <Volume2 size={30} />
          </button>
        )}
      </section>
      <div className="pila" style={{ gap: 10 }}>
        {q.opciones.map((op, k) => {
          const bien = elegida !== null && k === q.correcta;
          const mal = elegida === k && k !== q.correcta;
          return (
            <button
              key={op}
              className="tarjeta"
              disabled={elegida !== null}
              onClick={() => {
                setElegida(k);
                if (k === q.correcta) setPuntos((n) => n + 1);
              }}
              style={{
                textAlign: 'left', fontWeight: 500, fontSize: 16, border: '2px solid transparent', color: 'var(--texto)',
                borderColor: bien ? 'var(--exito)' : mal ? 'var(--alerta)' : 'transparent',
                background: bien ? 'var(--exito-fondo)' : mal ? 'var(--alerta-fondo)' : undefined,
              }}
            >
              {op}
            </button>
          );
        })}
      </div>
      {elegida !== null && (
        <button
          className="boton prim ancho"
          onClick={() => {
            setElegida(null);
            setI(i + 1);
          }}
        >
          Siguiente <ArrowRight size={18} />
        </button>
      )}
    </>
  );
}
