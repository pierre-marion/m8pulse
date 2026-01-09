import React, { useState } from 'react';
import './SimplePlayerMap.css';

/**
 * CARTE SIMPLE 2D - Alternative ultra-légère au Globe 3D
 * Utilisez ce composant si le Globe est trop lourd
 * 
 * Pour l'activer : dans PlayersPage.js, remplacer
 * import Globe from './Globe'
 * par
 * import Globe from './SimplePlayerMap'
 */

const SimplePlayerMap = ({ onPlayerSelect }) => {
  const [selectedCity, setSelectedCity] = useState(null);

  const cities = [
    { name: 'Madrid', region: 'Europe', players: 8, color: '#FF4655' },
    { name: 'Rome', region: 'Europe', players: 6, color: '#FF9F1C' },
    { name: 'Washington DC', region: 'Amérique', players: 5, color: '#8A2BE2' },
    { name: 'Manille', region: 'Asie', players: 7, color: '#00AEEF' },
    { name: 'Varsovie', region: 'Europe', players: 4, color: '#4CAF50' }
  ];

  const handleCityClick = (city) => {
    setSelectedCity(city);
    if (onPlayerSelect) {
      onPlayerSelect(city.name);
    }
  };

  return (
    <div className="simple-player-map">
      <div className="map-header">
        <h2>🌍 Carte des Joueurs</h2>
        <p className="map-subtitle">Cliquez sur une ville pour voir les joueurs</p>
      </div>

      <div className="cities-grid">
        {cities.map(city => (
          <div
            key={city.name}
            className={`city-card ${selectedCity?.name === city.name ? 'selected' : ''}`}
            onClick={() => handleCityClick(city)}
            style={{ '--city-color': city.color }}
          >
            <div className="city-icon">📍</div>
            <h3 className="city-name">{city.name}</h3>
            <div className="city-region">{city.region}</div>
            <div className="city-stats">
              <span className="stat-icon">👥</span>
              <span className="stat-value">{city.players} joueurs</span>
            </div>
          </div>
        ))}
      </div>

      {selectedCity && (
        <div className="selected-city-info">
          <h3>📌 {selectedCity.name}</h3>
          <p>{selectedCity.players} joueurs actifs dans cette région</p>
          <button 
            className="reset-btn"
            onClick={() => {
              setSelectedCity(null);
              if (onPlayerSelect) onPlayerSelect(null);
            }}
          >
            Réinitialiser
          </button>
        </div>
      )}
    </div>
  );
};

export default SimplePlayerMap;
