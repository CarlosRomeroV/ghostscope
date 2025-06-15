import { useState } from 'react';

const difficulties = [
  { id: 'easy', name: 'Fácil', color: 'bg-green-700 border-green-400' },
  { id: 'normal', name: 'Normal', color: 'bg-yellow-700 border-yellow-400' },
  { id: 'hard', name: 'Difícil', color: 'bg-red-800 border-red-500' },
];

const RandomDifficultySelect = ({ onSelect, onBack, onlyNormal }: { onSelect: (difficulty: string) => void; onBack: () => void; onlyNormal?: boolean }) => {
  const [selected, setSelected] = useState('normal');
  return (
    <div className="flex flex-col items-center justify-center w-full h-full gap-8">
      <h2 className="text-3xl font-bold mb-6 text-blue-200 drop-shadow-lg font-[Ichigayamincho] tracking-wide">
        Selecciona la dificultad
      </h2>
      <div className="flex flex-col gap-8 w-full max-w-md items-center">
        {difficulties.map((diff) => {
          const isDisabled = onlyNormal && diff.id !== 'normal';
          return (
            <button
              key={diff.id}
              onClick={() => !isDisabled && setSelected(diff.id)}
              disabled={isDisabled}
              className={`w-full px-8 py-6 rounded-2xl shadow-lg text-[2.4rem] font-bold uppercase tracking-widest transition-all duration-300
                [transform:scaleY(1.2)]
                ${selected === diff.id && !isDisabled ? 'bg-black/80 text-[#4fff7b] border-2 border-[#4fff7b] scale-110' : isDisabled ? 'bg-black/40 text-[#4fff7b]/30 border-2 border-[#4fff7b]/30 cursor-not-allowed opacity-40' : 'bg-black/70 text-[#4fff7b] border-2 border-[#4fff7b] hover:bg-black/80 hover:scale-110'}
              `}
              style={{ fontFamily: 'Ichigayamincho, Montserrat, Inter, Roboto, Arial, sans-serif' }}
            >
              {diff.name}
              {isDisabled && <span className="ml-2 text-yellow-300 text-base">(Solo disponible en la demo completa)</span>}
            </button>
          );
        })}
      </div>
      <button
        onClick={() => onSelect(selected)}
        className="mt-8 w-full px-8 py-4 rounded-2xl bg-black/70 text-[#4fff7b] border-2 border-[#4fff7b] hover:bg-black/80 text-2xl font-bold font-[Ichigayamincho] shadow"
        style={{ fontFamily: 'Ichigayamincho, Montserrat, Inter, Roboto, Arial, sans-serif' }}
      >
        Generar partida
      </button>
      <button
        onClick={onBack}
        className="mt-2 px-8 py-3 rounded-2xl bg-black/70 text-[#4fff7b] border-2 border-[#4fff7b] hover:bg-black/80 text-2xl font-bold font-[Ichigayamincho] shadow"
        style={{ fontFamily: 'Ichigayamincho, Montserrat, Inter, Roboto, Arial, sans-serif' }}
      >
        Volver
      </button>
    </div>
  );
};

export default RandomDifficultySelect; 