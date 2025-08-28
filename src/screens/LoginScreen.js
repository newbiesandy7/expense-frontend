import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        // Pass the token and the user's name to the login function
        login(data.access, data.username || email);

        // Optionally save refresh token
        if (data.refresh) {
          await AsyncStorage.setItem('refresh_token', data.refresh);
        }

        Alert.alert('Success', 'You are logged in!');
      } else {
        Alert.alert('Error', data.detail || 'Login failed');
        console.log('Login failed:', data);
      }
    } catch (error) {
      setLoading(false);
      console.error('Network error:', error);
      Alert.alert(
        'Error',
        'Network error. Make sure your server is running and accessible.'
      );
    }
  };

  return (
    <View className="flex-1 items-center justify-center p-6 bg-gray-100">
      <View className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-sm">
        {/* App Logo */}
        <View className="items-center mb-6">
          <Image
            source={require('../../assets/Expense Tracer.png')}
            className="w-20 h-20"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-purple-700 mt-2">
            Welcome to Rupaiyaa
          </Text>
          <Text className="text-sm text-gray-500">
            Your smart budget tracking companion
          </Text>
        </View>

        {/* Login/Sign Up Tabs */}
        <View className="flex-row rounded-full p-1 bg-gray-200 mb-6">
          <TouchableOpacity className="flex-1 items-center py-2 px-4 rounded-full bg-white shadow">
            <Text className="font-semibold text-purple-700">Login</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 items-center py-2 px-4 rounded-full">
            <Text className="font-semibold text-gray-500">Sign Up</Text>
          </TouchableOpacity>
        </View>

        {/* Form Inputs */}
        <View className="space-y-4">
          <View>
            <Text className="text-gray-600 mb-1">Email</Text>
            <TextInput
              className="w-full px-4 py-3 rounded-xl border border-gray-300"
              placeholder="Enter your email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View>
            <Text className="text-gray-600 mb-1">Password</Text>
            <TextInput
              className="w-full px-4 py-3 rounded-xl border border-gray-300"
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          className="w-full bg-purple-700 py-4 rounded-xl mt-6 flex items-center justify-center"
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-center font-bold">Login</Text>
          )}
        </TouchableOpacity>

        {/* Terms of Service */}
        <Text className="text-xs text-gray-400 text-center mt-4">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;