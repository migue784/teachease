import { useEffect, useMemo, useState } from 'react';
import { Printer, Shuffle, ChevronLeft, ChevronRight, X, Eye, EyeOff, Megaphone, Presentation, Grid3x3, FileText } from 'lucide-react';
import { temaPorId, TEMAS } from '../datos/temas';
import { hablar } from '../lib/voz';
import { mezclar } from '../lib/leccion';
import { ir } from '../lib/ruta';
import { Encabezado, Escuchar } from '../componentes/comunes';

const TIPOS = [
  { id: 'tarjetas', nombre: 'Tarjetas para proyectar', desc: 'Dibujo grande en pantalla completa, con audio', Icono: Presentation },
  { id: 'bingo', nombre: 'Bingo', desc: 'Cartones para imprimir y la app canta las palabras', Icono: Grid3x3 },
  { id: 'hoja', nombre: 'Hoja de trabajo', desc: 'Unir, completar y dibujar, lista para imprimir', Icono: FileText },
];

export default function Material({ params }) {
  const tema = temaPorId(params.tema);
  if (!tema) {
    return (
      <>
        <Encabezado titulo="Material de clase" sub="Elige el tema" volver />
        <div className="grid2">
          {TEMAS.map((t) => (
            <button key={t.id} className="tarjeta fila" style={{ border: 0, gap: 10, textAlign: 'left' }} onClick={() => ir('material', { tema: t.id })}>
              <span style={{ fontSize: 26 }} aria-hidden="true">
                {t.emoji}
              </span>
              <b style={{ fontSize: 15, lineHeight: 1.25 }}>{t.nombre}</b>
            </button>
          ))}
        </div>
      </>
    );
  }
  if (params.tipo === 'tarjetas') return <Tarjetas tema={tema} />;
  if (params.tipo === 'bingo') return <Bingo tema={tema} />;
  if (params.tipo === 'hoja') return <Hoja tema={tema} />;
  return (
    <>
      <Encabezado titulo={`${tema.emoji} ${tema.nombre}`} sub="Material listo para tu clase" volver />
      <div className="pila" style={{ gap: 10 }}>
        {TIPOS.map(({ id, nombre, desc, Icono }) => (
          <button key={id} className="tarjeta fila" style={{ border: 0, textAlign: 'left' }} onClick={() => ir('material', { tema: tema.id, tipo: id })}>
            <span style={{ width: 50, height: 50, borderRadius: 16, background: 'var(--superficie-2)', display: 'grid', placeItems: 'center', flex: 'none', color: 'var(--violeta)' }}>
              <Icono size={24} />
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <b style={{ display: 'block' }}>{nombre}</b>
              <span className="sub">{desc}</span>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

// Los emojis "texto" (LUN, 10…) se ven como palabra; los demás como dibujo grande
const esDibujo = (e) => !/^[A-ZÁÉÍÓÚ0-9]+$/.test(e);

// ---------------- Tarjetas para proyectar ----------------
function Tarjetas({ tema }) {
  const [i, setI] = useState(0);
  const [ver, setVer] = useState(true);
  const w = tema.palabras[i];
  const mover = (d) => setI((x) => (x + d + tema.palabras.length) % tema.palabras.length);

  useEffect(() => {
    const f = (e) => {
      if (e.key === 'ArrowRight') mover(1);
      if (e.key === 'ArrowLeft') mover(-1);
      if (e.key === ' ') hablar(w.en);
      if (e.key === 'Escape') window.history.back();
    };
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  });

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Tarjetas de ${tema.nombre}`}
      style={{
        position: 'fixed', inset: 0, zIndex: 70, background: 'var(--azul)', color: '#fff', display: 'flex', flexDirection: 'column',
        padding: 'calc(env(safe-area-inset-top,0px) + 14px) 16px calc(env(safe-area-inset-bottom,0px) + 16px)',
      }}
    >
      <div className="fila" style={{ justifyContent: 'space-between' }}>
        <button className="icono-btn" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }} onClick={() => window.history.back()} aria-label="Cerrar">
          <X size={22} />
        </button>
        <span className="dato" style={{ opacity: 0.8 }}>
          {i + 1} / {tema.palabras.length}
        </span>
        <button className="icono-btn" style={{ background: 'rgba(255,255,255,.14)', color: '#fff' }} onClick={() => setVer(!ver)} aria-label={ver ? 'Ocultar la palabra' : 'Mostrar la palabra'}>
          {ver ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      <button
        onClick={() => hablar(w.en)}
        style={{ flex: 1, background: 'none', border: 0, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 18 }}
        aria-label={`Escuchar ${w.en}`}
      >
        <span style={{ fontSize: esDibujo(w.emoji) ? 'min(42vw, 40vh)' : 'min(30vw, 26vh)', lineHeight: 1, fontWeight: 700 }}>{w.emoji}</span>
        <span style={{ fontSize: 'clamp(40px, 11vw, 96px)', fontWeight: 600, letterSpacing: '-0.02em', visibility: ver ? 'visible' : 'hidden' }}>{w.en}</span>
      </button>
      <div className="fila" style={{ justifyContent: 'center', gap: 16 }}>
        <button className="icono-btn" style={{ width: 60, height: 60, borderRadius: 20, background: 'rgba(255,255,255,.14)', color: '#fff' }} onClick={() => mover(-1)} aria-label="Anterior">
          <ChevronLeft size={28} />
        </button>
        <button className="icono-btn" style={{ width: 60, height: 60, borderRadius: 20, background: 'var(--turquesa)', color: 'var(--azul)' }} onClick={() => mover(1)} aria-label="Siguiente">
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}

// ---------------- Bingo ----------------
function crearCarton(palabras) {
  const lado = palabras.length >= 8 ? 3 : 2;
  const casillas = mezclar(palabras).slice(0, lado === 3 ? 8 : 4);
  if (lado === 3) casillas.splice(4, 0, null); // centro libre
  return { lado, casillas };
}

function Bingo({ tema }) {
  const generar = (n) => Array.from({ length: n }, () => crearCarton(tema.palabras));
  const [cantidad, setCantidad] = useState(8);
  const [cartones, setCartones] = useState(() => generar(8));
  const [cantadas, setCantadas] = useState([]);

  const cantar = () => {
    const quedan = tema.palabras.filter((w) => !cantadas.includes(w.en));
    if (!quedan.length) return;
    const w = quedan[Math.floor(Math.random() * quedan.length)];
    setCantadas([w.en, ...cantadas]);
    hablar(w.en);
  };
  const ultima = tema.palabras.find((w) => w.en === cantadas[0]);

  return (
    <>
      <div className="no-imprimir pila">
        <Encabezado titulo="Bingo" sub={tema.nombre} volver />
        <section className="tarjeta oscura pila" style={{ alignItems: 'center', textAlign: 'center' }}>
          <span className="sub">La app canta las palabras</span>
          {ultima ? (
            <>
              <span style={{ fontSize: 64, lineHeight: 1 }}>{ultima.emoji}</span>
              <b style={{ fontSize: 30 }}>{ultima.en}</b>
            </>
          ) : (
            <b style={{ fontSize: 20 }}>¿Listos? Toca “Cantar”.</b>
          )}
          <div className="fila" style={{ gap: 8 }}>
            <button className="boton blanco" onClick={cantar} disabled={cantadas.length >= tema.palabras.length}>
              <Megaphone size={18} /> Cantar
            </button>
            {ultima && <Escuchar texto={ultima.en} />}
          </div>
          {cantadas.length > 0 && (
            <p className="sub" style={{ fontSize: 13 }}>
              Ya salieron ({cantadas.length}): {cantadas.join(', ')}
            </p>
          )}
          {cantadas.length > 0 && (
            <button className="boton claro peq" onClick={() => setCantadas([])}>
              Nueva partida
            </button>
          )}
        </section>
        <p className="seccion-titulo">Cartones para imprimir</p>
        <div className="chips envuelve">
          {[4, 8, 12, 20, 30].map((n) => (
            <button
              key={n}
              className="chip"
              aria-pressed={cantidad === n}
              onClick={() => {
                setCantidad(n);
                setCartones(generar(n));
              }}
            >
              {n} cartones
            </button>
          ))}
        </div>
        <div className="grid2">
          <button className="boton sec" onClick={() => setCartones(generar(cantidad))}>
            <Shuffle size={18} /> Mezclar
          </button>
          <button className="boton prim" onClick={() => window.print()}>
            <Printer size={18} /> Imprimir
          </button>
        </div>
      </div>
      <div className="hoja-impresion bingo">
        {cartones.map((c, k) => (
          <div key={k} className="carton">
            <p className="carton-titulo">
              BINGO · {tema.nombre} <span>#{k + 1}</span>
            </p>
            <div className="carton-grilla" style={{ gridTemplateColumns: `repeat(${c.lado}, 1fr)` }}>
              {c.casillas.map((w, j) =>
                w ? (
                  <div key={j} className="casilla">
                    <span className="casilla-emoji">{w.emoji}</span>
                    <span>{w.en}</span>
                  </div>
                ) : (
                  <div key={j} className="casilla libre">
                    ★<span>FREE</span>
                  </div>
                )
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// ---------------- Hoja de trabajo ----------------
function ocultarLetras(palabra) {
  return palabra
    .split('')
    .map((ch, i) => (/[a-z]/i.test(ch) && i % 2 === 1 ? '_' : ch))
    .join(' ');
}

function Hoja({ tema }) {
  const [semilla, setSemilla] = useState(0);
  const { unir, derecha, completar } = useMemo(() => {
    const u = mezclar(tema.palabras).slice(0, 5);
    return { unir: u, derecha: mezclar(u), completar: mezclar(tema.palabras).slice(0, 4) };
    // semilla solo sirve para volver a mezclar
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tema, semilla]);
  const pista = (w) => (esDibujo(w.emoji) ? w.emoji : w.es);

  return (
    <>
      <div className="no-imprimir pila">
        <Encabezado titulo="Hoja de trabajo" sub={tema.nombre} volver />
        <div className="grid2">
          <button className="boton sec" onClick={() => setSemilla(semilla + 1)}>
            <Shuffle size={18} /> Otra versión
          </button>
          <button className="boton prim" onClick={() => window.print()}>
            <Printer size={18} /> Imprimir
          </button>
        </div>
        <p className="sub">Así se verá en papel:</p>
      </div>
      <article className="hoja-impresion hoja-trabajo">
        <header className="ht-cabecera">
          <div>
            <p className="ht-titulo">
              {tema.emoji} {tema.nombre} · English worksheet
            </p>
            <p>Name: ______________________ Date: __________</p>
          </div>
          <img src="marca/isotipo-compacto.svg" alt="" className="ht-logo" />
        </header>

        <section>
          <p className="ht-consigna">1. Match the picture with the word. · Une cada dibujo con su palabra.</p>
          <div className="ht-unir">
            <ol>
              {unir.map((w) => (
                <li key={w.en}>
                  <span className="ht-dibujo">{pista(w)}</span> ●
                </li>
              ))}
            </ol>
            <ol type="a">
              {derecha.map((w) => (
                <li key={w.en}>● {w.en}</li>
              ))}
            </ol>
          </div>
        </section>

        <section>
          <p className="ht-consigna">2. Complete the words. · Completa las palabras.</p>
          <div className="ht-completar">
            {completar.map((w) => (
              <div key={w.en}>
                <span className="ht-dibujo">{pista(w)}</span>
                <span className="ht-letras">{ocultarLetras(w.en)}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="ht-consigna">3. Draw and write your favorite. · Dibuja y escribe tu favorito.</p>
          <div className="ht-dibujar" />
          <p>My favorite is: ______________________</p>
        </section>
        <p className="ht-pie">TeachEase · tu apoyo silencioso en el aula</p>
      </article>
    </>
  );
}
