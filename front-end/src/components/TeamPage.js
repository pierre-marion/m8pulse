import React from 'react';
import './TeamPage.css';

function TeamPage({ currentGame, onGameChange }) {
  const matches = [
    { date: '14/08', opponent: 'Gentle Mates', score: '1-2', against: 'Vitality' },
    { date: '14/08', opponent: 'Gentle Mates', score: '1-2', against: 'Vitality' },
    { date: '14/08', opponent: 'Gentle Mates', score: '1-2', against: 'Vitality' },
    { date: '14/08', opponent: 'Gentle Mates', score: '1-2', against: 'Vitality' },
  ];

  // Détermine quel jeu est actif (index 0-3)
  const gameIndex = ['Valorant', 'Counter Strike', 'Call of Duty', 'Fortnite'].indexOf(currentGame);

  // Configuration pour chaque jeu
  const gameConfig = {
    'Valorant': {
      title: 'Valorant - VCT',
      players: 'Minny · Dipzh · Buys · Marteen · Starxo',
      region: '#8 EMEA'
    },
    'Counter Strike': {
      title: 'Counter Strike - ESL',
      players: 'Player1 · Player2 · Player3 · Player4 · Player5',
      region: '#12 EU'
    },
    'Call of Duty': {
      title: 'Call of Duty - CDL',
      players: 'Soldier1 · Soldier2 · Soldier3 · Soldier4',
      region: '#5 NA'
    },
    'Fortnite': {
      title: 'Fortnite - FNCS',
      players: 'Builder1 · Builder2 · Builder3',
      region: '#3 EU'
    }
  };

  const config = gameConfig[currentGame] || gameConfig['Valorant'];

  return (
    <div className="team-page">
      <h1 className="equipes-title">Equipes</h1>
      
      <div className="team-content-wrapper">
        <div className="team-header-section">
          <div className="team-region-badge">{config.region}</div>
          
          <div className="team-info-card">
            <div className="team-left-section">
              <div className="team-dots">
                <div 
                  className={`dot ${gameIndex === 0 ? 'active' : ''}`}
                  onClick={() => onGameChange(0)}
                  title="Valorant"
                ></div>
                <div 
                  className={`dot ${gameIndex === 1 ? 'active' : ''}`}
                  onClick={() => onGameChange(1)}
                  title="Counter Strike"
                ></div>
                <div 
                  className={`dot ${gameIndex === 2 ? 'active' : ''}`}
                  onClick={() => onGameChange(2)}
                  title="Call of Duty"
                ></div>
                <div 
                  className={`dot ${gameIndex === 3 ? 'active' : ''}`}
                  onClick={() => onGameChange(3)}
                  title="Fortnite"
                ></div>
              </div>
              
              <div className="team-logo-wrapper">
                <svg className="valorant-logo" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <polygon points="30,20 50,60 30,80" fill="#FF4655"/>
                  <polygon points="50,60 70,20 70,80" fill="#FF4655"/>
                </svg>
              </div>
              
              <div className="team-info">
                <h2 className="team-name">{config.title}</h2>
                <p className="team-players">{config.players}</p>
              </div>
            </div>
            
            <div className="team-stats-card">
              <div className="stat-item">
                <div className="stat-value">200</div>
                <div className="stat-label">Parties</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">85%</div>
                <div className="stat-label">Win Rate</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">9</div>
                <div className="stat-label">Formats</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">$66,386</div>
                <div className="stat-label">Earning</div>
              </div>
            </div>
          </div>
        </div>

        <div className="team-content-grid">
          <div className="team-matches-section">
            <h2 className="section-title">Derniers Matchs</h2>
            <div className="matches-list">
              {matches.map((match, index) => (
                <div key={index} className="match-row">
                  <div className="match-date">{match.date}</div>
                  <div className="match-opponent">{match.opponent}</div>
                  <div className="match-separator-bar"></div>
                  <div className="match-score">{match.score}</div>
                  <div className="match-separator-bar"></div>
                  <div className="match-against">{match.against}</div>
                  <div className="match-tournament">
                    <div className="tournament-logo">
                      <svg viewBox="0 0 40 40" className="vct-logo">
                        <text x="20" y="15" fontSize="16" fill="#FF4655" textAnchor="middle" fontWeight="bold">✖</text>
                        <text x="20" y="30" fontSize="8" fill="#FF4655" textAnchor="middle" fontWeight="bold">VCT</text>
                        <text x="20" y="38" fontSize="6" fill="#FF4655" textAnchor="middle">EMEA</text>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="team-ranking-section">
            <h2 className="section-title">EMEA Ranking</h2>
          </div>
        </div>

        <div className="news-section">
          <h2 className="news-title">NEWS A METTRE</h2>
        </div>
      </div>
    </div>
  );
}

export default TeamPage;
