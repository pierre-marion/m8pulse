import React, { useState, useEffect } from 'react';
import './TeamPage.css';
import MatchDetailPage from './MatchDetailPage';
import Icon from './Icon';

function TeamPage({ currentGame, onGameChange }) {
  const [showAllMatches, setShowAllMatches] = useState(false);
  const [userSubscription] = useState('basic'); // basic, pro, elite
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [livePlayersData, setLivePlayersData] = useState(null);
  const [liveMatchesData, setLiveMatchesData] = useState(null);
  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const gameIndex = ['Valorant', 'Counter Strike', 'Call of Duty', 'Fortnite'].indexOf(currentGame);

  // IDs des Google Sheets
  const VALORANT_SHEET_ID = '1d6b3E3KEy1TwPRJgjvbgcrDrUbawUkHl9ckpNESyzeg';
  const COD_SHEET_ID = '1semtK-pmRquxyF88CjpjwmNpwhYezCHaWRKFkX90WkY';

  // Charger les données depuis Google Sheets
  useEffect(() => {
    if (currentGame === 'Valorant') {
      fetchLivePlayersData('valorant', VALORANT_SHEET_ID);
      fetchLiveMatchesData('valorant', VALORANT_SHEET_ID);
    } else if (currentGame === 'Call of Duty') {
      fetchLivePlayersData('cod', COD_SHEET_ID);
      fetchLiveMatchesData('cod', COD_SHEET_ID);
    }
  }, [currentGame]);

  const fetchLivePlayersData = async (game, sheetId) => {
    try {
      setLoadingPlayers(true);
      const response = await fetch(
        `http://localhost:8000/api/google-sheets/players/${game}?spreadsheetId=${sheetId}`
      );
      const data = await response.json();
      
      if (data.success) {
        console.log(`[TeamPage] Joueurs ${game} chargés:`, data.players.length, data.players);
        setLivePlayersData(data.players);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des stats:', error);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const fetchLiveMatchesData = async (game, sheetId) => {
    try {
      setLoadingMatches(true);
      const response = await fetch(
        `http://localhost:8000/api/google-sheets/matches/${game}?spreadsheetId=${sheetId}`
      );
      const data = await response.json();
      
      if (data.success) {
        setLiveMatchesData(data.matches);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des matchs:', error);
    } finally {
      setLoadingMatches(false);
    }
  };

  const gameData = {
    'Valorant': {
      title: 'Valorant - VCT',
      players: livePlayersData ? livePlayersData.map(player => ({
        name: player.id, // ID = pseudo du joueur
        role: player.roleSpecific,
        kd: player.kda?.toFixed(2) || '0.00',
        acs: player.acs?.toString() || '0',
        rating: player.rating?.toFixed(2) || '0.00',
        gamesPlayed: player.gamesPlayed,
        wins: player.wins,
        losses: player.losses,
        nationality: player.nationality
      })) : [],
      region: '#8 EMEA',
      stats: {
        parties: livePlayersData ? livePlayersData.reduce((sum, p) => sum + p.gamesPlayed, 0) : 0,
        winRate: livePlayersData ? 
          `${Math.round((livePlayersData.reduce((sum, p) => sum + p.wins, 0) / 
          livePlayersData.reduce((sum, p) => sum + p.gamesPlayed, 0) * 100))}%` : '0%',
        formats: 12,
        earning: '$156,420'
      },
      additionalStats: {
        avgKDA: livePlayersData ? 
          (livePlayersData.reduce((sum, p) => sum + (p.kda || 0), 0) / livePlayersData.length).toFixed(2) : '0.00',
        avgACS: livePlayersData ? 
          Math.round(livePlayersData.reduce((sum, p) => sum + (p.acs || 0), 0) / livePlayersData.length) : 0,
        avgRating: livePlayersData ? 
          (livePlayersData.reduce((sum, p) => sum + (p.rating || 0), 0) / livePlayersData.length).toFixed(2) : '0.00',
        totalGames: livePlayersData ? 
          livePlayersData.reduce((sum, p) => sum + p.gamesPlayed, 0) : 0
      },
      matches: liveMatchesData && liveMatchesData.length > 0 ? liveMatchesData : [],
      ranking: [
        { pos: 1, team: 'Fnatic', points: 450, wins: 28, losses: 12 },
        { pos: 2, team: 'Team Vitality', points: 425, wins: 26, losses: 14 },
        { pos: 3, team: 'Team Liquid', points: 410, wins: 25, losses: 15 },
        { pos: 8, team: 'Gentle Mates', points: 340, wins: 21, losses: 19, highlight: true }
      ],
      performanceData: [
        { month: 'Août', winRate: 58 },
        { month: 'Sept', winRate: 62 },
        { month: 'Oct', winRate: 64 },
        { month: 'Nov', winRate: 66 },
        { month: 'Déc', winRate: 64 }
      ]
    },
    'Counter Strike': {
      title: 'Counter Strike 2 - ESL',
      players: [
        { name: 'JaCkz', role: 'AWPer', kd: '1.31', rating: '1.18' },
        { name: 'afro', role: 'Rifler', kd: '1.15', rating: '1.09' },
        { name: 'bodyy', role: 'Entry', kd: '1.08', rating: '1.04' },
        { name: 'Lucky', role: 'Support', kd: '0.96', rating: '0.98' },
        { name: 'JACKZ', role: 'IGL', kd: '1.02', rating: '1.01' }
      ],
      region: '#15 EU',
      stats: {
        parties: 189,
        winRate: '58%',
        formats: 9,
        earning: '$89,350'
      },
      additionalStats: {
        averageKills: '18.4',
        clutchWins: '34%',
        entrySuccess: '56%',
        headshot: '51%'
      },
      matches: [
        { date: '27/11', team: 'Gentle Mates', score: '16-14', opponent: 'G2 Esports', tournament: 'ESL Pro League', win: true },
        { date: '24/11', team: 'Gentle Mates', score: '10-16', opponent: 'FaZe Clan', tournament: 'ESL Pro League', win: false },
        { date: '21/11', team: 'Gentle Mates', score: '16-12', opponent: 'Vitality', tournament: 'ESL Pro League', win: true },
        { date: '18/11', team: 'Gentle Mates', score: '16-8', opponent: 'ENCE', tournament: 'ESL Pro League', win: true },
        { date: '14/11', team: 'Gentle Mates', score: '13-16', opponent: 'Navi', tournament: 'ESL Pro League', win: false }
      ],
      ranking: [
        { pos: 1, team: 'FaZe Clan', points: 1000, wins: 45, losses: 12 },
        { pos: 2, team: 'Natus Vincere', points: 950, wins: 42, losses: 15 },
        { pos: 3, team: 'Vitality', points: 920, wins: 40, losses: 17 },
        { pos: 15, team: 'Gentle Mates', points: 680, wins: 32, losses: 23, highlight: true }
      ],
      performanceData: [
        { month: 'Août', winRate: 52 },
        { month: 'Sept', winRate: 55 },
        { month: 'Oct', winRate: 58 },
        { month: 'Nov', winRate: 60 },
        { month: 'Déc', winRate: 58 }
      ]
    },
    'Call of Duty': {
      title: 'Call of Duty - CDL',
      players: livePlayersData && currentGame === 'Call of Duty' ? livePlayersData.map(player => ({
        name: player.id, // ID = pseudo du joueur
        role: player.roleSpecific,
        kd: player.overallKD?.toFixed(2) || '0.00',
        spm: 'N/A', // Pas de SPM dans les données Google Sheets
        gamesPlayed: player.gamesPlayed,
        wins: player.wins,
        losses: player.losses,
        nationality: player.nationality,
        hpKD: player.hpKD?.toFixed(2) || '0.00',
        sndKD: player.sndKD?.toFixed(2) || '0.00',
        olKD: player.olKD?.toFixed(2) || '0.00'
      })) : [],
      region: '#10 International',
      stats: {
        parties: livePlayersData && currentGame === 'Call of Duty' ? 
          livePlayersData.reduce((sum, p) => sum + p.gamesPlayed, 0) : 0,
        winRate: livePlayersData && currentGame === 'Call of Duty' ? 
          `${Math.round((livePlayersData.reduce((sum, p) => sum + p.wins, 0) / 
          livePlayersData.reduce((sum, p) => sum + p.gamesPlayed, 0) * 100))}%` : '0%',
        formats: 7,
        earning: '$72,800'
      },
      additionalStats: {
        avgOverallKD: livePlayersData && currentGame === 'Call of Duty' ? 
          (livePlayersData.reduce((sum, p) => sum + (p.overallKD || 0), 0) / livePlayersData.length).toFixed(2) : '0.00',
        avgHpKD: livePlayersData && currentGame === 'Call of Duty' ? 
          (livePlayersData.reduce((sum, p) => sum + (p.hpKD || 0), 0) / livePlayersData.length).toFixed(2) : '0.00',
        avgSndKD: livePlayersData && currentGame === 'Call of Duty' ? 
          (livePlayersData.reduce((sum, p) => sum + (p.sndKD || 0), 0) / livePlayersData.length).toFixed(2) : '0.00',
        avgOlKD: livePlayersData && currentGame === 'Call of Duty' ? 
          (livePlayersData.reduce((sum, p) => sum + (p.olKD || 0), 0) / livePlayersData.length).toFixed(2) : '0.00'
      },
      matches: liveMatchesData && liveMatchesData.length > 0 && currentGame === 'Call of Duty' ? liveMatchesData : [],
      ranking: [
        { pos: 1, team: 'Atlanta FaZe', points: 850, wins: 38, losses: 10 },
        { pos: 2, team: 'OpTic Gaming', points: 820, wins: 36, losses: 12 },
        { pos: 3, team: 'LA Thieves', points: 780, wins: 34, losses: 14 },
        { pos: 10, team: 'Gentle Mates', points: 620, wins: 28, losses: 18, highlight: true }
      ],
      performanceData: [
        { month: 'Août', winRate: 56 },
        { month: 'Sept', winRate: 59 },
        { month: 'Oct', winRate: 61 },
        { month: 'Nov', winRate: 63 },
        { month: 'Déc', winRate: 61 }
      ]
    },
    'Fortnite': {
      title: 'Fortnite - FNCS',
      players: [
        { name: 'Kami', role: 'IGL', kills: '4.8', placement: '3.2' },
        { name: 'Vato', role: 'Fragger', kills: '5.6', placement: '3.2' },
        { name: 'Setty', role: 'Support', kills: '3.9', placement: '3.2' }
      ],
      region: '#6 EU',
      stats: {
        parties: 312,
        winRate: '68%',
        formats: 15,
        earning: '$203,560'
      },
      additionalStats: {
        avgPlacement: '3.2',
        victoriesRoyale: '48',
        avgElims: '14.3',
        top5Rate: '76%'
      },
      matches: [
        { date: '29/11', team: 'Gentle Mates', score: '1st', opponent: 'FNCS Finals', tournament: 'FNCS', win: true },
        { date: '26/11', team: 'Gentle Mates', score: '3rd', opponent: 'FNCS Semi-Finals', tournament: 'FNCS', win: true },
        { date: '23/11', team: 'Gentle Mates', score: '8th', opponent: 'FNCS Qualifiers', tournament: 'FNCS', win: false },
        { date: '20/11', team: 'Gentle Mates', score: '2nd', opponent: 'FNCS Heats', tournament: 'FNCS', win: true },
        { date: '16/11', team: 'Gentle Mates', score: '5th', opponent: 'FNCS Opens', tournament: 'FNCS', win: true }
      ],
      ranking: [
        { pos: 1, team: 'Team Falcons', points: 2450, wins: 68, losses: 12 },
        { pos: 2, team: 'XSET', points: 2380, wins: 65, losses: 15 },
        { pos: 3, team: 'NRG', points: 2320, wins: 62, losses: 18 },
        { pos: 6, team: 'Gentle Mates', points: 2180, wins: 58, losses: 22, highlight: true }
      ],
      news: [
        { date: '01/12', title: 'Kami rejoint Gentle Mates', category: 'Transfer', description: 'Le joueur star rejoint notre roster Fortnite pour la saison à venir.' },
        { date: '28/11', title: 'Victoire historique contre Vitality', category: 'Match', description: 'Belle performance de l\'équipe avec un 2-1 renversant en VCT EMEA.' },
        { date: '20/11', title: 'Qualification pour les playoffs', category: 'Tournoi', description: 'Gentle Mates se qualifie pour les playoffs du FNCS EU.' }
      ],
      achievements: [
        { title: 'FNCS Champion', date: '2024', icon: 'trophy' },
        { title: 'Top 5 EMEA', date: '2024', icon: 'star' },
        { title: '48 Victory Royales', date: 'Season 6', icon: 'star' }
      ],
      performanceData: [
        { month: 'Août', winRate: 62 },
        { month: 'Sept', winRate: 65 },
        { month: 'Oct', winRate: 68 },
        { month: 'Nov', winRate: 72 },
        { month: 'Déc', winRate: 68 }
      ],
      allMatches: [
        { date: '29/11', team: 'Gentle Mates', score: '1st', opponent: 'FNCS Finals', tournament: 'FNCS', win: true },
        { date: '26/11', team: 'Gentle Mates', score: '3rd', opponent: 'FNCS Semi-Finals', tournament: 'FNCS', win: true },
        { date: '23/11', team: 'Gentle Mates', score: '8th', opponent: 'FNCS Qualifiers', tournament: 'FNCS', win: false },
        { date: '20/11', team: 'Gentle Mates', score: '2nd', opponent: 'FNCS Heats', tournament: 'FNCS', win: true },
        { date: '16/11', team: 'Gentle Mates', score: '5th', opponent: 'FNCS Opens', tournament: 'FNCS', win: true },
        { date: '12/11', team: 'Gentle Mates', score: '1st', opponent: 'FNCS Week 4', tournament: 'FNCS', win: true },
        { date: '09/11', team: 'Gentle Mates', score: '4th', opponent: 'FNCS Week 3', tournament: 'FNCS', win: true },
        { date: '05/11', team: 'Gentle Mates', score: '7th', opponent: 'FNCS Week 2', tournament: 'FNCS', win: false },
        { date: '02/11', team: 'Gentle Mates', score: '2nd', opponent: 'FNCS Week 1', tournament: 'FNCS', win: true },
        { date: '28/10', team: 'Gentle Mates', score: '3rd', opponent: 'FNCS Trials', tournament: 'FNCS', win: true }
      ]
    }
  };

  const newsData = {
    'Valorant': [
      { date: '01/12', title: 'Starxo MVP du mois', category: 'Performance', description: 'Starxo termine le mois avec un KD exceptionnel de 1.45.' },
      { date: '28/11', title: 'Victoire contre Vitality 2-1', category: 'Match', description: 'Belle remontée de Gentle Mates dans le dernier match de la phase.' },
      { date: '20/11', title: 'Nouveau coach rejoint l\'équipe', category: 'Transfer', description: 'Un ancien pro rejoint le staff pour améliorer les stratégies.' }
    ],
    'Counter Strike': [
      { date: '30/11', title: 'JaCkz atteint 1000 kills', category: 'Record', description: 'JaCkz franchit la barre des 1000 kills avec Gentle Mates.' },
      { date: '27/11', title: 'Comeback fou contre G2', category: 'Match', description: 'De 10-14 à 16-14, Gentle Mates réalise un comeback mémorable.' },
      { date: '22/11', title: 'Bootcamp avant les Major', category: 'Préparation', description: 'L\'équipe part en bootcamp intensif de 2 semaines.' }
    ],
    'Call of Duty': [
      { date: '29/11', title: 'HyDra Top 3 SMG mondial', category: 'Classement', description: 'HyDra entre dans le top 3 des meilleurs SMG au monde.' },
      { date: '26/11', title: '3-1 contre OpTic Gaming', category: 'Match', description: 'Domination totale de Gentle Mates sur OpTic Gaming.' },
      { date: '18/11', title: 'Nouveau record de Hill Time', category: 'Record', description: 'L\'équipe établit un nouveau record avec 142s de Hill Time moyen.' }
    ],
    'Fortnite': [
      { date: '01/12', title: 'Kami rejoint Gentle Mates', category: 'Transfer', description: 'Le joueur star rejoint notre roster Fortnite pour la saison à venir.' },
      { date: '29/11', title: 'Champions FNCS Finals!', category: 'Victoire', description: 'Gentle Mates remporte les FNCS Finals EU avec une performance parfaite!' },
      { date: '20/11', title: 'Qualification pour les playoffs', category: 'Tournoi', description: 'Gentle Mates se qualifie pour les playoffs du FNCS EU.' }
    ]
  };

  const achievementsData = {
    'Valorant': [
      { title: 'VCT EMEA Finalist', date: '2024', icon: 'trophy' },
      { title: 'Top 8 EMEA', date: '2024', icon: 'star' },
      { title: 'Longest Win Streak: 12', date: 'Oct 2024', icon: 'fire' },
      { title: 'Player of Month: Starxo', date: 'Nov 2024', icon: 'star' }
    ],
    'Counter Strike': [
      { title: 'ESL Pro League Top 16', date: '2024', icon: 'trophy' },
      { title: 'JaCkz 1000 Kills', date: '2024', icon: 'star' },
      { title: 'Best Comeback: 10-14', date: 'Nov 2024', icon: 'trendingUp' },
      { title: 'Highest Team Rating: 1.18', date: '2024', icon: 'barChart' }
    ],
    'Call of Duty': [
      { title: 'CDL Major Top 10', date: '2024', icon: 'trophy' },
      { title: 'HyDra Top 3 SMG', date: '2024', icon: 'star' },
      { title: 'Record Hill Time: 142s', date: 'Nov 2024', icon: 'fire' },
      { title: 'S&D Win Rate: 67%', date: '2024', icon: 'target' }
    ],
    'Fortnite': [
      { title: 'FNCS Champion', date: '2024', icon: 'trophy' },
      { title: 'Top 6 EU Rankings', date: '2024', icon: 'star' },
      { title: '48 Victory Royales', date: 'Season 6', icon: 'fire' },
      { title: 'Highest Earnings: $203K', date: '2024', icon: 'trendingUp' }
    ]
  };

  const data = gameData[currentGame] || gameData['Valorant'];
  const news = newsData[currentGame] || newsData['Valorant'];
  const achievements = achievementsData[currentGame] || achievementsData['Valorant'];
  const matchesToShow = showAllMatches ? (data.allMatches || data.matches) : data.matches.slice(0, 5);

  // Si un match est sélectionné, afficher la page de détail
  if (selectedMatch) {
    return <MatchDetailPage matchData={selectedMatch} onBack={() => setSelectedMatch(null)} />;
  }

  return (
    <div className="team-page">
      
      <div className="team-content-wrapper">
        <div className="game-selector">
          <button 
            className={`game-btn valorant-btn ${gameIndex === 0 ? 'active' : ''}`}
            onClick={() => onGameChange(0)}
          >
            <span className="game-icon"></span>
            <span className="game-name">Valorant</span>
          </button>
          <button 
            className={`game-btn cs-btn ${gameIndex === 1 ? 'active' : ''}`}
            onClick={() => onGameChange(1)}
          >
            <span className="game-icon"></span>
            <span className="game-name">Counter Strike</span>
          </button>
          <button 
            className={`game-btn cod-btn ${gameIndex === 2 ? 'active' : ''}`}
            onClick={() => onGameChange(2)}
          >
            <span className="game-icon"></span>
            <span className="game-name">Call of Duty</span>
          </button>
          <button 
            className={`game-btn fortnite-btn ${gameIndex === 3 ? 'active' : ''}`}
            onClick={() => onGameChange(3)}
          >
            <span className="game-icon"></span>
            <span className="game-name">Fortnite</span>
          </button>
        </div>

          <div className="team-header-section">
          <div className="team-region-badge">{data.region}</div>
          
          <div className="team-info-card">
            <div className="team-left-section">
              
              <div className="team-logo-wrapper">
                <svg className="valorant-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="30,20 50,60 30,80" fill="#FF4655"/>
                  <polygon points="50,60 70,20 70,80" fill="#FF4655"/>
                </svg>
              </div>
              
              <div className="team-info">
                <h2 className="team-name">{data.title}</h2>
                <div className="team-region-inline">{data.region}</div>
              </div>
            </div>
            
            <div className={`team-stats-card ${currentGame.toLowerCase().replace(' ', '-')}-game`}>
              <div className="stat-item">
                <div className="stat-value">{data.stats.parties}</div>
                <div className="stat-label">Parties</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{data.stats.winRate}</div>
                <div className="stat-label">Win Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{data.stats.formats}</div>
                <div className="stat-label">Formats</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{data.stats.earning}</div>
                <div className="stat-label">Earning</div>
              </div>
            </div>
          </div>
        </div>

        <div className="players-stats-section">
          <div className="section-header">
            <h2 className="section-title">Roster & Stats</h2>
            {currentGame === 'Valorant' && livePlayersData && (
              <span className="live-indicator">
                <span className="live-dot"></span>
                Données en direct
              </span>
            )}
          </div>
          {loadingPlayers ? (
            <div className="loading-players-styled">
              <div className="loading-animation">
                <div className="loading-logo">
                  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="30,20 50,60 30,80" fill="#FF4655" className="logo-part-1"/>
                    <polygon points="50,60 70,20 70,80" fill="#FF4655" className="logo-part-2"/>
                  </svg>
                </div>
                <div className="loading-dots">
                  <span className="dot"></span>
                  <span className="dot"></span>
                  <span className="dot"></span>
                </div>
              </div>
              <p className="loading-text">Récupération des stats depuis Google Sheets...</p>
            </div>
          ) : data.players.length === 0 ? (
            <div className="no-data-message">
              <div className="no-data-icon"><Icon name="barChart" size={48} color="#7D3CFF" /></div>
              <h3>Aucune donnée disponible</h3>
              <p>Les stats des joueurs {currentGame} seront chargées depuis Google Sheets.</p>
            </div>
          ) : (
            <div className="players-grid">
              {data.players.map((player, index) => (
                <div key={index} className={`player-card ${currentGame.toLowerCase().replace(' ', '-')}-game`}>
                  <div className="player-avatar">{player.name.charAt(0)}</div>
                  <div className="player-info">
                    <h3 className="player-name">{player.name}</h3>
                    <p className="player-role">{player.role}</p>
                    {player.nationality && (
                      <p className="player-nationality">{player.nationality}</p>
                    )}
                  </div>
                  <div className="player-stats">
                    {currentGame === 'Call of Duty' ? (
                      <>
                        <div className="player-stat">
                          <span className="stat-key">K/D:</span>
                          <span className="stat-value">{player.kd}</span>
                        </div>
                        {player.hpKD && (
                          <div className="player-stat">
                            <span className="stat-key">HP K/D:</span>
                            <span className="stat-value">{player.hpKD}</span>
                          </div>
                        )}
                        {player.sndKD && (
                          <div className="player-stat">
                            <span className="stat-key">SnD K/D:</span>
                            <span className="stat-value">{player.sndKD}</span>
                          </div>
                        )}
                        {player.wins !== undefined && (
                          <div className="player-stat">
                            <span className="stat-key">W/L:</span>
                            <span className="stat-value">{player.wins}/{player.losses}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="player-stat">
                          <span className="stat-key">KDA:</span>
                          <span className="stat-value">{player.kd}</span>
                        </div>
                        <div className="player-stat">
                          <span className="stat-key">ACS:</span>
                          <span className="stat-value">{player.acs}</span>
                        </div>
                        <div className="player-stat">
                          <span className="stat-key">Rating:</span>
                          <span className="stat-value">{player.rating}</span>
                        </div>
                        {player.wins !== undefined && (
                          <div className="player-stat">
                            <span className="stat-key">W/L:</span>
                            <span className="stat-value">{player.wins}/{player.losses}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="additional-stats-section">
          <h2 className="section-title">Statistiques Avancées</h2>
          <div className="stats-cards">
            {Object.entries(data.additionalStats).map(([key, value], index) => (
              <div key={index} className="advanced-stat-card">
                <div className="advanced-stat-value">{value}</div>
                <div className="advanced-stat-label">
                  {key === 'avgKDA' ? 'KDA Moyen' : 
                   key === 'avgACS' ? 'ACS Moyen' : 
                   key === 'avgRating' ? 'Rating Moyen' : 
                   key === 'totalGames' ? 'Matchs Totaux' : 
                   key === 'avgOverallKD' ? 'K/D Global Moyen' :
                   key === 'avgHpKD' ? 'K/D Hardpoint Moyen' :
                   key === 'avgSndKD' ? 'K/D SnD Moyen' :
                   key === 'avgOlKD' ? 'K/D Control Moyen' :
                   key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="team-content-grid">
          <div className="team-matches-section">
            <div className="section-header">
              <h2 className="section-title">Historique des Matchs</h2>
              <button 
                className="toggle-matches-btn"
                onClick={() => setShowAllMatches(!showAllMatches)}
              >
                {showAllMatches ? 'Voir moins' : 'Voir tout'}
              </button>
            </div>
            <div className="matches-list">
              {matchesToShow.map((match, index) => (
                <div 
                  key={index} 
                  className={`match-row ${match.win ? 'win' : 'loss'}`}
                  onClick={() => setSelectedMatch(match)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="match-date">{match.date}</div>
                  <div className="match-team">{match.team}</div>
                  <div className="match-separator-bar"></div>
                  <div className="match-score">{match.score}</div>
                  <div className="match-separator-bar"></div>
                  <div className="match-opponent">{match.opponent}</div>
                  <div className="match-tournament-badge">{match.tournament}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="team-ranking-section">
            <h2 className="section-title">Ranking</h2>
            <div className="ranking-table">
              <div className="ranking-header">
                <div className="rank-col">Pos</div>
                <div className="team-col">Équipe</div>
                <div className="stats-col">W-L</div>
                <div className="points-col">Points</div>
              </div>
              {data.ranking.map((team, index) => (
                <div key={index} className={`ranking-row ${team.highlight ? 'highlight' : ''}`}>
                  <div className="rank-col">#{team.pos}</div>
                  <div className="team-col">{team.team}</div>
                  <div className="stats-col">{team.wins}-{team.losses}</div>
                  <div className="points-col">{team.points}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="achievements-section">
          <h2 className="section-title">Trophées & Achievements</h2>
          <div className="achievements-grid">
            {achievements.map((achievement, index) => (
                <div key={index} className={`achievement-card ${currentGame.toLowerCase().replace(' ', '-')}-game`}>
                  <div className="achievement-icon">
                    <Icon name={achievement.icon} size={28} color="#7D3CFF" />
                  </div>
                  <div className="achievement-info">
                    <h3 className="achievement-title">{achievement.title}</h3>
                    <p className="achievement-date">{achievement.date}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="performance-chart-section">
          <h2 className="section-title">Évolution du Win Rate</h2>
          <div className="chart-container">
            {data.performanceData && data.performanceData.map((month, index) => (
              <div key={index} className="chart-bar-wrapper">
                <div className="chart-bar-container">
                  <div 
                    className={`chart-bar ${currentGame.toLowerCase().replace(' ', '-')}-game`}
                    style={{ height: `${month.winRate}%` }}
                  >
                    <span className="bar-value">{month.winRate}%</span>
                  </div>
                </div>
                <div className="chart-label">{month.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Section - Timeline des Kills */}
        <div className="premium-section">
          <div className="section-header-premium">
            <h2 className="section-title">Timeline des Kills</h2>
            {(userSubscription === 'basic' || userSubscription === 'pro') && (
              <div className="premium-badge">
                <span className="premium-icon">👑</span>
                Elite
              </div>
            )}
          </div>
          
          {userSubscription === 'elite' ? (
            <div className="timeline-container">
              <div className="timeline-header">
                <span className="timeline-label">Round</span>
                <span className="timeline-label">1:00</span>
                <span className="timeline-label">0:45</span>
                <span className="timeline-label">0:30</span>
                <span className="timeline-label">0:15</span>
                <span className="timeline-label">0:00</span>
              </div>
              {[1, 2, 3, 4, 5].map((round) => (
                <div key={round} className="timeline-row">
                  <span className="timeline-round">R{round}</span>
                  <div className="timeline-bar">
                    <div className="kill-marker" style={{ left: '20%' }}>
                      <span className="kill-tooltip">Minny +1</span>
                    </div>
                    <div className="kill-marker" style={{ left: '45%' }}>
                      <span className="kill-tooltip">Dipzh +2</span>
                    </div>
                    <div className="kill-marker" style={{ left: '70%' }}>
                      <span className="kill-tooltip">Buys +1</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="locked-overlay">
              <div className="lock-content">
                <div className="lock-icon"><Icon name="lock" size={48} color="#7D3CFF" /></div>
                <h3>Fonctionnalité Premium Elite</h3>
                <p>Accédez à la timeline détaillée des éliminations par round pour analyser les moments clés.</p>
                <button className="unlock-btn" onClick={() => window.location.href = '#abonnement'}>
                  Débloquer avec Elite
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Premium Section - Heatmap Tactique */}
        <div className="premium-section">
          <div className="section-header-premium">
            <h2 className="section-title">Heatmap Tactique</h2>
            {userSubscription === 'basic' && (
              <div className="premium-badge">
                <span className="premium-icon">⚡</span>
                Pro
              </div>
            )}
          </div>
          
          {(userSubscription === 'pro' || userSubscription === 'elite') ? (
            <div className="heatmap-container">
              <div className="heatmap-grid">
                {Array.from({ length: 100 }).map((_, index) => {
                  const intensity = Math.random();
                  return (
                    <div
                      key={index}
                      className="heatmap-cell"
                      style={{
                        backgroundColor: intensity > 0.7 
                          ? 'rgba(255, 70, 85, 0.8)' 
                          : intensity > 0.4 
                          ? 'rgba(255, 159, 28, 0.6)' 
                          : 'rgba(125, 60, 255, 0.3)'
                      }}
                    />
                  );
                })}
              </div>
              <div className="heatmap-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{ background: 'rgba(255, 70, 85, 0.8)' }}></span>
                  <span>Zone chaude</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: 'rgba(255, 159, 28, 0.6)' }}></span>
                  <span>Zone moyenne</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ background: 'rgba(125, 60, 255, 0.3)' }}></span>
                  <span>Zone froide</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="locked-overlay">
              <div className="lock-content">
                <div className="lock-icon"><Icon name="lock" size={48} color="#7D3CFF" /></div>
                <h3>Fonctionnalité Premium Pro</h3>
                <p>Visualisez les zones de contrôle et les positions les plus fréquentes avec des heatmaps interactives.</p>
                <button className="unlock-btn" onClick={() => window.location.href = '#abonnement'}>
                  Débloquer avec Pro
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="news-section">
          <h2 className="section-title">Dernières Actualités</h2>
          <div className="news-grid">
            {news.map((item, index) => (
              <div key={index} className="news-card">
                <div className={`news-category ${item.category.toLowerCase()}`}>
                  {item.category}
                </div>
                <div className="news-date">{item.date}</div>
                <h3 className="news-card-title">{item.title}</h3>
                <p className="news-description">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
