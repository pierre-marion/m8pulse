import React from 'react';
import './HomePage.css';

function HomePage() {
  const upcomingMatches = [
    {
      game: 'Valorant',
      gameIcon: '🎯',
      team1: 'Gentle Mates',
      team2: 'Fnatic',
      date: '5 Déc',
      time: '18:00',
      tournament: 'VCT EMEA',
      color: '#FF4655'
    },
    {
      game: 'Counter Strike',
      gameIcon: '🔫',
      team1: 'Gentle Mates',
      team2: 'G2 Esports',
      date: '6 Déc',
      time: '20:00',
      tournament: 'ESL Pro League',
      color: '#FF9F1C'
    },
    {
      game: 'Call of Duty',
      gameIcon: '💣',
      team1: 'Gentle Mates',
      team2: 'OpTic Gaming',
      date: '7 Déc',
      time: '19:30',
      tournament: 'CDL Major',
      color: '#8A2BE2'
    }
  ];

  const recentResults = [
    {
      game: 'Valorant',
      team1: 'Gentle Mates',
      score: '2-1',
      team2: 'Team Vitality',
      date: '28 Nov',
      win: true,
      color: '#FF4655'
    },
    {
      game: 'Counter Strike',
      team1: 'Gentle Mates',
      score: '16-14',
      team2: 'G2 Esports',
      date: '27 Nov',
      win: true,
      color: '#FF9F1C'
    },
    {
      game: 'Call of Duty',
      team1: 'Gentle Mates',
      score: '3-2',
      team2: 'FaZe Clan',
      date: '26 Nov',
      win: false,
      color: '#8A2BE2'
    },
    {
      game: 'Fortnite',
      team1: 'Gentle Mates',
      score: '1st',
      team2: 'FNCS Finals',
      date: '25 Nov',
      win: true,
      color: '#00AEEF'
    }
  ];

  const latestNews = [
    {
      category: 'TRANSFERT',
      title: 'Minny rejoint Gentle Mates',
      excerpt: 'Le dueliste star signe pour 2 ans avec l\'équipe Valorant',
      date: '1 Déc 2025',
      image: '🔥',
      color: '#FF4655'
    },
    {
      category: 'VICTOIRE',
      title: 'Gentle Mates remporte le VCT',
      excerpt: 'Performance exceptionnelle en finale contre Fnatic',
      date: '28 Nov 2025',
      image: '🏆',
      color: '#4CAF50'
    },
    {
      category: 'INTERVIEW',
      title: 'JaCkz : "On vise le top 10"',
      excerpt: 'L\'AWPer revient sur la saison et les objectifs 2025',
      date: '25 Nov 2025',
      image: '🎤',
      color: '#7D3CFF'
    }
  ];

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">M8 PULSE</h1>
          <p className="hero-subtitle">Statistiques Esport en Temps Réel</p>
          <div className="hero-tags">
            <span className="hero-tag">📊 Stats Avancées</span>
            <span className="hero-tag">🏆 Compétitions Pro</span>
            <span className="hero-tag">📈 Analyse Détaillée</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">🎮</div>
          <div className="stat-info">
            <div className="stat-value">4</div>
            <div className="stat-label">Jeux</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-info">
            <div className="stat-value">50+</div>
            <div className="stat-label">Joueurs</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-info">
            <div className="stat-value">1000+</div>
            <div className="stat-label">Matchs</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏆</div>
          <div className="stat-info">
            <div className="stat-value">15</div>
            <div className="stat-label">Trophées</div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="home-content">
        {/* Prochains Matchs */}
        <div className="content-section upcoming-section">
          <div className="section-header">
            <h2 className="section-title-home">🗓️ Prochains Matchs</h2>
            <button className="view-all-btn">Voir tout →</button>
          </div>
          <div className="matches-list-home">
            {upcomingMatches.map((match, index) => (
              <div key={index} className="match-card-home upcoming" style={{ borderLeftColor: match.color }}>
                <div className="match-game-badge" style={{ backgroundColor: match.color }}>
                  {match.gameIcon} {match.game}
                </div>
                <div className="match-teams-home">
                  <span className="team-name-home">{match.team1}</span>
                  <span className="vs-text">VS</span>
                  <span className="team-name-home">{match.team2}</span>
                </div>
                <div className="match-info-home">
                  <span className="match-date-home">📅 {match.date}</span>
                  <span className="match-time">🕐 {match.time}</span>
                  <span className="match-tournament-home">{match.tournament}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Résultats Récents */}
        <div className="content-section results-section">
          <div className="section-header">
            <h2 className="section-title-home">📈 Résultats Récents</h2>
            <button className="view-all-btn">Voir tout →</button>
          </div>
          <div className="results-list-home">
            {recentResults.map((result, index) => (
              <div key={index} className={`result-card-home ${result.win ? 'win' : 'loss'}`} style={{ borderLeftColor: result.color }}>
                <div className="result-status" style={{ backgroundColor: result.win ? '#4CAF50' : '#FF6B7A' }}>
                  {result.win ? '✓ VICTOIRE' : '✗ DÉFAITE'}
                </div>
                <div className="result-teams">
                  <span className="result-team">{result.team1}</span>
                  <span className="result-score">{result.score}</span>
                  <span className="result-team">{result.team2}</span>
                </div>
                <div className="result-footer">
                  <span className="result-game">{result.game}</span>
                  <span className="result-date">{result.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actualités */}
        <div className="content-section news-section-home">
          <div className="section-header">
            <h2 className="section-title-home">📰 Dernières Actualités</h2>
            <button className="view-all-btn">Voir tout →</button>
          </div>
          <div className="news-grid-home">
            {latestNews.map((news, index) => (
              <div key={index} className="news-card-home">
                <div className="news-image-placeholder" style={{ backgroundColor: news.color }}>
                  <span className="news-emoji">{news.image}</span>
                </div>
                <div className="news-content-home">
                  <span className="news-category-home" style={{ color: news.color }}>
                    {news.category}
                  </span>
                  <h3 className="news-title-home">{news.title}</h3>
                  <p className="news-excerpt">{news.excerpt}</p>
                  <div className="news-footer-home">
                    <span className="news-date-home">{news.date}</span>
                    <button className="read-more-btn">Lire →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Players */}
        <div className="content-section featured-section">
          <div className="section-header">
            <h2 className="section-title-home">⭐ Joueurs en Forme</h2>
          </div>
          <div className="featured-players">
            <div className="featured-player">
              <div className="player-avatar-home">M</div>
              <div className="player-info-home">
                <h4>Minny</h4>
                <span className="player-role-home">Duelist</span>
              </div>
              <div className="player-stat-home">
                <span className="stat-label-home">K/D</span>
                <span className="stat-value-home">1.56</span>
              </div>
            </div>
            <div className="featured-player">
              <div className="player-avatar-home">J</div>
              <div className="player-info-home">
                <h4>JaCkz</h4>
                <span className="player-role-home">AWPer</span>
              </div>
              <div className="player-stat-home">
                <span className="stat-label-home">Rating</span>
                <span className="stat-value-home">1.31</span>
              </div>
            </div>
            <div className="featured-player">
              <div className="player-avatar-home">H</div>
              <div className="player-info-home">
                <h4>HyDra</h4>
                <span className="player-role-home">SMG</span>
              </div>
              <div className="player-stat-home">
                <span className="stat-label-home">K/D</span>
                <span className="stat-value-home">1.42</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <h2 className="cta-title">Débloquez toutes les statistiques</h2>
        <p className="cta-text">Accédez aux analyses avancées, heatmaps et timelines avec nos abonnements Pro et Elite</p>
        <button className="cta-button">Voir les Abonnements 👑</button>
      </div>
    </div>
  );
}

export default HomePage;
