import { useState, useMemo, FormEvent } from 'react';
import { 
  LayoutDashboard, 
  ShieldAlert, 
  Database, 
  BookOpenText, 
  Building2, 
  Share2, 
  Download,
  KeyRound,
  ShieldCheck,
  BrainCircuit,
  ScanEye,
  Cloud,
  Network,
  GitBranch,
  Plus,
  Trash2,
  CheckCircle2,
  Search,
  Lock,
  Server,
  Layers,
  Activity,
  X,
  Presentation,
  Zap,
  Radio,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { 
  INITIAL_AUDIT_ISSUES, 
  INITIAL_TECH_DEBT, 
  INITIAL_INCIDENTS, 
  EXECUTIVE_INSIGHTS,
  VAM_POSTURE,
  CLOUD_POSTURE,
  PRIVILEGE_POSTURE,
  BU_PERFORMANCE_METRICS,
  INITIAL_POSTURE_FINDINGS
} from './data/mockData';
import { AuditIssue, TechDebtItem, PostureDomain, PostureFinding } from './types/dashboard';
import { TprmView } from './components/TprmView';
import { SiemSoarView } from './components/SiemSoarView';
import { KarKriView } from './components/KarKriView';
import { BoardroomModal } from './components/BoardroomModal';
import { AttackPathsView } from './components/AttackPathsView';
import { MitreSiemView } from './components/MitreSiemView';
import { SodGovernanceView } from './components/SodGovernanceView';
import { OpenSourceMeshView } from './components/OpenSourceMeshView';
import { LiveTelemetryTicker } from './components/LiveTelemetryTicker';
import { PostureDetailView } from './components/PostureDetailView';
import { TrainingView } from './components/TrainingView';
import { ZtnaView } from './components/ZtnaView';
import { NhiSecretsView } from './components/NhiSecretsView';
import { ItdrView } from './components/ItdrView';
import { Bot, ShieldAlert as ShieldAlertIcon, Crosshair } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<string>('overview');
  const [auditIssues, setAuditIssues] = useState<AuditIssue[]>(INITIAL_AUDIT_ISSUES);
  const [techDebtItems, setTechDebtItems] = useState<TechDebtItem[]>(INITIAL_TECH_DEBT);
  const [postureFindings, setPostureFindings] = useState<PostureFinding[]>(INITIAL_POSTURE_FINDINGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [showAddAuditModal, setShowAddAuditModal] = useState(false);
  const [showAddDebtModal, setShowAddDebtModal] = useState(false);
  const [showOpenSourceModal, setShowOpenSourceModal] = useState(false);
  const [showBoardroomModal, setShowBoardroomModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [newAuditTitle, setNewAuditTitle] = useState('');
  const [newAuditFramework, setNewAuditFramework] = useState<any>('SOX');
  const [newAuditSev, setNewAuditSev] = useState<any>('Critical');
  const [newAuditBu, setNewAuditBu] = useState('Global Markets');
  const [newAuditDesc, setNewAuditDesc] = useState('');

  const [newDebtSystem, setNewDebtSystem] = useState('');
  const [newDebtCategory, setNewDebtCategory] = useState<any>('Legacy OS');
  const [newDebtBu, setNewDebtBu] = useState('Consumer Tech');
  const [newDebtRisk, setNewDebtRisk] = useState('85');
  const [newDebtCost, setNewDebtCost] = useState('150000');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleUpdateFindingStatus = (id: string, newStatus: PostureFinding['status']) => {
    setPostureFindings(prev => prev.map(f => f.id === id ? { ...f, status: newStatus } : f));
  };

  const handleCreateAudit = (e: FormEvent) => {
    e.preventDefault();
    if (!newAuditTitle.trim()) return;
    const newItem: AuditIssue = {
      id: `AUD-2024-${Math.floor(160 + Math.random() * 40)}`,
      title: newAuditTitle,
      framework: newAuditFramework,
      severity: newAuditSev,
      businessUnit: newAuditBu,
      buLead: 'Assigned BU Lead',
      identifiedDate: new Date().toISOString().split('T')[0],
      targetDate: '2024-11-30',
      daysOpen: 5,
      isOverdue: false,
      status: 'Open',
      description: newAuditDesc || 'Automated audit finding registered.',
      managementActionPlan: 'Action plan pending SVP review.',
      progressPercent: 10,
      leadAuditor: 'Internal InfoSec Audit'
    };
    setAuditIssues([newItem, ...auditIssues]);
    setShowAddAuditModal(false);
    setNewAuditTitle('');
    setNewAuditDesc('');
    showToast('Audit finding successfully registered.');
  };

  const handleDeleteAudit = (id: string) => {
    setAuditIssues(auditIssues.filter(item => item.id !== id));
    showToast('Audit finding removed.');
  };

  const handleCreateDebt = (e: FormEvent) => {
    e.preventDefault();
    if (!newDebtSystem.trim()) return;
    const newItem: TechDebtItem = {
      id: `DEBT-${Math.floor(10 + Math.random() * 90)}`,
      systemName: newDebtSystem,
      category: newDebtCategory,
      businessUnit: newDebtBu,
      riskScore: parseInt(newDebtRisk) || 80,
      eolDate: '2024-12-31',
      status: 'Critical EOL',
      replacementProject: 'Cloud Modernization Initiative',
      targetRetirementDate: '2025-06-30',
      affectedEndpoints: 45,
      annualMaintenanceCost: parseInt(newDebtCost) || 120000,
      estModernizationBudget: 300000,
      remediationProgress: 10
    };
    setTechDebtItems([newItem, ...techDebtItems]);
    setShowAddDebtModal(false);
    setNewDebtSystem('');
    showToast('Technology debt item successfully added.');
  };

  const handleDeleteDebt = (id: string) => {
    setTechDebtItems(techDebtItems.filter(item => item.id !== id));
    showToast('Technology debt record removed.');
  };

  // Sorting state for Business Unit table
  const [buSortField, setBuSortField] = useState<'businessUnit' | 'securityScore' | 'mttrDays' | 'slaComplianceRate' | 'openAuditCount'>('securityScore');
  const [buSortOrder, setBuSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sorting state for Audit table
  const [auditSortField, setAuditSortField] = useState<'title' | 'framework' | 'severity' | 'businessUnit' | 'targetDate' | 'status'>('severity');
  const [auditSortOrder, setAuditSortOrder] = useState<'asc' | 'desc'>('desc');

  // Sorting state for Tech Debt table
  const [debtSortField, setDebtSortField] = useState<'systemName' | 'category' | 'businessUnit' | 'riskScore' | 'annualMaintenanceCost' | 'targetRetirementDate'>('riskScore');
  const [debtSortOrder, setDebtSortOrder] = useState<'asc' | 'desc'>('desc');

  const handleBuSort = (field: 'businessUnit' | 'securityScore' | 'mttrDays' | 'slaComplianceRate' | 'openAuditCount') => {
    if (buSortField === field) {
      setBuSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setBuSortField(field);
      setBuSortOrder(field === 'businessUnit' ? 'asc' : 'desc');
    }
  };

  const handleAuditSort = (field: 'title' | 'framework' | 'severity' | 'businessUnit' | 'targetDate' | 'status') => {
    if (auditSortField === field) {
      setAuditSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setAuditSortField(field);
      setAuditSortOrder(field === 'severity' ? 'desc' : 'asc');
    }
  };

  const handleDebtSort = (field: 'systemName' | 'category' | 'businessUnit' | 'riskScore' | 'annualMaintenanceCost' | 'targetRetirementDate') => {
    if (debtSortField === field) {
      setDebtSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setDebtSortField(field);
      setDebtSortOrder(field === 'riskScore' ? 'desc' : 'asc');
    }
  };

  const renderSortIcon = (active: boolean, order: 'asc' | 'desc') => {
    if (!active) {
      return <ArrowUpDown className="w-3 h-3 text-slate-400 opacity-50 group-hover:opacity-100 transition-opacity" />;
    }
    return order === 'asc' 
      ? <ArrowUp className="w-3 h-3 text-indigo-600 font-bold" />
      : <ArrowDown className="w-3 h-3 text-indigo-600 font-bold" />;
  };

  const sortedBuMetrics = useMemo(() => {
    return [...BU_PERFORMANCE_METRICS].sort((a, b) => {
      let comparison = 0;
      if (buSortField === 'businessUnit') {
        comparison = a.businessUnit.localeCompare(b.businessUnit);
      } else {
        comparison = (a[buSortField] ?? 0) - (b[buSortField] ?? 0);
      }
      return buSortOrder === 'asc' ? comparison : -comparison;
    });
  }, [buSortField, buSortOrder]);

  const filteredAuditIssues = auditIssues.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.businessUnit.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const sortedAuditIssues = useMemo(() => {
    return [...filteredAuditIssues].sort((a, b) => {
      let comparison = 0;
      if (auditSortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (auditSortField === 'framework') {
        comparison = a.framework.localeCompare(b.framework);
      } else if (auditSortField === 'severity') {
        const severityWeight: Record<string, number> = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };
        comparison = (severityWeight[a.severity] || 0) - (severityWeight[b.severity] || 0);
      } else if (auditSortField === 'businessUnit') {
        comparison = a.businessUnit.localeCompare(b.businessUnit);
      } else if (auditSortField === 'targetDate') {
        comparison = new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime();
      } else if (auditSortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      return auditSortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredAuditIssues, auditSortField, auditSortOrder]);

  const sortedTechDebtItems = useMemo(() => {
    return [...techDebtItems].sort((a, b) => {
      let comparison = 0;
      if (debtSortField === 'systemName') {
        comparison = a.systemName.localeCompare(b.systemName);
      } else if (debtSortField === 'category') {
        comparison = a.category.localeCompare(b.category);
      } else if (debtSortField === 'businessUnit') {
        comparison = a.businessUnit.localeCompare(b.businessUnit);
      } else if (debtSortField === 'riskScore') {
        comparison = a.riskScore - b.riskScore;
      } else if (debtSortField === 'annualMaintenanceCost') {
        comparison = a.annualMaintenanceCost - b.annualMaintenanceCost;
      } else if (debtSortField === 'targetRetirementDate') {
        comparison = new Date(a.targetRetirementDate).getTime() - new Date(b.targetRetirementDate).getTime();
      }
      return debtSortOrder === 'asc' ? comparison : -comparison;
    });
  }, [techDebtItems, debtSortField, debtSortOrder]);

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return (
          <>
            {/* Top Metrics Row */}
            <div className="col-span-12 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overall Security Score</span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">+2.4% MoM</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-slate-900">{EXECUTIVE_INSIGHTS.overallScore}</span>
                    <span className="text-xs text-slate-400">/ 100 Target: 90.0</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${EXECUTIVE_INSIGHTS.overallScore}%` }}></div>
                </div>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Critical Audit Findings</span>
                    <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">Action Req</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-rose-600">{auditIssues.filter(i => i.severity === 'Critical').length}</span>
                    <span className="text-xs text-slate-400">Open items</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2.5">SOX & PCI-DSS primary drivers</p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Firm-Wide MTTR</span>
                    <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">14% Faster</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-slate-900">{VAM_POSTURE.averageMttrDays}</span>
                    <span className="text-xs text-slate-400">Days avg (&lt;14d SLA)</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2.5">Beating target SLA thresholds</p>
              </div>

              <div className="bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Legacy OS Exposure</span>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">EOL Risk</span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-3xl font-black text-slate-900">{EXECUTIVE_INSIGHTS.legacyOsShare}%</span>
                    <span className="text-xs text-slate-400">Target: &lt;10%</span>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2.5">240 Windows 2012 VMs remaining</p>
              </div>
            </div>

            {/* Open Source Banner & Quick Action */}
            <div className="col-span-12 bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-900 text-white rounded-xl p-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="bg-indigo-500 text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Open-Source Telemetry Mesh</span>
                  <span className="text-[10px] text-indigo-200">DefectDojo • Wazuh XDR • OpenVAS • Cloud Custodian • BloodHound</span>
                </div>
                <h3 className="text-sm font-bold text-white">Unified Security Governance & Attack Surface Telemetry</h3>
                <p className="text-[11px] text-indigo-100/80 max-w-2xl">
                  Real-time aggregation from 12 posture collectors, continuous audit observation tracking, and automated remediation playbooks.
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => setShowOpenSourceModal(true)}
                  className="px-3 py-1.5 bg-white text-slate-900 rounded-lg font-bold text-xs hover:bg-slate-100 transition shadow-2xs"
                >
                  View Open-Source Stack
                </button>
                <button 
                  onClick={() => setShowBoardroomModal(true)}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-xs hover:bg-indigo-500 transition shadow-2xs flex items-center gap-1.5"
                >
                  <Presentation className="w-3.5 h-3.5" /> Boardroom Deck
                </button>
              </div>
            </div>

            {/* Business Unit Performance Table (Compact) */}
            <div className="col-span-12 lg:col-span-8 bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs">
              <div className="flex justify-between items-center mb-3">
                <div>
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Business Unit Accountability & Posture</h3>
                  <p className="text-[11px] text-slate-500">Tracking risk scores, MTTR days, and SLA compliance across operating units.</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs table-auto">
                  <thead className="text-[10px] text-slate-400 uppercase font-bold border-b border-slate-100 pb-2">
                    <tr>
                      <th 
                        onClick={() => handleBuSort('businessUnit')}
                        className="pb-2 break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                        title="Sort by Business Unit & Lead"
                      >
                        <div className="flex items-center gap-1">
                          <span>Business Unit & Lead</span>
                          {renderSortIcon(buSortField === 'businessUnit', buSortOrder)}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleBuSort('securityScore')}
                        className="pb-2 text-center break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                        title="Sort by Security Score"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>Score</span>
                          {renderSortIcon(buSortField === 'securityScore', buSortOrder)}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleBuSort('mttrDays')}
                        className="pb-2 text-center break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                        title="Sort by MTTR Days"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>MTTR</span>
                          {renderSortIcon(buSortField === 'mttrDays', buSortOrder)}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleBuSort('slaComplianceRate')}
                        className="pb-2 text-center break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                        title="Sort by SLA Compliance Rate"
                      >
                        <div className="flex items-center justify-center gap-1">
                          <span>SLA Compliance</span>
                          {renderSortIcon(buSortField === 'slaComplianceRate', buSortOrder)}
                        </div>
                      </th>
                      <th 
                        onClick={() => handleBuSort('openAuditCount')}
                        className="pb-2 text-right break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                        title="Sort by Open Audits Count"
                      >
                        <div className="flex items-center justify-end gap-1">
                          <span>Open Audits</span>
                          {renderSortIcon(buSortField === 'openAuditCount', buSortOrder)}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedBuMetrics.map(bu => (
                      <tr key={bu.businessUnit} className="hover:bg-slate-50/70 transition">
                        <td className="py-2.5 break-words">
                          <p className="font-bold text-slate-800 text-xs break-words">{bu.businessUnit}</p>
                          <p className="text-[10px] text-slate-400 break-words">Lead: {bu.buLead}</p>
                        </td>
                        <td className="py-2.5 text-center break-words">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            bu.securityScore >= 85 ? 'bg-emerald-50 text-emerald-700' : 
                            bu.securityScore >= 75 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {bu.securityScore}
                          </span>
                        </td>
                        <td className="py-2.5 text-center font-semibold text-slate-700 text-xs break-words">{bu.mttrDays}d</td>
                        <td className="py-2.5 text-center font-semibold text-slate-700 text-xs break-words">{bu.slaComplianceRate}%</td>
                        <td className="py-2.5 text-right font-bold text-rose-600 text-xs break-words">{bu.openAuditCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Critical Incident Feed (Compact) */}
            <div className="col-span-12 lg:col-span-4 bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Live Telemetry Incident Feed</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">Stream Active</span>
                </div>
                <div className="space-y-2.5">
                  {INITIAL_INCIDENTS.slice(0, 3).map(inc => (
                    <div key={inc.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-bold text-slate-900 leading-tight">{inc.title}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          inc.severity === 'Critical' ? 'bg-rose-100 text-rose-700' : 
                          inc.severity === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-slate-200 text-slate-700'
                        }`}>
                          {inc.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">{inc.summary}</p>
                      <div className="flex justify-between items-center pt-1 border-t border-slate-200/60 text-[10px] text-slate-400">
                        <span>{inc.businessUnit}</span>
                        <span className="font-semibold text-indigo-600">{inc.timeAgo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        );

      case 'tprm':
        return <TprmView onNotify={showToast} />;

      case 'siem-soar':
        return <SiemSoarView onNotify={showToast} />;

      case 'kri-kar':
        return <KarKriView onNotify={showToast} />;

      case 'attack-paths':
        return <AttackPathsView onNotify={showToast} />;

      case 'mitre':
        return <MitreSiemView onNotify={showToast} />;

      case 'sod':
        return <SodGovernanceView onNotify={showToast} />;

      case 'mesh':
        return <OpenSourceMeshView onNotify={showToast} />;

      case 'training':
        return <TrainingView onNotify={showToast} />;

      case 'ztna':
        return <ZtnaView findings={postureFindings} onUpdateFindingStatus={handleUpdateFindingStatus} onNotify={showToast} />;

      case 'nhi-secrets':
        return <NhiSecretsView findings={postureFindings} onUpdateFindingStatus={handleUpdateFindingStatus} onNotify={showToast} />;

      case 'itdr':
        return <ItdrView findings={postureFindings} onUpdateFindingStatus={handleUpdateFindingStatus} onNotify={showToast} />;

      // Granular Security Posture Items (VAM, Cloud, Network, CI/CD, IAM, Privacy, AI Security, CAASM)
      case 'vam':
      case 'cloud-sec':
      case 'network-sec':
      case 'cicd-sec':
      case 'iam':
      case 'privacy':
      case 'ai-security':
      case 'caasm':
        return (
          <PostureDetailView 
            domain={activeView as PostureDomain} 
            findings={postureFindings}
            onUpdateFindingStatus={handleUpdateFindingStatus}
            onNotify={showToast} 
          />
        );

      case 'audit':
        return (
          <div className="col-span-12 bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900">Audit & Compliance Findings</h2>
                <p className="text-xs text-slate-500">Manage internal and external audit observations (SOX, ISO 27001, PCI-DSS, SOC 2).</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative w-48">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    placeholder="Search findings..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-7 pr-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                  />
                </div>
                <select 
                  value={severityFilter} 
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-medium"
                >
                  <option value="ALL">All Severities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
                <button 
                  onClick={() => setShowAddAuditModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500 transition shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Finding
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs table-auto">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th 
                      onClick={() => handleAuditSort('title')}
                      className="py-2 px-3 break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                      title="Sort by ID or Title"
                    >
                      <div className="flex items-center gap-1">
                        <span>ID / Title</span>
                        {renderSortIcon(auditSortField === 'title', auditSortOrder)}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleAuditSort('framework')}
                      className="py-2 px-2.5 break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                      title="Sort by Compliance Framework"
                    >
                      <div className="flex items-center gap-1">
                        <span>Framework</span>
                        {renderSortIcon(auditSortField === 'framework', auditSortOrder)}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleAuditSort('severity')}
                      className="py-2 px-2.5 break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                      title="Sort by Finding Severity"
                    >
                      <div className="flex items-center gap-1">
                        <span>Severity</span>
                        {renderSortIcon(auditSortField === 'severity', auditSortOrder)}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleAuditSort('businessUnit')}
                      className="py-2 px-2.5 break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                      title="Sort by Business Unit & Lead"
                    >
                      <div className="flex items-center gap-1">
                        <span>Business Unit & Lead</span>
                        {renderSortIcon(auditSortField === 'businessUnit', auditSortOrder)}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleAuditSort('targetDate')}
                      className="py-2 px-2.5 break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                      title="Sort by Target SLA Date"
                    >
                      <div className="flex items-center gap-1">
                        <span>Target SLA Date</span>
                        {renderSortIcon(auditSortField === 'targetDate', auditSortOrder)}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleAuditSort('status')}
                      className="py-2 px-2.5 break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                      title="Sort by Status"
                    >
                      <div className="flex items-center gap-1">
                        <span>Status</span>
                        {renderSortIcon(auditSortField === 'status', auditSortOrder)}
                      </div>
                    </th>
                    <th className="py-2 px-2.5 text-right break-words">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedAuditIssues.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-3 max-w-sm break-words">
                        <span className="font-mono text-[10px] text-indigo-600 font-bold break-all">{item.id}</span>
                        <p className="font-bold text-slate-900 text-xs mt-0.5 break-words">{item.title}</p>
                        <p className="text-[11px] text-slate-500 break-words mt-0.5 whitespace-normal">{item.description}</p>
                      </td>
                      <td className="py-2.5 px-2.5 break-words">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-semibold text-slate-700 inline-block break-words">{item.framework}</span>
                      </td>
                      <td className="py-2.5 px-2.5 break-words">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                          item.severity === 'Critical' ? 'bg-rose-100 text-rose-700' : 
                          item.severity === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.severity}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 break-words">
                        <p className="font-medium text-slate-800 text-xs break-words">{item.businessUnit}</p>
                        <p className="text-[10px] text-slate-400 break-words">Auditor: {item.leadAuditor}</p>
                      </td>
                      <td className="py-2.5 px-2.5 text-xs font-semibold text-slate-600 break-words">{item.targetDate}</td>
                      <td className="py-2.5 px-2.5 break-words">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                          item.status === 'Overdue' ? 'bg-rose-50 text-rose-700' : 
                          item.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 text-right">
                        <button 
                          onClick={() => handleDeleteAudit(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                          title="Delete Finding"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'tech-debt':
        return (
          <div className="col-span-12 bg-white border border-slate-200/90 rounded-xl p-3.5 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-black text-slate-900">Technology Debt & End-of-Life (EOL) Tracking</h2>
                <p className="text-xs text-slate-500">Monitor unsupported operating systems, legacy databases, and modernization budgets.</p>
              </div>
              <button 
                onClick={() => setShowAddDebtModal(true)}
                className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500 transition shadow-2xs shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Add Tech Debt Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs table-auto">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th 
                      onClick={() => handleDebtSort('systemName')}
                      className="py-2 px-3 break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                      title="Sort by System / Asset Name"
                    >
                      <div className="flex items-center gap-1">
                        <span>System / Asset Name</span>
                        {renderSortIcon(debtSortField === 'systemName', debtSortOrder)}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleDebtSort('category')}
                      className="py-2 px-2.5 break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                      title="Sort by Category"
                    >
                      <div className="flex items-center gap-1">
                        <span>Category</span>
                        {renderSortIcon(debtSortField === 'category', debtSortOrder)}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleDebtSort('businessUnit')}
                      className="py-2 px-2.5 break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                      title="Sort by Business Unit"
                    >
                      <div className="flex items-center gap-1">
                        <span>Business Unit</span>
                        {renderSortIcon(debtSortField === 'businessUnit', debtSortOrder)}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleDebtSort('riskScore')}
                      className="py-2 px-2.5 text-center break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                      title="Sort by Risk Score"
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Risk Score</span>
                        {renderSortIcon(debtSortField === 'riskScore', debtSortOrder)}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleDebtSort('annualMaintenanceCost')}
                      className="py-2 px-2.5 break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                      title="Sort by Annual Maintenance Cost"
                    >
                      <div className="flex items-center gap-1">
                        <span>Annual Maint. Cost</span>
                        {renderSortIcon(debtSortField === 'annualMaintenanceCost', debtSortOrder)}
                      </div>
                    </th>
                    <th 
                      onClick={() => handleDebtSort('targetRetirementDate')}
                      className="py-2 px-2.5 break-words cursor-pointer hover:text-indigo-600 select-none group transition-colors"
                      title="Sort by Target Retirement Date"
                    >
                      <div className="flex items-center gap-1">
                        <span>Target Retirement</span>
                        {renderSortIcon(debtSortField === 'targetRetirementDate', debtSortOrder)}
                      </div>
                    </th>
                    <th className="py-2 px-2.5 text-right break-words">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {sortedTechDebtItems.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-2.5 px-3 break-words">
                        <span className="font-mono text-[10px] text-indigo-600 font-bold break-all">{item.id}</span>
                        <p className="font-bold text-slate-900 text-xs mt-0.5 break-words">{item.systemName}</p>
                        <p className="text-[11px] text-slate-500 break-words mt-0.5 whitespace-normal">{item.replacementProject}</p>
                      </td>
                      <td className="py-2.5 px-2.5 break-words">
                        <span className="px-2 py-0.5 bg-slate-100 rounded text-[11px] font-semibold text-slate-700 inline-block break-words">{item.category}</span>
                      </td>
                      <td className="py-2.5 px-2.5 font-medium text-slate-700 text-xs break-words">{item.businessUnit}</td>
                      <td className="py-2.5 px-2.5 text-center break-words">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                          item.riskScore >= 90 ? 'bg-rose-100 text-rose-700' : 
                          item.riskScore >= 75 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {item.riskScore}
                        </span>
                      </td>
                      <td className="py-2.5 px-2.5 font-semibold text-slate-900 text-xs break-words">${item.annualMaintenanceCost.toLocaleString()}</td>
                      <td className="py-2.5 px-2.5 text-xs font-semibold text-slate-600 break-words">{item.targetRetirementDate}</td>
                      <td className="py-2.5 px-2.5 text-right">
                        <button 
                          onClick={() => handleDeleteDebt(item.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                          title="Delete Tech Debt Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return <div className="col-span-12 p-4 text-center">View not found</div>;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden">
      {/* Live Ticker Banner */}
      <LiveTelemetryTicker 
        initialIncidents={INITIAL_INCIDENTS}
        onSelectIncident={() => setActiveView('overview')}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2.5 text-xs font-bold animate-bounce border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Boardroom Briefing Modal */}
      <BoardroomModal 
        isOpen={showBoardroomModal}
        onClose={() => setShowBoardroomModal(false)}
        onNotify={showToast}
      />

      {/* Open Source Stack Modal */}
      {showOpenSourceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-xl max-w-2xl w-full p-5 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Open-Source Security & Governance Stack</h3>
                <p className="text-xs text-slate-500">Frameworks and telemetry pipelines integrated into CyberGuard Control Center</p>
              </div>
              <button onClick={() => setShowOpenSourceModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto text-xs text-slate-700 pr-1">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-bold text-slate-900 text-xs">1. DefectDojo (Vulnerability Management & Orchestration)</h4>
                <p className="text-slate-600 mt-0.5 text-[11px]">Open-source application vulnerability correlation and security orchestration tool used to ingest scan results from SAST, DAST, and SCA scanners into unified dashboards.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-bold text-slate-900 text-xs">2. Wazuh (SIEM & Extended Detection Response - XDR)</h4>
                <p className="text-slate-600 mt-0.5 text-[11px]">Open-source security monitoring platform providing threat detection, integrity monitoring, incident response, and compliance auditing across endpoints and containers.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-bold text-slate-900 text-xs">3. OpenVAS / Greenbone Vulnerability Management (GVM)</h4>
                <p className="text-slate-600 mt-0.5 text-[11px]">Comprehensive vulnerability scanner utilized for network asset discovery, port scanning, and CVE compliance checking.</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-bold text-slate-900 text-xs">4. Cloud Custodian (Cloud Security Posture Management - CSPM)</h4>
                <p className="text-slate-600 mt-0.5 text-[11px]">Open-source rules engine for managing cloud accounts, enforcing tagging standards, stopping unencrypted storage, and remediating misconfigurations.</p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button 
                onClick={() => setShowOpenSourceModal(false)}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-500 transition"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Audit Finding Modal */}
      {showAddAuditModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-0.5">Register New Audit Finding</h3>
            <p className="text-xs text-slate-500 mb-4">Add a compliance or audit observation for executive tracking.</p>
            
            <form onSubmit={handleCreateAudit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Finding Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Unsecured S3 Bucket in Payment Gateway"
                  value={newAuditTitle}
                  onChange={(e) => setNewAuditTitle(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Framework</label>
                  <select 
                    value={newAuditFramework} 
                    onChange={(e: any) => setNewAuditFramework(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="SOX">SOX</option>
                    <option value="ISO 27001">ISO 27001</option>
                    <option value="NIST CSF">NIST CSF</option>
                    <option value="PCI-DSS">PCI-DSS</option>
                    <option value="SOC 2">SOC 2</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Severity</label>
                  <select 
                    value={newAuditSev} 
                    onChange={(e: any) => setNewAuditSev(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Business Unit</label>
                <select 
                  value={newAuditBu} 
                  onChange={(e) => setNewAuditBu(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                >
                  <option value="Global Markets">Global Markets</option>
                  <option value="Consumer Tech">Consumer Tech</option>
                  <option value="Retail Banking">Retail Banking</option>
                  <option value="Logistics & Ops">Logistics & Ops</option>
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description & Remediation Plan</label>
                <textarea 
                  rows={2}
                  placeholder="Describe risk and management action plan..."
                  value={newAuditDesc}
                  onChange={(e) => setNewAuditDesc(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                ></textarea>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddAuditModal(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500"
                >
                  Save Finding
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Tech Debt Modal */}
      {showAddDebtModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white rounded-xl max-w-lg w-full p-5 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 mb-0.5">Add Technology Debt / EOL Asset</h3>
            <p className="text-xs text-slate-500 mb-4">Track legacy infrastructure and modernization budgets.</p>
            
            <form onSubmit={handleCreateDebt} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">System / Asset Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Windows Server 2008 Cluster"
                  value={newDebtSystem}
                  onChange={(e) => setNewDebtSystem(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select 
                    value={newDebtCategory} 
                    onChange={(e: any) => setNewDebtCategory(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Legacy OS">Legacy OS</option>
                    <option value="Database">Database</option>
                    <option value="Monolithic App">Monolithic App</option>
                    <option value="Deprecated Protocol">Deprecated Protocol</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Risk Score (1-100)</label>
                  <input 
                    type="number"
                    min="1"
                    max="100"
                    value={newDebtRisk}
                    onChange={(e) => setNewDebtRisk(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Annual Maintenance Cost ($)</label>
                <input 
                  type="number"
                  value={newDebtCost}
                  onChange={(e) => setNewDebtCost(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddDebtModal(false)}
                  className="px-3.5 py-1.5 border border-slate-200 rounded-lg font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500"
                >
                  Save Debt Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main Body Layout with Compact Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Compact Sidebar */}
        <aside className="w-56 border-r border-slate-200 bg-white flex flex-col shrink-0">
          <div className="p-3 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-xs">C</div>
              <div>
                <span className="font-black text-xs tracking-tight text-slate-900 block">CYBERGUARD</span>
                <span className="text-[9px] text-slate-400 font-medium">Enterprise GRC v4.2</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-2 space-y-0.5 text-xs overflow-y-auto">
            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">Executive Overview</div>
            <button onClick={() => setActiveView('overview')} className={`flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg font-semibold transition ${activeView === 'overview' ? 'bg-indigo-50 text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
              <LayoutDashboard className="w-3.5 h-3.5 text-indigo-600" /> <span>Dashboard Overview</span>
            </button>
            <button onClick={() => setShowBoardroomModal(true)} className="flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg font-semibold transition text-slate-600 hover:bg-slate-50">
              <Presentation className="w-3.5 h-3.5 text-indigo-600" /> <span>Boardroom Briefing</span>
            </button>
            <button onClick={() => setActiveView('kri-kar')} className={`flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg font-semibold transition ${activeView === 'kri-kar' ? 'bg-indigo-50 text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Activity className="w-3.5 h-3.5 text-amber-600" /> <span>KRIs & KARs (FAIR)</span>
            </button>

            <div className="pt-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">Operations & Telemetry</div>
            <button onClick={() => setActiveView('tprm')} className={`flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg font-semibold transition ${activeView === 'tprm' ? 'bg-indigo-50 text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Building2 className="w-3.5 h-3.5 text-indigo-600" /> <span>Third-Party Risk (TPRM)</span>
            </button>
            <button onClick={() => setActiveView('siem-soar')} className={`flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg font-semibold transition ${activeView === 'siem-soar' ? 'bg-indigo-50 text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Zap className="w-3.5 h-3.5 text-rose-600" /> <span>SIEM & SOAR Ops</span>
            </button>

            <div className="pt-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">IAM, PAM & Zero Trust</div>
            {[
              { id: 'iam', name: 'IAM & Privileged PAM', icon: KeyRound },
              { id: 'ztna', name: 'Zero Trust Access (ZTNA)', icon: ShieldCheck },
              { id: 'nhi-secrets', name: 'Non-Human IDs & Secrets', icon: Bot },
              { id: 'itdr', name: 'Identity Threat (ITDR)', icon: Crosshair },
              { id: 'sod', name: 'Segregation of Duties', icon: Lock },
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveView(item.id)} 
                className={`flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg font-semibold transition ${
                  activeView === item.id ? 'bg-indigo-50 text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-3.5 h-3.5 text-indigo-600" /> <span className="truncate">{item.name}</span>
              </button>
            ))}

            <div className="pt-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">Security Posture (ASP)</div>
            {[
              { id: 'vam', name: 'Vulnerability (VAM)', icon: ScanEye },
              { id: 'cloud-sec', name: 'Cloud Security (CSPM)', icon: Cloud },
              { id: 'network-sec', name: 'Network & Perimeter', icon: Network },
              { id: 'cicd-sec', name: 'CI/CD & SCM Posture', icon: GitBranch },
              { id: 'privacy', name: 'Data Privacy & DLP', icon: ShieldCheck },
              { id: 'ai-security', name: 'AI Security & LLMs', icon: BrainCircuit },
              { id: 'attack-paths', name: 'Offensive Attack Paths', icon: ShieldAlert },
              { id: 'mitre', name: 'MITRE ATT&CK Matrix', icon: Layers },
              { id: 'caasm', name: 'Asset Inventory (CAASM)', icon: Server },
              { id: 'mesh', name: 'Open-Source Mesh', icon: Database },
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveView(item.id)} 
                className={`flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg font-semibold transition ${
                  activeView === item.id ? 'bg-indigo-50 text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <item.icon className="w-3.5 h-3.5 text-slate-500" /> <span className="truncate">{item.name}</span>
              </button>
            ))}

            <div className="pt-2 text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1 px-2">GRC & Human Risk</div>
            <button onClick={() => setActiveView('audit')} className={`flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg font-semibold transition ${activeView === 'audit' ? 'bg-indigo-50 text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> <span>Audit Issues ({auditIssues.length})</span>
            </button>
            <button onClick={() => setActiveView('tech-debt')} className={`flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg font-semibold transition ${activeView === 'tech-debt' ? 'bg-indigo-50 text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
              <Database className="w-3.5 h-3.5 text-amber-600" /> <span>Tech Debt ({techDebtItems.length})</span>
            </button>
            <button onClick={() => setActiveView('training')} className={`flex w-full items-center gap-2 px-2.5 py-1.5 rounded-lg font-semibold transition ${activeView === 'training' ? 'bg-indigo-50 text-indigo-700 shadow-2xs font-bold' : 'text-slate-600 hover:bg-slate-50'}`}>
              <BookOpenText className="w-3.5 h-3.5 text-emerald-600" /> <span>Security Training</span>
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="h-12 bg-white border-b border-slate-200 flex items-center justify-between px-4 shrink-0">
            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-900">Global Security & Governance Control Center</h1>
              <p className="text-[10px] text-slate-500 hidden sm:block">Real-time enterprise posture • Live telemetry from DefectDojo, Wiz, & Wazuh • Last Sync: 2m ago</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowBoardroomModal(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-slate-200 rounded-lg font-bold bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition"
              >
                <Presentation className="w-3.5 h-3.5 text-indigo-600" /> Deck
              </button>
              <button 
                onClick={() => showToast('Exporting executive PDF summary report...')}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-slate-200 rounded-lg font-bold bg-white hover:bg-slate-50 text-slate-700 shadow-2xs transition"
              >
                <Download className="w-3.5 h-3.5" /> Export
              </button>
              <button 
                onClick={() => showToast('Secure summary link copied & dispatched to BU Leads.')}
                className="flex items-center gap-1.5 px-3 py-1 text-xs bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-500 shadow-2xs transition"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
            </div>
          </header>
          
          <section className="flex-1 p-3.5 sm:p-4 overflow-y-auto grid grid-cols-12 gap-3 bg-slate-50/50">
            {renderContent()}
          </section>
        </main>
      </div>
    </div>
  );
}
