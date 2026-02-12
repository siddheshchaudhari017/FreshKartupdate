import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('freshkart_user');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password, recaptchaToken) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const { data } = await axios.post(`${apiUrl}/auth/login`, {
                email,
                password,
                recaptchaToken
            });
            setUser(data);
            localStorage.setItem('freshkart_user', JSON.stringify(data));
            return data; // Return full response for email verification warning
        } catch (error) {
            throw error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        }
    };

    const register = async (name, email, password, role = 'buyer', recaptchaToken) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const { data } = await axios.post(`${apiUrl}/auth/register`, {
                name,
                email,
                password,
                role, // Include role in registration
                recaptchaToken
            });

            // Don't auto-login after registration (user needs to verify email)
            // setUser(data);
            // localStorage.setItem('freshkart_user', JSON.stringify(data));

            return data;
        } catch (error) {
            throw error.response && error.response.data.message
                ? error.response.data.message
                : error.message;
        }
    };

    const logout = () => {
        localStorage.removeItem('freshkart_user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

