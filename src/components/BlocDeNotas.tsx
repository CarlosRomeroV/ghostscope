import React, { useRef, useEffect, useState } from 'react';
import notepadImg from '../images/notepad.png';

const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 440;

const BlocDeNotas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{x: number, y: number} | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [alphaMask, setAlphaMask] = useState<Uint8ClampedArray | null>(null);

  // Cargar la imagen y crear la máscara de transparencia
  useEffect(() => {
    const img = new window.Image();
    img.src = notepadImg;
    img.onload = () => {
      imgRef.current = img;
      setImgLoaded(true);
      // Crear máscara de transparencia
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = CANVAS_WIDTH;
      tempCanvas.height = CANVAS_HEIGHT;
      const tempCtx = tempCanvas.getContext('2d');
      if (tempCtx) {
        tempCtx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        tempCtx.drawImage(img, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        const imgData = tempCtx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        setAlphaMask(imgData.data);
      }
    };
  }, []);

  // Pintar el fondo (PNG) al montar o limpiar
  const drawBackground = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !imgRef.current) return;
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.drawImage(imgRef.current, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  };

  useEffect(() => {
    if (imgLoaded) {
      drawBackground();
    }
  }, [imgLoaded]);

  // Dibujo solo sobre zonas opacas y con grosor variable
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setLastPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing || !alphaMask) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !lastPos) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // Comprobar si ambos puntos están sobre zona opaca
    const idx1 = (Math.floor(lastPos.y) * CANVAS_WIDTH + Math.floor(lastPos.x)) * 4 + 3;
    const idx2 = (Math.floor(y) * CANVAS_WIDTH + Math.floor(x)) * 4 + 3;
    if (alphaMask[idx1] > 10 && alphaMask[idx2] > 10) {
      // Grosor variable: base 2 + ruido aleatorio
      const variableWidth = 2 + Math.random() * 2;
      ctx.strokeStyle = '#222';
      ctx.lineWidth = variableWidth;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPos.x, lastPos.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    setLastPos({ x, y });
  };

  const handlePointerUp = () => {
    setDrawing(false);
    setLastPos(null);
  };

  // Limpiar: solo repinta el PNG
  const handleClear = () => {
    drawBackground();
  };

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', background:'none'}}>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{background: 'none', display:'block'}} 
        className="cursor-crosshair"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <button
        style={{marginTop: 16, padding: '8px 32px', borderRadius: 8, background: '#bfae82', color: 'white', fontWeight: 'bold', border: 'none', fontSize: 18, cursor: 'pointer'}}
        onClick={handleClear}
      >Borrar</button>
    </div>
  );
};

export default BlocDeNotas; 