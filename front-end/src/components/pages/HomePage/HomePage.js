import React, { useState, useEffect } from 'react';
import './HomePage.css';
import Icon from '../../common/Icon/Icon';
import { Button, Loading } from '../../ui';
import { NewsCard } from '../../cards';

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

  // Charger les données au montage
  useEffect(() => {
    fetchAllPastMatches();
    fetchLatestNews();
    fetchTopPlayers();
  }, []);

  // --- DATA FETCHING ---
  const fetchTopPlayers = async () => {
    try {
      setLoadingPlayers(true);
      const allPlayers = [];

      const valoResponse = await fetch(`http://localhost:8000/api/google-sheets/players/valorant?spreadsheetId=${VALORANT_SHEET_ID}`);
      const valoData = await valoResponse.json();
      if (valoData.success && valoData.players) {
        allPlayers.push(...valoData.players.map(p => ({
          name: p.id,
          role: p.roleSpecific || 'Player',
          game: 'Valorant',
          statLabel: 'Rating',
          statValue: p.rating?.toFixed(2) || '0.00',
          sortValue: p.rating || 0,
          color: '#FF4655'
        })));
      }

      const codResponse = await fetch(`http://localhost:8000/api/google-sheets/players/cod?spreadsheetId=${COD_SHEET_ID}`);
      const codData = await codResponse.json();
      if (codData.success && codData.players) {
        allPlayers.push(...codData.players.map(p => ({
          name: p.id,
          role: p.roleSpecific || 'Player',
          game: 'CoD',
          statLabel: 'K/D',
          statValue: p.kdRatio?.toFixed(2) || '0.00',
          sortValue: p.kdRatio || 0,
          color: '#8A2BE2'
        })));
      }

      setTopPlayers(allPlayers.sort((a, b) => b.sortValue - a.sortValue).slice(0, 3));
    } catch (error) {
      console.error('Erreur joueurs:', error);
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
        setLatestNews(articles.map(article => ({
          id: article.id,
          category: article.type === 'news' ? 'NEWS' : article.type === 'analysis' ? 'ANALYSE' : 'ARTICLE',
          title: article.title,
          excerpt: article.summary || 'Lire la suite...',
          date: new Date(article.publishedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' }),
          image: article.type === 'news' ? 'newspaper' : article.type === 'analysis' ? 'barChart' : 'file',
          color: article.game === 'valorant' ? '#FF4655' : article.game === 'cod' ? '#8A2BE2' : '#7D3CFF',
          game: article.game
        })));
      } else {
        setLatestNews([{
          category: 'INFO', title: 'Bienvenue sur M8 Pulse', excerpt: 'Le hub de statistiques Gentle Mates.',
          date: 'Aujourd\'hui', image: 'trophy', color: '#7D3CFF'
        }]);
      }
    } catch (error) {
      console.error('Erreur news:', error);
      setLatestNews([]);
    } finally {
      setLoadingNews(false);
    }
  };

  const fetchAllPastMatches = async () => {
    try {
      setLoading(true);
      const allMatches = [];

      const valoResponse = await fetch(`http://localhost:8000/api/google-sheets/matches/valorant?spreadsheetId=${VALORANT_SHEET_ID}`);
      const valoData = await valoResponse.json();
      if (valoData.success && valoData.matches) {
        allMatches.push(...valoData.matches.map(m => ({
          game: 'Valorant', gameIcon: 'target', team1: m.team || 'M8', team2: m.opponent,
          score: m.score, date: m.date, tournament: m.tournament, win: m.win, color: '#FF4655'
        })));
      }

      const codResponse = await fetch(`http://localhost:8000/api/google-sheets/matches/cod?spreadsheetId=${COD_SHEET_ID}`);
      const codData = await codResponse.json();
      if (codData.success && codData.matches) {
        allMatches.push(...codData.matches.map(m => ({
          game: 'Call of Duty', gameIcon: 'shield', team1: m.team || 'M8', team2: m.opponent,
          score: m.score, date: m.date, tournament: m.tournament, win: m.win, color: '#8A2BE2'
        })));
      }

      setPastMatches(allMatches.slice(0, 6)); // Top 6
    } catch (error) {
      console.error('Erreur matchs:', error);
      setPastMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const isPremium = user && (user.subscriptionLevel === 'silver' || user.subscriptionLevel === 'gold' || user.roles?.includes('ROLE_ADMIN'));
  
  const lastMatch = pastMatches[0];

  return (
    <div className="home-dashboard-v2">
      
      {/* HEADER SIMPLE */}
      <header className="dashboard-header">
        <div>
          <h1>M8 PULSE</h1>
          <p className="subtitle">Hub de Performance & Statistiques</p>
        </div>
        <div className="header-stats">
          <div className="h-stat"><span className="val">68%</span><span className="lbl">Win Rate</span></div>
          <div className="h-stat"><span className="val">1,024</span><span className="lbl">Matchs</span></div>
        </div>
      </header>

      <div className="dashboard-layout">
        
        {/* COLONNE GAUCHE : CONTENU PRINCIPAL */}
        <div className="main-feed">
          
          {/* Hero News */}
          <section className="feed-section">
            <div className="section-title">
              <Icon name="newspaper" size={20} color="#7D3CFF" /> 
              <h2>À la une</h2>
            </div>
            {loadingNews ? <Loading /> : latestNews[0] && (
              <div className="hero-news-card" style={{borderTopColor: latestNews[0].color}}>
                <div className="hero-news-content">
                  <div className="news-badges">
                    <span className="n-tag" style={{background: latestNews[0].color}}>{latestNews[0].game || 'M8'}</span>
                    <span className="n-date">{latestNews[0].date}</span>
                  </div>
                  <h3>{latestNews[0].title}</h3>
                  <p>{latestNews[0].excerpt}</p>
                  <Button variant="ghost" icon="arrowRight" iconRight>Lire l'article</Button>
                </div>
                <div className="hero-news-visual">
                  <Icon name={latestNews[0].image} size={64} color={latestNews[0].color} />
                </div>
              </div>
            )}
            
            {/* Secondary News Grid */}
            <div className="secondary-news-grid">
              {latestNews.slice(1).map((news, i) => (
                <NewsCard key={i} {...news} className="compact-news" />
              ))}
            </div>
          </section>

          {/* Premium Section Banner */}
          <section className={`premium-banner-v2 ${isPremium ? 'is-unlocked' : ''}`}> 
             <div className="pb-content">
               <div className="pb-icon"><Icon name="barChart" size={32} /></div>
               <div className="pb-text">
                 <h3>Stats Avancées {isPremium ? '(Débloqué)' : '(Verrouillé)'}</h3>
                 <p>Heatmaps, Analyse de rounds, VOD Review.</p>
               </div>
               {!isPremium && <Button variant="primary" size="small">S'abonner</Button>}
             </div>
          </section>

        </div>

        {/* COLONNE DROITE : MATCH CENTER (SIDEBAR) */}
        <aside className="sidebar-feed">
          
          {/* 1. LAST MATCH SPOTLIGHT - SIMPLIFIED */}
          <div className="sidebar-widget match-spotlight">
             <div className="widget-header">
               <h3><Icon name="trophy" size={16} /> DERNIER RÉSULTAT</h3>
             </div>
             
             {loading ? <Loading /> : lastMatch ? (
               <div className="match-card-featured">
                 <div className="mcf-header">
                    <span className="mcf-badge" style={{background: lastMatch.color}}>{lastMatch.game}</span>
                    <span className="mcf-date">{lastMatch.date}</span>
                 </div>
                 
                 <div className="mcf-body">
                    <div className="mcf-team">
                      <span className="mcf-team-name">{lastMatch.team1}</span>
                    </div>
                    <div className="mcf-score">
                      {lastMatch.score}
                    </div>
                    <div className="mcf-team">
                      <span className="mcf-team-name">{lastMatch.team2}</span>
                    </div>
                 </div>

                 <div className={`mcf-result ${lastMatch.win ? 'win' : 'loss'}`}>
                    {lastMatch.win ? 'VICTOIRE' : 'DÉFAITE'}
                 </div>
               </div>
             ) : (
               <div className="empty-widget">Aucun match</div>
             )}
          </div>

          {/* 2. RECENT MATCHES LIST */}
          <div className="sidebar-widget match-history">
            <div className="widget-header">
              <h3>Historique</h3>
            </div>
            <div className="history-list">
              {pastMatches.slice(1, 6).map((match, i) => (
                <div key={i} className="history-item">
                   <div className="h-status" style={{background: match.win ? '#4CAF50' : '#FF4655'}}></div>
                   <div className="h-info">
                     <span className="h-teams">{match.team1} vs {match.team2}</span>
                     <span className="h-meta">{match.game}</span>
                   </div>
                   <div className="h-score">{match.score}</div>
                </div>
              ))}
            </div>
            <Button variant="ghost" size="small" className="w-full">Voir tout l\'historique</Button>
          </div>

        </aside>

      </div>
    </div>
  );
}

export default HomePage;