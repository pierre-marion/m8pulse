import React from 'react';
import './HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <div className="home-hero">
        <div className="hero-content">
          <h1 className="hero-title">BIENVENUE SUR M8 PULSE</h1>
          <p className="hero-subtitle">Suivez les performances de vos équipes esport favorites</p>
          <div className="hero-stats">
            <div className="stat-box">
              <div className="stat-number">4</div>
              <div className="stat-label">Jeux Suivis</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">12</div>
              <div className="stat-label">Équipes</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">50+</div>
              <div className="stat-label">Joueurs</div>
            </div>
          </div>
        </div>
      </div>

      <div className="home-sections">
        <div className="section-card">
          <div className="section-icon">🎮</div>
          <h2 className="section-title">NOS JEUX</h2>
          <p className="section-description">
            Valorant, Counter Strike, Call of Duty et Fortnite - suivez toutes nos équipes compétitives
          </p>
        </div>

        <div className="section-card">
          <div className="section-icon">👥</div>
          <h2 className="section-title">NOS ÉQUIPES</h2>
          <p className="section-description">
            Des rosters de niveau international avec des performances régulières en compétition
          </p>
        </div>

        <div className="section-card">
          <div className="section-icon">📰</div>
          <h2 className="section-title">ACTUALITÉS</h2>
          <p className="section-description">
            Restez informé des derniers résultats, interviews et actualités de nos équipes
          </p>
        </div>
      </div>

      <div className="home-highlights">
        <h2 className="highlights-title">DERNIERS RÉSULTATS</h2>
        <div className="highlights-grid">
          <div className="highlight-card">
            <div className="highlight-game">VALORANT - VCT</div>
            <div className="highlight-result">
              <span className="team-name">M8 Esports</span>
              <span className="score win">2-0</span>
              <span className="team-name">Vitality</span>
            </div>
            <div className="highlight-date">27 Novembre 2025</div>
          </div>

          <div className="highlight-card">
            <div className="highlight-game">COUNTER STRIKE - ESL</div>
            <div className="highlight-result">
              <span className="team-name">M8 Esports</span>
              <span className="score">1-2</span>
              <span className="team-name">FaZe Clan</span>
            </div>
            <div className="highlight-date">25 Novembre 2025</div>
          </div>

          <div className="highlight-card">
            <div className="highlight-game">CALL OF DUTY - CDL</div>
            <div className="highlight-result">
              <span className="team-name">M8 Esports</span>
              <span className="score win">3-1</span>
              <span className="team-name">OpTic Gaming</span>
            </div>
            <div className="highlight-date">23 Novembre 2025</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
