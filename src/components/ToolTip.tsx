import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToolTipProps {
  title: string;
  description: string;
  isVisible: boolean;
  children?: React.ReactNode;
  batteryLevel?: number;
}

const ToolTip: React.FC<ToolTipProps> = ({ 
  title, 
  description, 
  isVisible, 
  children,
  batteryLevel 
}) => {
  return (
    <div className="relative group">
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-[#1a0f0a] 
                     border-2 border-[#8b4513] rounded-lg p-3 shadow-xl z-50"
          >
            {/* Flecha */}
            <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-4 h-4 
                          bg-[#1a0f0a] border-r-2 border-b-2 border-[#8b4513] 
                          transform rotate-45" />
            
            {/* Contenido */}
            <div className="relative">
              <h3 className="text-amber-300 font-[MedievalSharp] text-lg mb-2 text-center">
                {title}
              </h3>
              
              {batteryLevel !== undefined && (
                <div className="mb-2">
                  <div className="h-2 bg-black/30 rounded overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-red-500 to-green-500 transition-all duration-300"
                      style={{ width: `${batteryLevel}%` }}
                    />
                  </div>
                </div>
              )}

              <p className="text-gray-300 text-sm text-center">
                {description}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ToolTip; 