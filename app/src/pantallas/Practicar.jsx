import { useMemo, useState } from 'react';
import { Layers, Mic, ListChecks, RotateCcw, Check, X, Volume2, ArrowRight, Trophy, Printer } from 'lucide-react';
import { TEMAS, temaPorId } from '../datos/temas';
import { ir } from '../lib/ruta';
import { usePersistente } from '../lib/almacen';
import { leerProgreso, sumarPuntos, marcarPalabra, ordenarParaRepaso } from '../lib/progreso';
import { hablar, escuchar, parecido, puedeEscuchar } from '../lib/voz';
import { Encabezado, Escuchar, avisar } from '../componentes/comunes';

const MODOS = [
  { id: 'tarjetas', nombre: 'Tarjetas', desc: 'Recuerda la palabra y repasa lo que te cuesta', Icono: Layers, color: 'var(--violeta)' },
  { id: 'pronunciar', nombre: 'Pronunciación', desc: 'Dilo en voz alta y mira qué tan claro suena', Icono: Mic, color: 'var(--turquesa)' },
  { id: 'quiz', nombre: 'Quiz', desc: 'Escucha y elige la respuesta correcta', Icono: ListChecks, color: 'var(--idea)' },
];

export default function Practicar({ params }) {
  const tema = temaPorId(params.tema);
  const modo = MODOS.find((m) => m.id === params.modo);
  if (tema && modo) {
    const Comp = { tarjetas: Tarjetas, pronunciar: Pronunciar, quiz: Quiz }[modo.id];
    return <Comp tema={tema} key={`${tema.id}-${modo.id}`} />;
  }
  return <Elegir tema={tema} />;
}

