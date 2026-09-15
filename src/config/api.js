import axios from 'axios';

// La URL base apunta al backend en Spring Boot (puerto 8081)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;