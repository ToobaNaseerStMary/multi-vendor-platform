// src/utils/tokenService.js
const jwtDecode = require('jwt-decode');

// Save token to localStorage
export const setToken = (token) => {
    localStorage.setItem('token', token);
};

// Retrieve token from localStorage (no additional wrapping needed for your use case)
export const getToken = () => {
    return localStorage.getItem('token');
};

// Remove token from localStorage (used for logout or token expiry)
export const removeToken = () => {
    localStorage.removeItem('token');
};


export const decodeToken = () => {
    const token = getToken();
    if (!token) return null;
    try {
        return jwtDecode(token);
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};
