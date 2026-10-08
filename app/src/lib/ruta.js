import { useEffect, useState } from 'react';

// Navegación simple por "#/pantalla?param=valor". Funciona sin servidor
// y permite que los accesos directos del ícono abran una pantalla concreta.
function leerRuta() {
  const [camino, consulta = ''] = (window.location.hash.replace(/^#\/?/, '') || 'inicio').split('?');
  return { pantalla: camino || 'inicio', params: Object.fromEntries(new URLSearchParams(consulta)) };
}

export function useRuta() {
  const [ruta, setRuta] = useState(leerRuta);
  useEffect(() => {
    const f = () => {
      setRuta(leerRuta());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);
  return ruta;
}

export function ir(pantalla, params) {
  const q = params ? '?' + new URLSearchParams(params).toString() : '';
  window.location.hash = `/${pantalla}${q}`;
}
