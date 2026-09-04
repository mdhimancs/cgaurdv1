import { useState } from 'react';
import { 
  Radio, 
  Activity, 
  Zap, 
  CheckCircle2, 
  ShieldAlert, 
  Cpu, 
  Clock, 
  Play,
  RotateCw,
  Terminal,
  Layers
} from 'lucide-react';
import { INITIAL_SIEM_METRICS } from '../data/mockData';
import { SiemSoarMetrics } from '../types/dashboard';

interface Props {
  onNotify: (msg: string) => void;
}

export function SiemSoarView({ onNotify }: Props) {
  const [metrics, setMetrics] = useState<SiemSoarMetrics>(INITIAL_SIEM_METRICS);
  const [isExecutingPlaybook, setIsExecutingPlaybook] = useState(false);

  const handleRunPlaybook = () => {
    setIsExecutingPlaybook(true);
    setTimeout(() => {
      setMetrics(prev => ({
        ...prev,
        soarPlaybooksExecuted24h: prev.soarPlaybooksExecuted24h + 1,
        activeAlerts: Math.max(0, prev.activeAlerts - 3)
      }));
      setIsExecutingPlaybook(false);
      onNotify('SOAR Automated Playbook "IP-Quarantine & LSASS Dump Isolation" executed successfully on 14 endpoints.');
    }, 1200);
  };

  return (
    <div className="col-span-12 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
              CrowdStrike Falcon & Splunk SIEM/SOAR
            </span>
            <span className="text-xs text-slate-400">Security Orchestration, Automation, and Response</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1">SIEM & SOAR Automation Command Hub</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Real-time event ingestion throughput, automated incident containment, Mean Time to Detect (MTTD), Mean Time to Contain (MTTC), and active SOAR playbook execution metrics.
          </p>
        </div>

        <button
          disabled={isExecutingPlaybook}
          onClick={handleRunPlaybook}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-rose-900 text-white rounded-xl text-xs font-bold transition shadow-md shrink-0"
        >
          {isExecutingPlaybook ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" /> Executing Playbook...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" /> Run Autonomous SOAR Playbook
            </>
          )}
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SIEM Ingestion (24h)</span>
          <span className="text-3xl font-black text-slate-900 block mt-2">
            {(metrics.siemEventsIngested24h / 1000000).toFixed(1)}M
          </span>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">100% telemetry coverage</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SOAR Playbooks Executed</span>
          <span className="text-3xl font-black text-indigo-600 block mt-2">
            {metrics.soarPlaybooksExecuted24h.toLocaleString()}
          </span>
          <span className="text-xs text-indigo-700 font-bold mt-1 block">{metrics.soarAutomationRate}% Automation Rate</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mean Time To Detect (MTTD)</span>
          <span className="text-3xl font-black text-slate-900 block mt-2">
            {metrics.meanTimeToDetectMinutes} min
          </span>
          <span className="text-xs text-emerald-600 font-bold mt-1 block">Industry benchmark: 15 min</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Mean Time To Contain (MTTC)</span>
          <span className="text-3xl font-black text-emerald-600 block mt-2">
            {metrics.meanTimeToContainMinutes} min
          </span>
          <span className="text-xs text-slate-500 font-medium mt-1 block">Autonomous quarantine SLA</span>
        </div>
      </div>

      {/* Details & Top Triggered Rule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600" /> Active Threat Hunting & Rule Performance
          </h3>
          <div className="space-y-3 text-xs text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Top Triggered SIEM Rule</span>
                <span className="font-bold text-slate-900">{metrics.topTriggeredRule}</span>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700">
                Critical Severity
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">False Positive Suppression Rate:</span>
              <span className="font-mono font-bold text-slate-900">{metrics.falsePositiveRate}% (Optimized via ML)</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">Unresolved Active Alerts:</span>
              <span className="font-mono font-bold text-rose-600">{metrics.activeAlerts} Alerts</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-slate-500">CrowdStrike EDR Sensor Health:</span>
              <span className="font-mono font-bold text-emerald-600">99.8% Online</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-600" /> Automated SOAR Playbook Directory
          </h3>
          <div className="space-y-3 text-xs">
            <div className="p-3 border border-slate-200 rounded-xl space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Playbook #104: Ransomware Host Isolation</span>
                <span className="text-emerald-700 font-mono">Active</span>
              </div>
              <p className="text-slate-500 text-[11px]">Automatically isolates compromised endpoints upon Wazuh / Falcon ransomware heuristic trigger.</p>
            </div>

            <div className="p-3 border border-slate-200 rounded-xl space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>Playbook #118: Compromised IAM Key Revocation</span>
                <span className="text-emerald-700 font-mono">Active</span>
              </div>
              <p className="text-slate-500 text-[11px]">Revokes AWS/Azure access keys instantly when GitHub Secret Scanning detects exposed tokens.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
