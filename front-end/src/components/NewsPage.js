import React, { useState } from 'react';
import './NewsPage.css';

function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [selectedGame, setSelectedGame] = useState('Tous');

  const articles = [
    {
      id: 1,
      emoji: '🏆',
      title: "Gentle Mates renversent l'ogre Vitality : un 2-0 historique",
      excerpt: "Dans un match épique, les Gentle Mates ont réussi l'exploit de battre Vitality 2-0, marquant l'une des plus grandes surprises de la saison.",
      category: 'Résultats',
      game: 'CS2',
      date: '3 Décembre 2024',
      readTime: '5 min',
      author: 'Pierre M.',
      featured: true
    },
    {
      id: 2,
      emoji: '🎤',
      title: "Sans Itachi tout s'arrête - Interview exclusive",
      excerpt: "Itachi revient sur son parcours légendaire avec les Gentle Mates et évoque l'importance du collectif dans les victoires de l'équipe.",
      category: 'Interview',
      game: 'Valorant',
      date: '2 Décembre 2024',
      readTime: '8 min',
      author: 'Sarah L.',
      featured: true
    },
    {
      id: 3,
      emoji: '💔',
      title: "La défaite, une habitude à briser pour la section COD",
      excerpt: "Après une série de résultats décevants, l'équipe COD des Gentle Mates cherche à retrouver le chemin de la victoire.",
      category: 'Analyse',
      game: 'COD',
      date: '1 Décembre 2024',
      readTime: '6 min',
      author: 'Marc D.',
      featured: false
    },
    {
      id: 4,
      emoji: '🔥',
      title: "Minny établit un nouveau record de kills en ranked",
      excerpt: "Le joueur vedette Minny a pulvérisé le record de kills sur un seul match en atteignant 47 éliminations.",
      category: 'Records',
      game: 'Valorant',
      date: '30 Novembre 2024',
      readTime: '4 min',
      author: 'Tom R.',
      featured: false
    },
    {
      id: 5,
      emoji: '📊',
      title: "Analyse tactique : les nouvelles stratégies de M8 sur Ascent",
      excerpt: "Découvrez comment l'équipe a révolutionné son jeu sur Ascent avec des stratégies innovantes qui surprennent les adversaires.",
      category: 'Analyse',
      game: 'Valorant',
      date: '29 Novembre 2024',
      readTime: '10 min',
      author: 'Alex K.',
      featured: false
    },
    {
      id: 6,
      emoji: '🎮',
      title: "Fortnite : M8 se qualifie pour la finale européenne",
      excerpt: "Après des performances impressionnantes, l'équipe Fortnite décroche sa place en finale du championnat européen.",
      category: 'Résultats',
      game: 'Fortnite',
      date: '28 Novembre 2024',
      readTime: '5 min',
      author: 'Julie M.',
      featured: false
    },
    {
      id: 7,
      emoji: '⚡',
      title: "JaCkz rejoint le roster CS2 en tant que coach stratégique",
      excerpt: "L'ancien joueur professionnel JaCkz fait son retour dans l'équipe, cette fois en tant que coach pour améliorer les performances tactiques.",
      category: 'Transferts',
      game: 'CS2',
      date: '27 Novembre 2024',
      readTime: '6 min',
      author: 'Pierre M.',
      featured: false
    },
    {
      id: 8,
      emoji: '🎯',
      title: "HyDra : 'Notre objectif est le titre mondial'",
      excerpt: "Dans une interview exclusive, HyDra partage ses ambitions pour la saison et dévoile les secrets de sa réussite.",
      category: 'Interview',
      game: 'COD',
      date: '26 Novembre 2024',
      readTime: '7 min',
      author: 'Sarah L.',
      featured: false
    },
    {
      id: 9,
      emoji: '📈',
      title: "Les stats impressionnantes de M8 sur le dernier trimestre",
      excerpt: "Retour sur les chiffres exceptionnels de l'organisation avec un taux de victoire de 73% toutes compétitions confondues.",
      category: 'Statistiques',
      game: 'Tous',
      date: '25 Novembre 2024',
      readTime: '8 min',
      author: 'Marc D.',
      featured: false
    },
    {
      id: 10,
      emoji: '🌟',
      title: "M8 Gaming lance son programme de formation des jeunes talents",
      excerpt: "L'organisation annonce la création d'une académie pour former la prochaine génération de joueurs professionnels.",
      category: 'Annonces',
      game: 'Tous',
      date: '24 Novembre 2024',
      readTime: '5 min',
      author: 'Tom R.',
      featured: false
    },
    {
      id: 11,
      emoji: '🏅',
      title: "Valorant : M8 remporte le tournoi VCT Challengers",
      excerpt: "Victoire éclatante de l'équipe Valorant qui s'impose 3-1 en finale et valide son ticket pour le circuit international.",
      category: 'Résultats',
      game: 'Valorant',
      date: '23 Novembre 2024',
      readTime: '6 min',
      author: 'Alex K.',
      featured: false
    },
    {
      id: 12,
      emoji: '💬',
      title: "Podcast M8 : Épisode 5 avec le CEO de l'organisation",
      excerpt: "Dans ce nouvel épisode, découvrez les coulisses de M8 Gaming et la vision du CEO pour l'avenir de l'organisation.",
      category: 'Média',
      game: 'Tous',
      date: '22 Novembre 2024',
      readTime: '45 min',
      author: 'Julie M.',
      featured: false
    }
  ];

  const categories = ['Tous', 'Résultats', 'Interview', 'Analyse', 'Records', 'Transferts', 'Statistiques', 'Annonces', 'Média'];
  const games = ['Tous', 'CS2', 'Valorant', 'COD', 'Fortnite'];

  const filteredArticles = articles.filter(article => {
    const categoryMatch = selectedCategory === 'Tous' || article.category === selectedCategory;
    const gameMatch = selectedGame === 'Tous' || article.game === selectedGame;
    return categoryMatch && gameMatch;
  });

  const featuredArticles = filteredArticles.filter(article => article.featured);
  const regularArticles = filteredArticles.filter(article => !article.featured);

  const getCategoryColor = (category) => {
    const colors = {
      'Résultats': '#4CAF50',
      'Interview': '#FF9800',
      'Analyse': '#2196F3',
      'Records': '#E91E63',
      'Transferts': '#9C27B0',
      'Statistiques': '#00BCD4',
      'Annonces': '#FFC107',
      'Média': '#795548'
    };
    return colors[category] || '#7D3CFF';
  };

  const getGameColor = (game) => {
    const colors = {
      'CS2': '#FF9F1C',
      'Valorant': '#FF4655',
      'COD': '#8A2BE2',
      'Fortnite': '#00AEEF'
    };
    return colors[game] || '#7D3CFF';
  };

  return (
    <div className="news-page">
      {/* Filtres */}
      <div className="news-filters">
        <div className="filter-group">
          <label className="filter-label">Catégorie :</label>
          <div className="filter-buttons">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label className="filter-label">Jeu :</label>
          <div className="filter-buttons">
            {games.map(game => (
              <button
                key={game}
                className={`filter-btn game-filter ${selectedGame === game ? 'active' : ''}`}
                onClick={() => setSelectedGame(game)}
                style={selectedGame === game ? { borderColor: getGameColor(game), color: getGameColor(game) } : {}}
              >
                {game}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles à la une */}
      {featuredArticles.length > 0 && (
        <div className="featured-section">
          <div className="featured-articles">
            {featuredArticles.map(article => (
              <div key={article.id} className="featured-article-card">
                <div className="featured-article-image">
                  <div className="article-emoji-large">{article.emoji}</div>
                  <div className="article-badges">
                    <span className="badge-category" style={{ backgroundColor: getCategoryColor(article.category) }}>
                      {article.category}
                    </span>
                    <span className="badge-game" style={{ backgroundColor: getGameColor(article.game) }}>
                      {article.game}
                    </span>
                  </div>
                </div>
                <div className="featured-article-content">
                  <h3 className="featured-article-title">{article.title}</h3>
                  <p className="featured-article-excerpt">{article.excerpt}</p>
                  <div className="article-meta">
                    <span className="meta-item">📅 {article.date}</span>
                    <span className="meta-item">⏱️ {article.readTime}</span>
                    <span className="meta-item">✍️ {article.author}</span>
                  </div>
                  <button className="read-article-btn">Lire l'article →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Articles réguliers */}
      <div className="regular-section">
        <div className="articles-grid-news">
          {regularArticles.map(article => (
            <div key={article.id} className="article-card-news">
              <div className="article-image-news">
                <div className="article-emoji-news">{article.emoji}</div>
                <div className="article-overlay">
                  <span className="badge-category-small" style={{ backgroundColor: getCategoryColor(article.category) }}>
                    {article.category}
                  </span>
                  <span className="badge-game-small" style={{ backgroundColor: getGameColor(article.game) }}>
                    {article.game}
                  </span>
                </div>
              </div>
              <div className="article-content-news">
                <h3 className="article-title-news">{article.title}</h3>
                <p className="article-excerpt-news">{article.excerpt}</p>
                <div className="article-meta-news">
                  <div className="meta-row">
                    <span className="meta-item-news">📅 {article.date}</span>
                    <span className="meta-item-news">⏱️ {article.readTime}</span>
                  </div>
                  <span className="meta-author">✍️ {article.author}</span>
                </div>
                <button className="read-more-news-btn">Lire la suite →</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message si aucun article */}
      {filteredArticles.length === 0 && (
        <div className="no-articles">
          <div className="no-articles-icon">📭</div>
          <h3>Aucun article trouvé</h3>
          <p>Essayez de modifier vos filtres pour voir plus d'articles</p>
        </div>
      )}
    </div>
  );
}

export default NewsPage;
