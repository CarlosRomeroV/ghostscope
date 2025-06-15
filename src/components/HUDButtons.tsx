import React, { useState } from "react";
import ToolTip from "./ToolTip";

type HUDButtonsProps = {
  onToggleFlashlight: () => void;
  onToggleOuija: () => void;
  onTakePhoto: () => void;
  remainingPhotos: number;
  batteryLevel: number;
  onShowGhostInfo: () => void;
};

const HUDButtons: React.FC<HUDButtonsProps> = ({ 
  onToggleFlashlight, 
  onToggleOuija, 
  onTakePhoto,
  remainingPhotos,
  batteryLevel,
  onShowGhostInfo
}) => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);

  return (
    <div className="flex gap-4 mt-4">
      <ToolTip
        title="Linterna"
        description="Ilumina las zonas oscuras para detectar actividad paranormal. La batería se agota con el uso."
        isVisible={hoveredButton === 'flashlight'}
        batteryLevel={batteryLevel}
      >
        <button
          onClick={onToggleFlashlight}
          onMouseEnter={() => setHoveredButton('flashlight')}
          onMouseLeave={() => setHoveredButton(null)}
          className="bg-yellow-700 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          🔦 Linterna
        </button>
      </ToolTip>

      <ToolTip
        title="Tablero Ouija"
        description="Intenta comunicarte con los espíritus. ¡Cuidado! Las preguntas pueden afectar tu cordura."
        isVisible={hoveredButton === 'ouija'}
      >
        <button
          onClick={onToggleOuija}
          onMouseEnter={() => setHoveredButton('ouija')}
          onMouseLeave={() => setHoveredButton(null)}
          className="bg-purple-900 hover:bg-purple-800 text-white px-4 py-2 rounded"
        >
          🔮 Ouija
        </button>
      </ToolTip>

      <ToolTip
        title="Cámara"
        description={`Captura evidencia fotográfica de actividad paranormal. Fotos restantes: ${remainingPhotos}/3`}
        isVisible={hoveredButton === 'camera'}
      >
        <button
          onClick={onTakePhoto}
          onMouseEnter={() => setHoveredButton('camera')}
          onMouseLeave={() => setHoveredButton(null)}
          disabled={remainingPhotos === 0}
          className={`${
            remainingPhotos > 0
              ? "bg-blue-800 hover:bg-blue-700"
              : "bg-gray-600 cursor-not-allowed"
          } text-white px-4 py-2 rounded flex items-center gap-2`}
        >
          📸 Cámara ({remainingPhotos})
        </button>
      </ToolTip>

      <ToolTip
        title="Información"
        description="Consulta las características de los fantasmas."
        isVisible={hoveredButton === 'info'}
      >
        <button
          onClick={onShowGhostInfo}
          onMouseEnter={() => setHoveredButton('info')}
          onMouseLeave={() => setHoveredButton(null)}
          className="bg-green-800 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          📖 Información
        </button>
      </ToolTip>
    </div>
  );
};

export default HUDButtons;
