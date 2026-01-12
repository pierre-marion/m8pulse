import React, { useState, useEffect } from 'react';
import './ProfilePage.css';
import Icon from './Icon';

function ProfilePage({ user, onLogout }) {
  const [userData, setUserData] = useState(user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Charger les données utilisateur fraîches
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const response = await fetch('http://localhost:8000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        localStorage.setItem('user', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Erreur lors du chargement du profil:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    onLogout();
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      'ROLE_ADMIN': '#ffd700',
      'ROLE_EDITOR': '#ff4655',
      'ROLE_AUTHOR': '#00d4ff',
      'ROLE_SUBSCRIBER': '#50ff50',
      'ROLE_VISITOR': '#888',
    };
    return colors[role] || '#888';
  };

  const getRoleLabel = (role) => {
    const labels = {
      'ROLE_ADMIN': 'Administrateur',
      'ROLE_EDITOR': 'Éditeur',
      'ROLE_AUTHOR': 'Auteur',
      'ROLE_SUBSCRIBER': 'Abonné',
      'ROLE_VISITOR': 'Visiteur',
      'ROLE_USER': 'Utilisateur',
    };
    return labels[role] || role;
  };

  const getSubscriptionBadge = (level) => {
    const badges = {
      'gold': { icon: 'trophy', label: 'Gold', color: '#ffd700' },
      'silver': { icon: 'star', label: 'Silver', color: '#c0c0c0' },
      'bronze': { icon: 'star', label: 'Bronze', color: '#cd7f32' },
    };
    return badges[level] || badges['bronze'];
  };

  const isAdmin = userData?.roles?.includes('ROLE_ADMIN');

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">
            {userData?.username?.charAt(0).toUpperCase()}
          </div>
          <h1>{userData?.username}</h1>
          <p className="profile-email">{userData?.email}</p>
        </div>

        <div className="profile-section">
          <h2>Abonnement</h2>
          <div className="subscription-badge" style={{ 
            background: `linear-gradient(135deg, ${getSubscriptionBadge(userData?.subscriptionLevel).color}22, ${getSubscriptionBadge(userData?.subscriptionLevel).color}11)`
          }}>
            <span className="sub-icon">{getSubscriptionBadge(userData?.subscriptionLevel).icon}</span>
            <span className="sub-label">{getSubscriptionBadge(userData?.subscriptionLevel).label}</span>
          </div>
        </div>

        <div className="profile-section">
          <h2>Rôles</h2>
          <div className="roles-list">
            {userData?.roles?.map((role, index) => (
              <span 
                key={index} 
                className="role-badge"
                style={{ 
                  background: `${getRoleBadgeColor(role)}22`,
                  borderColor: getRoleBadgeColor(role),
                  color: getRoleBadgeColor(role)
                }}
              >
                {getRoleLabel(role)}
              </span>
            ))}
          </div>
        </div>

        {isAdmin && (
          <div className="admin-section">
            <div className="admin-badge">
              <span className="admin-icon">👑</span>
              <div>
                <h3>Accès Administrateur</h3>
                <p>Vous avez accès au dashboard d'administration</p>
              </div>
            </div>
          </div>
        )}

        <div className="profile-info">
          <div className="info-row">
            <span className="info-label">Membre depuis</span>
            <span className="info-value">
              {new Date(userData?.createdAt).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={handleLogout} className="logout-button">
            <Icon name="logOut" size={18} /> Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
