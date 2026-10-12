import React from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { UTILITY_COLORS } from '../../constants/utilityColors';
export { UTILITY_COLORS };

export function LayersPanel({
  layerVisibility,
  onToggleLayer,
  groundOpacity,
  onChangeGroundOpacity,
  undergroundView,
  onToggleUndergroundView,
  onClose
}) {
  const layerDefinitions = [
    { id: 'buildings', label: 'Buildings & Floors', color: UTILITY_COLORS.buildings, count: 'G+3 · 40%' },
    { id: 'water', label: 'Water Pipelines', color: UTILITY_COLORS.water, count: 'AMC · -3.5m' },
    { id: 'sewer', label: 'Sewer Trunk Lines', color: UTILITY_COLORS.sewer, count: 'AMC · -5.0m' },
    { id: 'electrical', label: 'Electrical Cables', color: UTILITY_COLORS.electrical, count: 'Torrent 33kV · -4.5m' },
    { id: 'gas', label: 'Gas Pipelines', color: UTILITY_COLORS.gas, count: 'Adani Gas · -2.0m' },
    { id: 'telecom', label: 'Telecom & Fiber', color: UTILITY_COLORS.telecom, count: 'BSNL / Jio · -1.5m' }
  ];

  return (
    <div className="google-card panel-slide-enter absolute left-18 top-20 z-30 w-80 sm:w-88 bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_4px_16px_rgba(60,64,67,0.2)] rounded-xl overflow-hidden select-none">
      <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(0,0,0,0.06)] bg-[#f8f9fa]">
        <h3 className="font-medium text-[14px] text-[#202124]">Map Layers & Cadastre</h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-full hover:bg-[#e8eaed] text-[#5f6368] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-5 text-[13px]">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#80868b] mb-2.5">
            Cadastral Layers
          </div>
          <div className="space-y-1.5">
            {layerDefinitions.map((layer) => {
              const isChecked = layerVisibility[layer.id] !== false;
              return (
                <label
                  key={layer.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f8f9fa] cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => onToggleLayer(layer.id)}
                      className="w-4 h-4 rounded text-[#1a73e8] accent-[#1a73e8] cursor-pointer"
                    />
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: layer.color }}
                      />
                      <span className="font-medium text-[#202124]">{layer.label}</span>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#80868b]">{layer.count}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="pt-2 border-t border-[rgba(0,0,0,0.06)] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-medium text-[#202124]">Ground Transparency</span>
            <span className="text-[12px] font-mono text-[#5f6368]">
              {Math.round((1 - groundOpacity) * 100)}% transparent
            </span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={groundOpacity}
            onChange={(e) => onChangeGroundOpacity(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-[#e8eaed] rounded-lg appearance-none cursor-pointer accent-[#1a73e8]"
          />
          <div className="flex justify-between text-[10px] text-[#80868b]">
            <span>Opaque Terrain</span>
            <span>Ghost / X-Ray</span>
          </div>
        </div>

        <div className="pt-2 border-t border-[rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between p-2 rounded-lg bg-[#f8f9fa] border border-[rgba(0,0,0,0.06)]">
            <div className="flex items-center gap-2">
              {undergroundView ? (
                <Eye className="w-4 h-4 text-[#1a73e8]" />
              ) : (
                <EyeOff className="w-4 h-4 text-[#5f6368]" />
              )}
              <span className="font-medium text-[#202124]">Subsurface X-Ray Mode</span>
            </div>
            <button
              type="button"
              onClick={onToggleUndergroundView}
              className={`px-3 py-1 rounded-full text-[11px] font-medium transition-colors cursor-pointer ${
                undergroundView
                  ? 'bg-[#1a73e8] text-white shadow-xs'
                  : 'bg-[#e8eaed] text-[#5f6368] hover:bg-[#dadce0]'
              }`}
            >
              {undergroundView ? 'Active' : 'Surface Only'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
