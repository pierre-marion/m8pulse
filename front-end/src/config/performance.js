// Configuration pour optimiser les performances de l'application

// Cache API - Configuration globale
export const API_CONFIG = {
  baseUrl: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  cacheTimeout: 5 * 60 * 1000, // 5 minutes
  refreshInterval: 15 * 60 * 1000, // 15 minutes pour auto-refresh
};

// Debounce delay pour les recherches
export const DEBOUNCE_DELAY = 500; // ms

// Lazy loading config
export const LAZY_LOAD_CONFIG = {
  threshold: 0.1, // Charger quand 10% visible
  rootMargin: '50px', // Précharger 50px avant
};

// Performance monitoring
export const enablePerformanceMonitoring = () => {
  if (process.env.NODE_ENV === 'development') {
    // Log les composants lents
    if (window.performance && window.performance.mark) {
      console.log('Performance monitoring activé');
    }
  }
};
