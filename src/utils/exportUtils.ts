import { SonarHazard, SurveyTransect } from '../types/sonar';

/**
 * Downloads a file to the user's browser
 */
export function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export hazards and transects as standard GeoJSON
 */
export function exportGeoJSON(hazards: SonarHazard[], transect: SurveyTransect) {
  const features = [
    // Survey Trackline
    {
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: transect.trackline.map(([lat, lng]) => [lng, lat]),
      },
      properties: {
        type: 'AUV_Survey_Trackline',
        transect_id: transect.id,
        name: transect.name,
        frequency_khz: transect.frequencyKhz,
        swath_width_m: transect.swathWidthM,
        vessel_speed_knots: transect.vesselSpeedKnots,
        survey_location: transect.locationName,
      },
    },
    // Sonar Hazard Points
    ...hazards.map((h) => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [h.longitude, h.latitude],
      },
      properties: {
        id: h.id,
        target_type: h.targetType,
        category: h.category,
        confidence: h.confidence,
        estimated_height_m: h.estimatedHeightM,
        shadow_length_m: h.shadowLengthM,
        water_depth_m: h.waterDepthM,
        sensor_altitude_m: h.altitudeM,
        entanglement_risk: h.riskLevel,
        shadow_verified: h.shadowVerified,
        acoustic_signature: h.acousticSignature,
        swath_channel: h.swathChannel,
        slant_range_m: h.slantRangeM,
        ground_range_m: h.groundRangeM,
        recommendation: h.recommendation,
        detected_at: h.detectedAt,
      },
    })),
  ];

  const geojson = {
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
    },
    features,
  };

  downloadFile(
    `aeroacoustic_debrisnet_${transect.id}_${Date.now()}.geojson`,
    JSON.stringify(geojson, null, 2),
    'application/geo+json'
  );
}

/**
 * Export hazards in COCO JSON format for machine learning training & benchmarks
 * Compatible with SideScanSonarEditor & Detectron2 / YOLOv8 formats
 */
export function exportCOCOJSON(hazards: SonarHazard[], transect: SurveyTransect) {
  const categories = [
    { id: 1, name: 'ghost_net', supercategory: 'marine_debris' },
    { id: 2, name: 'derelict_trap', supercategory: 'marine_debris' },
    { id: 3, name: 'rope_rigging', supercategory: 'marine_debris' },
    { id: 4, name: 'plastic_debris', supercategory: 'marine_debris' },
    { id: 5, name: 'shipwreck_snag', supercategory: 'maritime_hazard' },
  ];

  const catMap: Record<string, number> = {
    ghost_net: 1,
    derelict_trap: 2,
    rope_rigging: 3,
    plastic_debris: 4,
    shipwreck_snag: 5,
  };

  const images = [
    {
      id: 1,
      file_name: `${transect.id}_waterfall_composite.png`,
      width: 1024,
      height: 2048,
      license: 1,
      sensor: 'EdgeTech 4125 Dual-Freq SSS',
      swath_width_m: transect.swathWidthM,
      altitude_m: hazards[0]?.altitudeM || 5.0,
      center_lat: transect.centerLat,
      center_lng: transect.centerLng,
    },
  ];

  const annotations = hazards.map((h, idx) => {
    const width = Math.abs(h.boundingBox.xmax - h.boundingBox.xmin);
    const height = Math.abs(h.boundingBox.ymax - h.boundingBox.ymin);
    const x = h.boundingBox.xmin;
    const y = h.boundingBox.ymin;
    const area = width * height;

    return {
      id: idx + 1,
      image_id: 1,
      category_id: catMap[h.category] || 1,
      bbox: [x, y, width, height],
      area,
      segmentation: [
        [
          x, y,
          x + width, y,
          x + width, y + height,
          x, y + height,
        ],
      ],
      iscrowd: 0,
      confidence: h.confidence,
      attributes: {
        shadow_verified: h.shadowVerified,
        estimated_height_m: h.estimatedHeightM,
        shadow_length_m: h.shadowLengthM,
        risk_level: h.riskLevel,
        acoustic_signature: h.acousticSignature,
        latitude: h.latitude,
        longitude: h.longitude,
      },
    };
  });

  const cocoData = {
    info: {
      description: 'AeroAcoustic-DebrisNet Side-Scan Sonar Marine Debris Dataset',
      version: '1.0',
      year: 2026,
      contributor: 'Koh Tao Marine Survey & AI4Shipwrecks Initiative',
      date_created: new Date().toISOString(),
    },
    licenses: [{ id: 1, name: 'Creative Commons Attribution 4.0 International' }],
    images,
    annotations,
    categories,
  };

  downloadFile(
    `aeroacoustic_coco_annotations_${transect.id}_${Date.now()}.json`,
    JSON.stringify(cocoData, null, 2),
    'application/json'
  );
}

