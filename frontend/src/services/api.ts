import axios from 'axios';
import { Candidate } from '../interfaces/Candidate';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add request interceptor for debugging
api.interceptors.request.use(
    (config) => {
        console.log('API Request:', {
            method: config.method,
            url: config.url,
            baseURL: config.baseURL,
            data: config.data,
            headers: config.headers
        });
        return config;
    },
    (error) => {
        console.error('API Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for debugging
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            headers: response.headers
        });
        return response;
    },
    (error) => {
        console.error('API Response Error:', {
            message: error.message,
            response: error.response ? {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            } : null
        });
        return Promise.reject(error);
    }
);

export const candidateService = {
    getAll: async () => {
        try {
            console.log('Calling getAll candidates');
            const response = await api.get<{ success: boolean, data: Candidate[] }>('/candidates');
            console.log('GetAll response:', response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error in getAll:', error);
            throw error;
        }
    },

    getById: async (id: number) => {
        try {
            console.log('Calling getById with id:', id);
            const response = await api.get<{ success: boolean, data: Candidate }>(`/candidates/${id}`);
            console.log('GetById response:', response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error in getById:', error);
            throw error;
        }
    },

    create: async (candidate: Omit<Candidate, 'id'>) => {
        try {
            console.log('Creating candidate:', candidate);
            const response = await api.post<{ success: boolean, data: Candidate }>('/candidates', candidate);
            console.log('Create response:', response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error in create:', error);
            throw error;
        }
    },

    update: async (id: number, candidate: Partial<Candidate>) => {
        try {
            console.log('Updating candidate:', { id, candidate });
            const response = await api.put<{ success: boolean, data: Candidate }>(`/candidates/${id}`, candidate);
            console.log('Update response:', response.data);
            return response.data.data;
        } catch (error) {
            console.error('Error in update:', error);
            throw error;
        }
    },

    delete: async (id: number) => {
        try {
            console.log('Deleting candidate:', id);
            const response = await api.delete<{ success: boolean }>(`/candidates/${id}`);
            console.log('Delete response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error in delete:', error);
            throw error;
        }
    }
}; 