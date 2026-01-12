import React, { useState, useEffect } from 'react';
import './DashboardPageNew.css';
import Icon from './Icon';

function DashboardPage({ currentGame }) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscribers: 0,
    totalArticles: 0,
    totalViews: 0
  });
  const [topArticles, setTopArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const statsResponse = await fetch('http://localhost:8000/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsResponse.ok) {
        const data = await statsResponse.json();
        setStats(data);
      }

      const articlesResponse = await fetch('http://localhost:8000/api/articles');
      if (articlesResponse.ok) {
        const articles = await articlesResponse.json();
        setTopArticles(articles.slice(0, 5));
      }

      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-icon" style={{ background: color }}>
        <Icon name={icon} size={24} color="white" />
      </div>
      <div className="stat-details">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {trend && <div className="stat-trend" style={{ color }}>{trend}</div>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">Chargement du dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard Admin</h1>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="stats-grid">
        <StatCard 
          title="Utilisateurs Total"
          value={stats.totalUsers}
          icon="users"
          color="#667eea"
          trend="+12% ce mois"
        />
        <StatCard 
          title="Abonnés Actifs"
          value={stats.activeSubscribers}
          icon="star"
          color="#f093fb"
          trend="+8% ce mois"
        />
        <StatCard 
          title="Articles Publiés"
          value={stats.totalArticles}
          icon="edit"
          color="#764ba2"
          trend="+5 cette semaine"
        />
        <StatCard 
          title="Vues Totales"
          value={stats.totalViews}
          icon="trendingUp"
          color="#f5576c"
          trend="+28% ce mois"
        />
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Articles Populaires</h2>
            <button className="btn-view-all">Voir tout</button>
          </div>
          <div className="articles-list">
            {topArticles.map(article => (
              <div key={article.id} className="article-item">
                <div className="article-info">
                  <div className="article-title-dash">{article.title}</div>
                  <div className="article-meta-dash">
                    <span className="meta-badge">{article.game}</span>
                    <span className="meta-date">{new Date(article.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <div className="article-stats-dash">
                  <div className="stat-item-dash">
                    <span className="stat-icon-dash">👁️</span>
                    <span>{article.viewCount || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Répartition Jeux</h2>
          </div>
          <div className="games-distribution">
            <div className="game-bar">
              <div className="game-label">
                <span><Icon name="target" size={16} /> Valorant</span>
                <span>45%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '45%', background: '#FF4655' }}></div>
              </div>
            </div>
            <div className="game-bar">
              <div className="game-label">
                <span><Icon name="crosshair" size={16} /> CS2</span>
                <span>30%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '30%', background: '#FF9F1C' }}></div>
              </div>
            </div>
            <div className="game-bar">
              <div className="game-label">
                <span>💣 COD</span>
                <span>25%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '25%', background: '#8A2BE2' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section full-width">
        <div className="section-header">
          <h2>Actions Rapides</h2>
        </div>
        <div className="quick-actions">
          <button className="action-card">
            <span className="action-icon"><Icon name="users" size={32} color="#7D3CFF" /></span>
            <span className="action-label">Gérer Utilisateurs</span>
          </button>
          <button className="action-card">
            <span className="action-icon"><Icon name="edit" size={32} color="#7D3CFF" /></span>
            <span className="action-label">Nouvel Article</span>
          </button>
          <button className="action-card">
            <span className="action-icon"><Icon name="database" size={32} color="#7D3CFF" /></span>
            <span className="action-label">Dataset Manager</span>
          </button>
          <button className="action-card">
            <span className="action-icon"><Icon name="palette" size={32} color="#7D3CFF" /></span>
            <span className="action-label">Theme Designer</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
