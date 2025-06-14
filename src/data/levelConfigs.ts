import houseGif from '../images/houseGif.png';
import gamelogo from '../images/gamelogo.png';

// Tipos de eventos posibles (puedes añadir más en el futuro)
export type LevelEventType = 'orb' | 'glitch' | 'fog' | string;

export interface LevelEventConfig {
  type: LevelEventType;
  probabilityPerSecond: number; // 0-100 (porcentaje, puede ser decimal)
  rooms: {
    roomIndex: number; // índice de la habitación/cámara
    probabilityPerSecond: number; // probabilidad específica para esta habitación
  }[];
}

export interface RoomConfig {
  name: string;
  image: string;
  avgTemperature: number; // temperatura promedio
}

export interface LevelConfig {
  id: string;
  name: string;
  durationSeconds: number;
  rooms: RoomConfig[];
  events: LevelEventConfig[];
  ghostImage: string;
  introSceneId?: string; // id de la escena de introducción (opcional)
}

// Ejemplo de nivel 2
export const level2Config: LevelConfig = {
  id: 'level2',
  name: 'El Hospital Psiquiátrico',
  durationSeconds: 180,
  rooms: [
    {
      name: 'Planta Superior',
      image: '/images/h1_upstairs.jpg',
      avgTemperature: 15
    },
    {
      name: 'Planta Baja',
      image: '/images/h1_downstairs.jpg',
      avgTemperature: 13
    },
    {
      name: 'Pasillo',
      image: '/images/h1_pasillo.jpg',
      avgTemperature: 12
    }
  ],
  events: [
    {
      type: 'orb',
      probabilityPerSecond: 2, // 2% global
      rooms: [
        { roomIndex: 0, probabilityPerSecond: 3 }, // Pasillo Principal
        { roomIndex: 1, probabilityPerSecond: 1 }, // Habitación 101
        { roomIndex: 2, probabilityPerSecond: 2 }  // Sala de Operaciones
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
  ghostImage: '/images/snake.png',
  introSceneId: 'level2_scene'
};

export const LEVELS: LevelConfig[] = [
  {
    id: 'level1',
    name: 'Casa Abandonada',
    durationSeconds: 300,
    rooms: [
      {
        name: 'Sala',
        image: houseGif,
        avgTemperature: 12,
      },
    ],
    events: [
      {
        type: 'orb',
        probabilityPerSecond: 2,
        rooms: [
          { roomIndex: 0, probabilityPerSecond: 2 },
        ],
      },
    ],
    ghostImage: gamelogo,
  },
  level2Config
]; 