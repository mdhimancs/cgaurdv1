import { useState } from 'react';
import { 
  ShieldAlert, 
  Flame, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  ExternalLink, 
  Building2, 
  User, 
  RotateCw, 
  Zap, 
  ShieldCheck, 
  Cpu, 
  Lock,
  Radio,
  Crosshair,
  KeyRound
} from 'lucide-react';
import { PostureFinding } from '../types/dashboard';

interface Props {
  findings: PostureFinding[];
  onUpdateFindingStatus: (id: string, newStatus: PostureFinding['status']) => void;
  onNotify: (msg: string) => void;
}

export function ItdrView({ findings, onUpdateFindingStatus, onNotify }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [buFilter, setBuFilter] = useState('ALL');
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isQuarantiningId, setIsQuarantiningId] = useState<string | null>(null);

  const itdrFindings = findings.filter(f => f.domain === 'itdr');
  const criticalCount = itdrFindings.filter(f => f.severity === 'Critical' && f.status !== 'Remediated').length;
  const overdueCount = itdrFindings.filter(f => f.isOverdue && f.status !== 'Remediated').length;
  const remediatedCount = itdrFindings.filter(f => f.status === 'Remediated').length;

  const handleQuarantineThreat = (item: PostureFinding) => {
    setIsQuarantiningId(item.id);
    setTimeout(() => {
      onUpdateFindingStatus(item.id, 'Remediated');
      setIsQuarantiningId(null);
      onNotify(`ITDR Active Threat [${item.id}] neutralized: Enforced automated credential reset and number-matching MFA.`);
    }, 850);
  };

  const filteredFindings = itdrFindings.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.assetTarget.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.accountable.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;
    const matchesBu = buFilter === 'ALL' || item.businessUnit === buFilter;
    const matchesOverdue = !onlyOverdue || item.isOverdue;

    return matchesSearch && matchesSeverity && matchesBu && matchesOverdue;
  });

  return (
    <div className="col-span-12 space-y-3.5">
      {/* Compact Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              Identity Threat Detection & Response (ITDR)
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Real-Time Credential Attack Interception</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">Active Identity Threat Detection & Real-Time Response</h2>
          <p className="text-xs text-slate-300 max-w-3xl">
            Live behavioral defense against Kerberoasting, distributed password spraying, MFA fatigue push bombing, and rogue OAuth consent phishing.
          </p>
        </div>

        <button
          onClick={() => onNotify('Triggered Falcon Identity & Microsoft Defender for Identity continuous threat heuristic correlation.')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition shadow-xs shrink-0"
        >
          <Crosshair className="w-3.5 h-3.5" /> Correlate ITDR Signals
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Identity Threats</span>
          <span className="text-2xl font-black text-rose-600 block mt-0.5">{itdrFindings.length - remediatedCount} Active</span>
          <span className="text-[10px] text-rose-700 font-semibold">{criticalCount} Critical severity</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Password Spray Block Rate</span>
          <span className="text-2xl font-black text-emerald-600 block mt-0.5">100%</span>
          <span className="text-[10px] text-emerald-700 font-semibold">4,800 attempts blocked</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">MFA Fatigue Deflection</span>
          <span className="text-2xl font-black text-indigo-600 block mt-0.5">99.7%</span>
          <span className="text-[10px] text-indigo-700 font-semibold">Number-matching enforced</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overdue SLA Violations</span>
          <span className="text-2xl font-black text-amber-600 block mt-0.5">{overdueCount} Overdue</span>
          <span className="text-[10px] text-amber-700 font-semibold">Requires immediate SOC action</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by threat ID, attack vector, targeted user, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-rose-500 font-medium"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-medium"
            >
              <option value="ALL">All Severities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
            </select>

            <select
              value={buFilter}
              onChange={(e) => setBuFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-medium"
            >
              <option value="ALL">All Business Units</option>
              <option value="Global Markets">Global Markets</option>
              <option value="Retail Banking">Retail Banking</option>
            </select>

            <button
              onClick={() => setOnlyOverdue(!onlyOverdue)}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition ${
                onlyOverdue 
                  ? 'bg-rose-50 text-rose-700 border-rose-300' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Overdue Only
            </button>
          </div>
        </div>
      </div>

      {/* Granular ITDR Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Active Identity Attack Telemetry & Interception Events
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
              {filteredFindings.length} of {itdrFindings.length} Threat Vectors
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Click row to view MITRE technique mapping and real-time containment playbooks
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs table-auto">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2 px-3 break-words">Attack / ID</th>
                <th className="py-2 px-2.5 break-words">Target Identity / Endpoint</th>
                <th className="py-2 px-2 break-words">Severity</th>
                <th className="py-2 px-2.5 break-words">Timeline & SLA</th>
                <th className="py-2 px-2.5 break-words">Time Since Open</th>
                <th className="py-2 px-2.5 break-words">SOC / ITDR Lead</th>
                <th className="py-2 px-2.5 break-words">Accountable Lead</th>
                <th className="py-2 px-2.5 break-words">Status</th>
                <th className="py-2 px-2.5 text-right break-words">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredFindings.map((item) => {
                const isExpanded = expandedId === item.id;
                return (
                  <tr 
                    key={item.id}
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className={`hover:bg-slate-50/70 transition cursor-pointer ${
                      item.isOverdue && item.status !== 'Remediated' ? 'bg-rose-50/20' : ''
                    }`}
                  >
                    {/* ID & Title */}
                    <td className="py-2.5 px-3 max-w-[200px] break-words">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono text-[10px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-100 break-all">
                          {item.id}
                        </span>
                        {item.cveOrRule && (
                          <span className="font-mono text-[9px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded break-all">
                            {item.cveOrRule}
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-slate-900 mt-1 leading-snug text-xs break-words">
                        {item.title}
                      </p>
                      <span className="text-[10px] text-slate-400 font-mono block mt-0.5 break-words">Src: {item.telemetrySource}</span>
                    </td>

                    {/* Target Identity */}
                    <td className="py-2.5 px-2.5 max-w-[200px] break-words">
                      <p className="font-mono text-xs font-semibold text-slate-800 break-all whitespace-normal" title={item.assetTarget}>
                        {item.assetTarget}
                      </p>
                      <span className="text-[10px] text-slate-400 block break-words">{item.businessUnit}</span>
                    </td>

                    {/* Severity */}
                    <td className="py-2.5 px-2 break-words">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                        item.severity === 'Critical' ? 'bg-rose-100 text-rose-700' :
                        item.severity === 'High' ? 'bg-amber-100 text-amber-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {item.severity}
                      </span>
                    </td>

                    {/* Timeline */}
                    <td className="py-2.5 px-2.5 break-words">
                      <span className="text-slate-400 block text-[10px] break-words">Identified: {item.identifiedDate}</span>
                      <span className="font-semibold text-slate-800 block break-words">SLA: {item.targetDate}</span>
                    </td>

                    {/* Time Since Open */}
                    <td className="py-2.5 px-2.5 break-words">
                      {item.isOverdue && item.status !== 'Remediated' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse inline-block break-words">
                          {item.timeSinceOpenText}
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 inline-block break-words">
                          {item.timeSinceOpenText}
                        </span>
                      )}
                    </td>

                    {/* SOC Owner */}
                    <td className="py-2.5 px-2.5 max-w-[140px] break-words">
                      <span className="font-semibold text-slate-800 block text-[11px] break-words" title={item.owner}>
                        {item.owner}
                      </span>
                    </td>

                    {/* Accountable VP */}
                    <td className="py-2.5 px-2.5 max-w-[150px] break-words">
                      <span className="text-slate-800 font-semibold block text-[11px] break-words" title={item.accountable}>
                        {item.accountable}
                      </span>
                      <span className="text-[10px] text-slate-400 block break-words">{item.businessUnit}</span>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-2.5 break-words">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                        item.status === 'Remediated' ? 'bg-emerald-100 text-emerald-700' :
                        item.status === 'Overdue' ? 'bg-rose-100 text-rose-700' :
                        'bg-indigo-100 text-indigo-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-2.5 text-right break-words" onClick={(e) => e.stopPropagation()}>
                      {item.status !== 'Remediated' ? (
                        <button
                          disabled={isQuarantiningId === item.id}
                          onClick={() => handleQuarantineThreat(item)}
                          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900 text-white rounded text-[10px] font-bold transition shadow-2xs break-words"
                        >
                          {isQuarantiningId === item.id ? 'Neutralizing...' : 'Quarantine & Reset'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Neutralized
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expanded Drilldown Drawer */}
      {expandedId && (() => {
        const item = itdrFindings.find(f => f.id === expandedId);
        if (!item) return null;
        return (
          <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                  {item.id} • {item.cveOrRule}
                </span>
                <h4 className="text-sm font-black text-slate-100">{item.title}</h4>
              </div>
              <button 
                onClick={() => setExpandedId(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 bg-slate-800 rounded"
              >
                Close Details
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                  Active Threat Containment Plan
                </span>
                <p className="text-[11px] text-slate-200 leading-relaxed">{item.remediationPlan}</p>
                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Compliance & Regulatory SLA:</span>
                  <span className="font-bold text-rose-400">{item.complianceImpact}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  Telemetry Feed & Threat Vector Target
                </span>
                <p className="text-[11px] text-slate-200 font-mono leading-relaxed">Sensor: {item.telemetrySource}</p>
                <p className="text-[11px] text-slate-300 font-mono">Target: {item.assetTarget}</p>
                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Business Unit:</span>
                  <span className="font-bold text-slate-200">{item.businessUnit}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 space-y-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Automated ITDR Response Actions
                  </span>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    Force Kerberos ticket invalidation, trigger automated user password reset, and upgrade to FastPass FIDO2 hardware token authentication.
                  </p>
                </div>
                {item.status !== 'Remediated' && (
                  <button
                    onClick={() => handleQuarantineThreat(item)}
                    className="mt-2 w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" /> Execute Immediate Account Containment
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
