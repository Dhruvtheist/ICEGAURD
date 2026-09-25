# ICEGUARD — Technical Architecture, Stack & Workflow Specification

> **System Name**: ICEGUARD  
> **Sub-Title**: AI Predictive Antarctic Navigation & Ice Risk Intelligence System  
> **Target Environment**: High-Latitude Polar Maritime Operations (Antarctic Peninsula / Rothera Station Corridor)  
> **Standard Compliance**: IMO Polar Code & POLARIS (MSC.1/Circ.1519) Methodology  
> **Projection**: EPSG:3031 Antarctic Polar Stereographic  

---

## 1. Executive Summary

Traditional polar navigation tools operate reactively: they display where ice floes and icebergs were observed at the moment of the last satellite pass. In fast-moving polar environments, this snapshot approach is dangerous because ice moves, currents drift, and floes compress under gale-force winds.

**ICEGUARD introduces a Time-Aware Dynamic Ice Risk Field**:
Instead of static maps, ICEGUARD divides the Antarctic ocean into a spatial grid and continuously calculates evolving dynamic risk scores for every cell. It fuses the standardized **IMO POLARIS / RIO vessel capability baseline** with kinetic 4D factors (iceberg trajectories, wind drift, wave compression, and dead reckoning) to project risk at the **exact moment the vessel will arrive**.

Furthermore, it answers the commanding officer’s most critical question:
> *"How far can I safely continue before I lose the ability to retreat?"*  
> ICEGUARD evaluates escape corridors at every waypoint and computes the **LAST SAFE TURN-BACK POINT** before the ship gets trapped.

---

## 2. Technology Stack Breakdown

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND PRESENTATION LAYER                     │
│  React 18  •  TypeScript  •  Vite  •  Tailwind CSS  •  Lucide Icons   │
├────────────────────────────────────────────────────────────────────────┤
│                       GEOSPATIAL & ECDIS MAPPING                       │
│  OpenLayers (ol)  •  Proj4 (EPSG:3031 Antarctic Polar Stereographic)   │
├────────────────────────────────────────────────────────────────────────┤
│                         BACKEND SERVICE LAYER                          │
│  Python 3.14  •  FastAPI  •  Uvicorn (ASGI)  •  WebSockets  • Pydantic │
└────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Frontend Technologies
| Technology | Version / Spec | Purpose in ICEGUARD |
| :--- | :--- | :--- |
| **React** | `^18.3.1` | Component-driven reactive UI architecture managing vessel telemetry, HUD popups, route evaluation, and demo mode. |
| **TypeScript** | `~5.9.3` | Type safety across nautical coordinates, vessel specifications, 4D trajectory nodes, and POLARIS/RIO status enums. |
| **Vite** | `^8.3.0` | Ultra-fast development server with Hot Module Replacement (HMR) and optimized Rolldown/esbuild bundling. |
| **OpenLayers (`ol`)** | `^10.4.0` | High-performance canvas-based maritime ECDIS mapping engine rendering polar graticules, vector coastlines, iceberg uncertainty cones, and risk grid polygons. |
| **Proj4 (`proj4`)** | `^2.15.0` | Cartographic projection library defining and registering **EPSG:3031 (Antarctic Polar Stereographic)** with datum WGS-84. |
| **Tailwind CSS** | `^3.4.17` | Maritime tactical design system featuring dark navy palettes (`#040711`, `#080d1a`), polar cyan radar tones (`#00f0ff`), and calibrated risk indicators. |
| **Lucide React** | `^0.475.0` | Vector tactical and nautical icons (radar crosshairs, gyrocompass, ice shields, distress beacons). |
| **Recharts** | `^2.15.1` | Time-series data visualization for telemetry progression and Monte Carlo retreat simulation curves. |

