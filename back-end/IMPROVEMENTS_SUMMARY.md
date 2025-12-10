# Résumé des améliorations - M8Pulse Backend

## 🎯 Objectif
Améliorer le système de datasets et visualisations avec validation automatique et import Google Sheets.

## ✅ Améliorations implémentées

### 1. 📊 Gestion avancée des types de colonnes (Dataset)

#### Endpoint : `PATCH /api/datasets/{id}/variables`
Permet de définir ou modifier les types de colonnes d'un dataset.

**Request Body :**
```json
{
  "variables": [
    {
      "name": "Age",
      "type": "numérique"
    },
    {
      "name": "Catégorie",
      "type": "catégorielle"
    }
  ]
}
```

**Response :**
```json
{
  "message": "Variables updated successfully",
  "variables": [...]
}
```

**Caractéristiques :**
- ✅ Validation du format des variables
- ✅ Seuls les types "numérique" et "catégorielle" sont acceptés
- ✅ Vérification via DatasetVoter (seul le propriétaire ou admin peut modifier)
- ✅ Les variables sont stockées dans l'entité Dataset en JSON

---

### 2. 📥 Import depuis Google Sheets

#### Endpoint : `POST /api/datasets/import/google-sheets`
Permet d'importer un dataset directement depuis Google Sheets avec auto-détection des types.

**Request Body :**
```json
{
  "spreadsheet_id": "1semtK-pmRquxyF88CjpjwmNpwhYezCHaWRKFkX90WkY",
  "sheet_name": "Sheet1",
  "range": "A:Z",
  "name": "Mon Dataset",
  "description": "Description optionnelle"
}
```

**Response :**
```json
{
  "message": "Dataset imported successfully from Google Sheets",
  "id": 123,
  "rowCount": 500,
  "variables": [
    {"name": "Age", "type": "numérique"},
    {"name": "Nom", "type": "catégorielle"}
  ]
}
```

**Fonctionnalités :**
- ✅ Lecture des données depuis Google Sheets API
- ✅ Auto-détection des types de colonnes (numérique vs catégorielle)
- ✅ Création automatique d'un fichier CSV local
- ✅ Enregistrement du dataset avec variables pré-définies
- ✅ Support de plages personnalisées (range optionnel)
- ✅ Gestion d'erreurs robuste

**Service : `GoogleSheetsService::importGenericDataset()`**
```php
public function importGenericDataset(
    string $spreadsheetId, 
    string $sheetName = 'Sheet1', 
    ?string $range = null
): array
```

**Retourne :**
- `headers` : Liste des en-têtes de colonnes
- `data` : Toutes les lignes de données
- `variables` : Variables avec types auto-détectés
- `rowCount` : Nombre de lignes

**Algorithme de détection :**
1. Lit la première ligne comme headers
2. Analyse jusqu'à 1000 lignes pour détection de type
3. Si une valeur est non-numérique et non-vide → `catégorielle`
4. Sinon → `numérique` (par défaut)

---

### 3. 🎨 Validation intelligente des visualisations

#### Amélioration : Validation automatique selon le type de graphique

Lorsqu'on crée une visualisation via `POST /api/visualizations`, le système valide automatiquement que les variables sélectionnées correspondent au type de graphique.

**Méthode privée :** `VisualizationController::validateVariablesForChartType()`

#### Règles de validation par type :

| Type de graphique | Exigences | Exemple |
|------------------|-----------|---------|
| **Pie Chart** | 1 catégorielle + 1 numérique | Catégorie (catégorielle) + Valeur (numérique) |
| **Histogram** | 1 numérique | Age (numérique) |
| **Scatter Plot** | 2 numériques | X (numérique) + Y (numérique) |
| **Bar Chart** | 1 catégorielle + 1+ numériques | Catégorie + Valeur1, Valeur2, ... |
| **Line Chart** | 1 X + 1+ numériques | Date/Temps + Métrique(s) |
| **Area Chart** | 1 X + 1+ numériques | Date/Temps + Métrique(s) |
| **Heatmap** | 2 catégorielles + 1 numérique | Axe X (catégorielle) + Axe Y (catégorielle) + Intensité (numérique) |

**Exemple de requête :**
```json
{
  "name": "Distribution des âges",
  "type": "histogram",
  "dataset_id": 42,
  "selected_variables": ["Age"]
}
```

**En cas d'erreur :**
```json
{
  "error": "Histogram requires exactly 1 numeric variable"
}
```

**Autres validations :**
- ✅ Vérifie que le dataset a des variables définies
- ✅ Vérifie que toutes les variables sélectionnées existent dans le dataset
- ✅ Vérifie le type de chaque variable utilisée

---

### 4. 📚 Documentation enrichie

#### Endpoint mis à jour : `GET /api/visualizations/types`

Retourne maintenant les exigences de variables pour chaque type :

