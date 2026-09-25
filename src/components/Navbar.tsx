import React from 'react';
import {
  Compass,
  Radar,
  Upload,
  Download,
  BookOpen,
  Sliders,
  Sparkles,
  Layers,
  MapPin,
} from 'lucide-react';
import { SurveyTransect } from '../types/sonar';

interface NavbarProps {
  currentTransect: SurveyTransect;
  onSelectTransect: (transect: SurveyTransect) => void;
  availableTransects: SurveyTransect[];
  onOpenUpload: () => void;
  onExportShapefile: () => void;
  onOpenResearch: () => void;
  onToggleSettings?: () => void;
  isProcessing: boolean;
  totalHazardsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTransect,
  onSelectTransect,
  availableTransects,
  onOpenUpload,
  onExportShapefile,
  onOpenResearch,
  isProcessing,
  totalHazardsCount,
}) => {
  return (
    <header className="h-16 bg-slate-900/95 border-b border-slate-800 px-4 flex items-center justify-between z-30 shrink-0 select-none">
      
      {/* Brand & Radar Icon */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-sky-950/80 border border-sky-500/30 text-sky-400 shadow-inner">
          <Radar className="w-5 h-5 animate-pulse" />
          {/* Subtle radar sweep line */}
          <div className="absolute inset-0 rounded-lg border border-sky-400/20 pointer-events-none" />
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base md:text-lg text-white tracking-tight">
              AeroAcoustic<span className="text-sky-400">-DebrisNet</span>
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono tracking-wider text-sky-300 bg-sky-950/80 border border-sky-700/50 rounded">
              SSS v2.4
            </span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <span>Side Scan Sonar AI & Entanglement Risk GIS</span>
          </div>
        </div>

        {/* Status Badge */}
        <div className="hidden lg:flex items-center gap-2 ml-4 pl-4 border-l border-slate-800">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/60 border border-emerald-500/30 rounded-full text-[11px] text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">Offline WASM Engine Ready</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-sky-950/60 border border-sky-500/30 rounded-full text-[11px] text-sky-300">
            <Sparkles className="w-3 h-3 text-sky-400" />
            <span>Gemini 3.8 Vision Active</span>
          </div>
        </div>
      </div>

      {/* Center Survey Transect Switcher */}
      <div className="hidden md:flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
          <MapPin className="w-3.5 h-3.5 text-sky-400" />
          <span className="text-slate-400 text-[11px]">Survey Zone:</span>
          <select
            value={currentTransect.id}
            onChange={(e) => {
              const selected = availableTransects.find((t) => t.id === e.target.value);
              if (selected) onSelectTransect(selected);
            }}
            className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer"
          >
            {availableTransects.map((t) => (
              <option key={t.id} value={t.id} className="bg-slate-900 text-white">
                {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Research / Datasets Citation Button */}
        <button
          onClick={onOpenResearch}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-medium transition-colors"
          title="View datasets, Zenodo repos, and scientific methodology"
        >
          <BookOpen className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Research & Data</span>
        </button>

        {/* Upload Sonar Log (.XTF / .PNG) */}
        <button
          onClick={onOpenUpload}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white border border-slate-700 rounded-lg text-xs font-medium transition-colors"
        >
          <Upload className="w-3.5 h-3.5 text-sky-400" />
          <span className="hidden sm:inline">Upload Log (.XTF / .PNG)</span>
          <span className="sm:hidden">Upload</span>
        </button>

        {/* Export Shapefile */}
        <button
          onClick={onExportShapefile}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-sky-600/20 transition-colors"
          title="Download ESRI Shapefile bundle & GeoJSON"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export Shapefile</span>
          <span className="sm:hidden">Export</span>
        </button>

        {/* User avatar / profile marker */}
        <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-semibold text-sky-400 ml-1">
          AUV
        </div>
      </div>

    </header>
  );
};
