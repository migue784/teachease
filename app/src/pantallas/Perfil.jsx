import { useState } from 'react';
import { Flame, Trophy, Mic, Presentation, Check, Trash2 } from 'lucide-react';
import { usePersistente, borrarTodo } from '../lib/almacen';
import { leerProgreso, racha, semana, dominadas } from '../lib/progreso';
import { useInstalar } from '../lib/instalar';
import { Encabezado, Robot, avisar } from '../componentes/comunes';
import { BotonInstalar } from '../componentes/Instalar';

const NIVEL = { basico: 'Estoy empezando', intermedio: 'Me defiendo', avanzado: 'Buen nivel' };

export default function Perfil({ perfil }) {
  usePersistente('progreso', null);
  const [, setPerfil] = usePersistente('perfil', null);
  const [confirmar, setConfirmar] = useState(false);
  const { instalada } = useInstalar();
  const p = leerProgreso();
  const dias = semana(p);

  const datos = [
    { Icono: Flame, valor: racha(p), texto: 'días seguidos', color: '#FF8A3D' },
    { Icono: Trophy, valor: p.puntos, texto: 'puntos', color: 'var(--violeta)' },
    { Icono: Check, valor: dominadas(p), texto: 'palabras dominadas', color: 'var(--exito)' },
    { Icono: Mic, valor: p.pronunciadas || 0, texto: 'pronunciaciones', color: 'var(--turquesa)' },
    { Icono: Presentation, valor: p.clases || 0, texto: 'clases preparadas', color: 'var(--idea)' },
  ];

  return (
    <>
      <Encabezado titulo="Perfil" />
      <section className="tarjeta fila">
        <Robot tam={60} />
        <div style={{ minWidth: 0 }}>
          <h2 style={{ fontSize: 21, fontWeight: 600 }}>{perfil.nombre}</h2>
          <p className="sub">
            {perfil.rol} · {perfil.grado}
          </p>
          <p className="sub">Nivel: {NIVEL[perfil.nivel]}</p>
        </div>
      </section>

      <section className="tarjeta pila" aria-label="Esta semana">
        <p style={{ fontWeight: 600 }}>Esta semana</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, textAlign: 'center' }}>
          {dias.map((d) => (
            <div key={d.clave} className="pila" style={{ gap: 6, alignItems: 'center' }}>
              <span
                style={{
                  width: 34, height: 34, borderRadius: 12, display: 'grid', placeItems: 'center',
                  background: d.puntos ? 'var(--degradado)' : 'var(--superficie-2)', color: d.puntos ? '#fff' : 'var(--texto-2)',
                }}
                title={`${d.puntos} puntos`}
              >
                {d.puntos ? <Check size={16} /> : null}
              </span>
              <span className="sub" style={{ fontSize: 12 }}>
                {d.letra}
              </span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid2">
        {datos.map(({ Icono, valor, texto, color }) => (
          <div key={texto} className="tarjeta pila" style={{ gap: 4 }}>
            <Icono size={20} color={color} />
            <b className="dato" style={{ fontSize: 26 }}>
              {valor}
            </b>
            <span className="sub" style={{ fontSize: 13 }}>
              {texto}
            </span>
          </div>
        ))}
      </div>

      <p className="seccion-titulo">Meta diaria</p>
      <div className="chips envuelve">
        {[5, 10, 15, 20].map((m) => (
          <button
            key={m}
            className="chip"
            aria-pressed={perfil.meta === m}
            onClick={() => {
              setPerfil({ ...perfil, meta: m });
              avisar(`Meta: ${m} minutos al día`);
            }}
          >
            {m} min
          </button>
        ))}
      </div>

      <p className="seccion-titulo">App</p>
      {instalada ? (
        <p className="aviso ok">
          <Check size={18} style={{ flex: 'none' }} /> TeachEase está instalada en este dispositivo.
        </p>
      ) : (
        <BotonInstalar variante="boton" />
      )}

      {!confirmar ? (
        <button className="boton sec ancho" onClick={() => setConfirmar(true)}>
          <Trash2 size={18} /> Borrar mis datos
        </button>
      ) : (
        <div className="aviso mal" style={{ flexDirection: 'column', gap: 10 }}>
          <span>Se borran tu perfil, tu progreso y tus frases guardadas de este dispositivo. No se puede deshacer.</span>
          <div className="grid2">
            <button className="boton sec peq" onClick={() => setConfirmar(false)}>
              Cancelar
            </button>
            <button
              className="boton peq"
              style={{ background: 'var(--alerta)', color: '#fff' }}
              onClick={() => {
                borrarTodo();
                window.location.hash = '/inicio';
                window.location.reload();
              }}
            >
              Sí, borrar
            </button>
          </div>
        </div>
      )}

      <div className="pila" style={{ alignItems: 'center', gap: 6, marginTop: 10 }}>
        <img src="marca/logo-horizontal-sin-eslogan.svg" alt="TeachEase" style={{ height: 26 }} />
        <p className="sub" style={{ fontSize: 12.5 }}>
          Tu apoyo silencioso en el aula · versión 0.1
        </p>
        <p className="sub" style={{ fontSize: 12.5 }}>
          Tus datos se guardan solo en este dispositivo.
        </p>
      </div>
    </>
  );
}
