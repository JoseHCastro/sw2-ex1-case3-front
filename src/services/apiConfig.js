// Configuración simple de la API
const API_CONFIG = {
  // URL base del backend - CAMBIAR AQUÍ PARA CAMBIAR EL SERVIDOR
  BASE_URL: "http://localhost:3001",
  WS_URL: "ws://localhost:3001",

  /*  BASE_URL: "http://3.80.105.200:3001",
  WS_URL: "ws://3.80.105.200:3001", */

  /*BASE_URL: "https://veranitoapi.duckdns.org",
  WS_URL: "wss://veranitoapi.duckdns.org",*/

  /*BASE_URL: "http://192.168.0.4:3001",
  WS_URL: "ws://192.168.0.4:3001",*/

  // Función helper para construir URLs completas
  getUrl: (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`,
};

export default API_CONFIG;
