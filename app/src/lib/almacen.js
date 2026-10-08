import { useCallback, useEffect, useState } from 'react';

// Todo se guarda en el propio celular (localStorage). Si el navegador lo
// bloquea (modo privado), la app sigue funcionando sin recordar.
const PREFIJO = 'teachease:';

export function leer(clave, porDefecto) {
  try {
    const v = localStorage.getItem(PREFIJO + clave);
    return v == null ? porDefecto : JSON.parse(v);
  } catch {
    return porDefecto;
  }
}

export function guardar(clave, valor) {
  try {
    localStorage.setItem(PREFIJO + clave, JSON.stringify(valor));
  } catch {
    /* sin almacenamiento disponible */
  }
  window.dispatchEvent(new CustomEvent('teachease:cambio', { detail: clave }));
}

export function borrarTodo() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIJO))
      .forEach((k) => localStorage.removeItem(k));
  } catch {
    /* nada que borrar */
  }
}

// Estado de React que se guarda solo y se sincroniza entre pantallas
export function usePersistente(clave, porDefecto) {
  const [valor, setValor] = useState(() => leer(clave, porDefecto));
  useEffect(() => {
    const alCambiar = (e) => {
      if (e.detail === clave) setValor(leer(clave, porDefecto));
    };
    window.addEventListener('teachease:cambio', alCambiar);
    return () => window.removeEventListener('teachease:cambio', alCambiar);
    // porDefecto es un literal; no debe volver a suscribir
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);
  const actualizar = useCallback(
    (nuevo) => {
      const v = typeof nuevo === 'function' ? nuevo(leer(clave, porDefecto)) : nuevo;
      guardar(clave, v);
      setValor(v);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [clave]
  );
  return [valor, actualizar];
}
