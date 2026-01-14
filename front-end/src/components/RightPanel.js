import React, { useEffect, useMemo, useState } from 'react';
import Calendar from './Calendar';
import './RightPanel.css';
import { useDarkMode } from '../contexts/DarkModeContext';
import Icon from './Icon';

function useMediaQuery(query) {
  const getMatches = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return false;
    return window.matchMedia(query).matches;
  };

  const [matches, setMatches] = useState(getMatches);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia === 'undefined') return;

    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);

    // Initial sync
    onChange();

    if (mql.addEventListener) mql.addEventListener('change', onChange);
    else mql.addListener(onChange);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', onChange);
      else mql.removeListener(onChange);
    };
  }, [query]);

  return matches;
}

function RightPanel({ currentGame, onDashboardClick, onDesignClick, onDatasetsClick, user, onLogout, onLoginClick, currentPage }) {
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Laptop/MacBook widths: show fewer items to avoid crowding.
  // - <= 1920px: show 2 (covers all laptops including MacBook Air 17")
  // - otherwise: show 3
  const isLaptopWidth = useMediaQuery('(max-width: 1920px)');
  const topPlayersCount = isLaptopWidth ? 2 : 3;

  useEffect(() => {
    if (selectedPlayer >= topPlayersCount) {
      setSelectedPlayer(0);
    }
  }, [selectedPlayer, topPlayersCount]);

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
              {user && user.roles?.includes('ROLE_ADMIN') ? <><Icon name="star" size={14} /> Admin</> : 
               user && user.roles?.includes('ROLE_AUTHOR') ? <><Icon name="edit" size={14} /> Auteur</> : 
               user ? <><Icon name="gamepad" size={14} /> Joueur</> : <><Icon name="user" size={14} /> Visiteur</>}
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
                  <Icon name="barChart" size={16} /> Dashboard
                </button>
              )}
              {(user.roles?.includes('ROLE_PROVIDER') || user.roles?.includes('ROLE_ADMIN')) && (
                <button className="action-mini provider" onClick={onDatasetsClick}>
                  <Icon name="database" size={16} /> Datasets
                </button>
              )}
              {user.roles?.includes('ROLE_EDITOR') && !user.roles?.includes('ROLE_ADMIN') && (
                <button className="action-mini admin" onClick={onDashboardClick}>
                  <Icon name="edit" size={16} /> Éditeur
                </button>
              )}
              {user.roles?.includes('ROLE_DESIGNER') && !user.roles?.includes('ROLE_ADMIN') && !user.roles?.includes('ROLE_EDITOR') && (
                <button className="action-mini admin" onClick={onDesignClick}>
                  <Icon name="palette" size={16} /> Design
                </button>
              )}
              <button className="action-mini logout" onClick={onLogout}>
                <Icon name="logOut" size={16} /> Déconnexion
              </button>
            </>
          ) : (
            <button className="action-mini login" onClick={onLoginClick}>
              <Icon name="user" size={16} /> Connexion
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
        
        <div className="players-compact-list">
          {topPlayers.slice(0, topPlayersCount).map((player, index) => (
            <div 
              key={player.id}
              className={`player-compact-card ${selectedPlayer === index ? 'active' : ''}`}
              onClick={() => setSelectedPlayer(index)}
            >
              <div className="player-avatar-compact" style={{
                background: getGameColor(player.game)
              }}>
                {player.name.charAt(0)}
              </div>
              <div className="player-info-compact">
                <div className="player-name-compact">{player.name}</div>
                <div className="player-game-compact" style={{ color: getGameColor(player.game) }}>
                  {player.game.replace('Counter Strike', 'CS2').replace('Call of Duty', 'CoD')}
                </div>
              </div>
              <div className="player-rating-compact">
                <div className="rating-value" style={{ color: getGameColor(player.game) }}>
                  {player.rating}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {selectedPlayer !== null && topPlayers[selectedPlayer] && (
          <div className="player-detail-box" style={{
            borderLeftColor: getGameColor(topPlayers[selectedPlayer].game)
          }}>
            <div className="detail-row">
              <span className="detail-label">
                <Icon name="award" size={12} /> WR
              </span>
              <span className="detail-value">{topPlayers[selectedPlayer].wr}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">
                <Icon name="gamepad" size={12} /> Games
              </span>
              <span className="detail-value">{topPlayers[selectedPlayer].gamesPlayed}</span>
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
