import React, { useState } from 'react';
import './LoginModal.css';

function LoginModal({ onClose, onLogin, onSwitchToRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
        
        try {
          const tokenParts = data.token.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          
          const userData = {
            username: payload.username,
            email: email,
            roles: payload.roles || ['ROLE_USER'],
            subscriptionLevel: 'gold'
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          onLogin(userData);
          onClose();
        } catch (jwtError) {
          console.error('Erreur lors du décodage du JWT:', jwtError);
          setError('Erreur lors de la récupération des informations utilisateur');
        }
      } else {
        setError(data.message || 'Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
      console.error('Erreur de connexion:', err);
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (email, password) => {
    setEmail(email);
    setPassword(password);
    // Auto-submit après 100ms
    setTimeout(() => {
      const event = new Event('submit', { cancelable: true, bubbles: true });
      document.querySelector('.login-modal-form').dispatchEvent(event);
    }, 100);
  };

  return (
    <div className="login-modal-overlay" onClick={onClose}>
      <div className="login-modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="login-modal-close" onClick={onClose}>×</button>
        
        <div className="login-modal-content">
          {/* Côté gauche - Formulaire */}
          <div className="login-modal-form-section">
            <div className="login-modal-header">
              <h2>Connexion</h2>
              <p>Accédez à votre espace M8pulse</p>
            </div>

            {error && (
              <div className="login-modal-error">
                <span>⚠️</span>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-modal-form">
              <div className="login-form-group">
                <label htmlFor="modal-email">Email</label>
                <input
                  type="email"
                  id="modal-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="login-form-group">
                <label htmlFor="modal-password">Mot de passe</label>
                <input
                  type="password"
                  id="modal-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>

              <button type="submit" className="login-modal-submit" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>

            <div className="login-modal-footer">
              <p>
                Pas encore de compte ?{' '}
                <button 
                  onClick={() => {
                    onClose();
                    onSwitchToRegister();
                  }} 
                  className="login-modal-link"
                >
                  S'inscrire
                </button>
              </p>
            </div>
          </div>

          {/* Côté droit - Présentation du site */}
          <div className="login-modal-promo-section">
            <div className="promo-content">
              <div className="promo-header">
                <div className="promo-logo-container">
                  <div className="promo-logo-text">M8</div>
                  <div className="promo-logo-pulse">pulse</div>
                </div>
                <p className="promo-subtitle">Plateforme esport nouvelle génération</p>
              </div>
              
              <div className="promo-features">
                <div className="promo-feature">
                  <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <div className="feature-content">
                    <h4>Stats live</h4>
                    <p>Performances en temps réel</p>
                  </div>
                </div>

                <div className="promo-feature">
                  <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <div className="feature-content">
                    <h4>Actualités</h4>
                    <p>Toute l'info esport</p>
                  </div>
                </div>

                <div className="promo-feature">
                  <svg className="feature-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <div className="feature-content">
                    <h4>Multi-jeux</h4>
                    <p>Valorant • CS2 • COD</p>
                  </div>
                </div>
              </div>

              <div className="promo-quick-login">
                <button 
                  onClick={() => quickLogin('admin@m8pulse.com', 'password')} 
                  className="guest-login-btn"
                >
                  <svg className="guest-icon-svg" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="guest-text">Connexion invité</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
