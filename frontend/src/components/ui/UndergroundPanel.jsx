import React from 'react';
import { X, Network } from 'lucide-react';

export function UndergroundPanel({
  showPipeOverlay,
  setShowPipeOverlay,
  verticalExaggeration,
  setVerticalExaggeration,
  showCrossSection,
  setShowCrossSection,
  onClose
}) {
  const depthBands = [
    { level: 'Tier 1', depth: '-1.5m', label: 'Fiber & Telecom Microducts', color: '#9334e8' },
    { level: 'Tier 2', depth: '-3.5m', label: 'Potable Water Distribution', color: '#1a73e8' },
    { level: 'Tier 3', depth: '-4.5m', label: 'High Voltage Underground Power', color: '#f9ab00' },
    { level: 'Tier 4', depth: '-6.0m', label: 'Deep Gravity Sewer & Substation', color: '#8d6e63' }
  ];

  return (
    <div className="google-card panel-slide-enter absolute left-18 top-20 z-30 w-80 sm:w-88 bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_4px_16px_rgba(60,64,67,0.2)] rounded-xl overflow-hidden select-none">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,0,0,0.06)] bg-[#f8f9fa]">
        <div className="flex items-center gap-2">
          <Network className="w-4 h-4 text-[#1a73e8]" />
          <h3 className="font-medium text-[14px] text-[#202124]">Subsurface Engineering (60%)</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full hover:bg-[#e8eaed] text-[#5f6368] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 text-[13px]">
        <div className="p-3 rounded-lg bg-[#e8f0fe] border border-[rgba(26,115,232,0.2)] text-[#1a73e8] text-[12px] leading-relaxed">
          Subsurface utility infrastructure accounts for 60% of this project's cadastre. Every line has a single 3D ULPIN with continuous 3D line geometry.
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#80868b] mb-2">
            Depth Stratification Layers
          </div>
          <div className="space-y-2">
            {depthBands.map((band) => (
              <div
                key={band.level}
                className="p-2.5 rounded-lg border border-[rgba(0,0,0,0.06)] bg-[#f8f9fa] flex items-center justify-between"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: band.color }}
                  />
                  <div>
                    <div className="font-medium text-[#202124] text-[12px]">{band.label}</div>
                    <div className="text-[10px] text-[#5f6368]">{band.level}</div>
                  </div>
                </div>
                <span className="font-mono text-[11px] font-bold text-[#202124] bg-white px-2 py-0.5 rounded border border-[rgba(0,0,0,0.08)]">
                  {band.depth}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-[rgba(0,0,0,0.06)] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#202124]">Vertical Exaggeration (Z-Scale)</span>
            <span className="text-[12px] font-mono font-bold text-[#1a73e8]">
              {verticalExaggeration.toFixed(1)}x
            </span>
          </div>
          <input
            type="range"
            min="1.0"
            max="4.0"
            step="0.5"
            value={verticalExaggeration}
            onChange={(e) => setVerticalExaggeration(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#e8eaed] rounded-lg appearance-none cursor-pointer accent-[#1a73e8]"
          />
          <div className="flex justify-between text-[10px] text-[#80868b]">
            <span>1.0x (True Scale)</span>
            <span>4.0x (Enhanced Depth)</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[rgba(0,0,0,0.06)] space-y-2">
          <label className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f8f9fa] cursor-pointer">
            <span className="font-medium text-[#202124] text-[12px]">Subsurface Utility Overlay</span>
            <input
              type="checkbox"
              checked={showPipeOverlay}
              onChange={() => setShowPipeOverlay(!showPipeOverlay)}
              className="w-4 h-4 rounded text-[#1a73e8] accent-[#1a73e8] cursor-pointer"
            />
          </label>

          <label className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f8f9fa] cursor-pointer">
            <span className="font-medium text-[#202124] text-[12px]">Cross-Section Inspection Plane</span>
            <input
              type="checkbox"
              checked={showCrossSection}
              onChange={() => setShowCrossSection(!showCrossSection)}
              className="w-4 h-4 rounded text-[#1a73e8] accent-[#1a73e8] cursor-pointer"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
