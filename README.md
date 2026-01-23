# M8Pulse

**Projet académique BUT MMI - SAÉ 501.2**

M8Pulse est un CMS de data storytelling dédié aux clubs esports. Il permet de créer des articles enrichis de visualisations de données interactives et personnalisables, offrant une identité visuelle unique à chaque club.

🔗 **Dépôt GitHub** : [https://github.com/stonefaII/m8pulse](https://github.com/stonefaII/m8pulse)
---

## 🚀 Fonctionnalités

### 📝 Articles et Data Storytelling
- **Éditeur modulaire** : Construction d'articles via des blocs (titres, paragraphes, images, graphiques).
- **Types de contenus** : Standard, Data Story, Analyse, Tutoriel.
- **Intégration fluide** : Les graphiques s'intègrent naturellement dans la narration.

### 📊 Visualisations Interactives
- **Types de graphiques** : Bar chart, Pie chart, Line chart, Scatter plot, Histogram.
- **Configuration** : Choix des variables (X/Y), couleurs, légendes dynamiques.
- **Interactivité** : Tooltips, filtres et animations.

### 🎨 Système de Thèmes Avancé (Designer)
- **Personnalisation complète** : Couleurs, typographies, logos, mise en page.
- **Scope** : Thème global (site), thème par page ou thème par article.
- **Adaptabilité** : Permet de passer de l'identité de "Team Liquid" à "G2" en quelques clics.

### 📈 Gestion des Données
- **Sources** : Upload de fichiers CSV ou connexion Google Sheets.
- **Parsing intelligent** : Détection automatique des types de données (numérique vs catégoriel).
- **Validation** : Vérification de l'intégrité des datasets avant import.

### 👤 Rôles et Permissions
- **Visitor** : Lecture seule.
- **Subscriber** : Notation et commentaires.
- **Author/Editor** : Rédaction et gestion des articles.
- **Designer** : Gestion de l'apparence et des thèmes.
- **Provider** : Import et validation des données.
- **Admin** : Contrôle total du système.

---

## 🛠 Installation

Le projet utilise **Docker** pour orchestrer l'ensemble de la stack technique.

### Prérequis
- Docker Desktop installé et lancé.
- Git.

### Étapes d'installation

1. **Cloner le projet**
   ```bash
   git clone https://github.com/stonefaII/m8pulse.git
   cd m8pulse
   ```

2. **Lancer les conteneurs**
   ```bash
   docker compose up -d --build
   ```
   *Cela peut prendre quelques minutes lors de la première construction.*

3. **Initialiser le Backend**
   Une fois les conteneurs lancés, exécutez le script d'installation dans le conteneur backend :
   ```bash
   # Entrer dans le conteneur backend
   docker exec -it m8pulse_backend bash

   # Installer les dépendances et initialiser la BDD
   composer install
   ./setup.sh

   # Quitter le conteneur
   exit
   ```
   *Le script `setup.sh` se charge de créer la base de données, jouer les migrations et charger les fixtures (données de test).*

---

## 🖥 Accès et Utilisation

- **Frontend (Site Web)** : [http://localhost:3000](http://localhost:3000)
- **Backend (API)** : [http://localhost:8000](http://localhost:8000)
- **Documentation API** : [http://localhost:8000/api/doc](http://localhost:8000/api/doc)
- **PHPMyAdmin** : [http://localhost:8080](http://localhost:8080)

### Identifiants de test (générés par setup.sh)
Mot de passe pour tous les comptes : `visitor123`, `admin123`, etc. (format : `role` + `123`)

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| **Admin** | admin@m8pulse.com | `admin123` |
| **Designer** | designer@m8pulse.com | `designer123` |
| **Editor** | editor@m8pulse.com | `editor123` |
| **Author** | author@m8pulse.com | `author123` |
| **Provider** | provider@m8pulse.com | `provider123` |
| **Subscriber**| subscriber@m8pulse.com | `subscriber123` |
| **Visitor** | visitor@m8pulse.com | `visitor123` |

---

## 🏗 Stack Technique

- **Backend** : Symfony 7, Doctrine ORM, API Platform (style), JWT Auth.
- **Frontend** : React 18, Three.js (Globe 3D), GSAP, Recharts.
- **Base de données** : MySQL 8.0.
- **DevOps** : Docker Compose.

---

## 🎓 Contexte

Projet réalisé dans le cadre du **BUT MMI** (Métiers du Multimédia et de l'Internet) à l'Université de Tours.

**Équipe** : Hugo, Pierre et Nathan
**Année** : 2025-2026