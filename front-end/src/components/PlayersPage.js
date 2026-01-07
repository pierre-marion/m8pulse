import React, { useRef, useState } from 'react';
import './PlayersPage.css';
import Globe from './Globe';

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
      <Globe ref={globeRef} onPlayerSelect={handleCitySelect} />
    </div>
  );
}

export default PlayersPage;
