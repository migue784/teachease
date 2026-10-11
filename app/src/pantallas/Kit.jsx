import { useEffect, useRef, useState } from 'react';
import { Timer, Disc3, Volume2, Trophy, Play, Pause, RotateCcw, Plus, Minus, ArrowRight, Shuffle, Mic, MicOff } from 'lucide-react';
import { usePersistente } from '../lib/almacen';
import { hablar } from '../lib/voz';
import { campana, clic, medirRuido, pantallaEncendida } from '../lib/audio';
import { ir } from '../lib/ruta';
import { Encabezado, Escuchar, avisar } from '../componentes/comunes';

export const HERRAMIENTAS = [
  { id: 'temporizador', nombre: 'Temporizador', desc: 'Cuenta regresiva grande con campana', Icono: Timer, color: '#3E5BE8' },
  { id: 'ruleta', nombre: 'Ruleta', desc: 'Elige al azar quién participa', Icono: Disc3, color: '#5B34EE' },
  { id: 'semaforo', nombre: 'Semáforo de ruido', desc: 'Escucha el salón y avisa si hay mucho ruido', Icono: Volume2, color: '#1F8A7D' },
  { id: 'puntos', nombre: 'Puntos por equipos', desc: 'Marcador para juegos y concursos', Icono: Trophy, color: '#E08A1E' },
];

export default function Kit({ params }) {
  const Comp = { temporizador: Temporizador, ruleta: Ruleta, semaforo: Semaforo, puntos: Puntos }[params.h];
  if (Comp) return <Comp />;
  return (
    <>
      <Encabezado titulo="Kit del aula" sub="Herramientas para usar en plena clase" volver />
      <div className="pila" style={{ gap: 10 }}>
        {HERRAMIENTAS.map(({ id, nombre, desc, Icono, color }) => (
          <button key={id} className="tarjeta fila" style={{ border: 0, textAlign: 'left' }} onClick={() => ir('kit', { h: id })}>
            <span style={{ width: 52, height: 52, borderRadius: 16, background: color, color: '#fff', display: 'grid', placeItems: 'center', flex: 'none' }}>
              <Icono size={26} />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <b style={{ display: 'block' }}>{nombre}</b>
              <span className="sub">{desc}</span>
            </span>
            <ArrowRight size={18} />
          </button>
        ))}
      </div>
    </>
  );
}

