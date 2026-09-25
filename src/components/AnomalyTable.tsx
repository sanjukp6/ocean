import React, { useState } from 'react';
import {
  Download,
  Filter,
  FileCode,
  FileSpreadsheet,
  Globe,
  Layers,
  ChevronUp,
  ChevronDown,
  Eye,
  AlertTriangle,
  ShieldCheck,
  Search,
} from 'lucide-react';
import { SonarHazard, SurveyTransect, RiskLevel } from '../types/sonar';
import {
  exportGeoJSON,
  exportCOCOJSON,
  exportKML,
  exportCSV,
  exportShapefilePackage,
} from '../utils/exportUtils';

interface AnomalyTableProps {
  hazards: SonarHazard[];
  currentTransect: SurveyTransect;
  selectedHazardId: string | null;
  onSelectHazard: (hazard: SonarHazard) => void;
  onInspectHazard: (hazard: SonarHazard) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

export const AnomalyTable: React.FC<AnomalyTableProps> = ({
  hazards,
  currentTransect,
  selectedHazardId,
  onSelectHazard,
  onInspectHazard,
  isExpanded,
  onToggleExpand,
}) => {
  const [filterRisk, setFilterRisk] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredHazards = hazards.filter((h) => {
    if (filterRisk !== 'ALL' && h.riskLevel !== filterRisk) return false;
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

  return (
    <div
      className={`border-t border-slate-800 bg-slate-900/95 flex flex-col transition-all duration-300 select-none z-20 shrink-0 ${
        isExpanded ? 'h-72' : 'h-12'
      }`}
    >
      {/* Table Header Bar & Export Toolbar */}
      <div className="h-12 px-4 border-b border-slate-800/80 flex items-center justify-between gap-4 bg-slate-900">
        
        {/* Left: Title & Anomaly Count */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleExpand}
            className="flex items-center gap-2 text-xs font-bold text-white hover:text-sky-400 transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4 text-sky-400" /> : <ChevronUp className="w-4 h-4 text-sky-400" />}
            <span>Detected Marine Debris & Anomalies</span>
          </button>
          
          <div className="flex items-center gap-1.5 text-xs">
            <span className="px-2 py-0.5 rounded-full bg-red-950 border border-red-500/40 text-red-300 font-mono text-[11px]">
              {hazards.filter((h) => h.riskLevel === 'HIGH').length} High Risk
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-950 border border-amber-500/40 text-amber-300 font-mono text-[11px]">
              {hazards.filter((h) => h.riskLevel === 'MEDIUM').length} Medium
            </span>
            <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px]">
              Total: {hazards.length}
            </span>
          </div>
        </div>

        {/* Right: Export Toolbar */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <span className="text-[11px] text-slate-400 font-medium hidden lg:inline">Export:</span>

          {/* GIS Shapefile */}
          <button
            type="button"
            onClick={() => exportShapefilePackage(hazards, currentTransect)}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded text-xs font-medium transition-colors"
            title="Download ESRI Shapefile bundle (.shp / .prj / .geojson)"
          >
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Shapefile (.shp)</span>
          </button>

          {/* COCO JSON */}
          <button
            type="button"
            onClick={() => exportCOCOJSON(hazards, currentTransect)}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded text-xs font-medium transition-colors"
            title="Download COCO JSON format for deep learning benchmarks"
          >
            <FileCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>COCO JSON</span>
          </button>

          {/* GeoJSON */}
          <button
            type="button"
            onClick={() => exportGeoJSON(hazards, currentTransect)}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded text-xs font-medium transition-colors"
            title="Download standard GeoJSON FeatureCollection"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span>GeoJSON</span>
          </button>

          {/* KML */}
          <button
            type="button"
            onClick={() => exportKML(hazards, currentTransect)}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded text-xs font-medium transition-colors"
            title="Download Google Earth KML"
          >
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>KML</span>
          </button>

          {/* CSV Summary */}
          <button
            type="button"
            onClick={() => exportCSV(hazards)}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 rounded text-xs font-medium transition-colors"
            title="Download CSV table"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
            <span>CSV Summary</span>
          </button>
        </div>

      </div>

      {/* Expanded Table Content */}
      {isExpanded && (
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Filter Bar */}
          <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Risk Filter:</span>
              <div className="flex items-center gap-1">
                {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
                  <button
                    key={risk}
                    type="button"
                    onClick={() => setFilterRisk(risk)}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                      filterRisk === risk
                        ? 'bg-sky-600 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {risk}
                  </button>
                ))}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search target or ID..."
                className="w-full bg-slate-900 border border-slate-800 rounded pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-x-auto overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-950 sticky top-0 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Target ID</th>
                  <th className="py-2.5 px-3">Classification</th>
                  <th className="py-2.5 px-3">AI Conf.</th>
                  <th className="py-2.5 px-3">Height</th>
                  <th className="py-2.5 px-3">Shadow Status</th>
                  <th className="py-2.5 px-3">Coordinates (WGS84)</th>
                  <th className="py-2.5 px-3">Depth</th>
                  <th className="py-2.5 px-3">ERI Risk</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                {filteredHazards.map((h) => {
                  const isSelected = selectedHazardId === h.id;
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
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-sky-950/40 text-white'
                          : 'hover:bg-slate-800/40 text-slate-300'
                      }`}
                    >
                      <td className="py-2.5 px-3 font-bold text-sky-400 whitespace-nowrap">
                        {h.id}
                      </td>
                      <td className="py-2.5 px-3 font-sans font-medium text-slate-100 max-w-xs truncate">
                        {h.targetType}
                      </td>
                      <td className="py-2.5 px-3 font-bold text-sky-300">
                        {(h.confidence * 100).toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">
                        {h.estimatedHeightM}m
                      </td>
                      <td className="py-2.5 px-3 font-sans text-slate-300">
                        {h.shadowVerified ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {h.shadowLengthM}m verified
                          </span>
                        ) : (
                          <span className="text-slate-500">Unverified</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">
                        {h.latitude.toFixed(5)}°, {h.longitude.toFixed(5)}°
                      </td>
                      <td className="py-2.5 px-3 text-slate-300">
                        {h.waterDepthM}m
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded border text-[10px] font-bold uppercase font-sans ${riskBadge}`}>
                          {h.riskLevel}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right whitespace-nowrap font-sans">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectHazard(h);
                            onInspectHazard(h);
                          }}
                          className="px-2 py-1 bg-sky-600/20 hover:bg-sky-600/40 text-sky-300 border border-sky-500/30 rounded text-xs font-medium transition-colors"
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
      )}

    </div>
  );
};
