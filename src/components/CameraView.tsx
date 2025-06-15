import React from 'react';

interface CameraViewProps {
  image: string;
  isStatic?: boolean;
  showGlitch?: boolean;
  filterColor?: 'green' | 'red';
  isBlinking?: boolean;
  children?: React.ReactNode;
}

const CameraView: React.FC<CameraViewProps> = ({ 
  image, 
  isStatic = false,
  showGlitch = false,
  filterColor = 'green',
  isBlinking = false,
  children 
}) => {
  return (
    <div className={`relative w-[800px] h-[500px] border-4 border-green-800 rounded-lg overflow-hidden ${isBlinking ? 'animate-blink' : ''}`}>
      {/* Imagen base de la cámara */}
      <img
        src={image}
        alt="camera view"
        className="w-full h-full object-cover filter grayscale brightness-[1.5]"
      />

      {/* Filtro de color */}
      <div className={`absolute inset-0 ${filterColor === 'red' ? 'bg-red-500' : 'bg-green-500'} opacity-30 mix-blend-screen pointer-events-none z-10`} />

      {/* Líneas de scanline */}
      <div 
        className={`absolute inset-0 pointer-events-none z-20 ${isStatic ? '' : 'animate-scanlines'}`}
        style={{
          backgroundImage: `linear-gradient(rgba(${filterColor === 'red' ? '255,0,0' : '0,255,0'}, 0.25) 50%, transparent 50%)`,
          backgroundSize: '100% 8px',
          backgroundRepeat: 'repeat',
          opacity: 0.4,
          mixBlendMode: 'screen',
        }}
      />

      {/* Efecto de glitch */}
      {showGlitch && (
        <div className="absolute inset-0 bg-red-600 opacity-20 pointer-events-none z-30 animate-pulse" />
      )}

      {/* Contenido adicional (orbes, niebla, etc.) */}
      {children}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          10%, 30%, 50%, 70%, 90% { opacity: 0.2; }
          20%, 40%, 60%, 80% { opacity: 1; }
        }
        .animate-blink {
          animation: blink 1s steps(1, end) infinite;
        }
      `}</style>
    </div>
  );
};

export default CameraView; 