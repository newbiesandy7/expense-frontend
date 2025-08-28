import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const SignupScreen = () => {
    const navigation = useNavigation();
    const { colors, isDarkMode } = useContext(ThemeContext);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSignup = async () => {
        setIsLoading(true);
        setError(null);

        const signupUrl = 'http://127.0.0.1:8000/api/auth/register/'; // Use your Django registration URL

        if (!name || !email || !password) {
            setError('Please fill in all fields.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(signupUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();
            setIsLoading(false);

            if (response.ok) {
                console.log('Signup successful:', data);
                Alert.alert(
                    "Success",
                    "Your account has been created successfully! Please log in.",
                    [{ text: "OK", onPress: () => navigation.navigate('Login') }]
                );
            } else {
                let errorMessage = 'Signup failed. Please check your information.';
                if (data.email) {
                    errorMessage = data.email[0];
                } else if (data.password) {
                    errorMessage = data.password[0];
                } else if (data.detail) {
                    errorMessage = data.detail;
                }
                setError(errorMessage);
            }
        } catch (err) {
            console.error('Network error:', err);
            setIsLoading(false);
            setError('Failed to connect to the server. Please check your network.');
        }
    };

    const containerBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';
    const cardBg = isDarkMode ? 'bg-gray-700' : 'bg-white';
    const inputBg = isDarkMode ? 'bg-gray-600' : 'bg-gray-200';
    const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
    const placeholderColor = isDarkMode ? '#9CA3AF' : '#6B7280';

    return (
        <View className={`flex-1 items-center justify-center p-6 ${containerBg}`}>
            <View className={`${cardBg} p-8 rounded-3xl shadow-lg w-full max-w-sm`}>
                <Text className={`text-3xl font-bold text-center mb-2 ${textStyle}`}>Create Account</Text>
                <Text className={`text-sm text-center mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Sign up to start your financial journey</Text>

                {/* Form Inputs */}
                <View className="space-y-4">
                    <TextInput
                        className={`w-full h-12 rounded-xl px-4 ${inputBg} ${textStyle}`}
                        placeholder="Full Name"
                        placeholderTextColor={placeholderColor}
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        className={`w-full h-12 rounded-xl px-4 ${inputBg} ${textStyle}`}
                        placeholder="Email Address"
                        placeholderTextColor={placeholderColor}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        className={`w-full h-12 rounded-xl px-4 ${inputBg} ${textStyle}`}
                        placeholder="Password"
                        placeholderTextColor={placeholderColor}
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>

                {error && (
                    <View className="mt-4 p-3 bg-red-100 rounded-lg w-full">
                        <Text className="text-red-600 font-medium text-center">{error}</Text>
                    </View>
                )}

                {/* Signup Button */}
                <TouchableOpacity
                    onPress={handleSignup}
                    className={`w-full bg-purple-700 py-4 rounded-full mt-6 items-center ${isLoading ? 'opacity-50' : ''}`}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text className="text-white font-bold text-lg">Sign Up</Text>
                    )}
                </TouchableOpacity>

                {/* Login Link */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                    className="mt-4"
                >
                    <Text className={`text-sm text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Already have an account? <Text className={`font-bold ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>Log In</Text>
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default SignupScreen;