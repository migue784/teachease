import { useEffect, useRef, useState } from 'react';
import { Send, Trash2, Sparkles } from 'lucide-react';
import { usePersistente } from '../lib/almacen';
import { responder } from '../lib/asistente';
import { Encabezado, Escuchar, Robot } from '../componentes/comunes';

const BIENVENIDA = (nombre) => ({
  de: 'bot',
  texto: `¡Hola, ${nombre}! Soy tu asistente. Pregúntame cómo se dice algo en inglés, qué significa una palabra o pídeme ideas para tu clase.`,
  sugerencias: ['¿Cómo se dice “saquen sus cuadernos”?', 'Dame una idea de clase de animales', '¿Qué significa “well done”?'],
});

export default function Asistente({ perfil }) {
  const [mensajes, setMensajes] = usePersistente('chat', []);
  const [texto, setTexto] = useState('');
  const [pensando, setPensando] = useState(false);
  const fin = useRef(null);
  const lista = mensajes.length ? mensajes : [BIENVENIDA(perfil.nombre)];

  useEffect(() => {
    fin.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [lista.length, pensando]);

  const enviar = async (contenido) => {
    const limpio = contenido.trim();
    if (!limpio || pensando) return;
    const nuevos = [...lista, { de: 'yo', texto: limpio }];
    setMensajes(nuevos.slice(-40));
    setTexto('');
    setPensando(true);
    const r = await responder(nuevos, perfil);
    setPensando(false);
    setMensajes([...nuevos, { de: 'bot', ...r }].slice(-40));
  };

  return (
    <>
      <Encabezado
        titulo="Asistente"
        sub="Tu apoyo para preparar y dar la clase"
        derecha={
          mensajes.length > 0 && (
            <button className="icono-btn" onClick={() => setMensajes([])} aria-label="Borrar conversación">
              <Trash2 size={19} />
            </button>
          )
        }
      />

      <div className="pila" style={{ gap: 10, paddingBottom: 90 }} aria-live="polite">
        {lista.map((m, k) => (
          <Mensaje key={k} m={m} alSugerir={enviar} />
        ))}
        {pensando && (
          <div className="fila" style={{ gap: 8 }}>
            <Robot tam={30} vivo={false} />
            <span className="tarjeta" style={{ padding: '12px 16px', borderBottomLeftRadius: 6 }}>
              <span className="sub">Pensando…</span>
            </span>
          </div>
        )}
        <div ref={fin} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          enviar(texto);
        }}
        style={{
          position: 'fixed', left: 0, right: 0, bottom: 'calc(var(--tabbar) + env(safe-area-inset-bottom, 0px))', zIndex: 20,
          padding: '10px 14px', background: 'linear-gradient(transparent, var(--fondo) 30%)',
        }}
      >
        <div className="fila" style={{ maxWidth: 612, margin: '0 auto', gap: 8 }}>
          <label htmlFor="mensaje" style={{ position: 'absolute', left: -9999 }}>
            Escribe tu pregunta
          </label>
          <input id="mensaje" className="campo" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe tu pregunta…" autoComplete="off" enterKeyHint="send" />
          <button className="icono-btn activo" style={{ width: 50, height: 50, borderRadius: 16 }} type="submit" aria-label="Enviar" disabled={!texto.trim() || pensando}>
            <Send size={20} />
          </button>
        </div>
      </form>
    </>
  );
}

function Mensaje({ m, alSugerir }) {
  if (m.de === 'yo') {
    return (
      <p style={{ alignSelf: 'flex-end', maxWidth: '85%', background: 'var(--violeta)', color: '#fff', padding: '11px 15px', borderRadius: 20, borderBottomRightRadius: 6, lineHeight: 1.45 }}>
        {m.texto}
      </p>
    );
  }
  return (
    <div className="fila" style={{ alignItems: 'flex-end', gap: 8 }}>
      <Robot tam={30} vivo={false} />
      <div className="tarjeta pila" style={{ padding: '12px 14px', borderBottomLeftRadius: 6, maxWidth: '88%', gap: 10 }}>
        <p style={{ lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>{m.texto}</p>
        {m.frases?.map((f) => (
          <div key={f.id} className="fila" style={{ background: 'var(--superficie-2)', borderRadius: 14, padding: '8px 8px 8px 12px', gap: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <b>{f.en}</b>
              <p className="sub" style={{ fontSize: 13 }}>
                {f.es} · <span className="fon">“{f.fon}”</span>
              </p>
            </div>
            <Escuchar texto={f.en} tam={38} />
          </div>
        ))}
        {m.enlaces?.map((e) => (
          <a key={e.href} href={e.href} className="boton sec peq" style={{ textDecoration: 'none', alignSelf: 'flex-start' }}>
            {e.texto}
          </a>
        ))}
        {m.sugerencias && (
          <div className="pila" style={{ gap: 6 }}>
            {m.sugerencias.map((s) => (
              <button key={s} className="chip" style={{ textAlign: 'left', whiteSpace: 'normal' }} onClick={() => alSugerir(s)}>
                {s}
              </button>
            ))}
          </div>
        )}
        {m.ia && (
          <span className="sub" style={{ fontSize: 11.5 }}>
            <Sparkles size={11} style={{ verticalAlign: -1 }} /> Respuesta con IA
          </span>
        )}
      </div>
    </div>
  );
}
