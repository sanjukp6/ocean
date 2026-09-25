import { SurveyTransect, SonarHazard } from '../types/sonar';

export const KOH_TAO_TRANSECT: SurveyTransect = {
  id: 'koh_tao_transect_04',
  name: 'Koh Tao Seafloor Survey (Transect 04 - Pinnacle Fringe)',
  locationName: 'Koh Tao Marine Sanctuary, Gulf of Thailand',
  centerLat: 10.0711,
  centerLng: 99.8393,
  zoom: 15,
  vesselHeadingDeg: 215,
  vesselSpeedKnots: 3.8,
  swathWidthM: 100,
  frequencyKhz: 410,
  waterDepthAvgM: 22.4,
  description: 'High-resolution EdgeTech 4125 dual-frequency survey across shallow coral pinnacles and benthos. Open-access Zenodo dataset doi:10.5281/zenodo.14866178.',
  sampleImage: 'koh_tao_ghostnet_01',
  trackline: [
    [10.0785, 99.8340],
    [10.0758, 99.8362],
    [10.0732, 99.8381],
    [10.0711, 99.8393],
    [10.0685, 99.8410],
    [10.0655, 99.8428],
    [10.0620, 99.8445],
  ],
  hazards: [
    {
      id: 'SSS-KT-2026-001',
      targetType: 'Ghost Net / Monofilament Trawl Mesh',
      category: 'ghost_net',
      confidence: 0.962,
      estimatedHeightM: 1.85,
      shadowLengthM: 4.8,
      waterDepthM: 21.6,
      altitudeM: 5.4,
      latitude: 10.0742,
      longitude: 99.8373,
      riskLevel: 'HIGH',
      shadowVerified: true,
      acousticSignature: 'Dense curvilinear high-backscatter net bundle with distinct 4.8m acoustic shadow void cast onto sandy substrate.',
      detectedAt: '2026-09-24T14:22:10Z',
      boundingBox: { ymin: 310, xmin: 640, ymax: 560, xmax: 820 },
      swathChannel: 'starboard',
      slantRangeM: 24.5,
      groundRangeM: 23.9,
      recommendation: 'Immediate diver salvage operation required; high risk of green turtle (Chelonia mydas) and reef shark entanglement.',
    },
    {
      id: 'SSS-KT-2026-002',
      targetType: 'Derelict Gillnet & Entangled Floats',
      category: 'ghost_net',
      confidence: 0.915,
      estimatedHeightM: 1.42,
      shadowLengthM: 3.6,
      waterDepthM: 24.1,
      altitudeM: 6.0,
      latitude: 10.0705,
      longitude: 99.8398,
      riskLevel: 'HIGH',
      shadowVerified: true,
      acousticSignature: 'Linear high-reflectance corkline trace with discrete spherical acoustic bright spots and downstream acoustic relief.',
      detectedAt: '2026-09-24T14:28:44Z',
      boundingBox: { ymin: 440, xmin: 180, ymax: 620, xmax: 390 },
      swathChannel: 'port',
      slantRangeM: 18.2,
      groundRangeM: 17.2,
      recommendation: 'Priority recovery target; mesh is actively billowing in benthic tidal currents across live Porites coral heads.',
    },
    {
      id: 'SSS-KT-2026-003',
      targetType: 'Abandoned Wire Fish Trap (Bubu)',
      category: 'derelict_trap',
      confidence: 0.874,
      estimatedHeightM: 0.95,
      shadowLengthM: 2.3,
      waterDepthM: 19.8,
      altitudeM: 5.1,
      latitude: 10.0674,
      longitude: 99.8418,
      riskLevel: 'MEDIUM',
      shadowVerified: true,
      acousticSignature: 'Rigid orthogonal acoustic bounding box with crisp right-angle acoustic shadow acoustic attenuation.',
      detectedAt: '2026-09-24T14:34:02Z',
      boundingBox: { ymin: 710, xmin: 720, ymax: 850, xmax: 860 },
      swathChannel: 'starboard',
      slantRangeM: 32.1,
      groundRangeM: 31.7,
      recommendation: 'ROV hook-and-line extraction recommended during scheduled benthic cleanup transect.',
    },
    {
      id: 'SSS-KT-2026-004',
      targetType: 'Polypropylene Towline Snag & Anchor Cable',
      category: 'rope_rigging',
      confidence: 0.838,
      estimatedHeightM: 0.72,
      shadowLengthM: 1.9,
      waterDepthM: 23.5,
      altitudeM: 5.8,
      latitude: 10.0641,
      longitude: 99.8437,
      riskLevel: 'MEDIUM',
      shadowVerified: true,
      acousticSignature: 'Elongated low-profile high backscatter streak aligned along heading 245° with localized acoustic shadow.',
      detectedAt: '2026-09-24T14:41:19Z',
      boundingBox: { ymin: 220, xmin: 240, ymax: 380, xmax: 410 },
      swathChannel: 'port',
      slantRangeM: 28.4,
      groundRangeM: 27.8,
      recommendation: 'Log in nautical hydrographic notice as potential dive vessel anchor snag point.',
    },
    {
      id: 'SSS-KT-2026-005',
      targetType: 'Submerged Plastic Drum / Benthic Waste',
      category: 'plastic_debris',
      confidence: 0.762,
      estimatedHeightM: 0.65,
      shadowLengthM: 1.5,
      waterDepthM: 20.2,
      altitudeM: 5.0,
      latitude: 10.0768,
      longitude: 99.8351,
      riskLevel: 'LOW',
      shadowVerified: true,
      acousticSignature: 'Cylindrical acoustic reflection with diffuse trailing acoustic shadow.',
      detectedAt: '2026-09-24T14:15:30Z',
      boundingBox: { ymin: 520, xmin: 600, ymax: 610, xmax: 690 },
      swathChannel: 'starboard',
      slantRangeM: 15.6,
      groundRangeM: 14.8,
      recommendation: 'Low navigation threat; collect during community beach/reef cleanup.',
    },
  ],
};

