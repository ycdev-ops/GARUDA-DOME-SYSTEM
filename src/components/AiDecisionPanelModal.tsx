import React, { useState } from 'react';
import { 
  X, 
  Crosshair, 
  Compass, 
  Rocket, 
  ShieldCheck, 
  Lock, 
  Info, 
  Activity, 
  Radio, 
  Eye, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Sliders,
  Cpu,
  Wifi,
  Waves,
  Trees,
  Flame,
  Shield,
  Layers,
  Sparkles,
  ArrowRight,
  Filter,
  Download,
  Terminal,
  Send,
  Zap,
  Check
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';

export interface ThreatData {
  id: string;
  code: string;
  title: string;
  time: string;
  threatType: string;
  priorityLevel: 'KRITIS' | 'TINGGI' | 'SEDANG' | 'LOW';
  confidencePercent: number;
  speed: string;
  altitude: string;
  trajectory: string;
  rcsSignature: string;
  analysisText: string[];
  recommendedActionText: string;
  locationSector: string;
}

export interface SensorConfigItem {
  id: string;
  name: string;
  domain: 'AIR_DEFENSE' | 'MARITIME_IUU' | 'ILLEGAL_LOGGING' | 'DISASTER_KARHUTLA' | 'CYBER_DEFENSE';
  agency: string;
  frequencyBand: string;
  status: 'ONLINE' | 'STANDBY' | 'DEGRADED';
  enabled: boolean;
  sensitivity: 'TINGGI' | 'SEDANG' | 'MAKSIMAL';
  latencyMs: number;
  packetRate: number;
  description: string;
}

interface TrackingTarget {
  id: string;
  code: string;
  name: string;
  domain: 'UDARA' | 'MARITIM_IUU' | 'LOGGING' | 'SIBER';
  coordinates: string;
  mgrs: string;
  speed: string;
  altitudeDepth: string;
  bearing: string;
  primarySensor: string;
  confidence: number;
  status: 'TRACKED' | 'INTERCEPTING' | 'LOCKED';
}

interface AssetUnit {
  id: string;
  name: string;
  unit: string;
  domain: 'TNI_AU' | 'TNI_AL' | 'KLHK_SPORC' | 'BSSN_CYBER';
  baseLocation: string;
  readiness: 'SIAGA 1' | 'PATROLI' | 'MAINTENANCE';
  fuelPercentage: number;
  payload: string;
  etaMinutes: number;
  operatorContact: string;
}

interface SystemAuditLog {
  id: string;
  timestamp: string;
  domain: 'UDARA' | 'MARITIM' | 'KEHUTANAN' | 'SIBER' | 'SISTEM';
  severity: 'CRITICAL' | 'WARN' | 'INFO';
  operator: string;
  hash: string;
  message: string;
}

interface AiDecisionPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  threat: ThreatData | null;
  onExecuteAction: (threatId: string) => void;
  isAuthorized?: boolean;
  initialTab?: 'AI_PANEL' | 'TRACKING_FEED' | 'SENSOR_NETWORK' | 'ASSET_STATUS' | 'SYSTEM_LOGS';
}

// Preset Multi-Domain Threats for in-modal switching
const MULTI_DOMAIN_THREAT_CATALOG: ThreatData[] = [
  {
    id: 'THREAT-03',
    code: 'THREAT 03',
    title: 'BALLISTIC MISSILE TRACK',
    time: '14:32:11',
    threatType: 'BALLISTIC_MISSILE',
    priorityLevel: 'KRITIS',
    confidencePercent: 94.7,
    speed: 'MACH 4.2+',
    altitude: '18,500 - 22,000 m',
    trajectory: 'BALISTIK / MANUVER',
    rcsSignature: '0.65 m² (STEALTHY)',
    analysisText: [
      'Analisis AI mendeteksi jejak ancaman berkecepatan tinggi dengan profil trajektori balistik.',
      'Pola manuver menunjukkan niat permusuhan ke arah sektor objek vital nasional.',
      'Probabilitas ancaman: 92.7%.',
      'Tidak ada kecocokan dengan aset ramah dalam database IFF Kohanudnas.'
    ],
    recommendedActionText: 'INTERCEPT',
    locationSector: 'Laut Natuna Utara / Blok D-Alpha'
  },
  {
    id: 'THREAT-02',
    code: 'THREAT 02',
    title: 'HOSTILE DRONE SWARM',
    time: '14:32:05',
    threatType: 'DRONE_SWARM',
    priorityLevel: 'TINGGI',
    confidencePercent: 82.1,
    speed: 'MACH 0.8',
    altitude: '2,500 - 4,000 m',
    trajectory: 'LOW-ALTITUDE LOITERING SWARM',
    rcsSignature: '0.12 m² (MICRO-UAV)',
    analysisText: [
      'Deteksi formasi 12 UAV otonom terdistribusi dengan enkripsi frekuensi RF 2.4/5.8 GHz terkoordinasi.',
      'Jejak sensor termal infra-merah mengindikasikan muatan pengintaian & jamming taktis.',
      'Probabilitas ancaman: 82.1%.',
      'Mengancam koridor pesisir pertahanan udara Jawa bagian selatan.'
    ],
    recommendedActionText: 'DEPLOY INTERCEPTORS',
    locationSector: 'Pesisir Selatan Jawa'
  },
  {
    id: 'THREAT-01',
    code: 'THREAT 01',
    title: 'UNKNOWN AIRCRAFT',
    time: '14:31:52',
    threatType: 'UNKNOWN_AIRCRAFT',
    priorityLevel: 'SEDANG',
    confidencePercent: 61.3,
    speed: 'MACH 1.4',
    altitude: '11,200 m (FL360)',
    trajectory: 'LINIER NON-RESPONSIVE TRANSIT',
    rcsSignature: '2.40 m²',
    analysisText: [
      'Kontak radar supersonik tanpa izin penerbangan resmi melintasi batas ADIZ Sektor I.',
      'Transponder IFF Mode-S tidak merespon panggilan darurat frekuensi 121.5 MHz.',
      'Probabilitas ancaman: 61.3%.',
      'Disarankan pencegatan visual (VisId) oleh Skadron Udara Pekanbaru.'
    ],
    recommendedActionText: 'MONITOR & IDENTIFY',
    locationSector: 'Selat Malaka / Sektor Sumatera Utara'
  },
  {
    id: 'THREAT-04',
    code: 'THREAT 04',
    title: 'IUU FISHING DARK TRAWLER FLEET',
    time: '14:30:15',
    threatType: 'ILLEGAL_FISHING_DARK_FLEET',
    priorityLevel: 'KRITIS',
    confidencePercent: 97.4,
    speed: '3.8 KNOTS (TRAWLING)',
    altitude: 'PERMUKAAN LAUT (0 m)',
    trajectory: 'PAIR TRAWLING PATTERN / ZEE WPPNRI 711',
    rcsSignature: '48.5 m² (STEEL HULL x4)',
    analysisText: [
      'Sensor Fusion citra Radar SAR Sentinel-1 mengonfirmasi 4 kapal baja berkecepatan 3.8 knot dengan AIS dimatikan (Dark Vessels).',
      'Pola pergerakan sejajar menunjukkan penangkapan ikan ilegal menggunakan pukat harimau (pair trawling) di ZEE Indonesia.',
      'Probabilitas pencurian sumber daya: 97.4%. Estimasi kerugian negara: Rp 14,2 Miliar/hari.',
      'Rekomendasi pencegatan lintas-instansi: TNI AL dan Bakamla berwenang melakukan penindakan hukum.'
    ],
    recommendedActionText: 'DISPOSISI KRI & BAKAMLA INTERCEPT',
    locationSector: 'Laut Natuna Utara / Koordinat 4.82°N, 108.75°E'
  },
  {
    id: 'THREAT-05',
    code: 'THREAT 05',
    title: 'ILLEGAL LOGGING SAR COHERENCE LOSS',
    time: '14:28:40',
    threatType: 'ILLEGAL_LOGGING_CANOPY',
    priorityLevel: 'KRITIS',
    confidencePercent: 96.8,
    speed: 'STATIS / ALAT BERAT AKTIF',
    altitude: 'ELEVASI HUTAN (320 m ASL)',
    trajectory: 'KORIDOR JALUR LOGGING BARU 3.2 KM',
    rcsSignature: 'DELTA COHERENCE -0.84 (84.6 HA)',
    analysisText: [
      'Interferometric SAR Sentinel-1 mendeteksi degradasi tutupan kanopi 84.6 Hektar secara abnormal dalam 48 jam di Hutan Lindung.',
      'Jaringan sensor biofonik akustik LoRa menangkap spektrum suara gergaji mesin 2.45 kHz dan pergerakan ekskavator berat.',
      'Probabilitas pembalakan liar: 96.8%. Koridor jalan angkut ilegal baru terhubung ke muara sungai.',
      'Rekomendasi: Kerahkan Satgas Polhut Reaksi Cepat (SPORC) KLHK dengan dukungan drone pengintai PUNA Male TNI.'
    ],
    recommendedActionText: 'KERAHKAN SATGAS SPORC KLHK & DRONE',
    locationSector: 'Taman Nasional / Kawasan Hutan Lindung Riau'
  },
  {
    id: 'THREAT-06',
    code: 'THREAT 06',
    title: 'GPS SPOOFING & VTS CYBER INTRUSION',
    time: '14:26:02',
    threatType: 'CYBER_SPOOFING_INTRUSION',
    priorityLevel: 'TINGGI',
    confidencePercent: 88.5,
    speed: 'KECEPATAN CAHAYA (RF/IP)',
    altitude: 'JARINGAN CYBER-PHYSICAL',
    trajectory: 'INJEKSI PAKET PALSU KE VTS & AIS REPEATER',
    rcsSignature: 'MALICIOUS UDP STREAM / PORT 8080',
    analysisText: [
      'Pusat Operasi Keamanan Siber BSSN mendeteksi anomali injeksi koordinat GPS palsu pada stasiun radar navigasi Selat Sunda.',
      'AI Cyber Defense memblokir 1.420 paket spoofing yang berusaha membelokkan rute kapal kargo internasional.',
      'Probabilitas intrusi siber terorganisir: 88.5%.',
      'Rekomendasi: Isolasi node transmiter lokal dan aktifkan enkripsi kuantum Kyber-1024.'
    ],
    recommendedActionText: 'ISOLASI FIREWALL & COUNTER-MEASURE BSSN',
    locationSector: 'Selat Sunda / Stasiun VTS Maritim'
  }
];

