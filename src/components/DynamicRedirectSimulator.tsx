import React, { useState } from 'react';
import { Smartphone, Zap, ExternalLink, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { PlateOrder } from '../types/plate';

interface DynamicRedirectSimulatorProps {
  plate: PlateOrder;
}

export const DynamicRedirectSimulator: React.FC<DynamicRedirectSimulatorProps> = ({ plate }) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [step, setStep] = useState<'idle' | 'scanning' | 'redirected'>('idle');

  const handleSimulateTap = () => {
    setIsSimulating(true);
    setStep('scanning');

    setTimeout(() => {
      setStep('redirected');
    }, 1200);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setStep('idle');
  };

  return (
    <div className="bg-[#0B101D] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <h3 className="text-lg sm:text-xl font-bold text-white font-heading">
              Simulador de Experiência do Cliente Final
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Veja exatamente o que acontece quando o cliente do seu cliente aproxima o smartphone da plaquinha na mesa.
          </p>
        </div>

        <button
          onClick={handleSimulateTap}
          disabled={isSimulating && step !== 'redirected'}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs tracking-wide shadow-md flex items-center justify-center gap-2 transition-all"
        >
          <Zap className="w-4 h-4 text-emerald-300" />
          <span>Simular Toque NFC / Leitura QR</span>
        </button>
      </div>

      <div className="mt-8 flex flex-col md:flex-row items-center justify-center gap-8">
        {/* Smartphone Mockup */}
        <div className="relative w-64 h-[440px] bg-[#000000] rounded-[44px] p-3 border-4 border-slate-700 shadow-2xl flex flex-col overflow-hidden">
          {/* Speaker notch */}
          <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-3 shrink-0" />

          {/* Screen Content */}
          <div className="flex-1 rounded-[32px] bg-slate-950 p-4 flex flex-col justify-between text-center overflow-hidden border border-slate-900">
            {step === 'idle' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#00A3FF]">
                  <Smartphone className="w-8 h-8 animate-bounce" />
                </div>
                <p className="text-xs font-bold text-white font-heading">Aproxime da Plaquinha</p>
                <p className="text-[10px] text-slate-400 px-2">
                  O celular lerá o chip NFC NTAG automaticamente sem precisar de app instalado.
                </p>
              </div>
            )}

            {step === 'scanning' && (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-[#00A3FF] border-t-transparent animate-spin" />
                  <Zap className="w-6 h-6 text-[#00E5FF] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                </div>
                <p className="text-xs font-bold text-cyan-300">Conectando ao Google...</p>
                <p className="text-[10px] text-slate-400">Placa Série #{plate.serialNumber}</p>
              </div>
            )}

            {step === 'redirected' && (
              <div className="flex-1 flex flex-col items-center justify-center animate-fade-in space-y-3">
                {/* Google Stars Rating Popup */}
                <div className="w-12 h-12 rounded-full bg-white p-2 flex items-center justify-center shadow-lg">
                  <svg viewBox="0 0 48 48" className="w-full h-full">
                    <path fill="#4285F4" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#34A853" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#EA4335" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                </div>

                <div className="text-left w-full bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <p className="text-[11px] font-bold text-white truncate">{plate.businessName}</p>
                  <p className="text-[9px] text-slate-400">Avaliações do Google</p>
                  
                  {/* 5 Interactive Stars */}
                  <div className="flex items-center gap-1 my-1.5 justify-center">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[9px] text-emerald-400 text-center font-semibold">
                    ✓ Avaliação de 5 Estrelas Selecionada!
                  </p>
                </div>

                <a
                  href={plate.googleReviewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center justify-center gap-1 shadow"
                >
                  <span>Abrir no Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={handleReset}
                  className="text-[10px] text-slate-400 hover:text-white"
                >
                  Reiniciar Simulação
                </button>
              </div>
            )}

            {/* Bottom Home indicator */}
            <div className="w-24 h-1 bg-slate-700 rounded-full mx-auto shrink-0 mt-2" />
          </div>
        </div>

        {/* Explanation text on the right */}
        <div className="max-w-md space-y-4 text-sm text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-bold text-white mb-1 flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#00E5FF]" />
              Sem aplicativos adicionais
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tanto em iPhones quanto em aparelhos Android modernos, o NFC é nativo. Ao encostar, surge uma notificação imediata do Google Maps ou navegador para avaliar em 5 estrelas.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
            <h4 className="font-bold text-white mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              QR Code Dinâmico à prova de mudanças
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              O cliente final também tem a opção visual de apontar a câmera para o QR Code da plaquinha caso o celular seja antigo ou não tenha NFC ativado.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
