# M8Pulse API Backend - Documentation Complète

## 🎯 Vue d'ensemble

API REST Symfony 7.0 pour un CMS de Data Storytelling avec gestion fine des utilisateurs et des blocs d'articles.

## 📋 Table des matières

1. [Installation](#installation)
2. [Authentification](#authentification)
3. [Rôles et Permissions](#rôles-et-permissions)
4. [Endpoints API](#endpoints-api)
   - [Utilisateurs](#1-utilisateurs)
   - [Articles](#2-articles)
   - [Blocs](#3-blocs)
   - [Media](#4-media)
   - [Datasets](#5-datasets)
   - [Visualisations](#6-visualisations)
   - [Notations](#7-notations)
   - [Thèmes](#8-thèmes)
   - [Page d'accueil](#9-page-daccueil)

---

## 🚀 Installation

### Prérequis
- Docker & Docker Compose
- PHP 8.2+
- Composer

### Démarrage rapide

```bash
# Démarrer les conteneurs Docker
docker compose up -d --build

# Se connecter au conteneur backend
docker exec -it m8pulse_backend bash

# Installer les dépendances Composer
composer install

# Générer les clés JWT
mkdir -p config/jwt
openssl genpkey -out config/jwt/private.pem -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096 -pass pass:m8pulse2024
openssl pkey -in config/jwt/private.pem -out config/jwt/public.pem -pubout -passin pass:m8pulse2024

# Créer la base de données et les tables
php bin/console doctrine:database:create
php bin/console doctrine:migrations:migrate

# Charger les données de test (optionnel)
php bin/console doctrine:fixtures:load
```

---

## 🔐 Authentification

L'API utilise **JWT (JSON Web Tokens)** pour l'authentification.

### Login

```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
  "refresh_token": "..."
}
```

### Utilisation du token

Ajoutez le token JWT dans l'en-tête de chaque requête :

```http
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...
```

---

## 👥 Rôles et Permissions

| Rôle | Code | Permissions |
|------|------|-------------|
| **Visiteur** | `ROLE_VISITOR` | Lecture seule des articles publiés |
| **Abonné** | `ROLE_SUBSCRIBER` | Lecture + Notation |
| **Auteur** | `ROLE_AUTHOR` | Création/édition de ses articles et blocs |
| **Éditeur** | `ROLE_EDITOR` | Gestion complète des articles (tous) |
| **Designer** | `ROLE_DESIGNER` | Gestion des thèmes et styles |
| **Fournisseur** | `ROLE_PROVIDER` | Upload et validation des datasets |
| **Admin** | `ROLE_ADMIN` | Accès complet à toutes les fonctionnalités |

---

## 📡 Endpoints API

### 1. Utilisateurs

#### Liste des utilisateurs
```http
GET /api/users
Authorization: Bearer {token}
Roles: ROLE_ADMIN
```

**Réponse:**
```json
[
  {
    "id": 45,
    "username": "john",
    "email": "john@example.com",
    "roles": ["ROLE_AUTHOR"],
    "subscriptionLevel": "silver",
    "createdAt": "2024-11-18T10:00:00+00:00"
  }
]
```

#### Détail d'un utilisateur
```http
GET /api/users/{id}
Authorization: Bearer {token}
Roles: ROLE_ADMIN
```

#### Inscription
```http
POST /api/users/register
Content-Type: application/json

{
  "email": "new@example.com",
  "password": "password123",
  "username": "newuser",
  "subscriptionLevel": "bronze"
}
```

#### Mon profil
```http
GET /api/users/me
Authorization: Bearer {token}
Roles: ROLE_USER
```

#### Modifier les rôles
```http
PATCH /api/users/{id}/roles
Authorization: Bearer {token}
Roles: ROLE_ADMIN
Content-Type: application/json

{
  "roles": ["ROLE_AUTHOR", "ROLE_SUBSCRIBER"]
}
```

#### Modifier l'abonnement
```http
PATCH /api/users/{id}/subscription
Authorization: Bearer {token}
Roles: ROLE_ADMIN
Content-Type: application/json

{
  "subscriptionLevel": "gold"
}
```

---

### 2. Articles

#### Liste des articles
```http
GET /api/articles?type=data-story&search=performance&limit=10&offset=0
Authorization: Bearer {token} (optionnel)
```

**Paramètres:**
- `type` : Type d'article (standard, data-story, analysis)
- `status` : Statut (draft, review, published)
- `author` : ID de l'auteur
- `search` : Recherche dans titre/résumé
- `limit` : Nombre de résultats
- `offset` : Pagination

**Réponse:**
```json
[
  {
    "id": 8,
    "title": "Analyse des performances",
    "summary": "Une analyse approfondie...",
    "type": "data-story",
    "status": "published",
    "author": {
      "id": 45,
      "username": "john"
    },
    "blocks": [...],
    "viewCount": 245,
    "averageRating": 4.5,
    "createdAt": "2024-11-10T12:00:00+00:00",
    "publishedAt": "2024-11-15T09:00:00+00:00"
  }
]
```

#### Détail d'un article
```http
GET /api/articles/{id}
```

#### Créer un article
```http
POST /api/articles
Authorization: Bearer {token}
Roles: ROLE_AUTHOR
Content-Type: application/json

{
  "title": "Nouvel article",
  "summary": "Résumé de l'article",
  "type": "data-story",
  "status": "draft"
}
```

#### Modifier un article
```http
PUT /api/articles/{id}
Authorization: Bearer {token}
Roles: ROLE_AUTHOR (propriétaire), ROLE_EDITOR, ROLE_ADMIN
Content-Type: application/json

{
  "title": "Titre modifié",
  "summary": "Nouveau résumé",
  "status": "review"
}
```

#### Supprimer un article
```http
DELETE /api/articles/{id}
Authorization: Bearer {token}
Roles: ROLE_AUTHOR (propriétaire), ROLE_EDITOR, ROLE_ADMIN
```

#### Publier un article
```http
POST /api/articles/{id}/publish
Authorization: Bearer {token}
Roles: ROLE_EDITOR, ROLE_ADMIN
```

#### Statistiques des articles
```http
GET /api/articles/stats
Authorization: Bearer {token}
Roles: ROLE_ADMIN
```

---

### 3. Blocs

#### Liste des blocs d'un article
```http
GET /api/blocks/article/{articleId}
```

**Réponse:**
```json
[
  {
    "id": 14,
    "type": "visualization",
    "content": null,
    "config": {
      "width": "100%",
      "height": "400px"
    },
    "position": 1,
    "media": null,
    "visualization": {
      "id": 5,
      "name": "Kills par agent",
      "type": "barchart"
    },
    "averageRating": 4.2,
    "createdAt": "2024-11-18T10:00:00+00:00"
  }
]
```

#### Détail d'un bloc
```http
GET /api/blocks/{id}
```

#### Créer un bloc
```http
POST /api/blocks
Authorization: Bearer {token}
Roles: ROLE_AUTHOR
Content-Type: application/json

{
  "article_id": 8,
  "type": "text",
  "content": "Contenu du bloc en Markdown",
  "position": 1,
  "config": {
    "fontSize": "16px"
  }
}
```

**Types de blocs:**
- `text` : Texte riche (Markdown)
- `title` : Titre (H1, H2, H3...)
- `image` : Image
- `visualization` : Visualisation de données

#### Modifier un bloc
```http
PATCH /api/blocks/{id}
Authorization: Bearer {token}
Roles: ROLE_AUTHOR
Content-Type: application/json

{
  "content": "Nouveau contenu",
  "position": 2
}
```

#### Supprimer un bloc
```http
DELETE /api/blocks/{id}
Authorization: Bearer {token}
Roles: ROLE_AUTHOR
```

#### Réorganiser les blocs
```http
POST /api/blocks/reorder
Authorization: Bearer {token}
Roles: ROLE_AUTHOR
Content-Type: application/json

{
  "blocks": [
    {"id": 14, "position": 0},
    {"id": 15, "position": 1},
    {"id": 16, "position": 2}
  ]
}
```

---

### 4. Media

#### Liste des médias
```http
GET /api/media?search=logo&type=image&tag=header
Authorization: Bearer {token}
```

**Paramètres:**
- `search` : Recherche par nom
- `type` : Type (image, video, document)
- `tag` : Filtrer par tag

#### Détail d'un média
```http
GET /api/media/{id}
```

#### Upload d'un média
```http
POST /api/media/upload
Authorization: Bearer {token}
Roles: ROLE_AUTHOR
Content-Type: multipart/form-data

file: [fichier]
name: "Logo M8Pulse"
tags: ["logo", "header"]
```

**Réponse:**
```json
{
  "message": "Media uploaded successfully",
  "id": 42,
  "path": "/uploads/media/abc123.png"
}
```

#### Modifier un média
```http
PATCH /api/media/{id}
Authorization: Bearer {token}
Roles: ROLE_AUTHOR
Content-Type: application/json

{
  "name": "Nouveau nom",
  "tags": ["nouveau", "tag"]
}
```

#### Supprimer un média
```http
DELETE /api/media/{id}
Authorization: Bearer {token}
Roles: ROLE_EDITOR
```

---

### 5. Datasets

#### Liste des datasets
```http
GET /api/datasets
Authorization: Bearer {token}
```

**Réponse:**
```json
[
  {
    "id": 3,
    "name": "Stats FPS Valorant",
    "description": "Statistiques de performance",
    "source": "https://docs.google.com/spreadsheets/...",
    "variables": [
      {"name": "Kills", "type": "numérique"},
      {"name": "Agent", "type": "catégorielle"}
    ],
    "rowCount": 150,
    "status": "validated",
    "uploader": {
      "id": 12,
      "username": "dataprovider"
    },
    "uploadedAt": "2024-11-10T10:00:00+00:00"
  }
]
```

#### Détail d'un dataset
```http
GET /api/datasets/{id}
Authorization: Bearer {token}
```

#### Upload d'un dataset CSV
```http
POST /api/datasets/upload
Authorization: Bearer {token}
Roles: ROLE_PROVIDER
Content-Type: multipart/form-data

file: [fichier.csv]
name: "Stats FPS"
description: "Statistiques de performance FPS"
source: "https://..."
```

**Réponse:**
```json
{
  "message": "Dataset uploaded successfully",
  "id": 3,
  "variables": [
    {"name": "Kills", "type": "numérique"},
    {"name": "Deaths", "type": "numérique"},
    {"name": "Agent", "type": "catégorielle"}
  ],
  "row_count": 150
}
```

#### Valider un dataset
```http
POST /api/datasets/{id}/validate
Authorization: Bearer {token}
Roles: ROLE_PROVIDER
Content-Type: application/json

{
  "variables": [
    {"name": "Kills", "type": "numérique"},
    {"name": "Agent", "type": "catégorielle"}
  ]
}
```

#### Modifier un dataset
```http
PATCH /api/datasets/{id}
Authorization: Bearer {token}
Roles: ROLE_PROVIDER
Content-Type: application/json

{
  "name": "Nouveau nom",
  "description": "Nouvelle description"
}
```

#### Supprimer un dataset
```http
DELETE /api/datasets/{id}
Authorization: Bearer {token}
Roles: ROLE_PROVIDER
```

---

### 6. Visualisations

#### Liste des visualisations
```http
GET /api/visualizations
Authorization: Bearer {token}
```

**Réponse:**
```json
[
  {
    "id": 5,
    "name": "Kills par agent",
    "description": "Distribution des kills",
    "type": "barchart",
    "dataset": {
      "id": 3,
      "name": "Stats FPS"
    },
    "config": {...},
    "selectedVariables": ["Agent", "Kills"],
    "colors": ["#4F46E5", "#06B6D4"],
    "createdAt": "2024-11-15T10:00:00+00:00"
  }
]
```

#### Détail d'une visualisation
```http
GET /api/visualizations/{id}
```

#### Créer une visualisation
```http
POST /api/visualizations
Authorization: Bearer {token}
Roles: ROLE_AUTHOR
Content-Type: application/json

{
  "name": "Kills par agent",
  "description": "Distribution des kills par agent",
  "type": "barchart",
  "dataset_id": 3,
  "selected_variables": ["Agent", "Kills"],
  "colors": ["#4F46E5", "#06B6D4"],
  "config": {
    "showLegend": true,
    "showGrid": true
  }
}
```

**Types de visualisations:**
- `barchart` : Diagramme en barres
- `piechart` : Diagramme circulaire
- `scatterplot` : Nuage de points
- `histogram` : Histogramme
- `linechart` : Graphique linéaire
- `areachart` : Graphique en aires
- `heatmap` : Carte de chaleur

#### Modifier une visualisation
```http
PATCH /api/visualizations/{id}
Authorization: Bearer {token}
Roles: ROLE_AUTHOR
Content-Type: application/json

{
  "name": "Nouveau nom",
  "colors": ["#FF0000", "#00FF00"]
}
```

#### Supprimer une visualisation
```http
DELETE /api/visualizations/{id}
Authorization: Bearer {token}
Roles: ROLE_AUTHOR
```

#### Types de visualisations disponibles
```http
GET /api/visualizations/types
```

---

### 7. Notations

#### Noter un article
```http
POST /api/ratings/article/{articleId}
Authorization: Bearer {token}
Roles: ROLE_SUBSCRIBER
Content-Type: application/json

{
  "stars": 5,
  "comment": "Excellent article !"
}
```

#### Noter un bloc
```http
POST /api/ratings/block/{blockId}
Authorization: Bearer {token}
Roles: ROLE_SUBSCRIBER
Content-Type: application/json

{
  "stars": 4,
  "comment": "Très bonne visualisation"
}
```

#### Récupérer les notes d'un article
```http
GET /api/ratings/article/{articleId}
```

#### Récupérer les notes d'un bloc
```http
GET /api/ratings/block/{blockId}
```

#### Mes notations
```http
GET /api/ratings/user/me
Authorization: Bearer {token}
Roles: ROLE_SUBSCRIBER
```

#### Supprimer une notation
```http
DELETE /api/ratings/{id}
Authorization: Bearer {token}
Roles: ROLE_SUBSCRIBER
```

---

### 8. Thèmes

#### Liste des thèmes
```http
GET /api/themes?scope=global&active_only=true
Authorization: Bearer {token}
```

**Réponse:**
```json
[
  {
    "id": 1,
    "name": "Thème Sombre",
    "description": "Thème dark mode",
    "scope": "global",
    "styles": {
      "colors": {
        "primary": "#4F46E5",
        "secondary": "#06B6D4",
        "background": "#1E293B",
        "text": "#F8FAFC"
      },
      "fonts": {
        "heading": "Inter",
        "body": "Roboto"
      },
      "spacing": {
        "base": "16px"
      }
    },
    "isDefault": true,
    "isActive": true
  }
]
```

#### Détail d'un thème
```http
GET /api/themes/{id}
```

#### Créer un thème
```http
POST /api/themes
Authorization: Bearer {token}
Roles: ROLE_DESIGNER
Content-Type: application/json

{
  "name": "Mon thème",
  "description": "Description du thème",
  "scope": "global",
  "styles": {
    "colors": {...},
    "fonts": {...}
  },
  "is_default": false,
  "is_active": true
}
```

**Scopes:**
- `global` : Thème global du site
- `article` : Thème spécifique à un article
- `block` : Thème pour un type de bloc

#### Modifier un thème
```http
PATCH /api/themes/{id}
Authorization: Bearer {token}
Roles: ROLE_DESIGNER
Content-Type: application/json

{
  "styles": {
    "colors": {
      "primary": "#FF0000"
    }
  }
}
```

#### Supprimer un thème
```http
DELETE /api/themes/{id}
Authorization: Bearer {token}
Roles: ROLE_DESIGNER
```

#### Activer un thème
```http
POST /api/themes/{id}/activate
Authorization: Bearer {token}
Roles: ROLE_DESIGNER
```

#### Définir comme thème par défaut
```http
POST /api/themes/{id}/set-default
Authorization: Bearer {token}
Roles: ROLE_ADMIN
```

#### Récupérer le thème par défaut
```http
GET /api/themes/default/{scope}
```

---

### 9. Page d'accueil

#### Configuration de la page d'accueil
```http
GET /api/welcome
```

**Réponse:**
```json
{
  "id": 1,
  "welcomeText": "Bienvenue sur M8Pulse - Plateforme de Data Storytelling",
  "visualizationConfig": {
    "type": "threejs",
    "scene": "particles",
    "camera": {
      "position": {"x": 0, "y": 0, "z": 5}
    },
    "animation": {
      "speed": 1.0,
      "particles": 1000
    },
    "colors": {
      "primary": "#4F46E5",
      "secondary": "#06B6D4"
    }
  },
  "isActive": true
}
```

#### Modifier la configuration
```http
PUT /api/welcome
Authorization: Bearer {token}
Roles: ROLE_ADMIN
Content-Type: application/json

{
  "welcome_text": "Nouveau texte d'accueil",
  "visualization_config": {
    "type": "threejs",
    "scene": "waves",
    "animation": {
      "speed": 0.5
    }
  }
}
```

#### Templates de visualisation 3D
```http
GET /api/welcome/templates
Authorization: Bearer {token}
Roles: ROLE_ADMIN
```

#### Prévisualiser la configuration
```http
POST /api/welcome/preview
Authorization: Bearer {token}
Roles: ROLE_ADMIN
Content-Type: application/json

{
  "welcome_text": "Test",
  "visualization_config": {...}
}
```

---

## 🔒 Sécurité

### CORS
L'API accepte les requêtes cross-origin depuis le frontend React (`http://localhost:3000`).

### Rate Limiting
*(À implémenter) Limitation des requêtes par IP et par utilisateur.*

### Validation
Toutes les entrées sont validées avec le composant Validator de Symfony.

---

## 📊 Codes de statut HTTP

| Code | Description |
|------|-------------|
| 200 | OK - Requête réussie |
| 201 | Created - Ressource créée |
| 400 | Bad Request - Données invalides |
| 401 | Unauthorized - Token manquant/invalide |
| 403 | Forbidden - Permissions insuffisantes |
| 404 | Not Found - Ressource introuvable |
| 405 | Method Not Allowed - Méthode HTTP incorrecte |
| 409 | Conflict - Conflit (ex: email déjà utilisé) |
| 500 | Internal Server Error - Erreur serveur |

---

## 🧪 Tests

```bash
# Tests unitaires
php bin/phpunit

# Tests d'intégration
php bin/console --env=test doctrine:fixtures:load
php bin/phpunit --group integration
```

---

## 📝 Changelog

### Version 1.0.0 (2024-11-18)
- ✨ Système complet d'authentification JWT
- ✨ Gestion des utilisateurs avec 7 rôles distincts
- ✨ CRUD complet pour articles et blocs
- ✨ Upload et gestion des médias
- ✨ Upload et parsing automatique de datasets CSV
- ✨ Création de visualisations (7 types)
- ✨ Système de notation par étoiles (articles et blocs)
- ✨ Gestion des thèmes avec designer
- ✨ Configuration de page d'accueil 3D

---

## 🤝 Support

Pour toute question ou problème, contactez l'équipe de développement M8Pulse.

**Base URL:** `http://localhost:8000`
**Version:** 1.0.0
**Auteur:** M8Pulse Team
