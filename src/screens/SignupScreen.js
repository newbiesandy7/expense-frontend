import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SignupScreen = () => {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSignup = async () => {
        setIsLoading(true);
        setError(null);

        // Replace with your actual Django backend URL for user registration
        const signupUrl = 'http://127.0.0.1:8000/api/auth/register/';

        try {
            const response = await fetch(signupUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Signup successful:', data);
                // After successful signup, navigate to the login page
                navigation.navigate('Login');
            } else {
                // Signup failed, show errors from the backend
                let errorMessage = 'Signup failed. Please check your information.';
                if (data.email) {
                    errorMessage = data.email[0]; // Example: "user with this email already exists."
                } else if (data.password) {
                    errorMessage = data.password[0]; // Example: "This password is too short."
                } else if (data.detail) {
                    errorMessage = data.detail;
                }
                setError(errorMessage);
            }
        } catch (err) {
            console.error('Network error:', err);
            setError('Failed to connect to the server. Please check your network.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View className="flex-1 justify-center items-center bg-gray-100 p-6">
            <Text className="text-4xl font-bold text-purple-700 mb-2">Sign Up</Text>
            <Text className="text-gray-500 mb-6">Create a new account</Text>

            {/* Full Name Input */}
            <View className="w-full mb-4">
                <View className="flex-row items-center bg-white p-3 rounded-lg shadow-sm">
                    <MaterialCommunityIcons name="account" size={20} color="#6B7280" />
                    <TextInput
                        className="flex-1 ml-3 text-lg text-gray-800"
                        placeholder="Full Name"
                        value={name}
                        onChangeText={setName}
                    />
                </View>
            </View>

            {/* Email Input */}
            <View className="w-full mb-4">
                <View className="flex-row items-center bg-white p-3 rounded-lg shadow-sm">
                    <MaterialCommunityIcons name="email" size={20} color="#6B7280" />
                    <TextInput
                        className="flex-1 ml-3 text-lg text-gray-800"
                        placeholder="Email Address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
            </View>

            {/* Password Input */}
            <View className="w-full mb-6">
                <View className="flex-row items-center bg-white p-3 rounded-lg shadow-sm">
                    <MaterialCommunityIcons name="lock" size={20} color="#6B7280" />
                    <TextInput
                        className="flex-1 ml-3 text-lg text-gray-800"
                        placeholder="Password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
            </View>
            
            {/* Error Message */}
            {error && (
                <View className="mb-4 p-3 bg-red-100 rounded-lg w-full">
                    <Text className="text-red-600 font-medium text-center">{error}</Text>
                </View>
            )}

            {/* Signup Button */}
            <TouchableOpacity
                onPress={handleSignup}
                className={`w-full bg-purple-700 px-8 py-3 rounded-full shadow-md items-center mb-4 ${isLoading ? 'opacity-50' : ''}`}
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
            >
                <Text className="text-sm text-gray-600">
                    Already have an account? <Text className="font-bold text-purple-700">Log In</Text>
                </Text>
            </TouchableOpacity>
        </View>
    );
};

export default SignupScreen;