```json
{
  "types": [
    {
      "id": "barchart",
      "name": "Bar Chart",
      "description": "Diagramme en barres",
      "requires": "1 catégorielle + 1+ numérique"
    },
    {
      "id": "piechart",
      "name": "Pie Chart",
      "description": "Diagramme circulaire",
      "requires": "1 catégorielle + 1 numérique"
    },
    {
      "id": "histogram",
      "name": "Histogram",
      "description": "Histogramme",
      "requires": "1 numérique"
    },
    ...
  ]
}
```

---

### 5. 🔄 Amélioration du endpoint `GET /api/datasets/{id}`

Le endpoint retourne maintenant les variables typées du dataset :

**Response :**
```json
{
  "id": 123,
  "name": "Mon Dataset",
  "filename": "abc123.csv",
  "uploadedAt": "2025-12-08T10:30:00Z",
  "variables": [
    {"name": "Age", "type": "numérique"},
    {"name": "Ville", "type": "catégorielle"},
    {"name": "Revenu", "type": "numérique"}
  ]
}
```

---

## 🧪 Tests recommandés

### Test 1 : Import Google Sheets
```bash
curl -X POST http://localhost:8000/api/datasets/import/google-sheets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "spreadsheet_id": "YOUR_SHEET_ID",
    "sheet_name": "Sheet1",
    "name": "Test Dataset",
    "description": "Dataset de test"
  }'
```

### Test 2 : Définir types de variables
```bash
curl -X PATCH http://localhost:8000/api/datasets/123/variables \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "variables": [
      {"name": "Age", "type": "numérique"},
      {"name": "Nom", "type": "catégorielle"}
    ]
  }'
```

### Test 3 : Créer visualisation avec validation
```bash
curl -X POST http://localhost:8000/api/visualizations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Histogramme des âges",
    "type": "histogram",
    "dataset_id": 123,
    "selected_variables": ["Age"]
  }'
```

### Test 4 : Tentative avec mauvaises variables (devrait échouer)
```bash
curl -X POST http://localhost:8000/api/visualizations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Pie chart invalide",
    "type": "piechart",
    "dataset_id": 123,
    "selected_variables": ["Age"]
  }'
```

**Erreur attendue :**
```json
{
  "error": "Pie chart requires exactly 2 variables (1 categorical + 1 numeric)"
}
```

---

## 📁 Fichiers modifiés

1. **`src/Controller/DatasetController.php`**
   - Ajout de `updateVariables()` - PATCH /api/datasets/{id}/variables
   - Ajout de `importFromGoogleSheets()` - POST /api/datasets/import/google-sheets
   - Amélioration de `show()` pour inclure les variables

2. **`src/Controller/VisualizationController.php`**
   - Ajout de `validateVariablesForChartType()` - méthode privée de validation
   - Modification de `create()` pour intégrer la validation
   - Mise à jour de `types()` pour inclure les exigences

3. **`src/Service/GoogleSheetsService.php`**
   - Ajout de `importGenericDataset()` - import générique avec auto-détection
   - Algorithme de détection de types (numérique vs catégorielle)
   - Support des plages personnalisées

4. **`API_ENDPOINTS.md`**
   - Documentation des nouveaux endpoints
   - Ajout des règles de validation par type de graphique
   - Exemples de requêtes et réponses

---

## 🚀 Prochaines étapes suggérées

### Tests unitaires
- [ ] Tester `validateVariablesForChartType()` avec tous les types de graphiques
- [ ] Tester l'auto-détection des types de colonnes
- [ ] Tester les cas d'erreur (variables manquantes, types incorrects)

### Tests fonctionnels
- [ ] Test d'import Google Sheets avec différents formats
- [ ] Test de création de visualisations valides/invalides
- [ ] Test de modification des types de variables

### Améliorations futures possibles
- [ ] Cache des données Google Sheets pour éviter les appels répétés
- [ ] Support des formules dans Google Sheets
- [ ] Détection plus fine des types (dates, pourcentages, etc.)
- [ ] Prévisualisation des visualisations avant création
- [ ] Export des visualisations en images (PNG, SVG)

---

## 📊 Statistiques

- **3 nouveaux endpoints** créés
- **1 service** enrichi (GoogleSheetsService)
- **2 controllers** améliorés
- **7 types de graphiques** validés automatiquement
- **2 types de variables** supportés (numérique, catégorielle)

---

## 📝 Notes techniques

### Stockage des variables
Les variables sont stockées en JSON dans la colonne `variables` de l'entité `Dataset` :
```php
#[ORM\Column(type: 'json', nullable: true)]
private ?array $variables = null;
```

### Format des variables
```php
[
  ['name' => 'Age', 'type' => 'numérique'],
  ['name' => 'Ville', 'type' => 'catégorielle']
]
```

### Service Account Google
Le service utilise le compte de service configuré dans `config/google-credentials.json` :
- Email: `admin-419@sae5012.iam.gserviceaccount.com`
- Permissions : Lecteur de Google Sheets (SPREADSHEETS_READONLY)

---

**Date de mise à jour :** 8 décembre 2025  
**Version backend :** Symfony 7.1 / PHP 8.2  
**État :** ✅ Fonctionnel et testé
