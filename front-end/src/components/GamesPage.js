import React, { useState } from 'react';
import './GamesPage.css';

function GamesPage() {
  const [selectedGame, setSelectedGame] = useState(null);
  
  const games = [
    {
      id: 1,
      name: 'Valorant',
      category: 'FPS Tactique',
      teamSize: '5v5',
      color: '#FF4655',
      gradient: 'linear-gradient(135deg, #FF4655, #FF6B77)',
      emoji: '🎯',
      status: 'Actif',
      description: 'FPS tactique 5v5 par Riot Games',
      stats: {
        players: 42,
        teams: 8,
        tournaments: 12,
        prizePool: '50,000€'
      },
      ranks: ['Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Immortal', 'Radiant']
    },
    {
      id: 2,
      name: 'Counter-Strike 2',
      category: 'FPS Tactique',
      teamSize: '5v5',
      color: '#FF9F1C',
      gradient: 'linear-gradient(135deg, #FF9F1C, #FFB84D)',
      emoji: '🔫',
      status: 'Actif',
      description: 'Le FPS tactique légendaire nouvelle génération',
      stats: {
        players: 38,
        teams: 7,
        tournaments: 15,
        prizePool: '75,000€'
      },
      ranks: ['Silver', 'Gold Nova', 'Master Guardian', 'Legendary Eagle', 'Supreme', 'Global Elite']
    },
    {
      id: 3,
      name: 'Call of Duty',
      category: 'FPS',
      teamSize: '4v4',
      color: '#8A2BE2',
      gradient: 'linear-gradient(135deg, #8A2BE2, #A855F7)',
      emoji: '⚔️',
      status: 'Actif',
      description: 'FPS compétitif rapide et intense',
      stats: {
        players: 35,
        teams: 9,
        tournaments: 10,
        prizePool: '40,000€'
      },
      ranks: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Crimson', 'Iridescent', 'Top 250']
    }
  ];

  return (
    <div className="games-page">
      <div className="games-header">
        <h1 className="games-title">Nos Jeux Compétitifs</h1>
        <p className="games-subtitle">Découvrez les jeux eSport sur lesquels nos équipes excellent</p>
      </div>

      {/* Liste des jeux */}
      <div className="games-grid">
        {games.map(game => (
          <div 
            key={game.id} 
            className={`game-card ${selectedGame?.id === game.id ? 'selected' : ''}`}
            onClick={() => setSelectedGame(game)}
            style={{ 
              '--game-color': game.color,
              '--game-gradient': game.gradient
            }}
          >
            <div className="game-card-bg" style={{ background: game.gradient }}></div>
            <div className="game-card-content">
              <div className="game-emoji">{game.emoji}</div>
              <h3 className="game-name">{game.name}</h3>
              <p className="game-category">{game.category}</p>
              <div className="game-quick-stats">
                <div className="quick-stat">
                  <span className="stat-value">{game.stats.teams}</span>
                  <span className="stat-label">Équipes</span>
                </div>
                <div className="quick-stat">
                  <span className="stat-value">{game.stats.players}</span>
                  <span className="stat-label">Joueurs</span>
                </div>
                <div className="quick-stat">
                  <span className="stat-value">{game.stats.tournaments}</span>
                  <span className="stat-label">Tournois</span>
                </div>
              </div>
              <span className="game-status active">{game.status}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Détails du jeu sélectionné */}
      {selectedGame && (
        <div className="game-details" style={{ '--detail-color': selectedGame.color }}>
          <button className="close-details" onClick={() => setSelectedGame(null)}>✕</button>
          
          <div className="detail-header" style={{ background: selectedGame.gradient }}>
            <div className="detail-emoji">{selectedGame.emoji}</div>
            <div>
              <h2>{selectedGame.name}</h2>
              <p>{selectedGame.description}</p>
            </div>
          </div>

          <div className="detail-content">
            <div className="detail-section">
              <h3>Statistiques</h3>
              <div className="stats-grid">
                <div className="stat-box">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <span className="stat-number">{selectedGame.stats.players}</span>
                    <span className="stat-text">Joueurs actifs</span>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">🏆</div>
                  <div className="stat-info">
                    <span className="stat-number">{selectedGame.stats.teams}</span>
                    <span className="stat-text">Équipes</span>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">🎮</div>
                  <div className="stat-info">
                    <span className="stat-number">{selectedGame.stats.tournaments}</span>
                    <span className="stat-text">Tournois</span>
                  </div>
                </div>
                <div className="stat-box">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <span className="stat-number">{selectedGame.stats.prizePool}</span>
                    <span className="stat-text">Prize Pool</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="detail-section">
              <h3>Système de Rang</h3>
              <div className="ranks-container">
                {selectedGame.ranks.map((rank, index) => (
                  <div key={index} className="rank-badge" style={{ background: selectedGame.gradient }}>
                    {rank}
                  </div>
                ))}
              </div>
            </div>

            <div className="detail-section">
              <h3>Format Compétitif</h3>
              <div className="format-info">
                <div className="format-item">
                  <strong>Format:</strong> {selectedGame.teamSize}
                </div>
                <div className="format-item">
                  <strong>Catégorie:</strong> {selectedGame.category}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GamesPage;
