import React, { useState, useEffect } from 'react';
import './DesignPanel.css';

function DesignPanel({ onClose }) {
  const [settings, setSettings] = useState({
    // Couleurs principales
    primaryColor: localStorage.getItem('primaryColor') || '#667eea',
    secondaryColor: localStorage.getItem('secondaryColor') || '#764ba2',
    accentColor: localStorage.getItem('accentColor') || '#f093fb',
    
    // Couleurs du site (sans backgroundColor)
    cardBackground: localStorage.getItem('cardBackground') || '#ffffff',
    textPrimary: localStorage.getItem('textPrimary') || '#2c3e50',
    textSecondary: localStorage.getItem('textSecondary') || '#666666',
    borderColor: localStorage.getItem('borderColor') || '#e0e0e0',
    hoverColor: localStorage.getItem('hoverColor') || '#f8f9fa',
    
    // Logo
    logo: localStorage.getItem('siteLogo') || null,
    
    // Typographie
    bgStyle: localStorage.getItem('bgStyle') || 'gradient-dark',
    fontFamily: localStorage.getItem('fontFamily') || 'Inter',
    fontSize: localStorage.getItem('fontSize') || '16',
    borderRadius: localStorage.getItem('borderRadius') || '12',
    logoPosition: localStorage.getItem('logoPosition') || 'left',
    headerHeight: localStorage.getItem('headerHeight') || '70',
    headerTransparent: localStorage.getItem('headerTransparent') === 'true'
  });

  const [activeTab, setActiveTab] = useState('colors'); // colors, logo, articles, layout

  const [articleBlocks, setArticleBlocks] = useState(() => {
    const saved = localStorage.getItem('articleBlocksTemplate');
    return saved ? JSON.parse(saved) : [
      { id: 1, type: 'title', position: 'top' },
      { id: 2, type: 'image', position: 'center', size: 'large' },
      { id: 3, type: 'text', position: 'below-image' },
      { id: 4, type: 'gallery', position: 'bottom', layout: 'grid' }
    ];
  });

  const [navOrder, setNavOrder] = useState(() => {
    const saved = localStorage.getItem('navOrder');
    return saved ? JSON.parse(saved) : [
      { id: 'accueil', label: 'Accueil' },
      { id: 'jeux', label: 'Jeux' },
      { id: 'equipe', label: 'Equipe' },
      { id: 'joueurs', label: 'Joueurs' },
      { id: 'abonnement', label: 'Abonnement' },
      { id: 'news', label: 'News' }
    ];
  });

  const [draggedItem, setDraggedItem] = useState(null);
  const [draggedBlock, setDraggedBlock] = useState(null);

  // Appliquer les changements en temps réel
  useEffect(() => {
    // Couleurs principales
    document.documentElement.style.setProperty('--designer-primary', settings.primaryColor);
    document.documentElement.style.setProperty('--designer-secondary', settings.secondaryColor);
    document.documentElement.style.setProperty('--designer-accent', settings.accentColor);
    
    // Couleurs du site - applique seulement si custom (pas les valeurs par défaut)
    if (localStorage.getItem('cardBackground')) {
      document.documentElement.style.setProperty('--background-card', settings.cardBackground);
    }
    if (localStorage.getItem('textPrimary')) {
      document.documentElement.style.setProperty('--text-primary', settings.textPrimary);
    }
    if (localStorage.getItem('textSecondary')) {
      document.documentElement.style.setProperty('--text-secondary', settings.textSecondary);
    }
    if (localStorage.getItem('borderColor')) {
      document.documentElement.style.setProperty('--border-color', settings.borderColor);
    }
    if (localStorage.getItem('hoverColor')) {
      document.documentElement.style.setProperty('--hover-color', settings.hoverColor);
    }
    
    // Typographie
    document.documentElement.style.setProperty('--border-radius', `${settings.borderRadius}px`);
    document.documentElement.style.setProperty('--font-family', settings.fontFamily);
    document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);
  }, [settings]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(key, value);
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const logoData = reader.result;
        setSettings(prev => ({ ...prev, logo: logoData }));
        localStorage.setItem('siteLogo', logoData);
        // Dispatch event pour mettre à jour le logo partout
        window.dispatchEvent(new CustomEvent('logoChanged', { detail: logoData }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBlockDragStart = (index) => {
    setDraggedBlock(index);
  };

  const handleBlockDragOver = (e, index) => {
    e.preventDefault();
    if (draggedBlock === null || draggedBlock === index) return;

    const newBlocks = [...articleBlocks];
    const draggedElement = newBlocks[draggedBlock];
    newBlocks.splice(draggedBlock, 1);
    newBlocks.splice(index, 0, draggedElement);

    setArticleBlocks(newBlocks);
    setDraggedBlock(index);
  };

  const handleBlockDragEnd = () => {
    setDraggedBlock(null);
    localStorage.setItem('articleBlocksTemplate', JSON.stringify(articleBlocks));
    window.dispatchEvent(new Event('articleTemplateChanged'));
  };

  const addArticleBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type,
      position: 'bottom',
      size: 'medium'
    };
    const newBlocks = [...articleBlocks, newBlock];
    setArticleBlocks(newBlocks);
    localStorage.setItem('articleBlocksTemplate', JSON.stringify(newBlocks));
    window.dispatchEvent(new Event('articleTemplateChanged'));
  };

  const removeArticleBlock = (id) => {
    const newBlocks = articleBlocks.filter(block => block.id !== id);
    setArticleBlocks(newBlocks);
    localStorage.setItem('articleBlocksTemplate', JSON.stringify(newBlocks));
    window.dispatchEvent(new Event('articleTemplateChanged'));
  };

  const updateBlockSettings = (id, key, value) => {
    const newBlocks = articleBlocks.map(block => 
      block.id === id ? { ...block, [key]: value } : block
    );
    setArticleBlocks(newBlocks);
    localStorage.setItem('articleBlocksTemplate', JSON.stringify(newBlocks));
    window.dispatchEvent(new Event('articleTemplateChanged'));
  };

  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const newOrder = [...navOrder];
    const draggedElement = newOrder[draggedItem];
    newOrder.splice(draggedItem, 1);
    newOrder.splice(index, 0, draggedElement);

    setNavOrder(newOrder);
    setDraggedItem(index);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    localStorage.setItem('navOrder', JSON.stringify(navOrder));
    // Notifier les autres composants du changement
    window.dispatchEvent(new Event('navOrderChanged'));
  };

  const handleReset = () => {
    if (window.confirm('Réinitialiser tous les paramètres de design ?')) {
      const defaults = {
        primaryColor: '#667eea',
        secondaryColor: '#764ba2',
        accentColor: '#f093fb',
        bgStyle: 'gradient-dark',
        fontFamily: 'Inter',
        fontSize: '16',
        borderRadius: '12',
        logoPosition: 'left',
        headerHeight: '70',
        headerTransparent: 'false'
      };
      
      Object.keys(defaults).forEach(key => {
        localStorage.removeItem(key);
      });
      
      setSettings(defaults);
      window.location.reload();
    }
  };

  return (
    <div className="design-panel-overlay" onClick={onClose}>
      <div className="design-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="design-panel-header">
          <h2>🎨 Personnalisation du Design</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {/* Tabs Navigation */}
        <div className="design-tabs">
          <button 
            className={`tab-btn ${activeTab === 'colors' ? 'active' : ''}`}
            onClick={() => setActiveTab('colors')}
          >
            🎨 Couleurs
          </button>
          <button 
            className={`tab-btn ${activeTab === 'logo' ? 'active' : ''}`}
            onClick={() => setActiveTab('logo')}
          >
            🖼️ Logo
          </button>
          <button 
            className={`tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
            onClick={() => setActiveTab('articles')}
          >
            📝 Articles
          </button>
          <button 
            className={`tab-btn ${activeTab === 'layout' ? 'active' : ''}`}
            onClick={() => setActiveTab('layout')}
          >
            📐 Mise en page
          </button>
        </div>

        {/* Content */}
        <div className="design-panel-content">{/* Tab: Couleurs */}
          {activeTab === 'colors' && (
            <>
              <div className="design-section">
                <h3>🎨 Couleurs Principales</h3>
                <div className="color-grid">
                  <div className="color-input-group">
                    <label>Couleur Principale</label>
                    <input 
                      type="color" 
                      value={settings.primaryColor}
                      onChange={(e) => handleChange('primaryColor', e.target.value)}
                    />
                    <span>{settings.primaryColor}</span>
                  </div>
                  <div className="color-input-group">
                    <label>Couleur Secondaire</label>
                    <input 
                      type="color" 
                      value={settings.secondaryColor}
                      onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    />
                    <span>{settings.secondaryColor}</span>
                  </div>
                  <div className="color-input-group">
                    <label>Couleur d'Accent</label>
                    <input 
                      type="color" 
                      value={settings.accentColor}
                      onChange={(e) => handleChange('accentColor', e.target.value)}
                    />
                    <span>{settings.accentColor}</span>
                  </div>
                </div>
              </div>

              <div className="design-section">
                <h3>🌈 Couleurs du Site</h3>
                <div className="color-grid">
                  <div className="color-input-group">
                    <label>Fond Cartes</label>
                    <input 
                      type="color" 
                      value={settings.cardBackground}
                      onChange={(e) => handleChange('cardBackground', e.target.value)}
                    />
                    <span>{settings.cardBackground}</span>
                  </div>
                  <div className="color-input-group">
                    <label>Texte Principal</label>
                    <input 
                      type="color" 
                      value={settings.textPrimary}
                      onChange={(e) => handleChange('textPrimary', e.target.value)}
                    />
                    <span>{settings.textPrimary}</span>
                  </div>
                  <div className="color-input-group">
                    <label>Texte Secondaire</label>
                    <input 
                      type="color" 
                      value={settings.textSecondary}
                      onChange={(e) => handleChange('textSecondary', e.target.value)}
                    />
                    <span>{settings.textSecondary}</span>
                  </div>
                  <div className="color-input-group">
                    <label>Bordures</label>
                    <input 
                      type="color" 
                      value={settings.borderColor}
                      onChange={(e) => handleChange('borderColor', e.target.value)}
                    />
                    <span>{settings.borderColor}</span>
                  </div>
                  <div className="color-input-group">
                    <label>Hover</label>
                    <input 
                      type="color" 
                      value={settings.hoverColor}
                      onChange={(e) => handleChange('hoverColor', e.target.value)}
                    />
                    <span>{settings.hoverColor}</span>
                  </div>
                </div>
              </div>

              {/* Preview des couleurs */}
              <div className="design-section preview-section">
                <h3>👁️ Aperçu</h3>
                <div className="color-preview-grid">
                  {/* Preview Card */}
                  <div 
                    className="preview-card-demo"
                    style={{
                      background: settings.cardBackground,
                      border: `2px solid ${settings.borderColor}`,
                      color: settings.textPrimary
                    }}
                  >
                    <div 
                      className="preview-header-bar"
                      style={{
                        background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`
                      }}
                    >
                      <h4 style={{ color: 'white', margin: 0 }}>Exemple de Card</h4>
                    </div>
                    <p style={{ color: settings.textPrimary, margin: '1rem 0 0.5rem' }}>
                      Texte principal avec votre couleur
                    </p>
                    <p style={{ color: settings.textSecondary, margin: 0, fontSize: '0.9rem' }}>
                      Texte secondaire plus discret
                    </p>
                    <div 
                      className="preview-button"
                      style={{
                        background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                        color: 'white',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        marginTop: '1rem',
                        textAlign: 'center',
                        fontWeight: '600'
                      }}
                    >
                      Bouton
                    </div>
                  </div>

                  {/* Preview Stats */}
                  <div 
                    className="preview-stat-demo"
                    style={{
                      background: settings.cardBackground,
                      border: `2px solid ${settings.borderColor}`,
                      borderLeft: `4px solid ${settings.accentColor}`,
                      padding: '1rem',
                      borderRadius: '8px'
                    }}
                  >
                    <div style={{ fontSize: '2rem', color: settings.primaryColor, fontWeight: 'bold' }}>42</div>
                    <div style={{ color: settings.textSecondary, fontSize: '0.85rem' }}>STATISTIQUES</div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Tab: Logo */}
          {activeTab === 'logo' && (
            <div className="design-section">
              <h3>🖼️ Logo du Site</h3>
              <div className="logo-upload-section">
                <div className="logo-preview">
                  {settings.logo ? (
                    <img src={settings.logo} alt="Logo" />
                  ) : (
                    <div className="no-logo">Aucun logo</div>
                  )}
                </div>
                <div className="logo-controls">
                  <label className="upload-btn">
                    📤 Choisir un logo
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleLogoUpload}
                      style={{ display: 'none' }}
                    />
                  </label>
                  {settings.logo && (
                    <button 
                      className="remove-logo-btn"
                      onClick={() => {
                        setSettings(prev => ({ ...prev, logo: null }));
                        localStorage.removeItem('siteLogo');
                        window.dispatchEvent(new Event('logoChanged'));
                      }}
                    >
                      🗑️ Supprimer
                    </button>
                  )}
                </div>
                <div className="logo-options">
                  <div className="control-group">
                    <label>Position du Logo</label>
                    <select 
                      value={settings.logoPosition}
                      onChange={(e) => handleChange('logoPosition', e.target.value)}
                    >
                      <option value="left">Gauche</option>
                      <option value="center">Centre</option>
                      <option value="right">Droite</option>
                    </select>
                  </div>
                </div>

                {/* Preview Logo in Header */}
                <div className="logo-preview-header" style={{ marginTop: '2rem' }}>
                  <h4>👁️ Aperçu dans le Header</h4>
                  <div 
                    className="header-preview"
                    style={{
                      background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                      padding: '1rem',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: settings.logoPosition === 'left' ? 'flex-start' : settings.logoPosition === 'right' ? 'flex-end' : 'center',
                      gap: '1rem',
                      minHeight: '80px'
                    }}
                  >
                    {settings.logo ? (
                      <img 
                        src={settings.logo} 
                        alt="Logo Preview" 
                        style={{
                          maxHeight: '60px',
                          maxWidth: '200px',
                          objectFit: 'contain'
                        }}
                      />
                    ) : (
                      <div style={{ color: 'white', opacity: 0.5 }}>Votre logo ici</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Articles (WordPress-like) */}
          {activeTab === 'articles' && (
            <>
              <div className="design-section">
                <h3>📝 Éditeur de Template d'Articles</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '1rem' }}>
                  Créez votre template d'article personnalisé en ajoutant et réorganisant les blocs
                </p>
                
                <div className="block-templates">
                  <h4>Ajouter un bloc:</h4>
                  <div className="block-add-buttons">
                    <button onClick={() => addArticleBlock('title')}>➕ Titre</button>
                    <button onClick={() => addArticleBlock('image')}>➕ Image</button>
                    <button onClick={() => addArticleBlock('text')}>➕ Texte</button>
                    <button onClick={() => addArticleBlock('gallery')}>➕ Galerie</button>
                    <button onClick={() => addArticleBlock('video')}>➕ Vidéo</button>
                    <button onClick={() => addArticleBlock('quote')}>➕ Citation</button>
                  </div>
                </div>

                <div className="article-blocks-editor">
                  <h4>Ordre des blocs (Glisser-Déposer):</h4>
                  {articleBlocks.map((block, index) => (
                    <div
                      key={block.id}
                      className="article-block-item"
                      draggable
                      onDragStart={() => handleBlockDragStart(index)}
                      onDragOver={(e) => handleBlockDragOver(e, index)}
                      onDragEnd={handleBlockDragEnd}
                      style={{
                        opacity: draggedBlock === index ? 0.5 : 1,
                        cursor: 'move'
                      }}
                    >
                      <span className="drag-handle">☰</span>
                      <div className="block-info">
                        <strong>{block.type}</strong>
                        <div className="block-settings">
                          <select
                            value={block.position}
                            onChange={(e) => updateBlockSettings(block.id, 'position', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <option value="left">Gauche</option>
                            <option value="center">Centre</option>
                            <option value="right">Droite</option>
                            <option value="full">Pleine largeur</option>
                          </select>
                          {(block.type === 'image' || block.type === 'gallery') && (
                            <select
                              value={block.size}
                              onChange={(e) => updateBlockSettings(block.id, 'size', e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <option value="small">Petit</option>
                              <option value="medium">Moyen</option>
                              <option value="large">Grand</option>
                            </select>
                          )}
                        </div>
                      </div>
                      <button 
                        className="remove-block-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeArticleBlock(block.id);
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* Preview Article Template */}
                <div className="article-preview">
                  <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>👁️ Aperçu du Template</h4>
                  <div className="article-preview-container">
                    {articleBlocks.map((block, idx) => (
                      <div 
                        key={block.id} 
                        className={`preview-block preview-block-${block.type} position-${block.position || 'center'} size-${block.size || 'medium'}`}
                        style={{
                          padding: '0.5rem',
                          margin: '0.5rem 0',
                          background: settings.cardBackground,
                          border: `1px dashed ${settings.borderColor}`,
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          color: settings.textSecondary
                        }}
                      >
                        {block.type === 'title' && '📝 Titre'}
                        {block.type === 'image' && `🖼️ Image (${block.size || 'medium'})`}
                        {block.type === 'text' && '📄 Texte'}
                        {block.type === 'gallery' && `🖼️ Galerie (${block.layout || 'grid'})`}
                        {block.type === 'video' && '🎥 Vidéo'}
                        {block.type === 'quote' && '💬 Citation'}
                        <span style={{ marginLeft: '0.5rem', opacity: 0.6 }}>
                          → {block.position || 'center'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Tab: Layout */}
          {activeTab === 'layout' && (
            <>
              {/* Réorganisation du Navbar */}
              <div className="design-section">
                <h3>📍 Ordre du Menu de Navigation</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '1rem' }}>
                  Glissez-déposez pour réorganiser les éléments du menu
                </p>
                <div className="navbar-reorder">
                  {navOrder.map((item, index) => (
                    <div
                      key={item.id}
                      className="navbar-item"
                      draggable
                      onDragStart={() => handleDragStart(index)}
                      onDragOver={(e) => handleDragOver(e, index)}
                      onDragEnd={handleDragEnd}
                      style={{
                        opacity: draggedItem === index ? 0.5 : 1,
                        cursor: 'move'
                      }}
                    >
                      <span className="drag-handle">☰</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Arrière-plan */}
              <div className="design-section">
                <h3>🌈 Style d'Arrière-plan</h3>
                <div className="bg-selector">
                  {['gradient-dark', 'gradient-purple', 'gradient-blue', 'solid-dark', 'solid-black'].map(style => (
                    <button
                      key={style}
                      className={`bg-option ${settings.bgStyle === style ? 'active' : ''}`}
                      onClick={() => handleChange('bgStyle', style)}
                    >
                      {style.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Typographie */}
              <div className="design-section">
                <h3>✍️ Typographie</h3>
                <div className="typo-controls">
                  <div className="control-group">
                    <label>Police</label>
                    <select 
                      value={settings.fontFamily}
                      onChange={(e) => handleChange('fontFamily', e.target.value)}
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Arial">Arial</option>
                    </select>
                  </div>
                  <div className="control-group">
                    <label>Taille: {settings.fontSize}px</label>
                    <input 
                      type="range" 
                      min="12" 
                      max="20" 
                      value={settings.fontSize}
                      onChange={(e) => handleChange('fontSize', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Bordures */}
              <div className="design-section">
                <h3>📐 Arrondis des Bordures</h3>
                <div className="control-group">
                  <label>Rayon: {settings.borderRadius}px</label>
                  <input 
                    type="range" 
                    min="0" 
                    max="24" 
                    value={settings.borderRadius}
                    onChange={(e) => handleChange('borderRadius', e.target.value)}
                  />
                </div>
              </div>

              {/* Header */}
              <div className="design-section">
                <h3>📌 Configuration du Header</h3>
                <div className="header-controls">
                  <div className="control-group">
                    <label>Hauteur: {settings.headerHeight}px</label>
                    <input 
                      type="range" 
                      min="50" 
                      max="100" 
                      value={settings.headerHeight}
                      onChange={(e) => handleChange('headerHeight', e.target.value)}
                    />
                  </div>
                  <div className="control-group">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={settings.headerTransparent}
                        onChange={(e) => handleChange('headerTransparent', e.target.checked)}
                      />
                      Header Transparent
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer */}
        <div className="design-panel-footer">
          <button className="reset-btn" onClick={handleReset}>
            🔄 Réinitialiser
          </button>
          <button className="save-btn" onClick={onClose}>
            ✓ Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

export default DesignPanel;
