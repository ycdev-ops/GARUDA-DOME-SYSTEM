import React, { useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, ChevronDown, Clock3, Eye, Layers3, MapPin, Network, Radio, RefreshCw, Search, ShieldCheck, Terminal, Wifi, ZoomIn, ZoomOut } from 'lucide-react';
import type { OperationRealizationData } from './RealizationProgressHUD';

interface CyberWarfareControlCenterProps {
  /** Compatibility only: this local tabletop demo never dispatches real operations. */
  onTriggerOperation?: (op: OperationRealizationData) => void;
}

type Phase = 'PEMANTAUAN' | 'INVESTIGASI' | 'ANTISIPASI' | 'RESPONS';
type MapLayer = 'RELIEF' | 'KORIDOR' | 'SEKTOR';
interface Province { name: string; island: string; areas: string[]; }

// Sample options for a local UI demo—not an authoritative or exhaustive administrative dataset.
const provinces: Province[] = [
  { name: 'Aceh', island: 'Sumatera', areas: ['Kota Banda Aceh', 'Kota Sabang', 'Kabupaten Aceh Besar'] },
  { name: 'Sumatera Utara', island: 'Sumatera', areas: ['Kota Medan', 'Kota Pematangsiantar', 'Kabupaten Deli Serdang'] },
  { name: 'Sumatera Barat', island: 'Sumatera', areas: ['Kota Padang', 'Kota Bukittinggi', 'Kabupaten Agam'] },
  { name: 'Riau', island: 'Sumatera', areas: ['Kota Pekanbaru', 'Kota Dumai', 'Kabupaten Siak'] },
  { name: 'Kepulauan Riau', island: 'Sumatera', areas: ['Kota Batam', 'Kota Tanjungpinang', 'Kabupaten Bintan'] },
  { name: 'Jambi', island: 'Sumatera', areas: ['Kota Jambi', 'Kota Sungai Penuh', 'Kabupaten Muaro Jambi'] },
  { name: 'Sumatera Selatan', island: 'Sumatera', areas: ['Kota Palembang', 'Kota Lubuklinggau', 'Kabupaten Ogan Komering Ilir'] },
  { name: 'Kepulauan Bangka Belitung', island: 'Sumatera', areas: ['Kota Pangkalpinang', 'Kabupaten Bangka', 'Kabupaten Belitung'] },
  { name: 'Bengkulu', island: 'Sumatera', areas: ['Kota Bengkulu', 'Kabupaten Rejang Lebong', 'Kabupaten Bengkulu Utara'] },
  { name: 'Lampung', island: 'Sumatera', areas: ['Kota Bandar Lampung', 'Kota Metro', 'Kabupaten Lampung Selatan'] },
  { name: 'DKI Jakarta', island: 'Jawa', areas: ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Utara'] },
  { name: 'Banten', island: 'Jawa', areas: ['Kota Tangerang', 'Kota Serang', 'Kabupaten Lebak'] },
  { name: 'Jawa Barat', island: 'Jawa', areas: ['Kota Bandung', 'Kota Bogor', 'Kabupaten Cirebon'] },
  { name: 'Jawa Tengah', island: 'Jawa', areas: ['Kota Salatiga', 'Kota Semarang', 'Kabupaten Magelang', 'Kabupaten Banyumas', 'Kota Surakarta'] },
  { name: 'DI Yogyakarta', island: 'Jawa', areas: ['Kota Yogyakarta', 'Kabupaten Sleman', 'Kabupaten Bantul'] },
  { name: 'Jawa Timur', island: 'Jawa', areas: ['Kota Surabaya', 'Kota Malang', 'Kabupaten Banyuwangi'] },
  { name: 'Kalimantan Barat', island: 'Kalimantan', areas: ['Kota Pontianak', 'Kota Singkawang', 'Kabupaten Ketapang'] },
  { name: 'Kalimantan Tengah', island: 'Kalimantan', areas: ['Kota Palangka Raya', 'Kabupaten Kotawaringin Barat', 'Kabupaten Kapuas'] },
  { name: 'Kalimantan Selatan', island: 'Kalimantan', areas: ['Kota Banjarmasin', 'Kota Banjarbaru', 'Kabupaten Tanah Laut'] },
  { name: 'Kalimantan Timur', island: 'Kalimantan', areas: ['Kota Samarinda', 'Kota Balikpapan', 'Kabupaten Kutai Kartanegara'] },
  { name: 'Kalimantan Utara', island: 'Kalimantan', areas: ['Kota Tarakan', 'Kabupaten Bulungan', 'Kabupaten Nunukan'] },
  { name: 'Bali', island: 'Nusa Tenggara', areas: ['Kota Denpasar', 'Kabupaten Badung', 'Kabupaten Buleleng'] },
  { name: 'Nusa Tenggara Barat', island: 'Nusa Tenggara', areas: ['Kota Mataram', 'Kota Bima', 'Kabupaten Lombok Tengah'] },
  { name: 'Nusa Tenggara Timur', island: 'Nusa Tenggara', areas: ['Kota Kupang', 'Kabupaten Ende', 'Kabupaten Manggarai Barat'] },
  { name: 'Sulawesi Utara', island: 'Sulawesi', areas: ['Kota Manado', 'Kota Bitung', 'Kabupaten Minahasa'] },
  { name: 'Gorontalo', island: 'Sulawesi', areas: ['Kota Gorontalo', 'Kabupaten Boalemo', 'Kabupaten Bone Bolango'] },
  { name: 'Sulawesi Tengah', island: 'Sulawesi', areas: ['Kota Palu', 'Kabupaten Poso', 'Kabupaten Banggai'] },
  { name: 'Sulawesi Barat', island: 'Sulawesi', areas: ['Kabupaten Mamuju', 'Kabupaten Majene', 'Kabupaten Polewali Mandar'] },
  { name: 'Sulawesi Selatan', island: 'Sulawesi', areas: ['Kota Makassar', 'Kota Parepare', 'Kabupaten Gowa'] },
  { name: 'Sulawesi Tenggara', island: 'Sulawesi', areas: ['Kota Kendari', 'Kota Baubau', 'Kabupaten Konawe'] },
  { name: 'Maluku', island: 'Maluku', areas: ['Kota Ambon', 'Kota Tual', 'Kabupaten Maluku Tengah'] },
  { name: 'Maluku Utara', island: 'Maluku', areas: ['Kota Ternate', 'Kota Tidore Kepulauan', 'Kabupaten Halmahera Barat'] },
  { name: 'Papua', island: 'Papua', areas: ['Kota Jayapura', 'Kabupaten Biak Numfor', 'Kabupaten Kepulauan Yapen'] },
  { name: 'Papua Barat', island: 'Papua', areas: ['Kabupaten Manokwari', 'Kabupaten Fakfak', 'Kabupaten Teluk Bintuni'] },
  { name: 'Papua Selatan', island: 'Papua', areas: ['Kabupaten Merauke', 'Kabupaten Boven Digoel', 'Kabupaten Asmat'] },
  { name: 'Papua Tengah', island: 'Papua', areas: ['Kabupaten Nabire', 'Kabupaten Mimika', 'Kabupaten Paniai'] },
  { name: 'Papua Pegunungan', island: 'Papua', areas: ['Kabupaten Jayawijaya', 'Kabupaten Yahukimo', 'Kabupaten Pegunungan Bintang'] },
  { name: 'Papua Barat Daya', island: 'Papua', areas: ['Kota Sorong', 'Kabupaten Raja Ampat', 'Kabupaten Sorong'] },
];

const phases: { id: Phase; label: string; detail: string }[] = [
  { id: 'PEMANTAUAN', label: 'Pemantauan', detail: 'Feed simulasi & status layanan' },
  { id: 'INVESTIGASI', label: 'Investigasi', detail: 'Korelasi mock & tinjauan analis' },
  { id: 'ANTISIPASI', label: 'Antisipasi', detail: 'Kesiapan dan rencana defensif' },
  { id: 'RESPONS', label: 'Respons', detail: 'Tabletop & pemulihan demo' },
];
const mockEvents = [
  '[MOCK] Feed sintetis diterima; skema valid',
  '[OK] Node lab fiktif berstatus sehat',
  '[SYNC] Snapshot demo diperbarui pada seluruh panel',
  '[PRIVACY] Tidak ada sensor atau komunikasi nyata yang diakses',
  '[AUDIT] Perubahan simulasi tersimpan pada state UI lokal',
];

function RegionScene({ province, area, island, tick, layer, zoom }: { province: string; area: string; island: string; tick: number; layer: MapLayer; zoom: number }) {
  const seed = [...province].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const markerX = 390 + (seed % 120);
  const markerY = 218 + (seed % 62);
  const showRoads = layer === 'KORIDOR' || layer === 'SEKTOR';
  const showContours = layer === 'RELIEF' || layer === 'SEKTOR';
  const points: [number, number][] = [[226, 198], [370, 272], [640, 239], [517, 340], [740, 183]];

  return (
    <div className="relative min-h-[310px] overflow-hidden rounded-xl border border-cyan-300/20 bg-[#06111d] sm:min-h-[420px]" aria-label={`Peta ilustratif simulasi ${area}, ${province}`}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_52%_50%,rgba(34,211,238,0.12),transparent_58%)]" />
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: 'linear-gradient(rgba(103,232,249,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(103,232,249,.07) 1px, transparent 1px)', backgroundSize: '30px 30px', maskImage: 'radial-gradient(ellipse at center, black 35%, transparent 85%)' }} />
      <div className="absolute left-3 top-3 z-10 rounded-lg border border-slate-600/70 bg-slate-950/85 px-3 py-2 font-mono text-[9px] text-slate-300 backdrop-blur">
        <div className="flex items-center gap-1.5 text-cyan-200"><MapPin className="h-3 w-3" /> {area.toUpperCase()} · {province.toUpperCase()}</div>
        <div className="mt-1 text-slate-500">PSEUDO-3D · SKEMA {island.toUpperCase()} · BUKAN PETA LIVE</div>
      </div>
      <div className="absolute right-3 top-3 z-10 flex items-center gap-1.5 rounded-lg border border-emerald-400/20 bg-slate-950/80 px-2.5 py-2 font-mono text-[8px] text-emerald-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> DATA SINTETIS</div>
      <svg viewBox="0 0 900 520" className="absolute inset-0 h-full w-full transition-transform duration-500" style={{ transform: `scale(${zoom})` }} role="img" aria-label={`Relief skematik sintetis untuk ${area}`}>
        <defs>
          <linearGradient id="regionTerrain" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#16465b" /><stop offset="0.5" stopColor="#0b2938" /><stop offset="1" stopColor="#081522" /></linearGradient>
          <linearGradient id="regionSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0e2b3d" /><stop offset="1" stopColor="#06111c" /></linearGradient>
          <filter id="regionGlow"><feGaussianBlur stdDeviation="5" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <pattern id="districtLines" width="120" height="88" patternUnits="userSpaceOnUse"><path d="M 120 0 L 0 0 0 88" fill="none" stroke="#2b7182" strokeOpacity=".23" strokeWidth="1" /><circle cx="0" cy="0" r="2" fill="#67e8f9" fillOpacity=".35" /></pattern>
        </defs>
        {/* Decorative extrusion and vector layers are not geographic boundaries. */}
        <path d="M80 160 L215 92 L365 118 L476 82 L655 143 L812 127 L855 318 L742 390 L577 376 L453 435 L278 384 L120 402 L62 294 Z" transform="translate(0 26)" fill="#030912" stroke="#10293a" strokeWidth="5" />
        <path d="M80 160 L215 92 L365 118 L476 82 L655 143 L812 127 L855 318 L742 390 L577 376 L453 435 L278 384 L120 402 L62 294 Z" transform="translate(0 13)" fill="url(#regionSide)" stroke="#14506a" strokeWidth="2" />
        <path d="M80 160 L215 92 L365 118 L476 82 L655 143 L812 127 L855 318 L742 390 L577 376 L453 435 L278 384 L120 402 L62 294 Z" fill="url(#regionTerrain)" stroke="#38bdf8" strokeOpacity=".65" strokeWidth="2" />
        <path d="M80 160 L215 92 L365 118 L476 82 L655 143 L812 127 L855 318 L742 390 L577 376 L453 435 L278 384 L120 402 L62 294 Z" fill="url(#districtLines)" opacity=".8" />
        {showContours && <g fill="none" stroke="#38bdf8" strokeOpacity=".25" strokeWidth="1.5"><path d="M168 237 Q280 155 393 203 T626 194 T779 237 M132 286 Q261 210 371 252 T597 248 T801 287 M187 336 Q292 275 403 314 T610 305 T749 335" /><path d="M285 145 Q355 182 402 254 T485 368 M535 126 Q499 205 560 260 T680 355 M150 183 Q237 234 260 316" stroke="#a78bfa" strokeOpacity=".3" strokeDasharray="5 8" /></g>}
        {showRoads && <g fill="none"><path d="M94 313 C218 285 274 210 377 228 S550 325 792 188" stroke="#fbbf24" strokeOpacity=".7" strokeWidth="3" /><path d="M178 130 C221 211 336 252 451 161 S644 214 759 340" stroke="#e2e8f0" strokeOpacity=".48" strokeWidth="2" /><path d="M104 237 C240 256 342 338 508 295 S687 156 830 268" stroke="#38bdf8" strokeOpacity=".55" strokeWidth="2" strokeDasharray="7 6" /></g>}
        {layer === 'SEKTOR' && points.map(([x, y], index) => <g key={index}><circle cx={x} cy={y} r="14" fill="#22d3ee" fillOpacity=".05" stroke="#67e8f9" strokeOpacity=".28" strokeDasharray="3 4" /><circle cx={x} cy={y} r="3" fill="#67e8f9" /><text x={x + 9} y={y - 7} fill="#a5f3fc" fillOpacity=".75" fontSize="9" fontFamily="monospace">DEMO 0{index + 1}</text></g>)}
        <g transform={`translate(${markerX} ${markerY})`}>
          <circle r="34" fill="#22d3ee" fillOpacity=".08" />
          <circle r="22" fill="none" stroke="#67e8f9" strokeOpacity=".6" strokeDasharray="3 6" className="mock-location-ring" />
          <circle r="7" fill="#fbbf24" filter="url(#regionGlow)" />
          <path d="M0 -46 L0 -18 M-46 0 L-18 0 M18 0 L46 0 M0 18 L0 46" stroke="#67e8f9" strokeOpacity=".7" strokeWidth="1" />
          <rect x="16" y="-55" width="158" height="24" rx="4" fill="#020817" stroke="#22d3ee" strokeOpacity=".55" />
          <text x="24" y="-39" fill="#cffafe" fontSize="10" fontFamily="monospace">{area.toUpperCase()}</text>
        </g>
        <text x="78" y="470" fill="#64748b" fontSize="10" fontFamily="monospace">ILLUSTRATIVE TERRAIN · NO LIVE GEODATA</text>
      </svg>
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2 font-mono text-[8px]"><span className="rounded border border-cyan-300/20 bg-slate-950/85 px-2 py-1 text-cyan-100">LAYER: {layer}</span><span className="rounded border border-amber-300/20 bg-slate-950/85 px-2 py-1 text-amber-100">AREA: MOCK DIRECTORY</span></div>
      <span className="absolute bottom-4 right-4 font-mono text-[9px] text-cyan-100/50">FRAME {String(tick % 999).padStart(3, '0')}</span>
    </div>
  );
}

