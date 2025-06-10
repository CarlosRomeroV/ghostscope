import React from "react";

type DevMenuProps = {
  onInvokeOrb: () => void;
  onTriggerGlitch: () => void;
  onTriggerFog: () => void;
};

const DevMenu: React.FC<DevMenuProps> = ({ onInvokeOrb, onTriggerGlitch, onTriggerFog }) => {
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
    </div>
  );
};

export default DevMenu;