### 2.2 Backend Technologies
| Technology | Version / Spec | Purpose in ICEGUARD |
| :--- | :--- | :--- |
| **Python** | `3.14.3` | Core algorithmic and simulation runtime. |
| **FastAPI** | `^0.141.1` | Asynchronous microframework exposing REST endpoints for grid calculations, iceberg tracking, and route evaluations. |
| **Uvicorn** | `^0.53.0` | Lightning-fast ASGI web server running the backend on port 8000. |
| **WebSockets** | `^17.1` | Full-duplex channel (`/ws/stream`) broadcasting live telemetry ticks, GPS coordinates, sensor noise, and real-time alerts. |
| **Pydantic** | `^2.13.5` | Data modeling, validation, and JSON serialization. |

### 2.3 Resilient Dual-Mode Architecture
ICEGUARD features an autonomous client-side simulation engine inside `polarDataService.ts`. While the application automatically connects to the FastAPI backend and WebSocket streaming service, if the backend is starting up or disconnected, the frontend seamlessly transitions to its built-in mathematical engine with **zero interruption, zero configuration, and zero errors**.

---

## 3. System Architecture & Data Flow

```mermaid
graph TD
    subgraph Data Sources & Ingestion
        A1[Satellite Synthetic Aperture Radar - SAR]
        A2[Polar Weather & Gale Wind Models]
        A3[Ocean Surface Current Buoys & Drifters]
        A4[Vessel AIS & PC-6 Engine Telemetry]
    end

    subgraph Backend Service Layer (FastAPI)
        B1[IMO POLARIS / RIO Engine<br/>MSC.1/Circ.1519]
        B2[4D Iceberg Kinematic Tracker<br/>Uncertainty Cones]
        B3[Dynamic Arrival Risk Matrix<br/>Grid Cell Generator]
        B4[Monte Carlo Escape Simulator<br/>5 Scenario Pass/Fail]
        B5[WebSocket Event Streamer<br/>/ws/stream]
    end

    subgraph Frontend Client (React + OpenLayers)
        C1[EPSG:3031 Polar Stereographic Chart]
        C2[Grid Cell Inspector HUD Card]
        C3[Left Telemetry & POLARIS Sidebar]
        C4[Navigation Intelligence Panel<br/>Overview / Routes / Icebergs / Escape / Alerts]
        C5[Time Horizon Scrubber<br/>NOW to +12H]
    end

    A1 --> B1
    A4 --> B1
    A1 --> B2
    A2 --> B2
    A3 --> B2
    B1 --> B3
    B2 --> B3
    A4 --> B3
    B3 --> B4
    B1 --> B5
    B2 --> B5
    B3 --> B5
    B4 --> B5

    B3 -->|REST /api/grid| C1
    B2 -->|REST /api/icebergs| C1
    B4 -->|REST /api/corridors| C4
    B5 -->|WebSocket /ws/stream| C3
    B5 -->|Live Alerts| C4
    C5 -->|Timeline Offset Shift| C1
    C1 -->|Cell Click| C2
```

---

## 4. End-to-End Operational Workflow

The system executes a **7-stage intelligence pipeline**:

```
[1. Sea-Ice Concentration] + [Vessel Ice Class: PC-6]
                         ↓
[2. POLARIS / RIO Standardized Baseline (IMO MSC.1/Circ.1519)]
                         ↓
+ [4D Iceberg Trajectories & Velocity Vectors]
+ [Polar Gale Wind & Ocean Currents]
+ [Wave-Induced Floe Compression]
+ [Vessel Dead Reckoning & Speed]
+ [Predicted Conditions at ETA]
                         ↓
[3. Dynamic Predictive Risk Field (0–100 EPSG:3031 Ocean Grid)]
                         ↓
[4. Time Simulation Engine (NOW | +1H | +2H | +3H | +6H | +12H)]
                         ↓
[5. Escape Corridor & Monte Carlo Retreat Analysis (WP1 → WP8)]
                         ↓
[6. "LAST SAFE TURN-BACK POINT" Identification (Waypoint 6: 54%)]
                         ↓
[7. Multi-Route Comparative Evaluator & AI Operational Decision Brief]
```

