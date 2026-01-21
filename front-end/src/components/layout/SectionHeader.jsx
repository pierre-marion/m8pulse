import React from 'react';
import './SectionHeader.css';

/**
 * Composant SectionHeader réutilisable pour les en-têtes de section
 * @param {string} title - titre de la section
 * @param {string} icon - icône (optionnel)
 * @param {ReactNode} action - bouton d'action (optionnel)
 */
const SectionHeader = ({ 
  title,
  icon,
  action,
  children,
  className = '',
  ...props 
}) => {
  return (
    <div className={`section-header ${className}`} {...props}>
      <h2 className="section-title">
        {icon && <span className="section-icon">{icon}</span>}
        {title || children}
      </h2>
      {action && <div className="section-action">{action}</div>}
    </div>
  );
};

export default SectionHeader;
