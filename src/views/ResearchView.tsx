import React from 'react';
import {
  BookOpen,
  ExternalLink,
  Database,
  Cpu,
  ShieldCheck,
  Code,
  FileText,
  Compass,
  Layers,
} from 'lucide-react';

export const ResearchView: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto select-none">
      
      {/* Top Header */}
      <header className="h-14 px-6 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sky-500/10 border border-sky-500/30 rounded-lg text-sky-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">
              Research Benchmarks, Open Datasets & Acoustic Physics
            </h2>
            <p className="text-[11px] text-slate-400">
              Scientific references, open-access repositories, and hydrographic formulas powering AeroAcoustic-DebrisNet
            </p>
          </div>
        </div>
      </header>

      {/* Main Documentation Body */}
      <div className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-8">
        
        {/* End-to-End System Process Overview */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-5 h-5 text-sky-400" />
            <span>End-to-End Side Scan Sonar Processing Workflow</span>
          </h3>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-sky-300 overflow-x-auto whitespace-pre">
{` [1. Sonar Log Ingestion] ──► [2. TVG & Slant-Range Correction]
                                            │
                                            ▼
 [5. Interactive GIS Map] ◄── [4. Geocoding & ERI Score] ◄── [3. Gemini Vision & Shadow Physics Check]`}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs pt-2">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
              <span className="font-bold text-sky-400 block mb-1">1. Ingestion</span>
              <p className="text-slate-400 leading-relaxed">
                Ingests binary .xtf, .jsf, .sl2 sonar recordings or georeferenced waterfall tiles.
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
              <span className="font-bold text-sky-400 block mb-1">2. Slant-Range</span>
              <p className="text-slate-400 leading-relaxed">
                Strips water column nadir via bottom tracking and transforms diagonal slant ranges to flat benthos.
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
              <span className="font-bold text-sky-400 block mb-1">3. AI & Shadow</span>
              <p className="text-slate-400 leading-relaxed">
                Gemini 3.8 Flash Vision scans for high-backscatter net twine and enforces acoustic shadow verification.
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
              <span className="font-bold text-sky-400 block mb-1">4. Geocode & ERI</span>
              <p className="text-slate-400 leading-relaxed">
                Translates pixel coordinates to WGS84 and computes the Entanglement Risk Index (ERI).
              </p>
            </div>
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-850">
              <span className="font-bold text-sky-400 block mb-1">5. Web GIS</span>
              <p className="text-slate-400 leading-relaxed">
                Interactive Leaflet map display and instant downloads in Shapefile (.shp), COCO JSON, GeoJSON, and KML.
              </p>
            </div>
          </div>
        </section>

        {/* 5 Open Access Datasets & Repositories */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-emerald-400" />
              <span>Validated Open-Access Datasets & Open-Source Codebases</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">5 Peer-Reviewed Sources</span>
          </div>

          <div className="space-y-3">
            
            {/* Source 1 */}
            <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-sky-950 border border-sky-800/40 text-[10px] font-mono text-sky-300">
                      Open-Access Dataset
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      Seafloor Debris & Restoration Dataset (Koh Tao Survey)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Extensive labeled marine waste and super-resolution side-scan sonar imagery collected across coral pinnacles in the Gulf of Thailand. Focuses on monofilament gillnets, trawl mesh, and fish traps.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    DOI: 10.5281/zenodo.14866178 · Zenodo Open Repository · Survey Lat: 10.0711° N, Long: 99.8393° E
                  </div>
                </div>

                <a
                  href="https://doi.org/10.5281/zenodo.14866178"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/40 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-center shrink-0 transition-colors"
                >
                  <span>Zenodo Repo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Source 2 */}
            <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-800/40 text-[10px] font-mono text-amber-300">
                      Benchmark Dataset
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      AI4Shipwrecks Benchmark Dataset (Field Robotics Group)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Expert-labeled side scan sonar imagery collected by Autonomous Underwater Vehicles (AUVs) exploring 19th-century schooners and massive commercial trawl net entanglements in Thunder Bay National Marine Sanctuary.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    University of Michigan Field Robotics · COCO Sonar Waterfall Format
                  </div>
                </div>

                <a
                  href="https://umfieldrobotics.github.io/ai4shipwrecks/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/40 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-center shrink-0 transition-colors"
                >
                  <span>AI4Shipwrecks</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Source 3 */}
            <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800/40 text-[10px] font-mono text-emerald-300">
                      Open-Source Software
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      PINGMapper Sonar Suite (Cameron Bodine)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Automated Python software suite for reading raw sonar recordings (Humminbird, Lowrance, EdgeTech), performing bottom tracking, water column removal, and georeferencing into GIS GeoTIFFs.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    Python / GDAL / MIT License · Substrate Classification Suite
                  </div>
                </div>

                <a
                  href="https://github.com/CameronBodine/PINGMapper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/40 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-center shrink-0 transition-colors"
                >
                  <span>GitHub Repo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Source 4 */}
            <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-800/40 text-[10px] font-mono text-purple-300">
                      PyPI Python Tool
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      SideScanSonarEditor (PyPI Package)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Dedicated utility to parse binary eXtended Triton Format (.xtf) sonar logs, perform slant-range correction, slice acoustic waterfall tiles, and export COCO JSON annotations.
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    pip install SideScanSonarEditor · Binary .xtf / .jsf Parser
                  </div>
                </div>

                <a
                  href="https://pypi.org/project/SideScanSonarEditor/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/40 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-center shrink-0 transition-colors"
                >
                  <span>PyPI Package</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Source 5 */}
            <div className="p-5 bg-slate-900 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/40 text-[10px] font-mono text-cyan-300">
                      Deep Learning Model
                    </span>
                    <h4 className="text-sm font-bold text-white">
                      Generative Data Augmentation (ControlNet + SDXL)
                    </h4>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Generative acoustic backscatter synthesis repository to synthesize rare ghost net sonar imagery and enhance deep convolutional detector training sets (UDD-YOLO / YOLOv8).
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono pt-1">
                    deepsea-benthos-SD-Augmentation · ControlNet Depth Guided Sonar Synthesis
                  </div>
                </div>

                <a
                  href="https://github.com/dengjunlan/deepsea-benthos-SD-Augmentation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-sky-600/20 hover:bg-sky-600/30 text-sky-400 border border-sky-500/40 rounded-xl text-xs font-semibold flex items-center gap-2 self-start sm:self-center shrink-0 transition-colors"
                >
                  <span>GitHub Code</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Acoustic Physics Mathematical Formulations */}
        <section className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-sky-400" />
            <span>Hydrographic & Acoustic Shadow Physics Formulations</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-semibold text-white block">1. Slant-Range to Ground-Range Projection</span>
              <p className="text-slate-400 font-mono bg-slate-900 p-2.5 rounded border border-slate-800 text-sky-300">
                R_ground = √(R_slant² - H_altitude²)
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Side scan sonars measure the oblique slant range distance R_slant. Slant-range correction strips the water column nadir and projects diagonal acoustic rays onto horizontal seafloor distance R_ground.
              </p>
            </div>

            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <span className="font-semibold text-white block">2. Acoustic Shadow Vertical Relief Formula</span>
              <p className="text-slate-400 font-mono bg-slate-900 p-2.5 rounded border border-slate-800 text-emerald-300">
                H_target = (L_shadow × H_altitude) / (R_slant + L_shadow)
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Calculates true object height off the seabed from downstream shadow length L_shadow and towfish altitude H_altitude. Objects without downstream shadows are rejected as flat seabed scarring.
              </p>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
};
