import { useMemo, useState } from 'react';
import { Search, Star, Ear, Maximize2, X } from 'lucide-react';
import { MOMENTOS, FRASES } from '../datos/frases';
import { PALABRAS } from '../datos/temas';
import { usePersistente } from '../lib/almacen';
import { hablar } from '../lib/voz';
import { Encabezado, Escuchar } from '../componentes/comunes';

const sinTildes = (t) => t.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Modo Aula: el apoyo silencioso durante la clase. Buscas lo que quieres
// decir, lo escuchas (en susurro si quieres) y lo dices con confianza.
export default function Aula() {
  const [busqueda, setBusqueda] = useState('');
  const [momento, setMomento] = useState('todos');
  const [favoritas, setFavoritas] = usePersistente('favoritas', []);
  const [susurro, setSusurro] = usePersistente('susurro', false);
  const [grande, setGrande] = useState(null);

  const resultados = useMemo(() => {
    const q = sinTildes(busqueda.trim());
    if (q) {
      const todo = [...FRASES, ...PALABRAS.map((p) => ({ ...p, momento: 'vocabulario' }))];
      return todo.filter((f) => sinTildes(f.es).includes(q) || sinTildes(f.en).includes(q)).slice(0, 30);
    }
    if (momento === 'favoritas') return FRASES.filter((f) => favoritas.includes(f.id));
    if (momento === 'todos') return FRASES;
    return FRASES.filter((f) => f.momento === momento);
  }, [busqueda, momento, favoritas]);

  const alternarFavorita = (id) =>
    setFavoritas((fs) => (fs.includes(id) ? fs.filter((x) => x !== id) : [...fs, id]));

  return (
    <>
      <Encabezado
        titulo="Modo Aula"
        sub="Lo que necesitas decir en clase, al instante"
        derecha={
          <button
            className={`icono-btn ${susurro ? 'activo' : ''}`}
            onClick={() => setSusurro(!susurro)}
            aria-pressed={susurro}
            aria-label="Modo susurro: el audio suena bajito para que solo tú lo escuches"
            title="Modo susurro"
          >
            <Ear size={20} />
          </button>
        }
      />

      {susurro && (
        <p className="aviso ok">
          <Ear size={18} style={{ flex: 'none' }} />
          Modo susurro activo: el audio suena bajito para que solo tú lo escuches antes de decirlo.
        </p>
      )}

      <label style={{ position: 'relative' }}>
        <Search size={19} style={{ position: 'absolute', left: 16, top: 16, color: 'var(--texto-2)' }} />
        <input
          id="buscar-frase"
          className="campo"
          style={{ paddingLeft: 46 }}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="¿Qué quieres decir? Ej.: silencio, tarea…"
          type="search"
          enterKeyHint="search"
        />
      </label>

      {!busqueda && (
        <div className="chips" role="group" aria-label="Momento de la clase">
          <button className="chip" aria-pressed={momento === 'todos'} onClick={() => setMomento('todos')}>
            Todas
          </button>
          <button className="chip" aria-pressed={momento === 'favoritas'} onClick={() => setMomento('favoritas')}>
            ★ Mis frases
          </button>
          {MOMENTOS.map((m) => (
            <button key={m.id} className="chip" aria-pressed={momento === m.id} onClick={() => setMomento(m.id)}>
              {m.nombre}
            </button>
          ))}
        </div>
      )}

      {resultados.length === 0 && (
        <p className="aviso info">
          {momento === 'favoritas' && !busqueda
            ? 'Toca la estrella de una frase para tenerla siempre a la mano aquí.'
            : 'No encontré esa frase todavía. Prueba con otra palabra o pregúntale al asistente.'}
        </p>
      )}

      <div className="pila" style={{ gap: 10 }}>
        {resultados.map((f) => (
          <article key={f.id} className="tarjeta" style={{ padding: 14 }}>
            <div className="fila" style={{ alignItems: 'flex-start', gap: 10 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}>{f.en}</p>
                <p className="sub">{f.es}</p>
                <p className="fon">“{f.fon}”</p>
              </div>
              {f.momento !== 'vocabulario' && (
                <button
                  className="icono-btn"
                  style={{ width: 38, height: 38, background: 'transparent' }}
                  onClick={() => alternarFavorita(f.id)}
                  aria-pressed={favoritas.includes(f.id)}
                  aria-label={favoritas.includes(f.id) ? 'Quitar de mis frases' : 'Guardar en mis frases'}
                >
                  <Star size={20} fill={favoritas.includes(f.id) ? '#F5B83D' : 'none'} color={favoritas.includes(f.id) ? '#F5B83D' : 'currentColor'} />
                </button>
              )}
            </div>
            <div className="fila" style={{ marginTop: 10, gap: 8 }}>
              <Escuchar texto={f.en} volumen={susurro ? 0.25 : 1} />
              <Escuchar texto={f.en} lento volumen={susurro ? 0.25 : 1} />
              <button className="boton sec peq" style={{ marginLeft: 'auto' }} onClick={() => setGrande(f)}>
                <Maximize2 size={15} /> Mostrar a la clase
              </button>
            </div>
          </article>
        ))}
      </div>

      {grande && <PantallaGrande frase={grande} alCerrar={() => setGrande(null)} />}
    </>
  );
}

// La frase en grande para mostrarla al grupo (o proyectarla)
function PantallaGrande({ frase, alCerrar }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={frase.en}
      onClick={() => hablar(frase.en)}
      style={{
        position: 'fixed', inset: 0, zIndex: 70, background: 'var(--azul)', color: '#fff',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        padding: 'calc(env(safe-area-inset-top,0px) + 24px) 24px calc(env(safe-area-inset-bottom,0px) + 24px)', gap: 18,
      }}
    >
      <button
        className="icono-btn"
        style={{ position: 'absolute', top: 'calc(env(safe-area-inset-top,0px) + 16px)', right: 16, background: 'rgba(255,255,255,.14)', color: '#fff' }}
        onClick={(e) => {
          e.stopPropagation();
          alCerrar();
        }}
        aria-label="Cerrar"
      >
        <X size={22} />
      </button>
      <img src="marca/isotipo-compacto-negativo.svg" alt="" style={{ width: 64 }} className="robot-vivo" />
      <p style={{ fontSize: 'clamp(34px, 9vw, 72px)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em', textWrap: 'balance' }}>{frase.en}</p>
      <p style={{ fontSize: 20, color: 'var(--turquesa-claro)' }}>{frase.es}</p>
      <p style={{ fontSize: 14, color: '#b5badf', marginTop: 20 }}>Toca la pantalla para escucharla</p>
    </div>
  );
}
