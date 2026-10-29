import React, { useEffect, useMemo, useState } from 'react';
import { Volume2, VolumeX, Shield, Play, Mic, MicOff } from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenSimulation: () => void;
  isAudioMuted: boolean;
  setIsAudioMuted: (muted: boolean) => void;
  incidentCount: number;
  criticalCount: number;
  narratorEnabled: boolean;
  setNarratorEnabled: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenSimulation,
  isAudioMuted,
  setIsAudioMuted,
  incidentCount,
  criticalCount,
  narratorEnabled,
  setNarratorEnabled,
}) => {
  const toggleSound = () => {
    const newState = tacticalAudio.toggleMute();
    setIsAudioMuted(newState);
    if (!newState) {
      tacticalAudio.playTacticalClick();
    }
  };

  const toggleNarrator = () => {
    setNarratorEnabled(!narratorEnabled);
  };

  const navItems = useMemo(
    () => [
      { id: 'tactical_map', label: 'Taktikal Peta' },
      { id: 'cyber_command', label: 'Pusat Siber & 3D' },
      { id: 'illegal_fishing', label: 'IUU Fishing' },
      { id: 'illegal_logging', label: 'Illegal Logging' },
      { id: 'godseye_sync', label: "God's Eye Sync" },
      { id: 'resource_health', label: 'Resource Health' },
      { id: 'garuda_brain', label: 'Garuda Brain' },
      { id: 'docs_hub', label: 'Dokumen Hub' },
    ],
    []
  );

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/90 px-3 py-2.5 backdrop-blur md:px-4 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 md:gap-4">
        <div className="flex min-w-0 items-center gap-2 md:gap-3">
          <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-amber-500/40 bg-slate-900 shadow-[0_0_12px_rgba(245,158,11,0.4)]">
            <img src="/assets/aistudio/SmartSelect_20261029_221701_Gallery.png" alt="Garuda Dome Crest" className="h-full w-full object-cover" />
          </div>

          <button
            onClick={() => {
              tacticalAudio.playTacticalClick();
              setActiveTab('tactical_map');
            }}
            className="text-left"
          >
            <div className="text-sm font-bold tracking-tight text-white md:text-base">
              GARUDA DOME
              <span className="ml-1 rounded border border-amber-400/20 bg-amber-400/10 px-1 py-0.5 font-mono text-[10px] font-semibold text-amber-400">
                v3
              </span>
            </div>
          </button>
        </div>

        <nav className="hidden items-center gap-4 text-[11px] font-medium md:flex lg:gap-6 lg:text-xs">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setActiveTab(item.id);
                }}
                className={`relative shrink-0 whitespace-nowrap py-1 transition-colors ${
                  isActive ? 'font-semibold text-amber-400' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
                {isActive && <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 rounded-full bg-amber-400" />}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={toggleNarrator}
            title={narratorEnabled ? 'Matikan Narator' : 'Nyalakan Narator'}
            className={`flex h-9 w-9 items-center justify-center rounded border transition-colors ${
              narratorEnabled
                ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                : 'border-slate-700 bg-slate-900 text-slate-400'
            }`}
          >
            {narratorEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
          </button>

          <button
            onClick={toggleSound}
            title={isAudioMuted ? 'Nyalakan Audio Taktis' : 'Bisukan Audio'}
            className={`flex h-9 w-9 items-center justify-center rounded border text-xs transition-colors ${
              isAudioMuted
                ? 'border-slate-800 bg-slate-900/50 text-slate-500 hover:text-slate-300'
                : 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            {isAudioMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          <div className="hidden items-center gap-1 text-[10px] text-slate-400 font-mono lg:flex">
            <span>{incidentCount} sasaran</span>
            <span aria-hidden="true">·</span>
            <span className="text-red-400">{criticalCount} kritis</span>
          </div>

          <button
            onClick={() => {
              tacticalAudio.playRadarPing();
              onOpenSimulation();
            }}
            className="flex items-center gap-1.5 rounded bg-amber-400 px-2.5 py-2 text-[10px] font-semibold text-slate-950 transition-colors hover:bg-amber-300 sm:px-3 sm:py-2.5 sm:text-xs"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span className="hidden sm:inline">Simulasi Skenario</span>
            <span className="sm:hidden">Skenario</span>
          </button>
        </div>
      </div>
    </header>
  );
};
