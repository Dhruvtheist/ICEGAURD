import {
  GridCell,
  ShipTelemetry,
  PolarEnvironment,
  Iceberg,
  RouteOption,
  WaypointEscapeAnalysis,
  NavigationAlert,
  DecisionBrief,
  TimelineStep,
  PolarisRioBaseline,
  RioStatus
} from '../types/navigation';

export const INITIAL_POLARIS_RIO: PolarisRioBaseline = {
  vesselIceClass: "PC-6 (Polar Class 6)",
  rioScore: 4.2,
  predictedRioScore: -6.8,
  status: "ELEVATED_RISK",
  statusLabel: "Elevated Operational Risk",
  isSimulated: true,
  regulatoryStandard: "IMO POLARIS (MSC.1/Circ.1519)"
};

export const INITIAL_VESSEL: ShipTelemetry = {
  name: "MV POLARIS",
  callSign: "V2PF8",
  mmsi: "311000942",
  vesselType: "Polar Research / Ice-Reinforced Supply",
  iceClass: "PC-6 (Medium First-Year Ice)",
  length: 128.0,
  beam: 21.4,
  draft: 7.8,
  speedKnots: 12.4,
  headingDeg: 38.0,
  destination: "Rothera Research Station (Adelaide Island)",
  currentLat: -64.45,
  currentLon: -63.45,
  safetyBufferRadiusNm: 3.0,
  fuelRemainingPercent: 74.2,
  engineStatus: "NOMINAL - DUAL DIESEL-ELECTRIC",
  etaDestination: "28h 40m",
  polarisRio: INITIAL_POLARIS_RIO
};

export const INITIAL_ENVIRONMENT: PolarEnvironment = {
  seaIceConcentrationPercent: 58,
  ambientAirTempC: -8.4,
  seaSurfaceTempC: -1.6,
  windSpeedKnots: 32.0,
  windDirectionDeg: 210.0,
  windBeaufort: "7 (Near Gale)",
  oceanCurrentKnots: 0.72,
  oceanCurrentDeg: 45.0,
  significantWaveHeightM: 2.4,
  visibilityNm: 3.8,
  barometricPressureHpa: 984.2
};

