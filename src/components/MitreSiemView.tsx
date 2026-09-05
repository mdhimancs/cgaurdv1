import { useState } from 'react';
import { 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  Clock, 
  User, 
  Building2,
  Search,
  RotateCw
} from 'lucide-react';

interface Props {
  onNotify: (msg: string) => void;
}

interface MitreDetectionItem {
  id: string;
  techniqueId: string;
  techniqueName: string;
  tactic: string;
  ruleName: string;
  telemetrySource: string;
  coverageStatus: 'Fully Covered' | 'Partial Coverage' | 'Detection Gap';
  lastTriggered: string;
  identifiedDate: string;
  targetDate: string;
  daysOpen: number;
  timeSinceOpenText: string;
  isOverdue: boolean;
  owner: string;
  accountable: string;
  businessUnit: string;
  status: 'Active' | 'Under Tuning' | 'Gap Open';
}

const INITIAL_MITRE_DETECTIONS: MitreDetectionItem[] = [
  {
    id: 'MTR-RULE-101',
    techniqueId: 'T1059.001',
    techniqueName: 'PowerShell Execution with Obfuscated Payloads',
    tactic: 'Execution',
    ruleName: 'Wazuh Rule #9201: EncodedCommand / Hidden Window PowerShell',
    telemetrySource: 'Wazuh Agent & Windows Event Log 4104',
    coverageStatus: 'Fully Covered',
    lastTriggered: '18 min ago',
    identifiedDate: '2026-07-15',
    targetDate: '2026-08-15',
    daysOpen: 40,
    timeSinceOpenText: '40 days active',
    isOverdue: false,
    owner: 'Tanya Morales (SOC Threat Analyst)',
    accountable: 'Marcus Vance (VP Consumer Tech)',
    businessUnit: 'Consumer Tech',
    status: 'Active'
  },
  {
    id: 'MTR-RULE-102',
    techniqueId: 'T1003.001',
    techniqueName: 'LSASS Memory Dumping (Mimikatz / Procdump)',
    tactic: 'Credential Access',
    ruleName: 'CrowdStrike Falcon Heuristic: Suspicious Access to lsass.exe',
    telemetrySource: 'Falcon Sensor & Sysmon Event 10',
    coverageStatus: 'Fully Covered',
    lastTriggered: '2 hours ago',
    identifiedDate: '2026-08-01',
    targetDate: '2026-08-15',
    daysOpen: 23,
    timeSinceOpenText: '23 days active',
    isOverdue: false,
    owner: 'Dmitri Volkov (Principal SecOps)',
    accountable: 'Elena Rostova (EVP Markets)',
    businessUnit: 'Global Markets',
    status: 'Active'
  },
  {
    id: 'MTR-RULE-103',
    techniqueId: 'T1078.004',
    techniqueName: 'Cloud Infrastructure Service Account Misuse',
    tactic: 'Defense Evasion & Persistence',
    ruleName: 'Cloud Custodian: Anomalous STS AssumeRole from Non-Corp IP',
    telemetrySource: 'AWS CloudTrail & GuardDuty',
    coverageStatus: 'Partial Coverage',
    lastTriggered: '1 day ago',
    identifiedDate: '2026-08-12',
    targetDate: '2026-08-22',
    daysOpen: 12,
    timeSinceOpenText: '12 days (2d Overdue)',
    isOverdue: true,
    owner: 'Liam Chen (Senior Cloud Security Eng)',
    accountable: 'Elena Rostova (EVP Markets)',
    businessUnit: 'Global Markets',
    status: 'Under Tuning'
  },
  {
    id: 'MTR-RULE-104',
    techniqueId: 'T1566.002',
    techniqueName: 'Spearphishing Link to OAuth Consent Phishing App',
    tactic: 'Initial Access',
    ruleName: 'Proofpoint & Okta ThreatInsight: Malicious Illicit Consent Grant',
    telemetrySource: 'Okta System Logs & Proofpoint TAP',
    coverageStatus: 'Fully Covered',
    lastTriggered: '4 hours ago',
    identifiedDate: '2026-08-05',
    targetDate: '2026-09-05',
    daysOpen: 19,
    timeSinceOpenText: '19 days active',
    isOverdue: false,
    owner: 'Sophie Martin (HR/IAM Integrator)',
    accountable: 'David Sterling (Head of Corporate Systems)',
    businessUnit: 'Corp Functions',
    status: 'Active'
  }
];