### Stage 1: Baseline Regulatory Assessment (IMO POLARIS / RIO)
1. Ingests ambient sea-ice concentration and ice types (Open Water, Thin First-Year, Medium First-Year, Multi-Year).
2. Applies the vessel's certified polar capability (**MV POLARIS: Polar Class PC-6**).
3. Calculates the standardized **Risk Index Outcome (RIO)**:
   $$RIO = \sum (C_i \times RIV_i)$$
   - $RIO \ge 0$: **Normal Operation**
   - $-10 \le RIO < 0$: **Elevated Operational Risk** (Speed reduction, enhanced watch)
   - $RIO < -10$: **Subject to Special Consideration** (Exceeds normal PC-6 operating envelope)
4. *Output*: A standardized, vessel-specific regulatory baseline.

### Stage 2: 4D Kinetic Fusion & Arrival Time Horizon
1. Static regulatory indices cannot predict dynamic hazards. ICEGUARD fuses kinetic forces onto the RIO baseline:
   - **Iceberg Velocity**: Velocity vectors (e.g. `ANT-042`: 0.42 m/s @ 043°) with 95% expanding uncertainty cones.
   - **Ocean Currents & Gale Winds**: 32-knot gale winds pushing ice pack northeastward into navigational bottlenecks.
   - **Vessel Kinematics**: Speed (12.4 knots), heading (038°), and computed arrival times at each waypoint.
2. *Output*: Computes both **Current Risk** and **Predicted Risk at Ship Arrival**.

### Stage 3: Cartographic Spatial Grid (EPSG:3031)
1. Maps a 324-cell ocean grid across the Antarctic Peninsula corridor (63.4°S–67.8°S, 62.0°W–70.5°W).
2. Assigns calibrated 0–100 risk values:
   - `0–20`: Safe (Green)
   - `21–40`: Low (Yellow)
   - `41–60`: Moderate (Orange)
   - `61–80`: High (Red)
   - `81–100`: Extreme (Dark Red)
3. Grid cells are fully interactive. Clicking a cell displays:
   - Simulated POLARIS/RIO baseline
   - Current vs Predicted Arrival Risk
   - Nearest iceberg distance and closing velocity
   - Route intersection probability
   - Prediction confidence index (explicitly decoupled from risk).

### Stage 4: Dynamic Time Horizon Propagation
1. Officers scrub the timeline: **`NOW`, `+1H`, `+2H`, `+3H`, `+6H`, `+12H`**.
2. The dynamic risk field visually recalculates: dangerous pack ice fields drift and expand eastward, and risk around Waypoint 6 escalates from **48 (Moderate)** to **72 (High)**.

### Stage 5: Escape Corridor Retreat Simulation
1. At every route waypoint (WP1 to WP8), the system executes a **5-scenario Monte Carlo retreat simulation** to determine if the vessel can safely reverse course to open Drake Passage water.
2. Renders green viable retreat vectors and red ice-blocked paths on the chart.

### Stage 6: "LAST SAFE TURN-BACK POINT" Identification
1. When retreat reliability drops below the critical 50% safety margin, the system pins a prominent warning beacon on the chart:
   - **Waypoint 6 (Adelaide North Throat)** is designated the **LAST SAFE TURN-BACK POINT (54% Reliability / RIO -6.8)**.
   - Alerts the crew before passing the threshold where escape corridors collapse to 28% and 12%.

### Stage 7: Multi-Route Comparison & AI Decision Brief
1. Generates 3 transit corridors:
   - **Route A (Fast)**: 28h 40m, 100% fuel, 24% high-risk exposure, min RIO -12.4, CPA 0.38 NM.
   - **Route B (Balanced)**: 31h 05m, 104.2% fuel, 12% high-risk exposure, min RIO +1.8, CPA 4.6 NM.
   - **Route C (Safest)**: 34h 20m, 110.5% fuel, 7% high-risk exposure, min RIO +8.5, CPA 12.2 NM.
