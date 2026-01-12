import React from 'react';
import './GameCard.css';
import Icon from '../Icon';
import Card from '../ui/Card';

/**
 * Composant GameCard réutilisable pour afficher un jeu
 * @param {number} id - ID du jeu
 * @param {string} name - nom du jeu
 * @param {string} category - catégorie du jeu
 * @param {string} teamSize - taille d'équipe (ex: "5v5")
 * @param {string} image - URL de l'image
 * @param {object} stats - statistiques du jeu {players, teams, tournaments}
 * @param {function} onClick - fonction au clic
 */
const GameCard = ({ 
  id,
  name,
  category,
  teamSize,
  image,
  stats = {},
  onClick,
  className = '',
  ...props 
}) => {
  return (
    <Card 
      variant="glass" 
      hover 
      clickable={!!onClick}
      className={`game-card ${className}`}
      onClick={onClick}
      {...props}
    >
      <div 
        className="game-card-background"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="game-card-overlay"></div>
      </div>
      
      <div className="game-card-content">
        <div className="game-card-header">
          <h2 className="game-name">{name}</h2>
          <p className="game-category">{category} • {teamSize}</p>
        </div>

        <div className="game-stats">
          {stats.teams !== undefined && (
            <div className="game-stat-item">
              <Icon name="shield" size={18} />
              <div className="stat-content">
                <span className="stat-number">{stats.teams}</span>
                <span className="stat-label">Équipes</span>
              </div>
            </div>
          )}
          {stats.players !== undefined && (
            <div className="game-stat-item">
              <Icon name="users" size={18} />
              <div className="stat-content">
                <span className="stat-number">{stats.players}</span>
                <span className="stat-label">Joueurs</span>
              </div>
            </div>
          )}
          {stats.tournaments !== undefined && (
            <div className="game-stat-item">
              <Icon name="trophy" size={18} />
              <div className="stat-content">
                <span className="stat-number">{stats.tournaments}</span>
                <span className="stat-label">Tournois</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default GameCard;
