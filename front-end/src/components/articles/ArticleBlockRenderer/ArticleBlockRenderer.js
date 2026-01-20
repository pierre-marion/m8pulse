import React from 'react';
import './ArticleBlockRenderer.css';
import StatsChart from '../../visualizations/StatsChart/StatsChart';

function ArticleBlockRenderer({ blocks, article }) {
  // Charger le template personnalisé depuis localStorage
  const customTemplate = localStorage.getItem('articleBlocksTemplate');
  let blockOrder = [];
  
  if (customTemplate) {
    try {
      blockOrder = JSON.parse(customTemplate);
    } catch (error) {
      console.error('Erreur lors du chargement du template:', error);
    }
  }

  // Si pas de template personnalisé, utiliser l'ordre par défaut
  if (blockOrder.length === 0) {
    blockOrder = [
      { id: 1, type: 'title', position: 'center' },
      { id: 2, type: 'image', position: 'center', size: 'large' },
      { id: 3, type: 'text', position: 'full' },
      { id: 4, type: 'stats', position: 'full' },
      { id: 5, type: 'gallery', position: 'full', layout: 'grid' }
    ];
  }

  const renderBlock = (templateBlock, index) => {
    const { type, position, size, layout } = templateBlock;
    
    // Classes pour la position
    const positionClass = `block-position-${position || 'full'}`;
    const sizeClass = size ? `block-size-${size}` : '';

    switch (type) {
      case 'title':
        // Le titre est déjà dans le header, on ne l'affiche pas ici
        return null;

      case 'image':
        const imageBlock = blocks?.find(b => b.type === 'image');
        if (!imageBlock || !imageBlock.content) return null;
        return (
          <div key={index} className={`article-block block-image ${positionClass} ${sizeClass}`}>
            <img 
              src={`http://localhost:8000${imageBlock.content}`} 
              alt={article.title}
              className="article-main-image"
            />
          </div>
        );

      case 'text':
        const textBlocks = blocks?.filter(b => b.type === 'text') || [];
        if (textBlocks.length === 0) return null;
        return (
          <div key={index} className={`article-block block-text ${positionClass}`}>
            {textBlocks.map((block, idx) => (
              <div 
                key={idx} 
                className="text-content"
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            ))}
          </div>
        );

      case 'gallery':
        const galleryBlocks = blocks?.filter(b => b.type === 'gallery') || [];
        if (galleryBlocks.length === 0) return null;
        return (
          <div key={index} className={`article-block block-gallery ${positionClass} layout-${layout || 'grid'}`}>
            <div className="gallery-grid">
              {galleryBlocks.map((block, idx) => {
                const images = JSON.parse(block.content || '[]');
                return images.map((img, imgIdx) => (
                  <img 
                    key={`${idx}-${imgIdx}`}
                    src={`http://localhost:8000${img}`}
                    alt={`Gallery ${imgIdx + 1}`}
                    className="gallery-image"
                  />
                ));
              })}
            </div>
          </div>
        );

      case 'video':
        const videoBlock = blocks?.find(b => b.type === 'video');
        if (!videoBlock || !videoBlock.content) return null;
        return (
          <div key={index} className={`article-block block-video ${positionClass} ${sizeClass}`}>
            <video controls className="article-video">
              <source src={`http://localhost:8000${videoBlock.content}`} />
              Votre navigateur ne supporte pas la vidéo.
            </video>
          </div>
        );

      case 'quote':
        const quoteBlock = blocks?.find(b => b.type === 'quote');
        if (!quoteBlock || !quoteBlock.content) return null;
        return (
          <div key={index} className={`article-block block-quote ${positionClass}`}>
            <blockquote>
              <p>{quoteBlock.content}</p>
            </blockquote>
          </div>
        );

      case 'table':
      case 'stats':
        const tableBlocks = blocks?.filter(b => b.type === 'table' || b.type === 'stats') || [];
        if (tableBlocks.length === 0) return null;
        
        return (
          <div key={index} className={`article-block block-stats ${positionClass}`}>
            {tableBlocks.map((block, idx) => {
              console.log('🔍 Bloc stats trouvé:', block);
              console.log('📊 Content type:', typeof block.content);
              console.log('📊 Content value:', block.content);
              
              let data = null;
              try {
                // block.content contient les données du dataset
                data = typeof block.content === 'string' ? JSON.parse(block.content) : block.content;
                console.log('✅ Data parsée:', data);
                console.log('✅ Data[0]:', data?.[0]);
              } catch (error) {
                console.error('❌ Erreur parsing données tableau:', error);
                return null;
              }
              
              return (
                <div key={idx} className="stats-block-wrapper">
                  {block.title && <h3 className="stats-block-title">{block.title}</h3>}
                  <StatsChart data={data} vizType={block.vizType || 'table'} />
                </div>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="article-blocks-container">
      {blockOrder.map((templateBlock, index) => renderBlock(templateBlock, index))}
    </div>
  );
}

export default ArticleBlockRenderer;
