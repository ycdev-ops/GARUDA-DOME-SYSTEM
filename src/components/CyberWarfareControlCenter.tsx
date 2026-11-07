import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Archive,
  ArrowRight,
  BadgeCheck,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Eye,
  FileSearch,
  Fingerprint,
  Globe2,
  KeyRound,
  LockKeyhole,
  MapPin,
  Network,
  Radio,
  RefreshCw,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Siren,
  Terminal,
  Users,
  X,
  Zap,
} from 'lucide-react';
import type { OperationRealizationData } from './RealizationProgressHUD';

interface CyberWarfareControlCenterProps {
  /** Compatibility with the parent app. This mock console never dispatches real operations. */
  onTriggerOperation?: (op: OperationRealizationData) => void;
}

type Phase = 'PEMANTAUAN' | 'INVESTIGASI' | 'ANTISIPASI' | 'RESPONS';
type IncidentState = 'BARU' | 'DITINJAU' | 'TERKENDALI';
type Severity = 'TINGGI' | 'SEDANG' | 'RENDAH';

interface MockIncident {
  id: string;
  title: string;
  region: string;
  category: string;
  severity: Severity;
  time: string;
  status: IncidentState;
  summary: string;
  source: string;
}

const phaseDetails: Record<Phase, { title: string; subtitle: string; color: string; step: number }> = {
  PEMANTAUAN: { title: 'Pemantauan', subtitle: 'Feed agregat dan kesehatan layanan simulasi', color: 'cyan', step: 1 },
  INVESTIGASI: { title: 'Investigasi', subtitle: 'Triase, korelasi, dan verifikasi data latihan', color: 'violet', step: 2 },
  ANTISIPASI: { title: 'Antisipasi', subtitle: 'Kesiapan, komunikasi, dan mitigasi defensif', color: 'amber', step: 3 },
  RESPONS: { title: 'Respons & pemulihan', subtitle: 'Koordinasi insiden dan pemulihan layanan demo', color: 'emerald', step: 4 },
};

const initialIncidents: MockIncident[] = [
  {
    id: 'SIM-ID-2048',
    title: 'Laporan publik dugaan penyadapan — perlu verifikasi',
    region: 'DKI Jakarta · skenario media nasional',
    category: 'PRIVASI & INFORMASI',
    severity: 'TINGGI',
    time: '10:42:18',
    status: 'BARU',
    summary: 'Dataset latihan meniru alur penanganan isu publik yang ramai diberitakan. Tidak berisi rekaman, nomor telepon, identitas, isi komunikasi, atau data hasil penyadapan.',
    source: 'Kliping berita sintetis + laporan warga fiktif',
  },
  {
    id: 'SIM-ID-2047',
    title: 'Anomali autentikasi pada layanan contoh',
    region: 'Jawa Barat · lingkungan lab fiktif',
    category: 'IDENTITAS & AKSES',
    severity: 'SEDANG',
    time: '10:39:51',
    status: 'DITINJAU',
    summary: 'Aktivitas login simulasi menyimpang dari baseline dataset sintetis. Tidak ada akun, alamat IP, atau layanan nyata yang diperiksa.',
    source: 'Generator telemetri lokal',
  },
  {
    id: 'SIM-ID-2046',
    title: 'Kualitas layanan demo menurun sementara',
    region: 'Sulawesi Selatan · skenario tabletop',
    category: 'KETERSEDIAAN',
    severity: 'RENDAH',
    time: '10:31:06',
    status: 'TERKENDALI',
    summary: 'Latensi pada layanan fiktif naik sementara dalam skenario latihan lalu kembali normal setelah langkah pemulihan demo.',
    source: 'Simulasi kontinuitas layanan',
  },
];

const severityClass: Record<Severity, string> = {
  TINGGI: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
  SEDANG: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  RENDAH: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
};

const initialLog = [
  'gds-demo status --dataset synthetic',
  '[OK] Lab latihan lokal aktif · koneksi eksternal nonaktif',
  '[MOCK] Memuat skenario respons privasi dan ketahanan layanan',
  '[OK] Tidak ada sensor, perekam, atau pengumpul data nyata',
];

