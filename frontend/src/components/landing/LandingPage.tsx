import React from 'react';
import {
  Compass,
  ShieldAlert,
  ArrowRight,
  Play,
  Anchor,
  Radio,
  Clock,
  Waves,
  Sparkles,
  RotateCcw
} from 'lucide-react';

interface LandingPageProps {
  onEnterCommandCenter: () => void;
  onLaunchSimulation: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterCommandCenter,
  onLaunchSimulation
}) => {
  return (
    <div className="relative w-full min-h-screen bg-polar-950 text-slate-100 flex flex-col justify-between overflow-x-hidden selection:bg-ice-cyan selection:text-polar-950">
      {/* Background Polar Radar Grid Effect */}
      <div className="absolute inset-0 pointer-events-none opacity-25">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 30%, rgba(56, 189, 248, 0.12) 0%, transparent 60%),
              linear-gradient(to right, rgba(56, 189, 248, 0.05) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(56, 189, 248, 0.05) 1px, transparent 1px)`,
            backgroundSize: '100% 100%, 60px 60px, 60px 60px',
          }}
        />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full px-6 py-5 border-b border-polar-800/80 flex items-center justify-between backdrop-blur-md bg-polar-950/60">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-300/40">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-black text-xl tracking-widest text-white leading-none">
                polarEye
              </span>
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-ice-cyan/15 text-ice-neon border border-ice-cyan/40 rounded">
                OPERATIONAL
              </span>
            </div>
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Antarctic Maritime Decision-Support Platform
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 font-mono text-xs">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded bg-polar-900 border border-polar-800 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-ice-cyan animate-pulse" />
            <span>SECTOR: 64°S–68°S PENINSULA</span>
          </div>
          <button
            onClick={onEnterCommandCenter}
            className="px-4 py-2 rounded bg-ice-cyan/15 hover:bg-ice-cyan/25 text-ice-neon border border-ice-cyan/40 font-bold transition-all"
          >
            LAUNCH CONSOLE
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-6 py-12 lg:py-16 flex flex-col justify-center items-center text-center">
        {/* Polar Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-polar-900 border border-ice-cyan/40 text-ice-cyan font-mono text-xs mb-8 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-ice-cyan animate-ping" />
          <span>EPSG:3031 POLAR STEREOGRAPHIC ICE INTELLIGENCE</span>
        </div>

        {/* Primary Headline */}
        <h1 className="font-sans font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white tracking-tight mb-6 leading-[1.08]">
          Predict the Ice.
          <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
            Navigate the Future.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl text-slate-300 font-sans text-base sm:text-lg lg:text-xl leading-relaxed mb-10 text-balance">
          AI-powered Antarctic navigation intelligence that predicts evolving ice risk,
          identifies last-safe turn-back points, and helps crews evaluate safer routes.
        </p>

        {/* Call to Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-14 w-full sm:w-auto">
          <button
            onClick={onEnterCommandCenter}
            className="w-full sm:w-auto px-8 py-4 rounded bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-polar-950 font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-3 shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5"
          >
            <span>ENTER COMMAND CENTER</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onLaunchSimulation}
            className="w-full sm:w-auto px-8 py-4 rounded bg-polar-900/90 hover:bg-polar-800 text-white border border-polar-700 hover:border-ice-cyan font-mono font-semibold text-sm tracking-wider flex items-center justify-center gap-3 shadow-lg transition-all"
          >
            <Play className="w-4 h-4 fill-ice-cyan text-ice-cyan" />
            <span>VIEW 5-MIN SIMULATION</span>
          </button>
        </div>

        {/* Core Manifesto Box */}
        <div className="max-w-3xl w-full p-6 sm:p-8 rounded-lg bg-polar-900/80 border border-polar-700/80 text-left font-mono text-xs sm:text-sm text-slate-300 space-y-3 shadow-2xl relative overflow-hidden backdrop-blur-md">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-cyan-400 to-blue-600" />
          <div className="text-[11px] uppercase tracking-widest text-ice-neon font-bold">
            The polarEye Core Philosophy
          </div>
          <p className="text-white text-base sm:text-lg font-medium font-sans">
            "We don't just show where the ice is."
          </p>
          <p className="text-slate-300 leading-relaxed font-sans text-sm sm:text-base">
            "We predict where the ocean will become dangerous when the ship reaches it.
            Then we determine whether the ship still has a reliable escape corridor — and identify the last point where turning back remains feasible."
          </p>
        </div>

        {/* Key Feature Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-12 w-full text-left font-mono">
          <div className="p-5 rounded bg-polar-900/60 border border-polar-800 hover:border-polar-700 transition-colors">
            <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mb-3 text-ice-cyan">
              <Clock className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm mb-1.5 font-sans">Time-Aware Dynamic Risk</h4>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Calculates evolving risk at the ship's arrival horizon rather than static snapshots.
            </p>
          </div>

          <div className="p-5 rounded bg-polar-900/60 border border-polar-800 hover:border-polar-700 transition-colors">
            <div className="w-8 h-8 rounded bg-amber-950/80 border border-amber-500/40 flex items-center justify-center mb-3 text-amber-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm mb-1.5 font-sans">Last Safe Turn-Back Point</h4>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Monte Carlo simulation of retreat corridors back to open water before ice traps the vessel.
            </p>
          </div>

          <div className="p-5 rounded bg-polar-900/60 border border-polar-800 hover:border-polar-700 transition-colors">
            <div className="w-8 h-8 rounded bg-blue-950/80 border border-blue-500/40 flex items-center justify-center mb-3 text-sky-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-white text-sm mb-1.5 font-sans">4D Trajectory Cones</h4>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Synthesizes ocean currents, wind drift, and SAR kinematics with expanding uncertainty cones.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-4 border-t border-polar-800/80 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-2 backdrop-blur-md bg-polar-950/60">
        <div>polarEye • Polar Class PC-6 Decision Support System</div>
        <div>Active Sector: Antarctic Peninsula • Rothera Station Corridor</div>
      </footer>
    </div>
  );
};
