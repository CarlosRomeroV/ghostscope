# Configuración de Niveles

Este documento explica cómo crear y personalizar niveles en el juego usando el sistema de configuración flexible.

## Estructura de un Nivel

Cada nivel se define como un objeto `LevelConfig`:

```typescript
export interface LevelConfig {
  id: string;                // Identificador único del nivel
  name: string;              // Nombre del nivel
  durationSeconds: number;   // Duración total de la partida en segundos
  rooms: RoomConfig[];       // Lista de habitaciones/cámaras
  events: LevelEventConfig[];// Lista de eventos configurables
  ghostImage: string;        // Ruta al PNG del fantasma
  introSceneId?: string;     // (Opcional) id de la escena de introducción
}
```

### Habitaciones/Cámaras

```typescript
export interface RoomConfig {
  name: string;         // Nombre de la habitación
  image: string;        // Ruta de la imagen de la cámara
  avgTemperature: number; // Temperatura promedio (°C)
}
```

### Eventos

```typescript
export interface LevelEventConfig {
  type: string; // 'orb', 'glitch', 'fog', etc. (puedes añadir más tipos)
  probabilityPerSecond: number; // Probabilidad global de que ocurra el evento cada segundo (0-100)
  rooms: {
    roomIndex: number; // Índice de la habitación/cámara
    probabilityPerSecond: number; // Probabilidad específica para esa habitación
  }[];
}
```

- Puedes añadir tantos eventos como quieras.
- Puedes añadir nuevos tipos de eventos en el futuro simplemente usando un nuevo string en `type`.
- La probabilidad por segundo puede ser decimal (ej: 0.5 para 0.5%).

### Fantasma

- Usa el campo `ghostImage` para indicar la ruta del PNG del fantasma que aparecerá en el nivel.

### Escena de Introducción

- Usa el campo `introSceneId` para enlazar con una escena de diálogos (opcional).

## Ejemplo de Nivel

```typescript
import { LevelConfig } from './levelConfigs';

export const level2Config: LevelConfig = {
  id: 'level2',
  name: 'El Hospital Psiquiátrico',
  durationSeconds: 180,
  rooms: [
    { name: 'Pasillo Principal', image: '/images/hospital_pasillo.jpg', avgTemperature: 15 },
    { name: 'Habitación 101', image: '/images/hospital_101.jpg', avgTemperature: 13 },
    { name: 'Sala de Operaciones', image: '/images/hospital_operacion.jpg', avgTemperature: 12 }
  ],
  events: [
    {
      type: 'orb',
      probabilityPerSecond: 2,
      rooms: [
        { roomIndex: 0, probabilityPerSecond: 3 },
        { roomIndex: 1, probabilityPerSecond: 1 },
        { roomIndex: 2, probabilityPerSecond: 2 }
      ]
    },
    {
      type: 'glitch',
      probabilityPerSecond: 1,
      rooms: [
        { roomIndex: 0, probabilityPerSecond: 1 },
        { roomIndex: 1, probabilityPerSecond: 2 },
        { roomIndex: 2, probabilityPerSecond: 1 }
      ]
    }
  ],
  ghostImage: '/images/ghost_hospital.png',
  introSceneId: 'intro_scene'
};
```

## Cómo Añadir un Nuevo Nivel

1. Crea un nuevo objeto `LevelConfig` siguiendo la estructura anterior.
2. Añádelo al array `LEVELS` en `src/data/levelConfigs.ts`.
3. Si quieres enlazar una escena de introducción, usa el campo `introSceneId` con el id de la escena.

## Consejos

- Usa imágenes optimizadas para las habitaciones y el fantasma.
- Ajusta las probabilidades para equilibrar la dificultad.
- Puedes añadir nuevos tipos de eventos en cualquier momento.
- Puedes tener cualquier número de habitaciones/cámaras por nivel.
- La temperatura de cada habitación variará automáticamente ±3°C de su valor promedio de forma suave y aleatoria.

¡Con este sistema puedes crear niveles muy variados y personalizables de forma sencilla! 