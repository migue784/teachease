# TeachEase · App web

App web instalable (PWA) para docentes y auxiliares que enseñan una segunda lengua.
Se abre desde el navegador y se instala en Android, iPhone y computador sin pasar por ninguna tienda.

## Qué hace hoy (versión 0.2)

| Sección | Qué hace |
|---|---|
| **Bienvenida** | Nombre, rol, grado, nivel y meta diaria. Botón para instalar la app. |
| **Inicio** | Racha, meta del día, siguiente lección de la ruta, preparar clase, Modo Aula, Kit del aula y palabra del día. |
| **Aprender** | **Prueba de nivel** (12 preguntas) y **ruta del docente**: 6 unidades y 18 lecciones con el inglés para dar clase. Cada lección arma sola sus ejercicios: aprender, elegir, ordenar la frase, escuchar y decir. Estrellas y avance. |
| **Pronunciación** | 10 sonidos difíciles para hispanohablantes (th, v/b, ship/sheep, sh/ch, h, s inicial, j/y, w, -ed). Cómo poner la boca, **grabarse y comparar** con el modelo, y juego de "¿cuál escuchaste?". |
| **Vocabulario** | 20 temas y 179 palabras con dibujo. Tarjetas con repaso espaciado, pronunciación evaluada y quiz. |
| **Material de clase** | Por tema: **tarjetas para proyectar** en pantalla completa, **bingo** (cartones para imprimir y la app canta las palabras) y **hoja de trabajo** imprimible. |
| **Modo Aula** | 70 frases para clase buscables en español, con pronunciación, audio, modo susurro, mostrar a la clase y favoritas. |
| **Kit del aula** | **Temporizador** con campana, **ruleta** de nombres, **semáforo de ruido** (mide el volumen del salón, no graba) y **puntos por equipos**. Cada uno con las frases en inglés para usarlo. |
| **Preparar clase** | Plan paso a paso por tema, grado y duración, con enlace al material. Se comparte por WhatsApp. |
| **Asistente** | Responde sin conexión con el contenido de la app; con la API de Claude configurada responde con IA. |
| **Perfil** | Progreso, meta diaria, **buscar actualizaciones** (instala la versión nueva sin cerrar la app) y borrar datos. |

Todo funciona **sin internet** una vez abierta la app la primera vez, salvo el asistente con IA. El progreso se guarda solo en el celular de cada persona.

## Instalar la app (lo que ve la persona)

- **Android (Chrome, Edge, Samsung Internet):** botón **Instalar** dentro de la app, que abre la ventana oficial del navegador.
- **iPhone / iPad:** Apple no deja que una página abra esa ventana, así que el botón muestra los 3 pasos: Compartir → Agregar a inicio → Agregar.
- **Computador (Chrome o Edge):** botón Instalar, o el ícono al final de la barra de direcciones.

Requisito: la app tiene que estar publicada en una dirección con **https**. En `localhost` también funciona para pruebas.

## Programar

```bash
cd app
npm install
npm run dev       # http://localhost:5173 (y en la red local, para probar en el celular)
npm run build     # genera dist/ listo para publicar
npm run preview   # sirve dist/ como quedaría publicado
npm run iconos    # regenera los íconos desde marca/assets/logo
```

```
app/
├── public/              íconos de la app y logos (copiados del manual de marca)
├── netlify/functions/   asistente.mjs: llama a Claude desde el servidor
├── scripts/iconos.mjs   genera los íconos de Android e iPhone
└── src/
    ├── datos/           temas y vocabulario, frases del aula, actividades
    ├── lib/             voz, instalación, progreso, guardado, asistente, rutas
    ├── componentes/     piezas compartidas y botón de instalar
    └── pantallas/       una por sección
```

Para agregar contenido no hace falta tocar pantallas: se agregan temas en `src/datos/temas.js`, frases en `src/datos/frases.js` y actividades en `src/datos/actividades.js`.

## Publicar

La app está publicada en **https://migue784.github.io/teachease/**. Cada cambio que se sube a `app/` se compila y se publica solo con el proceso `.github/workflows/publicar-app.yml` (rama `gh-pages`). En el celular, Perfil → **Buscar actualizaciones** trae la versión nueva al instante.

También se puede publicar en Netlify:

El archivo `netlify.toml` de la raíz ya está listo para Netlify: conectar el repositorio y publicar.

Para activar el asistente con IA, en Netlify → *Site configuration → Environment variables* se agrega `ANTHROPIC_API_KEY` con una clave de [console.anthropic.com](https://console.anthropic.com). La clave nunca llega al celular. Conviene poner un límite de gasto mensual en la consola de Anthropic, porque la función es pública.
