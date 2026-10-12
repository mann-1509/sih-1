import React from 'react';
import { X, Info, MapPin, Database, CheckCircle, Shield } from 'lucide-react';

export function InfoPanel({ onClose, totalAssets = 0 }) {
  return (
    <div className="google-card panel-slide-enter absolute left-18 top-20 z-30 w-80 sm:w-88 bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_4px_16px_rgba(60,64,67,0.2)] rounded-xl overflow-hidden select-none max-h-[calc(100vh-160px)] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,0,0,0.06)] bg-[#f8f9fa] shrink-0">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-[#1a73e8]" />
          <h3 className="font-medium text-[14px] text-[#202124]">About 3D ULPIN Cadastre</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full hover:bg-[#e8eaed] text-[#5f6368] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 overflow-y-auto space-y-4 text-[13px] flex-1">
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#80868b]">
            Project Anchor Location
          </div>
          <div className="p-3 rounded-lg bg-[#f8f9fa] border border-[rgba(0,0,0,0.08)]">
            <div className="font-bold text-[#202124] text-[13px]">
              PDEU UG Boys Hostel
            </div>
            <div className="text-[11px] text-[#5f6368] mt-0.5">
              Pandit Deendayal Energy University, Gandhinagar / Ahmedabad
            </div>
            <div className="text-[11px] font-mono text-[#1a73e8] mt-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>23.0225° N, 72.5714° E · Elevation 18m</span>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#80868b]">
            Domain Distribution
          </div>
          <div className="p-3 rounded-lg border border-[rgba(0,0,0,0.08)] bg-white space-y-2">
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-medium text-[#202124]">Subsurface Utilities</span>
              <span className="font-bold text-[#1a73e8]">60%</span>
            </div>
            <div className="w-full bg-[#e8eaed] h-2 rounded-full overflow-hidden">
              <div className="bg-[#1a73e8] h-full rounded-full" style={{ width: '60%' }} />
            </div>
            <div className="flex items-center justify-between text-[12px]">
              <span className="font-medium text-[#202124]">Above-Ground Buildings</span>
              <span className="font-bold text-[#5f6368]">40%</span>
            </div>
            <div className="w-full bg-[#e8eaed] h-2 rounded-full overflow-hidden">
              <div className="bg-[#5f6368] h-full rounded-full" style={{ width: '40%' }} />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#80868b]">
            System Standards
          </div>
          <div className="space-y-2 text-[12px] text-[#5f6368]">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#34a853]" />
              <span>MoRD BhuNaksha 3D Cadastral Compliant</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#34a853]" />
              <span>Single ULPIN Identity per Continuous Line</span>
            </div>
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#1a73e8]" />
              <span>{totalAssets} Live Spatial Entities in Registry</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
