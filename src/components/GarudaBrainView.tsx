import React from 'react';
import { EdgeNode, CrossDomainCorrelation } from '../types/gds';
import { 
  Cpu, 
  Share2, 
  Radio, 
  Server, 
  Zap, 
  ShieldCheck, 
  GitBranch, 
  ArrowRight,
  Wifi,
  Database
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';

interface GarudaBrainViewProps {
  edgeNodes: EdgeNode[];
  correlations: CrossDomainCorrelation[];
}

export const GarudaBrainView: React.FC<GarudaBrainViewProps> = ({
  edgeNodes,
  correlations,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-1">
              <Cpu className="w-4 h-4" />
              <span>GARUDA BRAIN v3 · MULTI-INTELLIGENCE NEURAL FUSION ENGINE</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Pusat Intelijen Multi-Domain & Archipelagic Edge Computing
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Arsitektur terdistribusi yang menyatukan GEOINT (SAR Satelit), SIGINT, OSINT, AIS, Akustik Hutan, dan Seismik. 
              Mampu beroperasi mandiri di pulau-pulau terluar melalui Edge TPU Nodes meski kabel optik bawah laut terputus.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono shrink-0">
            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-right">
              <span className="text-slate-500 block">Edge Nodes Terhubung</span>
              <strong className="text-cyan-400 text-base tabular-nums">7 Node Taktis</strong>
            </div>
            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-right">
              <span className="text-slate-500 block">Korelasi Lintas Matra</span>
              <strong className="text-amber-400 text-base tabular-nums">3 Hub Kausal</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Intelligence Fusion Pipeline Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-5">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wide mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400" />
          Multi-Intelligence Fusion Pipeline (Alur Penggabungan 6 Sumber Data)
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs font-mono">
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-cyan-400 font-bold block mb-1">1. GEOINT</span>
            <p className="text-slate-400 text-[11px] leading-tight">Satelit SAR Sentinel-1, Gaofen & Optik Landsat</p>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1">2. SIGINT / ESM</span>
            <p className="text-slate-400 text-[11px] leading-tight">Pencegatan Frekuensi, Balmon & Radar Militer</p>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-amber-400 font-bold block mb-1">3. AIS & ADS-B</span>
            <p className="text-slate-400 text-[11px] leading-tight">Transponder Kapal Laut & Flight Plan Udara</p>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-purple-400 font-bold block mb-1">4. AKUSTIK BIOFONIK</span>
            <p className="text-slate-400 text-[11px] leading-tight">Mikrofon Tanah Penjaga Hutan (Chainsaw Detection)</p>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-rose-400 font-bold block mb-1">5. SEISMIK & BUOY</span>
            <p className="text-slate-400 text-[11px] leading-tight">InaTEWS BMKG & Gelombang Pasut Tsunami</p>
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-blue-400 font-bold block mb-1">6. OSINT & SOC</span>
            <p className="text-slate-400 text-[11px] leading-tight">BSSN Honeynet, Log VTS & Cyber Threat Intel</p>
          </div>
        </div>
      </div>

      {/* Cross-Domain Correlation Engine */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
            <Share2 className="w-4 h-4 text-amber-400" />
            Cross-Domain Correlation Engine (Kausalitas Antar Domain)
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Graph Neural Network Model
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {correlations.map((corr) => (
            <div
              key={corr.id}
              className="p-4 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-amber-400 font-semibold">{corr.id}</span>
                  <span className="px-2 py-0.5 rounded border border-rose-500/30 bg-rose-500/10 text-rose-400 font-bold">
                    RISIKO {corr.compoundRisk}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white mb-2 leading-snug">
                  {corr.title}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {corr.narrative}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800/80 text-xs font-mono">
                <span className="text-slate-500 block mb-1 text-[11px]">Rekomendasi Intervensi Sinergis:</span>
                <p className="text-slate-200 text-xs bg-slate-950 p-2 rounded border border-slate-800/80">
                  {corr.synergisticIntervention}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Archipelagic Edge Nodes Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            Status Archipelagic Edge Nodes (Pulau Terluar & KRI Bergerak)
          </h3>
          <span className="text-xs text-emerald-400 font-mono">
            Semua Node Nominal · Uplink Redundan
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {edgeNodes.map((node) => (
            <div
              key={node.id}
              className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-xs space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-amber-400 font-bold block">{node.code}</span>
                  <strong className="text-white font-sans text-xs">{node.name}</strong>
                </div>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  {node.status}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 font-sans">
                {node.role}
              </div>

              <div className="pt-2 border-t border-slate-800/60 space-y-1 text-slate-400 text-[11px]">
                <div className="flex justify-between">
                  <span>Radius Cakupan:</span>
                  <strong className="text-slate-200 tabular-nums">{node.coverageRadiusKm} km</strong>
                </div>
                <div className="flex justify-between">
                  <span>Latency Lokal:</span>
                  <strong className="text-cyan-400 tabular-nums">{node.localLatencyMs} ms</strong>
                </div>
                <div className="flex justify-between">
                  <span>Uplink Cadangan:</span>
                  <strong className="text-slate-200">{node.meshUplink}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Sensor Aktif:</span>
                  <strong className="text-amber-400 tabular-nums">{node.activeSensors} Sensor</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
