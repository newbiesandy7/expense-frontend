import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';

import { AuthContext, AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';

import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import SignupScreen from './src/screens/SignupScreen';

import './global.css';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    // ... (This function remains the same as before)
}

function AuthStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
    );
}

function AppNavigation() {
    const { isLoggedIn } = useContext(AuthContext);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {isLoggedIn ? (
                    <>
                        <Stack.Screen name="Main" component={MainTabs} />
                        <Stack.Screen name="Profile" component={ProfileScreen} />
                    </>
                ) : (
                    <Stack.Screen name="Auth" component={AuthStack} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppNavigation />
            </AuthProvider>
        </ThemeProvider>
    );
}