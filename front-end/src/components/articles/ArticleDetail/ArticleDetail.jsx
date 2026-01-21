import React, { useState, useEffect, useCallback } from 'react';
import './ArticleDetail.css';
import StatsChart from '../../visualizations/StatsChart/StatsChart';
import Icon from '../../common/Icon/Icon';
import ArticleBlockRenderer from '../ArticleBlockRenderer/ArticleBlockRenderer';
import { useDarkMode } from '../../../contexts/DarkModeContext';

function ArticleDetail({ articleId, onBack }) {
  const { isDarkMode } = useDarkMode();
  
  // State local pour forcer le re-render
  const [localDarkMode, setLocalDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  
  // Écouter les changements du localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const newValue = localStorage.getItem('darkMode') === 'true';
      console.log('💾 Storage changed:', newValue);
      setLocalDarkMode(newValue);
    };
    
    // Écouter les changements
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier périodiquement (fallback pour changements locaux)
    const interval = setInterval(() => {
      const currentValue = localStorage.getItem('darkMode') === 'true';
      if (currentValue !== localDarkMode) {
        setLocalDarkMode(currentValue);
      }
    }, 100);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [localDarkMode]);
  
  // Fallback sur localStorage si le contexte ne fonctionne pas
  const effectiveDarkMode = isDarkMode ?? localDarkMode;
  
  console.log('🎨 ArticleDetail - isDarkMode (context):', isDarkMode);
  console.log('🎨 ArticleDetail - localStorage:', localStorage.getItem('darkMode'));
  console.log('🎨 ArticleDetail - localDarkMode:', localDarkMode);
  console.log('🎨 ArticleDetail - effective:', effectiveDarkMode);
  
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRating, setUserRating] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [templateVersion, setTemplateVersion] = useState(0);
  const [darkModeKey, setDarkModeKey] = useState(0);

  // Force re-render quand le dark mode change
  useEffect(() => {
    console.log('🔄 Dark mode changé:', effectiveDarkMode);
    setDarkModeKey(prev => prev + 1);
  }, [effectiveDarkMode]);

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

  // Charger et appliquer le thème de l'article
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Essayer de charger le thème spécifique à l'article
        const response = await fetch(`http://localhost:8000/api/themes?scope=article&targetId=${articleId}`);
        if (response.ok) {
          const themes = await response.json();
          if (themes.length > 0 && themes[0].styles) {
            applyArticleTheme(themes[0].styles);
          }
        }
      } catch (error) {
        console.error('Erreur chargement thème:', error);
      }
    };

    if (articleId) {
      loadTheme();
    }
  }, [articleId]);

  // Fonction pour appliquer les styles du thème
  const applyArticleTheme = (styles) => {
    // Ne pas appliquer le thème si le dark mode est actif
    if (effectiveDarkMode) {
      console.log('🌙 Dark mode actif, thème article ignoré');
      return;
    }
    
    const root = document.documentElement;
    
    // Appliquer les couleurs et polices du texte d'article
    if (styles.articleText) {
      if (styles.articleText.color) {
        root.style.setProperty('--article-text-color', styles.articleText.color);
      }
      if (styles.articleText.fontSize) {
        root.style.setProperty('--article-text-size', styles.articleText.fontSize);
      }
      if (styles.articleText.fontFamily) {
        root.style.setProperty('--article-text-font', styles.articleText.fontFamily);
      }
      if (styles.articleText.lineHeight) {
        root.style.setProperty('--article-text-line-height', styles.articleText.lineHeight);
      }
    }

    // Appliquer les autres styles (titre, fond, etc.)
    if (styles.title) {
      if (styles.title.color) root.style.setProperty('--article-title-color', styles.title.color);
      if (styles.title.fontSize) root.style.setProperty('--article-title-size', styles.title.fontSize);
      if (styles.title.fontWeight) root.style.setProperty('--article-title-weight', styles.title.fontWeight);
    }
    
    if (styles.article) {
      if (styles.article.bg) root.style.setProperty('--article-bg-color', styles.article.bg);
      if (styles.article.borderRadius) root.style.setProperty('--article-border-radius', styles.article.borderRadius);
    }
  };

  // Écouter les changements de template depuis le DesignPanel
  useEffect(() => {
    const handleTemplateChange = () => {
      setTemplateVersion(prev => prev + 1);
    };

    window.addEventListener('articleTemplateChanged', handleTemplateChange);
    return () => window.removeEventListener('articleTemplateChanged', handleTemplateChange);
  }, []);

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
    <div className={`article-detail ${effectiveDarkMode ? 'dark-mode' : ''}`}>
      <button className="btn-back" onClick={onBack}>
        ← Retour aux news
      </button>

      <article className="article-content-wrapper">
        <header 
          className="article-header"
          style={article.coverImage ? {
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url(http://localhost:8000${article.coverImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          } : {}}
        >
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
          {/* Utiliser le ArticleBlockRenderer pour appliquer le template personnalisé du designer */}
          <ArticleBlockRenderer 
            blocks={article.blocks || []} 
            article={article}
            key={templateVersion}
          />
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
