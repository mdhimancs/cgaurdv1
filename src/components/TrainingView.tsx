import { useState } from 'react';
import { 
  BookOpenText, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  User, 
  Building2,
  TrendingUp,
  RotateCw,
  Search
} from 'lucide-react';
import { INITIAL_TRAINING_METRICS } from '../data/mockData';
import { BUTrainingMetric } from '../types/dashboard';

interface Props {
  onNotify: (msg: string) => void;
}

export function TrainingView({ onNotify }: Props) {
  const [metrics, setMetrics] = useState<BUTrainingMetric[]>(INITIAL_TRAINING_METRICS);
  const [searchTerm, setSearchTerm] = useState('');
  const [dispatchingBu, setDispatchingBu] = useState<string | null>(null);

  const totalEmployees = metrics.reduce((acc, m) => acc + m.totalEmployees, 0);
  const totalCompleted = metrics.reduce((acc, m) => acc + m.annualTrainingCompleted, 0);
  const avgCompletion = (totalCompleted / totalEmployees * 100).toFixed(1);
  const totalDelinquent = metrics.reduce((acc, m) => acc + m.delinquentStaffCount, 0);
  const avgPhishClick = (metrics.reduce((acc, m) => acc + m.phishingSimClicked, 0) / totalEmployees * 100).toFixed(1);

  const handleDispatchRemedial = (bu: BUTrainingMetric) => {
    setDispatchingBu(bu.businessUnit);
    setTimeout(() => {
      setMetrics(prev => prev.map(m => {
        if (m.businessUnit === bu.businessUnit) {
          return {
            ...m,
            delinquentStaffCount: Math.max(0, m.delinquentStaffCount - 25),
            annualTrainingRate: Math.min(100, +(m.annualTrainingRate + 2.5).toFixed(1)),
            status: 'ON TRACK'
          };
        }
        return m;
      }));
      setDispatchingBu(null);
      onNotify(`Mandatory Remedial Cyber Training & Phishing Lure re-dispatched to ${bu.delinquentStaffCount} delinquent staff in ${bu.businessUnit}.`);
    }, 800);
  };

  const filtered = metrics.filter(m => 
    m.businessUnit.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.buLead.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="col-span-12 space-y-3.5">
      {/* Compact Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              KnowBe4 • Proofpoint Security Awareness Platform
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Q3 Phishing Simulation & Human Risk Management</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">Security Training & Phishing Behavioral Resilience</h2>
          <p className="text-xs text-slate-300 max-w-3xl">
            Tracking annual mandatory cybersecurity training completions, real-time simulated phishing click rates, and delinquent employee escalations across 23,620 staff.
          </p>
        </div>

        <button
          onClick={() => onNotify('Triggered enterprise-wide Q3 spear-phishing simulation campaign across all 6 business units.')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-xs shrink-0"
        >
          <Send className="w-3.5 h-3.5" /> Launch Enterprise Campaign Drill
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Firmwide Completion Rate</span>
          <span className="text-2xl font-black text-slate-900 block mt-0.5">{avgCompletion}%</span>
          <span className="text-[10px] text-emerald-600 font-semibold">{totalCompleted.toLocaleString()} of {totalEmployees.toLocaleString()} staff</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Delinquent Staff Count</span>
          <span className="text-2xl font-black text-rose-600 block mt-0.5">{totalDelinquent.toLocaleString()}</span>
          <span className="text-[10px] text-rose-700 font-semibold">Overdue 30d+ mandatory module</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Phishing Click Rate</span>
          <span className="text-2xl font-black text-amber-600 block mt-0.5">{avgPhishClick}%</span>
          <span className="text-[10px] text-slate-500 font-medium">Industry baseline: 4.8%</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Phishing Reporting Velocity</span>
          <span className="text-2xl font-black text-emerald-600 block mt-0.5">83.4%</span>
          <span className="text-[10px] text-emerald-700 font-semibold">Reported within 10 min</span>
        </div>
      </div>

      {/* BU Training Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Business Unit Training & Simulation Breakdown
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
              {filtered.length} Operating Units
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by BU or lead..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs table-auto">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2 px-3 break-words">Business Unit</th>
                <th className="py-2 px-2.5 break-words">Accountable BU Lead</th>
                <th className="py-2 px-2.5 break-words">Total Staff</th>
                <th className="py-2 px-2.5 break-words">Annual Training Rate</th>
                <th className="py-2 px-2.5 break-words">Delinquent Staff</th>
                <th className="py-2 px-2.5 break-words">Phishing Click %</th>
                <th className="py-2 px-2.5 break-words">Phishing Reported %</th>
                <th className="py-2 px-2.5 break-words">Last Campaign Date</th>
                <th className="py-2 px-2.5 break-words">Status</th>
                <th className="py-2 px-2.5 text-right break-words">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((bu) => (
                <tr key={bu.businessUnit} className="hover:bg-slate-50/70 transition">
                  <td className="py-2.5 px-3 font-bold text-slate-900 break-words">{bu.businessUnit}</td>
                  
                  <td className="py-2.5 px-2.5 break-words">
                    <span className="font-semibold text-slate-800 text-[11px] break-words">{bu.buLead}</span>
                  </td>

                  <td className="py-2.5 px-2.5 font-mono text-[11px] text-slate-700 break-words">
                    {bu.totalEmployees.toLocaleString()}
                  </td>

                  <td className="py-2.5 px-2.5 break-words">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden shrink-0">
                        <div 
                          className={`h-full rounded-full ${bu.annualTrainingRate >= 90 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                          style={{ width: `${bu.annualTrainingRate}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-[11px] text-slate-800 break-words">{bu.annualTrainingRate}%</span>
                    </div>
                  </td>

                  <td className="py-2.5 px-2.5 break-words">
                    {bu.delinquentStaffCount > 0 ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 inline-block break-words">
                        {bu.delinquentStaffCount.toLocaleString()} Staff
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-600 inline-block break-words">0 Clean</span>
                    )}
                  </td>

                  <td className="py-2.5 px-2.5 font-mono font-bold text-[11px] break-words">
                    <span className={bu.phishingClickRate > 5.0 ? 'text-rose-600' : 'text-slate-800'}>
                      {bu.phishingClickRate}% ({bu.phishingSimClicked})
                    </span>
                  </td>

                  <td className="py-2.5 px-2.5 font-mono text-[11px] text-emerald-700 font-bold break-words">
                    {bu.phishingReportRate}%
                  </td>

                  <td className="py-2.5 px-2.5 text-[11px] text-slate-500 break-words">
                    {bu.lastSimDate}
                  </td>

                  <td className="py-2.5 px-2.5 break-words">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block break-words ${
                      bu.status === 'ON TRACK' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {bu.status}
                    </span>
                  </td>

                  <td className="py-2.5 px-2.5 text-right break-words">
                    <button
                      disabled={dispatchingBu === bu.businessUnit}
                      onClick={() => handleDispatchRemedial(bu)}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white rounded text-[10px] font-bold transition shadow-2xs break-words"
                    >
                      {dispatchingBu === bu.businessUnit ? 'Sending...' : 'Remediate Delinquents'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
