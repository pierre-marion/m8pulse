/**
 * Utilitaire pour convertir les types de variables entre le format frontend (anglais) 
 * et le format backend (français)
 */

// Mapping des types de variables
const TYPE_MAPPING = {
  // Frontend → Backend
  'numeric': 'numérique',
  'categorical': 'catégorielle',
  'number': 'numérique',
  'string': 'catégorielle',
  
  // Backend → Frontend (pour la lecture)
  'numérique': 'numeric',
  'catégorielle': 'categorical'
};

/**
 * Convertit un type de variable du frontend vers le backend
 * @param {string} frontendType - Type en anglais ('numeric', 'categorical', 'number', 'string')
 * @returns {string} Type en français ('numérique', 'catégorielle')
 */
export const toBackendType = (frontendType) => {
  return TYPE_MAPPING[frontendType] || frontendType;
};

/**
 * Convertit un type de variable du backend vers le frontend
 * @param {string} backendType - Type en français ('numérique', 'catégorielle')
 * @returns {string} Type en anglais ('numeric', 'categorical')
 */
export const toFrontendType = (backendType) => {
  return TYPE_MAPPING[backendType] || backendType;
};

/**
 * Convertit un tableau de variables du frontend vers le backend
 * @param {Array} variables - Tableau de variables avec type en anglais
 * @returns {Array} Tableau de variables avec type en français
 */
export const convertVariablesToBackend = (variables) => {
  return variables.map(v => ({
    ...v,
    type: toBackendType(v.type)
  }));
};

/**
 * Convertit un tableau de variables du backend vers le frontend
 * @param {Array} variables - Tableau de variables avec type en français
 * @returns {Array} Tableau de variables avec type en anglais
 */
export const convertVariablesFromBackend = (variables) => {
  return variables.map(v => ({
    ...v,
    type: toFrontendType(v.type)
  }));
};
