import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Minus, 
  Crosshair, 
  AlertTriangle, 
  Radio, 
  ShieldCheck, 
  Activity, 
  Compass, 
  Clock, 
  User, 
  FileText, 
  Settings, 
  ChevronRight, 
  Radar, 
  Info,
  CheckCircle2,
  Satellite,
  Trees,
  Waves,
  Layers,
  Eye,
  Sliders,
  Check,
  Zap,
  MapPin,
  X,
  Flame,
  Wind,
  Droplets,
  Plane,
  ShieldAlert
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';
import { AiDecisionPanelModal } from './AiDecisionPanelModal';
import { CyberWarfare3DScene } from './CyberWarfare3DScene';
import { RealizationProgressHUD, OperationRealizationData } from './RealizationProgressHUD';

// Threat Data matching SmartSelect_20261029_205524_X_9ffdab46.jpg & SmartSelect_20261029_205532_X_44432129.jpg
export interface LiveTheaterThreat {
  id: string;
  code: string;
  title: string;
  time: string;
  threatType: 'BALLISTIC_MISSILE' | 'DRONE_SWARM' | 'UNKNOWN_AIRCRAFT';
  priorityLevel: 'KRITIS' | 'TINGGI' | 'SEDANG';
  confidencePercent: number;
  confidenceTag: 'HIGH CONFIDENCE' | 'MEDIUM CONFIDENCE' | 'LOW CONFIDENCE';
  speed: string;
  altitude: string;
  trajectory: string;
  rcsSignature: string;
  classification: string;
  recommendedActionText: string;
  actionButtonLabel: string;
  actionColor: 'red' | 'amber' | 'blue';
  locationSector: string;
  mapPosPercent: { x: number; y: number }; // percentage on map
  analysisText: string[];
  status: 'ACTIVE' | 'INTERCEPTING' | 'CONTAINED';
}

export type DomainMissionMode = 
  | 'AIR_DEFENSE'       // C4ISR Air Defense (Screenshot Mode)
  | 'KARHUTLA_THERMAL'   // Thermal Infrared & Smoke Haze Real Sat
  | 'ILLEGAL_LOGGING'    // Sentinel-1 SAR Coherence Loss
  | 'IUU_FISHING'        // Maritime Radar SAR & Dark Vessels
  | 'CYBER_PHYSICAL';    // Spectrum & VTS Defense

interface HotspotIncident {
  id: string;
  name: string;
  province: string;
  coordinates: string;
  posPercent: { x: number; y: number };
  frpMegawatts: number;
  confidencePercent: number;
  peatDepth: string;
  hazeDirection: string;
  pm25: number;
  satelliteSensor: string;
  status: 'BURNING' | 'DISPATCHED_WATERBOMB' | 'CONTAINED';
}

interface ClickedGeospatialRecon {
  lat: number;
  lng: number;
  latStr: string;
  lngStr: string;
  mgrs: string;
  regionName: string;
  overheadSatellite: string;
  orbitalType: string;
  elevationDeg: number;
  azimuthDeg: number;
  passTime: string;
  domainContext: string;
  environmentalRisk: string;
  recommendedAction: string;
  actionButtonLabel: string;
  screenPos: { x: number; y: number };
}

const INITIAL_THEATER_THREATS: LiveTheaterThreat[] = [
  {
    id: 'THREAT-03',
    code: 'THREAT 03',
    title: 'BALLISTIC MISSILE TRACK',
    time: '14:32:11',
    threatType: 'BALLISTIC_MISSILE',
    priorityLevel: 'KRITIS',
    confidencePercent: 94.7,
    confidenceTag: 'HIGH CONFIDENCE',
    speed: 'MACH 4.2+',
    altitude: '18,500 - 22,000 m',
    trajectory: 'BALISTIK / MANUVER',
    rcsSignature: '0.65 m² (STEALTHY)',
    classification: 'High Threat',
    recommendedActionText: 'Intercept & Neutralize',
    actionButtonLabel: 'EXECUTE INTERCEPT (THREAT 03)',
    actionColor: 'red',
    locationSector: 'Laut Natuna Utara / Perairan Blok D-Alpha',
    mapPosPercent: { x: 52, y: 31 }, // Natuna / North
    analysisText: [
      'Analisis AI mendeteksi jejak ancaman berkecepatan tinggi dengan profil trajektori balistik.',
      'Pola manuver menunjukkan niat permusuhan.',
      'Probabilitas ancaman: 92.7%.',
      'Tidak ada kecocokan dengan aset ramah.'
    ],
    status: 'ACTIVE'
  },
  {
    id: 'THREAT-02',
    code: 'THREAT 02',
    title: 'HOSTILE DRONE SWARM',
    time: '14:32:05',
    threatType: 'DRONE_SWARM',
    priorityLevel: 'TINGGI',
    confidencePercent: 82.1,
    confidenceTag: 'MEDIUM CONFIDENCE',
    speed: 'MACH 0.8',
    altitude: '2,500 - 4,000 m',
    trajectory: 'LOW-ALTITUDE LOITERING SWARM',
    rcsSignature: '0.12 m² (MICRO-UAV)',
    classification: 'Medium Threat',
    recommendedActionText: 'Deploy Interceptors',
    actionButtonLabel: 'DEPLOY INTERCEPTORS (THREAT 02)',
    actionColor: 'amber',
    locationSector: 'Perairan Selatan Jawa / Samudera Hindia',
    mapPosPercent: { x: 28, y: 56 }, // South of Java
    analysisText: [
      'Deteksi formasi 12 UAV taktis otonom dengan formasi swarm terdistribusi.',
      'Frekuensi radio terenkripsi menunjukkan komunikasi antar-unit (mesh swarm).',
      'Probabilitas ancaman: 82.1%.',
      'Mengarah ke koridor pesisir selatan zona penyangga pertahanan udara.'
    ],
    status: 'ACTIVE'
  },
  {
    id: 'THREAT-01',
    code: 'THREAT 01',
    title: 'UNKNOWN AIRCRAFT',
    time: '14:31:52',
    threatType: 'UNKNOWN_AIRCRAFT',
    priorityLevel: 'SEDANG',
    confidencePercent: 61.3,
    confidenceTag: 'LOW CONFIDENCE',
    speed: 'MACH 1.4',
    altitude: '11,200 m (FL360)',
    trajectory: 'LINIER NON-RESPONSIVE TRANSIT',
    rcsSignature: '2.40 m²',
    classification: 'Low Threat',
    recommendedActionText: 'Monitor & Identify',
    actionButtonLabel: 'MONITOR & IDENTIFY (THREAT 01)',
    actionColor: 'blue',
    locationSector: 'Selat Malaka / Sektor Utara Sumatera',
    mapPosPercent: { x: 14, y: 32 }, // North Sumatra / Malacca
    analysisText: [
      'Kontak radar udara berkecepatan supersonik melintasi batas ADIZ Sektor I.',
      'Transponder IFF Mode-S tidak merespon panggilan frekuensi darurat 121.5 MHz.',
      'Probabilitas ancaman: 61.3%.',
      'Skadron 16 Pekanbaru disiagakan untuk identifikasi visual (VisId).'
    ],
    status: 'ACTIVE'
  }
];

const INITIAL_HOTSPOTS: HotspotIncident[] = [
  {
    id: 'HOTSPOT-01',
    name: 'Klaster Kubah Gambut Dalam OKI',
    province: 'Kab. Ogan Komering Ilir, Sumatera Selatan',
    coordinates: '3.4210° S, 105.1200° E',
    posPercent: { x: 20, y: 50 },
    frpMegawatts: 112.5,
    confidencePercent: 98.4,
    peatDepth: 'Gambut Dalam (>3.5 Meter)',
    hazeDirection: 'Barat Laut (310°) ke Palembang & Selat Bangka',
    pm25: 198,
    satelliteSensor: 'Terra/Aqua MODIS Band 21/22 + NOAA-20 VIIRS 375m',
    status: 'BURNING'
  },
  {
    id: 'HOTSPOT-02',
    name: 'Klaster Konsesi Gambut Pelalawan',
    province: 'Kab. Pelalawan / Riau Hulu',
    coordinates: '0.3450° N, 101.8900° E',
    posPercent: { x: 16, y: 36 },
    frpMegawatts: 78.4,
    confidencePercent: 94.2,
    peatDepth: 'Gambut Sedang (2.0 Meter)',
    hazeDirection: 'Utara (350°) ke Selat Malaka',
    pm25: 164,
    satelliteSensor: 'Sentinel-2 MSI SWIR-2 + VIIRS Active Fire',
    status: 'BURNING'
  },
  {
    id: 'HOTSPOT-03',
    name: 'Klaster Gambut Sebangau Kotawaringin',
    province: 'Kab. Kotawaringin Barat, Kalimantan Tengah',
    coordinates: '2.1800° S, 112.5400° E',
    posPercent: { x: 34, y: 47 },
    frpMegawatts: 94.2,
    confidencePercent: 96.0,
    peatDepth: 'Kubah Gambut Lindung (>4 Meter)',
    hazeDirection: 'Barat Daya (240°) ke Laut Jawa',
    pm25: 182,
    satelliteSensor: 'Himawari-9 AHI Band 7 + Terra MODIS',
    status: 'BURNING'
  },
  {
    id: 'HOTSPOT-04',
    name: 'Klaster Parit Gambut Kubu Raya',
    province: 'Kab. Kubu Raya, Kalimantan Barat',
    coordinates: '0.1200° S, 109.3400° E',
    posPercent: { x: 28, y: 38 },
    frpMegawatts: 64.0,
    confidencePercent: 91.5,
    peatDepth: 'Gambut Dangkal (1.2 Meter)',
    hazeDirection: 'Barat (270°) ke Pontianak',
    pm25: 145,
    satelliteSensor: 'NOAA-20 VIIRS I-Band 375m Resolution',
    status: 'BURNING'
  }
];

