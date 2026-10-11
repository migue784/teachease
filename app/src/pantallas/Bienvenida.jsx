import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { guardar } from '../lib/almacen';
import { BotonInstalar } from '../componentes/Instalar';

const ROLES = ['Docente', 'Auxiliar educativo', 'Practicante', 'Otro'];
const GRADOS = ['Preescolar', 'Primaria', 'Secundaria', 'Varios'];
const NIVELES = [
  ['basico', 'Estoy empezando', 'Sé pocas palabras y me da miedo hablar'],
  ['intermedio', 'Me defiendo', 'Entiendo lo básico, me falta práctica'],
  ['avanzado', 'Tengo buen nivel', 'Quiero pulir pronunciación y recursos'],
];
const METAS = [5, 10, 15];

// Primera vez que se abre la app: tres preguntas cortas para personalizarla
export default function Bienvenida() {
  const [paso, setPaso] = useState(0);
  const [datos, setDatos] = useState({ nombre: '', rol: 'Docente', grado: 'Primaria', nivel: 'basico', meta: 10 });
  const cambia = (k, v) => setDatos((d) => ({ ...d, [k]: v }));

  const terminar = () => {
    guardar('perfil', { ...datos, nombre: datos.nombre.trim(), desde: new Date().toISOString() });
    window.location.hash = '/inicio';
  };

  return (
    <main
      className="contenido"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 28px)', justifyContent: paso === 0 ? 'center' : 'flex-start', minHeight: '100dvh' }}
    >
      {paso === 0 && (
        <div className="pila" style={{ gap: 22, textAlign: 'center', alignItems: 'center' }}>
          <img src="marca/logo-vertical.svg" alt="TeachEase, tu apoyo silencioso en el aula" style={{ width: 'min(280px, 76vw)' }} className="robot-vivo" />
          <p className="sub" style={{ fontSize: 16, maxWidth: 360 }}>
            Aprende y fortalece tu inglés para enseñar con confianza. Practica a tu ritmo y ten a la mano lo que necesitas decir en clase.
          </p>
          <button className="boton prim ancho" style={{ maxWidth: 360 }} onClick={() => setPaso(1)}>
            Empezar <ArrowRight size={18} />
          </button>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <BotonInstalar />
          </div>
        </div>
      )}

      {paso === 1 && (
        <div className="pila" style={{ gap: 18 }}>
          <Progreso paso={1} />
          <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>¡Hola! ¿Cómo te llamas?</h1>
          <label className="pila" style={{ gap: 6 }}>
            <span className="sub">Tu nombre</span>
            <input id="nombre" className="campo" value={datos.nombre} onChange={(e) => cambia('nombre', e.target.value)} placeholder="Ej.: Paola" autoComplete="given-name" autoFocus />
          </label>
          <Grupo titulo="¿Cuál es tu rol?" opciones={ROLES} valor={datos.rol} alElegir={(v) => cambia('rol', v)} />
          <Grupo titulo="¿Con qué grado trabajas?" opciones={GRADOS} valor={datos.grado} alElegir={(v) => cambia('grado', v)} />
          <button className="boton prim ancho" disabled={!datos.nombre.trim()} onClick={() => setPaso(2)}>
            Continuar
          </button>
        </div>
      )}

      {paso === 2 && (
        <div className="pila" style={{ gap: 18 }}>
          <Progreso paso={2} />
          <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em' }}>¿Cómo va tu inglés, {datos.nombre.trim()}?</h1>
          <p className="sub">Sin presión: esto solo ajusta por dónde empezamos.</p>
          <div className="pila" style={{ gap: 10 }}>
            {NIVELES.map(([id, titulo, desc]) => (
              <button
                key={id}
                className="tarjeta plana"
                style={{ textAlign: 'left', borderColor: datos.nivel === id ? 'var(--violeta)' : undefined, borderWidth: 2 }}
                aria-pressed={datos.nivel === id}
                onClick={() => cambia('nivel', id)}
              >
                <p style={{ fontWeight: 600 }}>{titulo}</p>
                <p className="sub">{desc}</p>
              </button>
            ))}
          </div>
          <p className="seccion-titulo">Meta diaria</p>
          <div className="chips envuelve">
            {METAS.map((m) => (
              <button key={m} className="chip" aria-pressed={datos.meta === m} onClick={() => cambia('meta', m)}>
                {m} minutos
              </button>
            ))}
          </div>
          <button className="boton prim ancho" onClick={terminar}>
            Listo, ¡vamos!
          </button>
        </div>
      )}
    </main>
  );
}

const Progreso = ({ paso }) => (
  <div className="fila" style={{ gap: 6 }}>
    {[1, 2].map((n) => (
      <div key={n} style={{ height: 6, flex: 1, borderRadius: 9, background: n <= paso ? 'var(--violeta)' : 'var(--linea)' }} />
    ))}
  </div>
);

const Grupo = ({ titulo, opciones, valor, alElegir }) => (
  <div className="pila" style={{ gap: 8 }}>
    <span className="sub">{titulo}</span>
    <div className="chips envuelve">
      {opciones.map((o) => (
        <button key={o} className="chip" aria-pressed={valor === o} onClick={() => alElegir(o)}>
          {o}
        </button>
      ))}
    </div>
  </div>
);
