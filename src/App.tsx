import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MainMenu from "./screens/MainMenu";
import LevelSelect from "./screens/LevelSelect";
import RandomDifficultySelect from "./screens/RandomDifficultySelect";
import AccountMenu from "./screens/AccountMenu";
import GameScreen from "./screens/GameScreen";
import IntroScene from "./screens/IntroScene";
import gameLogo from './images/ghostscopeLogoBlanco.png';
import houseGif from './images/houseGif.png';

const randomLevelTemplate = {
  id: 'random',
  name: 'Partida Aleatoria',
  durationSeconds: 180,
  rooms: [
    { name: 'Habitación Misteriosa', image: '', avgTemperature: 16 },
    { name: 'Pasillo Oscuro', image: '', avgTemperature: 14 },
    { name: 'Sótano', image: '', avgTemperature: 12 },
  ],
  events: [
    { type: 'orb', probabilityPerSecond: 5, rooms: [ { roomIndex: 0, probabilityPerSecond: 5 }, { roomIndex: 1, probabilityPerSecond: 5 }, { roomIndex: 2, probabilityPerSecond: 5 } ] },
    { type: 'temperatureDrop', probabilityPerSecond: 2, temperatureDrop: 8, durationDown: 4, minTemperature: 5, rooms: [ { roomIndex: 0, probabilityPerSecond: 2 }, { roomIndex: 1, probabilityPerSecond: 2 }, { roomIndex: 2, probabilityPerSecond: 2 } ] },
  ],
  ghostImage: '',
};

// Utilidad para obtener una posición aleatoria dentro de la ventana
function getRandomPosition() {
  const x = Math.random() * 60 - 30; // -30vw a +30vw
  const y = Math.random() * 40 - 20; // -20vh a +20vh
  return { x, y };
}