const INITIAL_SENSORS: SensorConfigItem[] = [
  {
    id: 'SENS-01',
    name: 'Radar Pertahanan Udara 3D Thomson Master-T (Satrad Ranai)',
    domain: 'AIR_DEFENSE',
    agency: 'TNI AU / Kohanudnas',
    frequencyBand: 'S-Band (3.0 GHz)',
    status: 'ONLINE',
    enabled: true,
    sensitivity: 'MAKSIMAL',
    latencyMs: 8,
    packetRate: 4200,
    description: 'Pendeteksian target udara supersonik, rudal balistik, dan penjejakan kontur ketinggian tinggi.'
  },
  {
    id: 'SENS-02',
    name: 'Radar Pertahanan Udara Jarak Jauh RAT-31DL (Satrad Tanjung Pinang)',
    domain: 'AIR_DEFENSE',
    agency: 'TNI AU / Kohanudnas',
    frequencyBand: 'L-Band (1.2 GHz)',
    status: 'ONLINE',
    enabled: true,
    sensitivity: 'TINGGI',
    latencyMs: 11,
    packetRate: 3800,
    description: 'Cakupan 450 km untuk pengawasan batas ADIZ I dan peringatan dini pelanggaran kedaulatan udara.'
  },
  {
    id: 'SENS-03',
    name: 'Transponder AIS Satelit LEO Global (Spire / Orbcomm)',
    domain: 'MARITIME_IUU',
    agency: 'KKP & Bakamla',
    frequencyBand: 'VHF (161.975 / 162.025 MHz)',
    status: 'ONLINE',
    enabled: true,
    sensitivity: 'TINGGI',
    latencyMs: 24,
    packetRate: 2100,
    description: 'Pelacakan real-time 3.400+ kapal niaga dan penangkapan ikan di seluruh 11 Wilayah WPPNRI.'
  },
  {
    id: 'SENS-04',
    name: 'Integrated Maritime Surveillance System (IMSS Radar Pantai Bakamla)',
    domain: 'MARITIME_IUU',
    agency: 'Bakamla & TNI AL',
    frequencyBand: 'X-Band Maritim (9.4 GHz)',
    status: 'ONLINE',
    enabled: true,
    sensitivity: 'MAKSIMAL',
    latencyMs: 14,
    packetRate: 3100,
    description: 'Pendeteksian kontak kapal berbadan baja yang mematikan transponder AIS (Dark Vessel) di ALKI.'
  },
  {
    id: 'SENS-05',
    name: 'Radar Satelit Sentinel-1 SAR C-Band (InSAR Canopy Coherence)',
    domain: 'ILLEGAL_LOGGING',
    agency: 'KLHK / LAPAN-BRIN',
    frequencyBand: 'C-Band SAR (5.4 GHz)',
    status: 'ONLINE',
    enabled: true,
    sensitivity: 'MAKSIMAL',
    latencyMs: 42,
    packetRate: 1450,
    description: 'Penembusan tutupan awan tropis untuk deteksi perubahan kanopi hutan dan pembuatan jalur pembalakan.'
  },
  {
    id: 'SENS-06',
    name: 'Jaringan Sensor Biofonik Akustik Tropis LoRa Mesh (TN Lorentz & Bukit Baka)',
    domain: 'ILLEGAL_LOGGING',
    agency: 'KLHK Gakkum',
    frequencyBand: 'LoRa 433 MHz -> LEO Gateway',
    status: 'ONLINE',
    enabled: true,
    sensitivity: 'TINGGI',
    latencyMs: 35,
    packetRate: 850,
    description: 'Klasifikasi AI real-time suara gergaji mesin (chainsaw), tembakan perburuan, dan alat berat.'
  },
  {
    id: 'SENS-07',
    name: 'Satelit Termal Multispektral MODIS / VIIRS (FRP Fire Hotspot)',
    domain: 'DISASTER_KARHUTLA',
    agency: 'BNPB / BMKG',
    frequencyBand: 'Infra-Merah Termal (3.7 - 11 µm)',
    status: 'ONLINE',
    enabled: true,
    sensitivity: 'SEDANG',
    latencyMs: 50,
    packetRate: 640,
    description: 'Monitoring titik panas kebakaran hutan dan gambut (karhutla) dengan resolusi 375 meter.'
  },
  {
    id: 'SENS-08',
    name: 'Sensor Spektrum Balmon Kominfo & BSSN Cyber Threat Mesh',
    domain: 'CYBER_DEFENSE',
    agency: 'BSSN & Kemenkominfo',
    frequencyBand: 'RF 100 kHz - 6 GHz & IP Mesh',
    status: 'ONLINE',
    enabled: true,
    sensitivity: 'MAKSIMAL',
    latencyMs: 6,
    packetRate: 8900,
    description: 'Pendeteksian jamming frekuensi, anomali GPS spoofing, dan perisai terhadap serangan siber SCADA.'
  }
];

