import React, { useState, useEffect } from 'react';
import { SceneContainer } from './components/3d/SceneContainer';
import { FloatingSearchBar } from './components/ui/FloatingSearchBar';
import { SlimIconRail } from './components/ui/SlimIconRail';
import { MapControls } from './components/ui/MapControls';
import { BottomStatusBar } from './components/ui/BottomStatusBar';
import { LayersPanel } from './components/ui/LayersPanel';
import { UndergroundPanel } from './components/ui/UndergroundPanel';
import { BuildingsPanel } from './components/ui/BuildingsPanel';
import { MeasurePanel } from './components/ui/MeasurePanel';
import { InfoPanel } from './components/ui/InfoPanel';
import { GoogleEarthInfoCard } from './components/ui/GoogleEarthInfoCard';
import { RegisterAssetModal } from './components/ui/RegisterAssetModal';
import { ConflictDetectorPanel } from './components/ui/ConflictDetectorPanel';
import { DashboardView } from './components/ui/DashboardView';
import { BeforeAfterView } from './components/ui/BeforeAfterView';
import { fetchAssets, localToLatLon } from './services/api';

const BASE_LAT = 23.0225;
const BASE_LON = 72.5714;
const LAT_TO_METERS = 110574.0;
const LON_TO_METERS = 102500.0;

