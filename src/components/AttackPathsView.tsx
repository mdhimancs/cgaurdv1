import { useState } from 'react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Zap, 
  AlertTriangle, 
  ArrowRight, 
  Server, 
  Database, 
  Lock, 
  Clock, 
  User, 
  Building2,
  CheckCircle2,
  RotateCw
} from 'lucide-react';

interface Props {
  onNotify: (msg: string) => void;
}

interface AttackVectorItem {
  id: string;
  title: string;
  score: number;
  riskLevel: 'Critical' | 'High' | 'Medium';
  hopsCount: number;
  entryPoint: string;
  targetCrownJewel: string;
  killChainSteps: string[];
  identifiedDate: string;
  targetDate: string;
  daysOpen: number;
  timeSinceOpenText: string;
  isOverdue: boolean;
  owner: string;
  accountable: string;
  businessUnit: string;
  status: 'Open' | 'In Progress' | 'Mitigated' | 'Overdue';
  mitigationControl: string;
}

const INITIAL_ATTACK_VECTORS: AttackVectorItem[] = [
  {
    id: 'ATK-PATH-001',
    title: 'Public Ingress API to Core Clearing & Settlement Ledger',
    score: 98,
    riskLevel: 'Critical',
    hopsCount: 4,
    entryPoint: 'api.consumer-pay.globalbank.com (Public Container)',
    targetCrownJewel: 'Aurora DB: settlement-prod-db-01 (Tier 1)',
    killChainSteps: [
      'CVE-2024-41110 Docker Auth Bypass on Public Pod',
      'Assumes over-privileged IAM Role: AppServiceRole',
      'Cross-Account AssumeRole via trust relationship',
      'Direct SQL write privileges on Settlement Ledger'
    ],
    identifiedDate: '2024-08-10',
    targetDate: '2024-08-20',
    daysOpen: 14,
    timeSinceOpenText: '14 days (4d Overdue)',
    isOverdue: true,
    owner: 'Alex Rivera (Staff DevOps)',
    accountable: 'Elena Rostova (EVP Markets)',
    businessUnit: 'Global Markets',
    status: 'Overdue',
    mitigationControl: 'Enforce AWS SCP denying cross-account AssumeRole and patch container host runtime.'
  },
  {
    id: 'ATK-PATH-002',
    title: 'Phished Contractor Workstation to SWIFT Interbank Gateway',
    score: 84,
    riskLevel: 'High',
    hopsCount: 3,
    entryPoint: 'Remote VPN Endpoint (Contractor Laptop)',
    targetCrownJewel: 'SWIFT Alliance Gateway Server',
    killChainSteps: [
      'Phished contractor credential bypasses legacy VPN',
      'Kerberoasting against Active Directory Service Accounts',
      'Domain Admin privilege escalation via BloodHound path',
      'Access to isolated SWIFT interbank payment gateway'
    ],
    identifiedDate: '2024-08-16',
    targetDate: '2024-08-30',
    daysOpen: 8,
    timeSinceOpenText: '8 days open',
    isOverdue: false,
    owner: 'Arthur Pendelton (Identity Lead)',
    accountable: 'Marcus Vance (VP Consumer Tech)',
    businessUnit: 'Consumer Tech',
    status: 'In Progress',
    mitigationControl: 'Enforce FIDO2 hardware token MFA on VPN and deploy Cisco ISE micro-segmentation.'
  },
  {
    id: 'ATK-PATH-003',
    title: 'Compromised GitHub Actions Runner to Production Kubernetes Pods',
    score: 79,
    riskLevel: 'High',
    hopsCount: 3,
    entryPoint: 'github.com/bank-org/frontend-monorepo CI/CD',
    targetCrownJewel: 'k8s-prod-cluster-us-east-1',
    killChainSteps: [
      'Malicious pull request executes untrusted GitHub Actions step',
      'Exfiltrates static AWS Kubeconfig token stored in runner',
      'Direct kubectl exec into production payment processing pods'
    ],
    identifiedDate: '2024-08-18',
    targetDate: '2024-09-02',
    daysOpen: 6,
    timeSinceOpenText: '6 days open',
    isOverdue: false,
    owner: 'Wei Zhang (DevSecOps Specialist)',
    accountable: 'Chloe Dupont (Dir Regional Ops)',
    businessUnit: 'Logistics & Ops',
    status: 'In Progress',
    mitigationControl: 'Migrate to GitHub OIDC short-lived federation and enforce Kyverno signed admission.'
  }
];

