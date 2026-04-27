// Configuración simple de la API
const API_CONFIG = {
  // URL base del backend - Se configura vía variables de entorno en producción
  BASE_URL: process.env.REACT_APP_API_URL || "http://localhost:3001",
  WS_URL: process.env.REACT_APP_WS_URL || "ws://localhost:3001",

  // Función helper para construir URLs completas
  getUrl: (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`,
};

export default API_CONFIG;
