import React from 'react';
import gameLogo from '../images/gamelogo.png';
import houseGif from '../images/houseGif.png';

const MainMenu = ({ onStart }: { onStart: () => void }) => (
  <div
    className="fixed inset-0 w-full h-full flex flex-col items-center justify-center cursor-pointer select-none"
    style={{ zIndex: 100 }}
    onClick={onStart}
  >
    {/* Fondo gif animado */}
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
    {/* Logo flotante */}
    <img
      src={gameLogo}
      alt="Logo"
      className="w-[1000px] max-w-[90vw] mb-12 animate-ghost-float drop-shadow-2xl"
      style={{ pointerEvents: 'none' }}
    />
    {/* Mensaje */}
    <div className="text-3xl font-mono text-center bottom-0 text-green-200 animate-pulse drop-shadow-lg" style={{textShadow:'0 0 16px #000'}}>Pulsa para empezar</div>
    <style>{`
      @keyframes ghost-float {
        0%, 100% { transform: translateY(0) scale(1.04); }
        50% { transform: translateY(-32px) scale(1.08); }
      }
      .animate-ghost-float {
        animation: ghost-float 3.5s ease-in-out infinite;
      }
      @keyframes ghostbg-float {
        0% { background-position-y: 0; }
        100% { background-position-y: 100px; }
      }
    `}</style>
  </div>
);

export default MainMenu;