# ANDROMEDA — Proyecto inicial completo

Aplicación web de demostración con estudio 3D interactivo, robot procedural, consola, racks, máquina de cinta con carretes giratorios, cámaras seleccionables y chat local.

## Requisitos
- Node.js 20 o superior
- npm

## Ejecutar
```bash
npm install
npm run dev
```
Abre la dirección que muestre Vite, normalmente `http://localhost:5173`.

## Crear versión de producción
```bash
npm run build
npm run preview
```
La carpeta `dist/` contiene el sitio compilado.

## Publicar
Puedes subir este proyecto a un repositorio GitHub. Para publicarlo como sitio, conecta el repositorio a Vercel o Netlify y usa:
- Build command: `npm run build`
- Output directory: `dist`

## Qué funciona en este prototipo
- Escena 3D navegable con mouse o pantalla táctil.
- Botones para cambiar entre cámara principal, frontal, lateral izquierda, lateral derecha, cenital, detalle de mesa, detalle del robot y máquina de cinta.
- Robot 3D básico con animación de movimiento.
- Dos carretes de la máquina de cinta girando.
- Consola de mezcla visual con canales y perillas animadas.
- Chat local de demostración con respuestas de ejemplo.
- Selector de archivos de imagen y audio para adjuntarlos visualmente en el chat.
- Diseño adaptable a móvil y escritorio.
- Se conserva la imagen original del estudio en `public/studio-original.png`.

## Lo que todavía requiere desarrollo/conexión
- La escena 3D es una reconstrucción aproximada inspirada en la referencia, no una conversión exacta de la foto. Una imagen 2D no contiene la información necesaria para reconstruir cada lado del estudio.
- El chat aún no usa un modelo de IA ni analiza realmente los adjuntos. Para activarlo hay que configurar un backend seguro y una clave API privada.
- No controla FL Studio, no cambia plugins y no altera audio real: ANDROMEDA entrega asesoría para que el usuario haga los cambios manualmente.
- El robot es un modelo procedural sencillo; se puede reemplazar por un modelo 3D riggeado para movimientos más realistas.

## Seguridad
No subas claves API, contraseñas ni archivos `.env` al repositorio. Usa variables de entorno privadas en el servicio de despliegue.

## Estructura
- `public/studio-original.png`: referencia original.
- `src/main.js`: escena Three.js, cámaras, animaciones y chat de demostración.
- `src/style.css`: diseño visual.
- `index.html`: entrada web.