export const INITIAL_ROUTES: RouteOption[] = [
  {
    id: "ROUTE_A",
    name: "ROUTE A — FAST",
    tag: "FAST",
    description: "Inner Channel Passage (Gerlache & Grandidier Channels)",
    travelTime: "28h 40m",
    travelTimeHours: 28.67,
    fuelPercent: 100.0,
    highRiskExposurePercent: 24.0,
    riskLevel: "HIGH",
    distanceNm: 355.4,
    averageIceConcentration: 64,
    cpaNearestIcebergNm: 0.38,
    active: true,
    minRioScore: -12.4,
    rioStatus: "OPERATION_SUBJECT_TO_CONSIDERATION",
    waypoints: [
      { id: "WP1", name: "Bransfield Entrance", lat: -63.85, lon: -62.40, escapeReliability: 98, returnTimeMin: 18, status: "SAFE", fuelToRetreat: 1.1, rioBaseline: 8.5 },
      { id: "WP2", name: "Gerlache North", lat: -64.20, lon: -63.10, escapeReliability: 94, returnTimeMin: 24, status: "SAFE", fuelToRetreat: 1.5, rioBaseline: 6.2 },
      { id: "WP3", name: "Anvers East", lat: -64.55, lon: -63.80, escapeReliability: 91, returnTimeMin: 28, status: "SAFE", fuelToRetreat: 1.8, rioBaseline: 4.8 },
      { id: "WP4", name: "Grandidier North", lat: -65.10, lon: -64.50, escapeReliability: 87, returnTimeMin: 31, status: "SAFE", fuelToRetreat: 2.2, rioBaseline: 1.4 },
      { id: "WP5", name: "Biscoe Strait", lat: -65.60, lon: -65.25, escapeReliability: 74, returnTimeMin: 39, status: "CAUTION", fuelToRetreat: 2.6, rioBaseline: -3.2 },
      { id: "WP6", name: "Adelaide North Throat", lat: -66.15, lon: -66.10, escapeReliability: 54, returnTimeMin: 48, status: "WARNING", isLastSafeTurnBack: true, fuelToRetreat: 3.2, rioBaseline: -6.8 },
      { id: "WP7", name: "Crystal Sound Pack Ice", lat: -66.75, lon: -67.15, escapeReliability: 28, returnTimeMin: 72, status: "DANGER", fuelToRetreat: 4.9, rioBaseline: -11.5 },
      { id: "WP8", name: "Marguerite Approach", lat: -67.45, lon: -68.15, escapeReliability: 12, returnTimeMin: 110, status: "NO RELIABLE RETREAT", fuelToRetreat: 7.4, rioBaseline: -12.4 }
    ]
  },
  {
    id: "ROUTE_B",
    name: "ROUTE B — BALANCED",
    tag: "BALANCED",
    description: "Outer Shelf Route (West of Biscoe Islands Archipelago)",
    travelTime: "31h 05m",
    travelTimeHours: 31.08,
    fuelPercent: 104.2,
    highRiskExposurePercent: 12.0,
    riskLevel: "MODERATE",
    distanceNm: 385.1,
    averageIceConcentration: 38,
    cpaNearestIcebergNm: 4.6,
    active: false,
    minRioScore: 1.8,
    rioStatus: "NORMAL_OPERATION",
    waypoints: [
      { id: "B-WP1", name: "Bransfield Entrance", lat: -63.85, lon: -62.40, escapeReliability: 98, returnTimeMin: 18, status: "SAFE", rioBaseline: 8.5 },
      { id: "B-WP2", name: "Smith Island West", lat: -63.95, lon: -63.50, escapeReliability: 96, returnTimeMin: 22, status: "SAFE", rioBaseline: 7.8 },
      { id: "B-WP3", name: "Anvers Western Shelf", lat: -64.40, lon: -64.70, escapeReliability: 92, returnTimeMin: 26, status: "SAFE", rioBaseline: 6.4 },
      { id: "B-WP4", name: "Renaud Offshore", lat: -65.20, lon: -66.30, escapeReliability: 89, returnTimeMin: 30, status: "SAFE", rioBaseline: 4.2 },
      { id: "B-WP5", name: "Lavoisier Seaward", lat: -66.00, lon: -67.80, escapeReliability: 84, returnTimeMin: 34, status: "SAFE", rioBaseline: 3.1 },
      { id: "B-WP6", name: "Adelaide Western Hook", lat: -66.90, lon: -69.20, escapeReliability: 78, returnTimeMin: 42, status: "SAFE", rioBaseline: 2.4 },
      { id: "B-WP7", name: "Marguerite Sound Entry", lat: -67.45, lon: -68.15, escapeReliability: 68, returnTimeMin: 52, status: "SAFE", rioBaseline: 1.8 }
    ]
  },
  {
    id: "ROUTE_C",
    name: "ROUTE C — SAFEST",
    tag: "SAFEST",
    description: "Deep Ocean Perimeter Detour (Bellingshausen Deep Margin)",
    travelTime: "34h 20m",
    travelTimeHours: 34.33,
    fuelPercent: 110.5,
    highRiskExposurePercent: 7.0,
    riskLevel: "LOW",
    distanceNm: 426.0,
    averageIceConcentration: 18,
    cpaNearestIcebergNm: 12.2,
    active: false,
    minRioScore: 8.5,
    rioStatus: "NORMAL_OPERATION",
    waypoints: [
      { id: "C-WP1", name: "Bransfield Entrance", lat: -63.85, lon: -62.40, escapeReliability: 98, returnTimeMin: 18, status: "SAFE", rioBaseline: 9.2 },
      { id: "C-WP2", name: "Boyd Strait Deep", lat: -63.60, lon: -64.50, escapeReliability: 97, returnTimeMin: 20, status: "SAFE", rioBaseline: 9.0 },
      { id: "C-WP3", name: "Bellingshausen North", lat: -64.20, lon: -66.20, escapeReliability: 96, returnTimeMin: 23, status: "SAFE", rioBaseline: 8.8 },
      { id: "C-WP4", name: "Bellingshausen Central", lat: -65.10, lon: -68.40, escapeReliability: 95, returnTimeMin: 27, status: "SAFE", rioBaseline: 8.7 },
      { id: "C-WP5", name: "Bellingshausen South", lat: -66.30, lon: -70.50, escapeReliability: 92, returnTimeMin: 32, status: "SAFE", rioBaseline: 8.6 },
      { id: "C-WP6", name: "Adelaide Deep Approach", lat: -67.20, lon: -70.80, escapeReliability: 86, returnTimeMin: 38, status: "SAFE", rioBaseline: 8.5 },
      { id: "C-WP7", name: "Marguerite Deep Channel", lat: -67.45, lon: -68.15, escapeReliability: 79, returnTimeMin: 46, status: "SAFE", rioBaseline: 8.5 }
    ]
  }
];

