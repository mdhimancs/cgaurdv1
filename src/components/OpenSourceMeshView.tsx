import { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  Terminal, 
  Database, 
  GitBranch, 
  Zap, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCw, 
  Search, 
  ExternalLink, 
  Clock, 
  User, 
  Building2,
  Cpu,
  Layers,
  FileCode,
  PackageCheck,
  Send,
  Download,
  Filter,
  Check,
  FileText,
  Scale
} from 'lucide-react';

interface Props {
  onNotify: (msg: string) => void;
}

interface OpenSourceFinding {
  id: string;
  advisoryCode: string;
  packageName: string;
  currentVersion: string;
  fixedVersion: string;
  repoName: string;
  businessUnit: string;
  severity: 'Critical' | 'High' | 'Medium';
  cvssScore: number;
  epssScore: number;
  inCisaKev: boolean;
  reachabilityStatus: 'Reachable in Production' | 'Unreachable (Dead Code)' | 'Evaluation Pending';
  licenseType: string;
  sourceConnector: string;
  identifiedDate: string;
  targetDate: string;
  daysOpen: number;
  timeSinceOpenText: string;
  isOverdue: boolean;
  owner: string;
  accountable: string;
  status: 'PR Open' | 'In Progress' | 'Overdue' | 'Patched';
  prUrl: string;
  sbomStandard: string;
  vulnerabilityDescription: string;
}

interface LicenseRiskItem {
  packageName: string;
  version: string;
  license: string;
  riskCategory: 'High Risk (Copyleft / AGPL)' | 'Medium Risk (GPL/LGPL)' | 'Permissive (MIT/Apache/BSD)';
  repoName: string;
  businessUnit: string;
  commercialUseAllowed: boolean;
  remediationAction: string;
}

interface SbomManifestItem {
  id: string;
  serviceName: string;
  repository: string;
  format: 'CycloneDX 1.5 JSON' | 'SPDX 2.3';
  componentsCount: number;
  dependenciesDeep: number;
  signatureStatus: 'Cryptographically Signed (Cosign)' | 'Self-Attested' | 'Unsigned';
  lastGenerated: string;
  sha256Hash: string;
}

interface ConnectorStatus {
  name: string;
  tool: string;
  category: string;
  status: 'Operational' | 'Syncing' | 'Degraded';
  eventsPerMin: string;
  lastSync: string;
  version: string;
}

const CONNECTORS_CONFIG: ConnectorStatus[] = [
  {
    name: 'DefectDojo Orchestration',
    tool: 'DefectDojo v2.38',
    category: 'Vulnerability Orchestration & SAST/DAST Aggregation',
    status: 'Operational',
    eventsPerMin: '2,450 findings/hr',
    lastSync: '1 min ago',
    version: 'v2.38.1'
  },
  {
    name: 'Wazuh XDR & SIEM',
    tool: 'Wazuh Cluster v4.8',
    category: 'Host Agent Telemetry & Log Integrity Monitoring',
    status: 'Operational',
    eventsPerMin: '18,400 events/sec',
    lastSync: 'Real-time (Active)',
    version: 'v4.8.0'
  },
  {
    name: 'OpenVAS / Greenbone (GVM)',
    tool: 'Greenbone Community Edition',
    category: 'Perimeter Network Vulnerability & Port Scanner',
    status: 'Operational',
    eventsPerMin: 'Nightly Delta Run',
    lastSync: '3 hours ago',
    version: 'v22.4'
  },
  {
    name: 'Cloud Custodian (CSPM)',
    tool: 'Cloud Custodian Engine',
    category: 'Multi-Cloud IAM & Compliance Policy Enforcement',
    status: 'Operational',
    eventsPerMin: '12,450 resources',
    lastSync: '4 min ago',
    version: 'v0.9.32'
  },
  {
    name: 'TruffleHog & Gitleaks',
    tool: 'TruffleHog Enterprise OSS',
    category: 'CI/CD Pre-Commit & Git Secret Leak Blocker',
    status: 'Operational',
    eventsPerMin: '840 repos polled',
    lastSync: 'Continuous',
    version: 'v3.81.0'
  },
  {
    name: 'Syft & Grype SBOM Engine',
    tool: 'Anchore Syft & Grype',
    category: 'Automated SBOM Generation & Container Scanner',
    status: 'Operational',
    eventsPerMin: 'CycloneDX JSON',
    lastSync: '12 min ago',
    version: 'v0.118'
  }
];

