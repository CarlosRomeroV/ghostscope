import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OuijaBoardProps {
  isVisible: boolean;
  onClose: () => void;
  onQuestionSelected: (corduraLoss: number) => void;
  onOuijaResponse: (resp: { text: string, apparition?: boolean, corduraBonus?: number }) => void;
  usedQuestions: string[];
  currentRoomName: string;
}

interface Question {
  text: string;
  corduraLoss: number;
  id: string;
}

const questions: Question[] = [
  { id: 'age', text: "¿Cuántos años tienes?", corduraLoss: 10 },
  { id: 'friendly', text: "¿Eres amistoso?", corduraLoss: 20 },
  { id: 'help', text: "¿Necesitas ayuda?", corduraLoss: 30 },
  { id: 'where', text: "¿Dónde estás?", corduraLoss: 40 },
  { id: 'harm', text: "¿Quieres hacerme daño?", corduraLoss: 50 },
];

function getOuijaResponse(id: string, currentRoomName: string): { text: string, apparition?: boolean, corduraBonus?: number } {
  switch (id) {
    case 'age': {
      const opts = ["Pocos...", "Muchos...", "..."];
      return { text: opts[Math.floor(Math.random() * opts.length)] };
    }
    case 'friendly': {
      const roll = Math.random();
      if (roll < 0.45) return { text: "Sí" };
      if (roll < 0.9) return { text: "..." };
      return { text: "", apparition: true };
    }
    case 'help': {
      const roll = Math.random();
      if (roll < 0.4) return { text: "Sí" };
      if (roll < 0.8) return { text: "No. Vete" };
      return { text: "Sí, por favor", corduraBonus: 10 };
    }
    case 'where': {
      if (Math.random() < 0.7) return { text: "..." };
      return { text: currentRoomName };
    }
    case 'harm': {
      if (Math.random() < 0.5) return { text: "..." };
      return { text: "", apparition: true };
    }
    default:
      return { text: "..." };
  }
}

const OuijaBoard: React.FC<OuijaBoardProps> = ({ isVisible, onClose, onQuestionSelected, onOuijaResponse, usedQuestions, currentRoomName }) => {
  const [localUsed, setLocalUsed] = useState<string[]>([]);
  const handleQuestionClick = (q: Question) => {
    onQuestionSelected(q.corduraLoss);
    setLocalUsed([...localUsed, q.id]);
    const resp = getOuijaResponse(q.id, currentRoomName);
    onOuijaResponse(resp);
    onClose();
  };
  const disabled = (id: string) => usedQuestions.includes(id) || localUsed.includes(id);
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
              {questions.filter(q => !disabled(q.id)).map((question, index) => (
                <motion.button
                  key={question.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left p-4 bg-[#1a0f0a] hover:bg-[#3a1f15] text-amber-200 rounded font-[Crimson] text-lg transition-colors border border-amber-900/50 hover:border-amber-700"
                  onClick={() => handleQuestionClick(question)}
                >
                  {question.text}
                </motion.button>
              ))}
              {questions.filter(q => !disabled(q.id)).length === 0 && (
                <div className="text-amber-300 text-center mt-6">Ya has hecho todas las preguntas posibles en esta partida.</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OuijaBoard; 