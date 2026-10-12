import React, { useEffect, useRef, useMemo } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { GroundGrid } from './GroundGrid';
import { Building3D } from './Building3D';
import { Pipeline3D } from './Pipeline3D';
import { ConflictMarker3D } from './ConflictMarker3D';

function CameraController({
  focusPoint,
  focusTrigger,
  zoomAction,
  resetNorthTrigger,
  is3DMode,
  onCameraStatsChange
}) {
  const { camera } = useThree();
  const controlsRef = useRef(null);
  const animFrameRef = useRef(null);

  useEffect(() => {
    if (!focusTrigger || !focusPoint) return;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    const targetVec = new THREE.Vector3(focusPoint.x, focusPoint.y, focusPoint.z);
    const distance = focusPoint.distance || 22;

    const startCam = camera.position.clone();
    const currentTarget = controlsRef.current ? controlsRef.current.target.clone() : new THREE.Vector3(0, 0, 0);

    let currentDir = startCam.clone().sub(currentTarget);
    if (currentDir.lengthSq() < 0.001) {
      currentDir = new THREE.Vector3(1, 0.8, 1);
    }
    currentDir.normalize();

    if (is3DMode) {
      currentDir.y = Math.max(0.35, Math.min(0.85, currentDir.y));
    } else {
      currentDir = new THREE.Vector3(0.001, 1, 0.001);
    }
    currentDir.normalize();

    const endCam = targetVec.clone().add(currentDir.multiplyScalar(distance));
    const duration = 850;
    let startTime = null;

    function animateCam(time) {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const t = Math.min(1, elapsed / duration);
      const ease = 1 - Math.pow(1 - t, 3);

      camera.position.lerpVectors(startCam, endCam, ease);
      if (controlsRef.current) {
        controlsRef.current.target.lerpVectors(currentTarget, targetVec, ease);
        controlsRef.current.update();
      }

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animateCam);
      } else {
        camera.position.copy(endCam);
        if (controlsRef.current) {
          controlsRef.current.target.copy(targetVec);
          controlsRef.current.update();
        }
      }
    }

    animFrameRef.current = requestAnimationFrame(animateCam);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [focusTrigger]);

  useEffect(() => {
    if (!zoomAction || !controlsRef.current) return;
    const factor = zoomAction.direction === 'in' ? 0.78 : 1.25;
    const target = controlsRef.current.target;
    const offset = camera.position.clone().sub(target);
    offset.multiplyScalar(factor);
    camera.position.copy(target.clone().add(offset));
    controlsRef.current.update();
  }, [zoomAction]);

  useEffect(() => {
    if (!resetNorthTrigger || !controlsRef.current) return;
    const target = controlsRef.current.target;
    const dist = camera.position.distanceTo(target);
    const endCam = new THREE.Vector3(target.x, target.y + dist * 0.65, target.z + dist * 0.75);
    camera.position.copy(endCam);
    controlsRef.current.update();
  }, [resetNorthTrigger]);

  useEffect(() => {
    if (!controlsRef.current) return;
    const target = controlsRef.current.target;
    const dist = camera.position.distanceTo(target);
    if (!is3DMode) {
      camera.position.set(target.x + 0.001, target.y + dist, target.z + 0.001);
    } else {
      camera.position.set(target.x + dist * 0.55, target.y + dist * 0.5, target.z + dist * 0.65);
    }
    controlsRef.current.update();
  }, [is3DMode]);

  useFrame(() => {
    if (!controlsRef.current || !onCameraStatsChange) return;
    const target = controlsRef.current.target;
    const azimuthAngle = controlsRef.current.getAzimuthalAngle();
    const headingDeg = (azimuthAngle * (180 / Math.PI)) % 360;
    const eyeAlt = camera.position.distanceTo(target);

    onCameraStatsChange({
      heading: headingDeg,
      eyeAltitude: eyeAlt,
      x: target.x,
      z: target.z
    });
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      maxPolarAngle={is3DMode ? Math.PI / 2 + 0.05 : 0.08}
      minDistance={4}
      maxDistance={280}
    />
  );
}

