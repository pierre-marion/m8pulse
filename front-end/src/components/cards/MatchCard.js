import React from 'react';
import './MatchCard.css';
import Icon from '../Icon';
import Card from '../ui/Card';

/**
 * Composant MatchCard réutilisable pour afficher un match
 * @param {string} game - nom du jeu
 * @param {string} gameIcon - icône du jeu
 * @param {string} team1 - équipe 1
 * @param {string} team2 - équipe 2
 * @param {string} score - score du match
 * @param {string} date - date du match
 * @param {string} tournament - nom du tournoi
 * @param {boolean} win - victoire ou défaite
 * @param {string} color - couleur du jeu
 * @param {function} onClick - fonction au clic
 */
const MatchCard = ({ 
  game,
  gameIcon = 'target',
  team1,
  team2,
  score,
  date,
  tournament,
  win,
  color = '#7D3CFF',
  onClick,
  className = '',
  ...props 
}) => {
  const matchClass = `match-card ${win ? 'match-win' : 'match-loss'} ${className}`;
  
  return (
    <div 
      className={matchClass}
      style={{ borderLeftColor: color }}
      onClick={onClick}
      {...props}
    >
      <div className="match-card-header">
        <div 
          className="match-status" 
          style={{ backgroundColor: win ? '#4CAF50' : '#FF6B7A' }}
        >
          {win ? '✓ VICTOIRE' : '✗ DÉFAITE'}
        </div>
      </div>

      <div className="match-card-body">
        <div className="match-teams">
          <div className="match-team">
            <span className="team-name">{team1}</span>
          </div>
          <div className="match-score">
            {score}
          </div>
          <div className="match-team">
            <span className="team-name">{team2}</span>
          </div>
        </div>
      </div>

      <div className="match-card-footer">
        <span className="match-game">{game}</span>
        <span className="match-date">{date}</span>
      </div>
    </div>
  );
};

export default MatchCard;
