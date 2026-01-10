import React, { useState, useEffect } from 'react';
import './DesignPanel.css';

function DesignPanel({ onClose }) {
  const [settings, setSettings] = useState({
    primaryColor: localStorage.getItem('primaryColor') || '#667eea',
    secondaryColor: localStorage.getItem('secondaryColor') || '#764ba2',
    accentColor: localStorage.getItem('accentColor') || '#f093fb',
    bgStyle: localStorage.getItem('bgStyle') || 'gradient-dark',
    fontFamily: localStorage.getItem('fontFamily') || 'Inter',
    fontSize: localStorage.getItem('fontSize') || '16',
    borderRadius: localStorage.getItem('borderRadius') || '12',
    logoPosition: localStorage.getItem('logoPosition') || 'left',
    headerHeight: localStorage.getItem('headerHeight') || '70',
    headerTransparent: localStorage.getItem('headerTransparent') === 'true'
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

  // Appliquer les changements en temps réel
  useEffect(() => {
    document.documentElement.style.setProperty('--designer-primary', settings.primaryColor);
    document.documentElement.style.setProperty('--designer-secondary', settings.secondaryColor);
    document.documentElement.style.setProperty('--designer-accent', settings.accentColor);
    document.documentElement.style.setProperty('--border-radius', `${settings.borderRadius}px`);
    document.documentElement.style.setProperty('--font-family', settings.fontFamily);
    document.documentElement.style.setProperty('--font-size', `${settings.fontSize}px`);
  }, [settings]);

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(key, value);
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

        {/* Content */}
        <div className="design-panel-content">
          
          {/* Couleurs */}
          <div className="design-section">
            <h3>🎨 Palette de Couleurs</h3>
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

          {/* Réorganisation du Navbar */}
          <div className="design-section">
            <h3>📍 Ordre du Menu de Navigation</h3>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '1rem' }}>
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

          {/* Aperçu */}
          <div className="design-section">
            <h3>👁️ Aperçu en Direct</h3>
            <div className="preview-box" style={{
              background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
              borderRadius: `${settings.borderRadius}px`,
              fontFamily: settings.fontFamily,
              fontSize: `${settings.fontSize}px`
            }}>
              <p>Exemple de texte avec vos paramètres</p>
              <button style={{
                background: settings.accentColor,
                borderRadius: `${settings.borderRadius}px`,
                padding: '10px 20px',
                border: 'none',
                color: 'white',
                cursor: 'pointer',
                fontFamily: settings.fontFamily
              }}>
                Bouton Exemple
              </button>
            </div>
          </div>

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
