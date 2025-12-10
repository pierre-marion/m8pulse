# 🔐 Guide de connexion Admin - M8Pulse

## Étapes pour créer votre premier article

### 1️⃣ Se connecter en tant qu'Admin

1. **Ouvrez l'application** : http://localhost:3000
2. **Cliquez sur le bouton de connexion** (icône utilisateur en haut)
3. **Utilisez ces identifiants** :
   - **Email** : `admin@m8pulse.com`
   - **Mot de passe** : `admin123`
4. **Cliquez sur "Se connecter"**

✅ Vous devriez être connecté et voir votre profil Admin

### 2️⃣ Accéder au Dashboard

1. Une fois connecté, cherchez le bouton **"Dashboard"** ou **"Administration"**
2. Cliquez dessus pour accéder à l'interface d'administration

### 3️⃣ Créer un article

Dans le Dashboard, vous verrez la section **"Gestion des Articles"** :

1. **Cliquez sur "✏️ Nouvel Article"**
2. **Remplissez le formulaire** :
   - **Titre** : Ex: "M8 remporte le tournoi Valorant"
   - **Jeu** : Sélectionnez (Valorant 🎯, CS2 🔫, COD 🎮, Fortnite 🏗️, Général ⭐)
   - **Type** : Standard / Data Story / Analyse / Interview / News
   - **Statut** : Publié (pour le voir tout de suite)
   - **Résumé** : Un court texte décrivant l'article
3. **Cliquez sur "✨ Créer l'article"**

✅ Votre article est créé !

### 4️⃣ Voir votre article

1. **Allez dans la page "News"** (menu de gauche)
2. **Votre article apparaît** dans la liste
3. **Cliquez dessus** pour voir la page complète
4. **Vous pouvez** :
   - ⭐ Le noter (1-5 étoiles)
   - 💬 Laisser un commentaire
   - 📊 Voir les statistiques

## 🔧 Résolution de problèmes

### "JWT Token not found" quand je crée un article
➡️ **Solution** : Vous n'êtes pas connecté. Suivez l'étape 1 ci-dessus.

### Je ne vois pas le bouton Dashboard
➡️ **Solution** : Vous n'êtes pas connecté en tant qu'admin. Utilisez `admin@m8pulse.com` / `admin123`

### L'article n'apparaît pas dans News
➡️ **Vérifiez** : 
- Le statut est bien "Publié"
- Rafraîchissez la page (F5)
- Vérifiez les filtres (Type et Jeu)

## 🎮 Fonctionnalités disponibles

### En tant qu'Admin, vous pouvez :
- ✏️ Créer des articles
- 📝 Modifier des articles
- 🗑️ Supprimer des articles
- 👁️ Voir les statistiques (vues, notes, commentaires)

### En tant qu'utilisateur connecté :
- ⭐ Noter les articles (1-5 étoiles)
- 💬 Commenter les articles
- 🗑️ Supprimer vos propres commentaires

### Sans connexion :
- 📖 Lire les articles publiés
- 🔍 Filtrer par jeu et type
- 👁️ Voir les statistiques

## 📧 Besoin d'aide ?

Si vous avez des problèmes :
1. Ouvrez la console du navigateur (F12)
2. Regardez les erreurs dans l'onglet "Console"
3. Vérifiez que le backend est bien lancé : http://localhost:8000/api/articles

---

**Bon test !** 🚀