export function MitreSiemView({ onNotify }: Props) {
  const [coverage] = useState(88.4);
  const [detections, setDetections] = useState<MitreDetectionItem[]>(INITIAL_MITRE_DETECTIONS);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = detections.filter(d => 
    d.techniqueId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.techniqueName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.ruleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.tactic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="col-span-12 space-y-3.5">
      {/* Compact Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              MITRE ATT&CK Enterprise Matrix v15.1
            </span>
            <span className="text-[11px] text-slate-400 font-mono">942 Active Detection Rules</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">ATT&CK Technique Matrix & SIEM Detection Telemetry</h2>
          <p className="text-xs text-slate-300 max-w-3xl">
            Mapping enterprise telemetry across 14 MITRE tactics with real-time detection engineering coverage and SLA tracking.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-400 block leading-tight">{coverage}%</span>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Framework Coverage</span>
          </div>
          <button
            onClick={() => onNotify('MITRE ATT&CK Matrix synchronized with Splunk and Wazuh detection repositories.')}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow-xs"
          >
            Sync Matrix Rules
          </button>
        </div>
      </div>

      {/* Tactic Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Initial Access</span>
          <span className="text-2xl font-black text-slate-900 block mt-0.5">92% Covered</span>
          <span className="text-[10px] text-emerald-600 font-semibold">Phishing & Edge</span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Execution & Persistence</span>
          <span className="text-2xl font-black text-slate-900 block mt-0.5">89% Covered</span>
          <span className="text-[10px] text-emerald-600 font-semibold">Scheduled Tasks & WMI</span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Privilege Escalation</span>
          <span className="text-2xl font-black text-slate-900 block mt-0.5">94% Covered</span>
          <span className="text-[10px] text-emerald-600 font-semibold">LSASS & Token Theft</span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Exfiltration & Impact</span>
          <span className="text-2xl font-black text-slate-900 block mt-0.5">86% Covered</span>
          <span className="text-[10px] text-amber-600 font-semibold">Encrypted Web Traffic</span>
        </div>
      </div>

      {/* Granular Rules Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-2xs">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Active Detection Rules & Telemetry Sources
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">
              {filtered.length} of {detections.length} Rules
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by technique, tactic, rule..."
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
                <th className="py-2 px-3 break-words">Technique ID & Name</th>
                <th className="py-2 px-2.5 break-words">MITRE Tactic</th>
                <th className="py-2 px-2.5 break-words">Detection Rule & Telemetry</th>
                <th className="py-2 px-2.5 break-words">Coverage Status</th>
                <th className="py-2 px-2.5 break-words">Timeline & SLA</th>
                <th className="py-2 px-2.5 break-words">Time Since Active</th>
                <th className="py-2 px-2.5 break-words">Assigned SecOps</th>
                <th className="py-2 px-2.5 break-words">Accountable Lead</th>
                <th className="py-2 px-2.5 text-right break-words">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition">
                  <td className="py-2.5 px-3 max-w-[200px] break-words">
                    <span className="font-mono text-[10px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 break-all">
                      {item.techniqueId}
                    </span>
                    <p className="font-bold text-slate-900 mt-0.5 leading-snug break-words">{item.techniqueName}</p>
                  </td>

                  <td className="py-2.5 px-2.5 break-words">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 inline-block break-words">
                      {item.tactic}
                    </span>
                  </td>

                  <td className="py-2.5 px-2.5 max-w-[220px] break-words">
                    <p className="font-medium text-slate-800 text-[11px] break-words" title={item.ruleName}>{item.ruleName}</p>
                    <span className="text-[10px] text-slate-400 font-mono block break-words">Src: {item.telemetrySource}</span>
                  </td>

                  <td className="py-2.5 px-2.5 break-words">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block break-words ${
                      item.coverageStatus === 'Fully Covered' ? 'bg-emerald-100 text-emerald-700' :
                      item.coverageStatus === 'Partial Coverage' ? 'bg-amber-100 text-amber-700' :
                      'bg-rose-100 text-rose-700'
                    }`}>
                      {item.coverageStatus}
                    </span>
                  </td>

                  <td className="py-2.5 px-2.5 break-words text-[11px]">
                    <span className="text-slate-400 block text-[10px] break-words">Identified: {item.identifiedDate}</span>
                    <span className="font-semibold text-slate-800 block break-words">SLA: {item.targetDate}</span>
                  </td>

                  <td className="py-2.5 px-2.5 break-words">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold inline-block break-words ${
                      item.isOverdue ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {item.timeSinceOpenText}
                    </span>
                  </td>

                  <td className="py-2.5 px-2.5 max-w-[140px] break-words">
                    <span className="font-semibold text-slate-800 block text-[11px] break-words">{item.owner}</span>
                  </td>

                  <td className="py-2.5 px-2.5 max-w-[150px] break-words">
                    <span className="text-slate-600 block text-[11px] break-words">{item.accountable}</span>
                    <span className="text-[10px] text-slate-400 block break-words">{item.businessUnit}</span>
                  </td>

                  <td className="py-2.5 px-2.5 text-right break-words">
                    <button
                      onClick={() => onNotify(`Simulated test attack for MITRE technique ${item.techniqueId}. Rule triggered 100% telemetry validation.`)}
                      className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded text-[10px] font-bold transition border border-indigo-200 break-words"
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
    </div>
  );
}
