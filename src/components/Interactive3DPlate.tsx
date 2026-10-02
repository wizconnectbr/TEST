import React, { useState } from 'react';
import { GooglePlateGraphic } from './GooglePlateGraphic';

interface Interactive3DPlateProps {
  serialNumber?: string;
  businessName?: string;
  googleReviewUrl?: string;
  topCustomText?: string;
  styleVariant?: 'google_classic' | 'wiz_dark' | 'clean_white';
  className?: string;
}

export const Interactive3DPlate: React.FC<Interactive3DPlateProps> = ({
  serialNumber = '000001',
  businessName = 'Sua Loja / Empresa',
  googleReviewUrl = 'https://g.page/r/wizconnect/review',
  topCustomText = 'NÓS ADORARÍAMOS A SUA AVALIAÇÃO NO GOOGLE',
  styleVariant = 'google_classic',
  className = '',
}) => {
  const [rotateX, setRotateX] = useState(6);
  const [rotateY, setRotateY] = useState(-8);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = -((y - centerY) / centerY) * 16;
    const rotY = ((x - centerX) / centerX) * 16;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(6);
    setRotateY(-8);
  };

  return (
    <div
      className={`relative perspective-[1200px] flex flex-col items-center justify-center p-4 sm:p-6 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Interactive 3D Card with Acrylic Glass Sheen */}
      <div
        className="relative w-full max-w-[340px] sm:max-w-[390px] transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Realistic Acrylic Depth Bevel (Edge shadow & thickness) */}
        <div
          className="absolute -inset-1.5 rounded-[40px] bg-gradient-to-tr from-white/30 via-slate-400/20 to-black/40 blur-[2px] opacity-75 -z-10"
          style={{ transform: 'translateZ(-14px)' }}
        />

        {/* Ambient Drop Shadow on table surface */}
        <div
          className="absolute -bottom-8 inset-x-4 h-12 bg-black/60 blur-xl rounded-full -z-20 transition-opacity"
          style={{
            transform: `translateZ(-30px) scale(${isHovered ? 1.08 : 0.95})`,
          }}
        />

        {/* The Graphic Plate */}
        <GooglePlateGraphic
          serialNumber={serialNumber}
          businessName={businessName}
          googleReviewUrl={googleReviewUrl}
          topCustomText={topCustomText}
          styleVariant={styleVariant}
        />

        {/* Dynamic Light Sheen & Specular Glare overlay that shifts with mouse */}
        <div
          className="absolute inset-0 rounded-[36px] pointer-events-none overflow-hidden"
          style={{ transform: 'translateZ(1px)' }}
        >
          <div
            className="w-[200%] h-[200%] absolute -top-1/2 -left-1/2 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${50 + rotateY * 2.5}% ${
                50 + rotateX * 2.5
              }%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 35%, transparent 65%)`,
              opacity: isHovered ? 0.9 : 0.45,
            }}
          />
        </div>

        {/* Realistic Table Mount / Acrylic Base Stand */}
        <div
          className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-48 sm:w-56 h-3 bg-gradient-to-r from-transparent via-slate-300/40 to-transparent blur-[1px] rounded-full pointer-events-none"
          style={{ transform: 'translateZ(-5px)' }}
        />
      </div>

      {/* Interactive Hint */}
      <div className="mt-5 flex items-center gap-2 text-xs text-slate-400 font-mono-code">
        <span className="w-2 h-2 rounded-full bg-[#00A3FF] animate-ping" />
        <span>Passe o mouse ou toque para interagir em 3D</span>
      </div>
    </div>
  );
};