export default function App() {
  const [assets, setAssets] = useState([]);
  const [activePanel, setActivePanel] = useState(null);

  const [selectedAsset, setSelectedAsset] = useState(null);
  const [clickedInfo, setClickedInfo] = useState(null);

  const [layerVisibility, setLayerVisibility] = useState({
    buildings: true,
    water: true,
    sewer: true,
    electrical: true,
    gas: true,
    telecom: true
  });

  const [groundOpacity, setGroundOpacity] = useState(0.85);
  const [undergroundView, setUndergroundView] = useState(true);
  const [showPipeOverlay, setShowPipeOverlay] = useState(true);
  const [verticalExaggeration, setVerticalExaggeration] = useState(1.5);
  const [showCrossSection, setShowCrossSection] = useState(false);

  const [conflictResult, setConflictResult] = useState(null);
  const [focusPoint, setFocusPoint] = useState({ x: -30.75, y: 8, z: -22.1, distance: 42 });
  const [focusTrigger, setFocusTrigger] = useState(1);
  const [zoomAction, setZoomAction] = useState(null);
  const [resetNorthTrigger, setResetNorthTrigger] = useState(0);
  const [is3DMode, setIs3DMode] = useState(true);
  const [compassHeading, setCompassHeading] = useState(0);
  const [cameraCoordinates, setCameraCoordinates] = useState({ lat: BASE_LAT, lon: BASE_LON, alt: 65 });
  const [newlyCreatedUlpin, setNewlyCreatedUlpin] = useState(null);

  const loadAssets = async () => {
    try {
      const data = await fetchAssets();
      setAssets(data);
    } catch (err) {
      console.error('Failed to load assets:', err);
    }
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const computeAssetTarget = (asset, clickData = null) => {
    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;
    let distance = 24;

    if (clickData && clickData.worldX !== undefined) {
      targetX = clickData.worldX;
      targetY = clickData.worldY;
      targetZ = clickData.worldZ;
      distance = clickData.distance || 20;
    } else if (clickData && clickData.x !== undefined) {
      targetX = clickData.x;
      targetY = clickData.y * verticalExaggeration;
      targetZ = clickData.z;
      distance = clickData.distance || 20;
    } else if (asset.start_x !== undefined) {
      targetX = (asset.start_x + asset.end_x) / 2;
      targetY = ((asset.start_y + asset.end_y) / 2) * verticalExaggeration;
      targetZ = (asset.start_z + asset.end_z) / 2;
      distance = 22;
    } else if (asset.asset_type === 'floor') {
      const lon = asset.longitude || BASE_LON;
      const lat = asset.latitude || BASE_LAT;
      targetX = (lon - BASE_LON) * LON_TO_METERS;
      targetZ = -(lat - BASE_LAT) * LAT_TO_METERS;
      const flElev = asset.elevation || 0;
      const flHeight = asset.height || 3.8;
      targetY = (flElev + flHeight / 2) * verticalExaggeration;
      distance = 20;
    } else if (asset.latitude !== undefined) {
      targetX = (asset.longitude - BASE_LON) * LON_TO_METERS;
      targetZ = -(asset.latitude - BASE_LAT) * LAT_TO_METERS;
      const bldHeight = asset.height || 16;
      targetY = (bldHeight / 2) * verticalExaggeration;
      distance = Math.max(30, bldHeight * 1.5);
    }

    return { x: targetX, y: targetY, z: targetZ, distance };
  };

  const handleSelectAsset = (asset, clickData = null) => {
    setSelectedAsset(asset);
    setClickedInfo(clickData);
    if (!asset) return;

    const target = computeAssetTarget(asset, clickData);
    setFocusPoint(target);
    setFocusTrigger((prev) => prev + 1);
  };

  const handleTogglePanel = (panelId) => {
    setActivePanel((prev) => (prev === panelId ? null : panelId));
  };

  const handleToggleLayer = (layerId) => {
    setLayerVisibility((prev) => ({
      ...prev,
      [layerId]: !prev[layerId]
    }));
  };

  const handleSearchSubmit = (query) => {
    const found = assets.find(
      (a) =>
        a.ulpin.toLowerCase() === query.toLowerCase() ||
        a.ulpin.toLowerCase().includes(query.toLowerCase()) ||
        a.name?.toLowerCase().includes(query.toLowerCase()) ||
        ((query.toLowerCase().includes('pdeu') || query.toLowerCase().includes('hostel')) &&
          a.ulpin === '3D-ULPIN-GJ-AHM-BLD-001')
    );

    if (found) {
      handleSelectAsset(found);
    } else {
      alert(`No spatial record found matching: "${query}"`);
    }
  };

  const handleResetLocation = () => {
    setFocusPoint({ x: -30.75, y: 8, z: -22.1, distance: 42 });
    setFocusTrigger((prev) => prev + 1);
  };

  const handleZoomIn = () => {
    setZoomAction({ direction: 'in', timestamp: Date.now() });
  };

  const handleZoomOut = () => {
    setZoomAction({ direction: 'out', timestamp: Date.now() });
  };

  const handleResetNorth = () => {
    setResetNorthTrigger((prev) => prev + 1);
  };

  const handleToggle2D3D = () => {
    setIs3DMode((prev) => !prev);
  };

  const handleCameraStatsChange = ({ heading, eyeAltitude, x, z }) => {
    setCompassHeading(heading);
    const coords = localToLatLon(x, z);
    setCameraCoordinates({
      lat: coords.lat,
      lon: coords.lon,
      alt: eyeAltitude
    });
  };

  const handleAssetRegistered = (newAsset) => {
    loadAssets();
    setConflictResult(null);
    setNewlyCreatedUlpin(newAsset.ulpin);
    setActivePanel(null);
    handleSelectAsset(newAsset);

    if (newAsset.category === 'infrastructure') {
      setUndergroundView(true);
    }

    setTimeout(() => setNewlyCreatedUlpin(null), 3500);
  };

  const handleFocusConflict = (coords) => {
    setFocusPoint({
      x: coords.x,
      y: coords.y * verticalExaggeration,
      z: coords.z,
      distance: 18
    });
    setFocusTrigger((prev) => prev + 1);
    setUndergroundView(true);
  };

  const handleSelectConflict = (conflictItem) => {
    setActivePanel('conflict');
    if (conflictItem && conflictItem.conflict_x !== undefined) {
      handleFocusConflict({
        x: conflictItem.conflict_x,
        y: conflictItem.conflict_y,
        z: conflictItem.conflict_z
      });
    }
  };

  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0b0d0e] text-[#202124] relative isolate select-none">
      <SceneContainer
        assets={assets}
        selectedAsset={selectedAsset}
        onSelectAsset={handleSelectAsset}
        layerVisibility={layerVisibility}
        groundOpacity={groundOpacity}
        undergroundView={undergroundView}
        showPipeOverlay={showPipeOverlay}
        verticalExaggeration={verticalExaggeration}
        showCrossSection={showCrossSection}
        conflictResult={conflictResult}
        onSelectConflict={handleSelectConflict}
        focusPoint={focusPoint}
        focusTrigger={focusTrigger}
        zoomAction={zoomAction}
        resetNorthTrigger={resetNorthTrigger}
        is3DMode={is3DMode}
        onCameraStatsChange={handleCameraStatsChange}
        newlyCreatedUlpin={newlyCreatedUlpin}
        isMapActive={true}
      />

      <FloatingSearchBar
        assets={assets}
        onSelectResult={handleSelectAsset}
        onSearchSubmit={handleSearchSubmit}
      />

      <SlimIconRail
        activePanel={activePanel}
        onTogglePanel={handleTogglePanel}
      />

      {activePanel === 'layers' && (
        <LayersPanel
          layerVisibility={layerVisibility}
          onToggleLayer={handleToggleLayer}
          groundOpacity={groundOpacity}
          onChangeGroundOpacity={setGroundOpacity}
          undergroundView={undergroundView}
          onToggleUndergroundView={() => setUndergroundView(!undergroundView)}
          onClose={() => setActivePanel(null)}
        />
      )}

      {activePanel === 'underground' && (
        <UndergroundPanel
          undergroundView={undergroundView}
          setUndergroundView={setUndergroundView}
          showPipeOverlay={showPipeOverlay}
          setShowPipeOverlay={setShowPipeOverlay}
          verticalExaggeration={verticalExaggeration}
          setVerticalExaggeration={setVerticalExaggeration}
          showCrossSection={showCrossSection}
          setShowCrossSection={setShowCrossSection}
          onClose={() => setActivePanel(null)}
        />
      )}

      {activePanel === 'buildings' && (
        <BuildingsPanel
          assets={assets}
          selectedAsset={selectedAsset}
          onSelectAsset={handleSelectAsset}
          onClose={() => setActivePanel(null)}
        />
      )}

      {activePanel === 'measure' && (
        <MeasurePanel onClose={() => setActivePanel(null)} />
      )}

      {activePanel === 'info' && (
        <InfoPanel
          onClose={() => setActivePanel(null)}
          totalAssets={assets.length}
        />
      )}

      {selectedAsset && (
        <GoogleEarthInfoCard
          asset={selectedAsset}
          clickedInfo={clickedInfo}
          onClose={() => {
            setSelectedAsset(null);
            setClickedInfo(null);
          }}
          onFocusAsset={handleSelectAsset}
        />
      )}

      {activePanel === 'conflict' && (
        <div className="absolute left-18 top-20 z-40">
          <ConflictDetectorPanel
            onConflictChecked={(res) => setConflictResult(res)}
            onZoomToConflict={handleFocusConflict}
            onClose={() => {
              setActivePanel(null);
              setConflictResult(null);
            }}
          />
        </div>
      )}

      {activePanel === 'register' && (
        <RegisterAssetModal
          onAssetRegistered={handleAssetRegistered}
          onClose={() => {
            setActivePanel(null);
            setConflictResult(null);
          }}
          onViewConflictIn3D={(res, coords) => {
            setConflictResult(res);
            if (coords) handleFocusConflict(coords);
          }}
        />
      )}

      {activePanel === 'dashboard' && (
        <div className="absolute inset-4 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[rgba(0,0,0,0.1)]">
          <div className="p-3 bg-[#f8f9fa] border-b border-[rgba(0,0,0,0.08)] flex justify-between items-center">
            <span className="font-bold text-sm text-[#202124]">Cadastral Inventory & Spatial Assets Database</span>
            <button
              type="button"
              onClick={() => setActivePanel(null)}
              className="px-3 py-1 bg-[#e8eaed] hover:bg-[#dadce0] rounded-full text-xs font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <DashboardView />
          </div>
        </div>
      )}

      {activePanel === 'benchmark' && (
        <div className="absolute inset-4 z-50 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-[rgba(0,0,0,0.1)]">
          <div className="p-3 bg-[#f8f9fa] border-b border-[rgba(0,0,0,0.08)] flex justify-between items-center">
            <span className="font-bold text-sm text-[#202124]">2D vs 3D Cadastre Comparison Benchmark</span>
            <button
              type="button"
              onClick={() => setActivePanel(null)}
              className="px-3 py-1 bg-[#e8eaed] hover:bg-[#dadce0] rounded-full text-xs font-medium cursor-pointer"
            >
              Close
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <BeforeAfterView />
          </div>
        </div>
      )}

      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        compassHeading={compassHeading}
        onResetNorth={handleResetNorth}
        is3DMode={is3DMode}
        onToggle2D3D={handleToggle2D3D}
        onResetLocation={handleResetLocation}
      />

      <BottomStatusBar
        latitude={cameraCoordinates.lat}
        longitude={cameraCoordinates.lon}
        groundElevation={18}
        eyeAltitude={cameraCoordinates.alt}
      />
    </div>
  );
}