const INITIAL_OPEN_SOURCE_FINDINGS: OpenSourceFinding[] = [
  {
    id: 'OSS-2026-001',
    advisoryCode: 'CVE-2024-41110',
    packageName: 'docker/docker-ce-cli',
    currentVersion: 'v24.0.5',
    fixedVersion: 'v24.0.9 / v25.0.6',
    repoName: 'clearing-settlement-engine',
    businessUnit: 'Global Markets',
    severity: 'Critical',
    cvssScore: 9.9,
    epssScore: 0.94,
    inCisaKev: true,
    reachabilityStatus: 'Reachable in Production',
    licenseType: 'Apache-2.0',
    sourceConnector: 'DefectDojo & Grype',
    identifiedDate: '2026-08-10',
    targetDate: '2026-08-20',
    daysOpen: 14,
    timeSinceOpenText: '14 days (4d Overdue)',
    isOverdue: true,
    owner: 'Alex Rivera (DevOps Lead)',
    accountable: 'Elena Rostova (EVP Markets)',
    status: 'Overdue',
    prUrl: 'github.com/bank-org/settlement/pull/402',
    sbomStandard: 'CycloneDX 1.5 JSON',
    vulnerabilityDescription: 'AuthZ bypass in Docker Engine allowing malicious containers to escalate privileges on host.'
  },
  {
    id: 'OSS-2026-002',
    advisoryCode: 'CVE-2024-38816',
    packageName: 'org.springframework:spring-webmvc',
    currentVersion: 'v6.1.10',
    fixedVersion: 'v6.1.14',
    repoName: 'retail-mobile-backend',
    businessUnit: 'Consumer Tech',
    severity: 'Critical',
    cvssScore: 9.8,
    epssScore: 0.88,
    inCisaKev: true,
    reachabilityStatus: 'Reachable in Production',
    licenseType: 'Apache-2.0',
    sourceConnector: 'DefectDojo & Trivy',
    identifiedDate: '2026-08-12',
    targetDate: '2026-08-22',
    daysOpen: 12,
    timeSinceOpenText: '12 days (2d Overdue)',
    isOverdue: true,
    owner: 'David Kim (Senior SecOps)',
    accountable: 'Marcus Vance (VP Consumer Tech)',
    status: 'Overdue',
    prUrl: 'github.com/bank-org/retail-app/pull/189',
    sbomStandard: 'CycloneDX 1.5 JSON',
    vulnerabilityDescription: 'Path traversal vulnerability in Functional Web Framework allowing remote resource access.'
  },
  {
    id: 'OSS-2026-003',
    advisoryCode: 'CVE-2024-21538',
    packageName: 'npm:cross-spawn',
    currentVersion: 'v7.0.3',
    fixedVersion: 'v7.0.6',
    repoName: 'wealth-portal-frontend',
    businessUnit: 'Wealth & Asset Mgmt',
    severity: 'High',
    cvssScore: 8.4,
    epssScore: 0.42,
    inCisaKev: false,
    reachabilityStatus: 'Unreachable (Dead Code)',
    licenseType: 'MIT',
    sourceConnector: 'Syft & Grype Engine',
    identifiedDate: '2026-08-15',
    targetDate: '2026-08-29',
    daysOpen: 9,
    timeSinceOpenText: '9 days open',
    isOverdue: false,
    owner: 'Elena Rostova (Lead SecOps)',
    accountable: 'Victoria Sterling (Dir Wealth Mgmt)',
    status: 'PR Open',
    prUrl: 'github.com/bank-org/wealth-ui/pull/88',
    sbomStandard: 'SPDX 2.3 Tag-Value',
    vulnerabilityDescription: 'Regular Expression Denial of Service (ReDoS) during sub-process argument sanitization.'
  },
  {
    id: 'OSS-2026-004',
    advisoryCode: 'CVE-2024-6387',
    packageName: 'openssh-server (regreSSHion)',
    currentVersion: 'v9.2p1',
    fixedVersion: 'v9.8p1',
    repoName: 'infra-base-amazonlinux2023',
    businessUnit: 'Consumer Tech',
    severity: 'High',
    cvssScore: 8.1,
    epssScore: 0.91,
    inCisaKev: true,
    reachabilityStatus: 'Reachable in Production',
    licenseType: 'BSD-2-Clause',
    sourceConnector: 'Wazuh XDR & OpenVAS',
    identifiedDate: '2026-08-18',
    targetDate: '2026-09-01',
    daysOpen: 6,
    timeSinceOpenText: '6 days open',
    isOverdue: false,
    owner: 'Liam Chen (Cloud Sec Lead)',
    accountable: 'Marcus Vance (VP Consumer Tech)',
    status: 'In Progress',
    prUrl: 'github.com/bank-org/golden-ami/pull/55',
    sbomStandard: 'CycloneDX 1.5 JSON',
    vulnerabilityDescription: 'Signal handler race condition in OpenSSH daemon leading to unauthenticated remote code execution.'
  },
  {
    id: 'OSS-2026-005',
    advisoryCode: 'CVE-2024-34447',
    packageName: 'urllib3/urllib3',
    currentVersion: 'v2.0.7',
    fixedVersion: 'v2.2.2',
    repoName: 'aml-transaction-monitor',
    businessUnit: 'Corp Functions',
    severity: 'Medium',
    cvssScore: 6.5,
    epssScore: 0.15,
    inCisaKev: false,
    reachabilityStatus: 'Unreachable (Dead Code)',
    licenseType: 'MIT',
    sourceConnector: 'DefectDojo & Grype',
    identifiedDate: '2026-08-20',
    targetDate: '2026-09-10',
    daysOpen: 4,
    timeSinceOpenText: '4 days open',
    isOverdue: false,
    owner: 'Sophie Martin (SecOps Eng)',
    accountable: 'David Sterling (Head of Compliance)',
    status: 'PR Open',
    prUrl: 'github.com/bank-org/aml-engine/pull/31',
    sbomStandard: 'CycloneDX 1.5 JSON',
    vulnerabilityDescription: 'Improper cookie header stripping on cross-origin redirects allowing session leakage.'
  }
];

