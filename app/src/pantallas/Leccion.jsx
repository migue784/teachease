import { useEffect, useMemo, useState } from 'react';
import { X, Check, ArrowRight, Mic, Lightbulb, Star, Volume2 } from 'lucide-react';
import { leccionPorId, LECCIONES, UNIDADES } from '../datos/ruta';
import { armarPasos, esPractica, estrellas } from '../lib/leccion';
import { completarLeccion } from '../lib/progreso';
import { hablar, escuchar, parecido } from '../lib/voz';
import { ir } from '../lib/ruta';
import { Escuchar, avisar } from '../componentes/comunes';

export default function Leccion({ params }) {
  const leccion = leccionPorId(params.id);
  const pool = useMemo(() => {
    if (!leccion) return [];
    const unidad = UNIDADES.find((u) => u.id === leccion.unidad);
    const deUnidad = unidad.lecciones.flatMap((l) => l.frases);
    return deUnidad.length >= 8 ? deUnidad : LECCIONES.flatMap((l) => l.frases);
  }, [leccion]);
  const [pasos] = useState(() => (leccion ? armarPasos(leccion, pool) : []));
  const [i, setI] = useState(0);
  const [aciertos, setAciertos] = useState(0);
  const [resultado, setResultado] = useState(null); // null | 'bien' | 'mal'
  const [fin, setFin] = useState(null);

  if (!leccion) {
    ir('aprender');
    return null;
  }

  const total = pasos.filter(esPractica).length;
  const paso = pasos[i];

  const calificar = (bien) => {
    setResultado(bien ? 'bien' : 'mal');
    if (bien) setAciertos((a) => a + 1);
    hablar(paso.frase.en);
  };

  const siguiente = () => {
    setResultado(null);
    if (i + 1 >= pasos.length) {
      const est = estrellas(aciertos, total);
      completarLeccion(leccion.id, est);
      setFin(est);
    } else setI(i + 1);
  };

  if (fin) {
    const idx = LECCIONES.findIndex((l) => l.id === leccion.id);
    const prox = LECCIONES[idx + 1];
    return (
      <div className="pila" style={{ alignItems: 'center', textAlign: 'center', gap: 16, paddingTop: 40 }}>
        <div className="fila" style={{ gap: 6 }} aria-label={`${fin} de 3 estrellas`}>
          {[1, 2, 3].map((n) => (
            <Star key={n} size={46} fill={n <= fin ? '#F5B83D' : 'none'} color={n <= fin ? '#F5B83D' : 'var(--linea)'} />
          ))}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 600 }}>¡Lección completada!</h1>
        <p className="sub" style={{ maxWidth: 320 }}>
          {aciertos} de {total} ejercicios bien. Ya tienes {leccion.frases.length} frases nuevas para usar en tu clase.
        </p>
        <div className="aviso info" style={{ textAlign: 'left' }}>
          <Lightbulb size={18} style={{ flex: 'none' }} /> {leccion.consejo}
        </div>
        {prox && (
          <button className="boton prim ancho" onClick={() => ir('leccion', { id: prox.id })}>
            Siguiente: {prox.titulo} <ArrowRight size={18} />
          </button>
        )}
        <button className="boton sec ancho" onClick={() => ir('aprender')}>
          Volver a la ruta
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="fila" style={{ gap: 12 }}>
        <button className="volver" onClick={() => ir('aprender')} aria-label="Salir de la lección">
          <X size={20} />
        </button>
        <div className="barra" style={{ flex: 1 }} aria-label={`Paso ${i + 1} de ${pasos.length}`}>
          <i style={{ width: `${(i / pasos.length) * 100}%` }} />
        </div>
      </header>
      <p className="sub" style={{ marginTop: -6 }}>
        {leccion.unidadTitulo} · {leccion.titulo}
      </p>

      <Paso key={i} paso={paso} resultado={resultado} alCalificar={calificar} alSeguir={siguiente} />

      {resultado && (
        <div className={`aviso ${resultado === 'bien' ? 'ok' : 'mal'}`} style={{ flexDirection: 'column', gap: 4 }}>
          <b>{resultado === 'bien' ? '¡Muy bien!' : 'Casi. La respuesta es:'}</b>
          <span>
            {paso.frase.en} = {paso.frase.es}
          </span>
        </div>
      )}
      {resultado && (
        <button className="boton prim ancho" onClick={siguiente}>
          Continuar <ArrowRight size={18} />
        </button>
      )}
    </>
  );
}

