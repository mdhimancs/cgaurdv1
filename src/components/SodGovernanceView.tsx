import { useState } from 'react';
import { 
  Lock, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  User, 
  Building2, 
  CheckCircle2, 
  RotateCw, 
  Search, 
  FileText, 
  Clock, 
  SlidersHorizontal,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  KeyRound,
  Shield,
  Zap,
  Users,
  Layers,
  ArrowRightLeft,
  Check,
  Ban,
  Activity,
  Award
} from 'lucide-react';

interface Props {
  onNotify: (msg: string) => void;
}

export interface SodConflictItem {
  id: string;
  ruleCode: string;
  title: string;
  systemName: string;
  roleA: string;
  roleB: string;
  violatingUser: string;
  userEmail: string;
  userTitle: string;
  businessUnit: string;
  severity: 'Critical' | 'High' | 'Medium';
  riskScore: number;
  identifiedDate: string;
  targetDate: string;
  daysOpen: number;
  timeSinceOpenText: string;
  isOverdue: boolean;
  owner: string;
  accountable: string;
  status: 'Overdue' | 'In Progress' | 'Under Review' | 'Remediated';
  auditImpact: string;
  fraudRisk: 'Severe' | 'Elevated' | 'Moderate';
  lastActivityWithBothRoles: string;
  recommendedAction: string;
}

interface SodRulePolicy {
  code: string;
  name: string;
  domain: 'Finance & Payments' | 'Cloud Infrastructure' | 'Core Banking' | 'DevSecOps & CI/CD' | 'HR & Payroll';
  framework: 'SOX 404' | 'PCI-DSS 10.5' | 'ISO 27001' | 'FFIEC' | 'SOC 2 Type II';
  conflictingRole1: string;
  conflictingRole2: string;
  activeViolationsCount: number;
  compensatingControlRequired: boolean;
  leadArchitect: string;
}

interface CertificationCampaign {
  id: string;
  name: string;
  businessUnit: string;
  reviewerLead: string;
  totalEntitlements: number;
  certifiedCount: number;
  revokedCount: number;
  completionRate: number;
  dueDate: string;
  status: 'On Track' | 'At Risk' | 'Overdue';
}

interface MakerCheckerAudit {
  id: string;
  operation: string;
  system: string;
  makerUser: string;
  checkerUser: string;
  amountOrScope: string;
  timestamp: string;
  status: 'Approved & Dual-Signed' | 'Pending Checker Sign-Off' | 'Rejected / Blocked';
}

