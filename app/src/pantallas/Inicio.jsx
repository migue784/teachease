import { Flame, Presentation, Mic, Layers, ArrowRight, Star } from 'lucide-react';
import { usePersistente } from '../lib/almacen';
import { leerProgreso, racha, puntosHoy } from '../lib/progreso';
import { PALABRAS, TEMAS } from '../datos/temas';
import { Robot, Escuchar } from '../componentes/comunes';
import { BotonInstalar } from '../componentes/Instalar';

function saludo() {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

// La palabra del día cambia cada día y es la misma para todo el equipo
function palabraDelDia() {
  const d = new Date();
  const n = d.getFullYear() * 400 + d.getMonth() * 31 + d.getDate();
  return PALABRAS[n % PALABRAS.length];
}

export default function Inicio({ perfil }) {
  usePersistente('progreso', null); // vuelve a pintar cuando cambia el progreso
  const p = leerProgreso();
  const meta = (perfil.meta || 10) * 10; // 10 puntos ≈ 1 minuto de práctica
  const hoy = puntosHoy(p);
  const avance = Math.min(100, Math.round((hoy / meta) * 100));
  const dias = racha(p);
  const palabra = palabraDelDia();
  const tema = TEMAS.find((t) => t.id === palabra.tema);

  return (
    <>
      <header className="fila" style={{ alignItems: 'center' }}>
        <Robot tam={52} />
        <div style={{ minWidth: 0 }}>
          <p className="sub">{saludo()},</p>
          <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.15 }}>{perfil.nombre}</h1>
        </div>
        <div className="fila" style={{ marginLeft: 'auto', gap: 6, background: 'var(--superficie)', padding: '8px 12px', borderRadius: 14, boxShadow: 'var(--sombra)' }} title="Días seguidos practicando">
          <Flame size={20} color={dias ? '#FF8A3D' : 'var(--texto-2)'} />
          <b className="dato">{dias}</b>
        </div>
      </header>

      <section className="tarjeta oscura pila" aria-label="Meta de hoy">
        <div className="fila" style={{ justifyContent: 'space-between' }}>
          <p style={{ fontWeight: 600 }}>Meta de hoy</p>
          <p className="sub dato">
            {hoy} / {meta} puntos
          </p>
        </div>
        <div className="barra">
          <i style={{ width: `${avance}%` }} />
        </div>
        <p className="sub">
          {avance >= 100 ? '¡Meta cumplida! Lo que practiques ahora es ganancia.' : avance > 0 ? 'Vas muy bien. Un poquito más y la cumples.' : `${perfil.meta || 10} minutos al día hacen la diferencia. ¿Empezamos?`}
        </p>
      </section>

      <BotonInstalar />

      <a href="#/preparar" className="tarjeta grad fila" style={{ textDecoration: 'none', alignItems: 'center', gap: 14 }}>
        <span style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,255,255,.18)', display: 'grid', placeItems: 'center', flex: 'none' }}>
          <Presentation size={26} />
        </span>
        <span style={{ flex: 1, minWidth: 0 }}>
          <b style={{ display: 'block', fontSize: 17 }}>Prepara tu clase de mañana</b>
          <span className="sub">Elige el tema y te armo el paso a paso con actividades.</span>
        </span>
        <ArrowRight size={20} />
      </a>

      <div className="grid2">
        <a href="#/aula" className="tarjeta pila" style={{ textDecoration: 'none', color: 'inherit', gap: 8 }}>
          <Mic size={24} color="var(--turquesa)" />
          <b>Modo Aula</b>
          <span className="sub">Lo que necesitas decir en clase, al instante.</span>
        </a>
        <a href="#/practicar" className="tarjeta pila" style={{ textDecoration: 'none', color: 'inherit', gap: 8 }}>
          <Layers size={24} color="var(--violeta)" />
          <b>Practicar</b>
          <span className="sub">Tarjetas, pronunciación y quiz.</span>
        </a>
      </div>

      <section className="tarjeta pila" aria-label="Palabra del día">
        <div className="fila" style={{ justifyContent: 'space-between' }}>
          <span className="seccion-titulo" style={{ margin: 0 }}>
            <Star size={13} style={{ verticalAlign: -1 }} /> Palabra del día
          </span>
          <span className="sub">
            {tema.emoji} {tema.nombre}
          </span>
        </div>
        <div className="fila">
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.02em' }}>{palabra.en}</p>
            <p className="sub">
              {palabra.es} · <span className="fon">se dice “{palabra.fon}”</span>
            </p>
          </div>
          <Escuchar texto={palabra.en} lento />
          <Escuchar texto={palabra.en} tam={52} />
        </div>
      </section>
    </>
  );
}
