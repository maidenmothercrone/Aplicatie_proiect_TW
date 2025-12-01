import api from './api';

export const experienceSerice = {

    getByCandidate: async(candidateId) => {
        const response = await api.get(`/experience/candidate/${candidateId}`);
        return response.data;
    },

    create: async(candidateId, experienceData) => {
        const response = await api.post(`/experience/candidate/${candidateId}`, experienceData);
        return response.data;
    },

    update: async(candidateId, experienceId, experienceData) => {
        const response = await api.put(`/experience/candidate/${candidateId}/experience/${experienceId}`, experienceData);
        return response.data;
    },

    delete: async(candidateId, experienceId) => {
        const response  = await api.delete(`/experience/candidate/${candidateId}/experience/${experienceId}`);
        return response.data;
    }

};