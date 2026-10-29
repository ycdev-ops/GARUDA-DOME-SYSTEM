import React from 'react';
import { Incident } from '../types/gds';
import { 
  Anchor, 
  Radio, 
  Ship, 
  AlertTriangle, 
  Eye, 
  Crosshair, 
  Navigation,
  Shield,
  FileCheck,
  TrendingDown
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';

interface IllegalFishingViewProps {
  incidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
}

export const IllegalFishingView: React.FC<IllegalFishingViewProps> = ({
  incidents,
  onSelectIncident,
}) => {
  const maritimeIncidents = incidents.filter((i) => i.domain === 'illegal_fishing');

  return (
    <div className="space-y-6">
      {/* Top Banner / Executive Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-1">
              <Anchor className="w-4 h-4" />
              <span>MODUL 10 · MARITIME DOMAIN AWARENESS (MDA)</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Pencegahan Pencurian Ikan (IUU Fishing) & Deteksi Dark Vessel
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Menggabungkan citra satelit SAR (Synthetic Aperture Radar), konstelasi AIS satelit, radar pantai IMSS, 
              dan drone intai maritim PUNA MALE untuk mendeteksi kapal tanpa AIS (Dark Vessel) dan transshipment ilegal di ZEE Natuna, Arafura, dan ALKI.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono shrink-0">
            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-right">
              <span className="text-slate-500 block">Total Luas ZEE</span>
              <strong className="text-cyan-400 text-base">5,8 Juta km²</strong>
            </div>
            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-right">
              <span className="text-slate-500 block">Devisa Terselamatkan</span>
              <strong className="text-amber-400 text-base">Rp 43,3 Miliar</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Radar Tech Explainer & Live Incidents Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Tactical Radar PPI Simulation Display */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col">
          <div className="flex items-center justify-between mb-3 text-xs font-mono">
            <span className="text-slate-300 font-semibold flex items-center gap-1.5">
              <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
              RADAR PPI · SEKTOR NATUNA UTARA
            </span>
            <span className="text-cyan-400">RANGE: 96 NM</span>
          </div>

          {/* Interactive Radar PPI Screen */}
          <div className="relative aspect-square w-full rounded-full bg-slate-950 border border-cyan-800/50 overflow-hidden flex items-center justify-center p-2 shadow-inner">
            {/* Concentric distance rings */}
            <div className="absolute inset-4 rounded-full border border-cyan-900/40" />
            <div className="absolute inset-12 rounded-full border border-cyan-900/40" />
            <div className="absolute inset-20 rounded-full border border-cyan-900/40" />
            <div className="absolute inset-28 rounded-full border border-cyan-900/40" />

            {/* Crosshairs */}
            <div className="absolute inset-x-0 h-[1px] bg-cyan-900/40" />
            <div className="absolute inset-y-0 w-[1px] bg-cyan-900/40" />

            {/* Rotating radar sweep */}
            <div className="absolute inset-0 animate-radar origin-center pointer-events-none">
              <div 
                className="w-1/2 h-1/2 origin-bottom-right"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.35) 0deg, transparent 60deg)',
                }}
              />
            </div>

            {/* Simulated Targets on PPI Screen */}
            <div 
              onClick={() => {
                const target = maritimeIncidents[0];
                if (target) {
                  tacticalAudio.playRadarPing();
                  onSelectIncident(target);
                }
              }}
              className="absolute top-1/4 right-1/3 p-1 rounded-full bg-rose-500/80 cursor-pointer hover:scale-150 transition-transform group"
              title="Target 1: Dark Vessel Natuna (Klik)"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-ping absolute inset-0" />
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="absolute top-3 left-3 text-[9px] font-mono font-bold text-rose-300 bg-slate-950/90 px-1 py-0.5 rounded border border-rose-900 whitespace-nowrap">
                TARGET-01 [DARK]
              </span>
            </div>

            <div 
              onClick={() => {
                const target = maritimeIncidents[1];
                if (target) {
                  tacticalAudio.playRadarPing();
                  onSelectIncident(target);
                }
              }}
              className="absolute bottom-1/3 left-1/4 p-1 rounded-full bg-amber-500/80 cursor-pointer hover:scale-150 transition-transform group"
              title="Target 2: Transshipment Arafura (Klik)"
            >
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="absolute top-3 left-3 text-[9px] font-mono font-bold text-amber-300 bg-slate-950/90 px-1 py-0.5 rounded border border-amber-900 whitespace-nowrap">
                TARGET-02 [REEFER]
              </span>
            </div>

            {/* Central Node Dot (Ranai Radar) */}
            <div className="w-2 h-2 rounded-full bg-cyan-400 z-10" />
            <span className="absolute bottom-3 text-[9px] font-mono text-cyan-500">
              POS PENGAMAT TNI AL RANAI
            </span>
          </div>

          <div className="mt-4 p-3 rounded bg-slate-950/70 border border-slate-800 text-xs text-slate-400 font-mono space-y-1">
            <div className="flex justify-between">
              <span>Satelit SAR:</span>
              <span className="text-cyan-400">Sentinel-1 C-Band (All-Weather)</span>
            </div>
            <div className="flex justify-between">
              <span>Algoritma Anomali:</span>
              <span className="text-slate-200">Pair Trawling Trajectory Match</span>
            </div>
            <div className="flex justify-between">
              <span>Verifikasi Silang AIS:</span>
              <span className="text-rose-400">Target Fisik Tanpa MMSI (Dark)</span>
            </div>
          </div>
        </div>

        {/* Right Columns: Active Incidents & Interdiction Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
              Sasaran Maritim Terdeteksi ({maritimeIncidents.length} Kejadian Aktif)
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Terhubung ke: TNI AL Koarmada I/III · Bakamla · Ditjen PSDKP KKP
            </span>
          </div>

          <div className="space-y-3">
            {maritimeIncidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => {
                  tacticalAudio.playRadarPing();
                  onSelectIncident(inc);
                }}
                className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                      <Ship className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400">{inc.code}</span>
                        <span className="text-xs text-slate-400 font-mono">{inc.locationName}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">
                        {inc.title}
                      </h4>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded border text-xs font-mono font-bold bg-rose-500/10 border-rose-500/30 text-rose-400">
                    {inc.threatLevel}
                  </span>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {inc.description}
                </p>

                {/* Vessel specs ribbon */}
                {inc.maritimeDetails && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs font-mono">
                    <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Tipe Lambung</span>
                      <strong className="text-slate-200">{inc.maritimeDetails.vesselType}</strong>
                    </div>
                    <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Status AIS</span>
                      <strong className={inc.maritimeDetails.isDarkVessel ? "text-rose-400" : "text-emerald-400"}>
                        {inc.maritimeDetails.isDarkVessel ? "NON-AKTIF (DARK)" : "AKTIF"}
                      </strong>
                    </div>
                    <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Kecepatan/Arah</span>
                      <strong className="text-slate-200">{inc.maritimeDetails.speedKnots} kts / {inc.maritimeDetails.headingDeg}°</strong>
                    </div>
                    <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Anomali</span>
                      <strong className="text-cyan-400">{inc.maritimeDetails.anomalyType}</strong>
                    </div>
                  </div>
                )}

                {/* Bottom Prescriptive Asset */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Aset Pencegat: <strong className="text-slate-200">{inc.prescriptiveAction.recommendedAsset.split('&')[0]}</strong></span>
                  </div>
                  <span className="text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                    Buka SOP & Otorisasi →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Strategic IUU Comparison Table */}
          <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 font-mono mb-3 uppercase">
              Perbandingan: Patroli Laut Konvensional vs. Sistem Intelijen GDS v3
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-500">
                    <th className="py-2 pr-4 font-medium">Parameter Operasional</th>
                    <th className="py-2 pr-4 font-medium">Patroli Konvensional (Lama)</th>
                    <th className="py-2 font-medium text-cyan-400">Garuda Dome System v3</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  <tr>
                    <td className="py-2 pr-4 text-slate-400">Metode Pelacakan</td>
                    <td className="py-2 pr-4">Patroli fisik & AIS komersial</td>
                    <td className="py-2 text-cyan-300 font-semibold">Sensor Fusion SAR Radar + AI Anomaly</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-slate-400">Deteksi Dark Vessel (AIS Mati)</td>
                    <td className="py-2 pr-4 text-rose-400">Blind Spot (Tidak Terdeteksi)</td>
                    <td className="py-2 text-emerald-400 font-semibold">Terdeteksi via Pantulan Radar SAR</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-slate-400">Waktu Respon (Response Time)</td>
                    <td className="py-2 pr-4">4 s/d 12 Jam (Terlambat)</td>
                    <td className="py-2 text-amber-300 font-semibold">15 s/d 35 Menit (Near Real-Time)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-slate-400">Efisiensi Bahan Bakar (BBM)</td>
                    <td className="py-2 pr-4">Tinggi (Patroli Buta Tanpa Koordinat)</td>
                    <td className="py-2 text-emerald-400 font-semibold">Hemat 42% (Intersepsi Tepat Sasaran)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
