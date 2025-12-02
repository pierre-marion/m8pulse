import React from 'react';
import ArticleCard from './ArticleCard';
import './MainContent.css';

function MainContent() {
  // Placeholder images - vous pouvez les remplacer par vos vraies images
  const articles = [
    {
      id: 1,
      image: 'https://via.placeholder.com/800x300/5B4FCE/FFFFFF?text=CALL+OF+DUTY+LEAGUE',
      alt: 'Call of Duty League',
      bordered: false
    },
    {
      id: 2,
      image: 'https://via.placeholder.com/800x300/FF4444/FFFFFF?text=VCT+EMEA',
      alt: 'VCT EMEA',
      bordered: true
    }
  ];

  return (
    <main className="main-content">
      <div className="content-wrapper">
        {articles.map(article => (
          <ArticleCard 
            key={article.id}
            image={article.image}
            alt={article.alt}
            bordered={article.bordered}
          />
        ))}
      </div>
    </main>
  );
}

export default MainContent;
