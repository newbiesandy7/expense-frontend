import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddScreen = () => {
    const [isExpense, setIsExpense] = useState(true);
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (!token) {
                Alert.alert('Error', 'You must be logged in to access categories.');
                return;
            }

            const response = await fetch('http://127.0.0.1:8000/expense/categories/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                // Handle paginated response - extract results array
                const categoriesData = data.results || [];
                setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            } else {
                Alert.alert('Error', 'Failed to fetch categories');
                console.log('Categories API Error:', data);
                // Fallback to default categories if API fails
                setCategories([
                    { id: 1, name: 'Food', icon: 'food-apple' },
                    { id: 2, name: 'Transport', icon: 'car-side' },
                    { id: 3, name: 'Shopping', icon: 'shopping' },
                    { id: 4, name: 'Entertainment', icon: 'movie-open' },
                    { id: 5, name: 'Bills', icon: 'receipt' },
                    { id: 6, name: 'Health', icon: 'heart-pulse' },
                    { id: 7, name: 'Education', icon: 'school' },
                    { id: 8, name: 'Others', icon: 'dots-horizontal' },
                ]);
            }
        } catch (error) {
            console.error('Network Error:', error);
            Alert.alert('Error', 'Network error while fetching categories.');
            // Fallback to default categories
            setCategories([
                { id: 1, name: 'Food', icon: 'food-apple' },
                { id: 2, name: 'Transport', icon: 'car-side' },
                { id: 3, name: 'Shopping', icon: 'shopping' },
                { id: 4, name: 'Entertainment', icon: 'movie-open' },
                { id: 5, name: 'Bills', icon: 'receipt' },
                { id: 6, name: 'Health', icon: 'heart-pulse' },
                { id: 7, name: 'Education', icon: 'school' },
                { id: 8, name: 'Others', icon: 'dots-horizontal' },
            ]);
        } finally {
            setCategoriesLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddTransaction = async () => {
        if (!amount || !description || !selectedCategory) {
            Alert.alert('Error', 'Please fill all fields and select a category.');
            return;
        }

        setLoading(true);

        try {
            const token = await AsyncStorage.getItem('access_token');
            if (!token) {
                Alert.alert('Error', 'You must be logged in to add transactions.');
                setLoading(false);
                return;
            }

            const response = await fetch('http://127.0.0.1:8000/expense/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    amount: parseFloat(amount),
                    description,
                    category_id: selectedCategory, // This is now the category ID
                    group: isExpense ? 'Expense' : 'Income',
                }),
            });

            const data = await response.json();
            setLoading(false);

            if (response.ok) {
                Alert.alert('Success', 'Transaction added successfully!');
                // Clear form
                setAmount('');
                setDescription('');
                setSelectedCategory(null);
            } else {
                Alert.alert('Error', data.detail || 'Failed to add transaction');
                console.log('API Error:', data);
            }
        } catch (error) {
            setLoading(false);
            console.error('Network Error:', error);
            Alert.alert('Error', 'Network error. Make sure your server is running.');
        }
    };

    if (categoriesLoading) {
        return (
            <View className="flex-1 bg-gray-100 justify-center items-center">
                <ActivityIndicator size="large" color="#6D28D9" />
                <Text className="mt-2 text-gray-600">Loading categories...</Text>
            </View>
        );
    }

    return (
        <ScrollView className="flex-1 bg-gray-100 p-6">
            <Text className="text-3xl font-bold text-gray-800 mt-12 mb-6">Add Transaction</Text>

            {/* Income/Expense Toggle */}
            <View className="flex-row rounded-full p-1 bg-gray-200 mb-6">
                <TouchableOpacity
                    className={`flex-1 items-center py-2 px-4 rounded-full ${isExpense ? 'bg-white BoxShadow' : ''}`}
                    onPress={() => setIsExpense(true)}
                >
                    <Text className={`font-semibold ${isExpense ? 'text-red-500' : 'text-gray-500'}`}>Expense</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className={`flex-1 items-center py-2 px-4 rounded-full ${!isExpense ? 'bg-white shadow' : ''}`}
                    onPress={() => setIsExpense(false)}
                >
                    <Text className={`font-semibold ${!isExpense ? 'text-green-500' : 'text-gray-500'}`}>Income</Text>
                </TouchableOpacity>
            </View>

            {/* Amount Input */}
            <View className="mb-6">
                <Text className="text-gray-600 mb-2">Amount</Text>
                <TextInput
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white"
                    placeholder="Enter amount"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={setAmount}
                />
            </View>

            {/* Category Section */}
            <View className="mb-6">
                <Text className="text-gray-600 mb-2">Category</Text>
                <View className="flex-row flex-wrap justify-between">
                    {Array.isArray(categories) && categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.id}
                            className={`w-[48%] flex-row items-center justify-center p-3 mb-2 rounded-xl border ${
                                selectedCategory === cat.id ? 'border-purple-700 bg-purple-100' : 'border-gray-300 bg-white'
                            }`}
                            onPress={() => setSelectedCategory(cat.id)}
                        >
                            <MaterialCommunityIcons 
                                name={cat.icon || 'dots-horizontal'} 
                                size={20} 
                                color="#6D28D9" 
                            />
                            <Text className="ml-2 text-gray-700">{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                    {(!Array.isArray(categories) || categories.length === 0) && (
                        <Text className="text-gray-500 text-center w-full">No categories available</Text>
                    )}
                </View>
            </View>

            {/* Description Input */}
            <View className="mb-6">
                <Text className="text-gray-600 mb-2">Description</Text>
                <TextInput
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white"
                    placeholder="e.g., Dinner with friends"
                    value={description}
                    onChangeText={setDescription}
                />
            </View>

            {/* Save Button */}
            <TouchableOpacity
                className="w-full bg-purple-700 py-4 rounded-xl"
                onPress={handleAddTransaction}
                disabled={loading}
            >
                <Text className="text-white text-center font-bold">
                    {loading ? 'Adding...' : 'Add Transaction'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AddScreen;