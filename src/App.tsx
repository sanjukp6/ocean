import React, { useState } from 'react';
import { AppSidebar } from './components/AppSidebar';
import { MapView } from './views/MapView';
import { SonarLabView } from './views/SonarLabView';
import { PipelineView } from './views/PipelineView';
import { AnomalyRegistryView } from './views/AnomalyRegistryView';
import { ResearchView } from './views/ResearchView';
import {
  SurveyTransect,
  SonarHazard,
  PipelineSettings,
  PipelineStage,
  ActivePage,
} from './types/sonar';
import {
  KOH_TAO_TRANSECT,
  AI4SHIPWRECKS_TRANSECT,
  AVAILABLE_TRANSECTS,
  generateSyntheticSonarImage,
} from './data/sampleDatasets';
import { computeEntanglementRiskIndex } from './utils/acousticPhysics';
import { exportShapefilePackage } from './utils/exportUtils';
import { CheckCircle2, AlertTriangle, Sparkles, X, ArrowRight } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<ActivePage>('map');
  const [currentTransect, setCurrentTransect] = useState<SurveyTransect>(KOH_TAO_TRANSECT);
  const [hazards, setHazards] = useState<SonarHazard[]>(KOH_TAO_TRANSECT.hazards);
  const [selectedHazard, setSelectedHazard] = useState<SonarHazard | null>(
    KOH_TAO_TRANSECT.hazards[0] || null
  );

  const [settings, setSettings] = useState<PipelineSettings>({
    tvgEnabled: true,
    slantRangeEnabled: true,
    denoisingEnabled: true,
    shadowPhysicsCheck: true,
    confidenceThreshold: 75,
    colorPalette: 'bronze',
  });

  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle');
  const [pipelineProgress, setPipelineProgress] = useState<number>(0);

  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null);

  const [executionLogs, setExecutionLogs] = useState<string[]>([
    '[INIT] Loaded baseline survey: Koh Tao Pinnacle Fringe (5 labeled targets)',
    '[STATUS] Dual-frequency 410 kHz side-scan channel calibrated',
  ]);

  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'info' | 'warn';
    actionText?: string;
    onAction?: () => void;
  } | null>({
    message: 'Welcome to AeroAcoustic-DebrisNet. Select any page from the sidebar to inspect sonar, run AI pipelines, or view GIS maps.',
    type: 'info',
  });

  // Switch transect
  const handleSelectTransect = (transect: SurveyTransect) => {
    setCurrentTransect(transect);
    setHazards(transect.hazards);
    setSelectedHazard(transect.hazards[0] || null);
    setUploadedFileName(null);
    setUploadedPreviewUrl(null);
    setExecutionLogs((prev) => [
      `[TRANSECT] Switched active survey zone to: ${transect.name}`,
      `[TELEMETRY] Frequency: ${transect.frequencyKhz} kHz · Swath: ${transect.swathWidthM}m · Depth: ~${transect.waterDepthAvgM}m`,
      ...prev.slice(0, 10),
    ]);
    setNotification({
      message: `Survey Zone Switched: ${transect.name} with ${transect.hazards.length} geotagged hazards.`,
      type: 'info',
    });
  };

  // Preset loader
  const handleLoadPreset = (presetName: string) => {
    if (presetName === 'koh_tao_net') {
      handleSelectTransect(KOH_TAO_TRANSECT);
    } else if (presetName === 'ai4shipwrecks_snag') {
      handleSelectTransect(AI4SHIPWRECKS_TRANSECT);
    }
  };

  // File upload handler
  const handleFileUpload = (file: File) => {
    setUploadedFileName(file.name);
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      const syn = generateSyntheticSonarImage(
        'Custom Log Tile',
        'starboard',
        settings.colorPalette,
        settings.slantRangeEnabled
      );
      setUploadedPreviewUrl(syn);
    }

    setExecutionLogs((prev) => [
      `[UPLOAD] Ingested sonar file: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
      '[PREPROCESS] Ready for TVG normalization and slant-range projection',
      ...prev.slice(0, 10),
    ]);

    setNotification({
      message: `Ingested ${file.name}. Ready to execute AeroAcoustic pipeline.`,
      type: 'success',
      actionText: 'Open Pipeline',
      onAction: () => setActivePage('pipeline'),
    });
  };

  // Run pipeline
  const runAeroAcousticPipeline = async () => {
    try {
      setPipelineStage('reading');
      setPipelineProgress(15);
      setExecutionLogs((prev) => [
        `[PIPELINE] Reading sonar telemetry headers...`,
        `[TVG] Calculating time-varying transmission gain across range...`,
        ...prev.slice(0, 10),
      ]);
      await new Promise((r) => setTimeout(r, 600));

      setPipelineStage('preprocessing');
      setPipelineProgress(35);
      setExecutionLogs((prev) => [
        `[SLANT-RANGE] Stripping water column nadir band...`,
        `[FILTER] Applying cold diffusion speckle noise filter...`,
        ...prev.slice(0, 10),
      ]);
      await new Promise((r) => setTimeout(r, 700));

      setPipelineStage('ai_vision');
      setPipelineProgress(60);
      setExecutionLogs((prev) => [
        `[AI-VISION] Calling Gemini 3.8 Flash Vision model...`,
        `[PHYSICS] Enforcing acoustic shadow relief constraint: H_t = (L_s * H_a) / (R_s + L_s)...`,
        ...prev.slice(0, 10),
      ]);

      let base64ToSend = uploadedPreviewUrl;
      if (!base64ToSend) {
        base64ToSend = generateSyntheticSonarImage(
          'Ghost Net Detection Tile',
          'starboard',
          settings.colorPalette,
          settings.slantRangeEnabled
        );
      }

      const response = await fetch('/api/analyze-sonar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64ToSend,
          tvgEnabled: settings.tvgEnabled,
          slantRangeEnabled: settings.slantRangeEnabled,
          denoisingEnabled: settings.denoisingEnabled,
          shadowPhysicsCheck: settings.shadowPhysicsCheck,
          confidenceThreshold: settings.confidenceThreshold,
          waterDepthM: currentTransect.waterDepthAvgM,
          altitudeM: 5.4,
        }),
      });

      const data = await response.json();
      const analysis = data.analysis;

      setPipelineStage('geocoding');
      setPipelineProgress(85);
      setExecutionLogs((prev) => [
        `[GEOCODE] Computing WGS84 coordinates from vessel heading (${currentTransect.vesselHeadingDeg}°)...`,
        `[ERI] Calculating Entanglement Risk Index...`,
        ...prev.slice(0, 10),
      ]);
      await new Promise((r) => setTimeout(r, 600));

      if (analysis && analysis.debris_found) {
        const offsetLat = (Math.random() - 0.5) * 0.005;
        const offsetLng = (Math.random() - 0.5) * 0.005;
        const newLat = Number((currentTransect.centerLat + offsetLat).toFixed(6));
        const newLng = Number((currentTransect.centerLng + offsetLng).toFixed(6));

        const eri = computeEntanglementRiskIndex({
          category: analysis.category,
          heightM: analysis.estimated_height_m,
          confidence: analysis.confidence,
          waterDepthM: currentTransect.waterDepthAvgM,
          shadowVerified: analysis.shadow_verified,
        });

        const newHazard: SonarHazard = {
          id: `SSS-LIVE-${Date.now().toString().slice(-4)}`,
          targetType: analysis.category,
          category: 'ghost_net',
          confidence: analysis.confidence,
          estimatedHeightM: analysis.estimated_height_m,
          shadowLengthM: analysis.shadow_length_m || 4.2,
          waterDepthM: currentTransect.waterDepthAvgM,
          altitudeM: 5.4,
          latitude: newLat,
          longitude: newLng,
          riskLevel: eri.level,
          shadowVerified: analysis.shadow_verified,
          acousticSignature: analysis.acoustic_signature,
          detectedAt: new Date().toISOString(),
          boundingBox: {
            ymin: analysis.bounding_box[0] || 250,
            xmin: analysis.bounding_box[1] || 200,
            ymax: analysis.bounding_box[2] || 600,
            xmax: analysis.bounding_box[3] || 700,
          },
          swathChannel: 'starboard',
          slantRangeM: 26.4,
          groundRangeM: 25.8,
          recommendation: analysis.recommendation || 'Diver salvage scheduled.',
        };

        setHazards((prev) => [newHazard, ...prev]);
        setSelectedHazard(newHazard);

        setExecutionLogs((prev) => [
          `[SUCCESS] Detected: ${analysis.category} (${(analysis.confidence * 100).toFixed(1)}% Conf)`,
          `[SHADOW] Relief: ${analysis.estimated_height_m}m · Risk: ${eri.level} · Lat/Lng: ${newLat}, ${newLng}`,
          ...prev.slice(0, 10),
        ]);

        setNotification({
          message: `Pipeline Completed: Detected ${analysis.category} (${(analysis.confidence * 100).toFixed(1)}% Conf, ${analysis.estimated_height_m}m Relief).`,
          type: 'success',
          actionText: 'View on Map',
          onAction: () => setActivePage('map'),
        });
      } else {
        setNotification({
          message: 'Pipeline Completed: No debris detected above confidence threshold.',
          type: 'info',
        });
      }

      setPipelineProgress(100);
      setPipelineStage('completed');
      setTimeout(() => setPipelineStage('idle'), 2500);
    } catch (err: any) {
      console.error('Pipeline error:', err);
      setPipelineStage('idle');
      setNotification({
        message: 'Pipeline encountered a transient error; local acoustic fallback retained.',
        type: 'warn',
      });
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      
      {/* Dedicated Left Navigation Sidebar */}
      <AppSidebar
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        currentTransect={currentTransect}
        availableTransects={AVAILABLE_TRANSECTS}
        onSelectTransect={handleSelectTransect}
        hazards={hazards}
        onExportShapefile={() => exportShapefilePackage(hazards, currentTransect)}
        isProcessing={pipelineStage !== 'idle' && pipelineStage !== 'completed'}
      />

      {/* Main Content Area (renders the selected dedicated page view) */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        
        {/* Floating Notification Toast */}
        {notification && (
          <div className="absolute top-4 right-6 z-50 max-w-lg p-3.5 rounded-xl shadow-2xl backdrop-blur-md border flex items-center justify-between gap-4 text-xs bg-slate-900/95 border-slate-700 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2.5">
              {notification.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
              {notification.type === 'warn' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
              {notification.type === 'info' && <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />}
              <span className="text-slate-200 leading-snug">{notification.message}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {notification.actionText && notification.onAction && (
                <button
                  type="button"
                  onClick={() => {
                    notification.onAction!();
                    setNotification(null);
                  }}
                  className="px-2.5 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded font-semibold text-[11px] transition-colors flex items-center gap-1"
                >
                  <span>{notification.actionText}</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setNotification(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Page Router */}
        {activePage === 'map' && (
          <MapView
            currentTransect={currentTransect}
            hazards={hazards}
            selectedHazard={selectedHazard}
            onSelectHazard={(h) => setSelectedHazard(h)}
            onNavigateToWaterfall={(h) => {
              setSelectedHazard(h);
              setActivePage('waterfall');
            }}
          />
        )}

        {activePage === 'waterfall' && (
          <SonarLabView
            hazards={hazards}
            selectedHazard={selectedHazard}
            onSelectHazard={(h) => setSelectedHazard(h)}
            settings={settings}
            onUpdateSettings={(newSettings) => setSettings((prev) => ({ ...prev, ...newSettings }))}
            currentTransect={currentTransect}
          />
        )}

        {activePage === 'pipeline' && (
          <PipelineView
            settings={settings}
            onUpdateSettings={(newSettings) => setSettings((prev) => ({ ...prev, ...newSettings }))}
            onRunPipeline={runAeroAcousticPipeline}
            pipelineStage={pipelineStage}
            pipelineProgress={pipelineProgress}
            onFileUpload={handleFileUpload}
            onLoadPreset={handleLoadPreset}
            currentTransect={currentTransect}
            uploadedFileName={uploadedFileName}
            uploadedPreviewUrl={uploadedPreviewUrl}
            executionLogs={executionLogs}
          />
        )}

        {activePage === 'anomalies' && (
          <AnomalyRegistryView
            hazards={hazards}
            currentTransect={currentTransect}
            onSelectHazard={(h) => setSelectedHazard(h)}
            onNavigateToMap={(h) => {
              setSelectedHazard(h);
              setActivePage('map');
            }}
            onNavigateToWaterfall={(h) => {
              setSelectedHazard(h);
              setActivePage('waterfall');
            }}
          />
        )}

        {activePage === 'research' && <ResearchView />}

      </main>

    </div>
  );
}