export const INITIAL_ICEBERGS: Iceberg[] = [
  {
    id: "ANT-042",
    classification: "Tabular Iceberg (Giant)",
    sizeMeters: { length: 420, width: 280, heightAboveWater: 36, draft: 180 },
    currentPosition: { lat: -65.85, lon: -65.65 },
    velocityMs: 0.42,
    velocityKnots: 0.82,
    directionDeg: 43.0,
    predictionConfidence: 91,
    riskLevel: "EXTREME",
    pastPositions: [
      { timeOffset: "-6h", lat: -65.98, lon: -65.85 },
      { timeOffset: "-3h", lat: -65.92, lon: -65.75 },
      { timeOffset: "-1h", lat: -65.87, lon: -65.68 }
    ],
    predictedTrajectory: [
      { timeOffset: "+1h", lat: -65.80, lon: -65.57, uncertaintyRadiusKm: 1.2 },
      { timeOffset: "+2h", lat: -65.74, lon: -65.48, uncertaintyRadiusKm: 2.5 },
      { timeOffset: "+3h", lat: -65.68, lon: -65.39, uncertaintyRadiusKm: 4.1 },
      { timeOffset: "+6h", lat: -65.50, lon: -65.12, uncertaintyRadiusKm: 7.8 },
      { timeOffset: "+12h", lat: -65.15, lon: -64.60, uncertaintyRadiusKm: 14.5 }
    ],
    shipInteraction: {
      intersectsRoute: true,
      intersectingRoute: "ROUTE_A",
      intersectionLat: -65.72,
      intersectionLon: -65.45,
      probabilityPercent: 76,
      timeToIntersection: "2h 17m",
      cpaDistanceNm: 0.38
    }
  },
  {
    id: "ANT-019",
    classification: "Tabular Iceberg",
    sizeMeters: { length: 290, width: 190, heightAboveWater: 28, draft: 140 },
    currentPosition: { lat: -66.42, lon: -64.90 },
    velocityMs: 0.28,
    velocityKnots: 0.54,
    directionDeg: 35.0,
    predictionConfidence: 88,
    riskLevel: "HIGH",
    pastPositions: [
      { timeOffset: "-3h", lat: -66.47, lon: -64.96 }
    ],
    predictedTrajectory: [
      { timeOffset: "+1h", lat: -66.38, lon: -64.84, uncertaintyRadiusKm: 0.9 },
      { timeOffset: "+3h", lat: -66.30, lon: -64.72, uncertaintyRadiusKm: 2.8 },
      { timeOffset: "+6h", lat: -66.18, lon: -64.55, uncertaintyRadiusKm: 5.4 }
    ],
    shipInteraction: {
      intersectsRoute: false,
      probabilityPercent: 18,
      timeToIntersection: "N/A",
      cpaDistanceNm: 8.4
    }
  },
  {
    id: "ANT-088",
    classification: "Pinnacle / Weathered Berg",
    sizeMeters: { length: 185, width: 120, heightAboveWater: 42, draft: 110 },
    currentPosition: { lat: -64.85, lon: -62.90 },
    velocityMs: 0.35,
    velocityKnots: 0.68,
    directionDeg: 50.0,
    predictionConfidence: 85,
    riskLevel: "MODERATE",
    pastPositions: [
      { timeOffset: "-3h", lat: -64.91, lon: -63.02 }
    ],
    predictedTrajectory: [
      { timeOffset: "+1h", lat: -64.81, lon: -62.82, uncertaintyRadiusKm: 1.1 },
      { timeOffset: "+3h", lat: -64.73, lon: -62.66, uncertaintyRadiusKm: 3.2 },
      { timeOffset: "+6h", lat: -64.61, lon: -62.42, uncertaintyRadiusKm: 6.0 }
    ],
    shipInteraction: {
      intersectsRoute: false,
      probabilityPercent: 9,
      timeToIntersection: "N/A",
      cpaDistanceNm: 14.1
    }
  },
  {
    id: "ANT-003",
    classification: "Growler / Bergy Bit Cluster",
    sizeMeters: { length: 80, width: 45, heightAboveWater: 9, draft: 40 },
    currentPosition: { lat: -65.25, lon: -66.45 },
    velocityMs: 0.48,
    velocityKnots: 0.93,
    directionDeg: 60.0,
    predictionConfidence: 79,
    riskLevel: "MODERATE",
    pastPositions: [
      { timeOffset: "-3h", lat: -65.32, lon: -66.62 }
    ],
    predictedTrajectory: [
      { timeOffset: "+1h", lat: -65.20, lon: -66.33, uncertaintyRadiusKm: 1.6 },
      { timeOffset: "+3h", lat: -65.10, lon: -66.10, uncertaintyRadiusKm: 4.5 },
      { timeOffset: "+6h", lat: -64.95, lon: -65.75, uncertaintyRadiusKm: 8.5 }
    ],
    shipInteraction: {
      intersectsRoute: false,
      probabilityPercent: 24,
      timeToIntersection: "N/A",
      cpaDistanceNm: 6.2
    }
  },
  {
    id: "ANT-071",
    classification: "Tabular Fragment",
    sizeMeters: { length: 160, width: 95, heightAboveWater: 18, draft: 85 },
    currentPosition: { lat: -67.10, lon: -67.50 },
    velocityMs: 0.19,
    velocityKnots: 0.37,
    directionDeg: 25.0,
    predictionConfidence: 93,
    riskLevel: "HIGH",
    pastPositions: [
      { timeOffset: "-3h", lat: -67.14, lon: -67.55 }
    ],
    predictedTrajectory: [
      { timeOffset: "+1h", lat: -67.07, lon: -67.46, uncertaintyRadiusKm: 0.8 },
      { timeOffset: "+3h", lat: -67.01, lon: -67.38, uncertaintyRadiusKm: 2.1 },
      { timeOffset: "+6h", lat: -66.92, lon: -67.26, uncertaintyRadiusKm: 4.2 }
    ],
    shipInteraction: {
      intersectsRoute: true,
      intersectingRoute: "ROUTE_A",
      probabilityPercent: 52,
      timeToIntersection: "7h 12m",
      cpaDistanceNm: 1.1
    }
  }
];

