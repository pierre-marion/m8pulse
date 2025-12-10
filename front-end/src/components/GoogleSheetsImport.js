import React, { useState } from 'react';
import './GoogleSheetsImport.css';

const GoogleSheetsImport = () => {
  const [formData, setFormData] = useState({
    url: '',
    name: '',
    description: '',
    game: 'valorant'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Récupérer le token depuis le localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Vous devez être connecté pour importer des données');
      }

      const response = await fetch('http://localhost:8000/api/google-sheets/quick-import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          public: true
        })
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
        // Réinitialiser le formulaire
        setFormData({
          url: '',
          name: '',
          description: '',
          game: 'valorant'
        });
      } else {
        throw new Error(data.message || 'Erreur lors de l\'import');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-sheets-import">
      <div className="import-header">
        <h2>📊 Importer depuis Google Sheets</h2>
        <p className="import-description">
          Importez vos statistiques FPS directement depuis un Google Sheet
        </p>
      </div>

      <div className="import-instructions">
        <h3>⚠️ Prérequis</h3>
        <ol>
          <li>Ouvrez votre Google Sheet</li>
          <li>Cliquez sur <strong>"Partager"</strong></li>
          <li>Ajoutez l'email: <code>admin-419@sae5012.iam.gserviceaccount.com</code></li>
          <li>Donnez les permissions <strong>"Lecteur"</strong></li>
          <li>Copiez l'URL du Google Sheet et collez-la ci-dessous</li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} className="import-form">
        <div className="form-group">
          <label htmlFor="url">
            URL du Google Sheet <span className="required">*</span>
          </label>
          <input
            type="url"
            id="url"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            placeholder="https://docs.google.com/spreadsheets/d/..."
            required
            className="form-input"
          />
          <small className="form-help">
            L'URL complète de votre Google Sheet (avec /edit à la fin)
          </small>
        </div>

        <div className="form-group">
          <label htmlFor="name">
            Nom du dataset <span className="required">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Stats Valorant 2024"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Description de vos données..."
            rows="3"
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label htmlFor="game">
            Type de jeu <span className="required">*</span>
          </label>
          <select
            id="game"
            name="game"
            value={formData.game}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="valorant">Valorant</option>
            <option value="cod">Call of Duty</option>
            <option value="cs2">Counter-Strike 2</option>
            <option value="generic">Autre (import générique)</option>
          </select>
          <small className="form-help">
            Le type de jeu détermine quelles colonnes seront importées
          </small>
        </div>

        {error && (
          <div className="alert alert-error">
            <strong>❌ Erreur:</strong> {error}
          </div>
        )}

        {result && (
          <div className="alert alert-success">
            <h3>✅ Import réussi !</h3>
            <p>
              <strong>Dataset ID:</strong> {result.dataset.id}<br />
              <strong>Nom:</strong> {result.dataset.name}<br />
              <strong>Lignes importées:</strong> {result.dataset.rowCount}<br />
              <strong>Source:</strong> {result.dataset.sheetTitle}
            </p>
            {result.preview && result.preview.length > 0 && (
              <div className="preview">
                <h4>Aperçu des données:</h4>
                <pre>{JSON.stringify(result.preview[0], null, 2)}</pre>
              </div>
            )}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Import en cours...
              </>
            ) : (
              <>
                📥 Importer les données
              </>
            )}
          </button>
        </div>
      </form>

      <div className="import-help">
        <h3>💡 Aide</h3>
        <div className="help-section">
          <h4>Format attendu pour Valorant:</h4>
          <p>Colonnes: ID, Name, Role Specific, Nationality, Join Date, Status, Games Played, Wins, Losses, KDA, ACS, Rating</p>
        </div>
        <div className="help-section">
          <h4>Format attendu pour COD:</h4>
          <p>Colonnes: ID, Name, Role Specific, Nationality, Join Date, Status, Games Played, Wins, Losses, Overall KD, HP KD, S&D KD, OL KD</p>
        </div>
        <div className="help-section">
          <h4>Format attendu pour CS2:</h4>
          <p>Colonnes: ID, Name, Role Specific, Nationality, Join Date, Status, Games Played, Wins, Losses, Rating, T Rating, CT Rating</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleSheetsImport;