const TRACKING_TARGETS: TrackingTarget[] = [
  {
    id: 'TRK-01',
    code: 'TGT-ALPHA-3',
    name: 'Mach 4.2+ Ballistic Vector Track',
    domain: 'UDARA',
    coordinates: '4.8241° N, 108.7512° E',
    mgrs: '48N WG 8321 4410',
    speed: 'MACH 4.24 (5.210 km/h)',
    altitudeDepth: '21.400 m (Stratosphere)',
    bearing: '194° (Menuju Obvitnas)',
    primarySensor: 'Satrad 213 & Sentinel-1 SAR',
    confidence: 94.7,
    status: 'TRACKED'
  },
  {
    id: 'TRK-02',
    code: 'TGT-BRAVO-12',
    name: '12-Unit Micro-UAV Tactical Swarm',
    domain: 'UDARA',
    coordinates: '8.4120° S, 110.3540° E',
    mgrs: '49M ZM 1290 8820',
    speed: 'Mach 0.78 (960 km/h)',
    altitudeDepth: '3.100 m ASL',
    bearing: '028° (Pesisir Selatan)',
    primarySensor: 'Radar IMSS & Arhanud S-Band',
    confidence: 82.1,
    status: 'TRACKED'
  },
  {
    id: 'TRK-03',
    code: 'TGT-SEA-DARK-4',
    name: 'Armada 4 Kapal Pukat Harimau Non-AIS',
    domain: 'MARITIM_IUU',
    coordinates: '5.1042° N, 107.9120° E',
    mgrs: '48N VG 9120 6340',
    speed: '3.8 Knots (Pair Trawling)',
    altitudeDepth: 'Permukaan Laut (0 m)',
    bearing: '085° (Memotong ZEE)',
    primarySensor: 'Sentinel-1 SAR + Radar Pantai Ranai',
    confidence: 97.4,
    status: 'TRACKED'
  },
  {
    id: 'TRK-04',
    code: 'TGT-LOG-HEAVY-1',
    name: 'Konvoi 3 Ekskavator & Truk Kayu Bulat',
    domain: 'LOGGING',
    coordinates: '0.4120° N, 101.3200° E',
    mgrs: '47N TE 4520 1200',
    speed: '12 km/h (Jalur Rintisan)',
    altitudeDepth: 'Elevasi 320 m ASL',
    bearing: '142° (Menuju Sungai)',
    primarySensor: 'Sensor Akustik Biofonik + Sentinel-1',
    confidence: 96.8,
    status: 'TRACKED'
  },
  {
    id: 'TRK-05',
    code: 'TGT-CYBER-SPOOF',
    name: 'Transmiter Anomali Spoofing GPS VTS',
    domain: 'SIBER',
    coordinates: '5.9210° S, 105.8120° E',
    mgrs: '48M XH 8910 4420',
    speed: 'Stasioner (Menara Pantai)',
    altitudeDepth: 'Antena 45 m AGL',
    bearing: 'Omnidirectional 360°',
    primarySensor: 'Spektrum Balmon & Cyber Mesh BSSN',
    confidence: 88.5,
    status: 'LOCKED'
  }
];

const ASSET_UNITS: AssetUnit[] = [
  {
    id: 'AST-01',
    name: 'Skadron Udara 11 (Sukhoi Su-30MK2)',
    unit: 'TNI AU - Lanud Sultan Hasanuddin',
    domain: 'TNI_AU',
    baseLocation: 'Makassar (Forward Deployment Natuna)',
    readiness: 'SIAGA 1',
    fuelPercentage: 94,
    payload: '4x R-77 BVRAAM + 2x Kh-31P Anti-Radar',
    etaMinutes: 6,
    operatorContact: 'KOLONEL PNB WIRAWAN (CALLSIGN: VIPER)'
  },
  {
    id: 'AST-02',
    name: 'Baterai Rudal Pertahanan Udara NASAMS-2',
    unit: 'Kopasgat / Arhanud TNI AU',
    domain: 'TNI_AU',
    baseLocation: 'Sektor Pertahanan Teluk Jakarta & Natuna',
    readiness: 'SIAGA 1',
    fuelPercentage: 100,
    payload: '6x AIM-120C-7 AMRAAM (Armed)',
    etaMinutes: 2,
    operatorContact: 'MAYOR TEK ARYA PRADANA (OP-KOPASGAT-27)'
  },
  {
    id: 'AST-03',
    name: 'KRI Bung Tomo-357 (Multi-Role Light Frigate)',
    unit: 'Koarmada I - Gugus Tempur Laut',
    domain: 'TNI_AL',
    baseLocation: 'Laut Natuna Utara (Patroli Sektor D-Alpha)',
    readiness: 'SIAGA 1',
    fuelPercentage: 86,
    payload: 'Meriam Oto Melara 76mm + Rudal Exocet MM40',
    etaMinutes: 14,
    operatorContact: 'LETKOL LAUT (P) HENDRA SETIAWAN'
  },
  {
    id: 'AST-04',
    name: 'KN Tanjung Datu-1101 (Kapal Patroli Samudera 110M)',
    unit: 'Badan Keamanan Laut (Bakamla RI)',
    domain: 'TNI_AL',
    baseLocation: 'Zona Maritim Barat / Selat Malaka',
    readiness: 'PATROLI',
    fuelPercentage: 82,
    payload: '2x Meriam 30mm + 2x RHIB Interceptor Cepat',
    etaMinutes: 20,
    operatorContact: 'KOLONEL BAKAMLA AGUS SURYADI'
  },
  {
    id: 'AST-05',
    name: 'Satgas Polhut Reaksi Cepat (SPORC Brigade Harimau)',
    unit: 'Ditjen Penegakan Hukum (Gakkum) KLHK',
    domain: 'KLHK_SPORC',
    baseLocation: 'Posko Wilayah I Riau & Jambi',
    readiness: 'SIAGA 1',
    fuelPercentage: 92,
    payload: 'Helikopter Water Bombing + Senjata Taktis Kehutanan',
    etaMinutes: 18,
    operatorContact: 'KOMANDAN SATGAS GAKKUM IR. BUDI PRASETYO'
  },
  {
    id: 'AST-06',
    name: 'Satuan Siber CSIRT Pertahanan & CSIRT Nasional',
    unit: 'Satcyber TNI & BSSN',
    domain: 'BSSN_CYBER',
    baseLocation: 'Pusat Operasi Siber Ragunan, Jakarta',
    readiness: 'SIAGA 1',
    fuelPercentage: 100,
    payload: 'Firewall Kuantum Kyber-1024 + RF Direction Finder',
    etaMinutes: 1,
    operatorContact: 'LETKOL CHB DR. RIANTO (BSSN RESPONSE TEAM)'
  }
];

