import React from 'react';

interface SensorsProps {
  emfLevel: number;
  temperature: number;
}

const Sensors: React.FC<SensorsProps> = ({ emfLevel, temperature }) => {
  return (
    <div className="flex flex-col gap-8 z-30 items-center">
      {/* Sensor EMF */}
      <div className="flex flex-col items-center">
        <div className="text-green-400 text-xs mb-2 text-center font-mono w-16">EMF</div>
        <div className="w-8 h-48 bg-black/50 rounded-full border-2 border-green-800 relative">
          {/* Niveles del EMF */}
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className="absolute w-full h-0.5 bg-green-800"
              style={{ top: `${(level - 1) * 25}%` }}
            />
          ))}
          {/* Indicador actual */}
          <div
            className="absolute w-full bg-green-500 transition-all duration-300"
            style={{
              bottom: 0,
              height: `${(emfLevel / 5) * 100}%`,
              borderRadius: '0 0 4px 4px'
            }}
          />
        </div>
      </div>

      {/* Termómetro */}
      <div className="flex flex-col items-center mt-8">
        <div className="text-green-400 text-xs mb-2 text-center font-mono w-16">Temperatura</div>
        <div className="w-24 h-16 bg-black/50 rounded-lg border-2 border-red-800 relative flex items-center justify-center">
          <span className="text-red-500 text-2xl font-mono">
            {Math.round(temperature)}°C
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sensors; 