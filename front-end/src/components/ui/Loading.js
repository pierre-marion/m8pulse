import React from 'react';
import './Loading.css';
import Icon from '../common/Icon/Icon';

/**
 * Composant Loading réutilisable
 * @param {string} size - small, medium, large
 * @param {string} text - texte à afficher
 * @param {boolean} fullscreen - affichage plein écran
 */
const Loading = ({ 
  size = 'medium',
  text = 'Chargement...',
  fullscreen = false,
  className = '',
  ...props 
}) => {
  const classes = [
    'loading',
    `loading-${size}`,
    fullscreen && 'loading-fullscreen',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} {...props}>
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
      </div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  );
};

export default Loading;