export const AI4SHIPWRECKS_TRANSECT: SurveyTransect = {
  id: 'ai4shipwrecks_huron_01',
  name: 'AI4Shipwrecks Benchmark (Thunder Bay Sanctuary, Lake Huron)',
  locationName: 'Lake Huron Maritime Sanctuary, Michigan',
  centerLat: 45.0688,
  centerLng: -83.4322,
  zoom: 14,
  vesselHeadingDeg: 140,
  vesselSpeedKnots: 4.2,
  swathWidthM: 150,
  frequencyKhz: 300,
  waterDepthAvgM: 42.0,
  description: 'Expert-labeled benchmark side-scan sonar imagery collected by autonomous underwater vehicles (AUVs) exploring 19th-century schooner wrecks and commercial trawl entanglements.',
  sampleImage: 'ai4shipwrecks_snag_01',
  trackline: [
    [45.0780, -83.4450],
    [45.0735, -83.4380],
    [45.0688, -83.4322],
    [45.0640, -83.4250],
    [45.0590, -83.4180],
  ],
  hazards: [
    {
      id: 'SSS-A4S-2026-101',
      targetType: 'Commercial Trawl Net Snagged on Wooden Hull',
      category: 'shipwreck_snag',
      confidence: 0.978,
      estimatedHeightM: 2.65,
      shadowLengthM: 7.4,
      waterDepthM: 44.2,
      altitudeM: 8.5,
      latitude: 45.0692,
      longitude: -83.4318,
      riskLevel: 'HIGH',
      shadowVerified: true,
      acousticSignature: 'Gigantic acoustic backscatter plume draped over 45m wooden schooner keel, casting massive 7.4m acoustic shadow across flat silt lakebed.',
      detectedAt: '2026-09-23T11:08:22Z',
      boundingBox: { ymin: 250, xmin: 300, ymax: 750, xmax: 720 },
      swathChannel: 'port',
      slantRangeM: 38.6,
      groundRangeM: 37.6,
      recommendation: 'Archaeological site alert: Trawl net is placing structural tension on fragile historic timbers. Specialized non-destructive ROV net cutting advised.',
    },
    {
      id: 'SSS-A4S-2026-102',
      targetType: 'Derelict Trap Array & Steel Bridle',
      category: 'derelict_trap',
      confidence: 0.892,
      estimatedHeightM: 1.15,
      shadowLengthM: 3.2,
      waterDepthM: 41.5,
      altitudeM: 8.1,
      latitude: 45.0655,
      longitude: -83.4270,
      riskLevel: 'MEDIUM',
      shadowVerified: true,
      acousticSignature: 'Series of 4 interconnected rectangular acoustic returns with regular acoustic shadow rhythm.',
      detectedAt: '2026-09-23T11:19:40Z',
      boundingBox: { ymin: 420, xmin: 580, ymax: 580, xmax: 820 },
      swathChannel: 'starboard',
      slantRangeM: 42.0,
      groundRangeM: 41.2,
      recommendation: 'Commercial fishery ghost gear; salvage to prevent benthic mortality.',
    },
  ],
};

export const AVAILABLE_TRANSECTS: SurveyTransect[] = [
  KOH_TAO_TRANSECT,
  AI4SHIPWRECKS_TRANSECT,
];

/**
 * Procedurally generates a realistic Side Scan Sonar waterfall data URL
 * representing port and starboard acoustic channels, nadir water column,
 * acoustic backscatter texturing, target highlight, and acoustic shadow void!
 */
