import { useState } from "react";
import MainMenu from "./screens/MainMenu";
import HouseSelect from "./screens/HouseSelect";
import GameScreen from "./screens/GameScreen";
import LevelSelect from "./screens/LevelSelect";
import IntroScene from "./screens/IntroScene";

const App = () => {
  const [screen, setScreen] = useState<"menu" | "levels" | "intro" | "select" | "game">("menu");
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [transitioning, setTransitioning] = useState(false);

  const handleIntroComplete = () => {
    setTransitioning(true);
    setTimeout(() => {
      setSelectedHouseId("level1-special");
      setScreen("game");
      setTransitioning(false);
    }, 700); // Duración de la transición
  };

  return (
    <div className={`min-h-screen bg-black text-white transition-opacity duration-700 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
      {screen === "menu" && <MainMenu onStart={() => setScreen("levels")} />}
      {screen === "levels" && (
        <LevelSelect
          onSelect={(levelId) => {
            setSelectedLevelId(levelId);
            if (levelId === 'level1') {
              setScreen("intro");
            } else {
              setScreen("select");
            }
          }}
          onBack={() => setScreen("menu")}
        />
      )}
      {screen === "intro" && (
        <IntroScene
          onComplete={handleIntroComplete}
        />
      )}
      {screen === "select" && (
        <HouseSelect
          onSelect={(id) => {
            setSelectedHouseId(id);
            setScreen("game");
          }}
        />
      )}
      {screen === "game" && selectedHouseId && (
        <GameScreen selectedHouseId={selectedHouseId} />
      )}
    </div>
  );
};

export default App;