const INITIAL_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'LOG-01',
    timestamp: '14:32:18.420 WIB',
    domain: 'UDARA',
    severity: 'CRITICAL',
    operator: 'GARUDA BRAIN AI',
    hash: 'SHA256: 0x9AF4B12C889E',
    message: 'THREAT 03: Vektor rudal balistik berkecepatan Mach 4.2+ dikonfirmasi oleh Satrad 213 dan radar SAR.'
  },
  {
    id: 'LOG-02',
    timestamp: '14:32:11.108 WIB',
    domain: 'SISTEM',
    severity: 'INFO',
    operator: 'OP-KOPASGAT-27',
    hash: 'KYBER1024: 0x44CE0188AB',
    message: 'Otorisasi intersep rudal balistik disiapkan. Protokol Human-in-the-Loop berstatus READY TO AUTHORIZE.'
  },
  {
    id: 'LOG-03',
    timestamp: '14:30:45.890 WIB',
    domain: 'MARITIM',
    severity: 'CRITICAL',
    operator: 'SENSOR FUSION MARITIM',
    hash: 'SHA256: 0x1B89AC044EE1',
    message: 'IUU FISHING: 4 Kapal Dark Vessel terdeteksi di WPPNRI 711. KRI Bung Tomo-357 menerima koordinat interdiksi.'
  },
  {
    id: 'LOG-04',
    timestamp: '14:28:12.330 WIB',
    domain: 'KEHUTANAN',
    severity: 'CRITICAL',
    operator: 'CANOPY SAR ENGINE',
    hash: 'SHA256: 0x9071BB834F10',
    message: 'ILLEGAL LOGGING: Kerusakan kanopi 84.6 Ha diverifikasi via delta koherensi SAR. Satgas SPORC KLHK disiagakan.'
  },
  {
    id: 'LOG-05',
    timestamp: '14:26:50.040 WIB',
    domain: 'SIBER',
    severity: 'WARN',
    operator: 'FIREWALL BSSN',
    hash: 'SHA256: 0x8F94A2D091BC',
    message: 'CYBER SPOOFING: Injeksi paket palsu GPS maritim pada Selat Sunda berhasil dinetralisir oleh isolasi segmen otomatis.'
  },
  {
    id: 'LOG-06',
    timestamp: '14:25:00.000 WIB',
    domain: 'SISTEM',
    severity: 'INFO',
    operator: 'SYSTEM HEALTH CHECK',
    hash: 'SHA256: 0x7729AA01FF45',
    message: 'Sinkronisasi 8 simpul sensor multi-domain tuntas. Latensi rata-rata: 14ms. Kedaulatan data aman.'
  }
];

