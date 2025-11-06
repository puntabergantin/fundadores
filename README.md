Fundadores — Página de bienvenida
================================

Estructura mínima para una pantalla de bienvenida con carrusel tipo banner, responsive y con tipografías/colores definidos.

Cómo usar
- Abre `index.html` en tu navegador.
- Coloca tus imágenes en `assets/` como `slide1.jpg`, `slide2.jpg`, `slide3.jpg`.
- Si tienes la tipografía Griffon, colócala en `assets/fonts/` y se aplicará automáticamente a los headings.

Personalización
- Texto: edita los contenidos en `index.html` (H1, H3 y botón).
- Navegación del botón: en `script.js`, reemplaza el comentario por la ruta real (por ejemplo, `window.location.href = 'formulario/index.html'`).
- Colores: ajusta `--primary` y `--ink` en `styles.css`.

Accesibilidad y rendimiento
- Respeta `prefers-reduced-motion`: se desactiva el autoplay para usuarios que lo prefieren.
- Pausa de slider en `visibilitychange` para ahorrar recursos en segundo plano.


Componente fd- (tabs + accordion)
---------------------------------
- CSS modular: `fd.css` (sin colores; hereda tipografías y espacios del documento).
- JS: `fd-form.js` (tabs accesibles en desktop + accordion en mobile, validación mínima, persistencia en `localStorage`, eventos `fd:change`, `fd:submit`, `fd:restore`).
- Demo embebida en `index.html` bajo el hero.

Probar tests básicos
- Abre `fd-tests.html` en el navegador y revisa el listado de checks.

