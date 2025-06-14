import React, { useState, useEffect, JSX } from 'react';
import { motion} from 'framer-motion';

// Tipos para el sistema de diálogos
export interface DialogCharacter {
  name: string;
    image: string;
  position: 'left' | 'right';
}

export interface DialogLine {
  character: DialogCharacter;
  text: string;
  effects?: {
    type: 'wave' | 'shake' | 'glow';
    text: string;
  }[];
}

export interface DialogScene {
  id: string;
  characters: DialogCharacter[];
  lines: DialogLine[];
  background?: string;
  overlay?: boolean;
}

interface DialogSystemProps {
  scene: DialogScene;
  isVisible: boolean;
  onComplete: () => void;
}

// Componente para texto con efectos
const TextWithEffects: React.FC<{ text: string; effects?: DialogLine['effects'] }> = ({ text, effects }) => {
  if (!effects || effects.length === 0) return <>{text}</>;

  let processedText = text;
  const elements: JSX.Element[] = [];
  let lastIndex = 0;

  effects.forEach((effect, index) => {
    const startIndex = processedText.indexOf(effect.text);
    if (startIndex === -1) return;

    // Añadir texto normal antes del efecto
    if (startIndex > lastIndex) {
      elements.push(<span key={`normal-${index}`}>{processedText.slice(lastIndex, startIndex)}</span>);
    }

    // Añadir texto con efecto
    const EffectComponent = {
      wave: WaveText,
      shake: ShakeText,
      glow: GlowText,
    }[effect.type];

    elements.push(
      <EffectComponent key={`effect-${index}`} text={effect.text} />
    );

    lastIndex = startIndex + effect.text.length;
  });

  // Añadir texto restante
  if (lastIndex < processedText.length) {
    elements.push(<span key="normal-end">{processedText.slice(lastIndex)}</span>);
  }

  return <>{elements}</>;
};

// Componentes de efectos de texto
const WaveText: React.FC<{ text: string }> = ({ text }) => (
  <motion.span
    animate={{
      y: [0, -5, 0],
    }}
    transition={{
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }}
    className="inline-block text-green-400"
  >
    {text}
  </motion.span>
);

const ShakeText: React.FC<{ text: string }> = ({ text }) => (
  <motion.span
    animate={{
      x: [0, -2, 2, -2, 2, 0],
    }}
    transition={{
      duration: 0.5,
      repeat: Infinity,
    }}
    className="inline-block text-red-400"
  >
    {text}
  </motion.span>
);

const GlowText: React.FC<{ text: string }> = ({ text }) => (
  <span className="text-yellow-400 drop-shadow-[0_0_8px_rgba(255,255,0,0.5)]">
    {text}
  </span>
);

const DialogSystem: React.FC<DialogSystemProps> = ({ scene, isVisible, onComplete }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [fadeOut, setFadeOut] = useState(false);

  const currentLine = scene.lines[currentLineIndex];

  useEffect(() => {
    if (!isVisible) {
      setCurrentLineIndex(0);
      setDisplayedText('');
      setIsTyping(false);
    }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible || !currentLine) return;
    setIsTyping(true);
    let currentText = '';
    let currentIndex = 0;
    const typeInterval = setInterval(() => {
      if (currentIndex < currentLine.text.length) {
        currentText += currentLine.text[currentIndex];
        setDisplayedText(currentText);
        currentIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, 10); // Más rápido
    return () => clearInterval(typeInterval);
  }, [currentLineIndex, isVisible, currentLine]);

  // Click: primero muestra texto completo, luego avanza
  const handleNext = () => {
    if (isTyping) {
      setDisplayedText(currentLine.text);
      setIsTyping(false);
    } else if (currentLineIndex < scene.lines.length - 1) {
      setCurrentLineIndex(prev => prev + 1);
    } else {
      setFadeOut(true);
      setTimeout(() => {
        setFadeOut(false);
        onComplete();
      }, 700);
    }
  };

  if (!isVisible) return null;

  // Overlay: superpuesto al juego, sin fondo
  // No overlay: escena completa, fondo configurable
  const isOverlay = !!scene.overlay;

  return (
    <div
      className={
        isOverlay
          ? 'fixed inset-0 z-50 flex flex-col justify-end items-center pointer-events-auto'
          : 'fixed inset-0 z-50 flex flex-col justify-end items-center bg-black/80 pointer-events-auto'
      }
      style={isOverlay ? {} : { backgroundImage: scene.background ? `url(${scene.background})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
      onClick={handleNext}
    >
      {/* Fundido a negro sutil */}
      {fadeOut && (
        <div className="fixed inset-0 bg-black z-[100] transition-opacity duration-1000 ease-in-out opacity-80 pointer-events-none" style={{transitionProperty: 'opacity'}} />
      )}
      {/* Personajes pegados abajo */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-row items-end justify-between pointer-events-none select-none w-full" style={{height: 'auto'}}>
        {scene.characters.map((character) => (
          <div
            key={character.name + character.position}
            className={
              isOverlay
                ? `relative z-30 flex items-end justify-${character.position === 'left' ? 'start' : 'end'} w-[900px] max-h-[90vh] h-auto ${character.position === 'left' ? 'ml-8 md:ml-16' : 'mr-8 md:mr-16'}`
                : `relative z-30 flex items-end justify-${character.position === 'left' ? 'start' : 'end'} w-[900px] max-h-[90vh] h-auto ${character.position === 'left' ? 'ml-8 md:ml-16' : 'mr-8 md:mr-16'}`
            }
            style={{ maxWidth: '900px' }}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-auto max-h-[90vh] object-contain drop-shadow-[0_0_40px_rgba(0,255,0,0.3)]"
                draggable={false}
                style={{ display: 'block' }}
              />
              {/* Fade-out en la parte inferior */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: '18%',
                  pointerEvents: 'none',
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%)',
                }}
              />
            </div>
          </div>
        ))}
      </div>
      {/* Cuadro de diálogo centrado */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className={
          (isOverlay
            ? 'w-full max-w-6xl mx-4'
            : 'w-full max-w-6xl mx-4') +
          ' relative z-40 pointer-events-auto'
        }
        style={{}}
      >
        {/* Nombre del personaje */}
        <div className="flex items-center gap-2 mb-2 ml-2">
          <div className="bg-black px-6 py-2 rounded-tl-lg rounded-tr-lg rounded-bl-2xl border-2 border-white shadow-lg text-white font-bold text-2xl tracking-wide" style={{display:'inline-block', minWidth:160}}>
            {currentLine.character.name}
          </div>
        </div>
        {/* Cuadro de diálogo*/}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-[#181c23] border-2 border-white rounded-2xl p-10 shadow-2xl text-left"
          style={{ minHeight: 120 }}
        >
          <p className="text-green-100 text-2xl font-mono">
            <TextWithEffects text={displayedText} effects={currentLine.effects} />
            {isTyping && <span className="animate-pulse">|</span>}
          </p>
          <div className="text-base text-gray-400 mt-6 text-right select-none">
            Haz click para continuar
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DialogSystem; 