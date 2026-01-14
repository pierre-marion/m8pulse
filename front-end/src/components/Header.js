import React, { useState, useEffect } from 'react';
import './Header.css';
import Icon from './Icon';

function Header({ currentPage, setCurrentPage, user, onLogout, onLoginClick, onRegisterClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteLogo, setSiteLogo] = useState(localStorage.getItem('siteLogo') || '/m8logo.png');
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

    const loadLogo = () => {
      const savedLogo = localStorage.getItem('siteLogo');
      if (savedLogo) {
        setSiteLogo(savedLogo);
      } else {
        setSiteLogo('/m8logo.png');
      }
    };

    loadNavOrder();
    loadLogo();

    // Écouter les changements d'ordre et de logo
    window.addEventListener('navOrderChanged', loadNavOrder);
    window.addEventListener('logoChanged', loadLogo);
    
    return () => {
      window.removeEventListener('navOrderChanged', loadNavOrder);
      window.removeEventListener('logoChanged', loadLogo);
    };
  }, []);

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false); // Fermer le menu mobile après navigation
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src={siteLogo} alt="M8 Logo" className="header-logo-image" />
      </div>
      
      {/* Menu hamburger (mobile) */}
      <button 
        className={`hamburger ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Navigation */}
      <nav className={`nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${currentPage === item.id ? 'active' : ''}`}
            onClick={() => handleNavClick(item.id)}
          >
            {item.label}
          </button>
        ))}
        
        {/* Section utilisateur dans le menu mobile */}
        <div className="nav-user-section">
          {user ? (
            <>
              <button 
                className="nav-user-btn"
                onClick={() => handleNavClick('profile')}
              >
                <span className="user-avatar-mobile">
                  {user.username?.charAt(0).toUpperCase() || <Icon name="user" size={16} />}
                </span>
                <span className="user-info-mobile">
                  <span className="user-name-mobile">{user.username}</span>
                  {user.roles?.includes('ROLE_ADMIN') && <span className="user-badge-mobile"><Icon name="star" size={14} /> Admin</span>}
                  {!user.roles?.includes('ROLE_ADMIN') && user.roles?.includes('ROLE_EDITOR') && <span className="user-badge-mobile"><Icon name="edit" size={14} /> Éditeur</span>}
                  {!user.roles?.includes('ROLE_ADMIN') && user.roles?.includes('ROLE_PROVIDER') && <span className="user-badge-mobile"><Icon name="database" size={14} /> Provider</span>}
                </span>
              </button>
              <button 
                className="nav-logout-btn"
                onClick={handleLogoutClick}
              >
                <Icon name="logOut" size={16} /> Se déconnecter
              </button>
            </>
          ) : (
            <>
              <button 
                className="nav-login-btn"
                onClick={onLoginClick}
              >
                <Icon name="key" size={16} /> Se connecter
              </button>
              <button 
                className="nav-register-btn"
                onClick={onRegisterClick}
              >
                <Icon name="sparkles" size={16} /> S'inscrire
              </button>
            </>
          )}
        </div>
      </nav>
      
      {/* Overlay pour fermer le menu mobile */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}

export default Header;
