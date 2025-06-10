import { HOUSES } from "../data/houses";

const HouseSelect = ({ onSelect }: { onSelect: (id: string) => void }) => (
  <div className="flex flex-col items-center justify-center h-screen space-y-4">
    <h2 className="text-2xl font-bold mb-4">Selecciona una casa encantada</h2>
    {HOUSES.map((house) => (
      <button
        key={house.id}
        className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        onClick={() => onSelect(house.id)}
      >
        🏚️ {house.name}
      </button>
    ))}
  </div>
);

export default HouseSelect;