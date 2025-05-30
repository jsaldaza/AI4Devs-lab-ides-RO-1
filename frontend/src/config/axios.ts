import axios from 'axios';
import { errorService } from '../services/error.service';

// Configurar la URL base para todas las peticiones
axios.defaults.baseURL = 'http://localhost:3000';

// Configurar los headers por defecto
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Interceptor de solicitud
axios.interceptors.request.use(
    (config) => {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('Error en la solicitud:', error);
        return Promise.reject(error);
    }
);

// Interceptor de respuesta
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Parsear el error usando nuestro servicio de errores
        const appError = errorService.parseAxiosError(error);

        // Si es un error de autenticación, limpiar el localStorage
        if (errorService.isAuthenticationError(appError)) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Redirigir a login si no estamos ya en la página de login
            if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login';
            }
        }

        return Promise.reject(appError);
    }
);

export default axios; 