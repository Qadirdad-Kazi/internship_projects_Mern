import axios from 'axios';

const API_URL = 'http://localhost:5000/api/milestones';

export const getMilestones = async (projectId) => {
    const response = await axios.get(`${API_URL}/${projectId}`);
    return response.data;
};

export const createMilestone = async (milestone) => {
    const response = await axios.post(API_URL, milestone);
    return response.data;
};

export const updateMilestone = async (id, updates) => {
    const response = await axios.put(`${API_URL}/${id}`, updates);
    return response.data;
};

export const deleteMilestone = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
