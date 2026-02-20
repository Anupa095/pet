import axios from 'axios';

const API_BASE_URL = 'https://api.pethub.com'; // Placeholder URL

const api = axios.create({
    baseURL: API_BASE_URL,
    header: {
        'Content-Type': 'application/json',
    },
});

export const login = (email, password) => {
    return api.post('/auth/login', { email, password });
};

export const register = (userData) => {
    return api.post('/auth/register', userData);
};

export const getPets = () => {
    return api.get('/pets');
};

export const addPet = (petData) => {
    return api.post('/pets', petData);
};

export default api;
