import api from './api';

export const candidatesService ={
    getAll: async() => {
        const response = await api.get('/candidates');
        return response.data;
    },

    getById: async(id) => {
        const response = await api.get(`/candidates/${id}`);
        return response.data;
    },

    create: async(candidateData) => {
        const response = await api.post('/candidates', candidateData);
        return response.data;
    },

    update: async(id, candidateData) => {
        const response = await api.put(`/candidates/${id}`, candidateData);
        return response.data;
    },

    delete: async(id) => {
        const response = await api.delete(`/candidates/${id}`);
        return response.data;
    }
};