import React, { useState } from 'react';
import {
  RouteOption,
  Iceberg,
  Waypoint,
  WaypointEscapeAnalysis,
  NavigationAlert,
  DecisionBrief
} from '../../types/navigation';
import {
  FileText,
  Route,
  TriangleAlert,
  Shield,
  Bell,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Anchor,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface NavigationIntelligenceProps {
  activeTab: 'overview' | 'routes' | 'icebergs' | 'corridors' | 'alerts';
  onSelectTab: (tab: 'overview' | 'routes' | 'icebergs' | 'corridors' | 'alerts') => void;
  decisionBrief: DecisionBrief;
  routes: RouteOption[];
  activeRouteId: string;
  onSelectRoute: (routeId: string) => void;
  icebergs: Iceberg[];
  selectedIcebergId: string;
  onSelectIceberg: (iceberg: Iceberg) => void;
  selectedWaypoint: Waypoint;
  onSelectWaypoint: (waypoint: Waypoint) => void;
  escapeAnalysis: WaypointEscapeAnalysis;
  alerts: NavigationAlert[];
  onAcknowledgeAlert: (alertId: string) => void;
  onDiversionClick: () => void;
}

export const NavigationIntelligence: React.FC<NavigationIntelligenceProps> = ({
  activeTab,
  onSelectTab,
  decisionBrief,
  routes,
  activeRouteId,
  onSelectRoute,
  icebergs,
  selectedIcebergId,
  onSelectIceberg,
  selectedWaypoint,
  onSelectWaypoint,
  escapeAnalysis,
  alerts,
  onAcknowledgeAlert,
  onDiversionClick
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const activeRoute = routes.find((r) => r.id === activeRouteId) || routes[0];
  const unreadAlertsCount = alerts.filter((a) => !a.acknowledged).length;

  if (isCollapsed) {
    return (
      <div className="absolute top-20 right-4 z-30">
        <button
          onClick={() => setIsCollapsed(false)}
          className="gmap-card px-3 py-2.5 rounded-xl shadow-lg border border-slate-200/90 flex items-center gap-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          title="Open Intelligence Panel"
        >
          <ChevronLeft className="w-4 h-4 text-blue-600" />
          <span>Intelligence</span>
          {unreadAlertsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="w-96 max-w-[calc(100vw-2rem)] h-full bg-white/95 border-l border-slate-200/90 flex flex-col z-30 select-none backdrop-blur-md shadow-xl text-slate-800">
      {/* Panel Navigation Tabs (Clean Light Google Style) */}
      <div className="flex items-center justify-between border-b border-slate-200/80 bg-slate-50/90 p-1.5 gap-1">
        <button
          onClick={() => onSelectTab('overview')}
          className={`flex-1 py-1.5 px-2 text-center text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80 font-bold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          onClick={() => onSelectTab('routes')}
          className={`flex-1 py-1.5 px-2 text-center text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'routes'
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80 font-bold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          <Route className="w-3.5 h-3.5" />
          <span>Routes</span>
        </button>

        <button
          onClick={() => onSelectTab('icebergs')}
          className={`flex-1 py-1.5 px-2 text-center text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'icebergs'
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80 font-bold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          <TriangleAlert className="w-3.5 h-3.5 text-amber-500" />
          <span>Icebergs</span>
        </button>

        <button
          onClick={() => onSelectTab('corridors')}
          className={`flex-1 py-1.5 px-2 text-center text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'corridors'
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80 font-bold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Escape</span>
        </button>

        <button
          onClick={() => onSelectTab('alerts')}
          className={`flex-1 py-1.5 px-2 text-center text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 relative ${
            activeTab === 'alerts'
              ? 'bg-white text-blue-600 shadow-sm border border-slate-200/80 font-bold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-red-500" />
          <span>Alerts</span>
          {unreadAlertsCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </button>

        {/* Collapse toggle button */}
        <button
          onClick={() => setIsCollapsed(true)}
          className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50 transition-colors ml-1"
          title="Collapse Panel"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tab Content Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ============================================================== */}
        {/* 1. OVERVIEW TAB: AI Operational Decision Brief */}
        {/* ============================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            {/* AI Decision Brief Card */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm relative">
              <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    AI Decision Brief
                  </span>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {decisionBrief.selectedRoute}
                </span>
              </div>

              <h4 className="font-semibold text-sm text-slate-900 mb-2 leading-snug">
                {decisionBrief.headline}
              </h4>

              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-700 leading-relaxed mb-3">
                "{decisionBrief.body}"
              </div>

              {/* POLARIS / RIO Standardized Baseline Assessment */}
              <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 mb-3 text-xs space-y-1">
                <div className="flex items-center justify-between text-blue-900 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Anchor className="w-3.5 h-3.5 text-blue-600" /> POLARIS / RIO Baseline:
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 bg-blue-100 rounded text-blue-800 font-semibold">
                    IMO PC-6
                  </span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  {decisionBrief.polarisRioSummary}
                </p>
              </div>

              {/* Turn-Back Notice Callout */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 mb-3 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-amber-900">
                  <span className="font-bold text-amber-800 block mb-0.5">CRITICAL DECISION POINT:</span>
                  {decisionBrief.lastSafeTurnBackNotice}
                </div>
              </div>

              {/* Recommended Action */}
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-3">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                  Tactical Action Recommendation
                </span>
                <p className="text-xs font-medium text-slate-800">
                  {decisionBrief.recommendedAction}
                </p>
              </div>

              {/* Action Button */}
              {activeRouteId === 'ROUTE_A' ? (
                <button
                  onClick={onDiversionClick}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                  AUTHORIZE DIVERSION TO ROUTE B
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Course Clears Iceberg ANT-042 Hazard Sector
                </div>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-medium block mb-1">High-Risk Exposure</span>
                <span className="text-xl font-bold text-red-600">{decisionBrief.highRiskExposure}</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Along current track</span>
              </div>
              <div className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs">
                <span className="text-[10px] text-slate-500 uppercase font-medium block mb-1">ANT-042 Collision Risk</span>
                <span className="text-xl font-bold text-amber-600">76%</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">In 2h 17m at WP6</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. ROUTES TAB: Multi-Route Comparative Evaluator */}
        {/* ============================================================== */}
        {activeTab === 'routes' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="text-xs font-medium text-slate-500 pb-1 border-b border-slate-200 flex items-center justify-between">
              <span>AVAILABLE TRANSIT TRACKS</span>
              <span className="text-[10px] text-blue-600 font-semibold">ROUTE COMPARISON</span>
            </div>

            {routes.map((route) => {
              const isSelected = route.id === activeRouteId;
              let badgeColor = 'bg-red-50 text-red-700 border-red-200';
              if (route.riskLevel === 'MODERATE') badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
              if (route.riskLevel === 'LOW') badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';

              const rioColor = route.minRioScore < -10
                ? 'text-red-600'
                : (route.minRioScore < 0 ? 'text-amber-600' : 'text-emerald-600');

              return (
                <div
                  key={route.id}
                  onClick={() => onSelectRoute(route.id)}
                  className={`rounded-2xl border p-3.5 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-blue-50/40 border-blue-500 shadow-md ring-1 ring-blue-500/20'
                      : 'bg-white border-slate-200/80 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{route.name}</span>
                      {isSelected && (
                        <span className="px-2 py-0.2 text-[9px] font-bold bg-blue-600 text-white rounded-full">
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                      {route.riskLevel} RISK
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">
                    {route.description}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-medium block">Travel Time</span>
                      <span className="font-bold text-slate-800">{route.travelTime}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-medium block">Fuel Budget</span>
                      <span className="font-bold text-slate-800">+{route.fuelPercent}%</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase font-medium block">Risk Exposure</span>
                      <span className={`font-bold ${route.highRiskExposurePercent > 20 ? 'text-red-600' : 'text-slate-800'}`}>
                        {route.highRiskExposurePercent}%
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-slate-500 block text-[10px]">Min POLARIS RIO:</span>
                      <span className={`font-bold ${rioColor}`}>
                        {route.minRioScore > 0 ? `+${route.minRioScore}` : route.minRioScore}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-500 block text-[10px]">Nearest Berg CPA:</span>
                      <span className={`font-bold ${route.cpaNearestIcebergNm < 1.0 ? 'text-red-600' : 'text-emerald-700'}`}>
                        {route.cpaNearestIcebergNm} NM
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ============================================================== */}
        {/* 3. ICEBERGS TAB: Iceberg Tracking & 4D Trajectory */}
        {/* ============================================================== */}
        {activeTab === 'icebergs' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="text-xs font-medium text-slate-500 pb-1 border-b border-slate-200 flex items-center justify-between">
              <span>RADAR TRACKED TARGETS</span>
              <span className="text-[10px] text-amber-600 font-semibold">{icebergs.length} DETECTED</span>
            </div>

            {/* Primary Threat Deep-Dive: ANT-042 */}
            {icebergs
              .filter((b) => b.id === 'ANT-042')
              .map((berg) => (
                <div
                  key={berg.id}
                  onClick={() => onSelectIceberg(berg)}
                  className="bg-red-50/60 rounded-2xl border border-red-200 p-3.5 space-y-3 cursor-pointer shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
                      <span className="font-bold text-sm text-red-900">
                        {berg.id} — {berg.classification}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-red-100 border border-red-300 text-red-700 rounded-full">
                      CRITICAL THREAT
                    </span>
                  </div>

                  <div className="bg-white rounded-xl p-2.5 border border-red-100 text-xs space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Dimensions:</span>
                      <span className="font-semibold text-slate-800">{berg.sizeMeters.length}m × {berg.sizeMeters.width}m</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Drift Velocity:</span>
                      <span className="font-semibold text-blue-600">{berg.velocityMs} m/s ({berg.velocityKnots} kn) @ {berg.directionDeg}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Prediction Confidence:</span>
                      <span className="font-bold text-slate-800">{berg.predictionConfidence}%</span>
                    </div>
                  </div>

                  <div className="bg-red-100/80 p-2.5 rounded-xl border border-red-200 text-xs">
                    <span className="font-bold text-red-900 block mb-1">
                      ROUTE A INTERACTION PROBABILITY: {berg.shipInteraction.probabilityPercent}%
                    </span>
                    <div className="flex justify-between text-[11px] text-red-800">
                      <span>Intersection Horizon:</span>
                      <span className="font-bold">{berg.shipInteraction.timeToIntersection}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-red-800">
                      <span>CPA on Route A:</span>
                      <span className="font-bold">{berg.shipInteraction.cpaDistanceNm} NM</span>
                    </div>
                  </div>
                </div>
              ))}

            {/* Other Tracked Icebergs */}
            <div className="space-y-2 pt-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Secondary Targets
              </span>
              {icebergs
                .filter((b) => b.id !== 'ANT-042')
                .map((berg) => (
                  <div
                    key={berg.id}
                    onClick={() => onSelectIceberg(berg)}
                    className="bg-white hover:bg-slate-50 rounded-xl border border-slate-200/80 p-2.5 cursor-pointer text-xs transition-colors shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">{berg.id} ({berg.classification.split(' ')[0]})</span>
                      <span className="text-[10px] text-slate-500">{berg.riskLevel}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>{berg.velocityKnots} kn @ {berg.directionDeg}°</span>
                      <span>Confidence: {berg.predictionConfidence}%</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 4. ESCAPE CORRIDORS TAB: Retreat Feasibility & Turn-Back Point */}
        {/* ============================================================== */}
        {activeTab === 'corridors' && (
          <div className="space-y-3.5 animate-in fade-in duration-150">
            <div className="text-xs font-medium text-slate-500 pb-1 border-b border-slate-200 flex items-center justify-between">
              <span>ESCAPE CORRIDOR ANALYSIS</span>
              <span className="text-[10px] text-emerald-600 font-semibold">RETREAT INTEGRITY</span>
            </div>

            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs text-slate-700">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Polar Retreat Philosophy
              </span>
              "How far can I safely continue before I lose the ability to retreat?"
            </div>

            {/* Waypoint Route Progression Line */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400">
                Route Waypoints & Escape Reliability
              </span>
              <div className="space-y-1.5 text-xs">
                {activeRoute.waypoints.map((wp) => {
                  const isSelected = wp.id === selectedWaypoint.id;
                  const isTurnBack = wp.isLastSafeTurnBack;

                  let relBadge = 'text-emerald-700 bg-emerald-50 border-emerald-200';
                  if (wp.escapeReliability < 50) relBadge = 'text-red-700 bg-red-50 border-red-200';
                  else if (wp.escapeReliability < 80) relBadge = 'text-amber-700 bg-amber-50 border-amber-200';

                  return (
                    <div
                      key={wp.id}
                      onClick={() => onSelectWaypoint(wp)}
                      className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        isTurnBack
                          ? 'bg-amber-50/80 border-amber-300 hover:border-amber-400'
                          : isSelected
                          ? 'bg-blue-50 border-blue-400 shadow-xs'
                          : 'bg-white border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isTurnBack ? (
                          <span className="text-amber-500 font-bold">↩</span>
                        ) : wp.escapeReliability > 80 ? (
                          <span className="text-emerald-600 font-bold">✓</span>
                        ) : (
                          <span className="text-red-500 font-bold">✕</span>
                        )}
                        <div>
                          <span className="font-semibold text-slate-900 block">
                            {wp.id} — {wp.name}
                          </span>
                          {isTurnBack && (
                            <span className="text-[9px] font-bold text-amber-700 uppercase">
                              ★ LAST SAFE TURN-BACK POINT
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${relBadge}`}>
                          {wp.escapeReliability}%
                        </span>
                        <span className="block text-[10px] text-slate-400 mt-0.5">
                          {wp.rioBaseline !== undefined ? `RIO: ${wp.rioBaseline > 0 ? '+' : ''}${wp.rioBaseline}` : ''}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Waypoint Retreat Simulation Box */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-3.5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">
                  RETREAT SIMULATION — {selectedWaypoint.id}
                </span>
                <span className="text-xs text-blue-600 font-bold">
                  Reliability: {escapeAnalysis.escapeReliabilityPercent}%
                </span>
              </div>

              {/* Scenarios 1 to 5 */}
              <div className="space-y-1 text-xs">
                {escapeAnalysis.simulatedScenarios.map((sc) => (
                  <div
                    key={sc.id}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100"
                  >
                    <span className="text-slate-700">Scenario {sc.id}: {sc.name.split('(')[0]}</span>
                    <span className={`font-bold ${sc.pass ? 'text-emerald-600' : 'text-red-600'}`}>
                      {sc.pass ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Retreat Budgets */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-xs text-center">
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 uppercase font-medium block">Time Budget</span>
                  <span className="font-bold text-slate-800">{escapeAnalysis.returnTimeBudgetMin} min</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 uppercase font-medium block">Fuel Budget</span>
                  <span className="font-bold text-slate-800">{escapeAnalysis.fuelBudgetPercent}%</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <span className="text-[9px] text-slate-400 uppercase font-medium block">Open Water</span>
                  <span className="font-bold text-slate-800">{escapeAnalysis.distanceToOpenWaterKm} km</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* 5. ALERTS TAB: Real-Time Tactical Warning System */}
        {/* ============================================================== */}
        {activeTab === 'alerts' && (
          <div className="space-y-3 animate-in fade-in duration-150">
            <div className="text-xs font-medium text-slate-500 pb-1 border-b border-slate-200 flex items-center justify-between">
              <span>INCIDENT LOG</span>
              <span className="text-[10px] text-blue-600 font-semibold">LIVE FEED</span>
            </div>

            {alerts.map((alert) => {
              let borderClass = 'border-amber-200 bg-amber-50/50';
              let badgeText = 'ADVISORY';
              let badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';

              if (alert.priority === 'CRITICAL') {
                borderClass = 'border-red-200 bg-red-50/60';
                badgeText = 'CRITICAL';
                badgeColor = 'bg-red-100 text-red-700 border-red-200';
              } else if (alert.priority === 'WARNING') {
                borderClass = 'border-orange-200 bg-orange-50/50';
                badgeText = 'WARNING';
                badgeColor = 'bg-orange-100 text-orange-800 border-orange-200';
              }

              return (
                <div
                  key={alert.id}
                  className={`rounded-2xl border p-3.5 text-xs space-y-2 transition-all ${borderClass}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${badgeColor}`}>
                      {badgeText}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{alert.timestamp}</span>
                  </div>

                  <h5 className="font-bold text-slate-900">{alert.title}</h5>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {alert.coordinates ? `${alert.coordinates.lat.toFixed(2)}°S, ${Math.abs(alert.coordinates.lon).toFixed(2)}°W` : 'SECTOR GENERAL'}
                    </span>
                    <button
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      className={`text-[10px] px-2.5 py-1 rounded-full font-semibold transition-colors ${
                        alert.acknowledged
                          ? 'text-slate-400 bg-slate-100'
                          : 'text-blue-700 bg-blue-100 hover:bg-blue-200'
                      }`}
                    >
                      {alert.acknowledged ? '✓ Acknowledged' : 'Acknowledge'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
