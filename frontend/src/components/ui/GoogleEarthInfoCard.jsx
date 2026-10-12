import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Focus,
  Building2,
  Cable,
  Layers,
  Compass
} from 'lucide-react';
import { UTILITY_COLORS } from '../../constants/utilityColors';

export function GoogleEarthInfoCard({
  asset,
  clickedInfo,
  onClose,
  onFocusAsset
}) {
  const [copied, setCopied] = useState(false);

  if (!asset) return null;

  const isPipeline = asset.category === 'infrastructure';
  const isFloor = asset.asset_type === 'floor';
  const isBuilding = asset.asset_type === 'building';

  const handleCopy = () => {
    if (asset.ulpin) {
      navigator.clipboard.writeText(asset.ulpin);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getAccentColor = () => {
    if (asset.asset_type === 'water_pipe') return UTILITY_COLORS.water;
    if (asset.asset_type === 'electric_cable') return UTILITY_COLORS.electrical;
    if (asset.asset_type === 'fiber_cable') return UTILITY_COLORS.telecom;
    if (isFloor) return '#1a73e8';
    return UTILITY_COLORS.buildings;
  };

  const accentColor = getAccentColor();

  const getEntityIcon = () => {
    if (isPipeline) return <Cable className="w-5 h-5 text-white" />;
    if (isFloor) return <Layers className="w-5 h-5 text-white" />;
    return <Building2 className="w-5 h-5 text-white" />;
  };

  const displayName =
    asset.ulpin === '3D-ULPIN-GJ-AHM-BLD-001'
      ? 'PDEU UG Boys Hostel'
      : asset.name;

  return (
    <aside
      aria-label="Google Earth Knowledge Card"
      className="google-card panel-slide-enter absolute left-4 sm:left-18 top-20 z-40 w-[calc(100vw-2rem)] sm:w-92 max-h-[calc(100vh-140px)] bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_4px_24px_rgba(60,64,67,0.28)] rounded-xl overflow-hidden flex flex-col select-none"
    >
      <div className="relative p-4 pb-3 border-b border-[rgba(0,0,0,0.06)] bg-[#f8f9fa] shrink-0">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full hover:bg-[#e8eaed] text-[#5f6368] hover:text-[#202124] transition-colors cursor-pointer"
          aria-label="Close card"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 pr-6">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-xs"
            style={{ backgroundColor: accentColor }}
          >
            {getEntityIcon()}
          </div>
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#5f6368] block">
              {isPipeline
                ? 'Subsurface Utility (60%)'
                : isFloor
                ? 'Vertical Property Unit'
                : 'Above-Ground Building (40%)'}
            </span>
            <h2 className="text-[15px] font-bold text-[#202124] truncate leading-snug">
              {displayName}
            </h2>
          </div>
        </div>
      </div>

      <div className="p-4 overflow-y-auto space-y-4 text-[13px] flex-1">
        <div className="p-2.5 rounded-lg bg-[#f8f9fa] border border-[rgba(0,0,0,0.06)] flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[10px] uppercase font-semibold text-[#80868b] tracking-wider">
              3D ULPIN Identifier
            </div>
            <div className="font-mono text-[12px] font-bold text-[#1a73e8] truncate">
              {asset.ulpin}
            </div>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="px-2.5 py-1 rounded bg-white hover:bg-[#e8f0fe] border border-[rgba(0,0,0,0.08)] text-[11px] font-medium text-[#1a73e8] flex items-center gap-1 transition-colors cursor-pointer shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#34a853]" /> : <Copy className="w-3.5 h-3.5 text-[#1a73e8]" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        {clickedInfo && isPipeline && (
          <div className="p-3 rounded-lg bg-[#e8f0fe] border border-[rgba(26,115,232,0.25)] space-y-2">
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-[#1a73e8]">
              <Compass className="w-4 h-4" />
              <span>Raycast Surface Probe</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-[11px] font-mono">
              <div className="bg-white p-1.5 rounded text-center border border-[rgba(26,115,232,0.15)]">
                <div className="text-[9px] text-[#5f6368] uppercase">Lat</div>
                <div className="text-[#202124] font-bold">{clickedInfo.lat}</div>
              </div>
              <div className="bg-white p-1.5 rounded text-center border border-[rgba(26,115,232,0.15)]">
                <div className="text-[9px] text-[#5f6368] uppercase">Lon</div>
                <div className="text-[#202124] font-bold">{clickedInfo.lon}</div>
              </div>
              <div className="bg-white p-1.5 rounded text-center border border-[rgba(26,115,232,0.15)]">
                <div className="text-[9px] text-[#5f6368] uppercase">Depth</div>
                <div className="text-[#ea4335] font-bold">{clickedInfo.depth}m</div>
              </div>
            </div>
          </div>
        )}

        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#80868b] mb-2">
            Key Spatial Attributes
          </div>
          <div className="divide-y divide-[rgba(0,0,0,0.05)] border border-[rgba(0,0,0,0.06)] rounded-lg overflow-hidden bg-white">
            <div className="flex justify-between p-2.5 bg-white text-[12px]">
              <span className="text-[#5f6368]">Asset Classification</span>
              <span className="font-medium text-[#202124] capitalize">
                {asset.asset_type?.replace('_', ' ')}
              </span>
            </div>

            {isFloor && (
              <>
                <div className="flex justify-between p-2.5 bg-[#f8f9fa] text-[12px]">
                  <span className="text-[#5f6368]">Vertical Level</span>
                  <span className="font-bold text-[#1a73e8]">Floor {asset.floor_number}</span>
                </div>
                <div className="flex justify-between p-2.5 bg-white text-[12px]">
                  <span className="text-[#5f6368]">Floor Elevation</span>
                  <span className="font-mono text-[#202124]">+{asset.elevation || 0} m</span>
                </div>
                <div className="flex justify-between p-2.5 bg-[#f8f9fa] text-[12px]">
                  <span className="text-[#5f6368]">Parent Building ID</span>
                  <span className="font-mono text-[#5f6368]">{asset.parent_building_id || 'Block A'}</span>
                </div>
              </>
            )}

            {isPipeline && (
              <>
                <div className="flex justify-between p-2.5 bg-[#f8f9fa] text-[12px]">
                  <span className="text-[#5f6368]">Subsurface Burial Depth</span>
                  <span className="font-bold text-[#ea4335] font-mono">
                    {asset.depth !== undefined ? `${asset.depth} m` : `${asset.start_depth || -3.5} m`}
                  </span>
                </div>
                <div className="flex justify-between p-2.5 bg-white text-[12px]">
                  <span className="text-[#5f6368]">Total Line Length</span>
                  <span className="font-mono text-[#202124]">{asset.length || 70} m</span>
                </div>
              </>
            )}

            {isBuilding && (
              <>
                <div className="flex justify-between p-2.5 bg-[#f8f9fa] text-[12px]">
                  <span className="text-[#5f6368]">Height / Floors</span>
                  <span className="font-bold text-[#202124]">{asset.height || 16} m (G+3 Floors)</span>
                </div>
                <div className="flex justify-between p-2.5 bg-white text-[12px]">
                  <span className="text-[#5f6368]">Footprint Area</span>
                  <span className="font-mono text-[#202124]">
                    {(asset.length || 16) * (asset.width || 12)} sqm
                  </span>
                </div>
              </>
            )}

            <div className="flex justify-between p-2.5 bg-white text-[12px]">
              <span className="text-[#5f6368]">Managing Agency</span>
              <span className="font-medium text-[#202124]">
                {asset.owner_agency || 'Pandit Deendayal Energy University'}
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onFocusAsset(asset, clickedInfo)}
          className="w-full py-2 px-3 bg-[#1a73e8] hover:bg-[#1557b0] text-white rounded-lg text-[12px] font-medium transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer"
        >
          <Focus className="w-4 h-4" />
          <span>Fly Camera to Feature</span>
        </button>
      </div>
    </aside>
  );
}
