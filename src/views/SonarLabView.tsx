import React, { useState, useEffect } from 'react';
import { SonarHazard, PipelineSettings, SurveyTransect } from '../types/sonar';
import { generateSyntheticSonarImage } from '../data/sampleDatasets';
import {
  calculateTargetHeight,
  calculateGrazingAngle,
  calculateGroundRange,
} from '../utils/acousticPhysics';
import {
  Activity,
  Crosshair,
  ShieldCheck,
  Layers,
  ChevronRight,
  TrendingDown,
  Info,
  Maximize2,
  Waves,
} from 'lucide-react';

interface SonarLabViewProps {
  hazards: SonarHazard[];
  selectedHazard: SonarHazard | null;
  onSelectHazard: (hazard: SonarHazard) => void;
  settings: PipelineSettings;
  onUpdateSettings: (newSettings: Partial<PipelineSettings>) => void;
  currentTransect: SurveyTransect;
}

export const SonarLabView: React.FC<SonarLabViewProps> = ({
  hazards,
  selectedHazard,
  onSelectHazard,
  settings,
  onUpdateSettings,
  currentTransect,
}) => {
  const [isSlantCorrected, setIsSlantCorrected] = useState<boolean>(settings.slantRangeEnabled);
  const [waterfallImage, setWaterfallImage] = useState<string>('');

  const current = selectedHazard || hazards[0];

  useEffect(() => {
    if (!current) return;
    const url = generateSyntheticSonarImage(
      current.targetType,
      current.swathChannel,
      settings.colorPalette,
      isSlantCorrected
    );
    setWaterfallImage(url);
  }, [current, settings.colorPalette, isSlantCorrected]);

  const shadowLen = current?.shadowLengthM || 4.2;
  const altitude = current?.altitudeM || 5.4;
  const slantRange = current?.slantRangeM || 24.5;
  const targetHeight = calculateTargetHeight(shadowLen, altitude, slantRange);
  const grazingAngle = calculateGrazingAngle(slantRange, altitude);
  const groundRange = calculateGroundRange(slantRange, altitude);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden select-none">
      
      {/* Top Header */}
      <header className="h-14 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 border border-sky-500/30 rounded-lg text-sky-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Side Scan Sonar Waterfall & Shadow Physics Lab
            </h2>
            <p className="text-[11px] text-slate-400">
              Interactive acoustic backscatter inspection, slant-range correction, and geometric ray tracing
            </p>
          </div>
        </div>

        {/* Sonar Palette Selector */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px]">Acoustic Palette:</span>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {[
              { id: 'bronze', label: 'Bronze' },
              { id: 'ocean', label: 'Cyan' },
              { id: 'amber', label: 'Amber' },
              { id: 'grayscale', label: 'Mono' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => onUpdateSettings({ colorPalette: p.id as any })}
                className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                  settings.colorPalette === p.id
                    ? 'bg-sky-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* 3-Column Studio Layout */}
      <div className="flex-1 grid grid-cols-12 overflow-hidden">
        
        {/* Left: Target Browser (3 cols) */}
        <div className="col-span-12 md:col-span-3 bg-slate-900/60 border-r border-slate-800 flex flex-col h-full overflow-hidden">
          <div className="p-3 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Survey Targets ({hazards.length})
            </span>
            <span className="text-[10px] font-mono text-sky-400">Select to Inspect</span>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
            {hazards.map((h) => {
              const isSelected = current?.id === h.id;
              return (
                <div
                  key={h.id}
                  onClick={() => onSelectHazard(h)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-sky-950/70 border-sky-500/60 text-white shadow-md'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-sky-400 font-bold">{h.id}</span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${
                        h.riskLevel === 'HIGH'
                          ? 'bg-red-950 text-red-300 border-red-500/40'
                          : h.riskLevel === 'MEDIUM'
                          ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                      }`}
                    >
                      {h.riskLevel}
                    </span>
                  </div>

                  <div className="font-semibold text-xs text-white truncate mb-1.5">
                    {h.targetType}
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-400 font-mono">
                    <span>Conf: <strong className="text-sky-300">{(h.confidence * 100).toFixed(0)}%</strong></span>
                    <span>Relief: <strong className="text-emerald-300">{h.estimatedHeightM}m</strong></span>
                    <span>Channel: {h.swathChannel}</span>
                    <span>Shadow: {h.shadowLengthM}m</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Center: Waterfall Viewer (5 cols) */}
        <div className="col-span-12 md:col-span-5 bg-slate-950 flex flex-col h-full border-r border-slate-800 overflow-hidden">
          
          {/* Slant-range toggle bar */}
          <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-sky-400" />
              <span className="font-semibold text-white">Slant-Range Correction</span>
            </div>

            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                type="button"
                onClick={() => setIsSlantCorrected(false)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  !isSlantCorrected
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Raw Slant (Nadir On)
              </button>
              <button
                type="button"
                onClick={() => setIsSlantCorrected(true)}
                className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                  isSlantCorrected
                    ? 'bg-sky-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Ground Range (Water Stripped)
              </button>
            </div>
          </div>

          {/* Waterfall Canvas Display */}
          <div className="flex-1 p-4 flex items-center justify-center overflow-hidden bg-black/60 relative">
            {waterfallImage && (
              <div className="relative w-full h-full max-h-[560px] rounded-xl overflow-hidden border border-slate-800 bg-black flex items-center justify-center shadow-2xl">
                <img
                  src={waterfallImage}
                  alt="Acoustic waterfall"
                  className="w-full h-full object-contain"
                />

                {/* Candidate Bounding Box */}
                {current && (
                  <div
                    className="absolute border-2 border-red-500 rounded bg-red-500/15 shadow-[0_0_20px_#ef4444]"
                    style={{
                      top: '38%',
                      left: current.swathChannel === 'starboard' ? '65%' : '18%',
                      width: '24%',
                      height: '18%',
                    }}
                  >
                    <div className="absolute -top-7 left-0 px-2 py-0.5 bg-red-950 border border-red-500 rounded text-[10px] font-mono text-red-200 whitespace-nowrap shadow-lg">
                      {current.targetType} ({(current.confidence * 100).toFixed(0)}%)
                    </div>
                    <div className="absolute -bottom-6 right-0 px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] font-mono text-emerald-400">
                      Shadow: {current.shadowLengthM}m verified
                    </div>
                  </div>
                )}

                {/* Nadir strip when raw */}
                {!isSlantCorrected && (
                  <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 bg-sky-500/10 border-x border-sky-400/30 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-mono text-sky-400/80 -rotate-90 whitespace-nowrap">
                      WATER COLUMN NADIR
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Waterfall Status */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Swath: {currentTransect.swathWidthM}m</span>
            <span>Freq: {currentTransect.frequencyKhz} kHz</span>
            <span className="text-emerald-400">Shadow Verified: YES</span>
          </div>

        </div>

        {/* Right: Acoustic Shadow Physics Studio (4 cols) */}
        <div className="col-span-12 md:col-span-4 bg-slate-900/70 flex flex-col h-full overflow-y-auto p-4 space-y-4">
          
          <div className="p-3.5 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Acoustic Shadow Physics Verification</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Side-scan sound waves travel diagonally from the towfish. Objects elevated above the seabed block acoustic energy, creating a downstream acoustic shadow void.
            </p>
          </div>

          {/* Ray-Tracing Diagram */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
              <span>Towfish Altitude (Ha): <strong className="text-sky-400">{altitude}m</strong></span>
              <span>Grazing Angle (θ): <strong className="text-sky-400">{grazingAngle}°</strong></span>
            </div>

            <svg viewBox="0 0 320 150" className="w-full h-40 bg-slate-900/60 rounded-lg border border-slate-800">
              {/* Water surface */}
              <line x1="10" y1="20" x2="310" y2="20" stroke="#0284c7" strokeWidth="1" strokeDasharray="4 2" />
              <text x="15" y="15" fill="#38bdf8" fontSize="8" fontFamily="monospace">SEA SURFACE</text>

              {/* Towfish platform */}
              <rect x="35" y="38" width="26" height="14" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1.5" />
              <text x="35" y="65" fill="#94a3b8" fontSize="8" fontFamily="monospace">Towfish</text>

              {/* Seabed line */}
              <line x1="10" y1="120" x2="310" y2="120" stroke="#64748b" strokeWidth="2" />
              <text x="250" y="138" fill="#64748b" fontSize="8" fontFamily="monospace">SEABED</text>

              {/* Acoustic pulse ray */}
              <line x1="61" y1="45" x2="160" y2="96" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 3" />

              {/* Target elevated relief */}
              <polygon points="155,120 160,96 165,120" fill="#ef4444" stroke="#f87171" strokeWidth="1.5" />
              <text x="145" y="90" fill="#f87171" fontSize="9" fontWeight="bold" fontFamily="monospace">
                Ht = {targetHeight}m
              </text>

              {/* Acoustic Shadow Zone */}
              <rect x="165" y="117" width="85" height="5" fill="#000000" stroke="#475569" strokeWidth="1" />
              <text x="175" y="136" fill="#facc15" fontSize="8" fontFamily="monospace">
                Shadow Ls = {shadowLen}m
              </text>

              {/* Shadow cutoff ray */}
              <line x1="160" y1="96" x2="250" y2="120" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
            </svg>

            {/* Formula calculation card */}
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-mono space-y-1.5">
              <span className="text-slate-400 block font-sans text-xs">Acoustic Relief Formula:</span>
              <div className="text-slate-300">H_t = (L_shadow × H_altitude) / (R_slant + L_shadow)</div>
              <div className="text-emerald-400 font-bold text-xs pt-1 border-t border-slate-800">
                H_t = ({shadowLen} × {altitude}) / ({slantRange} + {shadowLen}) = {targetHeight} meters
              </div>
            </div>
          </div>

          {/* Cross-track backscatter intensity decibel graph */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">A-Scan Acoustic Intensity</span>
              <span className="text-emerald-400 font-mono text-[11px]">Shadow Drop: -24 dB</span>
            </div>
            
            <svg viewBox="0 0 300 65" className="w-full h-20 bg-slate-900/60 rounded border border-slate-800">
              <path
                d="M 10 42 Q 45 40, 80 43 T 130 41 L 140 10 L 155 52 L 200 60 L 210 41 L 290 42"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <circle cx="140" cy="10" r="3.5" fill="#ef4444" />
              <text x="146" y="14" fill="#ef4444" fontSize="8" fontFamily="monospace">Net Backscatter</text>

              <line x1="155" y1="56" x2="200" y2="56" stroke="#facc15" strokeWidth="2" />
              <text x="160" y="52" fill="#facc15" fontSize="8" fontFamily="monospace">Acoustic Shadow</text>
            </svg>
          </div>

          {/* Entanglement Risk Scorecard */}
          {current && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Target Assessment</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                    current.riskLevel === 'HIGH'
                      ? 'bg-red-950 text-red-300 border-red-500/40'
                      : current.riskLevel === 'MEDIUM'
                      ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                      : 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {current.riskLevel} ERI
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {current.recommendation}
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
