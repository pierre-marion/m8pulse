// Fonction pour appliquer les paramètres de design au chargement
export const applyDesignSettings = () => {
  // Couleurs
  const primaryColor = localStorage.getItem('primaryColor');
  const secondaryColor = localStorage.getItem('secondaryColor');
  const accentColor = localStorage.getItem('accentColor');
  
  if (primaryColor) {
    document.documentElement.style.setProperty('--designer-primary', primaryColor);
  }
  if (secondaryColor) {
    document.documentElement.style.setProperty('--designer-secondary', secondaryColor);
  }
  if (accentColor) {
    document.documentElement.style.setProperty('--designer-accent', accentColor);
  }
  
  // Typographie
  const fontFamily = localStorage.getItem('fontFamily');
  const fontSize = localStorage.getItem('fontSize');
  
  if (fontFamily) {
    document.documentElement.style.setProperty('--font-family', fontFamily);
  }
  if (fontSize) {
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
  }
  
  // Bordures
  const borderRadius = localStorage.getItem('borderRadius');
  if (borderRadius) {
    document.documentElement.style.setProperty('--border-radius', `${borderRadius}px`);
  }

  // Article
  const articleBg = localStorage.getItem('articleBg');
  const articleBorderRadius = localStorage.getItem('articleBorderRadius');
  
  if (articleBg) {
    document.documentElement.style.setProperty('--article-bg', articleBg);
  }
  if (articleBorderRadius) {
    document.documentElement.style.setProperty('--article-border-radius', articleBorderRadius); // Note: ArticleDetail.css might need to use this too if we want dynamic radius
  }

  // Texte d'article
  const articleTextColor = localStorage.getItem('articleTextColor');
  const articleTextSize = localStorage.getItem('articleTextSize');
  const articleTextFont = localStorage.getItem('articleTextFont');
  const articleTextLineHeight = localStorage.getItem('articleTextLineHeight');
  
  if (articleTextColor) {
    document.documentElement.style.setProperty('--article-text-color', articleTextColor);
  }
  if (articleTextSize) {
    document.documentElement.style.setProperty('--article-text-size', articleTextSize);
  }
  if (articleTextFont) {
    document.documentElement.style.setProperty('--article-text-font', articleTextFont);
  }
  if (articleTextLineHeight) {
    document.documentElement.style.setProperty('--article-text-line-height', articleTextLineHeight);
  }
};