export const CyberWarfareControlCenter: React.FC<CyberWarfareControlCenterProps> = ({ onTriggerOperation: _onTriggerOperation }) => {
  const [phase, setPhase] = useState<Phase>('PEMANTAUAN');
  const [provinceName, setProvinceName] = useState('Jawa Tengah');
  const [area, setArea] = useState('Kota Salatiga');
  const [areaSearch, setAreaSearch] = useState('');
  const [layer, setLayer] = useState<MapLayer>('SEKTOR');
  const [zoom, setZoom] = useState(1);
  const [clock, setClock] = useState(() => new Date());
  const [tick, setTick] = useState(0);
  const [logs, setLogs] = useState<string[]>(['[MOCK] Regional demo siap · sensor live nonaktif', '[SYNC] Peta, status monitor, dan terminal mengikuti state lokal']);
  const selectedProvince = provinces.find((item) => item.name === provinceName) ?? provinces[13];
  const visibleAreas = selectedProvince.areas.filter((item) => item.toLowerCase().includes(areaSearch.trim().toLowerCase()));

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    let eventIndex = 0;
    const timer = window.setInterval(() => {
      setTick((value) => value + 1);
      const stamp = new Date().toLocaleTimeString('id-ID', { hour12: false });
      setLogs((current) => [...current, `${stamp} ${mockEvents[eventIndex++ % mockEvents.length]}`].slice(-7));
    }, 3000);
    return () => window.clearInterval(timer);
  }, []);

  const addLog = (message: string) => setLogs((current) => [...current, `${new Date().toLocaleTimeString('id-ID', { hour12: false })} ${message}`].slice(-7));
  const chooseProvince = (value: string) => {
    const next = provinces.find((item) => item.name === value);
    if (!next) return;
    setProvinceName(value);
    setArea(next.areas[0]);
    setAreaSearch('');
    addLog(`[SYNC] Wilayah demo: ${next.areas[0]}, ${value}`);
  };
  const chooseArea = (value: string) => {
    if (!value) return;
    setArea(value);
    setAreaSearch('');
    addLog(`[SYNC] Semua monitor mengikuti pilihan mock: ${value}, ${provinceName}`);
  };
  const timeLabel = useMemo(() => clock.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }), [clock]);

  const reset = () => {
    setProvinceName('Jawa Tengah');
    setArea('Kota Salatiga');
    setAreaSearch('');
    setPhase('PEMANTAUAN');
    setLayer('SEKTOR');
    setZoom(1);
    addLog('[RESET] Skenario regional kembali ke Kota Salatiga · data mock');
  };

  return (
    <section className="cyber-panel overflow-hidden rounded-2xl text-slate-100" aria-label="Pusat komando simulasi regional">
      <header className="border-b border-slate-700/60 bg-slate-950/65 p-4 sm:p-6">
        <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2"><span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 font-mono text-[10px] font-bold tracking-widest text-cyan-100">GARUDA CYBER COMMAND</span><span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 font-mono text-[10px] font-bold text-amber-100">SIMULASI GEOSPASIAL · MOCK DATA</span></div>
            <h1 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">Monitor Regional NKRI</h1>
            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-400">Pilih provinsi dan kota/kabupaten contoh untuk menyinkronkan peta pseudo-3D, status monitor, dan terminal. Visual ini ilustrasi vektor lokal—bukan geodata, sensor, atau feed real-time.</p>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px]"><span className="flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-emerald-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />LAB LOKAL</span><span className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-300">{timeLabel} WIB</span><button type="button" onClick={reset} className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-300 hover:border-cyan-300/40 hover:text-white"><RefreshCw className="h-3.5 w-3.5" />Reset</button></div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1.2fr_auto] md:items-end">
          <label className="block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Provinsi · cakupan demo</span><span className="relative block"><select value={provinceName} onChange={(event) => chooseProvince(event.target.value)} className="w-full appearance-none rounded-xl border border-cyan-300/25 bg-slate-900 px-3 py-3 pr-9 text-xs text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10">{provinces.map((item) => <option key={item.name} value={item.name}>{item.name}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-200" /></span></label>
          <div className="grid grid-cols-[minmax(110px,.7fr)_minmax(150px,1.3fr)] gap-2">
            <label className="block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Cari area</span><span className="relative block"><Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500" /><input value={areaSearch} onChange={(event) => setAreaSearch(event.target.value)} placeholder="Ketik nama…" aria-label="Cari kota atau kabupaten contoh" className="w-full rounded-xl border border-slate-700 bg-slate-900 py-3 pl-9 pr-3 text-xs text-white outline-none placeholder:text-slate-600 focus:border-cyan-300/60" /></span></label>
            <label className="block"><span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wider text-slate-400">Kota / kabupaten</span><span className="relative block"><select value={visibleAreas.includes(area) ? area : ''} onChange={(event) => chooseArea(event.target.value)} className="w-full appearance-none rounded-xl border border-cyan-300/25 bg-slate-900 px-3 py-3 pr-9 text-xs text-white outline-none transition focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/10"><option value="" disabled>Pilih area contoh</option>{visibleAreas.map((item) => <option key={item} value={item}>{item}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-200" /></span></label>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-emerald-300/15 bg-emerald-300/[0.04] px-3 py-3 font-mono text-[9px] text-emerald-100"><Network className="h-4 w-4 shrink-0" /><span>4 MONITOR<br /><strong>SINKRON · LOCAL</strong></span></div>
        </div>
        {areaSearch && visibleAreas.length === 0 && <p role="status" className="mt-2 text-[10px] text-amber-200">Tidak ada contoh area cocok pada provinsi ini. Direktori berisi sampel, bukan seluruh kota/kabupaten.</p>}

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">{phases.map((item, index) => <button key={item.id} type="button" onClick={() => { setPhase(item.id); addLog(`[WORKFLOW] Tahap ${item.label} aktif untuk skenario mock ${area}`); }} aria-current={phase === item.id ? 'step' : undefined} className={`rounded-xl border p-2.5 text-left transition ${phase === item.id ? 'border-cyan-300/40 bg-cyan-300/[0.08]' : 'border-slate-800 bg-slate-900/45 hover:border-slate-600'}`}><span className="block font-mono text-[8px] text-slate-500">TAHAP 0{index + 1}</span><span className={`mt-1 block text-[10px] font-bold ${phase === item.id ? 'text-cyan-100' : 'text-slate-300'}`}>{item.label}</span><span className="mt-1 hidden text-[8px] text-slate-500 sm:block">{item.detail}</span></button>)}</div>
      </header>

      <div className="border-b border-amber-300/20 bg-amber-300/[0.06] px-4 py-2.5 text-[10px] leading-relaxed text-amber-100/90 sm:px-6"><strong>BATAS DEMO:</strong> direktori hanya pilihan contoh, bukan daftar wilayah resmi yang lengkap. Peta, status, dan metrik dibuat lokal; tidak ada pemantauan kota nyata atau koneksi eksternal.</div>

      <main className="grid grid-cols-1 gap-4 p-4 xl:grid-cols-12 sm:p-6">
        <section className="xl:col-span-8">
          <div className="mb-3 flex flex-wrap items-end justify-between gap-2"><div><h2 className="flex items-center gap-2 text-sm font-bold text-white"><MapPin className="h-4 w-4 text-cyan-300" />{area}, {provinceName}</h2><p className="mt-1 text-[10px] text-slate-500">Relief ilustratif dan layer dapat diganti; marker mengikuti pilihan wilayah mock.</p></div><div className="flex flex-wrap items-center gap-2"><div className="flex rounded-lg border border-slate-700 bg-slate-950/75 p-1">{(['RELIEF', 'KORIDOR', 'SEKTOR'] as const).map((item) => <button key={item} type="button" onClick={() => { setLayer(item); addLog(`[MAP] Layer ilustratif diubah: ${item}`); }} aria-pressed={layer === item} className={`rounded px-2 py-1 font-mono text-[8px] ${layer === item ? 'bg-cyan-300/15 text-cyan-100' : 'text-slate-500 hover:text-slate-200'}`}>{item}</button>)}</div><div className="flex items-center rounded-lg border border-slate-700 bg-slate-950/75"><button type="button" onClick={() => setZoom((value) => Math.max(.9, Number((value - .1).toFixed(1))))} aria-label="Perkecil peta" className="p-2 text-slate-400 hover:text-white"><ZoomOut className="h-3.5 w-3.5" /></button><span className="min-w-9 text-center font-mono text-[8px] text-slate-500">{Math.round(zoom * 100)}%</span><button type="button" onClick={() => setZoom((value) => Math.min(1.3, Number((value + .1).toFixed(1))))} aria-label="Perbesar peta" className="p-2 text-slate-400 hover:text-white"><ZoomIn className="h-3.5 w-3.5" /></button></div></div></div>
          <RegionScene province={provinceName} area={area} island={selectedProvince.island} tick={tick} layer={layer} zoom={zoom} />
          <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4">{[
            { title: 'Feed wilayah', value: 'MOCK · STABIL', icon: <Radio className="h-3.5 w-3.5 text-cyan-300" /> },
            { title: 'Node latihan', value: '08 / 08 DEMO', icon: <Network className="h-3.5 w-3.5 text-violet-300" /> },
            { title: 'Kesiapan layanan', value: `${96 + (tick % 4)}.${tick % 10}%`, icon: <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" /> },
            { title: 'Sinkronisasi', value: 'STATE LOKAL', icon: <Activity className="h-3.5 w-3.5 text-amber-300" /> },
          ].map((item) => <div key={item.title} className="rounded-xl border border-slate-800 bg-slate-950/55 p-3"><div className="flex items-center gap-1.5 text-[9px] text-slate-500">{item.icon}{item.title}</div><div className="mt-1.5 font-mono text-[10px] font-bold text-slate-200">{item.value}</div></div>)}</div>
        </section>

        <aside className="space-y-4 xl:col-span-4">
          <section className="rounded-2xl border border-slate-700/70 bg-slate-950/50 p-4"><div className="flex items-center justify-between"><h2 className="flex items-center gap-2 text-xs font-bold text-white"><Eye className="h-4 w-4 text-cyan-300" />Panel monitor sinkron</h2><span className="font-mono text-[8px] text-emerald-200">DEMO</span></div><p className="mt-1 text-[9px] text-slate-500">Wilayah aktif: {area}, {provinceName}</p><div className="mt-3 space-y-2">{[
            { name: 'Pemantauan layanan', status: 'NORMAL · MOCK', width: '88%', color: 'bg-cyan-300' },
            { name: 'Triase insiden latihan', status: phase === 'INVESTIGASI' ? 'DITINJAU · DEMO' : 'SIAP · DEMO', width: phase === 'INVESTIGASI' ? '72%' : '48%', color: 'bg-violet-300' },
            { name: 'Kesiapan respons', status: phase === 'RESPONS' ? 'TABLETOP' : 'STANDBY · MOCK', width: phase === 'RESPONS' ? '92%' : '61%', color: 'bg-amber-300' },
          ].map((monitor) => <div key={monitor.name} className="rounded-xl border border-slate-800 bg-slate-900/50 p-2.5"><div className="flex justify-between gap-2 text-[9px]"><span className="text-slate-300">{monitor.name}</span><span className="font-mono text-right text-slate-500">{monitor.status}</span></div><div className="mt-2 h-1 overflow-hidden rounded-full bg-slate-800"><div className={`h-full rounded-full ${monitor.color} transition-all duration-700`} style={{ width: monitor.width }} /></div></div>)}</div><div className="mt-3 flex items-center gap-1.5 border-t border-slate-800 pt-2 text-[8px] text-slate-500"><Clock3 className="h-3 w-3" />Pembaruan animasi lokal · {timeLabel}</div></section>

          <section className="terminal-panel rounded-2xl p-4"><div className="flex items-center justify-between border-b border-emerald-900/50 pb-2"><h2 className="flex items-center gap-2 text-xs font-bold text-emerald-100"><Terminal className="h-4 w-4" />Terminal mock</h2><span className="font-mono text-[8px] text-emerald-300">UI ONLY</span></div><div className="mt-3 space-y-2 font-mono text-[9px] leading-relaxed" aria-live="polite"><div className="break-all text-emerald-300">gds-training@local:~$ <span className="text-slate-200">region --select "{area}"</span></div>{logs.slice(-4).map((line, index) => <div key={`${line}-${index}`} className="break-words text-emerald-100/70"><span className="mr-1 text-emerald-600">[{String(index + 1).padStart(2, '0')}]</span>{line}</div>)}</div><p className="mt-3 border-t border-emerald-900/50 pt-2 text-[8px] leading-relaxed text-emerald-100/50">Perintah hanya ilustrasi. Tidak ada shell, endpoint, API, atau eksekutor.</p></section>

          <section className="rounded-2xl border border-amber-300/15 bg-amber-300/[0.04] p-3"><div className="flex items-center gap-2 text-[10px] font-bold text-amber-100"><AlertTriangle className="h-3.5 w-3.5" />Ilustrasi, bukan pemantauan nyata</div><p className="mt-1.5 text-[9px] leading-relaxed text-amber-100/65">Geometri peta dibuat dari SVG skematik sebagai efek pseudo-3D. Nama wilayah hanya untuk konteks latihan; tidak menggambarkan koordinat akurat, objek, penduduk, jaringan, atau kondisi aktual.</p></section>
        </aside>
      </main>
      <footer className="flex flex-col gap-2 border-t border-slate-700/60 bg-slate-950/55 px-4 py-3 text-[9px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6"><span className="flex items-center gap-2"><Wifi className="h-3.5 w-3.5 text-emerald-400" />GARUDA DOME · SIMULASI REGIONAL LOKAL</span><span>NO LIVE GEODATA · NO SENSOR · NO EXTERNAL ACTIONS · DATA MOCK</span></footer>
    </section>
  );
};
