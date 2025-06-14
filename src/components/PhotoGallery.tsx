import React, { useState, ReactElement } from 'react';
import { motion } from 'framer-motion';
import PhotoViewer from './PhotoViewer';

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

interface PhotoGalleryProps {
  photos: CameraState[];
  renderEvent: (event: EventState) => ReactElement;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, renderEvent }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<CameraState | null>(null);

  return (
    <>
      <div className="fixed left-4 top-1/2 -translate-y-1/2 space-y-2 z-30 bg-black/30 p-3 rounded-lg">
        <div className="text-green-400 text-xs mb-2 text-center font-mono">Fotos ({photos.length}/3)</div>
        <div className="space-y-2">
          {photos.map((photo, index) => (
            <motion.div
              key={photo.timestamp}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              className="relative group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="w-24 h-24 overflow-hidden rounded border-2 border-green-800 bg-black flex items-center justify-center">
                  <img
                    src={photo.image}
                    alt={`Foto ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </motion.div>
            </motion.div>
          ))}
          {photos.length < 3 && Array.from({ length: 3 - photos.length }).map((_, index) => (
            <motion.div
              key={`empty-${index}`}
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: (photos.length + index) * 0.2 }}
              className="w-24 h-24 border-2 border-dashed border-green-800/30 rounded bg-black/20"
            />
          ))}
        </div>
      </div>

      <PhotoViewer
        photo={selectedPhoto}
        isVisible={!!selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        renderEvent={renderEvent}
      />
    </>
  );
};

export default PhotoGallery; 