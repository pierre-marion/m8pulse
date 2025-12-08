import React from 'react';
import './Header.css';

function Header({ currentPage, setCurrentPage }) {
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
    </header>
  );
}

export default Header;
