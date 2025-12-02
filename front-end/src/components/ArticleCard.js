import React from 'react';
import './ArticleCard.css';

function ArticleCard({ image, title, alt, bordered }) {
  return (
    <div className={`article-card ${bordered ? 'bordered' : ''}`}>
      <img src={image} alt={alt} className="article-image" />
    </div>
  );
}

export default ArticleCard;
