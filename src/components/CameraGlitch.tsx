import React, { useEffect, useState } from "react";

type CameraGlitchProps = {
  trigger: number;
};

const CameraGlitch: React.FC<CameraGlitchProps> = ({ trigger }) => {
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (trigger > 0) {
      setActive(true);
      const timeout = setTimeout(() => setActive(false), 1000);
      return () => clearTimeout(timeout);
    }
  }, [trigger]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 bg-red-600 opacity-20 pointer-events-none z-30 animate-pulse" />
  );
};

export default CameraGlitch;