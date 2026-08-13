import React, { useState } from 'react';
import { Logo } from './Logo';

export const Monogram3D: React.FC = () => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({ x: -y / 12, y: x / 12 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  return (
    <div
      className="relative w-full h-80 md:h-[420px] flex items-center justify-center perspective-1000 group cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative w-[320px] h-[320px] md:w-[380px] md:h-[380px] rounded-3xl bg-gradient-to-br from-[#374544]/90 via-[#101616]/95 to-[#151f1f] border border-[#D8CBB3]/40 shadow-2xl flex flex-col items-center justify-center p-8 transition-transform duration-200 ease-out backdrop-blur-xl"
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Glow background */}
        <div className="absolute inset-0 bg-[#D8CBB3]/10 rounded-3xl blur-2xl group-hover:bg-[#D8CBB3]/20 transition-all pointer-events-none" />

        {/* Orbit ring 1 */}
        <div className="absolute inset-6 border border-[#D8CBB3]/25 rounded-full animate-spin-slow pointer-events-none" />
        
        {/* Orbit ring 2 */}
        <div className="absolute inset-10 border border-dashed border-[#D8CBB3]/20 rounded-full animate-reverse-spin pointer-events-none" />

        {/* High Definition Official Logo inside 3D card */}
        <div className="relative z-10 p-6 rounded-2xl bg-[#101616]/80 border border-[#D8CBB3]/40 shadow-2xl backdrop-blur-md transform translate-z-12 flex flex-col items-center justify-center">
          <Logo variant="vertical" />
        </div>


      </div>
    </div>
  );
};
