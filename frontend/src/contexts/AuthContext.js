import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setUser({ token });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                email,
                password
            });
            const { token } = response.data;
            localStorage.setItem('token', token);
            setUser({ token });
            return true;
        } catch (error) {
            throw error.response?.data?.message || 'Login failed';
        }
    };

    const register = async (name, email, password) => {
        try {
            const response = await axios.post('http://localhost:5000/api/auth/signup', {
                name,
                email,
                password
            });
            const { token } = response.data;
            localStorage.setItem('token', token);
            setUser({ token });
            return true;
        } catch (error) {
            throw error.response?.data?.message || 'Registration failed';
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    const forgotPassword = async (email) => {
        try {
            await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
            return true;
        } catch (error) {
            throw error.response?.data?.message || 'Failed to send reset email';
        }
    };

    const resetPassword = async (token, password) => {
        try {
            await axios.post(`http://localhost:5000/api/auth/reset-password/${token}`, { password });
            return true;
        } catch (error) {
            throw error.response?.data?.message || 'Password reset failed';
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            forgotPassword,
            resetPassword,
            isAuthenticated: !!user
        }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
