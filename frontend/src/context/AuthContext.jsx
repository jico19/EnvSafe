import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate()

    const fetchProfile = async () => {
        try {
            const response = await api.get('/api/profile/');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch profile', error);
            localStorage.removeItem('token');
            localStorage.removeItem('refresh_token');
            setUser(null);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            fetchProfile().finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);

    const login = async (credentials) => {
        try {
            const response = await api.post('/api/token/', credentials);
            const { access, refresh } = response.data;
            localStorage.setItem('token', access);
            localStorage.setItem('refresh_token', refresh);
            await fetchProfile();
            navigate('/dashboard')
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const register = async (data) => {
        try {
            const response = await api.post('/api/register/', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