export const AiDecisionPanelModal: React.FC<AiDecisionPanelModalProps> = ({
  isOpen,
  onClose,
  threat: incomingThreat,
  onExecuteAction,
  isAuthorized = false,
  initialTab = 'AI_PANEL'
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'AI_PANEL' | 'TRACKING_FEED' | 'SENSOR_NETWORK' | 'ASSET_STATUS' | 'SYSTEM_LOGS'>(initialTab);
  
  // Active threat selector (defaults to incomingThreat or first in catalog)
  const [selectedThreatId, setSelectedThreatId] = useState<string>(incomingThreat?.id || 'THREAT-03');
  const activeThreat: ThreatData = MULTI_DOMAIN_THREAT_CATALOG.find((t) => t.id === selectedThreatId) || incomingThreat || MULTI_DOMAIN_THREAT_CATALOG[0];

  const [authorizing, setAuthorizing] = useState(false);
  const [authorizedThreats, setAuthorizedThreats] = useState<string[]>(isAuthorized && incomingThreat ? [incomingThreat.id] : []);
  
  // Sensor Network Interactive State
  const [sensors, setSensors] = useState<SensorConfigItem[]>(INITIAL_SENSORS);
  const [fusionStrategy, setFusionStrategy] = useState<'FULL_MULTI_DOMAIN' | 'AIR_DEFENSE_PRIORITY' | 'MARITIME_EEZ_PRIORITY' | 'FORESTRY_CANOPY_PRIORITY'>('FULL_MULTI_DOMAIN');
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState<number>(75);
  const [crossDomainCorrelation, setCrossDomainCorrelation] = useState<boolean>(true);
  const [darkVesselAutoFlag, setDarkVesselAutoFlag] = useState<boolean>(true);
  const [bioacousticChainsawFilter, setBioacousticChainsawFilter] = useState<boolean>(true);
  const [sensorConfigNotice, setSensorConfigNotice] = useState<string | null>(null);

  // Tracking Feed Filter
  const [trackingFilter, setTrackingFilter] = useState<'SEMUA' | 'UDARA' | 'MARITIM_IUU' | 'LOGGING' | 'SIBER'>('SEMUA');
  const [lockedTargetId, setLockedTargetId] = useState<string>('TRK-01');

  // Asset Status Units
  const [assetUnits, setAssetUnits] = useState<AssetUnit[]>(ASSET_UNITS);
  const [assetDispatchNotice, setAssetDispatchNotice] = useState<string | null>(null);

  // System Logs
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [logDomainFilter, setLogDomainFilter] = useState<'SEMUA' | 'UDARA' | 'MARITIM' | 'KEHUTANAN' | 'SIBER'>('SEMUA');

  if (!isOpen) return null;

  const isCurrentThreatAuthorized = authorizedThreats.includes(activeThreat.id);

  const handleInterceptClick = () => {
    setAuthorizing(true);
    tacticalAudio.playCriticalAlert();
    setTimeout(() => {
      setAuthorizing(false);
      setAuthorizedThreats((prev) => [...prev, activeThreat.id]);
      tacticalAudio.playDispatchConfirm();
      onExecuteAction(activeThreat.id);
      
      // Inject new system log
      const newLog: SystemAuditLog = {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('id-ID') + ' WIB',
        domain: activeThreat.threatType.includes('MISSILE') || activeThreat.threatType.includes('AIRCRAFT') || activeThreat.threatType.includes('DRONE') ? 'UDARA' :
                activeThreat.threatType.includes('FISHING') ? 'MARITIM' :
                activeThreat.threatType.includes('LOGGING') ? 'KEHUTANAN' : 'SIBER',
        severity: 'CRITICAL',
        operator: 'OP-KOPASGAT-27 // KOMANDO',
        hash: 'SHA256: ' + Math.random().toString(16).substring(2, 10).toUpperCase(),
        message: `TINDAKAN OTORISASI DIEKSEKUSI: [${activeThreat.code} - ${activeThreat.title}]. Tindakan: ${activeThreat.recommendedActionText}. Komando Gabungan disiagakan.`
      };
      setAuditLogs((prev) => [newLog, ...prev]);
    }, 850);
  };

  // Toggle Sensor State
  const handleToggleSensor = (sensorId: string) => {
    tacticalAudio.playTacticalClick();
    setSensors((prev) =>
      prev.map((s) => (s.id === sensorId ? { ...s, enabled: !s.enabled, status: !s.enabled ? 'ONLINE' : 'STANDBY' } : s))
    );
  };

  // Change Sensor Sensitivity
  const handleChangeSensitivity = (sensorId: string, level: 'SEDANG' | 'TINGGI' | 'MAKSIMAL') => {
    tacticalAudio.playTacticalClick();
    setSensors((prev) =>
      prev.map((s) => (s.id === sensorId ? { ...s, sensitivity: level } : s))
    );
  };

  // Apply Sensor Configuration
  const handleApplySensorConfig = () => {
    tacticalAudio.playDispatchConfirm();
    setSensorConfigNotice(`KONFIGURASI JARINGAN SENSOR MULTI-DOMAIN BERHASIL DISINKRONISASI · ${sensors.filter(s => s.enabled).length} Sensor Aktif · Ambang AI: ${aiConfidenceThreshold}%`);
    setTimeout(() => setSensorConfigNotice(null), 4500);
  };

  // Toggle Asset Readiness
  const handleToggleAssetReadiness = (assetId: string) => {
    tacticalAudio.playTacticalClick();
    setAssetUnits((prev) =>
      prev.map((a) => {
        if (a.id === assetId) {
          const next = a.readiness === 'SIAGA 1' ? 'PATROLI' : a.readiness === 'PATROLI' ? 'SIAGA 1' : 'SIAGA 1';
          return { ...a, readiness: next };
        }
        return a;
      })
    );
  };

  // Dispatch Asset Simulation
  const handleSimulateAssetDispatch = (asset: AssetUnit) => {
    tacticalAudio.playCriticalAlert();
    setAssetDispatchNotice(`DISPOSISI INTERSEPSI DIKIRIM KE: ${asset.name} (${asset.operatorContact}) · ETA: ${asset.etaMinutes} Menit.`);
    setTimeout(() => setAssetDispatchNotice(null), 4000);
  };

  const filteredTargets = trackingFilter === 'SEMUA' 
    ? TRACKING_TARGETS 
    : TRACKING_TARGETS.filter(t => t.domain === trackingFilter);

  const filteredLogs = logDomainFilter === 'SEMUA'
    ? auditLogs
    : auditLogs.filter(l => l.domain === logDomainFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      {/* Outer Tactical Window container styled exactly like SmartSelect_20261029_205532_X_44432129.jpg */}
      <div className="relative w-full max-w-5xl bg-[#09111e] border border-[#1e3450] rounded-xl shadow-[0_0_60px_rgba(3,10,25,0.98)] overflow-hidden flex flex-col font-sans text-slate-200 my-auto">
        
        {/* Top classified banner */}
        <div className="px-5 py-3 border-b border-[#182a40] bg-[#060c16] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Winged Garuda Gold Eagle icon */}
            <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Crosshair className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-sm font-black tracking-wider text-white uppercase flex items-center gap-2 font-sans">
                GARUDA DOME SYSTEM
              </div>
              <div className="text-[10px] font-mono tracking-widest text-slate-400">
                INDONESIAN NATIONAL C4ISR &amp; AIR DEFENSE COMMAND
              </div>
            </div>
          </div>

          <div className="hidden sm:block text-center font-mono">
            <div className="text-[11px] font-bold text-slate-300 tracking-wider uppercase">
              KOMANDO PERTAHANAN KEPULAUAN &amp; MULTI-DOMAIN
            </div>
            <div className="text-[10px] text-slate-500 tracking-widest">
              CLASSIFIED // TARAF RAHASIA NASIONAL
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SYSTEM SECURE</span>
            </div>
            <button
              onClick={() => {
                tacticalAudio.playTacticalClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Tutup Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-Tabs Bar: AI DECISION PANEL | TRACKING FEED | (o) SENSOR NETWORK | ASSET STATUS | SYSTEM LOGS */}
        <div className="flex items-center border-b border-[#182a40] bg-[#08101d] px-3 sm:px-4 overflow-x-auto scrollbar-none font-mono text-xs">
          {[
            { id: 'AI_PANEL', label: 'AI DECISION PANEL', icon: <Crosshair className="w-3.5 h-3.5" /> },
            { id: 'TRACKING_FEED', label: 'TRACKING FEED', icon: <Activity className="w-3.5 h-3.5" /> },
            { id: 'SENSOR_NETWORK', label: '(o) SENSOR NETWORK', icon: <Radio className="w-3.5 h-3.5" /> },
            { id: 'ASSET_STATUS', label: 'ASSET STATUS', icon: <Rocket className="w-3.5 h-3.5" /> },
            { id: 'SYSTEM_LOGS', label: 'SYSTEM LOGS', icon: <Info className="w-3.5 h-3.5" /> },
          ].map((tab) => {
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setActiveSubTab(tab.id as any);
                }}
                className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-[#0d1a2d]'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0a1424]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.id === 'SENSOR_NETWORK' && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse ml-0.5" />
                )}
              </button>
            );
          })}
        </div>

        {/* SUB-TAB 1: AI DECISION PANEL (100% Faithful to SmartSelect_20261029_205532_X_44432129.jpg) */}
        {activeSubTab === 'AI_PANEL' && (
          <div>
            {/* Quick Multi-Domain Threat Switcher Bar */}
            <div className="px-6 py-2.5 bg-[#070e1a] border-b border-[#14263e] flex items-center justify-between gap-3 overflow-x-auto scrollbar-none text-xs font-mono">
              <span className="text-slate-400 font-bold shrink-0">PILIH TARGET ANCAMAN:</span>
              <div className="flex items-center gap-2">
                {MULTI_DOMAIN_THREAT_CATALOG.map((t) => {
                  const isSelected = t.id === activeThreat.id;
                  const isAuth = authorizedThreats.includes(t.id);
                  return (
                    <button
                      key={t.id}
                      onClick={() => {
                        tacticalAudio.playTacticalClick();
                        setSelectedThreatId(t.id);
                      }}
                      className={`px-3 py-1 rounded border text-[11px] font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                          : 'bg-[#0a1424] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${t.priorityLevel === 'KRITIS' ? 'bg-rose-500' : t.priorityLevel === 'TINGGI' ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                      <span>{t.code}</span>
                      {isAuth && <span className="text-emerald-400 text-[10px]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Main Panel Header & Timestamp */}
            <div className="px-6 py-3 bg-[#0a1322] border-b border-[#182a40] flex items-center justify-between font-mono text-xs text-slate-400">
              <div className="flex items-center gap-2 text-white font-bold text-sm tracking-wide">
                <span>AI DECISION PANEL // {activeThreat.code}: {activeThreat.title}</span>
                <span className="p-0.5 rounded-full border border-slate-600 text-slate-400 text-[10px] w-4 h-4 flex items-center justify-center">i</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <span className="text-cyan-400 font-bold">{activeThreat.time} WIB</span>
                <span className="text-slate-600">|</span>
                <span>25 MEI 2025</span>
              </div>
            </div>

            {/* 2-Column Grid Body matching SmartSelect_20261029_205532_X_44432129.jpg */}
            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#08101d]">
              {/* LEFT COLUMN: Threat Analysis & Key Indicators (7 Cols) */}
              <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
                {/* THREAT ANALYSIS BLOCK */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                      THREAT ANALYSIS
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400">
                      SEKTOR: {activeThreat.locationSector}
                    </span>
                  </div>
                  <div className="space-y-2.5 text-sm text-slate-200 leading-relaxed font-sans bg-[#0b1525]/60 p-4 rounded-lg border border-[#1b304a]/70">
                    {activeThreat.analysisText.map((p, i) => (
                      <p key={i} className="flex items-start gap-2">
                        <span className="text-cyan-400 mt-1">▸</span>
                        <span>{p}</span>
                      </p>
                    ))}
                  </div>
                </div>

                {/* KEY INDICATORS 4-GRID */}
                <div className="space-y-3 pt-4 border-t border-[#182a40]">
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
                    KEY INDICATORS
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                    {/* Kecepatan */}
                    <div className="p-2.5 rounded bg-[#0b1525] border border-[#1b304a] flex items-center gap-2.5">
                      <Crosshair className="w-5 h-5 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">KECEPATAN</span>
                        <strong className="text-white text-xs tracking-tight">{activeThreat.speed}</strong>
                      </div>
                    </div>

                    {/* Ketinggian */}
                    <div className="p-2.5 rounded bg-[#0b1525] border border-[#1b304a] flex items-center gap-2.5">
                      <Compass className="w-5 h-5 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">KETINGGIAN</span>
                        <strong className="text-white text-xs tracking-tight">{activeThreat.altitude}</strong>
                      </div>
                    </div>

                    {/* Trajektori */}
                    <div className="p-2.5 rounded bg-[#0b1525] border border-[#1b304a] flex items-center gap-2.5">
                      <Activity className="w-5 h-5 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">TRAJEKTORI</span>
                        <strong className="text-white text-xs tracking-tight">{activeThreat.trajectory}</strong>
                      </div>
                    </div>

                    {/* RCS Signature */}
                    <div className="p-2.5 rounded bg-[#0b1525] border border-[#1b304a] flex items-center gap-2.5">
                      <Radio className="w-5 h-5 text-slate-400 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-bold">RCS SIGNATURE</span>
                        <strong className="text-white text-xs tracking-tight">{activeThreat.rcsSignature}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Priority Level + Circular Radar + Recommended Action + Human in the loop (5 Cols) */}
              <div className="lg:col-span-5 space-y-5">
                {/* PRIORITY LEVEL & CIRCULAR RED RADAR DISPLAY */}
                <div className="p-4 rounded-lg bg-[#0b1525] border border-[#1b304a] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold tracking-wider text-slate-400 block uppercase mb-1">
                      PRIORITY LEVEL
                    </span>
                    <div className="text-2xl font-black text-rose-500 tracking-tight font-sans">
                      {activeThreat.priorityLevel}
                    </div>
                    <span className="text-xs font-mono text-slate-400">
                      (IMMEDIATE THREAT · {activeThreat.confidencePercent}%)
                    </span>
                  </div>

                  {/* Circular Red Radar HUD Screen */}
                  <div className="relative w-24 h-24 rounded-full border border-rose-900 bg-[#12070c] flex items-center justify-center overflow-hidden shrink-0 shadow-[0_0_15px_rgba(244,63,94,0.25)]">
                    {/* Concentric rings */}
                    <div className="absolute inset-2 rounded-full border border-rose-900/60" />
                    <div className="absolute inset-5 rounded-full border border-rose-900/60" />
                    <div className="absolute inset-8 rounded-full border border-rose-900/60" />
                    {/* Crosshairs */}
                    <div className="absolute inset-x-0 h-[1px] bg-rose-900/60" />
                    <div className="absolute inset-y-0 w-[1px] bg-rose-900/60" />
                    {/* Radar Sweep */}
                    <div className="absolute inset-0 animate-radar origin-center pointer-events-none">
                      <div 
                        className="w-1/2 h-1/2 origin-bottom-right"
                        style={{
                          background: 'conic-gradient(from 0deg, rgba(244, 63, 94, 0.5) 0deg, transparent 60deg)',
                        }}
                      />
                    </div>
                    {/* Center Threat Dot */}
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping absolute" />
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 z-10" />
                  </div>
                </div>

                {/* RECOMMENDED ACTION: BIG INTERCEPT BUTTON */}
                <div className="space-y-2">
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase block">
                    RECOMMENDED ACTION
                  </span>
                  <button
                    disabled={authorizing || isCurrentThreatAuthorized}
                    onClick={handleInterceptClick}
                    className={`w-full p-4 rounded-lg border transition-all flex items-center justify-center gap-4 cursor-pointer text-left ${
                      isCurrentThreatAuthorized
                        ? 'bg-emerald-950/40 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                        : 'bg-[#2a0b12] hover:bg-[#3b0f1a] border-[#8a1c2d] hover:border-rose-500 text-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
                    }`}
                  >
                    <div className="p-2 rounded bg-rose-950/80 border border-rose-800 text-rose-400 shrink-0">
                      {isCurrentThreatAuthorized ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <Rocket className="w-6 h-6" />}
                    </div>
                    <div className="flex-1">
                      <div className="text-xl font-black tracking-wider uppercase font-sans">
                        {isCurrentThreatAuthorized ? 'TINDAKAN TELAH DIOTORISASI' : authorizing ? 'MENGOTORISASI...' : activeThreat.recommendedActionText}
                      </div>
                      <div className="text-xs font-mono text-slate-300">
                        {isCurrentThreatAuthorized ? 'PERINTAH DISPOSISI UNIT TELAH DIKIRIM KE UNSUR TERKAIT' : 'OTORISASI KOMANDO DIBUTUHKAN'}
                      </div>
                    </div>
                  </button>
                </div>

                {/* HUMAN-IN-THE-LOOP STATUS BOX */}
                <div className="p-3.5 rounded-lg bg-[#0b1525] border border-[#1b304a] space-y-2 font-mono text-xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase block">
                    HUMAN-IN-THE-LOOP STATUS
                  </span>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <strong className="text-white text-xs block font-sans">OPERATOR ONLINE</strong>
                        <span className="text-[10px] text-slate-400">ID: OP-KOPASGAT-27</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">LEVEL: COMMAND</span>
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span>READY TO AUTHORIZE</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 2: TRACKING FEED (Multi-Domain Live Telemetry Stream) */}
        {activeSubTab === 'TRACKING_FEED' && (
          <div className="p-6 bg-[#08101d] space-y-5">
            {/* Filter Bar & Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#182a40] pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>MULTI-DOMAIN LIVE TRACKING FEED</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Aliran telemetri vektor sasaran real-time: Pertahanan Udara, Maritim IUU, Kehutanan SAR, dan Siber.
                </p>
              </div>

              {/* Domain Filter Pills */}
              <div className="flex items-center gap-1.5 bg-[#0a1424] p-1 rounded-lg border border-[#1b304a] text-xs font-mono">
                {(['SEMUA', 'UDARA', 'MARITIM_IUU', 'LOGGING', 'SIBER'] as const).map((dom) => (
                  <button
                    key={dom}
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      setTrackingFilter(dom);
                    }}
                    className={`px-3 py-1 rounded transition-all font-bold cursor-pointer ${
                      trackingFilter === dom
                        ? 'bg-cyan-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {dom.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Target Telemetry Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Target List (7 Cols) */}
              <div className="lg:col-span-7 space-y-3">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  SASARAN AKTIF DALAM JANGKAUAN SENSOR ({filteredTargets.length})
                </span>
                <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
                  {filteredTargets.map((tgt) => {
                    const isLocked = tgt.id === lockedTargetId;
                    return (
                      <div
                        key={tgt.id}
                        onClick={() => {
                          tacticalAudio.playRadarPing();
                          setLockedTargetId(tgt.id);
                        }}
                        className={`p-3.5 rounded-lg border transition-all cursor-pointer font-mono text-xs ${
                          isLocked
                            ? 'bg-[#0f2138] border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                            : 'bg-[#0a1424] border-[#182a40] hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                            <strong className="text-white font-bold">{tgt.code}: {tgt.name}</strong>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            tgt.domain === 'UDARA' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                            tgt.domain === 'MARITIM_IUU' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                            tgt.domain === 'LOGGING' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                            'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                          }`}>
                            {tgt.domain.replace('_', ' ')}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
                          <div>
                            <span className="text-[10px] text-slate-500 block">KOORDINAT (WGS84)</span>
                            <span className="text-slate-200">{tgt.coordinates}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">KECEPATAN / TINGGI</span>
                            <span className="text-amber-400 font-bold">{tgt.speed}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-500 block">AI CONFIDENCE</span>
                            <span className="text-cyan-400 font-bold">{tgt.confidence}%</span>
                          </div>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
                          <span>Sensor: <strong className="text-slate-300">{tgt.primarySensor}</strong></span>
                          <span className="text-emerald-400 font-bold">STATUS: {tgt.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Target Detailed Telemetry & Vector HUD (5 Cols) */}
              {(() => {
                const target = TRACKING_TARGETS.find(t => t.id === lockedTargetId) || TRACKING_TARGETS[0];
                return (
                  <div className="lg:col-span-5 bg-[#0a1424] border border-[#1b314d] rounded-lg p-4 space-y-4 font-mono text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                        <Crosshair className="w-4 h-4 text-cyan-400 animate-spin" />
                        <span>RADAR LOCK // TELEMETRI DETAIL</span>
                      </span>
                      <span className="text-[10px] text-slate-400">{target.code}</span>
                    </div>

                    <div className="space-y-2 text-[11px]">
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Nama Sasaran:</span>
                        <span className="text-white font-bold">{target.name}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Military Grid (MGRS):</span>
                        <span className="text-cyan-300">{target.mgrs}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Vector Heading / Bearing:</span>
                        <span className="text-amber-400 font-bold">{target.bearing}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Kecepatan Vektor:</span>
                        <span className="text-white">{target.speed}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Ketinggian / Posisi:</span>
                        <span className="text-white">{target.altitudeDepth}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">Sensitivitas Radar SNR:</span>
                        <span className="text-emerald-400 font-bold">+38.4 dB</span>
                      </div>
                    </div>

                    {/* Vector Trajectory Simulation Box */}
                    <div className="p-3 rounded bg-[#060c16] border border-cyan-900/60 space-y-2">
                      <span className="text-[10px] text-cyan-400 font-bold block uppercase">
                        PROYEKSI TRAJEKTORI 15 MENIT KE DEPAN
                      </span>
                      <div className="w-full h-16 bg-[#040810] border border-slate-800 rounded relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:12px_12px] opacity-25" />
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-cyan-400">
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                          <span>Titik Saat Ini</span>
                        </div>
                        <div className="h-[2px] w-24 bg-gradient-to-r from-cyan-400 via-rose-500 to-transparent" />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] text-rose-400 font-bold">
                          <Crosshair className="w-3.5 h-3.5" />
                          <span>Prediksi Intersepsi</span>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        AI memprediksi deviasi vektor &lt;2.1% dengan probabilitas netralisasi optimal pada menit ke-7 pasca peluncuran interseptor.
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          tacticalAudio.playDispatchConfirm();
                          setActiveSubTab('AI_PANEL');
                        }}
                        className="flex-1 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-center cursor-pointer transition-colors"
                      >
                        BUKA DI AI DECISION PANEL
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* SUB-TAB 3: (o) SENSOR NETWORK (Multi-Domain Mutual Configuration & Integration Matrix) */}
        {activeSubTab === 'SENSOR_NETWORK' && (
          <div className="p-6 bg-[#08101d] space-y-6">
            {/* Header & Synchronization Notice */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#182a40] pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                  <h3 className="text-base font-black text-white tracking-wide font-sans">
                    (o) MULTI-DOMAIN SENSOR NETWORK &amp; MESH CONFIGURATION
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Matriks konfigurasi &amp; fusi data lintas matra: Pertahanan Udara, IUU Fishing, Pembalakan Liar (SAR Coherence), Karhutla, dan Siber.
                </p>
              </div>

              {/* Master Apply Config Button */}
              <button
                onClick={handleApplySensorConfig}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-lg shadow-cyan-950/60 cursor-pointer"
              >
                <Sliders className="w-4 h-4" />
                <span>TERAPKAN KONFIGURASI JARINGAN</span>
              </button>
            </div>

            {/* Notification Banner when applied */}
            {sensorConfigNotice && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/40 text-emerald-400 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{sensorConfigNotice}</span>
              </div>
            )}

            {/* Top Control Ribbon: Fusion Preset & Sensitivity Slider */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-[#0a1424] border border-[#1b314d] rounded-lg p-4 font-mono text-xs">
              {/* Preset Selector (7 Cols) */}
              <div className="md:col-span-7 space-y-2">
                <span className="text-slate-400 font-bold block uppercase text-[11px]">
                  STRATEGI INTEGRASI FUSI SENSOR (MASTER FUSION STRATEGY):
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'FULL_MULTI_DOMAIN', label: 'FULL MULTI-DOMAIN MESH', desc: 'Seluruh 5 Domain Terintegrasi' },
                    { id: 'AIR_DEFENSE_PRIORITY', label: 'PRIORITAS PERT. UDARA', desc: 'Satrad & Radar Rudal Diutamakan' },
                    { id: 'MARITIME_EEZ_PRIORITY', label: 'PRIORITAS MARITIM & KKP', desc: 'AIS & IMSS Dark Vessel Diutamakan' },
                    { id: 'FORESTRY_CANOPY_PRIORITY', label: 'PRIORITAS HUTAN KLHK', desc: 'SAR Coherence & Biofonik Tropis' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        tacticalAudio.playTacticalClick();
                        setFusionStrategy(preset.id as any);
                      }}
                      className={`p-2 rounded border text-left transition-all cursor-pointer ${
                        fusionStrategy === preset.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-sm'
                          : 'bg-[#080f1c] border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <strong className="block text-xs">{preset.label}</strong>
                      <span className="text-[10px] text-slate-500">{preset.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Confidence Threshold Slider & Toggles (5 Cols) */}
              <div className="md:col-span-5 space-y-3 md:border-l md:border-slate-800 md:pl-4">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400 font-bold">AMBANG CONFIDENCE AI:</span>
                    <strong className="text-cyan-400">{aiConfidenceThreshold}%</strong>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={95}
                    value={aiConfidenceThreshold}
                    onChange={(e) => setAiConfidenceThreshold(Number(e.target.value))}
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                    <span>50% (Sensitif/Semua Anomali)</span>
                    <span>95% (Hanya Kritis Tinggi)</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-800 text-[11px]">
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300">Korelasi Lintas-Domain Otomatis:</span>
                    <input
                      type="checkbox"
                      checked={crossDomainCorrelation}
                      onChange={() => setCrossDomainCorrelation(!crossDomainCorrelation)}
                      className="accent-cyan-500 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300">Filter Dark Vessel Tanpa AIS:</span>
                    <input
                      type="checkbox"
                      checked={darkVesselAutoFlag}
                      onChange={() => setDarkVesselAutoFlag(!darkVesselAutoFlag)}
                      className="accent-cyan-500 cursor-pointer"
                    />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <span className="text-slate-300">Spektrum Biofonik Chainsaw Hutan:</span>
                    <input
                      type="checkbox"
                      checked={bioacousticChainsawFilter}
                      onChange={() => setBioacousticChainsawFilter(!bioacousticChainsawFilter)}
                      className="accent-cyan-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Individual Sensor Mesh Grid (8 Active Sensors with Toggle & Sensitivity) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  JARINGAN SENSOR FISIK &amp; SATELIT TERINTEGRASI ({sensors.filter(s => s.enabled).length}/{sensors.length} AKTIF)
                </span>
                <span className="text-xs font-mono text-emerald-400">
                  LATENSI RATA-RATA: 14.2 MS · THROUGHPUT: 1.149 MB/S
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {sensors.map((sensor) => (
                  <div
                    key={sensor.id}
                    className={`p-4 rounded-lg border font-mono text-xs transition-all ${
                      sensor.enabled
                        ? 'bg-[#0a1424] border-[#1b314d]'
                        : 'bg-[#060b13] border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${sensor.enabled ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`} />
                          <strong className="text-white text-xs font-sans">{sensor.name}</strong>
                        </div>
                        <div className="text-[11px] text-cyan-400 mt-0.5">
                          Instansi: <span className="text-slate-300">{sensor.agency}</span> · Band: <span className="text-slate-300">{sensor.frequencyBand}</span>
                        </div>
                      </div>

                      {/* Enable/Disable Toggle */}
                      <button
                        onClick={() => handleToggleSensor(sensor.id)}
                        className={`px-3 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                          sensor.enabled
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700 hover:text-white'
                        }`}
                      >
                        {sensor.enabled ? 'ONLINE' : 'STANDBY'}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans mb-3">
                      {sensor.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[10px]">
                      <div className="flex items-center gap-3 text-slate-400">
                        <span>Ping: <strong className="text-slate-200">{sensor.latencyMs}ms</strong></span>
                        <span>Laju: <strong className="text-slate-200">{sensor.packetRate} pkt/s</strong></span>
                      </div>

                      {/* Sensitivity selector */}
                      <div className="flex items-center gap-1">
                        <span className="text-slate-500">Sensitivitas:</span>
                        {(['SEDANG', 'TINGGI', 'MAKSIMAL'] as const).map((lvl) => (
                          <button
                            key={lvl}
                            disabled={!sensor.enabled}
                            onClick={() => handleChangeSensitivity(sensor.id, lvl)}
                            className={`px-1.5 py-0.5 rounded text-[9px] font-bold transition-colors cursor-pointer ${
                              sensor.sensitivity === lvl && sensor.enabled
                                ? 'bg-cyan-500 text-slate-950'
                                : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB 4: ASSET STATUS (Readiness & Deployment Across Domains) */}
        {activeSubTab === 'ASSET_STATUS' && (
          <div className="p-6 bg-[#08101d] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#182a40] pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-cyan-400" />
                  <span>KESIAPAN ALUTSISTA &amp; SATGAS MULTI-DOMAIN</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Status kesiapan tempur &amp; penegakan hukum: TNI AU, TNI AL, Bakamla, Satgas Gakkum KLHK, dan Satcyber BSSN.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                  KOPASGAT-27 OTORISASI: READY
                </span>
              </div>
            </div>

            {/* Notification Banner when dispatched */}
            {assetDispatchNotice && (
              <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
                <Zap className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{assetDispatchNotice}</span>
              </div>
            )}

            {/* Asset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {assetUnits.map((asset) => (
                <div
                  key={asset.id}
                  className="p-4 rounded-lg bg-[#0a1424] border border-[#1b314d] font-mono text-xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <strong className="text-white text-xs block font-sans">{asset.name}</strong>
                      <span className="text-[11px] text-cyan-400">{asset.unit}</span>
                    </div>

                    <button
                      onClick={() => handleToggleAssetReadiness(asset.id)}
                      className={`px-2.5 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        asset.readiness === 'SIAGA 1'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}
                    >
                      {asset.readiness}
                    </button>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pangkalan / Posko:</span>
                      <span className="text-slate-200">{asset.baseLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Kesiapan Amunisi/BBM:</span>
                      <span className="text-amber-400 font-bold">{asset.fuelPercentage}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Muatan / Payload:</span>
                      <span className="text-white text-right max-w-[200px] truncate">{asset.payload}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Perwira Komando:</span>
                      <span className="text-slate-300 text-right">{asset.operatorContact}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      ETA ke Zona Sasaran: <strong className="text-rose-400 font-bold">{asset.etaMinutes} Menit</strong>
                    </span>

                    <button
                      onClick={() => handleSimulateAssetDispatch(asset)}
                      className="px-3 py-1.5 rounded bg-rose-600 hover:bg-rose-500 text-white font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <Rocket className="w-3.5 h-3.5" />
                      <span>DISPOSISI INTERSEPSI</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUB-TAB 5: SYSTEM LOGS (Live Tamper-Proof Audit Trail) */}
        {activeSubTab === 'SYSTEM_LOGS' && (
          <div className="p-6 bg-[#08101d] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#182a40] pb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  <span>AUDIT LOG RESMI // INTEGRITAS KRIPTOGRAFI C4ISR</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Rekaman kronologis aksi AI, deteksi sensor multi-domain, dan persetujuan komando militer.
                </p>
              </div>

              {/* Filter Domain */}
              <div className="flex items-center gap-1 bg-[#0a1424] p-1 rounded-lg border border-[#1b304a] text-xs font-mono">
                {(['SEMUA', 'UDARA', 'MARITIM', 'KEHUTANAN', 'SIBER'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      setLogDomainFilter(d);
                    }}
                    className={`px-2.5 py-1 rounded font-bold cursor-pointer transition-all ${
                      logDomainFilter === d
                        ? 'bg-cyan-500 text-slate-950'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Log Stream List */}
            <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1 font-mono text-xs">
              {filteredLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-[#0a1424] border border-[#182a40] space-y-1.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                    <div className="flex items-center gap-2">
                      <span className="text-cyan-400 font-bold">{log.timestamp}</span>
                      <span className={`px-1.5 py-0.5 rounded font-bold ${
                        log.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' :
                        log.severity === 'WARN' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                        'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      }`}>
                        [{log.severity}]
                      </span>
                      <span className="text-slate-400 font-semibold">{log.domain}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-500">
                      <span>Operator: <strong className="text-slate-300">{log.operator}</strong></span>
                      <span className="text-slate-600">·</span>
                      <span className="text-slate-400">{log.hash}</span>
                    </div>
                  </div>

                  <p className="text-slate-200 text-xs leading-relaxed">
                    {log.message}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-800 font-mono text-xs">
              <span className="text-slate-500">
                Log Tersertifikasi TSCM // Enkripsi SHA-256 + Kyber-1024
              </span>
              <button
                onClick={() => {
                  tacticalAudio.playDispatchConfirm();
                  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
                  const downloadAnchor = document.createElement('a');
                  downloadAnchor.setAttribute("href", dataStr);
                  downloadAnchor.setAttribute("download", `GDS_AUDIT_LOG_${Date.now()}.json`);
                  document.body.appendChild(downloadAnchor);
                  downloadAnchor.click();
                  downloadAnchor.remove();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>EKSPOR AUDIT LOG (.JSON)</span>
              </button>
            </div>
          </div>
        )}

        {/* Modal Bottom Footer matching SmartSelect_20261029_205532_X_44432129.jpg */}
        <div className="px-6 py-3 bg-[#060c16] border-t border-[#182a40] flex items-center justify-between text-xs font-mono text-slate-400">
          <div>
            <strong className="text-slate-300">GARUDA DOME v3.2.1</strong>
            <span className="text-slate-600 mx-2">|</span>
            <span>MULTI-DOMAIN NATIONAL DEFENSE &amp; RESILIENCE NETWORK</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>ENCRYPTION: AES-256 / TSCM COMPLIANT</span>
            <Lock className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
