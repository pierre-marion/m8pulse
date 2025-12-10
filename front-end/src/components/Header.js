import React from 'react';
import './Header.css';

function Header({ currentPage, setCurrentPage, user }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="/m8logo.png" alt="M8 Logo" className="header-logo-image" />
      </div>
      <nav className="nav">
        <button 
          className={`nav-btn ${currentPage === 'accueil' ? 'active' : ''}`}
          onClick={() => setCurrentPage('accueil')}
        >
          Acceuil
        </button>
        <button 
          className={`nav-btn ${currentPage === 'jeux' ? 'active' : ''}`}
          onClick={() => setCurrentPage('jeux')}
        >
          Jeux
        </button>
        <button 
          className={`nav-btn ${currentPage === 'equipe' ? 'active' : ''}`}
          onClick={() => setCurrentPage('equipe')}
        >
          Equipe
        </button>
        <button 
          className={`nav-btn ${currentPage === 'abonnement' ? 'active' : ''}`}
          onClick={() => setCurrentPage('abonnement')}
        >
          Abonnement
        </button>
        <button 
          className={`nav-btn ${currentPage === 'news' ? 'active' : ''}`}
          onClick={() => setCurrentPage('news')}
        >
          News
        </button>
      </nav>
      <div className="header-user">
        {user ? (
          <button 
            className="user-button"
            onClick={() => setCurrentPage('profile')}
          >
            <span className="user-avatar">{user.username.charAt(0).toUpperCase()}</span>
            <span className="user-name">{user.username}</span>
            {user.roles?.includes('ROLE_ADMIN') && <span className="admin-crown">👑</span>}
          </button>
        ) : (
          <button 
            className="login-button"
            onClick={() => setCurrentPage('login')}
          >
            Se connecter
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