const LICENSE_RISKS: LicenseRiskItem[] = [
  {
    packageName: 'mongodb/mongo-cxx-driver',
    version: 'v3.6.2',
    license: 'SSPL v1.0 (Server Side Public License)',
    riskCategory: 'High Risk (Copyleft / AGPL)',
    repoName: 'fx-pricing-analytics',
    businessUnit: 'Global Markets',
    commercialUseAllowed: false,
    remediationAction: 'Replace with PostgreSQL libpq or purchase commercial OEM distribution waiver.'
  },
  {
    packageName: 'ghostscript-node',
    version: 'v1.4.0',
    license: 'AGPL-3.0',
    riskCategory: 'High Risk (Copyleft / AGPL)',
    repoName: 'document-vault-converter',
    businessUnit: 'Wealth & Asset Mgmt',
    commercialUseAllowed: false,
    remediationAction: 'Isolate behind isolated sidecar REST service or switch to PDFBox Apache-2.0.'
  },
  {
    packageName: 'readline-native',
    version: 'v2.1.0',
    license: 'GPL-3.0',
    riskCategory: 'Medium Risk (GPL/LGPL)',
    repoName: 'branch-teller-terminal',
    businessUnit: 'Retail Banking',
    commercialUseAllowed: true,
    remediationAction: 'Migrate to editline (BSD licensed) to prevent static linking copyleft pollution.'
  },
  {
    packageName: 'fastapi',
    version: 'v0.110.0',
    license: 'MIT',
    riskCategory: 'Permissive (MIT/Apache/BSD)',
    repoName: 'fraud-ai-inference-service',
    businessUnit: 'Consumer Tech',
    commercialUseAllowed: true,
    remediationAction: 'Attribution verified in legal NOTICE manifest.'
  }
];

