import React from 'react';
import {
  ShipTelemetry,
  Iceberg,
  RouteOption,
  Waypoint,
  GridCell
} from '../../types/navigation';
import {
  Navigation,
  X,
  AlertTriangle,
  Route,
  Anchor,
  Compass,
  ArrowRight,
  Shield,
  Clock,
  Eye
} from 'lucide-react';

export type FloatingCardType =
  | { type: 'ship'; vessel: ShipTelemetry; currentRisk: number; arrivalRisk: number }
  | { type: 'iceberg'; iceberg: Iceberg }
  | { type: 'route'; route: RouteOption; isActive: boolean }
  | { type: 'turnback'; waypoint: Waypoint }
  | { type: 'cell'; cell: GridCell };

interface FloatingInfoCardsProps {
  card: FloatingCardType | null;
  onClose: () => void;
  onSelectRoute?: (routeId: string) => void;
  onOpenEscapeCorridors?: () => void;
  onOpenIcebergAnalysis?: (iceberg: Iceberg) => void;
}

export const FloatingInfoCards: React.FC<FloatingInfoCardsProps> = ({
  card,
  onClose,
  onSelectRoute,
  onOpenEscapeCorridors,
  onOpenIcebergAnalysis
}) => {
  if (!card) return null;

  return (
    <div className="absolute top-20 left-6 z-40 w-84 max-w-[calc(100vw-3rem)] gmap-card rounded-2xl p-4 shadow-2xl border border-slate-200/90 text-slate-800 animate-in fade-in slide-in-from-top-2 duration-200 select-none">
      {/* 1. SHIP FLOATING CARD */}
      {card.type === 'ship' && (
        <div>
          <div className="flex items-start justify-between pb-2 mb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                <Navigation className="w-4 h-4 fill-current transform rotate-45" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 leading-tight">
                  {card.vessel.name}
                </h3>
                <span className="text-[11px] font-medium text-slate-500">
                  {card.vessel.iceClass.split(' ')[0]} • Call {card.vessel.callSign}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium block">Speed</span>
                <span className="text-base font-bold text-slate-800">{card.vessel.speedKnots} kn</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium block">Heading</span>
                <span className="text-base font-bold text-blue-600">{card.vessel.headingDeg.toString().padStart(3, '0')}°</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-amber-50/80 border border-amber-200/80">
                <span className="text-[10px] text-amber-800 font-medium uppercase block">Current Risk</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-bold text-amber-700">{card.currentRisk}</span>
                  <span className="text-[10px] text-amber-700 font-semibold">Low</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-red-50/80 border border-red-200/80">
                <span className="text-[10px] text-red-800 font-medium uppercase block">Arrival Risk</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-lg font-bold text-red-700">{card.arrivalRisk}</span>
                  <span className="text-[10px] text-red-700 font-semibold">High</span>
                </div>
              </div>
            </div>

            <div className="pt-1 text-[11px] text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-medium text-slate-800">{card.vessel.destination.split('(')[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Coordinates:</span>
                <span className="font-mono text-slate-700">
                  {Math.abs(card.vessel.currentLat).toFixed(2)}°S, {Math.abs(card.vessel.currentLon).toFixed(2)}°W
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. ICEBERG FLOATING CARD */}
      {card.type === 'iceberg' && (
        <div>
          <div className="flex items-start justify-between pb-2 mb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ${
                card.iceberg.riskLevel === 'EXTREME'
                  ? 'bg-red-100 text-red-600 border border-red-200'
                  : 'bg-amber-100 text-amber-700 border border-amber-200'
              }`}>
                🧊
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-900 leading-tight">
                  ICEBERG {card.iceberg.id}
                </h3>
                <span className="text-[11px] font-medium text-slate-500">
                  {card.iceberg.classification}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium block">Size</span>
                <span className="font-bold text-slate-800">
                  {card.iceberg.sizeMeters.length}m × {card.iceberg.sizeMeters.width}m
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-medium block">Speed</span>
                <span className="font-bold text-slate-800">
                  {card.iceberg.velocityMs} m/s ({card.iceberg.velocityKnots} kn)
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-slate-100 text-[11px]">
              <span className="text-slate-500">Drift Direction</span>
              <span className="font-semibold text-slate-800">{card.iceberg.directionDeg}° (North-East)</span>
            </div>

            {/* Interaction details */}
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-900">
              <div className="flex items-center justify-between font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                  Collision Probability:
                </span>
                <span className="text-sm font-bold text-red-700">{card.iceberg.shipInteraction.probabilityPercent}%</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-red-800">
                <span>Intersection Horizon:</span>
                <span className="font-bold">{card.iceberg.shipInteraction.timeToIntersection}</span>
              </div>
            </div>

            {onOpenIcebergAnalysis && (
              <button
                onClick={() => onOpenIcebergAnalysis(card.iceberg)}
                className="w-full mt-1 py-1.5 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>View 4D Trajectory & Risk</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. ROUTE FLOATING CARD */}
      {card.type === 'route' && (
        <div>
          <div className="flex items-start justify-between pb-2 mb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm">
                <Route className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">
                    {card.route.name}
                  </h3>
                  {card.isActive && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-blue-600 text-white">
                      ACTIVE
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500 font-medium">
                  {card.route.tag} Navigation Track
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-600 mb-2.5 leading-relaxed">
            {card.route.description}
          </p>

          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center mb-2.5">
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-medium block">Travel Time</span>
              <span className="font-bold text-slate-800 text-xs">{card.route.travelTime}</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-medium block">Fuel Budget</span>
              <span className="font-bold text-slate-800 text-xs">+{card.route.fuelPercent}%</span>
            </div>
            <div>
              <span className="text-[9px] text-slate-400 uppercase font-medium block">Risk Exposure</span>
              <span className={`font-bold text-xs ${card.route.highRiskExposurePercent > 20 ? 'text-red-600' : 'text-emerald-600'}`}>
                {card.route.highRiskExposurePercent}%
              </span>
            </div>
          </div>

          {!card.isActive && onSelectRoute && (
            <button
              onClick={() => onSelectRoute(card.route.id)}
              className="w-full py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Switch to this Route</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* 4. LAST SAFE TURN-BACK POINT FLOATING CARD */}
      {card.type === 'turnback' && (
        <div>
          <div className="flex items-start justify-between pb-2 mb-2 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                ↩
              </div>
              <div>
                <h3 className="font-bold text-xs text-amber-900 leading-tight">
                  LAST SAFE TURN-BACK POINT
                </h3>
                <span className="text-[10px] font-semibold text-amber-700">
                  {card.waypoint.name} ({card.waypoint.id})
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-2 rounded-lg bg-amber-50/90 border border-amber-200/90 mb-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-amber-800 font-medium">Escape Reliability:</span>
              <span className="text-sm font-bold text-amber-700">{card.waypoint.escapeReliability}%</span>
            </div>
            <p className="text-[11px] text-amber-900 leading-snug">
              "After this point, a reliable return to safer water may no longer be possible."
            </p>
          </div>

          {onOpenEscapeCorridors && (
            <button
              onClick={onOpenEscapeCorridors}
              className="w-full py-1.5 px-3 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <Shield className="w-3 h-3" />
              <span>Show Escape Corridors</span>
            </button>
          )}
        </div>
      )}

      {/* 5. GRID CELL INSPECTOR FLOATING CARD */}
      {card.type === 'cell' && (
        <div>
          <div className="flex items-start justify-between pb-2 mb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 font-bold text-xs">
                🌐
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-900 leading-tight">
                  Grid Sector {card.cell.cellId}
                </h3>
                <span className="text-[10px] text-slate-500 font-mono">
                  {card.cell.lat.toFixed(2)}°S, {Math.abs(card.cell.lon).toFixed(2)}°W
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-[9px] text-slate-500 uppercase block">Current Risk</span>
                <span className="text-base font-bold text-slate-800">{card.cell.currentRisk}</span>
              </div>
              <div className="p-2 rounded-xl bg-red-50 border border-red-100">
                <span className="text-[9px] text-red-600 uppercase block">Predicted Risk</span>
                <span className="text-base font-bold text-red-600">{card.cell.predictedRisk}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Ice Concentration:</span>
                <span className="font-semibold text-slate-800">{card.cell.iceConcentration}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">POLARIS RIO:</span>
                <span className={`font-semibold ${card.cell.rioBaseline >= 0 ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {card.cell.rioBaseline > 0 ? `+${card.cell.rioBaseline}` : card.cell.rioBaseline}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Nearest Iceberg:</span>
                <span className="font-semibold text-slate-800">{card.cell.nearestIceberg} ({card.cell.nearestIcebergDistanceKm} km)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Confidence:</span>
                <span className="font-semibold text-blue-600">{card.cell.confidence}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
