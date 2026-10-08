import { House, Mic, Layers, MessageCircle, User } from 'lucide-react';
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

const PESTANAS = [
  { id: 'inicio', nombre: 'Inicio', Icono: House },
  { id: 'practicar', nombre: 'Practicar', Icono: Layers },
  { id: 'aula', nombre: 'Modo Aula', Icono: Mic, central: true },
  { id: 'asistente', nombre: 'Asistente', Icono: MessageCircle },
  { id: 'perfil', nombre: 'Perfil', Icono: User },
];

const PANTALLAS = { inicio: Inicio, aula: Aula, practicar: Practicar, preparar: Preparar, asistente: Asistente, perfil: Perfil };

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
  const pestana = pantalla === 'preparar' ? 'inicio' : pantalla;

  return (
    <div className="app">
      <SinRed />
      <main className="contenido">
        <Pantalla params={params} perfil={perfil} />
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
