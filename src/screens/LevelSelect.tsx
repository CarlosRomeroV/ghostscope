import { useState } from 'react';

interface Level {
  id: string;
  title: string;
  description: string;
  difficulty: 'Fácil' | 'Normal' | 'Difícil';
  locked: boolean;
}

const levels: Level[] = [
  {
    id: 'level1',
    title: 'La Casa Abandonada',
    description: 'Una antigua casa familiar abandonada. Los vecinos reportan ruidos extraños y luces que se encienden solas. ¿Podrás descubrir qué espíritu la habita?',
    difficulty: 'Fácil',
    locked: false
  },
  {
    id: 'level2',
    title: 'El Hospital Psiquiátrico',
    description: 'Un antiguo hospital donde los pacientes reportaban ver sombras en las noches. Las historias cuentan que algunos nunca se fueron...',
    difficulty: 'Normal',
    locked: false
  },
  {
    id: 'level3',
    title: 'La Mansión de los Blackwood',
    description: 'La familia Blackwood desapareció misteriosamente una noche. Nadie sabe qué sucedió, pero los que se atreven a entrar aseguran escuchar susurros...',
    difficulty: 'Difícil',
    locked: false
  }
];

interface LevelSelectProps {
  onSelect: (levelId: string) => void;
  onBack: () => void;
}

const LevelSelect = ({ onSelect, onBack }: LevelSelectProps) => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Selecciona tu Misión</h1>
        
        <div className="grid gap-6">
          {levels.map((level) => (
            <div
              key={level.id}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedLevel === level.id
                  ? 'border-green-500 bg-green-900/20'
                  : 'border-gray-700 hover:border-green-500'
              }`}
              onClick={() => setSelectedLevel(level.id)}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-bold">{level.title}</h2>
                <span className={`px-3 py-1 rounded text-sm ${
                  level.difficulty === 'Fácil' ? 'bg-green-600' :
                  level.difficulty === 'Normal' ? 'bg-yellow-600' :
                  'bg-red-600'
                }`}>
                  {level.difficulty}
                </span>
              </div>
              <p className="text-gray-300 mb-4">{level.description}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            className="px-6 py-3 rounded bg-gray-700 hover:bg-gray-600"
            onClick={onBack}
          >
            Volver
          </button>
          <button
            className={`px-6 py-3 rounded ${
              selectedLevel
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-gray-700 cursor-not-allowed'
            }`}
            onClick={() => selectedLevel && onSelect(selectedLevel)}
            disabled={!selectedLevel}
          >
            Comenzar Investigación
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelSelect; 