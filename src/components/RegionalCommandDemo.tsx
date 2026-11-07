import React from 'react';
import { CyberWarfareControlCenter } from './CyberWarfareControlCenter';

/** Standalone regional tabletop screen; the main navbar also embeds this console. */
export const RegionalCommandDemo: React.FC = () => (
  <main className="min-h-screen bg-slate-950 px-3 py-5 text-slate-100 sm:px-6 lg:px-8">
    <div className="mx-auto w-full max-w-[1500px]">
      <CyberWarfareControlCenter />
    </div>
  </main>
);

export default RegionalCommandDemo;
