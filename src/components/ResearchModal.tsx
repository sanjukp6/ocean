import React from 'react';
import { X, ExternalLink, BookOpen, Database, Cpu, Compass, Layers, ShieldCheck } from 'lucide-react';

interface ResearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResearchModal: React.FC<ResearchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl text-slate-200 p-6 md:p-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/30 rounded-lg text-sky-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide">
                Datasets, Physics Pipeline & Research References
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Scientific foundations of the AeroAcoustic-DebrisNet Side Scan Sonar (SSS) processing engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 5-Stage Scientific Pipeline Overview */}
        <div className="mt-6 p-4 bg-slate-950/70 border border-sky-900/40 rounded-lg">
          <h3 className="text-sm font-semibold text-sky-300 flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-sky-400" />
            End-to-End Processing Architecture
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-md">
              <span className="text-sky-400 font-bold block mb-1">01. Log Ingestion</span>
              <p className="text-slate-400 leading-relaxed">
                Ingests raw .XTF, .JSF, .SL2 binary sonar telemetry or GeoTIFF/PNG imagery tiles.
              </p>
            </div>
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-md">
              <span className="text-sky-400 font-bold block mb-1">02. Slant-Range & TVG</span>
              <p className="text-slate-400 leading-relaxed">
                Time-Varying Gain normalization strips water column nadir and projects slant range to flat seabed.
              </p>
            </div>
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-md">
              <span className="text-sky-400 font-bold block mb-1">03. AI & Shadow Physics</span>
              <p className="text-slate-400 leading-relaxed">
                Gemini Vision / UDD-YOLO scans for mesh highlights and enforces downstream acoustic shadow verification.
              </p>
            </div>
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-md">
              <span className="text-sky-400 font-bold block mb-1">04. Georeference & ERI</span>
              <p className="text-slate-400 leading-relaxed">
                WGS84 lat/long geocoding via vessel heading, plus Entanglement Risk Index (ERI) scoring.
              </p>
            </div>
            <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-md">
              <span className="text-sky-400 font-bold block mb-1">05. Web GIS & Exports</span>
              <p className="text-slate-400 leading-relaxed">
                Interactive Leaflet bathymetry mapping, Shapefile, COCO JSON, GeoJSON, and KML export generation.
              </p>
            </div>
          </div>
        </div>

        {/* Dataset Links */}
        <div className="mt-6 space-y-4">
          <h3 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            Open-Access Benchmark Datasets & Codebases
          </h3>

          {/* Dataset 1: Koh Tao */}
          <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-lg hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Seafloor Debris & Restoration Dataset (Koh Tao Survey)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Open-access dataset containing expert-labeled marine waste, ghost nets, abandoned traps, and super-resolution side-scan sonar images collected in the Gulf of Thailand coral reef fringe.
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span>Repository: Zenodo</span>
                  <span>·</span>
                  <span>DOI: 10.5281/zenodo.14866178</span>
                  <span>·</span>
                  <span>Lat: 10.0711° N, Long: 99.8393° E</span>
                </div>
              </div>
              <a
                href="https://doi.org/10.5281/zenodo.14866178"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 rounded-md text-xs font-medium transition-colors"
              >
                Zenodo Repo <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Dataset 2: AI4Shipwrecks */}
          <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-lg hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  AI4Shipwrecks Benchmark Dataset (Field Robotics Group)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Expert-labeled side-scan sonar imagery collected by Autonomous Underwater Vehicles (AUVs) across historic shipwrecks, submerged maritime obstructions, and heavy derelict trawl net entanglements.
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span>Institution: University of Michigan / Thunder Bay Sanctuary</span>
                  <span>·</span>
                  <span>Format: Side-scan waterfall COCO annotations</span>
                </div>
              </div>
              <a
                href="https://umfieldrobotics.github.io/ai4shipwrecks/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 rounded-md text-xs font-medium transition-colors"
              >
                AI4Shipwrecks <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Tool 3: PINGMapper */}
          <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-lg hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  PINGMapper Sonar Suite (Cameron Bodine)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Open-source Python software suite for reading Humminbird, Lowrance, and EdgeTech sonar recordings, performing automated seabed bottom-tracking, slant-range correction, and geocoding into GIS GeoTIFFs.
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span>License: MIT</span>
                  <span>·</span>
                  <span>Python / PySide / GDAL</span>
                </div>
              </div>
              <a
                href="https://github.com/CameronBodine/PINGMapper"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 rounded-md text-xs font-medium transition-colors"
              >
                GitHub Repo <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Tool 4: SideScanSonarEditor */}
          <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-lg hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  SideScanSonarEditor (PyPI Package)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Dedicated utility to parse binary .xtf sonar logs, perform acoustic slant-range conversion, crop training image patches, and export computer-vision standard COCO JSON annotations.
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span>Package: PyPI</span>
                  <span>·</span>
                  <span>Supported formats: .xtf, .jsf</span>
                </div>
              </div>
              <a
                href="https://pypi.org/project/SideScanSonarEditor/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 rounded-md text-xs font-medium transition-colors"
              >
                PyPI Link <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Tool 5: ControlNet SDXL Augmentation */}
          <div className="p-4 bg-slate-800/40 border border-slate-700/60 rounded-lg hover:border-slate-600 transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Generative Data Augmentation (ControlNet + SDXL)
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Novel synthetic acoustic backscatter generation model to synthesize rare ghost net sonar imagery and train robust deep convolutional detector backbones (UDD-YOLO / YOLOv8).
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                  <span>Repository: deepsea-benthos-SD-Augmentation</span>
                  <span>·</span>
                  <span>Tech: Stable Diffusion XL + ControlNet Depth</span>
                </div>
              </div>
              <a
                href="https://github.com/dengjunlan/deepsea-benthos-SD-Augmentation"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/30 rounded-md text-xs font-medium transition-colors"
              >
                GitHub Repo <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Sonar Acoustic Physics Calculation Explainer */}
        <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700/50 rounded-lg">
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            Acoustic Shadow Height Formula
          </h4>
          <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded border border-slate-800">
            H_target = (L_shadow × H_altitude) / (R_slant + L_shadow)
          </p>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            Where <code className="text-sky-300">L_shadow</code> is the measured acoustic shadow length downstream along the cross-track scanline, <code className="text-sky-300">H_altitude</code> is the sonar towfish altitude above the seabed, and <code className="text-sky-300">R_slant</code> is the slant range distance to the target peak. If no shadow is detected, the candidate is flagged as flat benthos to eliminate false positives.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Close Documentation
          </button>
        </div>

      </div>
    </div>
  );
};
