# Architecture des Composants React - M8 Pulse

Cette application utilise maintenant une architecture React moderne et modulaire avec des composants réutilisables.

## 📁 Structure des Composants

```
src/components/
├── ui/                    # Composants UI de base (Atoms)
│   ├── Button.js
│   ├── Card.js
│   ├── Badge.js
│   ├── Loading.js
│   ├── StatCard.js
│   └── index.js          # Export centralisé
│
├── cards/                 # Composants de cartes (Molecules)
│   ├── MatchCard.js
│   ├── PlayerCard.js
│   ├── NewsCard.js
│   ├── GameCard.js
│   └── index.js          # Export centralisé
│
├── layout/                # Composants de layout
│   ├── SectionHeader.js
│   ├── Grid.js
│   └── index.js          # Export centralisé
│
└── pages/                 # Composants pages (anciennement à la racine)
    ├── HomePage.js
    ├── GamesPage.js
    ├── NewsPage.js
    └── ...
```

## 🧩 Types de Composants

### 1. Composants UI (Atoms)
Composants de base réutilisables sans logique métier :

#### **Button**
```jsx
import { Button } from './components/ui';

<Button variant="primary" size="medium" icon="star">
  Cliquez ici
</Button>

// Props:
// - variant: primary, secondary, outline, ghost
// - size: small, medium, large
// - icon: nom de l'icône
// - iconRight: boolean
// - fullWidth: boolean
// - disabled: boolean
```

#### **Card**
```jsx
import { Card } from './components/ui';

<Card variant="glass" hover clickable>
  {/* Contenu de la carte */}
</Card>

// Props:
// - variant: default, glass, gradient
// - hover: boolean (effet hover)
// - clickable: boolean (curseur pointer)
```

#### **Badge**
```jsx
import { Badge } from './components/ui';

<Badge variant="success" size="small">
  VICTOIRE
</Badge>

// Props:
// - variant: primary, success, warning, danger, info, valorant, cs2, cod, fortnite
// - size: small, medium, large
```

#### **Loading**
```jsx
import { Loading } from './components/ui';

<Loading size="medium" text="Chargement..." />

// Props:
// - size: small, medium, large
// - text: string
// - fullscreen: boolean
```

#### **StatCard**
```jsx
import { StatCard } from './components/ui';

<StatCard
  icon="gamepad"
  value="4"
  label="Jeux"
  color="#7D3CFF"
  trend="up"
  trendValue="+12%"
/>

// Props:
// - icon: nom de l'icône
// - value: string|number
// - label: string
// - color: string (hex)
// - trend: up, down, neutral (optionnel)
// - trendValue: string (optionnel)
```

### 2. Composants de Cartes (Molecules)
Composants métier réutilisables :

#### **MatchCard**
```jsx
import { MatchCard } from './components/cards';

<MatchCard
  game="Valorant"
  gameIcon="target"
  team1="Gentle Mates"
  team2="Team Liquid"
  score="2-1"
  date="15 Jan 2026"
  tournament="VCT Champions"
  win={true}
  color="#FF4655"
  onClick={() => console.log('Match clicked')}
/>
```

#### **PlayerCard**
```jsx
import { PlayerCard } from './components/cards';

<PlayerCard
  name="TenZ"
  role="Duelist"
  game="Valorant"
  statLabel="Rating"
  statValue="1.42"
  color="#FF4655"
  avatar="/img/tenz.jpg"
  onClick={() => console.log('Player clicked')}
/>
```

#### **NewsCard**
```jsx
import { NewsCard } from './components/cards';

<NewsCard
  id={1}
  category="NEWS"
  title="Nouvelle mise à jour Valorant"
  excerpt="Découvrez les dernières nouveautés..."
  date="15 Jan 2026"
  image="newspaper"
  color="#FF4655"
  game="Valorant"
  onClick={() => console.log('Article clicked')}
/>
```

