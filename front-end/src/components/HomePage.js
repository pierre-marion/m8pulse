import React, { useState, useEffect } from 'react';
import './HomePage.css';
import Icon from './Icon';
import { Button, StatCard, Loading } from './ui';
import { MatchCard, NewsCard, PlayerCard } from './cards';

function HomePage({ user }) {
  const [pastMatches, setPastMatches] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [topPlayers, setTopPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingNews, setLoadingNews] = useState(true);
  const [loadingPlayers, setLoadingPlayers] = useState(true);

  // IDs des Google Sheets
  const VALORANT_SHEET_ID = '1d6b3E3KEy1TwPRJgjvbgcrDrUbawUkHl9ckpNESyzeg';
  const COD_SHEET_ID = '1semtK-pmRquxyF88CjpjwmNpwhYezCHaWRKFkX90WkY';

  // Charger les matchs passés depuis Google Sheets
  useEffect(() => {
    fetchAllPastMatches();
    fetchLatestNews();
    fetchTopPlayers();
  }, []);

  const fetchTopPlayers = async () => {
    try {
      setLoadingPlayers(true);
      const allPlayers = [];

      // Récupérer les joueurs Valorant
      const valoResponse = await fetch(
        `http://localhost:8000/api/google-sheets/players/valorant?spreadsheetId=${VALORANT_SHEET_ID}`
      );
      const valoData = await valoResponse.json();
      if (valoData.success && valoData.players) {
        const valoPlayers = valoData.players.map(player => ({
          name: player.id,
          role: player.roleSpecific || 'Player',
          game: 'Valorant',
          statLabel: 'Rating',
          statValue: player.rating?.toFixed(2) || '0.00',
          sortValue: player.rating || 0,
          color: '#FF4655'
        }));
        allPlayers.push(...valoPlayers);
      }

      // Récupérer les joueurs CoD
      const codResponse = await fetch(
        `http://localhost:8000/api/google-sheets/players/cod?spreadsheetId=${COD_SHEET_ID}`
      );
      const codData = await codResponse.json();
      if (codData.success && codData.players) {
        const codPlayers = codData.players.map(player => ({
          name: player.id,
          role: player.roleSpecific || 'Player',
          game: 'CoD',
          statLabel: 'K/D',
          statValue: player.kdRatio?.toFixed(2) || '0.00',
          sortValue: player.kdRatio || 0,
          color: '#8A2BE2'
        }));
        allPlayers.push(...codPlayers);
      }

      // Prendre max 2 joueurs par jeu et trier par stats
      const valoTop = allPlayers
        .filter(p => p.game === 'Valorant')
        .sort((a, b) => b.sortValue - a.sortValue)
        .slice(0, 2);
      
      const codTop = allPlayers
        .filter(p => p.game === 'CoD')
        .sort((a, b) => b.sortValue - a.sortValue)
        .slice(0, 2);

      // Mélanger et limiter à 3 joueurs au total
      const top3 = [...valoTop, ...codTop].slice(0, 3);

      setTopPlayers(top3);
    } catch (error) {
      console.error('Erreur lors du chargement des joueurs:', error);
      setTopPlayers([]);
    } finally {
      setLoadingPlayers(false);
    }
  };

  const fetchLatestNews = async () => {
    try {
      setLoadingNews(true);
      const response = await fetch('http://localhost:8000/api/articles?limit=3&status=published');
      const articles = await response.json();
      
      if (articles && articles.length > 0) {
        const formattedNews = articles.map(article => ({
          id: article.id,
          category: article.type === 'news' ? 'NEWS' : 
                   article.type === 'analysis' ? 'ANALYSE' :
                   article.type === 'tutorial' ? 'TUTORIEL' : 'ARTICLE',
          title: article.title,
          excerpt: article.summary || 'Aucun résumé disponible',
          date: new Date(article.publishedAt).toLocaleDateString('fr-FR', { 
            day: 'numeric', 
            month: 'short', 
            year: 'numeric' 
          }),
          image: article.type === 'news' ? 'newspaper' : 
                 article.type === 'analysis' ? 'barChart' : 
                 article.type === 'tutorial' ? 'book' : 'file',
          color: article.game === 'valorant' ? '#FF4655' :
                 article.game === 'cs2' ? '#FF9F1C' :
                 article.game === 'cod' ? '#8A2BE2' :
                 article.game === 'fortnite' ? '#00AEEF' : '#7D3CFF',
          game: article.game
        }));
        setLatestNews(formattedNews);
      } else {
        // Fallback data si pas d'articles
        setLatestNews([
          {
            category: 'INFO',
            title: 'Bienvenue sur M8 Pulse',
            excerpt: 'Consultez les statistiques en temps réel de Gentle Mates',
            date: new Date().toLocaleDateString('fr-FR'),
            image: 'trophy',
            color: '#7D3CFF'
          }
        ]);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des actualités:', error);
      setLatestNews([]);
    } finally {
      setLoadingNews(false);
    }
  };

  const fetchAllPastMatches = async () => {
    try {
      setLoading(true);
      const allMatches = [];

      // Récupérer les matchs Valorant
      const valoResponse = await fetch(
        `http://localhost:8000/api/google-sheets/matches/valorant?spreadsheetId=${VALORANT_SHEET_ID}`
      );
      const valoData = await valoResponse.json();
      if (valoData.success && valoData.matches) {
        const valoMatches = valoData.matches.slice(0, 3).map(match => ({
          game: 'Valorant',
          gameIcon: 'target',
          team1: match.team || 'Gentle Mates',
          team2: match.opponent,
          score: match.score,
          date: match.date,
          tournament: match.tournament,
          win: match.win,
          color: '#FF4655'
        }));
        allMatches.push(...valoMatches);
      }

      // Récupérer les matchs CoD
      const codResponse = await fetch(
        `http://localhost:8000/api/google-sheets/matches/cod?spreadsheetId=${COD_SHEET_ID}`
      );
      const codData = await codResponse.json();
      if (codData.success && codData.matches) {
        const codMatches = codData.matches.slice(0, 3).map(match => ({
          game: 'Call of Duty',
          gameIcon: 'shield',
          team1: match.team || 'Gentle Mates',
          team2: match.opponent,
          score: match.score,
          date: match.date,
          tournament: match.tournament,
          win: match.win,
          color: '#8A2BE2'
        }));
        allMatches.push(...codMatches);
      }

      // Mélanger et limiter à 4 matchs
      setPastMatches(allMatches.slice(0, 4));
    } catch (error) {
      console.error('Erreur lors du chargement des matchs:', error);
      setPastMatches([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <div className="home-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">M8 PULSE</h1>
          <p className="hero-subtitle">Statistiques Esport en Temps Réel</p>
          <div className="hero-tags">
            <span className="hero-tag"><Icon name="chart" size={16} /> Stats Avancées</span>
            <span className="hero-tag"><Icon name="trophy" size={16} /> Compétitions Pro</span>
            <span className="hero-tag"><Icon name="trendingUp" size={16} /> Analyse Détaillée</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="quick-stats">
        <StatCard
          icon="gamepad"
          value="4"
          label="Jeux"
          color="#7D3CFF"
        />
        <StatCard
          icon="users"
          value="50+"
          label="Joueurs"
          color="#7D3CFF"
        />
        <StatCard
          icon="barChart"
          value="1000+"
          label="Matchs"
          color="#7D3CFF"
        />
        <StatCard
          icon="trophy"
          value="15"
          label="Trophées"
          color="#7D3CFF"
        />
      </div>

      {/* Main Content Grid */}
      <div className="home-content">
        {/* Matchs Passés */}
        <div className="content-section results-section">
          <div className="section-header">
            <h2 className="section-title-home"><Icon name="trendingUp" size={24} /> Matchs Passés</h2>
            <Button variant="ghost" size="small" icon="arrowRight" iconRight>
              Voir tout
            </Button>
          </div>
          {loading ? (
            <Loading text="Chargement des matchs..." />
          ) : (
            <div className="results-list-home">
              {pastMatches.length > 0 ? (
                pastMatches.map((match, index) => (
                  <MatchCard
                    key={index}
                    {...match}
                  />
                ))
              ) : (
                <div className="no-matches-message">Aucun match disponible</div>
              )}
            </div>
          )}
        </div>

        {/* Actualités */}
        <div className="content-section news-section-home">
          <div className="section-header">
            <h2 className="section-title-home"><Icon name="newspaper" size={24} /> Dernières Actualités</h2>
            <Button variant="ghost" size="small" icon="arrowRight" iconRight>
              Voir tout
            </Button>
          </div>
          {loadingNews ? (
            <Loading text="Chargement des actualités..." />
          ) : (
            <div className="news-grid-home">
              {latestNews.length > 0 ? (
                latestNews.map((news, index) => (
                  <NewsCard
                    key={news.id || index}
                    {...news}
                  />
                ))
              ) : (
                <div className="no-matches-message">Aucune actualité disponible</div>
              )}
            </div>
          )}
        </div>

        {/* Featured Players */}
        <div className="content-section featured-section">
          <div className="section-header">
            <h2 className="section-title-home"><Icon name="star" size={24} /> Joueurs en Forme</h2>
          </div>
          {loadingPlayers ? (
            <Loading text="Chargement des joueurs..." />
          ) : (
            <div className="featured-players">
              {topPlayers.length > 0 ? (
                topPlayers.map((player, index) => (
                  <PlayerCard
                    key={index}
                    {...player}
                  />
                ))
              ) : (
                <div className="no-matches-message">Aucun joueur disponible</div>
              )}
            </div>
          )}
        </div>

        {/* Section Stats Avancées - Uniquement pour Silver, Gold et Admin */}
        {user && (user.subscriptionLevel === 'silver' || user.subscriptionLevel === 'gold' || user.roles?.includes('ROLE_ADMIN')) && (
          <div className="content-section premium-section">
            <div className="section-header">
              <h2 className="section-title-home">
                <Icon name="barChart" size={24} /> 
                Statistiques Avancées 
                <span className="premium-badge">
                  {user.subscriptionLevel === 'gold' ? '👑 GOLD' : '⭐ SILVER'}
                </span>
              </h2>
            </div>
            <div className="premium-stats-grid">
              <div className="premium-stat-card">
                <div className="premium-stat-header">
                  <Icon name="trendingUp" size={32} color="#FFD700" />
                  <h3>Win Rate Global</h3>
                </div>
                <div className="premium-stat-value">68.5%</div>
                <div className="premium-stat-trend positive">+5.2% ce mois</div>
              </div>
              
              <div className="premium-stat-card">
                <div className="premium-stat-header">
                  <Icon name="target" size={32} color="#FF4655" />
                  <h3>Performance Moyenne</h3>
                </div>
                <div className="premium-stat-value">1.42</div>
                <div className="premium-stat-trend positive">Rating moyen</div>
              </div>
              
              <div className="premium-stat-card">
                <div className="premium-stat-header">
                  <Icon name="trophy" size={32} color="#7D3CFF" />
                  <h3>Matchs Joués</h3>
                </div>
                <div className="premium-stat-value">156</div>
                <div className="premium-stat-trend">Cette saison</div>
              </div>
              
              {user.subscriptionLevel === 'gold' && (
                <div className="premium-stat-card gold-exclusive">
                  <div className="premium-stat-header">
                    <Icon name="star" size={32} color="#FFD700" />
                    <h3>MVP du Mois</h3>
                  </div>
                  <div className="premium-stat-value">
                    {topPlayers.length > 0 ? topPlayers[0].name : 'N/A'}
                  </div>
                  <div className="premium-stat-trend gold">Exclusif Gold</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CTA Section - Masqué pour Admin et Gold uniquement */}
      {(!user || (user.subscriptionLevel !== 'gold' && !user.roles?.includes('ROLE_ADMIN'))) && (
        <div className="cta-section">
          <h2 className="cta-title">Débloquez toutes les statistiques</h2>
          <p className="cta-text">Accédez aux analyses avancées, heatmaps et timelines avec nos abonnements Silver et Gold</p>
          <Button variant="primary" size="large" icon="star">
            Voir les Abonnements
          </Button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
