import React from 'react';
import './ArticleBlockRenderer.css';
import StatsChart from '../../visualizations/StatsChart/StatsChart';

function ArticleBlockRenderer({ blocks, article }) {
  console.log('🎬 ArticleBlockRenderer render - Blocks reçus:', blocks);
  console.log('🎬 Nombre de blocs:', blocks?.length);
  
  // Charger le template personnalisé depuis localStorage
  const customTemplate = localStorage.getItem('articleBlocksTemplate');
  let blockOrder = [];
  
  if (customTemplate) {
    try {
      blockOrder = JSON.parse(customTemplate);
      console.log('📋 Template personnalisé chargé:', blockOrder);
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
    console.log('📋 Template par défaut utilisé:', blockOrder);
  } else {
    // Vérifier si le template personnalisé contient un bloc stats
    const hasStatsBlock = blockOrder.some(block => block.type === 'stats');
    if (!hasStatsBlock) {
      console.warn('⚠️ Le template personnalisé ne contient pas de bloc stats. Ajout automatique...');
      // Ajouter le bloc stats après le bloc text
      const textIndex = blockOrder.findIndex(b => b.type === 'text');
      const insertIndex = textIndex >= 0 ? textIndex + 1 : blockOrder.length;
      blockOrder.splice(insertIndex, 0, { 
        id: blockOrder.length + 1, 
        type: 'stats', 
        position: 'full' 
      });
    }
  }

  const renderBlock = (templateBlock, index) => {
    const { type, position, size, layout } = templateBlock;
    console.log(`🔨 Rendering block type: ${type}`);
    
    
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
              console.log('📊 Content raw:', block.content);
              
              // Vérifier si le contenu est vide
              if (!block.content || (typeof block.content === 'string' && block.content.trim() === '')) {
                console.log('⚠️ Block stats ignoré : pas de données');
                return null;
              }
              
              let data = null;
              try {
                // Si c'est une string, essayer de parser
                if (typeof block.content === 'string') {
                  console.log('📝 Parsing string content...');
                  data = JSON.parse(block.content);
                  console.log('✅ Data après 1er parse:', data);
                  
                  // Si après le parse c'est encore une string, parser une 2ème fois (double encoding)
                  if (typeof data === 'string') {
                    console.log('⚠️ Double encoding détecté, 2ème parse...');
                    data = JSON.parse(data);
                    console.log('✅ Data après 2ème parse:', data);
                  }
                } else {
                  // Si c'est déjà un objet/array
                  data = block.content;
                  console.log('✅ Data déjà parsée:', data);
                }
              } catch (error) {
                console.error('❌ Erreur parsing données tableau:', error);
                console.error('Content qui a causé l\'erreur:', block.content);
                return (
                  <div className="stats-error">
                    Erreur de parsing des données
                    <details style={{ marginTop: '10px', fontSize: '12px' }}>
                      <summary>Détails (debug)</summary>
                      <pre style={{ textAlign: 'left', fontSize: '10px' }}>
                        {String(block.content).substring(0, 500)}
                      </pre>
                    </details>
                  </div>
                );
              }
              
              if (!data || !Array.isArray(data) || data.length === 0) {
                console.log('⚠️ Block stats ignoré : données invalides');
                console.log('Data reçue:', data);
                return (
                  <div className="stats-error">
                    Données invalides
                    <details style={{ marginTop: '10px', fontSize: '12px' }}>
                      <summary>Détails (debug)</summary>
                      <pre style={{ textAlign: 'left', fontSize: '10px' }}>
                        Type: {typeof data}
                        {'\n'}
                        IsArray: {String(Array.isArray(data))}
                        {'\n'}
                        Value: {JSON.stringify(data, null, 2)}
                      </pre>
                    </details>
                  </div>
                );
              }
              
              return (
                <div key={idx} className="stats-block-wrapper">
                  {block.fileName && <h3 className="stats-block-title">{block.fileName}</h3>}
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
