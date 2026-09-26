import asyncio
import math
import random
import time
from typing import Dict, List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="polarEye AI Navigation Backend",
    description="Operational Antarctic Ice Risk Intelligence & Telemetry API with IMO POLARIS Integration",
    version="1.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Coordinates reference: Antarctic Peninsula navigation corridor
# Origin: South Shetland / Bransfield Strait -> Marguerite Bay / Rothera

POLARIS_RIO_DATA = {
    "vesselIceClass": "PC-6 (Polar Class 6)",
    "rioScore": 4.2,
    "predictedRioScore": -6.8,
    "status": "ELEVATED_RISK",
    "statusLabel": "Elevated Operational Risk",
    "isSimulated": True,
    "regulatoryStandard": "IMO POLARIS (MSC.1/Circ.1519)"
}

VESSEL_DATA = {
    "name": "MV POLARIS",
    "callSign": "V2PF8",
    "mmsi": "311000942",
    "vesselType": "Polar Research / Ice-Reinforced Supply",
    "iceClass": "PC-6 (Polar Class 6 - Summer/Autumn in medium first-year ice)",
    "length": 128.0,
    "beam": 21.4,
    "draft": 7.8,
    "speedKnots": 12.4,
    "headingDeg": 38.0,
    "destination": "Rothera Research Station (Adelaide Island)",
    "currentLat": -64.45,
    "currentLon": -63.45,
    "safetyBufferRadiusNm": 3.0,
    "fuelRemainingPercent": 74.2,
    "engineStatus": "NOMINAL - DUAL DIESEL-ELECTRIC",
    "lastUpdate": "LIVE",
    "polarisRio": POLARIS_RIO_DATA
}

WAYPOINTS_A = [
    {"id": "WP1", "name": "Bransfield Entrance", "lat": -63.85, "lon": -62.40, "escapeReliability": 98, "returnTimeMin": 18, "status": "SAFE", "fuelToRetreat": 1.1, "rioBaseline": 8.5},
    {"id": "WP2", "name": "Gerlache North", "lat": -64.20, "lon": -63.10, "escapeReliability": 94, "returnTimeMin": 24, "status": "SAFE", "fuelToRetreat": 1.5, "rioBaseline": 6.2},
    {"id": "WP3", "name": "Anvers East", "lat": -64.55, "lon": -63.80, "escapeReliability": 91, "returnTimeMin": 28, "status": "SAFE", "fuelToRetreat": 1.8, "rioBaseline": 4.8},
    {"id": "WP4", "name": "Grandidier North", "lat": -65.10, "lon": -64.50, "escapeReliability": 87, "returnTimeMin": 31, "status": "SAFE", "fuelToRetreat": 2.2, "rioBaseline": 1.4},
    {"id": "WP5", "name": "Biscoe Strait", "lat": -65.60, "lon": -65.25, "escapeReliability": 74, "returnTimeMin": 39, "status": "CAUTION", "fuelToRetreat": 2.6, "rioBaseline": -3.2},
    {"id": "WP6", "name": "Adelaide North Throat", "lat": -66.15, "lon": -66.10, "escapeReliability": 54, "returnTimeMin": 48, "status": "WARNING", "isLastSafeTurnBack": True, "fuelToRetreat": 3.2, "rioBaseline": -6.8},
    {"id": "WP7", "name": "Crystal Sound Pack Ice", "lat": -66.75, "lon": -67.15, "escapeReliability": 28, "returnTimeMin": 72, "status": "DANGER", "fuelToRetreat": 4.9, "rioBaseline": -11.5},
    {"id": "WP8", "name": "Marguerite Approach", "lat": -67.45, "lon": -68.15, "escapeReliability": 12, "returnTimeMin": 110, "status": "NO RELIABLE RETREAT", "fuelToRetreat": 7.4, "rioBaseline": -12.4},
]

