import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useContext, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';

const API_BASE_URL = 'http://127.0.0.1:8000';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);

  const [isLoginMode, setIsLoginMode] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [signupPhoneNumber, setSignupPhoneNumber] = useState('');
  const [signupProfileImage, setSignupProfileImage] = useState(null);

  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Permission to access media library is needed to upload a profile picture.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSignupProfileImage(result.assets[0].uri);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
  const response = await fetch(`http://127.0.0.1:8000/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: loginEmail, password: loginPassword }),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        login(
          data.access,
          data.username || loginEmail,
          data.email || '',
          data.profile_image || null
        );
        if (data.refresh) {
          await AsyncStorage.setItem('refresh_token', data.refresh);
        }
        Alert.alert('Success', 'You are logged in!');
      } else {
        let errorMessage = data.detail || 'Login failed';
        if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.map(e => e.detail || JSON.stringify(e)).join('\n');
        }
        Alert.alert('Error', errorMessage);
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

  const handleSignup = async () => {
    if (signupPassword !== signupConfirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    if (!signupUsername || !signupEmail || !signupPassword || !signupFirstName || !signupLastName || !signupPhoneNumber) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('first_name', signupFirstName);
      formData.append('last_name', signupLastName);
      formData.append('username', signupUsername);
      formData.append('email', signupEmail);
      formData.append('password', signupPassword);
      formData.append('phone_number', signupPhoneNumber);

      if (signupProfileImage) {
        const filename = signupProfileImage.split('/').pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image`;
        formData.append('profile_image', { uri: signupProfileImage, name: filename, type });
      }

      const response = await fetch(`http://127.0.0.1:8000/auth/register/`, {
        method: 'POST',
        // Do NOT set Content-Type header for FormData; let fetch set it automatically
        body: formData,
      });

      const data = await response.json();
      setLoading(false);

      if (response.status === 201) {
        Alert.alert('Success', 'Account created successfully! Please log in.');
        setIsLoginMode(true);
        setSignupFirstName('');
        setSignupLastName('');
        setSignupUsername('');
        setSignupEmail('');
        setSignupPassword('');
        setSignupConfirmPassword('');
        setSignupPhoneNumber('');
        setSignupProfileImage(null);
      } else {
        let errorMessage = 'Registration failed.';
        if (data.errors && Array.isArray(data.errors)) {
          errorMessage = data.errors.map(e => e.detail || JSON.stringify(e)).join('\n');
        } else if (data.detail) {
          errorMessage = data.detail;
        } else if (typeof data === 'object') {
          errorMessage = Object.values(data).flat().join('\n');
        }
        Alert.alert('Error', errorMessage);
        console.log('Registration failed:', data);
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

  const renderLoginForm = () => (
    <View className="space-y-4">
      <View>
        <Text className="text-gray-600 mb-1">Email</Text>
        <TextInput
          className="w-full px-4 py-3 rounded-xl border border-gray-300"
          placeholder="Enter your email"
          keyboardType="email-address"
          value={loginEmail}
          onChangeText={setLoginEmail}
        />
      </View>
      <View>
        <Text className="text-gray-600 mb-1">Password</Text>
        <TextInput
          className="w-full px-4 py-3 rounded-xl border border-gray-300"
          placeholder="Enter your password"
          secureTextEntry
          value={loginPassword}
          onChangeText={setLoginPassword}
        />
      </View>
    </View>
  );

  const renderSignupForm = () => (
    <View className="space-y-4">
      <View>
        <Text className="text-gray-600 mb-1">First Name</Text>
        <TextInput
          className="w-full px-4 py-3 rounded-xl border border-gray-300"
          placeholder="Enter your first name"
          value={signupFirstName}
          onChangeText={setSignupFirstName}
        />
      </View>
      <View>
        <Text className="text-gray-600 mb-1">Last Name</Text>
        <TextInput
          className="w-full px-4 py-3 rounded-xl border border-gray-300"
          placeholder="Enter your last name"
          value={signupLastName}
          onChangeText={setSignupLastName}
        />
      </View>
      <View>
        <Text className="text-gray-600 mb-1">Username</Text>
        <TextInput
          className="w-full px-4 py-3 rounded-xl border border-gray-300"
          placeholder="Choose a username"
          value={signupUsername}
          onChangeText={setSignupUsername}
        />
      </View>
      <View>
        <Text className="text-gray-600 mb-1">Email</Text>
        <TextInput
          className="w-full px-4 py-3 rounded-xl border border-gray-300"
          placeholder="Enter your email"
          keyboardType="email-address"
          value={signupEmail}
          onChangeText={setSignupEmail}
        />
      </View>
      <View>
        <Text className="text-gray-600 mb-1">Password</Text>
        <TextInput
          className="w-full px-4 py-3 rounded-xl border border-gray-300"
          placeholder="Enter a strong password"
          secureTextEntry
          value={signupPassword}
          onChangeText={setSignupPassword}
        />
      </View>
      <View>
        <Text className="text-gray-600 mb-1">Confirm Password</Text>
        <TextInput
          className="w-full px-4 py-3 rounded-xl border border-gray-300"
          placeholder="Confirm your password"
          secureTextEntry
          value={signupConfirmPassword}
          onChangeText={setSignupConfirmPassword}
        />
      </View>
      <View>
        <Text className="text-gray-600 mb-1">Phone Number</Text>
        <TextInput
          className="w-full px-4 py-3 rounded-xl border border-gray-300"
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          value={signupPhoneNumber}
          onChangeText={setSignupPhoneNumber}
        />
      </View>
      <View>
        <Text className="text-gray-600 mb-1">Profile Image</Text>
        <TouchableOpacity
          className="w-full px-4 py-3 rounded-xl border border-gray-300 flex-row items-center justify-center bg-gray-50"
          onPress={pickImage}
        >
          {signupProfileImage ? (
            <Image 
              source={{ uri: signupProfileImage }} 
              className="w-12 h-12 rounded-full mr-4" 
            />
          ) : (
            <Text className="text-gray-500">Choose Profile Image</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View className="flex-1 p-6 bg-gray-100">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-sm">
          {/* App Logo */}
          <View className="items-center mb-6">
            <Image
              source={require('../../assets/Expense Tracer.png')}
              className="w-16 h-16" // Adjusted class for smaller size
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
            <TouchableOpacity 
              className={`flex-1 items-center py-2 px-4 rounded-full ${isLoginMode ? 'bg-white shadow' : ''}`}
              onPress={() => setIsLoginMode(true)}
            >
              <Text className={`font-semibold ${isLoginMode ? 'text-purple-700' : 'text-gray-500'}`}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`flex-1 items-center py-2 px-4 rounded-full ${!isLoginMode ? 'bg-white shadow' : ''}`}
              onPress={() => setIsLoginMode(false)}
            >
              <Text className={`font-semibold ${!isLoginMode ? 'text-purple-700' : 'text-gray-500'}`}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Conditionally render form based on state */}
          {isLoginMode ? renderLoginForm() : renderSignupForm()}

          {/* Action Button */}
          <TouchableOpacity
            className="w-full bg-purple-700 py-4 rounded-xl mt-6 flex items-center justify-center"
            onPress={isLoginMode ? handleLogin : handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-center font-bold">
                {isLoginMode ? 'Login' : 'Sign Up'}
              </Text>
            )}
          </TouchableOpacity>

          {/* Terms of Service */}
          <Text className="text-xs text-gray-400 text-center mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default LoginScreen;