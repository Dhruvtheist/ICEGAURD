import React, { useState, useEffect, useRef } from 'react';
import {
  GridCell,
  ShipTelemetry,
  PolarEnvironment,
  Iceberg,
  RouteOption,
  Waypoint,
  WaypointEscapeAnalysis,
  NavigationAlert,
  DecisionBrief,
  TimelineStep
} from './types/navigation';
import {
  INITIAL_VESSEL,
  INITIAL_ENVIRONMENT,
  INITIAL_ROUTES,
  INITIAL_ICEBERGS,
  INITIAL_ALERTS,
  generateGridCells,
  getTimeOffsetHours,
  getWaypointEscapeAnalysis,
  getDecisionBrief
} from './services/polarDataService';
import { TopBar } from './components/layout/TopBar';
import { LeftSidebar } from './components/layout/LeftSidebar';
import { TimeSimulationBar } from './components/layout/TimeSimulationBar';
import { AntarcticMap } from './components/map/AntarcticMap';
import { FloatingInfoCards, FloatingCardType } from './components/map/FloatingInfoCards';
import { NavigationIntelligence } from './components/intelligence/NavigationIntelligence';
import { LandingPage } from './components/landing/LandingPage';

export const App: React.FC = () => {
  // View mode - default to 'command_center' for immediate Google Maps-style navigation UI
  const [viewMode, setViewMode] = useState<'landing' | 'command_center'>('command_center');

  // Core navigation state
  const [timelineStep, setTimelineStep] = useState<TimelineStep>('NOW');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);

  const [vessel, setVessel] = useState<ShipTelemetry>(INITIAL_VESSEL);
  const [environment, setEnvironment] = useState<PolarEnvironment>(INITIAL_ENVIRONMENT);
  const [routes, setRoutes] = useState<RouteOption[]>(INITIAL_ROUTES);
  const [activeRouteId, setActiveRouteId] = useState<string>('ROUTE_A');
  const [icebergs, setIcebergs] = useState<Iceberg[]>(INITIAL_ICEBERGS);
  const [alerts, setAlerts] = useState<NavigationAlert[]>(INITIAL_ALERTS);

  // Selected entities for drill-down inspection & floating cards
  const [floatingCard, setFloatingCard] = useState<FloatingCardType | null>(null);
  const [selectedCell, setSelectedCell] = useState<GridCell | null>(null);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint>(INITIAL_ROUTES[0].waypoints[5]); // Default to WP6 (Turn-back)
  const [selectedIceberg, setSelectedIceberg] = useState<Iceberg>(INITIAL_ICEBERGS[0]); // ANT-042
  const [intelligenceTab, setIntelligenceTab] = useState<'overview' | 'routes' | 'icebergs' | 'corridors' | 'alerts'>('overview');

  // Layer visibility toggles
  const [showRiskGrid, setShowRiskGrid] = useState<boolean>(true);
  const [showIcebergs, setShowIcebergs] = useState<boolean>(true);
  const [showRoutes, setShowRoutes] = useState<boolean>(true);
  const [showSafetyCorridor, setShowSafetyCorridor] = useState<boolean>(true);
  const [showEscapeCorridors, setShowEscapeCorridors] = useState<boolean>(true);
  const [showGraticule, setShowGraticule] = useState<boolean>(true);

  // Dynamic grid computed for current timeline step
  const [gridCells, setGridCells] = useState<GridCell[]>(() => generateGridCells(0.0));

  // Demo simulation mode
  const [isDemoActive, setIsDemoActive] = useState<boolean>(false);
  const [demoPhase, setDemoPhase] = useState<number>(1);
  const demoIntervalRef = useRef<number | null>(null);

  // Recompute grid whenever timelineStep changes
  useEffect(() => {
    const hours = getTimeOffsetHours(timelineStep);
    const updated = generateGridCells(hours);
    setGridCells(updated);

    // Update floating card if it is showing a cell
    if (floatingCard?.type === 'cell') {
      const match = updated.find((c) => c.cellId === floatingCard.cell.cellId);
      if (match) {
        setFloatingCard({ type: 'cell', cell: match });
      }
    }
  }, [timelineStep]);

  // Timeline auto-playback effect
  useEffect(() => {
    if (!isPlaying) return;

    const steps: TimelineStep[] = ['NOW', '+1H', '+2H', '+3H', '+6H', '+12H'];
    const timer = setInterval(() => {
      setTimelineStep((current) => {
        const currentIndex = steps.indexOf(current);
        const nextIndex = (currentIndex + 1) % steps.length;
        return steps[nextIndex];
      });
    }, 3000 / playbackSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed]);

  // WebSocket telemetry connection with backend (with fallback micro-jitter)
  useEffect(() => {
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket('ws://localhost:8000/ws/stream');
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'TELEMETRY_TICK') {
            setVessel((prev) => ({
              ...prev,
              speedKnots: data.speedKnots,
              headingDeg: data.headingDeg,
            }));
          }
        } catch {
          // ignore parse errors
        }
      };
    } catch {
      // Backend not running, use client-side jitter
    }

    const fallbackJitter = setInterval(() => {
      setVessel((prev) => ({
        ...prev,
        speedKnots: Number((12.4 + Math.sin(Date.now() / 3000) * 0.3).toFixed(1)),
        headingDeg: Math.round(38.0 + Math.cos(Date.now() / 4000) * 0.8),
      }));
    }, 2000);

    return () => {
      if (ws) ws.close();
      clearInterval(fallbackJitter);
    };
  }, []);

  // Demo 5-Minute Scripted Scenario Automation
  useEffect(() => {
    if (!isDemoActive) {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
      return;
    }

    demoIntervalRef.current = window.setInterval(() => {
      setDemoPhase((prev) => {
        const next = prev < 6 ? prev + 1 : 1;
        executeDemoPhase(next);
        return next;
      });
    }, 9000);

    return () => {
      if (demoIntervalRef.current) clearInterval(demoIntervalRef.current);
    };
  }, [isDemoActive]);

  const executeDemoPhase = (phase: number) => {
    if (phase === 1) {
      setActiveRouteId('ROUTE_A');
      setTimelineStep('NOW');
      setIntelligenceTab('overview');
      setSelectedWaypoint(INITIAL_ROUTES[0].waypoints[1]);
      setFloatingCard(null);
    } else if (phase === 2) {
      setIntelligenceTab('icebergs');
      setSelectedIceberg(INITIAL_ICEBERGS[0]);
      setFloatingCard({ type: 'iceberg', iceberg: INITIAL_ICEBERGS[0] });
    } else if (phase === 3) {
      setTimelineStep('+1H');
      setSelectedWaypoint(INITIAL_ROUTES[0].waypoints[4]);
    } else if (phase === 4) {
      setTimelineStep('+2H');
      setIntelligenceTab('alerts');
      setFloatingCard({ type: 'iceberg', iceberg: INITIAL_ICEBERGS[0] });
    } else if (phase === 5) {
      setSelectedWaypoint(INITIAL_ROUTES[0].waypoints[5]); // WP6
      setIntelligenceTab('corridors');
      setFloatingCard({ type: 'turnback', waypoint: INITIAL_ROUTES[0].waypoints[5] });
    } else if (phase === 6) {
      setActiveRouteId('ROUTE_B');
      setIntelligenceTab('overview');
      const bRoute = INITIAL_ROUTES.find((r) => r.id === 'ROUTE_B');
      if (bRoute) {
        setFloatingCard({ type: 'route', route: bRoute, isActive: true });
      }
    }
  };

  const handleToggleDemo = () => {
    if (!isDemoActive) {
      setIsDemoActive(true);
      setDemoPhase(1);
      executeDemoPhase(1);
    } else {
      setIsDemoActive(false);
    }
  };

  const handleResetDemo = () => {
    setDemoPhase(1);
    executeDemoPhase(1);
  };

  // Route selection
  const handleSelectRoute = (routeId: string) => {
    setActiveRouteId(routeId);
    setRoutes((prev) =>
      prev.map((r) => ({
        ...r,
        active: r.id === routeId,
      }))
    );
    const targetRoute = routes.find((r) => r.id === routeId);
    if (targetRoute) {
      setFloatingCard({ type: 'route', route: targetRoute, isActive: true });
    }
  };

  // Waypoint selection
  const handleSelectWaypoint = (wp: Waypoint) => {
    setSelectedWaypoint(wp);
    if (wp.isLastSafeTurnBack) {
      setFloatingCard({ type: 'turnback', waypoint: wp });
    }
    setIntelligenceTab('corridors');
  };

  // Turn-back point selection
  const handleSelectTurnBack = (wp: Waypoint) => {
    setSelectedWaypoint(wp);
    setFloatingCard({ type: 'turnback', waypoint: wp });
    setIntelligenceTab('corridors');
  };

  // Iceberg selection
  const handleSelectIceberg = (berg: Iceberg) => {
    setSelectedIceberg(berg);
    setFloatingCard({ type: 'iceberg', iceberg: berg });
    setIntelligenceTab('icebergs');
  };

  // Ship selection
  const handleSelectShip = () => {
    const currentRisk = activeRouteId === 'ROUTE_A' ? 34 : (activeRouteId === 'ROUTE_B' ? 24 : 14);
    const predictedArrivalRisk = activeRouteId === 'ROUTE_A' ? 78 : (activeRouteId === 'ROUTE_B' ? 38 : 19);
    setFloatingCard({
      type: 'ship',
      vessel,
      currentRisk,
      arrivalRisk: predictedArrivalRisk,
    });
  };

  // Grid cell selection
  const handleSelectCell = (cell: GridCell | null) => {
    setSelectedCell(cell);
    if (cell) {
      setFloatingCard({ type: 'cell', cell });
    } else {
      if (floatingCard?.type === 'cell') {
        setFloatingCard(null);
      }
    }
  };

  // Layer toggle handler
  const handleToggleLayer = (layer: 'grid' | 'icebergs' | 'corridor' | 'escape' | 'graticule') => {
    if (layer === 'grid') setShowRiskGrid((prev) => !prev);
    if (layer === 'icebergs') setShowIcebergs((prev) => !prev);
    if (layer === 'corridor') setShowSafetyCorridor((prev) => !prev);
    if (layer === 'escape') setShowEscapeCorridors((prev) => !prev);
    if (layer === 'graticule') setShowGraticule((prev) => !prev);
  };

  // Alert acknowledgment
  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, acknowledged: true } : a))
    );
  };

  // Quick diversion button from decision brief
  const handleDiversionToRouteB = () => {
    handleSelectRoute('ROUTE_B');
  };

  // Active route & analyses
  const activeRoute = routes.find((r) => r.id === activeRouteId) || routes[0];
  const decisionBrief = getDecisionBrief(activeRouteId);
  const escapeAnalysis = getWaypointEscapeAnalysis(selectedWaypoint.id);

  // Risk scores based on active route
  const currentRiskScore = activeRouteId === 'ROUTE_A' ? 34 : (activeRouteId === 'ROUTE_B' ? 24 : 14);
  const predictedArrivalRiskScore = activeRouteId === 'ROUTE_A' ? 78 : (activeRouteId === 'ROUTE_B' ? 38 : 19);
  const unreadAlerts = alerts.filter((a) => !a.acknowledged).length;

  if (viewMode === 'landing') {
    return (
      <LandingPage
        onEnterCommandCenter={() => setViewMode('command_center')}
        onLaunchSimulation={() => {
          setViewMode('command_center');
          setIsDemoActive(true);
          setDemoPhase(1);
          executeDemoPhase(1);
        }}
      />
    );
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-[#e5eff7] text-slate-800 overflow-hidden select-none font-sans">
      {/* 1. CLEAN TOP NAVIGATION BAR */}
      <TopBar
        isDemoActive={isDemoActive}
        onToggleDemo={handleToggleDemo}
        onResetDemo={handleResetDemo}
        onGoToLanding={() => setViewMode('landing')}
        showRiskGrid={showRiskGrid}
        showIcebergs={showIcebergs}
        showSafetyCorridor={showSafetyCorridor}
        showGraticule={showGraticule}
        onToggleLayer={(layer) => {
          if (layer === 'corridor') handleToggleLayer('corridor');
          else if (layer === 'grid') handleToggleLayer('grid');
          else if (layer === 'icebergs') handleToggleLayer('icebergs');
          else if (layer === 'graticule') handleToggleLayer('graticule');
        }}
        activeRouteName={activeRoute.name}
        unreadAlertCount={unreadAlerts}
        onOpenAlerts={() => setIntelligenceTab('alerts')}
      />

      {/* 2. MAIN CENTER BODY (Left Floating Card + Canvas Map + Right Panel) */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Floating Navigation Card (Google Maps Directions Style) */}
        <LeftSidebar
          vessel={vessel}
          environment={environment}
          currentRisk={currentRiskScore}
          predictedArrivalRisk={predictedArrivalRiskScore}
          highRiskExposure={activeRoute.highRiskExposurePercent}
          icebergCount={icebergs.length}
          nearestIcebergName={icebergs[0].id}
          nearestIcebergDistKm={18.4}
          activeRouteName={activeRoute.name}
        />

        {/* Center: OpenLayers Antarctic Map (occupies 75-80%+ of screen) */}
        <main className="flex-1 h-full relative overflow-hidden bg-[#e2ebf4]">
          <AntarcticMap
            gridCells={gridCells}
            vessel={vessel}
            icebergs={icebergs}
            routes={routes}
            activeRouteId={activeRouteId}
            selectedWaypointId={selectedWaypoint.id}
            selectedCell={selectedCell}
            timelineStep={timelineStep}
            showRiskGrid={showRiskGrid}
            showIcebergs={showIcebergs}
            showRoutes={showRoutes}
            showSafetyCorridor={showSafetyCorridor}
            showEscapeCorridors={showEscapeCorridors}
            showGraticule={showGraticule}
            onSelectCell={handleSelectCell}
            onSelectWaypoint={handleSelectWaypoint}
            onSelectIceberg={handleSelectIceberg}
            onSelectRoute={handleSelectRoute}
            onSelectShip={handleSelectShip}
            onSelectTurnBack={handleSelectTurnBack}
            onToggleLayer={handleToggleLayer}
          />

          {/* Interactive Floating Google Maps-Style Cards */}
          <FloatingInfoCards
            card={floatingCard}
            onClose={() => setFloatingCard(null)}
            onSelectRoute={handleSelectRoute}
            onOpenEscapeCorridors={() => {
              setShowEscapeCorridors(true);
              setIntelligenceTab('corridors');
            }}
            onOpenIcebergAnalysis={(berg) => {
              handleSelectIceberg(berg);
            }}
          />

          {/* Demo Mode Phase Banner (Clean Google Maps Pill) */}
          {isDemoActive && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 gmap-card px-4 py-2 rounded-full shadow-xl border border-amber-300/80 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-top-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
              <span className="text-amber-800 font-bold uppercase tracking-tight">
                DEMO PHASE {demoPhase}/6:
              </span>
              <span className="text-slate-700 font-medium max-w-md truncate">
                {demoPhase === 1 && '1. MV POLARIS departs in safe Bransfield waters (Route A active)'}
                {demoPhase === 2 && '2. Iceberg ANT-042 detected by SAR; 4D trajectory computed'}
                {demoPhase === 3 && '3. Pack ice field shifts eastward; risk around WP6 rises 48 → 72'}
                {demoPhase === 4 && '4. CRITICAL ALERT: ANT-042 projected route intersection in 2h 17m (76%)'}
                {demoPhase === 5 && '5. LAST SAFE TURN-BACK POINT identified at Waypoint 6 (54% reliability)'}
                {demoPhase === 6 && '6. Autonomous brief recommends Route B; diversion executed, risk drops to 12%'}
              </span>
            </div>
          )}

          {/* 3. BOTTOM FLOATING TIME SIMULATION DOCK */}
          <TimeSimulationBar
            currentStep={timelineStep}
            onSelectStep={setTimelineStep}
            isPlaying={isPlaying}
            onTogglePlay={() => setIsPlaying(!isPlaying)}
            playbackSpeed={playbackSpeed}
            onChangeSpeed={setPlaybackSpeed}
          />
        </main>

        {/* Right Navigation Intelligence Panel (Collapsible Light Cards) */}
        <NavigationIntelligence
          activeTab={intelligenceTab}
          onSelectTab={setIntelligenceTab}
          decisionBrief={decisionBrief}
          routes={routes}
          activeRouteId={activeRouteId}
          onSelectRoute={handleSelectRoute}
          icebergs={icebergs}
          selectedIcebergId={selectedIceberg.id}
          onSelectIceberg={handleSelectIceberg}
          selectedWaypoint={selectedWaypoint}
          onSelectWaypoint={handleSelectWaypoint}
          escapeAnalysis={escapeAnalysis}
          alerts={alerts}
          onAcknowledgeAlert={handleAcknowledgeAlert}
          onDiversionClick={handleDiversionToRouteB}
        />
      </div>
    </div>
  );
};

export default App;
