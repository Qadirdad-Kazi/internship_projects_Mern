import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tasks';

export const getTasks = async (projectId) => {
    const response = await axios.get(`${API_URL}/${projectId}`);
    return response.data;
};

export const createTask = async (task) => {
    const response = await axios.post(API_URL, task);
    return response.data;
};

export const updateTask = async (id, updates) => {
    const response = await axios.put(`${API_URL}/${id}`, updates);
    return response.data;
};

export const deleteTask = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};
