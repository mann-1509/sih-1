import React, { useState } from 'react';
import { Html } from '@react-three/drei';

export function Building3D({
  building,
  floors,
  onSelectAsset,
  selectedAsset,
  verticalExaggeration = 1.0,
  conflictInfo = null,
  onSelectConflict = null,
  isMapActive = true
}) {
  const [hoveredFloor, setHoveredFloor] = useState(null);
  const [hoveredBuilding, setHoveredBuilding] = useState(false);

  const BASE_LAT = 23.0225;
  const BASE_LON = 72.5714;
  const LAT_TO_METERS = 110574.0;
  const LON_TO_METERS = 102500.0;

  const bx = (building.longitude - BASE_LON) * LON_TO_METERS;
  const bz = -(building.latitude - BASE_LAT) * LAT_TO_METERS;

  const width = building.width || 12;
  const length = building.length || 12;
  const height = building.height || 16;

  const isConflicted = Boolean(conflictInfo);
  const isBuildingSelected = selectedAsset && selectedAsset.ulpin === building.ulpin;
  const hasGlobalSelection = Boolean(selectedAsset);

  const baseBuildingColor = '#475569';
  const showBuildingTag = isMapActive && (hoveredBuilding || isBuildingSelected);

  return (
    <group position={[bx, 0, bz]}>
      <mesh
        position={[0, 0.15, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHoveredBuilding(true);
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHoveredBuilding(false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (isConflicted && onSelectConflict) {
            onSelectConflict({
              ...conflictInfo,
              conflict_x: bx,
              conflict_y: 0,
              conflict_z: bz
            });
          }
          onSelectAsset(building, {
            x: Number(bx.toFixed(2)),
            y: Number(((height || 16) / 2).toFixed(2)),
            z: Number(bz.toFixed(2)),
            worldX: bx,
            worldY: ((height || 16) / 2) * verticalExaggeration,
            worldZ: bz,
            distance: 38,
            lat: building.latitude,
            lon: building.longitude
          });
        }}
      >
        <boxGeometry args={[width + 1.0, 0.3, length + 1.0]} />
        <meshStandardMaterial
          color={
            isConflicted
              ? '#ea4335'
              : isBuildingSelected
              ? '#1a73e8'
              : hoveredBuilding
              ? '#5f6368'
              : '#3c4043'
          }
          emissive={isBuildingSelected ? '#1a73e8' : isConflicted ? '#ea4335' : '#000000'}
          emissiveIntensity={isBuildingSelected ? 0.3 : isConflicted ? 0.6 : 0.0}
          roughness={0.7}
        />
      </mesh>

      {isConflicted && (
        <mesh position={[0, ((height || 16) * verticalExaggeration) / 2, 0]}>
          <boxGeometry args={[width + 1.5, (height || 16) * verticalExaggeration + 0.4, length + 1.5]} />
          <meshBasicMaterial color="#ea4335" wireframe transparent opacity={0.4} />
        </mesh>
      )}

      {floors && floors.length > 0 ? (
        floors.map((fl) => {
          const isSelected = selectedAsset && selectedAsset.ulpin === fl.ulpin;
          const isHovered = hoveredFloor === fl.ulpin;
          const showFloorTag = isMapActive && (isHovered || isSelected);

          const flHeight = fl.height || 3.8;
          const rawElevation = fl.elevation || 0;
          const yPos = (rawElevation + flHeight / 2) * verticalExaggeration;
          const visualHeight = flHeight * verticalExaggeration;

          let floorColor = baseBuildingColor;
          let floorOpacity = 0.7;

          if (isSelected) {
            floorColor = '#1a73e8';
            floorOpacity = 0.95;
          } else if (isHovered) {
            floorColor = '#4285f4';
            floorOpacity = 0.85;
          } else if (hasGlobalSelection) {
            floorOpacity = 0.25;
          }

          const handleFloorClick = (e) => {
            e.stopPropagation();
            const clickInfo = {
              x: Number(bx.toFixed(2)),
              y: Number((rawElevation + flHeight / 2).toFixed(2)),
              z: Number(bz.toFixed(2)),
              worldX: bx,
              worldY: yPos,
              worldZ: bz,
              distance: 18,
              lat: fl.latitude || building.latitude,
              lon: fl.longitude || building.longitude,
              elevation: rawElevation,
              isFloor: true
            };
            onSelectAsset(fl, clickInfo);
          };

          return (
            <group key={fl.ulpin} position={[0, yPos, 0]}>
              <mesh
                onPointerOver={(e) => {
                  e.stopPropagation();
                  setHoveredFloor(fl.ulpin);
                }}
                onPointerOut={(e) => {
                  e.stopPropagation();
                  setHoveredFloor(null);
                }}
                onClick={handleFloorClick}
              >
                <boxGeometry args={[width, visualHeight - 0.1, length]} />
                <meshStandardMaterial
                  color={floorColor}
                  transparent={true}
                  opacity={floorOpacity}
                  roughness={0.4}
                  metalness={0.2}
                  emissive={isSelected ? '#1a73e8' : '#000000'}
                  emissiveIntensity={isSelected ? 0.35 : 0}
                />
              </mesh>

              <mesh position={[0, 0, length / 2 + 0.04]}>
                <planeGeometry args={[width * 0.85, visualHeight * 0.35]} />
                <meshBasicMaterial
                  color={isSelected ? '#1a73e8' : '#8ab4f8'}
                  transparent
                  opacity={hasGlobalSelection && !isSelected ? 0.15 : 0.6}
                />
              </mesh>

              {showFloorTag && (
                <Html
                  position={[0, visualHeight / 2 + 0.4, 0]}
                  center
                  zIndexRange={[1, 5]}
                  style={{ pointerEvents: 'none', userSelect: 'none' }}
                >
                  <div className="px-3 py-1 rounded-full bg-white text-[#202124] text-[11px] font-medium shadow-[0_2px_8px_rgba(60,64,67,0.3)] border border-[rgba(0,0,0,0.08)] flex items-center gap-2 whitespace-nowrap">
                    <span className="w-2 h-2 rounded-full bg-[#1a73e8]" />
                    <span>Floor {fl.floor_number}</span>
                    <span className="text-[10px] text-[#5f6368] font-mono">({fl.ulpin})</span>
                  </div>
                </Html>
              )}
            </group>
          );
        })
      ) : (
        <mesh
          position={[0, (height / 2) * verticalExaggeration, 0]}
          onPointerOver={(e) => {
            e.stopPropagation();
            setHoveredBuilding(true);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            setHoveredBuilding(false);
          }}
          onClick={(e) => {
            e.stopPropagation();
            onSelectAsset(building, {
              x: Number(bx.toFixed(2)),
              y: Number((height / 2).toFixed(2)),
              z: Number(bz.toFixed(2)),
              worldX: bx,
              worldY: (height / 2) * verticalExaggeration,
              worldZ: bz,
              distance: 38,
              lat: building.latitude,
              lon: building.longitude
            });
          }}
        >
          <boxGeometry args={[width, height * verticalExaggeration, length]} />
          <meshStandardMaterial
            color={isBuildingSelected ? '#1a73e8' : baseBuildingColor}
            transparent
            opacity={hasGlobalSelection && !isBuildingSelected ? 0.25 : 0.75}
          />
        </mesh>
      )}

      {showBuildingTag && (
        <Html
          position={[0, (height + 1.2) * verticalExaggeration, 0]}
          center
          zIndexRange={[1, 5]}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div className="px-3 py-1.5 rounded-full bg-white text-[#202124] text-[11px] font-medium shadow-[0_2px_8px_rgba(60,64,67,0.3)] border border-[rgba(0,0,0,0.08)] flex items-center gap-2 whitespace-nowrap">
            <span
              className={`w-2 h-2 rounded-full ${
                isConflicted ? 'bg-[#ea4335]' : 'bg-[#1a73e8]'
              }`}
            />
            <span>{building.name}</span>
            <span className="text-[10px] text-[#5f6368] font-mono">({building.ulpin})</span>
          </div>
        </Html>
      )}
    </group>
  );
}