ROUTES = [
    {
        "id": "ROUTE_A",
        "name": "ROUTE A — FAST",
        "tag": "FAST",
        "description": "Inner Channel Transit (Gerlache & Grandidier Channels)",
        "travelTime": "28h 40m",
        "travelTimeHours": 28.67,
        "fuelPercent": 100.0,
        "highRiskExposurePercent": 24.0,
        "riskLevel": "HIGH",
        "distanceNm": 355.4,
        "averageIceConcentration": 64,
        "cpaNearestIcebergNm": 0.38,
        "active": True,
        "minRioScore": -12.4,
        "rioStatus": "OPERATION_SUBJECT_TO_CONSIDERATION",
        "waypoints": WAYPOINTS_A
    },
    {
        "id": "ROUTE_B",
        "name": "ROUTE B — BALANCED",
        "tag": "BALANCED",
        "description": "Outer Shelf Transit (West of Biscoe Islands Archipelago)",
        "travelTime": "31h 05m",
        "travelTimeHours": 31.08,
        "fuelPercent": 104.2,
        "highRiskExposurePercent": 12.0,
        "riskLevel": "MODERATE",
        "distanceNm": 385.1,
        "averageIceConcentration": 38,
        "cpaNearestIcebergNm": 4.6,
        "active": False,
        "minRioScore": 1.8,
        "rioStatus": "NORMAL_OPERATION",
        "waypoints": [
            {"id": "B-WP1", "name": "Bransfield Entrance", "lat": -63.85, "lon": -62.40, "escapeReliability": 98, "returnTimeMin": 18, "status": "SAFE", "rioBaseline": 8.5},
            {"id": "B-WP2", "name": "Smith Island West", "lat": -63.95, "lon": -63.50, "escapeReliability": 96, "returnTimeMin": 22, "status": "SAFE", "rioBaseline": 7.8},
            {"id": "B-WP3", "name": "Anvers Western Shelf", "lat": -64.40, "lon": -64.70, "escapeReliability": 92, "returnTimeMin": 26, "status": "SAFE", "rioBaseline": 6.4},
            {"id": "B-WP4", "name": "Renaud Offshore", "lat": -65.20, "lon": -66.30, "escapeReliability": 89, "returnTimeMin": 30, "status": "SAFE", "rioBaseline": 4.2},
            {"id": "B-WP5", "name": "Lavoisier Seaward", "lat": -66.00, "lon": -67.80, "escapeReliability": 84, "returnTimeMin": 34, "status": "SAFE", "rioBaseline": 3.1},
            {"id": "B-WP6", "name": "Adelaide Western Hook", "lat": -66.90, "lon": -69.20, "escapeReliability": 78, "returnTimeMin": 42, "status": "SAFE", "rioBaseline": 2.4},
            {"id": "B-WP7", "name": "Marguerite Sound Entry", "lat": -67.45, "lon": -68.15, "escapeReliability": 68, "returnTimeMin": 52, "status": "SAFE", "rioBaseline": 1.8}
        ]
    },
    {
        "id": "ROUTE_C",
        "name": "ROUTE C — SAFEST",
        "tag": "SAFEST",
        "description": "Deep Ocean Perimeter Detour (Bellingshausen Deep Margin)",
        "travelTime": "34h 20m",
        "travelTimeHours": 34.33,
        "fuelPercent": 110.5,
        "highRiskExposurePercent": 7.0,
        "riskLevel": "LOW",
        "distanceNm": 426.0,
        "averageIceConcentration": 18,
        "cpaNearestIcebergNm": 12.2,
        "active": False,
        "minRioScore": 8.5,
        "rioStatus": "NORMAL_OPERATION",
        "waypoints": [
            {"id": "C-WP1", "name": "Bransfield Entrance", "lat": -63.85, "lon": -62.40, "escapeReliability": 98, "returnTimeMin": 18, "status": "SAFE", "rioBaseline": 9.2},
            {"id": "C-WP2", "name": "Boyd Strait Deep", "lat": -63.60, "lon": -64.50, "escapeReliability": 97, "returnTimeMin": 20, "status": "SAFE", "rioBaseline": 9.0},
            {"id": "C-WP3", "name": "Bellingshausen Margin North", "lat": -64.20, "lon": -66.20, "escapeReliability": 96, "returnTimeMin": 23, "status": "SAFE", "rioBaseline": 8.8},
            {"id": "C-WP4", "name": "Bellingshausen Central", "lat": -65.10, "lon": -68.40, "escapeReliability": 95, "returnTimeMin": 27, "status": "SAFE", "rioBaseline": 8.7},
            {"id": "C-WP5", "name": "Bellingshausen South", "lat": -66.30, "lon": -70.50, "escapeReliability": 92, "returnTimeMin": 32, "status": "SAFE", "rioBaseline": 8.6},
            {"id": "C-WP6", "name": "Adelaide Deep Outer Approach", "lat": -67.20, "lon": -70.80, "escapeReliability": 86, "returnTimeMin": 38, "status": "SAFE", "rioBaseline": 8.5},
            {"id": "C-WP7", "name": "Marguerite Entry Corridor", "lat": -67.45, "lon": -68.15, "escapeReliability": 79, "returnTimeMin": 46, "status": "SAFE", "rioBaseline": 8.5}
        ]
    }
]

