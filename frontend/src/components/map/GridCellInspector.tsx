import React from 'react';
import { GridCell } from '../../types/navigation';
import { ShieldAlert, Crosshair, Compass, Eye, X, Anchor, ArrowDown, Activity } from 'lucide-react';

interface GridCellInspectorProps {
  cell: GridCell | null;
  onClose: () => void;
}

export const GridCellInspector: React.FC<GridCellInspectorProps> = ({ cell, onClose }) => {
  if (!cell) return null;

  const getRiskBadge = (score: number) => {
    if (score <= 20) return { label: 'SAFE', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (score <= 40) return { label: 'LOW', bg: 'bg-yellow-50 text-yellow-800 border-yellow-200' };
    if (score <= 60) return { label: 'MODERATE', bg: 'bg-orange-50 text-orange-800 border-orange-200' };
    if (score <= 80) return { label: 'HIGH', bg: 'bg-red-50 text-red-700 border-red-200' };
    return { label: 'EXTREME', bg: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  const getRioStyle = (score: number) => {
    if (score >= 0) {
      return {
        label: 'NORMAL OPERATION (RIO ≥ 0)',
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
        text: 'text-emerald-700'
      };
    }
    if (score >= -10) {
      return {
        label: 'ELEVATED RISK (-10 ≤ RIO < 0)',
        bg: 'bg-amber-50 border-amber-200 text-amber-800',
        text: 'text-amber-700'
      };
    }
    return {
      label: 'SUBJECT TO CONSIDERATION (RIO < -10)',
      bg: 'bg-red-50 border-red-200 text-red-800',
      text: 'text-red-700'
    };
  };

  const currentBadge = getRiskBadge(cell.currentRisk);
  const predictedBadge = getRiskBadge(cell.predictedRisk);
  const rioStyle = getRioStyle(cell.rioBaseline);

  return (
    <div className="absolute top-20 left-6 z-40 w-88 max-w-[calc(100vw-3rem)] gmap-card rounded-2xl p-4 shadow-2xl border border-slate-200/90 text-slate-800 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200 select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-bold text-xs">
            🌐
          </div>
          <div>
            <h3 className="font-bold text-xs text-slate-900 leading-tight">
              Grid Cell {cell.cellId}
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">
              {cell.lat.toFixed(2)}°S, {Math.abs(cell.lon).toFixed(2)}°W
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

      {/* 1. POLARIS / RIO BASELINE */}
      <div className="mb-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Anchor className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[10px] uppercase font-bold text-slate-700">
              POLARIS / RIO Baseline
            </span>
          </div>
          <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-semibold">
            PC-6 SIMULATION
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xs text-slate-500">Risk Index Outcome (RIO):</span>
          <span className={`text-base font-bold ${rioStyle.text}`}>
            {cell.rioBaseline > 0 ? `+${cell.rioBaseline}` : cell.rioBaseline}
          </span>
        </div>

        <div className={`text-[10px] px-2 py-0.5 rounded-lg border ${rioStyle.bg} leading-tight text-center font-semibold mb-1`}>
          {rioStyle.label}
        </div>
      </div>

      {/* 2. AI DYNAMIC PREDICTED RISK SCORE */}
      <div className="grid grid-cols-2 gap-2 mb-2.5">
        <div className="bg-white rounded-xl p-2.5 border border-slate-200/80 shadow-xs">
          <div className="text-[9px] uppercase text-slate-400 font-bold mb-0.5">
            Current Risk
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-slate-800">
              {cell.currentRisk}
            </span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full border font-semibold ${currentBadge.bg}`}>
              {currentBadge.label}
            </span>
          </div>
        </div>

        <div className="bg-red-50/70 rounded-xl p-2.5 border border-red-200/80 shadow-xs">
          <div className="text-[9px] uppercase text-red-700 font-bold mb-0.5">
            Predicted Risk
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-lg font-bold text-red-700">
              {cell.predictedRisk}
            </span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded-full border font-semibold ${predictedBadge.bg}`}>
              {predictedBadge.label}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Detailed Telemetry Stats */}
      <div className="space-y-1 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
        <div className="flex items-center justify-between py-0.5">
          <span className="text-slate-500">Ice Concentration</span>
          <span className="font-semibold text-slate-800">{cell.iceConcentration}%</span>
        </div>

        <div className="flex items-center justify-between py-0.5">
          <span className="text-slate-500">Nearest Iceberg</span>
          <span className="font-semibold text-slate-800">
            {cell.nearestIceberg} ({cell.nearestIcebergDistanceKm} km)
          </span>
        </div>

        <div className="flex items-center justify-between py-0.5">
          <span className="text-slate-500">Prediction Confidence</span>
          <span className="font-semibold text-blue-600">{cell.confidence}%</span>
        </div>
      </div>
    </div>
  );
};
