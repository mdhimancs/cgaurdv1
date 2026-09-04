import { useState } from 'react';
import { 
  KeyRound, 
  Bot, 
  FileCode, 
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
  Boxes
} from 'lucide-react';
import { PostureFinding } from '../types/dashboard';

interface Props {
  findings: PostureFinding[];
  onUpdateFindingStatus: (id: string, newStatus: PostureFinding['status']) => void;
  onNotify: (msg: string) => void;
}

export function NhiSecretsView({ findings, onUpdateFindingStatus, onNotify }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [buFilter, setBuFilter] = useState('ALL');
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isRotatingId, setIsRotatingId] = useState<string | null>(null);

  const nhiFindings = findings.filter(f => f.domain === 'nhi-secrets');
  const criticalCount = nhiFindings.filter(f => f.severity === 'Critical' && f.status !== 'Remediated').length;
  const overdueCount = nhiFindings.filter(f => f.isOverdue && f.status !== 'Remediated').length;
  const remediatedCount = nhiFindings.filter(f => f.status === 'Remediated').length;

  const handleRotateSecret = (item: PostureFinding) => {
    setIsRotatingId(item.id);
    setTimeout(() => {
      onUpdateFindingStatus(item.id, 'Remediated');
      setIsRotatingId(null);
      onNotify(`Machine Identity [${item.id}] successfully rotated and migrated to HashiCorp Vault / OIDC Federation.`);
    }, 850);
  };

  const filteredFindings = nhiFindings.filter(item => {
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
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Non-Human Identities (NHI) & Machine Secrets Hub
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Service Accounts • API Keys • TLS Certificates • OIDC Federation</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">Non-Human Identity (NHI) & Machine Secrets Governance</h2>
          <p className="text-xs text-slate-300 max-w-3xl">
            Inventory, continuous privilege right-sizing, static long-lived key deprecation, and automated PKI certificate renewal across 18,420 machine credentials.
          </p>
        </div>

        <button
          onClick={() => onNotify('Triggered firm-wide Oasis Security & HashiCorp Vault machine identity credential inventory sweep.')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-xs shrink-0"
        >
          <Zap className="w-3.5 h-3.5" /> Sweep NHI Inventory
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Machine-to-Human Ratio</span>
          <span className="text-2xl font-black text-slate-900 block mt-0.5">14.2x (18.4k IDs)</span>
          <span className="text-[10px] text-slate-500">2,400 Human Administrators</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active NHI Violations</span>
          <span className="text-2xl font-black text-rose-600 block mt-0.5">{nhiFindings.length - remediatedCount} Risks</span>
          <span className="text-[10px] text-rose-700 font-semibold">{criticalCount} Critical severity</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">OIDC Workload Migration</span>
          <span className="text-2xl font-black text-emerald-600 block mt-0.5">86.5%</span>
          <span className="text-[10px] text-emerald-700 font-semibold">Zero static cloud keys goal</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expiring TLS/SSL Certs (&lt;30d)</span>
          <span className="text-2xl font-black text-amber-600 block mt-0.5">4 Certs</span>
          <span className="text-[10px] text-amber-700 font-semibold">Auto-renewal in progress</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by machine ID, service account, key, cert, or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
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
              <option value="Consumer Tech">Consumer Tech</option>
              <option value="Corp Functions">Corp Functions</option>
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

      {/* Granular NHI Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Machine Credential Findings & Secret Lifecycle Violations
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
              {filteredFindings.length} of {nhiFindings.length} Items
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Click row to view secret rotation telemetry and automated OIDC migration scripts
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs table-auto">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-2 px-3 break-words">Machine Finding / ID</th>
                <th className="py-2 px-2.5 break-words">Service Account / Target Credential</th>
                <th className="py-2 px-2 break-words">Severity</th>
                <th className="py-2 px-2.5 break-words">Timeline & SLA</th>
                <th className="py-2 px-2.5 break-words">Time Since Open</th>
                <th className="py-2 px-2.5 break-words">DevSecOps Owner</th>
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
                        <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 break-all">
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

                    {/* Target Credential */}
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

                    {/* DevSecOps Owner */}
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
                          disabled={isRotatingId === item.id}
                          onClick={() => handleRotateSecret(item)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white rounded text-[10px] font-bold transition shadow-2xs break-words"
                        >
                          {isRotatingId === item.id ? 'Rotating...' : 'Rotate & Deprecate'}
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Rotated
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
        const item = nhiFindings.find(f => f.id === expandedId);
        if (!item) return null;
        return (
          <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
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
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                  Automated Migration & Remediation Plan
                </span>
                <p className="text-[11px] text-slate-200 leading-relaxed">{item.remediationPlan}</p>
                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Compliance Standard:</span>
                  <span className="font-bold text-emerald-400">{item.complianceImpact}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                  Telemetry & Machine Graph Location
                </span>
                <p className="text-[11px] text-slate-200 font-mono leading-relaxed">Source: {item.telemetrySource}</p>
                <p className="text-[11px] text-slate-300 font-mono">Target: {item.assetTarget}</p>
                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
                  <span className="text-slate-400">Business Unit:</span>
                  <span className="font-bold text-slate-200">{item.businessUnit}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 space-y-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                    Zero Standing Secret Enforcement
                  </span>
                  <p className="text-[11px] text-slate-200 leading-relaxed">
                    Trigger automated key rotation via AWS Secrets Manager / Vault, purge hardcoded references, and revoke inactive OAuth grants.
                  </p>
                </div>
                {item.status !== 'Remediated' && (
                  <button
                    onClick={() => handleRotateSecret(item)}
                    className="mt-2 w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <KeyRound className="w-3.5 h-3.5" /> Execute Immediate Rotation & OIDC Binding
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
