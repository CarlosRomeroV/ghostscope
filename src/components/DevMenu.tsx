import React from "react";

type DevMenuProps = {
  onInvokeOrb: () => void;
  onTriggerGlitch: () => void;
  onTriggerFog: () => void;
  onTriggerTemperatureDrop: () => void;
  onTriggerApparition: () => void;
};

const DevMenu: React.FC<DevMenuProps> = ({ onInvokeOrb, onTriggerGlitch, onTriggerFog, onTriggerTemperatureDrop, onTriggerApparition }) => {
  return (
    <div className="bg-gray-800/90 p-2 rounded shadow z-50 flex flex-col gap-2 w-32">
      <button
        onClick={onInvokeOrb}
        className="bg-green-700 hover:bg-green-600 text-white text-xs py-1 px-2 rounded"
      >
        Orbe
      </button>
      <button
        onClick={onTriggerGlitch}
        className="bg-red-700 hover:bg-red-600 text-white text-xs py-1 px-2 rounded"
      >
        Glitch
      </button>
      <button
        onClick={onTriggerFog}
        className="bg-gray-500 hover:bg-gray-400 text-white text-xs py-1 px-2 rounded"
      >
        Niebla
      </button>
      <button
        onClick={onTriggerTemperatureDrop}
        className="bg-blue-700 hover:bg-blue-600 text-white text-xs py-1 px-2 rounded"
      >
        TempDrop
      </button>
      <button
        onClick={onTriggerApparition}
        className="bg-red-800 hover:bg-red-700 text-white text-xs py-1 px-2 rounded"
      >
        Aparición
      </button>
    </div>
  );
};

export default DevMenu;
