import React, { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, ChevronDown, Clock3, Eye, Layers3, MapPin, Network, Radio, RefreshCw, ShieldCheck, Terminal, Wifi } from 'lucide-react';
import type { OperationRealizationData } from './RealizationProgressHUD';

interface CyberWarfareControlCenterProps {
  /** Compatibility only. The regional mock console does not dispatch real operations. */
  onTriggerOperation?: (op: OperationRealizationData) => void;
}

type Phase = 'PEMANTAUAN' | 'INVESTIGASI' | 'ANTISIPASI' | 'RESPONS';
interface Province { name: string; areas: string[]; }

// A browsable demo directory, not an authoritative or exhaustive administrative boundary dataset.
const provinces: Province[] = [
  { name: 'Aceh', areas: ['Kota Banda Aceh', 'Kota Sabang', 'Kabupaten Aceh Besar'] },
  { name: 'Sumatera Utara', areas: ['Kota Medan', 'Kota Pematangsiantar', 'Kabupaten Deli Serdang'] },
  { name: 'Sumatera Barat', areas: ['Kota Padang', 'Kota Bukittinggi', 'Kabupaten Agam'] },
  { name: 'Riau', areas: ['Kota Pekanbaru', 'Kota Dumai', 'Kabupaten Siak'] },
  { name: 'Kepulauan Riau', areas: ['Kota Batam', 'Kota Tanjungpinang', 'Kabupaten Bintan'] },
  { name: 'Jambi', areas: ['Kota Jambi', 'Kota Sungai Penuh', 'Kabupaten Muaro Jambi'] },
  { name: 'Sumatera Selatan', areas: ['Kota Palembang', 'Kota Lubuklinggau', 'Kabupaten Ogan Komering Ilir'] },
  { name: 'Kepulauan Bangka Belitung', areas: ['Kota Pangkalpinang', 'Kabupaten Bangka', 'Kabupaten Belitung'] },
  { name: 'Bengkulu', areas: ['Kota Bengkulu', 'Kabupaten Rejang Lebong', 'Kabupaten Bengkulu Utara'] },
  { name: 'Lampung', areas: ['Kota Bandar Lampung', 'Kota Metro', 'Kabupaten Lampung Selatan'] },
  { name: 'DKI Jakarta', areas: ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Utara'] },
  { name: 'Banten', areas: ['Kota Tangerang', 'Kota Serang', 'Kabupaten Lebak'] },
  { name: 'Jawa Barat', areas: ['Kota Bandung', 'Kota Bogor', 'Kabupaten Cirebon'] },
  { name: 'Jawa Tengah', areas: ['Kota Salatiga', 'Kota Semarang', 'Kabupaten Magelang', 'Kabupaten Banyumas', 'Kota Surakarta'] },
  { name: 'DI Yogyakarta', areas: ['Kota Yogyakarta', 'Kabupaten Sleman', 'Kabupaten Bantul'] },
  { name: 'Jawa Timur', areas: ['Kota Surabaya', 'Kota Malang', 'Kabupaten Banyuwangi'] },
  { name: 'Kalimantan Barat', areas: ['Kota Pontianak', 'Kota Singkawang', 'Kabupaten Ketapang'] },
  { name: 'Kalimantan Tengah', areas: ['Kota Palangka Raya', 'Kabupaten Kotawaringin Barat', 'Kabupaten Kapuas'] },
  { name: 'Kalimantan Selatan', areas: ['Kota Banjarmasin', 'Kota Banjarbaru', 'Kabupaten Tanah Laut'] },
  { name: 'Kalimantan Timur', areas: ['Kota Samarinda', 'Kota Balikpapan', 'Kabupaten Kutai Kartanegara'] },
  { name: 'Kalimantan Utara', areas: ['Kota Tarakan', 'Kabupaten Bulungan', 'Kabupaten Nunukan'] },
  { name: 'Bali', areas: ['Kota Denpasar', 'Kabupaten Badung', 'Kabupaten Buleleng'] },
  { name: 'Nusa Tenggara Barat', areas: ['Kota Mataram', 'Kota Bima', 'Kabupaten Lombok Tengah'] },
  { name: 'Nusa Tenggara Timur', areas: ['Kota Kupang', 'Kabupaten Ende', 'Kabupaten Manggarai Barat'] },
  { name: 'Sulawesi Utara', areas: ['Kota Manado', 'Kota Bitung', 'Kabupaten Minahasa'] },
  { name: 'Gorontalo', areas: ['Kota Gorontalo', 'Kabupaten Boalemo', 'Kabupaten Bone Bolango'] },
  { name: 'Sulawesi Tengah', areas: ['Kota Palu', 'Kabupaten Poso', 'Kabupaten Banggai'] },
  { name: 'Sulawesi Barat', areas: ['Kabupaten Mamuju', 'Kabupaten Majene', 'Kabupaten Polewali Mandar'] },
  { name: 'Sulawesi Selatan', areas: ['Kota Makassar', 'Kota Parepare', 'Kabupaten Gowa'] },
  { name: 'Sulawesi Tenggara', areas: ['Kota Kendari', 'Kota Baubau', 'Kabupaten Konawe'] },
  { name: 'Maluku', areas: ['Kota Ambon', 'Kota Tual', 'Kabupaten Maluku Tengah'] },
  { name: 'Maluku Utara', areas: ['Kota Ternate', 'Kota Tidore Kepulauan', 'Kabupaten Halmahera Barat'] },
  { name: 'Papua', areas: ['Kota Jayapura', 'Kabupaten Biak Numfor', 'Kabupaten Kepulauan Yapen'] },
  { name: 'Papua Barat', areas: ['Kabupaten Manokwari', 'Kabupaten Fakfak', 'Kabupaten Teluk Bintuni'] },
  { name: 'Papua Selatan', areas: ['Kabupaten Merauke', 'Kabupaten Boven Digoel', 'Kabupaten Asmat'] },
  { name: 'Papua Tengah', areas: ['Kabupaten Nabire', 'Kabupaten Mimika', 'Kabupaten Paniai'] },
  { name: 'Papua Pegunungan', areas: ['Kabupaten Jayawijaya', 'Kabupaten Yahukimo', 'Kabupaten Pegunungan Bintang'] },
  { name: 'Papua Barat Daya', areas: ['Kota Sorong', 'Kabupaten Raja Ampat', 'Kabupaten Sorong'] },
];

const phaseList: { id: Phase; label: string; detail: string }[] = [
  { id: 'PEMANTAUAN', label: 'Pemantauan', detail: 'Feed simulasi & status layanan' },
  { id: 'INVESTIGASI', label: 'Investigasi', detail: 'Korelasi mock & tinjauan analis' },
  { id: 'ANTISIPASI', label: 'Antisipasi', detail: 'Kesiapan dan rencana defensif' },
  { id: 'RESPONS', label: 'Respons', detail: 'Tabletop & pemulihan demo' },
];

const mockLogMessages = [
  '[MOCK] Feed sintetis diterima; skema valid',
  '[OK] Node lab fiktif berstatus sehat',
  '[SYNC] Snapshot demo diperbarui pada seluruh panel',
  '[PRIVACY] Tidak ada sensor atau komunikasi nyata yang diakses',
  '[AUDIT] Perubahan simulasi tersimpan pada state UI lokal',
];

function RegionScene({ province, area, tick }: { province: string; area: string; tick: number }) {
  const isSalatiga = area === 'Kota Salatiga';
  return (
    <div className="relative min-h-[310px] overflow-hidden rounded-xl border border-cyan-300/20 bg-[#06111d] sm:min-h-[390px]" aria-label={`Peta ilustratif simulasi ${area}, ${province}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_52%_50%,rgba(34,211,238,0.12),transparent_58%)]" />
      <div className="absolute inset-0 regional-grid opacity-50" />
      <div className="absolute left-3 top-3 z-10 rounded-lg border border-slate-600/70 bg-slate-950/85 px-3 py-2 font-mono text-[9px] text-slate-300 backdrop-blur">
        <div className="flex items-center gap-1.5 text-cyan-200"><MapPin className="h-3 w-3" /> {area.toUpperCase()} · {province.toUpperCase()}</div>
        <div className="mt-1 text-slate-500">PETA VEKTOR ILUSTRATIF · BUKAN PETA LIVE</div>
      </div>
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-lg border border-emerald-400/20 bg-slate-950/80 px-2.5 py-2 font-mono text-[8px] text-emerald-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> MOCK FEED</div>

      <svg viewBox="0 0 900 520" className="absolute inset-0 h-full w-full" role="img" aria-label={`Ilustrasi relief dan jaringan jalan sintetis di ${area}`}>
        <defs>
          <linearGradient id="regionTerrain" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#12364a" /><stop offset="0.5" stopColor="#0b2433" /><stop offset="1" stopColor="#081522" /></linearGradient>
          <linearGradient id="regionSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0e2b3d" /><stop offset="1" stopColor="#06111c" /></linearGradient>
          <filter id="regionGlow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <pattern id="districtLines" width="120" height="88" patternUnits="userSpaceOnUse"><path d="M 120 0 L 0 0 0 88" fill="none" stroke="#2b7182" strokeOpacity=".23" strokeWidth="1" /><circle cx="0" cy="0" r="2" fill="#67e8f9" fillOpacity=".35" /></pattern>
        </defs>
        {/* Layered extrusions create a gentle pseudo-3D map effect; geometry is decorative mock. */}
        <path d="M80 160 L215 92 L365 118 L476 82 L655 143 L812 127 L855 318 L742 390 L577 376 L453 435 L278 384 L120 402 L62 294 Z" transform="translate(0 26)" fill="#030912" stroke="#10293a" strokeWidth="5" />
        <path d="M80 160 L215 92 L365 118 L476 82 L655 143 L812 127 L855 318 L742 390 L577 376 L453 435 L278 384 L120 402 L62 294 Z" transform="translate(0 13)" fill="url(#regionSide)" stroke="#14506a" strokeWidth="2" />
        <path d="M80 160 L215 92 L365 118 L476 82 L655 143 L812 127 L855 318 L742 390 L577 376 L453 435 L278 384 L120 402 L62 294 Z" fill="url(#regionTerrain)" stroke="#38bdf8" strokeOpacity=".65" strokeWidth="2" />
        <path d="M80 160 L215 92 L365 118 L476 82 L655 143 L812 127 L855 318 L742 390 L577 376 L453 435 L278 384 L120 402 L62 294 Z" fill="url(#districtLines)" opacity=".8" />
        {/* Terrain contours / elevation bands */}
        <path d="M168 237 Q280 155 393 203 T626 194 T779 237 M132 286 Q261 210 371 252 T597 248 T801 287 M187 336 Q292 275 403 314 T610 305 T749 335" fill="none" stroke="#38bdf8" strokeOpacity=".22" strokeWidth="1.5" />
        <path d="M285 145 Q355 182 402 254 T485 368 M535 126 Q499 205 560 260 T680 355 M150 183 Q237 234 260 316" fill="none" stroke="#a78bfa" strokeOpacity=".35" strokeWidth="2" strokeDasharray="5 8" />
        {/* Schematic roads and civic corridors */}
        <path d="M94 313 C218 285 274 210 377 228 S550 325 792 188" fill="none" stroke="#fbbf24" strokeOpacity=".65" strokeWidth="3" />
        <path d="M178 130 C221 211 336 252 451 161 S644 214 759 340" fill="none" stroke="#e2e8f0" strokeOpacity=".5" strokeWidth="2" />
        <path d="M104 237 C240 256 342 338 508 295 S687 156 830 268" fill="none" stroke="#38bdf8" strokeOpacity=".55" strokeWidth="2" strokeDasharray="7 6" />
        {/* Mock district points */}
        {[[226, 198], [370, 272], [640, 239], [517, 340], [740, 183]].map(([x, y], index) => <g key={index}><circle cx={x} cy={y} r="12" fill="#22d3ee" fillOpacity=".07" /><circle cx={x} cy={y} r="3" fill="#67e8f9" /><text x={x + 9} y={y - 7} fill="#a5f3fc" fillOpacity=".75" fontSize="9" fontFamily="monospace">SEKTOR 0{index + 1}</text></g>)}
        {/* Selected location marker is deliberately generic and not tied to any target or sensor. */}
        <g transform={isSalatiga ? 'translate(470 244)' : 'translate(470 244)'}>
          <circle r="31" fill="#22d3ee" fillOpacity=".08" />
          <circle r="21" fill="none" stroke="#67e8f9" strokeOpacity=".58" strokeDasharray="3 6" className="mock-location-ring" />
          <circle r="7" fill="#fbbf24" filter="url(#regionGlow)" />
          <path d="M0 -46 L0 -18 M-46 0 L-18 0 M18 0 L46 0 M0 18 L0 46" stroke="#67e8f9" strokeOpacity=".7" strokeWidth="1" />
          <rect x="16" y="-55" width="140" height="24" rx="4" fill="#020817" stroke="#22d3ee" strokeOpacity=".55" />
          <text x="24" y="-39" fill="#cffafe" fontSize="10" fontFamily="monospace">{area.toUpperCase()}</text>
        </g>
        <text x="78" y="470" fill="#64748b" fontSize="10" fontFamily="monospace">SIMULATED TERRAIN · VECTOR ROADS · NO LIVE GEODATA</text>
      </svg>
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 font-mono text-[8px]">
        <span className="rounded border border-cyan-300/20 bg-slate-950/80 px-2 py-1 text-cyan-100">RELIEF: {isSalatiga ? 'DATARAN TINGGI (ILUSTRASI)' : 'MODEL WILAYAH MOCK'}</span>
        <span className="rounded border border-amber-300/20 bg-slate-950/80 px-2 py-1 text-amber-100">LAYER: JALAN · SEKTOR · TOPOGRAFI</span>
      </div>
      <span className="absolute bottom-4 right-4 font-mono text-[9px] text-cyan-100/50">FRAME {String(tick % 999).padStart(3, '0')}</span>
    </div>
  );
}

export const CyberWarfareControlCenter: React.FC<CyberWarfareControlCenterProps> = ({ onTriggerOperation: _onTriggerOperation }) => {
  const [phase, setPhase] = useState<Phase>('PEMANTAUAN');
  const [provinceName, setProvinceName] = useState('Jawa Tengah');
  const [area, setArea] = useState('Kota Salatiga');
  const [clock, setClock] = useState(() => new Date());
  const [tick, setTick] = useState(0);
  const [logs, setLogs] = useState<string[]>(['[MOCK] Regional demo siap · koneksi sensor live nonaktif', '[SYNC] Monitor peta, status layanan, dan terminal terhubung ke state UI lokal']);
  const [notice, setNotice] = useState('');
  const selectedProvince = provinces.find((item) => item.name === provinceName) ?? provinces[13];

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTick((value) => value + 1);
      setLogs((current) => [...current, `${new Date().toLocaleTimeString('id-ID', { hour12: false })} ${mockLogMessages[tick % mockLogMessages.length]}`].slice(-6));
    }, 3200);
    return () => window.clearInterval(timer);
  }, [tick]);

  const addLog = (message: string) => setLogs((current) => [...current, `${new Date().toLocaleTimeString('id-ID', { hour12: false })} ${message}`].slice(-6));
  const chooseProvince = (value: string) => {
    const next = provinces.find((item) => item.name === value);
    if (!next) return;
    setProvinceName(value);
    setArea(next.areas[0]);
    addLog(`[SYNC] Wilayah demo dipilih: ${next.areas[0]}, ${value}`);
  };
  const chooseArea = (value: string) => {
    setArea(value);
    addLog(`[SYNC] Semua monitor mengikuti pilihan wilayah mock: ${value}, ${provinceName}`);
  };
  const timeLabel = useMemo(() => clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), [clock]);

  return (
    <section className="cyber-panel overflow-hidden rounded-2xl text-slate-100" aria-label="Pusat komando simulasi regional">
      <header className="border-b border-slate-700/60 bg-slate-950/65 p-4 sm:p-6">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-cyan-100">GARUDA CYBER COMMAND</span><span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 font-mono text-[10px] font-bold text-amber-100">SIMULASI GEOSPASIAL · MOCK DATA</span></div>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">Monitor Regional NKRI</h1>
            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-400">Pilih provinsi dan kota/kabupaten untuk memperbarui peta pseudo-3D dan panel monitor. Visualnya adalah ilustrasi vektor lokal, bukan peta aktual, sensor, atau feed real-time.</p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]"><span className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-emerald-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />LAB LOKAL</span><span className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-300">{timeLabel} WIB</span></div>
        </div>
        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <label className="block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Provinsi · cakupan demo</span><span className="relative block"><select value={provinceName} onChange={(event) => chooseProvince(event.target.value)} className="w-full appearance-none rounded-xl border border-cyan-300/25 bg-slate-900 px-3 py-3 pr-9 text-xs text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10">{provinces.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-200" /></span></label>
          <label className="block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Kota / kabupaten · contoh area</span><span className="relative block"><select value={area} onChange={(event) => chooseArea(event.target.value)} className="w-full appearance-none rounded-xl border border-cyan-300/25 bg-slate-900 px-3 py-3 pr-9 text-xs text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10">{selectedProvince.areas.map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-200" /></span></label>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.04] px-3 py-3 font-mono text-[9px] text-emerald-100"><Network className="h-4 w-4 shrink-0" /><span>4 MONITOR<br /><strong>SINKRON · LOCAL</strong></span></div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{phaseList.map((item, index) => <button key={item.id} type="button" onClick={() => { setPhase(item.id); addLog(`[WORKFLOW] Tahap ${item.label} aktif untuk skenario mock ${area}`); }} className={`rounded-xl border p-2.5 text-left transition ${phase === item.id ? 'border-cyan-300/40 bg-cyan-300/[0.08]' : 'border-slate-800 bg-slate-900/45 hover:border-slate-600'}`}><span className="block font-mono text-[8px] text-slate-500">TAHAP 0{index + 1}</span><span className={`mt-1 block text-[10px] font-bold ${phase === item.id ? 'text-cyan-100' : 'text-slate-300'}`}>{item.label}</span></button>)}</div>
      </header>

      <div className="border-b border-amber-300/20 bg-amber-300/[0.06] px-4 py-2.5 text-[10px] leading-relaxed text-amber-100/90 sm:px-6"><strong>BATAS DEMO:</strong> direktori wilayah berisi contoh pilihan untuk simulasi, bukan daftar batas administratif resmi yang lengkap. Peta, metrik, status, dan log dibuat lokal; tidak ada pemantauan kota nyata atau koneksi eksternal.</div>

      <main className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-12 sm:p-6">
        <section className="xl:col-span-8"><div className="mb-3 flex flex-wrap items-end justify-between gap-2"><div><h2 className="flex items-center gap-2 text-sm font-bold text-white"><MapPin className="h-4 w-4 text-cyan-300" />{area}, {provinceName}</h2><p className="mt-1 text-[10px] text-slate-500">Pseudo-3D relief, jalan skematik, sektor demo dan marker pilihan tersinkron.</p></div><span className="flex items-center gap-1 rounded-full border border-cyan-300/20 bg-cyan-300/[0.05] px-2 py-1 font-mono text-[8px] text-cyan-100"><Layers3 className="h-3 w-3" />VECTOR LAYERS</span></div><RegionScene province={provinceName} area={area} tick={tick} /><div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">{[
          { title: 'Feed wilayah', value: 'MOCK / STABIL', icon: <Radio className="h-3.5 w-3.5 text-cyan-300" /> },
          { title: 'Node latihan', value: '08 / 08 DEMO', icon: <Network className="h-3.5 w-3.5 text-violet-300" /> },
          { title: 'Kesiapan layanan', value: `${96 + (tick % 4)}.${tick % 10}%`, icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> },
          { title: 'Sinkronisasi', value: 'LOKAL', icon: <Activity className="h-3.5 w-3.5 text-amber-300" /> },
        ].map((item) => <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/55 p-3"><div className="flex items-center gap-1.5 text-[9px] text-slate-500">{item.icon}{item.title}</div><div className="mt-1.5 font-mono text-[10px] font-bold text-slate-200">{item.value}</div></div>)}</div></section>

        <aside className="space-y-4 xl:col-span-4">
          <section className="rounded-2xl border border-slate-700/70 bg-slate-950/50 p-4"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-xs font-bold text-white"><Eye className="h-4 w-4 text-cyan-300" />Panel monitor sinkron</h2><span className="font-mono text-[8px] text-emerald-200">DEMO LIVE</span></div><p className="mt-1 text-[9px] text-slate-500">Wilayah aktif: {area}, {provinceName}</p><div className="mt-3 space-y-2">{[
            { name: 'Pemantauan layanan', status: 'NORMAL', width: '88%', color: 'bg-cyan-300' },
            { name: 'Triase insiden latihan', status: phase === 'INVESTIGASI' ? 'DITINJAU' : 'SIAP', width: phase === 'INVESTIGASI' ? '72%' : '48%', color: 'bg-violet-300' },
            { name: 'Kesiapan respons', status: phase === 'RESPONS' ? 'TABLETOP' : 'STANDBY', width: phase === 'RESPONS' ? '92%' : '61%', color: 'bg-amber-300' },
          ].map((monitor) => <div key={monitor.name} className="rounded-xl border border-slate-800 bg-slate-900/50 p-2.5"><div className="flex justify-between gap-2 text-[9px]"><span className="text-slate-300">{monitor.name}</span><span className="font-mono text-slate-500">{monitor.status}</span></div><div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${monitor.color} transition-all duration-700`} style={{ width: monitor.width }} /></div></div>)}</div></section>

          <section className="terminal-panel rounded-2xl p-4"><div className="flex items-center justify-between border-b border-emerald-900/50 pb-2"><h2 className="flex items-center gap-2 text-xs font-bold text-emerald-100"><Terminal className="h-4 w-4" />Terminal mock</h2><span className="font-mono text-[8px] text-emerald-300">READ-ONLY UI</span></div><div className="mt-3 space-y-2 font-mono text-[9px] leading-relaxed" aria-live="polite"><div className="text-emerald-300">gds-training@local:~$ <span className="text-slate-200">region --select "{area}"</span></div>{logs.slice(-4).map((line, index) => <div key={`${line}-${index}`} className="break-words text-emerald-100/70"><span className="mr-1 text-emerald-600">[{String(index + 1).padStart(2, '0')}]</span>{line}</div>)}</div><p className="mt-3 border-t border-emerald-900/50 pt-2 text-[8px] leading-relaxed text-emerald-100/50">Command hanya dekorasi. Tidak ada shell, endpoint, API, atau eksekutor.</p></section>

          <section className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-3"><div className="flex items-center gap-2 text-[10px] font-bold text-amber-100"><AlertTriangle className="h-3.5 w-3.5" />Ilustrasi, bukan pemantauan nyata</div><p className="mt-1.5 text-[9px] leading-relaxed text-amber-100/65">Geometri peta dibuat dari SVG skematik sebagai efek pseudo-3D. Nama wilayah hanya untuk konteks latihan; tidak menggambarkan koordinat akurat, objek, penduduk, jaringan, atau kondisi aktual.</p></section>
        </aside>
      </main>
      <footer className="flex flex-col gap-2 border-t border-slate-700/60 bg-slate-950/55 px-4 py-3 text-[9px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6"><span className="flex items-center gap-2"><Wifi className="h-3.5 w-3.5 text-emerald-400" />GARUDA DOME · SIMULASI REGIONAL LOKAL</span><span>NO LIVE GEODATA · NO SENSOR · NO EXTERNAL ACTIONS · DATA MOCK</span></footer>
    </section>
  );
};
