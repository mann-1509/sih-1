import React from 'react';

export function BottomStatusBar({
  latitude = 23.0225,
  longitude = 72.5714,
  groundElevation = 18,
  eyeAltitude = 65
}) {
  const formatCoordinate = (val, isLat) => {
    const absolute = Math.abs(val);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
    const cardinal = isLat ? (val >= 0 ? 'N' : 'S') : (val >= 0 ? 'E' : 'W');
    return `${degrees}°${minutes.toString().padStart(2, '0')}'${seconds.toString().padStart(2, '0')}"${cardinal}`;
  };

  return (
    <footer className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between pointer-events-none select-none px-4 py-1">
      <div className="google-status-bar flex items-center gap-3 pointer-events-auto">
        <span>PDEU UG Boys Hostel</span>
        <span className="text-[rgba(255,255,255,0.4)]">|</span>
        <span>3D ULPIN Cadastre</span>
        <span className="text-[rgba(255,255,255,0.4)]">|</span>
        <span className="text-[#8ab4f8]">60% Subsurface · 40% Above-Ground</span>
      </div>

      <div className="google-status-bar flex items-center gap-3.5 pointer-events-auto font-mono text-[10.5px]">
        <span>{formatCoordinate(latitude, true)} {formatCoordinate(longitude, false)}</span>
        <span className="text-[rgba(255,255,255,0.4)]">•</span>
        <span>elev {Math.round(groundElevation)} m</span>
        <span className="text-[rgba(255,255,255,0.4)]">•</span>
        <span>eye alt {Math.round(eyeAltitude)} m</span>
      </div>
    </footer>
  );
}
