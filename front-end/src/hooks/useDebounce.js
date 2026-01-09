import { useState, useEffect } from 'react';

/**
 * Hook de debouncing pour optimiser les recherches et filtres
 * Évite trop de re-renders et d'appels API
 */
export function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
