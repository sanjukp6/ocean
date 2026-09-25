import React, { useState } from 'react';
import { SonarHazard, SurveyTransect } from '../types/sonar';
import {
  Download,
  Filter,
  Search,
  FileCode,
  FileSpreadsheet,
  Globe,
  Layers,
  MapPin,
  Activity,
  ShieldCheck,
  AlertTriangle,
  Database,
} from 'lucide-react';
import {
  exportGeoJSON,
  exportCOCOJSON,
  exportKML,
  exportCSV,
  exportShapefilePackage,
} from '../utils/exportUtils';

interface AnomalyRegistryViewProps {
  hazards: SonarHazard[];
  currentTransect: SurveyTransect;
  onSelectHazard: (hazard: SonarHazard) => void;
  onNavigateToMap: (hazard: SonarHazard) => void;
  onNavigateToWaterfall: (hazard: SonarHazard) => void;
}

export const AnomalyRegistryView: React.FC<AnomalyRegistryViewProps> = ({
  hazards,
  currentTransect,
  onSelectHazard,
  onNavigateToMap,
  onNavigateToWaterfall,
}) => {
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filtered = hazards.filter((h) => {
    if (filterRisk !== 'ALL' && h.riskLevel !== filterRisk) return false;
    if (filterCategory !== 'ALL' && h.category !== filterCategory) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        h.id.toLowerCase().includes(q) ||
        h.targetType.toLowerCase().includes(q) ||
        h.acousticSignature.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const highRiskCount = hazards.filter((h) => h.riskLevel === 'HIGH').length;
  const verifiedShadowCount = hazards.filter((h) => h.shadowVerified).length;
  const avgHeight = (
    hazards.reduce((acc, curr) => acc + curr.estimatedHeightM, 0) / (hazards.length || 1)
  ).toFixed(2);

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden select-none">
      
      {/* Top Header */}
      <header className="h-14 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 border border-sky-500/30 rounded-lg text-sky-400">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Side Scan Sonar Anomaly Registry & GIS Exports
            </h2>
            <p className="text-[11px] text-slate-400">
              Validated marine debris targets, acoustic shadow physics, and standard export formats
            </p>
          </div>
        </div>

        {/* Export Toolbar */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => exportShapefilePackage(hazards, currentTransect)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-lg shadow-sky-600/20 transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Export Shapefile (.shp)</span>
          </button>
          <button
            type="button"
            onClick={() => exportCOCOJSON(hazards, currentTransect)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>COCO JSON</span>
          </button>
          <button
            type="button"
            onClick={() => exportGeoJSON(hazards, currentTransect)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>GeoJSON</span>
          </button>
          <button
            type="button"
            onClick={() => exportCSV(hazards)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded-lg text-xs font-medium transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
            <span>CSV</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden space-y-4">
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 shrink-0">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow">
            <span className="text-xs text-slate-400 block">Total Detected Anomalies</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-white">{hazards.length}</span>
              <span className="text-xs text-sky-400">targets registered</span>
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow">
            <span className="text-xs text-slate-400 block">High Entanglement Risk (ERI)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-red-400">{highRiskCount}</span>
              <span className="text-xs text-red-400/80">urgent recovery</span>
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow">
            <span className="text-xs text-slate-400 block">Shadow Physics Verified</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-emerald-400">{verifiedShadowCount}</span>
              <span className="text-xs text-emerald-400/80">3D relief confirmed</span>
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl shadow">
            <span className="text-xs text-slate-400 block">Average Vertical Relief</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold font-mono text-sky-300">{avgHeight}m</span>
              <span className="text-xs text-slate-400">above seabed</span>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Risk Level:</span>
              {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
                <button
                  key={risk}
                  type="button"
                  onClick={() => setFilterRisk(risk)}
                  className={`px-2.5 py-1 rounded text-[11px] font-semibold transition-colors ${
                    filterRisk === risk
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>

            <div className="h-4 w-[1px] bg-slate-800" />

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Category:</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-slate-200 focus:outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="ghost_net">Ghost Nets & Gillnets</option>
                <option value="derelict_trap">Abandoned Traps / Pots</option>
                <option value="rope_rigging">Towlines & Snags</option>
                <option value="plastic_debris">Submerged Debris</option>
                <option value="shipwreck_snag">Shipwreck Obstructions</option>
              </select>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search target ID, description..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

        </div>

        {/* Main Table Container */}
        <div className="flex-1 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-xl">
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 sticky top-0 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Target ID</th>
                  <th className="py-3 px-4">Target Classification</th>
                  <th className="py-3 px-4">AI Confidence</th>
                  <th className="py-3 px-4">Relief Height (Ht)</th>
                  <th className="py-3 px-4">Shadow Length (Ls)</th>
                  <th className="py-3 px-4">WGS84 Coordinates</th>
                  <th className="py-3 px-4">Water Depth</th>
                  <th className="py-3 px-4">ERI Risk</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                {filtered.map((h) => {
                  let riskBadge = 'bg-emerald-950 text-emerald-300 border-emerald-500/40';
                  if (h.riskLevel === 'HIGH') {
                    riskBadge = 'bg-red-950 text-red-300 border-red-500/40';
                  } else if (h.riskLevel === 'MEDIUM') {
                    riskBadge = 'bg-amber-950 text-amber-300 border-amber-500/40';
                  }

                  return (
                    <tr
                      key={h.id}
                      onClick={() => onSelectHazard(h)}
                      className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                    >
                      <td className="py-3 px-4 font-bold text-sky-400 whitespace-nowrap">
                        {h.id}
                      </td>
                      <td className="py-3 px-4 font-sans font-medium text-white max-w-sm truncate">
                        {h.targetType}
                      </td>
                      <td className="py-3 px-4 font-bold text-sky-300">
                        {(h.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-400">
                        {h.estimatedHeightM}m
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-300">
                        <span className="flex items-center gap-1.5 text-emerald-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {h.shadowLengthM}m verified
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {h.latitude.toFixed(5)}°, {h.longitude.toFixed(5)}°
                      </td>
                      <td className="py-3 px-4 text-slate-300">
                        {h.waterDepthM}m
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <span className={`px-2.5 py-0.5 rounded border text-[10px] font-bold uppercase ${riskBadge}`}>
                          {h.riskLevel}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap font-sans space-x-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectHazard(h);
                            onNavigateToMap(h);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 text-xs font-medium transition-colors"
                        >
                          Map
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectHazard(h);
                            onNavigateToWaterfall(h);
                          }}
                          className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-semibold transition-colors"
                        >
                          Inspect Sonar
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};
