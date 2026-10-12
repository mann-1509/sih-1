import React, { useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { Html, Line } from '@react-three/drei';
import { localToLatLon } from '../../services/api';
import { UTILITY_COLORS } from '../../constants/utilityColors';

export function Pipeline3D({
  pipeline,
  onSelectAsset,
  selectedAsset,
  verticalExaggeration = 1.0,
  undergroundView = true,
  showPipeOverlay = true,
  conflictInfo = null,
  onSelectConflict = null,
  isNewGlow = false,
  isMapActive = true
}) {
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, []);

  const isSelected = selectedAsset && selectedAsset.ulpin === pipeline.ulpin;
  const isConflicted = Boolean(conflictInfo);
  const hasGlobalSelection = Boolean(selectedAsset);
  const showTag = isMapActive && (showPipeOverlay || undergroundView || isConflicted) && hovered;

  const p1 = useMemo(
    () => [pipeline.start_x || 0, pipeline.start_y !== undefined ? pipeline.start_y : -2, pipeline.start_z || 0],
    [pipeline.start_x, pipeline.start_y, pipeline.start_z]
  );
  const p2 = useMemo(
    () => [pipeline.end_x || 10, pipeline.end_y !== undefined ? pipeline.end_y : -2, pipeline.end_z || 10],
    [pipeline.end_x, pipeline.end_y, pipeline.end_z]
  );

  const v1 = useMemo(() => new THREE.Vector3(p1[0], p1[1] * verticalExaggeration, p1[2]), [p1, verticalExaggeration]);
  const v2 = useMemo(() => new THREE.Vector3(p2[0], p2[1] * verticalExaggeration, p2[2]), [p2, verticalExaggeration]);

  const subsurfaceCurve = useMemo(() => new THREE.LineCurve3(v1, v2), [v1, v2]);
  const depthCenter = useMemo(() => new THREE.Vector3().addVectors(v1, v2).multiplyScalar(0.5), [v1, v2]);

  const typeColors = {
    water_pipe: UTILITY_COLORS.water,
    sewer_pipe: UTILITY_COLORS.sewer,
    electric_cable: UTILITY_COLORS.electrical,
    gas_pipe: UTILITY_COLORS.gas,
    fiber_cable: UTILITY_COLORS.telecom
  };

  const baseColor = typeColors[pipeline.asset_type] || UTILITY_COLORS.water;
  const radius = pipeline.asset_type === 'water_pipe' ? 0.42 : pipeline.asset_type === 'electric_cable' ? 0.32 : 0.24;

  const activeColor = isConflicted
    ? '#ea4335'
    : isNewGlow
    ? '#1a73e8'
    : isSelected
    ? '#1a73e8'
    : hovered
    ? '#4285f4'
    : baseColor;

  const activeEmissive = isConflicted
    ? '#ea4335'
    : isNewGlow
    ? '#1a73e8'
    : isSelected
    ? '#1a73e8'
    : hovered
    ? '#1557b0'
    : '#000000';

  const activeEmissiveIntensity = isConflicted
    ? 0.75
    : isNewGlow
    ? 0.7
    : isSelected
    ? 0.55
    : hovered
    ? 0.3
    : 0.0;

  const opacityLevel = isSelected
    ? 1.0
    : hasGlobalSelection
    ? 0.22
    : 0.95;

  const handleClick = (e) => {
    e.stopPropagation();
    const point = e.point;
    const realDepth = pipeline.depth !== undefined ? pipeline.depth : (pipeline.start_y || -2.0);
    const realY = point.y <= 0.25 ? realDepth : (point.y / verticalExaggeration);
    const { lat, lon } = localToLatLon(point.x, point.z);

    const clickData = {
      x: Number(point.x.toFixed(2)),
      y: Number(realY.toFixed(2)),
      z: Number(point.z.toFixed(2)),
      worldX: point.x,
      worldY: point.y,
      worldZ: point.z,
      distance: 20,
      depth: realDepth,
      lat,
      lon
    };

    if (isConflicted && onSelectConflict) {
      onSelectConflict({
        ...conflictInfo,
        conflict_x: point.x,
        conflict_y: realY,
        conflict_z: point.z
      });
    }

    onSelectAsset(pipeline, clickData);
  };

  const groundSurfaceCurve = useMemo(() => {
    const s1 = new THREE.Vector3(p1[0], 0.08, p1[2]);
    const s2 = new THREE.Vector3(p2[0], 0.08, p2[2]);
    return [s1, s2];
  }, [p1, p2]);

  return (
    <group>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={handleClick}
      >
        <tubeGeometry args={[subsurfaceCurve, 32, isSelected ? radius * 1.3 : radius, 12, false]} />
        <meshStandardMaterial
          color={activeColor}
          emissive={activeEmissive}
          emissiveIntensity={activeEmissiveIntensity}
          roughness={0.3}
          metalness={0.4}
          transparent={hasGlobalSelection && !isSelected}
          opacity={opacityLevel}
        />
      </mesh>

      {isSelected && (
        <mesh>
          <tubeGeometry args={[subsurfaceCurve, 32, radius * 1.7, 12, false]} />
          <meshBasicMaterial color="#1a73e8" wireframe transparent opacity={0.3} />
        </mesh>
      )}

      {showPipeOverlay && !undergroundView && (
        <Line
          points={groundSurfaceCurve}
          color={activeColor}
          lineWidth={isSelected ? 4 : 2.5}
          dashed
          dashScale={2}
          dashSize={1}
          gapSize={0.5}
          transparent
          opacity={hasGlobalSelection && !isSelected ? 0.2 : 0.85}
        />
      )}

      {showTag && (
        <Html
          position={[depthCenter.x, depthCenter.y + 1.2, depthCenter.z]}
          center
          zIndexRange={[1, 5]}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          <div className="px-3 py-1.5 rounded-full bg-white text-[#202124] text-[11px] font-medium shadow-[0_2px_8px_rgba(60,64,67,0.3)] border border-[rgba(0,0,0,0.08)] flex items-center gap-2 whitespace-nowrap">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: activeColor }}
            />
            <span>{pipeline.name}</span>
            <span className="text-[10px] text-[#5f6368] font-mono">({pipeline.ulpin})</span>
          </div>
        </Html>
      )}
    </group>
  );
}
