import React, { useRef, useState, Suspense, lazy } from 'react';
import './PlayersPage.css';

// Lazy load du Globe - ne charge que quand nécessaire
const Globe = lazy(() => import('./Globe'));

function PlayersPage({ user, onLogout, onLoginClick, onDashboardClick, onCitySelect, onPlayerSelectFromPanel }) {
  const globeRef = useRef(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const handleCitySelect = (cityName) => {
    console.log('Ville sélectionnée:', cityName);
    setSelectedCity(cityName);
    if (onCitySelect) {
      onCitySelect(cityName);
    }
  };

  const handlePlayerSelectFromPanel = (cityName) => {
    handleCitySelect(cityName);
    if (onPlayerSelectFromPanel) {
      onPlayerSelectFromPanel(cityName);
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
}

export default PlayersPage;