ICEBERGS = [
    {
        "id": "ANT-042",
        "classification": "Tabular Iceberg (Giant)",
        "sizeMeters": {"length": 420, "width": 280, "heightAboveWater": 36, "draft": 180},
        "currentPosition": {"lat": -65.85, "lon": -65.65},
        "velocityMs": 0.42,
        "velocityKnots": 0.82,
        "directionDeg": 43.0,
        "predictionConfidence": 91,
        "riskLevel": "EXTREME",
        "pastPositions": [
            {"timeOffset": "-6h", "lat": -65.98, "lon": -65.85},
            {"timeOffset": "-3h", "lat": -65.92, "lon": -65.75},
            {"timeOffset": "-1h", "lat": -65.87, "lon": -65.68}
        ],
        "predictedTrajectory": [
            {"timeOffset": "+1h", "lat": -65.80, "lon": -65.57, "uncertaintyRadiusKm": 1.2},
            {"timeOffset": "+2h", "lat": -65.74, "lon": -65.48, "uncertaintyRadiusKm": 2.5},
            {"timeOffset": "+3h", "lat": -65.68, "lon": -65.39, "uncertaintyRadiusKm": 4.1},
            {"timeOffset": "+6h", "lat": -65.50, "lon": -65.12, "uncertaintyRadiusKm": 7.8},
            {"timeOffset": "+12h", "lat": -65.15, "lon": -64.60, "uncertaintyRadiusKm": 14.5}
        ],
        "shipInteraction": {
            "intersectsRoute": True,
            "intersectingRoute": "ROUTE_A",
            "intersectionLat": -65.72,
            "intersectionLon": -65.45,
            "probabilityPercent": 76,
            "timeToIntersection": "2h 17m",
            "cpaDistanceNm": 0.38
        }
    },
    {
        "id": "ANT-019",
        "classification": "Tabular Iceberg",
        "sizeMeters": {"length": 290, "width": 190, "heightAboveWater": 28, "draft": 140},
        "currentPosition": {"lat": -66.42, "lon": -64.90},
        "velocityMs": 0.28,
        "velocityKnots": 0.54,
        "directionDeg": 35.0,
        "predictionConfidence": 88,
        "riskLevel": "HIGH",
        "pastPositions": [
            {"timeOffset": "-3h", "lat": -66.47, "lon": -64.96}
        ],
        "predictedTrajectory": [
            {"timeOffset": "+1h", "lat": -66.38, "lon": -64.84, "uncertaintyRadiusKm": 0.9},
            {"timeOffset": "+3h", "lat": -66.30, "lon": -64.72, "uncertaintyRadiusKm": 2.8},
            {"timeOffset": "+6h", "lat": -66.18, "lon": -64.55, "uncertaintyRadiusKm": 5.4}
        ],
        "shipInteraction": {"intersectsRoute": False, "probabilityPercent": 18, "timeToIntersection": "N/A", "cpaDistanceNm": 8.4}
    },
    {
        "id": "ANT-088",
        "classification": "Pinnacle / Weathered Berg",
        "sizeMeters": {"length": 185, "width": 120, "heightAboveWater": 42, "draft": 110},
        "currentPosition": {"lat": -64.85, "lon": -62.90},
        "velocityMs": 0.35,
        "velocityKnots": 0.68,
        "directionDeg": 50.0,
        "predictionConfidence": 85,
        "riskLevel": "MODERATE",
        "pastPositions": [
            {"timeOffset": "-3h", "lat": -64.91, "lon": -63.02}
        ],
        "predictedTrajectory": [
            {"timeOffset": "+1h", "lat": -64.81, "lon": -62.82, "uncertaintyRadiusKm": 1.1},
            {"timeOffset": "+3h", "lat": -64.73, "lon": -62.66, "uncertaintyRadiusKm": 3.2},
            {"timeOffset": "+6h", "lat": -64.61, "lon": -62.42, "uncertaintyRadiusKm": 6.0}
        ],
        "shipInteraction": {"intersectsRoute": False, "probabilityPercent": 9, "timeToIntersection": "N/A", "cpaDistanceNm": 14.1}
    },
    {
        "id": "ANT-003",
        "classification": "Growler / Bergy Bit Cluster",
        "sizeMeters": {"length": 80, "width": 45, "heightAboveWater": 9, "draft": 40},
        "currentPosition": {"lat": -65.25, "lon": -66.45},
        "velocityMs": 0.48,
        "velocityKnots": 0.93,
        "directionDeg": 60.0,
        "predictionConfidence": 79,
        "riskLevel": "MODERATE",
        "pastPositions": [
            {"timeOffset": "-3h", "lat": -65.32, "lon": -66.62}
        ],
        "predictedTrajectory": [
            {"timeOffset": "+1h", "lat": -65.20, "lon": -66.33, "uncertaintyRadiusKm": 1.6},
            {"timeOffset": "+3h", "lat": -65.10, "lon": -66.10, "uncertaintyRadiusKm": 4.5},
            {"timeOffset": "+6h", "lat": -64.95, "lon": -65.75, "uncertaintyRadiusKm": 8.5}
        ],
        "shipInteraction": {"intersectsRoute": False, "probabilityPercent": 24, "timeToIntersection": "N/A", "cpaDistanceNm": 6.2}
    },
    {
        "id": "ANT-071",
        "classification": "Tabular Fragment",
        "sizeMeters": {"length": 160, "width": 95, "heightAboveWater": 18, "draft": 85},
        "currentPosition": {"lat": -67.10, "lon": -67.50},
        "velocityMs": 0.19,
        "velocityKnots": 0.37,
        "directionDeg": 25.0,
        "predictionConfidence": 93,
        "riskLevel": "HIGH",
        "pastPositions": [
            {"timeOffset": "-3h", "lat": -67.14, "lon": -67.55}
        ],
        "predictedTrajectory": [
            {"timeOffset": "+1h", "lat": -67.07, "lon": -67.46, "uncertaintyRadiusKm": 0.8},
            {"timeOffset": "+3h", "lat": -67.01, "lon": -67.38, "uncertaintyRadiusKm": 2.1},
            {"timeOffset": "+6h", "lat": -66.92, "lon": -67.26, "uncertaintyRadiusKm": 4.2}
        ],
        "shipInteraction": {"intersectsRoute": True, "intersectingRoute": "ROUTE_A", "probabilityPercent": 52, "timeToIntersection": "7h 12m", "cpaDistanceNm": 1.1}
    }
]

