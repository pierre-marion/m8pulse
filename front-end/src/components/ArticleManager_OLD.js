import React, { useState, useEffect } from 'react';
import './ArticleManager.css';
import ArticleEditor from './ArticleEditor';

function ArticleManager({ user }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState(null);

  useEffect(() => {
    fetchArticles();
  }, []);

  const checkAuthentication = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!token && !!user);
    
    if (!token) {
      console.warn('⚠️ Aucun token JWT trouvé. Vous devez vous connecter pour créer des articles.');
    } else {
      console.log('✅ Utilisateur authentifié');
      try {
        const userData = JSON.parse(user);
        console.log('👤 Utilisateur:', userData.username, '- Rôles:', userData.roles);
      } catch (e) {
        console.error('Erreur parsing user data');
      }
    }
  };

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

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('❌ Vous devez être connecté pour créer un article.\n\nConnectez-vous avec :\nEmail: admin@m8pulse.com\nMot de passe: admin123');
      return;
    }

    console.log('🔑 Token présent:', token ? 'Oui' : 'Non');
    console.log('📝 Données envoyées:', formData);

    try {
      const url = editingArticle 
        ? `http://localhost:8000/api/articles/${editingArticle.id}`
        : 'http://localhost:8000/api/articles';
      
      const method = editingArticle ? 'PUT' : 'POST';

      console.log(`🌐 Requête ${method} vers:`, url);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('📊 Status de la réponse:', response.status);

      if (response.ok) {
        alert(editingArticle ? '✅ Article modifié avec succès !' : '✅ Article créé avec succès !');
        setShowForm(false);
        setEditingArticle(null);
        setFormData({
          title: '',
          summary: '',
          type: 'standard',
          status: 'published',
          game: 'valorant'
        });
        fetchArticles();
      } else {
        const error = await response.json();
        console.error('❌ Erreur API:', error);
        console.error('Status:', response.status);
        
        let errorMessage = 'Erreur lors de la sauvegarde';
        if (response.status === 401) {
          errorMessage = '🔒 Non autorisé. Veuillez vous reconnecter.\n\nEmail: admin@m8pulse.com\nMot de passe: admin123';
        } else if (error.message) {
          errorMessage = error.message;
        } else if (error.error) {
          errorMessage = error.error;
        }
        
        alert(errorMessage);
      }
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('⚠️ Erreur de connexion au serveur. Vérifiez que le backend est bien démarré.');
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      summary: article.summary || '',
      type: article.type || 'standard',
      status: article.status || 'published',
      game: article.game || 'valorant'
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:8000/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Article supprimé avec succès !');
        fetchArticles();
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression de l\'article');
    }
  };

  const cancelEdit = () => {
    setShowForm(false);
    setEditingArticle(null);
    setFormData({
      title: '',
      summary: '',
      type: 'standard',
      status: 'published',
      game: 'valorant'
    });
  };

  return (
    <div className="article-manager">
      <div className="manager-header">
        <h2>📰 Gestion des Articles</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {!isAuthenticated && (
            <div style={{ 
              color: '#ff4655', 
              fontSize: '14px', 
              fontWeight: '600',
              padding: '8px 16px',
              background: 'rgba(255, 70, 85, 0.1)',
              borderRadius: '8px',
              border: '2px solid rgba(255, 70, 85, 0.3)'
            }}>
              🔒 Non connecté - Connectez-vous pour créer des articles
            </div>
          )}
          {isAuthenticated && (
            <div style={{ 
              color: '#4ade80', 
              fontSize: '14px', 
              fontWeight: '600',
              padding: '8px 16px',
              background: 'rgba(74, 222, 128, 0.1)',
              borderRadius: '8px',
              border: '2px solid rgba(74, 222, 128, 0.3)'
            }}>
              ✅ Connecté en tant qu'Admin
            </div>
          )}
          <button 
            className="btn-create-article"
            onClick={() => setShowForm(!showForm)}
            disabled={!isAuthenticated}
            style={!isAuthenticated ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
          >
            {showForm ? '❌ Annuler' : '✏️ Nouvel Article'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="article-form-container">
          <h3>{editingArticle ? '✏️ Modifier l\'article' : '➕ Créer un nouvel article'}</h3>
          <form onSubmit={handleSubmit} className="article-form">
            <div className="form-row">
              <div className="form-group">
                <label>Titre *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Titre de l'article"
                  required
                />
              </div>

              <div className="form-group">
                <label>Jeu</label>
                <select name="game" value={formData.game} onChange={handleInputChange}>
                  <option value="valorant">🎯 Valorant</option>
                  <option value="cs2">🔫 CS2</option>
                  <option value="cod">🎮 COD</option>
                  <option value="fortnite">🏗️ Fortnite</option>
                  <option value="general">⭐ Général</option>
                </select>
              </div>

              <div className="form-group">
                <label>Type</label>
                <select name="type" value={formData.type} onChange={handleInputChange}>
                  <option value="standard">Standard</option>
                  <option value="data-story">Data Story</option>
                  <option value="analysis">Analyse</option>
                  <option value="interview">Interview</option>
                  <option value="announcement">Annonce</option>
                </select>
              </div>

              <div className="form-group">
                <label>Statut</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="draft">Brouillon</option>
                  <option value="review">En relecture</option>
                  <option value="published">Publié</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Résumé</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                placeholder="Résumé de l'article (optionnel)..."
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={cancelEdit} className="btn-cancel">
                Annuler
              </button>
              <button type="submit" className="btn-submit">
                {editingArticle ? '💾 Modifier' : '✨ Créer l\'article'}
              </button>
            </div>
          </form>
        </div>
      )}

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
                      {article.type === 'announcement' && '📢 Annonce'}
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
                      onClick={() => handleEdit(article)}
                      className="btn-edit"
                    >
                      ✏️ Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(article.id)}
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
    </div>
  );
}

export default ArticleManager;
