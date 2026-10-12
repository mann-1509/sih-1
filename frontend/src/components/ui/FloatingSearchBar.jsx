import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Building2, Cable, Layers } from 'lucide-react';

export function FloatingSearchBar({
  assets = [],
  onSelectResult,
  onSearchSubmit
}) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const defaultSuggestedItems = [
    {
      id: 'pdeu-hostel',
      name: 'PDEU UG Boys Hostel (U-shaped, G+3)',
      ulpin: '3D-ULPIN-GJ-AHM-BLD-001',
      type: 'building',
      subtitle: 'Anchor Landmark · Gandhinagar/Ahmedabad'
    },
    {
      id: 'water-trunk',
      name: 'Ashram Road Main Water Supply Trunk',
      ulpin: '3D-ULPIN-GJ-AHM-WAT-001',
      type: 'water_pipe',
      subtitle: 'Depth: -3.5m · AMC'
    },
    {
      id: 'power-line',
      name: 'Torrent Power 33kV High Voltage Line',
      ulpin: '3D-ULPIN-GJ-AHM-ELE-001',
      type: 'electric_cable',
      subtitle: 'Depth: -4.5m · Torrent Power'
    },
    {
      id: 'bsnl-fiber',
      name: 'BSNL Gigabit Fiber Optic Backbone',
      ulpin: '3D-ULPIN-GJ-AHM-FIB-001',
      type: 'fiber_cable',
      subtitle: 'Depth: -1.5m · BSNL'
    }
  ];

  const filteredAssets = query.trim()
    ? assets.filter((asset) => {
        const queryLower = query.toLowerCase();
        const matchesName = asset.name?.toLowerCase().includes(queryLower);
        const matchesUlpin = asset.ulpin?.toLowerCase().includes(queryLower);
        const matchesPdeu =
          (queryLower.includes('pdeu') || queryLower.includes('hostel')) &&
          asset.ulpin === '3D-ULPIN-GJ-AHM-BLD-001';
        return matchesName || matchesUlpin || matchesPdeu;
      })
    : [];

  const displayList = query.trim()
    ? filteredAssets.slice(0, 7)
    : defaultSuggestedItems;

  const handleSelect = (item) => {
    setQuery(item.name || item.ulpin);
    setIsOpen(false);
    const matchedAsset =
      assets.find((a) => a.ulpin === item.ulpin) ||
      (item.ulpin === '3D-ULPIN-GJ-AHM-BLD-001'
        ? assets.find((a) => a.ulpin === '3D-ULPIN-GJ-AHM-BLD-001')
        : item);

    if (matchedAsset) {
      onSelectResult(matchedAsset);
    } else {
      onSearchSubmit(item.ulpin || item.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    const directMatch = assets.find(
      (a) =>
        a.ulpin.toLowerCase() === query.trim().toLowerCase() ||
        a.name?.toLowerCase().includes(query.trim().toLowerCase()) ||
        (query.trim().toLowerCase().includes('pdeu') && a.ulpin === '3D-ULPIN-GJ-AHM-BLD-001')
    );
    if (directMatch) {
      handleSelect(directMatch);
    } else {
      onSearchSubmit(query.trim());
      setIsOpen(false);
    }
  };

  const getAssetIcon = (assetType) => {
    if (assetType === 'floor') return <Layers className="w-4 h-4 text-[#1a73e8]" />;
    if (assetType?.includes('pipe') || assetType?.includes('cable')) {
      return <Cable className="w-4 h-4 text-[#f9ab00]" />;
    }
    return <Building2 className="w-4 h-4 text-[#5f6368]" />;
  };

  return (
    <div ref={containerRef} className="absolute top-4 left-4 z-30 w-80 sm:w-96">
      <form
        onSubmit={handleSubmit}
        className="google-pill flex items-center px-4 py-2.5 bg-white border border-[rgba(0,0,0,0.08)] shadow-[0_2px_6px_rgba(60,64,67,0.3)] transition-all"
      >
        <Search className="w-5 h-5 text-[#5f6368] shrink-0 mr-3" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search ULPIN or place name..."
          className="flex-1 bg-transparent text-[14px] text-[#202124] placeholder-[#80868b] outline-none font-normal"
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="p-1 rounded-full hover:bg-[#f1f3f4] text-[#5f6368] transition-colors ml-1"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {isOpen && (
        <div className="google-card mt-2 bg-white overflow-hidden max-h-80 overflow-y-auto shadow-[0_4px_12px_rgba(60,64,67,0.25)] border border-[rgba(0,0,0,0.08)] rounded-xl animate-in fade-in duration-150">
          <div className="px-4 py-2 text-[11px] font-medium uppercase tracking-wider text-[#80868b] bg-[#f8f9fa] border-b border-[rgba(0,0,0,0.06)]">
            {query.trim() ? 'Matching Records' : 'Featured Cadastral Sites'}
          </div>
          {displayList.length === 0 ? (
            <div className="p-4 text-center text-sm text-[#5f6368]">
              No ULPIN records found matching "{query}"
            </div>
          ) : (
            <div className="divide-y divide-[rgba(0,0,0,0.05)]">
              {displayList.map((item) => (
                <button
                  key={item.ulpin || item.id}
                  type="button"
                  onClick={() => handleSelect(item)}
                  className="w-full text-left px-4 py-2.5 hover:bg-[#f8f9fa] flex items-center gap-3 transition-colors group cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-full bg-[#f1f3f4] flex items-center justify-center shrink-0 group-hover:bg-[#e8f0fe] transition-colors">
                    {getAssetIcon(item.asset_type || item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-[#202124] truncate group-hover:text-[#1a73e8]">
                      {item.name}
                    </div>
                    <div className="text-[11px] text-[#5f6368] font-mono truncate">
                      {item.ulpin}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
