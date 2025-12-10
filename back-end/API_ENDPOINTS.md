# API M8Pulse - Documentation

## 🔐 Authentification
- `POST /api/login` - Connexion (retourne JWT token)
- `POST /api/users/register` - Inscription

## 📝 Articles
- `GET /api/articles` - Liste des articles (filtres: type, status, author, search, limit, offset)
- `GET /api/articles/{id}` - Détail d'un article
- `POST /api/articles` - Créer un article (ROLE_AUTHOR)
- `PUT/PATCH /api/articles/{id}` - Modifier un article (permissions via Voter)
- `DELETE /api/articles/{id}` - Supprimer un article (permissions via Voter)
- `POST /api/articles/{id}/publish` - Publier un article (ROLE_EDITOR/ADMIN)
- `GET /api/articles/stats` - Statistiques des articles

## 🧱 Blocs
- `GET /api/blocks/article/{articleId}` - Liste des blocs d'un article
- `GET /api/blocks/{id}` - Détail d'un bloc
- `POST /api/blocks` - Créer un bloc (permissions via Voter)
- `PUT/PATCH /api/blocks/{id}` - Modifier un bloc (permissions via Voter)
- `DELETE /api/blocks/{id}` - Supprimer un bloc (permissions via Voter)
- `POST /api/blocks/reorder` - Réorganiser les blocs

## 📊 Datasets
- `GET /api/datasets` - Liste des datasets
- `GET /api/datasets/{id}` - Détail d'un dataset avec variables
- `POST /api/datasets/upload` - Upload CSV (ROLE_PROVIDER)
- `POST /api/datasets/import/google-sheets` - **NOUVEAU** Importer depuis Google Sheets (ROLE_PROVIDER)
  - Body: `{spreadsheet_id, sheet_name, range?, name, description?}`
  - Auto-détection des types de colonnes (numérique/catégorielle)
- `PATCH /api/datasets/{id}/variables` - **NOUVEAU** Définir les types de colonnes
  - Body: `{variables: [{name, type}]}`
  - Types: "numérique" ou "catégorielle"
- `POST /api/datasets/{id}/validate` - Valider un dataset (ROLE_PROVIDER)
- `PATCH /api/datasets/{id}` - Modifier un dataset (permissions via Voter)
- `DELETE /api/datasets/{id}` - Supprimer un dataset (permissions via Voter)

## 🖼️ Médias
- `GET /api/media` - Liste des médias (filtres: search, type, tag)
- `GET /api/media/{id}` - Détail d'un média
- `POST /api/media/upload` - Upload média (ROLE_AUTHOR+)
- `PATCH /api/media/{id}` - Modifier un média (permissions via Voter)
- `DELETE /api/media/{id}` - Supprimer un média (permissions via Voter)

## 📈 Visualisations
- `GET /api/visualizations` - Liste des visualisations
- `GET /api/visualizations/{id}` - Détail d'une visualisation
- `POST /api/visualizations` - **AMÉLIORÉ** Créer une visualisation avec validation automatique
  - Valide les variables selon le type de graphique :
    - **Pie Chart** : 1 catégorielle + 1 numérique
    - **Histogram** : 1 numérique
    - **Scatter Plot** : 2 numériques
    - **Bar Chart** : 1 catégorielle + 1+ numériques
    - **Line/Area Chart** : 1 X + 1+ numériques
    - **Heatmap** : 2 catégorielles + 1 numérique
- `PUT/PATCH /api/visualizations/{id}` - Modifier une visualisation
- `DELETE /api/visualizations/{id}` - Supprimer une visualisation
- `GET /api/visualizations/types` - **AMÉLIORÉ** Types avec exigences de variables

## ⭐ Notations
- `GET /api/ratings/article/{articleId}` - Notes d'un article
- `GET /api/ratings/block/{blockId}` - Notes d'un bloc
- `POST /api/ratings/article/{articleId}` - Noter un article (ROLE_SUBSCRIBER)
- `POST /api/ratings/block/{blockId}` - Noter un bloc (ROLE_SUBSCRIBER)
- `DELETE /api/ratings/{id}` - Supprimer une note
- `GET /api/ratings/user/me` - Mes notes

## 🎨 Thèmes
- `GET /api/themes` - Liste des thèmes (filtres: scope, active_only)
- `GET /api/themes/{id}` - Détail d'un thème
- `POST /api/themes` - Créer un thème (ROLE_DESIGNER)
- `PUT/PATCH /api/themes/{id}` - Modifier un thème (ROLE_DESIGNER)
- `DELETE /api/themes/{id}` - Supprimer un thème (ROLE_DESIGNER)
- `POST /api/themes/{id}/activate` - Activer un thème (ROLE_DESIGNER)
- `POST /api/themes/{id}/set-default` - Définir comme défaut (ROLE_ADMIN)
- `GET /api/themes/default/{scope}` - Thème par défaut (scope: global)

## 👥 Utilisateurs
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/{id}` - Détail d'un utilisateur
- `GET /api/users/me` - Mon profil
- `PATCH /api/users/{id}/roles` - Modifier les rôles (ROLE_ADMIN)
- `PATCH /api/users/{id}/subscription` - Modifier l'abonnement
- `DELETE /api/users/{id}` - Supprimer un utilisateur

## 🎮 Players (Esports)
- `GET /api/cod/players` - Joueurs Call of Duty
- `GET /api/valo/players` - Joueurs Valorant
- `GET /api/cs2/players` - Joueurs Counter-Strike 2

## 🏠 Page d'accueil
- `GET /api/welcome` - Configuration de la page d'accueil
- `PUT/PATCH /api/welcome` - Modifier la configuration
- `POST /api/welcome/preview` - Prévisualiser
- `GET /api/welcome/templates` - Templates disponibles

## 🔒 Permissions (Voters)

### ArticleVoter
- **CREATE** : Auteur, Éditeur
- **EDIT** : Auteur (ses articles), Éditeur (tous)
- **DELETE** : Éditeur, Auteur (ses articles non publiés)
- **PUBLISH** : Éditeur, Admin

### BlockVoter
- **CREATE/EDIT/DELETE** : Auteur (ses articles), Éditeur (tous)

### ThemeVoter
- **CREATE/EDIT/DELETE/ACTIVATE** : Designer, Admin

### DatasetVoter
- **CREATE/EDIT/DELETE** : Provider (ses datasets), Admin

### MediaVoter
- **UPLOAD** : Auteur, Éditeur, Designer
- **DELETE** : Propriétaire, Éditeur, Admin

## 📋 Formats de réponse

### Succès
```json
{
  "message": "Success message",
  "data": {...},
  "id": 123
}
```

### Erreur
```json
{
  "error": "Error message"
}
```

### Liste paginée
```json
{
  "data": [...],
  "count": 10,
  "total": 100
}
```
