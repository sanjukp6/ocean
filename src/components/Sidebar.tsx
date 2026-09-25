import React, { useRef } from 'react';
import {
  UploadCloud,
  Sliders,
  Play,
  RotateCw,
  Eye,
  ShieldCheck,
  Zap,
  Activity,
  Waves,
  Crosshair,
  FileCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { PipelineSettings, PipelineStage, SurveyTransect } from '../types/sonar';

interface SidebarProps {
  settings: PipelineSettings;
  onUpdateSettings: (newSettings: Partial<PipelineSettings>) => void;
  onRunPipeline: () => void;
  pipelineStage: PipelineStage;
  pipelineProgress: number; // 0 - 100
  onFileUpload: (file: File) => void;
  onLoadPreset: (presetName: string) => void;
  currentTransect: SurveyTransect;
  uploadedFileName: string | null;
  uploadedPreviewUrl: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
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
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const isRunning = pipelineStage !== 'idle' && pipelineStage !== 'completed';

  const getStageLabel = () => {
    switch (pipelineStage) {
      case 'reading':
        return '1/5 Reading Sonar Telemetry (.XTF/.PNG)...';
      case 'preprocessing':
        return '2/5 Applying TVG & Slant-Range Correction...';
      case 'ai_vision':
        return '3/5 Gemini Vision & Shadow Physics Verification...';
      case 'geocoding':
        return '4/5 Geocoding Coordinates & Computing ERI...';
      case 'completed':
        return 'Pipeline Complete - GIS Map Updated';
      default:
        return 'Run AeroAcoustic Pipeline';
    }
  };

  return (
    <aside className="w-80 lg:w-96 bg-slate-900/90 border-r border-slate-800 flex flex-col h-full overflow-y-auto select-none shrink-0 z-20">
      
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Sliders className="w-4 h-4 text-sky-400" />
            <span>Acoustic Control Panel</span>
          </div>
          <span className="text-[11px] font-mono text-sky-400 bg-sky-950/60 border border-sky-800/40 px-2 py-0.5 rounded">
            {currentTransect.frequencyKhz} kHz
          </span>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Configure hydrographic preprocessing filters and execute automated side-scan AI detection.
        </p>
      </div>

      <div className="p-4 space-y-5 flex-1">
        
        {/* Drag-and-Drop Sonar Upload Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
              1. Sonar Log / Image Ingestion
            </label>
            <span className="text-[10px] text-slate-400">.XTF, .JSF, .SL2, .PNG</span>
          </div>

          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
            className={`relative p-4 border-2 border-dashed rounded-xl cursor-pointer transition-all text-center ${
              uploadedFileName
                ? 'border-sky-500/60 bg-sky-950/20'
                : 'border-slate-700 hover:border-sky-500/50 bg-slate-950/50 hover:bg-slate-950'
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
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sky-400 text-xs font-medium">
                  <FileCheck className="w-4 h-4" />
                  <span className="truncate max-w-[200px]">{uploadedFileName}</span>
                </div>
                {uploadedPreviewUrl && (
                  <div className="relative w-full h-24 rounded overflow-hidden border border-slate-700 bg-black">
                    <img
                      src={uploadedPreviewUrl}
                      alt="Sonar tile preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono text-sky-300">
                      Tile Ingested
                    </div>
                  </div>
                )}
                <p className="text-[10px] text-slate-400">Click or drop to replace sonar file</p>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-10 h-10 mx-auto rounded-full bg-slate-800 flex items-center justify-center text-sky-400">
                  <UploadCloud className="w-5 h-5" />
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  Drag & Drop Sonar Log / Tile
                </div>
                <p className="text-[11px] text-slate-500">
                  Supports eXtended Triton Format (.xtf) & side-scan image waterfall strips
                </p>
              </div>
            )}
          </div>

          {/* Quick-loader presets from Zenodo / AI4Shipwrecks */}
          <div className="pt-1">
            <span className="text-[10px] text-slate-400 font-medium block mb-1.5">
              Load Benchmark Sonar Scan:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              <button
                type="button"
                onClick={() => onLoadPreset('koh_tao_net')}
                className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded border border-slate-700 text-left transition-colors truncate"
                title="Koh Tao Pinnacles Monofilament Net (Zenodo)"
              >
                Koh Tao Ghost Net
              </button>
              <button
                type="button"
                onClick={() => onLoadPreset('ai4shipwrecks_snag')}
                className="px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white rounded border border-slate-700 text-left transition-colors truncate"
                title="AI4Shipwrecks Wooden Hull Net Snag (Lake Huron)"
              >
                AI4Shipwreck Snag
              </button>
            </div>
          </div>
        </div>

        {/* Processing Controls (Toggle Switches) */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
              2. Hydrographic Preprocessing
            </label>
            <span className="text-[10px] text-sky-400 font-mono">Real-time WASM</span>
          </div>

          {/* Toggle: Time-Varying Gain (TVG) */}
          <div className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
            <div className="space-y-0.5 pr-2">
              <div className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-sky-400" />
                <span>Time-Varying Gain (TVG)</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Compensates for acoustic transmission loss across range
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

          {/* Toggle: Slant-Range Correction */}
          <div className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
            <div className="space-y-0.5 pr-2">
              <div className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <Crosshair className="w-3.5 h-3.5 text-sky-400" />
                <span>Slant-Range Correction</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Removes water column nadir and projects to flat ground
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

          {/* Toggle: Cold Diffusion Denoising */}
          <div className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
            <div className="space-y-0.5 pr-2">
              <div className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Cold Diffusion Denoising</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Attenuates acoustic speckle noise from micro-bubbles & surf
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

          {/* Toggle: Acoustic Shadow Physics Verification */}
          <div className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg">
            <div className="space-y-0.5 pr-2">
              <div className="text-xs font-medium text-slate-200 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Shadow Physics Check</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Eliminates flat seabed false alarms via shadow geometry
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

        {/* AI Confidence Cutoff Slider */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 uppercase tracking-wide">
              3. AI Detection Threshold
            </label>
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
            className="w-full accent-sky-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>30% (Permissive)</span>
            <span>75% (Standard)</span>
            <span>95% (Strict)</span>
          </div>
        </div>

        {/* Palette Selector */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-200 uppercase tracking-wide block">
            4. Acoustic Palette
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {[
              { id: 'bronze', label: 'Bronze', color: 'bg-amber-900 border-amber-600' },
              { id: 'ocean', label: 'Cyan', color: 'bg-cyan-950 border-cyan-500' },
              { id: 'amber', label: 'Amber', color: 'bg-orange-950 border-orange-500' },
              { id: 'grayscale', label: 'Mono', color: 'bg-slate-800 border-slate-500' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onUpdateSettings({ colorPalette: p.id as any })}
                className={`py-1.5 px-2 rounded border text-[11px] font-medium transition-all ${
                  settings.colorPalette === p.id
                    ? `${p.color} text-white shadow-sm ring-1 ring-white/30`
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Action Footer: Run AeroAcoustic Pipeline Button */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800 space-y-2">
        {isRunning && (
          <div className="space-y-1.5 mb-2">
            <div className="flex items-center justify-between text-xs text-sky-400 font-medium">
              <span className="flex items-center gap-1.5">
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                {getStageLabel()}
              </span>
              <span className="font-mono">{pipelineProgress}%</span>
            </div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
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
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 ${
            isRunning
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
              : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30 hover:shadow-sky-500/40 border border-sky-400/40 active:scale-[0.98]'
          }`}
        >
          {isRunning ? (
            <>
              <RotateCw className="w-4 h-4 animate-spin" />
              <span>Analyzing Sonar Data...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>Run AeroAcoustic Pipeline</span>
            </>
          )}
        </button>

        <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-2">
          <span>Swath: {currentTransect.swathWidthM}m</span>
          <span>·</span>
          <span>Depth: ~{currentTransect.waterDepthAvgM}m</span>
          <span>·</span>
          <span>Speed: {currentTransect.vesselSpeedKnots} kn</span>
        </div>
      </div>

    </aside>
  );
};
