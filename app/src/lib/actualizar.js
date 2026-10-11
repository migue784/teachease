// Buscar una versión nueva de la app y aplicarla sin cerrar y abrir.
// El service worker revisa si hay archivos nuevos en el servidor; si los hay,
// los descarga y la app se recarga sola con la versión nueva.

export const VERSION = '0.2';
// eslint-disable-next-line no-undef
export const COMPILADA = typeof __COMPILADA__ === 'string' ? __COMPILADA__ : 'desarrollo';

export async function buscarActualizacion() {
  if (!navigator.onLine) return 'sin-red';
  const reg = await navigator.serviceWorker?.getRegistration();
  if (!reg) {
    window.location.reload();
    return 'recargando';
  }
  await reg.update();
  const nuevo = reg.installing || reg.waiting;
  if (!nuevo) return 'al-dia';
  // La versión nueva toma el control: recargamos para usarla
  navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), { once: true });
  nuevo.postMessage?.({ type: 'SKIP_WAITING' });
  setTimeout(() => window.location.reload(), 8000);
  return 'actualizando';
}
