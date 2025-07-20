import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { api } from '../lib/api';
import { login as loginService } from "../services/auth";
import type { User } from "@/lib/types";

export interface AuthContextType {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticating, setIsAuthenticating] = useState(false); // Added

    useEffect(() => {
        const storedToken = localStorage.getItem("authToken");
        const storedUser = localStorage.getItem("user");

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user data:", e);
                // Clear invalid data if parsing fails
                localStorage.removeItem("user");
                localStorage.removeItem("authToken");
            }
            api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setIsAuthenticating(true); // Set loading true at the start
        try {
            const { token, user } = await loginService(email, password);

            setToken(token);
            setUser(user);

            localStorage.setItem("authToken", token);
            localStorage.setItem("user", JSON.stringify(user));
            api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } finally {
            setIsAuthenticating(false); // Set loading false in finally block
        }
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        delete api.defaults.headers.common["Authorization"];
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        isAuthenticating, // Added
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
