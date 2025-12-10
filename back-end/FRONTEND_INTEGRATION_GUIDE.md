# 🎨 Guide d'intégration Frontend - Nouvelles fonctionnalités

## 📥 Import de datasets depuis Google Sheets

### Endpoint
```
POST /api/datasets/import/google-sheets
```

### Headers
```javascript
{
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${jwtToken}`
}
```

### Request Body
```javascript
{
  spreadsheet_id: string,    // ID du Google Sheet (depuis l'URL)
  sheet_name: string,        // Nom de l'onglet (ex: "Sheet1")
  range?: string,            // Optionnel: plage (ex: "A:Z")
  name: string,              // Nom du dataset
  description?: string       // Description optionnelle
}
```

### Exemple React/JavaScript
```javascript
async function importFromGoogleSheets(spreadsheetId, sheetName, name, description) {
  try {
    const response = await fetch('http://localhost:8000/api/datasets/import/google-sheets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
      },
      body: JSON.stringify({
        spreadsheet_id: spreadsheetId,
        sheet_name: sheetName,
        name: name,
        description: description
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Import failed');
    }
    
    console.log('Dataset imported:', data);
    // data contient: { id, message, rowCount, variables }
    
    return data;
  } catch (error) {
    console.error('Import error:', error);
    throw error;
  }
}

// Utilisation
importFromGoogleSheets(
  '1semtK-pmRquxyF88CjpjwmNpwhYezCHaWRKFkX90WkY',
  'Sheet1',
  'Dataset Esports 2025',
  'Données des tournois'
);
```

### Composant React exemple
```jsx
import { useState } from 'react';

function GoogleSheetsImporter() {
  const [formData, setFormData] = useState({
    spreadsheetId: '',
    sheetName: 'Sheet1',
    name: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/datasets/import/google-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({
          spreadsheet_id: formData.spreadsheetId,
          sheet_name: formData.sheetName,
          name: formData.name,
          description: formData.description
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setResult(data);
      // Rediriger vers la page du dataset
      // navigate(`/datasets/${data.id}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="google-sheets-importer">
      <h2>Importer depuis Google Sheets</h2>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>URL ou ID du Google Sheet:</label>
          <input
            type="text"
            value={formData.spreadsheetId}
            onChange={(e) => setFormData({...formData, spreadsheetId: e.target.value})}
            placeholder="1semtK-pmRquxyF88CjpjwmNpwhYezCHaWRKFkX90WkY"
            required
          />
          <small>Collez l'URL complète ou juste l'ID du sheet</small>
        </div>

        <div>
          <label>Nom de l'onglet:</label>
          <input
            type="text"
            value={formData.sheetName}
            onChange={(e) => setFormData({...formData, sheetName: e.target.value})}
            placeholder="Sheet1"
            required
          />
        </div>

        <div>
          <label>Nom du dataset:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Mon dataset"
            required
          />
        </div>

        <div>
          <label>Description (optionnel):</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            placeholder="Description du dataset"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Import en cours...' : 'Importer'}
        </button>
      </form>

      {error && (
        <div className="error">
          Erreur: {error}
        </div>
      )}

      {result && (
        <div className="success">
          <h3>Import réussi ! ✅</h3>
          <p>Dataset ID: {result.id}</p>
          <p>Nombre de lignes: {result.rowCount}</p>
          <h4>Variables détectées:</h4>
          <ul>
            {result.variables.map((v, i) => (
              <li key={i}>
                <strong>{v.name}</strong>: {v.type}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default GoogleSheetsImporter;
```

---

## 🔧 Configuration des types de variables

### Endpoint
```
PATCH /api/datasets/{id}/variables
```

### Exemple
```javascript
async function updateVariableTypes(datasetId, variables) {
  const response = await fetch(`/api/datasets/${datasetId}/variables`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
    },
    body: JSON.stringify({
      variables: variables  // [{name: "Age", type: "numérique"}, ...]
    })
  });

  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error);
  }
  
  return data;
}

// Utilisation
updateVariableTypes(123, [
  { name: "Age", type: "numérique" },
  { name: "Équipe", type: "catégorielle" },
  { name: "Score", type: "numérique" }
]);
```

### Composant React pour éditer les types
```jsx
function VariableTypeEditor({ dataset }) {
  const [variables, setVariables] = useState(dataset.variables || []);
  const [saving, setSaving] = useState(false);

  const handleTypeChange = (index, newType) => {
    const updated = [...variables];
    updated[index].type = newType;
    setVariables(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateVariableTypes(dataset.id, variables);
      alert('Types mis à jour !');
    } catch (error) {
      alert('Erreur: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="variable-type-editor">
      <h3>Types de variables</h3>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {variables.map((variable, index) => (
            <tr key={index}>
              <td>{variable.name}</td>
              <td>
                <select
                  value={variable.type}
                  onChange={(e) => handleTypeChange(index, e.target.value)}
                >
                  <option value="numérique">Numérique</option>
                  <option value="catégorielle">Catégorielle</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <button onClick={handleSave} disabled={saving}>
        {saving ? 'Enregistrement...' : 'Enregistrer'}
      </button>
    </div>
  );
}
```

---

## 📊 Création de visualisations avec validation

### Endpoint
```
POST /api/visualizations
```

### Validation automatique
Le backend valide automatiquement que les variables correspondent au type de graphique.

### Récupérer les types disponibles
```javascript
async function getVisualizationTypes() {
  const response = await fetch('/api/visualizations/types');
  const data = await response.json();
  return data.types;
}

// Retourne:
// [
//   { id: 'histogram', name: 'Histogram', requires: '1 numérique' },
//   { id: 'piechart', name: 'Pie Chart', requires: '1 catégorielle + 1 numérique' },
//   ...
// ]
```

### Composant de sélection intelligent
```jsx
function VisualizationCreator({ dataset }) {
  const [chartType, setChartType] = useState('histogram');
  const [selectedVariables, setSelectedVariables] = useState([]);
  const [chartTypes, setChartTypes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Charger les types de graphiques
    getVisualizationTypes().then(setChartTypes);
  }, []);

  const getAvailableVariables = () => {
    if (!dataset.variables) return [];
    
    // Filtrer selon le type de graphique sélectionné
    switch (chartType) {
      case 'histogram':
        return dataset.variables.filter(v => v.type === 'numérique');
      case 'piechart':
        return dataset.variables; // Les deux types
      case 'scatterplot':
        return dataset.variables.filter(v => v.type === 'numérique');
      default:
        return dataset.variables;
    }
  };

  const handleCreate = async () => {
    try {
      const response = await fetch('/api/visualizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('jwt_token')}`
        },
        body: JSON.stringify({
          name: `${chartType} - ${dataset.name}`,
          type: chartType,
          dataset_id: dataset.id,
          selected_variables: selectedVariables
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      alert('Visualisation créée !');
      // Rediriger vers la visualisation
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="visualization-creator">
      <h3>Créer une visualisation</h3>

      {/* Sélection du type */}
      <div>
        <label>Type de graphique:</label>
        <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
          {chartTypes.map(type => (
            <option key={type.id} value={type.id}>
              {type.name} - {type.requires}
            </option>
          ))}
        </select>
      </div>

      {/* Sélection des variables */}
      <div>
        <label>Variables:</label>
        {getAvailableVariables().map(variable => (
          <label key={variable.name}>
            <input
              type="checkbox"
              value={variable.name}
              checked={selectedVariables.includes(variable.name)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedVariables([...selectedVariables, variable.name]);
                } else {
                  setSelectedVariables(selectedVariables.filter(v => v !== variable.name));
                }
              }}
            />
            {variable.name} ({variable.type})
          </label>
        ))}
      </div>

      {error && <div className="error">{error}</div>}

      <button onClick={handleCreate}>
        Créer la visualisation
      </button>
    </div>
  );
}
```

---

## 🎯 Règles de validation par type

### Tableau récapitulatif

| Type | Variables requises | Exemple |
|------|-------------------|---------|
| **Histogram** | 1 numérique | Age |
| **Pie Chart** | 1 catégorielle + 1 numérique | Équipe + Score |
| **Scatter Plot** | 2 numériques | X + Y |
| **Bar Chart** | 1 catégorielle + 1+ numériques | Catégorie + Valeur(s) |
| **Line Chart** | 1 X + 1+ numériques | Date + Métrique(s) |
| **Area Chart** | 1 X + 1+ numériques | Date + Métrique(s) |
| **Heatmap** | 2 catégorielles + 1 numérique | Axe X + Axe Y + Intensité |

### Validation côté frontend (optionnelle)

```javascript
function validateVariables(chartType, selectedVariables, datasetVariables) {
  // Créer un mapping nom => type
  const varTypes = {};
  datasetVariables.forEach(v => {
    varTypes[v.name] = v.type;
  });

  const numeric = selectedVariables.filter(v => varTypes[v] === 'numérique').length;
  const categorical = selectedVariables.filter(v => varTypes[v] === 'catégorielle').length;

  switch (chartType) {
    case 'histogram':
      return numeric === 1 && selectedVariables.length === 1
        ? null
        : 'Histogram requiert 1 variable numérique';

    case 'piechart':
      return numeric === 1 && categorical === 1 && selectedVariables.length === 2
        ? null
        : 'Pie chart requiert 1 catégorielle + 1 numérique';

    case 'scatterplot':
      return numeric === 2 && selectedVariables.length === 2
        ? null
        : 'Scatter plot requiert 2 variables numériques';

    case 'barchart':
      return categorical >= 1 && numeric >= 1
        ? null
        : 'Bar chart requiert 1 catégorielle + 1+ numériques';

    case 'heatmap':
      return categorical === 2 && numeric === 1 && selectedVariables.length === 3
        ? null
        : 'Heatmap requiert 2 catégorielles + 1 numérique';

    default:
      return null;
  }
}
```

---

## 🎨 Styles CSS suggérés

```css
.google-sheets-importer {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.google-sheets-importer input,
.google-sheets-importer textarea,
.google-sheets-importer select {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.google-sheets-importer button {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.google-sheets-importer button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.google-sheets-importer .error {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.google-sheets-importer .success {
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  margin-top: 1rem;
}

.variable-type-editor table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.variable-type-editor th,
.variable-type-editor td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.variable-type-editor select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
```

---

## 📚 Ressources supplémentaires

### Documentation API complète
Voir `API_ENDPOINTS.md` pour la liste complète des endpoints.

### Exemples de sheets Google
- COD Players: `1semtK-pmRquxyF88CjpjwmNpwhYezCHaWRKFkX90WkY`
- Valo Players: `1d6b3E3KEy1TwPRJgjvbgcrDrUbawUkHl9ckpNESyzeg`
- CS2 Players: `1afhfsV8ph7fyt-XQA6KuNERDpowavTkvL01SILbgCe8`

### Service Account
Les Google Sheets doivent être partagés avec:
```
admin-419@sae5012.iam.gserviceaccount.com
```

---

**Bonne intégration ! 🚀**
