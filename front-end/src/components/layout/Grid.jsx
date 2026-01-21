import React from 'react';
import './Grid.css';

/**
 * Composant Grid réutilisable pour afficher des grilles de contenu
 * @param {number} columns - nombre de colonnes (1-4)
 * @param {string} gap - espacement entre les éléments
 * @param {string} minWidth - largeur minimale des éléments
 */
const Grid = ({ 
  children,
  columns = 3,
  gap = '1.5rem',
  minWidth = '300px',
  className = '',
  ...props 
}) => {
  const style = {
    display: 'grid',
    gridTemplateColumns: `repeat(auto-fill, minmax(min(${minWidth}, 100%), 1fr))`,
    gap: gap,
  };

  return (
    <div 
      className={`grid ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

export default Grid;
