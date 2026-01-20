import React from 'react';
import './StatCard.css';
import Icon from '../common/Icon/Icon';
import Card from './Card';

/**
 * Composant StatCard réutilisable pour afficher une statistique
 * @param {string} icon - nom de l'icône
 * @param {string|number} value - valeur de la stat
 * @param {string} label - label de la stat
 * @param {string} color - couleur principale
 * @param {string} trend - up, down, neutral (optionnel)
 * @param {string} trendValue - valeur du trend (optionnel)
 */
const StatCard = ({ 
  icon,
  value,
  label,
  color = '#7D3CFF',
  trend,
  trendValue,
  className = '',
  ...props 
}) => {
  return (
    <Card variant="glass" hover className={`stat-card ${className}`} {...props}>
      <div className="stat-card-content">
        {icon && (
          <div className="stat-icon" style={{ color }}>
            <Icon name={icon} size={32} color={color} />
          </div>
        )}
        <div className="stat-info">
          <div className="stat-value">{value}</div>
          <div className="stat-label">{label}</div>
          {trend && trendValue && (
            <div className={`stat-trend stat-trend-${trend}`}>
              <Icon name={trend === 'up' ? 'trendingUp' : trend === 'down' ? 'trendingDown' : 'minus'} size={14} />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
