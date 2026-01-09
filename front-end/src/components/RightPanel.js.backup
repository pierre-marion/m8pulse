import React, { useState, useEffect } from 'react';
import Calendar from './Calendar';
import './RightPanel.css';
import { useDarkMode } from '../contexts/DarkModeContext';

function RightPanel({ currentGame, onDashboardClick, user, onLogout, onLoginClick, currentPage, selectedCity, onPlayerClick }) {
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const [selectedPlayerDetail, setSelectedPlayerDetail] = useState(null);
  const [activeTab, setActiveTab] = useState('joueurs');
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Mix de 5 joueurs de différentes villes pour l'affichage par défaut
  const defaultPlayersForGlobe = [
    { 
      id: 1,
      name: 'Alex', 
      fullName: 'Alejandro Masanet',
      game: 'Counter Strike',
      role: 'IGL',
      city: 'Madrid',
      rating: '1.01', 
      tRating: '1.00',
      ctRating: '1.01',
      wr: '48.5%',
      gamesPlayed: 33,
      description: 'Leader en jeu espagnol avec une excellente vision tactique. Guide son équipe avec calme et précision.'
    },
    { 
      id: 6,
      name: 'bipo', 
      fullName: 'Taranvir Singh',
      game: 'Valorant',
      role: 'Duelist',
      city: 'Rome',
      kda: '1.35', 
      acs: '231',
      rating: '1.04',
      wr: '33.3%',
      gamesPlayed: 3,
      description: 'Duelist agressif italien avec un jeu explosif. Spécialiste des entrées fracassantes et des multi-kills.'
    },
    { 
      id: 7,
      name: 'Envoy', 
      fullName: 'Dylan Hannon',
      game: 'Call of Duty',
      role: 'SMG',
      city: 'Washington DC',
      overallKD: '0.9',
      hpKD: '0.9',
      sndKD: '0.97',
      olKD: '0.87',
      wr: '77.8%',
      gamesPlayed: 9,
      description: 'Joueur SMG rapide et agressif. Expert en mouvement et contrôle de map en mode Hardpoint.'
    },
    { 
      id: 11,
      name: 'GLYPFI', 
      fullName: 'Conner Garcia',
      game: 'Valorant',
      role: 'Co-IGL/Smoker',
      city: 'Manille',
      kda: '1.6', 
      acs: '175',
      rating: '0.96',
      wr: '33.3%',
      gamesPlayed: 3,
      description: 'Co-IGL philippin avec une excellente vision stratégique. Expert en smokes et coordination d\'équipe.'
    },
    { 
      id: 13,
      name: 'marteen', 
      fullName: 'Martin Pištek',
      game: 'Valorant',
      role: 'Flex',
      city: 'Varsovie',
      kda: '1.68', 
      acs: '261',
      rating: '1.2',
      wr: '33.3%',
      gamesPlayed: 3,
      description: 'Joueur flex tchèque extrêmement polyvalent. Capable de jouer tous les rôles avec excellence.'
    }
  ];

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

  // Données des joueurs par jeu (pour les autres pages)
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

  const isPlayersPage = currentPage === 'joueurs';
  const currentPlayers = isPlayersPage ? (selectedCity ? (playersByCity[selectedCity] || []) : []) : (playersData[currentGame] || playersData['Valorant']);
  const currentPlayer = isPlayersPage ? selectedPlayerDetail : currentPlayers[selectedPlayer];

  useEffect(() => {
    if (isPlayersPage && currentPlayers.length > 0 && !selectedPlayerDetail) {
      setSelectedPlayerDetail(currentPlayers[0]);
    } else if (isPlayersPage && currentPlayers.length === 0) {
      setSelectedPlayerDetail(null);
    }
  }, [selectedCity, currentPlayers.length, isPlayersPage]);

  const getGameColor = (game) => {
    if (isPlayersPage && game) {
      switch(game) {
        case 'Valorant': return '#FF4655';
        case 'Counter Strike': return '#FF9F1C';
        case 'Call of Duty': return '#8A2BE2';
        case 'Fortnite': return '#00AEEF';
        default: return '#7D3CFF';
      }
    }
    
    switch(currentGame) {
      case 'Valorant': return '#FF4655';
      case 'Counter Strike': return '#FF9F1C';
      case 'Call of Duty': return '#8A2BE2';
      case 'Fortnite': return '#00AEEF';
      default: return '#7D3CFF';
    }
  };

  const getStatKeys = () => {
    if (!currentPlayer) return [];
    if (isPlayersPage) {
      return Object.keys(currentPlayer).filter(key => 
        !['id', 'name', 'fullName', 'role', 'game', 'description', 'wr', 'gamesPlayed', 'city'].includes(key)
      );
    }
    return Object.keys(currentPlayer).filter(key => 
      key !== 'name' && key !== 'role' && key !== 'wr'
    );
  };

  const handlePlayerClick = (player) => {
    if (onPlayerClick && player.city) {
      onPlayerClick(player.city);
    }
  };

  return (
    <div className="right-panel">
      <div className="panel-section profils-section">
        <div className="profile-header">
          <div className="profile-avatar">
            <div className="avatar-circle" style={{ background: `linear-gradient(135deg, ${isPlayersPage ? '#7D3CFF' : getGameColor()}, ${isPlayersPage ? '#7D3CFFdd' : getGameColor()}dd)` }}>
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
        {!selectedCity ? (
          // Affichage des 5 joueurs du monde sur toutes les pages sans ville sélectionnée
          <>
            <div className="stats-header">
              <h2 className="panel-title-center">JOUEURS M8</h2>
              <div className="stats-subtitle">AUTOUR DU MONDE</div>
            </div>
            
            {/* Hexagon Player Selector */}
            <div className="hexagon-selector">
              {defaultPlayersForGlobe.map((player, index) => (
                <div
                  key={player.id}
                  className={`hexagon-wrapper ${selectedPlayer === index ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedPlayer(index);
                    // Le clic pour zoomer sur la ville ne fonctionne que sur la page joueurs
                    if (isPlayersPage) {
                      handlePlayerClick(player);
                    }
                  }}
                  style={{ cursor: isPlayersPage ? 'pointer' : 'default' }}
                >
                  <div 
                    className="hexagon"
                    style={selectedPlayer === index ? { 
                      background: `linear-gradient(135deg, ${getGameColor(player.game)}, ${getGameColor(player.game)}dd)`,
                      boxShadow: `0 0 20px ${getGameColor(player.game)}80`
                    } : {}}
                  >
                    <div className="hexagon-content">
                      {player.name.charAt(0)}
                    </div>
                  </div>
                  <div className="player-name-hex">{player.name}</div>
                  {selectedPlayer === index && (
                    <div className="hexagon-pulse" style={{ 
                      borderColor: getGameColor(player.game) 
                    }}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Player Info */}
            <div className="player-info-simple">
              <div className="player-name-large" style={{ color: getGameColor(defaultPlayersForGlobe[selectedPlayer].game) }}>
                {defaultPlayersForGlobe[selectedPlayer].name.toUpperCase()}
              </div>
              <div className="player-fullname-text">{defaultPlayersForGlobe[selectedPlayer].fullName}</div>
              <div className="player-role-text">{defaultPlayersForGlobe[selectedPlayer].role}</div>
              <div className="player-game-text">{defaultPlayersForGlobe[selectedPlayer].game} • {defaultPlayersForGlobe[selectedPlayer].city}</div>
            </div>

            {/* Stats Display */}
            <div className="stats-bars-container">
              {Object.keys(defaultPlayersForGlobe[selectedPlayer]).filter(key => 
                !['id', 'name', 'fullName', 'role', 'game', 'description', 'wr', 'gamesPlayed', 'city'].includes(key)
              ).map((key, index) => {
                const value = defaultPlayersForGlobe[selectedPlayer][key];
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
                      <span className="stat-bar-value" style={{ color: getGameColor(defaultPlayersForGlobe[selectedPlayer].game) }}>
                        {value}
                      </span>
                    </div>
                    <div className="stat-bar-track">
                      <div 
                        className="stat-bar-fill"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          background: `linear-gradient(90deg, ${getGameColor(defaultPlayersForGlobe[selectedPlayer].game)}, ${getGameColor(defaultPlayersForGlobe[selectedPlayer].game)}dd)`,
                          boxShadow: `0 0 15px ${getGameColor(defaultPlayersForGlobe[selectedPlayer].game)}80`
                        }}
                      >
                        <div className="stat-bar-glow" style={{ background: getGameColor(defaultPlayersForGlobe[selectedPlayer].game) }}></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : isPlayersPage && selectedCity ? (
          // Affichage avec ville sélectionnée
          <>
            <div className="stats-header">
              <h2 className="panel-title-center">{selectedCity.toUpperCase()}</h2>
              <div className="stats-subtitle">{currentPlayers.length} JOUEUR{currentPlayers.length > 1 ? 'S' : ''}</div>
            </div>
            
            {/* Hexagon Player Selector */}
            <div className="hexagon-selector">
              {currentPlayers.map((player) => (
                <div
                  key={player.id}
                  className={`hexagon-wrapper ${selectedPlayerDetail?.id === player.id ? 'active' : ''}`}
                  onClick={() => setSelectedPlayerDetail(player)}
                >
                  <div 
                    className="hexagon"
                    style={selectedPlayerDetail?.id === player.id ? { 
                      background: `linear-gradient(135deg, ${getGameColor(player.game)}, ${getGameColor(player.game)}dd)`,
                      boxShadow: `0 0 20px ${getGameColor(player.game)}80`
                    } : {}}
                  >
                    <div className="hexagon-content">
                      {player.name.charAt(0)}
                    </div>
                  </div>
                  <div className="player-name-hex">{player.name}</div>
                  {selectedPlayerDetail?.id === player.id && (
                    <div className="hexagon-pulse" style={{ 
                      borderColor: getGameColor(player.game) 
                    }}></div>
                  )}
                </div>
              ))}
            </div>

            {/* Player Info */}
            {selectedPlayerDetail && (
              <div className="player-info-simple">
                <div className="player-name-large" style={{ color: getGameColor(selectedPlayerDetail.game) }}>
                  {selectedPlayerDetail.name.toUpperCase()}
                </div>
                <div className="player-fullname-text">{selectedPlayerDetail.fullName}</div>
                <div className="player-role-text">{selectedPlayerDetail.role}</div>
                <div className="player-game-text">{selectedPlayerDetail.game}</div>
              </div>
            )}

            {/* Stats Display */}
            {selectedPlayerDetail && (
              <div className="stats-bars-container">
                {getStatKeys().map((key, index) => {
                  const value = selectedPlayerDetail[key];
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
                        <span className="stat-bar-value" style={{ color: getGameColor(selectedPlayerDetail.game) }}>
                          {value}
                        </span>
                      </div>
                      <div className="stat-bar-track">
                        <div 
                          className="stat-bar-fill"
                          style={{
                            width: `${Math.min(percentage, 100)}%`,
                            background: `linear-gradient(90deg, ${getGameColor(selectedPlayerDetail.game)}, ${getGameColor(selectedPlayerDetail.game)}dd)`,
                            boxShadow: `0 0 15px ${getGameColor(selectedPlayerDetail.game)}80`
                          }}
                        >
                          <div className="stat-bar-glow" style={{ background: getGameColor(selectedPlayerDetail.game) }}></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          // Affichage normal pour les autres pages
          <>
            <div className="stats-header">
              <h2 className="panel-title-center">STATS</h2>
              <div className="stats-subtitle">LIVE PERFORMANCE</div>
            </div>
            
            {/* Hexagon Player Selector */}
            <div className="hexagon-selector">
              {currentPlayers.map((player, index) => (
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
                const maxValue = 
                  key === 'kd' ? 2 : 
                  key === 'rating' ? 2 : 
                  key === 'acs' ? 400 : 
                  key === 'spm' ? 500 : 
                  key === 'kills' ? 10 : 
                  key === 'placement' ? 5 : 100;
                const percentage = (numValue / maxValue) * 100;
                
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
          </>
        )}
      </div>
      
      {isPlayersPage && !selectedCity ? (
        // Message de découverte sur la page joueurs sans ville sélectionnée
        <div className="panel-section planning-section">
          <div className="no-city-selected-planning">
            <div className="globe-icon">🌍</div>
            <h3>Découvrez nos joueurs</h3>
            <p>Cliquez sur une ville rouge du globe pour découvrir les joueurs M8</p>
          </div>
        </div>
      ) : isPlayersPage && selectedPlayerDetail ? (
        // Section détails du joueur sur la page joueurs
        <div className="panel-section details-section-players">
          <h2 className="panel-title">À PROPOS</h2>
          <div className="player-description-panel">
            <p>{selectedPlayerDetail.description}</p>
          </div>
          
          <div className="player-stats-highlight">
            <div className="stat-highlight-row">
              <div className="stat-highlight-item">
                <span className="stat-highlight-label">WIN RATE</span>
                <span className="stat-highlight-value" style={{ color: getGameColor(selectedPlayerDetail.game) }}>
                  {selectedPlayerDetail.wr}
                </span>
              </div>
              <div className="stat-highlight-item">
                <span className="stat-highlight-label">MATCHS</span>
                <span className="stat-highlight-value" style={{ color: getGameColor(selectedPlayerDetail.game) }}>
                  {selectedPlayerDetail.gamesPlayed}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : !isPlayersPage ? (
        // Section planning normale pour les autres pages
        <div className="panel-section planning-section">
          <h2 className="panel-title">PLANNING</h2>
          <Calendar currentGame={currentGame} />
        </div>
      ) : null}
    </div>
  );
}

export default RightPanel;
