import axios from 'axios';

const API_BASE_URL = 'http://192.168.8.43:5000'; // Local Node.js server
// const API_BASE_URL = 'http://10.0.2.2:5000'; // Android Emulator
// const API_BASE_URL = 'http://localhost:5000'; // iOS Simulator / Web

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