const INITIAL_SOD_CONFLICTS: SodConflictItem[] = [
  {
    id: 'SOD-2024-001',
    ruleCode: 'SOD-FIN-01',
    title: 'SAP AP Invoice Creation & Direct Payment Release',
    systemName: 'SAP S/4HANA ERP (Finance)',
    roleA: 'SAP_FI_AP_INVOICE_CREATE',
    roleB: 'SAP_FI_AP_PAYMENT_RELEASE',
    violatingUser: 'Sarah Jenkins',
    userEmail: 'sarah.jenkins@globalbank.corp',
    userTitle: 'Senior Treasury Analyst',
    businessUnit: 'Global Markets',
    severity: 'Critical',
    riskScore: 96,
    identifiedDate: '2024-08-06',
    targetDate: '2024-08-16',
    daysOpen: 18,
    timeSinceOpenText: '18 days (8d Overdue)',
    isOverdue: true,
    owner: 'Arthur Pendelton (IGA Architect)',
    accountable: 'Elena Rostova (EVP Markets)',
    status: 'Overdue',
    auditImpact: 'SOX 404 Key Control Failure: Unauthorized ledger disbursement without dual control.',
    fraudRisk: 'Severe',
    lastActivityWithBothRoles: 'Yesterday at 16:42 UTC ($140,000 disbursement executed)',
    recommendedAction: 'Immediately strip SAP_FI_AP_PAYMENT_RELEASE and assign to dedicated controller.'
  },
  {
    id: 'SOD-2024-002',
    ruleCode: 'SOD-AWS-04',
    title: 'AWS Cloud Admin & CloudTrail Audit Log Deleter',
    systemName: 'AWS Multi-Account Core Infrastructure',
    roleA: 'AWS_IAM_FullAdministratorAccess',
    roleB: 'AWS_CloudTrail_SecurityAuditor_Admin',
    violatingUser: 'Kevin Thorne',
    userEmail: 'kevin.t@consumertech.bank',
    userTitle: 'Lead DevOps Specialist',
    businessUnit: 'Consumer Tech',
    severity: 'Critical',
    riskScore: 92,
    identifiedDate: '2024-08-10',
    targetDate: '2024-08-20',
    daysOpen: 14,
    timeSinceOpenText: '14 days (4d Overdue)',
    isOverdue: true,
    owner: 'Liam Chen (Cloud Sec Lead)',
    accountable: 'Marcus Vance (VP Consumer Tech)',
    status: 'Overdue',
    auditImpact: 'ISO 27001 A.12.4.3 & PCI-DSS 10.5: Administrator can alter infrastructure and erase audit trail without detection.',
    fraudRisk: 'Severe',
    lastActivityWithBothRoles: '3 days ago (CloudTrail config modified)',
    recommendedAction: 'Enforce AWS Organizations SCP denying CloudTrail stopLogging/deleteTrail for all dev IAM roles.'
  },
  {
    id: 'SOD-2024-003',
    ruleCode: 'SOD-BNK-02',
    title: 'Core Banking Account Provisioning & Credit Limit Overrider',
    systemName: 'Finacle Core Banking System',
    roleA: 'CORE_ACCT_PROVISION_MAKER',
    roleB: 'CORE_CREDIT_LIMIT_OVERRIDE_CHECKER',
    violatingUser: 'Rajesh Patel',
    userEmail: 'rajesh.p@retail.bank.corp',
    userTitle: 'Branch Operations Officer',
    businessUnit: 'Retail Banking',
    severity: 'High',
    riskScore: 88,
    identifiedDate: '2024-08-14',
    targetDate: '2024-08-28',
    daysOpen: 10,
    timeSinceOpenText: '10 days open',
    isOverdue: false,
    owner: 'Carlos Gomez (Access Cert Specialist)',
    accountable: 'Sanjay Mehta (MD Retail Banking)',
    status: 'In Progress',
    auditImpact: 'FFIEC Retail Risk: Single individual can open new customer account and grant unbacked $500k credit line.',
    fraudRisk: 'Elevated',
    lastActivityWithBothRoles: '5 days ago (Credit line adjusted)',
    recommendedAction: 'Segregate maker-checker roles into separate Okta groups and enforce 4-eyes approval.'
  },
  {
    id: 'SOD-2024-004',
    ruleCode: 'SOD-GIT-09',
    title: 'GitHub Monorepo Admin & Production Release Deployer',
    systemName: 'GitHub Enterprise & ArgoCD CI/CD',
    roleA: 'GH_ORG_ADMIN_OWNER',
    roleB: 'PROD_K8S_DEPLOY_SIGNER',
    violatingUser: 'Dmitri Volkov',
    userEmail: 'dmitri.v@wealth.bank.corp',
    userTitle: 'Principal Platform Eng',
    businessUnit: 'Wealth & Asset Mgmt',
    severity: 'High',
    riskScore: 84,
    identifiedDate: '2024-08-17',
    targetDate: '2024-08-31',
    daysOpen: 7,
    timeSinceOpenText: '7 days open',
    isOverdue: false,
    owner: 'Wei Zhang (DevSecOps Lead)',
    accountable: 'Victoria Sterling (Dir Wealth Mgmt)',
    status: 'In Progress',
    auditImpact: 'SOC 2 Type II CC7.1: Bypass of peer code review and branch protection policies directly to prod clusters.',
    fraudRisk: 'Elevated',
    lastActivityWithBothRoles: '1 day ago (Merged PR without review & deployed to prod)',
    recommendedAction: 'Remove direct K8s deploy signing key from developer identity; force automated ArgoCD pipeline only.'
  },
  {
    id: 'SOD-2024-005',
    ruleCode: 'SOD-HR-03',
    title: 'Workday HR Compensation Adjuster & Corporate Payroll Disburser',
    systemName: 'Workday HCM & ADP Payroll Gateway',
    roleA: 'WORKDAY_COMPENSATION_PARTNER',
    roleB: 'ADP_PAYROLL_EXECUTION_ADMIN',
    violatingUser: 'Claire Underwood',
    userEmail: 'claire.u@corp.bank.corp',
    userTitle: 'HR Operations Lead',
    businessUnit: 'Corp Functions',
    severity: 'Medium',
    riskScore: 72,
    identifiedDate: '2024-08-19',
    targetDate: '2024-09-02',
    daysOpen: 5,
    timeSinceOpenText: '5 days open',
    isOverdue: false,
    owner: 'Sophie Martin (IAM Integration Specialist)',
    accountable: 'David Sterling (Head of HR Operations)',
    status: 'Under Review',
    auditImpact: 'Internal Audit Finding IA-2024-88: Potential for ghost employee creation and unauthorized salary adjustment.',
    fraudRisk: 'Moderate',
    lastActivityWithBothRoles: '4 days ago (Bi-weekly payroll run processed)',
    recommendedAction: 'Transfer payroll release entitlement to Corporate Finance VP and implement quarterly re-certification.'
  }
];

