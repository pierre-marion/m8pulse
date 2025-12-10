import React, { useState } from 'react';
import './Auth.css';

function LoginPage({ onLogin, onSwitchToRegister }) {
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
        // Stocker le token JWT
        localStorage.setItem('token', data.token);
        if (data.refresh_token) {
          localStorage.setItem('refresh_token', data.refresh_token);
        }
        
        // Décoder le JWT pour récupérer les informations utilisateur
        // Le token JWT contient les données utilisateur dans le payload
        try {
          const tokenParts = data.token.split('.');
          const payload = JSON.parse(atob(tokenParts[1]));
          
          // Créer l'objet utilisateur à partir du JWT
          const userData = {
            username: payload.username,
            email: email,
            roles: payload.roles || ['ROLE_USER'],
            subscriptionLevel: 'gold' // Valeur par défaut, peut être ajoutée au JWT plus tard
          };
          
          localStorage.setItem('user', JSON.stringify(userData));
          onLogin(userData);
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

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Connexion</h1>
          <p>Connectez-vous à votre compte M8pulse</p>
        </div>

        {error && (
          <div className="auth-error">
            <span className="error-icon">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Connexion...
              </>
            ) : (
              'Se connecter'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Pas encore de compte ?{' '}
            <button onClick={onSwitchToRegister} className="link-button">
              S'inscrire
            </button>
          </p>
        </div>

        <div className="admin-info">
          <h3>👑 Comptes Admin</h3>
          <div className="admin-accounts">
            <div className="admin-account">
              <strong>Hugo</strong>
              <span>hugo@m8pulse.com</span>
            </div>
            <div className="admin-account">
              <strong>Pierre</strong>
              <span>pierre@m8pulse.com</span>
            </div>
            <div className="admin-account">
              <strong>Nathan</strong>
              <span>nathan@m8pulse.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
