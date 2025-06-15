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
import ghostPH1 from '../images/ghostPH1.png';
import GhostInfoBook from '../components/GhostInfoBook';
import { motion } from 'framer-motion';

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

const GameScreen = ({ selectedLevelId, levelOverride }: { selectedLevelId: string, levelOverride?: any }) => {
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
  const [temperatureDropActive, setTemperatureDropActive] = useState(false);
  const [targetTemperature, setTargetTemperature] = useState(20);
  const [temperatureDropConfig, setTemperatureDropConfig] = useState<{
    drop: number;
    duration: number;
    minTemp: number;
  } | null>(null);
  const [cameraFrozen, setCameraFrozen] = useState(false);
  const [apparitionActive, setApparitionActive] = useState(false);
  const [apparitionConfig, setApparitionConfig] = useState<{
    image: string;
    x: number;
    y: number;
    duration: number;
  } | null>(null);
  const [frozenImage, setFrozenImage] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);
  const [gameLoaded] = useState(false);
  const [fadingToGameplay] = useState(false);
  const [apparitionCooldowns, setApparitionCooldowns] = useState<{[key: number]: number}>({});
  const [attackCooldowns, setAttackCooldowns] = useState<{[key: number]: number}>({});
  const [cracks, setCracks] = useState<{[key: number]: boolean}>({});
  const [ghostInfoOpen, setGhostInfoOpen] = useState(false);
  const [ouijaUsedQuestions, setOuijaUsedQuestions] = useState<string[]>([]);
  const [ouijaResponse, setOuijaResponse] = useState<{ text: string, apparition?: boolean, corduraBonus?: number } | null>(null);
  const [ouijaResponseVisible, setOuijaResponseVisible] = useState(false);

  // Usa levelOverride si está presente
  const levelConfig = levelOverride ?? (LEVELS.find(l => l.id === selectedLevelId) ?? null);
  const levelNotFound = !levelConfig;

  // Añadir referencia para la cámara
  const cameraRef = useRef<HTMLDivElement>(null);

  // Si no hay nivel, renderizar mensaje después de los hooks
  if (levelNotFound) {
    return <div>Error: nivel no encontrado</div>;
  }

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

  // Efecto para la temperatura base
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (!paused && !temperatureDropActive) {
      interval = setInterval(() => {
        setTemperature(prev => {
          const roomTemp = levelConfig.rooms[currentCamera].avgTemperature;
          const fluctuation = (Math.random() - 0.5) * 6; // ±3 grados
          return Math.max(0, Math.min(40, roomTemp + fluctuation));
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentCamera, paused, levelConfig.rooms, temperatureDropActive]);

  // Efecto para el evento de bajada de temperatura
  useEffect(() => {
    if (!temperatureDropActive || !temperatureDropConfig || paused) return;

    let progress = 0;
    const interval = setInterval(() => {
      progress += (100 / temperatureDropConfig.duration);
      if (progress >= 100) {
        setTemperatureDropActive(false);
        setTemperatureDropConfig(null);
        return;
      }
      // Calcular temperatura actual
      const currentTemp = targetTemperature - (temperatureDropConfig.drop * (progress / 100));
      setTemperature(Math.max(temperatureDropConfig.minTemp, currentTemp));
    }, 1000);
  }, [temperatureDropActive, temperatureDropConfig, paused, targetTemperature]);

  // Efecto para manejar eventos
  useEffect(() => {
    if (paused) return;

    const checkEvents = () => {
      levelConfig.events.forEach((event: any) => {
        if (event.type === 'temperatureDrop') {
          const roomEvent = event.rooms?.find((r: any) => r.roomIndex === currentCamera);
          if (roomEvent && Math.random() * 100 < roomEvent.probabilityPerSecond) {
            setTemperatureDropActive(true);
            setTargetTemperature(temperature);
            setTemperatureDropConfig({
              drop: event.temperatureDrop || 10,
              duration: event.durationDown || 5,
              minTemp: event.minTemperature || 0
            });
          }
        }
        // ... otros tipos de eventos ...
      });
    };

    const interval = setInterval(checkEvents, 1000);
    return () => clearInterval(interval);
  }, [paused, levelConfig.events, currentCamera, temperature]);

  // Cordura baja 1% cada 8 segundos
  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setCordura((prev) => Math.max(0, prev - 1));
    }, 8000);
  }, [paused]);

  // Orbe automático en cámara 3 tras 1 segundo, luego congelar cámara y mostrar diálogo
  useEffect(() => {
    let orbTimeout: NodeJS.Timeout | null = null;
    let freezeTimeout: NodeJS.Timeout | null = null;
    if (currentCamera === 2 && !cameraFrozen && !paused) {
      orbTimeout = setTimeout(() => {
        if (currentCamera === 2 && !cameraFrozen && !paused) {
          invokeOrb();
          freezeTimeout = setTimeout(() => {
            if (currentCamera === 2 && !cameraFrozen && cameraRef.current) {
              // Espera un frame para asegurar que el orbe esté renderizado
              setTimeout(async () => {
                const canvas = await html2canvas(cameraRef.current!, {backgroundColor: null});
                setFrozenImage(canvas.toDataURL('image/png'));
                setCameraFrozen(true);
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

  // 1. Añadir función para disparar temperatureDrop desde el DevMenu
  const handleTriggerTemperatureDrop = () => {
    setTemperatureDropActive(true);
    setTargetTemperature(temperature);
    setTemperatureDropConfig({
      drop: 10, // cantidad de bajada
      duration: 5, // duración en segundos
      minTemp: 5 // temperatura mínima
    });
  };

  // 2. Lógica EMF especial durante temperatureDrop
  useEffect(() => {
    if (paused) return;
    let interval: NodeJS.Timeout;
    if (temperatureDropActive) {
      interval = setInterval(() => {
        const rand = Math.random();
        setEmfLevel(rand < 0.1 ? 2 : 1);
      }, 1000);
    } else {
      setEmfLevel(1); // Valor por defecto fuera del evento
    }
  }, [temperatureDropActive, paused]);

  // 2. Evento de aparición
  const handleTriggerApparition = () => {
    setApparitionConfig({
      image: ghostPH1,
      x: 50, // centro
      y: 60, // parte baja
      duration: 4
    });
    setApparitionActive(true);
    setCordura((prev) => Math.max(0, prev - 15));
  };

  // Aparición por evento (solo una bajada de cordura y con cooldown)
  useEffect(() => {
    if (paused) return;
    const now = Date.now();
    const checkEvents = () => {
      levelConfig.events.forEach((event: any) => {
        if (event.type === 'apparition') {
          const roomEvent = event.rooms?.find((r: any) => r.roomIndex === currentCamera);
          const coolDown = (event.coolDown ?? 10) * 1000;
          const corduraLoss = event.corduraLoss ?? 20;
          if (
            roomEvent &&
            Math.random() * 100 < roomEvent.probabilityPerSecond &&
            (!apparitionCooldowns[currentCamera] || now - apparitionCooldowns[currentCamera] > coolDown)
          ) {
            setApparitionConfig({
              image: event.image || '',
              x: event.x ?? 50,
              y: event.y ?? 60,
              duration: event.duration ?? 4
            });
            setApparitionActive(true);
            setCordura(prev => Math.max(0, prev - corduraLoss));
            setApparitionCooldowns(prev => ({...prev, [currentCamera]: now}));
          }
        }
        if (event.type === 'attack') {
          const roomEvent = event.rooms?.find((r: any) => r.roomIndex === currentCamera);
          const coolDown = (event.coolDown ?? 10) * 1000;
          const corduraLoss = event.corduraLoss ?? 20;
          if (
            roomEvent &&
            Math.random() * 100 < roomEvent.probabilityPerSecond &&
            (!attackCooldowns[currentCamera] || now - attackCooldowns[currentCamera] > coolDown)
          ) {
            setApparitionConfig({
              image: event.image || '',
              x: event.x ?? 50,
              y: event.y ?? 60,
              duration: event.duration ?? 4
            });
            setApparitionActive(true);
            setCordura(prev => Math.max(0, prev - corduraLoss));
            setAttackCooldowns(prev => ({...prev, [currentCamera]: now}));
            setCracks(prev => ({...prev, [currentCamera]: true}));
          }
        }
      });
    };
    const interval = setInterval(checkEvents, 1000);
    return () => clearInterval(interval);
  }, [paused, levelConfig.events, currentCamera, apparitionCooldowns, attackCooldowns]);

  // Efecto de aparición: EMF, bloqueo cámara, filtro rojo
  useEffect(() => {
    if (!apparitionActive || !apparitionConfig) return;
    setEmfLevel(4);
    const timer = setTimeout(() => {
      setApparitionActive(false);
      setApparitionConfig(null);
      setEmfLevel(1);
    }, apparitionConfig.duration * 1000);
  }, [apparitionActive, apparitionConfig]);

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

  const handleOuijaResponse = (resp: { text: string, apparition?: boolean, corduraBonus?: number }) => {
    setOuijaResponse(resp);
    setOuijaResponseVisible(true);
    // Aparición
    if (resp.apparition) handleTriggerApparition();
    // Bonus de cordura
    if (typeof resp.corduraBonus === 'number') setCordura((prev) => Math.min(100, prev + resp.corduraBonus));
    // Oculta tras 2.5s
    setTimeout(() => setOuijaResponseVisible(false), 2500);
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

  useEffect(() => {
    if (!isGameplay || paused) return () => {};
    const interval = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [isGameplay, paused]);

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
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
      <div className="relative flex flex-col items-center justify-center min-h-screen p-4 z-10">
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
            onTriggerTemperatureDrop={handleTriggerTemperatureDrop}
            onTriggerApparition={handleTriggerApparition}
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
                    filterColor={apparitionActive ? 'red' : 'green'}
                    isBlinking={apparitionActive}
                  >
                    {flashlightOn && batteryLevel > 0 && (
                      <FlashlightOverlay batteryDuration={60} />
                    )}
                    {isFlashing && <CameraFlash isVisible={true} />}
                    {orbEvents}
                    {fogEvents}
                    {apparitionActive && apparitionConfig && (
                      <img
                        src={apparitionConfig.image}
                        alt="ghost apparition"
                        style={{
                          position: 'absolute',
                          left: `${apparitionConfig.x}%`,
                          top: `${apparitionConfig.y}%`,
                          transform: 'translate(-50%, -50%)',
                          maxHeight: '80%',
                          maxWidth: '40%',
                          zIndex: 50
                        }}
                      />
                    )}
                    {cracks[currentCamera] && (
                      <svg
                        className="absolute inset-0 w-full h-full pointer-events-none z-[100]"
                        viewBox="0 0 800 500"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        style={{ opacity: 0.7, filter: 'drop-shadow(0 0 6px #fff)' }}
                      >
                        <polyline points="100,100 200,200 300,150 400,300 500,250" />
                        <polyline points="600,100 650,200 700,150 750,300" />
                        <polyline points="400,0 410,100 420,200 430,300 440,500" />
                        <polyline points="0,400 100,410 200,420 300,430 500,440" />
                        {/* Puedes añadir más líneas para mayor realismo */}
                      </svg>
                    )}
                  </CameraView>
                )}
              </div>
              {/* Botones de cambiar cámara */}
              <div className="flex items-center gap-4 mt-2">
                <button
                  onClick={() => setCurrentCamera((c) => (c - 1 + levelConfig.rooms.length) % levelConfig.rooms.length)}
                  className="focus:outline-none"
                  disabled={cameraFrozen || paused || apparitionActive}
                  style={{ background: 'none', border: 'none', padding: 0, opacity: cameraFrozen || paused || apparitionActive ? 0.5 : 1 }}
                >
                  <img src={flechita} alt="Anterior" style={{ width: 44, height: 44, objectFit: 'contain', transform: 'none' }} />
                </button>
                <span className="text-green-300 font-mono text-lg px-2 select-none" style={{ minWidth: 120, textAlign: 'center' }}>{cameraName}</span>
                <button
                  onClick={() => setCurrentCamera((c) => (c + 1) % levelConfig.rooms.length)}
                  className="focus:outline-none"
                  disabled={cameraFrozen || paused || apparitionActive}
                  style={{ background: 'none', border: 'none', padding: 0, opacity: cameraFrozen || paused || apparitionActive ? 0.5 : 1 }}
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
            onShowGhostInfo={() => setGhostInfoOpen(true)}
          />
          <CorduraBar percentage={cordura} />
        </div>
        <OuijaBoard
          isVisible={ouijaBoardVisible}
          onClose={() => setOuijaBoardVisible(false)}
          onQuestionSelected={(corduraLoss) => {
            handleOuijaQuestionSelected(corduraLoss);
          }}
          onOuijaResponse={(resp) => {
            setOuijaUsedQuestions((prev) => [...prev, resp.text]);
            handleOuijaResponse(resp);
          }}
          usedQuestions={ouijaUsedQuestions}
          currentRoomName={cameraName}
        />
        {ouijaResponseVisible && ouijaResponse && (
          <div className="fixed inset-0 flex items-center justify-center z-[120] pointer-events-none">
            <div className="bg-black/80 text-amber-200 text-3xl px-12 py-8 rounded-2xl border-2 border-amber-400 shadow-2xl animate-fade-in">
              {ouijaResponse.text === '' ? '...' : ouijaResponse.text}
            </div>
          </div>
        )}
        <PhotoGallery photos={photos} renderEvent={renderEvent} />
        {ghostInfoOpen && (
          <GhostInfoBook onClose={() => setGhostInfoOpen(false)} />
        )}
      </div>
    </div>
  );
};

export default GameScreen;
