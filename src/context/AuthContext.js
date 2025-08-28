import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null); // New state for user email

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const accessToken = await AsyncStorage.getItem('access_token');
                const storedUserName = await AsyncStorage.getItem('user_name');
                const storedUserEmail = await AsyncStorage.getItem('user_email'); // Get user email
                if (accessToken && storedUserName && storedUserEmail) {
                    setIsLoggedIn(true);
                    setUserName(storedUserName);
                    setUserEmail(storedUserEmail);
                }
            } catch (e) {
                console.error('Failed to load data from storage', e);
            } finally {
                setIsLoading(false);
            }
        };
        checkLoginStatus();
    }, []);

    const login = async (token, name, email) => { // Updated login function
        try {
            await AsyncStorage.setItem('access_token', token);
            await AsyncStorage.setItem('user_name', name);
            await AsyncStorage.setItem('user_email', email); // Save user email
            setIsLoggedIn(true);
            setUserName(name);
            setUserEmail(email);
        } catch (e) {
            console.error('Failed to save data to storage', e);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('access_token');
            await AsyncStorage.removeItem('user_name');
            await AsyncStorage.removeItem('user_email'); // Remove user email
            setIsLoggedIn(false);
            setUserName(null);
            setUserEmail(null);
        } catch (e) {
            console.error('Failed to remove data from storage', e);
        }
    };

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
                <Text style={{ marginTop: 10 }}>Loading...</Text>
            </View>
        );
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, userName, userEmail }}>
            {children}
        </AuthContext.Provider>
    );
};