
const levels = [
  { id: 'level1', name: 'Nivel 1', available: true },
  { id: 'level2', name: ' ', available: false },
  { id: 'level3', name: ' ', available: false },
  { id: 'level4', name: ' ', available: false },
  { id: 'level5', name: ' ', available: false },
];

const LevelSelect = ({ onSelect, onBack }: { onSelect: (id: string) => void; onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-screen w-full">
    <h2 className="text-4xl font-bold mb-10 text-green-200 drop-shadow-lg">Selecciona un nivel</h2>
    <div className="flex flex-col gap-6 w-full max-w-md">
      {levels.map((level) => (
        <button
          key={level.id}
          onClick={() => level.available && onSelect(level.id)}
          disabled={!level.available}
          className={`w-full py-6 rounded-xl text-2xl font-mono shadow-lg border-2 transition-all
            ${level.available ? 'bg-green-800 hover:bg-green-700 text-white border-green-400 cursor-pointer' : 'bg-gray-800 text-gray-400 border-gray-600 cursor-not-allowed'}`}
        >
          {level.name}
          {!level.available && <span className="ml-4 text-yellow-300 text-lg">Próximamente</span>}
        </button>
      ))}
    </div>
    <button
      onClick={onBack}
      className="mt-12 px-8 py-3 rounded bg-gray-700 hover:bg-gray-600 text-white font-mono text-lg shadow"
    >
      Volver
    </button>
  </div>
);

export default LevelSelect; 