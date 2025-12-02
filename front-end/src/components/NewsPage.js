import React from 'react';
import './NewsPage.css';

function NewsPage() {
  const articles = [
    {
      id: 1,
      image: '/article1.jpg',
      title: "Gentle Mates renversent l'ogre Vitality : un 2-0 historique sur CS2",
      category: 'CS2'
    },
    {
      id: 2,
      image: '/article2.jpg',
      title: "Le roster légendaire, Sans Itachi tout s'arrête. [Interview ITACHI]",
      category: 'Interview'
    },
    {
      id: 3,
      image: '/article3.jpg',
      title: "La defaite ?, c'est quelque choses qui est devenu une habitude [COD]",
      category: 'COD'
    },
    {
      id: 4,
      image: '/article4.jpg',
      title: "Gentle Mates renversent l'ogre Vitality : un 2-0 historique sur CS2",
      category: 'CS2'
    }
  ];

  return (
    <div className="news-page">
      <h1 className="news-page-title">NEWS</h1>
      
      <div className="news-content-wrapper">
        <div className="articles-grid">
          {articles.map((article) => (
            <div key={article.id} className="article-card">
              <div className="article-image">
                <img src={article.image} alt={article.title} />
              </div>
              <div className="article-info">
                <h3 className="article-title">{article.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default NewsPage;
