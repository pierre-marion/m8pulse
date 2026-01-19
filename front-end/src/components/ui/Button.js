import React from 'react';
import './Button.css';
import Icon from '../common/Icon/Icon';

/**
 * Composant Button réutilisable
 * @param {string} variant - primary, secondary, outline, ghost
 * @param {string} size - small, medium, large
 * @param {string} icon - nom de l'icône (optionnel)
 * @param {boolean} iconRight - afficher l'icône à droite
 * @param {boolean} fullWidth - prendre toute la largeur
 * @param {boolean} disabled - désactiver le bouton
 */
const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  icon,
  iconRight = false,
  fullWidth = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth && 'btn-full-width',
    disabled && 'btn-disabled',
    className
  ].filter(Boolean).join(' ');

  return (
    <button 
      className={classes}
      onClick={onClick}
      disabled={disabled}
      type={type}
      {...props}
    >
      {icon && !iconRight && <Icon name={icon} size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />}
      {children && <span className="btn-text">{children}</span>}
      {icon && iconRight && <Icon name={icon} size={size === 'small' ? 14 : size === 'large' ? 20 : 16} />}
    </button>
  );
};

export default Button;
