# ICEGUARD
### AI Predictive Antarctic Navigation & Ice Risk Intelligence System

An operational navigation decision-support platform engineered for vessels navigating high-latitude Antarctic waters.

---

## Key Features

1. **AI Dynamic Ice Risk Field (EPSG:3031 Antarctic Polar Stereographic)**:
   - Evaluates multi-factor dynamic risk: sea-ice concentration, iceberg kinematics, ocean currents, wind vectors, and vessel arrival horizon.
   - **Time-Aware Risk Calculation**: Shows **Current Risk** vs **Predicted Risk at Ship Arrival**.
   - Spatial ocean grid with color coding:
     - `0–20`: Safe (Green)
     - `21–40`: Low (Yellow)
     - `41–60`: Moderate (Orange)
     - `61–80`: High (Red)
     - `81–100`: Extreme (Dark Red)
   - Interactive Grid Cell Inspector HUD card (Current vs Arrival risk, ice concentration, confidence, nearest iceberg, intersection probability).

2. **Time Simulation Scrubber (`NOW`, `+1H`, `+2H`, `+3H`, `+6H`, `+12H`)**:
   - Visualizes dangerous pack ice expanding and drifting over time.
   - Play/pause simulation with variable playback speed (1x, 2x, 5x).

3. **Vessel Tracking**:
   - `MV POLARIS` (PC-6 Ice Class polar research vessel, 12.4 knots, heading 038°).
   - Heading leader vector and dynamic 3 NM safety corridor buffer.

4. **Iceberg Trajectory Forecasting & 4D Uncertainty Cones**:
   - Multiple tracked icebergs (`ANT-042`, `ANT-019`, `ANT-088`, `ANT-003`, `ANT-071`).
   - Trajectory paths with expanding 95% confidence uncertainty cones.
   - Route intersection alert (`ANT-042` intersects Route A in 2h 17m with 76% collision probability).

5. **Escape Corridors & LAST SAFE TURN-BACK POINT**:
   - Calculates retreat reliability at every waypoint on the route.
   - High-visibility beacon at **Waypoint 6: LAST SAFE TURN-BACK POINT (54% Reliability)**.
   - Monte Carlo retreat simulation with 5 pass/fail scenarios, time budgets, fuel budgets, and distance to open water.
   - Visual escape corridors drawn on the map.

6. **Multi-Route Comparative Evaluator**:
   - **Route A (Fast)**: 28h 40m, 100% fuel, 24% high-risk exposure, CPA 0.38 NM.
   - **Route B (Balanced)**: 31h 05m, 104.2% fuel, 12% high-risk exposure, CPA 4.6 NM.
   - **Route C (Safest)**: 34h 20m, 110.5% fuel, 7% high-risk exposure, CPA 12.2 NM.
   - Neutral officer comparison matrix with dynamic map switching.

7. **AI Operational Decision Brief**:
   - Dynamic C2 narrative summarizing route trade-offs, expanding ice fronts, turn-back constraints, and one-click course diversion.

8. **Automated 5-Minute Scenario Demo**:
   - Automated 6-phase walkthrough demonstrating calm departure, iceberg detection, risk escalation, turn-back warning, and diversion to Route B.

---

## Quick Start

### 1. Launch with One Click (Windows)
Double-click `start.bat` in the project root.

### 2. Manual Launch
**Backend**:
```bash
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --app-dir d:\titanic\backend
```

**Frontend**:
```bash
cd frontend
npm run dev -- --host 127.0.0.1 --port 5173
```

- **Frontend URL**: [http://127.0.0.1:5173/](http://127.0.0.1:5173/)
- **Backend Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
