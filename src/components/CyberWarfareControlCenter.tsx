import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  Crosshair, 
  Zap, 
  Radio, 
  Activity, 
  AlertTriangle, 
  Cpu, 
  Lock, 
  Unlock, 
  Eye, 
  Sliders, 
  Search, 
  ChevronRight, 
  Play, 
  Flame, 
  CheckCircle2, 
  Server, 
  Bug, 
  Wifi, 
  Globe, 
  Key,
  RotateCcw
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';
import { OperationRealizationData } from './RealizationProgressHUD';

interface CyberWarfareControlCenterProps {
  onTriggerOperation: (op: OperationRealizationData) => void;
}

export const CyberWarfareControlCenter: React.FC<CyberWarfareControlCenterProps> = ({
  onTriggerOperation
}) => {
  const [activePanel, setActivePanel] = useState<'MITIGASI' | 'EXPLOIT' | 'ATTACT'>('MITIGASI');
  const [activePreset, setActivePreset] = useState<'NORMAL' | 'ELEVATED' | 'CRITICAL'>('CRITICAL');

  // Canvas refs for the 3 individual live dynamic monitors
  const mitigationCanvasRef = useRef<HTMLCanvasElement>(null);
  const exploitCanvasRef = useRef<HTMLCanvasElement>(null);
  const attackCanvasRef = useRef<HTMLCanvasElement>(null);

  // Mitigation Panel State
  const [isPerimeterLocked, setIsPerimeterLocked] = useState(true);
  const [isAntiHoaxActive, setIsAntiHoaxActive] = useState(true);
  const [isKeyRotationActive, setIsKeyRotationActive] = useState(true);
  const [isVTSFailoverActive, setIsVTSFailoverActive] = useState(true);

  // Exploit Panel State
  const [scanningTarget, setScanningTarget] = useState<string>('SCADA-PLN-JAVA-BALI-500KV');
  const [identifiedCVEs, setIdentifiedCVEs] = useState<string[]>([
    'CVE-2025-4198: MODBUS TCP Boundary Desync (Severity 9.8)',
    'CVE-2026-0129: AIS NMEA-0183 Buffer Overflow in VTS Receiver (Severity 8.9)',
    'CVE-2025-8831: Satellite Telemetry Insecure Deserialization (Severity 7.5)'
  ]);

  // Attack Panel State
  const [jammingFrequency, setJammingFrequency] = useState<number>(2412); // 2.4 GHz
  const [jammingPowerWatts, setJammingPowerWatts] = useState<number>(850);
  const [isJammerTransmitting, setIsJammerTransmitting] = useState(true);

  // 1. Live dynamic monitor for MITIGASI (Packet Flow & Rumor Velocity Decay)
  useEffect(() => {
    const canvas = mitigationCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    const points: number[] = Array(60).fill(40);

    const draw = () => {
      t += 0.05;
      points.shift();
      // Simulating traffic rate & drops
      const newDrop = 35 + Math.sin(t * 3) * 15 + Math.cos(t * 5) * 8;
      points.push(newDrop);

      ctx.fillStyle = '#040914';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = '#0e1e36';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Graph
      ctx.beginPath();
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      const step = canvas.width / (points.length - 1);
      points.forEach((val, i) => {
        const y = canvas.height - (val / 80) * canvas.height;
        if (i === 0) ctx.moveTo(0, y);
        else ctx.lineTo(i * step, y);
      });
      ctx.stroke();

      // Area fill
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.12)';
      ctx.fill();

      // HUD Text
      ctx.font = '10px monospace';
      ctx.fillStyle = '#22d3ee';
      ctx.fillText(`BSSN PERIMETER DROP RATE: ${(points[points.length - 1] * 12.4).toFixed(1)} PKT/S`, 12, 18);
      ctx.fillText(`ANTI-HOAX BOT VELOCITY: DECAY 89.4% (TERKENDALI)`, 12, 32);

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [activePanel]);

  // 2. Live dynamic monitor for EXPLOIT (Memory Disassembly Hex Trace)
  useEffect(() => {
    const canvas = exploitCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const opcodes = [
      '0x7FFF8A10  MOV RAX, [RSP+0x28]',
      '0x7FFF8A15  XOR ECX, ECX',
      '0x7FFF8A17  CALL <ais_spoof_sanitize>',
      '0x7FFF8A1C  CMP RAX, 0x00FF8800',
      '0x7FFF8A22  JE  <payload_sandbox_trap>',
      '0x7FFF8A28  INT 3  ; TRAP DETECTED'
    ];

    const draw = () => {
      t += 1;
      ctx.fillStyle = '#050a14';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = '11px monospace';
      ctx.fillStyle = '#10b981';
      ctx.fillText('--- SANDBOX HEURISTIC REVERSE-ENGINEER TRACE ---', 12, 18);

      opcodes.forEach((op, idx) => {
        const offset = ((t + idx * 8) % 120);
        ctx.fillStyle = idx === 4 ? '#f43f5e' : '#94a3b8';
        ctx.fillText(op, 12, 42 + idx * 22);
      });

      // Memory usage bar
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(12, canvas.height - 24, canvas.width - 24, 12);
      ctx.fillStyle = '#059669';
      ctx.fillRect(12, canvas.height - 24, (canvas.width - 24) * 0.72, 12);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '9px monospace';
      ctx.fillText('EXPLOIT SIGNATURE MATCH: 94.2% · SCADA PROTOCOL SAFEGUARD', 16, canvas.height - 15);

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [activePanel]);

  // 3. Live dynamic monitor for ATTACT (RF Spectrum & Microwave Waterfall)
  useEffect(() => {
    const canvas = attackCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const draw = () => {
      t += 0.08;
      ctx.fillStyle = '#040711';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Spectrum RF Spikes
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const numPoints = 64;
      const step = canvas.width / numPoints;

      for (let i = 0; i < numPoints; i++) {
        let amp = Math.sin(i * 0.2 + t) * 8 + Math.random() * 6;
        // Peak at center (Jamming carrier)
        if (i >= 28 && i <= 34) {
          amp += 65 + Math.random() * 12;
        }
        const y = canvas.height - 25 - amp;
        if (i === 0) ctx.moveTo(0, y);
        else ctx.lineTo(i * step, y);
      }
      ctx.stroke();

      // Center Frequency Marker
      const center = canvas.width / 2;
      ctx.strokeStyle = '#f59e0b';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(center, 0);
      ctx.lineTo(center, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '10px monospace';
      ctx.fillStyle = '#f43f5e';
      ctx.fillText(`CARRIER: ${jammingFrequency} MHz (BAND S) · TRANSMIT: ${jammingPowerWatts}W EIRP`, 12, 18);
      ctx.fillStyle = '#fbbf24';
      ctx.fillText(`STATUS: DIRECTED MICROWAVE BEAM TRANSMITTING ON TARGET`, 12, 32);

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, [activePanel, jammingFrequency, jammingPowerWatts]);

  // Operational trigger handlers
  const handleLaunchMitigation = () => {
    tacticalAudio.playDispatchConfirm();
    onTriggerOperation({
      id: 'OP-CYBER-MITIGATION-01',
      codename: 'PERISAI SIBER KOPASGAT',
      title: 'PENETRALISIRAN KAMPANYE HOAKS POLITIK & SERANGAN VTS',
      domain: 'CYBER_DEFENSE',
      targetLocation: 'Infrastruktur VTS Selat Sunda & Bot Farm Gelap',
      mgrs: '48M XA 1982 7741',
      operatorId: 'OP-BSSN-CSIRT / KOPASGAT-27',
      authorizedAt: new Date().toLocaleTimeString('id-ID'),
      assignedUnits: [
        'BSSN National CSIRT Cyber Shield',
        'Kominfo AIS Anti-Hoax Crawler Engine',
        'Balmon Spektrum Radio Frekuensi Kelas I',
        'Puspen TNI Fact-Checking Division'
      ],
      stages: [
        {
          title: 'ISOLASI TOTAL ASN PENYERANG & SINKHOLE DNS',
          description: 'Mengalihkan lalu lintas botnet ke honeypot BSSN dan memutuskan rute BGP berbahaya.',
          durationSec: 10,
          agency: 'BSSN CSIRT'
        },
        {
          title: 'ROTASI KUNCI KRIPTOGRAFI POST-QUANTUM (KYBER-1024)',
          description: 'Melakukan re-keying serentak pada semua transponder VTS maritim dan radar udara.',
          durationSec: 15,
          agency: 'LEMSANEG / DISINFOLAHTA'
        },
        {
          title: 'PENYEBARAN NARASI COUNTER-DISINFORMASI OTOMATIS',
          description: 'Menyuntikkan verifikasi fakta resmi ke jaringan sosial dan menonaktifkan 14.200 akun bot.',
          durationSec: 20,
          agency: 'KOMINFO / PUSPEN'
        },
        {
          title: 'RESTORASI SISTEM NAVIGASI VTS SELAT SUNDA',
          description: 'Mengaktifkan sensor diferensial pelindung spoofing GPS dan memverifikasi keamanan kapal selat.',
          durationSec: 15,
          agency: 'KEMHUB / BAKAMLA'
        }
      ]
    });
  };

  const handleLaunchExploitRemediation = () => {
    tacticalAudio.playDispatchConfirm();
    onTriggerOperation({
      id: 'OP-EXPLOIT-PATCH-02',
      codename: 'ZERO-DAY HARDENING',
      title: 'INSPEKSI HEURISTIK & PATCHING ZERO-DAY SCADA CRITICAL',
      domain: 'CYBER_DEFENSE',
      targetLocation: 'Jaringan Gardu Induk 500kV PLN Java-Bali',
      mgrs: '49M YB 8821 1042',
      operatorId: 'OP-KOPASGAT-27 (Mayor Tek Arya)',
      authorizedAt: new Date().toLocaleTimeString('id-ID'),
      assignedUnits: [
        'Tim Tanggap Insiden Siber PLN C-SIRT',
        'Laboratorium Forensik Siber BSSN',
        'Unit Pertahanan Siber Mabes TNI'
      ],
      stages: [
        {
          title: 'INSPEKSI DEEP PACKET & DISASSEMBLY FIRMWARE',
          description: 'Menganalisis anomali paket MODBUS TCP dan mengidentifikasi payload zero-day.',
          durationSec: 12,
          agency: 'BSSN FORENSIK'
        },
        {
          title: 'PENERAPAN VIRTUAL PATCHING & MICRO-SEGMENTASI',
          description: 'Mengisolasi PLC pengontrol turbin pembangkit dari akses eksternal tanpa downtime.',
          durationSec: 18,
          agency: 'PLN C-SIRT'
        },
        {
          title: 'VERIFIKASI INTEGRITAS KRIPTOGRAFIS SHA-384',
          description: 'Memastikan semua firmware sistem kendali telah terverifikasi dan bersih dari malware.',
          durationSec: 15,
          agency: 'MABES TNI'
        }
      ]
    });
  };

  const handleLaunchCounterAttack = () => {
    tacticalAudio.playCriticalAlert();
    onTriggerOperation({
      id: 'OP-COUNTER-ATTACK-03',
      codename: 'GARUDA COUNTER-STRIKE',
      title: 'JAMMING SPEKTRUM ELEKTRONIK & INTERDIKSI C2 SERVER',
      domain: 'CYBER_DEFENSE',
      targetLocation: 'Satelit Komando Asing & Server Botnet C2 Luar Negeri',
      mgrs: '48N WG 9012 3341',
      operatorId: 'OP-KOPASGAT-27 (Komando Serangan Balik)',
      authorizedAt: new Date().toLocaleTimeString('id-ID'),
      assignedUnits: [
        'Satuan Radar & Perang Elektronika KOPASGAT',
        'Pusat Operasi Siber TNI (Satsiber)',
        'Balmon Frekuensi Radio Wilayah Maritim'
      ],
      stages: [
        {
          title: 'PANCARAN GELOMBANG MIKRO TERARAH (HIGH-POWER RF JAM)',
          description: 'Memancarkan 850W daya jamming pada frekuensi 2.4 GHz dan 5.8 GHz untuk memutus swarm drone.',
          durationSec: 15,
          agency: 'PEBNIKA KOPASGAT'
        },
        {
          title: 'NEUTRALISASI INFRASTRUKTUR C2 PENYERANG',
          description: 'Mengirimkan sinyal intervensi siber ofensif untuk melumpuhkan server komando musuh.',
          durationSec: 22,
          agency: 'SATSIBER TNI'
        },
        {
          title: 'PEMBERSIHAN SPEKTRUM ELEKTROMAGNETIK KAWASAN',
          description: 'Memverifikasi bahwa frekuensi navigasi sipil dan militer telah kembali aman 100%.',
          durationSec: 12,
          agency: 'KOMINFO / TNI'
        }
      ]
    });
  };

  return (
    <div className="bg-[#060c18] border border-[#14263e] rounded-xl p-4 sm:p-6 shadow-2xl space-y-6 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#14263e]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-rose-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300">
                MULTI-DOMAIN CYBER WARFARE SUITE
              </span>
              <span className="text-xs font-mono text-slate-400">
                STATUS: <strong className="text-emerald-400">AKTIF 24/7</strong>
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-0.5">
              Pusat Pertahanan Siber, Spektrum RF, &amp; Penanggulangan Hoaks Politik
            </h1>
          </div>
        </div>

        {/* 3 PANEL SELECTOR TABS */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#0a1424] border border-[#1b314d] font-mono text-xs">
          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              setActivePanel('MITIGASI');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded font-bold transition-all ${
              activePanel === 'MITIGASI'
                ? 'bg-cyan-500 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>PANEL MITIGASI</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              setActivePanel('EXPLOIT');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded font-bold transition-all ${
              activePanel === 'EXPLOIT'
                ? 'bg-amber-400 text-slate-950 shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Bug className="w-4 h-4" />
            <span>PANEL EXPLOIT</span>
          </button>

          <button
            onClick={() => {
              tacticalAudio.playCriticalAlert();
              setActivePanel('ATTACT');
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded font-bold transition-all ${
              activePanel === 'ATTACT'
                ? 'bg-rose-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Crosshair className="w-4 h-4" />
            <span>PANEL ATTACT (COUNTER)</span>
          </button>
        </div>
      </div>

      {/* PANEL 1: MITIGASI (MITIGATION) */}
      {activePanel === 'MITIGASI' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          
          {/* Left: Functional Controls & Settings (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#091322] border border-[#16273e] p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  SISTEM MITIGASI PERIMETER &amp; NARASI PUBLIK
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950/40 text-emerald-300 border border-emerald-600/40">
                  SHIELD ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                {/* Feature 1: BSSN Active Perimeter */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">BSSN Perimeter Shield</span>
                    <button
                      onClick={() => {
                        tacticalAudio.playTacticalClick();
                        setIsPerimeterLocked(!isPerimeterLocked);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isPerimeterLocked ? 'bg-emerald-600 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isPerimeterLocked ? 'LOCKED' : 'BYPASS'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Memblokir 3.420 rentang IP anomali luar negeri dan membatasi koneksi SSH/Telnet ke Obvitnas.
                  </p>
                </div>

                {/* Feature 2: Anti-Hoax Political Disinformation */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Anti-Hoax Bot Engine</span>
                    <button
                      onClick={() => {
                        tacticalAudio.playTacticalClick();
                        setIsAntiHoaxActive(!isAntiHoaxActive);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isAntiHoaxActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isAntiHoaxActive ? 'ACTIVE' : 'IDLE'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Pendeteksi disinformasi pemilu &amp; deepfake pejabat; menyiarkan counter-narrative otomatis ke 14.200 simpul.
                  </p>
                </div>

                {/* Feature 3: Quantum Key Rotation */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">Rotasi Kunci PQC Kyber</span>
                    <button
                      onClick={() => {
                        tacticalAudio.playTacticalClick();
                        setIsKeyRotationActive(!isKeyRotationActive);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isKeyRotationActive ? 'bg-emerald-600 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isKeyRotationActive ? 'SYNCED' : 'MANUAL'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Rotasi otomatis kunci kriptografi setiap 30 detik untuk semua komunikasi satelit dan radar teater.
                  </p>
                </div>

                {/* Feature 4: Maritime VTS Selat Sunda */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">VTS Selat Sunda Guard</span>
                    <button
                      onClick={() => {
                        tacticalAudio.playTacticalClick();
                        setIsVTSFailoverActive(!isVTSFailoverActive);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isVTSFailoverActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {isVTSFailoverActive ? 'ARMED' : 'OFF'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Pencegah spoofing koordinat kapal di Selat Sunda (ALKI I) dengan filter diferensial multi-stasiun.
                  </p>
                </div>
              </div>

              {/* Action Trigger Button */}
              <div className="pt-2">
                <button
                  onClick={handleLaunchMitigation}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
                >
                  <Zap className="w-4 h-4" />
                  <span>OTORISASI EKSEKUSI PROTOKOL MITIGASI NASIONAL</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Dedicated Automatic Live Monitor (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-[#091322] border border-[#16273e] p-3 rounded-xl flex flex-col h-full">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-mono text-xs">
                <span className="text-cyan-400 font-bold flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" />
                  MONITOR LIVE: THROUGHPUT &amp; SINKHOLE
                </span>
                <span className="text-[10px] text-emerald-400 font-bold">STREAM LIVE</span>
              </div>

              {/* Canvas Stream */}
              <div className="my-3 rounded-lg overflow-hidden border border-[#16273e]">
                <canvas 
                  ref={mitigationCanvasRef} 
                  width={380} 
                  height={180} 
                  className="w-full h-auto block"
                />
              </div>

              {/* Real-time stats */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">BOT HOAKS TERISOLASI</span>
                  <span className="text-white font-bold text-sm">14,280 Akun</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">TRAFIK SERANGAN DREDGE</span>
                  <span className="text-cyan-400 font-bold text-sm">24.8 Gbps</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* PANEL 2: EXPLOIT (VULNERABILITY & MALWARE ANALYZER) */}
      {activePanel === 'EXPLOIT' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          
          {/* Left: Exploit Scanning & Targets (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#091322] border border-[#16273e] p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Bug className="w-4 h-4 text-amber-400" />
                  ANALISIS CELAH KEAMANAN &amp; HEURISTIK EXPLOIT
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-950/40 text-amber-300 border border-amber-500/40">
                  DEEP SCANNING
                </span>
              </div>

              {/* Target Selector */}
              <div className="space-y-1 font-mono text-xs">
                <label className="text-slate-400 text-[11px] block">SASARAN AUDIT CELAH OBVITNAS:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'SCADA-PLN-JAVA-BALI-500KV', label: 'PLN 500kV Java-Bali Grid' },
                    { id: 'PERTAMINA-PIPELINE-PLAJU', label: 'Pertamina Pipeline Plaju' },
                    { id: 'MARITIME-VTS-SUNDA-PORTS', label: 'VTS Selat Sunda Port 10110' },
                    { id: 'PALAPA-RING-EAST-OPTIC', label: 'Palapa Ring Timur SKKL' }
                  ].map((tgt) => (
                    <button
                      key={tgt.id}
                      onClick={() => {
                        tacticalAudio.playTacticalClick();
                        setScanningTarget(tgt.id);
                      }}
                      className={`p-2.5 rounded-lg text-left border transition-all text-xs ${
                        scanningTarget === tgt.id
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {tgt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Detected Zero-Day List */}
              <div className="space-y-2 font-mono text-xs">
                <span className="text-slate-400 text-[11px] block font-bold">CVE RECENTLY ANALYZED:</span>
                <div className="space-y-1.5">
                  {identifiedCVEs.map((cve, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-900/90 border border-amber-500/30 flex items-center justify-between text-[11px]">
                      <span className="text-slate-200">{cve}</span>
                      <span className="text-amber-400 font-bold px-1.5 py-0.5 rounded bg-amber-950 border border-amber-500/40">
                        VULNERABLE
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Trigger Button */}
              <div className="pt-2">
                <button
                  onClick={handleLaunchExploitRemediation}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
                >
                  <Lock className="w-4 h-4" />
                  <span>KUNCI CELAH ZERO-DAY &amp; TERAPKAN VIRTUAL PATCHING</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Dedicated Automatic Live Monitor (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-[#091322] border border-[#16273e] p-3 rounded-xl flex flex-col h-full">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-mono text-xs">
                <span className="text-amber-400 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  MONITOR LIVE: SANDBOX DECOMPILER
                </span>
                <span className="text-[10px] text-amber-400 font-bold">SANDBOX ACTIVE</span>
              </div>

              {/* Canvas Stream */}
              <div className="my-3 rounded-lg overflow-hidden border border-[#16273e]">
                <canvas 
                  ref={exploitCanvasRef} 
                  width={380} 
                  height={180} 
                  className="w-full h-auto block"
                />
              </div>

              {/* Real-time stats */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">HEURISTIC CONFIDENCE</span>
                  <span className="text-white font-bold text-sm">96.8%</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">CVSS SCORE RATA-RATA</span>
                  <span className="text-rose-400 font-bold text-sm">8.7 KRITIS</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* PANEL 3: ATTACT / COUNTER-MEASURE (OFFENSIVE & DEFENSIVE INTERDICTION) */}
      {activePanel === 'ATTACT' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-200">
          
          {/* Left: Offensive EW Jammer & Strike Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#091322] border border-[#16273e] p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                  <Crosshair className="w-4 h-4 text-rose-500" />
                  KOMANDO SERANGAN BALIK &amp; PERANG ELEKTRONIKA (PEBNIKA)
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/50">
                  WEAPONS TIGHT
                </span>
              </div>

              <div className="space-y-3 font-mono text-xs">
                {/* Microwave Jammer Frequency Slider */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-bold">FREKUENSI JAMMING TERARAH (UAV SWARM &amp; SATELIT)</span>
                    <span className="text-rose-400 font-bold">{jammingFrequency} MHz</span>
                  </div>
                  <input
                    type="range"
                    min={433}
                    max={5850}
                    step={1}
                    value={jammingFrequency}
                    onChange={(e) => setJammingFrequency(Number(e.target.value))}
                    className="w-full accent-rose-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>433 MHz (UHF Militer)</span>
                    <span>2412 MHz (Drone ISM)</span>
                    <span>5850 MHz (FPV Video Link)</span>
                  </div>
                </div>

                {/* Jammer Power Output Slider */}
                <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-300 font-bold">OUTPUT DAYA GELOMBANG MIKRO (EIRP)</span>
                    <span className="text-amber-400 font-bold">{jammingPowerWatts} WATT</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={2000}
                    step={50}
                    value={jammingPowerWatts}
                    onChange={(e) => setJammingPowerWatts(Number(e.target.value))}
                    className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>100W (Lokal 5 KM)</span>
                    <span>1000W (Teater Sektor)</span>
                    <span>2000W (Maksimal EMP Sektor)</span>
                  </div>
                </div>
              </div>

              {/* Action Trigger Button */}
              <div className="pt-2">
                <button
                  onClick={handleLaunchCounterAttack}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl cursor-pointer transition-all"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>OTORISASI TRANSMISI SERANGAN BALIK ELEKTRONIKA</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right: Dedicated Automatic Live Monitor (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <div className="bg-[#091322] border border-[#16273e] p-3 rounded-xl flex flex-col h-full">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 font-mono text-xs">
                <span className="text-rose-400 font-bold flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5" />
                  MONITOR LIVE: SPEKTRUM BALMON RF
                </span>
                <span className="text-[10px] text-rose-400 font-bold animate-pulse">TRANSMITTING</span>
              </div>

              {/* Canvas Stream */}
              <div className="my-3 rounded-lg overflow-hidden border border-[#16273e]">
                <canvas 
                  ref={attackCanvasRef} 
                  width={380} 
                  height={180} 
                  className="w-full h-auto block"
                />
              </div>

              {/* Real-time stats */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">DRONE SWARM DISRUPTED</span>
                  <span className="text-white font-bold text-sm">12 / 12 Unit</span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block">AZIMUTH BEAM ANTENA</span>
                  <span className="text-amber-400 font-bold text-sm">184° SELATAN</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
