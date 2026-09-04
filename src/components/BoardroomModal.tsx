import { useState } from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Building2, 
  CheckCircle2, 
  TrendingUp,
  Share2
} from 'lucide-react';
import { EXECUTIVE_INSIGHTS, BU_PERFORMANCE_METRICS } from '../data/mockData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNotify: (msg: string) => void;
}

export function BoardroomModal({ isOpen, onClose, onNotify }: Props) {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    onNotify('C-Suite Executive Board Deck PDF successfully generated and downloaded.');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
              C
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">Executive Boardroom & Risk Committee Briefing</h2>
              <p className="text-xs text-slate-500 font-medium">Q3 Cybersecurity Posture, GRC Compliance & Tech Debt Review</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Download Deck (.PDF)
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
              title="Print Briefing"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-8 overflow-y-auto space-y-6 text-slate-800 text-xs leading-relaxed">
          {/* Executive Memorandum Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800 space-y-3">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest text-slate-400 border-b border-slate-800 pb-2">
              <span>MEMORANDUM TO THE BOARD OF DIRECTORS</span>
              <span>CLASSIFICATION: PRIVILEGED & CONFIDENTIAL</span>
            </div>
            <h3 className="text-lg font-black tracking-tight text-slate-100">
              Executive Cybersecurity Posture & GRC Health: 84.2 / 100
            </h3>
            <p className="text-slate-300">
              The firm’s enterprise cybersecurity posture index advanced <strong>+2.4% MoM</strong>, driven by accelerated automated remediation of cloud misconfigurations via Cloud Custodian and comprehensive EDR sensor coverage across 48,250 production endpoints. Mean Time to Remediate (MTTR) critical vulnerabilities improved to <strong>10.2 days</strong>, outperforming our board-mandated 14-day SLA threshold.
            </p>
          </div>

          {/* Core KRI Scorecard */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Key Risk Indicators (KRI) Executive Matrix
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Firmwide Security Score</span>
                <span className="text-2xl font-black text-indigo-600 block mt-1">84.2</span>
                <span className="text-[10px] text-emerald-600 font-bold">Target: 90.0</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Critical Audit Findings</span>
                <span className="text-2xl font-black text-rose-600 block mt-1">3 Open</span>
                <span className="text-[10px] text-slate-500 font-medium">SOX & PCI Controls</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Firmwide MTTR</span>
                <span className="text-2xl font-black text-slate-900 block mt-1">10.2 Days</span>
                <span className="text-[10px] text-indigo-600 font-bold">14% faster than Q2</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase block">Privilege MFA Rate</span>
                <span className="text-2xl font-black text-emerald-600 block mt-1">99.4%</span>
                <span className="text-[10px] text-slate-500 font-medium">Zero non-MFA admins</span>
              </div>
            </div>
          </div>

          {/* Business Unit Accountability Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Business Unit Risk & Accountability Benchmark
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-x-auto">
              <table className="w-full text-left text-xs table-auto">
                <thead className="bg-slate-50 border-b border-slate-200 font-bold text-slate-500 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-4 break-words">Business Unit</th>
                    <th className="py-2.5 px-4 break-words">Executive Lead</th>
                    <th className="py-2.5 px-4 break-words">Security Score</th>
                    <th className="py-2.5 px-4 break-words">SLA Compliance</th>
                    <th className="py-2.5 px-4 break-words">Overdue Findings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {BU_PERFORMANCE_METRICS.map((bu, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-2.5 px-4 font-bold text-slate-900 break-words">{bu.businessUnit}</td>
                      <td className="py-2.5 px-4 text-slate-500 break-words">{bu.buLead}</td>
                      <td className="py-2.5 px-4 font-mono font-bold break-words">{bu.securityScore}%</td>
                      <td className="py-2.5 px-4 font-mono break-words">{bu.slaComplianceRate}%</td>
                      <td className="py-2.5 px-4 break-words">
                        {bu.overdueVulnerabilities > 0 ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 inline-block break-words">
                            {bu.overdueVulnerabilities} Overdue
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-700 inline-block break-words">
                            Clean
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Items for Board Consideration */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
            <h4 className="font-bold text-amber-950 flex items-center gap-2 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Decisions Requested from the Board:
            </h4>
            <ul className="list-disc list-inside space-y-1.5 text-amber-900 text-xs">
              <li>
                <strong>Approve $2.2M CapEx Modernization Budget:</strong> Mandatory retirement of the AS/400 Payments Gateway in Retail Banking before Q1 2025 regulatory filing.
              </li>
              <li>
                <strong>Authorize Mandatory JIT Access Enforcement:</strong> Enforce automated session revocation across all AWS/Azure root accounts, eliminating long-lived credentials.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
