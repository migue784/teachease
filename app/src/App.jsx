import { House, Mic, GraduationCap, MessageCircle, User } from 'lucide-react';
import { useRuta } from './lib/ruta';
import { usePersistente } from './lib/almacen';
import { Toast, SinRed } from './componentes/comunes';
import Bienvenida from './pantallas/Bienvenida';
import Inicio from './pantallas/Inicio';
import Aula from './pantallas/Aula';
import Practicar from './pantallas/Practicar';
import Preparar from './pantallas/Preparar';
import Asistente from './pantallas/Asistente';
import Perfil from './pantallas/Perfil';
import Aprender from './pantallas/Aprender';
import Leccion from './pantallas/Leccion';
import Diagnostico from './pantallas/Diagnostico';
import Sonidos from './pantallas/Sonidos';
import Kit from './pantallas/Kit';
import Material from './pantallas/Material';

const PESTANAS = [
  { id: 'inicio', nombre: 'Inicio', Icono: House },
  { id: 'aprender', nombre: 'Aprender', Icono: GraduationCap },
  { id: 'aula', nombre: 'Modo Aula', Icono: Mic, central: true },
  { id: 'asistente', nombre: 'Asistente', Icono: MessageCircle },
  { id: 'perfil', nombre: 'Perfil', Icono: User },
];

const PANTALLAS = {
  inicio: Inicio, aula: Aula, practicar: Practicar, preparar: Preparar, asistente: Asistente, perfil: Perfil,
  aprender: Aprender, leccion: Leccion, diagnostico: Diagnostico, sonidos: Sonidos, kit: Kit, material: Material,
};

// Qué pestaña queda marcada en cada pantalla
const PESTANA_DE = { preparar: 'inicio', practicar: 'aprender', leccion: 'aprender', diagnostico: 'aprender', sonidos: 'aprender', material: 'aprender', kit: 'aula' };

export default function App() {
  const [perfil] = usePersistente('perfil', null);
  const { pantalla, params } = useRuta();

  if (!perfil) {
    return (
      <div className="app">
        <Bienvenida />
        <Toast />
      </div>
    );
  }

  const Pantalla = PANTALLAS[pantalla] || Inicio;
  const pestana = PESTANA_DE[pantalla] || pantalla;

  return (
    <div className="app">
      <SinRed />
      <main className="contenido">
        <Pantalla key={pantalla + JSON.stringify(params)} params={params} perfil={perfil} />
      </main>
      <footer className="tabbar">
        <nav aria-label="Secciones">
          {PESTANAS.map(({ id, nombre, Icono, central }) => (
            <a
              key={id}
              href={`#/${id}`}
              className={`${pestana === id ? 'activo' : ''} ${central ? 'aula' : ''}`}
              aria-current={pestana === id ? 'page' : undefined}
            >
              {central ? (
                <span className="burbuja-tab">
                  <Icono size={24} />
                </span>
              ) : (
                <Icono size={23} strokeWidth={pestana === id ? 2.4 : 2} />
              )}
              {nombre}
            </a>
          ))}
        </nav>
      </footer>
      <Toast />
    </div>
  );
}