const SOD_RULE_POLICIES: SodRulePolicy[] = [
  {
    code: 'SOD-FIN-01',
    name: 'Accounts Payable Ledger Creation & Release',
    domain: 'Finance & Payments',
    framework: 'SOX 404',
    conflictingRole1: 'SAP_FI_AP_INVOICE_CREATE',
    conflictingRole2: 'SAP_FI_AP_PAYMENT_RELEASE',
    activeViolationsCount: 1,
    compensatingControlRequired: false,
    leadArchitect: 'Arthur Pendelton'
  },
  {
    code: 'SOD-FIN-02',
    name: 'General Ledger Journal Entry & Posting Approver',
    domain: 'Finance & Payments',
    framework: 'SOX 404',
    conflictingRole1: 'SAP_GL_JOURNAL_MAKER',
    conflictingRole2: 'SAP_GL_POSTING_APPROVER',
    activeViolationsCount: 0,
    compensatingControlRequired: false,
    leadArchitect: 'Arthur Pendelton'
  },
  {
    code: 'SOD-AWS-04',
    name: 'Cloud Infrastructure Root Admin & Telemetry Eraser',
    domain: 'Cloud Infrastructure',
    framework: 'ISO 27001',
    conflictingRole1: 'AWS_IAM_FullAdministratorAccess',
    conflictingRole2: 'AWS_CloudTrail_SecurityAuditor_Admin',
    activeViolationsCount: 1,
    compensatingControlRequired: false,
    leadArchitect: 'Liam Chen'
  },
  {
    code: 'SOD-BNK-02',
    name: 'Core Banking Deposit Maker & Credit Limit Checker',
    domain: 'Core Banking',
    framework: 'FFIEC',
    conflictingRole1: 'CORE_ACCT_PROVISION_MAKER',
    conflictingRole2: 'CORE_CREDIT_LIMIT_OVERRIDE_CHECKER',
    activeViolationsCount: 1,
    compensatingControlRequired: true,
    leadArchitect: 'Carlos Gomez'
  },
  {
    code: 'SOD-GIT-09',
    name: 'Code Repository Master & Direct Production Deployment',
    domain: 'DevSecOps & CI/CD',
    framework: 'SOC 2 Type II',
    conflictingRole1: 'GH_ORG_ADMIN_OWNER',
    conflictingRole2: 'PROD_K8S_DEPLOY_SIGNER',
    activeViolationsCount: 1,
    compensatingControlRequired: false,
    leadArchitect: 'Wei Zhang'
  },
  {
    code: 'SOD-HR-03',
    name: 'Human Capital Base Pay Editor & Direct Deposit Processor',
    domain: 'HR & Payroll',
    framework: 'SOX 404',
    conflictingRole1: 'WORKDAY_COMPENSATION_PARTNER',
    conflictingRole2: 'ADP_PAYROLL_EXECUTION_ADMIN',
    activeViolationsCount: 1,
    compensatingControlRequired: true,
    leadArchitect: 'Sophie Martin'
  }
];

