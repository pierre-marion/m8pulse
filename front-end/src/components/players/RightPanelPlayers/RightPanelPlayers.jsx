import React, { useState, useEffect } from 'react';
import './RightPanelPlayers.css';
import { useDarkMode } from '../contexts/DarkModeContext';

function RightPanelPlayers({ selectedCity, user, onLogout, onLoginClick, onDashboardClick }) {
  const [activeTab, setActiveTab] = useState('joueurs');
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Données des joueurs par ville
  const playersByCity = {
    'Madrid': [
      { 
        id: 1,
        name: 'Alex', 
        fullName: 'Alejandro Masanet',
        game: 'Counter Strike',
        role: 'IGL', 
        rating: '1.01', 
        tRating: '1.00',
        ctRating: '1.01',
        wr: '48.5%',
        gamesPlayed: 33,
        description: 'Leader en jeu espagnol avec une excellente vision tactique. Guide son équipe avec calme et précision.'
      },
      { 
        id: 2,
        name: 'Mopoz', 
        fullName: 'Alejandro Fernandez-Quejo Cano',
        game: 'Counter Strike',
        role: 'Lurk', 
        rating: '1.08', 
        tRating: '1.12',
        ctRating: '1.04',
        wr: '48.5%',
        gamesPlayed: 33,
        description: 'Lurker patient et méthodique. Expert en jeu positionnel et clutchs impossibles.'
      },
      { 
        id: 3,
        name: 'Sausol', 
        fullName: 'Pere Solsona Saumell',
        game: 'Counter Strike',
        role: 'Rifle', 
        rating: '1.06', 
        tRating: '1.08',
        ctRating: '1.04',
        wr: '48.5%',
        gamesPlayed: 33,
        description: 'Rifler polyvalent avec un aim solide. Excellente capacité d\'adaptation aux situations.'
      },
      { 
        id: 4,
        name: 'Dav1g', 
        fullName: 'David Granado Bermudo',
        game: 'Counter Strike',
        role: 'Entry', 
        rating: '0.99', 
        tRating: '0.99',
        ctRating: '0.98',
        wr: '48.5%',
        gamesPlayed: 33,
        description: 'Entry fragger agressif qui ouvre les sites avec détermination. Premier à entrer, toujours prêt.'
      },
      { 
        id: 5,
        name: 'MartinezSa', 
        fullName: 'Antonio Martinez',
        game: 'Counter Strike',
        role: 'AWP', 
        rating: '1.10', 
        tRating: '1.07',
        ctRating: '1.14',
        wr: '48.5%',
        gamesPlayed: 33,
        description: 'Sniper précis avec des réflexes exceptionnels. Dominant au AWP dans toutes les situations.'
      }
    ],
    'Rome': [
      { 
        id: 6,
        name: 'bipo', 
        fullName: 'Taranvir Singh',
        game: 'Valorant',
        role: 'Duelist', 
        kda: '1.35', 
        acs: '231',
        rating: '1.04',
        wr: '33.3%',
        gamesPlayed: 3,
        description: 'Duelist agressif italien avec un jeu explosif. Spécialiste des entrées fracassantes et des multi-kills.'
      }
    ],
    'Washington DC': [
      { 
        id: 7,
        name: 'Envoy', 
        fullName: 'Dylan Hannon',
        game: 'Call of Duty',
        role: 'SMG', 
        overallKD: '0.9',
        hpKD: '0.9',
        sndKD: '0.97',
        olKD: '0.87',
        wr: '77.8%',
        gamesPlayed: 9,
        description: 'Joueur SMG rapide et agressif. Expert en mouvement et contrôle de map en mode Hardpoint.'
      },
      { 
        id: 8,
        name: 'Ghosty', 
        fullName: 'Daniel Rothe',
        game: 'Call of Duty',
        role: 'AR', 
        overallKD: '1.11',
        hpKD: '1.05',
        sndKD: '1.05',
        olKD: '1.22',
        wr: '77.8%',
        gamesPlayed: 9,
        description: 'Assault Rifle dominant avec un excellent positionnement. Anchor fiable dans tous les modes.'
      },
      { 
        id: 9,
        name: 'Neptune', 
        fullName: 'Travis McCloud',
        game: 'Call of Duty',
        role: 'SMG', 
        overallKD: '1.06',
        hpKD: '1.1',
        sndKD: '0.92',
        olKD: '1.05',
        wr: '77.8%',
        gamesPlayed: 9,
        description: 'SMG polyvalent avec un excellent sens du jeu. Performant sur tous les modes de jeu.'
      },
      { 
        id: 10,
        name: 'Sib', 
        fullName: 'Daunte Gray',
        game: 'Call of Duty',
        role: 'AR', 
        overallKD: '0.91',
        hpKD: '1.01',
        sndKD: '0.83',
        olKD: '0.82',
        wr: '77.8%',
        gamesPlayed: 9,
        description: 'Assault Rifle avec un jeu intelligent. Excellent en support et positionnement tactique.'
      }
    ],
    'Manille': [
      { 
        id: 11,
        name: 'GLYPFI', 
        fullName: 'Conner Garcia',
        game: 'Valorant',
        role: 'Co-IGL/Smoker', 
        kda: '1.6', 
        acs: '175',
        rating: '0.96',
        wr: '33.3%',
        gamesPlayed: 3,
        description: 'Co-IGL philippin avec une excellente vision stratégique. Expert en smokes et coordination d\'équipe.'
      }
    ],
    'Varsovie': [
      { 
        id: 12,
        name: 'Minny', 
        fullName: 'Patrik Hůšek',
        game: 'Valorant',
        role: 'Sentinels', 
        kda: '1.56', 
        acs: '209',
        rating: '1.2',
        wr: '33.3%',
        gamesPlayed: 3,
        description: 'Sentinel tchèque défensif avec un excellent sens du jeu. Maître du contrôle de site.'
      },
      { 
        id: 13,
        name: 'marteen', 
        fullName: 'Martin Pištek',
        game: 'Valorant',
        role: 'Flex', 
        kda: '1.68', 
        acs: '261',
        rating: '1.2',
        wr: '33.3%',
        gamesPlayed: 3,
        description: 'Joueur flex tchèque extrêmement polyvalent. Capable de jouer tous les rôles avec excellence.'
      },
      { 
        id: 14,
        name: 'starxo', 
        fullName: 'Patryk Kopczyński',
        game: 'Valorant',
        role: 'IGL/Initiator', 
        kda: '1.17', 
        acs: '154',
        rating: '0.78',
        wr: '33.3%',
        gamesPlayed: 3,
        description: 'IGL polonais expérimenté avec une grande intelligence de jeu. Leader stratégique de l\'équipe.'
      }
    ]
  };

  const currentPlayers = selectedCity ? (playersByCity[selectedCity] || []) : [];

  useEffect(() => {
    if (currentPlayers.length > 0 && !selectedPlayer) {
      setSelectedPlayer(currentPlayers[0]);
    } else if (currentPlayers.length === 0) {
      setSelectedPlayer(null);
    }
  }, [selectedCity, currentPlayers.length]);

  const getGameColor = (game) => {
    switch(game) {
      case 'Valorant': return '#FF4655';
      case 'Counter Strike': return '#FF9F1C';
      case 'Call of Duty': return '#8A2BE2';
      case 'Fortnite': return '#00AEEF';
      default: return '#7D3CFF';
    }
  };

  const getStatKeys = (player) => {
    if (!player) return [];
    return Object.keys(player).filter(key => 
      !['id', 'name', 'fullName', 'role', 'game', 'description', 'wr', 'gamesPlayed'].includes(key)
    );
  };

  return (
    <div className="right-panel right-panel-players">
      {/* Section Profil */}
      <div className="panel-section profils-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle" style={{ background: 'linear-gradient(135deg, #7D3CFF, #7D3CFFdd)' }}>
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

      {/* Onglets spécifiques à la page joueurs */}
      <div className="players-tabs">
        <button 
          className={`tab-btn ${activeTab === 'joueurs' ? 'active' : ''}`}
          onClick={() => setActiveTab('joueurs')}
        >
          JOUEURS
        </button>
        <button 
          className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
          disabled={!selectedPlayer}
        >
          DÉTAILS
        </button>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'joueurs' && (
        <div className="panel-section players-section">
          {selectedCity ? (
            <>
              <div className="city-title">
                <h2 className="panel-title-center">{selectedCity.toUpperCase()}</h2>
                <div className="stats-subtitle">{currentPlayers.length} JOUEUR{currentPlayers.length > 1 ? 'S' : ''}</div>
              </div>

              {currentPlayers.length > 0 ? (
                <div className="hexagon-selector">
                  {currentPlayers.map((player) => (
                    <div
                      key={player.id}
                      className={`hexagon-wrapper ${selectedPlayer?.id === player.id ? 'active' : ''}`}
                      onClick={() => setSelectedPlayer(player)}
                    >
                      <div 
                        className="hexagon"
                        style={selectedPlayer?.id === player.id ? { 
                          background: `linear-gradient(135deg, ${getGameColor(player.game)}, ${getGameColor(player.game)}dd)`,
                          boxShadow: `0 0 20px ${getGameColor(player.game)}80`
                        } : {}}
                      >
                        <div className="hexagon-content">
                          {player.name.charAt(0)}
                        </div>
                      </div>
                      <div className="player-name-hex">{player.name}</div>
                      {selectedPlayer?.id === player.id && (
                        <div className="hexagon-pulse" style={{ 
                          borderColor: getGameColor(player.game) 
                        }}></div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-players">
                  <p>Aucun joueur dans cette ville</p>
                </div>
              )}

              {selectedPlayer && (
                <div className="player-info-simple">
                  <div className="player-name-large" style={{ color: getGameColor(selectedPlayer.game) }}>
                    {selectedPlayer.name.toUpperCase()}
                  </div>
                  <div className="player-fullname-text">{selectedPlayer.fullName}</div>
                  <div className="player-role-text">{selectedPlayer.role}</div>
                  <div className="player-game-text">{selectedPlayer.game}</div>
                </div>
              )}
            </>
          ) : (
            <div className="no-city-selected">
              <div className="globe-icon">🌍</div>
              <h3>Sélectionnez une ville</h3>
              <p>Cliquez sur une ville rouge du globe pour voir les joueurs</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'details' && selectedPlayer && (
        <div className="panel-section details-section">
          <div className="player-header">
            <div className="player-avatar-large">
              <div 
                className="avatar-circle-large"
                style={{ 
                  background: `linear-gradient(135deg, ${getGameColor(selectedPlayer.game)}, ${getGameColor(selectedPlayer.game)}dd)`,
                  boxShadow: `0 0 30px ${getGameColor(selectedPlayer.game)}60`
                }}
              >
                {selectedPlayer.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <h2 className="player-name-title" style={{ color: getGameColor(selectedPlayer.game) }}>
              {selectedPlayer.name.toUpperCase()}
            </h2>
            <div className="player-fullname-subtitle">{selectedPlayer.fullName}</div>
            <div className="player-meta">
              <span className="player-role-badge">{selectedPlayer.role}</span>
              <span className="player-game-badge">{selectedPlayer.game}</span>
            </div>
          </div>

          <div className="player-description">
            <h3>À propos</h3>
            <p>{selectedPlayer.description}</p>
          </div>

          <div className="player-stats-detailed">
            <h3>Statistiques</h3>
            
            {/* Win Rate en grand */}
            <div className="stat-highlight">
              <div className="stat-highlight-label">WIN RATE</div>
              <div className="stat-highlight-value" style={{ color: getGameColor(selectedPlayer.game) }}>
                {selectedPlayer.wr}
              </div>
            </div>

            {/* Autres stats */}
            <div className="stats-bars-container">
              {getStatKeys(selectedPlayer).map((key, index) => {
                const value = selectedPlayer[key];
                const numValue = parseFloat(value);
                const maxValue = 
                  key === 'rating' ? 2 : 
                  key === 'tRating' ? 2 : 
                  key === 'ctRating' ? 2 :
                  key === 'kda' ? 3 :
                  key === 'acs' ? 400 : 
                  key === 'overallKD' ? 2 :
                  key === 'hpKD' ? 2 :
                  key === 'sndKD' ? 2 :
                  key === 'olKD' ? 2 : 100;
                const percentage = (numValue / maxValue) * 100;
                
                return (
                  <div key={index} className="stat-bar-item">
                    <div className="stat-bar-header">
                      <span className="stat-bar-label">{key.toUpperCase()}</span>
                      <span className="stat-bar-value" style={{ color: getGameColor(selectedPlayer.game) }}>
                        {value}
                      </span>
                    </div>
                    <div className="stat-bar-track">
                      <div 
                        className="stat-bar-fill"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          background: `linear-gradient(90deg, ${getGameColor(selectedPlayer.game)}, ${getGameColor(selectedPlayer.game)}dd)`,
                          boxShadow: `0 0 15px ${getGameColor(selectedPlayer.game)}80`
                        }}
                      >
                        <div className="stat-bar-glow" style={{ background: getGameColor(selectedPlayer.game) }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default RightPanelPlayers;
