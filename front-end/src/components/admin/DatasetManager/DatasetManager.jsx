import React, { useState, useEffect } from 'react';
import './DatasetManager.css';

const DatasetManager = () => {
    const [datasets, setDatasets] = useState([]);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [csvFile, setCsvFile] = useState(null);
    const [csvPreview, setCsvPreview] = useState(null);
    const [newDataset, setNewDataset] = useState({
        name: '',
        description: '',
        sourceType: 'csv',
        sourceUrl: '',
        separator: ';',
        variables: []
    });

    useEffect(() => {
        fetchDatasets();
    }, []);

    const fetchDatasets = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/datasets');
            if (response.ok) {
                const data = await response.json();
                setDatasets(data);
            }
        } catch (error) {
            console.error('Erreur chargement datasets:', error);
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCsvFile(file);
            
            const reader = new FileReader();
            reader.onload = (event) => {
                const text = event.target.result;
                const rows = text.split('\n').slice(0, 6);
                const lines = rows.map(row => row.split(newDataset.separator));
                
                if (lines.length > 0) {
                    const headers = lines[0];
                    const sampleData = lines.slice(1);
                    
                    const detectedVariables = headers.map((header, index) => {
                        const columnData = sampleData.map(row => row[index]).filter(Boolean);
                        const isNumeric = columnData.every(val => !isNaN(parseFloat(val)));
                        
                        return {
                            name: header.trim(),
                            type: isNumeric ? 'numeric' : 'categorical'
                        };
                    });

                    setCsvPreview({ headers, sampleData });
                    setNewDataset(prev => ({ ...prev, variables: detectedVariables }));
                }
            };
            reader.readAsText(file);
        }
    };

    const handleUpload = async () => {
        if (!csvFile) return;

        const formData = new FormData();
        formData.append('file', csvFile);

        try {
            const response = await fetch('http://localhost:8000/api/media/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (response.ok) {
                const media = await response.json();
                
                // Convertir les types de variables en français pour le backend
                const typeMapping = {
                    'numeric': 'numérique',
                    'categorical': 'catégorielle'
                };
                
                const convertedVariables = newDataset.variables.map(v => ({
                    ...v,
                    type: typeMapping[v.type] || v.type
                }));
                
                const datasetData = {
                    ...newDataset,
                    variables: convertedVariables,
                    sourceUrl: `http://localhost:8000${media.path}`
                };

                const createResponse = await fetch('http://localhost:8000/api/datasets', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(datasetData)
                });

                if (createResponse.ok) {
                    setShowUploadModal(false);
                    setCsvFile(null);
                    setCsvPreview(null);
                    setNewDataset({
                        name: '',
                        description: '',
                        sourceType: 'csv',
                        sourceUrl: '',
                        separator: ';',
                        variables: []
                    });
                    fetchDatasets();
                }
            }
        } catch (error) {
            console.error('Erreur upload:', error);
        }
    };

    const handleValidate = async (datasetId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/datasets/${datasetId}/validate`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({})
            });

            if (response.ok) {
                fetchDatasets();
            }
        } catch (error) {
            console.error('Erreur validation:', error);
        }
    };

    const updateVariableType = (index, type) => {
        const updatedVars = [...newDataset.variables];
        updatedVars[index].type = type;
        setNewDataset(prev => ({ ...prev, variables: updatedVars }));
    };

    return (
        <div className="dataset-manager">
            <div className="dataset-header">
                <h2>Gestion des Datasets</h2>
                <button onClick={() => setShowUploadModal(true)} className="btn-upload">
                    + Nouveau Dataset
                </button>
            </div>

            <div className="datasets-grid">
                {datasets.map(dataset => (
                    <div key={dataset.id} className="dataset-card">
                        <div className="dataset-info">
                            <h3>{dataset.name}</h3>
                            <p>{dataset.description}</p>
                            <div className="dataset-meta">
                                <span className="badge">{dataset.sourceType.toUpperCase()}</span>
                                <span className={`status ${dataset.isValidated ? 'validated' : 'pending'}`}>
                                    {dataset.isValidated ? 'Validé' : 'En attente'}
                                </span>
                            </div>
                            <div className="variables-count">
                                {dataset.variables.length} variables
                            </div>
                        </div>
                        {!dataset.isValidated && (
                            <button onClick={() => handleValidate(dataset.id)} className="btn-validate">
                                Valider
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {showUploadModal && (
                <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h3>Nouveau Dataset CSV</h3>
                        
                        <div className="form-group">
                            <label>Nom du dataset</label>
                            <input
                                type="text"
                                value={newDataset.name}
                                onChange={(e) => setNewDataset({...newDataset, name: e.target.value})}
                                placeholder="Ex: Statistiques Valorant"
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                value={newDataset.description}
                                onChange={(e) => setNewDataset({...newDataset, description: e.target.value})}
                                placeholder="Description du dataset..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Séparateur</label>
                            <select value={newDataset.separator} onChange={(e) => setNewDataset({...newDataset, separator: e.target.value})}>
                                <option value=";">; (point-virgule)</option>
                                <option value=",">, (virgule)</option>
                                <option value="\t">Tabulation</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Fichier CSV</label>
                            <input type="file" accept=".csv" onChange={handleFileSelect} />
                        </div>

                        {csvPreview && (
                            <div className="csv-preview">
                                <h4>Aperçu et Types de Variables</h4>
                                <div className="preview-table-wrapper">
                                    <table className="preview-table">
                                        <thead>
                                            <tr>
                                                {csvPreview.headers.map((header, i) => (
                                                    <th key={i}>
                                                        <div className="header-cell">
                                                            <span>{header}</span>
                                                            <select
                                                                value={newDataset.variables[i]?.type || 'categorical'}
                                                                onChange={(e) => updateVariableType(i, e.target.value)}
                                                                className="type-select"
                                                            >
                                                                <option value="categorical">Catégorielle</option>
                                                                <option value="numeric">Numérique</option>
                                                            </select>
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {csvPreview.sampleData.slice(0, 5).map((row, i) => (
                                                <tr key={i}>
                                                    {row.map((cell, j) => (
                                                        <td key={j}>{cell}</td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button onClick={() => setShowUploadModal(false)} className="btn-cancel">
                                Annuler
                            </button>
                            <button onClick={handleUpload} className="btn-save" disabled={!csvFile || !newDataset.name}>
                                Créer Dataset
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatasetManager;