function Elegir({ tema }) {
  usePersistente('progreso', null);
  const p = leerProgreso();
  const dominio = (t) => {
    const ids = t.palabras.map((_, i) => `${t.id}-${i}`);
    return Math.round((ids.filter((id) => (p.cajas[id] || 0) >= 3).length / ids.length) * 100);
  };

  if (!tema) {
    return (
      <>
        <Encabezado titulo="Vocabulario" sub="20 temas para tus clases" volver />
        <div className="grid2">
          {TEMAS.map((t) => (
            <button key={t.id} className="tarjeta pila" style={{ gap: 8, textAlign: 'left', border: 0 }} onClick={() => ir('practicar', { tema: t.id })}>
              <span style={{ fontSize: 30 }} aria-hidden="true">
                {t.emoji}
              </span>
              <b style={{ lineHeight: 1.25 }}>{t.nombre}</b>
              <div className="barra" style={{ height: 6 }} aria-label={`Dominio ${dominio(t)}%`}>
                <i style={{ width: `${dominio(t)}%` }} />
              </div>
              <span className="sub" style={{ fontSize: 12.5 }}>
                {t.palabras.length} palabras · {dominio(t)}% dominado
              </span>
            </button>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <Encabezado titulo={`${tema.emoji} ${tema.nombre}`} sub={`${tema.palabras.length} palabras`} volver />
      <div className="pila">
        {MODOS.map(({ id, nombre, desc, Icono, color }) => (
          <button key={id} className="tarjeta fila" style={{ textAlign: 'left', border: 0 }} onClick={() => ir('practicar', { tema: tema.id, modo: id })}>
            <span style={{ width: 50, height: 50, borderRadius: 16, background: 'var(--superficie-2)', display: 'grid', placeItems: 'center', flex: 'none', color }}>
              <Icono size={24} />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <b style={{ display: 'block' }}>{nombre}</b>
              <span className="sub">{desc}</span>
            </span>
            <ArrowRight size={18} />
          </button>
        ))}
      </div>
      <button className="tarjeta grad fila" style={{ border: 0, textAlign: 'left', color: '#fff' }} onClick={() => ir('material', { tema: tema.id })}>
        <Printer size={26} style={{ flex: 'none' }} />
        <span style={{ flex: 1 }}>
          <b style={{ display: 'block' }}>Material para tu clase</b>
          <span className="sub">Tarjetas para proyectar, bingo y hoja de trabajo</span>
        </span>
        <ArrowRight size={18} />
      </button>
      <p className="seccion-titulo">Vocabulario</p>
      <div className="tarjeta" style={{ padding: 6 }}>
        {tema.palabras.map((w, i) => (
          <div key={w.en} className="fila" style={{ padding: '10px 10px', borderTop: i ? '1px solid var(--linea)' : 0 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b>{w.en}</b> <span className="sub">· {w.es}</span>
              <p className="fon">“{w.fon}”</p>
            </div>
            <Escuchar texto={w.en} tam={38} />
          </div>
        ))}
      </div>
    </>
  );
}

function Final({ tema, titulo, detalle, otraVez }) {
  return (
    <div className="pila" style={{ alignItems: 'center', textAlign: 'center', gap: 16, paddingTop: 30 }}>
      <span style={{ width: 84, height: 84, borderRadius: 28, background: 'var(--degradado)', display: 'grid', placeItems: 'center', color: '#fff' }}>
        <Trophy size={40} />
      </span>
      <h2 style={{ fontSize: 24, fontWeight: 600 }}>{titulo}</h2>
      <p className="sub" style={{ maxWidth: 320 }}>
        {detalle}
      </p>
      <button className="boton prim ancho" onClick={otraVez}>
        <RotateCcw size={18} /> Otra ronda
      </button>
      <button className="boton sec ancho" onClick={() => ir('practicar', { tema: tema.id })}>
        Volver a {tema.nombre}
      </button>
    </div>
  );
}

const conIds = (tema) => tema.palabras.map((w, i) => ({ ...w, id: `${tema.id}-${i}` }));

// ---------------- Tarjetas con repaso espaciado ----------------
function Tarjetas({ tema }) {
  const barajar = () => ordenarParaRepaso(conIds(tema), leerProgreso().cajas);
  const [mazo, setMazo] = useState(barajar);
  const [i, setI] = useState(0);
  const [volteada, setVolteada] = useState(false);
  const [aciertos, setAciertos] = useState(0);
  const actual = mazo[i];

  const responder = (sabia) => {
    marcarPalabra(actual.id, sabia);
    sumarPuntos(sabia ? 10 : 4);
    if (sabia) setAciertos((a) => a + 1);
    setVolteada(false);
    setI(i + 1);
  };

  if (i >= mazo.length) {
    return (
      <>
        <Encabezado titulo="Tarjetas" sub={tema.nombre} volver />
        <Final
          tema={tema}
          titulo={aciertos === mazo.length ? '¡Las sabías todas!' : '¡Ronda terminada!'}
          detalle={`Recordaste ${aciertos} de ${mazo.length}. Las que te costaron saldrán primero la próxima vez.`}
          otraVez={() => {
            setMazo(barajar());
            setI(0);
            setAciertos(0);
          }}
        />
      </>
    );
  }

  return (
    <>
      <Encabezado titulo="Tarjetas" sub={`${tema.nombre} · ${i + 1} de ${mazo.length}`} volver />
      <div className="barra" style={{ height: 6 }}>
        <i style={{ width: `${(i / mazo.length) * 100}%` }} />
      </div>
      <button
        className="tarjeta"
        onClick={() => {
          if (!volteada) hablar(actual.en);
          setVolteada(!volteada);
        }}
        style={{
          minHeight: 280, border: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
          background: volteada ? 'var(--azul)' : 'var(--superficie)', color: volteada ? '#fff' : 'var(--texto)', transition: 'background .3s',
        }}
        aria-label={volteada ? `${actual.en}. Toca para ver de nuevo en español` : `${actual.es}. Toca para ver la respuesta`}
      >
        {!volteada ? (
          <>
            <span className="sub">¿Cómo se dice en inglés?</span>
            <span style={{ fontSize: 56, lineHeight: 1 }} aria-hidden="true">
              {actual.emoji}
            </span>
            <span style={{ fontSize: 34, fontWeight: 600, letterSpacing: '-0.02em' }}>{actual.es}</span>
            <span className="sub" style={{ marginTop: 12 }}>
              Piénsalo y toca para ver la respuesta
            </span>
          </>
        ) : (
          <>
            <span style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em' }}>{actual.en}</span>
            <span style={{ color: 'var(--turquesa-claro)', fontStyle: 'italic' }}>se dice “{actual.fon}”</span>
            <span style={{ color: '#b5badf', fontSize: 14 }}>{actual.es}</span>
          </>
        )}
      </button>
      {volteada ? (
        <div className="grid2">
          <button className="boton sec" onClick={() => responder(false)}>
            <X size={18} /> Me costó
          </button>
          <button className="boton prim" onClick={() => responder(true)}>
            <Check size={18} /> La sabía
          </button>
        </div>
      ) : (
        <div className="fila" style={{ justifyContent: 'center' }}>
          <Escuchar texto={actual.en} etiqueta="Escuchar la respuesta" />
          <span className="sub">o escúchala antes de voltear</span>
        </div>
      )}
    </>
  );
}

// ---------------- Pronunciación ----------------
function Pronunciar({ tema }) {
  const palabras = useMemo(() => conIds(tema), [tema]);
  const [i, setI] = useState(0);
  const [estado, setEstado] = useState('listo'); // listo | escuchando | resultado
  const [resultado, setResultado] = useState(null);
  const actual = palabras[i];
  const disponible = puedeEscuchar();

  const grabar = () => {
    setEstado('escuchando');
    escuchar({
      alTerminar: (opciones) => {
        const nota = parecido(actual.en, opciones);
        setResultado({ nota, oido: opciones[0] });
        setEstado('resultado');
        sumarPuntos(nota >= 80 ? 15 : 6, { pronunciadas: 1 });
      },
      alError: (e) => {
        setEstado('listo');
        if (e === 'not-allowed' || e === 'service-not-allowed') avisar('Activa el permiso del micrófono para practicar');
        else if (e === 'no-disponible') avisar('Este navegador no puede escuchar tu voz');
        else avisar('No te escuché bien. Intenta otra vez, más cerca del celular');
      },
    });
  };

  const siguiente = () => {
    setResultado(null);
    setEstado('listo');
    setI((i + 1) % palabras.length);
  };

  const mensaje = (n) =>
    n >= 90 ? ['¡Perfecto! Suena muy natural.', 'ok'] : n >= 70 ? ['¡Muy bien! Se entiende claramente.', 'ok'] : n >= 45 ? ['Casi. Escúchala despacio y repítela.', 'info'] : ['Vamos otra vez, sin afán. Escúchala despacio primero.', 'mal'];

  return (
    <>
      <Encabezado titulo="Pronunciación" sub={`${tema.nombre} · ${i + 1} de ${palabras.length}`} volver />
      <section className="tarjeta pila" style={{ alignItems: 'center', textAlign: 'center', gap: 10, padding: '28px 18px' }}>
        <span className="sub">Di en voz alta</span>
        <p style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{actual.en}</p>
        <p className="sub">{actual.es}</p>
        <p className="fon" style={{ fontSize: 15 }}>
          suena como “{actual.fon}”
        </p>
        <div className="fila" style={{ marginTop: 6 }}>
          <Escuchar texto={actual.en} />
          <Escuchar texto={actual.en} lento />
        </div>
      </section>

      {disponible ? (
        <button
          className="boton prim ancho"
          style={{ minHeight: 64, fontSize: 17, background: estado === 'escuchando' ? 'var(--turquesa)' : undefined, color: estado === 'escuchando' ? 'var(--azul)' : undefined }}
          onClick={grabar}
          disabled={estado === 'escuchando'}
        >
          <Mic size={22} /> {estado === 'escuchando' ? 'Te escucho…' : estado === 'resultado' ? 'Intentar otra vez' : 'Tocar y hablar'}
        </button>
      ) : (
        <p className="aviso info">
          Este navegador no permite evaluar la voz (en iPhone funciona en Safari actualizado; en Android, en Chrome). Igual puedes escuchar y repetir en voz alta.
        </p>
      )}

      {resultado && (
        <div className={`aviso ${mensaje(resultado.nota)[1]}`} style={{ flexDirection: 'column', gap: 4 }}>
          <b style={{ fontSize: 16 }}>{mensaje(resultado.nota)[0]}</b>
          <span>
            Entendí: “{resultado.oido}” · claridad <b className="dato">{resultado.nota}%</b>
          </span>
        </div>
      )}

      <button className="boton sec ancho" onClick={siguiente}>
        Siguiente palabra <ArrowRight size={18} />
      </button>
    </>
  );
}

// ---------------- Quiz ----------------
function mezclar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function crearPreguntas(tema) {
  const palabras = conIds(tema);
  return mezclar(palabras)
    .slice(0, 8)
    .map((w, k) => {
      const tipo = k % 2 ? 'escuchar' : 'traducir';
      const otras = mezclar(palabras.filter((x) => x.id !== w.id)).slice(0, 3);
      return { w, tipo, opciones: mezclar([w, ...otras]) };
    });
}

function Quiz({ tema }) {
  const [preguntas, setPreguntas] = useState(() => crearPreguntas(tema));
  const [i, setI] = useState(0);
  const [elegida, setElegida] = useState(null);
  const [aciertos, setAciertos] = useState(0);
  const q = preguntas[i];

  const elegir = (op) => {
    if (elegida) return;
    setElegida(op.id);
    const bien = op.id === q.w.id;
    if (bien) setAciertos((a) => a + 1);
    marcarPalabra(q.w.id, bien);
    sumarPuntos(bien ? 10 : 2);
    if (q.tipo === 'traducir') hablar(q.w.en);
  };

  if (i >= preguntas.length) {
    return (
      <>
        <Encabezado titulo="Quiz" sub={tema.nombre} volver />
        <Final
          tema={tema}
          titulo={`${aciertos} de ${preguntas.length}`}
          detalle={aciertos >= preguntas.length - 1 ? '¡Excelente! Este tema ya es tuyo.' : 'Buen trabajo. Repasa las tarjetas y vuelve a intentarlo.'}
          otraVez={() => {
            setPreguntas(crearPreguntas(tema));
            setI(0);
            setAciertos(0);
            setElegida(null);
          }}
        />
      </>
    );
  }

  return (
    <>
      <Encabezado titulo="Quiz" sub={`${tema.nombre} · ${i + 1} de ${preguntas.length}`} volver />
      <div className="barra" style={{ height: 6 }}>
        <i style={{ width: `${(i / preguntas.length) * 100}%` }} />
      </div>
      <section className="tarjeta pila" style={{ alignItems: 'center', textAlign: 'center', padding: '26px 18px' }}>
        {q.tipo === 'traducir' ? (
          <>
            <span className="sub">¿Cómo se dice en inglés?</span>
            <p style={{ fontSize: 32, fontWeight: 600 }}>{q.w.es}</p>
          </>
        ) : (
          <>
            <span className="sub">Escucha y elige qué significa</span>
            <button className="boton prim" style={{ minHeight: 64, minWidth: 64, borderRadius: 22 }} onClick={() => hablar(q.w.en)} aria-label="Escuchar la palabra" autoFocus>
              <Volume2 size={28} />
            </button>
          </>
        )}
      </section>
      <div className="grid2">
        {q.opciones.map((op) => {
          const bien = elegida && op.id === q.w.id;
          const mal = elegida === op.id && op.id !== q.w.id;
          return (
            <button
              key={op.id}
              className="tarjeta"
              onClick={() => elegir(op)}
              style={{
                border: '2px solid transparent', fontWeight: 600, fontSize: 17, minHeight: 72,
                borderColor: bien ? 'var(--exito)' : mal ? 'var(--alerta)' : 'transparent',
                background: bien ? 'var(--exito-fondo)' : mal ? 'var(--alerta-fondo)' : undefined,
              }}
            >
              {q.tipo === 'traducir' ? op.en : op.es}
            </button>
          );
        })}
      </div>
      {elegida && (
        <>
          <p className={`aviso ${elegida === q.w.id ? 'ok' : 'mal'}`}>
            <span>
              {elegida === q.w.id ? '¡Correcto! ' : 'Casi. La respuesta es '}
              <b>{q.w.en}</b> = {q.w.es} (se dice “{q.w.fon}”)
            </span>
          </p>
          <button
            className="boton prim ancho"
            onClick={() => {
              setElegida(null);
              setI(i + 1);
            }}
          >
            Siguiente <ArrowRight size={18} />
          </button>
        </>
      )}
    </>
  );
}
