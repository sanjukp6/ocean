import React, { useEffect, useRef, useState } from 'react';
import {
  Maximize2,
  Minimize2,
  Sliders,
  Crosshair,
  ShieldCheck,
  Eye,
  Info,
  TrendingDown,
  Activity,
  Layers,
} from 'lucide-react';
import { SonarHazard, PipelineSettings } from '../types/sonar';
import { generateSyntheticSonarImage } from '../data/sampleDatasets';
import { calculateTargetHeight, calculateGrazingAngle, calculateGroundRange } from '../utils/acousticPhysics';

interface SonarWaterfallViewerProps {
  selectedHazard: SonarHazard | null;
  settings: PipelineSettings;
  onClose?: () => void;
}

export const SonarWaterfallViewer: React.FC<SonarWaterfallViewerProps> = ({
  selectedHazard,
  settings,
  onClose,
}) => {
  const [isSlantCorrected, setIsSlantCorrected] = useState<boolean>(settings.slantRangeEnabled);
  const [waterfallImage, setWaterfallImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'waterfall' | 'shadow_physics'>('waterfall');

  // Generate or update waterfall image whenever selectedHazard or settings change
  useEffect(() => {
    const hazard = selectedHazard;
    const targetType = hazard ? hazard.targetType : 'Ghost Net / Monofilament Trawl Mesh';
    const channel = hazard ? hazard.swathChannel : 'starboard';

    const url = generateSyntheticSonarImage(
      targetType,
      channel,
      settings.colorPalette,
      isSlantCorrected
    );
    setWaterfallImage(url);
  }, [selectedHazard, settings.colorPalette, isSlantCorrected]);

  const hazard = selectedHazard;
  const shadowLength = hazard?.shadowLengthM || 4.2;
  const altitude = hazard?.altitudeM || 5.4;
  const slantRange = hazard?.slantRangeM || 24.5;
  const calculatedHeight = calculateTargetHeight(shadowLength, altitude, slantRange);
  const grazingAngle = calculateGrazingAngle(slantRange, altitude);
  const groundRange = calculateGroundRange(slantRange, altitude);

  return (
    <div className="flex flex-col h-full bg-slate-950 border-l border-slate-800 text-slate-200 overflow-hidden select-none">
      
      {/* Top Header */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sky-500/10 border border-sky-500/30 rounded text-sky-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white tracking-wide">
              Side Scan Sonar Acoustic Waterfall
            </h3>
            <span className="text-[10px] text-slate-400 font-mono">
              Dual Channel Port / Starboard 410 kHz
            </span>
          </div>
        </div>

        {/* View Mode Toggle: Waterfall vs Acoustic Shadow Profile */}
        <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('waterfall')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'waterfall'
                ? 'bg-sky-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Acoustic Tiles
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('shadow_physics')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeTab === 'shadow_physics'
                ? 'bg-sky-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Shadow Physics
          </button>
        </div>
      </div>

      {/* Main Waterfall Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        
        {activeTab === 'waterfall' ? (
          <div className="space-y-4">
            
            {/* Slant-Range Correction Interactive Switch */}
            <div className="flex items-center justify-between p-2.5 bg-slate-900/60 border border-slate-800 rounded-lg text-xs">
              <div className="flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-sky-400" />
                <div>
                  <span className="font-semibold text-slate-200">Slant-Range Projection</span>
                  <p className="text-[10px] text-slate-400">
                    {isSlantCorrected
                      ? 'Water column stripped (ground distance)'
                      : 'Raw diagonal slant range (nadir water band present)'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSlantCorrected(!isSlantCorrected)}
                className={`px-3 py-1 rounded font-semibold transition-colors ${
                  isSlantCorrected
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {isSlantCorrected ? 'Corrected' : 'Raw Slant'}
              </button>
            </div>

            {/* Waterfall Image Canvas with Bounding Box Overlay */}
            <div className="relative w-full aspect-[3/4] max-h-[480px] mx-auto rounded-lg overflow-hidden border border-slate-800 bg-black shadow-2xl flex items-center justify-center">
              {waterfallImage && (
                <img
                  src={waterfallImage}
                  alt="Acoustic waterfall scan"
                  className="w-full h-full object-contain"
                />
              )}

              {/* Bounding box marker on candidate hazard */}
              {hazard && (
                <div
                  className="absolute border-2 border-red-500 rounded bg-red-500/10 shadow-[0_0_15px_#ef4444]"
                  style={{
                    top: '38%',
                    left: hazard.swathChannel === 'starboard' ? '65%' : '18%',
                    width: '24%',
                    height: '18%',
                  }}
                >
                  <div className="absolute -top-6 left-0 px-1.5 py-0.5 bg-red-950/90 border border-red-500 rounded text-[9px] font-mono text-red-200 whitespace-nowrap shadow">
                    {hazard.targetType} ({(hazard.confidence * 100).toFixed(0)}%)
                  </div>
                  <div className="absolute -bottom-5 right-0 px-1.5 py-0.5 bg-slate-900/90 rounded text-[9px] font-mono text-emerald-400 border border-slate-700">
                    Shadow Verified: {hazard.shadowLengthM}m
                  </div>
                </div>
              )}

              {/* Water Column Indicator overlay (when uncorrected) */}
              {!isSlantCorrected && (
                <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-8 bg-sky-500/10 border-x border-sky-400/30 flex items-center justify-center pointer-events-none">
                  <span className="text-[9px] font-mono text-sky-400/80 -rotate-90 whitespace-nowrap">
                    WATER COLUMN NADIR
                  </span>
                </div>
              )}
            </div>

            {/* Target Spec Card */}
            {hazard && (
              <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-white">{hazard.targetType}</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-red-950 text-red-300 border border-red-500/40">
                    {hazard.riskLevel} RISK
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  "{hazard.acousticSignature}"
                </p>
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-800 font-mono text-[11px]">
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Slant Range</span>
                    <span className="text-sky-400 font-bold">{hazard.slantRangeM}m</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Ground Range</span>
                    <span className="text-sky-400 font-bold">{hazard.groundRangeM}m</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block font-sans">Relief Height</span>
                    <span className="text-emerald-400 font-bold">{hazard.estimatedHeightM}m</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        ) : (
          /* Acoustic Shadow Physics Visualizer */
          <div className="space-y-4">
            
            <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-lg space-y-3">
              <div className="flex items-center gap-2 text-sky-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Towfish Acoustic Geometry Ray-Tracing</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Acoustic shadows are created when an elevated structure obstructs sound waves traveling from the towfish transducer to the seabed.
              </p>

              {/* Ray Diagram Canvas */}
              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800/80 space-y-3">
                <div className="text-[11px] font-mono text-slate-400 flex justify-between">
                  <span>Towfish Altitude (Ha): <strong className="text-white">{altitude}m</strong></span>
                  <span>Grazing Angle (θ): <strong className="text-white">{grazingAngle}°</strong></span>
                </div>

                {/* SVG Acoustic Ray Schematic */}
                <svg viewBox="0 0 320 140" className="w-full h-36 bg-slate-900/50 rounded border border-slate-800">
                  {/* Water surface */}
                  <line x1="10" y1="20" x2="310" y2="20" stroke="#0284c7" strokeWidth="1" strokeDasharray="4 2" />
                  <text x="15" y="15" fill="#38bdf8" fontSize="8" fontFamily="monospace">WATER SURFACE</text>

                  {/* Towfish platform */}
                  <rect x="35" y="35" width="24" height="12" rx="2" fill="#0284c7" stroke="#38bdf8" strokeWidth="1" />
                  <text x="35" y="60" fill="#94a3b8" fontSize="8" fontFamily="monospace">Towfish</text>

                  {/* Seabed line */}
                  <line x1="10" y1="110" x2="310" y2="110" stroke="#64748b" strokeWidth="2" />
                  <text x="250" y="125" fill="#64748b" fontSize="8" fontFamily="monospace">SEABED</text>

                  {/* Acoustic pulse ray */}
                  <line x1="59" y1="41" x2="160" y2="92" stroke="#eab308" strokeWidth="1.5" strokeDasharray="3 3" />

                  {/* Ghost net target on seabed */}
                  <polygon points="155,110 160,92 165,110" fill="#ef4444" stroke="#f87171" strokeWidth="1" />
                  <text x="145" y="86" fill="#f87171" fontSize="9" fontWeight="bold" fontFamily="monospace">Net (Ht={calculatedHeight}m)</text>

                  {/* Acoustic shadow zone on seabed behind net */}
                  <rect x="165" y="108" width="80" height="4" fill="#000000" stroke="#334155" strokeWidth="1" />
                  <text x="175" y="125" fill="#facc15" fontSize="8" fontFamily="monospace">Shadow (Ls={shadowLength}m)</text>

                  {/* Ray extending past target to shadow boundary */}
                  <line x1="160" y1="92" x2="245" y2="110" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                </svg>

                {/* Math Calculation Formula Box */}
                <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-[11px] font-mono space-y-1">
                  <div className="text-slate-400">Formula: H_target = (L_shadow × H_altitude) / (R_slant + L_shadow)</div>
                  <div className="text-emerald-400 font-bold">
                    H_t = ({shadowLength} × {altitude}) / ({slantRange} + {shadowLength}) = {calculatedHeight} meters
                  </div>
                </div>
              </div>

              {/* Cross-track A-scan Backscatter Intensity Graph */}
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-300">Cross-Track Intensity (A-Scan)</span>
                  <span className="text-emerald-400 font-mono">Shadow Drop: -24 dB</span>
                </div>
                
                {/* Simulated intensity trace */}
                <svg viewBox="0 0 300 60" className="w-full h-16 bg-slate-900/60 rounded border border-slate-800">
                  {/* Baseline seabed backscatter with noise */}
                  <path
                    d="M 10 40 Q 40 38, 70 41 T 130 39 L 140 10 L 155 48 L 195 55 L 205 39 L 290 41"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                  {/* Highlight marker */}
                  <circle cx="140" cy="10" r="3" fill="#ef4444" />
                  <text x="145" y="12" fill="#ef4444" fontSize="8" fontFamily="monospace">Net Peak</text>

                  {/* Shadow void marker */}
                  <line x1="155" y1="52" x2="195" y2="52" stroke="#facc15" strokeWidth="2" />
                  <text x="160" y="48" fill="#facc15" fontSize="8" fontFamily="monospace">Shadow Void</text>
                </svg>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Bottom Footer Telemetry Bar */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-[11px] flex items-center justify-between font-mono">
        <div className="text-slate-400">
          Swath: <span className="text-sky-300">EdgeTech 4125</span>
        </div>
        <div className="text-slate-400">
          Target Relief: <span className="text-emerald-400 font-bold">{calculatedHeight}m</span>
        </div>
      </div>

    </div>
  );
};
