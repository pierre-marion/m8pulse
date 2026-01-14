import React from 'react';
import './PlayerCard.css';
import Icon from '../Icon';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

/**
 * Composant PlayerCard réutilisable pour afficher un joueur
 * @param {string} name - nom du joueur
 * @param {string} role - rôle du joueur
 * @param {string} game - jeu du joueur
 * @param {string} statLabel - label de la stat principale
 * @param {string|number} statValue - valeur de la stat
 * @param {string} color - couleur du jeu
 * @param {string} avatar - URL de l'avatar (optionnel)
 * @param {function} onClick - fonction au clic
 */
const PlayerCard = ({ 
  name,
  role,
  game,
  statLabel,
  statValue,
  color = '#7D3CFF',
  avatar,
  onClick,
  className = '',
  sortValue, // extracted to avoid passing unknown prop to DOM
  ...props 
}) => {
  // Générer des initiales si pas d'avatar
  const initials = name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??';

  return (
    <Card 
      variant="glass" 
      hover 
      clickable={!!onClick}
      className={`player-card ${className}`}
      onClick={onClick}
      // Passer la valeur de tri comme data-attribute pour éviter les warnings React
      data-sortvalue={sortValue}
      {...props}
    >
      <div className="player-card-content">
        <div className="player-avatar" style={{ borderColor: color }}>
          {avatar ? (
            <img src={avatar} alt={name} />
          ) : (
            <span className="player-initials" style={{ background: color }}>
              {initials}
            </span>
          )}
        </div>
        
        <div className="player-info">
          <h3 className="player-name">{name}</h3>
          <p className="player-role">{role}</p>
          <Badge variant={game?.toLowerCase()} size="small">
            {game}
          </Badge>
        </div>

        <div className="player-stat">
          <div className="stat-value" style={{ color }}>{statValue}</div>
          <div className="stat-label">{statLabel}</div>
        </div>
      </div>
    </Card>
  );
};

export default PlayerCard;
