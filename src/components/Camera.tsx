import React from "react";

type CameraProps = {
  image: string;
};

const Camera: React.FC<CameraProps> = ({ image }) => {
  return (
    <div className="relative w-[800px] h-[500px] border-4 border-green-800 rounded-lg overflow-hidden">
      {/* Imagen de la cámara con filtro blanco y negro y más oscura */}
      <img
        src={image}
        alt="camera view"
        className="w-full h-full object-cover filter grayscale brightness-[0.4]"
      />

      {/* Filtro verde superpuesto con mayor intensidad */}
      <div className="absolute inset-0 bg-green-500 opacity-30 mix-blend-screen pointer-events-none z-10" />

      {/* Líneas horizontales simulando interferencia */}
      <div className="absolute inset-0 z-20 pointer-events-none animate-scanlines" />
    </div>
  );
};

export default Camera;
