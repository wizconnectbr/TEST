import React from 'react';

interface WizConnectLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
}

export const WizConnectLogo: React.FC<WizConnectLogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
}) => {
  const sizeMap = {
    sm: { width: 140, height: 42, iconSize: 34 },
    md: { width: 190, height: 56, iconSize: 46 },
    lg: { width: 240, height: 72, iconSize: 60 },
    xl: { width: 320, height: 96, iconSize: 84 },
  };

  const { width, height } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <svg
        viewBox="0 0 500 500"
        className="shrink-0 drop-shadow-[0_0_15px_rgba(0,163,255,0.45)]"
        style={{ width: `${sizeMap[size].iconSize}px`, height: `${sizeMap[size].iconSize}px` }}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Blue Cyber Gradients */}
          <linearGradient id="wizBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00E5FF" />
            <stop offset="50%" stopColor="#00A3FF" />
            <stop offset="100%" stopColor="#0055FF" />
          </linearGradient>

          {/* Chrome Silver Gradient */}
          <linearGradient id="wizSilverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Orbital Circle Ring Gradient */}
          <linearGradient id="wizRingGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0066FF" />
            <stop offset="50%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#003884" />
          </linearGradient>
        </defs>

        {/* Outer Orbital Ring */}
        <circle
          cx="250"
          cy="250"
          r="170"
          stroke="url(#wizRingGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray="900 120"
          className="opacity-90"
        />

        {/* QR Code Symbol on Left */}
        <g transform="translate(70, 205)">
          {/* Bracket frame */}
          <path d="M5 25 V5 H25" stroke="#00A3FF" strokeWidth="5" strokeLinecap="round" />
          <path d="M55 5 H75 V25" stroke="#00A3FF" strokeWidth="5" strokeLinecap="round" />
          <path d="M5 55 V75 H25" stroke="#00A3FF" strokeWidth="5" strokeLinecap="round" />
          <path d="M55 75 H75 V55" stroke="#00A3FF" strokeWidth="5" strokeLinecap="round" />
          
          {/* QR mini glyphs */}
          <rect x="18" y="18" width="16" height="16" rx="2" fill="#FFFFFF" />
          <rect x="22" y="22" width="8" height="8" rx="1" fill="#0A0F1D" />
          <rect x="46" y="18" width="16" height="16" rx="2" fill="#FFFFFF" />
          <rect x="50" y="22" width="8" height="8" rx="1" fill="#0A0F1D" />
          <rect x="18" y="46" width="16" height="16" rx="2" fill="#FFFFFF" />
          <rect x="22" y="50" width="8" height="8" rx="1" fill="#0A0F1D" />
          <rect x="46" y="46" width="7" height="7" fill="#00A3FF" />
          <rect x="55" y="55" width="7" height="7" fill="#FFFFFF" />
        </g>

        {/* NFC Wireless Wave Arcs on Right */}
        <g transform="translate(365, 185)">
          <path
            d="M5 30 A 70 70 0 0 1 5 110"
            stroke="#0088FF"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M20 20 A 90 90 0 0 1 20 120"
            stroke="#00B4FF"
            strokeWidth="9"
            strokeLinecap="round"
          />
          <path
            d="M36 10 A 110 110 0 0 1 36 130"
            stroke="#00E5FF"
            strokeWidth="10"
            strokeLinecap="round"
          />
        </g>

        {/* Central Geometric 'W' */}
        {/* Left Wing (Electric Blue) */}
        <polygon
          points="130,135 185,135 245,290 190,290"
          fill="url(#wizBlueGrad)"
        />
        <polygon
          points="185,135 245,290 280,200 230,135"
          fill="url(#wizBlueGrad)"
          opacity="0.85"
        />

        {/* Right Wing (Chrome Silver / Metallic White) */}
        <polygon
          points="230,170 285,170 335,290 280,290"
          fill="url(#wizSilverGrad)"
        />
        <polygon
          points="310,135 375,135 340,205 285,205"
          fill="url(#wizSilverGrad)"
        />
      </svg>

      {/* Typography Section */}
      <div className="flex flex-col">
        <div className="flex items-center tracking-wider font-extrabold text-white text-xl leading-none">
          <span className="font-heading tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
            W
          </span>
          <span className="relative font-heading tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-200">
            I
            {/* Cyan slant dot on I */}
            <span className="absolute -top-1 right-0 w-1.5 h-1.5 bg-[#00D4FF] transform rotate-45 rounded-[1px] shadow-[0_0_8px_#00D4FF]" />
          </span>
          <span className="font-heading tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-300">
            Z
          </span>
        </div>

        {showSubtitle && (
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="h-[1.5px] w-3 bg-[#00A3FF] rounded-full" />
            <span className="text-[9px] font-bold tracking-[0.32em] text-[#00A3FF] uppercase font-mono-code">
              CONNECT
            </span>
            <span className="h-[1.5px] w-3 bg-[#00A3FF] rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
