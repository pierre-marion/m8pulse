import React from 'react';
import './Badge.css';

/**
 * Composant Badge réutilisable
 * @param {string} variant - primary, success, warning, danger, info
 * @param {string} size - small, medium, large
 */
const Badge = ({ 
  children, 
  variant = 'primary',
  size = 'medium',
  className = '',
  ...props 
}) => {
  const classes = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;
