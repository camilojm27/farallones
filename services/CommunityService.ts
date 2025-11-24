import axios from '../utils/axios';

export const CommunityService = {
    getCommunities: async () => {
        const response = await axios.get('/communities');
        return response.data;
    },

    createCommunity: async (data: any) => {
        const response = await axios.post('/communities', data);
        return response.data;
    },

    getCommunityDetails: async (id: number) => {
        const response = await axios.get(`/communities/${id}`);
        return response.data;
    },

    joinCommunity: async (id: number, customFields: any = {}) => {
        const response = await axios.post(`/communities/${id}/join`, { custom_fields: customFields });
        return response.data;
    },

    leaveCommunity: async (id: number) => {
        const response = await axios.post(`/communities/${id}/leave`, {});
        return response.data;
    },
};
