import { useEffect, useState } from 'react';

// Instalación como app web (PWA).
// - Android / Chrome / Edge / computador: el navegador avisa con `beforeinstallprompt`
//   y nosotros mostramos el botón "Instalar" que abre su ventana oficial.
// - iPhone / iPad: Apple no permite abrir esa ventana desde la página, así que
//   el botón muestra los pasos (Compartir → Agregar a inicio).

let eventoGuardado = null;
const oyentes = new Set();
const avisar = () => oyentes.forEach((f) => f());

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    eventoGuardado = e;
    avisar();
  });
  window.addEventListener('appinstalled', () => {
    eventoGuardado = null;
    avisar();
  });
}

export function plataforma() {
  const ua = navigator.userAgent || '';
  const ios = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  if (ios) return 'ios';
  if (/android/i.test(ua)) return 'android';
  return 'escritorio';
}

export const estaInstalada = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true;

export function useInstalar() {
  const [, refrescar] = useState(0);
  const [instalada, setInstalada] = useState(estaInstalada);

  useEffect(() => {
    const f = () => {
      refrescar((n) => n + 1);
      setInstalada(estaInstalada());
    };
    oyentes.add(f);
    const mq = window.matchMedia?.('(display-mode: standalone)');
    mq?.addEventListener?.('change', f);
    return () => {
      oyentes.delete(f);
      mq?.removeEventListener?.('change', f);
    };
  }, []);

  const so = plataforma();
  return {
    instalada,
    plataforma: so,
    // Hay ventana oficial del navegador lista para abrir
    directa: Boolean(eventoGuardado),
    async instalar() {
      if (!eventoGuardado) return 'instrucciones';
      eventoGuardado.prompt();
      const { outcome } = await eventoGuardado.userChoice;
      eventoGuardado = null;
      avisar();
      return outcome === 'accepted' ? 'instalada' : 'cancelada';
    },
  };
}
