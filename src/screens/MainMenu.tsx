import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserContext } from '../managers/UserContext';
import gameLogo from '../images/ghostscopeLogoBlanco.png';
import '../fonts/Ichigayamincho-9MAv0.ttf';

const MENU_OPTIONS = [
  { id: 'levels', label: 'SELECCIONAR NIVEL', enabled: true },
  { id: 'random', label: 'PARTIDA ALEATORIA', enabled: true },
  { id: 'custom', label: 'PERSONALIZACIÓN', enabled: false },
  { id: 'account', label: 'CUENTA', enabled: true },
];

const FLOAT_DELAYS = [0.6, 0.8, 1.2, 0.8]; // delays para el efecto flotante

const MainMenu = ({ onSelect, subMenu, logoAnimatedEntry }: { onSelect: (option: string) => void, subMenu?: React.ReactNode, logoAnimatedEntry?: boolean }) => {
  const { user } = useContext(UserContext);
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [fading, setFading] = useState(false);
  const [fadeKey, setFadeKey] = useState(0); // Para forzar re-render de animaciones

  // Resetear animaciones y selección al volver al menú principal
  useEffect(() => {
    if (!subMenu) {
      setSelected(null);
      setFading(false);
      setFadeKey(k => k + 1);
    }
  }, [subMenu]);

  const handleSelect = (id: string, enabled: boolean) => {
    if (!enabled) return;
    setSelected(id);
    setFading(true);
    setTimeout(() => {
      onSelect(id);
    }, 700);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* Logo solo en menú principal y mientras no se está animando la salida */}
      {!subMenu && (!selected || (selected && !fading)) && (
        <motion.img
          src={gameLogo}
          alt="Logo"
          className={`fixed left-1/2 -translate-x-1/2 z-30 drop-shadow-2xl pointer-events-none ${selected && fading ? 'fade-out-logo' : ''}`}
          style={{ filter: 'drop-shadow(0 0 64px #4fff7b)', top: 32, width: 480, maxWidth: '90vw', height: 'auto' }}
          initial={logoAnimatedEntry ? {
            opacity: 0,
            top: 32,
            y: 0,
            width: 480,
            maxWidth: '90vw',
          } : {
            opacity: 1,
            top: 32,
            y: 0,
            width: 480,
            maxWidth: '90vw',
          }}
          animate={logoAnimatedEntry ? {
            opacity: 1,
            top: 32,
            y: 0,
            width: 480,
            maxWidth: '90vw',
            transition: { duration: 0.7, ease: 'easeInOut' }
          } : {
            opacity: 1,
            top: 32,
            y: 0,
            width: 480,
            maxWidth: '90vw',
          }}
          transition={logoAnimatedEntry ? { duration: 0.7, ease: 'easeInOut' } : {}}
        />
      )}
      <style>{`
        @font-face {
          font-family: 'Ichigayamincho';
          src: url('/src/fonts/Ichigayamincho-9MAv0.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        .float-anim {
          animation: floatY 3.5s ease-in-out infinite;
        }
        @keyframes floatY {
          0% { transform: translateY(0); }
          20% { transform: translateY(4px); }
          50% { transform: translateY(0); }
          70% { transform: translateY(-4px); }
          100% { transform: translateY(0); }
        }
        .fade-out-logo {
          opacity: 0 !important;
          transition: opacity 0.7s;
        }
      `}</style>
      {/* Usuario logeado solo en menú principal */}
      {!subMenu && user && (
        <div className="flex items-center gap-4 mb-12 self-center mt-40">
          <img src={user.avatar} alt="avatar" className="w-14 h-14 rounded-full border-2 border-green-400 bg-black object-cover" />
          <span className="text-xl font-bold text-green-200 font-mono">{user.name}</span>
        </div>
      )}
      {/* Opciones de menú */}
      {!selected && !subMenu && (
        <ul className="flex flex-col gap-10 w-full max-w-md flex-1 justify-center items-center mt-56" key={fadeKey}>
          {MENU_OPTIONS.map((opt, idx) => (
            <li key={opt.id} className="w-full flex justify-center">
              <button
                className={`uppercase font-bold tracking-widest transition-all duration-300
                  text-[3.2rem] [transform:scaleY(1.5)]
                  float-anim
                  shadow-lg px-8 py-6 rounded-2xl
                  ${selected === opt.id && fading ? 'fade-zoom-out-selected' : selected && fading ? 'fade-out' : ''}
                  ${opt.enabled ?
                    (hovered === opt.id && !selected ? 'scale-110 text-[#4fff7b] bg-black/80 border-2 border-[#4fff7b]' : 'text-[#4fff7b] bg-black/70 border-2 border-[#4fff7b] hover:scale-110 hover:text-[#4fff7b] hover:bg-black/80')
                    : 'text-[#4fff7b]/30 bg-black/40 border-2 border-[#4fff7b]/30 cursor-not-allowed opacity-40'}
                `}
                style={{
                  fontFamily: 'Ichigayamincho, Montserrat, Inter, Roboto, Arial, sans-serif',
                  animationDelay: `${FLOAT_DELAYS[idx]}s`,
                }}
                disabled={!opt.enabled}
                onMouseEnter={() => setHovered(opt.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => handleSelect(opt.id, opt.enabled)}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {/* Opciones con animación de salida */}
      {selected && !subMenu && (
        <ul className="flex flex-col gap-10 w-full max-w-md flex-1 justify-center items-center mt-56" key={fadeKey}>
          {MENU_OPTIONS.map((opt) => (
            <li key={opt.id} className="w-full flex justify-center">
              <button
                className={`uppercase font-bold tracking-widest transition-all duration-300
                  text-[3.2rem] [transform:scaleY(1.5)]
                  float-anim
                  shadow-lg px-8 py-6 rounded-2xl
                  ${selected === opt.id && fading ? 'fade-zoom-out-selected' : 'fade-out'}
                  ${opt.enabled ?
                    'text-[#4fff7b] bg-black/70 border-2 border-[#4fff7b]' :
                    'text-[#4fff7b]/30 bg-black/40 border-2 border-[#4fff7b]/30 cursor-not-allowed opacity-40'}
                `}
                style={{
                  fontFamily: 'Ichigayamincho, Montserrat, Inter, Roboto, Arial, sans-serif',
                }}
                disabled
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
      {subMenu && (
        <div className="w-full flex-1 flex flex-col justify-center animate-fade-in">
          {subMenu}
        </div>
      )}
      <style>{`
        .fade-out {
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.7s;
        }
        .fade-zoom-out-selected {
          opacity: 0;
          transform: scale(1.18) scaleY(1.5);
          z-index: 10;
          pointer-events: none;
          transition: opacity 0.7s, transform 0.7s;
        }
        .animate-fade-in {
          animation: fadeIn 0.7s;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default MainMenu;