import { createContext, useState } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const colorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

    const lightColors = {
        background: '#F9FAFB',
        card: '#FFFFFF',
        primary: '#6D28D9',
        subtext: '#9CA3AF',
    };
    const darkColors = {
        background: '#18181B',
        card: '#27272A',
        primary: '#A78BFA',
        subtext: '#A1A1AA',
    };

    const colors = isDarkMode ? darkColors : lightColors;

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const theme = {
        isDarkMode,
        toggleTheme,
        colors,
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};