/**
 * Export KML for Google Earth & Hydrographic Navigators
 */
export function exportKML(hazards: SonarHazard[], transect: SurveyTransect) {
  const placemarks = hazards
    .map(
      (h) => `
    <Placemark>
      <name>${h.targetType} [${h.riskLevel} RISK]</name>
      <description><![CDATA[
        <b>Category:</b> ${h.targetType}<br/>
        <b>Confidence:</b> ${(h.confidence * 100).toFixed(1)}%<br/>
        <b>Estimated Height:</b> ${h.estimatedHeightM}m<br/>
        <b>Shadow Length:</b> ${h.shadowLengthM}m<br/>
        <b>Acoustic Shadow Verified:</b> ${h.shadowVerified ? 'YES' : 'NO'}<br/>
        <b>Water Depth:</b> ${h.waterDepthM}m<br/>
        <b>Acoustic Signature:</b> ${h.acousticSignature}<br/>
        <b>Recommendation:</b> ${h.recommendation}
      ]]></description>
      <Point>
        <coordinates>${h.longitude},${h.latitude},-${h.waterDepthM}</coordinates>
      </Point>
    </Placemark>`
    )
    .join('\n');

  const trackCoordinates = transect.trackline
    .map(([lat, lng]) => `${lng},${lat},0`)
    .join(' ');

  const kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>AeroAcoustic-DebrisNet - ${transect.name}</name>
    <description>Side Scan Sonar Geotagged Hazard Report</description>
    <Folder>
      <name>Survey Trackline</name>
      <Placemark>
        <name>${transect.name} Trackline</name>
        <LineString>
          <tessellate>1</tessellate>
          <coordinates>${trackCoordinates}</coordinates>
        </LineString>
      </Placemark>
    </Folder>
    <Folder>
      <name>Detected Marine Debris & Ghost Nets</name>
      ${placemarks}
    </Folder>
  </Document>
</kml>`;

  downloadFile(
    `aeroacoustic_hazards_${transect.id}.kml`,
    kml,
    'application/vnd.google-earth.kml+xml'
  );
}

/**
 * Export CSV Summary table
 */
export function exportCSV(hazards: SonarHazard[]) {
  const headers = [
    'ID',
    'Target_Type',
    'Category',
    'Confidence_Percent',
    'Estimated_Height_m',
    'Shadow_Length_m',
    'Latitude_WGS84',
    'Longitude_WGS84',
    'Entanglement_Risk',
    'Shadow_Verified',
    'Water_Depth_m',
    'Sensor_Altitude_m',
    'Swath_Channel',
    'Slant_Range_m',
    'Ground_Range_m',
    'Acoustic_Signature',
    'Recommendation',
    'Detection_Timestamp',
  ];

  const rows = hazards.map((h) => [
    `"${h.id}"`,
    `"${h.targetType}"`,
    `"${h.category}"`,
    (h.confidence * 100).toFixed(1),
    h.estimatedHeightM.toFixed(2),
    h.shadowLengthM.toFixed(2),
    h.latitude.toFixed(6),
    h.longitude.toFixed(6),
    `"${h.riskLevel}"`,
    h.shadowVerified ? 'TRUE' : 'FALSE',
    h.waterDepthM.toFixed(1),
    h.altitudeM.toFixed(1),
    `"${h.swathChannel}"`,
    h.slantRangeM.toFixed(1),
    h.groundRangeM.toFixed(1),
    `"${h.acousticSignature.replace(/"/g, '""')}"`,
    `"${h.recommendation.replace(/"/g, '""')}"`,
    `"${h.detectedAt}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

  downloadFile(`aeroacoustic_sonar_anomalies_${Date.now()}.csv`, csvContent, 'text/csv;charset=utf-8;');
}

/**
 * Export ESRI Shapefile Package Representation (WGS84 .PRJ, GeoJSON & Metadata Spec)
 */
export function exportShapefilePackage(hazards: SonarHazard[], transect: SurveyTransect) {
  // WGS84 Spatial Reference Well-Known Text (ESRI standard .prj)
  const prjWGS84 = `GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137.0,298.257223563]],PRIMEM["Greenwich",0.0],UNIT["Degree",0.0174532925199433]]`;

  // Download PRJ and GeoJSON
  downloadFile(`${transect.id}_debrisnet.prj`, prjWGS84, 'text/plain');
  exportGeoJSON(hazards, transect);
}
