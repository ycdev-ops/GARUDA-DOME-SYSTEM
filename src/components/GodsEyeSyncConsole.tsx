import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  RefreshCw, 
  Radio, 
  Satellite, 
  ShieldAlert, 
  Terminal, 
  Wifi, 
  Zap, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Play, 
  Pause, 
  Download, 
  Sliders, 
  Clock, 
  Compass,
  Crosshair,
  Lock,
  Layers,
  Sparkles,
  Flame,
  Binary
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';
import { SecurityHandshakeGateway } from './SecurityHandshakeGateway';

interface SensorFeedSync {
  id: string;
  name: string;
  type: 'SATELIT_ORBIT' | 'RADAR_PANTAI' | 'AIS_MARITIM' | 'AKUSTIK_HUTAN' | 'SIGINT_ESM' | 'BSSN_CYBER';
  status: 'SYNCED' | 'SYNCING' | 'DEGRADED';
  downlinkRateMBps: number;
  latencyMs: number;
  packetsPerSec: number;
  lastSyncTime: string;
  frequencyBand: string;
  coverageSector: string;
  rawPayloadSnippet: string;
  cipherHash: string;
}

interface SatelliteOrbitTracker {
  satelliteName: string;
  noradId: number;
  orbitalType: string;
  currentOverhead: string;
  elevationDeg: number;
  azimuthDeg: number;
  nextPassMinutes: number;
  sensorPayload: string;
  downlinkStatus: 'LOCKED' | 'ACQUIRING' | 'STANDBY';
}

const INITIAL_FEEDS: SensorFeedSync[] = [
  {
    id: 'FEED-SAT-01',
    name: 'Konstelasi Satelit Sentinel-1 SAR & Gaofen-3 (C-Band Radar)',
    type: 'SATELIT_ORBIT',
    status: 'SYNCED',
    downlinkRateMBps: 340.5,
    latencyMs: 38,
    packetsPerSec: 4250,
    lastSyncTime: '14:48:12 WIB',
    frequencyBand: '5.405 GHz (C-Band SAR)',
    coverageSector: 'Laut Natuna Utara & Jantung Borneo',
    rawPayloadSnippet: 'RAW_SAR_COH: [0x7F4A...B2] DELTA_COH: -0.84 HA: 84.6',
    cipherHash: '0x8F94A2D091BC47'
  },
  {
    id: 'FEED-RAD-02',
    name: 'Jaringan Radar Pantai Terpadu IMSS Bakamla & Satrad Kosek',
    type: 'RADAR_PANTAI',
    status: 'SYNCED',
    downlinkRateMBps: 185.2,
    latencyMs: 12,
    packetsPerSec: 3120,
    lastSyncTime: '14:48:15 WIB',
    frequencyBand: '2.9 - 3.1 GHz (S-Band Terestrial)',
    coverageSector: 'ALKI I, II, III & Selat Malaka',
    rawPayloadSnippet: 'RADAR_TRACK: ID_7729 AZIM: 042° RANGE: 38.4NM VEL: 3.8KTS',
    cipherHash: '0x44CE01FF391A80'
  },
  {
    id: 'FEED-AIS-03',
    name: 'Transponder AIS Satelit & Stasiun VTS Perhubungan Laut',
    type: 'AIS_MARITIM',
    status: 'SYNCED',
    downlinkRateMBps: 64.8,
    latencyMs: 18,
    packetsPerSec: 1840,
    lastSyncTime: '14:48:10 WIB',
    frequencyBand: '161.975 / 162.025 MHz (VHF Ch 87B/88B)',
    coverageSector: 'Seluruh ZEE & WPPNRI 711-718',
    rawPayloadSnippet: '!AIVDM,1,1,,B,15M67`0000G?w>rF;f@e:wwn0000,0*1E',
    cipherHash: '0x1B89AC044EE129'
  },
  {
    id: 'FEED-BIO-04',
    name: 'Acoustic Guardian Biofonik TN Bukit Baka & Lorentz',
    type: 'AKUSTIK_HUTAN',
    status: 'SYNCED',
    downlinkRateMBps: 28.4,
    latencyMs: 45,
    packetsPerSec: 890,
    lastSyncTime: '14:48:08 WIB',
    frequencyBand: '433 MHz LoRa Mesh -> Satelit LEO',
    coverageSector: 'Taman Nasional & Hutan Lindung Konservasi',
    rawPayloadSnippet: 'FFT_PEAK: 2450Hz MAG: 89dB CONF: 0.98 CLASS: CHAINSAW_STIHL',
    cipherHash: '0x9071BB834F10AA'
  },
  {
    id: 'FEED-SIG-05',
    name: 'Sensor Spektrum Balmon Kominfo & ESM Militer',
    type: 'SIGINT_ESM',
    status: 'SYNCED',
    downlinkRateMBps: 120.0,
    latencyMs: 24,
    packetsPerSec: 2150,
    lastSyncTime: '14:48:14 WIB',
    frequencyBand: '10 MHz - 18 GHz Wideband Scanner',
    coverageSector: 'Perbatasan Darat Entikong & Selat Malaka',
    rawPayloadSnippet: 'SIGINT_DETECT: BURST_HF 14.120MHz EMCON_VIOLATION_CONFIRMED',
    cipherHash: '0xEE098311B9FA44'
  },
  {
    id: 'FEED-CYB-06',
    name: 'BSSN Cyber Threat Intelligence & National Honeynet SOC',
    type: 'BSSN_CYBER',
    status: 'SYNCED',
    downlinkRateMBps: 410.2,
    latencyMs: 8,
    packetsPerSec: 6890,
    lastSyncTime: '14:48:16 WIB',
    frequencyBand: 'IP Encrypted TLS 1.3 / Quantum Shield',
    coverageSector: 'SCADA Pelabuhan Vital & Jaringan Komando TNI',
    rawPayloadSnippet: 'BSSN_ALERT: DDOS_MITIGATED IP_SRC_FOREIGN_SPOOF_BLOCK',
    cipherHash: '0x66FF309B74201C'
  }
];

