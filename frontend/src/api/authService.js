import axios from 'axios';

// Ensure this matches your Render backend URL (e.g., https://your-app.onrender.com/api)
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const register = async (userData) => {
    const response = await axios.post(`${API_URL}/users/register`, userData);
    return response.data;
};

const login = async (userData) => {
    const response = await axios.post(`${API_URL}/users/login`, userData);
    if (response.data) {
        // We'll store the user ID or token in localStorage for session management
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const authService = {
    register,
    login,
    logout,
};

export default authService;