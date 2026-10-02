import React, { useState, useEffect } from 'react';
import {
  Download,
  Printer,
  Sparkles,
  Layers,
  Copy,
  Check,
  Plus,
  RefreshCw,
  QrCode,
  FileCode,
  Search,
  ExternalLink,
  Sliders,
  Eye,
  CheckCircle2,
  Share2,
} from 'lucide-react';
import { PlateOrder } from '../types/plate';
import { getStoredPlates, savePlateOrder, generateNextSerial } from '../utils/plateStorage';
import {
  downloadPlatePng,
  downloadPlateSvg,
  downloadQrCodeOnly,
  generatePlateSvgString,
} from '../utils/exportGraphics';
import { GooglePlateGraphic } from './GooglePlateGraphic';

interface WizConnectStudioProps {
  onBackToCustomerView?: () => void;
}

export const WizConnectStudio: React.FC<WizConnectStudioProps> = ({
  onBackToCustomerView,
}) => {
  const [plates, setPlates] = useState<PlateOrder[]>([]);
  const [selectedPlate, setSelectedPlate] = useState<PlateOrder | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCutGuides, setShowCutGuides] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessMsg, setExportSuccessMsg] = useState('');

  // Form states for live customization
  const [editSerial, setEditSerial] = useState('000001');
  const [editBusiness, setEditBusiness] = useState('Barbearia & Lounge Dom Juan');
  const [editUrl, setEditUrl] = useState('https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4');
  const [editTopText, setEditTopText] = useState('NÓS ADORARÍAMOS A SUA AVALIAÇÃO NO GOOGLE');
  const [editStyle, setEditStyle] = useState<'google_classic' | 'wiz_dark'>('google_classic');

  // Load plates from localStorage
  const refreshPlates = () => {
    const list = getStoredPlates();
    setPlates(list);
    if (!selectedPlate && list.length > 0) {
      loadPlateIntoEditor(list[0]);
    }
  };

  useEffect(() => {
    refreshPlates();
  }, []);

  const loadPlateIntoEditor = (plate: PlateOrder) => {
    setSelectedPlate(plate);
    setEditSerial(plate.serialNumber);
    setEditBusiness(plate.businessName);
    setEditUrl(plate.googleReviewUrl);
    setEditTopText(plate.topCustomText || 'NÓS ADORARÍAMOS A SUA AVALIAÇÃO NO GOOGLE');
    setEditStyle(plate.style === 'wiz_dark' ? 'wiz_dark' : 'google_classic');
  };

  const handleCreateNewPlate = () => {
    const nextSerial = generateNextSerial();
    const newPlate: PlateOrder = {
      id: `plate-${nextSerial}`,
      serialNumber: nextSerial,
      businessName: 'Nova Loja Cliente',
      category: 'Geral',
      googleReviewUrl: 'https://g.page/r/wizconnect/review',
      phoneWhatsapp: '',
      topCustomText: 'NÓS ADORARÍAMOS A SUA AVALIAÇÃO NO GOOGLE',
      status: 'pending_setup',
      style: 'google_classic',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    savePlateOrder(newPlate);
    refreshPlates();
    loadPlateIntoEditor(newPlate);
  };

  const handleSaveCurrentChanges = () => {
    const updated = savePlateOrder({
      serialNumber: editSerial,
      businessName: editBusiness,
      category: selectedPlate?.category || 'Comércio Local',
      googleReviewUrl: editUrl,
      phoneWhatsapp: selectedPlate?.phoneWhatsapp || '',
      topCustomText: editTopText,
      status: 'active',
      style: editStyle,
    });
    refreshPlates();
    setSelectedPlate(updated);
    setExportSuccessMsg('Alterações salvas com sucesso!');
    setTimeout(() => setExportSuccessMsg(''), 3000);
  };

  // Export handlers
  const handleDownloadPng = async () => {
    setIsExporting(true);
    try {
      await downloadPlatePng({
        serialNumber: editSerial,
        businessName: editBusiness,
        googleReviewUrl: editUrl,
        topCustomText: editTopText,
        styleVariant: editStyle,
        showCutGuides,
      });
      setExportSuccessMsg('PNG 300 DPI baixado com sucesso!');
      setTimeout(() => setExportSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadSvg = async () => {
    setIsExporting(true);
    try {
      await downloadPlateSvg({
        serialNumber: editSerial,
        businessName: editBusiness,
        googleReviewUrl: editUrl,
        topCustomText: editTopText,
        styleVariant: editStyle,
      });
      setExportSuccessMsg('Vetor SVG para Canva baixado!');
      setTimeout(() => setExportSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadQrOnly = async () => {
    await downloadQrCodeOnly(editUrl, editSerial);
    setExportSuccessMsg('QR Code isolado baixado em alta resolução!');
    setTimeout(() => setExportSuccessMsg(''), 4000);
  };

  const handleCopyCanvaWorkflow = () => {
    const text = `ARTE DA PLACA GOOGLE WIZ CONNECT - SÉRIE #${editSerial}\nEmpresa: ${editBusiness}\nLink Avaliação: ${editUrl}\n\nDica: Arraste o arquivo SVG ou PNG baixado diretamente para sua área de trabalho do Canva!`;
    navigator.clipboard.writeText(text);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const filteredPlates = plates.filter(
    (p) =>
      p.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.serialNumber.includes(searchTerm)
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              Estúdio Gráfico & Gerador Automatizado
            </h1>
          </div>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Gere a arte final das plaquinhas em segundos para impressão e substitua o trabalho manual no Canva.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onBackToCustomerView && (
            <button
              onClick={onBackToCustomerView}
              className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs font-semibold text-slate-300 transition-colors flex items-center gap-2"
            >
              <Eye className="w-4 h-4 text-[#00A3FF]" />
              <span>Ver Landing Page do Cliente</span>
            </button>
          )}

          <button
            onClick={handleCreateNewPlate}
            className="px-4 py-2 rounded-xl bg-[#00A3FF] hover:bg-[#0088FF] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Nova Placa</span>
          </button>
        </div>
      </div>

      {exportSuccessMsg && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-sm font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{exportSuccessMsg}</span>
        </div>
      )}

      {/* WORKSPACE 3-PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* PANEL 1: PLATES QUEUE / MANAGER (3 cols) */}
        <div className="lg:col-span-3 bg-[#0B101D] border border-slate-800 rounded-2xl p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-heading">
              Fila de Placas ({plates.length})
            </span>
            <button
              onClick={refreshPlates}
              title="Atualizar lista"
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative mb-3">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por nome ou série..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00A3FF]"
            />
          </div>

          {/* List of plate cards */}
          <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
            {filteredPlates.map((plate) => {
              const isSelected = selectedPlate?.serialNumber === plate.serialNumber;
              return (
                <div
                  key={plate.id}
                  onClick={() => loadPlateIntoEditor(plate)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-blue-950/30 border-[#00A3FF] text-white shadow-md'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono font-bold text-[#00E5FF]">
                      #{plate.serialNumber}
                    </span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-semibold ${
                        plate.status === 'active'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {plate.status === 'active' ? 'Ativa' : 'Pendente'}
                    </span>
                  </div>
                  <p className="font-semibold text-xs truncate text-slate-100">
                    {plate.businessName}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                    {plate.googleReviewUrl}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* PANEL 2: LIVE GRAPHIC CANVAS & EXPORT ACTIONS (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full bg-[#0B101D] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Printer className="w-4 h-4 text-[#00A3FF]" />
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  Matriz Gráfica 300 DPI
                </span>
                <span className="text-[10px] font-mono font-semibold text-cyan-400 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded">
                  12x12 cm
                </span>
              </div>

              {/* Toggle Bleed / Cut Guides */}
              <button
                type="button"
                onClick={() => setShowCutGuides(!showCutGuides)}
                className={`text-[11px] px-2.5 py-1 rounded-md font-medium border transition-colors ${
                  showCutGuides
                    ? 'bg-red-950/50 border-red-500/50 text-red-300'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {showCutGuides ? 'Ocultar Sangria' : 'Mostrar Sangria 3mm'}
              </button>
            </div>

            {/* The Plate Preview Box */}
            <div className="relative w-full max-w-[380px] mx-auto p-2 bg-[#06080F] rounded-2xl border border-slate-800/80 flex items-center justify-center">
              <GooglePlateGraphic
                serialNumber={editSerial}
                businessName={editBusiness}
                googleReviewUrl={editUrl}
                topCustomText={editTopText}
                styleVariant={editStyle}
                showCutGuides={showCutGuides}
                className="w-full"
              />
            </div>

            {/* EXPORT ACTION BUTTONS (The Canva Automation!) */}
            <div className="mt-6 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                {/* 1. Download PNG 300 DPI */}
                <button
                  onClick={handleDownloadPng}
                  disabled={isExporting}
                  className="py-3 px-3 rounded-xl bg-gradient-to-r from-[#00A3FF] to-[#0066FF] hover:brightness-110 text-white font-bold text-xs tracking-wide shadow-md flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Baixar PNG 12x12cm (300 DPI)</span>
                </button>

                {/* 2. Download Vector SVG */}
                <button
                  onClick={handleDownloadSvg}
                  disabled={isExporting}
                  className="py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-2 transition-all"
                >
                  <FileCode className="w-4 h-4 text-[#00E5FF]" />
                  <span>Baixar Vetor SVG (12x12cm)</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* 3. Download QR Only */}
                <button
                  onClick={handleDownloadQrOnly}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <QrCode className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Baixar Só o QR Code</span>
                </button>

                {/* 4. Canva Workflow Copier */}
                <button
                  onClick={handleCopyCanvaWorkflow}
                  className="py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#00A3FF]" />
                      <span>Copiar Info Canva</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Helper Note for Canva */}
            <div className="mt-4 p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/20 text-cyan-200 text-[11px] leading-relaxed flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#00E5FF] shrink-0 mt-0.5" />
              <p>
                <strong>Automação do Canva:</strong> Você não precisa mais recriar artes! Ao clicar em <em>"Baixar PNG 300 DPI"</em> ou <em>"Baixar Vetor SVG"</em>, a arte completa já vem gerada com o QR Code correto, pronta para enviar à gráfica ou puxar para o Canva com corte perfeito.
              </p>
            </div>
          </div>
        </div>

        {/* PANEL 3: LIVE EDITOR & NFC DATA (4 cols) */}
        <div className="lg:col-span-4 bg-[#0B101D] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-heading">
              Editor de Parâmetros
            </span>
            <span className="text-[10px] font-mono text-[#00E5FF]">ID: {selectedPlate?.id || 'novo'}</span>
          </div>

          <div className="space-y-4">
            {/* Serial input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Número de Série da Placa
              </label>
              <input
                type="text"
                value={editSerial}
                onChange={(e) => setEditSerial(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 focus:outline-none focus:border-[#00A3FF]"
              />
            </div>

            {/* Business name input */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Nome da Loja / Empresa
              </label>
              <input
                type="text"
                value={editBusiness}
                onChange={(e) => setEditBusiness(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#00A3FF]"
              />
            </div>

            {/* Destination URL */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                URL Google Review (Destino do QR / NFC)
              </label>
              <textarea
                rows={2}
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-[#00A3FF]"
              />
              <div className="flex justify-end mt-1">
                <a
                  href={editUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-[#00A3FF] hover:underline flex items-center gap-1"
                >
                  <span>Abrir link de teste</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            {/* Top Text Customization */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Texto de Cabeçalho
              </label>
              <input
                type="text"
                value={editTopText}
                onChange={(e) => setEditTopText(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-[#00A3FF]"
              />
            </div>

            {/* Visual Style Selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Variação de Cor
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEditStyle('google_classic')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                    editStyle === 'google_classic'
                      ? 'bg-blue-600/30 border-blue-500 text-white'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Google Clássico
                </button>
                <button
                  type="button"
                  onClick={() => setEditStyle('wiz_dark')}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border ${
                    editStyle === 'wiz_dark'
                      ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Wiz Dark Premium
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveCurrentChanges}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors shadow"
              >
                Salvar Atualização da Placa
              </button>
            </div>

            {/* NFC Programming Guide Box */}
            <div className="mt-4 pt-4 border-t border-slate-800 text-[11px] text-slate-400 space-y-1.5">
              <p className="font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Como gravar o Chip NFC em 5 segundos:
              </p>
              <p>1. Baixe o app gratuito <strong>NFC Tools</strong> (Android / iPhone).</p>
              <p>2. Selecione <em>"Escrever" &gt; "Adicionar Registro" &gt; "URL / URI"</em>.</p>
              <p>3. Cole o link acima e encoste no chip da plaquinha. Pronto!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
