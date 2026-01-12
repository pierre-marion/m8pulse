import React, { useState, useEffect, useCallback } from 'react';
import './ArticleDetail.css';
import StatsChart from './StatsChart';
import Icon from './Icon';

function ArticleDetail({ articleId, onBack }) {
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  // Mémoriser les fonctions de fetch pour éviter les re-renders
  const fetchArticle = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/articles/${articleId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('📄 Article chargé:', data);
        console.log('🎨 Blocs de l\'article:', data.blocks);
        setArticle(data);
      } else {
        if (onBack) onBack();
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'article:', error);
    } finally {
      setLoading(false);
    }
  }, [articleId, onBack]);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/comments/article/${articleId}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commentaires:', error);
    }
  }, [articleId]);

  const fetchUserRating = useCallback(async () => {
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
  }, [articleId]);

  useEffect(() => {
    if (articleId) {
      fetchArticle();
      fetchComments();
      fetchUserRating();
    }
  }, [articleId, fetchArticle, fetchComments, fetchUserRating]);

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
          averageRating: data.average_rating || 0
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
    const iconMap = {
      valorant: 'target',
      cs2: 'crosshair',
      cod: 'shield',
      fortnite: 'gamepad',
      general: 'star'
    };
    return iconMap[game] || iconMap.general;
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
            <span className={`badge badge-type badge-${article.type}`}>
              {article.type === 'standard' && <><Icon name="fileText" size={14} /> Standard</>}
              {article.type === 'data-story' && <><Icon name="barChart" size={14} /> Data Story</>}
              {article.type === 'analysis' && <><Icon name="search" size={14} /> Analyse</>}
              {article.type === 'interview' && <><Icon name="newspaper" size={14} /> Interview</>}
              {article.type === 'news' && <><Icon name="newspaper" size={14} /> News</>}
            </span>
            <span 
              className="badge badge-game" 
              style={{ backgroundColor: getGameColor(article.game) }}
            >
              <Icon name={getGameEmoji(article.game)} size={14} /> {article.game?.toUpperCase() || 'GÉNÉRAL'}
            </span>
          </div>
          
          <h1 className="article-title">{article.title}</h1>
          
          {article.summary && (
            <p className="article-summary">{article.summary}</p>
          )}
        </header>

        {/* Contenu de l'article */}
        <div className="article-main-content">
          {article.blocks && article.blocks.length > 0 ? (
            article.blocks.map((block, index) => {
              if (block.type === 'title') {
                const TitleTag = block.titleLevel || 'h2';
                return (
                  <TitleTag key={index} className={`article-block-title ${TitleTag}`}>
                    {block.content}
                  </TitleTag>
                );
              } else if (block.type === 'image') {
                return (
                  <div key={index} className="article-block-image">
                    <img src={block.content} alt="" />
                  </div>
                );
              } else if (block.type === 'text') {
                return (
                  <div key={index} className="article-block-text">
                    {block.content}
                  </div>
                );
              } else if (block.type === 'stats') {
                try {
                  const statsData = JSON.parse(block.content);
                  return (
                    <div key={index} className="article-block-stats">
                      <StatsChart data={statsData} vizType={block.vizType || 'table'} />
                    </div>
                  );
                } catch (e) {
                  return null;
                }
              }
              return null;
            })
          ) : (
            <div className="article-placeholder">
              <p>Contenu de l'article en construction...</p>
            </div>
          )}
        </div>

        {/* Infos article */}
        <div className="article-meta">
          <span className="meta-item">
            {article.author?.username || 'Anonyme'}
          </span>
          <span className="meta-item">
            {new Date(article.publishedAt || article.createdAt).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </span>
          <span className="meta-item">
            {article.viewCount || 0} vues
          </span>
        </div>

        {/* Section notes et commentaires côte à côte */}
        <div className="bottom-section">
          {/* Section de notation */}
          <div className="rating-section">
            <h2 className="section-title">Notes</h2>
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
              <p>Notez cet article</p>
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

          {/* Section des commentaires */}
          <div className="comments-section">
            <h2 className="section-title">
              Commentaires ({article.commentCount || comments.length})
            </h2>

            {/* Formulaire de nouveau commentaire */}
            <form onSubmit={handleSubmitComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Votre avis..."
                rows="3"
                disabled={submittingComment}
              />
              <button 
                type="submit" 
                className="btn-submit-comment"
                disabled={submittingComment || newComment.trim() === ''}
              >
                {submittingComment ? 'Envoi...' : 'Publier'}
              </button>
            </form>

            {/* Liste des commentaires */}
            <div className="comments-list">
              {comments.length === 0 ? (
                <div className="no-comments">
                  Aucun commentaire
                </div>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-card">
                    <div className="comment-header">
                      <span className="comment-author">
                        {comment.authorName || 'Anonyme'}
                      </span>
                      <span className="comment-date">
                        {new Date(comment.createdAt).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </div>
                    <div className="comment-content">
                      {comment.content}
                    </div>
                    {localStorage.getItem('token') && (
                      <button
                        className="btn-delete-comment"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}

export default ArticleDetail;
