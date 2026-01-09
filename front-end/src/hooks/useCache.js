import { useState, useEffect } from 'react';

/**
 * Hook pour gérer un cache simple en mémoire
 * @param {string} key - Clé unique pour le cache
 * @param {Function} fetchFn - Fonction pour récupérer les données
 * @param {number} cacheDuration - Durée du cache en ms (défaut: 5min)
 */
export function useCache(key, fetchFn, cacheDuration = 5 * 60 * 1000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Vérifier le cache localStorage
        const cached = localStorage.getItem(`cache_${key}`);
        const cacheTime = localStorage.getItem(`cache_time_${key}`);
        
        const now = Date.now();
        if (cached && cacheTime && (now - parseInt(cacheTime)) < cacheDuration) {
          setData(JSON.parse(cached));
          setLoading(false);
          return;
        }

        // Sinon, récupérer les nouvelles données
        setLoading(true);
        const result = await fetchFn();
        
        // Mettre en cache
        localStorage.setItem(`cache_${key}`, JSON.stringify(result));
        localStorage.setItem(`cache_time_${key}`, now.toString());
        
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [key, fetchFn, cacheDuration]);

  const invalidateCache = () => {
    localStorage.removeItem(`cache_${key}`);
    localStorage.removeItem(`cache_time_${key}`);
  };

  return { data, loading, error, invalidateCache };
}
