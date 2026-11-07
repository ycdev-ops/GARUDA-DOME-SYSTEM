import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Archive,
  AudioLines,
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
  Waves,
  Zap,
} from 'lucide-react';
import type { OperationRealizationData } from './RealizationProgressHUD';

interface CyberWarfareControlCenterProps {
  /** Compatibility with the parent app. This mock console never dispatches real operations. */
  onTriggerOperation?: (op: OperationRealizationData) => void;
}

type Phase = 'PEMANTAUAN' | 'INVESTIGASI' | 'ANTISIPASI' | 'RESPONS';
type View = 'SITUASI' | 'ALUR' | 'PRIVASI' | 'AUDIT';
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

const phaseDetails: Record<Phase, { title: string; subtitle: string; step: number }> = {
  PEMANTAUAN: { title: 'Pemantauan', subtitle: 'Feed agregat dan kesehatan layanan simulasi', step: 1 },
  INVESTIGASI: { title: 'Investigasi', subtitle: 'Triase, korelasi, dan verifikasi data latihan', step: 2 },
  ANTISIPASI: { title: 'Antisipasi', subtitle: 'Kesiapan, komunikasi, dan mitigasi defensif', step: 3 },
  RESPONS: { title: 'Respons & pemulihan', subtitle: 'Koordinasi insiden dan pemulihan layanan demo', step: 4 },
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

const phases: Phase[] = ['PEMANTAUAN', 'INVESTIGASI', 'ANTISIPASI', 'RESPONS'];
const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
  { id: 'SITUASI', label: 'Situasi', icon: <Globe2 className="h-4 w-4" /> },
  { id: 'ALUR', label: 'Proses', icon: <Activity className="h-4 w-4" /> },
  { id: 'PRIVASI', label: 'Demo komunikasi', icon: <AudioLines className="h-4 w-4" /> },
  { id: 'AUDIT', label: 'Audit & terminal', icon: <Terminal className="h-4 w-4" /> },
];

