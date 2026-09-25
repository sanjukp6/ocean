export type RiskLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface BoundingBox {
  ymin: number;
  xmin: number;
  ymax: number;
  xmax: number;
}

export interface SonarHazard {
  id: string;
  targetType: string;
  category: 'ghost_net' | 'derelict_trap' | 'rope_rigging' | 'plastic_debris' | 'shipwreck_snag';
  confidence: number;
  estimatedHeightM: number;
  shadowLengthM: number;
  waterDepthM: number;
  altitudeM: number;
  latitude: number;
  longitude: number;
  riskLevel: RiskLevel;
  shadowVerified: boolean;
  acousticSignature: string;
  detectedAt: string;
  boundingBox: BoundingBox;
  swathChannel: 'port' | 'starboard';
  slantRangeM: number;
  groundRangeM: number;
  imageUrl?: string;
  recommendation: string;
}

export interface SurveyTransect {
  id: string;
  name: string;
  locationName: string;
  centerLat: number;
  centerLng: number;
  zoom: number;
  vesselHeadingDeg: number;
  vesselSpeedKnots: number;
  swathWidthM: number;
  frequencyKhz: number;
  waterDepthAvgM: number;
  trackline: [number, number][]; // [lat, lng] points
  hazards: SonarHazard[];
  sampleImage: string;
  description: string;
}

export interface PipelineSettings {
  tvgEnabled: boolean;
  slantRangeEnabled: boolean;
  denoisingEnabled: boolean;
  shadowPhysicsCheck: boolean;
  confidenceThreshold: number; // 0 - 100
  colorPalette: 'bronze' | 'ocean' | 'grayscale' | 'amber';
}

export type PipelineStage = 'idle' | 'reading' | 'preprocessing' | 'ai_vision' | 'geocoding' | 'completed';

export type ActivePage = 'map' | 'waterfall' | 'pipeline' | 'anomalies' | 'research';

export interface SonarAnalysisResult {
  debris_found: boolean;
  category: string;
  confidence: number;
  shadow_verified: boolean;
  estimated_height_m: number;
  shadow_length_m?: number;
  entanglement_risk: RiskLevel;
  acoustic_signature: string;
  bounding_box: [number, number, number, number];
  recommendation: string;
}
