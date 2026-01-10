import React from 'react';
import './GamesPage.css';

const GamesPage = () => {
  const games = [
    {
      id: 1,
      name: 'Valorant',
      category: 'FPS Tactique',
      teamSize: '5v5',
      image: '/img/valo.jpg',
      stats: {
        players: 42,
        teams: 8,
        tournaments: 12
      }
    },
    {
      id: 2,
      name: 'Counter-Strike 2',
      category: 'FPS Tactique',
      teamSize: '5v5',
      image: '/img/cs2.webp',
      stats: {
        players: 38,
        teams: 7,
        tournaments: 15
      }
    },
    {
      id: 3,
      name: 'Call of Duty',
      category: 'FPS',
      teamSize: '4v4',
      image: '/img/cod.webp',
      stats: {
        players: 35,
        teams: 9,
        tournaments: 10
      }
    }
  ];

  return (
    <div className="games-page">
      {/* Liste des jeux */}
      <div className="games-list">
        {games.map(game => (
          <div 
            key={game.id} 
            className="game-row"
            style={{ 
              backgroundImage: `url(${game.image})`
            }}
          >
            <div className="game-overlay"></div>
            <div className="game-row-content">
              <h2 className="game-name">{game.name}</h2>
              <div className="game-stats">
                <div className="stat-item">
                  <span className="stat-number">{game.stats.teams}</span>
                  <span className="stat-label">Équipes</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{game.stats.players}</span>
                  <span className="stat-label">Joueurs</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">{game.stats.tournaments}</span>
                  <span className="stat-label">Tournois</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
