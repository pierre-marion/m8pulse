import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ user, onBack }) {
  const [activeTab, setActiveTab] = useState('stats');
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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token récupéré:', token ? token.substring(0, 50) + '...' : 'ABSENT !');
      
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
      <div className="admin-header">
        <div className="header-content">
          <button className="back-btn" onClick={onBack}>← Retour</button>
          <h1>🎛️ Dashboard Administration</h1>
          <div className="admin-user-info">
            <span className="admin-badge">ADMIN</span>
            <span>{user?.username}</span>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          📊 Statistiques
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Utilisateurs ({users.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'articles' ? 'active' : ''}`}
          onClick={() => setActiveTab('articles')}
        >
          📝 Articles ({articles.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'stats' && (
          <div className="stats-section">
            <div className="stats-grid-admin">
              <div className="stat-card-admin">
                <div className="stat-icon-admin">👥</div>
                <div className="stat-info">
                  <div className="stat-value-admin">{stats.totalUsers}</div>
                  <div className="stat-label-admin">Utilisateurs Total</div>
                </div>
              </div>
              <div className="stat-card-admin">
                <div className="stat-icon-admin">⭐</div>
                <div className="stat-info">
                  <div className="stat-value-admin">{stats.premium}</div>
                  <div className="stat-label-admin">Abonnés Premium</div>
                </div>
              </div>
              <div className="stat-card-admin">
                <div className="stat-icon-admin">📝</div>
                <div className="stat-info">
                  <div className="stat-value-admin">{stats.totalArticles}</div>
                  <div className="stat-label-admin">Articles Total</div>
                </div>
              </div>
              <div className="stat-card-admin">
                <div className="stat-icon-admin">✅</div>
                <div className="stat-info">
                  <div className="stat-value-admin">{stats.publishedArticles}</div>
                  <div className="stat-label-admin">Articles Publiés</div>
                </div>
              </div>
              <div className="stat-card-admin">
                <div className="stat-icon-admin">🛡️</div>
                <div className="stat-info">
                  <div className="stat-value-admin">{stats.admins}</div>
                  <div className="stat-label-admin">Administrateurs</div>
                </div>
              </div>
              <div className="stat-card-admin">
                <div className="stat-icon-admin">✍️</div>
                <div className="stat-info">
                  <div className="stat-value-admin">{stats.authors}</div>
                  <div className="stat-label-admin">Auteurs</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <div className="section-header-admin">
              <h2>Gestion des Utilisateurs</h2>
              <button className="refresh-btn" onClick={fetchDashboardData}>🔄 Rafraîchir</button>
            </div>
            <div className="users-table">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Email</th>
                    <th>Rôles</th>
                    <th>Abonnement</th>
                    <th>Date Création</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.id}</td>
                      <td>{u.username}</td>
                      <td>{u.email}</td>
                      <td>
                        <div className="roles-cell">
                          {['ROLE_ADMIN', 'ROLE_AUTHOR', 'ROLE_EDITOR', 'ROLE_DESIGNER', 'ROLE_DATA_PROVIDER'].map(role => (
                            <button
                              key={role}
                              className={`role-badge ${u.roles?.includes(role) ? 'active' : ''}`}
                              onClick={() => toggleRole(u.id, role)}
                              title={`${u.roles?.includes(role) ? 'Retirer' : 'Ajouter'} ${role}`}
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
                          <option value="platinum">Platinum</option>
                        </select>
                      </td>
                      <td>{new Date(u.createdAt).toLocaleDateString('fr-FR')}</td>
                      <td>
                        <button 
                          className="delete-btn-admin"
                          onClick={() => handleDeleteUser(u.id)}
                          disabled={u.id === user?.id}
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
          <div className="articles-section">
            <div className="section-header-admin">
              <h2>Gestion des Articles</h2>
              <button className="refresh-btn" onClick={fetchDashboardData}>🔄 Rafraîchir</button>
            </div>
            <div className="articles-grid-admin">
              {articles.map(article => (
                <div key={article.id} className="article-card-admin">
                  <div className="article-header-admin">
                    <h3>{article.title}</h3>
                    <span className={`status-badge ${article.published ? 'published' : 'draft'}`}>
                      {article.published ? '✅ Publié' : '📝 Brouillon'}
                    </span>
                  </div>
                  <div className="article-meta-admin">
                    <span className="game-badge">{article.game}</span>
                    <span className="category-badge">{article.category}</span>
                  </div>
                  <div className="article-excerpt-admin">{article.summary || 'Pas de résumé'}</div>
                  <div className="article-stats-admin">
                    <div className="stat-item-small">
                      <span>👁️</span>
                      <span>{article.viewCount || 0} vues</span>
                    </div>
                    <div className="stat-item-small">
                      <span>⭐</span>
                      <span>{article.rating || 0}/5</span>
                    </div>
                    <div className="stat-item-small">
                      <span>💬</span>
                      <span>{article.commentCount || 0} com.</span>
                    </div>
                  </div>
                  <div className="article-footer-admin">
                    <span className="date-admin">
                      {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                    <div className="article-actions">
                      <button 
                        className="edit-btn-admin"
                        onClick={() => window.location.hash = `#article/${article.id}`}
                      >
                        ✏️ Voir
                      </button>
                      <button 
                        className="delete-btn-admin"
                        onClick={() => handleDeleteArticle(article.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
