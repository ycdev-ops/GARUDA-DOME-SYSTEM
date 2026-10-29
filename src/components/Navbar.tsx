import React from 'react';
import { Volume2, VolumeX, Shield, Play } from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSimulation: () => void;
  isAudioMuted: boolean;
  setIsAudioMuted: (muted: boolean) => void;
  incidentCount: number;
  criticalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSimulation,
  isAudioMuted,
  setIsAudioMuted,
  incidentCount,
  criticalCount,
}) => {
  const toggleSound = () => {
    const newState = tacticalAudio.toggleMute();
    setIsAudioMuted(newState);
    if (!newState) {
      tacticalAudio.playTacticalClick();
    }
  };

  const navItems = [
    { id: 'tactical_map', label: 'Taktikal Peta' },
    { id: 'cyber_command', label: 'Pusat Siber & 3D' },
    { id: 'illegal_fishing', label: 'IUU Fishing' },
    { id: 'illegal_logging', label: 'Illegal Logging' },
    { id: 'godseye_sync', label: "God's Eye Sync" },
    { id: 'resource_health', label: 'Resource Health' },
    { id: 'garuda_brain', label: 'Garuda Brain' },
    { id: 'docs_hub', label: 'Dokumen Hub' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-8 transition-colors">
      {/* Zone 1: Wordmark Brand */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-8 h-8 rounded-full bg-slate-900 border border-amber-500/40 p-0.5 flex items-center justify-center shadow-[0_0_12px_rgba(245,158,11,0.4)] overflow-hidden">
          <img 
            src="/assets/aistudio/SmartSelect_20261029_221701_Gallery.png" 
            alt="Garuda Dome Crest" 
            className="w-full h-full object-cover"
          />
        </div>
        <button
          onClick={() => {
            tacticalAudio.playTacticalClick();
            setActiveTab('tactical_map');
          }}
          className="text-left group"
        >
          <div className="text-base font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors whitespace-nowrap">
            GARUDA DOME SYSTEM <span className="text-amber-400 font-mono text-xs font-semibold px-1 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 ml-1">v3</span>
          </div>
        </button>
      </div>

      {/* Zone 2: Navigation Links (Single-line, clean unboxed text with subtle underlines) */}
      <nav className="hidden md:flex items-center gap-6 text-xs lg:text-sm font-medium">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                tacticalAudio.playTacticalClick();
                setActiveTab(item.id);
              }}
              className={`whitespace-nowrap shrink-0 transition-colors py-1 relative ${
                isActive
                  ? 'text-amber-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary Action & Controls */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Audio Toggle */}
        <button
          onClick={toggleSound}
          title={isAudioMuted ? 'Nyalakan Audio Taktis' : 'Bisukan Audio'}
          className={`p-2 rounded border text-xs transition-colors ${
            isAudioMuted
              ? 'border-slate-800 text-slate-500 hover:text-slate-300 bg-slate-900/50'
              : 'border-amber-500/30 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20'
          }`}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Tactical Status Pill-less info */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-400 font-mono">
          <span>{incidentCount} Sasaran</span>
          <span aria-hidden="true">·</span>
          <span className="text-red-400 font-medium">{criticalCount} Kritis</span>
        </div>

        {/* Primary CTA: Launch Scenario Simulation */}
        <button
          onClick={() => {
            tacticalAudio.playRadarPing();
            onOpenSimulation();
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded transition-colors shadow-sm whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Simulasi Skenario</span>
        </button>
      </div>
    </header>
  );
};
