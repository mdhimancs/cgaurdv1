import { useState, FormEvent } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Plus, 
  Search, 
  ShieldAlert,
  FileText,
  Lock
} from 'lucide-react';
import { INITIAL_TPRM_VENDORS } from '../data/mockData';
import { ThirdPartyVendor } from '../types/dashboard';

interface Props {
  onNotify: (msg: string) => void;
}

export function TprmView({ onNotify }: Props) {
  const [vendors, setVendors] = useState<ThirdPartyVendor[]>(INITIAL_TPRM_VENDORS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Vendor Form State
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'Cloud SaaS' | 'Payment Gateway' | 'AI & LLM API' | 'HR & Payroll' | 'Data Infrastructure'>('Cloud SaaS');
  const [newTier, setNewTier] = useState<'Tier 1 (Critical)' | 'Tier 2 (Important)' | 'Tier 3 (Standard)'>('Tier 1 (Critical)');
  const [newOwner, setNewOwner] = useState('David Sterling');

  const filteredVendors = vendors.filter(v => 
    v.vendorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.businessOwner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddVendor = (e: FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    const newVendor: ThirdPartyVendor = {
      id: `VEN-00${vendors.length + 1}`,
      vendorName: newName,
      category: newCategory,
      tier: newTier,
      riskScore: 85,
      soc2Status: 'Verified Current',
      iso27001: true,
      doraCompliant: true,
      businessOwner: newOwner,
      fourthPartyCount: 5,
      lastAssessmentDate: new Date().toISOString().split('T')[0],
      dataAccessLevel: 'Operational Data'
    };
    setVendors([newVendor, ...vendors]);
    setShowAddModal(false);
    setNewName('');
    onNotify(`Vendor ${newName} successfully onboarded into TPRM risk register.`);
  };

  const handleRequestAudit = (vendorName: string) => {
    onNotify(`Automated SOC 2 / ISO 27001 artifact renewal request dispatched to ${vendorName}.`);
  };

  const avgRiskScore = Math.round(vendors.reduce((acc, v) => acc + v.riskScore, 0) / vendors.length);
  const criticalCount = vendors.filter(v => v.tier === 'Tier 1 (Critical)').length;
  const expiringCount = vendors.filter(v => v.soc2Status !== 'Verified Current').length;

  return (
    <div className="col-span-12 space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
              OneTrust & BitSight Integration
            </span>
            <span className="text-xs text-slate-400">Third-Party Risk Management (TPRM) & Supply Chain Security</span>
          </div>
          <h2 className="text-2xl font-black tracking-tight mt-1">Third-Party Risk Management & Vendor Assurance</h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Continuously monitor vendor SOC 2 compliance, ISO 27001 certifications, EU DORA regulatory requirements, and fourth-party sub-processor dependencies.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-xl border border-slate-700">
          <div className="text-center px-3 border-r border-slate-700">
            <div className="text-2xl font-black text-emerald-400">{avgRiskScore} / 100</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Avg Vendor Rating</div>
          </div>
          <div className="text-center px-3 border-r border-slate-700">
            <div className="text-2xl font-black text-indigo-400">{criticalCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Tier-1 Critical</div>
          </div>
          <div className="text-center px-3">
            <div className="text-2xl font-black text-amber-400">{expiringCount}</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase">Action Req</div>
          </div>
        </div>
      </div>

      {/* Controls & Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search vendor name, category, owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow transition shrink-0"
        >
          <Plus className="w-4 h-4" /> Onboard New Vendor
        </button>
      </div>

      {/* Vendors Table / Cards */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Vendor & Category</th>
                <th className="py-3 px-4">Criticality Tier</th>
                <th className="py-3 px-4">Risk Rating</th>
                <th className="py-3 px-4">SOC 2 / ISO Status</th>
                <th className="py-3 px-4">DORA Compliant</th>
                <th className="py-3 px-4">4th-Party Count</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredVendors.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3.5 px-4">
                    <div className="font-extrabold text-slate-900 text-sm">{v.vendorName}</div>
                    <div className="text-slate-500 text-[11px]">{v.category} • Owner: {v.businessOwner}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.tier.includes('Tier 1') ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {v.tier}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-slate-900">{v.riskScore} / 100</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      v.soc2Status === 'Verified Current' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {v.soc2Status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {v.doraCompliant ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                      </span>
                    ) : (
                      <span className="text-amber-600 font-bold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Pending
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                    {v.fourthPartyCount} Sub-processors
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleRequestAudit(v.vendorName)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition text-xs"
                    >
                      Audit Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Vendor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-black text-slate-900">Onboard New Third-Party Vendor</h3>
            <p className="text-xs text-slate-500">Initiate automated risk scoring, SOC 2 verification, and BitSight telemetry.</p>

            <form onSubmit={handleAddVendor} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Vendor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Datadog Observability"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e: any) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="Cloud SaaS">Cloud SaaS</option>
                    <option value="Payment Gateway">Payment Gateway</option>
                    <option value="AI & LLM API">AI & LLM API</option>
                    <option value="HR & Payroll">HR & Payroll</option>
                    <option value="Data Infrastructure">Data Infrastructure</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Criticality Tier</label>
                  <select
                    value={newTier}
                    onChange={(e: any) => setNewTier(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                  >
                    <option value="Tier 1 (Critical)">Tier 1 (Critical)</option>
                    <option value="Tier 2 (Important)">Tier 2 (Important)</option>
                    <option value="Tier 3 (Standard)">Tier 3 (Standard)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Business Owner</label>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700"
                >
                  Onboard Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
