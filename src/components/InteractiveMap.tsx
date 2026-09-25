import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, MapPin, Compass, Navigation, Eye, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { SonarHazard, SurveyTransect } from '../types/sonar';

interface InteractiveMapProps {
  currentTransect: SurveyTransect;
  hazards: SonarHazard[];
  selectedHazardId: string | null;
  onSelectHazard: (hazard: SonarHazard) => void;
  onInspectWaterfall?: (hazard: SonarHazard) => void;
}

type MapLayerType = 'ocean' | 'satellite' | 'nautical' | 'dark';

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  currentTransect,
  hazards,
  selectedHazardId,
  onSelectHazard,
  onInspectWaterfall,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tracklineLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const nauticalOverlayRef = useRef<L.TileLayer | null>(null);

  const [activeLayer, setActiveLayer] = useState<MapLayerType>('ocean');
  const [showNauticalOverlay, setShowNauticalOverlay] = useState<boolean>(true);
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentTransect.centerLat, currentTransect.centerLng],
        zoom: currentTransect.zoom,
        zoomControl: false,
        attributionControl: true,
      });

      // Place zoom control in top right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Layer groups
      const trackGroup = L.layerGroup().addTo(map);
      const markGroup = L.layerGroup().addTo(map);
      tracklineLayerRef.current = trackGroup;
      markersLayerRef.current = markGroup;

      mapInstanceRef.current = map;

      // Mousemove event for coordinate display
      map.on('mousemove', (e: L.LeafletMouseEvent) => {
        setCursorCoords({
          lat: Number(e.latlng.lat.toFixed(5)),
          lng: Number(e.latlng.lng.toFixed(5)),
        });
      });
    }

    return () => {
      // Keep map alive or cleanup on unmount
    };
  }, []);

  // Update base tile layer based on activeLayer
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove existing tile layer
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    let url = '';
    let attribution = '';
    let maxZoom = 19;

    switch (activeLayer) {
      case 'satellite':
        url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP';
        break;
      case 'ocean':
        // Esri Ocean Basemap with deep ocean bathymetry and continental shelves
        url = 'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}';
        attribution = 'Tiles &copy; Esri, GEBCO, NOAA, National Geographic, DeLorme, HERE, Geonames.org';
        maxZoom = 16;
        break;
      case 'dark':
      default:
        // CartoDB Dark Matter
        url = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
        attribution = '&copy; <a href="https://carto.com/">CARTO</a>';
        break;
    }

    const newTileLayer = L.tileLayer(url, { attribution, maxZoom }).addTo(map);
    tileLayerRef.current = newTileLayer;

    // Handle OpenSeaMap nautical seamarks overlay
    if (nauticalOverlayRef.current) {
      map.removeLayer(nauticalOverlayRef.current);
      nauticalOverlayRef.current = null;
    }

    if (showNauticalOverlay) {
      const seaMarks = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="http://www.openseamap.org">OpenSeaMap</a>',
        maxZoom: 18,
      }).addTo(map);
      nauticalOverlayRef.current = seaMarks;
    }
  }, [activeLayer, showNauticalOverlay]);

  // Recenter when currentTransect changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setView(
      [currentTransect.centerLat, currentTransect.centerLng],
      currentTransect.zoom,
      { animate: true }
    );
  }, [currentTransect]);

  // Render Trackline & Swath Corridor
  useEffect(() => {
    if (!mapInstanceRef.current || !tracklineLayerRef.current) return;
    const trackGroup = tracklineLayerRef.current;
    trackGroup.clearLayers();

    const trackCoords: L.LatLngExpression[] = currentTransect.trackline.map(
      ([lat, lng]) => [lat, lng] as [number, number]
    );

    // Swath buffer corridor (simulating 100m - 150m side-scan coverage swath)
    const swathCorridor = L.polyline(trackCoords, {
      color: '#0284c7',
      weight: 22,
      opacity: 0.18,
      lineCap: 'round',
      lineJoin: 'round',
    });
    trackGroup.addLayer(swathCorridor);

    // Center boat track line
    const centerTrack = L.polyline(trackCoords, {
      color: '#38bdf8',
      weight: 2.5,
      opacity: 0.9,
      dashArray: '6, 6',
    });
    trackGroup.addLayer(centerTrack);

    // Survey Vessel / AUV Icon at the head of trackline
    if (trackCoords.length > 0) {
      const startPos = trackCoords[0] as [number, number];
      const vesselSvg = `
        <div style="transform: rotate(${currentTransect.vesselHeadingDeg}deg); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 8px #0284c7);">
            <polygon points="12 2 19 21 12 17 5 21 12 2" fill="#0369a1"/>
          </svg>
        </div>
      `;
      const vesselIcon = L.divIcon({
        html: vesselSvg,
        className: 'vessel-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const vesselMarker = L.marker(startPos, { icon: vesselIcon });
      vesselMarker.bindTooltip(
        `<b>AUV Sonar Platform</b><br/>Speed: ${currentTransect.vesselSpeedKnots} kn<br/>Heading: ${currentTransect.vesselHeadingDeg}°`,
        { direction: 'top', className: 'bg-slate-900 text-white text-xs border border-slate-700' }
      );
      trackGroup.addLayer(vesselMarker);
    }
  }, [currentTransect]);

  // Render Hazard Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;
    const markGroup = markersLayerRef.current;
    markGroup.clearLayers();

    hazards.forEach((h) => {
      // Color definition by Risk Level
      let strokeColor = '#22c55e'; // Green for LOW
      let fillColor = '#15803d';
      let badgeBg = 'bg-emerald-950 text-emerald-300 border-emerald-500/40';

      if (h.riskLevel === 'HIGH') {
        strokeColor = '#ef4444'; // Red for HIGH
        fillColor = '#b91c1c';
        badgeBg = 'bg-red-950 text-red-300 border-red-500/40';
      } else if (h.riskLevel === 'MEDIUM') {
        strokeColor = '#eab308'; // Yellow for MEDIUM
        fillColor = '#a16207';
        badgeBg = 'bg-amber-950 text-amber-300 border-amber-500/40';
      }

      const isSelected = selectedHazardId === h.id;

      // Custom Glowing Sonar Marker HTML
      const markerHtml = `
        <div class="relative cursor-pointer transition-transform hover:scale-125" style="width: 32px; height: 32px;">
          ${
            isSelected
              ? `<div class="absolute inset-0 rounded-full animate-ping" style="background-color: ${strokeColor}; opacity: 0.4;"></div>`
              : ''
          }
          <div class="w-8 h-8 rounded-full flex items-center justify-center border-2 shadow-lg"
               style="background-color: ${fillColor}; border-color: ${strokeColor}; box-shadow: 0 0 12px ${strokeColor};">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              ${
                h.category === 'ghost_net'
                  ? '<path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>'
                  : '<polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>'
              }
            </svg>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: markerHtml,
        className: 'custom-hazard-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18],
      });

      const marker = L.marker([h.latitude, h.longitude], { icon: customIcon });

      // Rich Interactive Dark Popup
      const popupHtml = document.createElement('div');
      popupHtml.className = 'p-3.5 space-y-2.5 min-w-[270px] select-text';
      popupHtml.innerHTML = `
        <div class="flex items-start justify-between gap-2 border-b border-slate-800 pb-2">
          <div>
            <div class="text-[10px] font-mono text-slate-400 uppercase tracking-wider">${h.id}</div>
            <div class="font-bold text-sm text-white leading-tight">${h.targetType}</div>
          </div>
          <span class="px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${badgeBg}">
            ${h.riskLevel} RISK
          </span>
        </div>

        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="p-1.5 bg-slate-950/80 rounded border border-slate-800">
            <span class="text-[10px] text-slate-400 block">AI Confidence</span>
            <span class="font-mono font-bold text-sky-400">${(h.confidence * 100).toFixed(1)}%</span>
          </div>
          <div class="p-1.5 bg-slate-950/80 rounded border border-slate-800">
            <span class="text-[10px] text-slate-400 block">Est. Relief Height</span>
            <span class="font-mono font-bold text-emerald-400">${h.estimatedHeightM}m</span>
          </div>
          <div class="p-1.5 bg-slate-950/80 rounded border border-slate-800">
            <span class="text-[10px] text-slate-400 block">Shadow Length</span>
            <span class="font-mono text-slate-200">${h.shadowLengthM}m (Verified)</span>
          </div>
          <div class="p-1.5 bg-slate-950/80 rounded border border-slate-800">
            <span class="text-[10px] text-slate-400 block">Water Depth</span>
            <span class="font-mono text-slate-200">${h.waterDepthM}m</span>
          </div>
        </div>

        <div class="text-[11px] text-slate-300 bg-slate-950/50 p-2 rounded border border-slate-800/80 italic">
          "${h.acousticSignature}"
        </div>

        <div class="text-[10px] font-mono text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
          <span>Lat: ${h.latitude.toFixed(5)}°</span>
          <span>Lng: ${h.longitude.toFixed(5)}°</span>
        </div>
      `;

      // Add inspect button to popup
      const inspectBtn = document.createElement('button');
      inspectBtn.className = 'w-full py-1.5 mt-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer';
      inspectBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
        Inspect Sonar Waterfall
      `;
      inspectBtn.onclick = (e) => {
        e.stopPropagation();
        onSelectHazard(h);
        if (onInspectWaterfall) onInspectWaterfall(h);
      };
      popupHtml.appendChild(inspectBtn);

      marker.bindPopup(popupHtml, { maxWidth: 320 });

      marker.on('click', () => {
        onSelectHazard(h);
      });

      markGroup.addLayer(marker);

      // If selected, auto open popup
      if (isSelected) {
        marker.openPopup();
      }
    });
  }, [hazards, selectedHazardId]);

  return (
    <div className="relative w-full h-full bg-slate-950 overflow-hidden select-none">
      
      {/* Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Map Controls - Top Left Layer Switcher */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="p-1 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg shadow-xl flex items-center gap-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveLayer('ocean')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeLayer === 'ocean'
                ? 'bg-sky-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bathymetry Ocean
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('satellite')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeLayer === 'satellite'
                ? 'bg-sky-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('dark')}
            className={`px-2.5 py-1 rounded transition-colors ${
              activeLayer === 'dark'
                ? 'bg-sky-600 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dark GIS
          </button>
        </div>

        {/* Nautical Seamarks overlay toggle */}
        <button
          type="button"
          onClick={() => setShowNauticalOverlay(!showNauticalOverlay)}
          className={`px-2.5 py-1 rounded-lg border text-xs font-medium transition-colors flex items-center gap-1.5 w-fit backdrop-blur-md shadow-lg ${
            showNauticalOverlay
              ? 'bg-slate-900/90 border-sky-500/50 text-sky-300'
              : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-sky-400" />
          <span>OpenSeaMap Nautical Layer {showNauticalOverlay ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Floating Legend - Top Right */}
      <div className="absolute top-4 right-14 z-20 hidden md:block">
        <div className="p-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg shadow-xl text-xs space-y-1.5">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Entanglement Risk Index (ERI)
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <span>High Risk (Ghost Net / Active Mesh)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#eab308]" />
            <span>Medium Risk (Derelict Trap / Towline)</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#22c55e]" />
            <span>Low Risk (Flat Debris / Cleared)</span>
          </div>
          <div className="pt-1 mt-1 border-t border-slate-800/80 flex items-center gap-2 text-slate-400 text-[11px]">
            <span className="w-4 h-1 bg-sky-500/40 rounded border border-sky-400" />
            <span>Side-Scan Swath ({currentTransect.swathWidthM}m)</span>
          </div>
        </div>
      </div>

      {/* Floating Coordinates & Telemetry HUD - Bottom Left */}
      <div className="absolute bottom-3 left-3 z-20 flex items-center gap-3">
        <div className="px-3 py-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg shadow-lg text-[11px] font-mono text-slate-300 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-sky-400">
            <Navigation className="w-3.5 h-3.5" />
            <span>AUV Heading: {currentTransect.vesselHeadingDeg}°</span>
          </div>
          <span className="text-slate-600">|</span>
          <div>
            <span>Cursor: </span>
            {cursorCoords ? (
              <span className="text-slate-100 font-semibold">
                {cursorCoords.lat}° N, {cursorCoords.lng}° E
              </span>
            ) : (
              <span className="text-slate-500">Hover map</span>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
