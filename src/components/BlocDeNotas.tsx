import React, { useRef, useEffect, useState } from 'react';

const BlocDeNotas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [lastPos, setLastPos] = useState<{x: number, y: number} | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // Fondo de líneas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f9f7f1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#e0d7c3';
    for (let y = 40; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.strokeStyle = '#bfae82';
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setLastPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !lastPos) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(x, y);
    ctx.stroke();
    setLastPos({ x, y });
  };
  const handlePointerUp = () => {
    setDrawing(false);
    setLastPos(null);
  };

  return (
    <div className="bg-[#f9f7f1] border-4 border-[#bfae82] rounded-2xl shadow-2xl p-4 flex flex-col items-center" style={{width: 400, height: 520}}>
      <div className="font-bold text-lg mb-2 text-[#bfae82]">Bloc de Notas</div>
      <canvas
        ref={canvasRef}
        width={360}
        height={440}
        className="rounded-lg border border-[#bfae82] bg-transparent cursor-crosshair"
        style={{boxShadow: '0 2px 8px #bfae82'}}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <button
        className="mt-4 px-4 py-2 rounded bg-[#bfae82] text-white font-bold hover:bg-[#a08e5a]"
        onClick={() => {
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.fillStyle = '#f9f7f1';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.strokeStyle = '#e0d7c3';
              for (let y = 40; y < canvas.height; y += 40) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
              }
              ctx.strokeStyle = '#bfae82';
              ctx.lineWidth = 3;
              ctx.strokeRect(0, 0, canvas.width, canvas.height);
            }
          }
        }}
      >Limpiar</button>
    </div>
  );
};

export default BlocDeNotas; 