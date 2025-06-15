import DialogSystem, { DialogScene } from '../components/DialogSystem';
import testImage from '../images/test.jpg';
import snakeImage from '../images/snake.png';
import voidImage from '../images/void.png';
import murielImage from '../images/muriel.png';

interface IntroSceneProps {
  onComplete: () => void;
}

const introDialogScene: DialogScene = {
  id: 'intro',
  background: testImage,
  overlay: false,
  characters: [
    {
      name: 'Snake',
      image: snakeImage,
      position: 'left',
    },
    {
      name: 'Muriel',
      image: murielImage,
      position: 'left',
    },
  ],
  lines: [
    {
      character: {
        name: ' ',
        image: voidImage,
        position: 'left',
      },
      text: 'testing',
      effects: [
        { type: 'wave', text: 'testing' },
      ],
    },
    {
      character: {
        name: 'Briant',
        image: snakeImage,
        position: 'left',
      },
      text: 'dios santo quiero sexo por el culo quien me da sexo por el culo por favor',
      effects: [
        { type: 'wave', text: 'por el culo' },
      ],
    },
    {
      character: {
        name: 'Snake',
        image: snakeImage,
        position: 'left',
      },
      text: 'Nuestros sensores han detectado una fuerte actividad paranormal en la zona. Se han registrado temperaturas extremadamente bajas y campos electromagnéticos anómalos...',
    },
    {
      character: {
        name: 'Snake',
        image: snakeImage,
        position: 'left',
      },
      text: 'Tu misión es entrar en la casa y documentar cualquier evidencia paranormal que encuentres. Ten cuidado, no sabemos qué tipo de entidad podría estar acechando en las sombras...'
    },
  ],
};

const IntroScene = ({ onComplete }: IntroSceneProps) => {
  return (
    <DialogSystem
      scene={introDialogScene}
      isVisible={true}
      onComplete={onComplete}
    />
  );
};

export default IntroScene; 