const App = () => {
  const [screen, setScreen] = useState<"splash" | "main" | "intro" | "game">("splash");
  const [menuState, setMenuState] = useState<null | 'levels' | 'random' | 'account'>(null);
  const [selectedLevelId, setSelectedLevelId] = useState<string | null>(null);
  const [randomDifficulty, setRandomDifficulty] = useState<string | null>(null);
  const [logoTransition, setLogoTransition] = useState(false); // Para animar el logo entre pantallas

  // --- Animación de logo en splash ---
  const [logoPos, setLogoPos] = useState({ x: 0, y: 0 });
  const [teleportPhase, setTeleportPhase] = useState(0); // 0: centro, 1: 1 salto, 2: 2 saltos
  const [logoKey, setLogoKey] = useState(0); // Para forzar remount instantáneo
  const [logoGlow, setLogoGlow] = useState(1); // 1 = normal, 2 = más brillo
  const teleportTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (screen !== "splash") return;
    let phase = 0;
    let jumps = 0;
    let jumpPositions: {x: number, y: number}[] = [];
    function nextPhase() {
      if (phase === 0) {
        // 1 salto
        jumpPositions = [getRandomPosition()];
        setLogoGlow(Math.random() > 0.5 ? 2 : 1);
        setLogoPos(jumpPositions[0]);
        setLogoKey(k => k + 1);
        setTeleportPhase(1);
        teleportTimeout.current = setTimeout(() => {
          setLogoPos({ x: 0, y: 0 });
          setLogoGlow(Math.random() > 0.5 ? 2 : 1);
          setLogoKey(k => k + 1);
          setTeleportPhase(0);
          phase = 1;
          teleportTimeout.current = setTimeout(nextPhase, 2000);
        }, 200);
      } else if (phase === 1) {
        // 2 saltos
        jumpPositions = [getRandomPosition(), getRandomPosition()];
        setLogoGlow(Math.random() > 0.5 ? 2 : 1);
        setLogoPos(jumpPositions[0]);
        setLogoKey(k => k + 1);
        setTeleportPhase(2);
        teleportTimeout.current = setTimeout(() => {
          setLogoGlow(Math.random() > 0.5 ? 2 : 1);
          setLogoPos(jumpPositions[1]);
          setLogoKey(k => k + 1);
          teleportTimeout.current = setTimeout(() => {
            setLogoPos({ x: 0, y: 0 });
            setLogoGlow(Math.random() > 0.5 ? 2 : 1);
            setLogoKey(k => k + 1);
            setTeleportPhase(0);
            phase = 0;
            teleportTimeout.current = setTimeout(nextPhase, 2000);
          }, 150);
        }, 150);
      }
    }
    teleportTimeout.current = setTimeout(nextPhase, 2000);
    return () => { if (teleportTimeout.current) clearTimeout(teleportTimeout.current); };
  }, [screen]);

  // Splash screen
  if (screen === "splash") {
    return (
      <div
        className="fixed inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer select-none overflow-hidden"
        style={{ zIndex: 100 }}
        onClick={() => {
          setLogoTransition(true);
          setTimeout(() => setScreen("main"), 700);
        }}
      >
        {/* Fondo degradado animado */}
        <motion.div
          className="absolute inset-0 -z-10"
          animate={{
            background: [
              "radial-gradient(ellipse at 50% 50%, #181b2b 0%, #0a0a0a 100%)",
              "radial-gradient(ellipse at 60% 40%, #23243a 0%, #0a0a0a 100%)",
              "radial-gradient(ellipse at 40% 60%, #181b2b 0%, #0a0a0a 100%)",
              "radial-gradient(ellipse at 50% 50%, #181b2b 0%, #0a0a0a 100%)",
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
        {/* Logo flotante y brillante con animación de salida */}
        <motion.img
          src={gameLogo}
          alt="Logo"
          className="w-[900px] max-w-none mb-12 drop-shadow-2xl"
          style={{ pointerEvents: 'none', position: 'relative', zIndex: 2 }}
          animate={logoTransition ? {
            y: -180,
            scale: 0.55,
            opacity: 0,
            filter: 'drop-shadow(0 0 32px #7fffd4)',
          } : {
            y: [0, -32, 0, 32, 0],
            scale: [1.08, 1.12, 1.08, 1.04, 1.08],
            filter: [
              'brightness(1.2) drop-shadow(0 0 32px #fff)',
              'brightness(1.4) drop-shadow(0 0 48px #fff)',
              'brightness(1.1) drop-shadow(0 0 16px #fff)',
              'brightness(1.3) drop-shadow(0 0 32px #fff)',
              'brightness(1.2) drop-shadow(0 0 32px #fff)'
            ],
          }}
          transition={logoTransition ? { duration: 0.7, ease: 'easeInOut' } : {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="text-3xl font-sans font-semibold text-center text-green-200 animate-pulse drop-shadow-lg" style={{textShadow:'0 0 16px #000', zIndex: 2, position: 'absolute', bottom: 64, left: 0, right: 0, fontFamily: 'Inter, Montserrat, Roboto, Arial, sans-serif'}}>Pulsa para empezar</div>
      </div>
    );
  }

  // Submenú a mostrar
  let subMenu = null;
  const handleBack = () => {
    setMenuState(null);
    setSelectedLevelId(null);
    setRandomDifficulty(null);
    setScreen('main'); // fuerza el menú principal
  };
  if (menuState === 'levels') {
    subMenu = <LevelSelect onSelect={(levelId) => {
      setSelectedLevelId(levelId);
      if (levelId === 'level1') {
        setScreen('intro');
      } else {
        setScreen('game');
      }
    }} onBack={handleBack} />;
  } else if (menuState === 'random') {
    subMenu = <RandomDifficultySelect onSelect={(difficulty) => {
      setRandomDifficulty(difficulty);
      setSelectedLevelId('random');
      setScreen('game');
    }} onBack={handleBack} onlyNormal />;
  } else if (menuState === 'account') {
    subMenu = <AccountMenu onBack={handleBack} />;
  }

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center w-screen h-screen overflow-hidden">
      {/* Fondo animado */}
      <div
        className="fixed inset-0 w-full h-full -z-10 bg-black"
        style={{
          backgroundImage: `url(${houseGif})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          imageRendering: 'auto',
          animation: 'ghostbg-float 20s linear infinite',
          filter: 'brightness(0.7) blur(1px)',
        }}
      />
      <div className="flex flex-row w-full h-full items-center justify-center">
        {screen === 'intro' && (
          <div className="flex flex-col h-full w-[420px] max-w-[90vw] bg-black/80 rounded-xl shadow-2xl p-12 border-l-4 border-green-900 justify-center relative">
            <IntroScene onComplete={() => setScreen('game')} />
          </div>
        )}
        {screen !== 'game' && screen !== 'intro' && (
          <MainMenu
            onSelect={(option) => setMenuState(option as any)}
            subMenu={subMenu}
            logoAnimatedEntry={logoTransition}
          />
        )}
        {screen === "game" && selectedLevelId && (
          <div className="flex-1 h-full flex items-center justify-center">
            <GameScreen selectedLevelId={selectedLevelId} levelOverride={selectedLevelId === 'random' ? randomLevelTemplate : undefined} />
          </div>
        )}
      </div>
      <style>{`
        @keyframes ghostbg-float {
          0% { background-position-y: 0; }
          100% { background-position-y: 100px; }
        }
      `}</style>
    </div>
  );
};

export default App;
