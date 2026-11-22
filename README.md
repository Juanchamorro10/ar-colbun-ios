# Recorrido AR Angostura (versión iOS / web)

Cada QR abre `?e=N` y la página muestra el modelo 3D de esa estación con botón **Ver en AR**
(en iPhone usa AR Quick Look de Safari, sin instalar nada).

## Estructura
- `index.html`  → la página (estaciones se editan en el arreglo `ESTACIONES`)
- `models/`     → un `.glb` por estación (ahora son figuras de prueba)
- `lib/`        → model-viewer y generador QR, locales (no dependen de CDN)
- `sw.js`       → cache para uso sin conexión después de la primera carga
- `qr.html`     → genera los 5 QR para imprimir

## Pasos
1. En Blender: File → Export → glTF 2.0 (.glb). Nombra `estacion1.glb` … `estacion5.glb` y reemplaza los de `models/`.
   Pesos recomendados: menos de 5 MB por modelo; marca "Compression" solo si lo necesitas.
2. Edita títulos, textos y audio en `ESTACIONES` dentro de `index.html`.
3. Sube la carpeta a un repo de GitHub → Settings → Pages (HTTPS es obligatorio para AR).
4. Abre `qr.html` en tu sitio publicado, pega la URL y genera los QR.
5. Prueba en un iPhone real con Safari (el simulador no sirve para AR).

## Animaciones
El visor 3D de la página reproduce las animaciones del .glb. En el AR de iOS (Quick Look) NO se ven
si dejas que model-viewer convierta solo a USDZ. Si necesitas animación en AR: exporta un `.usdz`
(Reality Converter o Blender) y ponlo en el campo `usdz` de la estación.

## Sin conexión
Tras la primera visita con internet, `sw.js` guarda página y modelos. Si cambias archivos, sube `VERSION` en `sw.js`.
