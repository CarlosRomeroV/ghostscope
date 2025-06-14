# Manual de ProyectoPhasmo

## Cómo crear un nuevo nivel

1. **Ubicación del archivo de niveles:**
   - Los niveles se definen en el archivo `src/data/levels.ts` (o similar, según tu estructura).

2. **Estructura básica de un nivel:**
   ```ts
   export const levels = [
     {
       id: 'casa1',
       nombre: 'Casa Abandonada',
       duracion: 300, // en segundos
       habitaciones: [
         {
           nombre: 'Sala',
           probabilidadOrbes: 0.2,
           temperaturaMedia: 12,
           imagen: require('../assets/rooms/sala.png'),
         },
         // ... más habitaciones
       ],
       eventos: [
         { tipo: 'orbe', tiempo: 120 },
         { tipo: 'glitch', tiempo: 200 },
       ],
       fantasma: require('../assets/ghosts/fantasma1.png'),
     },
     // ... más niveles
   ];
   ```

3. **Parámetros importantes:**
   - `duracion`: Duración total del nivel.
   - `habitaciones`: Lista de habitaciones con probabilidades y temperaturas.
   - `eventos`: Eventos especiales con tipo y tiempo.
   - `fantasma`: Imagen PNG del fantasma.

4. **Agregar un nuevo nivel:**
   - Copia y pega la estructura de ejemplo, cambia los valores y añade tus imágenes.

---

## Cómo añadir cinemáticas (escenas)

1. **Ubicación del archivo de escenas:**
   - Las escenas se definen en `src/data/scenes.ts` (o similar).

2. **Estructura básica de una escena:**
   ```ts
   export const scenes = [
     {
       id: 'intro',
       background: require('../assets/backgrounds/casa.png'),
       dialogos: [
         {
           personaje: {
             nombre: 'Alex',
             imagen: require('../assets/characters/alex.png'),
             posicion: 'left',
           },
           texto: '¡Cuidado! Hay actividad paranormal aquí.',
           efectos: ['wave'],
         },
         // ... más diálogos
       ],
       overlay: false, // true si es superpuesta al gameplay
     },
     // ... más escenas
   ];
   ```

3. **Parámetros importantes:**
   - `background`: Imagen de fondo de la escena.
   - `dialogos`: Lista de diálogos con personaje, texto y efectos.
   - `overlay`: Si la escena es superpuesta al juego o pantalla completa.

4. **Efectos de texto disponibles:**
   - `wave`, `shake`, `glow`.

5. **Agregar una nueva escena:**
   - Copia la estructura, cambia los personajes, textos, imágenes y efectos.

---

## Ejemplo de integración

1. **Enlazar nivel y cinemática:**
   - En la configuración del nivel, puedes indicar qué escena se muestra al inicio o durante el juego.
   - Ejemplo:
   ```ts
   {
     id: 'casa1',
     escenaInicial: 'intro',
     // ... resto del nivel
   }
   ```

2. **Transiciones:**
   - Las transiciones entre escenas y gameplay se hacen automáticamente con efectos de fade.

---

## Recomendaciones
- Usa imágenes PNG de 1080x1080 para personajes.
- Usa imágenes de fondo de 1920x1080.
- Si tienes dudas, revisa los archivos de ejemplo y sigue la estructura. 