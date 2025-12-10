# 🎮 Système d'Articles avec Notes et Commentaires - Guide de Test

## ✅ Ce qui a été créé

### 🔧 Backend (Symfony)

1. **Entité Comment** (`back-end/src/Entity/Comment.php`)
   - Système de commentaires pour les articles
   - Relation avec Article et User
   - Support édition et suppression

2. **CommentController** (`back-end/src/Controller/CommentController.php`)
   - `GET /api/comments/article/{articleId}` - Liste des commentaires
   - `POST /api/comments` - Créer un commentaire
   - `PUT /api/comments/{id}` - Modifier son commentaire
   - `DELETE /api/comments/{id}` - Supprimer son commentaire

3. **RatingController** (déjà existant, amélioration)
   - `GET /api/ratings/article/{articleId}` - Stats de notation
   - `POST /api/ratings/article/{articleId}` - Noter un article (1-5 étoiles)
   - `GET /api/ratings/article/{articleId}/user` - Note de l'utilisateur

4. **Entity Article** - Ajouts
   - Champ `game` (valorant, cs2, cod, fortnite, general)
   - Méthodes `getCommentCount()`, `getRatingCount()`
   - Relation avec les commentaires

5. **Base de données**
   - Table `comments` créée avec migration
   - Colonne `game` ajoutée à la table `articles`

### 🎨 Frontend (React)

1. **ArticleManager** amélioré
   - Formulaire complet avec sélection du jeu
   - Affichage des stats (vues, notes, commentaires)

2. **ArticleDetail** nouveau composant
   - Affichage complet de l'article
   - Système de notation (étoiles interactives)
   - Section commentaires avec formulaire
   - Style CS2/Valorant avec dégradés
   - Support CRUD des commentaires

3. **NewsPage** mise à jour
   - Chargement dynamique depuis l'API
   - Filtres par type et jeu
   - Affichage des stats (vues, notes, commentaires)
   - Navigation vers ArticleDetail au clic

4. **Styles CSS**
   - ArticleDetail.css - Style gaming moderne
   - NewsPage.css - Filtres et cartes d'articles
   - Couleurs thématiques par jeu (Valorant rouge, CS2 orange, etc.)

## 🧪 Comment tester

### 1. Créer un article (Admin uniquement)

1. Connectez-vous en tant qu'admin
2. Allez dans le Dashboard
3. Section "Gestion des Articles"
4. Cliquez sur "✏️ Nouvel Article"
5. Remplissez :
   - Titre : "Premier match de la saison Valorant"
   - Jeu : Valorant
   - Type : News
   - Statut : Publié
   - Résumé : "Les Gentle Mates démarrent fort..."
6. Cliquez sur "✨ Créer l'article"

### 2. Voir l'article dans News

1. Allez dans la page "News"
2. Vous devriez voir votre article
3. Utilisez les filtres pour filtrer par jeu (Valorant) ou type (News)
4. Cliquez sur l'article

### 3. Noter l'article

1. Dans ArticleDetail, scrollez vers la section notation
2. Survolez les étoiles (effet hover)
3. Cliquez sur une étoile pour noter (ex: 5/5)
4. Votre note s'affiche et la moyenne se met à jour

### 4. Commenter l'article

1. Scrollez vers la section commentaires
2. Écrivez un commentaire dans le formulaire
3. Cliquez sur "📤 Publier le commentaire"
4. Votre commentaire apparaît instantanément
5. Vous pouvez le supprimer avec le bouton 🗑️

### 5. Tester les filtres

1. Créez plusieurs articles avec différents jeux
2. Dans News, testez les filtres :
   - Type : Standard, Analysis, Interview, etc.
   - Jeu : Valorant, CS2, COD, Fortnite, Général
3. Les badges colorés s'adaptent au jeu sélectionné

## 🎯 Fonctionnalités principales

### ✨ Système de notation
- ⭐ 1 à 5 étoiles
- 💫 Effet hover interactif
- 📊 Moyenne calculée automatiquement
- 👤 Un utilisateur = une note (modifiable)
- 🔒 Connexion requise

### 💬 Système de commentaires
- ✍️ Texte libre (2-2000 caractères)
- 👤 Auteur affiché
- 📅 Date et heure
- ✏️ Indication "(modifié)" si édité
- 🗑️ Suppression par l'auteur ou admin
- 🔒 Connexion requise

### 🎨 Style gaming
- 🎯 Couleur par jeu (Valorant rouge, CS2 orange, etc.)
- 🌈 Dégradés modernes
- ✨ Animations fluides
- 🎮 Emojis thématiques
- 📱 Responsive

## 📋 API Endpoints disponibles

### Articles
- `GET /api/articles` - Liste des articles publiés
- `GET /api/articles/{id}` - Détail d'un article
- `POST /api/articles` - Créer (admin)
- `PUT /api/articles/{id}` - Modifier (admin)
- `DELETE /api/articles/{id}` - Supprimer (admin)

### Commentaires
- `GET /api/comments/article/{articleId}` - Tous les commentaires
- `POST /api/comments` - Nouveau commentaire
- `PUT /api/comments/{id}` - Modifier son commentaire
- `DELETE /api/comments/{id}` - Supprimer son commentaire

### Notations
- `GET /api/ratings/article/{articleId}` - Stats de notation
- `POST /api/ratings/article/{articleId}` - Noter (1-5)
- `GET /api/ratings/article/{articleId}/user` - Ma note

## 🐛 Résolution de problèmes

### Articles n'apparaissent pas
- Vérifiez que le statut est "published"
- Vérifiez que l'API backend est accessible (http://localhost:8000)
- Ouvrez la console navigateur pour voir les erreurs

### Impossible de commenter/noter
- Vérifiez que vous êtes connecté
- Vérifiez le token dans localStorage
- Regardez les logs de la console

### Erreur 500 sur l'API
- Vérifiez les logs Docker : `docker logs m8pulse_backend`
- Vérifiez la connexion DB dans phpMyAdmin (localhost:8080)

## 🎉 Prochaines étapes suggérées

1. **Éditeur riche** pour le contenu des articles (Blocks)
2. **Upload d'images** pour illustrer les articles
3. **Système de tags** pour catégoriser finement
4. **Partage social** (Twitter, Discord, etc.)
5. **Notifications** pour nouveaux commentaires
6. **Modération** des commentaires par les admins
7. **Recherche fulltext** dans les articles
8. **Articles populaires** (top rated, most viewed)

Bon test ! 🚀
