import React from 'react';
import {
  Layers,
  Waves,
  Building2,
  Ruler,
  AlertTriangle,
  PlusCircle,
  Database,
  BarChart3,
  Info
} from 'lucide-react';

export function SlimIconRail({ activePanel, onTogglePanel }) {
  const railItems = [
    { id: 'layers', label: 'Layers', icon: Layers },
    { id: 'underground', label: 'Underground Utilities', icon: Waves },
    { id: 'buildings', label: 'Buildings & Cadastre', icon: Building2 },
    { id: 'measure', label: 'Measure 3D Distance', icon: Ruler },
    { id: 'conflict', label: 'Spatial Conflict Analysis', icon: AlertTriangle },
    { id: 'register', label: 'Register New Asset', icon: PlusCircle },
    { id: 'dashboard', label: 'Cadastral Inventory', icon: Database },
    { id: 'benchmark', label: '2D vs 3D Cadastre', icon: BarChart3 },
    { id: 'info', label: 'Project Info & Specs', icon: Info }
  ];

  return (
    <div className="absolute left-4 top-20 z-30 flex flex-col items-center">
      <nav aria-label="Google Earth Sidebar Rail" className="google-rail bg-white border border-[rgba(0,0,0,0.08)] py-1.5 px-1 shadow-[0_2px_6px_rgba(60,64,67,0.3)]">
        {railItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePanel === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTogglePanel(item.id)}
              className={`google-rail-btn group relative ${isActive ? 'active' : ''}`}
              title={item.label}
              aria-label={item.label}
            >
              <Icon className={`w-5 h-5 transition-transform duration-150 ${isActive ? 'text-[#1a73e8] scale-105' : 'text-[#5f6368] group-hover:text-[#202124]'}`} />
              <div className="hidden group-hover:block fixed left-18 px-2.5 py-1 bg-[#202124] text-white text-[11px] font-medium rounded shadow-md whitespace-nowrap z-50 pointer-events-none">
                {item.label}
              </div>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
