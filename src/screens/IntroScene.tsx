import { useState, useEffect } from 'react';
import testImage from '../images/test.jpg';
import snakeImage from '../images/snake.png';
import './IntroScene.css';

interface IntroSceneProps {
  onComplete: () => void;
}

const introTexts = [
  "La Casa Abandonada ha sido el centro de numerosos reportes paranormales en los últimos meses. Los vecinos aseguran haber visto luces moviéndose por las ventanas durante la noche...",
  "Nuestros sensores han detectado una fuerte actividad paranormal en la zona. Se han registrado temperaturas extremadamente bajas y campos electromagnéticos anómalos...",
  "Tu misión es entrar en la casa y documentar cualquier evidencia paranormal que encuentres. Ten cuidado, no sabemos qué tipo de entidad podría estar acechando en las sombras..."
];

const IntroScene = ({ onComplete }: IntroSceneProps) => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (isTyping) {
      const currentText = introTexts[currentTextIndex];
      let currentIndex = 0;
      
      const typingInterval = setInterval(() => {
        if (currentIndex < currentText.length) {
          setDisplayedText(currentText.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          setIsTyping(false);
        }
      }, 15);

      return () => clearInterval(typingInterval);
    }
  }, [currentTextIndex, isTyping]);

  const handleClick = () => {
    if (isTyping) {
      setDisplayedText(introTexts[currentTextIndex]);
      setIsTyping(false);
    } else if (currentTextIndex < introTexts.length - 1) {
      setCurrentTextIndex(currentTextIndex + 1);
      setIsTyping(true);
    } else {
      onComplete();
    }
  };

  return (
    <div 
      className="min-h-screen w-full relative cursor-pointer"
      onClick={handleClick}
      style={{
        backgroundImage: `url(${testImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/60" />
      
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-end pb-20">
        <div className="w-full px-8">
          <div className="relative flex items-end">
            {/* Imagen del personaje Snake */}
            <div className="w-[40rem] h-[40rem] flex-shrink-0 -mr-40 z-10">
              <img 
                src={snakeImage} 
                alt="Snake" 
                className="w-full h-full object-contain drop-shadow-[0_0_40px_rgba(0,255,0,0.5)]"
              />
            </div>

            {/* Cuadro de diálogo */}
            <div className="flex-grow w-full min-w-[900px] max-w-[1800px] bg-gray-900/90 p-12 rounded-lg border-2 border-green-500/30 shadow-[0_0_40px_rgba(0,255,0,0.18)] backdrop-blur-sm ml-[-10rem]">
              <p className="text-2xl leading-relaxed text-green-100 min-h-[120px] font-mono">
                {displayedText.split('').map((char, index) => (
                  <span 
                    key={index}
                    className="inline-block animate-float"
                    style={{
                      animationDelay: `${index * 0.025}s`,
                      animationDuration: '2.5s',
                      marginRight: char === ' ' ? '0.5em' : '0'
                    }}
                  >
                    {char}
                  </span>
                ))}
                {isTyping && <span className="animate-pulse text-green-500">|</span>}
              </p>
              <p className="text-green-400/70 text-base mt-4 text-center font-mono">
                {isTyping ? "Haz clic para saltar..." : "Haz clic para continuar..."}
              </p>
            </div>

            {/* Espacio para el segundo personaje */}
            <div className="w-[40rem] h-[40rem] flex-shrink-0 -ml-40 z-10" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default IntroScene; 