def calculate_simulated_rio(ice_conc: int) -> dict:
    """Approximates IMO POLARIS Risk Index Outcome (RIO) for PC-6 Ice Class"""
    conc_tenths = ice_conc / 10.0
    raw_rio = 10.0 - (conc_tenths * 2.2)
    score = round(raw_rio, 1)
    
    if score < -10.0:
        status = "OPERATION_SUBJECT_TO_CONSIDERATION"
        label = "Subject to Special Consideration (RIO < -10)"
    elif score < 0.0:
        status = "ELEVATED_RISK"
        label = "Elevated Operational Risk (-10 ≤ RIO < 0)"
    else:
        status = "NORMAL_OPERATION"
        label = "Normal Operation (RIO ≥ 0)"
        
    return {"score": score, "status": status, "label": label}

def generate_spatial_grid(time_offset_hours: float = 0.0):
    """
    Generates a 2D ocean spatial grid over Antarctic Peninsula corridor
    Lat: -63.4 to -67.8, Lon: -62.0 to -70.5
    Grid cell size ~ 0.25 deg lat x 0.5 deg lon
    Calculates both POLARIS/RIO baseline and AI dynamic predictive risk.
    """
    cells = []
    lat_steps = 18
    lon_steps = 18
    
    min_lat, max_lat = -67.8, -63.4
    min_lon, max_lon = -70.5, -62.0
    
    drift_lat_shift = time_offset_hours * 0.04
    drift_lon_shift = time_offset_hours * 0.06

    cell_index = 100
    for i in range(lat_steps):
        lat = min_lat + (i / (lat_steps - 1)) * (max_lat - min_lat)
        for j in range(lon_steps):
            lon = min_lon + (j / (lon_steps - 1)) * (max_lon - min_lon)
            cell_index += 1
            cell_id = f"A-{cell_index}"
            
            south_factor = (-lat - 63.4) / 4.4
            east_factor = (lon - (-70.5)) / 8.5
            
            ice_conc = int(min(98, max(5, (south_factor * 60 + east_factor * 35) + math.sin(i * 0.8 + j * 0.6) * 12)))
            
            # 1. Standardized POLARIS/RIO baseline
            rio_data = calculate_simulated_rio(ice_conc)
            
            # 2. Kinetic additions (iceberg proximity, velocity, wind)
            ant42_lat = -65.85 + drift_lat_shift
            ant42_lon = -65.65 + drift_lon_shift
            dist_to_ant42_km = math.sqrt(((lat - ant42_lat) * 111)**2 + ((lon - ant42_lon) * 50)**2)
            
            base_risk = (ice_conc * 0.55) + (35.0 if dist_to_ant42_km < 35 else (15.0 if dist_to_ant42_km < 70 else 0.0))
            current_risk = int(min(99, max(4, base_risk)))
            
            future_drift_factor = 1.0 + (time_offset_hours * 0.075 if (lat < -65.2 and lon > -66.8) else time_offset_hours * 0.015)
            predicted_risk = int(min(99, max(4, base_risk * future_drift_factor + (8.0 if dist_to_ant42_km < 40 else 0.0))))
            
            intersection_prob = int(max(0, min(95, 92 - (dist_to_ant42_km * 1.6)))) if dist_to_ant42_km < 55 else int(max(0, 15 - dist_to_ant42_km * 0.1))
            
            confidence = int(max(65, 96 - (time_offset_hours * 2.1) + math.cos(i) * 3))
            horizon_mins = int(time_offset_hours * 60 + 18)
            
            cells.append({
                "cellId": cell_id,
                "lat": round(lat, 3),
                "lon": round(lon, 3),
                "currentRisk": current_risk,
                "predictedRisk": predicted_risk,
                "confidence": confidence,
                "iceConcentration": ice_conc,
                "nearestIceberg": "ANT-042" if dist_to_ant42_km < 80 else ("ANT-019" if lat < -66.2 else "ANT-088"),
                "nearestIcebergDistanceKm": round(dist_to_ant42_km, 1),
                "icebergIntersectionProbability": intersection_prob,
                "predictionHorizon": f"{int(horizon_mins // 60)}h {int(horizon_mins % 60):02d}m",
                "riskLevel": get_risk_level(predicted_risk if time_offset_hours > 0 else current_risk),
                "rioBaseline": rio_data["score"],
                "rioStatus": rio_data["status"],
                "rioStatusLabel": rio_data["label"]
            })
            
    return cells