2. The AI generates an executive **Operational Decision Brief** explaining the trade-offs and providing an immediate **"AUTHORIZE DIVERSION TO ROUTE B"** action button.

---

## 5. File Structure & Component Map

```
d:/titanic/
├── backend/
│   ├── main.py                  # FastAPI REST API & WebSocket server
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── intelligence/
│   │   │   │   └── NavigationIntelligence.tsx  # 5-tab tactical intelligence panel
│   │   │   ├── landing/
│   │   │   │   └── LandingPage.tsx             # Mission overview portal
│   │   │   ├── layout/
│   │   │   │   ├── LeftSidebar.tsx             # Telemetry, POLARIS card, sensor feed
│   │   │   │   ├── TimeSimulationBar.tsx       # Timeline scrubber (NOW to +12H)
│   │   │   │   └── TopBar.tsx                  # ECDIS status, clock, layer toggles
│   │   │   └── map/
│   │   │       ├── AntarcticMap.tsx            # OpenLayers EPSG:3031 map canvas
│   │   │       └── GridCellInspector.tsx       # Tactical HUD popup
│   │   ├── services/
│   │   │   ├── antarcticGeoData.ts             # Vector coastlines & research stations
│   │   │   └── polarDataService.ts             # Risk equations & simulation engine
│   │   ├── types/
│   │   │   └── navigation.ts                   # TypeScript interfaces
│   │   ├── App.tsx                             # Primary state orchestrator
│   │   └── index.css                           # Polar maritime styles & ol.css
│   ├── index.html                              # Shell with Inter & JetBrains Mono
│   ├── tailwind.config.js                      # Custom polar color tokens
│   └── package.json                            # Frontend dependencies
├── start.bat                                   # One-click Windows concurrent launcher
├── README.md                                   # Quick start & user guide
└── TECH_STACK_AND_WORKFLOW.md                  # This technical specification
```

---

## 6. Backend API & WebSocket Specification

### 6.1 REST Endpoints
- `GET /api/status`: Operational system health, UTC clock, active vessel, and active route.
- `GET /api/telemetry`: MV POLARIS telemetry, polar environmental sensors, and POLARIS/RIO baseline.
- `GET /api/grid?timeOffset={hours}`: 324-cell ocean grid with current risk, arrival risk, and RIO baseline for the selected time horizon.
- `GET /api/icebergs`: Radar targets, 6-hour trajectory coordinates, and collision probabilities.
- `GET /api/routes`: Route A, B, and C comparative parameters and turn-back coordinates.
- `GET /api/corridors/{waypoint_id}`: Monte Carlo retreat simulation scenarios (Pass/Fail) and budgets.
- `GET /api/brief?route_id={id}`: AI Operational Decision Brief for the selected route.

### 6.2 WebSocket Streaming (`/ws/stream`)
Broadcasts real-time JSON packets every 2 seconds:
```json
{
  "type": "TELEMETRY_TICK",
  "timestampUtc": "11:42:10 UTC",
  "speedKnots": 12.5,
  "headingDeg": 38.2,
  "currentRisk": 34,
  "predictedArrivalRisk": 78,
  "step": 42,
  "activeAlertsCount": 3,
  "polarisRioScore": 4.2
}
```

---

## 7. How to Run the Project

### Method 1: One-Click Launch (Windows)
Double-click [`start.bat`](file:///d:/titanic/start.bat) in the project root. This automatically spins up both the FastAPI backend and the Vite dev server and opens your browser.

### Method 2: Manual Terminal Launch
**Terminal 1 — Backend**:
```powershell
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --app-dir d:\titanic\backend
```

**Terminal 2 — Frontend**:
```powershell
cd d:\titanic\frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

- **Frontend Application**: [http://127.0.0.1:5173/](http://127.0.0.1:5173/)
- **Backend Swagger API**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
