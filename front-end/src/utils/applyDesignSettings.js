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
};