const CERTIFICATION_CAMPAIGNS: CertificationCampaign[] = [
  {
    id: 'CAM-Q3-01',
    name: 'Q3 SOX Key Financial Roles & SAP Entitlements',
    businessUnit: 'Global Markets',
    reviewerLead: 'Elena Rostova',
    totalEntitlements: 1420,
    certifiedCount: 1380,
    revokedCount: 40,
    completionRate: 97.2,
    dueDate: '2024-09-15',
    status: 'On Track'
  },
  {
    id: 'CAM-Q3-02',
    name: 'Cloud Infrastructure Admin & CI/CD Keys Recertification',
    businessUnit: 'Consumer Tech',
    reviewerLead: 'Marcus Vance',
    totalEntitlements: 2150,
    certifiedCount: 1980,
    revokedCount: 170,
    completionRate: 92.1,
    dueDate: '2024-09-08',
    status: 'At Risk'
  },
  {
    id: 'CAM-Q3-03',
    name: 'Retail Banking Core Maker-Checker Entitlement Review',
    businessUnit: 'Retail Banking',
    reviewerLead: 'Sanjay Mehta',
    totalEntitlements: 3400,
    certifiedCount: 3350,
    revokedCount: 50,
    completionRate: 98.5,
    dueDate: '2024-09-30',
    status: 'On Track'
  },
  {
    id: 'CAM-Q3-04',
    name: 'Wealth Management Client Ledger Authorization Review',
    businessUnit: 'Wealth & Asset Mgmt',
    reviewerLead: 'Victoria Sterling',
    totalEntitlements: 1100,
    certifiedCount: 890,
    revokedCount: 210,
    completionRate: 80.9,
    dueDate: '2024-08-25',
    status: 'Overdue'
  }
];

const MAKER_CHECKER_LOGS: MakerCheckerAudit[] = [
  {
    id: 'MC-2024-991',
    operation: 'SWIFT MT103 Wire Disbursement ($4,250,000)',
    system: 'Finacle SWIFT Gateway',
    makerUser: 'j.thompson@globalbank.corp',
    checkerUser: 'e.rostova@globalbank.corp',
    amountOrScope: '$4,250,000 USD to Deutsche Bank AG',
    timestamp: 'Today, 14:15 UTC',
    status: 'Approved & Dual-Signed'
  },
  {
    id: 'MC-2024-992',
    operation: 'AWS IAM Policy Modification (Attach AdministratorAccess)',
    system: 'AWS Identity Center (SSO)',
    makerUser: 'k.thorne@consumertech.bank',
    checkerUser: 'l.chen@consumertech.bank',
    amountOrScope: 'Role: arn:aws:iam::120491823:role/ProdAdmin',
    timestamp: 'Today, 11:30 UTC',
    status: 'Rejected / Blocked'
  },
  {
    id: 'MC-2024-993',
    operation: 'Vendor Master Directory Bank Account Change',
    system: 'SAP S/4HANA ERP',
    makerUser: 'a.miller@corp.bank.corp',
    checkerUser: 's.jenkins@corp.bank.corp',
    amountOrScope: 'Vendor #88419 (Oracle Cloud Corp)',
    timestamp: 'Yesterday, 17:02 UTC',
    status: 'Pending Checker Sign-Off'
  }
];

