// events/OrbEvent.tsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type OrbEventProps = {
  speed?: number; // en segundos, default 3s
  opacity?: number; // 0 a 1, default 0.3
  color?: string; // CSS color, default verde suave
  position?: { x: number; y: number }; // Posición fija opcional
};

const OrbEvent: React.FC<OrbEventProps> = ({
  speed = 3,
  opacity = 0.3,
  color = "rgba(144, 238, 144, 0.5)",
  position
}) => {
  const id = useMemo(() => Math.random().toString(36).substring(2, 9), []);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const hide = setTimeout(() => setVisible(false), speed * 1000);
    return () => clearTimeout(hide);
  }, [speed]);

  // Si no se proporciona una posición, usar una aleatoria
  const startX = position?.x ?? Math.random() * 80 + 10; // entre 10% y 90%
  const startY = position?.y ?? Math.random() * 80 + 10;

  // Solo aplicar movimiento si no hay posición fija
  const deltaX = position ? 0 : Math.random() * 40 - 20;
  const deltaY = position ? 0 : Math.random() * 40 - 20;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={id}
          className="absolute w-6 h-6 rounded-full pointer-events-none"
          initial={{
            top: `${startY}%`,
            left: `${startX}%`,
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            top: `${startY + deltaY}%`,
            left: `${startX + deltaX}%`,
            opacity,
            scale: 1,
            transition: { duration: speed, ease: "easeInOut" },
          }}
          exit={{
            opacity: 0,
            transition: { duration: 1, ease: "easeOut" },
          }}
          style={{ backgroundColor: color, filter: "blur(4px) drop-shadow(0 0 6px #7fff00)", zIndex: 25 }}
        />
      )}
    </AnimatePresence>
  );
};

export default OrbEvent;
