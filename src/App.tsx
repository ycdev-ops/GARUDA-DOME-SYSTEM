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
  SIMULATION_SCENARIOS,
} from './data/gdsData';
import { Incident, DomainType, SimulationScenario } from './types/gds';
import {
  FileText,
  Tv,
  Film,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { tacticalAudio } from './utils/audioTactical';
import { CyberWarfareControlCenter } from './components/CyberWarfareControlCenter';

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

  const [activeDomainFilter, setActiveDomainFilter] = useState<DomainType | 'ALL'>('ALL');
  const [activeRegionFilter, setActiveRegionFilter] = useState<'ALL' | 'WIB' | 'WITA' | 'WIT'>('ALL');

  const handleDispatchIncident = (incidentId: string) => {
    setIncidents((prev) => prev.map((inc) => inc.id === incidentId ? { ...inc, status: 'DISPATCHED' as const } : inc));
    if (selectedIncident?.id === incidentId) {
      setSelectedIncident((prev) => prev ? { ...prev, status: 'DISPATCHED' as const } : null);
    }
  };

  const handleSelectScenario = (scenario: SimulationScenario) => {
    setActiveScenario(scenario);
    setActiveTab('tactical_map');
    const firstInc = incidents.find((incident) => scenario.incidentIds.includes(incident.id));
    if (firstInc) setSelectedIncident(firstInc);
  };

  const handleResetScenario = () => {
    tacticalAudio.playTacticalClick();
    setActiveScenario(null);
    setIncidents(INITIAL_INCIDENTS);
    setActiveDomainFilter('ALL');
  };

  const criticalCount = incidents.filter((incident) => incident.threatLevel === 'CRITICAL').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSimulation={() => setIsSimulationOpen(true)}
        isAudioMuted={isAudioMuted}
        setIsAudioMuted={setIsAudioMuted}
        incidentCount={incidents.length}
        criticalCount={criticalCount}
      />

      {activeScenario && (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping shrink-0" />
            <span className="text-amber-400 font-bold">LATIHAN SKENARIO AKTIF: {activeScenario.codename}</span>
            <span className="text-slate-400 hidden sm:inline">· {activeScenario.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400 hidden md:inline">Sasaran Terkait: {activeScenario.incidentIds.join(', ')}</span>
            <button onClick={handleResetScenario} className="flex items-center gap-1 text-slate-300 hover:text-white bg-slate-900 border border-slate-700 px-2.5 py-1 rounded transition-colors">
              <RotateCcw className="w-3 h-3" /><span>Kembalikan Status Normal</span>
            </button>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {activeTab === 'tactical_map' && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-[#070f1c] border border-[#14263e] p-2.5 rounded-lg text-xs font-mono">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 mr-1 font-bold">MODE TAMPILAN PETA:</span>
                <button onClick={() => { tacticalAudio.playTacticalClick(); setTheaterMode('THEATER_C4ISR'); }} className={`px-3 py-1.5 rounded transition-all font-bold ${theaterMode === 'THEATER_C4ISR' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'}`}>
                  INDONESIA THEATER MAP (100% C4ISR LIVE)
                </button>
                <button onClick={() => { tacticalAudio.playTacticalClick(); setTheaterMode('MULTI_DOMAIN_GRID'); }} className={`px-3 py-1.5 rounded transition-all font-bold ${theaterMode === 'MULTI_DOMAIN_GRID' ? 'bg-amber-400 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'}`}>
                  PETA MULTI-SEKTOR KEPULAUAN
                </button>
              </div>
              <button onClick={() => { tacticalAudio.playTacticalClick(); setShowPosterBriefing(true); }} className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 font-bold transition-colors cursor-pointer">
                <span>Perisai Cerdas Nusantara (Official Poster)</span>
              </button>
            </div>
            {theaterMode === 'THEATER_C4ISR' ? <IndonesiaTheaterMapLive /> : <ArchipelagoTacticalMap incidents={incidents} edgeNodes={EDGE_NODES} selectedIncident={selectedIncident} onSelectIncident={setSelectedIncident} activeDomainFilter={activeDomainFilter} setActiveDomainFilter={setActiveDomainFilter} activeRegionFilter={activeRegionFilter} setActiveRegionFilter={setActiveRegionFilter} />}
          </div>
        )}

        {activeTab === 'cyber_command' && (
          <div className="space-y-4">
            <div className="rounded-xl border border-cyan-400/20 bg-[#07111e] p-4 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-white font-bold"><Shield className="h-4 w-4 text-cyan-300" />GARUDA CYBER COMMAND · LATIHAN KETAHANAN SIBER</div>
                <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 font-mono text-[9px] text-amber-100">SIMULASI FRONTEND · DATA SINTETIS</span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-400">Konsol regional ini berjalan sepenuhnya di browser dengan data contoh. Tidak terhubung ke perangkat, sensor, jaringan, atau sistem komando nyata.</p>
            </div>
            <CyberWarfareControlCenter />
          </div>
        )}

        {activeTab === 'illegal_fishing' && <IllegalFishingView incidents={incidents} onSelectIncident={setSelectedIncident} />}
        {activeTab === 'illegal_logging' && <IllegalLoggingView incidents={incidents} onSelectIncident={setSelectedIncident} />}
        {activeTab === 'godseye_sync' && <GodsEyeSyncConsole />}
        {activeTab === 'resource_health' && <NationalResourceHealthView />}
        {activeTab === 'garuda_brain' && <GarudaBrainView edgeNodes={EDGE_NODES} correlations={CROSS_DOMAIN_CORRELATIONS} />}

        {activeTab === 'docs_hub' && (
          <div className="space-y-6">
            <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800 text-xs font-mono w-fit">
              <button onClick={() => { tacticalAudio.playTacticalClick(); setDocsSubTab('PROPOSAL'); }} className={`flex items-center gap-2 px-3.5 py-1.5 rounded transition-colors ${docsSubTab === 'PROPOSAL' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}><FileText className="w-3.5 h-3.5" /><span>Proposal Final Lengkap</span></button>
              <button onClick={() => { tacticalAudio.playTacticalClick(); setDocsSubTab('PITCH_DECK'); }} className={`flex items-center gap-2 px-3.5 py-1.5 rounded transition-colors ${docsSubTab === 'PITCH_DECK' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}><Tv className="w-3.5 h-3.5" /><span>15 Slide Pitch Deck</span></button>
              <button onClick={() => { tacticalAudio.playTacticalClick(); setDocsSubTab('VIDEO_SCRIPT'); }} className={`flex items-center gap-2 px-3.5 py-1.5 rounded transition-colors ${docsSubTab === 'VIDEO_SCRIPT' ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}><Film className="w-3.5 h-3.5" /><span>Script Video Demo (3-4 Menit)</span></button>
            </div>
            {docsSubTab === 'PROPOSAL' && <ProposalViewer />}
            {docsSubTab === 'PITCH_DECK' && <PitchDeckViewer />}
            {docsSubTab === 'VIDEO_SCRIPT' && <VideoScriptViewer />}
          </div>
        )}
      </main>

      <IncidentDetailModal incident={selectedIncident} onClose={() => setSelectedIncident(null)} onDispatch={handleDispatchIncident} />
      <ScenarioSimulatorModal isOpen={isSimulationOpen} onClose={() => setIsSimulationOpen(false)} onSelectScenario={handleSelectScenario} activeScenarioId={activeScenario?.id} />

      {showPosterBriefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-[#09111e] border border-amber-500/40 rounded-xl overflow-hidden shadow-2xl p-2 flex flex-col">
            <div className="p-3 flex items-center justify-between border-b border-slate-800 text-xs font-mono"><span className="text-amber-400 font-bold uppercase tracking-wider">DOKTRIN PERISAI CERDAS NUSANTARA // OFFICIAL BRIEFING EMBLEM</span><button onClick={() => setShowPosterBriefing(false)} className="p-1.5 px-3 rounded bg-slate-800 text-slate-300 hover:text-white text-xs cursor-pointer">Tutup</button></div>
            <div className="p-2 flex items-center justify-center bg-slate-950 rounded-b-lg"><img src="/assets/aistudio/SmartSelect_20261029_205506_X_74eaa168.jpg" alt="Garuda Dome System - Perisai Cerdas Nusantara" className="w-full h-auto max-h-[75vh] object-contain rounded shadow-2xl" /></div>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-900 bg-slate-950 py-6 px-4 lg:px-8 mt-auto text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-amber-500/70" /><span className="text-slate-400">GARUDA DOME SYSTEM (GDS) v3 · PLATFORM KETAHANAN NASIONAL</span></div>
          <div className="flex items-center gap-4 text-[11px] text-slate-500"><span>MABES TNI</span><span aria-hidden="true">·</span><span>KLHK</span><span aria-hidden="true">·</span><span>KKP</span><span aria-hidden="true">·</span><span>BAKAMLA</span><span aria-hidden="true">·</span><span>BSSN</span><span aria-hidden="true">·</span><span>BNPB</span><span aria-hidden="true">·</span><span>BNN</span></div>
        </div>
      </footer>
    </div>
  );
}
