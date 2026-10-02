import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface GooglePlateGraphicProps {
  serialNumber?: string;
  businessName?: string;
  googleReviewUrl?: string;
  topCustomText?: string;
  styleVariant?: 'google_classic' | 'wiz_dark' | 'clean_white';
  showCutGuides?: boolean;
  className?: string;
  containerId?: string;
}

export const GooglePlateGraphic: React.FC<GooglePlateGraphicProps> = ({
  serialNumber = '000001',
  businessName = 'Sua Loja / Empresa',
  googleReviewUrl = 'https://g.page/r/wizconnect/review',
  topCustomText = 'NÓS ADORARÍAMOS A SUA AVALIAÇÃO NO GOOGLE',
  styleVariant = 'google_classic',
  showCutGuides = false,
  className = '',
  containerId = 'plate-graphic-render',
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Generate crisp QR code whenever URL changes
  useEffect(() => {
    const generateQr = async () => {
      try {
        const targetUrl = googleReviewUrl.trim() || 'https://google.com';
        const url = await QRCode.toDataURL(targetUrl, {
          width: 600,
          margin: 1,
          color: {
            dark: styleVariant === 'wiz_dark' ? '#00E5FF' : '#000000',
            light: styleVariant === 'wiz_dark' ? '#0A0F1D' : '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        });
        setQrDataUrl(url);
      } catch (err) {
        console.error('Error generating QR Code', err);
      }
    };
    generateQr();
  }, [googleReviewUrl, styleVariant]);

  // Split top text into 2 balanced lines if long
  const formatTopText = (text: string) => {
    if (!text) return ['NÓS ADORARÍAMOS A SUA', 'AVALIAÇÃO NO GOOGLE'];
    const words = text.trim().split(' ');
    if (words.length <= 3) return [text, ''];
    const mid = Math.ceil(words.length / 2);
    return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
  };

  const [line1, line2] = formatTopText(topCustomText);

  const isDark = styleVariant === 'wiz_dark';

  return (
    <div
      id={containerId}
      className={`relative w-full aspect-square rounded-[36px] overflow-hidden select-none shadow-2xl transition-all ${
        isDark
          ? 'bg-[#0B101E] border border-cyan-500/30'
          : 'bg-white border border-slate-200'
      } ${className}`}
      style={{
        boxShadow: isDark
          ? '0 25px 60px -15px rgba(0, 163, 255, 0.25), 0 0 0 1px rgba(0, 229, 255, 0.15)'
          : '0 25px 60px -15px rgba(0, 0, 0, 0.3), 0 4px 12px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Acrylic Edge / Cut Guidelines if enabled */}
      {showCutGuides && (
        <div className="absolute inset-1.5 border border-dashed border-red-400 pointer-events-none z-30 opacity-70">
          <span className="absolute top-1 left-2 text-[9px] font-mono text-red-500 bg-white/90 px-1 rounded">
            Linha de Corte (Sangria 3mm)
          </span>
        </div>
      )}

      {/* TOP SECTION: Google Blue (Classic) or Dark Cyber (Wiz Dark) */}
      <div
        className={`relative w-full h-[48%] flex flex-col items-center justify-start pt-5 sm:pt-6 px-4 text-center ${
          isDark
            ? 'bg-gradient-to-b from-[#0F172A] via-[#0A0F1D] to-[#06080F]'
            : 'bg-gradient-to-b from-[#0057E7] to-[#0051DA]'
        }`}
      >
        {/* Subtle acrylic light flare */}
        <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />

        {/* 5 Golden Stars */}
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 z-10">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              viewBox="0 0 24 24"
              className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 fill-[#FBBC04] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] filter"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>

        {/* Headline text */}
        <div className="z-10 flex flex-col justify-center">
          <p className="text-white font-extrabold text-[13px] sm:text-base md:text-lg lg:text-xl tracking-tight leading-tight uppercase font-heading drop-shadow-sm">
            {line1}
          </p>
          {line2 && (
            <p className="text-white font-extrabold text-[13px] sm:text-base md:text-lg lg:text-xl tracking-tight leading-tight uppercase font-heading drop-shadow-sm">
              {line2}
            </p>
          )}
          {businessName && businessName !== 'Sua Loja / Empresa' && (
            <p className="text-blue-100/90 text-[10px] sm:text-xs font-semibold mt-1 max-w-[85%] truncate mx-auto tracking-wide">
              {businessName}
            </p>
          )}
        </div>

        {/* Google 4-Color Divider Bar at bottom of top section */}
        <div className="absolute bottom-0 inset-x-0 h-2.5 sm:h-3 flex z-10 shadow-sm">
          <div className="w-1/4 h-full bg-[#EA4335]" /> {/* Google Red */}
          <div className="w-1/4 h-full bg-[#FBBC05]" /> {/* Google Yellow */}
          <div className="w-1/4 h-full bg-[#34A853]" /> {/* Google Green */}
          <div className="w-1/4 h-full bg-[#4285F4]" /> {/* Google Blue */}
        </div>
      </div>

      {/* CENTER FLOATING GOOGLE 'G' EMBLEM (Cuts across dividing line) */}
      <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div
          className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full p-2.5 sm:p-3 flex items-center justify-center shadow-lg transition-transform ${
            isDark
              ? 'bg-[#0B101E] border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,163,255,0.4)]'
              : 'bg-white border-2 border-slate-100 shadow-md'
          }`}
        >
          {/* Authentic Google 'G' 4-color Vector */}
          <svg viewBox="0 0 48 48" className="w-full h-full">
            <path
              fill="#4285F4"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#34A853"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#EA4335"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
        </div>
      </div>

      {/* BOTTOM SECTION: White acrylic base with NFC + OR + QR Code */}
      <div
        className={`w-full h-[52%] pt-7 sm:pt-9 pb-3 px-4 sm:px-6 flex items-center justify-between ${
          isDark ? 'bg-[#060913] text-slate-100' : 'bg-white text-slate-900'
        }`}
      >
        {/* LEFT: NFC Phone & Hand Illustration */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <p
            className={`text-[10px] sm:text-xs md:text-sm font-extrabold mb-1 tracking-tight font-heading ${
              isDark ? 'text-cyan-300' : 'text-slate-900'
            }`}
          >
            Aproxime seu celular
          </p>

          {/* Authentic NFC Hand & Phone Graphic from Image 1 */}
          <svg
            viewBox="0 0 100 100"
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 fill-none"
            stroke={isDark ? '#00D4FF' : '#000000'}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* NFC Wave Arcs on Left */}
            <path d="M18 42 C14 47 14 53 18 58" strokeWidth="3" />
            <path d="M25 36 C19 45 19 55 25 64" strokeWidth="3.2" />
            <path d="M32 30 C24 43 24 57 32 70" strokeWidth="3.5" />

            {/* Smartphone body */}
            <rect x="42" y="24" width="28" height="46" rx="5" strokeWidth="3.5" />
            <circle cx="56" cy="30" r="1.5" fill={isDark ? '#00D4FF' : '#000000'} />
            
            {/* NFC Text inside phone screen */}
            <text
              x="56"
              y="49"
              textAnchor="middle"
              fontSize="9"
              fontWeight="900"
              fill={isDark ? '#00D4FF' : '#000000'}
              stroke="none"
              fontFamily="sans-serif"
            >
              NFC
            </text>

            {/* Hand fingers gripping the phone */}
            <path d="M42 42 C38 42 38 47 42 47" />
            <path d="M42 49 C38 49 38 54 42 54" />
            <path d="M42 56 C38 56 38 61 42 61" />
            <path d="M42 63 C38 63 38 68 42 68" />
            
            {/* Hand wrist curve */}
            <path d="M70 56 L77 64 C80 68 78 76 74 80 L67 86" />
          </svg>
        </div>

        {/* CENTER DIVIDER: "OU" */}
        <div className="shrink-0 px-2 sm:px-3 text-center">
          <span
            className={`font-black text-xs sm:text-base md:text-lg font-heading tracking-wide ${
              isDark ? 'text-slate-400' : 'text-slate-900'
            }`}
          >
            OU
          </span>
        </div>

        {/* RIGHT: QR Code enclosed in corner brackets with Serial */}
        <div className="flex-1 flex flex-col items-center justify-center">
          {/* QR Code Container with Corner Brackets */}
          <div className="relative p-2 sm:p-2.5">
            {/* Corner brackets */}
            <div
              className={`absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 ${
                isDark ? 'border-cyan-400' : 'border-black'
              }`}
            />
            <div
              className={`absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 ${
                isDark ? 'border-cyan-400' : 'border-black'
              }`}
            />
            <div
              className={`absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 ${
                isDark ? 'border-cyan-400' : 'border-black'
              }`}
            />
            <div
              className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 ${
                isDark ? 'border-cyan-400' : 'border-black'
              }`}
            />

            {/* Dynamic QR Code Image */}
            <div className="w-18 h-18 sm:w-22 sm:h-22 md:w-26 md:h-26 bg-white rounded-sm overflow-hidden flex items-center justify-center">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR Code para ${businessName}`}
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 animate-pulse flex items-center justify-center text-[9px] text-slate-400">
                  Gerando...
                </div>
              )}
            </div>
          </div>

          {/* Serial Number */}
          <span
            className={`text-[9px] sm:text-[10px] md:text-xs font-mono font-bold tracking-widest mt-1 ${
              isDark ? 'text-cyan-400' : 'text-slate-800'
            }`}
          >
            {serialNumber}
          </span>
        </div>
      </div>
    </div>
  );
};
