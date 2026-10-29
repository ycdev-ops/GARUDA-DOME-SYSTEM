import React, { useState } from 'react';
import { GDS_PITCH_DECK, PitchSlide } from '../data/pitchDeckData';
import { 
  ChevronLeft, 
  ChevronRight, 
  Layers, 
  MessageSquare, 
  Eye, 
  Maximize2,
  Tv,
  Sparkles
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';

export const PitchDeckViewer: React.FC = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);

  const currentSlide = GDS_PITCH_DECK[currentSlideIndex];

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      tacticalAudio.playTacticalClick();
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentSlideIndex < GDS_PITCH_DECK.length - 1) {
      tacticalAudio.playTacticalClick();
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Deck Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <Tv className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Outline Presentasi Pitch Deck (15 Slide Profesional)
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Cocok untuk Paparan Komando Operasi TNI & Tim Penilai Kementerian
            </p>
          </div>
        </div>

        {/* Slide Counter & Prev/Next */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-mono transition-colors ${
              showSpeakerNotes
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                : 'border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Speaker Notes: {showSpeakerNotes ? 'ON' : 'OFF'}</span>
          </button>

          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded border border-slate-800 font-mono text-xs">
            <button
              onClick={handlePrev}
              disabled={currentSlideIndex === 0}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-semibold text-slate-200 tabular-nums">
              {currentSlide.slideNumber} / {GDS_PITCH_DECK.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentSlideIndex === GDS_PITCH_DECK.length - 1}
              className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Slide Card (16:9 Presentation Format Aspect) */}
      <div className="relative w-full rounded-xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 sm:p-10 shadow-2xl flex flex-col justify-between min-h-[420px]">
        {/* Slide Category Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            SLIDE {currentSlide.slideNumber} · {currentSlide.category}
          </span>
          {currentSlide.keyMetric && (
            <div className="flex items-center gap-2 px-3 py-1 rounded bg-slate-900 border border-slate-700/60 font-mono text-xs">
              <span className="text-slate-500">{currentSlide.keyMetric.label}:</span>
              <strong className="text-cyan-400">{currentSlide.keyMetric.value}</strong>
            </div>
          )}
        </div>

        {/* Slide Body */}
        <div className="py-6 space-y-4">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {currentSlide.title}
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-medium">
            {currentSlide.tagline}
          </p>

          <ul className="space-y-3 pt-3">
            {currentSlide.bulletPoints.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span className="leading-relaxed">{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Slide Footer Visual Composition Direction */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500 font-mono">
          <div className="flex items-center gap-2 truncate pr-4">
            <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate text-slate-400">Petunjuk Visual: {currentSlide.visualCue}</span>
          </div>
          <span className="shrink-0 text-slate-600">GDS v3 Executive Deck</span>
        </div>
      </div>

      {/* Speaker Notes Box */}
      {showSpeakerNotes && (
        <div className="bg-slate-900/90 border border-amber-500/20 rounded-lg p-5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold uppercase">
            <MessageSquare className="w-4 h-4" />
            <span>Naskah Narasi Pembicara (Speaker Notes - Verbatim):</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans italic bg-slate-950 p-3 rounded border border-slate-800">
            "{currentSlide.speakerNotes}"
          </p>
        </div>
      )}

      {/* Slide Thumbnails Rail */}
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-15 gap-1.5 overflow-x-auto pb-2 scrollbar-none font-mono text-xs">
        {GDS_PITCH_DECK.map((slide, i) => (
          <button
            key={slide.slideNumber}
            onClick={() => {
              tacticalAudio.playTacticalClick();
              setCurrentSlideIndex(i);
            }}
            className={`p-2 rounded border text-center transition-all ${
              currentSlideIndex === i
                ? 'bg-amber-500 text-slate-950 font-bold border-amber-400 shadow-sm'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            #{slide.slideNumber}
          </button>
        ))}
      </div>
    </div>
  );
};
