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

function RightPanel({ currentGame, onDashboardClick, onDesignClick, onDatasetsClick, user, onLogout, onLoginClick, currentPage, selectedCity, onPlayerClick }) {
  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  // Laptop/MacBook widths: show fewer items to avoid crowding.
  // - <= 1600px: show 2 (covers Windows 125% scaling where 1920px often becomes ~1536px CSS)
  // - otherwise: show 3
  const isLaptopWidth = useMediaQuery('(max-width: 1920px)');
  const topPlayersCount = isLaptopWidth ? 2 : 3;

  // Réinitialiser le joueur sélectionné quand la ville change
  useEffect(() => {
    setSelectedPlayer(0);
  }, [selectedCity]);

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
  };


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

  // Déterminer quels joueurs afficher selon si une ville est sélectionnée ou non
  const playersToDisplay = currentPage === 'joueurs' && selectedCity 
    ? (playersByCity[selectedCity] || [])
    : topPlayers.slice(0, topPlayersCount);

  const detailedPlayer = currentPage === 'joueurs' && selectedCity && selectedPlayer !== null && playersToDisplay[selectedPlayer]
    ? playersToDisplay[selectedPlayer]
    : null;

  const handlePlayerClick = (player, index) => {
    setSelectedPlayer(index);
    if (currentPage === 'joueurs' && player.city && onPlayerClick && player.city !== selectedCity) {
      onPlayerClick(player.city);
    }
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
            user.roles?.includes('ROLE_ADMIN') ? (
              <>
                <button className="action-mini admin" onClick={onDashboardClick} title="Dashboard">
                  <Icon name="barChart" size={16} />
                </button>
                <button className="action-mini logout" onClick={onLogout} title="Déconnexion">
                  <Icon name="logOut" size={16} />
                </button>
              </>
            ) : user.roles?.includes('ROLE_PROVIDER') ? (
              <>
                <button className="action-mini provider" onClick={onDatasetsClick} title="Datasets">
                  <Icon name="database" size={16} />
                </button>
                <button className="action-mini logout" onClick={onLogout} title="Déconnexion">
                  <Icon name="logOut" size={16} />
                </button>
              </>
            ) : user.roles?.includes('ROLE_EDITOR') ? (
              <>
                <button className="action-mini admin" onClick={onDashboardClick} title="Éditeur">
                  <Icon name="edit" size={16} />
                </button>
                <button className="action-mini logout" onClick={onLogout} title="Déconnexion">
                  <Icon name="logOut" size={16} />
                </button>
              </>
            ) : user.roles?.includes('ROLE_DESIGNER') ? (
              <>
                <button className="action-mini admin" onClick={onDesignClick} title="Design">
                  <Icon name="palette" size={16} />
                </button>
                <button className="action-mini logout" onClick={onLogout} title="Déconnexion">
                  <Icon name="logOut" size={16} />
                </button>
              </>
            ) : (
              <button className="action-mini logout" onClick={onLogout} title="Déconnexion">
                <Icon name="logOut" size={16} />
              </button>
            )
          ) : (
            <button className="action-mini login" onClick={onLoginClick} title="Connexion">
              <Icon name="user" size={16} />
            </button>
          )}
        </div>
      </div>
      
      {/* SECTION TOP PLAYERS */}
      <div className={`panel-section top-players ${currentPage === 'joueurs' && selectedCity ? 'top-players-joueurs' : ''}`}>
        <div className="section-header">
          <h3 className="section-title">
            {currentPage === 'joueurs' && selectedCity ? selectedCity.toUpperCase() : 'TOP PLAYERS'}
          </h3>
          <span className="section-badge">
            {currentPage === 'joueurs' && selectedCity ? `${playersToDisplay.length} joueur${playersToDisplay.length > 1 ? 's' : ''}` : 'M8 Global'}
          </span>
        </div>
        
        <div className="players-scrollable-content">
          <div className="players-compact-list">
            {playersToDisplay.map((player, index) => (
              <div 
                key={player.id}
                className={`player-compact-card ${selectedPlayer === index ? 'active' : ''}`}
                onClick={() => handlePlayerClick(player, index)}
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
          
          {selectedPlayer !== null && playersToDisplay[selectedPlayer] && !detailedPlayer && (
            <div className="player-detail-box" style={{
              borderLeftColor: getGameColor(playersToDisplay[selectedPlayer].game)
            }}>
              <div className="detail-row">
                <span className="detail-label">
                  <Icon name="award" size={12} /> WR
                </span>
                <span className="detail-value">{playersToDisplay[selectedPlayer].wr}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">
                  <Icon name="gamepad" size={12} /> Games
                </span>
                <span className="detail-value">{playersToDisplay[selectedPlayer].gamesPlayed}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* SECTION PLANNING ou STATS DÉTAILLÉES */}
      {detailedPlayer ? (
        <div className={`panel-section player-stats-detailed ${currentPage === 'joueurs' && detailedPlayer ? 'player-stats-joueurs' : ''}`}>
          <div className="section-header">
            <h3 className="section-title">STATISTIQUES</h3>
            <span className="section-badge" style={{ background: getGameColor(detailedPlayer.game) }}>
              {detailedPlayer.game}
            </span>
          </div>
          
          <div className="stats-scrollable-content">
            <div className="player-header-detailed">
            <div className="player-avatar-large" style={{ background: getGameColor(detailedPlayer.game) }}>
              {detailedPlayer.name.charAt(0)}
            </div>
            <div className="player-info-detailed">
              <h4 className="player-name-large">{detailedPlayer.name}</h4>
              <p className="player-fullname">{detailedPlayer.fullName}</p>
              <span className="player-role-badge" style={{ 
                background: `${getGameColor(detailedPlayer.game)}20`,
                color: getGameColor(detailedPlayer.game)
              }}>
                {detailedPlayer.role}
              </span>
            </div>
          </div>

          {detailedPlayer.description && (
            <div className="player-description">
              <p>{detailedPlayer.description}</p>
            </div>
          )}

          <div className="stats-grid-detailed">
            {/* Stats pour Counter Strike */}
            {detailedPlayer.game === 'Counter Strike' && (
              <>
                <div className="stat-box">
                  <span className="stat-label-detailed">Rating</span>
                  <span className="stat-value-detailed" style={{ color: getGameColor(detailedPlayer.game) }}>
                    {detailedPlayer.rating}
                  </span>
                </div>
                {detailedPlayer.tRating && (
                  <div className="stat-box">
                    <span className="stat-label-detailed">T Rating</span>
                    <span className="stat-value-detailed">{detailedPlayer.tRating}</span>
                  </div>
                )}
                {detailedPlayer.ctRating && (
                  <div className="stat-box">
                    <span className="stat-label-detailed">CT Rating</span>
                    <span className="stat-value-detailed">{detailedPlayer.ctRating}</span>
                  </div>
                )}
              </>
            )}

            {/* Stats pour Valorant */}
            {detailedPlayer.game === 'Valorant' && (
              <>
                <div className="stat-box">
                  <span className="stat-label-detailed">Rating</span>
                  <span className="stat-value-detailed" style={{ color: getGameColor(detailedPlayer.game) }}>
                    {detailedPlayer.rating}
                  </span>
                </div>
                {detailedPlayer.kda && (
                  <div className="stat-box">
                    <span className="stat-label-detailed">K/D/A</span>
                    <span className="stat-value-detailed">{detailedPlayer.kda}</span>
                  </div>
                )}
                {detailedPlayer.acs && (
                  <div className="stat-box">
                    <span className="stat-label-detailed">ACS</span>
                    <span className="stat-value-detailed">{detailedPlayer.acs}</span>
                  </div>
                )}
              </>
            )}

            {/* Stats pour Call of Duty */}
            {detailedPlayer.game === 'Call of Duty' && (
              <>
                <div className="stat-box">
                  <span className="stat-label-detailed">Overall K/D</span>
                  <span className="stat-value-detailed" style={{ color: getGameColor(detailedPlayer.game) }}>
                    {detailedPlayer.overallKD}
                  </span>
                </div>
                {detailedPlayer.hpKD && (
                  <div className="stat-box">
                    <span className="stat-label-detailed">HP K/D</span>
                    <span className="stat-value-detailed">{detailedPlayer.hpKD}</span>
                  </div>
                )}
                {detailedPlayer.sndKD && (
                  <div className="stat-box">
                    <span className="stat-label-detailed">SnD K/D</span>
                    <span className="stat-value-detailed">{detailedPlayer.sndKD}</span>
                  </div>
                )}
                {detailedPlayer.olKD && (
                  <div className="stat-box">
                    <span className="stat-label-detailed">Control K/D</span>
                    <span className="stat-value-detailed">{detailedPlayer.olKD}</span>
                  </div>
                )}
              </>
            )}

            {/* Stats communes */}
            <div className="stat-box">
              <span className="stat-label-detailed">Win Rate</span>
              <span className="stat-value-detailed">{detailedPlayer.wr}</span>
            </div>
            <div className="stat-box">
              <span className="stat-label-detailed">Games Played</span>
              <span className="stat-value-detailed">{detailedPlayer.gamesPlayed}</span>
            </div>
          </div>
          </div>
        </div>
      ) : (
        <div className={`panel-section planning-modern ${currentPage === 'joueurs' && selectedCity ? 'planning-joueurs' : ''}`}>
          <div className="section-header">
            <h3 className="section-title">PLANNING</h3>
            <span className="section-badge-small">Janvier 2026</span>
          </div>
          <Calendar currentGame={currentGame} />
        </div>
      )}
    </div>
  );
}

export default RightPanel;
