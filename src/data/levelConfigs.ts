import houseGif from '../images/houseGif.png';
import gamelogo from '../images/gamelogo.png';
import sceneDemo from '../images/sceneDemo.png';
import Aihouse_entrada from '../images/Aihouse_entrada.png';
import Aihouse_cocina from '../images/Aihouse_cocina.png';
import ghostPH1 from '../images/ghostPH1.png';

// Tipos de eventos posibles (puedes añadir más en el futuro)
export type LevelEventType = 'orb' | 'glitch' | 'fog' | string;

export interface LevelEventConfig {
  type: 'orb' | 'temperatureDrop' | 'glitch' | 'apparition' | 'attack';
  probabilityPerSecond: number;
  rooms?: {
    roomIndex: number;
    probabilityPerSecond: number;
  }[];
  temperatureDrop?: number;
  durationDown?: number;
  minTemperature?: number;
  // Para aparición y ataque
  image?: string;
  x?: number;
  y?: number;
  duration?: number;
  corduraLoss?: number;
  coolDown?: number;
  // Para ataque
  crackImage?: string;
}

export interface RoomConfig {
  name: string;
  image: string;
  avgTemperature: number; // temperatura promedio
}

export interface EventConfig {
  type: 'orb' | 'temperatureDrop' | 'apparition' | 'attack';
  probabilityPerSecond: number;
  rooms?: {
    roomIndex: number;
    probabilityPerSecond: number;
  }[];
  temperatureDrop?: number; // grados a bajar
  durationDown?: number; // segundos que tarda en bajar
  minTemperature?: number; // temperatura mínima (opcional)
  // Para aparición y ataque
  image?: string;
  x?: number;
  y?: number;
  duration?: number;
  corduraLoss?: number;
  coolDown?: number;
  // Para ataque
  crackImage?: string;
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
    name: 'Casa abandonada',
    durationSeconds: 300,
    rooms: [
      {
        name: 'Entrada',
        image: Aihouse_entrada,
        avgTemperature: 20,
      },
      {
        name: 'Cocina',
        image: Aihouse_cocina,
        avgTemperature: 20,
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
      {
        type: 'temperatureDrop',
        probabilityPerSecond: 1,
        temperatureDrop: 10,
        durationDown: 5,
        minTemperature: 5,
        rooms: [
          { roomIndex: 0, probabilityPerSecond: 0 },
          { roomIndex: 1, probabilityPerSecond: 1 },
        ],
      },
      /*{
        type: 'attack',
        probabilityPerSecond: 0,
        image: ghostPH1,
        x: 60,
        y: 60,
        duration: 4,
        corduraLoss: 25,
        coolDown: 20,
        rooms: [
          { roomIndex: 1, probabilityPerSecond: 50 },
        ],
      },*/
    ],
    ghostImage: gamelogo,
  },
  level2Config
]; 