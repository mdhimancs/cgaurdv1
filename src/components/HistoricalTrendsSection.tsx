import { useState } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Calendar, 
  Target, 
  Activity, 
  ArrowUpRight, 
  Clock,
  Sparkles,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ReferenceLine 
} from 'recharts';
import { HISTORICAL_TREND_DATA } from '../data/mockData';
import { HistoricalTrendPoint } from '../types/dashboard';

interface Props {
  data?: HistoricalTrendPoint[];
}

export function HistoricalTrendsSection({ data = HISTORICAL_TREND_DATA }: Props) {
  const [selectedMetric, setSelectedMetric] = useState<'all' | 'security' | 'audit'>('all');
  const [showVolumeBars, setShowVolumeBars] = useState<boolean>(true);
  const [activePoint, setActivePoint] = useState<HistoricalTrendPoint | null>(null);

  // Computed summary deltas
  const firstPoint = data[0];
  const latestPoint = data[data.length - 1];

  const scoreDelta = latestPoint && firstPoint ? +(latestPoint.securityScore - firstPoint.securityScore).toFixed(1) : 0;
  const closureRateDelta = latestPoint && firstPoint ? +(latestPoint.auditClosureRate - firstPoint.auditClosureRate).toFixed(1) : 0;
  const mttrDelta = latestPoint && firstPoint ? +(firstPoint.mttrDays - latestPoint.mttrDays).toFixed(1) : 0;
  const totalClosed = data.reduce((acc, curr) => acc + curr.closedAuditFindings, 0);

  return (
    <div className="col-span-12 bg-white border border-slate-200/90 rounded-xl p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 bg-indigo-50 border border-indigo-200 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              <TrendingUp className="w-3 h-3" /> Historical Trends
            </span>
            <span className="text-xs text-slate-500 font-medium">6-Month Enterprise Trajectory (Apr – Sep 2026)</span>
          </div>
          <h2 className="text-base sm:text-lg font-black text-slate-900 mt-1">
            Overall Security Score & Audit Finding Closure Trends
          </h2>
          <p className="text-xs text-slate-600 max-w-3xl">
            Longitudinal telemetry tracking security posture maturation, audit observation remediation velocity, and MTTR compression against executive targets.
          </p>
        </div>

        {/* View Controls & Toggles */}
        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="inline-flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedMetric('all')}
              className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                selectedMetric === 'all'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dual Trend Line
            </button>
            <button
              onClick={() => setSelectedMetric('security')}
              className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                selectedMetric === 'security'
                  ? 'bg-white text-indigo-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Security Score
            </button>
            <button
              onClick={() => setSelectedMetric('audit')}
              className={`px-2.5 py-1 rounded-md font-bold transition-colors ${
                selectedMetric === 'audit'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Closure Rate %
            </button>
          </div>

          <button
            onClick={() => setShowVolumeBars(!showVolumeBars)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 ${
              showVolumeBars
                ? 'bg-slate-900 text-white border-slate-800'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Audit Volume</span> Bars
          </button>
        </div>
      </div>

      {/* 4-Column Trend Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Security Score Progress</span>
            <span className="flex items-center text-[10px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3" /> +{scoreDelta} pts
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{latestPoint.securityScore}</span>
            <span className="text-xs text-slate-600 font-medium">/ 100 (from {firstPoint.securityScore})</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
            <span>Target: 90.0</span>
            <span className="font-bold text-indigo-700">{((latestPoint.securityScore / 90.0) * 100).toFixed(0)}% of goal</span>
          </div>
        </div>

        <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Audit Closure Rate</span>
            <span className="flex items-center text-[10px] font-bold text-emerald-800 bg-emerald-100/80 border border-emerald-200 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3" /> +{closureRateDelta}%
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-emerald-700">{latestPoint.auditClosureRate}%</span>
            <span className="text-xs text-slate-600 font-medium">(Target: &gt;85.0%)</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
            <span>SLA Status:</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Exceeding SLA
            </span>
          </div>
        </div>

        <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">MTTR Reduction</span>
            <span className="flex items-center text-[10px] font-bold text-indigo-800 bg-indigo-100/80 border border-indigo-200 px-1.5 py-0.5 rounded">
              {mttrDelta}d faster
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{latestPoint.mttrDays}d</span>
            <span className="text-xs text-slate-600 font-medium">(Down from {firstPoint.mttrDays}d)</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
            <span>Turnaround:</span>
            <span className="font-bold text-indigo-700">54.3% faster</span>
          </div>
        </div>

        <div className="bg-slate-50/80 border border-slate-200/90 rounded-xl p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Cumulative Remediations</span>
            <span className="text-[10px] font-bold text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">6-Mo Total</span>
          </div>
          <div className="mt-2 flex items-baseline gap-1.5">
            <span className="text-2xl font-black text-slate-900">{totalClosed}</span>
            <span className="text-xs text-slate-600 font-medium">findings resolved</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600">
            <span>Remaining Open:</span>
            <span className="font-bold text-rose-600">{latestPoint.openAuditFindings} active items</span>
          </div>
        </div>
      </div>

      {/* Recharts Trend Line Graph */}
      <div className="bg-slate-50/50 border border-slate-200/80 rounded-xl p-3 sm:p-4">
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 15, right: 25, left: 0, bottom: 5 }}
              onMouseMove={(state: any) => {
                if (state && state.activePayload && state.activePayload.length > 0) {
                  setActivePoint(state.activePayload[0].payload);
                }
              }}
              onMouseLeave={() => setActivePoint(null)}
            >
              <defs>
                <linearGradient id="scoreLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#4338ca" />
                </linearGradient>
                <linearGradient id="closureLineGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

              <XAxis 
                dataKey="monthShort" 
                tickLine={false} 
                stroke="#64748b" 
                tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }} 
                dy={8}
              />

              <YAxis 
                yAxisId="scoreAxis"
                domain={[50, 100]} 
                tickLine={false} 
                stroke="#64748b" 
                tick={{ fill: '#334155', fontSize: 11, fontWeight: 600 }}
                tickFormatter={(val) => `${val}`}
                width={38}
              />

              {showVolumeBars && (
                <YAxis 
                  yAxisId="volumeAxis" 
                  orientation="right"
                  domain={[0, 30]}
                  tickLine={false}
                  stroke="#94a3b8"
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  tickFormatter={(val) => `${val} qty`}
                  width={42}
                />
              )}

              {/* Reference Target Lines */}
              {(selectedMetric === 'all' || selectedMetric === 'security') && (
                <ReferenceLine 
                  yAxisId="scoreAxis"
                  y={90} 
                  stroke="#6366f1" 
                  strokeDasharray="4 4" 
                  strokeWidth={1.5}
                  label={{
                    value: 'Security Target: 90.0',
                    position: 'insideTopRight',
                    fill: '#4338ca',
                    fontSize: 10,
                    fontWeight: 700
                  }}
                />
              )}

              {(selectedMetric === 'all' || selectedMetric === 'audit') && (
                <ReferenceLine 
                  yAxisId="scoreAxis"
                  y={85} 
                  stroke="#059669" 
                  strokeDasharray="4 4" 
                  strokeWidth={1.5}
                  label={{
                    value: 'Audit Closure Target: 85%',
                    position: 'insideBottomRight',
                    fill: '#047857',
                    fontSize: 10,
                    fontWeight: 700
                  }}
                />
              )}

              {/* Volume Bars */}
              {showVolumeBars && (
                <Bar 
                  yAxisId="volumeAxis"
                  dataKey="closedAuditFindings" 
                  name="Closed Findings (Mo.)" 
                  fill="#cbd5e1" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={22}
                />
              )}

              {/* Main Trend Lines */}
              {(selectedMetric === 'all' || selectedMetric === 'security') && (
                <Line
                  yAxisId="scoreAxis"
                  type="monotone"
                  dataKey="securityScore"
                  name="Overall Security Score"
                  stroke="url(#scoreLineGrad)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#4f46e5', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#4338ca', stroke: '#c7d2fe', strokeWidth: 3 }}
                />
              )}

              {(selectedMetric === 'all' || selectedMetric === 'audit') && (
                <Line
                  yAxisId="scoreAxis"
                  type="monotone"
                  dataKey="auditClosureRate"
                  name="Audit Closure Rate (%)"
                  stroke="url(#closureLineGrad)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#10b981', stroke: '#ffffff', strokeWidth: 2 }}
                  activeDot={{ r: 7, fill: '#047857', stroke: '#a7f3d0', strokeWidth: 3 }}
                />
              )}

              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const pt = payload[0].payload as HistoricalTrendPoint;
                    return (
                      <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs min-w-[240px] space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                          <span className="font-bold text-slate-200 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-indigo-400" /> {pt.month}
                          </span>
                          <span className="font-mono text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                            MTTR: {pt.mttrDays}d
                          </span>
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-indigo-300 font-semibold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> Security Score:
                            </span>
                            <span className="font-black text-white font-mono">{pt.securityScore} / 100</span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Audit Closure Rate:
                            </span>
                            <span className="font-black text-emerald-300 font-mono">{pt.auditClosureRate}%</span>
                          </div>

                          <div className="pt-1 border-t border-slate-800/80 flex justify-between text-[11px] text-slate-300">
                            <span>Closed vs Opened:</span>
                            <span className="font-mono">
                              <strong className="text-emerald-400">+{pt.closedAuditFindings}</strong> closed / <strong className="text-amber-400">+{pt.newAuditFindings}</strong> new
                            </span>
                          </div>

                          <div className="flex justify-between text-[11px] text-slate-300">
                            <span>Active Open Backlog:</span>
                            <span className="font-mono text-rose-300 font-bold">{pt.openAuditFindings} findings</span>
                          </div>
                        </div>

                        {pt.milestone && (
                          <div className="pt-1.5 border-t border-slate-800 text-[10px] text-slate-300 bg-slate-950/50 p-1.5 rounded flex items-start gap-1">
                            <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                            <span className="leading-snug">{pt.milestone}</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />

              <Legend 
                verticalAlign="top" 
                align="right"
                wrapperStyle={{ paddingBottom: '10px', fontSize: '11px', fontWeight: 600 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 6-Month Key Governance Milestones Ribbon */}
      <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3 sm:p-3.5">
        <div className="flex items-center gap-2 mb-2">
          <Info className="w-3.5 h-3.5 text-indigo-600" />
          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            6-Month Security Engineering & Governance Milestones
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-xs">
          {data.map((item, idx) => (
            <div 
              key={item.month} 
              className={`p-2 rounded-lg border transition-all ${
                activePoint?.month === item.month
                  ? 'bg-indigo-50 border-indigo-300 shadow-2xs'
                  : 'bg-white border-slate-200/80 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span className="font-bold text-slate-900 font-mono">{item.monthShort}</span>
                <span className="text-slate-600 font-bold">Score: {item.securityScore} | {item.auditClosureRate}%</span>
              </div>
              <p className="text-slate-700 font-medium text-[11px] mt-1 leading-snug line-clamp-2">
                {item.milestone}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