const ORBITAL_SATELLITES: SatelliteOrbitTracker[] = [
  {
    satelliteName: 'Sentinel-1A (ESA/SAR Radar)',
    noradId: 39634,
    orbitalType: 'Sun-Synchronous LEO (693 km)',
    currentOverhead: 'Kalimantan Tengah / Selat Karimata',
    elevationDeg: 68.4,
    azimuthDeg: 142.1,
    nextPassMinutes: 18,
    sensorPayload: 'C-SAR All-Weather Coherence',
    downlinkStatus: 'LOCKED'
  },
  {
    satelliteName: 'Gaofen-3C (Civil/Marine SAR)',
    noradId: 52184,
    orbitalType: 'Polar LEO (755 km)',
    currentOverhead: 'Laut Natuna Utara (Blok D-Alpha)',
    elevationDeg: 74.2,
    azimuthDeg: 28.5,
    nextPassMinutes: 6,
    sensorPayload: '1m Multi-Polarization Radar',
    downlinkStatus: 'LOCKED'
  },
  {
    satelliteName: 'PlanetScope Dove-2481',
    noradId: 48920,
    orbitalType: 'LEO Constellation (475 km)',
    currentOverhead: 'Taman Nasional Lorentz, Papua',
    elevationDeg: 52.8,
    azimuthDeg: 210.4,
    nextPassMinutes: 34,
    sensorPayload: '3m 8-Band Optical Multispectral',
    downlinkStatus: 'LOCKED'
  },
  {
    satelliteName: 'Terra / Aqua MODIS (NASA/BMKG)',
    noradId: 25994,
    orbitalType: 'LEO Polar (705 km)',
    currentOverhead: 'Sumatera Bagian Selatan & Selat Sunda',
    elevationDeg: 61.0,
    azimuthDeg: 185.0,
    nextPassMinutes: 52,
    sensorPayload: 'Thermal 375m FRP Wildfire Tracker',
    downlinkStatus: 'LOCKED'
  }
];

// Random cipher character generator
const CIPHER_GLYPHS = '0123456789ABCDEF$#@%&*!<>[]{}//';

