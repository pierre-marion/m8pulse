# 🗺️ Guide des Routes API - M8PULSE

Ce document explique où trouver chaque route dans le code backend.

## 📍 Structure générale

Les routes sont définies dans : `back-end/src/Controller/`

Chaque controller correspond à un groupe de routes :

---

## 🔐 Authentification : `/api/auth/*` et `/api/login`

**Fichier :** `back-end/src/Controller/AuthController.php`

- `POST /api/auth/register` - Inscription
- `POST /api/login` - Connexion (JWT)
- `POST /api/auth/logout` - Déconnexion

---

## 👥 Utilisateurs : `/api/users/*`

**Fichier :** `back-end/src/Controller/UserController.php`

- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/{id}` - Profil d'un utilisateur
- `PATCH /api/users/{id}` - Modifier un utilisateur
- `DELETE /api/users/{id}` - Supprimer un utilisateur

---

## 📝 Articles : `/api/articles/*`

**Fichier :** `back-end/src/Controller/ArticleController.php`

- `GET /api/articles` - Liste des articles
- `GET /api/articles/{id}` - Détails d'un article
- `POST /api/articles` - Créer un article
- `PATCH /api/articles/{id}` - Modifier un article
- `DELETE /api/articles/{id}` - Supprimer un article
- `POST /api/articles/{id}/publish` - Publier un article

---

## 🖼️ Médias : `/api/media/*`

**Fichier :** `back-end/src/Controller/MediaController.php`

- `POST /api/media/upload` - Upload d'image/vidéo
- `GET /api/media` - Liste des médias./
- `GET /api/media/{id}` - Détails d'un média
- `DELETE /api/media/{id}` - Supprimer un média

---

## 📊 Datasets : `/api/datasets/*`

**Fichier :** `back-end/src/Controller/DatasetController.php`

- `GET /api/datasets` - Liste des datasets
- `GET /api/datasets/{id}` - Détails d'un dataset
- `POST /api/datasets/upload` - Upload CSV
- `POST /api/datasets/{id}/validate` - Valider un dataset
- `DELETE /api/datasets/{id}` - Supprimer un dataset

---

## 📈 Visualisations : `/api/visualizations/*`

**Fichier :** `back-end/src/Controller/VisualizationController.php`

- `GET /api/visualizations` - Liste des visualisations
- `GET /api/visualizations/{id}` - Détails d'une visualisation
- `POST /api/visualizations` - Créer une visualisation
- `PATCH /api/visualizations/{id}` - Modifier une visualisation
- `DELETE /api/visualizations/{id}` - Supprimer une visualisation

---

## ⭐ Notations : `/api/ratings/*`

**Fichier :** `back-end/src/Controller/RatingController.php`

- `POST /api/ratings/article/{id}` - Noter un article
- `GET /api/ratings/article/{id}/user` - Ma note sur un article

---

## 💬 Commentaires : `/api/comments/*`

**Fichier :** `back-end/src/Controller/CommentController.php`

- `GET /api/comments/article/{id}` - Commentaires d'un article
- `POST /api/comments` - Créer un commentaire
- `DELETE /api/comments/{id}` - Supprimer un commentaire

---

## 🎨 Thèmes : `/api/themes/*`

**Fichier :** `back-end/src/Controller/ThemeController.php`

- `GET /api/themes` - Liste des thèmes
- `GET /api/themes/{id}` - Détails d'un thème
- `POST /api/themes` - Créer un thème
- `PATCH /api/themes/{id}` - Modifier un thème
- `DELETE /api/themes/{id}` - Supprimer un thème

---

## 📑 Google Sheets : `/api/google-sheets/*`

**Fichier :** `back-end/src/Controller/GoogleSheetsController.php`

- `POST /api/google-sheets/import` - Importer depuis Google Sheets
- `GET /api/google-sheets/test` - Tester la connexion

---

## 🏠 Page d'accueil

**Fichier :** `back-end/src/Controller/HomeController.php`

- `GET /` - Page d'accueil backend (dashboard)

---

## 📚 Comment trouver une route ?

### Méthode 1 : Recherche par URL
```bash
grep -r "/api/media" back-end/src/Controller/
```

### Méthode 2 : Voir toutes les routes
```bash
docker exec m8pulse_backend php bin/console debug:router
```

### Méthode 3 : Documentation Swagger
Ouvre http://localhost:8000/api/doc pour voir toutes les routes avec leurs paramètres.

---

## 🔍 Exemple concret

**Question prof :** "Où se trouve la route `/api/media/upload` ?"

**Réponse :**
1. **Fichier :** `back-end/src/Controller/MediaController.php`
2. **Ligne :** Cherche `#[Route('/upload'` dans le fichier
3. **Méthode :** `upload()` dans la classe `MediaController`

---

## 💡 Astuces

- Tous les controllers sont dans `back-end/src/Controller/`
- Chaque route a une annotation `#[Route('...'')]`
- Les routes sont groupées par fonctionnalité (Media, Article, etc.)
- La doc Swagger (`/api/doc`) liste TOUTES les routes automatiquement

---

**Dernière mise à jour :** 19 janvier 2026
