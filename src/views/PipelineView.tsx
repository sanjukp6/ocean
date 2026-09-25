import React, { useRef } from 'react';
import {
  UploadCloud,
  FileCheck,
  Cpu,
  Waves,
  Crosshair,
  Zap,
  ShieldCheck,
  Play,
  RotateCw,
  Sparkles,
  Activity,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from 'lucide-react';
import { PipelineSettings, PipelineStage, SurveyTransect } from '../types/sonar';

interface PipelineViewProps {
  settings: PipelineSettings;
  onUpdateSettings: (newSettings: Partial<PipelineSettings>) => void;
  onRunPipeline: () => void;
  pipelineStage: PipelineStage;
  pipelineProgress: number;
  onFileUpload: (file: File) => void;
  onLoadPreset: (presetName: string) => void;
  currentTransect: SurveyTransect;
  uploadedFileName: string | null;
  uploadedPreviewUrl: string | null;
  executionLogs: string[];
}

export const PipelineView: React.FC<PipelineViewProps> = ({
  settings,
  onUpdateSettings,
  onRunPipeline,
  pipelineStage,
  pipelineProgress,
  onFileUpload,
  onLoadPreset,
  currentTransect,
  uploadedFileName,
  uploadedPreviewUrl,
  executionLogs,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const isRunning = pipelineStage !== 'idle' && pipelineStage !== 'completed';

  const getStageTitle = () => {
    switch (pipelineStage) {
      case 'reading':
        return 'Step 1/5: Ingesting Sonar Log Telemetry (.XTF/.JSF)...';
      case 'preprocessing':
        return 'Step 2/5: Applying Time-Varying Gain & Slant-Range Correction...';
      case 'ai_vision':
        return 'Step 3/5: Gemini 3.8 Flash Vision Scanning & Acoustic Shadow Check...';
      case 'geocoding':
        return 'Step 4/5: Geocoding WGS84 Coordinates & Computing ERI...';
      case 'completed':
        return 'Pipeline Complete - GIS Map & Registry Updated';
      default:
        return 'Pipeline Engine Ready';
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto select-none">
      
      {/* Top Header */}
      <header className="h-14 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 border border-sky-500/30 rounded-lg text-sky-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Automated Sonar Ingestion & AI Detection Pipeline
            </h2>
            <p className="text-[11px] text-slate-400">
              End-to-end hydrographic ingestion, slant-range calibration, and Gemini 3.8 Flash neural analysis
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">WASM Pipeline Worker Active</span>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="flex-1 p-6 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Upload & Settings (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Ingestion Area */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">1. Sonar Log / Tile Ingestion</h3>
                <p className="text-xs text-slate-400">
                  Accepts raw binary sonar logs (.xtf, .jsf, .sl2) or georeferenced waterfall tiles (.png, .tif)
                </p>
              </div>
              <span className="text-[10px] font-mono text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/40">
                Max 50MB
              </span>
            </div>

            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className={`p-6 border-2 border-dashed rounded-xl text-center cursor-pointer transition-all ${
                uploadedFileName
                  ? 'border-sky-500/60 bg-sky-950/20'
                  : 'border-slate-700 hover:border-sky-500/50 bg-slate-950/60 hover:bg-slate-950'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    onFileUpload(e.target.files[0]);
                  }
                }}
                accept=".xtf,.jsf,.sl2,.png,.jpg,.jpeg,.tif,.tiff"
                className="hidden"
              />

              {uploadedFileName ? (
                <div className="space-y-3">
                  <FileCheck className="w-10 h-10 mx-auto text-emerald-400" />
                  <div>
                    <span className="font-semibold text-white text-sm block">{uploadedFileName}</span>
                    <span className="text-xs text-slate-400">Sonar file staged for processing</span>
                  </div>
                  {uploadedPreviewUrl && (
                    <div className="w-64 h-28 mx-auto rounded-lg overflow-hidden border border-slate-700 bg-black shadow-inner">
                      <img src={uploadedPreviewUrl} alt="Sonar preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <p className="text-[11px] text-slate-500">Click or drop to replace file</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-slate-800 flex items-center justify-center text-sky-400">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-200 block">
                      Drag & Drop Sonar Log / Tile
                    </span>
                    <p className="text-xs text-slate-400 mt-0.5">
                      EdgeTech 4125, Klein 3000, Lowrance SL2, or Humminbird recordings
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Benchmark Preset Buttons */}
            <div>
              <span className="text-xs font-semibold text-slate-400 block mb-2">
                Or load validated benchmark dataset scans:
              </span>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <button
                  type="button"
                  onClick={() => onLoadPreset('koh_tao_net')}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-colors"
                >
                  <span className="font-semibold text-white block">Koh Tao Pinnacle Net</span>
                  <span className="text-[11px] text-slate-400">Zenodo Open-Access Survey (Thailand)</span>
                </button>
                <button
                  type="button"
                  onClick={() => onLoadPreset('ai4shipwrecks_snag')}
                  className="p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition-colors"
                >
                  <span className="font-semibold text-white block">AI4Shipwreck Net Snag</span>
                  <span className="text-[11px] text-slate-400">AUV Schooner Wreck Survey (Lake Huron)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Hydrographic Preprocessing Controls */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white">2. Hydrographic Preprocessing Filters</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* TVG Normalization */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Waves className="w-4 h-4 text-sky-400" />
                    <span>Time-Varying Gain (TVG)</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Acoustic range transmission gain
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.tvgEnabled}
                  onClick={() => onUpdateSettings({ tvgEnabled: !settings.tvgEnabled })}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                    settings.tvgEnabled ? 'bg-sky-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.tvgEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Slant-Range Correction */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Crosshair className="w-4 h-4 text-sky-400" />
                    <span>Slant-Range Correction</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Water column bottom-track removal
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.slantRangeEnabled}
                  onClick={() => onUpdateSettings({ slantRangeEnabled: !settings.slantRangeEnabled })}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                    settings.slantRangeEnabled ? 'bg-sky-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.slantRangeEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Cold Diffusion Denoising */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Cold Diffusion Filter</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Speckle noise & surface reflection
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.denoisingEnabled}
                  onClick={() => onUpdateSettings({ denoisingEnabled: !settings.denoisingEnabled })}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                    settings.denoisingEnabled ? 'bg-sky-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.denoisingEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Shadow Physics Verification */}
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5 pr-2">
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Shadow Physics Check</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Mandatory downstream acoustic void
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={settings.shadowPhysicsCheck}
                  onClick={() => onUpdateSettings({ shadowPhysicsCheck: !settings.shadowPhysicsCheck })}
                  className={`w-11 h-6 rounded-full transition-colors relative focus:outline-none p-0.5 ${
                    settings.shadowPhysicsCheck ? 'bg-emerald-600' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                      settings.shadowPhysicsCheck ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* AI Confidence Threshold Slider */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">
                  3. AI Confidence Cut-Off Threshold
                </span>
                <span className="font-mono text-xs font-bold text-sky-400">
                  {settings.confidenceThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="95"
                step="1"
                value={settings.confidenceThreshold}
                onChange={(e) => onUpdateSettings({ confidenceThreshold: Number(e.target.value) })}
                className="w-full accent-sky-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>30% Permissive</span>
                <span>75% Standard</span>
                <span>95% Strict Verification</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Execution & Telemetry Logs (5 cols) */}
        <div className="lg:col-span-5 space-y-6 flex flex-col">
          
          {/* Action Trigger Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              <span>AeroAcoustic AI Execution</span>
            </h3>

            {isRunning && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-sky-400 font-medium">
                  <span className="flex items-center gap-1.5 truncate">
                    <RotateCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                    {getStageTitle()}
                  </span>
                  <span className="font-mono">{pipelineProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-sky-500 to-emerald-400 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${pipelineProgress}%` }}
                  />
                </div>
              </div>
            )}

            <button
              type="button"
              disabled={isRunning}
              onClick={onRunPipeline}
              className={`w-full py-4 px-6 rounded-xl font-bold text-sm tracking-wide transition-all shadow-xl flex items-center justify-center gap-2.5 ${
                isRunning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                  : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30 hover:shadow-sky-500/40 border border-sky-400/40 active:scale-[0.98]'
              }`}
            >
              {isRunning ? (
                <>
                  <RotateCw className="w-5 h-5 animate-spin" />
                  <span>Processing Acoustic Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Run AeroAcoustic Pipeline</span>
                </>
              )}
            </button>

            <div className="text-center text-xs text-slate-400">
              Target Depth: {currentTransect.waterDepthAvgM}m · Towfish Altitude: 5.4m
            </div>
          </div>

          {/* Real-time Telemetry & Log Console */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 flex-1 flex flex-col shadow-xl min-h-[300px]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <Terminal className="w-4 h-4 text-sky-400" />
                <span>Acoustic Processing Console</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Live
              </span>
            </div>

            <div className="mt-3 flex-1 bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-xs overflow-y-auto space-y-1.5 text-slate-300">
              <div className="text-slate-500">[SYSTEM] AeroAcoustic-DebrisNet WASM core initialized</div>
              <div className="text-slate-500">[SYSTEM] Connected to survey zone: {currentTransect.name}</div>
              <div className="text-sky-400">[SENSOR] EdgeTech 4125 Dual-Freq Sonar (410 kHz active)</div>
              {executionLogs.map((log, i) => (
                <div key={i} className="text-emerald-400/90 leading-relaxed">
                  {log}
                </div>
              ))}
              {isRunning && (
                <div className="text-sky-300 animate-pulse flex items-center gap-2">
                  <span>▸</span> {getStageTitle()}
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
