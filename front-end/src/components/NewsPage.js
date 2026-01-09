import React, { useState, useEffect, useMemo } from 'react';
import './NewsPage.css';

// Cache simple pour les articles (évite de refetch à chaque rendu)
let articlesCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function NewsPage({ onArticleClick, user, onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedGame, setSelectedGame] = useState('Tous');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    // Vérifier si on a un cache valide
    const now = Date.now();
    if (articlesCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
      setArticles(articlesCache);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/articles?status=published');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
        // Mettre en cache
        articlesCache = data;
        cacheTimestamp = now;
      }
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Tous', 'standard', 'news', 'analysis', 'interview', 'data-story'];
  const games = ['Tous', 'valorant', 'cs2', 'cod', 'general'];

  const getTypeLabel = (type) => {
    const labels = {
      'standard': 'Standard',
      'data-story': 'Data Story',
      'analysis': 'Analyse',
      'interview': 'Interview',
      'news': 'News'
    };
    return labels[type] || 'Article';
  };

  const getGameLabel = (game) => {
    const labels = {
      'valorant': 'Valorant',
      'cs2': 'CS2',
      'cod': 'COD',
      'fortnite': 'Fortnite',
      'general': 'Général'
    };
    return labels[game] || 'Général';
  };

  // Mémoriser le filtrage pour éviter de recalculer à chaque render
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const categoryMatch = selectedCategory === 'Tous' || article.type === selectedCategory;
      const gameMatch = selectedGame === 'Tous' || article.game === selectedGame;
      return categoryMatch && gameMatch;
    });
  }, [articles, selectedCategory, selectedGame]);

  const getCategoryColor = (type) => {
    const colors = {
      'standard': '#4CAF50',
      'interview': '#FF9800',
      'analysis': '#2196F3',
      'data-story': '#E91E63',
      'news': '#9C27B0'
    };
    return colors[type] || '#7D3CFF';
  };

  const getGameColor = (game) => {
    const colors = {
      'cs2': '#FF9F1C',
      'valorant': '#FF4655',
      'cod': '#8A2BE2',
      'fortnite': '#00AEEF',
      'general': '#7D3CFF'
    };
    return colors[game] || '#7D3CFF';
  };

  const getGameEmoji = (game) => {
    const emojis = {
      'valorant': '🎯',
      'cs2': '🔫',
      'cod': '🎮',
      'fortnite': '🏗️',
      'general': '⭐'
    };
    return emojis[game] || '⭐';
  };

  if (loading) {
    return (
      <div className="news-page">
        <div className="loading-news">Chargement des articles...</div>
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="news-page-header">
        <div>
          <h1 className="news-page-title">Blog & Actualités</h1>
          <p className="news-page-subtitle">Découvrez les dernières actualités eSport</p>
        </div>
        {user && user.roles?.includes('ROLE_ADMIN') && (
          <button 
            className="btn-manage-articles"
            onClick={() => onNavigate && onNavigate('blog-editor')}
          >
            ✏️ Gérer les Articles
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="news-filters">
        <div className="filter-group">
          <label className="filter-label">Type :</label>
          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat === 'Tous' ? 'Tous' : getTypeLabel(cat)}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Jeu :</label>
          <div className="filter-buttons">
            {games.map(game => (
              <button
                key={game}
                className={`filter-btn game-filter ${selectedGame === game ? 'active' : ''}`}
                onClick={() => setSelectedGame(game)}
                style={selectedGame === game ? { borderColor: getGameColor(game), color: getGameColor(game) } : {}}
              >
                {game === 'Tous' ? 'Tous' : `${getGameEmoji(game)} ${getGameLabel(game)}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles réguliers */}
      <div className="regular-section">
        <div className="articles-grid-news">
          {filteredArticles.map(article => (
            <div 
              key={article.id} 
              className="article-card-news"
              onClick={() => onArticleClick && onArticleClick(article.id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="article-image-news">
                <div className="article-emoji-news">{getGameEmoji(article.game)}</div>
                <div className="article-overlay">
                  <span className="badge-category-small" style={{ backgroundColor: getCategoryColor(article.type) }}>
                    {getTypeLabel(article.type)}
                  </span>
                  <span className="badge-game-small" style={{ backgroundColor: getGameColor(article.game) }}>
                    {getGameLabel(article.game)}
                  </span>
                </div>
              </div>
              <div className="article-content-news">
                <h3 className="article-title-news">{article.title}</h3>
                <p className="article-excerpt-news">{article.summary || 'Cliquez pour lire l\'article complet'}</p>
                <div className="article-meta-news">
                  <div className="meta-row">
                    <span className="meta-item-news">
                      📅 {new Date(article.publishedAt || article.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="meta-item-news">👁️ {article.viewCount || 0} vues</span>
                  </div>
                  <div className="meta-row">
                    <span className="meta-author">✍️ {article.author?.username || 'Anonyme'}</span>
                    {article.averageRating > 0 && (
                      <span className="meta-rating">⭐ {article.averageRating.toFixed(1)}</span>
                    )}
                  </div>
                </div>
                {article.commentCount > 0 && (
                  <div className="article-stats">
                    💬 {article.commentCount} {article.commentCount > 1 ? 'commentaires' : 'commentaire'}
                  </div>
                )}
                <button className="read-more-news-btn">Lire la suite →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message si aucun article */}
      {filteredArticles.length === 0 && (
        <div className="no-articles">
          <div className="no-articles-icon">📭</div>
          <h3>Aucun article trouvé</h3>
          <p>Essayez de modifier vos filtres pour voir plus d'articles</p>
        </div>
      )}
    </div>
  );
}

export default NewsPage;
