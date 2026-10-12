import React from 'react';

export function GroundGrid({
  groundOpacity = 0.75,
  undergroundView = false,
  verticalExaggeration = 1.0,
  showCrossSection = false
}) {
  const effectiveGroundOpacity = undergroundView
    ? Math.min(groundOpacity, 0.35)
    : groundOpacity;

  return (
    <group>
      <mesh
        position={[0, -0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[140, 140]} />
        <meshStandardMaterial
          color="#1e2229"
          transparent={true}
          opacity={effectiveGroundOpacity}
          roughness={0.85}
        />
      </mesh>

      <gridHelper
        args={[140, 70, '#5f6368', '#3c4043']}
        position={[0, 0.01, 0]}
      />

      <mesh position={[0, 0.02, -5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[140, 10]} />
        <meshBasicMaterial
          color="#2a303c"
          transparent
          opacity={effectiveGroundOpacity * 0.8}
        />
      </mesh>

      {undergroundView && (
        <group>
          <gridHelper
            args={[140, 35, '#1a73e8', '#3c4043']}
            position={[0, -3.5 * verticalExaggeration, 0]}
          />
          <gridHelper
            args={[140, 35, '#f9ab00', '#3c4043']}
            position={[0, -4.5 * verticalExaggeration, 0]}
          />
          <gridHelper
            args={[140, 35, '#9334e8', '#3c4043']}
            position={[0, -1.5 * verticalExaggeration, 0]}
          />
          <gridHelper
            args={[140, 35, '#8d6e63', '#3c4043']}
            position={[0, -6.0 * verticalExaggeration, 0]}
          />
        </group>
      )}

      {showCrossSection && (
        <mesh position={[0, -5 * verticalExaggeration, 0]} rotation={[0, 0, 0]}>
          <planeGeometry args={[140, 20 * verticalExaggeration]} />
          <meshBasicMaterial color="#1a73e8" transparent opacity={0.12} side={2} />
        </mesh>
      )}
    </group>
  );
}
