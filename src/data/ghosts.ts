export interface GhostOuijaResponses {
  age?: string[];
  friendly?: string[];
  help?: string[];
  where?: string[];
  harm?: string[];
}

export interface GhostEventConfig {
  apparitionDuration?: number; // segundos
  // Puedes añadir más eventos personalizados aquí
}

export interface GhostDefinition {
  id: string;
  name: string;
  description: string;
  events: GhostEventConfig;
  ouijaResponses?: GhostOuijaResponses;
}

export const GHOSTS: GhostDefinition[] = [
  {
    id: 'phantom',
    name: 'Phantom',
    description: 'Un espectro que se manifiesta con apariciones largas y baja la temperatura rápidamente.',
    events: {
      apparitionDuration: 8, // Aparición más larga de lo normal
    },
    ouijaResponses: {
      age: ['Muchos...', 'Demasiados...'],
      friendly: ['No', '...', 'No lo sé'],
      help: ['No puedo ser ayudado', '...'],
      where: ['Aquí...', 'En las sombras'],
      harm: ['Quizá', '...', '¿Por qué lo preguntas?'],
    },
  },
  // Puedes añadir más fantasmas aquí
];