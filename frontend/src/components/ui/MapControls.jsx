import React from 'react';
import { Plus, Minus, Navigation, Crosshair } from 'lucide-react';

export function MapControls({
  onZoomIn,
  onZoomOut,
  compassHeading = 0,
  onResetNorth,
  is3DMode = true,
  onToggle2D3D,
  onResetLocation
}) {
  return (
    <div className="absolute right-4 bottom-10 z-30 flex flex-col items-center gap-2 select-none">
      <button
        type="button"
        onClick={onResetNorth}
        className="google-btn-round"
        title="Reset North orientation"
        aria-label="Reset North"
      >
        <Navigation
          className="w-5 h-5 text-[#ea4335] transition-transform duration-200"
          style={{ transform: `rotate(${-compassHeading}deg)` }}
        />
      </button>

      <button
        type="button"
        onClick={onToggle2D3D}
        className="google-btn-round font-bold text-xs"
        title={is3DMode ? 'Switch to 2D Top View' : 'Switch to 3D Perspective'}
        aria-label="Toggle 2D/3D"
      >
        <span className={is3DMode ? 'text-[#1a73e8]' : 'text-[#5f6368]'}>
          {is3DMode ? '3D' : '2D'}
        </span>
      </button>

      <button
        type="button"
        onClick={onResetLocation}
        className="google-btn-round"
        title="Fly to PDEU UG Boys Hostel anchor site"
        aria-label="Fly to Anchor"
      >
        <Crosshair className="w-5 h-5 text-[#5f6368] hover:text-[#1a73e8]" />
      </button>

      <div className="flex flex-col bg-white rounded-full shadow-[0_1px_3px_0_rgba(60,64,67,0.3),0_4px_8px_3px_rgba(60,64,67,0.15)] overflow-hidden border border-[rgba(0,0,0,0.08)]">
        <button
          type="button"
          onClick={onZoomIn}
          className="w-10 h-10 flex items-center justify-center hover:bg-[#f1f3f4] text-[#5f6368] hover:text-[#202124] transition-colors cursor-pointer"
          title="Zoom In"
          aria-label="Zoom In"
        >
          <Plus className="w-5 h-5" />
        </button>
        <div className="w-6 h-px bg-[rgba(0,0,0,0.08)] mx-auto" />
        <button
          type="button"
          onClick={onZoomOut}
          className="w-10 h-10 flex items-center justify-center hover:bg-[#f1f3f4] text-[#5f6368] hover:text-[#202124] transition-colors cursor-pointer"
          title="Zoom Out"
          aria-label="Zoom Out"
        >
          <Minus className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
