import React, { useState } from 'react';
import { InteractiveMap } from '../components/InteractiveMap';
import { SurveyTransect, SonarHazard } from '../types/sonar';
import {
  Compass,
  Navigation,
  Activity,
  Layers,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Maximize2,
  Filter,
} from 'lucide-react';

interface MapViewProps {
  currentTransect: SurveyTransect;
  hazards: SonarHazard[];
  selectedHazard: SonarHazard | null;
  onSelectHazard: (hazard: SonarHazard) => void;
  onNavigateToWaterfall: (hazard: SonarHazard) => void;
}

export const MapView: React.FC<MapViewProps> = ({
  currentTransect,
  hazards,
  selectedHazard,
  onSelectHazard,
  onNavigateToWaterfall,
}) => {
  const [filterRisk, setFilterRisk] = useState<string>('ALL');

  const filteredHazards = hazards.filter((h) => {
    if (filterRisk === 'ALL') return true;
    return h.riskLevel === filterRisk;
  });

  const highRiskCount = hazards.filter((h) => h.riskLevel === 'HIGH').length;
  const mediumRiskCount = hazards.filter((h) => h.riskLevel === 'MEDIUM').length;

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-slate-950 select-none">
      
      {/* Top Map Context Bar */}
      <header className="h-14 px-6 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
              <span>{currentTransect.name}</span>
            </h2>
            <div className="text-[11px] text-slate-400 flex items-center gap-3">
              <span>{currentTransect.locationName}</span>
              <span>·</span>
              <span className="font-mono text-sky-400">Lat: {currentTransect.centerLat}° N, Lng: {currentTransect.centerLng}° E</span>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <span className="text-[11px] text-slate-400 px-2 flex items-center gap-1">
              <Filter className="w-3 h-3 text-sky-400" /> Filter Pins:
            </span>
            <button
              onClick={() => setFilterRisk('ALL')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                filterRisk === 'ALL' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({hazards.length})
            </button>
            <button
              onClick={() => setFilterRisk('HIGH')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                filterRisk === 'HIGH' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              High ({highRiskCount})
            </button>
            <button
              onClick={() => setFilterRisk('MEDIUM')}
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                filterRisk === 'MEDIUM' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Medium ({mediumRiskCount})
            </button>
          </div>

          {selectedHazard && (
            <button
              onClick={() => onNavigateToWaterfall(selectedHazard)}
              className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg shadow-sky-600/20 transition-all active:scale-95"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Inspect in Sonar Lab</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </header>

      {/* Main Map Container */}
      <div className="flex-1 relative">
        <InteractiveMap
          currentTransect={currentTransect}
          hazards={filteredHazards}
          selectedHazardId={selectedHazard?.id || null}
          onSelectHazard={onSelectHazard}
          onInspectWaterfall={onNavigateToWaterfall}
        />

        {/* Floating Selected Hazard Summary Card (Bottom-Right) */}
        {selectedHazard && (
          <div className="absolute bottom-5 right-5 z-20 w-80 lg:w-96 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-4 shadow-2xl space-y-3">
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5">
              <div>
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                  {selectedHazard.id} · {selectedHazard.swathChannel.toUpperCase()} CHANNEL
                </span>
                <h3 className="font-bold text-sm text-white leading-tight mt-0.5">
                  {selectedHazard.targetType}
                </h3>
              </div>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase border ${
                  selectedHazard.riskLevel === 'HIGH'
                    ? 'bg-red-950 text-red-300 border-red-500/40'
                    : selectedHazard.riskLevel === 'MEDIUM'
                    ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                }`}
              >
                {selectedHazard.riskLevel} Risk
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Confidence</span>
                <span className="font-mono font-bold text-sky-400">
                  {(selectedHazard.confidence * 100).toFixed(1)}%
                </span>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Relief Height</span>
                <span className="font-mono font-bold text-emerald-400">
                  {selectedHazard.estimatedHeightM}m
                </span>
              </div>
              <div className="p-2 bg-slate-950 rounded border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-sans">Water Depth</span>
                <span className="font-mono text-slate-200">
                  {selectedHazard.waterDepthM}m
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 italic bg-slate-950/70 p-2 rounded border border-slate-800/80">
              "{selectedHazard.acousticSignature}"
            </p>

            <button
              onClick={() => onNavigateToWaterfall(selectedHazard)}
              className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Activity className="w-4 h-4" />
              <span>Open Detailed Sonar & Shadow Analysis</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
