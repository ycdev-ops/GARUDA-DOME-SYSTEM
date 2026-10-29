import React, { useState } from 'react';
import { Incident, EdgeNode, DomainType } from '../types/gds';
import { 
  Anchor, 
  TreePine, 
  Plane, 
  Flame, 
  Activity, 
  ShieldAlert, 
  Radio, 
  Crosshair,
  Compass,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';

interface ArchipelagoTacticalMapProps {
  incidents: Incident[];
  edgeNodes: EdgeNode[];
  selectedIncident: Incident | null;
  onSelectIncident: (inc: Incident) => void;
  activeDomainFilter: DomainType | 'ALL';
  setActiveDomainFilter: (d: DomainType | 'ALL') => void;
  activeRegionFilter: 'ALL' | 'WIB' | 'WITA' | 'WIT';
  setActiveRegionFilter: (r: 'ALL' | 'WIB' | 'WITA' | 'WIT') => void;
}

export const ArchipelagoTacticalMap: React.FC<ArchipelagoTacticalMapProps> = ({
  incidents,
  edgeNodes,
  selectedIncident,
  onSelectIncident,
  activeDomainFilter,
  setActiveDomainFilter,
  activeRegionFilter,
  setActiveRegionFilter,
}) => {
  // Layer toggles
  const [showEEZ, setShowEEZ] = useState(true);
  const [showALKI, setShowALKI] = useState(true);
  const [showADIZ, setShowADIZ] = useState(true);
  const [showEdgeCoverage, setShowEdgeCoverage] = useState(true);
  const [showForestZones, setShowForestZones] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Map projection functions
  // Longitude: 94.5 to 141.5 (span = 47) -> viewBox width 1000
  // Latitude: 6.5 to -11.5 (span = 18) -> viewBox height 460
  const projectCoords = (lat: number, lng: number): [number, number] => {
    const minLng = 94.5;
    const maxLng = 141.5;
    const maxLat = 6.8;
    const minLat = -11.5;

    const x = ((lng - minLng) / (maxLng - minLng)) * 1000;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 460;
    return [Math.max(10, Math.min(990, x)), Math.max(10, Math.min(450, y))];
  };

  const getDomainIcon = (domain: DomainType) => {
    switch (domain) {
      case 'illegal_fishing':
        return <Anchor className="w-3.5 h-3.5 text-cyan-400" />;
      case 'illegal_logging':
        return <TreePine className="w-3.5 h-3.5 text-emerald-400" />;
      case 'air_defense':
        return <Plane className="w-3.5 h-3.5 text-amber-400" />;
      case 'karhutla':
        return <Flame className="w-3.5 h-3.5 text-orange-400" />;
      case 'disaster':
        return <Activity className="w-3.5 h-3.5 text-rose-400" />;
      case 'cyber_defense':
        return <ShieldAlert className="w-3.5 h-3.5 text-purple-400" />;
      case 'narcotics_border':
        return <Radio className="w-3.5 h-3.5 text-red-500" />;
      case 'resource_mining':
        return <Crosshair className="w-3.5 h-3.5 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  const getThreatBorder = (threat: string) => {
    switch (threat) {
      case 'CRITICAL':
        return 'border-rose-500 bg-rose-500/20 text-rose-400 shadow-rose-950/50';
      case 'HIGH':
        return 'border-amber-500 bg-amber-500/20 text-amber-400 shadow-amber-950/50';
      default:
        return 'border-cyan-500 bg-cyan-500/20 text-cyan-400 shadow-cyan-950/50';
    }
  };

  // Filtered incidents
  const filteredIncidents = incidents.filter((inc) => {
    if (activeDomainFilter !== 'ALL' && inc.domain !== activeDomainFilter) return false;
    if (activeRegionFilter !== 'ALL' && inc.region !== activeRegionFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Top Filter and Layer Strip */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 flex flex-wrap items-center justify-between gap-4">
        {/* Domain Segmented Control */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <span className="text-xs font-semibold text-slate-400 mr-2 whitespace-nowrap">Domain:</span>
          {[
            { id: 'ALL', label: 'Semua Matra' },
            { id: 'illegal_fishing', label: 'IUU Fishing' },
            { id: 'illegal_logging', label: 'Illegal Logging' },
            { id: 'air_defense', label: 'Air Defense' },
            { id: 'karhutla', label: 'Karhutla' },
            { id: 'cyber_defense', label: 'Siber' },
            { id: 'narcotics_border', label: 'Narkoba' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                tacticalAudio.playTacticalClick();
                setActiveDomainFilter(item.id as DomainType | 'ALL');
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 ${
                activeDomainFilter === item.id
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Region & Layer Toggles */}
        <div className="flex items-center gap-3 ml-auto text-xs flex-wrap">
          <div className="flex items-center gap-1 bg-slate-950 px-2 py-1 rounded border border-slate-800">
            <span className="text-slate-500 mr-1">Zona:</span>
            {(['ALL', 'WIB', 'WITA', 'WIT'] as const).map((r) => (
              <button
                key={r}
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setActiveRegionFilter(r);
                }}
                className={`px-1.5 py-0.5 rounded transition-colors ${
                  activeRegionFilter === r
                    ? 'bg-slate-800 text-amber-400 font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === 'ALL' ? 'Semua' : r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-slate-400">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
              <input
                type="checkbox"
                checked={showEEZ}
                onChange={(e) => setShowEEZ(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-800"
              />
              <span>ZEE Maritim</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
              <input
                type="checkbox"
                checked={showALKI}
                onChange={(e) => setShowALKI(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-800"
              />
              <span>ALKI</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
              <input
                type="checkbox"
                checked={showADIZ}
                onChange={(e) => setShowADIZ(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-800"
              />
              <span>ADIZ</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
              <input
                type="checkbox"
                checked={showEdgeCoverage}
                onChange={(e) => setShowEdgeCoverage(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-800"
              />
              <span>Edge Radar</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
              <input
                type="checkbox"
                checked={showForestZones}
                onChange={(e) => setShowForestZones(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-800"
              />
              <span>Hutan Lindung</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Tactical Map Viewport */}
      <div className="relative w-full bg-slate-950 border border-slate-800 rounded-lg overflow-hidden select-none">
        {/* Tactical HUD Header */}
        <div className="absolute top-3 left-4 z-20 flex items-center gap-3 pointer-events-none">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900/90 border border-slate-700/60 text-xs font-mono text-slate-300 backdrop-blur">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>GEOINT C4ISR GRID · INDONESIA ARCHIPELAGO</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-2 py-1 rounded bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-400">
            <span>PROJECTION: WGS-84 MERCATOR</span>
            <span aria-hidden="true">·</span>
            <span>SCALE: 1 : 2.500.000</span>
          </div>
        </div>

        {/* Zoom Controls Overlay */}
        <div className="absolute top-3 right-4 z-20 flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1 rounded backdrop-blur">
          <button
            onClick={() => setZoomLevel((prev) => Math.min(prev + 0.25, 2.0))}
            className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
            title="Perbesar"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((prev) => Math.max(prev - 0.25, 0.85))}
            className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
            title="Perkecil"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Tactical Map Container */}
        <div 
          className="w-full overflow-hidden transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 1000 460"
            className="w-full h-auto min-h-[380px] lg:min-h-[480px] bg-slate-950 text-slate-400"
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            <defs>
              {/* Radial gradient for radar domes */}
              <radialGradient id="radarDomeGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.25" />
                <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="natunaDomeGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
              </radialGradient>
              {/* Grid pattern */}
              <pattern id="tacGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.6" />
                <circle cx="40" cy="40" r="0.75" fill="#334155" />
              </pattern>
            </defs>

            {/* Tactical Grid Background */}
            <rect width="1000" height="460" fill="url(#tacGrid)" />

            {/* Ocean Texture & Equator Line */}
            <line x1="0" y1="172" x2="1000" y2="172" stroke="#0ea5e9" strokeOpacity="0.2" strokeDasharray="6 4" strokeWidth="0.8" />
            <text x="12" y="168" fill="#0ea5e9" fillOpacity="0.5" fontSize="8" fontFamily="monospace">EQUATOR · 00°00'00"N/S</text>

            <line x1="0" y1="285" x2="1000" y2="285" stroke="#334155" strokeOpacity="0.3" strokeDasharray="4 4" strokeWidth="0.5" />
            <text x="12" y="281" fill="#475569" fontSize="8" fontFamily="monospace">05°00'00"S</text>

            {/* Longitude markers */}
            <line x1="160" y1="0" x2="160" y2="460" stroke="#1e293b" strokeDasharray="3 5" strokeWidth="0.5" />
            <text x="163" y="445" fill="#475569" fontSize="8" fontFamily="monospace">100°E</text>
            <line x1="375" y1="0" x2="375" y2="460" stroke="#1e293b" strokeDasharray="3 5" strokeWidth="0.5" />
            <text x="378" y="445" fill="#475569" fontSize="8" fontFamily="monospace">110°E</text>
            <line x1="590" y1="0" x2="590" y2="460" stroke="#1e293b" strokeDasharray="3 5" strokeWidth="0.5" />
            <text x="593" y="445" fill="#475569" fontSize="8" fontFamily="monospace">120°E</text>
            <line x1="800" y1="0" x2="800" y2="460" stroke="#1e293b" strokeDasharray="3 5" strokeWidth="0.5" />
            <text x="803" y="445" fill="#475569" fontSize="8" fontFamily="monospace">130°E</text>

            {/* 1. ZEE (Exclusive Economic Zone) Boundaries Layer */}
            {showEEZ && (
              <g id="layer-eez" opacity="0.85">
                {/* Natuna North EEZ */}
                <path
                  d="M 240 50 L 320 30 L 360 45 L 390 90 L 360 130 L 290 120 Z"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.2"
                  strokeDasharray="5 3"
                  strokeOpacity="0.7"
                />
                <text x="305" y="45" fill="#f59e0b" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.8">
                  ZEE LAUT NATUNA UTARA
                </text>

                {/* Arafura Sea EEZ Boundary */}
                <path
                  d="M 830 330 L 910 320 L 950 350 L 930 420 L 840 430 Z"
                  fill="none"
                  stroke="#0ea5e9"
                  strokeWidth="1.2"
                  strokeDasharray="5 3"
                  strokeOpacity="0.6"
                />
                <text x="880" y="380" fill="#0ea5e9" fontSize="8" fontFamily="monospace" textAnchor="middle" opacity="0.7">
                  ZEE LAUT ARAFURA (WPP 718)
                </text>

                {/* Western Sumatra Ocean Boundary */}
                <path
                  d="M 20 80 L 70 20 L 150 140 L 220 300 L 200 360 L 80 200 Z"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="0.8"
                  strokeDasharray="4 4"
                  strokeOpacity="0.4"
                />
              </g>
            )}

            {/* 2. ALKI (Alur Laut Kepulauan Indonesia) Lanes */}
            {showALKI && (
              <g id="layer-alki" opacity="0.9">
                {/* ALKI I: Selat Sunda - Selat Karimata - Laut Natuna */}
                <path
                  d="M 240 330 L 250 290 L 280 200 L 290 110 L 295 40"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.8"
                  strokeDasharray="8 4"
                  strokeOpacity="0.75"
                />
                <text x="260" y="235" fill="#38bdf8" fontSize="8" fontFamily="monospace">ALKI I</text>

                {/* ALKI II: Selat Lombok - Selat Makassar - Laut Sulawesi */}
                <path
                  d="M 465 410 L 475 350 L 490 230 L 510 130 L 530 50"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.8"
                  strokeDasharray="8 4"
                  strokeOpacity="0.75"
                />
                <text x="495" y="200" fill="#38bdf8" fontSize="8" fontFamily="monospace">ALKI II</text>

                {/* ALKI III: Laut Sawu - Laut Banda - Maluku - Pasifik */}
                <path
                  d="M 640 420 L 650 360 L 680 280 L 710 200 L 730 110 L 740 40"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="1.8"
                  strokeDasharray="8 4"
                  strokeOpacity="0.75"
                />
                <text x="690" y="260" fill="#38bdf8" fontSize="8" fontFamily="monospace">ALKI III</text>
              </g>
            )}

            {/* 3. ADIZ (Air Defense Identification Zones) */}
            {showADIZ && (
              <g id="layer-adiz" opacity="0.6">
                <rect x="30" y="20" width="350" height="380" fill="none" stroke="#eab308" strokeWidth="0.8" strokeDasharray="3 3" />
                <text x="40" y="38" fill="#eab308" fontSize="8" fontFamily="monospace">ADIZ SEKTOR I (BARAT)</text>

                <rect x="385" y="20" width="280" height="420" fill="none" stroke="#eab308" strokeWidth="0.8" strokeDasharray="3 3" />
                <text x="395" y="38" fill="#eab308" fontSize="8" fontFamily="monospace">ADIZ SEKTOR II (TENGAH)</text>

                <rect x="670" y="20" width="310" height="420" fill="none" stroke="#eab308" strokeWidth="0.8" strokeDasharray="3 3" />
                <text x="680" y="38" fill="#eab308" fontSize="8" fontFamily="monospace">ADIZ SEKTOR III (TIMUR)</text>
              </g>
            )}

            {/* 4. Indonesian Landmass Vector Geometry */}
            <g id="indonesia-landmass" fill="#0f172a" stroke="#334155" strokeWidth="1.2">
              {/* SUMATERA */}
              <path
                d="M 40 40 
                   Q 65 30 90 55 
                   L 125 110 
                   Q 160 160 190 220 
                   L 230 290 
                   Q 250 320 235 335 
                   L 220 320 
                   Q 190 270 160 210 
                   L 110 140 
                   Q 60 70 40 40 Z"
                className="hover:fill-slate-800 transition-colors cursor-pointer"
              />
              {/* Bangka & Belitung */}
              <circle cx="245" cy="235" r="9" />
              <circle cx="270" cy="255" r="6" />

              {/* JAWA & MADURA & BALI & NUSA TENGGARA */}
              {/* Jawa */}
              <path
                d="M 235 340 
                   Q 280 345 330 350 
                   L 390 355 
                   Q 430 365 440 375 
                   L 420 380 
                   Q 340 375 270 370 
                   L 235 355 Z"
                className="hover:fill-slate-800 transition-colors"
              />
              {/* Madura */}
              <ellipse cx="410" cy="355" rx="14" ry="5" />
              {/* Bali */}
              <circle cx="455" cy="382" r="5" />
              {/* Lombok & Sumbawa */}
              <circle cx="475" cy="385" r="6" />
              <ellipse cx="505" cy="385" rx="16" ry="6" />
              {/* Flores & Sumba */}
              <path d="M 535 385 Q 565 380 590 385 L 585 392 Q 555 390 535 390 Z" />
              <ellipse cx="560" cy="410" rx="14" ry="7" />
              {/* Timor Barat & Rote */}
              <path d="M 610 400 L 645 390 L 655 405 L 625 418 Z" />
              <circle cx="615" cy="430" r="4" fill="#38bdf8" stroke="#0284c7" /> {/* Rote Island */}

              {/* KALIMANTAN (BORNEO) */}
              <path
                d="M 290 190 
                   Q 310 150 360 140 
                   L 410 135 
                   Q 435 150 435 180 
                   L 440 240 
                   Q 420 280 380 285 
                   L 320 280 
                   Q 285 240 290 190 Z"
                className="hover:fill-slate-800 transition-colors cursor-pointer"
              />

              {/* SULAWESI */}
              <path
                d="M 495 185 
                   L 540 170 
                   Q 580 150 585 130 
                   L 575 160 
                   Q 550 190 535 210 
                   L 565 235 
                   Q 580 260 560 285 
                   L 540 260 
                   L 520 285 
                   Q 505 295 495 270 
                   L 510 215 
                   L 485 195 Z"
                className="hover:fill-slate-800 transition-colors cursor-pointer"
              />

              {/* MALUKU (Halmahera, Seram, Buru, Aru, Tanimbar) */}
              {/* Halmahera */}
              <path d="M 670 120 L 685 105 L 690 130 L 705 145 L 680 160 Z" />
              {/* Buru */}
              <ellipse cx="660" cy="225" rx="10" ry="7" />
              {/* Seram */}
              <path d="M 690 220 Q 725 215 745 225 L 735 235 Q 700 230 690 225 Z" />
              {/* Kep. Aru */}
              <ellipse cx="800" cy="305" rx="8" ry="14" />
              {/* Kep. Tanimbar */}
              <ellipse cx="745" cy="365" rx="9" ry="12" />

              {/* PAPUA */}
              <path
                d="M 750 190 
                   Q 780 165 805 185 
                   L 830 190 
                   Q 870 195 910 195 
                   L 985 200 
                   L 985 385 
                   Q 950 380 930 365 
                   L 870 320 
                   Q 820 270 790 250 
                   L 755 235 
                   Q 740 210 750 190 Z"
                className="hover:fill-slate-800 transition-colors cursor-pointer"
              />

              {/* KEPULAUAN NATUNA & ANAMBAS */}
              <circle cx="315" cy="115" r="4.5" fill="#f59e0b" stroke="#b45309" />
              <circle cx="285" cy="130" r="3" />
              <text x="325" y="117" fill="#fbbf24" fontSize="7" fontFamily="monospace">RANAI NATUNA</text>

              {/* Sabang / P. Rondo */}
              <circle cx="25" cy="28" r="3.5" fill="#38bdf8" />
              <text x="32" y="28" fill="#94a3b8" fontSize="7" fontFamily="monospace">SABANG</text>

              {/* Miangas */}
              <circle cx="605" cy="52" r="3" fill="#38bdf8" />
              <text x="612" y="52" fill="#94a3b8" fontSize="7" fontFamily="monospace">MIANGAS</text>

              {/* Merauke */}
              <circle cx="955" cy="375" r="3.5" fill="#38bdf8" />
              <text x="915" y="390" fill="#94a3b8" fontSize="7" fontFamily="monospace">MERAUKE</text>
            </g>

            {/* 5. Protected Forest & Conservation Zones Overlay */}
            {showForestZones && (
              <g id="layer-forest" opacity="0.45">
                {/* Taman Nasional Bukit Baka Bukit Raya (Kalbar/Kalteng) */}
                <ellipse cx="365" cy="205" rx="22" ry="14" fill="#10b981" stroke="#059669" strokeDasharray="3 2" />
                <text x="365" y="208" fill="#6ee7b7" fontSize="7" textAnchor="middle" fontFamily="monospace">TN BUKIT BAKA</text>

                {/* Hutan Lindung Riau Pesisir */}
                <ellipse cx="150" cy="145" rx="14" ry="8" fill="#10b981" stroke="#059669" strokeDasharray="2 2" />

                {/* Taman Nasional Lorentz Papua */}
                <ellipse cx="875" cy="265" rx="30" ry="18" fill="#10b981" stroke="#059669" strokeDasharray="3 2" />
                <text x="875" y="268" fill="#6ee7b7" fontSize="7" textAnchor="middle" fontFamily="monospace">TN LORENTZ</text>
              </g>
            )}

            {/* 6. Edge Computing Nodes & Radar Domes */}
            {showEdgeCoverage && (
              <g id="layer-edge-nodes">
                {edgeNodes.map((node) => {
                  const [cx, cy] = projectCoords(node.coordinates[0], node.coordinates[1]);
                  const radius = (node.coverageRadiusKm / 500) * 65;
                  return (
                    <g key={node.id} className="transition-opacity">
                      {/* Outer pulse circle */}
                      <circle
                        cx={cx}
                        cy={cy}
                        r={radius}
                        fill="url(#radarDomeGrad)"
                        stroke="#0284c7"
                        strokeWidth="0.75"
                        strokeDasharray="4 3"
                        strokeOpacity="0.6"
                      />
                      {/* Node Center Dot */}
                      <circle cx={cx} cy={cy} r="3" fill="#38bdf8" />
                      <circle cx={cx} cy={cy} r="6" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6" />
                    </g>
                  );
                })}
              </g>
            )}

            {/* 7. Incidents Markers */}
            <g id="layer-incidents">
              {filteredIncidents.map((inc) => {
                const [ix, iy] = projectCoords(inc.coordinates[0], inc.coordinates[1]);
                const isSelected = selectedIncident?.id === inc.id;

                let markerColor = '#f43f5e'; // rose-500
                if (inc.domain === 'illegal_fishing') markerColor = '#06b6d4'; // cyan-500
                if (inc.domain === 'illegal_logging') markerColor = '#10b981'; // emerald-500
                if (inc.domain === 'air_defense') markerColor = '#f59e0b'; // amber-500
                if (inc.domain === 'karhutla') markerColor = '#f97316'; // orange-500
                if (inc.domain === 'cyber_defense') markerColor = '#a855f7'; // purple-500
                if (inc.domain === 'narcotics_border') markerColor = '#ef4444'; // red-500

                return (
                  <g
                    key={inc.id}
                    transform={`translate(${ix}, ${iy})`}
                    onClick={() => {
                      tacticalAudio.playRadarPing();
                      onSelectIncident(inc);
                    }}
                    className="cursor-pointer group"
                  >
                    {/* Pulsing ring for critical / selected */}
                    {(inc.threatLevel === 'CRITICAL' || isSelected) && (
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? "18" : "14"}
                        fill="none"
                        stroke={markerColor}
                        strokeWidth={isSelected ? "2" : "1"}
                        strokeDasharray="3 2"
                        opacity={isSelected ? "0.9" : "0.7"}
                      />
                    )}

                    {/* Outer marker diamond / square */}
                    <rect
                      x="-7"
                      y="-7"
                      width="14"
                      height="14"
                      rx="3"
                      fill="#020617"
                      stroke={markerColor}
                      strokeWidth={isSelected ? "2.5" : "1.5"}
                      className="group-hover:scale-125 transition-transform"
                    />

                    {/* Small center dot */}
                    <circle cx="0" cy="0" r="2.5" fill={markerColor} />

                    {/* Label Tag */}
                    <g transform="translate(10, -5)" className="pointer-events-none">
                      <rect
                        x="0"
                        y="-7"
                        width={inc.code.length * 6.5 + 8}
                        height="14"
                        rx="2"
                        fill="#020617"
                        fillOpacity="0.85"
                        stroke="#334155"
                        strokeWidth="0.5"
                      />
                      <text
                        x="4"
                        y="3"
                        fill={isSelected ? '#fbbf24' : '#e2e8f0'}
                        fontSize="7.5"
                        fontWeight="600"
                        fontFamily="monospace"
                      >
                        {inc.code}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Tactical Legend Strip */}
        <div className="bg-slate-900/90 border-t border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-slate-400 font-semibold font-sans">Legenda Sasaran:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-cyan-500 inline-block" />
              <span className="text-slate-300">IUU Fishing (Laut)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500 inline-block" />
              <span className="text-slate-300">Illegal Logging (Hutan)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" />
              <span className="text-slate-300">ADIZ / Udara</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block" />
              <span className="text-slate-300">Karhutla</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-red-500 inline-block" />
              <span className="text-slate-300">Narkoba Perbatasan</span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span>Menampilkan: <strong className="text-amber-400 tabular-nums">{filteredIncidents.length}</strong> / {incidents.length} Sasaran</span>
            <span aria-hidden="true">·</span>
            <span>Sensor Terkoneksi: <strong className="text-cyan-400 tabular-nums">224 Node</strong></span>
          </div>
        </div>
      </div>

      {/* Target Quick Peek Ribbon */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredIncidents.slice(0, 3).map((inc) => {
          const isSelected = selectedIncident?.id === inc.id;
          return (
            <div
              key={inc.id}
              onClick={() => {
                tacticalAudio.playRadarPing();
                onSelectIncident(inc);
              }}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? 'border-amber-500 bg-amber-950/20 shadow-md'
                  : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="p-1 rounded bg-slate-800 border border-slate-700">
                    {getDomainIcon(inc.domain)}
                  </div>
                  <div>
                    <span className="font-mono text-xs font-semibold text-slate-200">{inc.code}</span>
                    <span className="text-xs text-slate-500 ml-2 font-mono">{inc.region}</span>
                  </div>
                </div>
                <span className={`text-xs px-1.5 py-0.5 rounded border font-mono font-medium ${getThreatBorder(inc.threatLevel)}`}>
                  {inc.threatLevel}
                </span>
              </div>

              <h4 className="text-xs font-semibold text-white line-clamp-1 mb-1">{inc.title}</h4>
              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-2">{inc.description}</p>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-800/80 font-mono">
                <span>{inc.timestamp}</span>
                <span className="text-amber-400 font-medium">Buka Tindakan Preskriptif →</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
