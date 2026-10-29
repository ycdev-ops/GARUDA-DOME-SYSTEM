import React, { useState } from 'react';
import { Incident } from '../types/gds';
import { 
  TreePine, 
  Layers, 
  Volume2, 
  Activity, 
  MapPin, 
  Truck, 
  ShieldAlert, 
  CheckCircle2, 
  Flame,
  ArrowRight
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';

interface IllegalLoggingViewProps {
  incidents: Incident[];
  onSelectIncident: (inc: Incident) => void;
}

export const IllegalLoggingView: React.FC<IllegalLoggingViewProps> = ({
  incidents,
  onSelectIncident,
}) => {
  const loggingIncidents = incidents.filter((i) => i.domain === 'illegal_logging');
  const [activeCompareMode, setActiveCompareMode] = useState<'SAR_RADAR' | 'OPTICAL' | 'ACOUSTIC'>('SAR_RADAR');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-1">
              <TreePine className="w-4 h-4" />
              <span>MODUL 9 · FORESTRY & CANOPY INTEGRITY MONITORING</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Monitoring Pembalakan Liar (Illegal Logging) & Perlindungan Kawasan Lindung
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Mendeteksi perubahan tutupan tajuk pohon secara near real-time menggunakan citra satelit SAR (menembus awan tebal hujan),
              jejaring sensor akustik biofonik penjaga hutan, dan patroli drone termal untuk menghentikan pembalak liar sebelum kayu langka dijarah.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono shrink-0">
            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-right">
              <span className="text-slate-500 block">Tutupan Terpantau</span>
              <strong className="text-emerald-400 text-base">12,4 Juta Ha</strong>
            </div>
            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-right">
              <span className="text-slate-500 block">Valuasi Dilindungi</span>
              <strong className="text-amber-400 text-base">Rp 74,7 Miliar</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Main Analysis Section: Multi-Spectral & Acoustic Sensor Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Canopy Loss SAR Simulation Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 font-mono uppercase flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              Sensor Sentinel-1 SAR Coherence Loss
            </h3>
            <span className="text-xs text-emerald-400 font-mono">10m x 10m Res</span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setActiveCompareMode('SAR_RADAR')}
              className={`flex-1 py-1 rounded transition-colors ${
                activeCompareMode === 'SAR_RADAR' ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              SAR Radar
            </button>
            <button
              onClick={() => setActiveCompareMode('OPTICAL')}
              className={`flex-1 py-1 rounded transition-colors ${
                activeCompareMode === 'OPTICAL' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Optik NDVI
            </button>
            <button
              onClick={() => setActiveCompareMode('ACOUSTIC')}
              className={`flex-1 py-1 rounded transition-colors ${
                activeCompareMode === 'ACOUSTIC' ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Akustik Biofonik
            </button>
          </div>

          {/* Simulated Satellite Screen */}
          <div className="relative aspect-video w-full rounded bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-3 font-mono text-xs">
            {activeCompareMode === 'SAR_RADAR' && (
              <div className="absolute inset-0 bg-[radial-gradient(#064e3b_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950 p-4">
                {/* Simulated illegal road cut line */}
                <svg className="w-full h-full" viewBox="0 0 200 120">
                  {/* Forest canopy background */}
                  <rect x="0" y="0" width="200" height="120" fill="#022c22" opacity="0.6" />
                  {/* Illegal logging road branch */}
                  <path
                    d="M 10 100 Q 60 70 90 50 T 140 30 L 180 20"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3.5"
                    strokeDasharray="4 2"
                  />
                  {/* Basecamp cleared area polygon */}
                  <polygon points="120,25 155,15 165,45 130,40" fill="#f43f5e" opacity="0.5" stroke="#f43f5e" strokeWidth="1" />
                  <text x="135" y="32" fill="#fff" fontSize="6" fontFamily="monospace">BASECAMP EKSKAVATOR</text>
                  <text x="50" y="90" fill="#fda4af" fontSize="5" fontFamily="monospace">JALUR LOGGING ILEGAL (+84.6 Ha)</text>
                </svg>
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500 text-[10px] text-rose-300">
                  DEFORESTASI AKUT
                </div>
              </div>
            )}

            {activeCompareMode === 'OPTICAL' && (
              <div className="absolute inset-0 bg-slate-900 p-4 flex flex-col justify-center items-center text-center">
                <span className="text-slate-400 text-xs mb-1">Vegetation Index Delta (NDVI)</span>
                <div className="w-full max-w-[200px] h-3 rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 mb-2" />
                <span className="text-xs text-rose-400 font-bold">Penurunan Kerapatan Klorofil: -78.4%</span>
                <span className="text-[10px] text-slate-500 mt-1">Estimasi 4.200 Pohon Ulin dan Meranti Ditebang</span>
              </div>
            )}

            {activeCompareMode === 'ACOUSTIC' && (
              <div className="absolute inset-0 bg-slate-950 p-3 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>SENSOR BIOFONIK TN-04</span>
                  <span className="text-amber-400 animate-pulse">FREQ: 2.45 kHz (Chainsaw)</span>
                </div>
                {/* Waveform representation */}
                <div className="flex items-end justify-between h-16 gap-1 px-2">
                  {[20, 35, 60, 85, 95, 70, 88, 100, 75, 40, 25, 90, 80, 65, 30].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-amber-400/80 rounded-t"
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="text-[10px] text-slate-400 flex justify-between">
                  <span>Sensitivitas: 3.0 km</span>
                  <span className="text-rose-400 font-bold">Pola Mesin Berat Terverifikasi</span>
                </div>
              </div>
            )}

            {/* Bottom timestamp */}
            <div className="relative z-10 mt-auto flex justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800">
              <span>Sat: Sentinel-1 Pass 142</span>
              <span>2026-10-29 11:15 WIB</span>
            </div>
          </div>

          <div className="p-3 rounded bg-slate-950/70 border border-slate-800 text-xs text-slate-400 font-mono space-y-1.5">
            <div className="flex justify-between">
              <span>Keunggulan SAR:</span>
              <span className="text-emerald-400">Tembus Tutupan Awan 100%</span>
            </div>
            <div className="flex justify-between">
              <span>Pembeda AI:</span>
              <span className="text-slate-200">Bukaan Jalan vs Pohon Tumbang</span>
            </div>
            <div className="flex justify-between">
              <span>Waktu Deteksi:</span>
              <span className="text-amber-400">&lt; 24 Jam (vs 14 Hari Lama)</span>
            </div>
          </div>
        </div>

        {/* Right Columns: Active Incidents & Forest Protection Operations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
              Laporan Kejahatan Kehutanan Aktif ({loggingIncidents.length} Kasus)
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Integrasi: Balai Gakkum KLHK · Kodam XII/Tanjungpura · Polres
            </span>
          </div>

          <div className="space-y-3">
            {loggingIncidents.map((inc) => (
              <div
                key={inc.id}
                onClick={() => {
                  tacticalAudio.playRadarPing();
                  onSelectIncident(inc);
                }}
                className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      <TreePine className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-amber-400">{inc.code}</span>
                        <span className="text-xs text-slate-400 font-mono">{inc.locationName}</span>
                      </div>
                      <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
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

                {/* Logging specs ribbon */}
                {inc.loggingDetails && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs font-mono">
                    <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Luas Deforestasi</span>
                      <strong className="text-rose-400">{inc.loggingDetails.deforestedHa} Hektar</strong>
                    </div>
                    <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Laju Kerusakan</span>
                      <strong className="text-slate-200">{inc.loggingDetails.canopyLossRate}</strong>
                    </div>
                    <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Alat Berat Ekskavator</span>
                      <strong className={inc.loggingDetails.heavyMachineryDetected ? "text-rose-400" : "text-slate-400"}>
                        {inc.loggingDetails.heavyMachineryDetected ? "TERDETEKSI" : "TIDAK"}
                      </strong>
                    </div>
                    <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                      <span className="text-slate-500 block text-[10px]">Status Kawasan</span>
                      <strong className="text-emerald-400">{inc.loggingDetails.protectedAreaType}</strong>
                    </div>
                  </div>
                )}

                {/* Bottom Prescriptive Asset */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Satgas Rekomendasi: <strong className="text-slate-200">{inc.prescriptiveAction.operatingUnit}</strong></span>
                  </div>
                  <span className="text-amber-400 font-semibold group-hover:translate-x-1 transition-transform">
                    Buka SOP & Otorisasi →
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Cross Domain Risk Callout */}
          <div className="p-4 rounded-lg bg-orange-950/20 border border-orange-800/40 space-y-2">
            <div className="flex items-center gap-2 text-orange-400 font-mono text-xs font-semibold">
              <Flame className="w-4 h-4" />
              <span>KORELASI LINTAS DOMAIN: LOGGING → PENGERINGAN GAMBUT → KARHUTLA</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Bukaan kanal parit logging di kawasan gambut Bukit Baka & Kubu Raya menurunkan muka air tanah hingga 85 cm di bawah batas aman.
              Garuda Brain memproyeksikan probabilitas kebakaran lahan gambut 94% dalam waktu 72 jam jika kanal parit tidak segera disekat (canal blocking).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
