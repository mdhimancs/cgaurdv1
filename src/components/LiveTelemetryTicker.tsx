import { useState, useEffect } from 'react';
import { Activity, ShieldAlert, Pause, Play, ChevronRight, Terminal } from 'lucide-react';
import { SecurityIncident } from '../types/dashboard';

interface Props {
  initialIncidents: SecurityIncident[];
  onSelectIncident: (inc: SecurityIncident) => void;
}

export function LiveTelemetryTicker({ initialIncidents, onSelectIncident }: Props) {
  const [incidents, setIncidents] = useState<SecurityIncident[]>(initialIncidents);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % incidents.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPaused, incidents.length]);

  const current = incidents[currentIndex];

  return (
    <div className="bg-slate-950 text-slate-100 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs shrink-0">
      <div className="flex items-center gap-3 overflow-hidden">
        <div className="flex items-center gap-1.5 bg-indigo-500/25 text-indigo-300 px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] tracking-wider border border-indigo-400/40 shrink-0">
          <Activity className="w-3 h-3 animate-pulse text-indigo-400" /> Live Telemetry Feed
        </div>
        
        {current && (
          <div 
            onClick={() => onSelectIncident(current)}
            className="flex items-center gap-2 truncate cursor-pointer hover:text-white transition group"
          >
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              current.severity === 'Critical' ? 'bg-rose-500/30 text-rose-200 border border-rose-400/50' :
              current.severity === 'High' ? 'bg-amber-500/30 text-amber-200 border border-amber-400/50' :
              'bg-slate-800 text-slate-200 border border-slate-700'
            }`}>
              {current.severity}
            </span>
            <span className="font-bold text-white group-hover:underline">{current.title}</span>
            <span className="text-slate-300 truncate hidden md:inline font-medium">({current.businessUnit} • {current.timeAgo})</span>
            <ChevronRight className="w-3.5 h-3.5 text-indigo-400 shrink-0 group-hover:translate-x-0.5 transition" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0 ml-4">
        <span className="text-[11px] font-mono text-slate-300 hidden sm:inline font-medium">
          Ingesting 48,250 endpoints (Wazuh & Falcon)
        </span>
        <button
          onClick={() => setIsPaused(!isPaused)}
          className="p-1 rounded hover:bg-slate-800 text-slate-300 hover:text-white transition"
          title={isPaused ? "Resume Live Feed" : "Pause Live Feed"}
        >
          {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}