export function SceneContainer({
  assets = [],
  selectedAsset,
  onSelectAsset,
  layerVisibility = {},
  groundOpacity = 0.75,
  undergroundView = true,
  showPipeOverlay = true,
  verticalExaggeration = 1.0,
  showCrossSection = false,
  conflictResult,
  onSelectConflict,
  focusPoint,
  focusTrigger,
  zoomAction,
  resetNorthTrigger,
  is3DMode = true,
  onCameraStatsChange,
  newlyCreatedUlpin,
  isMapActive = true
}) {
  const allBuildings = assets.filter((a) => a.asset_type === 'building');
  const allFloors = assets.filter((a) => a.asset_type === 'floor');
  const allPipelines = assets.filter((a) => a.category === 'infrastructure');

  const buildings = layerVisibility.buildings !== false ? allBuildings : [];
  const floors = layerVisibility.buildings !== false ? allFloors : [];

  const pipelines = allPipelines.filter((pipe) => {
    if (pipe.asset_type === 'water_pipe' && layerVisibility.water === false) return false;
    if (pipe.asset_type === 'sewer_pipe' && layerVisibility.sewer === false) return false;
    if (pipe.asset_type === 'electric_cable' && layerVisibility.electrical === false) return false;
    if (pipe.asset_type === 'gas_pipe' && layerVisibility.gas === false) return false;
    if (pipe.asset_type === 'fiber_cable' && layerVisibility.telecom === false) return false;
    return true;
  });

  const conflictMap = useMemo(() => {
    if (!conflictResult || !conflictResult.has_conflict) return {};
    const map = {};
    if (Array.isArray(conflictResult.conflicts)) {
      for (const c of conflictResult.conflicts) {
        if (c.existing_ulpin) {
          map[c.existing_ulpin] = c;
        }
      }
    }
    if (conflictResult.conflicting_asset?.ulpin && !map[conflictResult.conflicting_asset.ulpin]) {
      map[conflictResult.conflicting_asset.ulpin] = {
        existing_ulpin: conflictResult.conflicting_asset.ulpin,
        existing_name: conflictResult.conflicting_asset.name,
        minimum_distance_m: conflictResult.min_distance_meters || 0.35,
        status: 'SAFETY_BREACH'
      };
    }
    return map;
  }, [conflictResult]);

  return (
    <div className="w-full h-full absolute inset-0 bg-[#0b0d0e] overflow-hidden select-none">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: false }}
        onPointerMissed={(e) => {
          if (e.type === 'click' && onSelectAsset) {
            onSelectAsset(null);
          }
        }}
      >
        <color attach="background" args={['#0b0d0e']} />

        <ambientLight intensity={0.7} />
        <directionalLight position={[45, 65, 35]} intensity={1.15} castShadow />
        <pointLight position={[-35, 25, -35]} intensity={0.35} color="#1a73e8" />
        <pointLight position={[35, -15, 35]} intensity={0.25} color="#f9ab00" />

        <PerspectiveCamera makeDefault position={[48, 36, 52]} fov={48} far={1200} />

        <CameraController
          focusPoint={focusPoint}
          focusTrigger={focusTrigger}
          zoomAction={zoomAction}
          resetNorthTrigger={resetNorthTrigger}
          is3DMode={is3DMode}
          onCameraStatsChange={onCameraStatsChange}
        />

        <group>
          <GroundGrid
            groundOpacity={groundOpacity}
            undergroundView={undergroundView}
            verticalExaggeration={verticalExaggeration}
            showCrossSection={showCrossSection}
          />

          {buildings.map((bld) => {
            const bldFloors = floors.filter((f) => f.parent_building_id === bld.id);
            return (
              <Building3D
                key={bld.ulpin}
                building={bld}
                floors={bldFloors}
                onSelectAsset={onSelectAsset}
                selectedAsset={selectedAsset}
                verticalExaggeration={verticalExaggeration}
                conflictInfo={conflictMap[bld.ulpin]}
                onSelectConflict={onSelectConflict}
                isMapActive={isMapActive}
              />
            );
          })}

          {pipelines.map((pipe) => (
            <Pipeline3D
              key={pipe.ulpin}
              pipeline={pipe}
              onSelectAsset={onSelectAsset}
              selectedAsset={selectedAsset}
              verticalExaggeration={verticalExaggeration}
              undergroundView={undergroundView}
              showPipeOverlay={showPipeOverlay}
              conflictInfo={conflictMap[pipe.ulpin]}
              onSelectConflict={onSelectConflict}
              isNewGlow={newlyCreatedUlpin === pipe.ulpin}
              isMapActive={isMapActive}
            />
          ))}

          <ConflictMarker3D
            conflictResult={conflictResult}
            verticalExaggeration={verticalExaggeration}
            onSelectConflict={onSelectConflict}
            showMarkers={isMapActive}
            isMapActive={isMapActive}
          />
        </group>
      </Canvas>
    </div>
  );
}