export function SodGovernanceView({ onNotify }: Props) {
  const [activeTab, setActiveTab] = useState<'violations' | 'rules' | 'certifications' | 'maker-checker'>('violations');
  const [conflicts, setConflicts] = useState<SodConflictItem[]>(INITIAL_SOD_CONFLICTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [buFilter, setBuFilter] = useState('ALL');
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isRemediatingId, setIsRemediatingId] = useState<string | null>(null);

  const totalConflicts = conflicts.length;
  const criticalConflicts = conflicts.filter(c => c.severity === 'Critical' && c.status !== 'Remediated').length;
  const overdueConflicts = conflicts.filter(c => c.isOverdue && c.status !== 'Remediated').length;
  const remediatedCount = conflicts.filter(c => c.status === 'Remediated').length;

  const handleRemediateConflict = (item: SodConflictItem) => {
    setIsRemediatingId(item.id);
    setTimeout(() => {
      setConflicts(prev => prev.map(c => c.id === item.id ? { ...c, status: 'Remediated', isOverdue: false } : c));
      setIsRemediatingId(null);
      onNotify(`SoD Toxic Entitlement [${item.id}] successfully revoked via Okta/SailPoint workflow for ${item.violatingUser}.`);
    }, 850);
  };

  const filteredConflicts = conflicts.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.violatingUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.systemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ruleCode.toLowerCase().includes(searchTerm.toLowerCase());

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
              SailPoint • Okta Identity Governance • SAP GRC Access Control
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Continuous Entitlement Toxic Combination Scanner</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">Segregation of Duties (SoD) & Toxic Access Governance</h2>
          <p className="text-xs text-slate-300 max-w-3xl">
            Detecting, enforcing, and automatically revoking conflicting cross-application privileges across SAP, Active Directory, AWS, Finacle, and Workday.
          </p>
        </div>

        <button
          onClick={() => onNotify('Triggered firmwide SailPoint IdentityIQ & SAP GRC access rule re-evaluation across 23,620 identities.')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-xs shrink-0"
        >
          <Zap className="w-3.5 h-3.5" /> Run SoD Analysis Drill
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveTab('violations')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'violations'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          Active Violations & Revocations ({filteredConflicts.length})
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'rules'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          SoD Rule Matrix & Policies ({SOD_RULE_POLICIES.length})
        </button>

        <button
          onClick={() => setActiveTab('certifications')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'certifications'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-emerald-600" />
          Access Certification Campaigns
        </button>

        <button
          onClick={() => setActiveTab('maker-checker')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'maker-checker'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
          Dual-Control (Maker-Checker) Telemetry
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Toxic Conflicts</span>
          <span className="text-2xl font-black text-slate-900 block mt-0.5">{totalConflicts - remediatedCount} Active</span>
          <span className="text-[10px] text-slate-500">{remediatedCount} remediated this cycle</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Critical Severity (SOX / Fraud)</span>
          <span className="text-2xl font-black text-rose-600 block mt-0.5">{criticalConflicts} Critical</span>
          <span className="text-[10px] text-rose-700 font-semibold">Immediate revoke mandatory</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overdue SLA Violations</span>
          <span className="text-2xl font-black text-amber-600 block mt-0.5">{overdueConflicts} Overdue</span>
          <span className="text-[10px] text-amber-700 font-semibold">Escalated to BU EVP</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Access Certification Conformance</span>
          <span className="text-2xl font-black text-emerald-600 block mt-0.5">96.8%</span>
          <span className="text-[10px] text-emerald-700 font-semibold">Q3 Campaign on target</span>
        </div>
      </div>

      {/* TAB 1: VIOLATIONS */}
      {activeTab === 'violations' && (
        <div className="space-y-3.5">
          {/* Filter and Search Bar */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by user, rule, system, role, or ID..."
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
                  <option value="Retail Banking">Retail Banking</option>
                  <option value="Wealth & Asset Mgmt">Wealth & Asset Mgmt</option>
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

          {/* Granular SoD Findings Table with Word Wrap */}
          <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
            <div className="px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Toxic Role Combinations & Access Entitlements
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                  {filteredConflicts.length} of {conflicts.length} Violations
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Click row to view audit impact and transaction execution logs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs table-auto">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2 px-3 break-words">Rule & ID</th>
                    <th className="py-2 px-2.5 break-words">Violating Identity</th>
                    <th className="py-2 px-2.5 break-words">Target System</th>
                    <th className="py-2 px-2.5 break-words">Conflicting Entitlements</th>
                    <th className="py-2 px-2 break-words">Severity</th>
                    <th className="py-2 px-2.5 break-words">Timeline & SLA</th>
                    <th className="py-2 px-2.5 break-words">Time Since Open</th>
                    <th className="py-2 px-2.5 break-words">Accountable Lead</th>
                    <th className="py-2 px-2.5 break-words">Status</th>
                    <th className="py-2 px-2.5 text-right break-words">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredConflicts.map((item) => {
                    const isExpanded = expandedId === item.id;
                    return (
                      <tr 
                        key={item.id}
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className={`hover:bg-slate-50/70 transition cursor-pointer ${
                          item.isOverdue && item.status !== 'Remediated' ? 'bg-rose-50/20' : ''
                        }`}
                      >
                        {/* Rule & ID */}
                        <td className="py-2.5 px-3 max-w-[150px] break-words">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 break-all">
                              {item.id}
                            </span>
                            <span className="font-mono text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 break-all">
                              {item.ruleCode}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-800 mt-1 break-words">{item.title}</p>
                        </td>

                        {/* Violating User */}
                        <td className="py-2.5 px-2.5 max-w-[160px] break-words">
                          <p className="font-bold text-slate-900 text-xs break-words">{item.violatingUser}</p>
                          <span className="text-[10px] text-slate-400 block break-words">{item.userTitle}</span>
                          <span className="text-[10px] text-slate-500 font-mono break-all">{item.userEmail}</span>
                        </td>

                        {/* System */}
                        <td className="py-2.5 px-2.5 max-w-[150px] break-words">
                          <p className="font-semibold text-slate-800 text-xs break-words">{item.systemName}</p>
                          <span className="text-[10px] text-slate-400 block break-words">{item.businessUnit}</span>
                        </td>

                        {/* Conflicting Entitlements */}
                        <td className="py-2.5 px-2.5 max-w-[210px] break-words">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-[10px] font-mono text-rose-700 bg-rose-50/80 px-1.5 py-0.5 rounded border border-rose-100 break-all">
                              <Lock className="w-2.5 h-2.5 shrink-0" />
                              <span className="break-all">{item.roleA}</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] font-mono text-amber-700 bg-amber-50/80 px-1.5 py-0.5 rounded border border-amber-100 break-all">
                              <Lock className="w-2.5 h-2.5 shrink-0" />
                              <span className="break-all">{item.roleB}</span>
                            </div>
                          </div>
                        </td>

                        {/* Severity */}
                        <td className="py-2.5 px-2 break-words">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block break-words ${
                            item.severity === 'Critical' ? 'bg-rose-100 text-rose-700' :
                            item.severity === 'High' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {item.severity} • {item.riskScore}
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

                        {/* Accountable VP */}
                        <td className="py-2.5 px-2.5 max-w-[140px] break-words">
                          <span className="text-slate-800 font-semibold block text-[11px] break-words">{item.accountable}</span>
                          <span className="text-[10px] text-slate-400 block break-words">{item.businessUnit}</span>
                        </td>

                        {/* Status */}
                        <td className="py-2.5 px-2.5 break-words">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block break-words ${
                            item.status === 'Remediated' ? 'bg-emerald-100 text-emerald-700' :
                            item.status === 'Overdue' ? 'bg-rose-100 text-rose-700' :
                            item.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-2.5 px-2.5 text-right break-words" onClick={(e) => e.stopPropagation()}>
                          {item.status !== 'Remediated' ? (
                            <button
                              disabled={isRemediatingId === item.id}
                              onClick={() => handleRemediateConflict(item)}
                              className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900 text-white rounded text-[10px] font-bold transition shadow-2xs break-words"
                            >
                              {isRemediatingId === item.id ? 'Revoking...' : 'Revoke Role'}
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Resolved
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
            const item = conflicts.find(c => c.id === expandedId);
            if (!item) return null;
            return (
              <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
                      {item.id} • {item.ruleCode}
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
                      Audit Impact & Regulatory Exposure
                    </span>
                    <p className="text-[11px] text-slate-200 leading-relaxed">{item.auditImpact}</p>
                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Fraud Risk Level:</span>
                      <span className="font-bold text-rose-400">{item.fraudRisk}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                      Last Activity Audit Telemetry
                    </span>
                    <p className="text-[11px] text-slate-200 font-mono leading-relaxed">{item.lastActivityWithBothRoles}</p>
                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">System Gateway:</span>
                      <span className="font-bold text-slate-200">{item.systemName}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 space-y-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                        Recommended Compensating Control
                      </span>
                      <p className="text-[11px] text-slate-200 leading-relaxed">{item.recommendedAction}</p>
                    </div>
                    {item.status !== 'Remediated' && (
                      <button
                        onClick={() => handleRemediateConflict(item)}
                        className="mt-2 w-full py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <Lock className="w-3.5 h-3.5" /> Execute Immediate Role Revocation
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: RULES MATRIX */}
      {activeTab === 'rules' && (
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs space-y-3 p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">Segregation of Duties Policy & Rule Directory</h3>
              <p className="text-xs text-slate-500">
                Continuous compliance rule definitions enforced across SAP GRC, Active Directory, AWS IAM, and GitHub.
              </p>
            </div>
            <button
              onClick={() => onNotify('Exported full SoD Rule Directory in JSON/CSV audit format.')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
            >
              Export Rule Matrix
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs table-auto">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 break-words">Rule Code</th>
                  <th className="py-2.5 px-3 break-words">Policy Name & Domain</th>
                  <th className="py-2.5 px-3 break-words">Regulatory Framework</th>
                  <th className="py-2.5 px-3 break-words">Conflicting Role Pair</th>
                  <th className="py-2.5 px-3 break-words">Violations</th>
                  <th className="py-2.5 px-3 break-words">Lead Architect</th>
                  <th className="py-2.5 px-3 text-right break-words">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {SOD_RULE_POLICIES.map((rule) => (
                  <tr key={rule.code} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-mono font-bold text-indigo-600 break-words">
                      {rule.code}
                    </td>
                    <td className="py-2.5 px-3 break-words">
                      <p className="font-bold text-slate-900">{rule.name}</p>
                      <span className="text-[10px] text-slate-400 block">{rule.domain}</span>
                    </td>
                    <td className="py-2.5 px-3 break-words">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
                        {rule.framework}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 break-words">
                      <div className="space-y-0.5 text-[10px] font-mono">
                        <span className="text-rose-600 block">{rule.conflictingRole1}</span>
                        <span className="text-slate-400 block">&amp; {rule.conflictingRole2}</span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 break-words">
                      {rule.activeViolationsCount > 0 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                          {rule.activeViolationsCount} Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          0 Violations
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 break-words">
                      {rule.leadArchitect}
                    </td>
                    <td className="py-2.5 px-3 text-right break-words">
                      <button
                        onClick={() => onNotify(`Simulated policy test for ${rule.code}: All 23,620 identities evaluated clean.`)}
                        className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold transition border border-indigo-200"
                      >
                        Test Rule
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CERTIFICATION CAMPAIGNS */}
      {activeTab === 'certifications' && (
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs space-y-3 p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">Access Certification & Manager Re-Attestation</h3>
              <p className="text-xs text-slate-500">
                Quarterly access certification campaigns orchestrated through SailPoint IdentityNow & Okta Access Requests.
              </p>
            </div>
            <button
              onClick={() => onNotify('Triggered automated escalation reminders for delinquent access cert reviewers.')}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-xs"
            >
              Remind Reviewers
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CERTIFICATION_CAMPAIGNS.map((cam) => (
              <div key={cam.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-slate-400 font-bold">{cam.id}</span>
                    <h4 className="text-xs font-black text-slate-900 leading-tight">{cam.name}</h4>
                    <span className="text-[10px] text-slate-500">{cam.businessUnit} • Reviewer: {cam.reviewerLead}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    cam.status === 'On Track' ? 'bg-emerald-100 text-emerald-700' :
                    cam.status === 'At Risk' ? 'bg-amber-100 text-amber-700' :
                    'bg-rose-100 text-rose-700'
                  }`}>
                    {cam.status}
                  </span>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="font-bold text-slate-700">Completion Progress</span>
                    <span className="font-bold text-slate-900">{cam.completionRate}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${cam.completionRate >= 95 ? 'bg-emerald-500' : cam.completionRate >= 85 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      style={{ width: `${cam.completionRate}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200/60 text-[10px]">
                  <div>
                    <span className="text-slate-400 block">Entitlements</span>
                    <span className="font-bold text-slate-800">{cam.totalEntitlements.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Revoked</span>
                    <span className="font-bold text-rose-600">{cam.revokedCount} toxic</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">SLA Due Date</span>
                    <span className="font-bold text-slate-800">{cam.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: MAKER-CHECKER (DUAL CONTROL) */}
      {activeTab === 'maker-checker' && (
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs space-y-3 p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">Dual-Control & 4-Eyes Principle Verification</h3>
              <p className="text-xs text-slate-500">
                Auditing high-consequence operations across financial gateways, cloud IAM mutations, and vendor directory updates.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
              100% Dual-Signed Enforcement
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs table-auto">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 break-words">Audit ID</th>
                  <th className="py-2.5 px-3 break-words">Operation & System</th>
                  <th className="py-2.5 px-3 break-words">Maker (Initiator)</th>
                  <th className="py-2.5 px-3 break-words">Checker (Approver)</th>
                  <th className="py-2.5 px-3 break-words">Scope / Amount</th>
                  <th className="py-2.5 px-3 break-words">Timestamp</th>
                  <th className="py-2.5 px-3 text-right break-words">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {MAKER_CHECKER_LOGS.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-700 break-words">{log.id}</td>
                    <td className="py-2.5 px-3 break-words">
                      <p className="font-bold text-slate-900">{log.operation}</p>
                      <span className="text-[10px] text-slate-400 block">{log.system}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700 break-words">{log.makerUser}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-700 break-words">{log.checkerUser}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800 break-words">{log.amountOrScope}</td>
                    <td className="py-2.5 px-3 text-slate-500 break-words">{log.timestamp}</td>
                    <td className="py-2.5 px-3 text-right break-words">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block ${
                        log.status === 'Approved & Dual-Signed' ? 'bg-emerald-100 text-emerald-700' :
                        log.status === 'Pending Checker Sign-Off' ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
