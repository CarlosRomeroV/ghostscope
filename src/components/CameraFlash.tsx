import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CameraFlashProps {
  isVisible: boolean;
}

const CameraFlash: React.FC<CameraFlashProps> = ({ isVisible }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute inset-0 bg-gradient-radial from-white via-white/50 to-transparent
                     pointer-events-none z-40"
          style={{
            background: `
              radial-gradient(circle at center,
                rgba(255,255,255,1) 0%,
                rgba(255,255,255,0.8) 30%,
                rgba(255,255,255,0.2) 70%,
                rgba(255,255,255,0) 100%
              )
            `
          }}
        />
      )}
    </AnimatePresence>
  );
};

export default CameraFlash; 