const mockEvents = [
  '[MOCK] Feed agregat diterima; skema data valid',
  '[OK] Kesehatan layanan demo berada dalam batas latihan',
  '[INFO] Snapshot insiden sintetis disinkronkan ke semua monitor',
  '[AUDIT] Perubahan state demo dicatat lokal',
  '[PRIVACY] Konten komunikasi pribadi tidak dikumpulkan atau ditampilkan',
  '[OK] Node lab fiktif merespons normal',
];

const phaseIcon: Record<Phase, React.ReactNode> = {
  PEMANTAUAN: <Eye className="h-4 w-4" />,
  INVESTIGASI: <FileSearch className="h-4 w-4" />,
  ANTISIPASI: <ShieldCheck className="h-4 w-4" />,
  RESPONS: <RefreshCw className="h-4 w-4" />,
};

export const CyberWarfareControlCenter: React.FC<CyberWarfareControlCenterProps> = ({ onTriggerOperation: _onTriggerOperation }) => {
  const [phase, setPhase] = useState<Phase>('PEMANTAUAN');
  const [incidents, setIncidents] = useState(initialIncidents);
  const [selectedId, setSelectedId] = useState(initialIncidents[0].id);
  const [clock, setClock] = useState(() => new Date());
  const [logs, setLogs] = useState(initialLog);
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      const stamp = new Date().toLocaleTimeString('id-ID', { hour12: false });
      setLogs((current) => [...current, `${stamp} ${mockEvents[tick % mockEvents.length]}`].slice(-10));
      setTick((current) => current + 1);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [paused, tick]);

  const selectedIncident = incidents.find((incident) => incident.id === selectedId) ?? incidents[0];
  const currentPhase = phaseDetails[phase];
  const timeLabel = useMemo(() => clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), [clock]);
  const openCount = incidents.filter((incident) => incident.status === 'BARU').length;
  const reviewCount = incidents.filter((incident) => incident.status === 'DITINJAU').length;
  const containedCount = incidents.filter((incident) => incident.status === 'TERKENDALI').length;

  const addLog = (message: string) => {
    const stamp = new Date().toLocaleTimeString('id-ID', { hour12: false });
    setLogs((current) => [...current, `${stamp} ${message}`].slice(-10));
  };

  const setStatus = (id: string, status: IncidentState) => {
    setIncidents((current) => current.map((incident) => incident.id === id ? { ...incident, status } : incident));
    addLog(`[SIMULASI] ${id} → status ${status.toLowerCase()}`);
    setNotice(`${id} diperbarui pada dataset latihan lokal.`);
    window.setTimeout(() => setNotice(''), 3200);
  };

  const startTabletop = () => {
    setPhase('INVESTIGASI');
    addLog('[TABLETOP] Sesi investigasi dimulai · skenario sintetis saja');
    setNotice('Sesi tabletop berjalan. Semua monitor disinkronkan ke skenario yang sama.');
    window.setTimeout(() => setNotice(''), 3500);
  };

  const reset = () => {
    setIncidents(initialIncidents);
    setSelectedId(initialIncidents[0].id);
    setPhase('PEMANTAUAN');
    setLogs(initialLog);
    setPaused(false);
    setNotice('Skenario dikembalikan ke data awal.');
    window.setTimeout(() => setNotice(''), 3200);
  };

  const phaseSequence: Phase[] = ['PEMANTAUAN', 'INVESTIGASI', 'ANTISIPASI', 'RESPONS'];

  return (
    <section className="cyber-panel overflow-hidden rounded-2xl text-slate-100" aria-label="Pusat komando siber simulasi">
      <header className="border-b border-slate-700/60 bg-slate-950/65 p-4 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-200 shadow-[0_0_22px_rgba(34,211,238,0.12)]"><Shield className="h-6 w-6" /></div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-cyan-200">GARUDA CYBER COMMAND</span>
                <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 font-mono text-[10px] font-bold text-amber-100">SIMULASI · DATA MOCK</span>
              </div>
              <h1 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">Pusat Komando Ketahanan Siber</h1>
              <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-400 sm:text-sm">Ruang latihan multi-monitor untuk pemantauan, investigasi, antisipasi, dan respons defensif. Setiap panel berbagi satu skenario sintetis dan tidak terhubung ke sistem nyata.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-emerald-200"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>LAB LOKAL AKTIF</div>
            <div className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-300">{timeLabel} WIB</div>
            <button type="button" onClick={reset} className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white"><RefreshCw className="h-3.5 w-3.5" />Reset demo</button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 xl:grid-cols-4" aria-label="Tahapan skenario sinkron">
          {phaseSequence.map((item, index) => {
            const active = phase === item;
            const complete = phaseSequence.indexOf(phase) > index;
            return <button key={item} type="button" onClick={() => { setPhase(item); addLog(`[WORKFLOW] Tahap aktif: ${phaseDetails[item].title} · simulasi`); }} aria-current={active ? 'step' : undefined}
              className={`group flex min-w-0 items-center gap-2 rounded-xl border px-3 py-3 text-left transition sm:px-4 ${active ? 'border-cyan-300/50 bg-cyan-300/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]' : complete ? 'border-emerald-300/25 bg-emerald-300/[0.05] text-emerald-100' : 'border-slate-700/70 bg-slate-900/45 text-slate-400 hover:border-slate-500 hover:text-slate-100'}`}>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-cyan-300/15 text-cyan-200' : complete ? 'bg-emerald-300/10 text-emerald-200' : 'bg-slate-800 text-slate-400'}`}>{complete ? <Check className="h-4 w-4" /> : phaseIcon[item]}</span>
              <span className="min-w-0"><span className="block truncate text-xs font-bold">{phaseDetails[item].title}</span><span className="mt-0.5 hidden truncate text-[9px] opacity-60 sm:block">TAHAP 0{index + 1}</span></span>
              {index < phaseSequence.length - 1 && <ChevronRight className="ml-auto hidden h-3.5 w-3.5 shrink-0 opacity-30 xl:block" />}
            </button>;
          })}
        </div>
      </header>

      <div className="border-b border-amber-300/20 bg-amber-300/[0.06] px-4 py-2.5 text-[10px] leading-relaxed text-amber-100/90 sm:px-6"><strong>BATAS DEMO:</strong> semua angka, wilayah, alert, dan terminal adalah data sintetis. Panel isu penyadapan hanya untuk verifikasi pemberitaan dan perlindungan privasi—tanpa penyadapan, perekaman, pengumpulan metadata komunikasi, atau identifikasi orang.</div>
      {notice && <div role="status" className="border-b border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-100 sm:px-6">{notice}</div>}

      <main className="space-y-4 p-4 sm:space-y-5 sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><div className="flex items-center gap-2 text-sm font-bold text-white">{phaseIcon[phase]}{currentPhase.title}<span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-2 py-0.5 font-mono text-[9px] text-cyan-200">MONITOR SINKRON</span></div><p className="mt-1 text-[11px] text-slate-500">{currentPhase.subtitle} · {phaseDetails[phase].step}/4 tahap</p></div>
          <div className="flex items-center gap-2 font-mono text-[9px] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> DATASET: GDS-NKRI-TRAINING-01 <span className="text-slate-700">|</span> READ-ONLY SOURCE</div>
        </div>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {[
            { label: 'Alert baru', value: String(openCount).padStart(2, '0'), note: `${reviewCount} sedang ditinjau`, color: 'text-amber-200', icon: <Bell className="h-4 w-4" />, bars: 'bg-amber-300' },
            { label: 'Layanan demo sehat', value: '12 / 12', note: 'node fiktif', color: 'text-emerald-200', icon: <Server className="h-4 w-4" />, bars: 'bg-emerald-300' },
            { label: 'Kesiapan latihan', value: '98.4%', note: 'skor sintetis', color: 'text-cyan-200', icon: <ShieldCheck className="h-4 w-4" />, bars: 'bg-cyan-300' },
            { label: 'Waktu respons', value: '04:26', note: `${containedCount} skenario terkendali`, color: 'text-violet-200', icon: <Clock3 className="h-4 w-4" />, bars: 'bg-violet-300' },
          ].map((metric, index) => <article key={metric.label} className="rounded-xl border border-slate-700/70 bg-slate-950/50 p-3 sm:p-4"><div className="flex items-center justify-between text-slate-500"><span className="text-[10px]">{metric.label}</span><span className={metric.color}>{metric.icon}</span></div><div className={`mt-2 font-mono text-xl font-bold sm:text-2xl ${metric.color}`}>{metric.value}</div><div className="mt-0.5 text-[9px] text-slate-600">{metric.note}</div><div className="mt-3 flex h-4 items-end gap-0.5" aria-label="grafik mock">{Array.from({ length: 20 }, (_, bar) => <span key={bar} className={`flex-1 rounded-t-sm ${metric.bars} opacity-35`} style={{ height: `${20 + ((bar * 19 + index * 11 + tick * (bar % 3 + 1)) % 75)}%` }} />)}</div></article>)}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <section className="xl:col-span-7 rounded-2xl border border-slate-700/70 bg-slate-950/40 p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h2 className="flex items-center gap-2 text-sm font-bold text-white"><Globe2 className="h-4 w-4 text-cyan-300" />Monitor situasi wilayah NKRI</h2><p className="mt-1 text-[10px] text-slate-500">Kartu wilayah dan status dataset; bukan peta sensor atau pelacakan.</p></div><span className="rounded-full border border-cyan-300/20 bg-cyan-300/5 px-2 py-1 font-mono text-[9px] text-cyan-200">4 REGION · MOCK</span></div>
            <div className="object-grid grid grid-cols-1 gap-2 rounded-xl border border-slate-800 bg-[#050b15]/80 p-3 sm:grid-cols-2">
              {[
                { region: 'Sumatera', site: 'Lab layanan publik fiktif', status: 'NORMAL', score: '99.8%', tone: 'emerald' },
                { region: 'Jawa', site: 'Skenario privasi & media', status: phase === 'INVESTIGASI' ? 'DITINJAU' : 'NORMAL', score: '97.2%', tone: phase === 'INVESTIGASI' ? 'amber' : 'cyan' },
                { region: 'Kalimantan', site: 'Latihan kontinuitas layanan', status: 'NORMAL', score: '98.6%', tone: 'emerald' },
                { region: 'Sulawesi & Indonesia Timur', site: 'Node tabletop fiktif', status: 'SIAP LATIHAN', score: '96.9%', tone: 'violet' },
              ].map((region) => <div key={region.region} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800/90 bg-slate-950/70 p-3"><div className="flex min-w-0 items-center gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${region.tone === 'emerald' ? 'bg-emerald-400/10 text-emerald-300' : region.tone === 'amber' ? 'bg-amber-400/10 text-amber-300' : region.tone === 'violet' ? 'bg-violet-400/10 text-violet-300' : 'bg-cyan-400/10 text-cyan-300'}`}><MapPin className="h-4 w-4" /></span><span className="min-w-0"><span className="block truncate text-xs font-bold text-slate-100">{region.region}</span><span className="mt-1 block truncate text-[9px] text-slate-500">{region.site}</span></span></div><span className="shrink-0 text-right"><span className="block font-mono text-[9px] text-emerald-300">{region.status}</span><span className="text-[9px] text-slate-500">{region.score}</span></span></div>)}
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-[9px] text-slate-500"><span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Stabil</span><span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" />Tinjauan latihan</span><span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />Feed mock</span><span className="ml-auto flex items-center gap-1 text-slate-600"><Network className="h-3 w-3" />Sinkronisasi lokal setiap 2.8 dtk</span></div>
          </section>

          <section className="xl:col-span-5 rounded-2xl border border-slate-700/70 bg-slate-950/40 p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-2"><div><h2 className="flex items-center gap-2 text-sm font-bold text-white"><Siren className="h-4 w-4 text-amber-300" />Antrean insiden</h2><p className="mt-1 text-[10px] text-slate-500">Pilih kasus untuk menyinkronkan detail monitor.</p></div><span className="font-mono text-[9px] text-slate-500">{incidents.length} KASUS</span></div>
            <div className="space-y-2">{incidents.map((incident) => <button key={incident.id} type="button" onClick={() => setSelectedId(incident.id)} className={`w-full rounded-xl border p-3 text-left transition ${selectedId === incident.id ? 'border-cyan-300/40 bg-cyan-300/[0.06]' : 'border-slate-800 bg-slate-900/45 hover:border-slate-600'}`}><div className="flex items-start justify-between gap-2"><span className="min-w-0 truncate text-xs font-semibold text-slate-100">{incident.title}</span><span className={`shrink-0 rounded-full border px-2 py-0.5 text-[8px] font-bold ${severityClass[incident.severity]}`}>{incident.severity}</span></div><div className="mt-1.5 flex flex-wrap justify-between gap-1 font-mono text-[9px] text-slate-500"><span>{incident.id} · {incident.region.split(' · ')[0]}</span><span>{incident.status}</span></div></button>)}</div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <section className="xl:col-span-5 rounded-2xl border border-violet-300/20 bg-slate-950/45 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3"><div><div className="flex items-center gap-2 text-sm font-bold text-white"><Fingerprint className="h-4 w-4 text-violet-300" />Verifikasi isu penyadapan publik</div><p className="mt-1 text-[10px] text-slate-500">Meja respons privasi berbasis kliping fiktif, bukan SIGINT.</p></div><span className="rounded-full border border-violet-300/25 bg-violet-300/10 px-2 py-1 font-mono text-[8px] text-violet-100">PRIVACY-FIRST</span></div>
            <div className="mt-4 rounded-xl border border-violet-300/15 bg-violet-300/[0.04] p-3"><div className="flex items-center gap-2 text-[10px] font-bold text-violet-100"><AlertTriangle className="h-3.5 w-3.5" />KASUS LATIHAN · SIM-ID-2048</div><p className="mt-2 text-xs font-semibold leading-relaxed text-slate-200">Dugaan penyadapan menjadi perbincangan publik — verifikasi sumber dan respons perlindungan privasi</p><p className="mt-2 text-[10px] leading-relaxed text-slate-400">Contoh ini hanya meniru alur komunikasi krisis seputar pemberitaan yang viral. Tidak memuat detail teknik, korban, rekaman, nomor, lokasi spesifik, atau hasil intersepsi aktual.</p></div>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[9px]"><div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5"><span className="text-slate-500">Sumber</span><div className="mt-1 text-slate-200">Kliping mock</div></div><div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5"><span className="text-slate-500">Verifikasi</span><div className="mt-1 text-amber-200">Perlu tinjauan manusia</div></div><div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5"><span className="text-slate-500">Data pribadi</span><div className="mt-1 text-emerald-200">Tidak ada</div></div><div className="rounded-lg border border-slate-800 bg-slate-900/60 p-2.5"><span className="text-slate-500">Koleksi komunikasi</span><div className="mt-1 text-emerald-200">Nonaktif</div></div></div>
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-300/15 bg-emerald-300/[0.04] p-2.5 text-[9px] leading-relaxed text-emerald-100/80"><LockKeyhole className="mt-0.5 h-3.5 w-3.5 shrink-0" />Alur aman: catat sumber terbuka, validasi klaim secara independen, minimalkan data, eskalasi sesuai hukum dan prosedur, lalu siapkan komunikasi publik yang transparan.</div>
          </section>

          <section className="xl:col-span-4 rounded-2xl border border-slate-700/70 bg-slate-950/45 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2"><div><h2 className="flex items-center gap-2 text-sm font-bold text-white"><Activity className="h-4 w-4 text-cyan-300" />Monitor proses sinkron</h2><p className="mt-1 text-[10px] text-slate-500">Semua panel mengikuti kasus dan tahap aktif yang sama.</p></div><span className="flex items-center gap-1 font-mono text-[8px] text-emerald-300"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />LIVE MOCK</span></div>
            <div className="mt-4 space-y-3">{[
              { label: 'Sumber data latihan', value: selectedIncident.category, icon: <Radio className="h-3.5 w-3.5" />, width: '100%', color: 'bg-cyan-300' },
              { label: 'Verifikasi & triase', value: selectedIncident.status === 'BARU' ? 'Menunggu analis' : 'Dalam alur tabletop', icon: <FileSearch className="h-3.5 w-3.5" />, width: selectedIncident.status === 'BARU' ? '32%' : '72%', color: 'bg-violet-300' },
              { label: 'Kesiapan koordinasi', value: phase === 'ANTISIPASI' || phase === 'RESPONS' ? 'Siap latihan' : 'Standby demo', icon: <Users className="h-3.5 w-3.5" />, width: phase === 'RESPONS' ? '100%' : '64%', color: 'bg-amber-300' },
              { label: 'Pemulihan layanan demo', value: selectedIncident.status === 'TERKENDALI' ? 'Selesai (mock)' : 'Belum dijalankan', icon: <RefreshCw className="h-3.5 w-3.5" />, width: selectedIncident.status === 'TERKENDALI' ? '100%' : '18%', color: 'bg-emerald-300' },
            ].map((monitor) => <div key={monitor.label} className="rounded-xl border border-slate-800 bg-slate-900/45 p-3"><div className="flex items-center justify-between gap-2"><span className="flex items-center gap-2 text-[10px] font-semibold text-slate-300">{monitor.icon}{monitor.label}</span><span className="text-right text-[9px] text-slate-500">{monitor.value}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${monitor.color} transition-all duration-700`} style={{ width: monitor.width }} /></div></div>)}</div>
            <div className="mt-3 rounded-xl border border-slate-800 bg-[#050b15] p-3"><div className="flex items-center justify-between text-[9px] text-slate-500"><span className="flex items-center gap-1"><MapPin className="h-3 w-3" />Wilayah kasus</span><span className="font-mono text-cyan-200">{selectedIncident.region}</span></div><div className="mt-2 flex items-center justify-between text-[9px] text-slate-500"><span>ID skenario bersama</span><span className="font-mono text-slate-300">{selectedIncident.id}</span></div></div>
          </section>

          <section className="terminal-panel xl:col-span-3 rounded-2xl p-4 sm:p-5">
            <div className="flex items-start justify-between gap-2 border-b border-emerald-900/50 pb-3"><div><h2 className="flex items-center gap-2 text-sm font-bold text-emerald-100"><Terminal className="h-4 w-4" />Terminal simulasi</h2><p className="mt-1 text-[9px] text-emerald-100/45">Mock terminal · perintah tidak dieksekusi</p></div><button type="button" onClick={() => setPaused((value) => !value)} className="rounded-lg border border-emerald-400/20 px-2 py-1 font-mono text-[8px] text-emerald-200 hover:bg-emerald-400/10">{paused ? 'LANJUT' : 'JEDA'}</button></div>
            <div className="mt-3 max-h-[250px] space-y-2 overflow-y-auto font-mono text-[9px] leading-relaxed" aria-live="polite"><div className="text-emerald-300">gds-training@local:~$ <span className="text-slate-200">monitor --dataset synthetic</span></div>{logs.slice(-7).map((line, index) => <div key={`${line}-${index}`} className="break-words text-emerald-100/75"><span className="mr-1.5 text-emerald-600">[{String(index + 1).padStart(2, '0')}]</span>{line}</div>)}<div className="pt-1 text-emerald-300">gds-training@local:~$ <span className="animate-pulse">▍</span></div></div>
            <div className="mt-3 rounded-lg border border-emerald-900/50 bg-black/25 p-2 text-[8px] leading-relaxed text-emerald-100/55">Perintah yang terlihat hanya ilustrasi UI. Tidak ada shell, API, scanning, perekaman, ataupun executor.</div>
          </section>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <section className="lg:col-span-8 rounded-2xl border border-slate-700/70 bg-slate-950/45 p-4 sm:p-5">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="text-sm font-bold text-white">Kartu investigasi terpilih</h2><p className="mt-1 text-[10px] text-slate-500">Pembaruan status hanya berlaku pada state aplikasi lokal.</p></div><span className={`rounded-full border px-2 py-1 text-[8px] font-bold ${severityClass[selectedIncident.severity]}`}>{selectedIncident.severity}</span></div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2"><div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3"><div className="font-mono text-[9px] text-cyan-300">{selectedIncident.id} · {selectedIncident.category}</div><h3 className="mt-2 text-xs font-bold text-slate-100">{selectedIncident.title}</h3><p className="mt-2 text-[10px] leading-relaxed text-slate-400">{selectedIncident.summary}</p><div className="mt-3 flex items-center gap-1 text-[9px] text-slate-500"><MapPin className="h-3 w-3" />{selectedIncident.region}</div></div><div className="rounded-xl border border-slate-800 bg-slate-900/50 p-3"><div className="text-[9px] font-bold text-slate-300">Langkah latihan yang disarankan</div><ol className="mt-2 space-y-2 text-[9px] leading-relaxed text-slate-400"><li className="flex gap-2"><span className="font-mono text-cyan-300">01</span>Verifikasi sumber publik dan catat ketidakpastian.</li><li className="flex gap-2"><span className="font-mono text-cyan-300">02</span>Jaga privasi, minimalkan data, dan minta tinjauan manusia.</li><li className="flex gap-2"><span className="font-mono text-cyan-300">03</span>Latih koordinasi, komunikasi, dan pemulihan defensif.</li></ol></div></div>
            <div className="mt-3 flex flex-wrap gap-2">{selectedIncident.status === 'BARU' && <button type="button" onClick={() => setStatus(selectedIncident.id, 'DITINJAU')} className="flex items-center gap-1.5 rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-[10px] font-semibold text-cyan-100 hover:bg-cyan-300/15"><Check className="h-3.5 w-3.5" />Tandai ditinjau (demo)</button>}{selectedIncident.status !== 'TERKENDALI' && <button type="button" onClick={() => setStatus(selectedIncident.id, 'TERKENDALI')} className="flex items-center gap-1.5 rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-[10px] font-semibold text-emerald-100 hover:bg-emerald-300/15"><BadgeCheck className="h-3.5 w-3.5" />Tandai terkendali (demo)</button>}<button type="button" onClick={startTabletop} className="flex items-center gap-1.5 rounded-lg border border-violet-300/25 bg-violet-300/10 px-3 py-2 text-[10px] font-semibold text-violet-100 hover:bg-violet-300/15"><Zap className="h-3.5 w-3.5" />Mulai tabletop</button></div>
          </section>

          <aside className="lg:col-span-4 rounded-2xl border border-slate-700/70 bg-slate-950/45 p-4 sm:p-5"><h2 className="flex items-center gap-2 text-sm font-bold text-white"><ShieldAlert className="h-4 w-4 text-amber-300" />Prinsip operasi aman</h2><div className="mt-3 space-y-2">{[
            { icon: <LockKeyhole className="h-3.5 w-3.5" />, title: 'Privasi lebih dulu', text: 'Tidak mengumpulkan komunikasi pribadi atau data identitas.' },
            { icon: <KeyRound className="h-3.5 w-3.5" />, title: 'Respons defensif', text: 'Latihan berfokus pada triase, koordinasi, pemulihan, dan audit.' },
            { icon: <Archive className="h-3.5 w-3.5" />, title: 'Jejak audit mock', text: 'Event dicatat sebagai data sintetis di tampilan lokal.' },
            { icon: <CircleHelp className="h-3.5 w-3.5" />, title: 'Tinjauan manusia', text: 'Tidak ada keputusan otomatis terhadap individu atau pihak luar.' },
          ].map((item) => <div key={item.title} className="flex gap-2.5 rounded-xl border border-slate-800 bg-slate-900/45 p-2.5"><span className="mt-0.5 text-cyan-300">{item.icon}</span><span><span className="block text-[10px] font-bold text-slate-200">{item.title}</span><span className="mt-0.5 block text-[9px] leading-relaxed text-slate-500">{item.text}</span></span></div>)}</div><div className="mt-3 flex items-start gap-2 rounded-xl border border-amber-300/15 bg-amber-300/[0.04] p-2.5 text-[9px] leading-relaxed text-amber-100/70"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />Ini prototipe UI latihan, bukan sistem komando atau sumber informasi resmi. Semua angka dan status adalah mock.</div></aside>
        </div>
      </main>

      <footer className="flex flex-col gap-2 border-t border-slate-700/60 bg-slate-950/55 px-4 py-3 text-[9px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6"><span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />GARUDA CYBER COMMAND · PROTOTIPE TABLETOP LOKAL</span><span>DATA SINTETIS · NO LIVE COLLECTION · NO EXTERNAL ACTIONS</span></footer>
    </section>
  );
};