export const INITIAL_ALERTS: NavigationAlert[] = [
  {
    id: "ALT-001",
    timestamp: "10:41:02 UTC",
    priority: "CRITICAL",
    title: "ICEBERG INTERSECTION PREDICTED",
    message: "Iceberg ANT-042 (drift 0.42 m/s @ 043°) predicted to intersect Route A in 2h 17m (76% probability). Closest approach 0.38 NM.",
    coordinates: { lat: -65.72, lon: -65.45 },
    acknowledged: false
  },
  {
    id: "ALT-002",
    timestamp: "10:38:15 UTC",
    priority: "WARNING",
    title: "POLARIS/RIO LIMIT EXCEEDED ON ROUTE A",
    message: "Simulated RIO baseline around Waypoint 6 reaches -6.8 (Elevated Risk) and drops to -12.4 at WP7. Polar Class PC-6 normal limit exceeded.",
    coordinates: { lat: -66.15, lon: -66.10 },
    acknowledged: false
  },
  {
    id: "ALT-003",
    timestamp: "10:35:40 UTC",
    priority: "ADVISORY",
    title: "LAST SAFE TURN-BACK POINT APPROACHING",
    message: "MV POLARIS is 24.3 NM from Waypoint 6 (Last Safe Turn-back). Escape corridor reliability beyond WP6 decreases to 28% and 12%.",
    coordinates: { lat: -66.15, lon: -66.10 },
    acknowledged: true
  }
];