export const CyberWarfareControlCenter: React.FC<CyberWarfareControlCenterProps> = ({ onTriggerOperation: _onTriggerOperation }) => {
  const [phase, setPhase] = useState<Phase>('PEMANTAUAN');
  const [view, setView] = useState<View>('SITUASI');
  const [incidents, setIncidents] = useState(initialIncidents);
  const [selectedId, setSelectedId] = useState(initialIncidents[0].id);
  const [clock, setClock] = useState(() => new Date());
  const [logs, setLogs] = useState(initialLog);
  const [tick, setTick] = useState(0);
  const [paused, setPaused] = useState(false);
  const [notice, setNotice] = useState('');
  const [demoRunning, setDemoRunning] = useState(false);
  const [consentReviewed, setConsentReviewed] = useState(false);

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
  const timeLabel = useMemo(() => clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), [clock]);
  const openCount = incidents.filter((incident) => incident.status === 'BARU').length;
  const reviewCount = incidents.filter((incident) => incident.status === 'DITINJAU').length;
  const containedCount = incidents.filter((incident) => incident.status === 'TERKENDALI').length;

  const addLog = (message: string) => {
    const stamp = new Date().toLocaleTimeString('id-ID', { hour12: false });
    setLogs((current) => [...current, `${stamp} ${message}`].slice(-10));
  };

  const updateStatus = (id: string, status: IncidentState) => {
    setIncidents((current) => current.map((incident) => incident.id === id ? { ...incident, status } : incident));
    addLog(`[SIMULASI] ${id} → status ${status.toLowerCase()}`);
    setNotice(`${id} diperbarui pada dataset latihan lokal.`);
    window.setTimeout(() => setNotice(''), 3200);
  };

  const runCommunicationDemo = () => {
    setDemoRunning(true);
    setPhase('INVESTIGASI');
    addLog('[PRIVACY-DEMO] Memutar visualisasi waveform sintetis tanpa input mikrofon');
    addLog('[PRIVACY-DEMO] Metadata contoh dibuat lokal; tidak ada komunikasi yang direkam');
    setNotice('Demo komunikasi sintetis aktif di browser. Tidak ada audio atau pesan nyata yang diakses.');
    window.setTimeout(() => {
      setDemoRunning(false);
      setNotice('');
      addLog('[PRIVACY-DEMO] Sesi visualisasi berakhir; buffer mock dihapus dari tampilan');
    }, 9000);
  };

  const reset = () => {
    setIncidents(initialIncidents);
    setSelectedId(initialIncidents[0].id);
    setPhase('PEMANTAUAN');
    setView('SITUASI');
    setLogs(initialLog);
    setPaused(false);
    setDemoRunning(false);
    setConsentReviewed(false);
    setNotice('Skenario dikembalikan ke data awal.');
    window.setTimeout(() => setNotice(''), 3200);
  };

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
              <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-400 sm:text-sm">Ruang latihan multi-monitor untuk pemantauan, investigasi, antisipasi, respons defensif, dan literasi privasi. Semua panel menyinkronkan satu skenario sintetis tanpa koneksi ke sistem nyata.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-emerald-200"><span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>LAB LOKAL AKTIF</div>
            <div className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-300">{timeLabel} WIB</div>
            <button type="button" onClick={reset} className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white"><RefreshCw className="h-3.5 w-3.5" />Reset demo</button>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 xl:grid-cols-4" aria-label="Tahapan skenario sinkron">
          {phases.map((item, index) => {
            const active = phase === item;
            const complete = phases.indexOf(phase) > index;
            const icon = item === 'PEMANTAUAN' ? <Eye className="h-4 w-4" /> : item === 'INVESTIGASI' ? <FileSearch className="h-4 w-4" /> : item === 'ANTISIPASI' ? <ShieldCheck className="h-4 w-4" /> : <RefreshCw className="h-4 w-4" />;
            return <button key={item} type="button" onClick={() => { setPhase(item); addLog(`[WORKFLOW] Tahap aktif: ${phaseDetails[item].title} · simulasi`); }} aria-current={active ? 'step' : undefined} className={`group flex min-w-0 items-center gap-2 rounded-xl border px-3 py-3 text-left transition sm:px-4 ${active ? 'border-cyan-300/50 bg-cyan-300/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]' : complete ? 'border-emerald-300/25 bg-emerald-300/[0.05] text-emerald-100' : 'border-slate-700/70 bg-slate-900/45 text-slate-400 hover:border-slate-500 hover:text-slate-100'}`}>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-cyan-300/15 text-cyan-200' : complete ? 'bg-emerald-300/10 text-emerald-200' : 'bg-slate-800 text-slate-400'}`}>{complete ? <Check className="h-4 w-4" /> : icon}</span>
              <span className="min-w-0"><span className="block truncate text-xs font-bold">{phaseDetails[item].title}</span><span className="mt-0.5 hidden truncate text-[9px] opacity-60 sm:block">TAHAP 0{index + 1}</span></span>
              {index < phases.length - 1 && <ChevronRight className="ml-auto hidden h-3.5 w-3.5 shrink-0 opacity-30 xl:block" />}
            </button>;
          })}
        </div>

        <nav className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap" aria-label="Panel pusat komando">
          {navItems.map((item) => <button key={item.id} type="button" onClick={() => setView(item.id)} aria-current={view === item.id ? 'page' : undefined} className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-[10px] font-semibold transition ${view === item.id ? 'border-cyan-300/40 bg-cyan-300/10 text-cyan-100' : 'border-slate-700/70 bg-slate-900/40 text-slate-400 hover:text-white'}`}>{item.icon}{item.label}</button>)}
        </nav>
      </header>

      <div className="border-b border-amber-300/20 bg-amber-300/[0.06] px-4 py-2.5 text-[10px] leading-relaxed text-amber-100/90 sm:px-6"><strong>BATAS DEMO:</strong> seluruh angka, wilayah, alert, terminal, metadata, dan waveform adalah data sintetis. Panel komunikasi tidak memakai mikrofon, jaringan telepon, sensor, perekam, atau koneksi eksternal.</div>
      {notice && <div role="status" className="border-b border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-100 sm:px-6">{notice}</div>}

      <main className="space-y-4 p-4 sm:space-y-5 sm:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><div className="flex items-center gap-2 text-sm font-bold text-white"><Activity className="h-4 w-4 text-cyan-300" />{phaseDetails[phase].title}<span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.06] px-2 py-0.5 font-mono text-[9px] text-cyan-200">MONITOR SINKRON</span></div><p className="mt-1 text-[10px] text-slate-500">{phaseDetails[phase].subtitle} · tahap {phaseDetails[phase].step}/4</p></div><div className="flex items-center gap-2 font-mono text-[9px] text-slate-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />DATASET: GDS-NKRI-TRAINING-01 <span className="text-slate-700">|</span> MOCK SOURCE</div></div>

        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {[
            { label: 'Alert baru', value: String(openCount).padStart(2, '0'), note: `${reviewCount} sedang ditinjau`, color: 'text-amber-200', icon: <Bell className="h-4 w-4" />, bars: 'bg-amber-300' },
            { label: 'Layanan demo sehat', value: '12 / 12', note: 'node fiktif', color: 'text-emerald-200', icon: <Server className="h-4 w-4" />, bars: 'bg-emerald-300' },
            { label: 'Kesiapan latihan', value: '98.4%', note: 'skor sintetis', color: 'text-cyan-200', icon: <ShieldCheck className="h-4 w-4" />, bars: 'bg-cyan-300' },
            { label: 'Skenario terkendali', value: String(containedCount).padStart(2, '0'), note: 'status demo lokal', color: 'text-violet-200', icon: <Clock3 className="h-4 w-4" />, bars: 'bg-violet-300' },
          ].map((metric, index) => <article key={metric.label} className="rounded-xl border border-slate-700/70 bg-slate-950/50 p-3 sm:p-4"><div className="flex items-center justify-between text-slate-500"><span className="text-[10px]">{metric.label}</span><span className={metric.color}>{metric.icon}</span></div><div className={`mt-2 font-mono text-xl font-bold sm:text-2xl ${metric.color}`}>{metric.value}</div><div className="mt-0.5 text-[9px] text-slate-600">{metric.note}</div><div className="mt-3 flex h-4 items-end gap-0.5" aria-label="grafik mock">{Array.from({ length: 20 }, (_, bar) => <span key={bar} className={`flex-1 rounded-t-sm ${metric.bars} opacity-35`} style={{ height: `${20 + ((bar * 19 + index * 11 + tick * (bar % 3 + 1)) % 75)}%` }} />)}</div></article>)}
        </div>

        {view === 'SITUASI' && <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <section className="xl:col-span-7 rounded-2xl border border-slate-700/70 bg-slate-950/40 p-4 sm:p-5"><div className="mb-4 flex flex-wrap items-center justify-between gap-2"><div><h2 className="flex items-center gap-2 text-sm font-bold text-white"><Globe2 className="h-4 w-4 text-cyan-300" />Monitor situasi wilayah NKRI</h2><p className="mt-1 text-[10px] text-slate-500">Kartu wilayah dan status dataset; bukan peta sensor atau pelacakan.</p></div><span className="rounded-full border border-cyan-300/20 bg-cyan-300/5 px-2 py-1 font-mono text-[9px] text-cyan-200">4 REGION · MOCK</span></div><div className="object-grid grid grid-cols-1 gap-2 rounded-xl border border-slate-800 bg-[#050b15]/80 p-3 sm:grid-cols-2">{[
            { region: 'Sumatera', site: 'Lab layanan publik fiktif', status: 'NORMAL', score: '99.8%', tone: 'emerald' },
            { region: 'Jawa', site: 'Skenario privasi & media', status: phase === 'INVESTIGASI' ? 'DITINJAU' : 'NORMAL', score: '97.2%', tone: phase === 'INVESTIGASI' ? 'amber' : 'cyan' },
            { region: 'Kalimantan', site: 'Latihan kontinuitas layanan', status: 'NORMAL', score: '98.6%', tone: 'emerald' },
            { region: 'Sulawesi & Indonesia Timur', site: 'Node tabletop fiktif', status: 'SIAP LATIHAN', score: '96.9%', tone: 'violet' },
          ].map((region) => <div key={region.region} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800/90 bg-slate-950/70 p-3"><div className="flex min-w-0 items-center gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${region.tone === 'emerald' ? 'bg-emerald-400/10 text-emerald-300' : region.tone === 'amber' ? 'bg-amber-400/10 text-amber-300' : region.tone === 'violet' ? 'bg-violet-400/10 text-violet-300' : 'bg-cyan-400/10 text-cyan-300'}`}><MapPin className="h-4 w-4" /></span><span className="min-w-0"><span className="block truncate text-xs font-bold text-slate-100">{region.region}</span><span className="mt-1 block truncate text-[9px] text-slate-500">{region.site}</span></span></div><span className="shrink-0 text-right"><span className="block font-mono text-[9px] text-emerald-300">{region.status}</span><span className="text-[9px] text-slate-500">{region.score}</span></span></div>)}</div><div className="mt-3 flex flex-wrap items-center gap-3 text-[9px] text-slate-500"><span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Stabil</span><span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-amber-400" />Tinjauan latihan</span><span className="flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />Feed mock</span><span className="ml-auto flex items-center gap-1 text-slate-600"><Network className="h-3 w-3" />Sinkron lokal</span></div></section>
          <section className="xl:col-span-5 rounded-2xl border border-slate-700/70 bg-slate-950/40 p-4 sm:p-5"><div className="mb-4 flex items-center justify-between gap-2"><div><h2 className="flex items-center gap-2 text-sm font-bold text-white"><Siren className="h-4 w-4 text-amber-300" />Antrean insiden</h2><p className="mt-1 text-[10px] text-slate-500">Pilih kasus untuk menyinkronkan detail monitor.</p></div><span className="font-mono text-[9px] text-slate-500">{incidents.length} KASUS</span></div><div className="space-y-2">{incidents.map((incident) => <button key={incident.id} type="button" onClick={() => setSelectedId(incident.id)} className={`w-full rounded-xl border p-3 text-left transition ${selectedId === incident.id ? 'border-cyan-300/40 bg-cyan-300/[0.06]' : 'border-slate-800 bg-slate-900/45 hover:border-slate-600'}`}><div className="flex items-start justify-between gap-2"><span className="min-w-0 truncate text-xs font-semibold text-slate-100">{incident.title}</span><span className={`shrink-0 rounded-full border px-2 py-0.5 text-[8px] font-bold ${severityClass[incident.severity]}`}>{incident.severity}</span></div><div className="mt-1.5 flex flex-wrap justify-between gap-1 font-mono text-[9px] text-slate-500"><span>{incident.id} · {incident.region.split(' · ')[0]}</span><span>{incident.status}</span></div></button>)}</div><button type="button" onClick={() => setView('PRIVASI')} className="mt-3 flex w-full items-center justify-between rounded-xl border border-violet-300/20 bg-violet-300/[0.05] p-3 text-left text-[10px] text-violet-100 hover:bg-violet-300/10"><span className="flex items-center gap-2"><AudioLines className="h-4 w-4" />Buka demo komunikasi sintetis</span><ChevronRight className="h-3.5 w-3.5" /></button></section>
        </div>}

        {view === 'ALUR' && <div className="grid grid-cols-1 gap-4 xl:grid-cols-12"><section className="xl:col-span-7 rounded-2xl border border-slate-700/70 bg-slate-950/45 p-4 sm:p-5"><h2 className="text-sm font-bold text-white">Alur operasi latihan</h2><p className="mt-1 text-[10px] text-slate-500">Contoh tahapan defensif; tombol hanya memperbarui tampilan demo.</p><div className="mt-4 space-y-3">{phases.map((item, index) => <button key={item} type="button" onClick={() => { setPhase(item); addLog(`[WORKFLOW] Tahap dipilih: ${phaseDetails[item].title}`); }} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left ${phase === item ? 'border-cyan-300/40 bg-cyan-300/[0.07]' : 'border-slate-800 bg-slate-900/40'}`}><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 font-mono text-xs text-cyan-200">0{index + 1}</span><span className="min-w-0 flex-1"><span className="block text-xs font-bold text-slate-100">{phaseDetails[item].title}</span><span className="mt-1 block text-[10px] text-slate-500">{phaseDetails[item].subtitle}</span></span><ChevronRight className="h-4 w-4 text-slate-600" /></button>)}</div></section><section className="xl:col-span-5 rounded-2xl border border-slate-700/70 bg-slate-950/45 p-4 sm:p-5"><h2 className="text-sm font-bold text-white">Kartu investigasi terpilih</h2><div className="mt-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3"><span className="font-mono text-[9px] text-cyan-300">{selectedIncident.id} · {selectedIncident.category}</span><h3 className="mt-2 text-xs font-bold text-slate-100">{selectedIncident.title}</h3><p className="mt-2 text-[10px] leading-relaxed text-slate-400">{selectedIncident.summary}</p><div className="mt-3 flex items-center gap-1 text-[9px] text-slate-500"><MapPin className="h-3 w-3" />{selectedIncident.region}</div></div><div className="mt-3 flex flex-wrap gap-2">{selectedIncident.status === 'BARU' && <button type="button" onClick={() => updateStatus(selectedIncident.id, 'DITINJAU')} className="rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-[10px] text-cyan-100">Tandai ditinjau (demo)</button>}{selectedIncident.status !== 'TERKENDALI' && <button type="button" onClick={() => updateStatus(selectedIncident.id, 'TERKENDALI')} className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-[10px] text-emerald-100">Tandai terkendali (demo)</button>}</div><div className="mt-4 rounded-xl border border-amber-300/15 bg-amber-300/[0.04] p-3 text-[9px] leading-relaxed text-amber-100/70">Latihan ini berfokus pada verifikasi sumber, pelindungan privasi, koordinasi manusia, dan pemulihan defensif. Tidak ada pemindaian atau tindakan pada target nyata.</div></section></div>}

        {view === 'PRIVASI' && <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <section className="xl:col-span-7 rounded-2xl border border-violet-300/20 bg-slate-950/45 p-4 sm:p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="flex items-center gap-2 text-sm font-bold text-white"><AudioLines className="h-4 w-4 text-violet-300" />Demo komunikasi sintetis & perlindungan privasi</h2><p className="mt-1 text-[10px] text-slate-500">Visualisasi konsep untuk edukasi; bukan fitur penyadapan atau perekaman.</p></div><span className="rounded-full border border-violet-300/25 bg-violet-300/10 px-2 py-1 font-mono text-[8px] text-violet-100">BROWSER-ONLY MOCK</span></div>
            <div className="mt-4 rounded-xl border border-violet-300/15 bg-violet-300/[0.04] p-3"><div className="flex items-center justify-between gap-2"><div><div className="font-mono text-[9px] text-violet-200">SKENARIO: SIM-ID-2048 · DKI JAKARTA</div><div className="mt-1 text-xs font-bold text-slate-100">Pemberitaan publik tentang dugaan penyadapan</div></div><span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-2 py-1 text-[8px] text-amber-100">KLAIM BELUM TERVERIFIKASI</span></div><p className="mt-2 text-[10px] leading-relaxed text-slate-400">Skenario fiktif ini melatih verifikasi informasi dan respons privasi. Tidak menggunakan detail korban, percakapan, nomor, rekaman, teknik intersepsi, atau informasi operasional dari peristiwa nyata.</p></div>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <article className="rounded-xl border border-slate-800 bg-slate-900/55 p-3"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[10px] font-bold text-slate-200"><AudioLines className="h-3.5 w-3.5 text-cyan-300" />Waveform visual mock</span><span className="font-mono text-[8px] text-slate-500">NO AUDIO INPUT</span></div><div className="mt-4 flex h-16 items-center justify-center gap-1 rounded-lg border border-slate-800 bg-[#050b15] px-3" aria-label="Dekorasi waveform sintetis, bukan audio rekaman">{Array.from({ length: 46 }, (_, index) => <span key={index} className={`w-1 rounded-full ${demoRunning ? 'bg-violet-300/80' : 'bg-cyan-300/45'}`} style={{ height: `${12 + ((index * 37 + 13) % 42)}px`, opacity: demoRunning ? 0.45 + ((index % 5) * 0.1) : 0.55 }} />)}</div><p className="mt-2 text-[9px] text-slate-500">Bentuk gelombang dekoratif dibuat dari angka tetap di UI. Tidak membaca mikrofon atau file audio.</p></article>
              <article className="rounded-xl border border-slate-800 bg-slate-900/55 p-3"><div className="flex items-center justify-between"><span className="flex items-center gap-2 text-[10px] font-bold text-slate-200"><Network className="h-3.5 w-3.5 text-violet-300" />Metadata contoh</span><span className="font-mono text-[8px] text-emerald-300">SYNTHETIC</span></div><dl className="mt-3 space-y-2 text-[9px]"><div className="flex justify-between gap-2"><dt className="text-slate-500">Sumber</dt><dd className="text-right text-slate-300">Dataset latihan fiktif</dd></div><div className="flex justify-between gap-2"><dt className="text-slate-500">Identitas pengirim</dt><dd className="text-right text-slate-300">[DIHAPUS]</dd></div><div className="flex justify-between gap-2"><dt className="text-slate-500">Isi komunikasi</dt><dd className="text-right text-slate-300">Tidak tersedia</dd></div><div className="flex justify-between gap-2"><dt className="text-slate-500">Lokasi / nomor</dt><dd className="text-right text-slate-300">Tidak dikumpulkan</dd></div></dl></article>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono text-[8px]"><div className="rounded-lg border border-slate-800 bg-slate-900/40 p-2"><div className="text-slate-500">CAPTURE SOURCE</div><div className="mt-1 text-emerald-200">NONE</div></div><div className="rounded-lg border border-slate-800 bg-slate-900/40 p-2"><div className="text-slate-500">RECORDING</div><div className="mt-1 text-emerald-200">MOCK ONLY</div></div><div className="rounded-lg border border-slate-800 bg-slate-900/40 p-2"><div className="text-slate-500">NETWORK</div><div className="mt-1 text-emerald-200">OFFLINE</div></div></div>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row"><button type="button" onClick={runCommunicationDemo} disabled={demoRunning} className="flex items-center justify-center gap-2 rounded-xl border border-violet-300/30 bg-violet-300/10 px-4 py-2.5 text-[10px] font-bold text-violet-100 transition hover:bg-violet-300/15 disabled:cursor-not-allowed disabled:opacity-50"><Waves className="h-4 w-4" />{demoRunning ? 'VISUALISASI MOCK BERJALAN…' : 'Jalankan visualisasi demo'}</button><button type="button" onClick={() => { setConsentReviewed((value) => !value); addLog(`[PRIVACY] Checklist edukasi ${consentReviewed ? 'dibatalkan' : 'ditinjau'} secara lokal`); }} className="flex items-center justify-center gap-2 rounded-xl border border-emerald-300/25 bg-emerald-300/[0.06] px-4 py-2.5 text-[10px] font-semibold text-emerald-100 hover:bg-emerald-300/10"><CheckCircle2 className="h-4 w-4" />{consentReviewed ? 'Checklist ditinjau ✓' : 'Tandai checklist privasi ditinjau'}</button></div>
          </section>
          <aside className="space-y-3 xl:col-span-5"><div className="rounded-2xl border border-emerald-300/20 bg-slate-950/50 p-4"><h3 className="flex items-center gap-2 text-xs font-bold text-white"><ShieldCheck className="h-4 w-4 text-emerald-300" />Alur respons yang aman</h3><ol className="mt-3 space-y-3">{[
              ['01', 'Verifikasi sumber terbuka', 'Bedakan fakta, dugaan, dan informasi yang belum terkonfirmasi.'],
              ['02', 'Lindungi privasi', 'Jangan mencari, menyimpan, atau menyebarkan komunikasi pribadi.'],
              ['03', 'Eskalasi secara sah', 'Gunakan kanal resmi dan proses yang sesuai hukum serta kewenangan.'],
              ['04', 'Transparansi & audit', 'Dokumentasikan keputusan latihan dan komunikasi publik dengan jelas.'],
            ].map(([number, title, description]) => <li key={number} className="flex gap-2.5"><span className="font-mono text-[9px] text-emerald-300">{number}</span><span><span className="block text-[10px] font-semibold text-slate-200">{title}</span><span className="mt-0.5 block text-[9px] leading-relaxed text-slate-500">{description}</span></span></li>)}</ol></div><div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-4"><h3 className="flex items-center gap-2 text-xs font-bold text-amber-100"><AlertTriangle className="h-4 w-4" />Bukan panel penyadapan</h3><p className="mt-2 text-[10px] leading-relaxed text-amber-100/70">Tidak tersedia akses mikrofon, perekam, nomor telepon, metadata komunikasi nyata, target, pemancar, atau integrasi operator. Fitur ini hanya menyajikan visual mock untuk edukasi privasi dan respons terhadap isu publik.</p></div><div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-4"><h3 className="flex items-center gap-2 text-xs font-bold text-slate-200"><LockKeyhole className="h-4 w-4 text-cyan-300" />Pagar pengaman</h3><div className="mt-3 grid grid-cols-2 gap-2 text-[9px]"><span className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-emerald-200">No microphone API</span><span className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-emerald-200">No backend</span><span className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-emerald-200">No real transcript</span><span className="rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-emerald-200">Local-only state</span></div></div></aside>
        </div>}

        {view === 'AUDIT' && <div className="grid grid-cols-1 gap-4 xl:grid-cols-12"><section className="terminal-panel xl:col-span-8 rounded-2xl p-4 sm:p-5"><div className="flex items-start justify-between gap-3 border-b border-emerald-900/50 pb-3"><div><h2 className="flex items-center gap-2 text-sm font-bold text-emerald-100"><Terminal className="h-4 w-4" />Terminal latihan</h2><p className="mt-1 text-[9px] text-emerald-100/45">Mock terminal · perintah tidak dieksekusi · data lokal</p></div><button type="button" onClick={() => setPaused((value) => !value)} className="rounded-lg border border-emerald-400/20 px-2 py-1 font-mono text-[8px] text-emerald-200 hover:bg-emerald-400/10">{paused ? 'LANJUT' : 'JEDA'}</button></div><div className="mt-3 max-h-[360px] space-y-2 overflow-y-auto font-mono text-[9px] leading-relaxed" aria-live="polite"><div className="text-emerald-300">gds-training@local:~$ <span className="text-slate-200">status --dataset synthetic</span></div>{logs.map((line, index) => <div key={`${line}-${index}`} className="break-words text-emerald-100/75"><span className="mr-1.5 text-emerald-600">[{String(index + 1).padStart(2, '0')}]</span>{line}</div>)}<div className="pt-1 text-emerald-300">gds-training@local:~$ <span className="animate-pulse">▍</span></div></div><div className="mt-3 rounded-lg border border-emerald-900/50 bg-black/25 p-2 text-[8px] leading-relaxed text-emerald-100/55">Perintah yang terlihat hanya ilustrasi UI. Tidak ada shell, API, scanning, perekaman, atau executor.</div></section><aside className="xl:col-span-4 space-y-3"><div className="rounded-2xl border border-slate-700/70 bg-slate-950/45 p-4"><h3 className="flex items-center gap-2 text-xs font-bold text-white"><FileSearch className="h-4 w-4 text-cyan-300" />Ringkasan audit demo</h3><dl className="mt-3 space-y-2 text-[9px]"><div className="flex justify-between"><dt className="text-slate-500">Event tersimpan</dt><dd className="font-mono text-slate-200">{logs.length} (maks. 10)</dd></div><div className="flex justify-between"><dt className="text-slate-500">Sumber</dt><dd className="font-mono text-cyan-200">SINTETIS</dd></div><div className="flex justify-between"><dt className="text-slate-500">Audio / komunikasi</dt><dd className="font-mono text-emerald-200">TIDAK DIAKSES</dd></div><div className="flex justify-between"><dt className="text-slate-500">Koneksi keluar</dt><dd className="font-mono text-emerald-200">NONAKTIF</dd></div></dl></div><div className="rounded-2xl border border-violet-300/20 bg-violet-300/[0.04] p-4"><h3 className="flex items-center gap-2 text-xs font-bold text-violet-100"><Fingerprint className="h-4 w-4" />Catatan demo isu publik</h3><p className="mt-2 text-[9px] leading-relaxed text-violet-100/65">Kasus penyadapan yang ditampilkan adalah topik latihan fiktif dan tidak menyatakan kesimpulan faktual atas peristiwa tertentu. Verifikasi pemberitaan dilakukan melalui sumber terbuka dan tinjauan manusia.</p></div></aside></div>}
      </main>

      <footer className="flex flex-col gap-2 border-t border-slate-700/60 bg-slate-950/55 px-4 py-3 text-[9px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6"><span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />GARUDA CYBER COMMAND · PROTOTIPE TABLETOP LOKAL</span><span>DATA SINTETIS · NO LIVE COLLECTION · NO EXTERNAL ACTIONS</span></footer>
    </section>
  );
};
