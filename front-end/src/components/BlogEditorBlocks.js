import React, { useState, useEffect } from 'react';
import VisualizationBuilder from './VisualizationBuilder';
import './BlogEditorBlocks.css';

const BlogEditorBlocks = ({ onBack }) => {
    const [article, setArticle] = useState({
        title: '',
        summary: '',
        type: 'data-story',
        status: 'draft',
        game: 'general',
        blocks: []
    });
    const [media, setMedia] = useState([]);
    const [visualizations, setVisualizations] = useState([]);
    const [showAddBlock, setShowAddBlock] = useState(false);
    const [showVizBuilder, setShowVizBuilder] = useState(false);
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [selectedBlockIndex, setSelectedBlockIndex] = useState(null);

    useEffect(() => {
        fetchMedia();
        fetchVisualizations();
    }, []);

    const fetchMedia = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/media', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setMedia(data);
            }
        } catch (error) {
            console.error('Erreur media:', error);
        }
    };

    const fetchVisualizations = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/visualizations', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            if (response.ok) {
                const data = await response.json();
                setVisualizations(data);
            }
        } catch (error) {
            console.error('Erreur viz:', error);
        }
    };

    const addBlock = (type) => {
        const newBlock = {
            type,
            position: article.blocks.length,
            content: type === 'text' ? '' : null,
            titleLevel: type === 'title' ? 'h2' : null,
            mediaId: null,
            visualizationId: null
        };
        setArticle({ ...article, blocks: [...article.blocks, newBlock] });
        setShowAddBlock(false);
    };

    const updateBlock = (index, updates) => {
        const updatedBlocks = [...article.blocks];
        updatedBlocks[index] = { ...updatedBlocks[index], ...updates };
        setArticle({ ...article, blocks: updatedBlocks });
    };

    const moveBlock = (index, direction) => {
        const newBlocks = [...article.blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        
        if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        newBlocks.forEach((block, i) => block.position = i);
        
        setArticle({ ...article, blocks: newBlocks });
    };

    const removeBlock = (index) => {
        const newBlocks = article.blocks.filter((_, i) => i !== index);
        newBlocks.forEach((block, i) => block.position = i);
        setArticle({ ...article, blocks: newBlocks });
    };

    const handleSave = async () => {
        try {
            console.log('🚀 Début de la sauvegarde, blocs:', article.blocks);
            
            // Upload des images d'abord
            const processedBlocks = await Promise.all(article.blocks.map(async (block) => {
                if (block.type === 'image' && block.imageFile) {
                    console.log('📤 Upload image:', block.imageFile.name);
                    // Uploader l'image
                    const formData = new FormData();
                    formData.append('file', block.imageFile);
                    
                    const uploadResponse = await fetch('http://localhost:8000/api/media/upload', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: formData
                    });
                    
                    if (uploadResponse.ok) {
                        const mediaData = await uploadResponse.json();
                        console.log('✅ Image uploadée:', mediaData);
                        // Utiliser l'URL retournée par le backend
                        return { ...block, content: mediaData.url, imageFile: undefined };
                    } else {
                        const errorText = await uploadResponse.text();
                        console.error('❌ Erreur upload image:', uploadResponse.status, errorText);
                        return block;
                    }
                } else if (block.type === 'image') {
                    console.log('ℹ️ Bloc image sans fichier (déjà uploadé?):', block.content);
                }
                return block;
            }));
            
            console.log('📦 Blocs traités:', processedBlocks);
            
            // S'assurer que le status est "published" quand on publie
            const articleToSave = {
                ...article,
                blocks: processedBlocks,
                status: 'published'
            };
            
            const response = await fetch('http://localhost:8000/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(articleToSave)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Article créé avec succès:', data);
                // Retourner à la liste des articles
                if (onBack) {
                    onBack();
                }
            } else {
                const errorData = await response.json();
                console.error('Erreur serveur:', errorData);
                alert('Erreur lors de la publication: ' + (errorData.message || 'Erreur inconnue'));
            }
        } catch (error) {
            console.error('Erreur publication:', error);
            alert('Erreur de connexion au serveur');
        }
    };

    const handleSaveDraft = async () => {
        try {
            const articleToSave = {
                ...article,
                status: 'draft'
            };
            
            const response = await fetch('http://localhost:8000/api/articles', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(articleToSave)
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Brouillon sauvegardé:', data);
                if (onBack) {
                    onBack();
                }
            } else {
                const errorData = await response.json();
                console.error('Erreur serveur:', errorData);
                alert('Erreur lors de la sauvegarde: ' + (errorData.message || 'Erreur inconnue'));
            }
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
            alert('Erreur de connexion au serveur');
        }
    };

    const handleMediaUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:8000/api/media/upload', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
                body: formData
            });

            if (response.ok) {
                fetchMedia();
            }
        } catch (error) {
            console.error('Erreur upload:', error);
        }
    };

    const renderBlock = (block, index) => {
        switch (block.type) {
            case 'title':
                return (
                    <div className="block-editor title-block">
                        <select 
                            value={block.titleLevel || 'h2'}
                            onChange={(e) => updateBlock(index, { titleLevel: e.target.value })}
                        >
                            <option value="h1">H1</option>
                            <option value="h2">H2</option>
                            <option value="h3">H3</option>
                            <option value="h4">H4</option>
                        </select>
                        <input
                            type="text"
                            value={block.content || ''}
                            onChange={(e) => updateBlock(index, { content: e.target.value })}
                            placeholder="Titre du bloc..."
                            className="title-input"
                        />
                    </div>
                );

            case 'text':
                return (
                    <div className="block-editor text-block">
                        <textarea
                            value={block.content || ''}
                            onChange={(e) => updateBlock(index, { content: e.target.value })}
                            placeholder="Contenu du bloc..."
                            rows="6"
                        />
                    </div>
                );

            case 'image':
                return (
                    <div className="block-editor image-block">
                        {block.imageFile || block.content ? (
                            <div className="image-preview">
                                {block.imageFile ? (
                                    <>
                                        <img src={URL.createObjectURL(block.imageFile)} alt="Preview" />
                                        <p style={{ color: '#4CAF50', fontWeight: 'bold', marginTop: '10px' }}>
                                            ✅ Image choisie: {block.imageFile.name}
                                        </p>
                                        <button onClick={() => updateBlock(index, { imageFile: null, content: '' })}>Changer l'image</button>
                                    </>
                                ) : (
                                    <>
                                        <img src={block.content} alt="Preview" />
                                        <button onClick={() => updateBlock(index, { content: '' })}>Changer l'image</button>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            updateBlock(index, { imageFile: file });
                                        }
                                    }}
                                    style={{ 
                                        width: '100%', 
                                        padding: '12px', 
                                        fontSize: '14px',
                                        background: 'rgba(255, 70, 85, 0.1)',
                                        border: '2px dashed rgba(255, 70, 85, 0.5)',
                                        borderRadius: '6px',
                                        color: 'white',
                                        cursor: 'pointer'
                                    }}
                                />
                                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '10px' }}>
                                    📸 Clique pour choisir une image depuis ton PC
                                </p>
                            </div>
                        )}
                    </div>
                );

            case 'visualization':
                return (
                    <div className="block-editor viz-block">
                        {block.visualizationId ? (
                            <div className="viz-preview">
                                <p>Visualisation: {visualizations.find(v => v.id === block.visualizationId)?.title}</p>
                                <button onClick={() => updateBlock(index, { visualizationId: null })}>Changer</button>
                            </div>
                        ) : (
                            <select onChange={(e) => updateBlock(index, { visualizationId: parseInt(e.target.value) })}>
                                <option value="">Choisir une visualisation</option>
                                {visualizations.map(v => (
                                    <option key={v.id} value={v.id}>{v.title}</option>
                                ))}
                            </select>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="blog-editor-blocks">
            <div className="editor-header">
                <h2>Nouvel Article (Blocs)</h2>
                <div className="header-actions">
                    <button onClick={handleSaveDraft} className="btn-draft">
                        Sauvegarder Brouillon
                    </button>
                    <button onClick={handleSave} className="btn-publish">
                        Publier
                    </button>
                </div>
            </div>

            <div className="article-meta">
                <input
                    type="text"
                    value={article.title}
                    onChange={(e) => setArticle({ ...article, title: e.target.value })}
                    placeholder="Titre de l'article"
                    className="article-title-input"
                />
                <textarea
                    value={article.summary}
                    onChange={(e) => setArticle({ ...article, summary: e.target.value })}
                    placeholder="Résumé (max 500 caractères)"
                    className="article-summary-input"
                    maxLength="500"
                />
                <div className="meta-row">
                    <select value={article.type} onChange={(e) => setArticle({ ...article, type: e.target.value })}>
                        <option value="standard">Standard</option>
                        <option value="data-story">Data Story</option>
                        <option value="analysis">Analyse</option>
                        <option value="tutorial">Tutoriel</option>
                        <option value="news">News</option>
                    </select>
                    <select value={article.game} onChange={(e) => setArticle({ ...article, game: e.target.value })}>
                        <option value="general">Général</option>
                        <option value="valorant">Valorant</option>
                        <option value="cs2">CS2</option>
                        <option value="cod">COD</option>
                    </select>
                </div>
            </div>

            <div className="blocks-container">
                {article.blocks.map((block, index) => (
                    <div key={index} className="block-wrapper">
                        <div className="block-toolbar">
                            <span className="block-type">{block.type}</span>
                            <div className="block-actions">
                                <button onClick={() => moveBlock(index, 'up')} disabled={index === 0}>▲</button>
                                <button onClick={() => moveBlock(index, 'down')} disabled={index === article.blocks.length - 1}>▼</button>
                                <button onClick={() => removeBlock(index)} className="btn-delete">✕</button>
                            </div>
                        </div>
                        {renderBlock(block, index)}
                    </div>
                ))}

                <button onClick={() => setShowAddBlock(true)} className="btn-add-block">
                    + Ajouter un bloc
                </button>
            </div>

            {showAddBlock && (
                <div className="modal-overlay" onClick={() => setShowAddBlock(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Type de bloc</h3>
                        <div className="block-types-grid">
                            <button onClick={() => addBlock('title')} className="block-type-btn">
                                <span className="icon">📝</span>
                                <span>Titre</span>
                            </button>
                            <button onClick={() => addBlock('text')} className="block-type-btn">
                                <span className="icon">📄</span>
                                <span>Texte</span>
                            </button>
                            <button onClick={() => addBlock('image')} className="block-type-btn">
                                <span className="icon">🖼️</span>
                                <span>Image</span>
                            </button>
                            <button onClick={() => addBlock('visualization')} className="block-type-btn">
                                <span className="icon">📊</span>
                                <span>Visualisation</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showMediaLibrary && (
                <div className="modal-overlay" onClick={() => setShowMediaLibrary(false)}>
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <h3>Bibliothèque Média</h3>
                        <input type="file" accept="image/*" onChange={handleMediaUpload} />
                        <div className="media-grid">
                            {media.map(m => (
                                <div 
                                    key={m.id} 
                                    className="media-item" 
                                    onClick={() => {
                                        updateBlock(selectedBlockIndex, { mediaId: m.id });
                                        setShowMediaLibrary(false);
                                    }}
                                >
                                    <img src={`http://localhost:8000${m.path}`} alt={m.alt} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {showVizBuilder && (
                <div className="modal-overlay" onClick={() => setShowVizBuilder(false)}>
                    <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
                        <VisualizationBuilder onSave={() => { fetchVisualizations(); setShowVizBuilder(false); }} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlogEditorBlocks;
