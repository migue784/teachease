// Toma capturas reales de la app (tamaño celular) para usarlas dentro del video.
// Uso: con la app servida en http://localhost:4180/teachease/ → node presentacion/scripts/capturas.js
const fs = require('fs');
const path = require('path');
const { chromium, devices } = require('playwright');

const BASE = process.env.APP_URL || 'http://localhost:4180/teachease/';
const SALIDA = path.resolve(__dirname, '../capturas');

const PERFIL = { nombre: 'Paola', rol: 'Docente', grado: 'Primaria', nivel: 'intermedio', meta: 10, desde: '2026-10-01' };
const hoy = new Date().toLocaleDateString('en-CA');
const PROGRESO = {
  puntos: 340, racha: 6, ultimoDia: hoy, dias: { [hoy]: 70 }, cajas: {}, pronunciadas: 12, clases: 3,
  lecciones: { u1l1: 3, u1l2: 3, u1l3: 2, u2l1: 3 }, nivelPrueba: 'intermedio', sonidos: { 'i-ee': 2 },
};

(async () => {
  fs.mkdirSync(SALIDA, { recursive: true });
  const ejec = '/opt/pw-browsers/chromium';
  const b = await chromium.launch({
    ...(fs.existsSync(ejec) ? { executablePath: ejec } : {}),
    args: ['--use-fake-device-for-media-stream', '--use-fake-ui-for-media-stream'],
  });
  const ctx = await b.newContext({ ...devices['iPhone 14'], colorScheme: 'light', permissions: ['microphone'] });
  const p = await ctx.newPage();
  await p.goto(BASE);
  await p.evaluate(([perfil, prog]) => {
    localStorage.setItem('teachease:perfil', JSON.stringify(perfil));
    localStorage.setItem('teachease:progreso', JSON.stringify(prog));
    localStorage.setItem('teachease:favoritas', JSON.stringify(['inicio-0', 'convivencia-0']));
  }, [PERFIL, PROGRESO]);

  const ir = async (ruta, espera = 500) => {
    await p.goto(BASE + '#/' + ruta);
    await p.reload();
    await p.waitForTimeout(espera);
  };
  const foto = (nombre, full = false) => p.screenshot({ path: path.join(SALIDA, nombre + '.png'), fullPage: full });

  await ir('inicio'); await foto('inicio');
  await ir('aprender'); await p.evaluate(() => window.scrollTo(0, 420)); await p.waitForTimeout(200); await foto('aprender');

  await ir('diagnostico');
  await p.getByRole('button', { name: /^Empezar/ }).click();
  await p.locator('.pila > button.tarjeta').first().click();
  await foto('diagnostico');

  await ir('leccion?id=u2l2');
  await foto('leccion-aprende');
  await p.getByRole('button', { name: /Entendido/ }).click();
  await p.getByRole('button', { name: /Entendido/ }).click();
  await p.getByRole('button', { name: 'What day is today?', exact: true }).click();
  await p.waitForTimeout(200);
  await foto('leccion-elige');

  await ir('sonidos?id=th-suave');
  await p.getByRole('button', { name: /Grabarme/ }).first().click();
  await p.waitForTimeout(1200);
  await p.getByRole('button', { name: /Detener/ }).first().click().catch(() => {});
  await p.waitForTimeout(800);
  await foto('pronunciacion');

  await ir('preparar?tema=animales'); await foto('preparar');
  await p.evaluate(() => window.scrollTo(0, 900)); await p.waitForTimeout(200); await foto('preparar-pasos');
  await ir('material?tema=animales&tipo=bingo');
  await p.getByRole('button', { name: /Cantar/ }).click();
  await p.waitForTimeout(200);
  await foto('bingo');
  await ir('material?tema=animales&tipo=tarjetas'); await foto('tarjetas');
  await ir('material?tema=comida&tipo=hoja'); await p.evaluate(() => window.scrollTo(0, 150)); await p.waitForTimeout(200); await foto('hoja');

  await ir('aula');
  await p.getByRole('button', { name: /Modo susurro/ }).click();
  await p.fill('#buscar-frase', 'silencio');
  await p.waitForTimeout(300);
  await foto('aula-susurro');
  await ir('aula'); await foto('aula');

  await ir('kit?h=temporizador');
  await p.getByRole('button', { name: '1 min' }).click();
  await p.getByRole('button', { name: /Iniciar/ }).click();
  await p.waitForTimeout(13500);
  await foto('temporizador');
  await ir('kit?h=semaforo');
  await p.getByRole('button', { name: /Encender/ }).click();
  await p.waitForTimeout(1200);
  await foto('semaforo');
  await ir('kit?h=ruleta');
  await p.getByRole('button', { name: /^Girar/ }).click();
  await p.waitForTimeout(4800);
  await foto('ruleta');

  await ir('asistente');
  await p.fill('#mensaje', '¿Cómo se dice saquen sus cuadernos?');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(1500);
  await foto('asistente');

  await b.close();
  console.log('Capturas en', SALIDA);
})();
