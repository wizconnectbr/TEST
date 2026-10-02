import React from 'react';
import { X, ExternalLink, CheckCircle2, Search, Share2, Copy } from 'lucide-react';

interface GoogleLinkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSampleLink?: (url: string) => void;
}

export const GoogleLinkGuideModal: React.FC<GoogleLinkGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectSampleLink,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#0D121F] border border-cyan-500/30 rounded-2xl p-6 sm:p-8 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold font-heading">
              Como pegar o link de avaliação da sua loja
            </h3>
            <p className="text-xs text-slate-400">
              Leva apenas 15 segundos direto no Google Maps ou Google Meu Negócio
            </p>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3.5 items-start">
            <span className="shrink-0 w-7 h-7 rounded-full bg-blue-500/20 text-[#00A3FF] font-bold text-xs flex items-center justify-center border border-blue-500/30">
              1
            </span>
            <div className="text-sm">
              <p className="font-semibold text-slate-200">Pesquise sua empresa no Google</p>
              <p className="text-slate-400 text-xs mt-0.5">
                Abra o app do Google Maps ou google.com.br e digite o nome exato da sua loja.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3.5 items-start">
            <span className="shrink-0 w-7 h-7 rounded-full bg-blue-500/20 text-[#00A3FF] font-bold text-xs flex items-center justify-center border border-blue-500/30">
              2
            </span>
            <div className="text-sm">
              <p className="font-semibold text-slate-200">Clique em "Solicitar avaliações"</p>
              <p className="text-slate-400 text-xs mt-0.5">
                No painel do seu perfil de empresa, procure pelo botão com ícone de estrela chamado <strong className="text-white">"Solicitar avaliações"</strong> ou <strong className="text-white">"Pedir avaliação"</strong>.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex gap-3.5 items-start">
            <span className="shrink-0 w-7 h-7 rounded-full bg-blue-500/20 text-[#00A3FF] font-bold text-xs flex items-center justify-center border border-blue-500/30">
              3
            </span>
            <div className="text-sm">
              <p className="font-semibold text-slate-200">Copie o link curto gerado</p>
              <p className="text-slate-400 text-xs mt-0.5">
                O Google exibirá um link curto no formato <code className="text-[#00E5FF] bg-black/40 px-1 py-0.5 rounded">https://g.page/r/.../review</code>. Basta copiar e colar aqui!
              </p>
            </div>
          </div>
        </div>

        {/* Pro Tip Box */}
        <div className="mt-5 p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200 text-xs flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            <strong>Vantagem do QR Code Dinâmico Wiz Connect:</strong> Se no futuro sua empresa mudar de endereço ou trocar de conta Google, a sua plaquinha acrílica continua funcionando! Basta atualizar o link no painel.
          </p>
        </div>

        {/* Quick test buttons */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <a
            href="https://business.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white transition-colors"
          >
            <span>Abrir Google Meu Negócio</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          {onSelectSampleLink && (
            <button
              onClick={() => {
                onSelectSampleLink('https://g.page/r/CWizConnectDemo/review');
                onClose();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:bg-blue-600/50 text-xs font-semibold transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Usar Link de Demonstração</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
