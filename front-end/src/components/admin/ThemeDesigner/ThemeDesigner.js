import React, { useState, useEffect } from 'react';
import './ThemeDesigner.css';

const ThemeDesigner = () => {
    const [scope, setScope] = useState('site');
    const [targetId, setTargetId] = useState(null);
    const [themeName, setThemeName] = useState('');
    const [styles, setStyles] = useState({
        header: {
            bg: '#0a0a1f',
            color: '#ffffff',
            fontSize: '16px'
        },
        title: {
            color: '#667eea',
            fontSize: '32px',
            fontWeight: '700'
        },
        body: {
            bg: '#ffffff',
            color: '#333333',
            fontSize: '16px'
        },
        block: {
            bg: '#f8f9fa',
            borderColor: '#e0e0e0',
            borderRadius: '12px',
            padding: '20px'
        },
        primary: '#667eea',
        secondary: '#764ba2',
        accent: '#f093fb'
    });

    const [articles, setArticles] = useState([]);
    const [activeTheme, setActiveTheme] = useState(null);

    useEffect(() => {
        fetchArticles();
        if (scope !== 'site') {
            fetchActiveTheme();
        }
    }, [scope, targetId]);

    const fetchArticles = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/articles');
            if (response.ok) {
                const data = await response.json();
                setArticles(data);
            }
        } catch (error) {
            console.error('Erreur articles:', error);
        }
    };

    const fetchActiveTheme = async () => {
        if (scope === 'site') return;
        
        try {
            const url = scope === 'article' && targetId
                ? `http://localhost:8000/api/themes?scope=article&targetId=${targetId}`
                : `http://localhost:8000/api/themes?scope=${scope}`;
            
            const response = await fetch(url);
            if (response.ok) {
                const themes = await response.json();
                if (themes.length > 0) {
                    setActiveTheme(themes[0]);
                    setStyles(themes[0].styles);
                }
            }
        } catch (error) {
            console.error('Erreur chargement thème:', error);
        }
    };

    const updateStyle = (category, property, value) => {
        setStyles(prev => ({
            ...prev,
            [category]: typeof prev[category] === 'object'
                ? { ...prev[category], [property]: value }
                : value
        }));
    };

    const handleSave = async () => {
        try {
            const payload = {
                name: themeName || `Theme ${scope} ${new Date().toISOString()}`,
                scope,
                targetId: scope === 'article' ? targetId : null,
                styles
            };

            const response = await fetch('http://localhost:8000/api/themes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Thème sauvegardé!');
            }
        } catch (error) {
            console.error('Erreur sauvegarde:', error);
        }
    };

    const handleApply = async () => {
        try {
            const payload = {
                name: themeName || `Theme ${scope}`,
                scope,
                targetId: scope === 'article' ? targetId : null,
                styles,
                isActive: true
            };

            const response = await fetch('http://localhost:8000/api/themes/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert('Thème appliqué!');
            }
        } catch (error) {
            console.error('Erreur application:', error);
        }
    };

    return (
        <div className="theme-designer">
            <h2>Designer de Thème</h2>

            <div className="theme-scope">
                <label>Portée du thème</label>
                <select value={scope} onChange={(e) => setScope(e.target.value)}>
                    <option value="site">Site entier</option>
                    <option value="page">Page spécifique</option>
                    <option value="article">Article spécifique</option>
                </select>

                {scope === 'article' && (
                    <select value={targetId || ''} onChange={(e) => setTargetId(parseInt(e.target.value))}>
                        <option value="">Sélectionner un article</option>
                        {articles.map(a => (
                            <option key={a.id} value={a.id}>{a.title}</option>
                        ))}
                    </select>
                )}

                <input
                    type="text"
                    value={themeName}
                    onChange={(e) => setThemeName(e.target.value)}
                    placeholder="Nom du thème (optionnel)"
                />
            </div>

            <div className="style-sections">
                <div className="style-section">
                    <h3>Header</h3>
                    <div className="style-controls">
                        <div className="control-group">
                            <label>Fond</label>
                            <input
                                type="color"
                                value={styles.header.bg}
                                onChange={(e) => updateStyle('header', 'bg', e.target.value)}
                            />
                        </div>
                        <div className="control-group">
                            <label>Texte</label>
                            <input
                                type="color"
                                value={styles.header.color}
                                onChange={(e) => updateStyle('header', 'color', e.target.value)}
                            />
                        </div>
                        <div className="control-group">
                            <label>Taille police</label>
                            <input
                                type="text"
                                value={styles.header.fontSize}
                                onChange={(e) => updateStyle('header', 'fontSize', e.target.value)}
                                placeholder="16px"
                            />
                        </div>
                    </div>
                </div>

                <div className="style-section">
                    <h3>Titre d'article</h3>
                    <div className="style-controls">
                        <div className="control-group">
                            <label>Couleur</label>
                            <input
                                type="color"
                                value={styles.title.color}
                                onChange={(e) => updateStyle('title', 'color', e.target.value)}
                            />
                        </div>
                        <div className="control-group">
                            <label>Taille</label>
                            <input
                                type="text"
                                value={styles.title.fontSize}
                                onChange={(e) => updateStyle('title', 'fontSize', e.target.value)}
                                placeholder="32px"
                            />
                        </div>
                        <div className="control-group">
                            <label>Épaisseur</label>
                            <input
                                type="text"
                                value={styles.title.fontWeight}
                                onChange={(e) => updateStyle('title', 'fontWeight', e.target.value)}
                                placeholder="700"
                            />
                        </div>
                    </div>
                </div>

                <div className="style-section">
                    <h3>Corps de page</h3>
                    <div className="style-controls">
                        <div className="control-group">
                            <label>Fond</label>
                            <input
                                type="color"
                                value={styles.body.bg}
                                onChange={(e) => updateStyle('body', 'bg', e.target.value)}
                            />
                        </div>
                        <div className="control-group">
                            <label>Texte</label>
                            <input
                                type="color"
                                value={styles.body.color}
                                onChange={(e) => updateStyle('body', 'color', e.target.value)}
                            />
                        </div>
                        <div className="control-group">
                            <label>Taille police</label>
                            <input
                                type="text"
                                value={styles.body.fontSize}
                                onChange={(e) => updateStyle('body', 'fontSize', e.target.value)}
                                placeholder="16px"
                            />
                        </div>
                    </div>
                </div>

                <div className="style-section">
                    <h3>Blocs</h3>
                    <div className="style-controls">
                        <div className="control-group">
                            <label>Fond</label>
                            <input
                                type="color"
                                value={styles.block.bg}
                                onChange={(e) => updateStyle('block', 'bg', e.target.value)}
                            />
                        </div>
                        <div className="control-group">
                            <label>Bordure</label>
                            <input
                                type="color"
                                value={styles.block.borderColor}
                                onChange={(e) => updateStyle('block', 'borderColor', e.target.value)}
                            />
                        </div>
                        <div className="control-group">
                            <label>Arrondi</label>
                            <input
                                type="text"
                                value={styles.block.borderRadius}
                                onChange={(e) => updateStyle('block', 'borderRadius', e.target.value)}
                                placeholder="12px"
                            />
                        </div>
                        <div className="control-group">
                            <label>Padding</label>
                            <input
                                type="text"
                                value={styles.block.padding}
                                onChange={(e) => updateStyle('block', 'padding', e.target.value)}
                                placeholder="20px"
                            />
                        </div>
                    </div>
                </div>

                <div className="style-section">
                    <h3>Couleurs d'accent</h3>
                    <div className="style-controls">
                        <div className="control-group">
                            <label>Primaire</label>
                            <input
                                type="color"
                                value={styles.primary}
                                onChange={(e) => updateStyle('primary', null, e.target.value)}
                            />
                        </div>
                        <div className="control-group">
                            <label>Secondaire</label>
                            <input
                                type="color"
                                value={styles.secondary}
                                onChange={(e) => updateStyle('secondary', null, e.target.value)}
                            />
                        </div>
                        <div className="control-group">
                            <label>Accent</label>
                            <input
                                type="color"
                                value={styles.accent}
                                onChange={(e) => updateStyle('accent', null, e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="theme-preview">
                <h3>Aperçu</h3>
                <div className="preview-container" style={{
                    background: styles.body.bg,
                    color: styles.body.color,
                    fontSize: styles.body.fontSize
                }}>
                    <div className="preview-header" style={{
                        background: styles.header.bg,
                        color: styles.header.color,
                        fontSize: styles.header.fontSize,
                        padding: '1rem'
                    }}>
                        Header Example
                    </div>
                    <div style={{ padding: '2rem' }}>
                        <h1 style={{
                            color: styles.title.color,
                            fontSize: styles.title.fontSize,
                            fontWeight: styles.title.fontWeight
                        }}>
                            Titre d'Article
                        </h1>
                        <div style={{
                            background: styles.block.bg,
                            borderColor: styles.block.borderColor,
                            borderRadius: styles.block.borderRadius,
                            padding: styles.block.padding,
                            border: `1px solid ${styles.block.borderColor}`,
                            marginTop: '1rem'
                        }}>
                            Contenu du bloc d'article avec les styles appliqués
                        </div>
                    </div>
                </div>
            </div>

            <div className="theme-actions">
                <button onClick={handleSave} className="btn-save">Sauvegarder</button>
                <button onClick={handleApply} className="btn-apply">Appliquer</button>
            </div>
        </div>
    );
};

export default ThemeDesigner;
