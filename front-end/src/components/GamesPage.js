import React from 'react';
import './GamesPage.css';

function GamesPage() {
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
      description: 'FPS tactique 5v5 par Riot Games'
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
      description: 'Le FPS tactique légendaire nouvelle génération'
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
      description: 'FPS compétitif rapide et intense'
    },
    {
      id: 4,
      name: 'Fortnite',
      category: 'Battle Royale',
      teamSize: 'Trio',
      color: '#00AEEF',
      gradient: 'linear-gradient(135deg, #00AEEF, #3BC9FF)',
      emoji: '🏗️',
      status: 'Actif',
      description: 'Battle Royale avec construction'
    },
    {
      id: 5,
      name: 'League of Legends',
      category: 'MOBA',
      teamSize: '5v5',
      color: '#C89B3C',
      gradient: 'linear-gradient(135deg, #C89B3C, #D4AF37)',
      emoji: '⚡',
      status: 'À venir',
      description: 'MOBA stratégique de Riot Games'
    },
    {
      id: 6,
      name: 'Rocket League',
      category: 'Sport',
      teamSize: '3v3',
      color: '#0081FF',
      gradient: 'linear-gradient(135deg, #0081FF, #3399FF)',
      emoji: '🚗',
      status: 'À venir',
      description: 'Football avec des voitures volantes'
    }
  ];

  return (
    <div className="games-page">
      {/* Liste des jeux */}
      <div className="games-list">
        {games.map(game => (
          <div 
            key={game.id} 
            className="game-item"
            style={{ 
              '--game-color': game.color,
              '--game-gradient': game.gradient
            }}
          >
            <div className="game-item-bg" style={{ background: game.gradient }}></div>
            <div className="game-item-emoji">{game.emoji}</div>
            <div className="game-item-overlay">
              <div className="game-item-info">
                <h3 className="game-item-title">{game.name}</h3>
                <p className="game-item-category">{game.category}</p>
                <p className="game-item-team">{game.teamSize}</p>
                <span className="game-item-status" data-status={game.status}>
                  {game.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GamesPage;
