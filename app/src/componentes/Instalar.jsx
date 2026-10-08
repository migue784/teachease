import { useState } from 'react';
import { Download, Share, SquarePlus, EllipsisVertical, Smartphone, Check } from 'lucide-react';
import { useInstalar } from '../lib/instalar';
import { Hoja, avisar } from './comunes';

// Botón "Instalar app". En Android/computador abre la ventana oficial del
// navegador; en iPhone muestra los pasos porque Safari no permite abrirla.
export function BotonInstalar({ variante = 'tarjeta' }) {
  const { instalada, plataforma, directa, instalar } = useInstalar();
  const [ayuda, setAyuda] = useState(false);
  if (instalada) return null;

  const tocar = async () => {
    const r = await instalar();
    if (r === 'instrucciones') setAyuda(true);
    if (r === 'instalada') avisar('¡Listo! TeachEase quedó en tu pantalla de inicio');
  };

  return (
    <>
      {variante === 'tarjeta' ? (
        <div className="tarjeta grad fila" style={{ alignItems: 'center' }}>
          <Smartphone size={30} style={{ flex: 'none' }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontWeight: 600 }}>Instala TeachEase</p>
            <p className="sub">Ábrela como una app, sin tienda y sin ocupar casi espacio.</p>
          </div>
          <button className="boton blanco peq" onClick={tocar}>
            <Download size={16} /> Instalar
          </button>
        </div>
      ) : (
        <button className="boton prim ancho" onClick={tocar}>
          <Download size={18} /> Instalar app
        </button>
      )}
      <Hoja abierta={ayuda} alCerrar={() => setAyuda(false)} etiqueta="Cómo instalar TeachEase">
        <Instrucciones plataforma={plataforma} directa={directa} />
        <button className="boton sec ancho" onClick={() => setAyuda(false)}>
          Entendido
        </button>
      </Hoja>
    </>
  );
}

function Instrucciones({ plataforma }) {
  if (plataforma === 'ios') {
    return (
      <>
        <h2>Instalar en iPhone o iPad</h2>
        <p className="sub" style={{ marginTop: 6 }}>Toma menos de 10 segundos. Hazlo desde Safari.</p>
        <ol className="pasos">
          <li>
            <span className="n">1</span>
            <span>
              Toca el botón <b>Compartir</b>
              <span className="icono-paso">
                <Share size={16} />
              </span>
              abajo en la barra de Safari (en iPad está arriba).
            </span>
          </li>
          <li>
            <span className="n">2</span>
            <span>
              Desliza y elige <b>Agregar a inicio</b>
              <span className="icono-paso">
                <SquarePlus size={16} />
              </span>
            </span>
          </li>
          <li>
            <span className="n">3</span>
            <span>
              Toca <b>Agregar</b>. El robot de TeachEase aparece en tu pantalla de inicio.
            </span>
          </li>
        </ol>
        <p className="aviso info" style={{ marginBottom: 16 }}>
          Si usas Chrome en el iPhone, el botón Compartir está arriba a la derecha y funciona igual.
        </p>
      </>
    );
  }
  if (plataforma === 'android') {
    return (
      <>
        <h2>Instalar en Android</h2>
        <ol className="pasos">
          <li>
            <span className="n">1</span>
            <span>
              Abre el menú del navegador
              <span className="icono-paso">
                <EllipsisVertical size={16} />
              </span>
              arriba a la derecha.
            </span>
          </li>
          <li>
            <span className="n">2</span>
            <span>
              Toca <b>Instalar app</b> o <b>Agregar a la pantalla principal</b>.
            </span>
          </li>
          <li>
            <span className="n">3</span>
            <span>Confirma. TeachEase queda con su ícono, como cualquier app.</span>
          </li>
        </ol>
      </>
    );
  }
  return (
    <>
      <h2>Instalar en el computador</h2>
      <ol className="pasos">
        <li>
          <span className="n">1</span>
          <span>
            En Chrome o Edge, busca el ícono de instalar
            <span className="icono-paso">
              <Download size={16} />
            </span>
            al final de la barra de direcciones.
          </span>
        </li>
        <li>
          <span className="n">2</span>
          <span>
            Toca <b>Instalar</b>. TeachEase se abre en su propia ventana.
          </span>
        </li>
      </ol>
      <p className="aviso ok" style={{ marginBottom: 16 }}>
        <Check size={18} style={{ flex: 'none' }} /> En Safari de Mac: menú Archivo → Agregar al Dock.
      </p>
    </>
  );
}