export const GodsEyeSyncConsole: React.FC = () => {
  const [feeds, setFeeds] = useState<SensorFeedSync[]>(INITIAL_FEEDS);
  const [isGlobalSyncing, setIsGlobalSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(100);
  const [activeSyncMode, setActiveSyncMode] = useState<'SAT_LEO' | 'HYBRID_FIBER' | 'STEALTH_HF'>('SAT_LEO');
  const [enableGlitchFX, setEnableGlitchFX] = useState(true);
  const [isGlitchingNow, setIsGlitchingNow] = useState(false);
  const [isSessionAuthenticated, setIsSessionAuthenticated] = useState(false);

  // Shifting cipher string state
  const [shiftingTelemetry, setShiftingTelemetry] = useState('0x8F94A2D091BC47');
  const [quantumKeyRotation, setQuantumKeyRotation] = useState(42);

  // Real-time streaming raw logs
  const [packetStream, setPacketStream] = useState<string[]>([
    '[14:48:10.102] GODSEYE_CORE: Uplink Satelit LEO terenkripsi aktif pada frekuensi 5.405 GHz.',
    '[14:48:11.450] INGEST_SAR: Sentinel-1 Pass 142 terverifikasi. Delta koherensi kanopi 84.6 Ha dikirim ke Modul 9.',
    '[14:48:12.890] INGEST_IMSS: Radar Pantai Ranai sinkron. Kontak metalik non-AIS terverifikasi pada 4.82°N, 108.75°E.',
    '[14:48:13.340] INGEST_AIS: 3.420 kapal komersial aktif disinkronkan ke layer ALKI I-III.',
    '[14:48:14.210] BSSN_INTELL: Injeksi paket spoofing GPS pada VTS Batam berhasil dinetralisir oleh firewall militer.',
    '[14:48:15.980] EDGE_SYNC: Ranai Edge Node sinkron penuh. Jitter lokal 12ms. Model AI: GarudaBrain-Maritime v3.2.'
  ]);
  const [isStreamingPaused, setIsStreamingPaused] = useState(false);

  // High-Speed Hex Dump Waterfall
  const [hexWaterfall, setHexWaterfall] = useState<string[]>([
    '0x00A0: 47 44 53 2D 53 59 4E 43  30 33 2D 4E 54 4E 20 41 | GDS-SYNC03-NTN A',
    '0x00B0: 89 50 4E 47 0D 0A 1A 0A  00 00 00 0D 49 48 44 52 | .PNG........IHDR',
    '0x00C0: 1F 8B 08 00 00 00 00 00  00 03 8D 93 4B 6E C3 30 | ............Kn.0',
    '0x00D0: 53 45 4E 54 49 4E 45 4C  2D 31 5F 53 41 52 5F 43 | SENTINEL-1_SAR_C',
    '0x00E0: 42 53 53 4E 5F 51 55 41  4E 54 55 4D 5F 4B 45 59 | BSSN_QUANTUM_KEY',
    '0x00F0: 77 92 A1 04 F1 99 22 18  AA 42 19 00 23 FF 98 4A | w....."..B..#..J'
  ]);

  // Interactive Command Line Terminal
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<string[]>([
    'GARUDA DOME SYSTEM // GOD\'S EYE CYBER WARFARE SYNC MATRIX v3.8.2',
    'Hak Akses Terverifikasi: PUSAT OPERASI SIBER & PERTAHANAN KEPULAUAN (PUSKODAL)',
    'Enkripsi Kuantum: ON // Real-time Neural Decryption Stream: ARMED'
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Shifting Hex Cipher Effect
  useEffect(() => {
    const cipherInterval = setInterval(() => {
      let scrambled = '0x';
      for (let i = 0; i < 14; i++) {
        scrambled += CIPHER_GLYPHS[Math.floor(Math.random() * CIPHER_GLYPHS.length)];
      }
      setShiftingTelemetry(scrambled);
    }, 120);

    return () => clearInterval(cipherInterval);
  }, []);

  // Quantum Key Rotation Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setQuantumKeyRotation((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // High-Speed Hex Waterfall Generator
  useEffect(() => {
    if (isStreamingPaused) return;
    const hexInterval = setInterval(() => {
      const hexAddrs = ['0x00A0', '0x00B0', '0x00C0', '0x00D0', '0x00E0', '0x00F0', '0x01A0', '0x01B0'];
      const pickAddr = hexAddrs[Math.floor(Math.random() * hexAddrs.length)];
      let hexBytes = '';
      for (let i = 0; i < 16; i++) {
        const byte = Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0');
        hexBytes += byte + ' ';
      }
      const newHexLine = `${pickAddr}: ${hexBytes.slice(0, 23)}  ${hexBytes.slice(24)} | Q-HASH[${Math.floor(Math.random() * 9999)}]`;
      setHexWaterfall((prev) => [newHexLine, ...prev.slice(0, 5)]);
    }, 450);

    return () => clearInterval(hexInterval);
  }, [isStreamingPaused]);

  // Occasional Micro-Glitch Trigger
  useEffect(() => {
    if (!enableGlitchFX) return;
    const glitchTimer = setInterval(() => {
      if (Math.random() > 0.6) {
        setIsGlitchingNow(true);
        setTimeout(() => setIsGlitchingNow(false), 350);
      }
    }, 7000);

    return () => clearInterval(glitchTimer);
  }, [enableGlitchFX]);

  // Periodic Simulated Packet Feed
  useEffect(() => {
    if (isStreamingPaused) return;
    const interval = setInterval(() => {
      const time = new Date().toLocaleTimeString('id-ID');
      const randomSensors = [
        `[${time}] INGEST_SAR: Pass Gaofen-3C mengunci koordinat ZEE Natuna Blok D-Alpha. Resolusi 1.0m.`,
        `[${time}] INGEST_BIO: Sensor Biofonik TN Bukit Baka melaporkan frekuensi akustik 2.45 kHz stabil.`,
        `[${time}] INGEST_AIS: MMSI 525001920 KRI RE Martadinata-331 mengirim pembaruan posisi Selat Makassar.`,
        `[${time}] INGEST_RADAR: Radar MSSR Pekanbaru mengonfirmasi koridor udara ADIZ Sektor I bebas anomali baru.`,
        `[${time}] SOC_METRIC: Scrubbing traffic filter BSSN mencatat penurunan ancaman DDoS menjadi 12 Gbps.`,
        `[${time}] CYBER_INTERCEPT: Sinyal spoofing frekuensi 161.975 MHz dinetralisir stasiun Balmon Batam.`
      ];
      const pick = randomSensors[Math.floor(Math.random() * randomSensors.length)];
      setPacketStream((prev) => [pick, ...prev.slice(0, 19)]);
    }, 3800);

    return () => clearInterval(interval);
  }, [isStreamingPaused]);

  // Auto-scroll terminal
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [cliHistory]);

  // Action: Force Global Resync with Glitch Shockwave
  const handleForceGlobalSync = () => {
    setIsGlobalSyncing(true);
    setSyncProgress(0);
    setIsGlitchingNow(true);
    tacticalAudio.playCriticalAlert();

    setFeeds((prev) => prev.map((f) => ({ ...f, status: 'SYNCING' })));

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setSyncProgress(current);

      if (current === 60) {
        tacticalAudio.playRadarPing();
        setIsGlitchingNow(true);
      }

      if (current >= 100) {
        clearInterval(interval);
        setIsGlobalSyncing(false);
        setIsGlitchingNow(false);
        tacticalAudio.playDispatchConfirm();
        const now = new Date().toLocaleTimeString('id-ID') + ' WIB';

        setFeeds((prev) =>
          prev.map((f) => ({
            ...f,
            status: 'SYNCED',
            lastSyncTime: now,
            packetsPerSec: Math.floor(f.packetsPerSec * (0.95 + Math.random() * 0.15)),
            downlinkRateMBps: parseFloat((f.downlinkRateMBps * (0.98 + Math.random() * 0.05)).toFixed(1)),
            cipherHash: '0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0') + 'FF'
          }))
        );

        setCliHistory((prev) => [
          ...prev,
          `\n> EXEC: sys.sync --force-global --cyber-matrix`,
          `[CYBER-WARFARE SYNC COMPLETED] 6 SENSOR FEEDS RE-SEEDED AT ${now}`,
          `[TELEMETRY] QUANTUM ENCRYPTION LOCKED · 0 PACKET SPOOF DETECTED`
        ]);
      }
    }, 380);
  };

  // Action: Single Feed Resync
  const handleResyncSingleFeed = (feedId: string) => {
    tacticalAudio.playRadarPing();
    setFeeds((prev) =>
      prev.map((f) => {
        if (f.id === feedId) {
          return { ...f, status: 'SYNCING' };
        }
        return f;
      })
    );

    setTimeout(() => {
      tacticalAudio.playTacticalClick();
      const now = new Date().toLocaleTimeString('id-ID') + ' WIB';
      setFeeds((prev) =>
        prev.map((f) => {
          if (f.id === feedId) {
            return {
              ...f,
              status: 'SYNCED',
              lastSyncTime: now,
              downlinkRateMBps: parseFloat((f.downlinkRateMBps * (1.02 + Math.random() * 0.05)).toFixed(1)),
              cipherHash: '0x' + Math.floor(Math.random() * 16777215).toString(16).toUpperCase().padStart(6, '0') + 'AA'
            };
          }
          return f;
        })
      );
    }, 800);
  };

  // CLI Command Executor
  const handleExecuteCli = (cmdToRun?: string) => {
    const raw = cmdToRun !== undefined ? cmdToRun : cliInput;
    if (!raw.trim()) return;

    tacticalAudio.playTacticalClick();
    const cmd = raw.trim().toLowerCase();

    let output = '';

    if (cmd === 'help') {
      output = `PERINTAH CYBER WARFARE TERSEDIA:\n- status : Tampilkan status feed, enkripsi kuantum, dan throughput\n- sync --all : Paksa sinkronisasi total dengan gelombang enkripsi baru\n- scan --dark : Pindai anomali kapal dark vessel non-AIS di ZEE Natuna\n- decrypt --stream : Uji algoritma desifring paket frekuensi tinggi\n- orbit --track : Perbarui lintasan overhead satelit SAR Sentinel-1\n- probe --node=ranai : Uji latensi dan inferensi Edge Node Ranai\n- clear : Bersihkan layar terminal`;
    } else if (cmd === 'status') {
      output = `CYBER WARFARE GRID HEALTH:\n- Uplink Satelit LEO: 340.5 MB/s (LOCKED)\n- Radar Pesisir IMSS: 12ms Ping (OPTIMAL)\n- Quantum Key State: VALID (Rotation in ${quantumKeyRotation}s)\n- Firewall BSSN: ZERO BREACH · ENCRYPT: AES-256-GCM`;
    } else if (cmd === 'sync --all') {
      handleForceGlobalSync();
      output = `Menginisiasi protokol sinkronisasi siber total...`;
    } else if (cmd === 'scan --dark') {
      output = `MEMINDAI RADAR SAR DI ZEE NATUNA UTARA...\n[TARGET IDENTIFIED] 4 Lambung Baja Trawler Tanpa AIS pada 4.82°N, 108.75°E.\n[CONFIDENCE] 97.8% Pair Trawling terlarang. Disposisi KRI Bung Tomo-357 siap dieksekusi.`;
    } else if (cmd === 'decrypt --stream') {
      setIsGlitchingNow(true);
      setTimeout(() => setIsGlitchingNow(false), 500);
      output = `DESIFRING STREAM DATA MILITER...\n[KEY] ROT-47 QUANTUM SHAKE: 0x99FF4A32\n[DECRYPTED] FLIGHT_PLAN: UNKNOWN_TRACK_FL360_540KTS_INTERCEPT_READY`;
    } else if (cmd === 'orbit --track') {
      output = `ORBITAL SATELLITE STATUS:\n- Sentinel-1A: Melintas Selat Karimata (Elev: 68.4°)\n- Gaofen-3C: Melintas Natuna Utara (Downlink LOCKED)\n- Pass Berikutnya: 6 Menit`;
    } else if (cmd === 'probe --node=ranai') {
      output = `PROBING EDGE NODE RANAI NATUNA (GDS-EDGE-NTN)...\n[PING] 14ms (via Satelit LEO)\n[CPU LOAD] 34% (Dual TPU Ruggedized)\n[LOCAL INFERENCE] GarudaBrain-Maritime v3.2.1 NOMINAL`;
    } else if (cmd === 'clear') {
      setCliHistory([]);
      setCliInput('');
      return;
    } else {
      output = `Perintah "${raw}" tidak dikenali. Ketik "help" untuk melihat daftar perintah yang didukung.`;
    }

    setCliHistory((prev) => [
      ...prev,
      `GDS-GODSEYE://root# ${raw}`,
      output
    ]);
    setCliInput('');
  };

  if (!isSessionAuthenticated) {
    return (
      <SecurityHandshakeGateway
        onAuthenticated={() => {
          setIsSessionAuthenticated(true);
        }}
      />
    );
  }

  return (
    <div className={`space-y-6 ${isGlitchingNow && enableGlitchFX ? 'animate-glitch' : ''}`}>
      {/* Top Banner God's Eye C4ISR Header with Glitch & Scanline Effect */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/70 p-6 shadow-2xl cyber-grid-scanlines">
        {/* Animated scanline bar */}
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60 animate-scanline pointer-events-none" />

        {/* Futuristic corner brackets */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono mb-2">
              <Eye className="w-4 h-4 animate-pulse text-cyan-300" />
              <span className="tracking-widest uppercase font-bold">GOD'S EYE C4ISR // REAL-TIME CYBER WARFARE SYNC MATRIX</span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400 font-mono">Q-KEY ROTATION: 00:{quantumKeyRotation.toString().padStart(2, '0')}</span>
            </div>
            
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-3">
              <span className={isGlitchingNow ? 'text-rose-400' : 'text-white'}>
                KONSOL SINKRONISASI SIBER & ORBITAL GOD'S EYE
              </span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                ACTIVE GRID LOCK
              </span>
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Pusat orkestrasi integrasi data berkecepatan tinggi: menyinkronkan feed konstelasi satelit LEO SAR, 
              radar maritim pesisir, AIS armada laut, sensor biofonik rimba, dan perisai pertahanan siber BSSN dalam satu matriks kedaulatan waktu-nyata.
            </p>
          </div>

          {/* Primary Action Controls with Glitch Toggle */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {/* Lock Session Action */}
            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                setIsSessionAuthenticated(false);
              }}
              className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded border border-rose-500/40 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-mono text-xs transition-colors cursor-pointer"
              title="Kunci sesi dan kembali ke gerbang autentikasi biometrik"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>KUNCI SESI</span>
            </button>

            {/* Glitch Effect Toggle */}
            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                setEnableGlitchFX(!enableGlitchFX);
              }}
              className={`px-3 py-2.5 rounded border text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer ${
                enableGlitchFX
                  ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                  : 'border-slate-800 text-slate-500 hover:text-white bg-slate-950'
              }`}
              title="Aktifkan / Matikan Efek Glitch Visual"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Glitch FX: {enableGlitchFX ? 'ON' : 'OFF'}</span>
            </button>

            {/* Global Sync Trigger */}
            <button
              disabled={isGlobalSyncing}
              onClick={handleForceGlobalSync}
              className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-950/60 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGlobalSyncing ? 'animate-spin' : ''}`} />
              <span>{isGlobalSyncing ? `SINKRONISASI BERJALAN (${syncProgress}%)...` : 'PAKSA SINKRONISASI TOTAL (RESYNC)'}</span>
            </button>
          </div>
        </div>

        {/* Global Sync Progress Bar */}
        {isGlobalSyncing && (
          <div className="w-full h-1.5 rounded-full bg-slate-900 border border-cyan-900 overflow-hidden mt-4">
            <div
              className="h-full bg-cyan-400 transition-all duration-300 shadow-[0_0_14px_rgba(6,182,212,0.9)]"
              style={{ width: `${syncProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Real-time Shifting Cipher & Waterfall HUD Ribbon */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-bold">
            <Binary className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>DECRYPTING CIPHER:</span>
            <span className="text-amber-400 tabular-nums">{shiftingTelemetry}</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>SNR: 38.4 dB</span>
            <span className="text-slate-600">·</span>
            <span>ENCRYPT: AES-256-GCM / POST-QUANTUM KYBER</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-400">Throughput: <strong className="text-cyan-400 tabular-nums">1.149,1 MB/s</strong></span>
          <span className="text-slate-600">·</span>
          <span className="text-slate-400">Laju Injeksi: <strong className="text-amber-400 tabular-nums">19.140 pkt/s</strong></span>
        </div>
      </div>

      {/* Main Grid: 6 Active Sensor Feeds with Shifting Cipher Hashes */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            Matriks Sinkronisasi Multi-Sensor Aktif (6 Feeds)
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Integrasi Waktu-Nyata Berbasis Standar Link-Y & STANAG 4586
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {feeds.map((feed) => {
            const isSyncing = feed.status === 'SYNCING';
            return (
              <div
                key={feed.id}
                className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between space-y-3 shadow-lg group relative overflow-hidden"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-amber-400 font-bold">{feed.id}</span>
                    <span className={`px-2 py-0.5 rounded border text-[10px] font-bold flex items-center gap-1 ${
                      isSyncing ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    }`}>
                      {isSyncing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3 h-3" />}
                      <span>{feed.status}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug mb-1">
                    {feed.name}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono block mb-2">
                    Cakupan: {feed.coverageSector}
                  </span>
                </div>

                {/* Telemetry Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800/80">
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Data Downlink</span>
                    <strong className="text-cyan-400 tabular-nums">{feed.downlinkRateMBps} MB/s</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Latensi Ping</span>
                    <strong className="text-emerald-400 tabular-nums">{feed.latencyMs} ms</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Paket per Detik</span>
                    <strong className="text-slate-200 tabular-nums">{feed.packetsPerSec.toLocaleString()} pkt/s</strong>
                  </div>
                  <div className="p-2 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Hash Kripto</span>
                    <strong className="text-amber-300 font-mono">{feed.cipherHash}</strong>
                  </div>
                </div>

                {/* Raw Payload Snippet with Shifting Glyph Decrypt */}
                <div className="p-2 rounded bg-slate-950 border border-slate-800/80 font-mono text-[11px] text-slate-400 truncate">
                  <span className="text-slate-500 block text-[9px]">RAW SENSOR TELEMETRY:</span>
                  <code className="text-cyan-300 truncate block">{feed.rawPayloadSnippet}</code>
                </div>

                {/* Action: Resync This Feed */}
                <button
                  disabled={isSyncing}
                  onClick={() => handleResyncSingleFeed(feed.id)}
                  className="w-full py-1.5 px-3 rounded bg-slate-800 hover:bg-slate-700 text-xs font-mono font-medium text-slate-200 transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-amber-400' : ''}`} />
                  <span>{isSyncing ? 'Menyinkronkan...' : 'Sinkronkan Ulang Feed Ini'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Middle Split: Hex Waterfall Stream & Orbital Satellite Tracker */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Real-time Hexadecimal Data Stream Waterfall (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Raw Hexadecimal Data Stream Waterfall
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Aliran paket heksadesimal mentah terdesifring real-time
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs text-emerald-400 font-mono font-bold">STREAM LIVE</span>
            </div>
          </div>

          {/* Hex Stream Display */}
          <div className="bg-slate-950 rounded border border-slate-800 p-3.5 font-mono text-[11px] space-y-1.5 overflow-hidden">
            {hexWaterfall.map((line, idx) => (
              <div key={idx} className="leading-tight text-slate-300 font-mono truncate">
                <span className="text-emerald-400">{line.slice(0, 7)}</span>
                <span className="text-cyan-300">{line.slice(7, 32)}</span>
                <span className="text-amber-300">{line.slice(32)}</span>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-1 border-t border-slate-800/80">
            <span>Algoritma: ChaCha20-Poly1305</span>
            <span className="text-cyan-400">Memory Buffer: 2.048 KB / DMA Direct</span>
          </div>
        </div>

        {/* Orbital Satellite Tracking Monitor (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                <Satellite className="w-4 h-4 text-cyan-400" />
                Pelacak Orbit Satelit Penginderaan Jauh (GEOINT Live)
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Prediksi lintasan orbit overhead di atas kepulauan Indonesia
              </span>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-bold">
              4 KONSTELASI TERKUNCI
            </span>
          </div>

          <div className="space-y-2.5">
            {ORBITAL_SATELLITES.map((sat) => (
              <div
                key={sat.noradId}
                className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono space-y-1.5 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <strong className="text-white font-sans text-xs block">{sat.satelliteName}</strong>
                    <span className="text-[10px] text-slate-400">NORAD #{sat.noradId} · {sat.orbitalType}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                    {sat.downlinkStatus}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1.5 border-t border-slate-800/60 text-[10px]">
                  <div>
                    <span className="text-slate-500 block">Posisi Melintas</span>
                    <strong className="text-slate-200">{sat.currentOverhead}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Elevasi/Azimuth</span>
                    <strong className="text-cyan-400">{sat.elevationDeg}° / {sat.azimuthDeg}°</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Pass Berikutnya</span>
                    <strong className="text-amber-400">{sat.nextPassMinutes} Menit</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Sensor Payload</span>
                    <strong className="text-slate-200">{sat.sensorPayload}</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Cyber Warfare Command CLI Shell */}
      <div className="bg-slate-950 border border-cyan-800/80 rounded-xl overflow-hidden shadow-2xl font-mono text-xs">
        {/* Terminal Title Bar */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-bold">GDS-GODSEYE CYBER WARFARE COMMAND INTERACTOR // SHELL v3.8</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-400 text-[11px]">SSH-SECURE TUNNEL OPEN · SHIFTING CIPHER ACTIVE</span>
          </div>
        </div>

        {/* Quick Command Buttons */}
        <div className="bg-slate-900/60 px-4 py-2 border-b border-slate-800 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="text-slate-400 font-bold">Perintah Cepat:</span>
          {[
            { label: 'status', cmd: 'status' },
            { label: 'sync --all', cmd: 'sync --all' },
            { label: 'scan --dark', cmd: 'scan --dark' },
            { label: 'decrypt --stream', cmd: 'decrypt --stream' },
            { label: 'orbit --track', cmd: 'orbit --track' },
            { label: 'probe --node=ranai', cmd: 'probe --node=ranai' },
            { label: 'clear', cmd: 'clear' },
          ].map((quick) => (
            <button
              key={quick.cmd}
              onClick={() => handleExecuteCli(quick.cmd)}
              className="px-2.5 py-0.5 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 border border-slate-700 transition-colors cursor-pointer"
            >
              {quick.label}
            </button>
          ))}
        </div>

        {/* Terminal Scroll Content */}
        <div className="p-4 bg-slate-950 max-h-56 overflow-y-auto space-y-1.5 text-slate-300 font-mono">
          {cliHistory.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap leading-relaxed">
              {line.startsWith('GDS-GODSEYE') ? (
                <span className="text-cyan-400 font-bold">{line}</span>
              ) : line.includes('[CYBER-WARFARE') || line.includes('OPERASIONAL') || line.includes('VALID') ? (
                <span className="text-emerald-400 font-bold">{line}</span>
              ) : line.includes('TARGET IDENTIFIED') || line.includes('ALERT') ? (
                <span className="text-rose-400 font-bold">{line}</span>
              ) : line.includes('DESIFRING') || line.includes('DECRYPTED') ? (
                <span className="text-amber-300 font-bold">{line}</span>
              ) : (
                <span className="text-slate-300">{line}</span>
              )}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Prompt */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecuteCli();
          }}
          className="bg-slate-900/90 border-t border-slate-800 px-4 py-3 flex items-center gap-2"
        >
          <span className="text-cyan-400 font-bold">GDS-GODSEYE://root#</span>
          <input
            type="text"
            value={cliInput}
            onChange={(e) => setCliInput(e.target.value)}
            placeholder="Ketik perintah taktis (misal: 'status', 'scan --dark', 'decrypt --stream', 'sync --all') lalu tekan Enter..."
            className="flex-1 bg-transparent text-white placeholder-slate-500 focus:outline-none font-mono text-xs"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded transition-colors text-xs cursor-pointer"
          >
            Eksekusi
          </button>
        </form>
      </div>
    </div>
  );
};
