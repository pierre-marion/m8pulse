import React, { useState } from 'react';
import './MatchDetailPage.css';

function MatchDetailPage({ matchData, onBack }) {
  const [selectedRound, setSelectedRound] = useState(1);
  const [selectedMap, setSelectedMap] = useState(0);

  // Données du match
  const match = {
    date: '28 Novembre 2025',
    tournament: 'VCT EMEA',
    team1: {
      name: 'Gentle Mates',
      logo: '🔴',
      score: 13
    },
    team2: {
      name: 'Team Vitality',
      logo: '🟡',
      score: 11
    },
    maps: [
      {
        name: 'Ascent',
        score1: 13,
        score2: 11,
        rounds: Array.from({ length: 24 }, (_, i) => ({
          number: i + 1,
          winner: Math.random() > 0.5 ? 'team1' : 'team2',
          duration: `${Math.floor(Math.random() * 60 + 30)}s`,
          kills: [
            { player: 'Minny', team: 'team1', time: '0:45', weapon: '⚔️' },
            { player: 'Dipzh', team: 'team1', time: '0:32', weapon: '🔫' },
            { player: 'Sayf', team: 'team2', time: '0:28', weapon: '⚔️' },
            { player: 'Buys', team: 'team1', time: '0:15', weapon: '💣' },
          ],
          firstBlood: Math.random() > 0.5 ? 'team1' : 'team2',
          bombPlanted: Math.random() > 0.3,
          clutch: Math.random() > 0.8
        }))
      },
      {
        name: 'Bind',
        score1: 11,
        score2: 13,
        rounds: Array.from({ length: 24 }, (_, i) => ({
          number: i + 1,
          winner: Math.random() > 0.5 ? 'team1' : 'team2',
          duration: `${Math.floor(Math.random() * 60 + 30)}s`,
          kills: [],
          firstBlood: Math.random() > 0.5 ? 'team1' : 'team2',
          bombPlanted: Math.random() > 0.3,
          clutch: Math.random() > 0.8
        }))
      }
    ],
    playersStats: {
      team1: [
        { name: 'Minny', agent: '⚡', kills: 28, deaths: 18, assists: 7, acs: 285, kd: 1.56, hs: '32%', firstKills: 5, clutches: 2 },
        { name: 'Dipzh', agent: '💨', kills: 22, deaths: 19, assists: 12, acs: 234, kd: 1.16, hs: '28%', firstKills: 3, clutches: 1 },
        { name: 'Buys', agent: '🔥', kills: 24, deaths: 21, assists: 9, acs: 256, kd: 1.14, hs: '29%', firstKills: 4, clutches: 0 },
        { name: 'Marteen', agent: '🛡️', kills: 18, deaths: 20, assists: 8, acs: 198, kd: 0.90, hs: '25%', firstKills: 2, clutches: 1 },
        { name: 'Starxo', agent: '🎯', kills: 20, deaths: 19, assists: 11, acs: 223, kd: 1.05, hs: '31%', firstKills: 3, clutches: 0 }
      ],
      team2: [
        { name: 'Sayf', agent: '⚡', kills: 26, deaths: 22, assists: 6, acs: 268, kd: 1.18, hs: '30%', firstKills: 4, clutches: 1 },
        { name: 'Trexx', agent: '💨', kills: 21, deaths: 23, assists: 10, acs: 221, kd: 0.91, hs: '27%', firstKills: 2, clutches: 0 },
        { name: 'Derke', agent: '🔥', kills: 23, deaths: 24, assists: 7, acs: 245, kd: 0.96, hs: '33%', firstKills: 3, clutches: 2 },
        { name: 'Leo', agent: '🛡️', kills: 19, deaths: 21, assists: 13, acs: 212, kd: 0.90, hs: '24%', firstKills: 1, clutches: 0 },
        { name: 'Boaster', agent: '🎯', kills: 16, deaths: 22, assists: 14, acs: 189, kd: 0.73, hs: '26%', firstKills: 2, clutches: 1 }
      ]
    },
    teamStats: {
      team1: {
        firstBloods: 13,
        clutchesWon: 4,
        roundsAttack: 7,
        roundsDefense: 6,
        bombPlants: 18,
        avgRoundTime: '42s',
        economyWon: 8
      },
      team2: {
        firstBloods: 11,
        clutchesWon: 4,
        roundsAttack: 6,
        roundsDefense: 5,
        bombPlants: 16,
        avgRoundTime: '45s',
        economyWon: 6
      }
    }
  };

  const currentMap = match.maps[selectedMap];
  const currentRound = currentMap.rounds[selectedRound - 1];

  return (
    <div className="match-detail-page">
      <button className="back-btn" onClick={onBack}>
        ← Retour
      </button>

      {/* Header du match */}
      <div className="match-header">
        <div className="match-info-top">
          <div className="tournament-badge">{match.tournament}</div>
          <div className="match-date">{match.date}</div>
        </div>
        
        <div className="match-teams">
          <div className="team-score-section">
            <div className="team-logo">{match.team1.logo}</div>
            <h2 className="team-name-large">{match.team1.name}</h2>
            <div className="team-score winner">{match.team1.score}</div>
          </div>
          
          <div className="vs-divider">VS</div>
          
          <div className="team-score-section">
            <div className="team-logo">{match.team2.logo}</div>
            <h2 className="team-name-large">{match.team2.name}</h2>
            <div className="team-score">{match.team2.score}</div>
          </div>
        </div>
      </div>

      {/* Sélecteur de maps */}
      <div className="map-selector">
        {match.maps.map((map, index) => (
          <button
            key={index}
            className={`map-btn ${selectedMap === index ? 'active' : ''}`}
            onClick={() => setSelectedMap(index)}
          >
            <span className="map-name">{map.name}</span>
            <span className="map-score">
              {map.score1} - {map.score2}
            </span>
          </button>
        ))}
      </div>

      {/* Timeline des rounds */}
      <div className="rounds-timeline-section">
        <h2 className="section-title">Timeline des Rounds</h2>
        <div className="rounds-timeline">
          {currentMap.rounds.map((round, index) => (
            <button
              key={index}
              className={`round-indicator ${round.winner} ${selectedRound === index + 1 ? 'selected' : ''}`}
              onClick={() => setSelectedRound(index + 1)}
              title={`Round ${round.number} - ${round.winner === 'team1' ? match.team1.name : match.team2.name}`}
            >
              {round.number}
            </button>
          ))}
        </div>
        <div className="timeline-legend">
          <span className="legend-item team1">⬤ {match.team1.name}</span>
          <span className="legend-item team2">⬤ {match.team2.name}</span>
        </div>
      </div>

      {/* Détails du round sélectionné */}
      <div className="round-detail-section">
        <h2 className="section-title">Round {selectedRound} - Détails</h2>
        <div className="round-detail-grid">
          <div className="round-info-card">
            <span className="round-info-label">Vainqueur</span>
            <span className="round-info-value">
              {currentRound.winner === 'team1' ? match.team1.name : match.team2.name}
            </span>
          </div>
          <div className="round-info-card">
            <span className="round-info-label">Durée</span>
            <span className="round-info-value">{currentRound.duration}</span>
          </div>
          <div className="round-info-card">
            <span className="round-info-label">First Blood</span>
            <span className="round-info-value">
              {currentRound.firstBlood === 'team1' ? match.team1.name : match.team2.name}
            </span>
          </div>
          <div className="round-info-card">
            <span className="round-info-label">Bombe</span>
            <span className="round-info-value">{currentRound.bombPlanted ? '✓ Posée' : '✗ Non posée'}</span>
          </div>
        </div>
      </div>

      {/* Stats des joueurs */}
      <div className="players-stats-section">
        <h2 className="section-title">Statistiques des Joueurs</h2>
        
        <div className="team-stats-table">
          <h3 className="team-stats-title">{match.team1.name}</h3>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Joueur</th>
                <th>Agent</th>
                <th>K</th>
                <th>D</th>
                <th>A</th>
                <th>K/D</th>
                <th>ACS</th>
                <th>HS%</th>
                <th>FK</th>
                <th>Clutches</th>
              </tr>
            </thead>
            <tbody>
              {match.playersStats.team1.map((player, index) => (
                <tr key={index} className={player.kd >= 1.2 ? 'highlight-player' : ''}>
                  <td className="player-name-col">{player.name}</td>
                  <td className="agent-col">{player.agent}</td>
                  <td className="kills-col">{player.kills}</td>
                  <td className="deaths-col">{player.deaths}</td>
                  <td className="assists-col">{player.assists}</td>
                  <td className="kd-col">{player.kd}</td>
                  <td className="acs-col">{player.acs}</td>
                  <td className="hs-col">{player.hs}</td>
                  <td className="fk-col">{player.firstKills}</td>
                  <td className="clutch-col">{player.clutches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="team-stats-table">
          <h3 className="team-stats-title">{match.team2.name}</h3>
          <table className="stats-table">
            <thead>
              <tr>
                <th>Joueur</th>
                <th>Agent</th>
                <th>K</th>
                <th>D</th>
                <th>A</th>
                <th>K/D</th>
                <th>ACS</th>
                <th>HS%</th>
                <th>FK</th>
                <th>Clutches</th>
              </tr>
            </thead>
            <tbody>
              {match.playersStats.team2.map((player, index) => (
                <tr key={index} className={player.kd >= 1.2 ? 'highlight-player' : ''}>
                  <td className="player-name-col">{player.name}</td>
                  <td className="agent-col">{player.agent}</td>
                  <td className="kills-col">{player.kills}</td>
                  <td className="deaths-col">{player.deaths}</td>
                  <td className="assists-col">{player.assists}</td>
                  <td className="kd-col">{player.kd}</td>
                  <td className="acs-col">{player.acs}</td>
                  <td className="hs-col">{player.hs}</td>
                  <td className="fk-col">{player.firstKills}</td>
                  <td className="clutch-col">{player.clutches}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats d'équipe */}
      <div className="team-comparison-section">
        <h2 className="section-title">Comparaison d'Équipes</h2>
        <div className="comparison-grid">
          <div className="comparison-row">
            <div className="stat-value team1">{match.teamStats.team1.firstBloods}</div>
            <div className="stat-label-center">First Bloods</div>
            <div className="stat-value team2">{match.teamStats.team2.firstBloods}</div>
          </div>
          <div className="comparison-row">
            <div className="stat-value team1">{match.teamStats.team1.clutchesWon}</div>
            <div className="stat-label-center">Clutches Won</div>
            <div className="stat-value team2">{match.teamStats.team2.clutchesWon}</div>
          </div>
          <div className="comparison-row">
            <div className="stat-value team1">{match.teamStats.team1.roundsAttack}</div>
            <div className="stat-label-center">Rounds Attack</div>
            <div className="stat-value team2">{match.teamStats.team2.roundsAttack}</div>
          </div>
          <div className="comparison-row">
            <div className="stat-value team1">{match.teamStats.team1.roundsDefense}</div>
            <div className="stat-label-center">Rounds Defense</div>
            <div className="stat-value team2">{match.teamStats.team2.roundsDefense}</div>
          </div>
          <div className="comparison-row">
            <div className="stat-value team1">{match.teamStats.team1.bombPlants}</div>
            <div className="stat-label-center">Bomb Plants</div>
            <div className="stat-value team2">{match.teamStats.team2.bombPlants}</div>
          </div>
          <div className="comparison-row">
            <div className="stat-value team1">{match.teamStats.team1.economyWon}</div>
            <div className="stat-label-center">Economy Won</div>
            <div className="stat-value team2">{match.teamStats.team2.economyWon}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchDetailPage;
