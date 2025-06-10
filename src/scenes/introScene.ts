import { DialogScene } from '../components/DialogSystem';

const characters = [
  {
    name: 'Snake',
    image: '/images/snake.png',
    position: 'left' as const
  },
  {
    name: 'Otacon',
    image: '/images/otacon.png',
    position: 'right' as const
  }
];

export const introScene: DialogScene = {
  id: 'intro_scene',
  characters,
  background: '/images/lab_background.png',
  lines: [
    {
      character: characters[0],
      text: '¡Otacon! ¿Has visto eso?',
      effects: [
        {
          type: 'wave',
          text: '¡Otacon!'
        }
      ]
    },
    {
      character: characters[1],
      text: 'Sí, Snake. Es <shake>aterrador</shake>.',
      effects: [
        {
          type: 'shake',
          text: 'aterrador'
        }
      ]
    },
    {
      character: characters[0],
      text: 'Necesitamos <glow>evidencia</glow> de lo que está pasando aquí.',
      effects: [
        {
          type: 'glow',
          text: 'evidencia'
        }
      ]
    },
    {
      character: characters[1],
      text: 'Ten cuidado, Snake. No sabemos qué tipo de <shake>entidad</shake> estamos tratando.',
      effects: [
        {
          type: 'shake',
          text: 'entidad'
        }
      ]
    }
  ]
}; 