export function AttackPathsView({ onNotify }: Props) {
  const [vectors, setVectors] = useState<AttackVectorItem[]>(INITIAL_ATTACK_VECTORS);
  const [mitigatingId, setMitigatingId] = useState<string | null>(null);

  const handleMitigate = (item: AttackVectorItem) => {
    setMitigatingId(item.id);
    setTimeout(() => {
      setVectors(prev => prev.map(v => v.id === item.id ? { ...v, status: 'Mitigated' } : v));
      setMitigatingId(null);
      onNotify(`Attack Path [${item.id}] successfully neutralized: ${item.mitigationControl}`);
    }, 900);
  };

  return (
    <div className="col-span-12 space-y-3.5">
      {/* Compact Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-white shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/30">
              XM Cyber • BloodHound • Breach & Attack Simulation (BAS)
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Choke Point Vector Modeling</span>
          </div>
          <h2 className="text-xl font-black tracking-tight">Offensive Attack Paths & Critical Choke Points</h2>
          <p className="text-xs text-slate-300 max-w-3xl">
            Vector graph analysis correlating multi-hop lateral movement risks from exposed perimeter assets to Tier-1 crown jewels.
          </p>
        </div>

        <button
          onClick={() => onNotify('Triggered full automated BloodHound & XM Cyber attack graph re-computation across 48,250 nodes.')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition shadow-xs shrink-0"
        >
          <Zap className="w-3.5 h-3.5" /> Re-Compute Attack Graph
        </button>
      </div>

      {/* Metric summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Modeled Attack Paths</span>
          <span className="text-2xl font-black text-slate-900 block mt-0.5">3 Active Vectors</span>
          <span className="text-[10px] text-slate-500">14 critical choke points</span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Highest Path Risk Score</span>
          <span className="text-2xl font-black text-rose-600 block mt-0.5">98 / 100</span>
          <span className="text-[10px] text-rose-700 font-semibold">Immediate action req</span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Hops to Compromise</span>
          <span className="text-2xl font-black text-indigo-600 block mt-0.5">3.3 Hops</span>
          <span className="text-[10px] text-indigo-700 font-semibold">Lateral containment</span>
        </div>
        <div className="bg-white border border-slate-200/90 rounded-xl p-3 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Remediation Readiness</span>
          <span className="text-2xl font-black text-emerald-600 block mt-0.5">100% Guardrails</span>
          <span className="text-[10px] text-emerald-700 font-semibold">Automated SCP & ACLs</span>
        </div>
      </div>

      {/* Detailed Attack Vectors Cards */}
      <div className="space-y-3">
        {vectors.map((vec) => (
          <div key={vec.id} className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  {vec.id}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  vec.riskLevel === 'Critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {vec.riskLevel} Risk • Score {vec.score}/100
                </span>
                <h3 className="text-xs sm:text-sm font-black text-slate-900">{vec.title}</h3>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {vec.status !== 'Mitigated' ? (
                  <button
                    disabled={mitigatingId === vec.id}
                    onClick={() => handleMitigate(vec)}
                    className="flex items-center gap-1 px-3 py-1 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-900 text-white rounded text-[11px] font-bold transition shadow-2xs"
                  >
                    {mitigatingId === vec.id ? (
                      <>
                        <RotateCw className="w-3 h-3 animate-spin" /> Neutralizing...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3 h-3" /> Neutralize Attack Vector
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Vector Mitigated
                  </span>
                )}
              </div>
            </div>

            {/* Kill Chain Visualization */}
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Simulated Multi-Hop Lateral Kill Chain ({vec.hopsCount} Hops)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs">
                {vec.killChainSteps.map((step, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 relative flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase block">Step 0{idx + 1}</span>
                      <p className="text-[11px] font-bold text-slate-800 mt-0.5 leading-snug">{step}</p>
                    </div>
                    {idx < vec.killChainSteps.length - 1 && (
                      <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-slate-400 font-black text-xs">
                        &rarr;
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Granular Metadata Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Assigned Owner</span>
                <span className="font-semibold text-slate-800">{vec.owner}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Accountable VP</span>
                <span className="font-semibold text-slate-800">{vec.accountable} ({vec.businessUnit})</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Timeline & Days Open</span>
                <span className={`font-bold ${vec.isOverdue && vec.status !== 'Mitigated' ? 'text-rose-600' : 'text-slate-800'}`}>
                  {vec.timeSinceOpenText} (Identified: {vec.identifiedDate})
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Target SLA Resolution</span>
                <span className="font-semibold text-slate-800">{vec.targetDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
