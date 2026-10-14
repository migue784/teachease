# Video de presentación de TeachEase

Video de 3 minutos (1920×1080) hecho con código: animaciones en HTML y CSS con la marca y capturas reales de la app, exportado a MP4.

| Archivo | Qué es |
|---|---|
| `GUION.md` | El guion para grabar la voz, con tiempos por escena |
| `salida/TeachEase-video.mp4` | El video final, sin voz |
| `salida/TeachEase-ensayo.mp4` | El mismo video con el guion abajo (teleprompter) y un reloj, para grabar la voz |
| `video.html` | El video en sí; se puede abrir en el navegador para verlo (`?ensayo` muestra el teleprompter, `?t=40` empieza en el segundo 40) |
| `guion.js` | Los textos y los tiempos de cada escena; de aquí salen el teleprompter y `GUION.md` |
| `capturas/` | Pantallas reales de la app usadas en el video |

## Cambiar algo

- **Un texto de la voz:** editar `guion.js` y correr `npm run guion`.
- **Lo que se ve:** editar `video.html`. Cada elemento tiene `--d`, el segundo en que aparece.
- **Volver a exportar:** `npm run video` y `npm run video:ensayo` (tardan unos minutos).
- **Capturas nuevas de la app:** servir `app/dist` en `http://localhost:4180/teachease/` y correr `npm run video:capturas`.
