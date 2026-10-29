import React, { useState } from 'react';
import { 
  Activity, 
  Wheat, 
  Fuel, 
  Server, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Zap, 
  Layers,
  Sparkles,
  Calendar,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { tacticalAudio } from '../utils/audioTactical';

// Data types for resource health metrics
interface InfrastructureMetric {
  id: string;
  name: string;
  category: 'KELISTRIKAN' | 'TELEKOMUNIKASI' | 'KILANG_ENERGI' | 'PELABUHAN_LOGISTIK';
  uptimePercent: number;
  status: 'OPTIMAL' | 'DEGRADED' | 'MAINTENANCE';
  currentLoad: string;
  redundancy: string;
  location: string;
  lastInspection: string;
}

interface FoodSecurityStock {
  commodity: string;
  currentStockMetricTons: number;
  safeReserveThresholdTons: number;
  daysOfNationalConsumption: number;
  status: 'SURPLUS' | 'AMAN' | 'WASPADA' | 'KRITIS';
  productionOrigin: string;
  trendWeeklyPercent: number;
}

interface ReserveLevel {
  id: string;
  title: string;
  category: 'ENERGI' | 'AIR' | 'MEDIS' | 'MINERAL';
  currentDays: number;
  minSafeDays: number;
  capacityPercent: number;
  status: 'AMAN' | 'WASPADA' | 'KRITIS';
  facilityLocation: string;
}

const INFRASTRUCTURE_DATA: InfrastructureMetric[] = [
  {
    id: 'INFRA-01',
    name: 'Sistem Interkoneksi Transmisi 500kV Jamali',
    category: 'KELISTRIKAN',
    uptimePercent: 99.85,
    status: 'OPTIMAL',
    currentLoad: '28.450 MW (Load 74%)',
    redundancy: 'N-1 Contingency Active',
    location: 'Jawa - Madura - Bali Grid',
    lastInspection: 'Hari ini 06:00 WIB'
  },
  {
    id: 'INFRA-02',
    name: 'Sistem Kabel Bawah Laut Palapa Ring Barat & Tengah',
    category: 'TELEKOMUNIKASI',
    uptimePercent: 99.40,
    status: 'OPTIMAL',
    currentLoad: '12.8 Tbps (Throughput 68%)',
    redundancy: 'Dual Ring Optical Failover',
    location: 'Selat Malaka - Natuna - Selat Makassar',
    lastInspection: 'Hari ini 07:15 WIB'
  },
  {
    id: 'INFRA-03',
    name: 'Kilang Pengolahan Minyak Terpadu Cilacap & Balikpapan',
    category: 'KILANG_ENERGI',
    uptimePercent: 98.20,
    status: 'OPTIMAL',
    currentLoad: '610.000 Barel / Hari',
    redundancy: 'Cadangan Tangki Silo 100%',
    location: 'Jawa Tengah & Kalimantan Timur',
    lastInspection: 'Hari ini 05:30 WIB'
  },
  {
    id: 'INFRA-04',
    name: 'Pusat Logistik & Kontainer Pelabuhan Tanjung Priok & Perak',
    category: 'PELABUHAN_LOGISTIK',
    uptimePercent: 97.90,
    status: 'OPTIMAL',
    currentLoad: '82% Yard Occupancy Rate',
    redundancy: 'Terminal Petikemas Backup Jalur KA',
    location: 'DKI Jakarta & Surabaya, Jatim',
    lastInspection: 'Hari ini 04:00 WIB'
  },
  {
    id: 'INFRA-05',
    name: 'Kabel Laut Interkoneksi Sumatera - Bangka 150kV',
    category: 'KELISTRIKAN',
    uptimePercent: 96.15,
    status: 'DEGRADED',
    currentLoad: '88% Beban Maksimum',
    redundancy: 'Inspeksi Sonar ROV Berjalan',
    location: 'Selat Bangka, Kep. Babel',
    lastInspection: 'Hari ini 02:45 WIB'
  }
];

const FOOD_SECURITY_DATA: FoodSecurityStock[] = [
  {
    commodity: 'Beras (Cadangan Beras Pemerintah)',
    currentStockMetricTons: 2420000,
    safeReserveThresholdTons: 1500000,
    daysOfNationalConsumption: 128,
    status: 'SURPLUS',
    productionOrigin: 'Gudang Bulog Tersebar (Jateng, Jatim, Sulsel, Sumsel)',
    trendWeeklyPercent: +4.2
  },
  {
    commodity: 'Jagung Pakan & Pangan Strategis',
    currentStockMetricTons: 980000,
    safeReserveThresholdTons: 750000,
    daysOfNationalConsumption: 82,
    status: 'AMAN',
    productionOrigin: 'NTB, Gorontalo, Lampung',
    trendWeeklyPercent: +1.8
  },
  {
    commodity: 'Minyak Goreng Sawit (DMO Rakyat)',
    currentStockMetricTons: 1350000,
    safeReserveThresholdTons: 850000,
    daysOfNationalConsumption: 94,
    status: 'SURPLUS',
    productionOrigin: 'Riau, Sumut, Kalbar, Kalteng',
    trendWeeklyPercent: +2.5
  },
  {
    commodity: 'Protein Laut (Ikan Beku Tangkap WPP)',
    currentStockMetricTons: 420000,
    safeReserveThresholdTons: 380000,
    daysOfNationalConsumption: 48,
    status: 'AMAN',
    productionOrigin: 'WPPNRI 718 Arafura & WPPNRI 711 Natuna',
    trendWeeklyPercent: -0.8
  },
  {
    commodity: 'Kedelai Konsumsi Nasional',
    currentStockMetricTons: 280000,
    safeReserveThresholdTons: 320000,
    daysOfNationalConsumption: 29,
    status: 'WASPADA',
    productionOrigin: 'Produksi Lokal + Stok Importir Terdaftar',
    trendWeeklyPercent: -3.4
  }
];

const RESERVE_LEVELS_DATA: ReserveLevel[] = [
  {
    id: 'RES-01',
    title: 'BBM Solar Militer & Industri Terpadu',
    category: 'ENERGI',
    currentDays: 26,
    minSafeDays: 21,
    capacityPercent: 88,
    status: 'AMAN',
    facilityLocation: 'Depot Plumpang, Balongan, Kasim Sorong'
  },
  {
    id: 'RES-02',
    title: 'BBM Bensin Khusus Penugasan (RON 90/92)',
    category: 'ENERGI',
    currentDays: 22,
    minSafeDays: 20,
    capacityPercent: 81,
    status: 'AMAN',
    facilityLocation: 'Terminal BBM Utama Seluruh Indonesia'
  },
  {
    id: 'RES-03',
    title: 'Bahan Bakar Penerbangan (Avtur Pertahanan & Sipil)',
    category: 'ENERGI',
    currentDays: 34,
    minSafeDays: 25,
    capacityPercent: 92,
    status: 'AMAN',
    facilityLocation: 'Depot Pengisian Pesawat Udara Lanud & Bandara'
  },
  {
    id: 'RES-04',
    title: 'Cadangan Air Baku Waduk & Bendungan Strategis',
    category: 'AIR',
    currentDays: 145,
    minSafeDays: 90,
    capacityPercent: 86,
    status: 'AMAN',
    facilityLocation: 'Waduk Jatiluhur, Cirata, Karangkates, Batutegi'
  },
  {
    id: 'RES-05',
    title: 'Serum & Suplai Medis Kegawatdaruratan Nasional',
    category: 'MEDIS',
    currentDays: 78,
    minSafeDays: 60,
    capacityPercent: 76,
    status: 'AMAN',
    facilityLocation: 'Buffer Stock Biofarma & Pusat Krisis Kemenkes'
  }
];

// Historical + 30-Day Projected Stability Data for Infrastructure Uptime (%)
const INFRA_30DAY_PROJECTION = [
  { day: 'D-7', label: '7 Hari Lalu', grid: 99.72, telecom: 99.20, refineries: 98.40, ports: 98.10, isProjected: false },
  { day: 'D-5', label: '5 Hari Lalu', grid: 99.80, telecom: 99.35, refineries: 98.30, ports: 97.80, isProjected: false },
  { day: 'D-3', label: '3 Hari Lalu', grid: 99.65, telecom: 99.45, refineries: 98.50, ports: 98.20, isProjected: false },
  { day: 'D-1', label: 'Kemarin', grid: 99.82, telecom: 99.38, refineries: 98.15, ports: 98.00, isProjected: false },
  { day: 'D0', label: 'Hari Ini', grid: 99.85, telecom: 99.40, refineries: 98.20, ports: 97.90, isProjected: false },
  { day: 'D+5', label: '+5 Hari (Proyeksi)', grid: 99.84, telecom: 99.45, refineries: 98.35, ports: 98.10, isProjected: true },
  { day: 'D+10', label: '+10 Hari (Proyeksi)', grid: 99.80, telecom: 99.48, refineries: 98.40, ports: 98.25, isProjected: true },
  { day: 'D+15', label: '+15 Hari (Proyeksi)', grid: 99.78, telecom: 99.42, refineries: 98.50, ports: 98.30, isProjected: true },
  { day: 'D+20', label: '+20 Hari (Proyeksi)', grid: 99.75, telecom: 99.44, refineries: 98.55, ports: 98.20, isProjected: true },
  { day: 'D+25', label: '+25 Hari (Proyeksi)', grid: 99.82, telecom: 99.50, refineries: 98.60, ports: 98.40, isProjected: true },
  { day: 'D+30', label: '+30 Hari (Proyeksi)', grid: 99.88, telecom: 99.52, refineries: 98.65, ports: 98.50, isProjected: true },
];

// Historical + 30-Day Projected Food Security Buffer Stock (in Juta Ton)
const FOOD_30DAY_PROJECTION = [
  { day: 'D-7', label: '7 Hari Lalu', beras: 2.36, minyakGoreng: 1.32, jagung: 0.96, kedelai: 0.29, isProjected: false },
  { day: 'D-3', label: '3 Hari Lalu', beras: 2.39, minyakGoreng: 1.34, jagung: 0.97, kedelai: 0.28, isProjected: false },
  { day: 'D0', label: 'Hari Ini', beras: 2.42, minyakGoreng: 1.35, jagung: 0.98, kedelai: 0.28, isProjected: false },
  { day: 'D+5', label: '+5 Hari', beras: 2.45, minyakGoreng: 1.36, jagung: 0.99, kedelai: 0.30, isProjected: true },
  { day: 'D+10', label: '+10 Hari', beras: 2.49, minyakGoreng: 1.37, jagung: 1.01, kedelai: 0.31, isProjected: true },
  { day: 'D+15', label: '+15 Hari (Puncak Panen)', beras: 2.55, minyakGoreng: 1.38, jagung: 1.03, kedelai: 0.33, isProjected: true },
  { day: 'D+20', label: '+20 Hari', beras: 2.58, minyakGoreng: 1.39, jagung: 1.03, kedelai: 0.34, isProjected: true },
  { day: 'D+25', label: '+25 Hari', beras: 2.61, minyakGoreng: 1.40, jagung: 1.04, kedelai: 0.35, isProjected: true },
  { day: 'D+30', label: '+30 Hari (Akhir Siklus)', beras: 2.64, minyakGoreng: 1.42, jagung: 1.05, kedelai: 0.36, isProjected: true },
];

// Custom Tooltip Component for Tactical Dark UI
const TacticalChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    const isProj = label && label.includes('+');
    return (
      <div className="p-3 rounded-lg bg-slate-950/95 border border-slate-700 shadow-2xl backdrop-blur font-mono text-xs space-y-1.5 min-w-[200px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="font-bold text-slate-200">{label}</span>
          <span className={`text-[10px] px-1.5 py-0.2 rounded border font-semibold ${
            isProj ? 'text-amber-400 bg-amber-500/10 border-amber-500/30' : 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
          }`}>
            {isProj ? 'PROYEKSI AI' : 'HISTORIKAL RIIL'}
          </span>
        </div>
        <div className="space-y-1 pt-1">
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}:</span>
              </span>
              <span className="font-bold text-white tabular-nums">
                {typeof entry.value === 'number' && entry.value < 10 ? `${entry.value.toFixed(2)} Juta Ton` : `${entry.value}%`}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const NationalResourceHealthView: React.FC = () => {
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'ALL' | 'INFRA' | 'FOOD' | 'RESERVE'>('ALL');
  const [selectedInfra, setSelectedInfra] = useState<InfrastructureMetric | null>(null);
  const [projectionScenario, setProjectionScenario] = useState<'BASELINE' | 'CLIMATE_STRESS' | 'PEAK_DEMAND'>('BASELINE');

  const formatTons = (tons: number) => {
    if (tons >= 1000000) {
      return `${(tons / 1000000).toFixed(2)} Juta Ton`;
    }
    return `${(tons / 1000).toFixed(0)} Ribu Ton`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SURPLUS':
      case 'OPTIMAL':
      case 'AMAN':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'WASPADA':
      case 'DEGRADED':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'KRITIS':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  // Adjust projection numbers based on scenario
  const getAdjustedInfraData = () => {
    if (projectionScenario === 'CLIMATE_STRESS') {
      return INFRA_30DAY_PROJECTION.map((d) => (d.isProjected ? {
        ...d,
        grid: Math.max(98.8, d.grid - 0.45),
        ports: Math.max(96.5, d.ports - 0.90),
      } : d));
    }
    if (projectionScenario === 'PEAK_DEMAND') {
      return INFRA_30DAY_PROJECTION.map((d) => (d.isProjected ? {
        ...d,
        grid: Math.max(99.1, d.grid - 0.30),
        refineries: Math.min(99.1, d.refineries + 0.30),
      } : d));
    }
    return INFRA_30DAY_PROJECTION;
  };

  const getAdjustedFoodData = () => {
    if (projectionScenario === 'CLIMATE_STRESS') {
      return FOOD_30DAY_PROJECTION.map((d) => (d.isProjected ? {
        ...d,
        beras: Math.max(2.10, d.beras - 0.18),
        jagung: Math.max(0.85, d.jagung - 0.10),
      } : d));
    }
    if (projectionScenario === 'PEAK_DEMAND') {
      return FOOD_30DAY_PROJECTION.map((d) => (d.isProjected ? {
        ...d,
        beras: Math.max(2.25, d.beras - 0.08),
        minyakGoreng: Math.max(1.20, d.minyakGoreng - 0.09),
      } : d));
    }
    return FOOD_30DAY_PROJECTION;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono mb-1">
              <Activity className="w-4 h-4" />
              <span>MODUL KETAHANAN DAYA SAING & LOGISTIK STRATEGIS</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Kesehatan Sumber Daya Nasional & Proyeksi 30 Hari
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Pemantauan real-time dan model prediksi stabilitas 30 hari ke depan menggunakan Recharts:
              keandalan jaringan listrik & fiber optik, akumulasi panen padi Cadangan Beras Pemerintah (CBP),
              serta ketahanan cadangan energi BBM dan air baku waduk irigasi.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono shrink-0">
            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-right">
              <span className="text-slate-500 block">Stabilitas 30 Hari</span>
              <strong className="text-emerald-400 text-base">AMAN (Surplus)</strong>
            </div>
            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-right">
              <span className="text-slate-500 block">Indeks Daya Tahan</span>
              <strong className="text-cyan-400 text-base tabular-nums">96.4 / 100</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Simulation Switcher */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-2 text-slate-300">
          <SlidersHorizontal className="w-4 h-4 text-amber-400" />
          <span className="font-bold uppercase">Skenario Prediktif 30 Hari:</span>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded border border-slate-800">
          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              setProjectionScenario('BASELINE');
            }}
            className={`px-3 py-1.5 rounded transition-colors ${
              projectionScenario === 'BASELINE'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kondisi Baseline / Normal
          </button>
          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              setProjectionScenario('CLIMATE_STRESS');
            }}
            className={`px-3 py-1.5 rounded transition-colors ${
              projectionScenario === 'CLIMATE_STRESS'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Skenario Cuaca Ekstrem (La Niña)
          </button>
          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              setProjectionScenario('PEAK_DEMAND');
            }}
            className={`px-3 py-1.5 rounded transition-colors ${
              projectionScenario === 'PEAK_DEMAND'
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Skenario Lonjakan Permintaan Akhir Tahun
          </button>
        </div>
      </div>

      {/* 4 Key Pillar Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400">Infrastruktur Kritis</span>
            <span className="text-emerald-400 font-bold">Proyeksi 30D: 99.8%</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">99.85%</span>
            <span className="text-xs text-slate-400 font-sans">Uptime Grid Jamali</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-2 border-t border-slate-800">
            <span>SLA Target: &ge; 99.5%</span>
            <span className="text-emerald-400 font-semibold">Tercapai Tanpa Gangguan</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400">Cadangan Beras (CBP)</span>
            <span className="text-emerald-400 font-bold">Panen Raya +220k T</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">2,42</span>
            <span className="text-xs text-slate-400 font-sans">Juta Ton &rarr; 2,64 Jt T</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Ambang Aman: 1,50 Jt Ton</span>
            <span className="text-cyan-400 font-semibold">Ketahanan 138 Hari</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400">Cadangan BBM Strategis</span>
            <span className="text-amber-400 font-bold">Depot Siaga Penuh</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">24,6</span>
            <span className="text-xs text-slate-400 font-sans">Hari Cadangan</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-2 border-t border-slate-800">
            <span>Solar: 26 Hari</span>
            <span className="text-slate-300">Avtur: 34 Hari</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400">Tampungan Air Waduk</span>
            <span className="text-cyan-400 font-bold">Elevasi Optimal</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">86,2%</span>
            <span className="text-xs text-slate-400 font-sans">Tampungan Aman</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between pt-2 border-t border-slate-800">
            <span>145 Hari Air Irigasi</span>
            <span className="text-emerald-400 font-semibold">Bebas Defisit</span>
          </div>
        </div>
      </div>

      {/* Sector Category Filter Controls */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono w-fit">
        {[
          { id: 'ALL', label: 'Seluruh Sumber Daya' },
          { id: 'INFRA', label: 'Infrastruktur Kritis' },
          { id: 'FOOD', label: 'Ketahanan Pangan' },
          { id: 'RESERVE', label: 'Cadangan Energi & Air' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              tacticalAudio.playTacticalClick();
              setActiveCategoryFilter(item.id as 'ALL' | 'INFRA' | 'FOOD' | 'RESERVE');
            }}
            className={`px-3 py-1.5 rounded transition-colors ${
              activeCategoryFilter === item.id
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Charts & Telemetry Grid with Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* RECHARTS CHART 1: Critical Infrastructure Uptime 30-Day Trend & Projection (12 Cols) */}
        {(activeCategoryFilter === 'ALL' || activeCategoryFilter === 'INFRA') && (
          <div className="lg:col-span-12 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Tren Keandalan (Uptime %) Infrastruktur Kritis & Proyeksi 30 Hari Ke Depan
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Garis putus-putus menandakan Proyeksi Stabilitas AI (D+1 s/d D+30) · Batas SLA Minimum: 99.5%
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
                <span className="text-slate-300">Kelistrikan Jamali 500kV</span>
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block ml-2" />
                <span className="text-slate-300">Palapa Ring Fiber Optik</span>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block ml-2" />
                <span className="text-slate-300">Kilang Minyak</span>
              </div>
            </div>

            {/* Recharts Area / Line Chart for Infrastructure */}
            <div className="w-full h-72 rounded bg-slate-950 border border-slate-800 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={getAdjustedInfraData()}
                  margin={{ top: 15, right: 25, left: -10, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="gridGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="telecomGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    domain={[96, 100]} 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} 
                    unit="%"
                  />
                  <Tooltip content={<TacticalChartTooltip />} />
                  <ReferenceLine 
                    y={99.5} 
                    stroke="#f59e0b" 
                    strokeDasharray="4 4" 
                    label={{ value: 'Ambang Minimum SLA (99.5%)', fill: '#f59e0b', fontSize: 10, fontFamily: 'monospace', position: 'top' }} 
                  />
                  <ReferenceLine 
                    x="D0" 
                    stroke="#38bdf8" 
                    strokeWidth={1.5}
                    label={{ value: 'Hari Ini (Titik Mulai Proyeksi)', fill: '#38bdf8', fontSize: 10, fontFamily: 'monospace', position: 'insideTopLeft' }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="grid" 
                    name="Kelistrikan Jamali" 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    fillOpacity={1} 
                    fill="url(#gridGradient)" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="telecom" 
                    name="Kabel Fiber Optik" 
                    stroke="#06b6d4" 
                    strokeWidth={2} 
                    strokeDasharray="3 2" 
                    dot={{ r: 3, fill: '#06b6d4' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="refineries" 
                    name="Kilang Minyak" 
                    stroke="#f59e0b" 
                    strokeWidth={1.5} 
                    dot={{ r: 2.5, fill: '#f59e0b' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="ports" 
                    name="Pelabuhan Strategis" 
                    stroke="#a855f7" 
                    strokeWidth={1.5} 
                    dot={{ r: 2.5, fill: '#a855f7' }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Infrastructure Asset Table */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                Aset Infrastruktur Kritis Terdaftar:
              </span>
              <div className="divide-y divide-slate-800 rounded bg-slate-950 border border-slate-800 text-xs font-mono">
                {INFRASTRUCTURE_DATA.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      setSelectedInfra(item);
                    }}
                    className="p-2.5 flex items-center justify-between hover:bg-slate-900/60 transition-colors cursor-pointer"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-amber-400 font-bold">{item.id}</span>
                        <strong className="text-slate-200 font-sans text-xs">{item.name}</strong>
                      </div>
                      <span className="text-[11px] text-slate-500 font-sans">{item.location} · {item.currentLoad}</span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-slate-300 font-mono tabular-nums">{item.uptimePercent}%</span>
                      <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getStatusBadge(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RECHARTS CHART 2: Food Security 30-Day Projection (7 Cols) */}
        {(activeCategoryFilter === 'ALL' || activeCategoryFilter === 'FOOD') && (
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                  <Wheat className="w-4 h-4 text-emerald-400" />
                  Tren Proyeksi 30 Hari Cadangan Pangan Strategis (Juta Ton)
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Simulasi Panen Raya Musim Tanam II vs Laju Konsumsi Harian
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="text-emerald-400 font-bold">CBP Beras</span>
                <span className="text-amber-400 font-bold">Minyak Goreng</span>
                <span className="text-cyan-400 font-bold">Jagung</span>
              </div>
            </div>

            {/* Recharts Line Chart for Food Security */}
            <div className="w-full h-72 rounded bg-slate-950 border border-slate-800 p-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={getAdjustedFoodData()}
                  margin={{ top: 15, right: 25, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis 
                    dataKey="day" 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} 
                  />
                  <YAxis 
                    domain={[0, 3.0]} 
                    stroke="#64748b" 
                    tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }} 
                    unit=" Jt"
                  />
                  <Tooltip content={<TacticalChartTooltip />} />
                  <ReferenceLine 
                    y={1.50} 
                    stroke="#f59e0b" 
                    strokeDasharray="4 4" 
                    label={{ value: 'Batas Minimal Beras (1.50 Jt Ton)', fill: '#f59e0b', fontSize: 10, fontFamily: 'monospace', position: 'insideBottomLeft' }} 
                  />
                  <ReferenceLine 
                    x="D0" 
                    stroke="#38bdf8" 
                    strokeWidth={1.5}
                    label={{ value: 'Hari Ini', fill: '#38bdf8', fontSize: 10, fontFamily: 'monospace', position: 'top' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="beras" 
                    name="Beras (CBP Bulog)" 
                    stroke="#10b981" 
                    strokeWidth={2.5} 
                    dot={{ r: 3.5, fill: '#10b981' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="minyakGoreng" 
                    name="Minyak Goreng" 
                    stroke="#f59e0b" 
                    strokeWidth={2} 
                    dot={{ r: 3, fill: '#f59e0b' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="jagung" 
                    name="Jagung Pakan/Pangan" 
                    stroke="#06b6d4" 
                    strokeWidth={2} 
                    dot={{ r: 3, fill: '#06b6d4' }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="kedelai" 
                    name="Kedelai Konsumsi" 
                    stroke="#ec4899" 
                    strokeWidth={1.5} 
                    strokeDasharray="3 2"
                    dot={{ r: 2.5, fill: '#ec4899' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1 font-mono">
              <div className="flex justify-between">
                <span>Puncak Panen Raya Padi:</span>
                <span className="text-emerald-400 font-bold">D+12 s/d D+18 (Tambahan +220.000 Ton)</span>
              </div>
              <div className="flex justify-between">
                <span>Kedelai:</span>
                <span className="text-cyan-400">Pemulihan Stok Kembali Di Atas Ambang Aman pada D+15</span>
              </div>
            </div>
          </div>
        )}

        {/* Food Security Breakdown Card (5 Cols) */}
        {(activeCategoryFilter === 'ALL' || activeCategoryFilter === 'FOOD') && (
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                  <Wheat className="w-4 h-4 text-emerald-400" />
                  Rincian Komoditas Pangan Strategis
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Stok Riil Saat Ini vs Hari Konsumsi
                </span>
              </div>
            </div>

            {/* Commodity list with days */}
            <div className="space-y-3">
              {FOOD_SECURITY_DATA.map((food) => {
                const percentOfThreshold = Math.min(180, (food.currentStockMetricTons / food.safeReserveThresholdTons) * 100);
                return (
                  <div key={food.commodity} className="space-y-1.5 font-mono text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200 font-sans font-medium">{food.commodity}</span>
                      <span className={`px-1.5 py-0.2 rounded border text-[10px] font-bold ${getStatusBadge(food.status)}`}>
                        {food.daysOfNationalConsumption} Hari ({food.status})
                      </span>
                    </div>

                    {/* Comparative Dual Progress Bar */}
                    <div className="relative w-full h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          food.status === 'SURPLUS' ? 'bg-emerald-500' :
                          food.status === 'AMAN' ? 'bg-cyan-500' : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, (percentOfThreshold / 160) * 100)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Stok Riil: {formatTons(food.currentStockMetricTons)}</span>
                      <span>Batas Aman: {formatTons(food.safeReserveThresholdTons)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Strategic Reserves Section (12 Cols) */}
        {(activeCategoryFilter === 'ALL' || activeCategoryFilter === 'RESERVE') && (
          <div className="lg:col-span-12 bg-slate-900 border border-slate-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase flex items-center gap-2">
                  <Fuel className="w-4 h-4 text-amber-400" />
                  Cadangan Strategis Energi (BBM), Air Baku Waduk & Pasokan Medis
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  Strategic Petroleum Reserve (SPR) & Water Reservoir Balance
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                Ambang Batas Minimum Pertahanan Nasional: &ge; 21 Hari Operasional
              </span>
            </div>

            {/* Radial / Gauge Level Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
              {RESERVE_LEVELS_DATA.map((res) => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2.5 flex flex-col justify-between font-mono text-xs"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                      <span>{res.category}</span>
                      <span className={`px-1.5 py-0.2 rounded border font-bold ${getStatusBadge(res.status)}`}>
                        {res.status}
                      </span>
                    </div>

                    <h4 className="font-bold text-white font-sans text-xs line-clamp-2 leading-snug">
                      {res.title}
                    </h4>
                  </div>

                  {/* Level Progress */}
                  <div className="space-y-1">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xl font-bold text-white tabular-nums">{res.currentDays} Hari</span>
                      <span className="text-[11px] text-slate-400">Kapasitas {res.capacityPercent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-amber-400 rounded-full"
                        style={{ width: `${res.capacityPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
                    <span>Lokasi: {res.facilityLocation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Infrastructure Inspection Card Modal */}
      {selectedInfra && (
        <div className="p-4 rounded-lg bg-slate-900 border border-amber-500/40 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-amber-400 font-bold">DETAIL INSPEKSI: {selectedInfra.name} ({selectedInfra.id})</span>
            <button
              onClick={() => setSelectedInfra(null)}
              className="text-slate-400 hover:text-white"
            >
              Tutup
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">Kategori</span>
              <strong className="text-slate-200">{selectedInfra.category}</strong>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">Uptime Aktual</span>
              <strong className="text-emerald-400">{selectedInfra.uptimePercent}%</strong>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">Redundansi Cadangan</span>
              <strong className="text-cyan-400">{selectedInfra.redundancy}</strong>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block">Pemeriksaan Terakhir</span>
              <strong className="text-slate-200">{selectedInfra.lastInspection}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