function Paso({ paso, resultado, alCalificar, alSeguir }) {
  const { frase } = paso;

  if (paso.tipo === 'aprende') {
    return (
      <>
        <span className="seccion-titulo" style={{ margin: 0 }}>
          Frase nueva
        </span>
        <section className="tarjeta pila" style={{ alignItems: 'center', textAlign: 'center', padding: '30px 18px', gap: 10 }}>
          <p style={{ fontSize: 28, fontWeight: 600, lineHeight: 1.2, textWrap: 'balance' }}>{frase.en}</p>
          <p className="sub" style={{ fontSize: 16 }}>
            {frase.es}
          </p>
          <p className="fon" style={{ fontSize: 15 }}>
            se dice “{frase.fon}”
          </p>
          <div className="fila" style={{ marginTop: 6 }}>
            <Escuchar texto={frase.en} tam={54} />
            <Escuchar texto={frase.en} lento tam={54} />
          </div>
        </section>
        <p className="sub" style={{ textAlign: 'center' }}>
          Escúchala y repítela en voz alta dos veces.
        </p>
        <button className="boton prim ancho" onClick={alSeguir}>
          Entendido <ArrowRight size={18} />
        </button>
      </>
    );
  }

  if (paso.tipo === 'elige' || paso.tipo === 'escucha') {
    const escucha = paso.tipo === 'escucha';
    return (
      <Opciones
        titulo={escucha ? 'Escucha y elige qué significa' : '¿Cómo se dice en inglés?'}
        cabeza={
          escucha ? (
            <button className="boton prim" style={{ minWidth: 72, minHeight: 72, borderRadius: 24 }} onClick={() => hablar(frase.en)} aria-label="Escuchar" autoFocus>
              <Volume2 size={30} />
            </button>
          ) : (
            <p style={{ fontSize: 24, fontWeight: 600, textWrap: 'balance' }}>{frase.es}</p>
          )
        }
        opciones={paso.opciones}
        campo={escucha ? 'es' : 'en'}
        correcta={frase}
        resultado={resultado}
        alCalificar={alCalificar}
        alMontar={escucha ? () => hablar(frase.en) : undefined}
      />
    );
  }

  if (paso.tipo === 'ordena') return <Ordenar paso={paso} resultado={resultado} alCalificar={alCalificar} />;
  if (paso.tipo === 'di') return <Decir frase={frase} alSeguir={alSeguir} />;
  return null;
}

