import React from 'react';
import { SIMULATION_SCENARIOS } from '../data/gdsData';
import { SimulationScenario } from '../types/gds';
import { 
  X, 
  Play, 
  AlertTriangle, 
  Crosshair, 
  ShieldAlert, 
  Radio, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';

interface ScenarioSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: SimulationScenario) => void;
  activeScenarioId?: string;
}

export const ScenarioSimulatorModal: React.FC<ScenarioSimulatorModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario,
  activeScenarioId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Crosshair className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Simulasi Skenario Taktis Multi-Domain (Latihan Gabungan C4ISR)
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Pilih skenario ancaman realistis untuk menguji respon otomatis Garuda Brain
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              onClose();
            }}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scenarios Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-4">
          {SIMULATION_SCENARIOS.map((scen) => {
            const isActive = activeScenarioId === scen.id;
            return (
              <div
                key={scen.id}
                className={`p-4 rounded-lg border transition-all flex flex-col justify-between ${
                  isActive
                    ? 'bg-amber-950/20 border-amber-500 shadow-md'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-amber-400 font-bold">{scen.codename}</span>
                    <span className="px-2 py-0.5 rounded border border-rose-500/30 bg-rose-500/10 text-rose-400 font-bold">
                      {scen.threatLevel}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1.5">
                    {scen.title}
                  </h3>
                  <span className="text-xs text-slate-500 font-mono block mb-2">
                    Kategori: {scen.category}
                  </span>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {scen.brief}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
                    <span className="text-amber-400 font-bold block mb-1">Key Insight AI:</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {scen.keyInsight}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      tacticalAudio.playCriticalAlert();
                      onSelectScenario(scen);
                      onClose();
                    }}
                    className={`w-full py-2 px-3 rounded text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                        : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isActive ? 'Skenario Aktif (Sedang Berjalan)' : 'Jalankan Skenario Ini'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 text-xs text-slate-500 font-mono flex items-center justify-between">
          <span>Simulation Engine · GDS Archipelagic Tactical Simulator</span>
          <span>Dual-Use Training & Validation Mode</span>
        </div>
      </div>
    </div>
  );
};
