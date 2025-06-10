const MainMenu = ({ onStart }: { onStart: () => void }) => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1 className="text-4xl font-bold mb-8">👻 Cazadores de Fantasmas</h1>
    <button
      className="bg-green-600 px-6 py-3 rounded hover:bg-green-700"
      onClick={onStart}
    >
      JUGAR
    </button>
  </div>
);

export default MainMenu;