import React, { useState } from 'react';
import './DashboardPage.css';

function DashboardPage({ currentGame }) {
  const [activeSection, setActiveSection] = useState('overview');
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [showThemeForm, setShowThemeForm] = useState(false);
  
  const [articleForm, setArticleForm] = useState({
    title: '',
    game: 'Valorant',
    category: 'news',
    image: '',
    content: '',
    featured: false
  });

  const [matchForm, setMatchForm] = useState({
    team1: '',
    team2: '',
    score1: '',
    score2: '',
    game: 'Valorant',
    date: '',
    tournament: ''
  });

  const [themeForm, setThemeForm] = useState({
    teamName: 'M8 Esports',
    primaryColor: '#7D3CFF',
    secondaryColor: '#9D5CFF',
    accentColor: '#FF4655',
    logo: '',
    backgroundImage: ''
  });

  const themePresets = [
    {
      name: 'M8 Esports',
      primaryColor: '#7D3CFF',
      secondaryColor: '#9D5CFF',
      accentColor: '#FF4655',
      logo: 'https://example.com/m8-logo.png'
    },
    {
      name: 'Team Liquid',
      primaryColor: '#1E3A8A',
      secondaryColor: '#3B82F6',
      accentColor: '#60A5FA',
      logo: 'https://example.com/liquid-logo.png'
    },
    {
      name: 'Karmine Corp',
      primaryColor: '#3B82F6',
      secondaryColor: '#60A5FA',
      accentColor: '#93C5FD',
      logo: 'https://example.com/kc-logo.png'
    },
    {
      name: 'Fnatic',
      primaryColor: '#FF5722',
      secondaryColor: '#FF6F3C',
      accentColor: '#FF8A50',
      logo: 'https://example.com/fnatic-logo.png'
    },
    {
      name: 'G2 Esports',
      primaryColor: '#FF4655',
      secondaryColor: '#FF6B76',
      accentColor: '#FF8A93',
      logo: 'https://example.com/g2-logo.png'
    }
  ];

  const stats = {
    totalArticles: 47,
    totalMatches: 128,
    totalUsers: 2847,
    pendingApprovals: 5
  };

  const recentArticles = [
    { id: 1, title: 'M8 Esports wins VCT Championship', game: 'Valorant', date: '2h ago', status: 'published' },
    { id: 2, title: 'New roster announced for CS2', game: 'CS2', date: '5h ago', status: 'published' },
    { id: 3, title: 'Interview with team captain', game: 'Valorant', date: '1d ago', status: 'draft' },
  ];

  const recentMatches = [
    { id: 1, team1: 'M8 Esports', team2: 'Team Liquid', score: '13-11', game: 'Valorant', date: '2024-12-08' },
    { id: 2, team1: 'M8 Esports', team2: 'Fnatic', score: '10-13', game: 'CS2', date: '2024-12-07' },
    { id: 3, team1: 'M8 Esports', team2: 'G2', score: '13-8', game: 'Valorant', date: '2024-12-06' },
  ];

  const handleArticleSubmit = (e) => {
    e.preventDefault();
    console.log('Creating article:', articleForm);
    setShowArticleForm(false);
    setArticleForm({
      title: '',
      game: 'Valorant',
      category: 'news',
      image: '',
      content: '',
      featured: false
    });
  };

  const handleMatchSubmit = (e) => {
    e.preventDefault();
    console.log('Creating match:', matchForm);
    setShowMatchForm(false);
    setMatchForm({
      team1: '',
      team2: '',
      score1: '',
      score2: '',
      game: 'Valorant',
      date: '',
      tournament: ''
    });
  };

  const handleThemeSubmit = (e) => {
    e.preventDefault();
    console.log('Applying theme:', themeForm);
    // Ici on peut appliquer le thème en modifiant les CSS variables
    document.documentElement.style.setProperty('--primary-color', themeForm.primaryColor);
    document.documentElement.style.setProperty('--secondary-color', themeForm.secondaryColor);
    document.documentElement.style.setProperty('--accent-color', themeForm.accentColor);
    setShowThemeForm(false);
  };

  const applyPreset = (preset) => {
    setThemeForm({
      ...themeForm,
      teamName: preset.name,
      primaryColor: preset.primaryColor,
      secondaryColor: preset.secondaryColor,
      accentColor: preset.accentColor,
      logo: preset.logo
    });
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Gérer le contenu du site M8 Pulse</p>
      </div>

      {/* Navigation Tabs */}
      <div className="dashboard-nav">
        <button 
          className={`nav-tab ${activeSection === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveSection('overview')}
        >
          📊 Vue d'ensemble
        </button>
        <button 
          className={`nav-tab ${activeSection === 'articles' ? 'active' : ''}`}
          onClick={() => setActiveSection('articles')}
        >
          📝 Articles
        </button>
        <button 
          className={`nav-tab ${activeSection === 'matches' ? 'active' : ''}`}
          onClick={() => setActiveSection('matches')}
        >
          🎮 Matchs
        </button>
        <button 
          className={`nav-tab ${activeSection === 'users' ? 'active' : ''}`}
          onClick={() => setActiveSection('users')}
        >
          👥 Utilisateurs
        </button>
        <button 
          className={`nav-tab ${activeSection === 'theme' ? 'active' : ''}`}
          onClick={() => setActiveSection('theme')}
        >
          🎨 Thème
        </button>
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="dashboard-grid">
          <div className="dashboard-card stats-overview">
            <h2>📊 Statistiques du site</h2>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-value">{stats.totalArticles}</span>
                <span className="stat-label">Articles</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.totalMatches}</span>
                <span className="stat-label">Matchs</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.totalUsers}</span>
                <span className="stat-label">Utilisateurs</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{stats.pendingApprovals}</span>
                <span className="stat-label">En attente</span>
              </div>
            </div>
          </div>

          <div className="dashboard-card quick-actions">
            <h2>⚡ Actions rapides</h2>
            <div className="actions-grid">
              <button className="action-btn" onClick={() => {
                setActiveSection('articles');
                setShowArticleForm(true);
              }}>
                ➕ Nouvel article
              </button>
              <button className="action-btn" onClick={() => {
                setActiveSection('matches');
                setShowMatchForm(true);
              }}>
                ➕ Nouveau match
              </button>
              <button className="action-btn">⚙️ Paramètres</button>
              <button className="action-btn">📈 Analytics</button>
            </div>
          </div>

          <div className="dashboard-card recent-activity">
            <h2>📈 Activité récente</h2>
            <div className="activity-list">
              {recentArticles.slice(0, 3).map(article => (
                <div key={article.id} className="activity-item">
                  <div className="activity-icon">📝</div>
                  <div className="activity-details">
                    <span className="activity-title">{article.title}</span>
                    <span className="activity-meta">{article.game} • {article.date}</span>
                  </div>
                  <span className={`status-badge ${article.status}`}>{article.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Articles Section */}
      {activeSection === 'articles' && (
        <div className="content-section">
          <div className="section-header">
            <h2>📝 Gestion des articles</h2>
            <button className="create-btn" onClick={() => setShowArticleForm(!showArticleForm)}>
              ➕ Créer un article
            </button>
          </div>

          {showArticleForm && (
            <div className="dashboard-card form-card">
              <h3>Nouvel article</h3>
              <form onSubmit={handleArticleSubmit} className="content-form">
                <div className="form-group">
                  <label>Titre</label>
                  <input
                    type="text"
                    value={articleForm.title}
                    onChange={(e) => setArticleForm({...articleForm, title: e.target.value})}
                    placeholder="Titre de l'article"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Jeu</label>
                    <select
                      value={articleForm.game}
                      onChange={(e) => setArticleForm({...articleForm, game: e.target.value})}
                    >
                      <option value="Valorant">Valorant</option>
                      <option value="CS2">CS2</option>
                      <option value="COD">Call of Duty</option>
                      <option value="Fortnite">Fortnite</option>
                      <option value="League of Legends">League of Legends</option>
                      <option value="Rocket League">Rocket League</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Catégorie</label>
                    <select
                      value={articleForm.category}
                      onChange={(e) => setArticleForm({...articleForm, category: e.target.value})}
                    >
                      <option value="news">News</option>
                      <option value="interview">Interview</option>
                      <option value="analysis">Analyse</option>
                      <option value="announcement">Annonce</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>URL de l'image</label>
                  <input
                    type="url"
                    value={articleForm.image}
                    onChange={(e) => setArticleForm({...articleForm, image: e.target.value})}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label>Contenu</label>
                  <textarea
                    value={articleForm.content}
                    onChange={(e) => setArticleForm({...articleForm, content: e.target.value})}
                    placeholder="Contenu de l'article..."
                    rows="8"
                    required
                  ></textarea>
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={articleForm.featured}
                      onChange={(e) => setArticleForm({...articleForm, featured: e.target.checked})}
                    />
                    <span>Article en vedette</span>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn">Publier</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowArticleForm(false)}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="dashboard-card">
            <h3>Articles récents</h3>
            <div className="content-table">
              <table>
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Jeu</th>
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentArticles.map(article => (
                    <tr key={article.id}>
                      <td>{article.title}</td>
                      <td><span className="game-tag">{article.game}</span></td>
                      <td>{article.date}</td>
                      <td><span className={`status-badge ${article.status}`}>{article.status}</span></td>
                      <td>
                        <button className="icon-btn">✏️</button>
                        <button className="icon-btn">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Matches Section */}
      {activeSection === 'matches' && (
        <div className="content-section">
          <div className="section-header">
            <h2>🎮 Gestion des matchs</h2>
            <button className="create-btn" onClick={() => setShowMatchForm(!showMatchForm)}>
              ➕ Ajouter un match
            </button>
          </div>

          {showMatchForm && (
            <div className="dashboard-card form-card">
              <h3>Nouveau match</h3>
              <form onSubmit={handleMatchSubmit} className="content-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Équipe 1</label>
                    <input
                      type="text"
                      value={matchForm.team1}
                      onChange={(e) => setMatchForm({...matchForm, team1: e.target.value})}
                      placeholder="Nom de l'équipe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Score</label>
                    <input
                      type="number"
                      value={matchForm.score1}
                      onChange={(e) => setMatchForm({...matchForm, score1: e.target.value})}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Équipe 2</label>
                    <input
                      type="text"
                      value={matchForm.team2}
                      onChange={(e) => setMatchForm({...matchForm, team2: e.target.value})}
                      placeholder="Nom de l'équipe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Score</label>
                    <input
                      type="number"
                      value={matchForm.score2}
                      onChange={(e) => setMatchForm({...matchForm, score2: e.target.value})}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Jeu</label>
                    <select
                      value={matchForm.game}
                      onChange={(e) => setMatchForm({...matchForm, game: e.target.value})}
                    >
                      <option value="Valorant">Valorant</option>
                      <option value="CS2">CS2</option>
                      <option value="COD">Call of Duty</option>
                      <option value="Fortnite">Fortnite</option>
                      <option value="League of Legends">League of Legends</option>
                      <option value="Rocket League">Rocket League</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Date</label>
                    <input
                      type="date"
                      value={matchForm.date}
                      onChange={(e) => setMatchForm({...matchForm, date: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Tournoi</label>
                  <input
                    type="text"
                    value={matchForm.tournament}
                    onChange={(e) => setMatchForm({...matchForm, tournament: e.target.value})}
                    placeholder="Nom du tournoi"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn">Enregistrer</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowMatchForm(false)}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="dashboard-card">
            <h3>Matchs récents</h3>
            <div className="content-table">
              <table>
                <thead>
                  <tr>
                    <th>Équipe 1</th>
                    <th>Score</th>
                    <th>Équipe 2</th>
                    <th>Jeu</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentMatches.map(match => (
                    <tr key={match.id}>
                      <td>{match.team1}</td>
                      <td className="score-cell">{match.score}</td>
                      <td>{match.team2}</td>
                      <td><span className="game-tag">{match.game}</span></td>
                      <td>{match.date}</td>
                      <td>
                        <button className="icon-btn">✏️</button>
                        <button className="icon-btn">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Users Section */}
      {activeSection === 'users' && (
        <div className="content-section">
          <div className="section-header">
            <h2>👥 Gestion des utilisateurs</h2>
          </div>
          <div className="dashboard-card">
            <p style={{color: '#999', textAlign: 'center', padding: '40px'}}>
              Section en cours de développement...
            </p>
          </div>
        </div>
      )}

      {/* Theme Section */}
      {activeSection === 'theme' && (
        <div className="content-section">
          <div className="section-header">
            <h2>🎨 Gestion du thème</h2>
            <button className="create-btn" onClick={() => setShowThemeForm(!showThemeForm)}>
              {showThemeForm ? '✕ Fermer' : '✏️ Personnaliser'}
            </button>
          </div>

          {/* Theme Presets */}
          <div className="dashboard-card">
            <h3>Thèmes prédéfinis</h3>
            <div className="theme-presets">
              {themePresets.map((preset, index) => (
                <div key={index} className="theme-preset-card" onClick={() => applyPreset(preset)}>
                  <div className="preset-colors">
                    <div className="color-preview" style={{background: preset.primaryColor}}></div>
                    <div className="color-preview" style={{background: preset.secondaryColor}}></div>
                    <div className="color-preview" style={{background: preset.accentColor}}></div>
                  </div>
                  <div className="preset-info">
                    <h4>{preset.name}</h4>
                    <button className="apply-btn">Appliquer</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Theme Form */}
          {showThemeForm && (
            <div className="dashboard-card form-card">
              <h3>Personnaliser le thème</h3>
              <form onSubmit={handleThemeSubmit} className="content-form">
                <div className="form-group">
                  <label>Nom de l'équipe</label>
                  <input
                    type="text"
                    value={themeForm.teamName}
                    onChange={(e) => setThemeForm({...themeForm, teamName: e.target.value})}
                    placeholder="M8 Esports"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Couleur primaire</label>
                    <div className="color-input-group">
                      <input
                        type="color"
                        value={themeForm.primaryColor}
                        onChange={(e) => setThemeForm({...themeForm, primaryColor: e.target.value})}
                      />
                      <input
                        type="text"
                        value={themeForm.primaryColor}
                        onChange={(e) => setThemeForm({...themeForm, primaryColor: e.target.value})}
                        placeholder="#7D3CFF"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Couleur secondaire</label>
                    <div className="color-input-group">
                      <input
                        type="color"
                        value={themeForm.secondaryColor}
                        onChange={(e) => setThemeForm({...themeForm, secondaryColor: e.target.value})}
                      />
                      <input
                        type="text"
                        value={themeForm.secondaryColor}
                        onChange={(e) => setThemeForm({...themeForm, secondaryColor: e.target.value})}
                        placeholder="#9D5CFF"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Couleur d'accent</label>
                  <div className="color-input-group">
                    <input
                      type="color"
                      value={themeForm.accentColor}
                      onChange={(e) => setThemeForm({...themeForm, accentColor: e.target.value})}
                    />
                    <input
                      type="text"
                      value={themeForm.accentColor}
                      onChange={(e) => setThemeForm({...themeForm, accentColor: e.target.value})}
                      placeholder="#FF4655"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>URL du logo</label>
                  <input
                    type="url"
                    value={themeForm.logo}
                    onChange={(e) => setThemeForm({...themeForm, logo: e.target.value})}
                    placeholder="https://..."
                  />
                </div>

                <div className="form-group">
                  <label>URL de l'image de fond</label>
                  <input
                    type="url"
                    value={themeForm.backgroundImage}
                    onChange={(e) => setThemeForm({...themeForm, backgroundImage: e.target.value})}
                    placeholder="https://..."
                  />
                </div>

                <div className="theme-preview-box">
                  <h4>Aperçu</h4>
                  <div className="preview-content" style={{
                    background: `linear-gradient(135deg, ${themeForm.primaryColor}, ${themeForm.secondaryColor})`,
                  }}>
                    <div className="preview-text" style={{color: 'white'}}>
                      {themeForm.teamName}
                    </div>
                    <div className="preview-accent" style={{background: themeForm.accentColor}}></div>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn">Appliquer le thème</button>
                  <button type="button" className="cancel-btn" onClick={() => setShowThemeForm(false)}>
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Current Theme Info */}
          <div className="dashboard-card">
            <h3>Thème actuel</h3>
            <div className="current-theme-display">
              <div className="theme-info-row">
                <span className="theme-label">Équipe :</span>
                <span className="theme-value">{themeForm.teamName}</span>
              </div>
              <div className="theme-info-row">
                <span className="theme-label">Couleurs :</span>
                <div className="color-swatches">
                  <div className="color-swatch" style={{background: themeForm.primaryColor}} title={themeForm.primaryColor}></div>
                  <div className="color-swatch" style={{background: themeForm.secondaryColor}} title={themeForm.secondaryColor}></div>
                  <div className="color-swatch" style={{background: themeForm.accentColor}} title={themeForm.accentColor}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