// Frases para decir mientras se usa cada herramienta
function FrasesUtiles({ frases }) {
  return (
    <section className="tarjeta pila" style={{ gap: 8, padding: 14 }}>
      <span className="seccion-titulo" style={{ margin: 0 }}>
        Dilo en inglés
      </span>
      {frases.map(([en, es]) => (
        <div key={en} className="fila" style={{ gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <b style={{ fontSize: 15 }}>{en}</b>
            <p className="sub" style={{ fontSize: 13 }}>
              {es}
            </p>
          </div>
          <Escuchar texto={en} tam={38} />
        </div>
      ))}
    </section>
  );
}

// ---------------- Temporizador ----------------
const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function Temporizador() {
  const [total, setTotal] = useState(180);
  const [resta, setResta] = useState(180);
  const [corre, setCorre] = useState(false);
  const fin = useRef(null);

  useEffect(() => {
    if (!corre) return;
    let soltar = () => {};
    pantallaEncendida().then((f) => (soltar = f));
    fin.current = Date.now() + resta * 1000;
    const id = setInterval(() => {
      const r = Math.max(0, Math.round((fin.current - Date.now()) / 1000));
      setResta(r);
      if (r === 10) hablar('Ten seconds left!');
      if (r === 0) {
        clearInterval(id);
        setCorre(false);
        campana();
        setTimeout(() => hablar('Time is up!'), 900);
      }
    }, 250);
    return () => {
      clearInterval(id);
      soltar();
    };
    // el tiempo restante se toma solo al arrancar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [corre]);

  const elegir = (s) => {
    setCorre(false);
    setTotal(s);
    setResta(s);
  };
  const avance = total ? resta / total : 0;
  const R = 120;
  const C = 2 * Math.PI * R;
  const color = resta <= 10 && resta > 0 ? 'var(--alerta)' : resta === 0 ? 'var(--exito)' : 'url(#grad-tiempo)';

  return (
    <>
      <Encabezado titulo="Temporizador" volver />
      <div style={{ position: 'relative', width: 'min(300px, 80vw)', aspectRatio: '1', margin: '0 auto' }}>
        <svg viewBox="0 0 280 280" width="100%" height="100%" aria-hidden="true">
          <defs>
            <linearGradient id="grad-tiempo" x1="0" x2="1">
              <stop offset="0" stopColor="#3FBFB0" />
              <stop offset="0.55" stopColor="#3E5BE8" />
              <stop offset="1" stopColor="#5B34EE" />
            </linearGradient>
          </defs>
          <circle cx="140" cy="140" r={R} fill="none" stroke="var(--superficie-2)" strokeWidth="18" />
          <circle
            cx="140" cy="140" r={R} fill="none" stroke={color} strokeWidth="18" strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={C * (1 - avance)} transform="rotate(-90 140 140)"
            style={{ transition: 'stroke-dashoffset .3s linear' }}
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
          <div>
            <p className="dato" style={{ fontSize: 'clamp(52px, 16vw, 72px)', fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1 }} aria-live="polite">
              {fmt(resta)}
            </p>
            {resta === 0 && <p style={{ fontWeight: 600, color: 'var(--exito)', marginTop: 6 }}>Time is up!</p>}
          </div>
        </div>
      </div>
      <div className="chips envuelve" style={{ justifyContent: 'center' }}>
        {[30, 60, 120, 180, 300, 600].map((s) => (
          <button key={s} className="chip" aria-pressed={total === s} onClick={() => elegir(s)}>
            {s < 60 ? `${s} s` : `${s / 60} min`}
          </button>
        ))}
      </div>
      <div className="grid2">
        <button className="boton sec" onClick={() => elegir(total)}>
          <RotateCcw size={18} /> Reiniciar
        </button>
        <button
          className="boton prim"
          onClick={() => {
            if (resta === 0) setResta(total);
            if (!corre) clic();
            setCorre(!corre);
          }}
        >
          {corre ? <Pause size={18} /> : <Play size={18} />} {corre ? 'Pausar' : 'Iniciar'}
        </button>
      </div>
      <FrasesUtiles
        frases={[
          [`You have ${total < 60 ? `${total} seconds` : `${total / 60} minute${total > 60 ? 's' : ''}`}.`, 'Tienen ese tiempo.'],
          ['Ten seconds left!', '¡Quedan diez segundos!'],
          ['Time is up!', '¡Se acabó el tiempo!'],
          ['Pencils down, please.', 'Suelten los lápices, por favor.'],
        ]}
      />
    </>
  );
}

// ---------------- Ruleta ----------------
const COLORES = ['#3FBFB0', '#3E5BE8', '#5B34EE', '#0C1A5E', '#5FD8C8', '#8E74FF'];

function Ruleta() {
  const [lista, setLista] = usePersistente('ruleta', ['Ana', 'Juan', 'Sofía', 'Mateo', 'Valentina', 'Samuel']);
  const [texto, setTexto] = useState(lista.join('\n'));
  const [editar, setEditar] = useState(false);
  const [giro, setGiro] = useState(0);
  const [girando, setGirando] = useState(false);
  const [elegido, setElegido] = useState(null);

  const n = lista.length;
  const paso = 360 / Math.max(n, 1);

  const girar = () => {
    if (n < 2 || girando) return;
    const k = Math.floor(Math.random() * n);
    // el puntero está arriba: llevamos el centro del sector k a 0°
    const destino = giro + 360 * 5 + (360 - ((giro % 360) + k * paso + paso / 2)) % 360;
    setElegido(null);
    setGirando(true);
    setGiro(destino);
    const tic = setInterval(clic, 140);
    setTimeout(() => {
      clearInterval(tic);
      setGirando(false);
      setElegido(lista[k]);
      campana();
      setTimeout(() => hablar(`It's your turn, ${lista[k]}!`), 500);
    }, 4200);
  };

  const sector = (i) => {
    const a0 = ((i * paso - 90) * Math.PI) / 180;
    const a1 = (((i + 1) * paso - 90) * Math.PI) / 180;
    const x0 = 150 + 140 * Math.cos(a0), y0 = 150 + 140 * Math.sin(a0);
    const x1 = 150 + 140 * Math.cos(a1), y1 = 150 + 140 * Math.sin(a1);
    return `M150 150L${x0} ${y0}A140 140 0 ${paso > 180 ? 1 : 0} 1 ${x1} ${y1}Z`;
  };

  if (editar) {
    return (
      <>
        <Encabezado titulo="Nombres de la ruleta" sub="Uno por línea" volver />
        <label htmlFor="nombres" style={{ position: 'absolute', left: -9999 }}>
          Nombres, uno por línea
        </label>
        <textarea id="nombres" className="campo" rows={12} value={texto} onChange={(e) => setTexto(e.target.value)} />
        <div className="grid2">
          <button className="boton sec" onClick={() => setTexto(Array.from({ length: 30 }, (_, i) => i + 1).join('\n'))}>
            Números 1–30
          </button>
          <button
            className="boton prim"
            onClick={() => {
              const nueva = texto.split('\n').map((x) => x.trim()).filter(Boolean).slice(0, 60);
              if (nueva.length < 2) return avisar('Escribe al menos dos nombres');
              setLista(nueva);
              setGiro(0);
              setElegido(null);
              setEditar(false);
            }}
          >
            Guardar
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Encabezado titulo="Ruleta" sub={`${n} en la ruleta`} volver derecha={<button className="boton sec peq" onClick={() => { setTexto(lista.join('\n')); setEditar(true); }}>Editar</button>} />
      <div style={{ position: 'relative', width: 'min(320px, 86vw)', margin: '0 auto' }}>
        <svg viewBox="0 0 300 300" width="100%" style={{ display: 'block', transform: `rotate(${giro}deg)`, transition: girando ? 'transform 4.2s cubic-bezier(.12,.75,.15,1)' : 'none' }} aria-hidden="true">
          {lista.map((nombre, i) => (
            <g key={i}>
              <path d={sector(i)} fill={COLORES[i % COLORES.length]} stroke="var(--superficie)" strokeWidth="2" />
              <text
                x="150" y="150" fill="#fff" fontSize={n > 20 ? 9 : n > 10 ? 12 : 15} fontWeight="600" fontFamily="Poppins, Arial"
                textAnchor="end" dominantBaseline="middle"
                transform={`rotate(${i * paso + paso / 2 - 90} 150 150) translate(128 0)`}
              >
                {nombre.length > 12 ? nombre.slice(0, 11) + '…' : nombre}
              </text>
            </g>
          ))}
          <circle cx="150" cy="150" r="22" fill="var(--superficie)" />
        </svg>
        <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: '24px solid var(--texto)' }} />
      </div>
      {elegido && (
        <div className="tarjeta grad" style={{ textAlign: 'center' }} role="status">
          <p className="sub">It’s your turn,</p>
          <p style={{ fontSize: 30, fontWeight: 600 }}>{elegido}!</p>
        </div>
      )}
      <button className="boton prim ancho" style={{ minHeight: 58, fontSize: 17 }} onClick={girar} disabled={girando || n < 2}>
        <Shuffle size={20} /> {girando ? 'Girando…' : 'Girar'}
      </button>
      {elegido && (
        <button
          className="boton sec ancho"
          onClick={() => {
            setLista(lista.filter((x) => x !== elegido));
            setElegido(null);
            setGiro(0);
          }}
        >
          Sacar a {elegido} de la ruleta
        </button>
      )}
      <FrasesUtiles
        frases={[
          ['It’s your turn!', '¡Es tu turno!'],
          ['Who wants to try?', '¿Quién quiere intentarlo?'],
          ['Come to the front, please.', 'Pasa al frente, por favor.'],
        ]}
      />
    </>
  );
}

// ---------------- Semáforo de ruido ----------------
function Semaforo() {
  const [activo, setActivo] = useState(false);
  const [nivel, setNivel] = useState(0);
  const [sensibilidad, setSensibilidad] = usePersistente('sensibilidad', 50);
  const [error, setError] = useState(null);
  const ultimoRojo = useRef(0);

  useEffect(() => {
    if (!activo) return;
    let parar = () => {};
    let soltar = () => {};
    pantallaEncendida().then((f) => (soltar = f));
    medirRuido(setNivel)
      .then((f) => (parar = f))
      .catch(() => {
        setError('Para usar el semáforo, permite el micrófono. El sonido no se graba ni sale del celular.');
        setActivo(false);
      });
    return () => {
      parar();
      soltar();
    };
  }, [activo]);

  // sensibilidad 0..100 mueve los umbrales: más sensible = se pone rojo con menos ruido
  const ajuste = (sensibilidad - 50) / 250;
  const umbralAmarillo = 0.45 - ajuste;
  const umbralRojo = 0.65 - ajuste;
  const estado = !activo ? 'apagado' : nivel >= umbralRojo ? 'rojo' : nivel >= umbralAmarillo ? 'amarillo' : 'verde';

  useEffect(() => {
    if (estado === 'rojo' && Date.now() - ultimoRojo.current > 8000) {
      ultimoRojo.current = Date.now();
      campana();
    }
  }, [estado]);

  const INFO = {
    apagado: ['#5C6386', '🤫', 'Toca “Encender” y pon el celular a la vista del grupo', ''],
    verde: ['#1F8A7D', '😊', 'Great job!', '¡Muy bien!'],
    amarillo: ['#E0A21E', '😐', 'A little quieter, please.', 'Un poquito más bajo, por favor.'],
    rojo: ['#D93A40', '🙉', 'Quiet, please!', '¡Silencio, por favor!'],
  }[estado];

  return (
    <>
      <Encabezado titulo="Semáforo de ruido" volver />
      <section
        style={{ background: INFO[0], color: '#fff', borderRadius: 28, padding: '34px 20px', textAlign: 'center', transition: 'background .4s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}
        aria-live="polite"
      >
        <div style={{ fontSize: 96, lineHeight: 1 }} aria-hidden="true">
          {INFO[1]}
        </div>
        <p style={{ fontSize: 'clamp(24px, 7vw, 34px)', fontWeight: 600, lineHeight: 1.15 }}>{INFO[2]}</p>
        {INFO[3] && <p style={{ opacity: 0.9 }}>{INFO[3]}</p>}
        {activo && (
          <div style={{ width: '100%', height: 12, borderRadius: 9, background: 'rgba(255,255,255,.25)', overflow: 'hidden', marginTop: 8 }}>
            <i style={{ display: 'block', height: '100%', width: `${Math.round(nivel * 100)}%`, background: '#fff', borderRadius: 9, transition: 'width .1s' }} />
          </div>
        )}
      </section>
      {error && <p className="aviso mal">{error}</p>}
      <button className="boton prim ancho" style={{ minHeight: 56 }} onClick={() => { setError(null); setActivo(!activo); }}>
        {activo ? <MicOff size={20} /> : <Mic size={20} />} {activo ? 'Apagar' : 'Encender'}
      </button>
      <label className="pila tarjeta" style={{ gap: 8 }}>
        <span className="fila" style={{ justifyContent: 'space-between' }}>
          <b>Sensibilidad</b>
          <span className="sub">{sensibilidad < 35 ? 'Salón ruidoso' : sensibilidad > 65 ? 'Salón silencioso' : 'Normal'}</span>
        </span>
        <input type="range" min="0" max="100" value={sensibilidad} onChange={(e) => setSensibilidad(Number(e.target.value))} style={{ accentColor: 'var(--violeta)' }} />
      </label>
      <p className="sub" style={{ textAlign: 'center', fontSize: 13 }}>
        El micrófono solo mide el volumen. No graba ni envía nada.
      </p>
    </>
  );
}

// ---------------- Puntos por equipos ----------------
const EQUIPOS_BASE = [
  { nombre: 'Blue Team', color: '#3E5BE8', puntos: 0 },
  { nombre: 'Green Team', color: '#1F8A7D', puntos: 0 },
  { nombre: 'Purple Team', color: '#5B34EE', puntos: 0 },
  { nombre: 'Orange Team', color: '#E08A1E', puntos: 0 },
];

function Puntos() {
  const [equipos, setEquipos] = usePersistente('equipos', EQUIPOS_BASE.slice(0, 2));
  const [confirmar, setConfirmar] = useState(false);
  const cambiar = (i, d) => {
    setEquipos(equipos.map((e, k) => (k === i ? { ...e, puntos: Math.max(0, e.puntos + d) } : e)));
    if (d > 0) {
      clic();
      hablar(`Great job, ${equipos[i].nombre}!`);
    }
  };
  const max = Math.max(...equipos.map((e) => e.puntos));

  return (
    <>
      <Encabezado titulo="Puntos por equipos" volver />
      <div className="chips envuelve" role="group" aria-label="Número de equipos">
        {[2, 3, 4].map((n) => (
          <button key={n} className="chip" aria-pressed={equipos.length === n} onClick={() => setEquipos(EQUIPOS_BASE.slice(0, n).map((b, i) => equipos[i] || b))}>
            {n} equipos
          </button>
        ))}
      </div>
      <div className={equipos.length > 2 ? 'grid2' : 'pila'} style={{ gap: 12 }}>
        {equipos.map((e, i) => (
          <section key={i} className="pila" style={{ background: e.color, color: '#fff', borderRadius: 24, padding: 16, alignItems: 'center', gap: 6, position: 'relative' }}>
            {max > 0 && e.puntos === max && (
              <Trophy size={20} style={{ position: 'absolute', top: 12, right: 12 }} aria-label="Va ganando" />
            )}
            <input
              aria-label="Nombre del equipo"
              value={e.nombre}
              onChange={(ev) => setEquipos(equipos.map((x, k) => (k === i ? { ...x, nombre: ev.target.value.slice(0, 20) } : x)))}
              style={{ background: 'transparent', border: 0, color: '#fff', fontWeight: 600, fontSize: 16, textAlign: 'center', width: '100%', outline: 'none' }}
            />
            <p className="dato" style={{ fontSize: equipos.length > 2 ? 52 : 68, fontWeight: 700, lineHeight: 1 }} aria-live="polite">
              {e.puntos}
            </p>
            <div className="fila" style={{ gap: 10 }}>
              <button className="icono-btn" style={{ background: 'rgba(255,255,255,.2)', color: '#fff' }} onClick={() => cambiar(i, -1)} aria-label={`Quitar punto a ${e.nombre}`}>
                <Minus size={20} />
              </button>
              <button className="icono-btn" style={{ background: '#fff', color: e.color, width: 56, height: 56 }} onClick={() => cambiar(i, 1)} aria-label={`Sumar punto a ${e.nombre}`}>
                <Plus size={26} />
              </button>
            </div>
          </section>
        ))}
      </div>
      {!confirmar ? (
        <button className="boton sec ancho" onClick={() => setConfirmar(true)}>
          <RotateCcw size={18} /> Empezar de cero
        </button>
      ) : (
        <div className="grid2">
          <button className="boton sec" onClick={() => setConfirmar(false)}>
            Cancelar
          </button>
          <button
            className="boton prim"
            onClick={() => {
              setEquipos(equipos.map((e) => ({ ...e, puntos: 0 })));
              setConfirmar(false);
            }}
          >
            Sí, poner en cero
          </button>
        </div>
      )}
      <FrasesUtiles
        frases={[
          ['One point for the Blue Team!', '¡Un punto para el equipo azul!'],
          ['Who is winning?', '¿Quién va ganando?'],
          ['It’s a tie!', '¡Es un empate!'],
          ['Congratulations!', '¡Felicitaciones!'],
        ]}
      />
    </>
  );
}