const SBOM_MANIFESTS: SbomManifestItem[] = [
  {
    id: 'SBOM-2026-001',
    serviceName: 'Clearing & Settlement Core',
    repository: 'github.com/bank-org/settlement',
    format: 'CycloneDX 1.5 JSON',
    componentsCount: 1420,
    dependenciesDeep: 6,
    signatureStatus: 'Cryptographically Signed (Cosign)',
    lastGenerated: 'Today at 12:40 UTC',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  },
  {
    id: 'SBOM-2026-002',
    serviceName: 'Retail Mobile Gateway API',
    repository: 'github.com/bank-org/retail-app',
    format: 'CycloneDX 1.5 JSON',
    componentsCount: 890,
    dependenciesDeep: 4,
    signatureStatus: 'Cryptographically Signed (Cosign)',
    lastGenerated: 'Today at 10:15 UTC',
    sha256Hash: 'a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0'
  },
  {
    id: 'SBOM-2026-003',
    serviceName: 'Wealth Portfolio Engine',
    repository: 'github.com/bank-org/wealth-ui',
    format: 'SPDX 2.3',
    componentsCount: 640,
    dependenciesDeep: 5,
    signatureStatus: 'Self-Attested',
    lastGenerated: 'Yesterday at 18:22 UTC',
    sha256Hash: '9876543210fedcba0987654321fedcba0987654321fedcba0987654321fedcba'
  }
];

