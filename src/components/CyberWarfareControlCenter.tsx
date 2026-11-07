import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Cpu,
  FileSearch,
  Fingerprint,
  Gauge,
  Globe2,
  LockKeyhole,
  Network,
  Radio,
  RefreshCw,
  Server,
  Shield,
  ShieldCheck,
  Siren,
  Terminal,
  Users,
  Waves,
  X,
} from 'lucide-react';
import { OperationRealizationData } from './RealizationProgressHUD';

interface CyberWarfareControlCenterProps {
  /** Kept for the parent app API. This demo intentionally never dispatches real operations. */
  onTriggerOperation?: (op: OperationRealizationData) => void;
}

type View = 'OVERVIEW' | 'INCIDENTS' | 'RESILIENCE' | 'AUDIT';
type IncidentStatus = 'NEW' | 'ACKNOWLEDGED' | 'CONTAINED';

interface DemoIncident {
  id: string;
  title: string;
  category: string;
  severity: 'TINGGI' | 'SEDANG' | 'RENDAH';
  source: string;
  time: string;
  status: IncidentStatus;
  description: string;
}

const initialIncidents: DemoIncident[] = [
  {
    id: 'SIM-2048',
    title: 'Lonjakan laporan email mencurigakan',
    category: 'AWARENESS',
    severity: 'TINGGI',
    source: 'Simulasi helpdesk nasional',
    time: '10:42:18',
    status: 'NEW',
    description: 'Pola laporan pengguna meningkat pada dataset pelatihan sintetis. Tidak ada pesan atau akun nyata yang diperiksa.',
  },
  {
    id: 'SIM-2047',
    title: 'Anomali autentikasi agregat',
    category: 'IDENTITY',
    severity: 'SEDANG',
    source: 'Generator telemetri mock',
    time: '10:39:51',
    status: 'ACKNOWLEDGED',
    description: 'Aktivitas login simulasi menyimpang dari baseline contoh. Data tidak terhubung ke identitas atau sistem eksternal.',
  },
  {
    id: 'SIM-2046',
    title: 'Kualitas layanan menurun',
    category: 'AVAILABILITY',
    severity: 'RENDAH',
    source: 'Lab ketahanan layanan',
    time: '10:31:06',
    status: 'CONTAINED',
    description: 'Latensi pada layanan fiktif naik sementara dalam skenario latihan dan kembali ke rentang normal.',
  },
];

const initialLogs = [
  'gds-demo status --scope synthetic',
  '[OK] Lingkungan latihan lokal aktif; koneksi eksternal: nonaktif',
  '[INFO] Memuat dataset contoh insiden dan aset fiktif',
  '[OK] Pemeriksaan audit simulasi selesai',
];

const severityStyles: Record<DemoIncident['severity'], string> = {
  TINGGI: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
  SEDANG: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  RENDAH: 'border-cyan-400/30 bg-cyan-400/10 text-cyan-200',
};

const statusLabel: Record<IncidentStatus, string> = {
  NEW: 'BARU',
  ACKNOWLEDGED: 'DITINJAU',
  CONTAINED: 'SELESAI · SIMULASI',
};

