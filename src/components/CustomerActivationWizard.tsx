import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  CheckCircle,
  HelpCircle,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Zap,
  Smartphone,
  Check,
  RefreshCw,
} from 'lucide-react';
import { Interactive3DPlate } from './Interactive3DPlate';
import { GoogleLinkGuideModal } from './GoogleLinkGuideModal';
import { savePlateOrder } from '../utils/plateStorage';
import { PlateOrder } from '../types/plate';

interface CustomerActivationWizardProps {
  initialSerial?: string;
  onOrderSaved?: (savedOrder: PlateOrder) => void;
  onGoToStudio?: () => void;
}

export const CustomerActivationWizard: React.FC<CustomerActivationWizardProps> = ({
  initialSerial = '000001',
  onOrderSaved,
  onGoToStudio,
}) => {
  const [serialNumber, setSerialNumber] = useState(initialSerial);
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('');
  const [googleReviewUrl, setGoogleReviewUrl] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [topCustomText, setTopCustomText] = useState('NÓS ADORARÍAMOS A SUA AVALIAÇÃO NO GOOGLE');
  const [styleVariant, setStyleVariant] = useState<'google_classic' | 'wiz_dark'>('google_classic');

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Trigger celebration confetti
  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#00A3FF', '#FBBC04', '#EA4335', '#34A853', '#FFFFFF'],
      });
    } catch {
      // Fallback if canvas-confetti has environment limitations
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !googleReviewUrl) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const saved = savePlateOrder({
        serialNumber: serialNumber || '000001',
        businessName,
        category: category || 'Comércio Local',
        googleReviewUrl,
        phoneWhatsapp: phoneWhatsapp || '',
        topCustomText: topCustomText || 'NÓS ADORARÍAMOS A SUA AVALIAÇÃO NO GOOGLE',
        status: 'active',
        style: styleVariant,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
      triggerCelebration();

      if (onOrderSaved) {
        onOrderSaved(saved);
      }
    }, 600);
  };

  // Generate WhatsApp message for Wiz Connect
  const buildWhatsappUrl = () => {
    const text = encodeURIComponent(
      `🎉 Olá Wiz Connect! Acabei de registrar minha Plaquinha Google NFC & QR Code!\n\n` +
      `📦 *Série da Placa:* ${serialNumber}\n` +
      `🏢 *Empresa:* ${businessName}\n` +
      `⭐ *Link de Avaliação Google:* ${googleReviewUrl}\n` +
      `📱 *WhatsApp do Dono:* ${phoneWhatsapp}\n` +
      `🎨 *Texto Superior:* ${topCustomText}\n\n` +
      `Por favor, confirmem o recebimento para a produção do material gráfico!`
    );
    return `https://wa.me/5511999999999?text=${text}`;
  };

  return (
    <div className="relative w-full max-w-6xl mx-auto px-4 py-8">
      {/* Google Link Instruction Modal */}
      <GoogleLinkGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onSelectSampleLink={(url) => setGoogleReviewUrl(url)}
      />

      {/* TOP CELEBRATORY HERO BANNER */}
      <div className="relative mb-10 text-center overflow-hidden rounded-3xl p-6 sm:p-10 border border-cyan-500/25 bg-gradient-to-b from-[#0E1628] via-[#0A0E1A] to-[#07090E] shadow-[0_10px_40px_rgba(0,163,255,0.12)]">
        {/* Glow backdrop circles */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00A3FF]/15 blur-[90px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 -right-20 w-60 h-60 bg-[#34A853]/10 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Subtle Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] animate-spin" />
            <span>Plaquinha Inteligente NFC & QR Code Dinâmico</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-heading tracking-tight leading-[1.1] mb-4">
            Parabéns pela sua nova{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] via-[#00A3FF] to-[#0055FF]">
              Placa Google
            </span>
            !
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Seu cliente aproxima o celular via <strong className="text-white font-bold">NFC</strong> ou escaneia o <strong className="text-white font-bold">QR Code</strong> e cai direto na página de 5 estrelas do seu negócio.
          </p>

          {/* Quick Features Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-left">
            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <Zap className="w-4 h-4 text-[#00E5FF] shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white">Chip NFC NTAG</p>
                <p className="text-slate-400 text-[10px]">Aproximou, abriu em 1s</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white">QR Code Dinâmico</p>
                <p className="text-slate-400 text-[10px]">Pode mudar link depois</p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/40 border border-slate-800/60">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-xs">
                <p className="font-bold text-white">Acrílico Premium</p>
                <p className="text-slate-400 text-[10px]">Corte a laser & alta durabilidade</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SUCCESS SCREEN WHEN FORM SUBMITTED */}
      {isSubmitted ? (
        <div className="relative rounded-3xl p-8 sm:p-12 border border-emerald-500/30 bg-[#0A121A] text-center max-w-2xl mx-auto shadow-2xl animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-6 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
            <CheckCircle className="w-10 h-10" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading mb-2">
            Placa Registrada com Sucesso!
          </h2>

          <p className="text-slate-300 text-sm sm:text-base mb-6">
            A plaquinha de série <span className="font-mono font-bold text-cyan-300">#{serialNumber}</span> foi vinculada com sucesso à empresa <strong className="text-white font-bold">{businessName}</strong>.
          </p>

          {/* Plate Snapshot */}
          <div className="my-6 max-w-[280px] mx-auto">
            <Interactive3DPlate
              serialNumber={serialNumber}
              businessName={businessName}
              googleReviewUrl={googleReviewUrl}
              topCustomText={topCustomText}
              styleVariant={styleVariant}
            />
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
            <a
              href={buildWhatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-lg hover:brightness-110 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Enviar dados via WhatsApp da Wiz Connect</span>
            </a>

            <button
              onClick={() => {
                setIsSubmitted(false);
                setBusinessName('');
                setGoogleReviewUrl('');
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Cadastrar Outra Plaquinha</span>
            </button>
          </div>

          {onGoToStudio && (
            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400 mb-2">Você é da equipe da Wiz Connect?</p>
              <button
                onClick={onGoToStudio}
                className="text-xs font-bold text-[#00A3FF] hover:underline"
              >
                Abrir Estúdio Gráfico para Baixar Arte e Imprimir Placa →
              </button>
            </div>
          )}
        </div>
      ) : (
        /* MAIN FORM & REAL-TIME PREVIEW GRID */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: REGISTRATION FORM */}
          <div className="lg:col-span-7 bg-[#0B101D] border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center justify-between pb-5 border-b border-slate-800 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white font-heading">
                  Configure sua Plaquinha
                </h2>
                <p className="text-xs text-slate-400">
                  Preencha os dados para ativarmos o seu link de avaliações no NFC e QR Code
                </p>
              </div>

              {/* Serial Badge */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300">
                <span>SÉRIE:</span>
                <span className="font-bold">{serialNumber}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Field: Business Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Nome da sua Empresa / Loja <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Ex: Barbearia Estilo Nobre, Pizzaria Bella..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#00A3FF] focus:ring-1 focus:ring-[#00A3FF] transition-all text-sm"
                />
              </div>

              {/* Field: Category & Phone WhatsApp */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Ramo / Segmento
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Ex: Restaurante, Estética, Oficina..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#00A3FF] text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    WhatsApp para Contato <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={phoneWhatsapp}
                    onChange={(e) => setPhoneWhatsapp(e.target.value)}
                    placeholder="(11) 98765-4321"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#00A3FF] text-sm"
                  />
                </div>
              </div>

              {/* Field: Google Review Link */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                    Link de Avaliação do Google <span className="text-red-400">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsGuideOpen(true)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#00A3FF] hover:underline"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Como pegar meu link?</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={googleReviewUrl}
                    onChange={(e) => setGoogleReviewUrl(e.target.value)}
                    placeholder="https://g.page/r/.../review ou link do Google Meu Negócio"
                    className="w-full pl-4 pr-24 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#00A3FF] text-sm font-mono"
                  />
                  {googleReviewUrl && (
                    <a
                      href={googleReviewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-2 top-2 bottom-2 px-3 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-[#00E5FF] text-xs font-semibold flex items-center gap-1 transition-colors"
                    >
                      <span>Testar</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  É este link que o QR Code e o chip NFC vão abrir no celular do seu cliente.
                </p>
              </div>

              {/* Field: Top text customization */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Frase de Cabeçalho da Plaquinha
                </label>
                <input
                  type="text"
                  value={topCustomText}
                  onChange={(e) => setTopCustomText(e.target.value)}
                  placeholder="NÓS ADORARÍAMOS A SUA AVALIAÇÃO NO GOOGLE"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 focus:outline-none focus:border-[#00A3FF] text-sm"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setTopCustomText('NÓS ADORARÍAMOS A SUA AVALIAÇÃO NO GOOGLE')}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    Clássico Google
                  </button>
                  <button
                    type="button"
                    onClick={() => setTopCustomText('AVALIE NOSSO ATENDIMENTO NO GOOGLE')}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    Avalie nosso Atendimento
                  </button>
                  <button
                    type="button"
                    onClick={() => setTopCustomText('SUA OPINIÃO É MUITO IMPORTANTE')}
                    className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                  >
                    Sua Opinião Importa
                  </button>
                </div>
              </div>

              {/* Field: Plate Theme Style */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Estilo Visual da Plaquinha
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setStyleVariant('google_classic')}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      styleVariant === 'google_classic'
                        ? 'border-[#00A3FF] bg-[#00A3FF]/10 text-white'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">Google Clássico</p>
                      <p className="text-[10px] text-slate-400">Azul Real + Arco-íris</p>
                    </div>
                    {styleVariant === 'google_classic' && (
                      <Check className="w-4 h-4 text-[#00E5FF]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setStyleVariant('wiz_dark')}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      styleVariant === 'wiz_dark'
                        ? 'border-cyan-400 bg-cyan-950/30 text-white'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold">Wiz Dark Premium</p>
                      <p className="text-[10px] text-slate-400">Cyber Black & Neon</p>
                    </div>
                    {styleVariant === 'wiz_dark' && (
                      <Check className="w-4 h-4 text-[#00E5FF]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl font-heading font-extrabold text-white text-base tracking-wide bg-gradient-to-r from-[#00A3FF] via-[#0088FF] to-[#0055FF] hover:brightness-110 shadow-[0_0_30px_rgba(0,163,255,0.4)] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Salvando dados e ativando...</span>
                  ) : (
                    <>
                      <span>Salvar e Ativar Minha Plaquinha</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-slate-400 mt-2">
                  Você poderá enviar a confirmação direto para a produção da Wiz Connect no WhatsApp.
                </p>
              </div>
            </form>
          </div>

          {/* RIGHT COLUMN: LIVE REAL-TIME 3D PREVIEW */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full bg-[#0B101D] border border-slate-800/80 rounded-3xl p-6 shadow-xl sticky top-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/60 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Pré-Visualização ao Vivo
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/30">Acrílico 12x12cm</span>
              </div>

              {/* The 3D Plate Component */}
              <Interactive3DPlate
                serialNumber={serialNumber || '000001'}
                businessName={businessName || 'Sua Loja / Empresa'}
                googleReviewUrl={googleReviewUrl || 'https://g.page/r/wizconnect/review'}
                topCustomText={topCustomText || 'NÓS ADORARÍAMOS A SUA AVALIAÇÃO NO GOOGLE'}
                styleVariant={styleVariant}
              />

              <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
                <p className="font-semibold text-slate-300">
                  {businessName || 'Nome da sua Loja'}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                  {googleReviewUrl ? `Destino: ${googleReviewUrl}` : 'Insira o link para testar o QR Code'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
