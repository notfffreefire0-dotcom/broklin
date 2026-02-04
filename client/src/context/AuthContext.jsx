
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved token
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Login failed');
        }

        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ username: data.username }));
        setUser({ username: data.username });
    };



    const register = async (username, password) => {
        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        console.log("Registering at:", BASE_URL); // Debug log

        try {
            const res = await fetch(`${BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const contentType = res.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") === -1) {
                const text = await res.text();
                console.error("Non-JSON response:", text);
                throw new Error("Server returned HTML (Check API URL)");
            }

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Registration failed');
            }

            const data = await res.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ username: data.username, avatar: data.avatar }));
            setUser({ username: data.username, avatar: data.avatar });
        } catch (error) {
            console.error("Register Error:", error);
            throw error;
        }
    };

    const loginWithGoogle = async (credential) => {
        const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const res = await fetch(`${BASE_URL}/api/auth/google`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token: credential }),
        });

        if (!res.ok) {
            throw new Error('Google Login Failed');
        }

        const data = await res.json();
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ username: data.username, avatar: data.avatar }));
        setUser({ username: data.username, avatar: data.avatar });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, register, loginWithGoogle, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
