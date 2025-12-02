import React from 'react';
import './Header.css';

function Header({ currentPage, setCurrentPage }) {
  return (
    <header className="header">
      <div className="logo">
        <div className="logo-circle">
          <span className="logo-text">M8</span>
        </div>
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
        <button className="nav-btn">Joueur</button>
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
