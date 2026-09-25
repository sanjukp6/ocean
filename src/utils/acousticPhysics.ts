/**
 * Side Scan Sonar Acoustic Physics & Slant-Range Correction Utility
 * References:
 * - PINGMapper (Bodine, 2021)
 * - SideScanSonarEditor (XTF Slant Range & Bottom Track)
 * - AI4Shipwrecks Benchmark (UM Field Robotics)
 */

/**
 * Calculates target height off seabed from acoustic shadow geometry
 * Formula: H_t = (L_s * H_a) / (R_s + L_s)
 * @param shadowLengthM Length of downstream acoustic shadow (meters)
 * @param altitudeM Sensor altitude above seabed (meters)
 * @param slantRangeM Slant range distance to target apex (meters)
 */
export function calculateTargetHeight(
  shadowLengthM: number,
  altitudeM: number,
  slantRangeM: number
): number {
  if (slantRangeM + shadowLengthM <= 0) return 0;
  const height = (shadowLengthM * altitudeM) / (slantRangeM + shadowLengthM);
  return Number(Math.max(0, height).toFixed(2));
}

/**
 * Calculates true horizontal ground range from slant range and altitude
 * Pythagoras theorem on water column: R_g = sqrt(R_s^2 - H_a^2)
 */
export function calculateGroundRange(slantRangeM: number, altitudeM: number): number {
  if (slantRangeM <= altitudeM) return 0;
  const groundRange = Math.sqrt(Math.pow(slantRangeM, 2) - Math.pow(altitudeM, 2));
  return Number(groundRange.toFixed(2));
}

/**
 * Calculates acoustic grazing angle in degrees
 * theta = arcsin(H_a / R_s)
 */
export function calculateGrazingAngle(slantRangeM: number, altitudeM: number): number {
  if (slantRangeM <= 0) return 0;
  const ratio = Math.min(1, Math.max(0, altitudeM / slantRangeM));
  const rad = Math.asin(ratio);
  return Number(((rad * 180) / Math.PI).toFixed(1));
}

/**
 * Calculates the Entanglement Risk Index (ERI)
 * Score from 0 to 100 based on:
 * - Target height off seabed (higher = greater water column hazard for turtles, cetaceans, divers, propellers)
 * - AI confidence score
 * - Category intrinsic entanglement factor (ghost nets > traps > rigid metal)
 * - Proximity to coral/benthic nursery (depth < 30m)
 */
export function computeEntanglementRiskIndex(params: {
  category: string;
  heightM: number;
  confidence: number;
  waterDepthM: number;
  shadowVerified: boolean;
}): { score: number; level: 'HIGH' | 'MEDIUM' | 'LOW'; description: string } {
  let categoryWeight = 0.5;
  const lowerCat = params.category.toLowerCase();
  if (lowerCat.includes('net') || lowerCat.includes('mesh') || lowerCat.includes('gillnet')) {
    categoryWeight = 0.95;
  } else if (lowerCat.includes('trap') || lowerCat.includes('pot') || lowerCat.includes('rope')) {
    categoryWeight = 0.7;
  } else if (lowerCat.includes('debris') || lowerCat.includes('rigging')) {
    categoryWeight = 0.55;
  }

  // Height factor (0.5m = 20pts, 2.0m+ = 40pts)
  const heightFactor = Math.min(40, (params.heightM / 2.5) * 40);

  // Confidence & Verification factor (0 - 30pts)
  const confFactor = params.confidence * 25 + (params.shadowVerified ? 5 : 0);

  // Depth danger factor (shallow coral waters have highest bio-density)
  const shallowFactor = params.waterDepthM < 25 ? 15 : params.waterDepthM < 40 ? 10 : 5;

  const rawScore = (categoryWeight * 20) + heightFactor + confFactor + shallowFactor;
  const score = Math.min(99, Math.max(15, Math.round(rawScore)));

  let level: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  let description = 'Low entanglement footprint; benthic bottom hugging profile.';

  if (score >= 70) {
    level = 'HIGH';
    description = 'Critical ghost gear threat! Open suspended mesh profile liable to trap megafauna and damage vessel propellers.';
  } else if (score >= 45) {
    level = 'MEDIUM';
    description = 'Submerged obstruction hazard with moderate vertical acoustic profile; scheduled recovery advised.';
  }

  return { score, level, description };
}
