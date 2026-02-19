import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, pass: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = 'http://localhost:3000/auth';
const SESSION_EXPIRED_MESSAGE = 'Tu sesion expiro. Por favor inicia sesion nuevamente.';

const getTokenExpirationTime = (jwtToken: string): number | null => {
    try {
        const tokenParts = jwtToken.split('.');
        if (tokenParts.length !== 3) return null;

        const payloadBase64 = tokenParts[1].replace(/-/g, '+').replace(/_/g, '/');
        const normalizedPayload = payloadBase64.padEnd(Math.ceil(payloadBase64.length / 4) * 4, '=');
        const payload = JSON.parse(atob(normalizedPayload));

        return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
    } catch {
        return null;
    }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const handlingAuthFailureRef = useRef(false);

    const clearAuthState = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }, []);

    const handleSessionExpired = useCallback((message: string = SESSION_EXPIRED_MESSAGE) => {
        if (handlingAuthFailureRef.current) return;
        handlingAuthFailureRef.current = true;

        setError(message);
        clearAuthState();

        if (location.pathname !== '/login') {
            navigate('/login', { replace: true });
        } else {
            handlingAuthFailureRef.current = false;
        }
    }, [clearAuthState, location.pathname, navigate]);

    useEffect(() => {
        if (!token) {
            setUser(null);
            setLoading(false);
            handlingAuthFailureRef.current = false;
            return;
        }

        const expirationTime = getTokenExpirationTime(token);
        if (!expirationTime || expirationTime <= Date.now()) {
            handleSessionExpired();
            setLoading(false);
            return;
        }

        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                handleSessionExpired('No pudimos recuperar tu sesion. Inicia sesion nuevamente.');
                setLoading(false);
                return;
            }
        }

        const timeout = window.setTimeout(() => {
            handleSessionExpired();
        }, expirationTime - Date.now());

        setLoading(false);
        return () => window.clearTimeout(timeout);
    }, [token, handleSessionExpired]);

    useEffect(() => {
        const interceptorId = axios.interceptors.response.use(
            (response) => response,
            (err) => {
                if (axios.isAxiosError(err) && err.response?.status === 401 && token) {
                    const headers = err.config?.headers as Record<string, string> | undefined;
                    const hasAuthHeader = Boolean(headers?.Authorization || headers?.authorization);

                    if (hasAuthHeader) {
                        handleSessionExpired();
                    }
                }
                return Promise.reject(err);
            }
        );

        return () => axios.interceptors.response.eject(interceptorId);
    }, [token, handleSessionExpired]);

    const login = async (email: string, password: string) => {
        try {
            setError(null);
            handlingAuthFailureRef.current = false;
            const response = await axios.post(`${API_URL}/login`, { email, password });
            const { access_token, user: userData } = response.data;

            setToken(access_token);
            setUser(userData);
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al iniciar sesión');
            throw err;
        }
    };

    const register = async (data: any) => {
        try {
            setError(null);
            handlingAuthFailureRef.current = false;
            const response = await axios.post(`${API_URL}/register`, data);
            const { access_token, user: userData } = response.data;

            setToken(access_token);
            setUser(userData);
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
        } catch (err: any) {
            setError(err.response?.data?.message || 'Error al registrarse');
            throw err;
        }
    };

    const logout = () => {
        setError(null);
        handlingAuthFailureRef.current = false;
        clearAuthState();
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
