import React, { useState, useEffect, lazy, Suspense } from 'react';
import './AdminDashboard.css';

const DesignPanel = lazy(() => import('../DesignPanel/DesignPanel'));
const Datasets = lazy(() => import('../Datasets/Datasets'));

function AdminDashboard({ user, onBack }) {
  // Déterminer l'onglet par défaut selon le rôle
  const getDefaultTab = () => {
    if (user.roles?.includes('ROLE_ADMIN')) return 'stats';
    if (user.roles?.includes('ROLE_DATA_PROVIDER')) return 'stats';
    if (user.roles?.includes('ROLE_EDITOR')) return 'articles';
    if (user.roles?.includes('ROLE_AUTHOR')) return 'articles';
    if (user.roles?.includes('ROLE_DESIGNER')) return 'stats';
    return 'stats';
  };

  const [activeTab, setActiveTab] = useState(getDefaultTab());
  const [stats, setStats] = useState({
    totalUsers: 0,
    admins: 0,
    authors: 0,
    premium: 0,
    totalArticles: 0,
    publishedArticles: 0
  });
  const [users, setUsers] = useState([]);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDesignPanel, setShowDesignPanel] = useState(false);
  const [showDatasetsPanel, setShowDatasetsPanel] = useState(false);
  const [showUploadPanel, setShowUploadPanel] = useState(false);

  // Vérifier si l'utilisateur a accès à un onglet
  const hasAccess = (tab) => {
    if (user.roles?.includes('ROLE_ADMIN')) return true;
    if (tab === 'stats' && user.roles?.includes('ROLE_DATA_PROVIDER')) return true;
    if (tab === 'articles' && (user.roles?.includes('ROLE_EDITOR') || user.roles?.includes('ROLE_AUTHOR'))) return true;
    if (tab === 'users' && user.roles?.includes('ROLE_ADMIN')) return true;
    return false;
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token récupéré:', token ? token.substring(0, 50) + '...' : 'ABSENT !');
      
      if (!token) {
        alert('Session expirée, veuillez vous reconnecter');
        localStorage.clear();
        window.location.reload();
        return;
      }
      
      // Vérifier l'utilisateur connecté
      const userStr = localStorage.getItem('user');
      console.log('User localStorage:', userStr);
      if (userStr) {
        const userObj = JSON.parse(userStr);
        console.log('User roles:', userObj.roles);
      }
      
      const headers = { 'Authorization': `Bearer ${token}` };

      console.log('Appel API stats...');
      const statsRes = await fetch('http://localhost:8000/api/admin/stats', { headers });
      console.log('Stats response:', statsRes.status, statsRes.ok);
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        console.log('Stats data:', statsData);
        setStats(prev => ({ ...prev, ...statsData }));
      } else {
        const errorText = await statsRes.text();
        console.error('Stats error:', statsRes.status, errorText);
        
        // Si token expiré, déconnecter
        if (statsRes.status === 401) {
          alert('Session expirée, veuillez vous reconnecter');
          localStorage.clear();
          window.location.reload();
          return;
        }
        alert(`Erreur stats: ${statsRes.status} - ${errorText}`);
      }

      console.log('Appel API users...');
      const usersRes = await fetch('http://localhost:8000/api/admin/users', { headers });
      console.log('Users response:', usersRes.status, usersRes.ok);
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        console.log('Users data:', usersData, 'Count:', usersData.length);
        setUsers(usersData);
      } else {
        const errorText = await usersRes.text();
        console.error('Users error:', usersRes.status, errorText);
        
        // Si token expiré, déconnecter
        if (usersRes.status === 401) {
          alert('Session expirée, veuillez vous reconnecter');
          localStorage.clear();
          window.location.reload();
          return;
        }
        alert(`Erreur users: ${usersRes.status} - ${errorText}`);
      }

      console.log('Appel API articles...');
      const articlesRes = await fetch('http://localhost:8000/api/articles');
      console.log('Articles response:', articlesRes.status, articlesRes.ok);
      if (articlesRes.ok) {
        const articlesData = await articlesRes.json();
        console.log('Articles data:', articlesData.length);
        setArticles(articlesData);
        setStats(prev => ({
          ...prev,
          totalArticles: articlesData.length,
          publishedArticles: articlesData.filter(a => a.published).length
        }));
      } else {
        console.error('Articles error:', await articlesRes.text());
      }

      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement dashboard:', error);
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, updates) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        await fetchDashboardData();
        alert('Utilisateur mis à jour !');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error || 'Échec de la mise à jour'}`);
      }
    } catch (error) {
      console.error('Erreur mise à jour utilisateur:', error);
      alert('Erreur réseau');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Vraiment supprimer cet utilisateur ?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await fetchDashboardData();
        alert('Utilisateur supprimé !');
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error || 'Échec de la suppression'}`);
      }
    } catch (error) {
      console.error('Erreur suppression utilisateur:', error);
      alert('Erreur réseau');
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (!window.confirm('Vraiment supprimer cet article ?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/articles/${articleId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        await fetchDashboardData();
        alert('Article supprimé !');
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression article:', error);
      alert('Erreur réseau');
    }
  };

  const toggleRole = (userId, role) => {
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) return;

    const currentRoles = targetUser.roles || ['ROLE_USER'];
    const newRoles = currentRoles.includes(role)
      ? currentRoles.filter(r => r !== role)
      : [...currentRoles, role];

    handleUpdateUser(userId, { roles: newRoles });
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-admin">Chargement du dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <button onClick={onBack} className="back-btn">← Retour</button>
        <h1>🎛️ Dashboard {
          user.roles?.includes('ROLE_ADMIN') ? 'Administration' :
          user.roles?.includes('ROLE_EDITOR') ? 'Éditeur' :
          user.roles?.includes('ROLE_AUTHOR') ? 'Auteur' :
          user.roles?.includes('ROLE_DESIGNER') ? 'Designer' :
          user.roles?.includes('ROLE_DATA_PROVIDER') ? 'Statistiques' : ''
        }</h1>
        <div className="header-user">
          <span className="admin-badge">
            {user.roles?.includes('ROLE_ADMIN') ? 'ADMIN' :
             user.roles?.includes('ROLE_EDITOR') ? 'EDITOR' :
             user.roles?.includes('ROLE_AUTHOR') ? 'AUTHOR' :
             user.roles?.includes('ROLE_DESIGNER') ? 'DESIGNER' :
             user.roles?.includes('ROLE_DATA_PROVIDER') ? 'PROVIDER' : 'USER'}
          </span>
          <span>{user.email}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        {hasAccess('stats') && (
          <button 
            className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
            onClick={() => setActiveTab('stats')}
          >
            📊 Statistiques
          </button>
        )}
        {hasAccess('users') && (
          <button 
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Utilisateurs ({users.length})
          </button>
        )}
        {hasAccess('articles') && (
          <button 
            className={`tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
            onClick={() => setActiveTab('articles')}
          >
            📝 Articles ({articles.length})
          </button>
        )}
      </div>

      {/* Content */}
      {activeTab === 'stats' && (
        <>
          <div className="stats-overview">
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <h3>{stats.totalUsers}</h3>
                <p>Utilisateurs</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📝</div>
              <div className="stat-content">
                <h3>{stats.totalArticles}</h3>
                <p>Articles</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">✅</div>
              <div className="stat-content">
                <h3>{stats.publishedArticles}</h3>
                <p>Publiés</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <h3>{stats.premium}</h3>
                <p>Premium</p>
              </div>
            </div>
          </div>

          {/* Actions Rapides */}
          <div className="quick-actions-section">
            <h3 style={{ marginBottom: '1rem', color: '#7D3CFF' }}>⚡ Actions Rapides</h3>
            <div className="quick-actions-grid">
              {(user.roles?.includes('ROLE_DATA_PROVIDER') || user.roles?.includes('ROLE_ADMIN')) && (
                <button className="quick-action-btn" onClick={() => setShowDatasetsPanel(true)}>
                  <span className="action-icon">📊</span>
                  <span className="action-text">
                    <strong>Dataset Manager</strong>
                    <small>Gérer les datasets</small>
                  </span>
                </button>
              )}
              {(user.roles?.includes('ROLE_DESIGNER') || user.roles?.includes('ROLE_ADMIN')) && (
                <button className="quick-action-btn" onClick={() => setShowDesignPanel(true)}>
                  <span className="action-icon">🎨</span>
                  <span className="action-text">
                    <strong>Theme Designer</strong>
                    <small>Personnaliser le design</small>
                  </span>
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="dashboard-section full-width">
          <div className="section-title">
            <h2>Gestion des Utilisateurs</h2>
            <button onClick={fetchDashboardData} className="refresh-btn">🔄 Rafraîchir</button>
          </div>
          <div className="users-table">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Rôles</th>
                  <th>Abonnement</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td><strong>{u.email}</strong></td>
                    <td>
                      <div className="roles-cell">
                        {['ROLE_ADMIN', 'ROLE_AUTHOR', 'ROLE_EDITOR', 'ROLE_DESIGNER'].map(role => (
                          <button
                            key={role}
                            className={`role-badge ${u.roles?.includes(role) ? 'active' : ''}`}
                            onClick={() => toggleRole(u.id, role)}
                          >
                            {role.replace('ROLE_', '')}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td>
                      <select 
                        className="subscription-select"
                        value={u.subscriptionLevel || 'free'}
                        onChange={(e) => handleUpdateUser(u.id, { subscriptionLevel: e.target.value })}
                      >
                        <option value="free">Free</option>
                        <option value="silver">Silver</option>
                        <option value="gold">Gold</option>
                      </select>
                    </td>
                    <td>
                      <button 
                        onClick={() => handleDeleteUser(u.id)} 
                        className="delete-btn"
                        disabled={u.roles?.includes('ROLE_ADMIN')}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'articles' && (
        <div className="dashboard-section full-width">
          <div className="section-title">
            <h2>Gestion des Articles</h2>
            <button onClick={fetchDashboardData} className="refresh-btn">🔄 Rafraîchir</button>
          </div>
          <div className="articles-grid">
            {articles.map(article => (
              <div key={article.id} className="article-card">
                <div className="article-header">
                  <h4>{article.title}</h4>
                  <span className={`status ${article.published ? 'published' : 'draft'}`}>
                    {article.published ? '✅ Publié' : '📝 Brouillon'}
                  </span>
                </div>
                <div className="article-meta">
                  <span>👁️ {article.views || 0} vues</span>
                  <span>⭐ {article.rating || 0}/5</span>
                </div>
                <div className="article-actions">
                  <button 
                    className="edit-btn"
                    onClick={() => window.location.href = `#/editor/${article.id}`}
                  >
                    ✏️ Modifier
                  </button>
                  {user.roles?.includes('ROLE_ADMIN') && (
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteArticle(article.id)}
                    >
                      🗑️ Supprimer
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'design' && (
        <div className="dashboard-section full-width">
          <div className="section-title">
            <h2>🎨 Design System</h2>
            <button onClick={() => {
              if (window.confirm('Réinitialiser tous les paramètres de design ?')) {
                localStorage.removeItem('designSettings');
                window.location.reload();
              }
            }} className="refresh-btn">🔄 Reset</button>
          </div>
          
          <div className="design-grid">
            {/* Couleurs du site */}
            <div className="design-card">
              <h3>🎨 Couleurs principales</h3>
              <div className="color-controls">
                <div className="color-input-group">
                  <label>Couleur primaire</label>
                  <input type="color" defaultValue="#667eea" 
                    onChange={(e) => {
                      document.documentElement.style.setProperty('--primary-color', e.target.value);
                      localStorage.setItem('primaryColor', e.target.value);
                    }}
                  />
                </div>
                <div className="color-input-group">
                  <label>Couleur secondaire</label>
                  <input type="color" defaultValue="#764ba2" 
                    onChange={(e) => {
                      document.documentElement.style.setProperty('--secondary-color', e.target.value);
                      localStorage.setItem('secondaryColor', e.target.value);
                    }}
                  />
                </div>
                <div className="color-input-group">
                  <label>Couleur accent</label>
                  <input type="color" defaultValue="#ff4655" 
                    onChange={(e) => {
                      document.documentElement.style.setProperty('--accent-color', e.target.value);
                      localStorage.setItem('accentColor', e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Background */}
            <div className="design-card">
              <h3>🌈 Arrière-plan</h3>
              <div className="bg-controls">
                <label>Style de fond</label>
                <select className="design-select" onChange={(e) => {
                  const value = e.target.value;
                  localStorage.setItem('bgStyle', value);
                  document.body.className = value;
                }}>
                  <option value="gradient-dark">Gradient sombre (défaut)</option>
                  <option value="gradient-purple">Gradient violet</option>
                  <option value="gradient-blue">Gradient bleu</option>
                  <option value="solid-dark">Uni sombre</option>
                  <option value="solid-black">Uni noir</option>
                </select>
              </div>
            </div>

            {/* Navbar */}
            <div className="design-card full-span">
              <h3>📋 Configuration Navbar</h3>
              <div className="navbar-config">
                <div className="navbar-items">
                  <p><strong>Ordre des éléments :</strong></p>
                  <div className="sortable-list">
                    <div className="sortable-item" draggable>📱 Accueil</div>
                    <div className="sortable-item" draggable>🎮 Jeux</div>
                    <div className="sortable-item" draggable>👥 Équipe</div>
                    <div className="sortable-item" draggable>🎯 Joueurs</div>
                    <div className="sortable-item" draggable>💳 Abonnement</div>
                    <div className="sortable-item" draggable>📰 News</div>
                  </div>
                  <p style={{ marginTop: '1rem', fontSize: '0.85rem', opacity: 0.7 }}>
                    ⚠️ Glissez-déposez pour réorganiser (fonctionnalité en développement)
                  </p>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="design-card">
              <h3>✍️ Typographie</h3>
              <div className="typo-controls">
                <div className="input-group">
                  <label>Police principale</label>
                  <select className="design-select" onChange={(e) => {
                    document.documentElement.style.setProperty('--font-family', e.target.value);
                    localStorage.setItem('fontFamily', e.target.value);
                  }}>
                    <option value="'Inter', sans-serif">Inter (défaut)</option>
                    <option value="'Roboto', sans-serif">Roboto</option>
                    <option value="'Poppins', sans-serif">Poppins</option>
                    <option value="'Montserrat', sans-serif">Montserrat</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Taille de base</label>
                  <input type="range" min="12" max="20" defaultValue="16" 
                    onChange={(e) => {
                      document.documentElement.style.fontSize = e.target.value + 'px';
                      localStorage.setItem('fontSize', e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bordures */}
            <div className="design-card">
              <h3>📐 Bordures et espacement</h3>
              <div className="spacing-controls">
                <div className="input-group">
                  <label>Arrondi des bordures</label>
                  <input type="range" min="0" max="24" defaultValue="12" 
                    onChange={(e) => {
                      document.documentElement.style.setProperty('--border-radius', e.target.value + 'px');
                      localStorage.setItem('borderRadius', e.target.value);
                    }}
                  />
                  <span className="range-value" id="borderRadiusValue">12px</span>
                </div>
              </div>
            </div>

            {/* Header */}
            <div className="design-card full-span">
              <h3>🎯 Header & Logo</h3>
              <div className="header-controls">
                <div className="input-group">
                  <label>Position du logo</label>
                  <select className="design-select" onChange={(e) => {
                    localStorage.setItem('logoPosition', e.target.value);
                  }}>
                    <option value="left">Gauche (défaut)</option>
                    <option value="center">Centre</option>
                    <option value="right">Droite</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Hauteur du header</label>
                  <select className="design-select">
                    <option value="60">Compact (60px)</option>
                    <option value="80" selected>Normal (80px)</option>
                    <option value="100">Large (100px)</option>
                  </select>
                </div>
                <div className="input-group">
                  <label>Transparence</label>
                  <input type="checkbox" /> Header transparent
                </div>
              </div>
            </div>

            {/* Aperçu */}
            <div className="design-card full-span preview-card">
              <h3>👁️ Aperçu en direct</h3>
              <div className="preview-box">
                <div className="preview-header" style={{
                  background: 'linear-gradient(135deg, var(--primary-color, #667eea), var(--secondary-color, #764ba2))',
                  padding: '1rem',
                  borderRadius: 'var(--border-radius, 12px)',
                  color: 'white',
                  marginBottom: '1rem'
                }}>
                  <strong>M8 PULSE</strong> - Header Example
                </div>
                <button style={{
                  background: 'linear-gradient(135deg, var(--primary-color, #667eea), var(--secondary-color, #764ba2))',
                  border: 'none',
                  color: 'white',
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--border-radius, 12px)',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}>
                  Bouton exemple
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Popups */}
      {showDesignPanel && (
        <Suspense fallback={null}>
          <DesignPanel onClose={() => setShowDesignPanel(false)} />
        </Suspense>
      )}

      {showDatasetsPanel && (
        <Suspense fallback={<div className="loading-overlay">Chargement...</div>}>
          <div className="modal-overlay" onClick={() => setShowDatasetsPanel(false)}>
            <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowDatasetsPanel(false)}>×</button>
              <Datasets user={user} />
            </div>
          </div>
        </Suspense>
      )}

      {showUploadPanel && (
        <div className="modal-overlay" onClick={() => setShowUploadPanel(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowUploadPanel(false)}>×</button>
            <div style={{ padding: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem', color: '#7D3CFF' }}>📤 Importer un fichier XLSX</h2>
              <div className="upload-zone">
                <input 
                  type="file" 
                  accept=".xlsx,.xls"
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const formData = new FormData();
                    formData.append('file', file);

                    try {
                      const token = localStorage.getItem('token');
                      const response = await fetch('http://localhost:8000/api/datasets/upload', {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}` },
                        body: formData
                      });

                      if (response.ok) {
                        alert('✅ Fichier uploadé avec succès !');
                        setShowUploadPanel(false);
                        fetchDashboardData();
                      } else {
                        const error = await response.json();
                        alert(`❌ Erreur: ${error.error || 'Échec de l\'upload'}`);
                      }
                    } catch (error) {
                      console.error('Erreur upload:', error);
                      alert('❌ Erreur réseau');
                    }
                  }}
                  style={{
                    padding: '2rem',
                    border: '2px dashed #7D3CFF',
                    borderRadius: '12px',
                    width: '100%',
                    cursor: 'pointer',
                    fontSize: '1rem'
                  }}
                />
                <p style={{ marginTop: '1rem', color: '#7f8c8d', fontSize: '0.9rem' }}>
                  Formats acceptés: .xlsx, .xls
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
