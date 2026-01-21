import React, { useState, useEffect } from 'react';
import './ArticleEditor.css';

function ArticleEditor({ user, articleId, onBack, onSave }) {
  const [article, setArticle] = useState({
    title: '',
    summary: '',
    type: 'news',
    game: 'general',
    status: 'published',
    blocks: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableDatasets, setAvailableDatasets] = useState([]);

  useEffect(() => {
    if (articleId) {
      loadArticle();
    }
    loadAvailableDatasets();
  }, [articleId]);

  const loadAvailableDatasets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/datasets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setAvailableDatasets(data);
      }
    } catch (err) {
      console.error('Erreur chargement datasets:', err);
    }
  };

  const loadArticle = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/articles/${articleId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        
        // Parser les données des blocs stats si elles sont en string JSON
        if (data.blocks) {
          data.blocks = data.blocks.map(block => {
            if (block.type === 'stats' && block.content && typeof block.content === 'string') {
              try {
                return { ...block, content: JSON.parse(block.content) };
              } catch (e) {
                console.error('Erreur parsing stats content:', e);
                return block;
              }
            }
            return block;
          });
        }
        
        setArticle(data);
      }
    } catch (err) {
      console.error('Erreur chargement article:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      const url = articleId 
        ? `http://localhost:8000/api/articles/${articleId}`
        : 'http://localhost:8000/api/articles';
      
      // Préparer les données pour l'envoi
      const articleToSave = {
        ...article,
        blocks: article.blocks.map(block => {
          if (block.type === 'stats' && block.content && Array.isArray(block.content)) {
            return { ...block, content: JSON.stringify(block.content) };
          }
          return block;
        })
      };
      
      const response = await fetch(url, {
        method: articleId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(articleToSave)
      });

      if (response.ok) {
        const saved = await response.json();
        // Retourner automatiquement à la liste après sauvegarde
        if (onSave) {
          onSave(saved);
        } else if (onBack) {
          onBack();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de la sauvegarde');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const addBlock = (type) => {
    const newBlock = { 
      type, 
      content: '', 
      position: article.blocks.length 
    };
    
    // Ajouter le type de visualisation par défaut pour les stats
    if (type === 'stats') {
      newBlock.vizType = 'table'; // table, radar, bar, line
    }
    
    setArticle({
      ...article,
      blocks: [...article.blocks, newBlock]
    });
  };

  const updateBlock = (index, content) => {
    const newBlocks = [...article.blocks];
    newBlocks[index].content = content;
    setArticle({ ...article, blocks: newBlocks });
  };

  const updateBlockData = (index, data) => {
    const newBlocks = [...article.blocks];
    newBlocks[index] = { ...newBlocks[index], ...data };
    setArticle({ ...article, blocks: newBlocks });
  };

  const handleImageUpload = async (index, file) => {
    if (!file) return;
    
    // Pour l'instant, on convertit l'image en base64
    const reader = new FileReader();
    reader.onloadend = () => {
      updateBlock(index, reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleStatsUpload = async (index, file) => {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      // Parser CSV
      const rows = text.split('\n').map(row => row.split(',').map(cell => cell.trim()));
      updateBlockData(index, { 
        content: rows, // Stocker directement l'objet, pas la string JSON
        fileName: file.name 
      });
    };
    reader.readAsText(file);
  };

  const handleDatasetSelection = async (index, datasetId) => {
    console.log('🔄 Sélection dataset:', datasetId, 'pour block index:', index);
    
    if (!datasetId) {
      updateBlockData(index, { 
        datasetId: null,
        content: '',
        fileName: null 
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      console.log('📡 Fetching dataset:', `http://localhost:8000/api/datasets/${datasetId}`);
      
      const response = await fetch(`http://localhost:8000/api/datasets/${datasetId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const dataset = await response.json();
        console.log('✅ Dataset reçu:', dataset);
        console.log('📊 Dataset.data type:', typeof dataset.data);
        console.log('📊 Dataset.data:', dataset.data);
        
        // Si dataset.data est déjà un tableau, on le stringifie, sinon on laisse tel quel
        let content = '';
        if (Array.isArray(dataset.data)) {
          content = JSON.stringify(dataset.data);
          console.log('✅ Content stringifié (longueur):', content.length);
        } else if (typeof dataset.data === 'string') {
          content = dataset.data;
          console.log('✅ Content string (longueur):', content.length);
        }
        
        updateBlockData(index, { 
          datasetId: dataset.id,
          content,
          fileName: dataset.name 
        });
        console.log('✅ Block mis à jour avec dataset:', dataset.id);
      } else {
        const errorText = await response.text();
        console.error('❌ Erreur API:', response.status, errorText);
      }
    } catch (err) {
      console.error('❌ Erreur chargement dataset:', err);
    }
  };

  const removeBlock = (index) => {
    const newBlocks = article.blocks.filter((_, i) => i !== index);
    setArticle({ ...article, blocks: newBlocks });
  };

  const moveBlock = (index, direction) => {
    const newBlocks = [...article.blocks];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < newBlocks.length) {
      [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
      setArticle({ ...article, blocks: newBlocks });
    }
  };

  if (!user || (!user.roles?.includes('ROLE_ADMIN') && !user.roles?.includes('ROLE_EDITOR'))) {
    return (
      <div className="article-editor-container">
        <div className="no-permission">
          <h2>❌ Accès refusé</h2>
          <p>Vous n'avez pas les permissions pour créer des articles</p>
          <button onClick={onBack} className="btn-back">Retour</button>
        </div>
      </div>
    );
  }

  return (
    <div className="article-editor-overlay" onClick={onBack}>
      <div className="article-editor-popup" onClick={(e) => e.stopPropagation()}>
        <div className="editor-header">
          <h1>
            {articleId ? 'Modifier l\'article' : 'Nouvel article'} <span>(BLOCS)</span>
          </h1>
          <button onClick={onBack} className="btn-close">✕</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="article-form">
          <div className="form-group">
            <label>Titre *</label>
            <input
              type="text"
              value={article.title}
              onChange={(e) => setArticle({ ...article, title: e.target.value })}
              placeholder="Titre de l'article"
              required
            />
          </div>

        <div className="form-group">
          <label>Résumé</label>
          <textarea
            value={article.summary}
            onChange={(e) => setArticle({ ...article, summary: e.target.value })}
            placeholder="Résumé court de l'article"
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Type</label>
            <select
              value={article.type}
              onChange={(e) => setArticle({ ...article, type: e.target.value })}
            >
              <option value="news">News</option>
              <option value="analysis">Analyse</option>
              <option value="interview">Interview</option>
              <option value="standard">Standard</option>
              <option value="data-story">Data Story</option>
            </select>
          </div>

          <div className="form-group">
            <label>Jeu</label>
            <select
              value={article.game}
              onChange={(e) => setArticle({ ...article, game: e.target.value })}
            >
              <option value="general">Général</option>
              <option value="valorant">Valorant</option>
              <option value="cs2">CS2</option>
              <option value="cod">Call of Duty</option>
              <option value="fortnite">Fortnite</option>
            </select>
          </div>

          <div className="form-group">
            <label>Statut</label>
            <select
              value={article.status}
              onChange={(e) => setArticle({ ...article, status: e.target.value })}
            >
              <option value="draft">📝 Brouillon</option>
              <option value="published">✅ Publié</option>
              <option value="archived">📦 Archivé</option>
            </select>
          </div>
        </div>

        <div className="blocks-section">
          <h3>Contenu de l'article</h3>
          
          <div className="add-block-buttons">
            <button type="button" onClick={() => addBlock('text')} className="btn-add-block">
              📝 Ajouter du texte
            </button>
            <button type="button" onClick={() => addBlock('title')} className="btn-add-block">
              📌 Ajouter un titre
            </button>
            <button type="button" onClick={() => addBlock('image')} className="btn-add-block">
              🖼️ Ajouter une image
            </button>
            <button type="button" onClick={() => addBlock('stats')} className="btn-add-block">
              📊 Ajouter des stats
            </button>
          </div>

          <div className="blocks-list">
            {article.blocks.map((block, index) => (
              <div key={index} className="block-item">
                <div className="block-header">
                  <span className="block-type">
                    {block.type === 'text' && '📝 Texte'}
                    {block.type === 'title' && '📌 Titre'}
                    {block.type === 'image' && '🖼️ Image'}
                    {block.type === 'stats' && '📊 Stats'}
                  </span>
                  <div className="block-actions">
                    <button type="button" onClick={() => moveBlock(index, 'up')} disabled={index === 0}>↑</button>
                    <button type="button" onClick={() => moveBlock(index, 'down')} disabled={index === article.blocks.length - 1}>↓</button>
                    <button type="button" onClick={() => removeBlock(index)} className="btn-delete">🗑️</button>
                  </div>
                </div>

                {block.type === 'text' && (
                  <textarea
                    value={block.content}
                    onChange={(e) => updateBlock(index, e.target.value)}
                    placeholder="Contenu du paragraphe..."
                    rows={5}
                  />
                )}

                {block.type === 'title' && (
                  <input
                    type="text"
                    value={block.content}
                    onChange={(e) => updateBlock(index, e.target.value)}
                    placeholder="Titre de la section..."
                  />
                )}

                {block.type === 'image' && (
                  <div className="image-block-content">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e.target.files[0])}
                      className="file-input"
                    />
                    {block.content && (
                      <div className="image-preview">
                        <img src={block.content} alt="Aperçu" style={{maxWidth: '100%', maxHeight: '200px'}} />
                      </div>
                    )}
                    <small>ou</small>
                    <input
                      type="url"
                      value={block.content && !block.content.startsWith('data:') ? block.content : ''}
                      onChange={(e) => updateBlock(index, e.target.value)}
                      placeholder="URL de l'image..."
                    />
                  </div>
                )}

                {block.type === 'stats' && (
                  <div className="stats-block-content">
                    <div className="stats-viz-selector">
                      <label>Type de visualisation :</label>
                      <select 
                        value={block.vizType || 'table'}
                        onChange={(e) => updateBlockData(index, { vizType: e.target.value })}
                        className="viz-type-select"
                      >
                        <option value="table">📊 Tableau</option>
                        <option value="radar">🔺 Radar (Triangle)</option>
                        <option value="bar">📊 Barres</option>
                        <option value="line">📈 Ligne</option>
                      </select>
                    </div>
                    
                    <div className="dataset-selector">
                      <label>Choisir un dataset :</label>
                      <select
                        value={block.datasetId || ''}
                        onChange={(e) => handleDatasetSelection(index, e.target.value)}
                        className="dataset-select"
                      >
                        <option value="">-- Sélectionner un dataset --</option>
                        {availableDatasets.map(dataset => (
                          <option key={dataset.id} value={dataset.id}>
                            {dataset.name} ({dataset.game})
                          </option>
                        ))}
                      </select>
                    </div>

                    {(user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('ROLE_SUPERADMIN') || user.roles?.includes('ROLE_PROVIDER')) && (
                      <div className="or-divider">
                        <span>ou</span>
                      </div>
                    )}

                    {(user.roles?.includes('ROLE_ADMIN') || user.roles?.includes('ROLE_SUPERADMIN') || user.roles?.includes('ROLE_PROVIDER')) && (
                      <div className="manual-upload">
                        <label>Upload direct (Admin/Provider uniquement) :</label>
                        <input
                          type="file"
                          accept=".csv,.xlsx,.xls"
                          onChange={(e) => handleStatsUpload(index, e.target.files[0])}
                          className="file-input"
                        />
                      </div>
                    )}

                    {block.fileName && (
                      <div className="file-info">
                        📄 {block.fileName}
                      </div>
                    )}
                    {block.content && Array.isArray(block.content) && (
                      <div className="stats-preview">
                        <small>Données chargées ({block.content.length} lignes)</small>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={onBack} className="btn-cancel">Annuler</button>
          <button type="submit" disabled={loading} className="btn-save">
            {loading ? 'Publication...' : (article.status === 'published' ? 'Publier' : 'Enregistrer')}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}

export default ArticleEditor;
