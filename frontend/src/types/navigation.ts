export type RiskLevel = 'SAFE' | 'LOW' | 'MODERATE' | 'HIGH' | 'EXTREME';

export type RioStatus = 'NORMAL_OPERATION' | 'ELEVATED_RISK' | 'OPERATION_SUBJECT_TO_CONSIDERATION';

export interface PolarisRioBaseline {
  vesselIceClass: string; // e.g. "PC-6"
  rioScore: number; // e.g. +4.2 or -6.8
  predictedRioScore?: number;
  status: RioStatus;
  statusLabel: string;
  isSimulated: boolean;
  regulatoryStandard: string;
}

export interface GridCell {
  cellId: string;
  lat: number;
  lon: number;
  currentRisk: number;
  predictedRisk: number;
  confidence: number;
  iceConcentration: number;
  nearestIceberg: string;
  nearestIcebergDistanceKm: number;
  icebergIntersectionProbability: number;
  predictionHorizon: string;
  riskLevel: RiskLevel;
  // POLARIS / RIO baseline integration
  rioBaseline: number;
  rioStatus: RioStatus;
  rioStatusLabel: string;
}

export interface ShipTelemetry {
  name: string;
  callSign: string;
  mmsi: string;
  vesselType: string;
  iceClass: string;
  length: number;
  beam: number;
  draft: number;
  speedKnots: number;
  headingDeg: number;
  destination: string;
  currentLat: number;
  currentLon: number;
  safetyBufferRadiusNm: number;
  fuelRemainingPercent: number;
  engineStatus: string;
  etaDestination?: string;
  polarisRio: PolarisRioBaseline;
}

export interface PolarEnvironment {
  seaIceConcentrationPercent: number;
  ambientAirTempC: number;
  seaSurfaceTempC: number;
  windSpeedKnots: number;
  windDirectionDeg: number;
  windBeaufort: string;
  oceanCurrentKnots: number;
  oceanCurrentDeg: number;
  significantWaveHeightM: number;
  visibilityNm: number;
  barometricPressureHpa: number;
}

export interface IcebergTrajectoryNode {
  timeOffset: string;
  lat: number;
  lon: number;
  uncertaintyRadiusKm?: number;
}

export interface ShipInteraction {
  intersectsRoute: boolean;
  intersectingRoute?: string;
  intersectionLat?: number;
  intersectionLon?: number;
  probabilityPercent: number;
  timeToIntersection: string;
  cpaDistanceNm: number;
}

export interface Iceberg {
  id: string;
  classification: string;
  sizeMeters: {
    length: number;
    width: number;
    heightAboveWater: number;
    draft: number;
  };
  currentPosition: {
    lat: number;
    lon: number;
  };
  velocityMs: number;
  velocityKnots: number;
  directionDeg: number;
  predictionConfidence: number;
  riskLevel: RiskLevel;
  pastPositions: IcebergTrajectoryNode[];
  predictedTrajectory: IcebergTrajectoryNode[];
  shipInteraction: ShipInteraction;
}

export interface Waypoint {
  id: string;
  name: string;
  lat: number;
  lon: number;
  escapeReliability: number;
  returnTimeMin: number;
  status: 'SAFE' | 'CAUTION' | 'WARNING' | 'DANGER' | 'NO RELIABLE RETREAT';
  isLastSafeTurnBack?: boolean;
  fuelToRetreat?: number;
  rioBaseline?: number;
}

export interface RouteOption {
  id: string;
  name: string;
  tag: 'FAST' | 'BALANCED' | 'SAFEST';
  description: string;
  travelTime: string;
  travelTimeHours: number;
  fuelPercent: number;
  highRiskExposurePercent: number;
  riskLevel: RiskLevel;
  distanceNm: number;
  averageIceConcentration: number;
  cpaNearestIcebergNm: number;
  active: boolean;
  waypoints: Waypoint[];
  minRioScore: number;
  rioStatus: RioStatus;
}

export interface EscapeCorridorScenario {
  id: number;
  name: string;
  pass: boolean;
  probability: number;
  fuelCostPercent: number;
  timeMinutes: number;
  bottleneck: string;
}

export interface WaypointEscapeAnalysis {
  waypointId: string;
  escapeReliabilityPercent: number;
  status: string;
  returnTimeBudgetMin: number;
  fuelBudgetPercent: number;
  distanceToOpenWaterKm: number;
  simulatedScenarios: EscapeCorridorScenario[];
  monteCarloSummary: string;
  lastSafeTurnBackPointNotice: boolean;
}

export interface NavigationAlert {
  id: string;
  timestamp: string;
  priority: 'CRITICAL' | 'WARNING' | 'ADVISORY';
  title: string;
  message: string;
  coordinates?: { lat: number; lon: number };
  acknowledged: boolean;
}

export interface DecisionBrief {
  selectedRoute: string;
  riskLevel: string;
  highRiskExposure: string;
  headline: string;
  body: string;
  lastSafeTurnBackNotice: string;
  recommendedAction: string;
  polarisRioSummary: string;
}

export type TimelineStep = 'NOW' | '+1H' | '+2H' | '+3H' | '+6H' | '+12H';
