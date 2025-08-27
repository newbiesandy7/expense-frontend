import { createContext, useState } from 'react';
import { useColorScheme } from 'react-native';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const colorScheme = useColorScheme();
    const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark');

    const toggleTheme = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    const theme = {
        isDarkMode,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
};