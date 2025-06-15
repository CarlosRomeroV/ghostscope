import React from 'react';

const GhostInfoBook = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center">
    <div className="bg-gray-900 border-2 border-green-400 rounded-2xl shadow-2xl p-8 max-w-lg w-full relative">
      <h2 className="text-3xl font-bold text-green-200 mb-4 text-center">Información de Fantasmas</h2>
      <div className="text-green-100 text-lg mb-6">
        <p><b>Próximamente:</b> Aquí podrás consultar las características de cada tipo de fantasma. Cada fantasma tendrá comportamientos y pistas únicas que te ayudarán a descubrir su identidad durante la partida.</p>
        <ul className="mt-4 list-disc pl-6">
          <li>Ejemplo: Un fantasma puede aparecer más frecuentemente.</li>
          <li>Ejemplo: Otro puede bajar la temperatura de la habitación rápidamente.</li>
          <li>¡Más información en futuras actualizaciones!</li>
        </ul>
      </div>
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded shadow"
      >
        Cerrar
      </button>
    </div>
  </div>
);

export default GhostInfoBook; 