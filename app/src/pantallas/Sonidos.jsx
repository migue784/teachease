import { useEffect, useRef, useState } from 'react';
import { Mic, Square, Play, ArrowRight, Check, Ear, RotateCcw } from 'lucide-react';
import { SONIDOS } from '../datos/sonidos';
import { usePersistente } from '../lib/almacen';
import { leerProgreso, marcarSonido, sumarPuntos } from '../lib/progreso';
import { hablar } from '../lib/voz';
import { grabar, puedeGrabar } from '../lib/audio';
import { mezclar } from '../lib/leccion';
import { ir } from '../lib/ruta';
import { Encabezado, Escuchar, avisar } from '../componentes/comunes';

export default function Sonidos({ params }) {
  const sonido = SONIDOS.find((s) => s.id === params.id);
  return sonido ? <Detalle s={sonido} /> : <Lista />;
}

function Lista() {
  usePersistente('progreso', null);
  const p = leerProgreso();
  return (
    <>
      <Encabezado titulo="Pronunciación" sub="Los sonidos que más cuestan desde el español" volver />
      <p className="aviso info">
        Elige un sonido, mira cómo se pone la boca, grábate y compárate con el modelo. Tu voz no sale del celular.
      </p>
      <div className="pila" style={{ gap: 10 }}>
        {SONIDOS.map((s) => (
          <button key={s.id} className="tarjeta fila" style={{ border: 0, textAlign: 'left' }} onClick={() => ir('sonidos', { id: s.id })}>
            <span style={{ width: 52, height: 52, borderRadius: 16, background: 'var(--superficie-2)', display: 'grid', placeItems: 'center', fontWeight: 700, fontSize: 15, flex: 'none', color: 'var(--violeta)' }}>
              {s.titulo.split(' ')[0]}
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <b style={{ display: 'block' }}>{s.titulo}</b>
              <span className="sub">Como en “{s.ejemplo}”</span>
            </span>
            {p.sonidos[s.id] ? <Check size={20} color="var(--exito)" /> : <ArrowRight size={18} />}
          </button>
        ))}
      </div>
    </>
  );
}

function Detalle({ s }) {
  useEffect(() => marcarSonido(s.id), [s.id]);
  return (
    <>
      <Encabezado titulo={s.titulo} sub={`Como en “${s.ejemplo}”`} volver />
      <section className="tarjeta oscura pila" style={{ gap: 10 }}>
        <span className="seccion-titulo" style={{ margin: 0, color: 'var(--turquesa-claro)' }}>
          Cómo se hace
        </span>
        <p style={{ lineHeight: 1.55 }}>{s.boca}</p>
      </section>

      <p className="seccion-titulo">Escucha, grábate y compara</p>
      <div className="pila" style={{ gap: 10 }}>
        {s.palabras.map((w) => (
          <Palabra key={w.en} w={w} />
        ))}
      </div>

      {s.pares.length > 0 && (
        <>
          <p className="seccion-titulo">Entrena el oído</p>
          <Pares pares={s.pares} />
        </>
      )}
    </>
  );
}

function Palabra({ w }) {
  const [estado, setEstado] = useState('listo'); // listo | grabando | hecho
  const [url, setUrl] = useState(null);
  const control = useRef(null);
  const audio = useRef(null);

  useEffect(() => () => url && URL.revokeObjectURL(url), [url]);

  const empezar = async () => {
    try {
      const g = await grabar({ maxMs: 3500, alEmpezar: () => setEstado('grabando') });
      control.current = g;
      const nueva = await g.listo;
      setUrl(nueva);
      setEstado('hecho');
      sumarPuntos(5, { pronunciadas: 1 });
      setTimeout(() => audio.current?.play(), 150);
    } catch {
      setEstado('listo');
      avisar('Activa el permiso del micrófono para grabarte');
    }
  };

  return (
    <article className="tarjeta pila" style={{ padding: 14, gap: 10 }}>
      <div className="fila">
        <div style={{ flex: 1, minWidth: 0 }}>
          <b style={{ fontSize: 20 }}>{w.en}</b> <span className="sub">· {w.es}</span>
          <p className="fon">“{w.fon}”</p>
        </div>
        <Escuchar texto={w.en} tam={42} />
        <Escuchar texto={w.en} lento tam={42} />
      </div>
      {puedeGrabar() && (
        <div className="fila" style={{ gap: 8 }}>
          {estado === 'grabando' ? (
            <button className="boton peq" style={{ background: 'var(--alerta)', color: '#fff', flex: 1 }} onClick={() => control.current?.detener()}>
              <Square size={15} fill="#fff" /> Detener
            </button>
          ) : (
            <button className="boton sec peq" style={{ flex: 1 }} onClick={empezar}>
              <Mic size={16} /> {url ? 'Grabar otra vez' : 'Grabarme'}
            </button>
          )}
          {url && estado !== 'grabando' && (
            <>
              <button className="boton prim peq" style={{ flex: 1 }} onClick={() => audio.current?.play()}>
                <Play size={15} /> Mi voz
              </button>
              <button className="boton sec peq" style={{ flex: 1 }} onClick={() => hablar(w.en)}>
                <Ear size={15} /> Modelo
              </button>
            </>
          )}
          {url && <audio ref={audio} src={url} preload="auto" />}
        </div>
      )}
    </article>
  );
}

