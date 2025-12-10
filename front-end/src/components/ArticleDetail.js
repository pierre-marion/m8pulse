import React, { useState, useEffect } from 'react';
import './ArticleDetail.css';

function ArticleDetail({ articleId, onBack }) {
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  useEffect(() => {
    if (articleId) {
      fetchArticle();
      fetchComments();
      fetchUserRating();
    }
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/articles/${articleId}`);
      if (response.ok) {
        const data = await response.json();
        setArticle(data);
      } else {
        if (onBack) onBack();
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/comments/article/${articleId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  };

  const fetchUserRating = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:8000/api/ratings/article/${articleId}/user`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserRating(data.stars);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la note:', error);
    }
  };

  const handleRating = async (stars) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Vous devez être connecté pour noter un article');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/ratings/article/${articleId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ stars })
      });

      if (response.ok) {
        const data = await response.json();
        setUserRating(stars);
        // Mettre à jour les stats de l'article
        setArticle(prev => ({
          ...prev,
          averageRating: data.rating.average,
          ratingCount: data.rating.count
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la notation:', error);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      alert('Vous devez être connecté pour commenter');
      return;
    }

    if (newComment.trim() === '') {
      return;
    }

    setSubmittingComment(true);

    try {
      const response = await fetch('http://localhost:8000/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          articleId: parseInt(articleId),
          content: newComment
        })
      });

      if (response.ok) {
        setNewComment('');
        fetchComments();
        // Mettre à jour le compteur de commentaires
        setArticle(prev => ({
          ...prev,
          commentCount: (prev.commentCount || 0) + 1
        }));
      } else {
        alert('Erreur lors de l\'envoi du commentaire');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'envoi du commentaire');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Voulez-vous supprimer ce commentaire ?')) {
      return;
    }

    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`http://localhost:8000/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchComments();
        setArticle(prev => ({
          ...prev,
          commentCount: Math.max(0, (prev.commentCount || 0) - 1)
        }));
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getGameColor = (game) => {
    const colors = {
      valorant: '#ff4655',
      cs2: '#f5a623',
      cod: '#00d957',
      fortnite: '#00d1ff',
      general: '#8b8b8b'
    };
    return colors[game] || colors.general;
  };

  const getGameEmoji = (game) => {
    const emojis = {
      valorant: '🎯',
      cs2: '🔫',
      cod: '🎮',
      fortnite: '🏗️',
      general: '⭐'
    };
    return emojis[game] || emojis.general;
  };

  if (loading) {
    return <div className="article-detail-loading">Chargement...</div>;
  }

  if (!article) {
    return <div className="article-detail-error">Article non trouvé</div>;
  }

  return (
    <div className="article-detail">
      <button className="btn-back" onClick={onBack}>
        ← Retour aux news
      </button>

      <article className="article-content-wrapper">
        <header className="article-header">
          <div className="article-badges">
            <span 
              className="badge badge-game" 
              style={{ backgroundColor: getGameColor(article.game) }}
            >
              {getGameEmoji(article.game)} {article.game?.toUpperCase() || 'GÉNÉRAL'}
            </span>
            <span className={`badge badge-type badge-${article.type}`}>
              {article.type === 'standard' && '📄 Standard'}
              {article.type === 'data-story' && '📊 Data Story'}
              {article.type === 'analysis' && '🔍 Analyse'}
              {article.type === 'interview' && '🎤 Interview'}
              {article.type === 'news' && '📰 News'}
            </span>
          </div>
          
          <h1 className="article-title">{article.title}</h1>
          
          {article.summary && (
            <p className="article-summary">{article.summary}</p>
          )}
          
          <div className="article-meta">
            <span className="meta-item">
              👤 {article.author?.username || 'Anonyme'}
            </span>
            <span className="meta-item">
              📅 {new Date(article.publishedAt || article.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
            <span className="meta-item">
              👁️ {article.viewCount || 0} vues
            </span>
          </div>
        </header>

        {/* Section de notation */}
        <div className="article-rating-section">
          <div className="rating-container">
            <div className="rating-stats">
              <div className="average-rating">
                {article.averageRating ? article.averageRating.toFixed(1) : '0.0'}
              </div>
              <div className="rating-stars-display">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={star <= Math.round(article.averageRating || 0) ? 'star filled' : 'star'}
                  >
                    ★
                  </span>
                ))}
              </div>
              <div className="rating-count">
                {article.ratingCount || 0} {(article.ratingCount || 0) > 1 ? 'notes' : 'note'}
              </div>
            </div>
            
            <div className="rating-input">
              <p>Notez cet article :</p>
              <div className="rating-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    className={`star-button ${star <= (hoveredStar || userRating || 0) ? 'active' : ''}`}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => handleRating(star)}
                  >
                    ★
                  </button>
                ))}
              </div>
              {userRating && (
                <p className="user-rating-text">Votre note : {userRating}/5</p>
              )}
            </div>
          </div>
        </div>

        {/* Contenu de l'article */}
        <div className="article-main-content">
          {article.blocks && article.blocks.length > 0 ? (
            article.blocks.map((block, index) => (
              <div key={index} className="article-block">
                {block.content}
              </div>
            ))
          ) : (
            <div className="article-placeholder">
              <p>Contenu de l'article en construction...</p>
            </div>
          )}
        </div>

        {/* Section des commentaires */}
        <div className="comments-section">
          <h2 className="comments-title">
            💬 Commentaires ({article.commentCount || comments.length})
          </h2>

          {/* Formulaire de nouveau commentaire */}
          <form onSubmit={handleSubmitComment} className="comment-form">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Partagez votre avis sur cet article..."
              rows="4"
              disabled={submittingComment}
            />
            <button 
              type="submit" 
              className="btn-submit-comment"
              disabled={submittingComment || newComment.trim() === ''}
            >
              {submittingComment ? 'Envoi...' : '📤 Publier le commentaire'}
            </button>
          </form>

          {/* Liste des commentaires */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">
                Soyez le premier à commenter cet article ! 🎉
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="comment-card">
                  <div className="comment-header">
                    <span className="comment-author">
                      👤 {comment.authorName || 'Anonyme'}
                    </span>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {comment.isEdited && ' (modifié)'}
                    </span>
                  </div>
                  <div className="comment-content">
                    {comment.content}
                  </div>
                  {/* Bouton de suppression pour l'auteur ou admin */}
                  {localStorage.getItem('token') && (
                    <button
                      className="btn-delete-comment"
                      onClick={() => handleDeleteComment(comment.id)}
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

export default ArticleDetail;
