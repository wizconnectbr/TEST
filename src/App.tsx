/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  QrCode,
  Printer,
  Smartphone,
  Layers,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Info,
} from 'lucide-react';
import { WizConnectLogo } from './components/WizConnectLogo';
import { CustomerActivationWizard } from './components/CustomerActivationWizard';
import { WizConnectStudio } from './components/WizConnectStudio';
import { DynamicRedirectSimulator } from './components/DynamicRedirectSimulator';
import { getStoredPlates, findPlateBySerial } from './utils/plateStorage';
import { PlateOrder } from './types/plate';

export default function App() {
  const [activeTab, setActiveTab] = useState<'customer' | 'studio' | 'simulator'>('customer');
  const [selectedSerial, setSelectedSerial] = useState('000001');
  const [activePlate, setActivePlate] = useState<PlateOrder | null>(null);

  // Check query params on mount (e.g. ?serial=000001&tab=studio)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const serialParam = params.get('serial') || params.get('s');
      const tabParam = params.get('tab');

      if (serialParam) {
        setSelectedSerial(serialParam);
      }

      if (tabParam === 'studio' || tabParam === 'admin') {
        setActiveTab('studio');
      } else if (tabParam === 'simulator' || tabParam === 'demo') {
        setActiveTab('simulator');
      }

      const plates = getStoredPlates();
      const current = (serialParam && findPlateBySerial(serialParam)) || plates[0] || null;
      setActivePlate(current);
    } catch {
      // Fallback
    }
  }, []);

  const handleOrderSaved = (saved: PlateOrder) => {
    setActivePlate(saved);
    setSelectedSerial(saved.serialNumber);
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 flex flex-col selection:bg-[#00A3FF] selection:text-white">
      {/* Top Cyber Glow Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#00A3FF] to-transparent opacity-80" />

      {/* NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-[#07090E]/90 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          {/* Brand Logo (recreation of uploaded Wiz Connect logo) */}
          <div className="cursor-pointer" onClick={() => setActiveTab('customer')}>
            <WizConnectLogo size="md" />
          </div>

          {/* Interactive Navigation Tabs */}
          <nav className="flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-xl border border-slate-800/80 overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'customer'
                  ? 'bg-gradient-to-r from-[#00A3FF] to-[#0066FF] text-white shadow-[0_0_15px_rgba(0,163,255,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Landing Page do Cliente</span>
            </button>

            <button
              onClick={() => setActiveTab('studio')}
              className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'studio'
                  ? 'bg-gradient-to-r from-[#00A3FF] to-[#0066FF] text-white shadow-[0_0_15px_rgba(0,163,255,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Estúdio Gráfico / Canva</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3 sm:px-4 py-2 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                activeTab === 'simulator'
                  ? 'bg-gradient-to-r from-[#00A3FF] to-[#0066FF] text-white shadow-[0_0_15px_rgba(0,163,255,0.4)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Simulador NFC</span>
            </button>
          </nav>

          {/* Direct WhatsApp Contact Button */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="mailto:wizconnect.br@gmail.com"
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              wizconnect.br@gmail.com
            </a>
            <a
              href="https://wa.me/5511999999999?text=Ol%C3%A1%20Wiz%20Connect!%20Gostaria%20de%20tirar%20d%C3%BAvidas%20sobre%20as%20plaquinhas%20Google%20NFC."
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Suporte WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT BODY */}
      <main className="flex-1">
        {activeTab === 'customer' && (
          <CustomerActivationWizard
            initialSerial={selectedSerial}
            onOrderSaved={handleOrderSaved}
            onGoToStudio={() => setActiveTab('studio')}
          />
        )}

        {activeTab === 'studio' && (
          <WizConnectStudio
            onBackToCustomerView={() => setActiveTab('customer')}
          />
        )}

        {activeTab === 'simulator' && (
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-white font-heading">
                Simulação de Leitura no Balcão
              </h2>
              <p className="text-slate-400 text-sm mt-1">
                Demonstração interativa de como os clientes do estabelecimento usam o NFC e o QR Code.
              </p>
            </div>

            {activePlate ? (
              <DynamicRedirectSimulator plate={activePlate} />
            ) : (
              <div className="text-center py-12 text-slate-400">
                Nenhuma placa selecionada. Volte para a Landing Page ou Estúdio.
              </div>
            )}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#05070B] py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <WizConnectLogo size="sm" showSubtitle={false} />
            <span className="text-slate-600">·</span>
            <span>Tecnologia NFC NTAG213 / NTAG215 e QR Code Dinâmico</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Automação Gráfica 300 DPI</span>
            <span className="text-slate-600">·</span>
            <span>Compatível com Canva, Corel & Gráficas</span>
            <span className="text-slate-600">·</span>
            <span className="text-cyan-400 font-mono">Wiz Connect © 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