#### **GameCard**
```jsx
import { GameCard } from './components/cards';

<GameCard
  id={1}
  name="Valorant"
  category="FPS Tactique"
  teamSize="5v5"
  image="/img/valo.jpg"
  stats={{
    players: 42,
    teams: 8,
    tournaments: 12
  }}
  onClick={() => console.log('Game clicked')}
/>
```

### 3. Composants de Layout
Composants pour structurer les pages :

#### **SectionHeader**
```jsx
import { SectionHeader } from './components/layout';
import { Button } from './components/ui';
import Icon from './components/Icon';

<SectionHeader
  title="Matchs Passés"
  icon={<Icon name="trendingUp" size={24} />}
  action={
    <Button variant="ghost" size="small">
      Voir tout
    </Button>
  }
/>
```

#### **Grid**
```jsx
import { Grid } from './components/layout';

<Grid columns={3} gap="1.5rem" minWidth="300px">
  {items.map(item => (
    <ItemCard key={item.id} {...item} />
  ))}
</Grid>

// Props:
// - columns: number (défaut: 3)
// - gap: string (défaut: "1.5rem")
// - minWidth: string (défaut: "300px")
```

## ✨ Avantages de cette Architecture

### 1. **Réutilisabilité**
- Composants utilisables partout dans l'application
- Pas de duplication de code
- Maintenance simplifiée

### 2. **Cohérence**
- Design uniforme
- Comportements standardisés
- Accessibilité améliorée

### 3. **Maintenabilité**
- Chaque composant a une responsabilité unique
- Facile à tester
- Facile à modifier

### 4. **Performance**
- Composants légers et optimisés
- Rendu conditionnel facile
- Lazy loading possible

## 🎯 Exemple d'Utilisation Complète

Voici comment refactoriser une page avec les nouveaux composants :

### ❌ Avant (Code monolithique)
```jsx
function HomePage() {
  return (
    <div className="home-page">
      <div className="quick-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <Icon name="gamepad" size={32} color="#7D3CFF" />
          </div>
          <div className="stat-info">
            <div className="stat-value">4</div>
            <div className="stat-label">Jeux</div>
          </div>
        </div>
        {/* Répété 4 fois... */}
      </div>
    </div>
  );
}
```

### ✅ Après (Composants réutilisables)
```jsx
import { StatCard, Button, Loading } from './components/ui';
import { MatchCard, NewsCard } from './components/cards';
import { SectionHeader, Grid } from './components/layout';

function HomePage() {
  return (
    <div className="home-page">
      <Grid columns={4} gap="1rem">
        <StatCard icon="gamepad" value="4" label="Jeux" color="#7D3CFF" />
        <StatCard icon="users" value="50+" label="Joueurs" color="#7D3CFF" />
        <StatCard icon="barChart" value="1000+" label="Matchs" color="#7D3CFF" />
        <StatCard icon="trophy" value="15" label="Trophées" color="#7D3CFF" />
      </Grid>

      <SectionHeader
        title="Matchs Passés"
        icon={<Icon name="trendingUp" size={24} />}
        action={<Button variant="ghost" size="small">Voir tout</Button>}
      />
      
      {loading ? (
        <Loading text="Chargement des matchs..." />
      ) : (
        <Grid columns={2} minWidth="350px">
          {matches.map(match => (
            <MatchCard key={match.id} {...match} />
          ))}
        </Grid>
      )}
    </div>
  );
}
```

## 🚀 Prochaines Étapes

Pour continuer à améliorer l'architecture :

1. **Créer plus de composants UI** :
   - Input, Select, Checkbox
   - Modal, Tooltip, Dropdown
   - Tabs, Accordion

2. **Ajouter des hooks personnalisés** :
   - `useMatches()` pour récupérer les matchs
   - `useNews()` pour récupérer les news
   - `usePlayers()` pour récupérer les joueurs

3. **Améliorer le state management** :
   - Context API pour les données globales
   - Reducer pour la logique complexe

4. **Tests** :
   - Tests unitaires avec Jest
   - Tests d'intégration avec React Testing Library

## 📚 Ressources

- [React Component Patterns](https://reactpatterns.com/)
- [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/)
- [React Best Practices](https://react.dev/learn)
