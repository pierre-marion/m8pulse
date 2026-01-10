import React, { useState, useEffect } from 'react';
import './Header.css';

function Header({ currentPage, setCurrentPage, user }) {
  const [navItems, setNavItems] = useState([
    { id: 'accueil', label: 'Acceuil' },
    { id: 'jeux', label: 'Jeux' },
    { id: 'equipe', label: 'Equipe' },
    { id: 'joueurs', label: 'Joueurs' },
    { id: 'abonnement', label: 'Abonnement' },
    { id: 'news', label: 'News' }
  ]);

  // Charger l'ordre personnalisé depuis localStorage
  useEffect(() => {
    const loadNavOrder = () => {
      const savedOrder = localStorage.getItem('navOrder');
      if (savedOrder) {
        try {
          setNavItems(JSON.parse(savedOrder));
        } catch (error) {
          console.error('Erreur lors du chargement de l\'ordre du navbar:', error);
        }
      }
    };

    loadNavOrder();

    // Écouter les changements d'ordre
    window.addEventListener('navOrderChanged', loadNavOrder);
    
    return () => {
      window.removeEventListener('navOrderChanged', loadNavOrder);
    };
  }, []);

  return (
    <header className="header">
      <div className="logo">
        <img src="/m8logo.png" alt="M8 Logo" className="header-logo-image" />
      </div>
      <nav className="nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => setCurrentPage(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

export default Header;
