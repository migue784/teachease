import { Lock, Star, Check, ArrowRight, AudioLines, Layers, Target } from 'lucide-react';
import { UNIDADES, LECCIONES } from '../datos/ruta';
import { usePersistente } from '../lib/almacen';
import { leerProgreso, abierta, siguienteLeccion, leccionesHechas } from '../lib/progreso';
import { ir } from '../lib/ruta';
import { Encabezado } from '../componentes/comunes';

const NIVEL = { basico: 'Estoy empezando', intermedio: 'Me defiendo', avanzado: 'Buen nivel' };

export default function Aprender() {
  usePersistente('progreso', null);
  const p = leerProgreso();
  const proxima = siguienteLeccion(p);
  const hechas = leccionesHechas(p);

  return (
    <>
      <Encabezado titulo="Aprender" sub="Tu inglés para enseñar, paso a paso" />

      {!p.nivelPrueba ? (
        <button className="tarjeta grad fila" style={{ border: 0, textAlign: 'left', color: '#fff' }} onClick={() => ir('diagnostico')}>
          <Target size={30} style={{ flex: 'none' }} />
          <span style={{ flex: 1 }}>
            <b style={{ display: 'block' }}>Descubre tu nivel en 3 minutos</b>
            <span className="sub">12 preguntas para saber por dónde empezar. Sin presión.</span>
          </span>
          <ArrowRight size={20} />
        </button>
      ) : (
        proxima && (
          <button className="tarjeta oscura pila" style={{ border: 0, textAlign: 'left', gap: 10 }} onClick={() => ir('leccion', { id: proxima.id })}>
            <span className="sub">
              Tu nivel: {NIVEL[p.nivelPrueba]} · {hechas} de {LECCIONES.length} lecciones
            </span>
            <div className="barra">
              <i style={{ width: `${(hechas / LECCIONES.length) * 100}%` }} />
            </div>
            <span className="fila" style={{ justifyContent: 'space-between' }}>
              <span>
                <span className="sub" style={{ display: 'block' }}>
                  Sigue con
                </span>
                <b style={{ fontSize: 18 }}>{proxima.titulo}</b>
              </span>
              <span className="boton blanco peq">
                Empezar <ArrowRight size={16} />
              </span>
            </span>
          </button>
        )
      )}

      <div className="grid2">
        <a href="#/sonidos" className="tarjeta pila" style={{ textDecoration: 'none', color: 'inherit', gap: 8 }}>
          <AudioLines size={24} color="var(--turquesa)" />
          <b>Pronunciación</b>
          <span className="sub">Los 10 sonidos que más cuestan. Grábate y compárate.</span>
        </a>
        <a href="#/practicar" className="tarjeta pila" style={{ textDecoration: 'none', color: 'inherit', gap: 8 }}>
          <Layers size={24} color="var(--violeta)" />
          <b>Vocabulario</b>
          <span className="sub">20 temas para tus clases: tarjetas, quiz y material.</span>
        </a>
      </div>

      <p className="seccion-titulo">Tu ruta</p>
      {UNIDADES.map((u, iu) => {
        const hechasU = u.lecciones.filter((l) => p.lecciones[l.id]).length;
        return (
          <section key={u.id} className="tarjeta pila" style={{ gap: 4, padding: 14 }} aria-label={u.titulo}>
            <div className="fila" style={{ padding: '2px 4px 8px' }}>
              <span style={{ fontSize: 26 }} aria-hidden="true">
                {u.emoji}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span className="sub" style={{ fontSize: 12.5 }}>
                  Unidad {iu + 1} · {hechasU}/{u.lecciones.length}
                </span>
                <b style={{ display: 'block', lineHeight: 1.25 }}>{u.titulo}</b>
              </div>
            </div>
            {u.lecciones.map((l) => {
              const indice = LECCIONES.findIndex((x) => x.id === l.id);
              const abre = abierta(p, indice);
              const est = p.lecciones[l.id] || 0;
              const esProxima = proxima?.id === l.id;
              return (
                <button
                  key={l.id}
                  disabled={!abre}
                  onClick={() => ir('leccion', { id: l.id })}
                  className="fila"
                  style={{
                    border: 0, borderRadius: 14, padding: '10px 10px', textAlign: 'left', width: '100%',
                    background: esProxima ? 'var(--superficie-2)' : 'transparent', opacity: abre ? 1 : 0.5,
                  }}
                >
                  <span
                    style={{
                      width: 34, height: 34, borderRadius: 12, flex: 'none', display: 'grid', placeItems: 'center',
                      background: est ? 'var(--degradado)' : 'var(--superficie-2)', color: est ? '#fff' : 'var(--texto-2)',
                    }}
                  >
                    {est ? <Check size={17} /> : abre ? <ArrowRight size={16} /> : <Lock size={15} />}
                  </span>
                  <span style={{ flex: 1, minWidth: 0, fontWeight: 500 }}>{l.titulo}</span>
                  {est > 0 && (
                    <span className="fila" style={{ gap: 1 }} aria-label={`${est} estrellas`}>
                      {[1, 2, 3].map((n) => (
                        <Star key={n} size={14} fill={n <= est ? '#F5B83D' : 'none'} color={n <= est ? '#F5B83D' : 'var(--linea)'} />
                      ))}
                    </span>
                  )}
                </button>
              );
            })}
          </section>
        );
      })}
      {p.nivelPrueba && (
        <button className="boton sec ancho" onClick={() => ir('diagnostico')}>
          Repetir la prueba de nivel
        </button>
      )}
    </>
  );
}
