import axios from 'axios';
import { toast } from 'react-toastify';

// La URL base apunta al backend en Spring Boot (puerto 8081)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el JWT desde sessionStorage en las peticiones REST
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('rentar_token');
    if(token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas (y errores globales)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;
    if (status === 401) {
      sessionStorage.removeItem('rentar_token');
      sessionStorage.removeItem('rentar_user');
      sessionStorage.removeItem('rentar_client_profile');
      if (window.location.pathname !== '/login') {
        toast.error('Sesión expirada o no autorizada. Por favor, vuelva a iniciar sesión.');
        window.location.href = '/login';
      }
    } else if (status === 403) {
      toast.error('Acceso denegado: No cuenta con permisos suficientes para realizar esta acción.');
    }
    return Promise.reject(error);
  }
);

export default api;