import React, { useState, useEffect } from 'react';
import './VisualizationBuilder.css';

const VisualizationBuilder = ({ onSave, existingViz }) => {
    const [datasets, setDatasets] = useState([]);
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [viz, setViz] = useState(existingViz || {
        title: '',
        chartType: 'barchart',
        datasetId: null,
        config: {
            xVariable: '',
            yVariable: '',
            categoryVariable: '',
            colors: ['#667eea', '#764ba2', '#f093fb', '#f5576c']
        }
    });

    const chartTypes = [
        { value: 'barchart', label: 'Diagramme en barres', requires: ['categorical', 'numeric'] },
        { value: 'piechart', label: 'Camembert', requires: ['categorical', 'numeric'] },
        { value: 'scatterplot', label: 'Nuage de points', requires: ['numeric', 'numeric'] },
        { value: 'histogram', label: 'Histogramme', requires: ['numeric'] },
        { value: 'linechart', label: 'Graphique linéaire', requires: ['categorical', 'numeric'] }
    ];

    useEffect(() => {
        fetchDatasets();
    }, []);

    const fetchDatasets = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/datasets?validated=true');
            if (response.ok) {
                const data = await response.json();
                setDatasets(data);
            }
        } catch (error) {
            console.error('Erreur chargement datasets:', error);
        }
    };

    const handleDatasetChange = (datasetId) => {
        const dataset = datasets.find(d => d.id === parseInt(datasetId));
        setSelectedDataset(dataset);
        setViz({ ...viz, datasetId: parseInt(datasetId), config: { ...viz.config, xVariable: '', yVariable: '', categoryVariable: '' } });
    };

    const getVariablesByType = (type) => {
        if (!selectedDataset) return [];
        
        // Mapper les types anglais vers français pour la comparaison
        const typeMapping = {
            'numeric': 'numérique',
            'categorical': 'catégorielle',
            'numérique': 'numérique',
            'catégorielle': 'catégorielle'
        };
        
        const mappedType = typeMapping[type] || type;
        return selectedDataset.variables.filter(v => v.type === mappedType);
    };

    const isConfigValid = () => {
        const chartType = chartTypes.find(ct => ct.value === viz.chartType);
        if (!chartType || !selectedDataset) return false;

        if (viz.chartType === 'piechart') {
            return viz.config.categoryVariable && viz.config.yVariable;
        }
        if (viz.chartType === 'histogram') {
            return viz.config.xVariable;
        }
        if (viz.chartType === 'scatterplot') {
            return viz.config.xVariable && viz.config.yVariable;
        }
        if (viz.chartType === 'barchart' || viz.chartType === 'linechart') {
            return viz.config.xVariable && viz.config.yVariable;
        }
        return false;
    };

    const handleSave = async () => {
        if (!isConfigValid()) return;

        try {
            const payload = {
                title: viz.title,
                datasetId: viz.datasetId,
                chartType: viz.chartType,
                config: viz.config
            };

            const response = await fetch('http://localhost:8000/api/visualizations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const savedViz = await response.json();
                if (onSave) onSave(savedViz);
            }
        } catch (error) {
            console.error('Erreur sauvegarde viz:', error);
        }
    };

    return (
        <div className="viz-builder">
            <h3>Créer une Visualisation</h3>

            <div className="form-group">
                <label>Titre</label>
                <input
                    type="text"
                    value={viz.title}
                    onChange={(e) => setViz({ ...viz, title: e.target.value })}
                    placeholder="Ex: Répartition des joueurs par rang"
                />
            </div>

            <div className="form-group">
                <label>Dataset</label>
                <select value={viz.datasetId || ''} onChange={(e) => handleDatasetChange(e.target.value)}>
                    <option value="">Sélectionner un dataset</option>
                    {datasets.map(ds => (
                        <option key={ds.id} value={ds.id}>{ds.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Type de graphique</label>
                <select value={viz.chartType} onChange={(e) => setViz({ ...viz, chartType: e.target.value })}>
                    {chartTypes.map(ct => (
                        <option key={ct.value} value={ct.value}>{ct.label}</option>
                    ))}
                </select>
            </div>

            {selectedDataset && (
                <div className="config-section">
                    <h4>Configuration</h4>

                    {(viz.chartType === 'barchart' || viz.chartType === 'linechart' || viz.chartType === 'scatterplot') && (
                        <div className="form-group">
                            <label>Variable X {viz.chartType !== 'scatterplot' && '(catégorielle)' || '(numérique)'}</label>
                            <select 
                                value={viz.config.xVariable} 
                                onChange={(e) => setViz({ ...viz, config: { ...viz.config, xVariable: e.target.value } })}
                            >
                                <option value="">Sélectionner</option>
                                {getVariablesByType(viz.chartType === 'scatterplot' ? 'numeric' : 'categorical').map(v => (
                                    <option key={v.name} value={v.name}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {(viz.chartType === 'histogram') && (
                        <div className="form-group">
                            <label>Variable (numérique)</label>
                            <select 
                                value={viz.config.xVariable} 
                                onChange={(e) => setViz({ ...viz, config: { ...viz.config, xVariable: e.target.value } })}
                            >
                                <option value="">Sélectionner</option>
                                {getVariablesByType('numeric').map(v => (
                                    <option key={v.name} value={v.name}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {viz.chartType === 'piechart' && (
                        <div className="form-group">
                            <label>Catégorie</label>
                            <select 
                                value={viz.config.categoryVariable} 
                                onChange={(e) => setViz({ ...viz, config: { ...viz.config, categoryVariable: e.target.value } })}
                            >
                                <option value="">Sélectionner</option>
                                {getVariablesByType('categorical').map(v => (
                                    <option key={v.name} value={v.name}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {(viz.chartType !== 'histogram') && (
                        <div className="form-group">
                            <label>Variable Y (numérique)</label>
                            <select 
                                value={viz.config.yVariable} 
                                onChange={(e) => setViz({ ...viz, config: { ...viz.config, yVariable: e.target.value } })}
                            >
                                <option value="">Sélectionner</option>
                                {getVariablesByType('numeric').map(v => (
                                    <option key={v.name} value={v.name}>{v.name}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="form-group">
                        <label>Couleurs</label>
                        <div className="color-picker-grid">
                            {viz.config.colors.map((color, i) => (
                                <input
                                    key={i}
                                    type="color"
                                    value={color}
                                    onChange={(e) => {
                                        const newColors = [...viz.config.colors];
                                        newColors[i] = e.target.value;
                                        setViz({ ...viz, config: { ...viz.config, colors: newColors } });
                                    }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="builder-actions">
                <button onClick={handleSave} disabled={!isConfigValid()} className="btn-save-viz">
                    Créer la Visualisation
                </button>
            </div>
        </div>
    );
};

export default VisualizationBuilder;