export const CyberWarfareControlCenter: React.FC<CyberWarfareControlCenterProps> = ({ onTriggerOperation: _onTriggerOperation }) => {
  const [view, setView] = useState<View>('OVERVIEW');
  const [incidents, setIncidents] = useState(initialIncidents);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(initialIncidents[0].id);
  const [clock, setClock] = useState(() => new Date());
  const [streamTick, setStreamTick] = useState(0);
  const [logs, setLogs] = useState(initialLogs);
  const [isPaused, setIsPaused] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const stream = window.setInterval(() => {
      setStreamTick((tick) => tick + 1);
      const stamp = new Date().toLocaleTimeString('id-ID', { hour12: false });
      const events = [
        '[MOCK] Feed sintetis diterima; skema valid',
        '[OK] Baseline layanan demo tetap dalam batas',
        '[INFO] Agregat insiden latihan diperbarui',
        '[AUDIT] Perubahan simulasi dicatat lokal',
        '[OK] Status node fiktif: sehat',
      ];
      setLogs((current) => [...current, `${stamp} ${events[streamTick % events.length]}`].slice(-8));
    }, 2600);
    return () => window.clearInterval(stream);
  }, [isPaused, streamTick]);

  const selected = incidents.find((incident) => incident.id === selectedIncident) ?? incidents[0];
  const openCount = incidents.filter((incident) => incident.status === 'NEW').length;
  const acknowledgedCount = incidents.filter((incident) => incident.status === 'ACKNOWLEDGED').length;
  const containedCount = incidents.filter((incident) => incident.status === 'CONTAINED').length;
  const formattedClock = useMemo(
    () => clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
    [clock],
  );

  const appendLog = (message: string) => {
    const stamp = new Date().toLocaleTimeString('id-ID', { hour12: false });
    setLogs((current) => [...current, `${stamp} ${message}`].slice(-8));
  };

  const updateIncident = (id: string, status: IncidentStatus) => {
    setIncidents((current) => current.map((incident) => incident.id === id ? { ...incident, status } : incident));
    appendLog(`[SIMULASI] ${id} → ${statusLabel[status]}`);
    setNotice(`${id} diperbarui pada dataset simulasi saja.`);
    window.setTimeout(() => setNotice(''), 3500);
  };

  const resetDemo = () => {
    setIncidents(initialIncidents);
    setSelectedIncident(initialIncidents[0].id);
    setIsPaused(false);
    setLogs(initialLogs);
    setNotice('Skenario demo dikembalikan ke data awal.');
    window.setTimeout(() => setNotice(''), 3500);
  };

  const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'OVERVIEW', label: 'Ringkasan', icon: <Gauge className="h-4 w-4" /> },
    { id: 'INCIDENTS', label: 'Insiden latihan', icon: <Siren className="h-4 w-4" /> },
    { id: 'RESILIENCE', label: 'Ketahanan', icon: <Network className="h-4 w-4" /> },
    { id: 'AUDIT', label: 'Audit & terminal', icon: <Terminal className="h-4 w-4" /> },
  ];

  const metrics = [
    { label: 'Insiden terbuka', value: String(openCount).padStart(2, '0'), note: `${acknowledgedCount} menunggu tinjauan`, icon: <Bell className="h-4 w-4" />, color: 'text-amber-300', border: 'border-amber-400/25' },
    { label: 'Layanan simulasi', value: '12 / 12', note: 'seluruh node contoh sehat', icon: <Server className="h-4 w-4" />, color: 'text-emerald-300', border: 'border-emerald-400/25' },
    { label: 'Kesiapan latihan', value: '98.4%', note: 'indikator sintetis', icon: <ShieldCheck className="h-4 w-4" />, color: 'text-cyan-300', border: 'border-cyan-400/25' },
    { label: 'Waktu respons demo', value: '04:26', note: 'median skenario latihan', icon: <Clock3 className="h-4 w-4" />, color: 'text-violet-300', border: 'border-violet-400/25' },
  ];

  return (
    <section className="cyber-panel overflow-hidden rounded-2xl text-slate-100" aria-label="Pusat komando siber simulasi">
      <header className="border-b border-slate-700/60 bg-slate-950/60 p-4 sm:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 text-cyan-200 cyan-glow">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-cyan-200">GARUDA CYBER COMMAND</span>
                <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-wide text-amber-200">SIMULASI · DATA MOCK</span>
              </div>
              <h1 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">Pusat Komando Ketahanan Siber</h1>
              <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-400 sm:text-sm">Ruang latihan terpadu untuk triase insiden, ketahanan layanan, koordinasi, dan audit. Seluruh data bersifat sintetis; tidak ada koneksi atau aksi pada sistem nyata.</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-emerald-200">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" /></span>
              LAB LOKAL AKTIF
            </div>
            <div className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-300">{formattedClock} WIB</div>
            <button type="button" onClick={resetDemo} className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-300 transition hover:border-cyan-300/40 hover:text-white" aria-label="Reset skenario demo">
              <RefreshCw className="h-3.5 w-3.5" /> Reset demo
            </button>
          </div>
        </div>

        <nav className="mt-5 grid grid-cols-2 gap-2 md:flex md:flex-wrap" aria-label="Navigasi pusat komando">
          {navItems.map((item) => (
            <button key={item.id} type="button" onClick={() => setView(item.id)} aria-current={view === item.id ? 'page' : undefined}
              className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition sm:px-4 ${view === item.id ? 'border-cyan-300/50 bg-cyan-300/10 text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.12)]' : 'border-slate-700/70 bg-slate-900/50 text-slate-400 hover:border-slate-500 hover:text-slate-100'}`}>
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
      </header>

      <div className="border-b border-amber-300/20 bg-amber-300/[0.06] px-4 py-2.5 text-[11px] leading-relaxed text-amber-100/90 sm:px-6">
        <span className="font-bold tracking-wide">BATAS DEMO:</span> tombol hanya mengubah status data contoh di browser. Tidak ada pemindaian jaringan, eksploitasi, pengiriman paket, pemblokiran, atau kendali perangkat.
      </div>

      {notice && <div role="status" className="border-b border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs text-cyan-100 sm:px-6">{notice}</div>}

      <main className="space-y-5 p-4 sm:p-6">
        {view === 'OVERVIEW' && (
          <>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric, index) => (
                <article key={metric.label} className={`rounded-2xl border ${metric.border} bg-slate-950/50 p-4 transition hover:-translate-y-0.5 hover:bg-slate-900/70`}>
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-medium text-slate-400">{metric.label}</span>
                    <span className={`rounded-lg border border-current/20 bg-slate-900 p-2 ${metric.color}`}>{metric.icon}</span>
                  </div>
                  <div className={`mt-4 font-mono text-3xl font-bold tracking-tight ${metric.color}`}>{metric.value}</div>
                  <div className="mt-1 text-[11px] text-slate-500">{metric.note}</div>
                  <div className="mt-4 flex h-7 items-end gap-1" aria-label="Grafik indikator sintetis">
                    {Array.from({ length: 18 }, (_, bar) => <span key={bar} className={`flex-1 rounded-t-sm ${metric.color.replace('text-', 'bg-')} opacity-30`} style={{ height: `${18 + ((bar * 17 + index * 13 + streamTick * (bar % 3 + 1)) % 78)}%` }} />)}
                  </div>
                </article>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
              <section className="xl:col-span-7 rounded-2xl border border-slate-700/70 bg-slate-950/40 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 text-sm font-bold text-white"><Activity className="h-4 w-4 text-cyan-300" />Gambaran situasi latihan</div>
                    <p className="mt-1 text-[11px] text-slate-500">Relasi dan status layanan contoh — bukan peta jaringan aktual.</p>
                  </div>
                  <span className="rounded-full border border-cyan-300/20 bg-cyan-300/5 px-2 py-1 font-mono text-[10px] text-cyan-200">MOCK TOPOLOGY</span>
                </div>
                <div className="object-grid grid min-h-[245px] grid-cols-1 content-center gap-3 rounded-xl border border-slate-800 bg-[#050b15]/80 p-4 sm:grid-cols-3">
                  <div className="flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3"><div className="rounded-lg bg-emerald-400/10 p-2 text-emerald-300"><Globe2 className="h-4 w-4" /></div><div><div className="text-xs font-bold text-slate-100">Layanan publik demo</div><div className="mt-1 text-[10px] text-emerald-300">NORMAL · 99.98%</div></div></div>
                  <div className="flex items-center gap-3 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] p-3"><div className="rounded-lg bg-cyan-400/10 p-2 text-cyan-300"><Network className="h-4 w-4" /></div><div><div className="text-xs font-bold text-slate-100">Koordinasi latihan</div><div className="mt-1 text-[10px] text-cyan-300">TERHUBUNG · MOCK</div></div></div>
                  <div className="flex items-center gap-3 rounded-xl border border-violet-400/20 bg-violet-400/[0.06] p-3"><div className="rounded-lg bg-violet-400/10 p-2 text-violet-300"><LockKeyhole className="h-4 w-4" /></div><div><div className="text-xs font-bold text-slate-100">Identitas simulasi</div><div className="mt-1 text-[10px] text-violet-300">TERLINDUNGI · DEMO</div></div></div>
                  <div className="hidden items-center justify-center text-cyan-300/70 sm:flex"><Waves className="h-5 w-5" /></div>
                  <div className="flex items-center gap-3 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-3"><div className="rounded-lg bg-amber-400/10 p-2 text-amber-300"><Users className="h-4 w-4" /></div><div><div className="text-xs font-bold text-slate-100">Tim respons latihan</div><div className="mt-1 text-[10px] text-amber-300">4 PERAN · DATA FIKTIF</div></div></div>
                  <div className="hidden items-center justify-center text-cyan-300/70 sm:flex"><Waves className="h-5 w-5" /></div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-slate-500"><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-400" /> Normal</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-400" /> Perlu tinjauan</span><span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-cyan-400" /> Feed sintetis</span></div>
              </section>

              <section className="xl:col-span-5 rounded-2xl border border-slate-700/70 bg-slate-950/40 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div><div className="flex items-center gap-2 text-sm font-bold text-white"><Siren className="h-4 w-4 text-amber-300" />Antrean insiden demo</div><p className="mt-1 text-[11px] text-slate-500">Pilih item untuk melihat detail dan respons latihan.</p></div>
                  <button type="button" onClick={() => setView('INCIDENTS')} className="flex items-center gap-1 text-[11px] font-semibold text-cyan-300 hover:text-cyan-100">Semua <ChevronRight className="h-3 w-3" /></button>
                </div>
                <div className="space-y-2">
                  {incidents.slice(0, 3).map((incident) => (
                    <button key={incident.id} type="button" onClick={() => { setSelectedIncident(incident.id); setView('INCIDENTS'); }} className="w-full rounded-xl border border-slate-800 bg-slate-900/55 p-3 text-left transition hover:border-slate-600">
                      <div className="flex items-start justify-between gap-3"><div className="min-w-0"><div className="truncate text-xs font-semibold text-slate-100">{incident.title}</div><div className="mt-1 font-mono text-[10px] text-slate-500">{incident.id} · {incident.time}</div></div><span className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold ${severityStyles[incident.severity]}`}>{incident.severity}</span></div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </>
        )}

        {view === 'INCIDENTS' && (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            <section className="xl:col-span-7 rounded-2xl border border-slate-700/70 bg-slate-950/40 p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-2"><div><h2 className="text-sm font-bold text-white">Insiden latihan</h2><p className="mt-1 text-[11px] text-slate-500">Triase dan pengakuan insiden hanya mengubah dataset lokal.</p></div><span className="font-mono text-[10px] text-slate-500">{incidents.length} ITEM</span></div>
              <div className="space-y-2">
                {incidents.map((incident) => (
                  <button key={incident.id} type="button" onClick={() => setSelectedIncident(incident.id)} className={`w-full rounded-xl border p-3 text-left transition ${selectedIncident === incident.id ? 'border-cyan-300/45 bg-cyan-300/[0.07]' : 'border-slate-800 bg-slate-900/40 hover:border-slate-600'}`}>
                    <div className="flex flex-wrap items-center justify-between gap-2"><span className="font-mono text-[10px] text-slate-500">{incident.id} · {incident.time}</span><div className="flex items-center gap-2"><span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold ${severityStyles[incident.severity]}`}>{incident.severity}</span><span className="rounded-full border border-slate-700 bg-slate-950/60 px-2 py-0.5 text-[9px] text-slate-300">{statusLabel[incident.status]}</span></div></div>
                    <div className="mt-2 text-sm font-semibold text-slate-100">{incident.title}</div><div className="mt-1 text-[11px] text-slate-500">{incident.category} · {incident.source}</div>
                  </button>
                ))}
              </div>
            </section>
            <section className="xl:col-span-5 rounded-2xl border border-cyan-400/20 bg-slate-950/50 p-4 sm:p-5">
              {selected ? <>
                <div className="flex items-start justify-between gap-3"><div><span className="font-mono text-[10px] text-cyan-300">{selected.id} · DETAIL DATA MOCK</span><h2 className="mt-2 text-lg font-bold text-white">{selected.title}</h2></div><span className={`rounded-full border px-2 py-1 text-[9px] font-bold ${severityStyles[selected.severity]}`}>{selected.severity}</span></div>
                <p className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs leading-relaxed text-slate-300">{selected.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]"><div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3"><span className="text-slate-500">Sumber</span><div className="mt-1 text-slate-200">{selected.source}</div></div><div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3"><span className="text-slate-500">Status lokal</span><div className="mt-1 text-slate-200">{statusLabel[selected.status]}</div></div></div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {selected.status === 'NEW' && <button type="button" onClick={() => updateIncident(selected.id, 'ACKNOWLEDGED')} className="flex items-center gap-2 rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-semibold text-cyan-100 hover:bg-cyan-300/20"><Check className="h-3.5 w-3.5" /> Tandai ditinjau</button>}
                  {selected.status !== 'CONTAINED' && <button type="button" onClick={() => updateIncident(selected.id, 'CONTAINED')} className="flex items-center gap-2 rounded-lg border border-emerald-300/30 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-100 hover:bg-emerald-300/20"><BadgeCheck className="h-3.5 w-3.5" /> Simulasikan selesai</button>}
                  {selected.status === 'CONTAINED' && <div className="flex items-center gap-2 text-xs text-emerald-200"><CheckCircle2 className="h-4 w-4" /> Skenario ditandai selesai secara lokal.</div>}
                </div>
                <div className="mt-5 rounded-xl border border-amber-300/15 bg-amber-300/[0.04] p-3 text-[10px] leading-relaxed text-amber-100/80"><CircleHelp className="mr-1 inline h-3.5 w-3.5" />Gunakan skenario ini untuk latihan komunikasi, pencatatan, dan pengambilan keputusan. Tidak ada tindakan keamanan otomatis.</div>
              </> : <div className="text-sm text-slate-500">Pilih insiden demo untuk melihat detail.</div>}
            </section>
          </div>
        )}

        {view === 'RESILIENCE' && (
          <div className="space-y-5">
            <div><h2 className="text-sm font-bold text-white">Ketahanan & kesiapan layanan</h2><p className="mt-1 text-[11px] text-slate-500">Panel kesehatan sintetis untuk tabletop exercise. Tidak mengambil metrik dari infrastruktur nyata.</p></div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {[
                { name: 'Kesiapan respons insiden', value: 92, detail: 'Rencana dan peran latihan', icon: <Users className="h-4 w-4" />, tone: 'cyan' },
                { name: 'Kontinuitas layanan demo', value: 98, detail: 'Sasaran pemulihan latihan', icon: <Server className="h-4 w-4" />, tone: 'emerald' },
                { name: 'Kelengkapan audit', value: 86, detail: 'Event sintetis terdokumentasi', icon: <FileSearch className="h-4 w-4" />, tone: 'violet' },
                { name: 'Kesiapan komunikasi', value: 89, detail: 'Kontak dan prosedur fiktif', icon: <Radio className="h-4 w-4" />, tone: 'amber' },
                { name: 'Kontrol identitas demo', value: 96, detail: 'Prinsip akses minimum', icon: <Fingerprint className="h-4 w-4" />, tone: 'cyan' },
                { name: 'Pemulihan cadangan', value: 94, detail: 'Hasil uji pemulihan mock', icon: <RefreshCw className="h-4 w-4" />, tone: 'emerald' },
              ].map((item) => (
                <article key={item.name} className="rounded-2xl border border-slate-700/70 bg-slate-950/50 p-4">
                  <div className="flex items-center justify-between"><span className="text-xs font-semibold text-slate-200">{item.name}</span><span className={`rounded-lg bg-${item.tone}-400/10 p-2 text-${item.tone}-300`}>{item.icon}</span></div>
                  <div className="mt-4 flex items-end justify-between"><strong className="font-mono text-2xl text-white">{item.value}%</strong><span className="text-[10px] text-slate-500">{item.detail}</span></div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full bg-${item.tone}-400 transition-all duration-700`} style={{ width: `${item.value}%` }} /></div>
                </article>
              ))}
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="flex items-center gap-2 text-xs font-bold text-slate-200"><ArrowUpRight className="h-4 w-4 text-emerald-300" />Latihan berikutnya</div><p className="mt-2 text-[11px] text-slate-500">Koordinasi respons dan pemulihan layanan demo.</p></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="flex items-center gap-2 text-xs font-bold text-slate-200"><ArrowDownRight className="h-4 w-4 text-cyan-300" />Risiko latihan</div><p className="mt-2 text-[11px] text-slate-500">Tidak ada target atau integrasi eksternal yang dikonfigurasi.</p></div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"><div className="flex items-center gap-2 text-xs font-bold text-slate-200"><ShieldCheck className="h-4 w-4 text-violet-300" />Pagar pengaman</div><p className="mt-2 text-[11px] text-slate-500">Skenario dibatasi pada data mock dan perubahan state UI.</p></div>
            </div>
          </div>
        )}

        {view === 'AUDIT' && (
          <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
            <section className="xl:col-span-8 terminal-panel rounded-2xl p-4 sm:p-5">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-emerald-900/50 pb-3">
                <div><div className="flex items-center gap-2 text-sm font-bold text-emerald-200"><Terminal className="h-4 w-4" />Terminal latihan</div><p className="mt-1 text-[10px] text-emerald-100/50">Tampilan terminal tiruan · perintah tidak dieksekusi · data lokal</p></div>
                <button type="button" onClick={() => setIsPaused((paused) => !paused)} className="rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 font-mono text-[10px] text-emerald-200 hover:bg-emerald-400/10">{isPaused ? 'Lanjutkan stream demo' : 'Jeda stream demo'}</button>
              </div>
              <div className="min-h-[270px] space-y-2 overflow-hidden font-mono text-[11px] leading-relaxed" aria-live="polite">
                <div className="mb-3 text-emerald-300/80">gds-training@local-lab:~$ <span className="text-slate-200">status --dataset synthetic</span></div>
                {logs.map((line, index) => <div key={`${line}-${index}`} className="break-words text-emerald-100/80"><span className="mr-2 text-emerald-500">[{String(index + 1).padStart(2, '0')}]</span>{line}</div>)}
                <div className="pt-1 text-emerald-300">gds-training@local-lab:~$ <span className="animate-pulse">▍</span></div>
              </div>
              <div className="mt-4 rounded-lg border border-emerald-900/50 bg-black/30 p-3 text-[10px] text-emerald-100/60">Mode aman: hanya menampilkan string log demo. Tidak ada shell, API, atau eksekutor perintah di belakang tampilan ini.</div>
            </section>
            <aside className="space-y-3 xl:col-span-4">
              <div className="rounded-2xl border border-slate-700/70 bg-slate-950/50 p-4"><div className="flex items-center gap-2 text-sm font-bold text-white"><FileSearch className="h-4 w-4 text-cyan-300" />Ringkasan audit demo</div><dl className="mt-4 space-y-3 text-xs"><div className="flex justify-between gap-3"><dt className="text-slate-500">Event tercatat</dt><dd className="font-mono text-slate-200">{logs.length}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">Insiden selesai</dt><dd className="font-mono text-emerald-300">{containedCount}</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">Sumber data</dt><dd className="font-mono text-cyan-300">SINTETIS</dd></div><div className="flex justify-between gap-3"><dt className="text-slate-500">Koneksi keluar</dt><dd className="font-mono text-emerald-300">NONAKTIF</dd></div></dl></div>
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.05] p-4"><div className="flex items-center gap-2 text-xs font-bold text-amber-100"><AlertCircle className="h-4 w-4" />Pernyataan penggunaan</div><p className="mt-2 text-[11px] leading-relaxed text-amber-100/70">Antarmuka ini adalah prototipe latihan. Indikator, event, dan angka tidak merepresentasikan kondisi nasional atau ancaman aktual.</p></div>
            </aside>
          </div>
        )}
      </main>

      <footer className="flex flex-col gap-2 border-t border-slate-700/60 bg-slate-950/50 px-4 py-3 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span className="flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />GARUDA CYBER COMMAND · PROTOTIPE LATIHAN LOKAL</span>
        <span>DATA SINTETIS · TANPA INTEGRASI ATAU AKSI SISTEM NYATA</span>
      </footer>
    </section>
  );
};
