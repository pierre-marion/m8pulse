import React, { useState, useEffect } from 'react';
import './PlayerStats.css';

/**
 * Composant pour afficher les stats des joueurs depuis Google Sheets
 * 
 * Usage:
 * <PlayerStats 
 *   game="valorant" 
 *   spreadsheetId="1ABC123XYZ456"
 *   autoRefresh={true}
 * />
 */
const PlayerStats = ({ game = 'valorant', spreadsheetId, autoRefresh = false }) => {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchStats();

    // Auto-refresh toutes les 5 minutes si activé
    if (autoRefresh) {
      const interval = setInterval(fetchStats, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [game, spreadsheetId, autoRefresh]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Construire l'URL
      const url = spreadsheetId
        ? `http://localhost:8000/api/google-sheets/players/${game}?spreadsheetId=${spreadsheetId}`
        : `http://localhost:8000/api/google-sheets/players/${game}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setPlayers(data.players);
        setLastUpdate(new Date());
      } else {
        setError(data.message || 'Erreur lors de la récupération des données');
      }
    } catch (err) {
      setError('Impossible de se connecter au serveur');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderValorantStats = (player) => (
    <tr key={player.id}>
      <td className="player-name">{player.name}</td>
      <td>{player.roleSpecific}</td>
      <td>{player.nationality}</td>
      <td>{player.gamesPlayed}</td>
      <td className="win-loss">
        <span className="wins">{player.wins}</span>
        {' / '}
        <span className="losses">{player.losses}</span>
      </td>
      <td className="stat-highlight">{player.kda?.toFixed(2) || '-'}</td>
      <td>{player.acs?.toFixed(1) || '-'}</td>
      <td className="stat-highlight">{player.rating?.toFixed(2) || '-'}</td>
    </tr>
  );

  const renderCodStats = (player) => (
    <tr key={player.id}>
      <td className="player-name">{player.name}</td>
      <td>{player.roleSpecific}</td>
      <td>{player.nationality}</td>
      <td>{player.gamesPlayed}</td>
      <td className="win-loss">
        <span className="wins">{player.wins}</span>
        {' / '}
        <span className="losses">{player.losses}</span>
      </td>
      <td className="stat-highlight">{player.overallKD?.toFixed(2) || '-'}</td>
      <td>{player.hpKD?.toFixed(2) || '-'}</td>
      <td>{player.sndKD?.toFixed(2) || '-'}</td>
      <td>{player.olKD?.toFixed(2) || '-'}</td>
    </tr>
  );

  const renderCs2Stats = (player) => (
    <tr key={player.id}>
      <td className="player-name">{player.name}</td>
      <td>{player.roleSpecific}</td>
      <td>{player.nationality}</td>
      <td>{player.gamesPlayed}</td>
      <td className="win-loss">
        <span className="wins">{player.wins}</span>
        {' / '}
        <span className="losses">{player.losses}</span>
      </td>
      <td className="stat-highlight">{player.rating?.toFixed(2) || '-'}</td>
      <td>{player.tRating?.toFixed(2) || '-'}</td>
      <td>{player.ctRating?.toFixed(2) || '-'}</td>
    </tr>
  );

  if (loading && !players.length) {
    return (
      <div className="player-stats loading">
        <div className="spinner"></div>
        <p>Chargement des statistiques...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="player-stats error">
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
          <button onClick={fetchStats} className="retry-button">
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="player-stats">
      <div className="stats-header">
        <h2>Statistiques {game.toUpperCase()}</h2>
        <div className="stats-actions">
          {lastUpdate && (
            <span className="last-update">
              Mise à jour: {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <button onClick={fetchStats} className="refresh-button" disabled={loading}>
            {loading ? '⏳' : '🔄'} Actualiser
          </button>
        </div>
      </div>

      {players.length === 0 ? (
        <div className="no-data">
          <p>Aucun joueur trouvé</p>
        </div>
      ) : (
        <div className="stats-table-container">
          <table className="stats-table">
            <thead>
              <tr>
                <th>Joueur</th>
                <th>Rôle</th>
                <th>Pays</th>
                <th>Matchs</th>
                <th>V/D</th>
                {game === 'valorant' && (
                  <>
                    <th>KDA</th>
                    <th>ACS</th>
                    <th>Rating</th>
                  </>
                )}
                {game === 'cod' && (
                  <>
                    <th>K/D Global</th>
                    <th>HP K/D</th>
                    <th>S&D K/D</th>
                    <th>OL K/D</th>
                  </>
                )}
                {game === 'cs2' && (
                  <>
                    <th>Rating</th>
                    <th>T Rating</th>
                    <th>CT Rating</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {players.map(player => {
                switch (game) {
                  case 'valorant':
                    return renderValorantStats(player);
                  case 'cod':
                    return renderCodStats(player);
                  case 'cs2':
                    return renderCs2Stats(player);
                  default:
                    return null;
                }
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="stats-footer">
        <span className="player-count">
          {players.length} joueur{players.length > 1 ? 's' : ''}
        </span>
      </div>
    </div>
  );
};

export default PlayerStats;
