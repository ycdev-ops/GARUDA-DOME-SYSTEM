export type DomainType = 
  | 'illegal_fishing'
  | 'illegal_logging'
  | 'air_defense'
  | 'karhutla'
  | 'disaster'
  | 'cyber_defense'
  | 'narcotics_border'
  | 'resource_mining';

export type ThreatLevel = 'CRITICAL' | 'HIGH' | 'ELEVATED' | 'GUARDED' | 'LOW';

export type IncidentStatus = 'DETECTED' | 'VERIFYING' | 'DISPATCHED' | 'INTERCEPTING' | 'CONTAINED' | 'RESOLVED';

export interface PrescriptiveAction {
  sopCode: string;
  recommendedAsset: string;
  operatingUnit: string;
  leadAgency: string;
  supportingAgencies: string[];
  etaMinutes: number;
  actionPlan: string;
  legalBasis: string;
}

export interface Incident {
  id: string;
  code: string;
  title: string;
  domain: DomainType;
  threatLevel: ThreatLevel;
  status: IncidentStatus;
  timestamp: string;
  coordinates: [number, number]; // [lat, lng]
  locationName: string;
  region: 'WIB' | 'WITA' | 'WIT';
  description: string;
  sensorsInvolved: string[];
  confidenceScore: number; // e.g. 97.4%
  affectedAgency: string[];
  estimatedLossIDR?: string; // Kerugian negara yang dicegah/terjadi
  
  // Spesifik Domain Attributes
  maritimeDetails?: {
    vesselType: string;
    flagState: string;
    isDarkVessel: boolean; // AIS turned off
    speedKnots: number;
    headingDeg: number;
    estimatedTonnageGT: number;
    anomalyType: 'Transshipment Ilegal' | 'Penangkapan Ikan Tanpa Izin' | 'Pelanggaran ZEE' | 'Pukat Harimau Terlarang';
  };

  loggingDetails?: {
    deforestedHa: number;
    canopyLossRate: string;
    detectionMethod: 'Sentinel-1 SAR Radar' | 'Drone PUNA Male' | 'Acoustic Mesh TN' | 'Thermal Hotspot';
    targetSpecies: string;
    heavyMachineryDetected: boolean;
    protectedAreaType: 'Taman Nasional' | 'Hutan Lindung' | 'Cagar Alam' | 'Lahan Gambut Kubah';
  };

  correlationLinks: string[]; // IDs of related incidents
  prescriptiveAction: PrescriptiveAction;
}

export interface EdgeNode {
  id: string;
  name: string;
  code: string;
  location: string;
  coordinates: [number, number];
  status: 'NOMINAL' | 'DEGRADED' | 'STANDALONE';
  role: string;
  coverageRadiusKm: number;
  localLatencyMs: number;
  meshUplink: 'SATELIT_LEO' | 'FIBER_OPTIK' | 'HF_TACTICAL_RADIO' | 'TROPOSCATTER';
  aiModelVersion: string;
  activeSensors: number;
}

export interface CrossDomainCorrelation {
  id: string;
  title: string;
  primaryDomain: DomainType;
  secondaryDomain: DomainType;
  incidentIds: string[];
  confidence: number;
  narrative: string;
  compoundRisk: 'KRITIS' | 'TINGGI' | 'SEDANG';
  synergisticIntervention: string;
}

export interface SimulationScenario {
  id: string;
  title: string;
  codename: string;
  category: string;
  threatLevel: ThreatLevel;
  brief: string;
  incidentIds: string[];
  keyInsight: string;
}
