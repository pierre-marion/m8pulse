import React, { useState, useEffect } from 'react';
import './BlogEditor.css';

function BlogEditor({ user, onBack }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    content: '',
    type: 'standard',
    status: 'published',
    game: 'valorant',
    featuredImageUrl: '',
    tags: ''
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/articles');
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Vous devez être connecté');
      return;
    }

    try {
      const url = editingArticle 
        ? `http://localhost:8000/api/articles/${editingArticle.id}`
        : 'http://localhost:8000/api/articles';
      
      const method = editingArticle ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert(editingArticle ? 'Article modifié!' : 'Article créé!');
        setShowForm(false);
        setEditingArticle(null);
        resetForm();
        fetchArticles();
      } else {
        const error = await response.json();
        alert('Erreur: ' + (error.message || 'Erreur inconnue'));
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur de connexion');
    }
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title || '',
      summary: article.summary || '',
      content: article.content || '',
      type: article.type || 'standard',
      status: article.status || 'published',
      game: article.game || 'valorant',
      featuredImageUrl: article.featuredImageUrl || '',
      tags: article.tags ? article.tags.join(', ') : ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cet article?')) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:8000/api/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Article supprimé!');
        fetchArticles();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      summary: '',
      content: '',
      type: 'standard',
      status: 'published',
      game: 'valorant',
      featuredImageUrl: '',
      tags: ''
    });
  };

  const getGameColor = (game) => {
    const colors = {
      'valorant': '#FF4655',
      'cs2': '#FF9F1C',
      'cod': '#8A2BE2',
      'general': '#667eea'
    };
    return colors[game] || '#667eea';
  };

  if (!user || !user.roles?.includes('ROLE_ADMIN')) {
    return (
      <div className="blog-editor">
        <div className="access-denied">
          <h2>Accès Refusé</h2>
          <p>Seuls les administrateurs peuvent créer des articles</p>
          <button onClick={onBack}>Retour</button>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-editor">
      <div className="editor-header">
        <div>
          <h1>Gestion des Articles</h1>
          <p>Créez et gérez vos articles de blog</p>
        </div>
        <div className="header-actions">
          <button className="btn-new" onClick={() => { setShowForm(true); setEditingArticle(null); resetForm(); }}>
            + Nouvel Article
          </button>
          {onBack && <button className="btn-back" onClick={onBack}>← Retour</button>}
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="editor-form-container" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowForm(false)}>✕</button>
            <h2>{editingArticle ? 'Modifier l\'Article' : 'Nouvel Article'}</h2>
            
            <form onSubmit={handleSubmit} className="article-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Titre *</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Titre de l'article"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Résumé *</label>
                  <textarea
                    name="summary"
                    value={formData.summary}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    placeholder="Court résumé de l'article"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contenu</label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows="10"
                    placeholder="Contenu complet de l'article (support Markdown)"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Jeu</label>
                  <select name="game" value={formData.game} onChange={handleInputChange}>
                    <option value="valorant">Valorant 🎯</option>
                    <option value="cs2">Counter-Strike 2 🔫</option>
                    <option value="cod">Call of Duty ⚔️</option>
                    <option value="general">Général ⭐</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="standard">Standard</option>
                    <option value="news">News</option>
                    <option value="analysis">Analyse</option>
                    <option value="interview">Interview</option>
                    <option value="data-story">Data Story</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Statut</label>
                  <select name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="published">Publié</option>
                    <option value="draft">Brouillon</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Image (URL)</label>
                  <input
                    type="url"
                    name="featuredImageUrl"
                    value={formData.featuredImageUrl}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tags (séparés par des virgules)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="esport, valorant, tournoi"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingArticle ? 'Mettre à jour' : 'Créer l\'article'}
                </button>
                <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="articles-list">
        {loading ? (
          <div className="loading">Chargement...</div>
        ) : articles.length === 0 ? (
          <div className="no-articles">
            <h3>Aucun article</h3>
            <p>Créez votre premier article!</p>
          </div>
        ) : (
          <div className="articles-grid">
            {articles.map(article => (
              <div 
                key={article.id} 
                className="article-card"
                style={{ '--game-color': getGameColor(article.game) }}
              >
                {article.featuredImageUrl && (
                  <div className="article-image" style={{ backgroundImage: `url(${article.featuredImageUrl})` }} />
                )}
                <div className="article-content">
                  <div className="article-meta">
                    <span className="article-game" style={{ background: getGameColor(article.game) }}>
                      {article.game}
                    </span>
                    <span className="article-type">{article.type}</span>
                    <span className={`article-status ${article.status}`}>{article.status}</span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  <div className="article-footer">
                    <span className="article-date">
                      {new Date(article.publishedAt || article.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <div className="article-actions">
                      <button className="btn-edit" onClick={() => handleEdit(article)}>✏️ Modifier</button>
                      <button className="btn-delete" onClick={() => handleDelete(article.id)}>🗑️ Supprimer</button>
                    </div>
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

export default BlogEditor;
