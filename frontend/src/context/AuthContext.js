import React, {createContext, useState, useEffect, use} from 'react';
import {authService} from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const[loading, setLoading] = useState(true);
    const[isAuthenticated, setIsAuthenticated] = useState(false);

    //check if the user is logged already as the app loads
    useEffect(() => {
        const token = authService.getToken();
        const userId = authService.getUserId();
        if(token && userId){
            setIsAuthenticated(true);
            // Fetch full user data from backend
            authService.getUser()
                .then(userData => {
                    setUser(userData);
                })
                .catch(error => {
                    console.error('Error fetching user:', error);
                    // Fallback: set user with just ID
                    setUser({id: userId});
                });
        }

        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try{
            const data = await authService.login(email, password);
            setUser(data);
            setIsAuthenticated(true);
            return data;
        } catch (error){
            throw error;
        }
    };

    const register = async (email, password, firstName, lastName) => {
        try{
            const data = await authService.register(email, password, firstName, lastName);
            return data;

        } catch(error){
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{user, loading, isAuthenticated, login, register, logout}}>
            {children}
        </AuthContext.Provider>
    ) ;
}