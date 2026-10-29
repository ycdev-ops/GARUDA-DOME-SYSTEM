import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Crosshair, 
  Radio, 
  Satellite, 
  Plane, 
  Maximize2, 
  Minimize2, 
  X, 
  FileText, 
  Terminal, 
  Activity, 
  Layers, 
  Zap,
  Flame,
  Droplets,
  RotateCcw,
  Check
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';

export interface OperationRealizationData {
  id: string;
  codename: string;
  title: string;
  domain: 'AIR_DEFENSE' | 'CYBER_DEFENSE' | 'KARHUTLA' | 'IUU_FISHING' | 'ILLEGAL_LOGGING';
  targetLocation: string;
  mgrs: string;
  operatorId: string;
  authorizedAt: string;
  assignedUnits: string[];
  stages: {
    title: string;
    description: string;
    durationSec: number;
    agency: string;
  }[];
}

interface RealizationProgressHUDProps {
  operation: OperationRealizationData | null;
  isOpen: boolean;
  onClose: () => void;
  onReset?: () => void;
}

export const RealizationProgressHUD: React.FC<RealizationProgressHUDProps> = ({
  operation,
  isOpen,
  onClose,
  onReset
}) => {
  const [elapsedSec, setElapsedSec] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [telemetryLogs, setTelemetryLogs] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  // Fallback default operation if null
  const currentOp = operation || {
    id: 'OP-INTERCEPT-THREAT-03',
    codename: 'GARUDA THUNDER-03',
    title: 'INTERDIKSI KINETIK RUDAL BALISTIK NATUNA',
    domain: 'AIR_DEFENSE',
    targetLocation: 'Laut Natuna Utara (04°12\' N, 108°24\' E)',
    mgrs: '48N WG 4291 8812',
    operatorId: 'OP-KOPASGAT-27 (Mayor Tek Arya)',
    authorizedAt: new Date().toLocaleTimeString('id-ID'),
    assignedUnits: [
      'Satrad 212 Ranai Natuna',
      'Skadron Udara 16 F-16 C/D Fighting Falcon',
      'Baterai Rudal NASAMS-2 KOPASGAT',
      'Satelit LAPAN-A3 / Sentinel-1 SAR'
    ],
    stages: [
      {
        title: 'OTORISASI KOMANDO & VALIDASI KRIPTOGRAFIS',
        description: 'Tanda tangan digital kunci PQC Dilithium-5 terekam. Jalur komando Kohanudnas terenkripsi AES-256.',
        durationSec: 8,
        agency: 'MABES TNI / KOPASGAT'
      },
      {
        title: 'TASKING ORBITAL SATELIT & SENSOR FUSION',
        description: 'Satelit Sentinel-1 SAR & LEO SIGINT mengunci koordinat. Radar IMSS Ranai memancarkan tracking beam.',
        durationSec: 16,
        agency: 'BRIN-LAPAN / TNI AU'
      },
      {
        title: 'DISPOSISI & PENGUNCIAN VEKTOR TEMBAK (FIRE CONTROL)',
        description: 'Sistem FCS menghitung interception envelope. Solusi peluncuran dikirim ke baterai rudal dan scrambler F-16.',
        durationSec: 24,
        agency: 'SKADRON 16 / BAT. NASAMS'
      },
      {
        title: 'EKSEKUSI INTERDIKSI & KINETIK TERMINAL LOCK',
        description: 'Rudal pencegat meluncur dengan panduan radar aktif seeker. Vektor kecepatan relatif mendekati Mach 4.8.',
        durationSec: 18,
        agency: 'INTERCEPTOR COMMAND'
      },
      {
        title: 'VERIFIKASI KERUSAKAN (BDA) & STATUS NETRALISIR',
        description: 'Sensor optik satelit dan radar memverifikasi pecahan fragmentasi. Ancaman berhasil dinetralisasi sepenuhnya.',
        durationSec: 12,
        agency: 'KOMANDO GABUNGAN'
      }
    ]
  };

  const totalDurationSec = currentOp.stages.reduce((acc, s) => acc + s.durationSec, 0);

  // Timer loop
  useEffect(() => {
    if (!isOpen) {
      setElapsedSec(0);
      setIsCompleted(false);
      setTelemetryLogs([]);
      return;
    }

    const startMs = Date.now();
    tacticalAudio.playDispatchConfirm();

    // Initial log
    setTelemetryLogs([
      `[T+00:00] [AUTH] Otorisasi sah terekam dari terminal: ${currentOp.operatorId}`,
      `[T+00:02] [LINK] Mengaktifkan link taktis militer Link-Y & satelit orbit LEO`,
      `[T+00:04] [GRID] Mengunci sektor target: ${currentOp.targetLocation} (MGRS: ${currentOp.mgrs})`
    ]);

    const interval = setInterval(() => {
      const current = (Date.now() - startMs) / 1000;
      setElapsedSec(current);

      // Dynamically push realistic telemetry logs based on elapsed seconds
      if (current >= 6 && current < 7) {
        setTelemetryLogs(prev => [
          ...prev,
          `[T+00:06] [TASK] Konstelasi orbital memancarkan sinyal SAR C-Band resolusi 1m.`
        ]);
        tacticalAudio.playTacticalClick();
      }
      if (current >= 12 && current < 13) {
        setTelemetryLogs(prev => [
          ...prev,
          `[T+00:12] [FCS] Algoritma Kalman filter menghitung deviasi trajektori < 0.04 m/s.`
        ]);
      }
      if (current >= 22 && current < 23) {
        setTelemetryLogs(prev => [
          ...prev,
          `[T+00:22] [DISPATCH] Aset taktis ${currentOp.assignedUnits[1] || 'Unit Utama'} melaporkan: WEAPONS TIGHT, RADAR ACQUIRED.`
        ]);
        tacticalAudio.playRadarPing();
      }
      if (current >= 38 && current < 39) {
        setTelemetryLogs(prev => [
          ...prev,
          `[T+00:38] [INTERCEPT] Panduan terminal aktif: Pengecekan intercept point pada ketinggian optimal.`
        ]);
      }
      if (current >= 55 && current < 56) {
        setTelemetryLogs(prev => [
          ...prev,
          `[T+00:55] [IMPACT] Sensor IR mendeteksi pelepasan energi termal kinetik. Sasaran hancur/terisolasi.`
        ]);
        tacticalAudio.playCriticalAlert();
      }
      if (current >= totalDurationSec) {
        setIsCompleted(true);
        setTelemetryLogs(prev => [
          ...prev,
          `[T+${formatTime(totalDurationSec)}] [SUCCESS] BDA VERIFIED. Operasi ${currentOp.codename} selesai dengan status SUKSES 100%.`,
          `[T+${formatTime(totalDurationSec + 1)}] [AUDIT] Log audit kriptografis terkunci pada buku besar pertahanan nasional.`
        ]);
        clearInterval(interval);
      }
    }, 250);

    return () => clearInterval(interval);
  }, [isOpen, currentOp.id]);

  if (!isOpen) return null;

  // Calculate percentage
  const progressPercent = Math.min(100, Math.round((elapsedSec / totalDurationSec) * 100));

  // Determine current active stage
  let accumulatedSec = 0;
  let activeStageIndex = 0;
  for (let i = 0; i < currentOp.stages.length; i++) {
    accumulatedSec += currentOp.stages[i].durationSec;
    if (elapsedSec < accumulatedSec) {
      activeStageIndex = i;
      break;
    }
    if (i === currentOp.stages.length - 1) {
      activeStageIndex = currentOp.stages.length - 1;
    }
  }

  function formatTime(seconds: number): string {
    const s = Math.floor(seconds);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${m.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  }

  // Minimized floating HUD view
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 bg-[#07111e] border-2 border-amber-500/70 rounded-xl p-3 shadow-2xl flex items-center gap-4 text-xs font-mono animate-in slide-in-from-bottom duration-200">
        <div className="relative w-10 h-10 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle cx="20" cy="20" r="16" fill="transparent" stroke="#1e293b" strokeWidth="3" />
            <circle 
              cx="20" 
              cy="20" 
              r="16" 
              fill="transparent" 
              stroke={isCompleted ? '#10b981' : '#f59e0b'} 
              strokeWidth="3"
              strokeDasharray={100}
              strokeDashoffset={100 - progressPercent}
              className="transition-all duration-300"
            />
          </svg>
          <span className="absolute text-[10px] font-bold text-white">
            {progressPercent}%
          </span>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${isCompleted ? 'bg-emerald-400' : 'bg-amber-400 animate-ping'}`} />
            <span className="text-amber-400 font-bold uppercase tracking-wider">
              {currentOp.codename}
            </span>
          </div>
          <div className="text-slate-300 text-[11px] truncate max-w-[200px]">
            {isCompleted ? 'OPERASI SELESAI' : currentOp.stages[activeStageIndex]?.title}
          </div>
        </div>

        <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              setIsMinimized(false);
            }}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
            title="Perbesar Monitor"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
            title="Tutup Monitor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#070e19] border-2 border-amber-500/60 rounded-xl overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.25)] flex flex-col max-h-[92vh]">
        
        {/* HEADER BAR */}
        <div className="bg-[#0c1626] border-b border-[#1b2b42] px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 shrink-0">
              <Activity className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  REAL-TIME MISSION EXECUTION HUD
                </span>
                <span className="text-xs font-mono text-slate-400">
                  KODE: <strong className="text-white">{currentOp.codename}</strong>
                </span>
              </div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-wide mt-0.5">
                {currentOp.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col text-right font-mono text-xs text-slate-400">
              <span>WAKTU BERJALAN: <strong className="text-cyan-400">T+{formatTime(elapsedSec)}</strong></span>
              <span className="text-[10px] text-slate-500">ESTIMASI TOTAL: {formatTime(totalDurationSec)}</span>
            </div>

            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                setIsMinimized(true);
              }}
              className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Kecilkan ke Dock Latar Belakang"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                onClose();
              }}
              className="p-1.5 rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              title="Tutup Monitor"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MAIN BODY: 2 Columns */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* LEFT COLUMN: Progress Phases & Mission Details (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Top Mission Meta Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#091424] border border-[#16273e] p-3 rounded-lg text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">SEKTOR SASARAN</span>
                <span className="text-slate-200 font-semibold truncate block" title={currentOp.targetLocation}>
                  {currentOp.targetLocation.split('(')[0]}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">MGRS GRID</span>
                <span className="text-cyan-400 font-semibold">{currentOp.mgrs}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">OTORISATOR</span>
                <span className="text-amber-300 font-semibold truncate block" title={currentOp.operatorId}>
                  {currentOp.operatorId.split('(')[0]}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">STATUS REALISASI</span>
                <span className={`font-bold ${isCompleted ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {isCompleted ? '100% SUKSES' : `${progressPercent}% BERLANGSUNG`}
                </span>
              </div>
            </div>

            {/* MASTER PROGRESS BAR */}
            <div className="bg-[#091424] border border-[#16273e] p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300 font-bold flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  PROGRES OPERASIONAL TERINTEGRASI
                </span>
                <span className="text-amber-400 font-bold text-sm">
                  {progressPercent}%
                </span>
              </div>
              
              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-700">
                <div 
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_12px_rgba(16,185,129,0.7)]' 
                      : 'bg-gradient-to-r from-amber-500 via-rose-500 to-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.6)]'
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-1">
                <span>T+00:00 (Otorisasi)</span>
                <span>Fase Interdiksi Lapangan</span>
                <span>T+{formatTime(totalDurationSec)} (Verifikasi BDA)</span>
              </div>
            </div>

            {/* 5 OPERATIONAL STAGES TIMELINE */}
            <div className="bg-[#091424] border border-[#16273e] p-4 rounded-lg space-y-3">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                FASE OPERASI LAPANGAN (REAL-TIME STEP TRACER)
              </span>

              <div className="space-y-2.5">
                {currentOp.stages.map((stage, idx) => {
                  const isDone = activeStageIndex > idx || isCompleted;
                  const isCurrent = activeStageIndex === idx && !isCompleted;
                  const isPending = activeStageIndex < idx && !isCompleted;

                  return (
                    <div 
                      key={idx}
                      className={`p-3 rounded-lg border transition-all text-xs font-mono flex items-start gap-3 ${
                        isDone 
                          ? 'bg-emerald-950/20 border-emerald-600/40 text-slate-300' 
                          : isCurrent
                          ? 'bg-amber-950/30 border-amber-500/70 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-900/40 border-slate-800/60 text-slate-500 opacity-60'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : isCurrent ? (
                          <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] text-slate-600">
                            {idx + 1}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className={`font-bold ${isCurrent ? 'text-amber-300' : isDone ? 'text-emerald-300' : 'text-slate-400'}`}>
                            FASE {idx + 1}: {stage.title}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-400">
                            {stage.agency} · {stage.durationSec}s
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {stage.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ASSIGNED UNITS DISPOSITION */}
            <div className="bg-[#091424] border border-[#16273e] p-3.5 rounded-lg text-xs font-mono">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                UNSUR TAKTIS DIKERAHKAN & STATUS TELEMETRI
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentOp.assignedUnits.map((unit, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded bg-slate-900/70 border border-slate-800">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0" />
                    <span className="text-slate-300 text-[11px] truncate">{unit}</span>
                    <span className="ml-auto text-[9px] text-emerald-400 font-bold bg-emerald-950/40 px-1 rounded">
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Live Radar, Telemetry Log Terminal & Actions (5 cols) */}
          <div className="lg:col-span-5 space-y-4 flex flex-col">
            
            {/* TACTICAL TARGET SCANNER CANVAS */}
            <div className="bg-[#091424] border border-[#16273e] p-4 rounded-lg flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-full flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-slate-400 font-bold flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                  TERMINAL LOCK RADAR SCOPE
                </span>
                <span className="text-[10px] text-cyan-400 font-bold animate-pulse">
                  {isCompleted ? 'TARGET NEUTRALIZED' : 'BEAM LOCK ACTIVE'}
                </span>
              </div>

              {/* Circular Sweep Display */}
              <div className="relative w-48 h-48 rounded-full border border-cyan-800/60 bg-[#040b14] flex items-center justify-center shadow-inner my-2">
                {/* Crosshairs */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-full h-px bg-cyan-900/50" />
                  <div className="h-full w-px bg-cyan-900/50 absolute" />
                </div>
                {/* Range Rings */}
                <div className="absolute w-36 h-36 rounded-full border border-cyan-900/40" />
                <div className="absolute w-24 h-24 rounded-full border border-cyan-900/40" />
                <div className="absolute w-12 h-12 rounded-full border border-cyan-800/60" />

                {/* Sweeping Beam */}
                <div 
                  className="absolute inset-0 rounded-full border-r-2 border-cyan-400/80 pointer-events-none"
                  style={{
                    animation: 'spin 3s linear infinite',
                    background: 'conic-gradient(from 0deg, rgba(6,182,212,0.2) 0deg, transparent 60deg, transparent 360deg)'
                  }}
                />

                {/* Target Blip */}
                <div 
                  className={`absolute w-3.5 h-3.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                    isCompleted 
                      ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.9)]' 
                      : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.9)] animate-ping'
                  }`}
                  style={{ top: '35%', left: '58%' }}
                />

                <div className="absolute bottom-2 text-[9px] font-mono text-cyan-400/80">
                  RANGE: 34.2 NM · AZIMUTH: 042°
                </div>
              </div>
            </div>

            {/* LIVE TELEMETRY LOG TERMINAL */}
            <div className="bg-[#050a12] border border-[#16273e] p-3 rounded-lg flex-1 flex flex-col min-h-[220px]">
              <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-800 mb-2">
                <span className="text-slate-400 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-amber-400" />
                  DATA STREAM TELEMETRI TERENKRIPSI
                </span>
                <span className="text-[10px] text-slate-500">AES-256 / SHA-256</span>
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 font-mono text-[11px] text-slate-300 pr-1 max-h-[190px]">
                {telemetryLogs.map((log, index) => (
                  <div 
                    key={index}
                    className={`leading-tight ${
                      log.includes('[SUCCESS]') 
                        ? 'text-emerald-400 font-bold' 
                        : log.includes('[IMPACT]') || log.includes('[INTERCEPT]')
                        ? 'text-amber-300 font-semibold'
                        : 'text-slate-300'
                    }`}
                  >
                    {log}
                  </div>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-2 font-mono text-xs pt-1">
              {isCompleted ? (
                <div className="space-y-2">
                  <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-600/50 text-emerald-300 text-center font-bold flex items-center justify-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>OPERASI TELAH BERHASIL DIRELEASISIKAN 100%</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        tacticalAudio.playTacticalClick();
                        if (onReset) onReset();
                        setElapsedSec(0);
                        setIsCompleted(false);
                      }}
                      className="py-2.5 px-3 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Simulasi Ulang</span>
                    </button>

                    <button
                      onClick={() => {
                        tacticalAudio.playDispatchConfirm();
                        onClose();
                      }}
                      className="py-2.5 px-3 rounded bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Selesaikan & Tutup</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      setIsMinimized(true);
                    }}
                    className="py-2.5 px-3 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span>Jalankan di Background</span>
                  </button>

                  <button
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      // Fast-forward to 100%
                      setElapsedSec(totalDurationSec);
                    }}
                    className="py-2.5 px-3 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/60 text-amber-300 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Akselerasi Eksekusi</span>
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* FOOTER AUDIT BAR */}
        <div className="bg-[#050c17] border-t border-[#132236] px-4 py-2 flex items-center justify-between text-[11px] font-mono text-slate-500">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>KONSENSUS MULTI-LEMBAGA: TNI · KLHK · BAKAMLA · BSSN</span>
          </div>
          <div>
            ENCRYPTION: DILITHIUM-5 / PQC READY · TS-CLASSIFIED
          </div>
        </div>

      </div>
    </div>
  );
};
