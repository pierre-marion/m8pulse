import React, { useState } from 'react';
import Calendar from './Calendar';
import './RightPanel.css';
import { useDarkMode } from '../contexts/DarkModeContext';

function RightPanel({ currentGame, onDashboardClick, user, onLogout, onLoginClick, currentPage }) {
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const topPlayers = [
    { 
      id: 1,
      name: 'Alex', 
      fullName: 'Alejandro Masanet',
      game: 'Counter Strike',
      role: 'IGL',
      city: 'Madrid',
      rating: '1.01',
      wr: '48.5%',
      gamesPlayed: 33
    },
    { 
      id: 2,
      name: 'bipo', 
      fullName: 'Taranvir Singh',
      game: 'Valorant',
      role: 'Duelist',
      city: 'Rome',
      rating: '1.04',
      wr: '33.3%',
      gamesPlayed: 3
    },
    { 
      id: 3,
      name: 'Envoy', 
      fullName: 'Dylan Hannon',
      game: 'Call of Duty',
      role: 'SMG',
      city: 'Washington DC',
      rating: '0.9',
      wr: '77.8%',
      gamesPlayed: 9
    },
    { 
      id: 4,
      name: 'GLYPFI', 
      fullName: 'Conner Garcia',
      game: 'Valorant',
      role: 'Co-IGL',
      city: 'Manille',
      rating: '0.96',
      wr: '33.3%',
      gamesPlayed: 3
    },
    { 
      id: 5,
      name: 'marteen', 
      fullName: 'Martin Pištek',
      game: 'Valorant',
      role: 'Flex',
      city: 'Varsovie',
      rating: '1.2',
      wr: '33.3%',
      gamesPlayed: 3
    }
  ];

  const getGameColor = (game) => {
    const colors = {
      'Valorant': '#FF4655',
      'Counter Strike': '#F5A623',
      'Call of Duty': '#4CAF50',
      'Fortnite': '#9C27B0'
    };
    return colors[game] || '#667eea';
  };

  return (
    <div className="right-panel">
      {/* SECTION PROFIL MODERNE */}
      <div className="panel-section profile-modern">
        <div className="profile-compact">
          <div className="avatar-modern" style={{ background: `linear-gradient(135deg, #667eea, #764ba2)` }}>
            {user ? user.username.charAt(0).toUpperCase() : 'G'}
            {user && <span className="status-dot"></span>}
          </div>
          <div className="profile-text">
            <div className="username-modern">{user ? user.username : 'Invité'}</div>
            <div className="user-role">
              {user && user.roles?.includes('ROLE_ADMIN') ? '⭐ Admin' : 
               user && user.roles?.includes('ROLE_AUTHOR') ? '✍️ Auteur' : 
               user ? '🎮 Joueur' : '👤 Visiteur'}
            </div>
          </div>
          <button className="theme-toggle-mini" onClick={toggleDarkMode} title={isDarkMode ? 'Mode clair' : 'Mode sombre'}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
        
        <div className="quick-actions">
          {user ? (
            <>
              {user.roles?.includes('ROLE_ADMIN') && (
                <button className="action-mini admin" onClick={onDashboardClick}>
                  📊 Dashboard
                </button>
              )}
              <button className="action-mini logout" onClick={onLogout}>
                🚪 Déconnexion
              </button>
            </>
          ) : (
            <button className="action-mini login" onClick={onLoginClick}>
              👤 Connexion
            </button>
          )}
        </div>
      </div>
      
      {/* SECTION TOP PLAYERS */}
      <div className="panel-section top-players">
        <div className="section-header">
          <h3 className="section-title">TOP PLAYERS</h3>
          <span className="section-badge">M8 Global</span>
        </div>
        
        <div className="players-grid">
          {topPlayers.slice(0, 3).map((player, index) => (
            <div 
              key={player.id}
              className={`player-card ${selectedPlayer === index ? 'active' : ''}`}
              onClick={() => setSelectedPlayer(index)}
              style={{
                borderColor: selectedPlayer === index ? getGameColor(player.game) : 'transparent'
              }}
            >
              <div className="player-hex" style={{
                background: selectedPlayer === index 
                  ? `linear-gradient(135deg, ${getGameColor(player.game)}, ${getGameColor(player.game)}dd)`
                  : 'linear-gradient(135deg, #f8f8f8, #e8e8e8)'
              }}>
                {player.name.charAt(0)}
              </div>
              <div className="player-mini-info">
                <div className="player-mini-name">{player.name}</div>
                <div className="player-mini-city">{player.city}</div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedPlayer !== null && topPlayers[selectedPlayer] && (
          <div className="player-spotlight" style={{
            borderLeftColor: getGameColor(topPlayers[selectedPlayer].game)
          }}>
            <div className="spotlight-header">
              <div className="spotlight-name">{topPlayers[selectedPlayer].name.toUpperCase()}</div>
              <div className="spotlight-role">{topPlayers[selectedPlayer].role}</div>
            </div>
            <div className="spotlight-game" style={{
              color: getGameColor(topPlayers[selectedPlayer].game)
            }}>
              {topPlayers[selectedPlayer].game}
            </div>
            <div className="spotlight-stats">
              <div className="stat-quick">
                <span className="stat-label">WR</span>
                <span className="stat-val">{topPlayers[selectedPlayer].wr}</span>
              </div>
              <div className="stat-quick">
                <span className="stat-label">Games</span>
                <span className="stat-val">{topPlayers[selectedPlayer].gamesPlayed}</span>
              </div>
              <div className="stat-quick">
                <span className="stat-label">Rating</span>
                <span className="stat-val">{topPlayers[selectedPlayer].rating}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* SECTION PLANNING */}
      <div className="panel-section planning-modern">
        <div className="section-header">
          <h3 className="section-title">PLANNING</h3>
          <span className="section-badge-small">Janvier 2026</span>
        </div>
        <Calendar currentGame={currentGame} />
      </div>
    </div>
  );
}

export default RightPanel;