export function generateSyntheticSonarImage(
  targetType: string,
  swathChannel: 'port' | 'starboard',
  palette: 'bronze' | 'ocean' | 'grayscale' | 'amber' = 'bronze',
  slantRangeCorrected: boolean = false
): string {
  const canvas = document.createElement('canvas');
  canvas.width = 600;
  canvas.height = 800;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const w = canvas.width;
  const h = canvas.height;

  // Color mapping functions
  const getColor = (intensity: number) => {
    // intensity 0 (shadow/nadir) to 1 (bright acoustic specular highlight)
    const norm = Math.max(0, Math.min(1, intensity));
    if (palette === 'bronze') {
      // Classic side scan sonar sepia/copper phosphor
      const r = Math.round(norm * 255);
      const g = Math.round(Math.pow(norm, 1.2) * 190);
      const b = Math.round(Math.pow(norm, 1.8) * 80);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (palette === 'ocean') {
      // Deep blue/cyan acoustic palette
      const r = Math.round(Math.pow(norm, 2.0) * 80);
      const g = Math.round(Math.pow(norm, 1.1) * 220);
      const b = Math.round(norm * 255);
      return `rgb(${r}, ${g}, ${b})`;
    } else if (palette === 'amber') {
      // Amber phosphor
      const r = Math.round(norm * 255);
      const g = Math.round(Math.pow(norm, 1.1) * 140);
      const b = Math.round(Math.pow(norm, 2.5) * 20);
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Grayscale
      const val = Math.round(norm * 255);
      return `rgb(${val}, ${val}, ${val})`;
    }
  };

  // Base background (ambient water / seabed backscatter)
  const imgData = ctx.createImageData(w, h);
  const data = imgData.data;

  const centerCol = w / 2;
  const waterColumnHalfWidth = slantRangeCorrected ? 0 : 40; // in slant-range corrected mode, water column is removed

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const distFromCenter = Math.abs(x - centerCol);

      let intensity = 0.35 + (Math.sin(x * 0.05 + y * 0.03) * 0.04) + ((Math.random() - 0.5) * 0.08);

      // Water column nadir band (black acoustic silence directly beneath boat before first seabed return)
      if (!slantRangeCorrected && distFromCenter < waterColumnHalfWidth) {
        intensity = 0.03 + (Math.random() * 0.02);
      } else if (!slantRangeCorrected && Math.abs(distFromCenter - waterColumnHalfWidth) < 3) {
        // First bottom return bright specular stripe
        intensity = 0.85 + (Math.random() * 0.1);
      } else {
        // Time varying gain (TVG) compensation gradient
        const rangeGain = 1.0 + (distFromCenter / (w / 2)) * 0.2;
        intensity *= rangeGain;
      }

      // Sand ripples / seabed texture
      const ripple = Math.sin(y * 0.18 + x * 0.02) * 0.06;
      intensity += ripple;

      // Draw ghost net / debris acoustic highlight and shadow
      const targetY = h * 0.45;
      const targetX = swathChannel === 'starboard' ? centerCol + 130 : centerCol - 130;
      const dx = x - targetX;
      const dy = y - targetY;

      // Irregular netting / web shape highlight
      if (Math.abs(dy) < 45 && Math.abs(dx) < 40) {
        const netPattern = (Math.sin(dx * 0.7) * Math.cos(dy * 0.7) > 0.1) || (Math.hypot(dx, dy) < 18);
        if (netPattern) {
          intensity = 0.92 + (Math.random() * 0.08); // High backscatter highlight
        }
      }

      // Acoustic Shadow Void (cast downstream away from nadir!)
      const shadowDir = swathChannel === 'starboard' ? 1 : -1;
      const shadowStartX = targetX + (shadowDir * 20);
      const shadowEndX = targetX + (shadowDir * 95);

      if (shadowDir === 1) {
        if (x >= shadowStartX && x <= shadowEndX && Math.abs(dy) < 42) {
          intensity = 0.02 + (Math.random() * 0.02); // Acoustic Shadow Void
        }
      } else {
        if (x <= shadowStartX && x >= shadowEndX && Math.abs(dy) < 42) {
          intensity = 0.02 + (Math.random() * 0.02); // Acoustic Shadow Void
        }
      }

      // Map intensity to RGB
      const norm = Math.max(0, Math.min(1, intensity));
      let r = 0, g = 0, b = 0;

      if (palette === 'bronze') {
        r = Math.round(norm * 255);
        g = Math.round(Math.pow(norm, 1.25) * 195);
        b = Math.round(Math.pow(norm, 1.9) * 85);
      } else if (palette === 'ocean') {
        r = Math.round(Math.pow(norm, 2.0) * 85);
        g = Math.round(Math.pow(norm, 1.1) * 225);
        b = Math.round(norm * 255);
      } else if (palette === 'amber') {
        r = Math.round(norm * 255);
        g = Math.round(Math.pow(norm, 1.1) * 145);
        b = Math.round(Math.pow(norm, 2.6) * 20);
      } else {
        const val = Math.round(norm * 255);
        r = val; g = val; b = val;
      }

      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  // Overlay annotations
  ctx.strokeStyle = 'rgba(2, 132, 199, 0.4)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);

  // Port / Starboard Nadir Line
  ctx.beginPath();
  ctx.moveTo(centerCol, 0);
  ctx.lineTo(centerCol, h);
  ctx.stroke();
  ctx.setLineDash([]);

  // Labels
  ctx.font = '10px monospace';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText('◄ PORT CHANNEL', 20, 20);
  ctx.fillText('STARBOARD CHANNEL ►', w - 150, 20);
  ctx.fillText('NADIR (BOAT PATH)', centerCol - 50, h - 15);

  return canvas.toDataURL('image/png');
}