function Pares({ pares }) {
  const RONDAS = 6;
  const nueva = () => {
    const par = pares[Math.floor(Math.random() * pares.length)];
    return { par: mezclar(par), dicha: par[Math.floor(Math.random() * 2)] };
  };
  const [ronda, setRonda] = useState(0);
  const [q, setQ] = useState(nueva);
  const [elegida, setElegida] = useState(null);
  const [bien, setBien] = useState(0);

  if (ronda >= RONDAS) {
    return (
      <section className="tarjeta pila" style={{ alignItems: 'center', textAlign: 'center' }}>
        <b style={{ fontSize: 20 }}>
          {bien} de {RONDAS}
        </b>
        <p className="sub">{bien >= 5 ? '¡Tu oído ya distingue este sonido!' : 'Escucha las palabras despacio y vuelve a intentarlo.'}</p>
        <button
          className="boton sec"
          onClick={() => {
            setRonda(0);
            setBien(0);
            setQ(nueva());
          }}
        >
          <RotateCcw size={16} /> Otra vez
        </button>
      </section>
    );
  }

  return (
    <section className="tarjeta pila" style={{ alignItems: 'center', textAlign: 'center', gap: 14 }}>
      <p className="sub">
        Ronda {ronda + 1} de {RONDAS} · ¿Cuál escuchaste?
      </p>
      <button className="boton prim" style={{ minWidth: 68, minHeight: 68, borderRadius: 22 }} onClick={() => hablar(q.dicha, { lento: true })} aria-label="Escuchar">
        <Ear size={28} />
      </button>
      <div className="grid2" style={{ width: '100%' }}>
        {q.par.map((op) => {
          const ok = elegida && op === q.dicha;
          const mal = elegida === op && op !== q.dicha;
          return (
            <button
              key={op}
              className="tarjeta plana"
              disabled={Boolean(elegida)}
              onClick={() => {
                setElegida(op);
                if (op === q.dicha) {
                  setBien((b) => b + 1);
                  sumarPuntos(3);
                }
              }}
              style={{
                fontSize: 20, fontWeight: 600, color: 'var(--texto)', borderWidth: 2,
                borderColor: ok ? 'var(--exito)' : mal ? 'var(--alerta)' : undefined,
                background: ok ? 'var(--exito-fondo)' : mal ? 'var(--alerta-fondo)' : undefined,
              }}
            >
              {op}
            </button>
          );
        })}
      </div>
      {elegida && (
        <div className="fila" style={{ width: '100%', gap: 8 }}>
          <button className="boton sec" style={{ flex: 1 }} onClick={() => q.par.forEach((x, k) => setTimeout(() => hablar(x, { lento: true }), k * 1300))}>
            Escuchar ambas
          </button>
          <button
            className="boton prim"
            style={{ flex: 1 }}
            onClick={() => {
              setElegida(null);
              setRonda(ronda + 1);
              const n = nueva();
              setQ(n);
              setTimeout(() => hablar(n.dicha, { lento: true }), 300);
            }}
          >
            Siguiente
          </button>
        </div>
      )}
    </section>
  );
}
