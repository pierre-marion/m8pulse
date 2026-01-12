import React from 'react';
import './NewsCard.css';
import Icon from '../Icon';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

/**
 * Composant NewsCard réutilisable pour afficher une actualité
 * @param {number} id - ID de l'article
 * @param {string} category - catégorie (NEWS, ANALYSE, etc.)
 * @param {string} title - titre de l'article
 * @param {string} excerpt - résumé de l'article
 * @param {string} date - date de publication
 * @param {string} image - nom de l'icône ou URL de l'image
 * @param {string} color - couleur principale
 * @param {string} game - jeu associé
 * @param {function} onClick - fonction au clic
 */
const NewsCard = ({ 
  id,
  category = 'NEWS',
  title,
  excerpt,
  date,
  image,
  color = '#7D3CFF',
  game,
  onClick,
  className = '',
  ...props 
}) => {
  const isIcon = image && !image.startsWith('http') && !image.startsWith('/');

  return (
    <Card 
      variant="glass" 
      hover 
      clickable={!!onClick}
      className={`news-card ${className}`}
      onClick={onClick}
      {...props}
    >
      <div className="news-card-header">
        <div className="news-image-container" style={{ borderColor: color }}>
          {isIcon ? (
            <Icon name={image} size={32} color={color} />
          ) : (
            <img src={image} alt={title} className="news-image" />
          )}
        </div>
        <Badge variant="primary" size="small">
          {category}
        </Badge>
      </div>

      <div className="news-card-body">
        <h3 className="news-title">{title}</h3>
        <p className="news-excerpt">{excerpt}</p>
      </div>

      <div className="news-card-footer">
        <div className="news-date">
          <Icon name="calendar" size={14} />
          <span>{date}</span>
        </div>
        {game && (
          <Badge variant={game.toLowerCase()} size="small">
            {game}
          </Badge>
        )}
      </div>
    </Card>
  );
};

export default NewsCard;
