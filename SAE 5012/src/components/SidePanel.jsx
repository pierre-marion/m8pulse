import React from 'react';
import { playersData } from '../data/players';
import './SidePanel.css';

const SidePanel = ({ selectedPlayer, onClose, onPlayerClick }) => {
  const allPlayers = Object.values(playersData);
  const playersList = allPlayers.slice(0, 4);
  const starsList = allPlayers.slice(4);

  return (
    <div className="side-panel">
      <div className="profils-header">PROFILS</div>

      {selectedPlayer ? (
        <div className="panel-section player-profile">
          <button className="close-button" onClick={onClose} aria-label="Fermer">×</button>
          <div className="player-header">
            <h2>{selectedPlayer.name}</h2>
            <span className="player-country">{selectedPlayer.country}</span>
          </div>
          
          <div className="player-details">
            <div className="detail-row">
              <span className="label">Position:</span>
              <span className="value">{selectedPlayer.position}</span>
            </div>
            <div className="detail-row">
              <span className="label">Équipe:</span>
              <span className="value">{selectedPlayer.team}</span>
            </div>
          </div>

          <div className="player-stats">
            <h3>Statistiques</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-label">KDA</span>
                <span className="stat-value">{selectedPlayer.stats.kda}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Winrate</span>
                <span className="stat-value">{selectedPlayer.stats.winrate}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Games</span>
                <span className="stat-value">{selectedPlayer.stats.games}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="panel-section">
            <h2>LISTES DES<br />JOEUEURS</h2>
            <div className="player-list">
              {playersList.map((player, index) => (
                <div 
                  key={index} 
                  className="player-item" 
                  onClick={() => onPlayerClick(player.cityName)}
                >
                  {player.name}
                </div>
              ))}
            </div>
          </div>

          <div className="panel-section">
            <h2>JOUEURS A<br />L'AFFICHE</h2>
            <div className="player-list">
              {starsList.map((star, index) => (
                <div 
                  key={index} 
                  className="player-item"
                  onClick={() => onPlayerClick(star.cityName)}
                >
                  {star.name}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SidePanel;