export function OpenSourceMeshView({ onNotify }: Props) {
  const [activeTab, setActiveTab] = useState<'vulnerabilities' | 'licenses' | 'sboms' | 'connectors'>('vulnerabilities');
  const [findings, setFindings] = useState<OpenSourceFinding[]>(INITIAL_OPEN_SOURCE_FINDINGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [buFilter, setBuFilter] = useState('ALL');
  const [onlyOverdue, setOnlyOverdue] = useState(false);
  const [onlyReachable, setOnlyReachable] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [patchingId, setPatchingId] = useState<string | null>(null);

  const totalFindings = findings.length;
  const criticalCount = findings.filter(f => f.severity === 'Critical' && f.status !== 'Patched').length;
  const overdueCount = findings.filter(f => f.isOverdue && f.status !== 'Patched').length;
  const patchedCount = findings.filter(f => f.status === 'Patched').length;

  const handleMergePatch = (item: OpenSourceFinding) => {
    setPatchingId(item.id);
    setTimeout(() => {
      setFindings(prev => prev.map(f => f.id === item.id ? { ...f, status: 'Patched', isOverdue: false } : f));
      setPatchingId(null);
      onNotify(`Automated Patch PR [${item.prUrl}] merged into master. Dependency upgraded to ${item.fixedVersion}.`);
    }, 900);
  };

  const filteredFindings = findings.filter(item => {
    const matchesSearch = 
      item.packageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.advisoryCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.repoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;
    const matchesBu = buFilter === 'ALL' || item.businessUnit === buFilter;
    const matchesOverdue = !onlyOverdue || item.isOverdue;
    const matchesReachable = !onlyReachable || item.reachabilityStatus === 'Reachable in Production';

    return matchesSearch && matchesSeverity && matchesBu && matchesOverdue && matchesReachable;
  });

  return (
    <div className="col-span-12 space-y-3.5">
      {/* Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              DefectDojo • Wazuh • Greenbone • Cloud Custodian • TruffleHog • Syft & Grype
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Continuous Open-Source Supply Chain Mesh</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">Open-Source Security, Reachability & SBOM Governance</h2>
          <p className="text-xs text-slate-300 max-w-3xl">
            Real-time dependency reachability, EPSS prioritization, copyleft license compliance, and cryptographic CycloneDX SBOM attestations across all enterprise microservices.
          </p>
        </div>

        <button
          onClick={() => onNotify('Triggered firm-wide Syft SBOM and Grype vulnerability delta sync across 840 Git repos.')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-xs shrink-0"
        >
          <RotateCw className="w-3.5 h-3.5" /> Trigger Mesh Rescan
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
        <button
          onClick={() => setActiveTab('vulnerabilities')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'vulnerabilities'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          Vulnerabilities & Reachability ({filteredFindings.length})
        </button>

        <button
          onClick={() => setActiveTab('licenses')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'licenses'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Scale className="w-3.5 h-3.5 text-amber-600" />
          OSS License Compliance ({LICENSE_RISKS.length})
        </button>

        <button
          onClick={() => setActiveTab('sboms')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'sboms'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
          SBOM CycloneDX Explorer ({SBOM_MANIFESTS.length})
        </button>

        <button
          onClick={() => setActiveTab('connectors')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'connectors'
              ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Activity className="w-3.5 h-3.5 text-cyan-600" />
          Toolchain Telemetry ({CONNECTORS_CONFIG.length})
        </button>
      </div>

      {/* KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active OSS Vulnerabilities</span>
          <span className="text-2xl font-black text-slate-900 block mt-0.5">{totalFindings - patchedCount} Active</span>
          <span className="text-[10px] text-slate-500">{patchedCount} auto-patched via PR</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Critical Reachable CVEs</span>
          <span className="text-2xl font-black text-rose-600 block mt-0.5">{criticalCount} Critical</span>
          <span className="text-[10px] text-rose-700 font-semibold">In active execution path</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overdue SLA Breaches</span>
          <span className="text-2xl font-black text-amber-600 block mt-0.5">{overdueCount} Overdue</span>
          <span className="text-[10px] text-amber-700 font-semibold">Target 14-day SLA exceeded</span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">CycloneDX SBOM Coverage</span>
          <span className="text-2xl font-black text-emerald-600 block mt-0.5">99.2%</span>
          <span className="text-[10px] text-emerald-700 font-semibold">Cosign cryptographically verified</span>
        </div>
      </div>

      {/* TAB 1: VULNERABILITIES & REACHABILITY */}
      {activeTab === 'vulnerabilities' && (
        <div className="space-y-3.5">
          {/* Search & Filter Controls */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by package, CVE, repo, or ID..."
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
                  onClick={() => setOnlyReachable(!onlyReachable)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition ${
                    onlyReachable 
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300' 
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-indigo-600" /> Reachable Only
                </button>

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

          {/* Granular Table with Word Wrap */}
          <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
            <div className="px-3.5 py-2.5 bg-slate-50/80 border-b border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Open-Source Dependency Findings
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
                  {filteredFindings.length} of {findings.length}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">
                Click row to view dependency chain & SBOM manifest details
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs table-auto">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2 px-3 break-words">CVE / Advisory</th>
                    <th className="py-2 px-2.5 break-words">Package & Version</th>
                    <th className="py-2 px-2.5 break-words">Target Repo & BU</th>
                    <th className="py-2 px-2 break-words">Severity & EPSS</th>
                    <th className="py-2 px-2.5 break-words">Reachability</th>
                    <th className="py-2 px-2.5 break-words">Timeline & SLA</th>
                    <th className="py-2 px-2.5 break-words">Time Since Open</th>
                    <th className="py-2 px-2.5 break-words">Assigned DevSecOps</th>
                    <th className="py-2 px-2.5 break-words">Accountable VP</th>
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
                          item.isOverdue && item.status !== 'Patched' ? 'bg-rose-50/20' : ''
                        }`}
                      >
                        {/* Advisory Code */}
                        <td className="py-2.5 px-3 max-w-[170px] break-words">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 break-all">
                              {item.id}
                            </span>
                            <span className="font-mono text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200 break-all">
                              {item.advisoryCode}
                            </span>
                          </div>
                          {item.inCisaKev && (
                            <span className="mt-1 inline-block px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-rose-600 text-white">
                              CISA KEV
                            </span>
                          )}
                          <p className="text-[10px] text-slate-400 font-mono mt-0.5 break-words">Src: {item.sourceConnector}</p>
                        </td>

                        {/* Package */}
                        <td className="py-2.5 px-2.5 max-w-[180px] break-words">
                          <p className="font-bold text-slate-900 text-xs break-words" title={item.packageName}>
                            {item.packageName}
                          </p>
                          <div className="text-[10px] font-mono text-slate-500 mt-0.5 break-words">
                            <span className="text-rose-600 break-all">{item.currentVersion}</span> &rarr; <span className="text-emerald-700 font-bold break-all">{item.fixedVersion}</span>
                          </div>
                        </td>

                        {/* Repo & BU */}
                        <td className="py-2.5 px-2.5 max-w-[200px] break-words">
                          <p className="font-semibold text-slate-800 text-xs break-words" title={item.repoName}>
                            {item.repoName}
                          </p>
                          <span className="text-[10px] text-slate-400 block break-words">{item.businessUnit}</span>
                        </td>

                        {/* Severity & EPSS */}
                        <td className="py-2.5 px-2 break-words">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block break-words ${
                            item.severity === 'Critical' ? 'bg-rose-100 text-rose-700' :
                            item.severity === 'High' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {item.severity} • {item.cvssScore}
                          </span>
                          <span className="text-[9px] text-slate-500 font-mono block mt-0.5">
                            EPSS: {(item.epssScore * 100).toFixed(0)}%
                          </span>
                        </td>

                        {/* Reachability */}
                        <td className="py-2.5 px-2.5 break-words">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block break-words ${
                            item.reachabilityStatus === 'Reachable in Production' ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {item.reachabilityStatus === 'Reachable in Production' ? '⚡ Reachable' : '💤 Dead Code'}
                          </span>
                        </td>

                        {/* Timeline */}
                        <td className="py-2.5 px-2.5 break-words">
                          <span className="text-slate-400 block text-[10px] break-words">Identified: {item.identifiedDate}</span>
                          <span className="font-semibold text-slate-800 block break-words">SLA: {item.targetDate}</span>
                        </td>

                        {/* Time Since Open */}
                        <td className="py-2.5 px-2.5 break-words">
                          {item.isOverdue && item.status !== 'Patched' ? (
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
                            item.status === 'Patched' ? 'bg-emerald-100 text-emerald-700' :
                            item.status === 'Overdue' ? 'bg-rose-100 text-rose-700' :
                            item.status === 'In Progress' ? 'bg-indigo-100 text-indigo-700' :
                            'bg-amber-100 text-amber-700'
                          }`}>
                            {item.status}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="py-2.5 px-2.5 text-right break-words" onClick={(e) => e.stopPropagation()}>
                          {item.status !== 'Patched' ? (
                            <button
                              disabled={patchingId === item.id}
                              onClick={() => handleMergePatch(item)}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-900 text-white rounded text-[10px] font-bold transition shadow-2xs break-words"
                            >
                              {patchingId === item.id ? 'Merging...' : 'Merge Patch PR'}
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                              <CheckCircle2 className="w-3 h-3" /> Patched
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
            const item = findings.find(f => f.id === expandedId);
            if (!item) return null;
            return (
              <div className="bg-slate-900 text-white rounded-xl p-4 border border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-400 bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800">
                      {item.id} • {item.advisoryCode}
                    </span>
                    <h4 className="text-sm font-black text-slate-100">{item.packageName}</h4>
                    <span className="text-xs text-slate-400">({item.repoName})</span>
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
                      Vulnerability & Reachability Analysis
                    </span>
                    <p className="text-[11px] text-slate-200 leading-relaxed">{item.vulnerabilityDescription}</p>
                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Runtime Call Path:</span>
                      <span className="font-bold text-rose-400">{item.reachabilityStatus}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 space-y-1">
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">
                      SBOM CycloneDX Standard
                    </span>
                    <p className="text-[11px] text-slate-200 font-mono leading-relaxed">{item.sbomStandard}</p>
                    <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Package License:</span>
                      <span className="font-bold text-slate-200">{item.licenseType}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700/60 space-y-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                        Automated Remediating Pull Request
                      </span>
                      <p className="text-[11px] text-slate-200 font-mono truncate">{item.prUrl}</p>
                    </div>
                    {item.status !== 'Patched' && (
                      <button
                        onClick={() => handleMergePatch(item)}
                        className="mt-2 w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
                      >
                        <GitBranch className="w-3.5 h-3.5" /> Merge Automated Patch PR
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* TAB 2: LICENSE COMPLIANCE */}
      {activeTab === 'licenses' && (
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs space-y-3 p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">Open-Source License & Copyleft Risk Governance</h3>
              <p className="text-xs text-slate-500">
                Continuous software licensing audits protecting proprietary IP from AGPL/SSPL viral copyleft contamination.
              </p>
            </div>
            <button
              onClick={() => onNotify('Generated firm-wide OSS License Attribution & Legal Clearance Report.')}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition"
            >
              Export Legal Clearance
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs table-auto">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3 break-words">Package & Version</th>
                  <th className="py-2.5 px-3 break-words">License Standard</th>
                  <th className="py-2.5 px-3 break-words">Risk Classification</th>
                  <th className="py-2.5 px-3 break-words">Repository & BU</th>
                  <th className="py-2.5 px-3 break-words">Commercial Safe</th>
                  <th className="py-2.5 px-3 break-words">Remediation Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {LICENSE_RISKS.map((lic, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 font-bold text-slate-900 break-words">
                      {lic.packageName}
                      <span className="text-[10px] font-mono text-slate-400 block">{lic.version}</span>
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800 break-words">
                      {lic.license}
                    </td>
                    <td className="py-2.5 px-3 break-words">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        lic.riskCategory.includes('High') ? 'bg-rose-100 text-rose-700' :
                        lic.riskCategory.includes('Medium') ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }`}>
                        {lic.riskCategory}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 break-words">
                      <p className="font-semibold text-slate-800">{lic.repoName}</p>
                      <span className="text-[10px] text-slate-400 block">{lic.businessUnit}</span>
                    </td>
                    <td className="py-2.5 px-3 break-words">
                      {lic.commercialUseAllowed ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          Allowed
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                          Prohibited
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 break-words">
                      {lic.remediationAction}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SBOM EXPLORER */}
      {activeTab === 'sboms' && (
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs space-y-3 p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">Software Bill of Materials (SBOM) CycloneDX Registry</h3>
              <p className="text-xs text-slate-500">
                Machine-readable CycloneDX 1.5 JSON and SPDX 2.3 manifests signed with Sigstore Cosign keys.
              </p>
            </div>
            <button
              onClick={() => onNotify('Exported enterprise CycloneDX 1.5 JSON SBOM manifest bundle for regulatory filing.')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-xs"
            >
              <Download className="w-3.5 h-3.5" /> Download CycloneDX Bundle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {SBOM_MANIFESTS.map((sbom) => (
              <div key={sbom.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                      {sbom.id}
                    </span>
                    <h4 className="text-xs font-black text-slate-900 mt-1">{sbom.serviceName}</h4>
                    <span className="text-[10px] text-slate-500 font-mono block truncate">{sbom.repository}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    {sbom.format}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Total Components</span>
                    <span className="font-bold text-slate-900">{sbom.componentsCount} pkgs</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Dependency Depth</span>
                    <span className="font-bold text-slate-900">{sbom.dependenciesDeep} Levels</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/70 text-[10px] space-y-1">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Signature Attestation:</span>
                    <span className="font-bold text-emerald-700">{sbom.signatureStatus}</span>
                  </div>
                  <div className="text-slate-400 font-mono truncate text-[9px]">
                    SHA256: {sbom.sha256Hash}
                  </div>
                </div>

                <button
                  onClick={() => onNotify(`Exported signed SBOM JSON for ${sbom.serviceName}.`)}
                  className="w-full py-1.5 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-[11px] font-bold transition border border-slate-200"
                >
                  View CycloneDX Manifest
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CONNECTORS & INGESTION TELEMETRY */}
      {activeTab === 'connectors' && (
        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs space-y-3 p-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-sm font-black text-slate-900">Open-Source Toolchain & Ingestion Connectors</h3>
              <p className="text-xs text-slate-500">
                Telemetry streams connected into the CyberGuard data fabric.
              </p>
            </div>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold">
              All 6 Connectors Healthy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {CONNECTORS_CONFIG.map((conn, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-900">{conn.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700">
                    {conn.status}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500">{conn.category}</p>
                <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-[10px] text-slate-600">
                  <span>Throughput: <strong className="text-slate-900">{conn.eventsPerMin}</strong></span>
                  <span>Sync: <strong className="text-slate-900">{conn.lastSync}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
