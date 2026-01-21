import React, { useState } from 'react';
import '../LoginModal/LoginModal.css'; // On réutilise le même CSS
import Icon from '../../common/Icon/Icon';

function RegisterModal({ onClose, onRegister, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Auto-login après inscription
        const loginResponse = await fetch('http://localhost:8000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        });

        const loginData = await loginResponse.json();

        if (loginResponse.ok) {
          localStorage.setItem('token', loginData.token);
          if (loginData.refresh_token) {
            localStorage.setItem('refresh_token', loginData.refresh_token);
          }

          const tokenParts = loginData.token.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));

          const userData = {
            username: payload.username,
            email: formData.email,
            roles: payload.roles || ['ROLE_USER'],
            subscriptionLevel: 'basic'
          };

          localStorage.setItem('user', JSON.stringify(userData));
          onRegister(userData);
          onClose();
        }
      } else {
        setError(data.message || 'Erreur lors de l\'inscription');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={onClose}>×</button>
        
        <div className="login-modal-content">
          {/* Côté gauche - Formulaire */}
          <div className="login-modal-form-section">
            <div className="login-modal-header">
              <h2>Inscription</h2>
              <p>Créez votre compte M8pulse</p>
            </div>

            {error && (
              <div className="login-modal-error">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-modal-form">
              <div className="login-form-group">
                <label htmlFor="register-username">Pseudo</label>
                <input
                  type="text"
                  id="register-username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Votre pseudo"
                  required
                  disabled={loading}
                />
              </div>

              <div className="login-form-group">
                <label htmlFor="register-email">Email</label>
                <input
                  type="email"
                  id="register-email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="votre@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="login-form-group">
                <label htmlFor="register-password">Mot de passe</label>
                <input
                  type="password"
                  id="register-password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>

              <div className="login-form-group">
                <label htmlFor="register-confirm">Confirmer le mot de passe</label>
                <input
                  type="password"
                  id="register-confirm"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="login-modal-submit" disabled={loading}>
                {loading ? 'Inscription...' : 'S\'inscrire'}
              </button>
            </form>

            <div className="login-modal-footer">
              <p>
                Déjà un compte ?{' '}
                <button 
                  onClick={() => {
                    onClose();
                    onSwitchToLogin();
                  }} 
                  className="login-modal-link"
                >
                  Se connecter
                </button>
              </p>
            </div>
          </div>

          {/* Côté droit - Présentation */}
          <div className="login-modal-promo-section">
            <div className="promo-content">
              <div className="promo-header">
                <div className="promo-logo-container">
                  <div className="promo-logo-text">M8</div>
                  <div className="promo-logo-pulse">pulse</div>
                </div>
                <p className="promo-subtitle">Rejoignez la communauté esport</p>
              </div>
              
              <div className="promo-features">
                <div className="promo-feature">
                  <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <div className="feature-content">
                    <h4>Gratuit</h4>
                    <p>Accès à toutes les fonctionnalités de base</p>
                  </div>
                </div>

                <div className="promo-feature">
                  <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <div className="feature-content">
                    <h4>Communauté</h4>
                    <p>Rejoignez des milliers de fans esport</p>
                  </div>
                </div>

                <div className="promo-feature">
                  <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <div className="feature-content">
                    <h4>Notifications</h4>
                    <p>Soyez alerté des dernières actus</p>
                  </div>
                </div>
              </div>

              <div className="promo-quick-login">
                <p className="register-info-text">
                  <Icon name="lock" size={16} /> Vos données sont sécurisées et ne seront jamais partagées
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterModal;
