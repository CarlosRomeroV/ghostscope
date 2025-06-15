import { useState } from 'react';

const levels = [
  { id: 'level1', name: 'Nivel 1', available: true },
  { id: 'level2', name: 'Nivel 2', available: false },
  { id: 'level3', name: 'Nivel 3', available: false },
];

const LevelSelect = ({ onSelect, onBack }: { onSelect: (id: string) => void; onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center w-full h-full gap-8">
    <h2 className="text-3xl font-bold mb-6 text-green-200 drop-shadow-lg font-[Ichigayamincho] tracking-wide">
      Selecciona un nivel
    </h2>
    <div className="flex flex-col gap-8 w-full max-w-md items-center">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => level.available && onSelect(level.id)}
          disabled={!level.available}
          className={`w-full px-8 py-6 rounded-2xl shadow-lg text-[2.4rem] font-bold uppercase tracking-widest transition-all duration-300
            [transform:scaleY(1.2)]
            ${level.available ? 'bg-black/70 text-[#4fff7b] border-2 border-[#4fff7b] hover:bg-black/80 hover:scale-110' : 'bg-black/40 text-[#4fff7b]/30 border-2 border-[#4fff7b]/30 cursor-not-allowed opacity-40'}
          `}
          style={{ fontFamily: 'Ichigayamincho, Montserrat, Inter, Roboto, Arial, sans-serif' }}
        >
          {level.name}
          {!level.available && <span className="ml-4 text-yellow-300 text-lg">Próximamente</span>}
        </button>
      ))}
    </div>
    <button
      onClick={onBack}
      className="mt-8 px-8 py-3 rounded-2xl bg-black/70 text-[#4fff7b] border-2 border-[#4fff7b] hover:bg-black/80 text-2xl font-bold font-[Ichigayamincho] shadow"
      style={{ fontFamily: 'Ichigayamincho, Montserrat, Inter, Roboto, Arial, sans-serif' }}
    >
      Volver
    </button>
  </div>
);

export default LevelSelect; 