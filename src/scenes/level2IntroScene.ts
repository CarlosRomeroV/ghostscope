import { DialogScene } from '../components/DialogSystem';
import snakeImg from '../images/snake.png';

const characters = [
  {
    name: 'Snake',
    image: snakeImg,
    position: 'left' as const
  },
  {
    name: 'Snake',
    image: snakeImg,
    position: 'right' as const
  }
];

export const level2IntroScene: DialogScene = {
  id: 'level2_intro',
  characters,
  background: '/images/h1_upstairs.jpg',
  overlay: false,
  lines: [
    {
      character: characters[0],
      text: 'Este hospital tiene fama de estar embrujado. ¿Estás listo para entrar?',
      effects: [
        { type: 'wave', text: 'embrujado' }
      ]
    },
    {
      character: characters[1],
      text: 'No sé si estoy preparado, pero no tenemos elección...',
      effects: [
        { type: 'shake', text: 'no tenemos elección' }
      ]
    },
    {
      character: characters[0],
      text: 'Recuerda, cualquier cosa puede pasar aquí dentro. ¡Mantente alerta!',
      effects: [
        { type: 'glow', text: 'alerta' }
      ]
    }
  ]
}; 