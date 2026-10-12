import React from 'react';
import { X, Building2, ChevronRight, Home } from 'lucide-react';

export function BuildingsPanel({
  assets = [],
  selectedAsset,
  onSelectAsset,
  onClose
}) {
  const buildings = assets.filter((a) => a.asset_type === 'building');
  const floors = assets.filter((a) => a.asset_type === 'floor');

  const pdeuAnchorBuilding =
    buildings.find((b) => b.ulpin === '3D-ULPIN-GJ-AHM-BLD-001') || buildings[0];

  return (
    <div className="google-card panel-slide-enter absolute left-18 top-20 z-30 w-80 sm:w-88 bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_4px_16px_rgba(60,64,67,0.2)] rounded-xl overflow-hidden select-none max-h-[calc(100vh-160px)] flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,0,0,0.06)] bg-[#f8f9fa] shrink-0">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#1a73e8]" />
          <h3 className="font-medium text-[14px] text-[#202124]">Above-Ground Cadastre (40%)</h3>
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
        <div className="p-3 rounded-lg bg-[#f8f9fa] border border-[rgba(0,0,0,0.08)]">
          <div className="flex items-center gap-2 text-[#1a73e8] font-medium text-[12px] mb-1">
            <Home className="w-4 h-4 shrink-0" />
            <span>Primary Anchor Landmark</span>
          </div>
          <div className="font-bold text-[13px] text-[#202124]">
            PDEU UG Boys Hostel
          </div>
          <div className="text-[11px] text-[#5f6368] mt-0.5">
            U-shaped layout · Ground + 3 Floors (G+3) · 3D Volumetric Property
          </div>
          <button
            type="button"
            onClick={() => pdeuAnchorBuilding && onSelectAsset(pdeuAnchorBuilding)}
            className="mt-2.5 w-full py-1.5 px-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-md text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            <span>Fly Camera to PDEU Hostel</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#80868b] mb-2">
            Registered Building Footprints
          </div>
          <div className="space-y-2">
            {buildings.map((bld) => {
              const bldFloors = floors.filter((f) => f.parent_building_id === bld.id);
              const isSelected = selectedAsset && selectedAsset.ulpin === bld.ulpin;
              return (
                <div
                  key={bld.ulpin}
                  className={`rounded-lg border transition-colors ${
                    isSelected
                      ? 'border-[#1a73e8] bg-[#e8f0fe]'
                      : 'border-[rgba(0,0,0,0.08)] bg-white'
                  }`}
                >
                  <div
                    onClick={() => onSelectAsset(bld)}
                    className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-[#f1f3f4] rounded-t-lg transition-colors"
                  >
                    <div>
                      <div className="font-medium text-[#202124] text-[12px]">
                        {bld.ulpin === '3D-ULPIN-GJ-AHM-BLD-001'
                          ? 'PDEU UG Boys Hostel (Block A)'
                          : bld.name}
                      </div>
                      <div className="text-[10px] text-[#5f6368] font-mono">
                        {bld.ulpin}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono font-medium text-[#1a73e8] bg-white px-2 py-0.5 rounded border border-[rgba(0,0,0,0.06)]">
                      {bldFloors.length} Units
                    </span>
                  </div>

                  {bldFloors.length > 0 && (
                    <div className="p-2 pt-0 grid grid-cols-3 gap-1 bg-[#f8f9fa] rounded-b-lg border-t border-[rgba(0,0,0,0.04)]">
                      {bldFloors.map((fl) => {
                        const isFlSelected =
                          selectedAsset && selectedAsset.ulpin === fl.ulpin;
                        return (
                          <button
                            key={fl.ulpin}
                            type="button"
                            onClick={() => onSelectAsset(fl)}
                            className={`p-1 text-center rounded text-[10px] font-medium transition-colors cursor-pointer border ${
                              isFlSelected
                                ? 'bg-[#1a73e8] text-white border-[#1a73e8]'
                                : 'bg-white hover:bg-[#e8eaed] text-[#202124] border-[rgba(0,0,0,0.08)]'
                            }`}
                          >
                            Floor {fl.floor_number}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
