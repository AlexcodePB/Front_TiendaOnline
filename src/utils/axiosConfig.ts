import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError, type AxiosRequestHeaders } from 'axios';

// Configuración base de axios
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// Request interceptor para agregar token automáticamente
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      // Compatibilidad con AxiosHeaders y objetos planos
      if (typeof (config.headers as any)?.set === 'function') {
        (config.headers as any).set('Authorization', `Bearer ${token}`);
      } else {
        (config.headers as AxiosRequestHeaders)['Authorization'] = `Bearer ${token}` as any;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor para manejo de errores de autenticación
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirigir a login solo si no estamos ya en la página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