def get_risk_level(score: int) -> str:
    if score <= 20:
        return "SAFE"
    elif score <= 40:
        return "LOW"
    elif score <= 60:
        return "MODERATE"
    elif score <= 80:
        return "HIGH"
    else:
        return "EXTREME"

@app.get("/api/status")
def get_system_status():
    return {
        "system": "polarEye AI Navigation & Ice Risk Intelligence",
        "status": "ONLINE",
        "mode": "OPERATIONAL / LIVE SIMULATION",
        "projection": "EPSG:3031 Antarctic Polar Stereographic",
        "standardBaseline": "IMO POLARIS (MSC.1/Circ.1519) Simulated",
        "timestampUtc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "timeStringUtc": time.strftime("%H:%M:%S UTC", time.gmtime()),
        "activeVessel": "MV POLARIS",
        "trackedIcebergsCount": len(ICEBERGS),
        "activeRoute": "ROUTE_A",
        "warningState": "ELEVATED_ICE_ALERT"
    }

@app.get("/api/telemetry")
def get_vessel_telemetry():
    return {
        "vessel": VESSEL_DATA,
        "polarisRioBaseline": POLARIS_RIO_DATA,
        "environment": {
            "seaIceConcentrationPercent": 58,
            "ambientAirTempC": -8.4,
            "seaSurfaceTempC": -1.6,
            "windSpeedKnots": 32.0,
            "windDirectionDeg": 210.0,
            "windBeaufort": "7 (Near Gale)",
            "oceanCurrentKnots": 0.72,
            "oceanCurrentDeg": 45.0,
            "significantWaveHeightM": 2.4,
            "visibilityNm": 3.8,
            "barometricPressureHpa": 984.2
        },
        "riskSummary": {
            "currentRisk": 34,
            "currentRiskLevel": "LOW",
            "predictedArrivalRisk": 78,
            "predictedArrivalRiskLevel": "HIGH",
            "predictionHorizon": "2h 18m",
            "highRiskExposurePercent": 24.0,
            "lastSafeTurnBackPoint": "Waypoint 6 (Adelaide North Throat)",
            "lastSafeTurnBackReliability": 54,
            "immediateActionRequired": True
        }
    }

