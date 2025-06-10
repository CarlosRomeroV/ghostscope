import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OuijaBoardProps {
  isVisible: boolean;
  onClose: () => void;
  onQuestionSelected: (corduraLoss: number) => void;
}

interface Question {
  text: string;
  corduraLoss: number;
}

const questions: Question[] = [
  { text: "¿Cuántos años tienes?", corduraLoss: 10 },
  { text: "¿Eres amistoso?", corduraLoss: 20 },
  { text: "¿Necesitas ayuda?", corduraLoss: 30 },
  { text: "¿Dónde estás?", corduraLoss: 40 },
  { text: "¿Quieres hacerme daño?", corduraLoss: 50 },
];

const OuijaBoard: React.FC<OuijaBoardProps> = ({ isVisible, onClose, onQuestionSelected }) => {
  const handleQuestionClick = (corduraLoss: number) => {
    onQuestionSelected(corduraLoss);
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/70"
          style={{ cursor: 'url("/planchette-cursor.png"), pointer' }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-[#2c1810] p-8 rounded-lg shadow-2xl border-2 border-[#8b4513] max-w-2xl w-full mx-4"
          >
            <h2 className="text-3xl mb-6 text-center font-[MedievalSharp] text-amber-300 shadow-text">
              Tablero de Ouija
            </h2>
            
            <div className="space-y-4">
              {questions.map((question, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left p-4 bg-[#1a0f0a] hover:bg-[#3a1f15] 
                           text-amber-200 rounded font-[Crimson] text-lg transition-colors
                           border border-amber-900/50 hover:border-amber-700"
                  onClick={() => handleQuestionClick(question.corduraLoss)}
                >
                  {question.text}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OuijaBoard; 