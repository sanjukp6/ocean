import React from 'react';
import {
  Radar,
  MapPin,
  Activity,
  Cpu,
  Database,
  BookOpen,
  Download,
  ChevronRight,
  Compass,
  Sparkles,
  Layers,
} from 'lucide-react';
import { ActivePage, SurveyTransect, SonarHazard } from '../types/sonar';

interface AppSidebarProps {
  activePage: ActivePage;
  onNavigate: (page: ActivePage) => void;
  currentTransect: SurveyTransect;
  availableTransects: SurveyTransect[];
  onSelectTransect: (transect: SurveyTransect) => void;
  hazards: SonarHazard[];
  onExportShapefile: () => void;
  isProcessing: boolean;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  activePage,
  onNavigate,
  currentTransect,
  availableTransects,
  onSelectTransect,
  hazards,
  onExportShapefile,
  isProcessing,
}) => {
  const highRiskCount = hazards.filter((h) => h.riskLevel === 'HIGH').length;

  const navItems = [
    {
      id: 'map' as ActivePage,
      label: 'GIS Survey Map',
      description: 'Bathymetry & AUV Tracklines',
      icon: MapPin,
      badge: `${hazards.length} Pins`,
      badgeColor: 'bg-sky-950 text-sky-400 border-sky-800/40',
    },
    {
      id: 'waterfall' as ActivePage,
      label: 'Sonar Waterfall Lab',
      description: 'Slant-Range & Shadow Physics',
      icon: Activity,
      badge: '410 kHz',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    },
    {
      id: 'pipeline' as ActivePage,
      label: 'AI Ingestion Pipeline',
      description: 'Upload & Gemini 3.8 Scan',
      icon: Cpu,
      badge: isProcessing ? 'Running' : 'Ready',
      badgeColor: isProcessing
        ? 'bg-amber-950 text-amber-300 border-amber-600/40 animate-pulse'
        : 'bg-emerald-950 text-emerald-400 border-emerald-800/40',
    },
    {
      id: 'anomalies' as ActivePage,
      label: 'Anomaly Registry',
      description: 'Table View & GIS Exports',
      icon: Database,
      badge: `${highRiskCount} High Risk`,
      badgeColor: highRiskCount > 0 ? 'bg-red-950 text-red-300 border-red-700/50' : 'bg-slate-800 text-slate-300',
    },
    {
      id: 'research' as ActivePage,
      label: 'Datasets & Research',
      description: 'Zenodo, PINGMapper, Papers',
      icon: BookOpen,
      badge: '5 Sources',
      badgeColor: 'bg-slate-800 text-slate-300 border-slate-700',
    },
  ];

  return (
    <aside className="w-64 lg:w-72 bg-slate-900 border-r border-slate-800 flex flex-col h-screen select-none shrink-0 z-30">
      
      {/* Brand & Platform Header */}
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-sky-950 border border-sky-500/40 text-sky-400 shadow-lg shadow-sky-950/50">
            <Radar className="w-5 h-5 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
          </div>

          <div>
            <h1 className="font-bold text-base text-white tracking-tight leading-none">
              AeroAcoustic<span className="text-sky-400">-DebrisNet</span>
            </h1>
            <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
              <span>Side Scan Sonar AI Portal</span>
            </p>
          </div>
        </div>

        {/* Engine status indicator */}
        <div className="mt-3 flex items-center justify-between text-[11px] p-2 bg-slate-950/80 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>WASM SSS Engine</span>
          </div>
          <div className="flex items-center gap-1 text-sky-400 font-mono text-[10px]">
            <Sparkles className="w-3 h-3" />
            <span>Gemini 3.8</span>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
          Navigation Views
        </div>

        {navItems.map((item) => {
          const isActive = activePage === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left group ${
                isActive
                  ? 'bg-sky-600 text-white font-semibold shadow-lg shadow-sky-900/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive ? 'bg-sky-700/60 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-sky-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold truncate leading-snug">
                    {item.label}
                  </div>
                  <div
                    className={`text-[10px] truncate ${
                      isActive ? 'text-sky-100' : 'text-slate-400'
                    }`}
                  >
                    {item.description}
                  </div>
                </div>
              </div>

              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded border whitespace-nowrap ml-2 ${
                  isActive ? 'bg-sky-700 text-white border-sky-500' : item.badgeColor
                }`}
              >
                {item.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Survey Zone Switcher */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60">
        <label className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5 px-1">
          Active Survey Zone
        </label>
        <div className="relative">
          <select
            value={currentTransect.id}
            onChange={(e) => {
              const found = availableTransects.find((t) => t.id === e.target.value);
              if (found) onSelectTransect(found);
            }}
            className="w-full bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-2 text-xs text-slate-200 font-medium focus:outline-none focus:border-sky-500 cursor-pointer"
          >
            {availableTransects.map((t) => (
              <option key={t.id} value={t.id} className="bg-slate-900 text-slate-200">
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-2 px-1 text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <span>Depth: ~{currentTransect.waterDepthAvgM}m</span>
          <span>Swath: {currentTransect.swathWidthM}m</span>
        </div>
      </div>

      {/* Quick Export Action */}
      <div className="p-3 border-t border-slate-800 bg-slate-900">
        <button
          type="button"
          onClick={onExportShapefile}
          className="w-full py-2.5 px-3 bg-slate-800 hover:bg-slate-700 hover:text-white text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-sky-400" />
          <span>Export GIS Shapefile</span>
        </button>
      </div>

    </aside>
  );
};
