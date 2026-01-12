import React from 'react';
import './GamesPage.css';
import { GameCard } from './cards';

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
      <div className="games-list">
        {games.map(game => (
          <GameCard
            key={game.id}
            {...game}
          />
        ))}
      </div>
    </div>
  );
};

export default GamesPage;
