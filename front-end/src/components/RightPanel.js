import React, { useState } from 'react';
import Calendar from './Calendar';
import './RightPanel.css';
import { useDarkMode } from '../contexts/DarkModeContext';

function RightPanel({ currentGame, onDashboardClick, user, onLogout, onLoginClick }) {
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Données des joueurs par jeu
  const playersData = {
    'Valorant': [
      { name: 'Minny', role: 'Duelist', kd: '1.24', acs: '245', wr: '64%' },
      { name: 'Dipzh', role: 'Controller', kd: '1.08', acs: '198', wr: '62%' },
      { name: 'Buys', role: 'Initiator', kd: '1.15', acs: '215', wr: '63%' },
      { name: 'Marteen', role: 'Sentinel', kd: '0.98', acs: '167', wr: '61%' },
      { name: 'Starxo', role: 'Flex', kd: '1.19', acs: '223', wr: '65%' }
    ],
    'Counter Strike': [
      { name: 'JaCkz', role: 'AWPer', kd: '1.31', rating: '1.18', wr: '58%' },
      { name: 'afro', role: 'Rifler', kd: '1.15', rating: '1.09', wr: '57%' },
      { name: 'bodyy', role: 'Entry', kd: '1.08', rating: '1.04', wr: '56%' },
      { name: 'Lucky', role: 'Support', kd: '0.96', rating: '0.98', wr: '55%' },
      { name: 'JACKZ', role: 'IGL', kd: '1.02', rating: '1.01', wr: '58%' }
    ],
    'Call of Duty': [
      { name: 'HyDra', role: 'SMG', kd: '1.22', spm: '342', wr: '61%' },
      { name: 'Nastie', role: 'AR', kd: '1.18', spm: '298', wr: '60%' },
      { name: 'Vikul', role: 'Flex', kd: '1.05', spm: '276', wr: '59%' },
      { name: 'Kremp', role: 'AR', kd: '1.11', spm: '289', wr: '61%' }
    ],
    'Fortnite': [
      { name: 'Kami', role: 'IGL', kills: '4.8', placement: '3.2', wr: '68%' },
      { name: 'Vato', role: 'Fragger', kills: '5.6', placement: '3.2', wr: '69%' },
      { name: 'Setty', role: 'Support', kills: '3.9', placement: '3.2', wr: '67%' }
    ]
  };

  const players = playersData[currentGame] || playersData['Valorant'];
  const currentPlayer = players[selectedPlayer];

  const getGameColor = () => {
    switch(currentGame) {
      case 'Valorant': return '#FF4655';
      case 'Counter Strike': return '#FF9F1C';
      case 'Call of Duty': return '#8A2BE2';
      case 'Fortnite': return '#00AEEF';
      default: return '#7D3CFF';
    }
  };

  const getStatKeys = () => {
    const keys = Object.keys(currentPlayer).filter(key => 
      key !== 'name' && key !== 'role' && key !== 'wr'
    );
    return keys;
  };

  return (
    <div className="right-panel">
      <div className="panel-section profils-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle" style={{ background: `linear-gradient(135deg, ${getGameColor()}, ${getGameColor()}dd)` }}>
              <span className="avatar-initial">
                {user ? user.username.charAt(0).toUpperCase() : 'G'}
              </span>
              {user && <div className="online-indicator"></div>}
            </div>
          </div>
          
          <div className="profile-info">
            <div className="username-text">{user ? user.username : 'Invité'}</div>
          </div>
          
          <button 
            className="action-btn-profile btn-theme"
            onClick={toggleDarkMode}
            title={isDarkMode ? "Mode clair" : "Mode sombre"}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
          
          {user ? (
            <button 
              className="action-btn-profile btn-logout"
              onClick={onLogout}
              title="Déconnexion"
            >
              🚪
            </button>
          ) : (
            <button 
              className="action-btn-profile btn-login"
              onClick={onLoginClick}
              title="Connexion"
            >
              👤
            </button>
          )}
        </div>
        
        {user && user.roles?.includes('ROLE_ADMIN') && (
          <div className="profile-actions-grid">
            <button 
              className="action-btn-profile btn-dashboard"
              onClick={onDashboardClick}
            >
              📊 Admin
            </button>
          </div>
        )}
      </div>
      
      <div className="panel-section stats-section">
        <div className="stats-header">
          <h2 className="panel-title-center">STATS</h2>
          <div className="stats-subtitle">LIVE PERFORMANCE</div>
        </div>
        
        {/* Hexagon Player Selector */}
        <div className="hexagon-selector">
          {players.map((player, index) => (
            <div
              key={index}
              className={`hexagon-wrapper ${selectedPlayer === index ? 'active' : ''}`}
              onClick={() => setSelectedPlayer(index)}
            >
              <div 
                className="hexagon"
                style={selectedPlayer === index ? { 
                  background: `linear-gradient(135deg, ${getGameColor()}, ${getGameColor()}dd)`,
                  boxShadow: `0 0 20px ${getGameColor()}80`
                } : {}}
              >
                <div className="hexagon-content">
                  {player.name.charAt(0)}
                </div>
              </div>
              {selectedPlayer === index && (
                <div className="hexagon-pulse" style={{ 
                  borderColor: getGameColor() 
                }}></div>
              )}
            </div>
          ))}
        </div>

        {/* Player Info */}
        <div className="player-info-simple">
          <div className="player-name-large" style={{ color: getGameColor() }}>
            {currentPlayer.name.toUpperCase()}
          </div>
          <div className="player-role-text">{currentPlayer.role}</div>
        </div>

        {/* Stats Display */}
        <div className="stats-bars-container">
          {getStatKeys().map((key, index) => {
            const value = currentPlayer[key];
            const numValue = parseFloat(value);
            const maxValue = key === 'kd' ? 2 : key === 'rating' ? 2 : key === 'acs' ? 400 : key === 'spm' ? 500 : key === 'kills' ? 10 : key === 'placement' ? 5 : key === 'wr' ? 100 : 100;
            const percentage = key === 'wr' ? numValue : (numValue / maxValue) * 100;
            
            return (
              <div key={index} className="stat-bar-item">
                <div className="stat-bar-header">
                  <span className="stat-bar-label">{key.toUpperCase()}</span>
                  <span className="stat-bar-value" style={{ color: getGameColor() }}>
                    {value}
                  </span>
                </div>
                <div className="stat-bar-track">
                  <div 
                    className="stat-bar-fill"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      background: `linear-gradient(90deg, ${getGameColor()}, ${getGameColor()}dd)`,
                      boxShadow: `0 0 15px ${getGameColor()}80`
                    }}
                  >
                    <div className="stat-bar-glow" style={{ background: getGameColor() }}></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="panel-section planning-section">
        <h2 className="panel-title">PLANNING</h2>
        <Calendar currentGame={currentGame} />
      </div>
    </div>
  );
}

export default RightPanel;
