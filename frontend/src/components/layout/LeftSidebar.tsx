import React, { useState } from 'react';
import {
  ShipTelemetry,
  PolarEnvironment
} from '../../types/navigation';
import {
  Navigation,
  MapPin,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Anchor,
  Wind,
  Waves,
  Thermometer,
  ShieldAlert,
  SlidersHorizontal
} from 'lucide-react';

interface LeftSidebarProps {
  vessel: ShipTelemetry;
  environment: PolarEnvironment;
  currentRisk: number;
  predictedArrivalRisk: number;
  highRiskExposure: number;
  icebergCount: number;
  nearestIcebergName: string;
  nearestIcebergDistKm: number;
  activeRouteName: string;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  vessel,
  environment,
  currentRisk,
  predictedArrivalRisk,
  highRiskExposure,
  icebergCount,
  nearestIcebergName,
  nearestIcebergDistKm,
  activeRouteName
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const getRiskBadge = (score: number) => {
    if (score <= 20) return { label: 'Safe', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (score <= 40) return { label: 'Low', bg: 'bg-yellow-50 text-yellow-800 border-yellow-200' };
    if (score <= 60) return { label: 'Moderate', bg: 'bg-orange-50 text-orange-800 border-orange-200' };
    if (score <= 80) return { label: 'High', bg: 'bg-red-50 text-red-700 border-red-200' };
    return { label: 'Extreme', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  const currBadge = getRiskBadge(currentRisk);
  const arrBadge = getRiskBadge(predictedArrivalRisk);

  if (isMinimized) {
    return (
      <div className="absolute top-4 left-4 z-30">
        <button
          onClick={() => setIsMinimized(false)}
          className="gmap-pill px-3.5 py-2 rounded-full shadow-lg border border-slate-200/90 flex items-center gap-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all"
          title="Open Navigation Summary"
        >
          <Navigation className="w-4 h-4 text-blue-600 fill-current transform rotate-45" />
          <span>{vessel.name} ({vessel.speedKnots} kn)</span>
          <span className="w-2 h-2 rounded-full bg-blue-600" />
        </button>
      </div>
    );
  }

  return (
    <aside className="absolute top-4 left-4 z-30 w-80 max-w-[calc(100vw-2rem)] gmap-card rounded-2xl p-4 shadow-xl border border-slate-200/90 text-slate-800 backdrop-blur-md select-none animate-in fade-in slide-in-from-left-2 duration-200">
      {/* 1. COMPACT SHIP & DESTINATION HEADER (Google Maps Style) */}
      <div className="flex items-start justify-between pb-2.5 mb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-sm shrink-0">
            <Navigation className="w-4 h-4 fill-current transform rotate-45" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              SHIP
            </div>
            <div className="font-bold text-sm text-slate-900 leading-tight">
              {vessel.name}
            </div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">
              {vessel.speedKnots} kn • Heading {vessel.headingDeg.toString().padStart(3, '0')}°
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsMinimized(true)}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
          title="Minimize Card"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
      </div>

      {/* 2. DESTINATION */}
      <div className="mb-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100/90">
        <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5 mb-1">
          <MapPin className="w-3.5 h-3.5 text-red-500" />
          DESTINATION
        </div>
        <div className="font-semibold text-xs text-slate-900 leading-snug">
          {vessel.destination.split('(')[0]}
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
          <span>Active Route:</span>
          <span className="font-medium text-blue-600">{activeRouteName}</span>
        </div>
      </div>

      {/* 3. CURRENT RISK vs ARRIVAL RISK */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
            CURRENT RISK
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-800">{currentRisk}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${currBadge.bg}`}>
              {currBadge.label}
            </span>
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-red-50/70 border border-red-200/80 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-red-700 block mb-0.5">
            ARRIVAL RISK
          </span>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-red-700">{predictedArrivalRisk}</span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${arrBadge.bg}`}>
              {arrBadge.label}
            </span>
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div className="flex items-center justify-between text-[11px] text-slate-600 px-1 pb-2 border-b border-slate-100">
        <span>High-Risk Exposure:</span>
        <span className={`font-semibold ${highRiskExposure > 20 ? 'text-red-600' : 'text-slate-800'}`}>
          {highRiskExposure}% of Route
        </span>
      </div>

      {/* 4. EXPANDABLE DRAWER FOR FULL POLARIS/RIO & ENVIRONMENTAL SENSORS */}
      <div className="pt-2">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
            <span>Environmental Sensors & POLARIS</span>
          </span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isExpanded && (
          <div className="mt-2.5 space-y-2.5 text-xs text-slate-700 animate-in fade-in duration-150">
            {/* POLARIS / RIO baseline card */}
            <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[11px] text-blue-900 flex items-center gap-1">
                  <Anchor className="w-3.5 h-3.5 text-blue-600" />
                  POLARIS / RIO Baseline
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-semibold">
                  IMO PC-6
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1 text-[11px]">
                <div>
                  <span className="text-slate-500 block text-[10px]">Current Sector:</span>
                  <span className="font-bold text-emerald-700">+4.2 RIO (Normal)</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">At WP6 Arrival:</span>
                  <span className="font-bold text-red-600">-6.8 RIO (Elevated)</span>
                </div>
              </div>
            </div>

            {/* Environmental sensors grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-600">
                <ShieldAlert className="w-3.5 h-3.5 text-blue-500" />
                <span>Ice Conc: <b>{environment.seaIceConcentrationPercent}%</b></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Wind className="w-3.5 h-3.5 text-cyan-600" />
                <span>Wind: <b>{environment.windSpeedKnots} kn</b></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Waves className="w-3.5 h-3.5 text-blue-600" />
                <span>Wave: <b>{environment.significantWaveHeightM}m</b></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <Thermometer className="w-3.5 h-3.5 text-sky-600" />
                <span>Air: <b>{environment.ambientAirTempC}°C</b></span>
              </div>
            </div>

            {/* Nearest Iceberg */}
            <div className="flex items-center justify-between text-[11px] text-slate-600 px-1">
              <span>Nearest Iceberg:</span>
              <span className="font-bold text-red-600">
                {nearestIcebergName} ({nearestIcebergDistKm} km)
              </span>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
