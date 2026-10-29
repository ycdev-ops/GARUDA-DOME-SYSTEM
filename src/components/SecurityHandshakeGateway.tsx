import React, { useState, useEffect } from 'react';
import { 
  Fingerprint, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Key, 
  CheckCircle2, 
  AlertTriangle, 
  Cpu, 
  Eye, 
  Scan, 
  Radio, 
  Terminal,
  Crosshair,
  Sparkles
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';

interface SecurityHandshakeGatewayProps {
  onAuthenticated: () => void;
}

export const SecurityHandshakeGateway: React.FC<SecurityHandshakeGatewayProps> = ({
  onAuthenticated,
}) => {
  const [handshakeStep, setHandshakeStep] = useState<
    'IDLE' | 'BIOMETRIC_SCAN' | 'QUANTUM_EXCHANGE' | 'CLEARANCE_VERIFY' | 'GRANTED'
  >('IDLE');
  const [progress, setProgress] = useState(0);
  const [cipherText, setCipherText] = useState('0x00000000000000');
  const [handshakeLogs, setHandshakeLogs] = useState<string[]>([
    'SYSTEM LOCKED: Sesi pengawasan satelit militer God\'s Eye membutuhkan otentikasi biometrik terenkripsi.',
    'Protokol Keamanan: TSCM Compliant / NIST Post-Quantum Kyber-1024.',
    'Menunggu inisiasi otorisasi operator jaga...'
  ]);

  // Dynamic cipher scrambling effect
  useEffect(() => {
    const glyphs = '0123456789ABCDEF$#@%&*!<>[]{}//';
    const interval = setInterval(() => {
      let result = '0x';
      for (let i = 0; i < 14; i++) {
        result += glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      setCipherText(result);
    }, 90);
    return () => clearInterval(interval);
  }, []);

  const handleStartHandshake = () => {
    if (handshakeStep !== 'IDLE') return;

    setHandshakeStep('BIOMETRIC_SCAN');
    setProgress(15);
    tacticalAudio.playRadarPing();

    setHandshakeLogs((prev) => [
      ...prev,
      '> INTI: Memulai pemindaian biometrik sidik jari & pola retina operator...',
      '[BIOMETRIC_SCAN] Mengakuisisi data biometrik dermal 1200 DPI...'
    ]);

    // Step 2: Quantum Exchange
    setTimeout(() => {
      setHandshakeStep('QUANTUM_EXCHANGE');
      setProgress(50);
      tacticalAudio.playTacticalClick();
      setHandshakeLogs((prev) => [
        ...prev,
        '[SUCCESS] Biometrik terverifikasi: Match 99.8% (MAYOR ARYA PRADANA).',
        '> PROTOKOL: Pertukaran kunci post-quantum Kyber-1024 / SHA3-512 handshake...'
      ]);
    }, 1100);

    // Step 3: Clearance Verification
    setTimeout(() => {
      setHandshakeStep('CLEARANCE_VERIFY');
      setProgress(85);
      tacticalAudio.playRadarPing();
      setHandshakeLogs((prev) => [
        ...prev,
        '[KEY_EXCHANGE] Terowongan terenkripsi kuantum berhasil dibentuk.',
        '> OTORISASI: Memvalidasi sertifikat militer Level 5 Command Clearance...'
      ]);
    }, 2200);

    // Step 4: Granted
    setTimeout(() => {
      setHandshakeStep('GRANTED');
      setProgress(100);
      tacticalAudio.playDispatchConfirm();
      setHandshakeLogs((prev) => [
        ...prev,
        '[AUTHORIZATION GRANTED] Hak Akses Disetujui: TARAF RAHASIA / LEVEL 5.',
        '>>> MEMBUKA KONSOL SINKRONISASI SIBER GOD\'S EYE C4ISR...'
      ]);

      // Complete handshake
      setTimeout(() => {
        onAuthenticated();
      }, 700);
    }, 3100);
  };

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#060c18] via-[#091322] to-[#040812] border border-cyan-800/80 p-6 sm:p-10 shadow-[0_0_60px_rgba(6,182,212,0.15)] font-sans text-slate-200 overflow-hidden cyber-grid-scanlines">
      {/* Laser scanline sweep */}
      <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-50 animate-scanline pointer-events-none" />

      {/* Futuristic Corner Brackets */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />

      {/* Top Gateway Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-cyan-900/60 pb-6 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="tracking-widest uppercase font-bold">
              RESTRICTED DEFENSE PROTOCOL // LEVEL 5 QUANTUM GATEWAY
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
            SECURITY HANDSHAKE &amp; OTENTIKASI BIOMETRIK
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400">
              SESI TERKUNCI
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Akses ke Konsol Sinkronisasi Siber God's Eye dilindungi otentikasi bertingkat militer: pemindaian biometrik retina/sidik jari,
            pertukaran kunci enkripsi post-quantum, dan validasi izin komando pertahanan udara nasional.
          </p>
        </div>

        {/* Post-Quantum Cipher Indicator */}
        <div className="p-3 rounded-lg bg-slate-950 border border-cyan-900/80 font-mono text-xs text-right shrink-0">
          <span className="text-slate-500 block text-[10px]">CIPHER ENCRYPTION STATE:</span>
          <strong className="text-amber-400 tabular-nums">{cipherText}</strong>
          <span className="text-[10px] text-cyan-400 block mt-0.5">KYBER-1024 ARMED</span>
        </div>
      </div>

      {/* Main Grid: Biometric Target (Left) + Operator Credentials & Audit Log (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left: Interactive Biometric Scanner Target (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-xl bg-[#070e1c] border border-cyan-900/80 space-y-6 text-center shadow-inner">
          <div className="relative w-44 h-44 rounded-full border-2 border-cyan-500/40 bg-slate-950 flex items-center justify-center overflow-hidden shadow-[0_0_35px_rgba(6,182,212,0.2)]">
            {/* Concentric Scanner Rings */}
            <div className="absolute inset-3 rounded-full border border-cyan-500/20" />
            <div className="absolute inset-7 rounded-full border border-cyan-500/30 border-dashed animate-spin [animation-duration:18s]" />
            <div className="absolute inset-12 rounded-full border border-cyan-500/40" />

            {/* Crosshairs */}
            <div className="absolute inset-x-0 h-[1px] bg-cyan-500/30" />
            <div className="absolute inset-y-0 w-[1px] bg-cyan-500/30" />

            {/* Fingerprint / Biometric Mesh Icon */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              {handshakeStep === 'GRANTED' ? (
                <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
              ) : (
                <Fingerprint className={`w-16 h-16 transition-colors duration-300 ${
                  handshakeStep === 'IDLE' ? 'text-cyan-400/80' : 'text-cyan-300 animate-pulse'
                }`} />
              )}
            </div>

            {/* Vertical Moving Laser Scan Beam during scanning */}
            {handshakeStep !== 'IDLE' && handshakeStep !== 'GRANTED' && (
              <div className="absolute inset-x-0 h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-scanline pointer-events-none" />
            )}
          </div>

          {/* Handshake Progress Bar */}
          <div className="w-full space-y-1.5 font-mono text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Status Otentikasi:</span>
              <strong className={handshakeStep === 'GRANTED' ? 'text-emerald-400' : 'text-cyan-400'}>
                {handshakeStep === 'IDLE' && 'MENUNGGU INISIASI'}
                {handshakeStep === 'BIOMETRIC_SCAN' && 'MEMINDAI BIOMETRIK (35%)...'}
                {handshakeStep === 'QUANTUM_EXCHANGE' && 'PERTUKARAN KUNCI KUANTUM (65%)...'}
                {handshakeStep === 'CLEARANCE_VERIFY' && 'VERIFIKASI IZIN LEVEL 5 (85%)...'}
                {handshakeStep === 'GRANTED' && 'AKSES DISETUJUI (100%)'}
              </strong>
            </div>

            <div className="w-full h-2 rounded-full bg-slate-900 border border-cyan-950 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  handshakeStep === 'GRANTED' ? 'bg-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : 'bg-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.8)]'
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Big Trigger Handshake Button */}
          <button
            disabled={handshakeStep !== 'IDLE'}
            onClick={handleStartHandshake}
            className={`w-full py-3.5 px-5 rounded-lg font-mono text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-lg ${
              handshakeStep === 'IDLE'
                ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-950/60 hover:scale-[1.02]'
                : handshakeStep === 'GRANTED'
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-slate-800 text-slate-400 cursor-not-allowed'
            }`}
          >
            {handshakeStep === 'IDLE' ? (
              <>
                <Fingerprint className="w-4 h-4" />
                <span>INISIASI BIOMETRIC &amp; QUANTUM HANDSHAKE</span>
              </>
            ) : handshakeStep === 'GRANTED' ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>OTENTIKASI SUKSES · MEMBUKA KONSOL...</span>
              </>
            ) : (
              <>
                <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                <span>PROSES HANDSHAKE BERJALAN ({progress}%)...</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Operator Credential Card & Live Audit Terminal (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Operator Credential Badge */}
          <div className="p-4 rounded-xl bg-[#070e1c] border border-cyan-900/80 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400 font-bold uppercase">KREDENSIAL OPERATOR TERDAFTAR</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>VALIDASI IDENTITAS OK</span>
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px]">
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Nama Operator</span>
                <strong className="text-white">MAYOR ARYA P.</strong>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">ID Militer</span>
                <strong className="text-cyan-400">OP-KOPASGAT-27</strong>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Tingkat Izin</span>
                <strong className="text-amber-400">LEVEL 5 COMMAND</strong>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Stasiun Node</span>
                <strong className="text-slate-200">PUSKODAL HALIM</strong>
              </div>
            </div>
          </div>

          {/* Real-time Handshake Telemetry Audit Terminal */}
          <div className="rounded-xl bg-slate-950 border border-cyan-900/80 overflow-hidden font-mono text-xs">
            <div className="bg-[#070f1c] px-4 py-2 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-cyan-400 text-[11px] font-bold">
                <Terminal className="w-3.5 h-3.5" />
                <span>HANDSHAKE PROTOCOL STREAM // LOG AUDIT</span>
              </div>
              <span className="text-[10px] text-slate-500">PORT: 8443 / TLS 1.3</span>
            </div>

            <div className="p-4 space-y-1.5 text-[11px] max-h-48 overflow-y-auto bg-slate-950/90 leading-relaxed">
              {handshakeLogs.map((log, index) => (
                <div key={index} className="text-slate-300">
                  <span className="text-cyan-400 select-none mr-1.5">&gt;</span>
                  {log.includes('SUCCESS') || log.includes('GRANTED') ? (
                    <span className="text-emerald-400 font-bold">{log}</span>
                  ) : log.includes('LOCKED') ? (
                    <span className="text-rose-400 font-semibold">{log}</span>
                  ) : (
                    <span>{log}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