export const IndonesiaTheaterMapLive: React.FC = () => {
  const [threats, setThreats] = useState<LiveTheaterThreat[]>(INITIAL_THEATER_THREATS);
  const [selectedThreat, setSelectedThreat] = useState<LiveTheaterThreat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<'AI_PANEL' | 'TRACKING_FEED' | 'SENSOR_NETWORK' | 'ASSET_STATUS' | 'SYSTEM_LOGS'>('AI_PANEL');
  
  // Mission Domain Mode
  const [missionMode, setMissionMode] = useState<DomainMissionMode>('AIR_DEFENSE');

  // Karhutla Hotspots State
  const [hotspots, setHotspots] = useState<HotspotIncident[]>(INITIAL_HOTSPOTS);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotIncident | null>(null);

  // Any-Point Satellite Geospatial Reconnaissance State
  const [reconData, setReconData] = useState<ClickedGeospatialRecon | null>(null);
  const [isScanningCoord, setIsScanningCoord] = useState(false);
  const [actionSuccessNotice, setActionSuccessNotice] = useState<string | null>(null);

  // View Dimension: 2D C4ISR vs 3D Holographic Cyber Dome
  const [viewDimension, setViewDimension] = useState<'2D_LIVE' | '3D_HOLOGRAPHIC'>('2D_LIVE');

  // Real-time Realization Progress HUD state
  const [activeRealizationOp, setActiveRealizationOp] = useState<OperationRealizationData | null>(null);
  const [isRealizationHUDOpen, setIsRealizationHUDOpen] = useState(false);

  const [zoomScale, setZoomScale] = useState(1);
  const [currentTimeStr, setCurrentTimeStr] = useState('14:32:18 WIB');
  const [authorizedThreatIds, setAuthorizedThreatIds] = useState<string[]>([]);
  const mapViewportRef = useRef<HTMLDivElement>(null);

  // Live ticking clock in WIB
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const time = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' WIB';
      setCurrentTimeStr(time);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleOpenThreat = (t: LiveTheaterThreat, tab: 'AI_PANEL' | 'TRACKING_FEED' | 'SENSOR_NETWORK' | 'ASSET_STATUS' | 'SYSTEM_LOGS' = 'AI_PANEL') => {
    tacticalAudio.playRadarPing();
    setSelectedThreat(t);
    setModalInitialTab(tab);
    setIsModalOpen(true);
  };

  const handleExecuteAction = (threatId: string) => {
    setAuthorizedThreatIds((prev) => [...prev, threatId]);
    setThreats((prev) =>
      prev.map((t) => (t.id === threatId ? { ...t, status: 'INTERCEPTING' } : t))
    );

    const matchedThreat = threats.find((t) => t.id === threatId) || threats[0];
    
    // Auto-launch real-time realization progress HUD
    setActiveRealizationOp({
      id: `OP-${threatId}-${Date.now()}`,
      codename: threatId === 'THREAT-03' ? 'GARUDA THUNDER-03' : threatId === 'THREAT-02' ? 'PERISAI SWARM JAWA' : 'VISID AIR INTERCEPT',
      title: `${matchedThreat.recommendedActionText.toUpperCase()}: ${matchedThreat.title}`,
      domain: 'AIR_DEFENSE',
      targetLocation: matchedThreat.locationSector,
      mgrs: '48N WG 4291 8812',
      operatorId: 'OP-KOPASGAT-27 (Mayor Tek Arya)',
      authorizedAt: new Date().toLocaleTimeString('id-ID'),
      assignedUnits: [
        'Satrad 212 Ranai Natuna',
        'Skadron Udara 16 F-16 C/D Fighting Falcon',
        'Baterai Rudal NASAMS-2 KOPASGAT',
        'Satelit LAPAN-A3 / Sentinel-1 SAR'
      ],
      stages: [
        {
          title: 'OTORISASI KOMANDO & VALIDASI KRIPTOGRAFIS',
          description: 'Tanda tangan digital kunci PQC Dilithium-5 terekam. Jalur komando Kohanudnas terenkripsi AES-256.',
          durationSec: 8,
          agency: 'MABES TNI / KOPASGAT'
        },
        {
          title: 'TASKING ORBITAL SATELIT & SENSOR FUSION',
          description: 'Satelit Sentinel-1 SAR & LEO SIGINT mengunci koordinat. Radar IMSS Ranai memancarkan tracking beam.',
          durationSec: 16,
          agency: 'BRIN-LAPAN / TNI AU'
        },
        {
          title: 'DISPOSISI & PENGUNCIAN VEKTOR TEMBAK (FIRE CONTROL)',
          description: 'Sistem FCS menghitung interception envelope. Solusi peluncuran dikirim ke baterai rudal dan scrambler F-16.',
          durationSec: 24,
          agency: 'SKADRON 16 / BAT. NASAMS'
        },
        {
          title: 'EKSEKUSI INTERDIKSI & KINETIK TERMINAL LOCK',
          description: 'Rudal pencegat meluncur dengan panduan radar aktif seeker. Vektor kecepatan relatif mendekati Mach 4.8.',
          durationSec: 18,
          agency: 'INTERCEPTOR COMMAND'
        },
        {
          title: 'VERIFIKASI KERUSAKAN (BDA) & STATUS NETRALISIR',
          description: 'Sensor optik satelit dan radar memverifikasi pecahan fragmentasi. Ancaman berhasil dinetralisasi sepenuhnya.',
          durationSec: 12,
          agency: 'KOMANDO GABUNGAN'
        }
      ]
    });
    setIsRealizationHUDOpen(true);
  };

  // Geographic Click-to-Identify Satellite Reconnaissance
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapViewportRef.current) return;
    const rect = mapViewportRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const pctX = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
    const pctY = Math.max(0, Math.min(100, (clickY / rect.height) * 100));

    // Calculate real Indonesian WGS-84 coordinates
    // Indonesia Bounding Box: Longitude 95°E to 141°E (width ~46°), Latitude 6°N to 11°S (height ~17°)
    const lng = 95.0 + (pctX / 100) * 46.0;
    const lat = 6.0 - (pctY / 100) * 17.0;

    const latStr = `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}`;
    const lngStr = `${lng.toFixed(4)}° E`;

    // MGRS approximation
    const utmZone = Math.floor((lng + 180) / 6) + 1;
    const mgrsStr = `${utmZone}${lat >= 0 ? 'N' : 'M'} ${String.fromCharCode(65 + Math.floor(pctX % 26))}${String.fromCharCode(65 + Math.floor(pctY % 26))} ${Math.floor((pctX * 892) % 9999).toString().padStart(4, '0')} ${Math.floor((pctY * 741) % 9999).toString().padStart(4, '0')}`;

    // Deduce Geographic Region Name
    let region = 'Perairan Teritorial Nusantara';
    let overheadSat = 'SENTINEL-2B MSI (10m Multi-Spektral)';
    let domainCtx = 'Pengawasan Wilayah Kedaulatan Teritorial';
    let risk = 'NORMAL / TIADA ANOMALI KRITIS';
    let recAction = 'Lanjutkan pemindaian orbital terjadwal.';
    let actionBtn = 'AMBIL CITRA SATELIT DETAIL';

    if (pctX < 26 && pctY < 55) {
      region = 'Sumatera (Provinsi Riau / Jambi / Sumsel)';
      overheadSat = 'Terra/Aqua MODIS Band 21/22 + Sentinel-1 SAR';
      domainCtx = 'Koridor Kubah Gambut & Hutan Lindung Tropis';
      risk = missionMode === 'KARHUTLA_THERMAL' ? 'RISIKO TINGGI: TITIK PANAS TERMAL & RADIASI GAMBUT' : 'RISIKO PEMBALAKAN LIAR & KANOPI SAR';
      recAction = missionMode === 'KARHUTLA_THERMAL' ? 'Otorisasi Water Bombing KLHK & TMC BRIN.' : 'Disposisi Satgas Polhut Cepat Tanggap (SPORC).';
      actionBtn = missionMode === 'KARHUTLA_THERMAL' ? 'OTORISASI WATER BOMBING' : 'KERAHKAN PATROLI SPORC';
    } else if (pctX >= 26 && pctX < 44 && pctY < 50) {
      region = 'Kalimantan (Jantung Borneo & Kubah Gambut Kalteng/Kalbar)';
      overheadSat = 'NOAA-20 VIIRS 375m I-Band + Sentinel-2 Optik';
      domainCtx = 'Kawasan Konservasi Hutan Tropis & Gambut Dalam';
      risk = missionMode === 'KARHUTLA_THERMAL' ? 'TERDETEKSI KEPULAN ASAP & EMISI PM2.5 182 µg/m³' : 'DETEKSI KANAL PARIT GAMBUT ILEGAL';
      recAction = 'Penyekatan kanal drainase & pengerahan heli water bombing.';
      actionBtn = 'OTORISASI INTERVENSI DARURAT';
    } else if (pctX >= 45 && pctX < 60 && pctY < 40) {
      region = 'Laut Natuna Utara (Blok D-Alpha & ZEE WPPNRI 711)';
      overheadSat = 'Sentinel-1A SAR C-Band + Radar IMSS Pantai Ranai';
      domainCtx = 'Zona Maritim Kedaulatan Energi & Perikanan ZEE';
      risk = 'DETEKSI KONTAK RADAR KAPAL NON-AIS (DARK VESSEL)';
      recAction = 'Disposisi KRI Bung Tomo-357 & Bakamla KN Tanjung Datu.';
      actionBtn = 'OTORISASI INTERSEPSI KRI AL';
    } else if (pctX >= 60 && pctY >= 35) {
      region = 'Papua (Taman Nasional Lorentz & Laut Arafura)';
      overheadSat = 'Gaofen-3 SAR + LAPAN-A3 Satelit';
      domainCtx = 'Kawasan Hutan Lindung Primer & Cadangan Ikan Demersal';
      risk = 'PENGAWASAN SENSOR AKUSTIK BIOFONIK HUTAN LORENTZ';
      recAction = 'Verifikasi spektrum suara chainsaw akustik LoRa.';
      actionBtn = 'KUNCI SENSOR AKUSTIK BIOFONIK';
    } else if (pctY >= 50 && pctX < 35) {
      region = 'Pulau Jawa & Koridor Pertahanan Udara Selatan';
      overheadSat = 'Satrad Kosek I/II + AWACS Link Tactical';
      domainCtx = 'Zona Penyangga Pertahanan Udara Obvitnas Jakarta & Surabaya';
      risk = 'SIAGA 1: DETEKSI TRAJEKTORI DRONE SWARM & ADIZ';
      recAction = 'Kesiagaan Skadron Interseptor Sukhoi & Rudal NASAMS-2.';
      actionBtn = 'OTORISASI RADAR LOCK & MISSILE';
    }

    tacticalAudio.playRadarPing();
    setIsScanningCoord(true);

    setTimeout(() => {
      setIsScanningCoord(false);
      setReconData({
        lat,
        lng,
        latStr,
        lngStr,
        mgrs: mgrsStr,
        regionName: region,
        overheadSatellite: overheadSat,
        orbitalType: 'LEO Polar Sun-Synchronous (705 km)',
        elevationDeg: parseFloat((45 + Math.random() * 40).toFixed(1)),
        azimuthDeg: Math.floor(Math.random() * 360),
        passTime: `${currentTimeStr} (Sinkron Waktu-Nyata)`,
        domainContext: domainCtx,
        environmentalRisk: risk,
        recommendedAction: recAction,
        actionButtonLabel: actionBtn,
        screenPos: { x: pctX, y: pctY }
      });
    }, 280);
  };

  // Authorize Mission Action from Geospatial Recon
  const handleAuthorizeReconAction = () => {
    tacticalAudio.playCriticalAlert();
    setTimeout(() => {
      tacticalAudio.playDispatchConfirm();
      setActionSuccessNotice(`OTORISASI OPERASI DISAHKAN OLEH MAYOR TEK ARYA (OP-KOPASGAT-27) // SASARAN: ${reconData?.regionName} · UNIT TELAH DIKERAHKAN`);
      setTimeout(() => setActionSuccessNotice(null), 5000);

      if (reconData) {
        setActiveRealizationOp({
          id: `OP-RECON-${Date.now()}`,
          codename: 'OPERASI SATELIT GARUDA-RECON',
          title: `${reconData.actionButtonLabel}: ${reconData.regionName}`,
          domain: missionMode === 'KARHUTLA_THERMAL' ? 'KARHUTLA' : missionMode === 'ILLEGAL_LOGGING' ? 'ILLEGAL_LOGGING' : 'AIR_DEFENSE',
          targetLocation: `${reconData.regionName} (${reconData.latStr}, ${reconData.lngStr})`,
          mgrs: reconData.mgrs,
          operatorId: 'OP-KOPASGAT-27 (Mayor Tek Arya)',
          authorizedAt: new Date().toLocaleTimeString('id-ID'),
          assignedUnits: [
            reconData.overheadSatellite,
            'Satgas Khusus Gabungan TNI / KLHK',
            'Pusat Komando Operasi Udara Nasional'
          ],
          stages: [
            {
              title: 'VERIFIKASI SATELIT & PENGUNCIAN KOORDINAT MGRS',
              description: `Satelit ${reconData.overheadSatellite} mengambil citra multispektral resolusi tinggi pada target ${reconData.mgrs}.`,
              durationSec: 10,
              agency: 'BRIN / LAPAN'
            },
            {
              title: 'DISPOSISI TIM REAKSI CEPAT LAPANGAN',
              description: 'Perintah operasi taktis dikirimkan ke pangkalan terdekat dengan jalur data aman.',
              durationSec: 18,
              agency: 'GABUNGAN TNI / KLHK'
            },
            {
              title: 'EKSEKUSI PENINDAKAN & PENGAMANAN SEKTOR',
              description: `${reconData.recommendedAction}`,
              durationSec: 25,
              agency: 'SATGAS OPERASI'
            },
            {
              title: 'VERIFIKASI HASIL AKHIR & AUDIT SATELIT',
              description: 'Audit telemetri menunjukkan sektor telah terkendali tanpa residu eskalasi.',
              durationSec: 12,
              agency: 'KOMANDO PUSAT'
            }
          ]
        });
        setIsRealizationHUDOpen(true);
      }

      setReconData(null);
    }, 600);
  };

  // Dispatch Hotspot Water Bombing
  const handleDispatchWaterbomb = (hotspotId: string) => {
    tacticalAudio.playCriticalAlert();
    const hp = hotspots.find(h => h.id === hotspotId) || hotspots[0];
    setTimeout(() => {
      tacticalAudio.playDispatchConfirm();
      setHotspots((prev) =>
        prev.map((h) => h.id === hotspotId ? { ...h, status: 'DISPATCHED_WATERBOMB' } : h)
      );
      setActionSuccessNotice(`WATER BOMBING HELI MI-171 & TMC BRIN DIKERAHKAN KE: ${hp.name} (KLHK GAKKUM)`);
      setTimeout(() => setActionSuccessNotice(null), 5000);

      setActiveRealizationOp({
        id: `OP-WB-${hotspotId}-${Date.now()}`,
        codename: 'OPERASI BIMA AIR-WATERBOMB',
        title: `WATER BOMBING & PEMADAMAN GAMBUT: ${hp.name}`,
        domain: 'KARHUTLA',
        targetLocation: `${hp.province} (${hp.coordinates})`,
        mgrs: '48M XA 8192 1029',
        operatorId: 'OP-KOPASGAT-27 (Mayor Tek Arya / Satgas Karhutla)',
        authorizedAt: new Date().toLocaleTimeString('id-ID'),
        assignedUnits: [
          'Heli Water Bombing Mi-171 BNPB (Kapasitas 4.000 Liter)',
          'Pesawat Cassa NC-212 TMC BRIN (Penyemaian Garam NaCl)',
          'Manggala Agni Daops Sumatera',
          'Satelit Terra/Aqua MODIS + Himawari-9'
        ],
        stages: [
          {
            title: 'VERIFIKASI FRP & PEMETAAN ANGIN BMKG',
            description: `Sensor termal mendeteksi FRP ${hp.frpMegawatts} MW. Arah sebaran asap ${hp.hazeDirection}.`,
            durationSec: 10,
            agency: 'BMKG / KLHK'
          },
          {
            title: 'PENYEMAIAN AWAN TEKNOLOGI MODIFIKASI CUACA (TMC)',
            description: 'Pesawat Cassa NC-212 menyemai 1.2 ton NaCl pada awan cumulus di atas kawasan kubah gambut.',
            durationSec: 18,
            agency: 'BRIN / TNI AU'
          },
          {
            title: 'WATER BOMBING BERTAHAP HELI MI-171',
            description: 'Penjatuhan 4.000 liter air per sorti ke pusat kepala api kubah gambut dalam.',
            durationSec: 26,
            agency: 'BNPB / GAKKUM'
          },
          {
            title: 'PEMADAMAN TUNTAS & PENURUNAN EMISI PM2.5',
            description: 'Suhu permukaan tanah turun ke < 32°C. Titik api dinyatakan padam total.',
            durationSec: 15,
            agency: 'MANGGALA AGNI'
          }
        ]
      });
      setIsRealizationHUDOpen(true);
    }, 600);
  };

  return (
    <div className="w-full bg-[#050b14] border border-[#14263e] rounded-xl overflow-hidden shadow-2xl font-sans text-slate-100 select-none">
      {/* 1. TOP HEADER - Matching Screenshot with Official Gold Crest */}
      <header className="px-5 py-3 border-b border-[#14263e] bg-[#070f1c] flex flex-wrap items-center justify-between gap-4">
        {/* Left Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-900 border border-amber-500/40 p-0.5 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.4)] overflow-hidden shrink-0">
            <img 
              src="/assets/aistudio/SmartSelect_20261029_221701_Gallery.png" 
              alt="Garuda Dome Crest" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-black tracking-wider text-white uppercase font-sans">
              GARUDA DOME SYSTEM
            </span>
            <span className="flex items-center gap-1 text-xs font-mono font-bold text-rose-500">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping inline-block" />
              <span>• LIVE</span>
            </span>
          </div>
        </div>

        {/* Center Clock */}
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-300">
          <span>25 MAY 2025</span>
          <span className="text-slate-600">|</span>
          <span className="text-cyan-400 tabular-nums">{currentTimeStr}</span>
        </div>

        {/* Right Operator Status */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <span className="text-slate-400">OPERATOR:</span>
            <strong className="text-white">KOMANDO GABUNGAN</strong>
            <span className="flex items-center gap-1 text-emerald-400 font-bold ml-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ONLINE</span>
            </span>
          </div>
          <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
            <User className="w-4 h-4" />
          </div>
        </div>
      </header>

      {/* DOMAIN MISSION SELECTOR RIBBON (Interactive Multi-Domain Switcher) */}
      <div className="px-4 py-2.5 bg-[#060d19] border-b border-[#14263e] flex items-center justify-between gap-3 overflow-x-auto scrollbar-none font-mono text-xs">
        <span className="text-slate-400 font-bold shrink-0 text-[11px] uppercase">
          FOKUS MISI SATELIT TERPADU:
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {[
            { id: 'AIR_DEFENSE', label: 'PERT. UDARA & MISSILE', icon: <Crosshair className="w-3.5 h-3.5 text-cyan-400" />, badge: 'C4ISR ACTIVE' },
            { id: 'KARHUTLA_THERMAL', label: '🔥 MONITORING KARHUTLA', icon: <Flame className="w-3.5 h-3.5 text-rose-500" />, badge: 'SATELIT TERMAL' },
            { id: 'ILLEGAL_LOGGING', label: '🌲 ILLEGAL LOGGING', icon: <Trees className="w-3.5 h-3.5 text-emerald-400" />, badge: 'SAR COHERENCE' },
            { id: 'IUU_FISHING', label: '⚓ IUU FISHING / ZEE', icon: <Waves className="w-3.5 h-3.5 text-blue-400" />, badge: 'DARK VESSEL' },
            { id: 'CYBER_PHYSICAL', label: '⚡ PERTAHANAN SIBER', icon: <Radio className="w-3.5 h-3.5 text-purple-400" />, badge: 'BSSN MESH' },
          ].map((mode) => {
            const isActive = missionMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => {
                  tacticalAudio.playRadarPing();
                  setMissionMode(mode.id as DomainMissionMode);
                  setReconData(null);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold transition-all cursor-pointer whitespace-nowrap text-xs ${
                  isActive
                    ? mode.id === 'KARHUTLA_THERMAL'
                      ? 'bg-rose-500/20 border-rose-500 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                      : mode.id === 'ILLEGAL_LOGGING'
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : mode.id === 'IUU_FISHING'
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-[#081220] border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                {mode.icon}
                <span>{mode.label}</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-black/40 text-slate-400">
                  {mode.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Success / Alert Banner */}
      {actionSuccessNotice && (
        <div className="bg-emerald-950/90 border-b border-emerald-500 px-5 py-2.5 flex items-center justify-between text-xs font-mono text-emerald-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-bounce" />
            <strong className="tracking-wide font-sans">{actionSuccessNotice}</strong>
          </div>
          <button onClick={() => setActionSuccessNotice(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* 2. MAIN SPLIT: THEATER MAP (Left 65%) + AI DECISION LOG (Right 35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[660px]">
        {/* LEFT AREA: INDONESIA THEATER MAP (8 Cols on LG) */}
        <div className="lg:col-span-8 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#14263e] bg-[#040810] relative">
          
          {/* Top Bar of Map: Mode Details & Telemetry Specs */}
          <div className="p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#101e30] bg-[#070f1c]/95 z-20">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-mono font-bold tracking-wider text-white uppercase">
                INDONESIA THEATER MAP
              </span>
              <span className="text-slate-600">|</span>
              <span className={`text-[11px] font-mono font-bold ${
                missionMode === 'KARHUTLA_THERMAL' ? 'text-rose-400 animate-pulse' :
                missionMode === 'ILLEGAL_LOGGING' ? 'text-emerald-400' :
                missionMode === 'IUU_FISHING' ? 'text-blue-400' : 'text-cyan-400'
              }`}>
                {missionMode === 'KARHUTLA_THERMAL' && '🔥 CITRA SATELIT TERMAL INFRA-RED & FRP AKTIF'}
                {missionMode === 'ILLEGAL_LOGGING' && '🌲 CITRA SATELIT SENTINEL-1 SAR CANOPY LOSS'}
                {missionMode === 'IUU_FISHING' && '⚓ CITRA SATELIT RADAR MARITIM & AIS ZEE'}
                {missionMode === 'AIR_DEFENSE' && '🛡️ C4ISR TACTICAL AIR & MISSILE DEFENSE'}
                {missionMode === 'CYBER_PHYSICAL' && '⚡ BSSN CYBER THREAT & RF SPECTRUM MESH'}
              </span>
            </div>

            {/* View Dimension Selector (2D Tactical vs 3D Holographic) */}
            <div className="flex items-center gap-1 bg-[#091424] border border-[#1b314d] p-1 rounded-lg font-mono text-xs z-30">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  tacticalAudio.playTacticalClick();
                  setViewDimension('2D_LIVE');
                }}
                className={`px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                  viewDimension === '2D_LIVE'
                    ? 'bg-cyan-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2D TACTICAL
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  tacticalAudio.playRadarPing();
                  setViewDimension('3D_HOLOGRAPHIC');
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-bold transition-all cursor-pointer ${
                  viewDimension === '3D_HOLOGRAPHIC'
                    ? 'bg-amber-400 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>3D DOME (THREE.JS)</span>
              </button>
            </div>

            {/* Click Anywhere Instruction Badge */}
            <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-mono text-cyan-300 bg-cyan-950/50 border border-cyan-500/40 px-2.5 py-1 rounded-full">
              <MapPin className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>KLIK LOKASI MANA SAJA UNTUK AKUISISI SATELIT REAL-TIME</span>
            </div>
          </div>

          {/* Conditional View: 3D Holographic Scene OR 2D Interactive Satellite Map */}
          {viewDimension === '3D_HOLOGRAPHIC' ? (
            <div className="relative flex-1 w-full min-h-[490px]">
              <CyberWarfare3DScene 
                onSelectTarget={(id) => {
                  const t = threats.find(th => th.id === id);
                  if (t) handleOpenThreat(t);
                }}
                onRequestExecution={(id) => handleExecuteAction(id)}
              />
            </div>
          ) : (
          /* Map Viewport Container with Clickable Reconnaissance */
          <div 
            ref={mapViewportRef}
            onClick={handleMapClick}
            className="relative flex-1 w-full min-h-[490px] overflow-hidden flex items-center justify-center cursor-crosshair"
            title="Klik lokasi mana saja pada peta untuk pemindaian satelit real-time"
          >
            {/* DYNAMIC MAP TEXTURE ACCORDING TO MISSION DOMAIN */}
            {missionMode === 'KARHUTLA_THERMAL' ? (
              /* REAL SATELLITE THERMAL INFRARED (SWIR) VISUALIZATION FOR KARHUTLA */
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-500 pointer-events-none"
                style={{
                  backgroundImage: 'url(/assets/aistudio/SmartSelect_20261029_205524_X_9ffdab46.jpg)',
                  backgroundPosition: 'left center',
                  backgroundSize: '155% auto',
                  filter: 'contrast(1.6) brightness(0.75) saturate(2.4) sepia(0.35) hue-rotate(-25deg)',
                  transform: `scale(${zoomScale})`
                }}
              />
            ) : missionMode === 'ILLEGAL_LOGGING' ? (
              /* SAR COHERENCE GREEN VEGETATION TEXTURE */
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-500 pointer-events-none"
                style={{
                  backgroundImage: 'url(/assets/aistudio/SmartSelect_20261029_205524_X_9ffdab46.jpg)',
                  backgroundPosition: 'left center',
                  backgroundSize: '155% auto',
                  filter: 'hue-rotate(85deg) saturate(2.0) contrast(1.3) brightness(0.85)',
                  transform: `scale(${zoomScale})`
                }}
              />
            ) : missionMode === 'IUU_FISHING' ? (
              /* OCEANIC MARITIME RADAR TEXTURE */
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-500 pointer-events-none"
                style={{
                  backgroundImage: 'url(/assets/aistudio/SmartSelect_20261029_205524_X_9ffdab46.jpg)',
                  backgroundPosition: 'left center',
                  backgroundSize: '155% auto',
                  filter: 'hue-rotate(185deg) saturate(1.8) contrast(1.4) brightness(0.8)',
                  transform: `scale(${zoomScale})`
                }}
              />
            ) : (
              /* STANDARD C4ISR TACTICAL MAP TEXTURE (Screenshot Replica) */
              <div 
                className="absolute inset-0 bg-cover bg-center transition-all duration-500 pointer-events-none"
                style={{
                  backgroundImage: 'url(/assets/aistudio/SmartSelect_20261029_205524_X_9ffdab46.jpg)',
                  backgroundPosition: 'left center',
                  backgroundSize: '155% auto',
                  filter: 'brightness(0.92) contrast(1.15)',
                  transform: `scale(${zoomScale})`
                }}
              />
            )}

            {/* Dark Scrim overlay */}
            <div className={`absolute inset-0 pointer-events-none transition-colors duration-500 ${
              missionMode === 'KARHUTLA_THERMAL' ? 'bg-[#180503]/40' : 'bg-[#040810]/35'
            }`} />

            {/* SVG OVERLAY: REAL SATELLITE VECTORS & HOTSPOTS */}
            <div 
              className="absolute inset-0 pointer-events-none transition-transform duration-300"
              style={{ transform: `scale(${zoomScale})` }}
            >
              <svg className="w-full h-full" viewBox="0 0 800 480" preserveAspectRatio="none">
                <defs>
                  {/* Cyan Radar Gradient */}
                  <radialGradient id="cyanRadarGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                    <stop offset="70%" stopColor="#06b6d4" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                  </radialGradient>
                  {/* Thermal Hotspot Radiant Gradient */}
                  <radialGradient id="thermalFireGrad" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
                    <stop offset="40%" stopColor="#f97316" stopOpacity="0.5" />
                    <stop offset="80%" stopColor="#eab308" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                  </radialGradient>
                  {/* Smoke Plume Gradient */}
                  <linearGradient id="smokeHazeGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                    <stop offset="40%" stopColor="#fb923c" stopOpacity="0.3" />
                    <stop offset="80%" stopColor="#cbd5e1" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* ============================================================== */}
                {/* MODE 1: AIR DEFENSE C4ISR VECTORS (Exact Screenshot Replica)   */}
                {/* ============================================================== */}
                {missionMode === 'AIR_DEFENSE' && (
                  <g>
                    {/* Interconnecting Orbital Arcs (Cyan Mesh) */}
                    <g stroke="#06b6d4" strokeWidth="1" strokeDasharray="4 3" opacity="0.6">
                      <path d="M 120 180 Q 180 250 240 280" fill="none" />
                      <path d="M 240 280 Q 280 200 360 190" fill="none" />
                      <path d="M 360 190 Q 420 190 470 210" fill="none" />
                      <path d="M 240 280 Q 340 300 430 305" fill="none" />
                      <path d="M 470 210 Q 580 220 680 240" fill="none" />
                    </g>

                    {/* Radar Coverage Circles over bases */}
                    <circle cx="330" cy="120" r="65" fill="url(#cyanRadarGrad)" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
                    <circle cx="210" cy="275" r="75" fill="url(#cyanRadarGrad)" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
                    <circle cx="470" cy="235" r="65" fill="url(#cyanRadarGrad)" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />
                    <circle cx="680" cy="210" r="70" fill="url(#cyanRadarGrad)" stroke="#06b6d4" strokeWidth="0.8" strokeDasharray="3 3" opacity="0.7" />

                    {/* Base Markers */}
                    <circle cx="120" cy="230" r="4.5" fill="#06b6d4" />
                    <circle cx="180" cy="270" r="4.5" fill="#06b6d4" />
                    <circle cx="330" cy="120" r="5" fill="#06b6d4" />
                    <circle cx="210" cy="275" r="5" fill="#06b6d4" />
                    <circle cx="360" cy="210" r="4.5" fill="#06b6d4" />
                    <circle cx="470" cy="235" r="5" fill="#06b6d4" />
                    <circle cx="530" cy="285" r="4" fill="#06b6d4" />
                    <circle cx="680" cy="210" r="5" fill="#06b6d4" />
                  </g>
                )}

                {/* ============================================================== */}
                {/* MODE 2: REAL-SATELLITE THERMAL KARHUTLA HOTSPOTS & SMOKE PLUME */}
                {/* ============================================================== */}
                {missionMode === 'KARHUTLA_THERMAL' && (
                  <g className="animate-in fade-in duration-300">
                    {/* SMOKE HAZE TRAJECTORIES (Aerosol Optical Depth) */}
                    {/* Haze from OKI towards Palembang & Bangka Strait */}
                    <path
                      d="M 160 250 Q 140 220 120 180 Q 150 160 180 200 Z"
                      fill="url(#smokeHazeGrad)"
                      opacity="0.65"
                    />
                    {/* Haze from Riau towards Malacca */}
                    <path
                      d="M 130 170 Q 110 130 90 90 Q 140 100 160 140 Z"
                      fill="url(#smokeHazeGrad)"
                      opacity="0.6"
                    />
                    {/* Haze from Central Kalimantan towards West/Java Sea */}
                    <path
                      d="M 270 220 Q 230 200 200 230 Q 240 260 280 240 Z"
                      fill="url(#smokeHazeGrad)"
                      opacity="0.5"
                    />

                    {/* Wind Vector Arrows (BMKG Real-time Wind Field) */}
                    <g stroke="#fed7aa" strokeWidth="1.2" strokeDasharray="3 3" opacity="0.8">
                      <path d="M 170 260 L 140 210" markerEnd="url(#arrow)" />
                      <path d="M 140 180 L 110 130" />
                      <path d="M 290 230 L 240 220" />
                    </g>
                    <text x="145" y="215" fill="#fdba74" fontSize="9" fontFamily="monospace" fontWeight="bold">ANGIN 18 km/h ↖ 315°</text>

                    {/* Hotspot 1: OKI Sumatera Selatan */}
                    <g className="cursor-pointer pointer-events-auto" onClick={(e) => { e.stopPropagation(); setSelectedHotspot(hotspots[0]); tacticalAudio.playCriticalAlert(); }}>
                      <circle cx="165" cy="245" r="30" fill="url(#thermalFireGrad)" />
                      <circle cx="165" cy="245" r="18" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 2" className="animate-spin" />
                      <circle cx="165" cy="245" r="4" fill="#fff" className="animate-ping" />
                      <circle cx="165" cy="245" r="3.5" fill="#ef4444" />
                      <text x="175" y="240" fill="#fca5a5" fontSize="10" fontFamily="monospace" fontWeight="bold">🔥 OKI (112.5 MW)</text>
                      <text x="175" y="252" fill="#f87171" fontSize="9" fontFamily="monospace">Kubah Gambut &gt;3.5m</text>
                    </g>

                    {/* Hotspot 2: Pelalawan Riau */}
                    <g className="cursor-pointer pointer-events-auto" onClick={(e) => { e.stopPropagation(); setSelectedHotspot(hotspots[1]); tacticalAudio.playCriticalAlert(); }}>
                      <circle cx="130" cy="175" r="24" fill="url(#thermalFireGrad)" />
                      <circle cx="130" cy="175" r="14" fill="none" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="3 2" className="animate-spin" />
                      <circle cx="130" cy="175" r="3" fill="#ef4444" />
                      <text x="140" y="170" fill="#fca5a5" fontSize="10" fontFamily="monospace" fontWeight="bold">🔥 RIAU (78.4 MW)</text>
                      <text x="140" y="182" fill="#f87171" fontSize="9" fontFamily="monospace">Gambut Pelalawan</text>
                    </g>

                    {/* Hotspot 3: Kotawaringin Barat Kalteng */}
                    <g className="cursor-pointer pointer-events-auto" onClick={(e) => { e.stopPropagation(); setSelectedHotspot(hotspots[2]); tacticalAudio.playCriticalAlert(); }}>
                      <circle cx="275" cy="230" r="26" fill="url(#thermalFireGrad)" />
                      <circle cx="275" cy="230" r="16" fill="none" stroke="#f43f5e" strokeWidth="1.2" strokeDasharray="3 2" className="animate-spin" />
                      <circle cx="275" cy="230" r="3" fill="#ef4444" />
                      <text x="285" y="225" fill="#fca5a5" fontSize="10" fontFamily="monospace" fontWeight="bold">🔥 KALTENG (94.2 MW)</text>
                      <text x="285" y="237" fill="#f87171" fontSize="9" fontFamily="monospace">Gambut Sebangau</text>
                    </g>

                    {/* Hotspot 4: Kubu Raya Kalbar */}
                    <g className="cursor-pointer pointer-events-auto" onClick={(e) => { e.stopPropagation(); setSelectedHotspot(hotspots[3]); tacticalAudio.playCriticalAlert(); }}>
                      <circle cx="225" cy="185" r="20" fill="url(#thermalFireGrad)" />
                      <circle cx="225" cy="185" r="3" fill="#ef4444" />
                      <text x="235" y="180" fill="#fca5a5" fontSize="10" fontFamily="monospace" fontWeight="bold">🔥 KALBAR (64 MW)</text>
                    </g>
                  </g>
                )}

                {/* ============================================================== */}
                {/* MODE 3: ILLEGAL LOGGING & CANOPY COHERENCE LOSS                */}
                {/* ============================================================== */}
                {missionMode === 'ILLEGAL_LOGGING' && (
                  <g className="animate-in fade-in duration-300">
                    {/* Riau Logging Anomaly */}
                    <polygon
                      points="125,190 145,185 150,205 130,210"
                      fill="#10b981"
                      fillOpacity="0.4"
                      stroke="#f43f5e"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                      className="animate-pulse"
                    />
                    <circle cx="137" cy="198" r="14" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="2 2" className="animate-spin" />
                    <text x="145" y="195" fill="#f43f5e" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      ⚠️ SAR COHERENCE LOSS: 84.6 Ha (RIAU)
                    </text>

                    {/* Lorentz Papua Bio-Acoustic Station */}
                    <circle cx="680" cy="260" r="22" fill="#10b981" fillOpacity="0.25" stroke="#10b981" strokeWidth="1.5" />
                    <circle cx="680" cy="260" r="4" fill="#10b981" />
                    <text x="700" y="260" fill="#34d399" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      BIO-AKUSTIK TN LORENTZ
                    </text>
                  </g>
                )}

                {/* ============================================================== */}
                {/* MODE 4: MARITIME IUU FISHING & DARK VESSEL IN ZEE              */}
                {/* ============================================================== */}
                {missionMode === 'IUU_FISHING' && (
                  <g className="animate-in fade-in duration-300">
                    {/* ZEE Boundary Natuna */}
                    <path
                      d="M 270 50 L 370 45 L 410 90 L 360 145 Z"
                      fill="#0284c7"
                      fillOpacity="0.15"
                      stroke="#0284c7"
                      strokeWidth="1.8"
                      strokeDasharray="6 4"
                    />
                    <text x="320" y="70" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      ZEE LAUT NATUNA UTARA [WPP 711]
                    </text>

                    {/* Dark Trawlers */}
                    <polygon points="340,105 348,118 332,118" fill="#f43f5e" stroke="#fff" strokeWidth="1" className="animate-pulse" />
                    <circle cx="340" cy="115" r="14" fill="none" stroke="#f43f5e" strokeWidth="1" strokeDasharray="3 2" />
                    <text x="355" y="115" fill="#fca5a5" fontSize="10" fontFamily="monospace" fontWeight="bold">
                      ⚓ 4x DARK VESSEL PAIR-TRAWL
                    </text>
                  </g>
                )}

                {/* ACTIVE RECONNAISSANCE TARGETING RETICLE OVER CLICKED POINT */}
                {reconData && (
                  <g transform={`translate(${(reconData.screenPos.x / 100) * 800}, ${(reconData.screenPos.y / 100) * 480})`}>
                    {/* Outer Rotating Scan Ring */}
                    <circle cx="0" cy="0" r="32" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="6 4" className="animate-spin" />
                    {/* Inner Pulsing Core */}
                    <circle cx="0" cy="0" r="16" fill="rgba(6,182,212,0.2)" stroke="#06b6d4" strokeWidth="1" className="animate-ping" />
                    <circle cx="0" cy="0" r="4" fill="#06b6d4" />
                    {/* Crosshair Spikes */}
                    <line x1="-40" y1="0" x2="-20" y2="0" stroke="#06b6d4" strokeWidth="1.5" />
                    <line x1="20" y1="0" x2="40" y2="0" stroke="#06b6d4" strokeWidth="1.5" />
                    <line x1="0" y1="-40" x2="0" y2="-20" stroke="#06b6d4" strokeWidth="1.5" />
                    <line x1="0" y1="20" x2="0" y2="40" stroke="#06b6d4" strokeWidth="1.5" />
                    {/* Small Coordinate Tag */}
                    <rect x="12" y="-28" width="130" height="18" fill="#030814" stroke="#06b6d4" rx="3" opacity="0.95" />
                    <text x="16" y="-16" fill="#38bdf8" fontSize="9" fontFamily="monospace" fontWeight="bold">
                      TARGET: {reconData.latStr}, {reconData.lngStr}
                    </text>
                  </g>
                )}
              </svg>

              {/* THREAT MARKERS OVERLAY (ALWAYS ACTIVE FOR MILITARY SITUATIONAL AWARENESS) */}
              <div 
                onClick={(e) => { e.stopPropagation(); handleOpenThreat(threats[2]); }}
                className="absolute left-[14%] top-[32%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-30 pointer-events-auto"
              >
                <div className="relative flex items-center justify-center">
                  <span className="w-16 h-16 rounded-full bg-rose-500/20 animate-ping absolute" />
                  <span className="w-10 h-10 rounded-full border border-rose-500/80 absolute" />
                  <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.9)]">
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="absolute left-7 top-1/2 -translate-y-1/2 bg-[#2c0c14]/95 border border-[#c41e3a] rounded-lg p-2 shadow-[0_0_20px_rgba(244,63,94,0.5)] min-w-[150px] font-mono group-hover:scale-105 transition-transform backdrop-blur">
                    <span className="text-xs font-bold text-white block">THREAT 01</span>
                    <span className="text-[11px] font-semibold text-slate-100 block uppercase">UNKNOWN AIRCRAFT</span>
                    <span className="text-[10px] text-rose-400 font-bold block">14:31:52</span>
                  </div>
                </div>
              </div>

              <div 
                onClick={(e) => { e.stopPropagation(); handleOpenThreat(threats[1]); }}
                className="absolute left-[28%] top-[56%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-30 pointer-events-auto"
              >
                <div className="relative flex items-center justify-center">
                  <span className="w-20 h-20 rounded-full bg-rose-500/25 animate-ping absolute" />
                  <span className="w-12 h-12 rounded-full border border-rose-500/80 absolute" />
                  <div className="w-5 h-5 rounded-full bg-rose-600 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.9)]">
                    <span className="w-2 h-2 rounded-full bg-white" />
                  </div>
                  <div className="absolute left-7 top-1/2 -translate-y-1/2 bg-[#2c0c14]/95 border border-[#c41e3a] rounded-lg p-2 shadow-[0_0_20px_rgba(244,63,94,0.5)] min-w-[160px] font-mono group-hover:scale-105 transition-transform backdrop-blur">
                    <span className="text-xs font-bold text-white block">THREAT 02</span>
                    <span className="text-[11px] font-semibold text-slate-100 block uppercase">HOSTILE DRONE SWARM</span>
                    <span className="text-[10px] text-rose-400 font-bold block">14:32:05</span>
                  </div>
                </div>
              </div>

              <div 
                onClick={(e) => { e.stopPropagation(); handleOpenThreat(threats[0]); }}
                className="absolute left-[54%] top-[30%] -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-30 pointer-events-auto"
              >
                <div className="relative flex items-center justify-center">
                  <span className="w-24 h-24 rounded-full bg-rose-500/25 animate-ping absolute" />
                  <span className="w-14 h-14 rounded-full border border-rose-500/90 absolute" />
                  <div className="w-6 h-6 rounded-full bg-rose-600 flex items-center justify-center shadow-[0_0_20px_rgba(244,63,94,1)] animate-pulse">
                    <AlertTriangle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <div className="absolute left-8 top-1/2 -translate-y-1/2 bg-[#2c0c14]/95 border border-[#c41e3a] rounded-lg p-2.5 shadow-[0_0_25px_rgba(244,63,94,0.6)] min-w-[170px] font-mono group-hover:scale-105 transition-transform backdrop-blur">
                    <span className="text-xs font-bold text-white block">THREAT 03</span>
                    <span className="text-[11px] font-semibold text-slate-100 block uppercase">BALLISTIC MISSILE TRACK</span>
                    <span className="text-[10px] text-rose-400 font-bold block">14:32:11</span>
                  </div>
                </div>
              </div>

              {/* Geographical Text Labels */}
              <div className="absolute left-[13%] top-[45%] text-slate-400 font-mono text-[11px] font-bold tracking-widest pointer-events-none">
                SUMATRA
              </div>
              <div className="absolute left-[29%] top-[51%] text-slate-400 font-mono text-[11px] font-bold tracking-widest pointer-events-none">
                JAVA
              </div>
              <div className="absolute left-[31%] top-[24%] text-slate-400 font-mono text-[11px] font-bold tracking-widest pointer-events-none">
                KALIMANTAN
              </div>
              <div className="absolute left-[45%] top-[58%] text-slate-400 font-mono text-[10px] font-bold tracking-widest pointer-events-none text-center">
                NUSA<br />TENGGARA
              </div>
              <div className="absolute left-[70%] top-[70%] text-slate-400 font-mono text-[11px] font-bold tracking-widest pointer-events-none">
                PAPUA
              </div>
            </div>

            {/* FLOATING ORBITAL SATELLITE RECONNAISSANCE HUD (APPEARS ON CLICK) */}
            {reconData && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute z-40 bg-[#070e1c]/95 border-2 border-cyan-400 rounded-xl p-4 shadow-[0_0_35px_rgba(6,182,212,0.4)] backdrop-blur max-w-sm font-mono text-xs animate-in zoom-in-95 pointer-events-auto"
                style={{
                  left: `${Math.min(Math.max(reconData.screenPos.x, 22), 70)}%`,
                  top: `${Math.min(Math.max(reconData.screenPos.y, 25), 65)}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="flex items-center justify-between border-b border-cyan-800 pb-2 mb-2">
                  <div className="flex items-center gap-1.5 text-cyan-400 font-bold text-xs">
                    <Satellite className="w-4 h-4 text-cyan-300 animate-pulse" />
                    <span>ORBITAL RECON // {reconData.latStr}, {reconData.lngStr}</span>
                  </div>
                  <button 
                    onClick={() => setReconData(null)}
                    className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div className="text-white font-bold text-xs font-sans">
                    Wilayah: {reconData.regionName}
                  </div>
                  <div className="text-cyan-300 text-[10px]">
                    Military Grid: {reconData.mgrs}
                  </div>
                  <div className="flex justify-between text-slate-400 pt-1 border-t border-slate-800 text-[10px]">
                    <span>Satelit Overhead:</span>
                    <strong className="text-white">{reconData.overheadSatellite}</strong>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Sudut Elevasi / Azim:</span>
                    <span className="text-amber-400 font-bold">{reconData.elevationDeg}° / {reconData.azimuthDeg}°</span>
                  </div>
                  <div className="p-2 rounded bg-black/50 border border-slate-800 text-[10px] space-y-1">
                    <span className="text-rose-400 font-bold block uppercase">{reconData.environmentalRisk}</span>
                    <p className="text-slate-300 font-sans">{reconData.recommendedAction}</p>
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={handleAuthorizeReconAction}
                    className="w-full py-2 px-3 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>{reconData.actionButtonLabel}</span>
                  </button>
                </div>
              </div>
            )}

            {/* HOTSPOT DETAIL INSPECTOR POPOVER (WHEN CLICKING FIRE HOTSPOT) */}
            {selectedHotspot && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute z-40 bg-[#16070a]/95 border-2 border-rose-500 rounded-xl p-4 shadow-[0_0_35px_rgba(244,63,94,0.5)] backdrop-blur max-w-sm font-mono text-xs animate-in zoom-in-95 pointer-events-auto"
                style={{
                  left: `${selectedHotspot.posPercent.x + 12}%`,
                  top: `${selectedHotspot.posPercent.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div className="flex items-center justify-between border-b border-rose-900 pb-2 mb-2">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold text-xs">
                    <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
                    <span>SATELIT TERMAL // {selectedHotspot.id}</span>
                  </div>
                  <button 
                    onClick={() => setSelectedHotspot(null)}
                    className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-[11px] text-slate-300">
                  <div className="text-white font-bold text-xs font-sans">
                    {selectedHotspot.name}
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    Lokasi: {selectedHotspot.province}
                  </div>
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-rose-950 text-[10px]">
                    <div>
                      <span className="text-slate-500 block">Fire Radiative Power</span>
                      <strong className="text-rose-400 text-xs">{selectedHotspot.frpMegawatts} MW</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">AI Confidence</span>
                      <strong className="text-emerald-400 text-xs">{selectedHotspot.confidencePercent}%</strong>
                    </div>
                  </div>
                  <div className="text-[10px] text-amber-400">
                    Arah Sebaran Asap: {selectedHotspot.hazeDirection}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Sensor: {selectedHotspot.satelliteSensor}
                  </div>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleDispatchWaterbomb(selectedHotspot.id)}
                    className="w-full py-2 px-3 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Plane className="w-3.5 h-3.5" />
                    <span>OTORISASI WATER BOMBING &amp; TMC</span>
                  </button>
                </div>
              </div>
            )}

            {/* Bottom-Left Zoom Controls */}
            <div className="absolute bottom-5 left-5 flex flex-col gap-2 z-20 font-mono">
              <div className="flex flex-col rounded-lg bg-[#0a1424] border border-[#1b314d] overflow-hidden shadow-lg">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    tacticalAudio.playTacticalClick();
                    setZoomScale((prev) => Math.min(prev + 0.25, 2.0));
                  }}
                  className="p-2 text-slate-300 hover:text-white hover:bg-[#13233b] border-b border-[#1b314d] transition-colors cursor-pointer"
                  title="Zoom In"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    tacticalAudio.playTacticalClick();
                    setZoomScale((prev) => Math.max(prev - 0.25, 0.9));
                  }}
                  className="p-2 text-slate-300 hover:text-white hover:bg-[#13233b] transition-colors cursor-pointer"
                  title="Zoom Out"
                >
                  <Minus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  tacticalAudio.playTacticalClick();
                  setZoomScale(1);
                  setReconData(null);
                }}
                className="p-2 rounded-lg bg-[#0a1424] border border-[#1b314d] text-slate-300 hover:text-white hover:bg-[#13233b] transition-colors shadow-lg cursor-pointer"
                title="Re-Center Map"
              >
                <Crosshair className="w-4 h-4" />
              </button>
            </div>
          </div>
          )}

          {/* Map Legend Bar matching screenshot (Dynamic per Mission Mode) */}
          <div className="px-5 py-2.5 bg-[#060c18] border-t border-[#101e30] flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
            {missionMode === 'KARHUTLA_THERMAL' ? (
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-bold text-rose-400">LEGENDA TERMAL:</span>
                <div className="flex items-center gap-1.5 text-rose-400">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
                  <span>HOTSPOT RADIASI TERMAL (&gt;75 MW)</span>
                </div>
                <div className="flex items-center gap-1.5 text-orange-400">
                  <div className="w-4 h-2 rounded bg-gradient-to-r from-orange-500 to-transparent" />
                  <span>SEBARAN ASAP (AOD BMKG)</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-300">
                  <Flame className="w-3.5 h-3.5" />
                  <span>KUBAH GAMBUT RAWAN TERBAKAR</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4 flex-wrap">
                <span className="font-bold text-slate-300">LEGEND:</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 rounded-full border border-cyan-400 border-dashed" />
                  <span>RADAR COVERAGE</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                  <span>ASSET / SENSOR</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 bg-rose-500 rotate-45" />
                  <span>THREAT DETECTED</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-white" />
                  <span>AIR DEFENSE UNIT</span>
                </div>
              </div>
            )}

            <div className="text-[11px] text-slate-500">
              {missionMode === 'KARHUTLA_THERMAL' 
                ? 'SATELLITE DATA: TERRA/AQUA MODIS & NOAA VIIRS | BMKG HOTSPOT GRID' 
                : 'MAP DATA: TNI / BMKG | COORDINATE: WGS 84'}
            </div>
          </div>

          {/* System Status Strip at Bottom */}
          <div className="px-5 py-3 bg-[#070f1c] border-t border-[#14263e] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">SYSTEM STATUS</span>
              <span className="flex items-center gap-1 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>OPERATIONAL</span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">
                {missionMode === 'KARHUTLA_THERMAL' ? 'HOTSPOTS DETECTED' : 'THREATS DETECTED'}
              </span>
              <strong className="text-rose-500 font-bold">
                {missionMode === 'KARHUTLA_THERMAL' ? '4 KLASTER AKTIF (349 MW)' : '3 ACTIVE'}
              </strong>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">ASSETS ONLINE</span>
              <strong className="text-cyan-400 font-bold">24 / 28</strong>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400">COVERAGE</span>
              <strong className="text-white">87%</strong>
              <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400 w-[87%]" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT AREA: AI DECISION LOG & RECOMMENDED ACTIONS (4 Cols on LG) matching screenshot */}
        <div className="lg:col-span-4 p-5 flex flex-col justify-between bg-[#070f1c] space-y-6">
          {/* AI DECISION LOG HEADER */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#14263e] pb-2.5">
              <h2 className="text-sm font-mono font-bold text-white tracking-wider uppercase">
                AI DECISION LOG
              </h2>
              <span className="flex items-center gap-1 text-xs font-mono font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI ACTIVE</span>
              </span>
            </div>

            {/* C4ISR Multi-Domain Quick Navigation Pills */}
            <div className="flex items-center gap-1.5 p-1 rounded-lg bg-[#050b14] border border-[#14263e] overflow-x-auto text-[10px] font-mono scrollbar-none">
              <button
                onClick={() => handleOpenThreat(threats[0], 'AI_PANEL')}
                className="px-2 py-1 rounded bg-[#0a1424] hover:bg-[#13233b] text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                AI DECISION PANEL
              </button>
              <button
                onClick={() => handleOpenThreat(threats[0], 'TRACKING_FEED')}
                className="px-2 py-1 rounded bg-[#0a1424] hover:bg-[#13233b] text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                TRACKING FEED
              </button>
              <button
                onClick={() => handleOpenThreat(threats[0], 'SENSOR_NETWORK')}
                className="px-2 py-1 rounded bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 transition-colors cursor-pointer whitespace-nowrap font-bold flex items-center gap-1"
              >
                <Radio className="w-3 h-3 text-cyan-400" />
                <span>(o) SENSOR NETWORK</span>
              </button>
              <button
                onClick={() => handleOpenThreat(threats[0], 'ASSET_STATUS')}
                className="px-2 py-1 rounded bg-[#0a1424] hover:bg-[#13233b] text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                ASSET STATUS
              </button>
              <button
                onClick={() => handleOpenThreat(threats[0], 'SYSTEM_LOGS')}
                className="px-2 py-1 rounded bg-[#0a1424] hover:bg-[#13233b] text-slate-300 hover:text-white transition-colors cursor-pointer whitespace-nowrap"
              >
                SYSTEM LOGS
              </button>
            </div>

            {/* DYNAMIC LIST ACCORDING TO MISSION MODE */}
            {missionMode === 'KARHUTLA_THERMAL' ? (
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {hotspots.map((h) => (
                  <div
                    key={h.id}
                    onClick={() => { setSelectedHotspot(h); tacticalAudio.playCriticalAlert(); }}
                    className="p-3 rounded-lg bg-[#140608] border border-[#3b1216] hover:border-rose-500 transition-colors cursor-pointer space-y-1.5 font-mono text-xs"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-rose-500 shrink-0 animate-pulse" />
                        <span className="text-white font-bold">{h.name}</span>
                      </div>
                      <span className="text-rose-400 font-bold">{h.frpMegawatts} MW</span>
                    </div>

                    <div className="text-[11px] text-slate-400">
                      {h.province} · <span className="text-amber-400">{h.peatDepth}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px]">
                      <span className="text-slate-500">ISPU: PM2.5 {h.pm25} µg/m³</span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        h.status === 'DISPATCHED_WATERBOMB' 
                          ? 'bg-emerald-950/60 border border-emerald-500/50 text-emerald-400' 
                          : 'bg-rose-950/60 border border-rose-500/50 text-rose-400'
                      }`}>
                        {h.status === 'DISPATCHED_WATERBOMB' ? 'WATER BOMBING AKTIF' : 'KRITIS TERBAKAR'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Threat Items matching Screenshot */
              <div className="space-y-2.5">
                {/* Item 1: Threat 03 */}
                <div 
                  onClick={() => handleOpenThreat(threats[0])}
                  className="p-3 rounded-lg bg-[#0a1424] border border-[#1b314d] hover:border-rose-500/60 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-start justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                      <span className="text-slate-200 font-bold">14:32:11 | THREAT 03 - BALLISTIC MISSILE TRACK</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">14:32:11</span>
                  </div>
                  <div className="pl-6 text-xs text-slate-400 space-y-0.5">
                    <div>Classification: <span className="text-slate-200">High Threat</span></div>
                    <div>Confidence: <span className="text-slate-200">94.7%</span></div>
                    <div>Recommended Action: <span className="text-rose-400 font-semibold">Intercept &amp; Neutralize</span></div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-rose-600/50 bg-rose-950/40 text-rose-400">
                      HIGH CONFIDENCE
                    </span>
                  </div>
                </div>

                {/* Item 2: Threat 02 */}
                <div 
                  onClick={() => handleOpenThreat(threats[1])}
                  className="p-3 rounded-lg bg-[#0a1424] border border-[#1b314d] hover:border-amber-500/60 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-start justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                      <span className="text-slate-200 font-bold">14:32:05 | THREAT 02 - HOSTILE DRONE SWARM</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">14:32:05</span>
                  </div>
                  <div className="pl-6 text-xs text-slate-400 space-y-0.5">
                    <div>Classification: <span className="text-slate-200">Medium Threat</span></div>
                    <div>Confidence: <span className="text-slate-200">82.1%</span></div>
                    <div>Recommended Action: <span className="text-amber-400 font-semibold">Deploy Interceptors</span></div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-amber-600/50 bg-amber-950/40 text-amber-400">
                      MEDIUM CONFIDENCE
                    </span>
                  </div>
                </div>

                {/* Item 3: Threat 01 */}
                <div 
                  onClick={() => handleOpenThreat(threats[2])}
                  className="p-3 rounded-lg bg-[#0a1424] border border-[#1b314d] hover:border-cyan-500/60 transition-colors cursor-pointer space-y-1.5"
                >
                  <div className="flex items-start justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-slate-200 font-bold">14:31:52 | THREAT 01 - UNKNOWN AIRCRAFT</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">14:31:52</span>
                  </div>
                  <div className="pl-6 text-xs text-slate-400 space-y-0.5">
                    <div>Classification: <span className="text-slate-200">Low Threat</span></div>
                    <div>Confidence: <span className="text-slate-200">61.3%</span></div>
                    <div>Recommended Action: <span className="text-cyan-400 font-semibold">Monitor &amp; Identify</span></div>
                  </div>
                  <div className="flex justify-end pt-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-cyan-600/50 bg-cyan-950/40 text-cyan-400">
                      LOW CONFIDENCE
                    </span>
                  </div>
                </div>

                {/* Item 4: System Scan */}
                <div className="p-3 rounded-lg bg-[#0a1424] border border-[#1b314d] space-y-1 text-xs font-mono">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <Radar className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span className="text-slate-200 font-bold">14:31:40 | SYSTEM SCAN COMPLETE</span>
                    </div>
                    <span className="text-slate-500 text-[10px]">14:31:40</span>
                  </div>
                  <div className="pl-6 text-slate-400 text-xs">
                    All sectors scanned. No additional anomalies detected.<br />
                    Coverage: 87%
                  </div>
                  <div className="flex justify-end pt-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-cyan-600/50 bg-cyan-950/40 text-cyan-400">
                      INFO
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* AI RECOMMENDED ACTIONS matching screenshot */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-mono font-bold text-slate-400 tracking-wider uppercase block">
              AI RECOMMENDED ACTIONS
            </span>

            {missionMode === 'KARHUTLA_THERMAL' ? (
              <div className="space-y-2 font-mono">
                <button
                  onClick={() => handleDispatchWaterbomb(hotspots[0].id)}
                  className="w-full p-3 rounded-lg bg-[#3a0d17] hover:bg-[#4d101f] border border-[#8a1c2d] hover:border-rose-500 text-rose-300 font-bold text-xs flex items-center justify-between transition-colors shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Plane className="w-4 h-4 text-rose-500" />
                    <span>KERAHKAN WATER BOMBING OKI (112.5 MW)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400" />
                </button>

                <button
                  onClick={() => {
                    tacticalAudio.playDispatchConfirm();
                    setActionSuccessNotice('TEKNOLOGI MODIFIKASI CUACA (TMC) DISAHKAN · PENYEMAIAN AWAN DI SUMATERA & KALIMANTAN');
                    setTimeout(() => setActionSuccessNotice(null), 5000);
                  }}
                  className="w-full p-3 rounded-lg bg-[#3d240c] hover:bg-[#523010] border border-[#8f521b] hover:border-amber-500 text-amber-300 font-bold text-xs flex items-center justify-between transition-colors shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Droplets className="w-4 h-4 text-amber-400" />
                    <span>OTORISASI OPERASI TMC BRIN / TNI AU</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            ) : (
              <div className="space-y-2 font-mono">
                {/* Button 1: Intercept Threat 03 (Red) */}
                <button
                  onClick={() => handleOpenThreat(threats[0])}
                  className="w-full p-3 rounded-lg bg-[#3a0d17] hover:bg-[#4d101f] border border-[#8a1c2d] hover:border-rose-500 text-rose-300 font-bold text-xs flex items-center justify-between transition-colors shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Crosshair className="w-4 h-4 text-rose-500" />
                    <span>EXECUTE INTERCEPT (THREAT 03)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-rose-400" />
                </button>

                {/* Button 2: Deploy Interceptors Threat 02 (Amber) */}
                <button
                  onClick={() => handleOpenThreat(threats[1])}
                  className="w-full p-3 rounded-lg bg-[#3d240c] hover:bg-[#523010] border border-[#8f521b] hover:border-amber-500 text-amber-300 font-bold text-xs flex items-center justify-between transition-colors shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Radar className="w-4 h-4 text-amber-400" />
                    <span>DEPLOY INTERCEPTORS (THREAT 02)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-amber-400" />
                </button>

                {/* Button 3: Monitor & Identify Threat 01 (Blue) */}
                <button
                  onClick={() => handleOpenThreat(threats[2])}
                  className="w-full p-3 rounded-lg bg-[#0b2438] hover:bg-[#103450] border border-[#1b4d74] hover:border-cyan-400 text-cyan-300 font-bold text-xs flex items-center justify-between transition-colors shadow-lg cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>MONITOR &amp; IDENTIFY (THREAT 01)</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            )}
          </div>

          {/* Bottom Dual Action Buttons matching screenshot */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-[#14263e] font-mono text-xs">
            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                handleOpenThreat(selectedThreat || threats[0], 'SYSTEM_LOGS');
              }}
              className="py-2.5 px-3 rounded-lg bg-[#0a1424] hover:bg-[#13233b] border border-[#1b314d] text-slate-300 font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>VIEW FULL LOG</span>
            </button>
            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                handleOpenThreat(selectedThreat || threats[0], 'SENSOR_NETWORK');
              }}
              className="py-2.5 px-3 rounded-lg bg-[#0a1424] hover:bg-[#13233b] border border-[#1b314d] text-slate-300 font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>SYSTEM SETTINGS</span>
            </button>
          </div>

          <div className="text-right text-[10px] font-mono text-slate-500 pt-1">
            All times in WIB (UTC+7)
          </div>
        </div>
      </div>

      {/* AI DECISION PANEL MODAL (Matches SmartSelect_20261029_205532_X_44432129.jpg 100%) */}
      <AiDecisionPanelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        threat={selectedThreat}
        onExecuteAction={handleExecuteAction}
        isAuthorized={selectedThreat ? authorizedThreatIds.includes(selectedThreat.id) : false}
        initialTab={modalInitialTab}
      />

      {/* REAL-TIME MISSION EXECUTION REALIZATION PROGRESS HUD */}
      <RealizationProgressHUD
        operation={activeRealizationOp}
        isOpen={isRealizationHUDOpen}
        onClose={() => setIsRealizationHUDOpen(false)}
        onReset={() => {
          if (activeRealizationOp) {
            setAuthorizedThreatIds((prev) => prev.filter(id => !activeRealizationOp.id.includes(id)));
          }
        }}
      />
    </div>
  );
};
