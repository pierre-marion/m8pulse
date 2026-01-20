import React, { useRef, useState, Suspense, lazy, forwardRef, useImperativeHandle } from 'react';
import './PlayersPage.css';

// Lazy load du Globe - ne charge que quand nécessaire
const Globe = lazy(() => import('../../common/Globe/Globe'));

const PlayersPage = forwardRef(({ user, onLogout, onLoginClick, onDashboardClick, onCitySelect }, ref) => {
  const globeRef = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Exposer les méthodes du Globe au parent via ref
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
    console.log('Ville sélectionnée:', cityName);
    setSelectedCity(cityName);
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
