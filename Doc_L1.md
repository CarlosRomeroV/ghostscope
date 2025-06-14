# Documentación Nivel 1: Casa Abandonada

## Archivos y rutas relevantes

### 1. Configuración del nivel
- **Archivo:** `src/data/levelConfigs.ts`
- **Descripción:** Aquí se define el objeto del nivel 1 bajo el id `level1`, incluyendo nombre, duración, habitaciones, eventos y la imagen del fantasma.

### 2. Escena de introducción
- **Archivo:** `src/scenes/level1IntroScene.ts`
- **Descripción:** Contiene la escena de introducción que se muestra antes de empezar el gameplay del nivel 1. Incluye personajes, fondo y líneas de diálogo.

### 3. Imágenes utilizadas
- **Logo del fantasma:**
  - Ruta: `src/images/gamelogo.png`
  - Usos: Imagen del fantasma y personaje en la intro.
- **Fondo animado de la casa:**
  - Ruta: `src/images/houseGif.png`
  - Usos: Imagen de la habitación y fondo de la intro.

### 4. Otros archivos relacionados
- **Selector de niveles:**
  - Archivo: `src/screens/LevelSelect.tsx`
  - Permite seleccionar el nivel 1.
- **Pantalla de juego:**
  - Archivo: `src/screens/GameScreen.tsx`
  - Lógica para cargar la escena de introducción y el gameplay del nivel 1.

## Resumen de flujo
1. El usuario selecciona el nivel 1 en el selector (`LevelSelect.tsx`).
2. Se muestra la escena de introducción (`level1IntroScene.ts`).
3. Al terminar la intro, comienza el gameplay usando la configuración de `levelConfigs.ts`.

---
Puedes modificar los textos, imágenes y parámetros editando los archivos mencionados arriba. 