function Opciones({ titulo, cabeza, opciones, campo, correcta, resultado, alCalificar, alMontar }) {
  const [elegida, setElegida] = useState(null);
  useEffect(() => {
    if (!alMontar) return;
    const t = setTimeout(alMontar, 350);
    return () => clearTimeout(t);
    // solo al mostrar la pregunta
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <span className="seccion-titulo" style={{ margin: 0 }}>
        {titulo}
      </span>
      <section className="tarjeta pila" style={{ alignItems: 'center', textAlign: 'center', padding: '26px 18px' }}>
        {cabeza}
      </section>
      <div className="pila" style={{ gap: 10 }}>
        {opciones.map((op) => {
          const bien = resultado && op[campo] === correcta[campo];
          const mal = resultado && elegida === op[campo] && !bien;
          return (
            <button
              key={op[campo]}
              className="tarjeta"
              disabled={Boolean(resultado)}
              onClick={() => {
                setElegida(op[campo]);
                alCalificar(op[campo] === correcta[campo]);
              }}
              style={{
                textAlign: 'left', fontWeight: 500, fontSize: 16, border: '2px solid transparent', color: 'var(--texto)',
                borderColor: bien ? 'var(--exito)' : mal ? 'var(--alerta)' : 'transparent',
                background: bien ? 'var(--exito-fondo)' : mal ? 'var(--alerta-fondo)' : undefined,
              }}
            >
              {op[campo]}
            </button>
          );
        })}
      </div>
    </>
  );
}

const limpiar = (t) => t.toLowerCase().replace(/[^a-z' ]/g, '').trim();

function Ordenar({ paso, resultado, alCalificar }) {
  const [elegidas, setElegidas] = useState([]); // índices de fichas
  const libres = paso.fichas.map((f, k) => ({ f, k })).filter(({ k }) => !elegidas.includes(k));
  const armada = elegidas.map((k) => paso.fichas[k]).join(' ');
  return (
    <>
      <span className="seccion-titulo" style={{ margin: 0 }}>
        Ordena la frase en inglés
      </span>
      <section className="tarjeta pila" style={{ gap: 12 }}>
        <p style={{ fontWeight: 600 }}>{paso.frase.es}</p>
        <div className="fila" style={{ flexWrap: 'wrap', gap: 8, minHeight: 52, padding: 8, borderRadius: 14, background: 'var(--superficie-2)' }}>
          {elegidas.map((k) => (
            <button key={k} className="chip" aria-pressed="true" disabled={Boolean(resultado)} onClick={() => setElegidas(elegidas.filter((x) => x !== k))}>
              {paso.fichas[k]}
            </button>
          ))}
          {!elegidas.length && <span className="sub">Toca las palabras en orden</span>}
        </div>
      </section>
      <div className="chips envuelve" style={{ justifyContent: 'center' }}>
        {libres.map(({ f, k }) => (
          <button key={k} className="chip" style={{ fontSize: 16 }} disabled={Boolean(resultado)} onClick={() => setElegidas([...elegidas, k])}>
            {f}
          </button>
        ))}
      </div>
      {!resultado && (
        <button className="boton prim ancho" disabled={libres.length > 0} onClick={() => alCalificar(limpiar(armada) === limpiar(paso.frase.en))}>
          <Check size={18} /> Comprobar
        </button>
      )}
    </>
  );
}

function Decir({ frase, alSeguir }) {
  const [estado, setEstado] = useState('listo');
  const [nota, setNota] = useState(null);
  const grabar = () => {
    setEstado('escuchando');
    escuchar({
      alTerminar: (ops) => {
        setNota(parecido(frase.en, ops));
        setEstado('hecho');
      },
      alError: () => {
        setEstado('listo');
        avisar('No te escuché bien. Intenta otra vez o sigue sin grabar.');
      },
    });
  };
  return (
    <>
      <span className="seccion-titulo" style={{ margin: 0 }}>
        Ahora dilo tú
      </span>
      <section className="tarjeta pila" style={{ alignItems: 'center', textAlign: 'center', padding: '26px 18px', gap: 8 }}>
        <p style={{ fontSize: 24, fontWeight: 600, textWrap: 'balance' }}>{frase.en}</p>
        <p className="fon">“{frase.fon}”</p>
        <Escuchar texto={frase.en} />
      </section>
      {nota !== null && (
        <p className={`aviso ${nota >= 70 ? 'ok' : 'info'}`}>
          {nota >= 70 ? '¡Muy claro! ' : 'Vas bien, sigue practicando. '}Claridad: <b className="dato">&nbsp;{nota}%</b>
        </p>
      )}
      <button className="boton prim ancho" style={{ minHeight: 60 }} onClick={grabar} disabled={estado === 'escuchando'}>
        <Mic size={20} /> {estado === 'escuchando' ? 'Te escucho…' : nota !== null ? 'Otra vez' : 'Tocar y hablar'}
      </button>
      <button className="boton sec ancho" onClick={alSeguir}>
        {nota !== null ? 'Terminar lección' : 'Ahora no puedo hablar'} <ArrowRight size={18} />
      </button>
    </>
  );
}
