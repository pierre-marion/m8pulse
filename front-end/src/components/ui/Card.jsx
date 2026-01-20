import React from 'react';
import './Card.css';

/**
 * Composant Card réutilisable
 * @param {string} variant - default, glass, gradient
 * @param {boolean} hover - effet hover
 * @param {boolean} clickable - curseur pointer
 */
const Card = ({ 
  children, 
  variant = 'default',
  hover = false,
  clickable = false,
  className = '',
  onClick,
  ...props 
}) => {
  const classes = [
    'card',
    `card-${variant}`,
    hover && 'card-hover',
    clickable && 'card-clickable',
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