@app.get("/api/grid")
def get_grid(timeOffset: float = 0.0):
    return {
        "timeOffsetHours": timeOffset,
        "gridCount": 324,
        "cells": generate_spatial_grid(timeOffset)
    }

@app.get("/api/icebergs")
def get_icebergs():
    return {
        "count": len(ICEBERGS),
        "primaryThreat": "ANT-042",
        "threatIntersectionProbability": 76,
        "icebergs": ICEBERGS
    }

@app.get("/api/routes")
def get_routes():
    return {
        "routes": ROUTES,
        "lastSafeTurnBack": {
            "waypointId": "WP6",
            "name": "Adelaide North Throat",
            "lat": -66.15,
            "lon": -66.10,
            "reliabilityPercent": 54,
            "status": "WARNING",
            "rioBaseline": -6.8,
            "recommendation": "DO NOT PROCEED PAST WP6 WITHOUT DIVERSION TO ROUTE B"
        }
    }

@app.get("/api/corridors/{waypoint_id}")
def get_escape_corridor(waypoint_id: str):
    reliability_map = {
        "WP1": 98, "WP2": 94, "WP3": 91, "WP4": 87,
        "WP5": 74, "WP6": 54, "WP7": 28, "WP8": 12
    }
    rel = reliability_map.get(waypoint_id, 65)
    
    scenarios = [
        {"id": 1, "name": "Direct Western Breakout (Drake Escape)", "pass": True, "probability": 94, "fuelCostPercent": 2.8, "timeMinutes": 38, "bottleneck": "Clear seaward water"},
        {"id": 2, "name": "North-West Channel Reverse", "pass": True, "probability": 88, "fuelCostPercent": 3.1, "timeMinutes": 42, "bottleneck": "Light pack ice 25%"},
        {"id": 3, "name": "Leeward Island Shelter Run", "pass": True if rel >= 50 else False, "probability": 72, "fuelCostPercent": 3.5, "timeMinutes": 46, "bottleneck": "Growler drift field"},
        {"id": 4, "name": "Shelf Margin Sprint", "pass": False if rel <= 60 else True, "probability": 41, "fuelCostPercent": 4.2, "timeMinutes": 55, "bottleneck": "Blocked by drifting floe tongue"},
        {"id": 5, "name": "Adelaide Northern Slalom", "pass": True if rel >= 70 else False, "probability": rel, "fuelCostPercent": 3.9, "timeMinutes": 49, "bottleneck": "Dynamic convergence zone"}
    ]
    
    pass_count = sum(1 for s in scenarios if s["pass"])
    
    return {
        "waypointId": waypoint_id,
        "escapeReliabilityPercent": rel,
        "status": "SAFE" if rel >= 85 else ("WARNING" if rel >= 50 else "NO RELIABLE RETREAT"),
        "returnTimeBudgetMin": 45 if rel > 50 else 95,
        "fuelBudgetPercent": 3.2 if rel > 50 else 6.8,
        "distanceToOpenWaterKm": 14.8 if rel > 50 else 42.5,
        "simulatedScenarios": scenarios,
        "monteCarloSummary": f"{pass_count}/5 PASS ({int((pass_count/5)*100)}% feasible passages)",
        "lastSafeTurnBackPointNotice": waypoint_id == "WP6"
    }

