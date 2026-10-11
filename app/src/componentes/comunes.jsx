import { useEffect, useState } from 'react';
import { ChevronLeft, Volume2, Turtle, WifiOff } from 'lucide-react';
import { hablar, puedeHablar } from '../lib/voz';

export function Encabezado({ titulo, sub, volver, derecha }) {
  return (
    <header className="encabezado">
      {volver && (
        <button className="volver" onClick={() => (window.history.length > 1 ? window.history.back() : (window.location.hash = '/inicio'))} aria-label="Volver">
          <ChevronLeft size={22} />
        </button>
      )}
      <div style={{ minWidth: 0 }}>
        <h1>{titulo}</h1>
        {sub && <p className="sub">{sub}</p>}
      </div>
      {derecha && <div className="derecha">{derecha}</div>}
    </header>
  );
}

// Botón para escuchar una palabra o frase en inglés (normal o lento)
export function Escuchar({ texto, lento = false, volumen = 1, tam = 44, etiqueta }) {
  const [suena, setSuena] = useState(false);
  if (!puedeHablar()) return null;
  const tocar = () => {
    hablar(texto, { lento, volumen });
    setSuena(true);
    setTimeout(() => setSuena(false), Math.min(4000, 700 + texto.length * (lento ? 110 : 70)));
  };
  return (
    <button
      className={`icono-btn ${suena ? 'suena' : ''}`}
      style={{ width: tam, height: tam }}
      onClick={tocar}
      aria-label={etiqueta || `Escuchar ${lento ? 'despacio ' : ''}“${texto}”`}
    >
      {lento ? <Turtle size={tam * 0.45} /> : <Volume2 size={tam * 0.45} />}
    </button>
  );
}

export function Hoja({ abierta, alCerrar, children, etiqueta }) {
  useEffect(() => {
    if (!abierta) return;
    const f = (e) => e.key === 'Escape' && alCerrar();
    window.addEventListener('keydown', f);
    return () => window.removeEventListener('keydown', f);
  }, [abierta, alCerrar]);
  if (!abierta) return null;
  return (
    <div className="velo" onClick={alCerrar}>
      <div className="hoja" role="dialog" aria-modal="true" aria-label={etiqueta} onClick={(e) => e.stopPropagation()}>
        <div className="asa" />
        {children}
      </div>
    </div>
  );
}

let mostrarToast = () => {};
export const avisar = (t) => mostrarToast(t);

export function Toast() {
  const [texto, setTexto] = useState(null);
  useEffect(() => {
    let t;
    mostrarToast = (m) => {
      setTexto(m);
      clearTimeout(t);
      t = setTimeout(() => setTexto(null), 2400);
    };
    return () => clearTimeout(t);
  }, []);
  return texto ? (
    <div className="toast" role="status">
      {texto}
    </div>
  ) : null;
}

export function SinRed() {
  const [enLinea, setEnLinea] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setEnLinea(true);
    const off = () => setEnLinea(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  if (enLinea) return null;
  return (
    <div className="sin-red" role="status">
      <WifiOff size={13} style={{ verticalAlign: -2, marginRight: 6 }} />
      Sin internet · la práctica sigue funcionando
    </div>
  );
}

// El robot cambia solo a su versión clara cuando el celular está en modo oscuro
export const Robot = ({ tam = 56, negativo = false, vivo = true }) => (
  <picture style={{ flex: 'none', display: 'block' }}>
    {!negativo && <source srcSet="marca/isotipo-compacto-negativo.svg" media="(prefers-color-scheme: dark)" />}
    <img
      src={`marca/isotipo-compacto${negativo ? '-negativo' : ''}.svg`}
      alt=""
      width={tam}
      height={tam}
      className={vivo ? 'robot-vivo' : ''}
      style={{ width: tam, height: tam }}
    />
  </picture>
);
