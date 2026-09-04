import { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  User, 
  Building2, 
  CheckCircle2, 
  RotateCw, 
  Search, 
  Filter, 
  SlidersHorizontal,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Sparkles,
  ArrowUpDown,
  Download
} from 'lucide-react';
import { PostureFinding, PostureDomain, SeverityLevel } from '../types/dashboard';
import { POSTURE_DOMAINS_CONFIG, INITIAL_POSTURE_FINDINGS } from '../data/mockData';

interface Props {
  domain: PostureDomain;
  findings?: PostureFinding[];
  onUpdateFindingStatus?: (id: string, newStatus: PostureFinding['status']) => void;
  onNotify: (msg: string) => void;
}

export function PostureDetailView({ 
  domain, 
  findings: externalFindings, 
  onUpdateFindingStatus, 
  onNotify 
}: Props) {
  const [localFindings, setLocalFindings] = useState<PostureFinding[]>(INITIAL_POSTURE_FINDINGS);
  const findings = externalFindings || localFindings;

  const handleUpdateFindingStatus = (id: string, newStatus: PostureFinding['status']) => {
    if (onUpdateFindingStatus) {
      onUpdateFindingStatus(id, newStatus);
    } else {
      setLocalFindings(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedBU, setSelectedBU] = useState<string>('ALL');
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  const [expandedFindingId, setExpandedFindingId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const config = POSTURE_DOMAINS_CONFIG[domain] || {
    title: 'Security Posture Domain',
    badge: 'Enterprise Posture',
    description: 'Continuous telemetry analysis and issue remediation.',
    primaryMetricLabel: 'Active Findings',
    primaryMetricValue: `${findings.length} Items`,
    secondaryMetricLabel: 'Critical Severity',
    secondaryMetricValue: `${findings.filter(f => f.severity === 'Critical').length} Items`,
    complianceLabel: 'Posture Conformance',
    complianceValue: '91.2%',
    telemetryEngine: 'Automated Telemetry Engine'
  };

  const domainFindings = useMemo(() => {
    return findings.filter(f => f.domain === domain);
  }, [findings, domain]);

  const filteredFindings = useMemo(() => {
    return domainFindings.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.assetTarget.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.accountable.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.cveOrRule && item.cveOrRule.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesSeverity = selectedSeverity === 'ALL' || item.severity === selectedSeverity;
      const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
      const matchesBU = selectedBU === 'ALL' || item.businessUnit === selectedBU;
      const matchesOverdue = !onlyOverdue || item.isOverdue;

      return matchesSearch && matchesSeverity && matchesStatus && matchesBU && matchesOverdue;
    });
  }, [domainFindings, searchTerm, selectedSeverity, selectedStatus, selectedBU, onlyOverdue]);

  const criticalCount = domainFindings.filter(f => f.severity === 'Critical' && f.status !== 'Remediated').length;
  const overdueCount = domainFindings.filter(f => f.isOverdue && f.status !== 'Remediated').length;
  const inProgressCount = domainFindings.filter(f => f.status === 'In Progress').length;
  const remediatedCount = domainFindings.filter(f => f.status === 'Remediated').length;

  const handleTriggerRescan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      onNotify(`Live Telemetry Rescan completed for ${config.title}. 0 new zero-day vulnerabilities detected.`);
    }, 1000);
  };

  const handleRemediate = (finding: PostureFinding) => {
    handleUpdateFindingStatus(finding.id, 'Remediated');
    onNotify(`Action executed: Finding [${finding.id}] marked Remediated. Validation check scheduled.`);
  };

  const handleExportCSV = () => {
    onNotify(`Exported ${filteredFindings.length} granular posture records for ${config.title} to CSV.`);
  };

  return (
    <div className="col-span-12 space-y-3.5">
      {/* Compact Domain Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {config.badge}
            </span>
            <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
              <Cpu className="w-3 h-3 text-indigo-400" /> {config.telemetryEngine}
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight text-slate-100">{config.title}</h2>
          <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
            {config.description}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" /> Export CSV
          </button>
          <button
            disabled={isScanning}
            onClick={handleTriggerRescan}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white rounded-lg text-xs font-bold transition shadow-xs"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'Scanning...' : 'Trigger Telemetry Sync'}
          </button>
        </div>
      </div>

      {/* High-Density KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {config.primaryMetricLabel}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-slate-900">{config.primaryMetricValue}</span>
            <span className="text-[10px] text-slate-500">active items</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Critical Severity Findings
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-rose-600">{criticalCount}</span>
            <span className="text-[10px] text-rose-700 font-semibold">immediate SLA</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Overdue / SLA Breached
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className={`text-2xl font-black ${overdueCount > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {overdueCount}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">requiring escalation</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {config.complianceLabel}
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-black text-emerald-600">{config.complianceValue}</span>
            <span className="text-[10px] text-emerald-700 font-semibold">framework pass</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs space-y-2.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by CVE, finding ID, title, target asset, owner, or accountable lead..."
              className="w-full pl-8.5 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white text-slate-800 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Sev:</span>
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="ALL">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="ALL">All Statuses</option>
                <option value="Open">Open</option>
                <option value="In Progress">In Progress</option>
                <option value="Under Review">Under Review</option>
                <option value="Overdue">Overdue</option>
                <option value="Remediated">Remediated</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase">BU:</span>
              <select
                value={selectedBU}
                onChange={(e) => setSelectedBU(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-700 font-medium focus:outline-none"
              >
                <option value="ALL">All Business Units</option>
                <option value="Global Markets">Global Markets</option>
                <option value="Consumer Tech">Consumer Tech</option>
                <option value="Retail Banking">Retail Banking</option>
                <option value="Logistics & Ops">Logistics & Ops</option>
                <option value="Corp Functions">Corp Functions</option>
                <option value="Regional Offices">Regional Offices</option>
              </select>
            </div>

            <button
              onClick={() => setOnlyOverdue(!onlyOverdue)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 border ${
                onlyOverdue 
                  ? 'bg-rose-50 text-rose-700 border-rose-300' 
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className="w-3 h-3 text-rose-600" /> Overdue Only
            </button>
          </div>
        </div>
      </div>

      {/* Granular Posture Items Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
        <div className="px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Granular Security Posture Telemetry & Issues
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
              {filteredFindings.length} of {domainFindings.length} Items
            </span>
          </div>
          <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
            Click row to view full remediation plan & compliance mapping
          </span>
        </div>

        {filteredFindings.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-bold text-slate-700">No matching posture findings found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Try adjusting your search terms or filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs table-auto">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2 px-3 break-words">Finding / ID</th>
                  <th className="py-2 px-2.5 break-words">Asset / Target</th>
                  <th className="py-2 px-2 break-words">Severity</th>
                  <th className="py-2 px-2.5 break-words">Timeline & SLA</th>
                  <th className="py-2 px-2.5 break-words">Time Since Open</th>
                  <th className="py-2 px-2.5 break-words">Owner (Assignee)</th>
                  <th className="py-2 px-2.5 break-words">Accountable Lead</th>
                  <th className="py-2 px-2.5 break-words">Status</th>
                  <th className="py-2 px-2.5 text-right break-words">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredFindings.map((item) => {
                  const isExpanded = expandedFindingId === item.id;
                  return (
                    <tr 
                      key={item.id} 
                      className={`hover:bg-slate-50/70 transition cursor-pointer ${
                        item.isOverdue && item.status !== 'Remediated' ? 'bg-rose-50/20' : ''
                      }`}
                      onClick={() => setExpandedFindingId(isExpanded ? null : item.id)}
                    >
                      {/* ID & Title */}
                      <td className="py-2.5 px-3 max-w-[240px] break-words">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 break-all">
                            {item.id}
                          </span>
                          {item.cveOrRule && (
                            <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded break-all">
                              {item.cveOrRule}
                            </span>
                          )}
                        </div>
                        <p className="font-bold text-slate-900 mt-1 leading-snug break-words">
                          {item.title}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5 break-words">
                          Src: {item.telemetrySource}
                        </span>
                      </td>

                      {/* Asset Target */}
                      <td className="py-2.5 px-2.5 max-w-[180px] break-words">
                        <span className="font-mono text-[11px] text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded block break-all whitespace-normal" title={item.assetTarget}>
                          {item.assetTarget}
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold block mt-0.5 break-words">
                          {item.businessUnit}
                        </span>
                      </td>

                      {/* Severity */}
                      <td className="py-2.5 px-2 break-words">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase inline-block ${
                          item.severity === 'Critical' ? 'bg-rose-100 text-rose-700 border border-rose-200' :
                          item.severity === 'High' ? 'bg-amber-100 text-amber-700 border border-amber-200' :
                          item.severity === 'Medium' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {item.severity}
                        </span>
                      </td>

                      {/* Timeline & SLA */}
                      <td className="py-2.5 px-2.5 break-words">
                        <div className="text-[11px] break-words">
                          <span className="text-slate-400 block text-[10px] break-words">Identified: {item.identifiedDate}</span>
                          <span className="font-bold text-slate-800 block break-words">SLA Target: {item.targetDate}</span>
                        </div>
                      </td>

                      {/* Time Since Open */}
                      <td className="py-2.5 px-2.5 break-words">
                        {item.status === 'Remediated' ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 inline-block">
                            Remediated
                          </span>
                        ) : item.isOverdue ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 animate-pulse inline-block break-words">
                            {item.timeSinceOpenText}
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 inline-block break-words">
                            {item.timeSinceOpenText}
                          </span>
                        )}
                      </td>

                      {/* Owner */}
                      <td className="py-2.5 px-2.5 max-w-[150px] break-words">
                        <div className="flex items-start gap-1.5 break-words">
                          <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                            {item.owner.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-800 text-[11px] break-words" title={item.owner}>
                            {item.owner}
                          </span>
                        </div>
                      </td>

                      {/* Accountable */}
                      <td className="py-2.5 px-2.5 max-w-[150px] break-words">
                        <div className="flex items-start gap-1.5 break-words">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span className="text-slate-600 text-[11px] break-words" title={item.accountable}>
                            {item.accountable}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-2.5 break-words">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                          item.status === 'Remediated' ? 'bg-emerald-100 text-emerald-700' :
                          item.status === 'Overdue' ? 'bg-rose-100 text-rose-700' :
                          item.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' :
                          item.status === 'Under Review' ? 'bg-amber-100 text-amber-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-2.5 text-right break-words" onClick={(e) => e.stopPropagation()}>
                        {item.status !== 'Remediated' ? (
                          <button
                            onClick={() => handleRemediate(item)}
                            className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-[10px] font-bold transition shadow-2xs break-words"
                          >
                            Resolve / Fix
                          </button>
                        ) : (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Closed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Granular Detail Expansion / Drilldown Card */}
      {expandedFindingId && (() => {
        const item = domainFindings.find(f => f.id === expandedFindingId);
        if (!item) return null;
        return (
          <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                  {item.id}
                </span>
                <span className="text-sm font-black text-slate-100">{item.title}</span>
              </div>
              <button
                onClick={() => setExpandedFindingId(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800"
              >
                Close Details
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Scope & Telemetry</span>
                <p className="font-mono text-slate-200 break-all">{item.assetTarget}</p>
                <p className="text-slate-400 text-[11px]">Source: {item.telemetrySource}</p>
                {item.complianceImpact && (
                  <p className="text-indigo-300 font-semibold text-[11px] pt-1">
                    Compliance Impact: {item.complianceImpact}
                  </p>
                )}
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Governance & Accountability</span>
                <p className="text-slate-200"><strong>Assignee:</strong> {item.owner}</p>
                <p className="text-slate-300"><strong>Accountable VP:</strong> {item.accountable}</p>
                <p className="text-slate-400"><strong>Business Unit:</strong> {item.businessUnit}</p>
                <p className="text-slate-400"><strong>Identified:</strong> {item.identifiedDate} (Target: {item.targetDate})</p>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Remediation Action Plan</span>
                <p className="text-slate-200 text-[11px] leading-relaxed">{item.remediationPlan}</p>
                {item.status !== 'Remediated' && (
                  <button
                    onClick={() => handleRemediate(item)}
                    className="mt-2 w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Execute Remediation & Close
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
