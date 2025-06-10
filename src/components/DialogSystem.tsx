import React, { useState, useEffect, JSX } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
    }, 30);

    return () => clearInterval(typeInterval);
  }, [currentLineIndex, isVisible, currentLine]);

  const handleNext = () => {
    if (isTyping) {
      // Si está escribiendo, mostrar todo el texto
      setDisplayedText(currentLine.text);
      setIsTyping(false);
    } else if (currentLineIndex < scene.lines.length - 1) {
      // Ir a la siguiente línea
      setCurrentLineIndex(prev => prev + 1);
    } else {
      // Terminar la escena
      onComplete();
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="w-full max-w-6xl mx-4"
      >
        {/* Fondo de la escena */}
        {scene.background && (
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${scene.background})` }}
          />
        )}

        {/* Personajes */}
        <div className="relative flex justify-between items-end h-[500px]">
          {scene.characters.map((character, index) => (
            <motion.div
              key={character.name}
              initial={{ opacity: 0, x: character.position === 'left' ? -100 : 100 }}
              animate={{ opacity: 1, x: 0 }}
              className={`w-[400px] h-[500px] ${character.position === 'left' ? 'order-first' : 'order-last'}`}
            >
              <img
                src={character.image}
                alt={character.name}
                className="w-full h-full object-contain"
              />
            </motion.div>
          ))}
        </div>

        {/* Cuadro de diálogo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900/95 border-2 border-green-500/40 rounded-lg p-6 mt-4"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-green-400 font-mono text-lg">
              [{currentLine.character.name}]:
            </span>
          </div>
          <p className="text-green-100 text-lg font-mono">
            <TextWithEffects text={displayedText} effects={currentLine.effects} />
            {isTyping && <span className="animate-pulse">|</span>}
          </p>
          <button
            onClick={handleNext}
            className="mt-4 px-6 py-2 rounded bg-green-700 hover:bg-green-600 text-white font-mono"
          >
            {currentLineIndex < scene.lines.length - 1 ? 'Siguiente' : 'Continuar'}
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DialogSystem; 