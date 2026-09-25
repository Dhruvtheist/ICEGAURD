import React from 'react';
import { TimelineStep } from '../../types/navigation';
import { Play, Pause, AlertTriangle, Clock } from 'lucide-react';

interface TimeSimulationBarProps {
  currentStep: TimelineStep;
  onSelectStep: (step: TimelineStep) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  playbackSpeed: number;
  onChangeSpeed: (speed: number) => void;
}

const STEPS: TimelineStep[] = ['NOW', '+1H', '+2H', '+3H', '+6H', '+12H'];

export const TimeSimulationBar: React.FC<TimeSimulationBarProps> = ({
  currentStep,
  onSelectStep,
  isPlaying,
  onTogglePlay,
  playbackSpeed,
  onChangeSpeed
}) => {
  return (
    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-30 select-none">
      <div className="gmap-card rounded-2xl px-3.5 py-2 shadow-2xl border border-slate-200/90 flex items-center gap-3 backdrop-blur-md">
        {/* Playback Button */}
        <button
          onClick={onTogglePlay}
          className={`w-9 h-9 rounded-full flex items-center justify-center transition-all shadow-sm ${
            isPlaying
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
          title={isPlaying ? 'Pause Dynamic Ice Simulation' : 'Play Dynamic Ice Simulation'}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Speed Selector */}
        <div className="flex items-center bg-slate-100 rounded-full p-0.5 text-xs font-semibold">
          {[1, 2, 5].map((speed) => (
            <button
              key={speed}
              onClick={() => onChangeSpeed(speed)}
              className={`px-2 py-0.5 rounded-full transition-colors ${
                playbackSpeed === speed
                  ? 'bg-white text-blue-600 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* Dynamic Timeline Scrubber Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-100">
          {STEPS.map((step) => {
            const isActive = currentStep === step;

            return (
              <button
                key={step}
                onClick={() => onSelectStep(step)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {step}
                {/* Milestone indicators */}
                {step === '+2H' && (
                  <span
                    title="Iceberg ANT-042 Route Intersection at +2h 17m"
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"
                  />
                )}
                {step === '+1H' && (
                  <span
                    title="Approaching Last Safe Turn-back at +1h 45m"
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Key Milestone Alerts (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 pl-1 border-l border-slate-200 text-[11px]">
          <div className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200/70 font-medium">
            <AlertTriangle className="w-3 h-3 text-amber-600" />
            <span>+1H 45M: WP6 Turn-Back</span>
          </div>
          <div className="flex items-center gap-1 text-red-700 bg-red-50 px-2 py-1 rounded-lg border border-red-200/70 font-medium">
            <AlertTriangle className="w-3 h-3 text-red-600" />
            <span>+2H 17M: ANT-042</span>
          </div>
        </div>
      </div>
    </div>
  );
};
