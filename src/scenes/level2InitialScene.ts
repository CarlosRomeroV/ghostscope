import { DialogScene } from '../components/DialogSystem';
import snakeImg from '../images/snake.png';
import testImg from '../images/test.jpg';

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

export const level2InitialScene: DialogScene = {
  id: 'level2_initial',
  characters,
  background: testImg,
  overlay: false,
  lines: [
    {
      character: characters[0],
      text: '¿Listo para la investigación? Este lugar me da escalofríos...'
    },
    {
      character: characters[1],
      text: 'No te preocupes, juntos podremos con cualquier fantasma.'
    }
  ]
}; 