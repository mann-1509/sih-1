import React, { useState } from 'react';
import { X, Ruler, CheckCircle2, Compass } from 'lucide-react';

export function MeasurePanel({ onClose }) {
  const [measurementType, setMeasurementType] = useState('clearance');

  return (
    <div className="google-card panel-slide-enter absolute left-18 top-20 z-30 w-80 sm:w-88 bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_4px_16px_rgba(60,64,67,0.2)] rounded-xl overflow-hidden select-none">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,0,0,0.06)] bg-[#f8f9fa]">
        <div className="flex items-center gap-2">
          <Ruler className="w-4 h-4 text-[#1a73e8]" />
          <h3 className="font-medium text-[14px] text-[#202124]">3D Spatial Measurement</h3>
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
        <div className="grid grid-cols-2 gap-2 bg-[#f1f3f4] p-1 rounded-lg">
          <button
            type="button"
            onClick={() => setMeasurementType('clearance')}
            className={`py-1.5 px-2 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              measurementType === 'clearance'
                ? 'bg-white text-[#1a73e8] shadow-xs'
                : 'text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            Safety Clearance
          </button>
          <button
            type="button"
            onClick={() => setMeasurementType('depth')}
            className={`py-1.5 px-2 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
              measurementType === 'depth'
                ? 'bg-white text-[#1a73e8] shadow-xs'
                : 'text-[#5f6368] hover:text-[#202124]'
            }`}
          >
            Subsurface Depth
          </button>
        </div>

        {measurementType === 'clearance' ? (
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#f8f9fa] space-y-2">
              <div className="flex items-center gap-2 text-[#1a73e8] font-medium text-[12px]">
                <CheckCircle2 className="w-4 h-4" />
                <span>Deterministic Clearance Standard</span>
              </div>
              <p className="text-[11px] text-[#5f6368] leading-relaxed">
                Underground utility pipelines must maintain a minimum 3D euclidean clearance of <strong>1.2 meters</strong> from other utilities and foundation footings.
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-[#e8f0fe] border border-[rgba(26,115,232,0.2)] flex items-center justify-between text-[12px]">
              <span className="text-[#1a73e8] font-medium">Standard Safety Buffer:</span>
              <span className="font-mono font-bold text-[#1a73e8]">1.20 m</span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-[rgba(0,0,0,0.08)] bg-[#f8f9fa] space-y-2">
              <div className="flex items-center gap-2 text-[#1a73e8] font-medium text-[12px]">
                <Compass className="w-4 h-4" />
                <span>True Depth Elevation</span>
              </div>
              <p className="text-[11px] text-[#5f6368] leading-relaxed">
                Click any utility segment in the 3D viewport to perform a Raycast Surface Probe, inspecting its exact subterranean depth and GPS coordinates.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
