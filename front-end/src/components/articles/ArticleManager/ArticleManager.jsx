import React, { useState, useEffect } from 'react';
import './ArticleManager.css';
import ArticleEditor from '../ArticleEditor/ArticleEditor';

function ArticleManager({ user }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/articles');
      const data = await response.json();
      setArticles(data);
    } catch (error) {
      console.error('Erreur lors du chargement des articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateArticle = () => {
    setEditingArticleId(null);
    setShowEditor(true);
  };

  const handleEditArticle = (articleId) => {
    setEditingArticleId(articleId);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingArticleId(null);
    fetchArticles(); // Recharger la liste
  };

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer cet article ?')) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('✅ Article supprimé avec succès !');
        fetchArticles();
      } else {
        alert('❌ Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la suppression');
    }
  };

  const isAuthenticated = user && (user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('ROLE_EDITOR'));

  return (
    <div className="article-manager">
      <div className="manager-header">
        <h2>📰 Gestion des Articles</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isAuthenticated && (
            <div style={{ 
              color: '#f44336', 
              fontSize: '0.875rem', 
              fontWeight: '600',
              padding: '0.5rem 1rem',
              background: 'rgba(244, 67, 54, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(244, 67, 54, 0.2)'
            }}>
              🔒 Connexion requise
            </div>
          )}
          {isAuthenticated && (
            <div style={{ 
              color: '#4CAF50', 
              fontSize: '0.875rem', 
              fontWeight: '600',
              padding: '0.5rem 1rem',
              background: 'rgba(76, 175, 80, 0.1)',
              borderRadius: '10px',
              border: '1px solid rgba(76, 175, 80, 0.2)'
            }}>
              ✅ {user.roles?.includes('ROLE_ADMIN') ? 'Admin' : 'Éditeur'}
            </div>
          )}
          <button 
            className="btn-create-article"
            onClick={handleCreateArticle}
            disabled={!isAuthenticated}
            style={!isAuthenticated ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            ✨ Nouvel Article
          </button>
        </div>
      </div>

      <div className="articles-list">
        <h3>📋 Articles existants ({articles.length})</h3>
        
        {loading ? (
          <div className="loading">Chargement des articles...</div>
        ) : articles.length === 0 ? (
          <div className="no-articles">
            <p>Aucun article pour le moment.</p>
            <p>Créez votre premier article en cliquant sur "Nouvel Article" !</p>
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map((article) => (
              <div key={article.id} className="article-card">
                <div className="article-content">
                  <div className="article-badges">
                    <span className={`badge badge-type badge-${article.type}`}>
                      {article.type === 'standard' && '📄 Standard'}
                      {article.type === 'data-story' && '📊 Data Story'}
                      {article.type === 'analysis' && '🔍 Analyse'}
                      {article.type === 'interview' && '🎤 Interview'}
                      {article.type === 'news' && '📰 News'}
                    </span>
                    <span className={`badge badge-status badge-${article.status}`}>
                      {article.status === 'draft' && '✏️ Brouillon'}
                      {article.status === 'review' && '👁️ Relecture'}
                      {article.status === 'published' && '✅ Publié'}
                    </span>
                  </div>
                  <h4>{article.title}</h4>
                  <p className="article-excerpt">
                    {article.summary || 'Pas de résumé'}
                  </p>
                  <div className="article-meta">
                    <span className="article-author">
                      👤 {article.author?.username || 'Inconnu'}
                    </span>
                    <span className="article-date">
                      📅 {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="article-views">
                      👁️ {article.viewCount || 0} vues
                    </span>
                  </div>
                  <div className="article-actions">
                    <button 
                      onClick={() => handleEditArticle(article.id)}
                      className="btn-edit"
                    >
                      ✏️ Modifier
                    </button>
                    <button 
                      onClick={() => handleDeleteArticle(article.id)}
                      className="btn-delete"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showEditor && (
        <ArticleEditor 
          user={user}
          articleId={editingArticleId}
          onBack={handleCloseEditor}
          onSave={handleCloseEditor}
        />
      )}
    </div>
  );
}

export default ArticleManager;