// Time offset in hours helper
export function getTimeOffsetHours(step: TimelineStep): number {
  switch (step) {
    case 'NOW': return 0.0;
    case '+1H': return 1.0;
    case '+2H': return 2.0;
    case '+3H': return 3.0;
    case '+6H': return 6.0;
    case '+12H': return 12.0;
    default: return 0.0;
  }
}

// Helper to calculate simulated POLARIS RIO for a given ice concentration (PC-6 vessel baseline)
export function calculateSimulatedRio(iceConcentration: number): { score: number; status: RioStatus; label: string } {
  // IMO POLARIS calculation approximation for PC-6 Ice Class:
  // Open water (+3) down to thick first-year ice (-1) and multi-year floes (-3)
  // Higher concentration = lower (more negative) RIO
  const concTenths = iceConcentration / 10.0;
  // Baseline formula for PC-6:
  const rawRio = 10.0 - (concTenths * 2.2);
  const score = Number(rawRio.toFixed(1));

  let status: RioStatus = 'NORMAL_OPERATION';
  let label = 'Normal Operation (RIO ≥ 0)';

  if (score < -10) {
    status = 'OPERATION_SUBJECT_TO_CONSIDERATION';
    label = 'Subject to Special Consideration (RIO < -10)';
  } else if (score < 0) {
    status = 'ELEVATED_RISK';
    label = 'Elevated Operational Risk (-10 ≤ RIO < 0)';
  }

  return { score, status, label };
}

