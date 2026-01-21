import React, { useRef, Suspense, lazy, forwardRef, useImperativeHandle } from 'react';
import './PlayersPage.css';

const Globe = lazy(() => import('../../common/Globe/Globe'));

const PlayersPage = forwardRef(({ onCitySelect }, ref) => {
  const globeRef = useRef(null);

  useImperativeHandle(ref, () => ({
    zoomToCity: (cityName) => {
      if (globeRef.current && globeRef.current.zoomToCity) {
        globeRef.current.zoomToCity(cityName);
      }
    },
    resetCamera: () => {
      if (globeRef.current && globeRef.current.resetCamera) {
        globeRef.current.resetCamera();
      }
    }
  }));

  const handleCitySelect = (cityName) => {
    if (onCitySelect) {
      onCitySelect(cityName);
    }
  };

  return (
    <div className="players-page">
      <Suspense fallback={
        <div className="globe-loading">
          <div className="spinner"></div>
          <p>Chargement du globe 3D...</p>
        </div>
      }>
        <Globe ref={globeRef} onPlayerSelect={handleCitySelect} />
      </Suspense>
    </div>
  );
});

export default PlayersPage;
