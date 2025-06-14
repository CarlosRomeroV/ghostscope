// screens/GameScreen.tsx
import { useEffect, useState, ReactElement, useRef } from "react";
import CameraView from "../components/CameraView";
import DevMenu from "../components/DevMenu";
import HUDButtons from "../components/HUDButtons";
import CorduraBar from "../components/CorduraBar";
import OrbEvent from "../events/OrbEvent";
import FogEvent from "../events/FogEvent";
import FlashlightOverlay from "../components/FlashlightOverlay";
import OuijaBoard from "../components/OuijaBoard";
import PhotoGallery from "../components/PhotoGallery";
import CameraFlash from "../components/CameraFlash";
import Sensors from "../components/Sensors";
import html2canvas from 'html2canvas';
import { LEVELS } from '../data/levelConfigs';
import BlocDeNotas from '../components/BlocDeNotas';
import levelOrder from '../data/levelOrder';
import flechita from '../images/flechita.png';

interface EventState {
  type: 'orb' | 'fog';
  position: { x: number; y: number };
  key: string;
}

interface CameraState {
  image: string;
  hasGlitch: boolean;
  events: EventState[];
  timestamp: number;
}

const GameScreen = ({ selectedLevelId }: { selectedLevelId: string }) => {
  const [currentCamera, setCurrentCamera] = useState(0);
  const [orbEvents, setOrbEvents] = useState<ReactElement[]>([]);
  const [fogEvents, setFogEvents] = useState<ReactElement[]>([]);
  const [eventStates, setEventStates] = useState<EventState[]>([]);
  const [glitchTrigger, setGlitchTrigger] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [ouijaBoardVisible, setOuijaBoardVisible] = useState(false);
  const [cordura, setCordura] = useState(100);
  const [photos, setPhotos] = useState<CameraState[]>([]);
  const [isFlashing, setIsFlashing] = useState(false);
  const [hasGlitch, setHasGlitch] = useState(false);
  const [emfLevel, setEmfLevel] = useState(0);
  const [temperature, setTemperature] = useState(20);
  const [cameraFrozen, setCameraFrozen] = useState(false);
  const [] = useState(true);
  const [] = useState(false);
  const [, setShowDialog] = useState(false);
  const orbAppearedRef = useRef(false);
  const cameraRef = useRef<HTMLDivElement>(null);
  const [frozenImage, setFrozenImage] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [gameLoaded] = useState(false);
  const [fadingToGameplay] = useState(false);

  // Buscar la configuración del nivel actual
  const levelConfig = LEVELS.find(l => l.id === selectedLevelId) ?? LEVELS[0];

  if (!levelConfig) return <div>Error: nivel no encontrado</div>;

  const cameraImage = levelConfig.rooms[currentCamera].image;
  const cameraName = levelConfig.rooms[currentCamera].name;
  const remainingPhotos = 3 - photos.length;

  useEffect(() => {
    if (!gameLoaded || paused) return;
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [gameLoaded, paused]);

  // Efecto para la batería de la linterna
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (flashlightOn && batteryLevel > 0) {
      interval = setInterval(() => {
        setBatteryLevel((prev) => Math.max(0, prev - (100 / 60))); // Dura 60 segundos
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [flashlightOn, batteryLevel]);

  useEffect(() => {
    if (glitchTrigger > 0) {
      setHasGlitch(true);
      const timeout = setTimeout(() => setHasGlitch(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [glitchTrigger]);

  // Efecto para la temperatura
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperature(prev => {
        const change = (Math.random() - 0.5) * 2; // Cambio aleatorio entre -1 y 1
        return Math.max(0, Math.min(40, prev + change)); // Mantener entre 0 y 40
      });
    }, 5000); // Cambiar cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  // Cordura baja 1% cada 8 segundos
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setCordura((prev) => Math.max(0, prev - 1));
    }, 8000);
    return () => clearInterval(interval);
  }, [paused]);

  // Orbe automático en cámara 3 tras 1 segundo, luego congelar cámara y mostrar diálogo
  useEffect(() => {
    let orbTimeout: NodeJS.Timeout | null = null;
    let freezeTimeout: NodeJS.Timeout | null = null;
    orbAppearedRef.current = false;
    if (currentCamera === 2 && !cameraFrozen && !paused) {
      orbTimeout = setTimeout(() => {
        if (currentCamera === 2 && !cameraFrozen && !paused) {
          invokeOrb();
          orbAppearedRef.current = true;
          freezeTimeout = setTimeout(() => {
            if (currentCamera === 2 && orbAppearedRef.current && !cameraFrozen && cameraRef.current) {
              // Espera un frame para asegurar que el orbe esté renderizado
              setTimeout(async () => {
                const canvas = await html2canvas(cameraRef.current!, {backgroundColor: null});
                setFrozenImage(canvas.toDataURL('image/png'));
                setCameraFrozen(true);
                setShowDialog(true);
                setPaused(true); // Pausa el juego cuando aparece el diálogo
              }, 100);
            }
          }, 1000);
        }
      }, 1000);
    }
    return () => {
      if (orbTimeout) clearTimeout(orbTimeout);
      if (freezeTimeout) clearTimeout(freezeTimeout);
    };
  }, [currentCamera, cameraFrozen, paused]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const createEventState = (type: 'orb' | 'fog'): EventState => {
    const x = Math.random() * 80 + 10; // entre 10% y 90%
    const y = Math.random() * 80 + 10;
    return {
      type,
      position: { x, y },
      key: crypto.randomUUID()
    };
  };

  const invokeOrb = () => {
    const eventState = createEventState('orb');
    setEventStates(prev => [...prev, eventState]);
    setEmfLevel(2); // Activar EMF nivel 2 cuando aparece un orbe
    
    const orb = <OrbEvent key={eventState.key} />;
    setOrbEvents((prev) => [...prev, orb]);
    
    setTimeout(() => {
      setOrbEvents((prev) => prev.slice(1));
      setEventStates(prev => prev.filter(e => e.key !== eventState.key));
      setEmfLevel(0); // Resetear EMF cuando desaparece el orbe
    }, 4000);
  };

  const invokeFog = () => {
    const eventState = createEventState('fog');
    setEventStates(prev => [...prev, eventState]);
    
    const fog = <FogEvent key={eventState.key} />;
    setFogEvents((prev) => [...prev, fog]);
    
    setTimeout(() => {
      setFogEvents((prev) => prev.slice(1));
      setEventStates(prev => prev.filter(e => e.key !== eventState.key));
    }, 6000);
  };

  const toggleFlashlight = () => {
    if (!flashlightOn && batteryLevel <= 0) return;
    setFlashlightOn((prev) => !prev);
  };

  const toggleOuija = () => {
    setOuijaBoardVisible((prev) => !prev);
  };

  const handleOuijaQuestionSelected = (corduraLoss: number) => {
    setCordura((prev) => Math.max(0, prev - corduraLoss));
  };

  const takePhoto = async () => {
    if (photos.length >= 3 || paused) return;
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 500);
    let imageDataUrl = cameraImage;
    if (cameraRef.current) {
      const canvas = await html2canvas(cameraRef.current, {backgroundColor: null});
      imageDataUrl = canvas.toDataURL('image/png');
    }
    const currentState: CameraState = {
      image: imageDataUrl,
      hasGlitch,
      events: eventStates.map(event => ({
        ...event,
        position: { ...event.position }
      })),
      timestamp: Date.now()
    };
    setPhotos((prev) => [...prev, currentState]);
  };

  const renderEvent = (event: EventState) => {
    switch (event.type) {
      case 'orb':
        return (
          <div
            key={event.key}
            className="absolute w-6 h-6 rounded-full bg-[rgba(144,238,144,0.5)] blur-sm"
            style={{
              left: `${event.position.x}%`,
              top: `${event.position.y}%`,
              filter: 'blur(4px) drop-shadow(0 0 6px #7fff00)',
              zIndex: 25
            }}
          />
        );
      case 'fog':
        return (
          <div
            key={event.key}
            className="absolute inset-0 bg-gradient-to-br from-white/100 to-green-200/10 pointer-events-none z-30 opacity-30"
          />
        );
    }
  };

  // Al terminar la escena inicial, mostrar fundido y luego el gameplay

  // Al terminar la intro, empieza el juego y a los 5s muestra overlay


  // Menú de pausa
  const handlePause = () => setPaused(true);
  const handleResume = () => setPaused(false);


  const order = levelOrder[selectedLevelId] || ['gameplay'];
  const [stepIndex] = useState(0);
  const currentStep = order[stepIndex];
  const isGameplay = currentStep === 'gameplay';


  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-4 bg-[url('/bg-noise.png')] bg-black bg-blend-overlay bg-repeat">
      {/* Fade out a negro al pasar a gameplay */}
      {fadingToGameplay && (
        <div className="fixed inset-0 bg-black z-[100] transition-opacity duration-700 ease-in-out opacity-90 pointer-events-none" style={{transitionProperty: 'opacity'}} />
      )}
      {/* Menú de pausa */}
      <div className="fixed top-8 right-8 z-50">
        <button onClick={handlePause} className="bg-gray-800/80 text-white px-4 py-2 rounded shadow font-mono text-sm">⏸ Pausa</button>
      </div>
      {paused && (
        <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50">
          <div className="bg-gray-900/95 border-2 border-green-500/40 rounded-lg px-8 py-6 shadow-xl max-w-md w-full text-center">
            <p className="text-green-100 text-xl font-mono mb-6">Juego en pausa</p>
            <button className="mt-2 px-6 py-2 rounded bg-green-700 hover:bg-green-600 text-white font-mono" onClick={handleResume}>Continuar</button>
          </div>
        </div>
      )}
      {/* DevMenu en la esquina superior derecha */}
      <div className="absolute top-4 right-4">
        <DevMenu
          onInvokeOrb={invokeOrb}
          onTriggerGlitch={() => setGlitchTrigger((p) => p + 1)}
          onTriggerFog={invokeFog}
        />
      </div>
      <div className="text-green-400 font-mono mb-2">Tiempo: {formatTime(elapsedSeconds)}</div>

      {/* Gameplay solo si corresponde */}
      {isGameplay && (
        <div className="w-full flex flex-row items-start justify-center gap-0">
          {/* Sensores pegados a la cámara */}
          <div className="flex flex-col items-end justify-center h-full mr-4 z-40" style={{ minWidth: 120 }}>
            <Sensors emfLevel={emfLevel} temperature={temperature} />
          </div>
          {/* Centro: Cámara y controles */}
          <div className="flex flex-col items-center justify-center" style={{ minWidth: 800, maxWidth: 800 }}>
            <div className="relative mb-2" ref={cameraRef} id="camera-capture-area">
              {cameraFrozen && frozenImage ? (
                <img src={frozenImage} alt="Cámara congelada" className="w-[800px] h-[500px] object-cover rounded-lg border-4 border-green-800" />
              ) : (
                <CameraView 
                  image={cameraImage}
                  showGlitch={hasGlitch}
                >
                  {flashlightOn && batteryLevel > 0 && (
                    <FlashlightOverlay batteryDuration={60} />
                  )}
                  {isFlashing && <CameraFlash isVisible={true} />}
                  {orbEvents}
                  {fogEvents}
                </CameraView>
              )}
            </div>
            {/* Botones de cambiar cámara */}
            <div className="flex items-center gap-4 mt-2">
              <button
                onClick={() => setCurrentCamera((c) => (c - 1 + levelConfig.rooms.length) % levelConfig.rooms.length)}
                className="focus:outline-none"
                disabled={cameraFrozen || paused}
                style={{ background: 'none', border: 'none', padding: 0, opacity: cameraFrozen || paused ? 0.5 : 1 }}
              >
                <img src={flechita} alt="Anterior" style={{ width: 44, height: 44, objectFit: 'contain', transform: 'none' }} />
              </button>
              <span className="text-green-300 font-mono text-lg px-2 select-none" style={{ minWidth: 120, textAlign: 'center' }}>{cameraName}</span>
              <button
                onClick={() => setCurrentCamera((c) => (c + 1) % levelConfig.rooms.length)}
                className="focus:outline-none"
                disabled={cameraFrozen || paused}
                style={{ background: 'none', border: 'none', padding: 0, opacity: cameraFrozen || paused ? 0.5 : 1 }}
              >
                <img src={flechita} alt="Siguiente" style={{ width: 44, height: 44, objectFit: 'contain', transform: 'scaleX(-1)' }} />
              </button>
            </div>
          </div>
          {/* Bloc de notas a la derecha, sin desplazar la cámara */}
          <div className="flex flex-col items-center ml-16" style={{ minWidth: 420 }}>
            <BlocDeNotas />
          </div>
        </div>
      )}
      {/* HUD y otros elementos debajo */}
      <div className="w-full flex flex-col items-center mt-6">
        <HUDButtons 
          onToggleFlashlight={toggleFlashlight} 
          onToggleOuija={toggleOuija}
          onTakePhoto={takePhoto}
          remainingPhotos={remainingPhotos}
          batteryLevel={batteryLevel}
        />
        <CorduraBar percentage={cordura} />
      </div>
      <OuijaBoard 
        isVisible={ouijaBoardVisible}
        onClose={() => setOuijaBoardVisible(false)}
        onQuestionSelected={handleOuijaQuestionSelected}
      />
      <PhotoGallery photos={photos} renderEvent={renderEvent} />
    </div>
  );
};

export default GameScreen;
