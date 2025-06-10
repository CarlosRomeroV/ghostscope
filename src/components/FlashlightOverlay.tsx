import React, { useEffect, useRef, useState } from "react";

interface FlashlightOverlayProps {
  batteryDuration?: number; // duración en segundos
}

const FlashlightOverlay: React.FC<FlashlightOverlayProps> = ({ 
  batteryDuration = 60 // 1 minuto por defecto
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 400, y: 250 });
  const [visible, setVisible] = useState(false);
  const [radius, setRadius] = useState(0);
  const [warmupBrightness, setWarmupBrightness] = useState(0);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isOn, setIsOn] = useState(false);

  // Efecto para el calentamiento de la luz
  useEffect(() => {
    if (visible && !isOn) {
      setIsOn(true);
      let brightness = 0;
      const warmupInterval = setInterval(() => {
        brightness += 5;
        setWarmupBrightness(brightness);
        if (brightness >= 100) {
          clearInterval(warmupInterval);
        }
      }, 50); // 1 segundo total para calentar (20 steps * 50ms)
      return () => clearInterval(warmupInterval);
    } else if (!visible) {
      setIsOn(false);
      setWarmupBrightness(0);
    }
  }, [visible]);

  // Efecto para la batería
  useEffect(() => {
    if (visible && batteryLevel > 0) {
      const batteryInterval = setInterval(() => {
        setBatteryLevel(prev => {
          const newLevel = prev - (100 / batteryDuration);
          return newLevel > 0 ? newLevel : 0;
        });
      }, 1000);
      return () => clearInterval(batteryInterval);
    }
  }, [visible, batteryDuration]);

  // Efecto para apagar la linterna cuando la batería se agota
  useEffect(() => {
    if (batteryLevel <= 0) {
      setVisible(false);
    }
  }, [batteryLevel]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!wrapperRef.current || batteryLevel <= 0) return;
      const rect = wrapperRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height;
      setVisible(inside);
      if (inside) setPosition({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [batteryLevel]);

  useEffect(() => {
    if (visible) {
      let r = 0;
      const maxRadius = 150;
      const step = 5;
      const grow = () => {
        r += step;
        setRadius(r);
        if (r < maxRadius) requestAnimationFrame(grow);
      };
      grow();
    } else {
      setRadius(0);
    }
  }, [visible]);

  const getBrightnessMultiplier = () => {
    const warmupMultiplier = warmupBrightness / 100;
    const batteryMultiplier = batteryLevel / 100;
    return warmupMultiplier * batteryMultiplier;
  };

  return (
    <div ref={wrapperRef} className="absolute inset-0 z-40 pointer-events-none">
      {visible && batteryLevel > 0 && (
        <>
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${position.x}px ${position.y}px,
                rgba(255,255,255,${0.35 * getBrightnessMultiplier()}) ${radius}px,
                rgba(255,255,255,${0.2 * getBrightnessMultiplier()}) ${radius + 150}px,
                rgba(255,255,255,${0.05 * getBrightnessMultiplier()}) 1000px)`,
              mixBlendMode: "screen",
              transition: "background 0.05s ease-out",
            }}
          />
          {/* Indicador de batería */}
          <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded text-xs text-white">
            🔋 {Math.round(batteryLevel)}%
          </div>
        </>
      )}
    </div>
  );
};

export default FlashlightOverlay;
