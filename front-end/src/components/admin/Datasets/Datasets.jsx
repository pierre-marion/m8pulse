import React, { useState, useEffect } from 'react';
import './Datasets.css';
import Icon from '../../common/Icon/Icon';

function Datasets({ user }) {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    file: null,
    public: true
  });
  const [uploading, setUploading] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState(null);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const fetchDatasets = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/datasets', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setDatasets(data);
      }
    } catch (error) {
      console.error('Erreur chargement datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.file || !uploadForm.name) {
      alert('Fichier et nom requis');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('name', uploadForm.name);
    formData.append('description', uploadForm.description);
    formData.append('public', uploadForm.public);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8000/api/datasets/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        alert('Dataset uploadé avec succès!');
        setShowUpload(false);
        setUploadForm({ name: '', description: '', file: null, public: true });
        fetchDatasets();
        
        // Afficher les colonnes détectées
        if (result.columns) {
          setSelectedDataset({ id: result.id, columns: result.columns });
        }
      } else {
        const error = await response.json();
        alert(`Erreur: ${error.error || 'Upload échoué'}`);
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce dataset ?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/datasets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchDatasets();
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  const updateColumnType = async (datasetId, columnIndex, newType) => {
    const dataset = datasets.find(d => d.id === datasetId);
    const updatedColumns = [...dataset.columnsInfo];
    updatedColumns[columnIndex].type = newType;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/datasets/${datasetId}/columns`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ columns: updatedColumns })
      });

      if (response.ok) {
        fetchDatasets();
      }
    } catch (error) {
      console.error('Erreur mise à jour colonne:', error);
    }
  };

  if (!user || (!user.roles?.includes('ROLE_PROVIDER') && !user.roles?.includes('ROLE_ADMIN'))) {
    return (
      <div className="datasets-container">
        <div className="no-permission">
          <h2>❌ Accès refusé</h2>
          <p>Vous devez être Provider pour gérer les datasets</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="datasets-container">
      <div className="datasets-header">
        <h1><Icon name="barChart" size={32} /> Gestion des Datasets</h1>
        <button onClick={() => setShowUpload(!showUpload)} className="btn-upload">
          {showUpload ? '✕ Annuler' : <><Icon name="sparkles" size={16} /> Nouveau Dataset</>}
        </button>
      </div>

      {showUpload && (
        <div className="upload-form-container">
          <form onSubmit={handleUpload} className="upload-form">
            <h3>📁 Uploader un Dataset CSV</h3>
            
            <div className="form-group">
              <label>Nom du dataset *</label>
              <input
                type="text"
                value={uploadForm.name}
                onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
                placeholder="Ex: Stats Match GM vs VIT"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={uploadForm.description}
                onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                placeholder="Description du dataset..."
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>Fichier CSV * (séparateur: ; ou ,)</label>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                required
              />
              <small>Format: Variable1;Variable2;Variable3...</small>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={uploadForm.public}
                  onChange={(e) => setUploadForm({ ...uploadForm, public: e.target.checked })}
                />
                Dataset public (accessible à tous)
              </label>
            </div>

            <button type="submit" disabled={uploading} className="btn-submit">
              {uploading ? '⏳ Upload...' : '✅ Uploader'}
            </button>
          </form>
        </div>
      )}

      <div className="datasets-list">
        <h3>📋 Mes Datasets ({datasets.length})</h3>
        
        {datasets.length === 0 ? (
          <p className="no-datasets">Aucun dataset. Commencez par en uploader un !</p>
        ) : (
          datasets.map(dataset => (
            <div key={dataset.id} className="dataset-card">
              <div className="dataset-header">
                <div>
                  <h4>{dataset.name}</h4>
                  <p className="dataset-description">{dataset.description}</p>
                </div>
                <div className="dataset-actions">
                  <button 
                    onClick={() => setSelectedDataset(
                      selectedDataset?.id === dataset.id ? null : dataset
                    )}
                    className="btn-details"
                  >
                    {selectedDataset?.id === dataset.id ? '🔼' : '🔽'} Détails
                  </button>
                  <button 
                    onClick={() => handleDelete(dataset.id)} 
                    className="btn-delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="dataset-info">
                <span className="info-badge"><Icon name="fileText" size={14} /> {dataset.filename}</span>
                <span className="info-badge"><Icon name="barChart" size={14} /> {dataset.rowCount} lignes</span>
                <span className="info-badge">
                  {dataset.public ? <><Icon name="globe" size={14} /> Public</> : <><Icon name="lock" size={14} /> Privé</>}
                </span>
                <span className="info-badge">✅ {dataset.status}</span>
              </div>

              {selectedDataset?.id === dataset.id && dataset.columnsInfo && (
                <div className="dataset-columns">
                  <h5><Icon name="settings" size={16} /> Variables ({dataset.columnsInfo.length})</h5>
                  <div className="columns-grid">
                    {dataset.columnsInfo.map((column, index) => (
                      <div key={index} className="column-item">
                        <div className="column-name">{column.name}</div>
                        <select
                          value={column.type}
                          onChange={(e) => updateColumnType(dataset.id, index, e.target.value)}
                          className="column-type-select"
                        >
                          <option value="number"><Icon name="barChart" size={14} /> Numérique</option>
                          <option value="string"><Icon name="fileText" size={14} /> Catégorielle</option>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Datasets;
