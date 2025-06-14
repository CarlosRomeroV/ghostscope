import { useState } from "react";
import MainMenu from "./screens/MainMenu";
import HouseSelect from "./screens/HouseSelect";
import GameScreen from "./screens/GameScreen";
import LevelSelect from "./screens/LevelSelect";
import IntroScene from "./screens/IntroScene";
import { UserProvider } from './managers/UserContext';
import Navbar from './components/Navbar';
import './fonts/Sketcha Kits.otf';

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

  // Letterbox: 1080x1920 (portrait) siempre, con escalado y barras negras
  return (
    <UserProvider>
      <Navbar />
      <div className="fixed inset-0 bg-black flex items-center justify-center w-screen h-screen overflow-hidden">
        <div
          className="relative bg-black text-white shadow-2xl"
          style={{
            aspectRatio: '16 / 9',
            width: '100vw',
            height: '100vh',
            maxWidth: 'calc(100vh * 16 / 9)',
            maxHeight: 'calc(100vw * 9 / 16)',
            margin: 'auto',
            overflow: 'hidden',
            boxShadow: '0 0 80px 0 #000',
          }}
        >
          <div className={`absolute inset-0 transition-opacity duration-700 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
            {screen === "menu" && <div className="mt-20"><MainMenu onStart={() => setScreen("levels")} /></div>}
            {screen === "levels" && (
              <div className="mt-20">
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
              </div>
            )}
            {screen === "intro" && (
              <IntroScene
                onComplete={handleIntroComplete}
              />
            )}
            {screen === "select" && (
              <div className="mt-20">
                <HouseSelect
                  onSelect={(id) => {
                    setSelectedHouseId(id);
                    setScreen("game");
                  }}
                />
              </div>
            )}
            {screen === "game" && selectedLevelId && (
              <div className="mt-20">
                <GameScreen selectedLevelId={selectedLevelId} />
              </div>
            )}
          </div>
        </div>
      </div>
    </UserProvider>
  );
};

export default App;
