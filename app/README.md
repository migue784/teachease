# TeachEase · App web

App web instalable (PWA) para docentes y auxiliares que enseñan una segunda lengua.
Se abre desde el navegador y se instala en Android, iPhone y computador sin pasar por ninguna tienda.

## Qué hace hoy (versión 0.1)

| Pantalla | Qué hace |
|---|---|
| **Bienvenida** | Nombre, rol, grado, nivel de inglés y meta diaria. Botón para instalar la app. |
| **Inicio** | Saludo, racha de días, meta del día, palabra del día con audio y accesos rápidos. |
| **Modo Aula** | El diferencial: buscas en español lo que quieres decir y tienes la frase en inglés, cómo se pronuncia y el audio. Incluye **modo susurro** (el audio suena bajito para que solo lo escuche quien enseña), **mostrar a la clase** (la frase en pantalla completa) y frases favoritas. 47 frases organizadas por momento de la clase. |
| **Practicar** | 10 temas y 88 palabras. Tarjetas con repaso espaciado, pronunciación evaluada con el micrófono y quiz de escuchar y elegir. |
| **Preparar clase** | Eliges tema, grado y duración (30, 45 o 60 min) y arma la clase paso a paso: objetivo, vocabulario con audio, actividades, tiempos y frases para cada momento. Se comparte por WhatsApp. |
| **Asistente** | Chat. Sin conexión responde con el contenido de la app («¿cómo se dice…?», «¿qué significa…?», ideas de clase). Con la API de Claude configurada responde cualquier pregunta con IA. |
| **Perfil** | Progreso: racha, puntos, palabras dominadas, pronunciaciones, clases preparadas y la semana. |

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

El archivo `netlify.toml` de la raíz ya está listo para Netlify: conectar el repositorio y publicar.

Para activar el asistente con IA, en Netlify → *Site configuration → Environment variables* se agrega `ANTHROPIC_API_KEY` con una clave de [console.anthropic.com](https://console.anthropic.com). La clave nunca llega al celular. Conviene poner un límite de gasto mensual en la consola de Anthropic, porque la función es pública.
