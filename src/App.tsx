import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ArchipelagoTacticalMap } from './components/ArchipelagoTacticalMap';
import { IndonesiaTheaterMapLive } from './components/IndonesiaTheaterMapLive';
import { IllegalFishingView } from './components/IllegalFishingView';
import { IllegalLoggingView } from './components/IllegalLoggingView';
import { GarudaBrainView } from './components/GarudaBrainView';
import { NationalResourceHealthView } from './components/NationalResourceHealthView';
import { GodsEyeSyncConsole } from './components/GodsEyeSyncConsole';
import { ProposalViewer } from './components/ProposalViewer';
import { PitchDeckViewer } from './components/PitchDeckViewer';
import { VideoScriptViewer } from './components/VideoScriptViewer';
import { IncidentDetailModal } from './components/IncidentDetailModal';
import { ScenarioSimulatorModal } from './components/ScenarioSimulatorModal';
import { 
  INITIAL_INCIDENTS, 
  EDGE_NODES, 
  CROSS_DOMAIN_CORRELATIONS,
  SIMULATION_SCENARIOS 
} from './data/gdsData';
import { Incident, DomainType, SimulationScenario } from './types/gds';
import { 
  FileText, 
  Tv, 
  Film, 
  AlertTriangle, 
  CheckCircle2, 
  Shield, 
  Zap,
  RotateCcw,
  Radio
} from 'lucide-react';
import { tacticalAudio } from './utils/audioTactical';
import { CyberWarfare3DScene } from './components/CyberWarfare3DScene';
import { CyberWarfareControlCenter } from './components/CyberWarfareControlCenter';
import { RealizationProgressHUD, OperationRealizationData } from './components/RealizationProgressHUD';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('tactical_map');
  const [docsSubTab, setDocsSubTab] = useState<'PROPOSAL' | 'PITCH_DECK' | 'VIDEO_SCRIPT'>('PROPOSAL');
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);
  const [activeScenario, setActiveScenario] = useState<SimulationScenario | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [theaterMode, setTheaterMode] = useState<'THEATER_C4ISR' | 'MULTI_DOMAIN_GRID'>('THEATER_C4ISR');
  const [showPosterBriefing, setShowPosterBriefing] = useState(false);

  // Global Realization HUD State
  const [globalRealizationOp, setGlobalRealizationOp] = useState<OperationRealizationData | null>(null);
  const [isGlobalRealizationOpen, setIsGlobalRealizationOpen] = useState(false);

  // Filters for tactical map
  const [activeDomainFilter, setActiveDomainFilter] = useState<DomainType | 'ALL'>('ALL');
  const [activeRegionFilter, setActiveRegionFilter] = useState<'ALL' | 'WIB' | 'WITA' | 'WIT'>('ALL');

  // Handle Dispatch of an Incident
  const handleDispatchIncident = (incidentId: string) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return { ...inc, status: 'DISPATCHED' as const };
        }
        return inc;
      })
    );
    if (selectedIncident && selectedIncident.id === incidentId) {
      setSelectedIncident((prev) => prev ? { ...prev, status: 'DISPATCHED' as const } : null);
    }
  };

  // Handle Scenario Selection
  const handleSelectScenario = (scenario: SimulationScenario) => {
    setActiveScenario(scenario);
    setActiveTab('tactical_map');
    // Highlight first incident of scenario
    const firstInc = incidents.find((i) => scenario.incidentIds.includes(i.id));
    if (firstInc) {
      setSelectedIncident(firstInc);
    }
  };

  const handleResetScenario = () => {
    tacticalAudio.playTacticalClick();
    setActiveScenario(null);
    setIncidents(INITIAL_INCIDENTS);
    setActiveDomainFilter('ALL');
  };

  const criticalCount = incidents.filter((i) => i.threatLevel === 'CRITICAL').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSimulation={() => setIsSimulationOpen(true)}
        isAudioMuted={isAudioMuted}
        setIsAudioMuted={setIsAudioMuted}
        incidentCount={incidents.length}
        criticalCount={criticalCount}
      />

      {/* Active Drill Scenario Alert Strip */}
      {activeScenario && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="text-amber-400 font-bold">LATIHAN SKENARIO AKTIF: {activeScenario.codename}</span>
            <span className="text-slate-400 hidden sm:inline">· {activeScenario.title}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden md:inline">
              Sasaran Terkait: {activeScenario.incidentIds.join(', ')}
            </span>
            <button
              onClick={handleResetScenario}
              className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-900 border border-slate-700 px-2.5 py-1 rounded transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Kembalikan Status Normal</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* VIEW 1: Tactical Map & Common Operating Picture */}
        {activeTab === 'tactical_map' && (
          <div className="space-y-4">
            {/* View Mode Switcher Strip */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#070f1c] border border-[#14263e] p-2.5 rounded-lg text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 mr-1 font-bold">MODE TAMPILAN PETA:</span>
                <button
                  onClick={() => {
                    tacticalAudio.playTacticalClick();
                    setTheaterMode('THEATER_C4ISR');
                  }}
                  className={`px-3 py-1.5 rounded transition-all font-bold ${
                    theaterMode === 'THEATER_C4ISR'
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  INDONESIA THEATER MAP (100% C4ISR LIVE)
                </button>
                <button
                  onClick={() => {
                    tacticalAudio.playTacticalClick();
                    setTheaterMode('MULTI_DOMAIN_GRID');
                  }}
                  className={`px-3 py-1.5 rounded transition-all font-bold ${
                    theaterMode === 'MULTI_DOMAIN_GRID'
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  PETA MULTI-SEKTOR KEPULAUAN
                </button>
              </div>

              {/* Poster Briefing Modal Trigger */}
              <button
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setShowPosterBriefing(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 font-bold transition-colors cursor-pointer"
              >
                <span>Perisai Cerdas Nusantara (Official Poster)</span>
              </button>
            </div>

            {/* Render 100% Exact Live Theater Map */}
            {theaterMode === 'THEATER_C4ISR' ? (
              <IndonesiaTheaterMapLive />
            ) : (
              <ArchipelagoTacticalMap
                incidents={incidents}
                edgeNodes={EDGE_NODES}
                selectedIncident={selectedIncident}
                onSelectIncident={(inc) => setSelectedIncident(inc)}
                activeDomainFilter={activeDomainFilter}
                setActiveDomainFilter={setActiveDomainFilter}
                activeRegionFilter={activeRegionFilter}
                setActiveRegionFilter={setActiveRegionFilter}
              />
            )}
          </div>
        )}

        {/* VIEW: Cyber & 3D Warfare Command Center (Pusat Siber & 3D) */}
        {activeTab === 'cyber_command' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#070f1c] border border-[#14263e] p-3 rounded-lg text-xs font-mono">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-white font-bold">PUSAT PERTAHANAN SIBER, SPEKTRUM ELEKTRONIKA &amp; HOLOGRAFI 3D</span>
              </div>
              <span className="text-slate-400">
                KONSENSUS: BSSN · TNI AU KOPASGAT · BALMON KOMINFO
              </span>
            </div>

            {/* 3D Holographic Cyber Theater Scene (Three.js) */}
            <CyberWarfare3DScene
              onRequestExecution={(targetId) => {
                tacticalAudio.playCriticalAlert();
                setGlobalRealizationOp({
                  id: `OP-3D-${targetId}-${Date.now()}`,
                  codename: 'INTERDIKSI HOLOGRAFIK 3D',
                  title: `EKSEKUSI TARGET 3D: ${targetId}`,
                  domain: 'CYBER_DEFENSE',
                  targetLocation: 'Sektor Teater Pertahanan Nasional',
                  mgrs: '48N WG 4291 8812',
                  operatorId: 'OP-KOPASGAT-27 (Mayor Tek Arya)',
                  authorizedAt: new Date().toLocaleTimeString('id-ID'),
                  assignedUnits: ['Skadron Interseptor KOPASGAT', 'Satsiber TNI', 'Balmon RF Kominfo'],
                  stages: [
                    { title: 'OTORISASI KOMANDO 3D & VALIDASI PQC', description: 'Kunci enkripsi Dilithium-5 terekam.', durationSec: 8, agency: 'MABES TNI' },
                    { title: 'PENGARAHAN BEAM GELOMBANG MIKRO / SIBER', description: 'Pancaran frekuensi terarah ke target 3D.', durationSec: 15, agency: 'PEBNIKA' },
                    { title: 'PENETRALISIRAN SEKTOR LENGKAP', description: 'Sasaran tereliminasi dari matriks ancaman.', durationSec: 14, agency: 'KOMANDO' }
                  ]
                });
                setIsGlobalRealizationOpen(true);
              }}
            />

            {/* Multi-Domain Cyber Warfare Control Center (Mitigasi, Exploit, Attact with live monitors) */}
            <CyberWarfareControlCenter
              onTriggerOperation={(op) => {
                setGlobalRealizationOp(op);
                setIsGlobalRealizationOpen(true);
              }}
            />
          </div>
        )}

        {/* VIEW 2: IUU Fishing & Dark Vessel Maritime Domain */}
        {activeTab === 'illegal_fishing' && (
          <IllegalFishingView
            incidents={incidents}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
          />
        )}

        {/* VIEW 3: Illegal Logging & Canopy Integrity */}
        {activeTab === 'illegal_logging' && (
          <IllegalLoggingView
            incidents={incidents}
            onSelectIncident={(inc) => setSelectedIncident(inc)}
          />
        )}

        {/* VIEW 4: God's Eye C4ISR Multi-Feed Synchronization Console */}
        {activeTab === 'godseye_sync' && (
          <GodsEyeSyncConsole />
        )}

        {/* VIEW 5: National Resource Health & Critical Infrastructure */}
        {activeTab === 'resource_health' && (
          <NationalResourceHealthView />
        )}

        {/* VIEW 6: Garuda Brain AI & Archipelagic Edge Nodes */}
        {activeTab === 'garuda_brain' && (
          <GarudaBrainView
            edgeNodes={EDGE_NODES}
            correlations={CROSS_DOMAIN_CORRELATIONS}
          />
        )}

        {/* VIEW 5: Deliverables Hub (Proposal, Pitch Deck, Video Script) */}
        {activeTab === 'docs_hub' && (
          <div className="space-y-6">
            {/* Sub-Tabs Selector */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono w-fit">
              <button
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setDocsSubTab('PROPOSAL');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded transition-colors ${
                  docsSubTab === 'PROPOSAL'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Proposal Final Lengkap</span>
              </button>

              <button
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setDocsSubTab('PITCH_DECK');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded transition-colors ${
                  docsSubTab === 'PITCH_DECK'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span>15 Slide Pitch Deck</span>
              </button>

              <button
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setDocsSubTab('VIDEO_SCRIPT');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded transition-colors ${
                  docsSubTab === 'VIDEO_SCRIPT'
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" />
                <span>Script Video Demo (3-4 Menit)</span>
              </button>
            </div>

            {/* Sub View Content */}
            {docsSubTab === 'PROPOSAL' && <ProposalViewer />}
            {docsSubTab === 'PITCH_DECK' && <PitchDeckViewer />}
            {docsSubTab === 'VIDEO_SCRIPT' && <VideoScriptViewer />}
          </div>
        )}
      </main>

      {/* Tactical Incident Detail Modal */}
      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onDispatch={handleDispatchIncident}
      />

      {/* Scenario Simulator Modal */}
      <ScenarioSimulatorModal
        isOpen={isSimulationOpen}
        onClose={() => setIsSimulationOpen(false)}
        onSelectScenario={handleSelectScenario}
        activeScenarioId={activeScenario?.id}
      />

      {/* Official Garuda Dome Poster Briefing Modal */}
      {showPosterBriefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#09111e] border border-amber-500/40 rounded-xl overflow-hidden shadow-2xl p-2 flex flex-col">
            <div className="p-3 flex items-center justify-between border-b border-slate-800 text-xs font-mono">
              <span className="text-amber-400 font-bold uppercase tracking-wider">
                DOKTRIN PERISAI CERDAS NUSANTARA // OFFICIAL BRIEFING EMBLEM
              </span>
              <button
                onClick={() => setShowPosterBriefing(false)}
                className="p-1.5 px-3 rounded bg-slate-800 text-slate-300 hover:text-white text-xs cursor-pointer"
              >
                Tutup
              </button>
            </div>
            <div className="p-2 flex items-center justify-center bg-slate-950 rounded-b-lg">
              <img
                src="/assets/aistudio/SmartSelect_20261029_205506_X_74eaa168.jpg"
                alt="Garuda Dome System - Perisai Cerdas Nusantara"
                className="w-full h-auto max-h-[75vh] object-contain rounded shadow-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Global Mission Execution Realization Progress HUD */}
      <RealizationProgressHUD
        operation={globalRealizationOp}
        isOpen={isGlobalRealizationOpen}
        onClose={() => setIsGlobalRealizationOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 lg:px-8 mt-auto text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500/70" />
            <span className="text-slate-400">GARUDA DOME SYSTEM (GDS) v3 · PLATFORM KETAHANAN NASIONAL</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500">
            <span>MABES TNI</span>
            <span aria-hidden="true">·</span>
            <span>KLHK</span>
            <span aria-hidden="true">·</span>
            <span>KKP</span>
            <span aria-hidden="true">·</span>
            <span>BAKAMLA</span>
            <span aria-hidden="true">·</span>
            <span>BSSN</span>
            <span aria-hidden="true">·</span>
            <span>BNPB</span>
            <span aria-hidden="true">·</span>
            <span>BNN</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
