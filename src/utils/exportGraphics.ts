import QRCode from 'qrcode';

export interface ExportPlateOptions {
  serialNumber: string;
  businessName: string;
  googleReviewUrl: string;
  topCustomText: string;
  styleVariant?: 'google_classic' | 'wiz_dark' | 'clean_white';
  showCutGuides?: boolean;
}

/**
 * Renders a 300 DPI high-definition plate onto an HTML5 Canvas and exports as PNG data URL or Blob
 */
export const renderPlateToCanvas = async (
  options: ExportPlateOptions,
  canvasSize: number = 2400 // 2400x2400 = 300 DPI+ ultra-resolução para plaquinha 12x12cm
): Promise<HTMLCanvasElement> => {
  const canvas = document.createElement('canvas');
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  const {
    serialNumber,
    businessName,
    googleReviewUrl,
    topCustomText,
    styleVariant = 'google_classic',
    showCutGuides = false,
  } = options;

  const isDark = styleVariant === 'wiz_dark';

  // 1. Draw rounded acrylic base background
  const cornerRadius = canvasSize * 0.08; // smooth corner
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, canvasSize, canvasSize, cornerRadius);
  ctx.clip();

  // Bottom half background
  ctx.fillStyle = isDark ? '#060913' : '#FFFFFF';
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // Top half background (48% height)
  const topHeight = canvasSize * 0.48;
  const topGrad = ctx.createLinearGradient(0, 0, 0, topHeight);
  if (isDark) {
    topGrad.addColorStop(0, '#0F172A');
    topGrad.addColorStop(0.5, '#0A0F1D');
    topGrad.addColorStop(1, '#06080F');
  } else {
    topGrad.addColorStop(0, '#0057E7');
    topGrad.addColorStop(1, '#0051DA');
  }
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, canvasSize, topHeight);

  // 2. Draw 5 golden stars
  const starCount = 5;
  const starSize = canvasSize * 0.045;
  const starSpacing = canvasSize * 0.065;
  const startX = canvasSize / 2 - (starSpacing * (starCount - 1)) / 2;
  const starY = canvasSize * 0.12;

  ctx.fillStyle = '#FBBC04';
  for (let i = 0; i < starCount; i++) {
    drawStar(ctx, startX + i * starSpacing, starY, 5, starSize, starSize * 0.45);
  }

  // 3. Draw Top Text
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = `800 ${canvasSize * 0.044}px 'Outfit', 'Montserrat', sans-serif`;

  const words = (topCustomText || 'NÓS ADORARÍAMOS A SUA AVALIAÇÃO NO GOOGLE').trim().split(' ');
  let line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
  let line2 = words.slice(Math.ceil(words.length / 2)).join(' ');
  if (!line2) {
    line1 = topCustomText;
    line2 = '';
  }

  ctx.fillText(line1.toUpperCase(), canvasSize / 2, canvasSize * 0.22);
  if (line2) {
    ctx.fillText(line2.toUpperCase(), canvasSize / 2, canvasSize * 0.28);
  }

  // Business Name secondary text
  if (businessName && businessName !== 'Sua Loja / Empresa') {
    ctx.font = `600 ${canvasSize * 0.024}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText(businessName, canvasSize / 2, canvasSize * 0.34);
  }

  // 4. Draw Google 4-Color Divider Bar at bottom of top section
  const barHeight = canvasSize * 0.022;
  const barY = topHeight - barHeight;
  const segWidth = canvasSize / 4;

  ctx.fillStyle = '#EA4335'; // Red
  ctx.fillRect(0, barY, segWidth, barHeight);
  ctx.fillStyle = '#FBBC05'; // Yellow
  ctx.fillRect(segWidth, barY, segWidth, barHeight);
  ctx.fillStyle = '#34A853'; // Green
  ctx.fillRect(segWidth * 2, barY, segWidth, barHeight);
  ctx.fillStyle = '#4285F4'; // Blue
  ctx.fillRect(segWidth * 3, barY, segWidth, barHeight);

  // 5. Center Google 'G' Emblem
  const emblemRadius = canvasSize * 0.088;
  const emblemY = topHeight;

  ctx.save();
  ctx.beginPath();
  ctx.arc(canvasSize / 2, emblemY, emblemRadius, 0, Math.PI * 2);
  ctx.fillStyle = isDark ? '#0B101E' : '#FFFFFF';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
  ctx.shadowBlur = canvasSize * 0.03;
  ctx.shadowOffsetY = canvasSize * 0.005;
  ctx.fill();
  ctx.restore();

  // Draw Google 'G' inside circle
  drawGoogleGIcon(ctx, canvasSize / 2, emblemY, emblemRadius * 0.65);

  // 6. Draw "Aproxime seu celular" + NFC Hand graphic on Left Bottom
  const bottomCenterY = topHeight + (canvasSize - topHeight) / 2;
  const leftX = canvasSize * 0.25;

  ctx.fillStyle = isDark ? '#00E5FF' : '#000000';
  ctx.textAlign = 'center';
  ctx.font = `800 ${canvasSize * 0.026}px 'Outfit', sans-serif`;
  ctx.fillText('Aproxime seu celular', leftX, bottomCenterY - canvasSize * 0.12);

  // Draw NFC Hand & Phone graphic
  drawNfcPhoneIllustration(ctx, leftX, bottomCenterY + canvasSize * 0.02, canvasSize * 0.2, isDark);

  // 7. Draw "OU" in center
  ctx.fillStyle = isDark ? '#94A3B8' : '#000000';
  ctx.font = `900 ${canvasSize * 0.04}px 'Outfit', sans-serif`;
  ctx.fillText('OU', canvasSize * 0.5, bottomCenterY);

  // 8. Generate & Draw QR Code on Right Bottom
  const rightX = canvasSize * 0.75;
  const qrSize = canvasSize * 0.24;

  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, googleReviewUrl || 'https://google.com', {
    width: qrSize,
    margin: 1,
    color: {
      dark: isDark ? '#00E5FF' : '#000000',
      light: isDark ? '#0A0F1D' : '#FFFFFF',
    },
    errorCorrectionLevel: 'H',
  });

  const qrX = rightX - qrSize / 2;
  const qrY = bottomCenterY - qrSize / 2 - canvasSize * 0.015;

  // Corner brackets around QR code
  const bracketPadding = canvasSize * 0.018;
  const bX = qrX - bracketPadding;
  const bY = qrY - bracketPadding;
  const bSize = qrSize + bracketPadding * 2;
  const bArm = canvasSize * 0.035;

  ctx.strokeStyle = isDark ? '#00E5FF' : '#000000';
  ctx.lineWidth = canvasSize * 0.007;
  ctx.lineCap = 'round';

  // Top Left
  ctx.beginPath();
  ctx.moveTo(bX, bY + bArm);
  ctx.lineTo(bX, bY);
  ctx.lineTo(bX + bArm, bY);
  ctx.stroke();

  // Top Right
  ctx.beginPath();
  ctx.moveTo(bX + bSize - bArm, bY);
  ctx.lineTo(bX + bSize, bY);
  ctx.lineTo(bX + bSize, bY + bArm);
  ctx.stroke();

  // Bottom Left
  ctx.beginPath();
  ctx.moveTo(bX, bY + bSize - bArm);
  ctx.lineTo(bX, bY + bSize);
  ctx.lineTo(bX + bArm, bY + bSize);
  ctx.stroke();

  // Bottom Right
  ctx.beginPath();
  ctx.moveTo(bX + bSize - bArm, bY + bSize);
  ctx.lineTo(bX + bSize, bY + bSize);
  ctx.lineTo(bX + bSize, bY + bSize - bArm);
  ctx.stroke();

  // Draw QR code image
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

  // Serial Number below QR Code
  ctx.fillStyle = isDark ? '#00E5FF' : '#1E293B';
  ctx.font = `700 ${canvasSize * 0.024}px 'JetBrains Mono', monospace`;
  ctx.fillText(serialNumber || '000001', rightX, bY + bSize + canvasSize * 0.035);

  // Optional: Cut guides (3mm bleed)
  if (showCutGuides) {
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = canvasSize * 0.003;
    ctx.setLineDash([canvasSize * 0.015, canvasSize * 0.01]);
    ctx.strokeRect(canvasSize * 0.02, canvasSize * 0.02, canvasSize * 0.96, canvasSize * 0.96);
  }

  ctx.restore();
  return canvas;
};

// Helper: Draw 5-pointed star
function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number,
  innerRadius: number
) {
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.fill();
}

// Helper: Draw Google 4-color 'G' icon on canvas
function drawGoogleGIcon(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number) {
  ctx.save();
  ctx.translate(cx - radius, cy - radius);
  const scale = (radius * 2) / 48;
  ctx.scale(scale, scale);

  const pBlue = new Path2D('M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z');
  const pGreen = new Path2D('M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z');
  const pYellow = new Path2D('M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z');
  const pRed = new Path2D('M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z');

  ctx.fillStyle = '#4285F4';
  ctx.fill(pBlue);
  ctx.fillStyle = '#34A853';
  ctx.fill(pGreen);
  ctx.fillStyle = '#FBBC05';
  ctx.fill(pYellow);
  ctx.fillStyle = '#EA4335';
  ctx.fill(pRed);

  ctx.restore();
}

// Helper: Draw NFC Phone illustration on canvas
function drawNfcPhoneIllustration(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  isDark: boolean
) {
  ctx.save();
  ctx.translate(cx - size / 2, cy - size / 2);
  const scale = size / 100;
  ctx.scale(scale, scale);

  ctx.strokeStyle = isDark ? '#00E5FF' : '#000000';
  ctx.lineWidth = 3.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // NFC Waves
  ctx.beginPath();
  ctx.arc(42, 50, 24, Math.PI * 0.7, Math.PI * 1.3);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(42, 50, 32, Math.PI * 0.75, Math.PI * 1.25);
  ctx.stroke();

  // Smartphone body
  ctx.strokeRect(42, 24, 28, 46);

  // Speaker / Camera dot
  ctx.beginPath();
  ctx.arc(56, 30, 1.5, 0, Math.PI * 2);
  ctx.fillStyle = isDark ? '#00E5FF' : '#000000';
  ctx.fill();

  // NFC text
  ctx.font = '900 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillStyle = isDark ? '#00E5FF' : '#000000';
  ctx.fillText('NFC', 56, 49);

  // Hand fingers and grip
  ctx.beginPath();
  ctx.arc(42, 44.5, 2.5, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(42, 51.5, 2.5, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(42, 58.5, 2.5, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(42, 65.5, 2.5, Math.PI * 0.5, Math.PI * 1.5);
  ctx.stroke();

  // Hand wrist
  ctx.beginPath();
  ctx.moveTo(70, 56);
  ctx.lineTo(77, 64);
  ctx.quadraticCurveTo(80, 74, 67, 86);
  ctx.stroke();

  ctx.restore();
}

/**
 * Triggers browser download of the high-res PNG
 */
export const downloadPlatePng = async (
  options: ExportPlateOptions,
  filename?: string
): Promise<void> => {
  const canvas = await renderPlateToCanvas(options, 2400); // 300 DPI high-res
  const link = document.createElement('a');
  link.download = filename || `Placa_Google_12x12cm_WizConnect_${options.serialNumber || '000001'}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generates an SVG string representation of the plate, suitable for vector printing or Canva upload
 */
export const generatePlateSvgString = async (options: ExportPlateOptions): Promise<string> => {
  const {
    serialNumber,
    businessName,
    googleReviewUrl,
    topCustomText,
    styleVariant = 'google_classic',
  } = options;

  const isDark = styleVariant === 'wiz_dark';
  const qrDataUrl = await QRCode.toDataURL(googleReviewUrl || 'https://google.com', {
    margin: 1,
    width: 400,
    color: {
      dark: isDark ? '#00E5FF' : '#000000',
      light: isDark ? '#0A0F1D' : '#FFFFFF',
    },
  });

  const words = (topCustomText || 'NÓS ADORARÍAMOS A SUA AVALIAÇÃO NO GOOGLE').trim().split(' ');
  const mid = Math.ceil(words.length / 2);
  const line1 = words.slice(0, mid).join(' ');
  const line2 = words.slice(mid).join(' ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="1200" viewBox="0 0 1200 1200" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="acrylicBase">
      <rect width="1200" height="1200" rx="96" />
    </clipPath>
    <linearGradient id="topBlueGrad" x1="0" y1="0" x2="0" y2="576" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${isDark ? '#0F172A' : '#0057E7'}"/>
      <stop offset="1" stop-color="${isDark ? '#06080F' : '#0051DA'}"/>
    </linearGradient>
  </defs>

  <g clip-path="url(#acrylicBase)">
    <!-- Base -->
    <rect width="1200" height="1200" fill="${isDark ? '#060913' : '#FFFFFF'}"/>
    
    <!-- Top Area -->
    <rect width="1200" height="576" fill="url(#topBlueGrad)"/>

    <!-- Stars -->
    <g fill="#FBBC04">
      ${[0, 1, 2, 3, 4]
        .map(
          i =>
            `<polygon points="${420 + i * 90},140 ${427 + i * 90},162 ${450 + i * 90},162 ${432 + i * 90},176 ${438 + i * 90},198 ${420 + i * 90},184 ${402 + i * 90},198 ${408 + i * 90},176 ${390 + i * 90},162 ${413 + i * 90},162"/>`
        )
        .join('\n      ')}
    </g>

    <!-- Top Text -->
    <text x="600" y="270" text-anchor="middle" font-family="'Outfit', sans-serif" font-weight="800" font-size="52" fill="#FFFFFF" letter-spacing="1">${line1.toUpperCase()}</text>
    ${
      line2
        ? `<text x="600" y="340" text-anchor="middle" font-family="'Outfit', sans-serif" font-weight="800" font-size="52" fill="#FFFFFF" letter-spacing="1">${line2.toUpperCase()}</text>`
        : ''
    }
    ${
      businessName
        ? `<text x="600" y="415" text-anchor="middle" font-family="'Plus Jakarta Sans', sans-serif" font-weight="600" font-size="28" fill="rgba(255,255,255,0.85)">${businessName}</text>`
        : ''
    }

    <!-- 4-Color Google Bar -->
    <rect x="0" y="552" width="300" height="24" fill="#EA4335"/>
    <rect x="300" y="552" width="300" height="24" fill="#FBBC05"/>
    <rect x="600" y="552" width="300" height="24" fill="#34A853"/>
    <rect x="900" y="552" width="300" height="24" fill="#4285F4"/>

    <!-- Google G Circle Center -->
    <circle cx="600" cy="576" r="105" fill="${isDark ? '#0B101E' : '#FFFFFF'}" stroke="${isDark ? '#00D4FF' : '#F1F5F9'}" stroke-width="4"/>
    <g transform="translate(540, 516) scale(2.5)">
      <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </g>

    <!-- Bottom Left: NFC -->
    <text x="300" y="740" text-anchor="middle" font-family="'Outfit', sans-serif" font-weight="800" font-size="32" fill="${isDark ? '#00D4FF' : '#000000'}">Aproxime seu celular</text>

    <!-- Bottom Center: OU -->
    <text x="600" y="900" text-anchor="middle" font-family="'Outfit', sans-serif" font-weight="900" font-size="48" fill="${isDark ? '#94A3B8' : '#000000'}">OU</text>

    <!-- Bottom Right: QR Code image and brackets -->
    <image href="${qrDataUrl}" x="760" y="740" width="280" height="280"/>
    <path d="M740 780 V720 H800" stroke="${isDark ? '#00E5FF' : '#000000'}" stroke-width="8" stroke-linecap="round"/>
    <path d="M1000 720 H1060 V780" stroke="${isDark ? '#00E5FF' : '#000000'}" stroke-width="8" stroke-linecap="round"/>
    <path d="M740 980 V1040 H800" stroke="${isDark ? '#00E5FF' : '#000000'}" stroke-width="8" stroke-linecap="round"/>
    <path d="M1000 1040 H1060 V980" stroke="${isDark ? '#00E5FF' : '#000000'}" stroke-width="8" stroke-linecap="round"/>

    <!-- Serial -->
    <text x="900" y="1090" text-anchor="middle" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="28" fill="${isDark ? '#00E5FF' : '#1E293B'}">${serialNumber}</text>
  </g>
</svg>`;
};

/**
 * Triggers SVG download
 */
export const downloadPlateSvg = async (options: ExportPlateOptions, filename?: string) => {
  const svgString = await generatePlateSvgString(options);
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = filename || `Placa_Google_12x12cm_Vetor_WizConnect_${options.serialNumber || '000001'}.svg`;
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Downloads isolated high-res QR code PNG
 */
export const downloadQrCodeOnly = async (url: string, serial: string) => {
  const dataUrl = await QRCode.toDataURL(url || 'https://google.com', {
    width: 1000,
    margin: 1,
    errorCorrectionLevel: 'H',
  });
  const link = document.createElement('a');
  link.download = `QRCode_Google_${serial}.png`;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
