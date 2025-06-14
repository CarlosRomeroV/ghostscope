import React, { ReactElement } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

interface PhotoViewerProps {
  photo: CameraState | null;
  onClose: () => void;
  isVisible: boolean;
  renderEvent: (event: EventState) => ReactElement;
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ photo, onClose, isVisible }) => {
  if (!photo) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: -50, scale: 0.9 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: 50, scale: 0.9 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-[#1a0f0a] rounded-lg overflow-hidden shadow-2xl max-w-4xl w-full mx-4
                     border-2 border-[#8b4513]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Barra superior */}
            <div className="bg-[#2c1810] px-4 py-3 flex justify-between items-center border-b border-[#8b4513]">
              <span className="text-amber-300 font-[MedievalSharp] text-lg">Evidencia Fotográfica</span>
              <button
                onClick={onClose}
                className="text-amber-300 hover:text-amber-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Contenedor de la imagen con efectos */}
            <div className="relative bg-black flex items-center justify-center p-6">
              <div className="relative overflow-hidden rounded-lg border border-[#8b4513] bg-black">
                <img
                  src={photo.image}
                  alt="Foto capturada"
                  className="w-[800px] h-[500px] object-cover"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PhotoViewer; 