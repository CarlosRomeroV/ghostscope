import { DialogScene } from '../components/DialogSystem';

const characters = [
  {
    name: 'Snake',
    image: '/images/snake.png',
    position: 'left' as const
  },
  {
    name: 'Snake',
    image: '/images/snake.png',
    position: 'right' as const
  }
];

export const level2Scene: DialogScene = {
  id: 'level2_scene',
  characters,
  background: '', // Puedes poner una imagen de fondo si quieres
  lines: [
    {
      character: characters[0],
      text: '¿Preparado para investigar el hospital?',
      effects: [
        { type: 'wave', text: 'investigar' }
      ]
    },
    {
      character: characters[1],
      text: 'Sí, pero tengo un mal presentimiento...',
      effects: [
        { type: 'shake', text: 'mal presentimiento' }
      ]
    },
    {
      character: characters[0],
      text: 'Recuerda usar la cámara y el termómetro. ¡Suerte!',
      effects: [
        { type: 'glow', text: 'Suerte' }
      ]
    }
  ]
}; 