import React, { useState } from 'react';
import { GDS_VIDEO_SCRIPT, VideoScriptScene } from '../data/videoScriptData';
import { 
  Film, 
  Clock, 
  Copy, 
  Check, 
  Volume2, 
  Tv, 
  Play, 
  Sparkles,
  Music
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';

export const VideoScriptViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const handleCopyScript = () => {
    tacticalAudio.playTacticalClick();
    const text = GDS_VIDEO_SCRIPT.map(
      (s) =>
        `[SCENE ${s.sceneNumber}: ${s.timecode} (${s.durationSec}s) - ${s.title}]\nVISUAL:\n${s.visualDirection}\n\nVOICEOVER:\n"${s.voiceoverText}"\n\nSFX/MUSIC:\n${s.sfxAndMusic}\n`
    ).join('\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-1">
            <Film className="w-4 h-4" />
            <span>VIDEO PRODUCTION SCREENPLAY · ESTIMASI DURASI: 3 MENIT 45 DETIK</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Script Video Demo Multi-Domain Garuda Dome System v3
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Naskah terstruktur untuk video demo resmi Hackathon Teknologi Pertahanan TNI: mencakup arahan visual HUD, 
            voiceover Bahasa Indonesia bertempo mantap & berwibawa, serta efek suara/musik taktis.
          </p>
        </div>

        <button
          onClick={handleCopyScript}
          className="flex items-center gap-2 px-3.5 py-2 rounded bg-amber-400 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors shrink-0 cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Naskah Tersalin' : 'Salin Seluruh Naskah'}</span>
        </button>
      </div>

      {/* Screenplay Table / Scene Cards */}
      <div className="space-y-4">
        {GDS_VIDEO_SCRIPT.map((scene, idx) => (
          <div
            key={scene.sceneNumber}
            className="p-5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
          >
            {/* Scene Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  SCENE {scene.sceneNumber}
                </span>
                <span className="font-mono text-xs text-cyan-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {scene.timecode} ({scene.durationSec} Detik)
                </span>
              </div>
              <h3 className="text-sm font-bold text-white font-sans">
                {scene.title}
              </h3>
            </div>

            {/* Three Columns: Visual, Voiceover, Audio SFX */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 text-xs font-mono">
              {/* Visual Direction (5 Cols) */}
              <div className="lg:col-span-5 p-3.5 rounded bg-slate-950 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase text-[11px]">
                  <Tv className="w-3.5 h-3.5" />
                  <span>Arahan Visual & Animasi Layar:</span>
                </div>
                <p className="text-slate-300 font-sans leading-relaxed text-xs">
                  {scene.visualDirection}
                </p>
              </div>

              {/* Voiceover Narration (4 Cols) */}
              <div className="lg:col-span-4 p-3.5 rounded bg-slate-950 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold uppercase text-[11px]">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Naskah Narasi (Voiceover):</span>
                </div>
                <p className="text-slate-200 font-sans leading-relaxed text-xs italic">
                  "{scene.voiceoverText}"
                </p>
              </div>

              {/* Audio & Music (3 Cols) */}
              <div className="lg:col-span-3 p-3.5 rounded bg-slate-950 border border-slate-800/80 space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-400 font-bold uppercase text-[11px]">
                  <Music className="w-3.5 h-3.5" />
                  <span>Musik & Efek Suara (SFX):</span>
                </div>
                <p className="text-slate-400 font-sans leading-relaxed text-xs">
                  {scene.sfxAndMusic}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