// Generate spatial grid cells with time-aware dynamic risk + POLARIS/RIO baseline
export function generateGridCells(timeOffsetHours: number): GridCell[] {
  const cells: GridCell[] = [];
  const latSteps = 16;
  const lonSteps = 16;
  const minLat = -67.8;
  const maxLat = -63.4;
  const minLon = -70.5;
  const maxLon = -62.0;

  const driftLatShift = timeOffsetHours * 0.04;
  const driftLonShift = timeOffsetHours * 0.06;

  let cellIndex = 100;
  for (let i = 0; i < latSteps; i++) {
    const lat = minLat + (i / (latSteps - 1)) * (maxLat - minLat);
    for (let j = 0; j < lonSteps; j++) {
      const lon = minLon + (j / (lonSteps - 1)) * (maxLon - minLon);
      cellIndex++;
      const cellId = `A-${cellIndex}`;

      const southFactor = (-lat - 63.4) / 4.4;
      const eastFactor = (lon - (-70.5)) / 8.5;

      const iceConc = Math.min(98, Math.max(5, Math.round(
        (southFactor * 62 + eastFactor * 34) + Math.sin(i * 0.8 + j * 0.6) * 12
      )));

      // 1. POLARIS/RIO Baseline for PC-6 Ice Capability + Sea-ice
      const rioResult = calculateSimulatedRio(iceConc);

      // 2. Kinetic additions (Iceberg proximity + drift + weather)
      const ant42Lat = -65.85 + driftLatShift;
      const ant42Lon = -65.65 + driftLonShift;
      const distToAnt42Km = Math.sqrt(Math.pow((lat - ant42Lat) * 111, 2) + Math.pow((lon - ant42Lon) * 50, 2));

      const baseRisk = (iceConc * 0.55) + (distToAnt42Km < 35 ? 35 : (distToAnt42Km < 70 ? 15 : 0));
      const currentRisk = Math.min(99, Math.max(4, Math.round(baseRisk)));

      const futureDriftMultiplier = 1.0 + (lat < -65.2 && lon > -66.8 ? timeOffsetHours * 0.08 : timeOffsetHours * 0.02);
      const predictedRisk = Math.min(99, Math.max(4, Math.round(baseRisk * futureDriftMultiplier + (distToAnt42Km < 40 ? 10 : 0))));

      const intersectionProb = distToAnt42Km < 55
        ? Math.max(0, Math.min(95, Math.round(92 - distToAnt42Km * 1.6)))
        : Math.max(0, Math.round(15 - distToAnt42Km * 0.1));

      const confidence = Math.min(98, Math.max(62, Math.round(95 - (timeOffsetHours * 2.1) + Math.cos(i) * 3)));
      const horizonMins = Math.round(timeOffsetHours * 60 + 18);
      const horizonStr = `${Math.floor(horizonMins / 60)}h ${(horizonMins % 60).toString().padStart(2, '0')}m`;

      const scoreToEvaluate = timeOffsetHours > 0 ? predictedRisk : currentRisk;
      let riskLevel: 'SAFE' | 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME' = 'SAFE';
      if (scoreToEvaluate <= 20) riskLevel = 'SAFE';
      else if (scoreToEvaluate <= 40) riskLevel = 'LOW';
      else if (scoreToEvaluate <= 60) riskLevel = 'MODERATE';
      else if (scoreToEvaluate <= 80) riskLevel = 'HIGH';
      else riskLevel = 'EXTREME';

      cells.push({
        cellId,
        lat: Number(lat.toFixed(3)),
        lon: Number(lon.toFixed(3)),
        currentRisk,
        predictedRisk,
        confidence,
        iceConcentration: iceConc,
        nearestIceberg: distToAnt42Km < 80 ? "ANT-042" : (lat < -66.2 ? "ANT-019" : "ANT-088"),
        nearestIcebergDistanceKm: Number(distToAnt42Km.toFixed(1)),
        icebergIntersectionProbability: intersectionProb,
        predictionHorizon: horizonStr,
        riskLevel,
        rioBaseline: rioResult.score,
        rioStatus: rioResult.status,
        rioStatusLabel: rioResult.label
      });
    }
  }

  return cells;
}

// Escape corridor Monte Carlo analysis for a specific waypoint
export function getWaypointEscapeAnalysis(waypointId: string): WaypointEscapeAnalysis {
  const reliabilityMap: Record<string, number> = {
    "WP1": 98, "WP2": 94, "WP3": 91, "WP4": 87,
    "WP5": 74, "WP6": 54, "WP7": 28, "WP8": 12,
    "B-WP1": 98, "B-WP2": 96, "B-WP3": 92, "B-WP4": 89, "B-WP5": 84, "B-WP6": 78, "B-WP7": 68,
    "C-WP1": 98, "C-WP2": 97, "C-WP3": 96, "C-WP4": 95, "C-WP5": 92, "C-WP6": 86, "C-WP7": 79
  };

  const rel = reliabilityMap[waypointId] ?? 65;

  const scenarios = [
    { id: 1, name: "Direct Western Breakout (Drake Escape)", pass: true, probability: 94, fuelCostPercent: 2.8, timeMinutes: 38, bottleneck: "Clear seaward water" },
    { id: 2, name: "North-West Channel Reverse", pass: true, probability: 88, fuelCostPercent: 3.1, timeMinutes: 42, bottleneck: "Light pack ice 25%" },
    { id: 3, name: "Leeward Island Shelter Run", pass: rel >= 50, probability: 72, fuelCostPercent: 3.5, timeMinutes: 46, bottleneck: "Growler drift field" },
    { id: 4, name: "Shelf Margin Sprint", pass: rel > 60, probability: 41, fuelCostPercent: 4.2, timeMinutes: 55, bottleneck: "Blocked by drifting floe tongue" },
    { id: 5, name: "Adelaide Northern Slalom", pass: rel >= 70, probability: rel, fuelCostPercent: 3.9, timeMinutes: 49, bottleneck: "Dynamic convergence zone" }
  ];

  const passCount = scenarios.filter(s => s.pass).length;

  return {
    waypointId,
    escapeReliabilityPercent: rel,
    status: rel >= 85 ? "SAFE" : (rel >= 50 ? "WARNING" : "NO RELIABLE RETREAT"),
    returnTimeBudgetMin: rel > 50 ? 45 : 95,
    fuelBudgetPercent: rel > 50 ? 3.2 : 6.8,
    distanceToOpenWaterKm: rel > 50 ? 14.8 : 42.5,
    simulatedScenarios: scenarios,
    monteCarloSummary: `${passCount}/5 PASS (${Math.round((passCount / 5) * 100)}% feasible passages)`,
    lastSafeTurnBackPointNotice: waypointId === "WP6"
  };
}

