import { useState } from 'react';
import { Server, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface Props {
  onNotify: (msg: string) => void;
}

export function CaasmView({ onNotify }: Props) {
  return (
    <div className="col-span-12 space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            Cyber Asset Attack Surface Management (CAASM)
          </span>
          <h2 className="text-2xl font-black tracking-tight mt-1">Enterprise Asset Discovery & Shadow IT Visibility</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Unified inventory indexing 48,250 endpoints, 12,450 cloud resources, and unmanaged shadow IT instances.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Discovered Assets</span>
          <span className="text-3xl font-black text-slate-900 block mt-2">60,700</span>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">100% Agent Coverage</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Unmanaged Shadow IT</span>
          <span className="text-3xl font-black text-amber-600 block mt-2">14 Instances</span>
          <span className="text-xs text-amber-700 font-semibold mt-1 block">Requires quarantine</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase block">Asset Hygiene Score</span>
          <span className="text-3xl font-black text-emerald-600 block mt-2">91.5 / 100</span>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">Optimal discovery index</span>
        </div>
      </div>
    </div>
  );
}
