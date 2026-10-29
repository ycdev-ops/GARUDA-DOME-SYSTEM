import React, { useState } from 'react';
import { Incident } from '../types/gds';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Radio, 
  Anchor, 
  TreePine, 
  Flame, 
  AlertOctagon, 
  Send, 
  FileText, 
  Compass,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';

interface IncidentDetailModalProps {
  incident: Incident | null;
  onClose: () => void;
  onDispatch: (incidentId: string) => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  incident,
  onClose,
  onDispatch,
}) => {
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'TELEMETRI' | 'PRESCRIPTIVE' | 'KORELASI'>('TELEMETRI');

  if (!incident) return null;

  const handleExecuteDispatch = () => {
    setIsDispatching(true);
    tacticalAudio.playDispatchConfirm();
    setTimeout(() => {
      setIsDispatching(false);
      setDispatchSuccess(true);
      onDispatch(incident.id);
    }, 700);
  };

  const getThreatBadge = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      default:
        return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
              {incident.code}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded border font-mono font-medium ${getThreatBadge(incident.threatLevel)}`}>
              STATUS: {incident.status}
            </span>
            <span className="text-xs text-slate-400 font-mono hidden sm:inline">
              Confidence: {incident.confidenceScore}%
            </span>
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

        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800">
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight mb-2">
            {incident.title}
          </h2>
          <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap font-mono">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{incident.locationName}</span>
            </div>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>{incident.coordinates[0].toFixed(2)}°N, {incident.coordinates[1].toFixed(2)}°E ({incident.region})</span>
            </div>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{incident.timestamp}</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs inside modal */}
        <div className="flex items-center border-b border-slate-800 bg-slate-950/60 px-6">
          <button
            onClick={() => setActiveTab('TELEMETRI')}
            className={`py-2.5 px-3 text-xs font-semibold transition-colors relative ${
              activeTab === 'TELEMETRI'
                ? 'text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sensor & Telemetri
            {activeTab === 'TELEMETRI' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('PRESCRIPTIVE')}
            className={`py-2.5 px-3 text-xs font-semibold transition-colors relative ${
              activeTab === 'PRESCRIPTIVE'
                ? 'text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tindakan Preskriptif (SOP)
            {activeTab === 'PRESCRIPTIVE' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('KORELASI')}
            className={`py-2.5 px-3 text-xs font-semibold transition-colors relative ${
              activeTab === 'KORELASI'
                ? 'text-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Korelasi Lintas Modul
            {activeTab === 'KORELASI' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400" />
            )}
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-300 text-xs sm:text-sm">
          {activeTab === 'TELEMETRI' && (
            <div className="space-y-4">
              {/* Description */}
              <div className="p-3.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <h4 className="text-xs font-semibold text-slate-400 mb-1.5 uppercase font-mono">
                  Deskripsi Intelijen Situasional
                </h4>
                <p className="leading-relaxed text-slate-200">{incident.description}</p>
              </div>

              {/* Maritime Details if available */}
              {incident.maritimeDetails && (
                <div className="p-4 rounded-lg bg-cyan-950/20 border border-cyan-800/40">
                  <div className="flex items-center gap-2 mb-3 text-cyan-400">
                    <Anchor className="w-4 h-4" />
                    <span className="font-semibold text-xs uppercase font-mono">
                      Telemetri Sasaran Maritim (IUU Fishing)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-500 block">Tipe Kapal</span>
                      <strong className="text-slate-200">{incident.maritimeDetails.vesselType}</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-500 block">Status AIS</span>
                      <strong className={incident.maritimeDetails.isDarkVessel ? "text-rose-400" : "text-emerald-400"}>
                        {incident.maritimeDetails.isDarkVessel ? "MATI (DARK VESSEL)" : "AKTIF"}
                      </strong>
                    </div>
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-500 block">Kecepatan & Arah</span>
                      <strong className="text-slate-200">{incident.maritimeDetails.speedKnots} kts / {incident.maritimeDetails.headingDeg}°</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-500 block">Estimasi Tonase</span>
                      <strong className="text-slate-200">{incident.maritimeDetails.estimatedTonnageGT} GT</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Logging Details if available */}
              {incident.loggingDetails && (
                <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-800/40">
                  <div className="flex items-center gap-2 mb-3 text-emerald-400">
                    <TreePine className="w-4 h-4" />
                    <span className="font-semibold text-xs uppercase font-mono">
                      Analisis Deforestasi & Kanopi (Illegal Logging)
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-500 block">Luas Bukaan</span>
                      <strong className="text-rose-400">{incident.loggingDetails.deforestedHa} Hektar</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-500 block">Kecepatan Bukaan</span>
                      <strong className="text-slate-200">{incident.loggingDetails.canopyLossRate}</strong>
                    </div>
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-500 block">Alat Berat</span>
                      <strong className={incident.loggingDetails.heavyMachineryDetected ? "text-rose-400" : "text-slate-400"}>
                        {incident.loggingDetails.heavyMachineryDetected ? "TERDETEKSI (EKSKAVATOR)" : "TIDAK TERDETEKSI"}
                      </strong>
                    </div>
                    <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                      <span className="text-slate-500 block">Status Wilayah</span>
                      <strong className="text-emerald-400">{incident.loggingDetails.protectedAreaType}</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* Sensors Mesh Used */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 mb-2 font-mono uppercase">
                  Sensor Mesh Fusion Terlibat ({incident.sensorsInvolved.length} Sensor)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {incident.sensorsInvolved.map((sensor, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800/80 border border-slate-700 text-xs font-mono text-slate-300"
                    >
                      <Radio className="w-3 h-3 text-cyan-400" />
                      {sensor}
                    </span>
                  ))}
                </div>
              </div>

              {/* Economic loss impact */}
              {incident.estimatedLossIDR && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                    <AlertOctagon className="w-4 h-4" />
                    <span>Estimasi Kerugian / Devisa Diamankan:</span>
                  </div>
                  <strong className="text-amber-300 font-mono text-sm">{incident.estimatedLossIDR}</strong>
                </div>
              )}
            </div>
          )}

          {activeTab === 'PRESCRIPTIVE' && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                  <span className="text-xs font-mono text-slate-500">Kode SOP Penindakan:</span>
                  <span className="text-xs font-mono font-bold text-amber-400">{incident.prescriptiveAction.sopCode}</span>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block mb-1">Aset & Alutsista Rekomendasi:</span>
                  <p className="text-sm font-semibold text-white bg-slate-900 p-2.5 rounded border border-slate-800">
                    {incident.prescriptiveAction.recommendedAsset}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">Satuan Operasional</span>
                    <strong className="text-slate-200">{incident.prescriptiveAction.operatingUnit}</strong>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block">Lead Agency & Estimasi Waktu</span>
                    <strong className="text-amber-400">{incident.prescriptiveAction.leadAgency} (ETA: {incident.prescriptiveAction.etaMinutes} Menit)</strong>
                  </div>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block mb-1">Rencana Aksi Taktis (Action Plan):</span>
                  <p className="text-xs leading-relaxed text-slate-300 bg-slate-900/50 p-2.5 rounded border border-slate-800">
                    {incident.prescriptiveAction.actionPlan}
                  </p>
                </div>

                <div>
                  <span className="text-xs text-slate-500 block mb-1">Landasan Hukum & Rujukan Regulasi:</span>
                  <p className="text-xs text-slate-400 italic bg-slate-900/30 p-2 rounded">
                    {incident.prescriptiveAction.legalBasis}
                  </p>
                </div>
              </div>

              {/* Status if already dispatched */}
              {incident.status === 'DISPATCHED' && (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs font-mono">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>DISPOSISI RESMI TELAH TERKIRIM KE PUSDALOPS {incident.prescriptiveAction.leadAgency.toUpperCase()}. ASET SEDANG BERGERAK KE LOKASI.</span>
                </div>
              )}
            </div>
          )}

          {activeTab === 'KORELASI' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 leading-relaxed">
                Garuda Brain mengidentifikasi hubungan kausalitas insiden ini dengan dinamika di sektor/matra lain:
              </p>
              {incident.correlationLinks.length > 0 ? (
                <div className="space-y-2.5">
                  {incident.correlationLinks.map((linkId) => (
                    <div key={linkId} className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Share2 className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-mono font-semibold text-slate-200">
                          Terkorelasi dengan: {linkId}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">Compound Risk: HIGH</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-slate-500 text-xs">
                  Tidak ditemukan keterkaitan eskalasi lintas domain aktif untuk insiden ini saat ini.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with 1-Click Action */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-400 font-mono">
            <span>Human-in-the-Loop Protocol</span>
            <span aria-hidden="true" className="mx-2">·</span>
            <span className="text-slate-300">Otorisasi Perwira Jaga Diperlukan</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                onClose();
              }}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
            >
              Tutup
            </button>

            {incident.status !== 'DISPATCHED' && incident.status !== 'RESOLVED' && (
              <button
                disabled={isDispatching || dispatchSuccess}
                onClick={handleExecuteDispatch}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 rounded transition-colors shadow-sm cursor-pointer"
              >
                {isDispatching ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Mengirim Telegram Disposisi...</span>
                  </>
                ) : dispatchSuccess ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Disposisi Terkirim</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Otorisasi & Kirim Perintah Disposisi</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
