import React, { useState } from 'react';
import { GDS_PROPOSAL_DATA, ProposalSection } from '../data/proposalData';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  ChevronRight, 
  Download,
  Shield,
  Layers,
  Award
} from 'lucide-react';
import { tacticalAudio } from '../utils/audioTactical';

export const ProposalViewer: React.FC = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('bab-1');
  const [copied, setCopied] = useState(false);

  const activeSection = GDS_PROPOSAL_DATA.sections.find((s) => s.id === selectedSectionId) || GDS_PROPOSAL_DATA.sections[0];

  const handlePrint = () => {
    tacticalAudio.playTacticalClick();
    window.print();
  };

  const handleCopy = () => {
    tacticalAudio.playTacticalClick();
    const fullText = `${GDS_PROPOSAL_DATA.title}\n${GDS_PROPOSAL_DATA.subtitle}\n\nEXECUTIVE SUMMARY:\n${GDS_PROPOSAL_DATA.executiveSummary.join('\n\n')}\n\n${GDS_PROPOSAL_DATA.sections.map(s => `${s.number}: ${s.title}\n${s.content.join('\n')}`).join('\n\n')}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Export Action Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-mono mb-1">
            <FileText className="w-4 h-4" />
            <span>{GDS_PROPOSAL_DATA.classification}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            {GDS_PROPOSAL_DATA.title}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            {GDS_PROPOSAL_DATA.edition} · {GDS_PROPOSAL_DATA.preparedFor}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-700 bg-slate-800 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Tersalin' : 'Salin Naskah'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-amber-400 text-xs font-bold text-slate-950 hover:bg-amber-300 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak / Ekspor PDF</span>
          </button>
        </div>
      </div>

      {/* Main Document Layout: Sidebar Navigator + Article Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Chapter Index Nav */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-2 sticky top-20">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2">
            Daftar Bab & Struktur
          </h3>
          <div className="space-y-1">
            {GDS_PROPOSAL_DATA.sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => {
                  tacticalAudio.playTacticalClick();
                  setSelectedSectionId(sec.id);
                }}
                className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex items-center justify-between ${
                  selectedSectionId === sec.id
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="truncate pr-2">
                  <span className="font-mono text-slate-500 block text-[10px]">{sec.number}</span>
                  <span className="truncate">{sec.title}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* Active Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Executive Summary Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-3">
              Ringkasan Eksekutif (Executive Summary)
            </h3>
            <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
              {GDS_PROPOSAL_DATA.executiveSummary.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>

          {/* Active Chapter Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
            <div className="border-b border-slate-800 pb-4">
              <span className="text-xs font-mono font-bold text-amber-400 block mb-1">
                {activeSection.number}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                {activeSection.title}
              </h2>
              {activeSection.subtitle && (
                <p className="text-xs sm:text-sm text-slate-400 mt-1 font-mono">
                  {activeSection.subtitle}
                </p>
              )}
            </div>

            {/* Paragraphs */}
            <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
              {activeSection.content.map((p, idx) => (
                <p key={idx} className="whitespace-pre-line">{p}</p>
              ))}
            </div>

            {/* Key Points if available */}
            {activeSection.keyPoints && (
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-mono font-bold text-amber-400 uppercase">
                  Poin Kunci & Sasaran Strategis:
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                  {activeSection.keyPoints.map((point, k) => (
                    <li key={k} className="leading-relaxed">{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Table if available */}
            {activeSection.tables && (
              <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      {activeSection.tables.headers.map((h, i) => (
                        <th key={i} className="py-2.5 pr-4 font-semibold">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {activeSection.tables.rows.map((row, rIdx) => (
                      <tr key={rIdx}>
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className={`py-2.5 pr-4 ${cIdx === 0 ? 'text-white font-semibold' : ''}`}>
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
