import { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  BarChart3, 
  ShieldAlert,
  HelpCircle
} from 'lucide-react';
import { INITIAL_KRI_KAR } from '../data/mockData';
import { KriKarIndicator } from '../types/dashboard';

interface Props {
  onNotify: (msg: string) => void;
}

export function KarKriView({ onNotify }: Props) {
  const [indicators, setIndicators] = useState<KriKarIndicator[]>(INITIAL_KRI_KAR);
  const [filterType, setFilterType] = useState<'ALL' | 'KRI' | 'KAR'>('ALL');

  const filtered = indicators.filter(ind => {
    if (filterType === 'KRI') return ind.category.includes('KRI');
    if (filterType === 'KAR') return ind.category.includes('KAR');
    return true;
  });

  const handleRecalculateVaR = () => {
    onNotify('FAIR Quantitative Monte Carlo simulation re-run. Estimated Maximum Probable Loss (Single Loss Expectancy): $4.2M.');
  };

  return (
    <div className="col-span-12 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
              FAIR Model & NIST SP 800-55
            </span>
            <span className="text-xs text-slate-400">Key Risk Indicators (KRIs) & Key Assurance Indicators (KARs)</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1">KRIs, KARs & Quantitative Financial Risk (FAIR)</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Predictive risk indicators and assurance metrics replacing static compliance checklists with probabilistic financial loss exposure modeling.
          </p>
        </div>

        <button
          onClick={handleRecalculateVaR}
          className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition shadow-md shrink-0"
        >
          <BarChart3 className="w-4 h-4" /> Run Monte Carlo VaR Simulation
        </button>
      </div>

      {/* FAIR Quantitative Financial Risk Summary Card */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 border border-indigo-900/50 rounded-2xl p-6 text-white shadow-md grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider block">Single Loss Expectancy (SLE)</span>
          <span className="text-3xl font-black text-white block mt-1">$1.4M - $4.2M</span>
          <span className="text-xs text-slate-300 mt-1 block">Based on 95th percentile cyber exposure</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider block">Annual Loss Expectancy (ALE)</span>
          <span className="text-3xl font-black text-emerald-400 block mt-1">$850,000</span>
          <span className="text-xs text-slate-300 mt-1 block">Down 32% YoY due to EDR & PAM controls</span>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-indigo-300 tracking-wider block">Cyber Insurance Premium ROI</span>
          <span className="text-3xl font-black text-amber-400 block mt-1">18.4% Savings</span>
          <span className="text-xs text-slate-300 mt-1 block">Verified by third-party actuarial audit</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-4 py-2 rounded-xl font-bold transition ${filterType === 'ALL' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            All Indicators ({indicators.length})
          </button>
          <button
            onClick={() => setFilterType('KRI')}
            className={`px-4 py-2 rounded-xl font-bold transition ${filterType === 'KRI' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Key Risk Indicators (KRIs)
          </button>
          <button
            onClick={() => setFilterType('KAR')}
            className={`px-4 py-2 rounded-xl font-bold transition ${filterType === 'KAR' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
          >
            Key Assurance Indicators (KARs)
          </button>
        </div>
        <div className="text-slate-500 font-medium">
          Monitored Continuously via GRC / SIEM Connectors
        </div>
      </div>

      {/* Indicators Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Indicator Code & Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Current Value</th>
                <th className="py-3 px-4">Target Threshold</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Trend</th>
                <th className="py-3 px-4">Business Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((ind) => {
                const isOptimal = ind.status === 'Optimal';
                const isBreached = ind.status === 'Breached';

                return (
                  <tr key={ind.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[10px] font-bold text-slate-400">{ind.code}</div>
                      <div className="font-extrabold text-slate-900 text-sm mt-0.5">{ind.title}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {ind.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      {ind.currentValue}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {ind.targetThreshold}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isOptimal ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                        isBreached ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                        'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {ind.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-600">
                      {ind.trend}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {ind.businessOwner} ({ind.frequency})
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