@app.get("/api/brief")
def get_decision_brief(route_id: str = "ROUTE_A"):
    if route_id == "ROUTE_B":
        return {
            "selectedRoute": "ROUTE_B",
            "riskLevel": "MODERATE",
            "highRiskExposure": "12%",
            "headline": "Route B Diversion Activated — Ice Risk Significantly Mitigated",
            "body": "Route B adds approximately 2h 25m compared with Route A (+4.2% fuel), but reduces high-risk exposure from 24% to 12%. The vessel clears the predicted drift zone of Iceberg ANT-042 with a Closest Point of Approach (CPA) of 4.6 NM. Escape corridors remain above 78% reliability throughout transit.",
            "lastSafeTurnBackNotice": "Not applicable — open seaward flank available.",
            "recommendedAction": "Maintain Route B heading 042° at 11.8 knots. Monitor western swell.",
            "polarisRioSummary": "Simulated RIO baseline maintains +1.8 to +7.8 (Normal Operation under IMO POLARIS PC-6 limits)."
        }
    elif route_id == "ROUTE_C":
        return {
            "selectedRoute": "ROUTE_C",
            "riskLevel": "LOW",
            "highRiskExposure": "7%",
            "headline": "Route C Deep Ocean Perimeter — Maximum Ice Safety",
            "body": "Route C provides maximum clearance from pack ice tongues and iceberg fields, with high-risk exposure minimized to 7%. Travel time increases by 5h 40m (+10.5% fuel). Safe retreat corridors to open Southern Ocean remain 86-98% reliable at all times.",
            "lastSafeTurnBackNotice": "Open ocean retreat available at all waypoints.",
            "recommendedAction": "Acceptable for severe storm or heavy multi-year ice conditions. Higher fuel expenditure required.",
            "polarisRioSummary": "Simulated RIO baseline remains above +8.5 across all waypoints (Unrestricted Open Water Operation)."
        }
    else:
        return {
            "selectedRoute": "ROUTE_A",
            "riskLevel": "HIGH",
            "highRiskExposure": "24%",
            "headline": "CRITICAL RISK: Iceberg Collision Risk & Rapidly Narrowing Retreat Corridor",
            "body": "Route B adds approximately 2h 25m compared with Route A but reduces high-risk exposure from 24% to 12%. The predicted ice-risk field is expanding eastward into Grandidier and Adelaide Sound. Iceberg ANT-042 has a 76% predicted probability of interacting with Route A within 2h 17m at Waypoint 6. Last reliable turn-back point: Waypoint 6 (Reliability: 54%).",
            "lastSafeTurnBackNotice": "LAST SAFE TURN-BACK: Waypoint 6. Beyond WP6, retreat reliability collapses to 28% and 12%.",
            "recommendedAction": "Review and authorize diversion to Route B before reaching Waypoint 6.",
            "polarisRioSummary": "Simulated RIO drops to -6.8 at WP6 (Elevated Risk) and collapses to -12.4 at WP7 (Exceeds normal PC-6 IMO limits)."
        }

@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket):
    await websocket.accept()
    step = 0
    try:
        while True:
            step += 1
            jitter_speed = round(12.4 + (math.sin(step * 0.2) * 0.3), 1)
            jitter_heading = round(38.0 + (math.cos(step * 0.3) * 0.6), 1)
            
            message = {
                "type": "TELEMETRY_TICK",
                "timestampUtc": time.strftime("%H:%M:%S UTC", time.gmtime()),
                "speedKnots": jitter_speed,
                "headingDeg": jitter_heading,
                "currentRisk": 34 if step % 20 < 10 else 36,
                "predictedArrivalRisk": 78,
                "step": step,
                "activeAlertsCount": 3,
                "polarisRioScore": 4.2
            }
            await websocket.send_json(message)
            await asyncio.sleep(2.0)
    except WebSocketDisconnect:
        pass
    except Exception:
        pass
