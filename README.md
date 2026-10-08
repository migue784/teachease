# TeachEase

**Tu apoyo silencioso en el aula.**
Una plataforma educativa con inteligencia artificial para que docentes y auxiliares educativos aprendan y fortalezcan una segunda lengua de forma práctica, flexible e interactiva.

## Qué hay en este repositorio

- **`app/`**: la app web instalable (Android, iPhone y computador). Ver [app/README.md](app/README.md).
- **`marca/`**: el manual de marca, los logos y los colores.


```
marca/
├── index.html                     Manual de marca (se abre en el navegador)
├── TeachEase-Manual-de-Marca.pdf  El mismo manual en PDF, 18 páginas
├── assets/
│   ├── logo/                      Logos oficiales en SVG (vector)
│   │   └── png/                   Los mismos logos en PNG transparente + favicons
│   ├── fuentes/                   Poppins (licencia OFL)
│   └── referencia/                Logo original del que parte la vectorización
├── tokens/
│   ├── tokens.css                 Colores, fuente y radios como variables CSS
│   └── tokens.json                La misma información en JSON
└── scripts/
    ├── generar-logos.js           Dibuja todos los logos desde código
    └── exportar.js                Exporta PNG y PDF
```

## Piezas del logo

| Archivo | Uso |
|---|---|
| `logo-vertical.svg` | Versión principal: isotipo + nombre + eslogan |
| `logo-horizontal.svg` | Encabezados, documentos, firmas de correo |
| `logo-horizontal-sin-eslogan.svg` | Barra de navegación de la app |
| `logotipo.svg` | Solo el nombre |
| `isotipo.svg` | El robot con arco, burbuja, chispas y libro |
| `isotipo-compacto.svg` | Solo el robot (favicon, botones, tamaños pequeños) |
| `app-icono.svg` | Ícono de aplicación y avatar de redes |

Cada pieza viene en cinco variantes: color (sin sufijo), `-negativo` (sobre azul), `-blanco`, `-azul` y `-negro` (una tinta).

## Paleta

| Color | HEX |
|---|---|
| Azul Aula | `#0C1A5E` |
| Turquesa Voz | `#3FBFB0` |
| Azul Idea | `#3E5BE8` |
| Violeta Impulso | `#5B34EE` |
| Lavanda Calma | `#A9AEE3` |
| Nube | `#F3F5FB` |
| Gris Pizarra | `#5C6386` |

Tipografía: **Poppins** (SemiBold para títulos, Medium para el eslogan, Regular para texto).

## Cómo hacer cambios

```bash
npm install
npm run logos   # regenera los SVG después de tocar marca/scripts/generar-logos.js
npm run png     # exporta los PNG
npm run pdf     # exporta el manual a PDF
npm run build   # las tres cosas
```

Los colores y las formas del logo están en `marca/scripts/generar-logos.js`. Si se cambia un color, hay que actualizarlo también en `marca/tokens/` y en `marca/index.html`.

## App web

La app está en `app/` y usa los mismos logos y colores de este manual. Cómo correrla, instalarla y publicarla: [app/README.md](app/README.md).
