import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FogEvent: React.FC = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1000); // duración corta
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 bg-gradient-to-br from-white/100 to-green-200/10 pointer-events-none z-30"
        />
      )}
    </AnimatePresence>
  );
};

export default FogEvent;