// AI Decision Brief generator
export function getDecisionBrief(routeId: string): DecisionBrief {
  if (routeId === "ROUTE_B") {
    return {
      selectedRoute: "ROUTE_B",
      riskLevel: "MODERATE",
      highRiskExposure: "12%",
      headline: "Route B Diversion Active — Pack Ice Danger Neutralized",
      body: "Route B adds approximately 2h 25m compared with Route A (+4.2% fuel), but reduces high-risk exposure from 24% to 12%. The vessel avoids the predicted drift zone of Iceberg ANT-042 with a Closest Point of Approach (CPA) of 4.6 NM. Escape corridors remain above 78% reliability throughout transit.",
      lastSafeTurnBackNotice: "Not applicable — open seaward flank available across all outer waypoints.",
      recommendedAction: "Maintain Route B heading 042° at 11.8 knots. Maintain watch for western swell.",
      polarisRioSummary: "Simulated RIO baseline maintains +1.8 to +7.8 (Normal Operation under IMO POLARIS PC-6 limits)."
    };
  } else if (routeId === "ROUTE_C") {
    return {
      selectedRoute: "ROUTE_C",
      riskLevel: "LOW",
      highRiskExposure: "7%",
      headline: "Route C Deep Ocean Perimeter — Maximum Safety Margin",
      body: "Route C provides maximum standoff distance from pack ice tongues and iceberg fields, with high-risk exposure minimized to 7%. Travel time increases by 5h 40m (+10.5% fuel). Safe retreat corridors to open Southern Ocean remain 86-98% reliable at all times.",
      lastSafeTurnBackNotice: "Open ocean retreat available at all waypoints.",
      recommendedAction: "Recommended in severe storm or heavy multi-year ice conditions. Higher fuel expenditure required.",
      polarisRioSummary: "Simulated RIO baseline remains above +8.5 across all waypoints (Unrestricted Open Water Operation)."
    };
  } else {
    return {
      selectedRoute: "ROUTE_A",
      riskLevel: "HIGH",
      highRiskExposure: "24%",
      headline: "CRITICAL RISK: Iceberg Collision Threat & Rapidly Narrowing Retreat Corridor",
      body: "Route B adds approximately 2h 25m compared with Route A but reduces high-risk exposure from 24% to 12%. The predicted ice-risk field is expanding eastward into Grandidier and Adelaide Sound. Iceberg ANT-042 has a 76% predicted probability of interacting with Route A within 2h 17m at Waypoint 6. Last reliable turn-back point: Waypoint 6 (Reliability: 54%).",
      lastSafeTurnBackNotice: "LAST SAFE TURN-BACK: Waypoint 6. Beyond WP6, retreat reliability collapses to 28% and 12%.",
      recommendedAction: "Review and authorize diversion to Route B before reaching Waypoint 6.",
      polarisRioSummary: "Simulated RIO drops to -6.8 at WP6 (Elevated Risk) and collapses to -12.4 at WP7 (Exceeds normal PC-6 IMO limits)."
    };
  }
}
