import api from './api';

export const authService = {
    register: async (email, password, firstName, lastName) => {
        const response = await api.post('/auth/register', {
            email,
            password,
            firstName,
            lastName
        });
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login', {
            email,
            password
        });

        //save token and userid to localStorage

        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.id);
        }

        return response.data;
    },

    getUser: async () => {
        try {
            const response = await api.get('/auth/me');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    },

    getToken: () => localStorage.getItem('token'),

    getUserId: () => localStorage.getItem('userId'),

    isAuthenticated: () => !!localStorage.getItem('token')
};