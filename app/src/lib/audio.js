// Audio del navegador: sonidos cortos (temporizador, ruleta), grabadora de voz
// para comparar la pronunciación, y medidor de ruido del salón.
// Nada de lo que se graba o se escucha sale del celular.

let ctx = null;
function contexto() {
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// Un tono corto; varias notas seguidas hacen una campanita
export function tono(frecuencias = [880], duracion = 0.18, volumen = 0.25) {
  const c = contexto();
  if (!c) return;
  frecuencias.forEach((f, i) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.value = f;
    const t0 = c.currentTime + i * duracion;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(volumen, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + duracion * 0.95);
    o.connect(g).connect(c.destination);
    o.start(t0);
    o.stop(t0 + duracion);
  });
}

export const campana = () => tono([784, 988, 1175, 1568], 0.22, 0.3);
export const clic = () => tono([1200], 0.03, 0.08);

export const puedeGrabar = () => Boolean(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);

// Graba hasta `maxMs` y devuelve una URL para reproducir lo grabado
export async function grabar({ maxMs = 4000, alEmpezar } = {}) {
  const flujo = await navigator.mediaDevices.getUserMedia({ audio: true });
  const tipos = ['audio/webm', 'audio/mp4', 'audio/aac', ''];
  const mimeType = tipos.find((t) => !t || MediaRecorder.isTypeSupported?.(t));
  const rec = new MediaRecorder(flujo, mimeType ? { mimeType } : undefined);
  const partes = [];
  rec.ondataavailable = (e) => e.data.size && partes.push(e.data);
  const listo = new Promise((ok) => {
    rec.onstop = () => {
      flujo.getTracks().forEach((t) => t.stop());
      ok(URL.createObjectURL(new Blob(partes, { type: rec.mimeType || 'audio/webm' })));
    };
  });
  rec.start();
  alEmpezar?.();
  const corte = setTimeout(() => rec.state === 'recording' && rec.stop(), maxMs);
  return {
    detener: () => {
      clearTimeout(corte);
      if (rec.state === 'recording') rec.stop();
    },
    listo,
  };
}

// Medidor de ruido: llama a `alMedir(nivel 0..1)` unas 20 veces por segundo
export async function medirRuido(alMedir) {
  const flujo = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false } });
  const c = contexto();
  const fuente = c.createMediaStreamSource(flujo);
  const analizador = c.createAnalyser();
  analizador.fftSize = 1024;
  fuente.connect(analizador);
  const datos = new Float32Array(analizador.fftSize);
  let suave = 0;
  const id = setInterval(() => {
    analizador.getFloatTimeDomainData(datos);
    let suma = 0;
    for (const v of datos) suma += v * v;
    const rms = Math.sqrt(suma / datos.length);
    // a decibelios relativos y luego a 0..1 (de -60 dB a -10 dB)
    const db = 20 * Math.log10(rms || 1e-6);
    const nivel = Math.min(1, Math.max(0, (db + 60) / 50));
    suave = suave * 0.8 + nivel * 0.2;
    alMedir(suave);
  }, 50);
  return () => {
    clearInterval(id);
    fuente.disconnect();
    flujo.getTracks().forEach((t) => t.stop());
  };
}

// Mantener la pantalla encendida mientras se usa una herramienta en clase
export async function pantallaEncendida() {
  try {
    const lock = await navigator.wakeLock?.request('screen');
    return () => lock?.release();
  } catch {
    return () => {};
  }
}
