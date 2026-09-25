import React, { useState, useEffect } from 'react';
import {
  Compass,
  Layers,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  Home,
  Bell,
  CheckCircle2,
  Activity
} from 'lucide-react';

interface TopBarProps {
  isDemoActive: boolean;
  onToggleDemo: () => void;
  onResetDemo: () => void;
  onGoToLanding: () => void;
  showRiskGrid: boolean;
  showIcebergs: boolean;
  showSafetyCorridor: boolean;
  showGraticule: boolean;
  onToggleLayer: (layer: 'grid' | 'icebergs' | 'corridor' | 'graticule') => void;
  activeRouteName: string;
  unreadAlertCount?: number;
  onOpenAlerts?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  isDemoActive,
  onToggleDemo,
  onResetDemo,
  onGoToLanding,
  showRiskGrid,
  showIcebergs,
  showSafetyCorridor,
  showGraticule,
  onToggleLayer,
  activeRouteName,
  unreadAlertCount = 1,
  onOpenAlerts
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [utcTime, setUtcTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getUTCHours().toString().padStart(2, '0');
      const minutes = now.getUTCMinutes().toString().padStart(2, '0');
      setUtcTime(`${hours}:${minutes} UTC`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="h-14 bg-white/95 border-b border-slate-200/90 px-4 flex items-center justify-between z-40 select-none backdrop-blur-md shadow-xs">
      {/* Left: Branding & Subtitle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onGoToLanding}
          className="flex items-center gap-2.5 group transition-opacity"
          title="Return to Mission Overview Portal"
        >
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
            <Compass className="w-4 h-4" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-slate-900 leading-none">
                ICEGUARD
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                AI Navigation
              </span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 font-normal">
              AI Antarctic Navigation & Ice Risk Intelligence
            </div>
          </div>
        </button>
      </div>

      {/* Center / Right: Clean Navigation Badges & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Subtle Live Status Pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-xs text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-800">Live</span>
          <span className="text-slate-400">•</span>
          <span className="font-mono text-slate-500">{utcTime || '10:42 UTC'}</span>
        </div>

        {/* Layers Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
              showLayerMenu
                ? 'bg-blue-50 border-blue-300 text-blue-700 shadow-xs'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>Layers</span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 gmap-card rounded-2xl border border-slate-200/90 shadow-2xl p-3 z-50 text-xs space-y-2 backdrop-blur-md animate-in fade-in duration-150">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
                Navigation Overlays
              </div>
              <label className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg">
                <span className="text-slate-700 font-medium">Dynamic Risk Field</span>
                <input
                  type="checkbox"
                  checked={showRiskGrid}
                  onChange={() => onToggleLayer('grid')}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg">
                <span className="text-slate-700 font-medium">Iceberg Trajectories</span>
                <input
                  type="checkbox"
                  checked={showIcebergs}
                  onChange={() => onToggleLayer('icebergs')}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg">
                <span className="text-slate-700 font-medium">Ship Safety Radius</span>
                <input
                  type="checkbox"
                  checked={showSafetyCorridor}
                  onChange={() => onToggleLayer('corridor')}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </label>
              <label className="flex items-center justify-between cursor-pointer hover:bg-slate-50 p-1.5 rounded-lg">
                <span className="text-slate-700 font-medium">Polar Graticule</span>
                <input
                  type="checkbox"
                  checked={showGraticule}
                  onChange={() => onToggleLayer('graticule')}
                  className="rounded border-slate-300 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </label>
            </div>
          )}
        </div>

        {/* Alerts Pill */}
        {onOpenAlerts && (
          <button
            onClick={onOpenAlerts}
            className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors"
          >
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span>Alerts</span>
            {unreadAlertCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                {unreadAlertCount}
              </span>
            )}
          </button>
        )}

        {/* 5-Min Demo Simulation Button */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-0.5 rounded-full">
          <button
            onClick={onToggleDemo}
            className={`px-3 py-1.5 rounded-full text-xs font-bold tracking-tight flex items-center gap-1.5 transition-all ${
              isDemoActive
                ? 'bg-amber-500 text-white shadow-md animate-pulse'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
            }`}
          >
            <Play className={`w-3 h-3 ${isDemoActive ? 'fill-white' : 'fill-white'}`} />
            <span>{isDemoActive ? 'Demo Active' : 'Demo'}</span>
          </button>

          {isDemoActive && (
            <button
              onClick={onResetDemo}
              title="Reset Demo Scenario"
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-200 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Audio Mute/Unmute */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          title={soundEnabled ? 'Mute Alert Chimes' : 'Enable Alert Chimes'}
          className="p-2 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-slate-700" /> : <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
        </button>

        {/* Home Link */}
        <button
          onClick={onGoToLanding}
          title="Return to Mission Overview Portal"
          className="p-2 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
        >
          <Home className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
