import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeContext';

const paymentMethods = [
    { name: 'Credit Card', icon: 'credit-card-outline' },
    { name: 'Debit Card', icon: 'credit-card-chip-outline' },
    { name: 'Cash', icon: 'cash' },
    { name: 'UPI', icon: 'qrcode' },
    { name: 'Bank Transfer', icon: 'bank' },
];

const AddScreen = () => {
    const { colors, isDarkMode } = useContext(ThemeContext);
    const [type, setType] = useState('Expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [category, setCategory] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    const [expenseCategories, setExpenseCategories] = useState([]);
    const [incomeCategories, setIncomeCategories] = useState([]);

    const categories = type === 'Expense' ? expenseCategories : incomeCategories;

    const fetchCategories = async (categoryType) => {
        try {
            const accessToken = await AsyncStorage.getItem('access_token');
            // Corrected URL to use singular 'expense' and 'income'
            const endpoint = `http://192.168.1.10:8000/${categoryType}/categories/`;

            const response = await fetch(endpoint, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            
            const data = await response.json();
            if (response.ok) {
                return data; 
            } else {
                console.error(`Failed to fetch ${categoryType} categories:`, data);
                return []; 
            }
        } catch (error) {
            console.error('Network error:', error);
            return [];
        }
    };

    useEffect(() => {
        const loadCategories = async () => {
            setCategoriesLoading(true);
            // Calling the fetch function with the correct singular endpoint types
            const fetchedExpenseCats = await fetchCategories('expense');
            const fetchedIncomeCats = await fetchCategories('income');
            setExpenseCategories(fetchedExpenseCats);
            setIncomeCategories(fetchedIncomeCats);
            setCategoriesLoading(false);
        };
        loadCategories();
    }, []);

    const onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleSave = async () => {
        if (!amount || !category || !paymentMethod) {
            Alert.alert('Incomplete Form', 'Please fill in all required fields.');
            return;
        }

        setLoading(true);

        const transactionData = {
            amount: parseFloat(amount),
            description: description || 'N/A',
            date: date.toISOString().split('T')[0],
            category: category.name,
            payment_method: paymentMethod.name,
        };

        let endpoint = '';
        if (type === 'Expense') {
            // Corrected URL to use singular 'expense'
            endpoint = 'http://192.168.1.10:8000/expense/';
        } else {
            // Corrected URL to use singular 'income'
            endpoint = 'http://192.168.1.10:8000/income/';
        }

        try {
            const accessToken = await AsyncStorage.getItem('access_token');
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(transactionData),
            });

            const responseData = await response.json();

            if (response.ok) {
                Alert.alert('Success', `${type} added successfully!`);
                setAmount('');
                setDescription('');
                setDate(new Date());
                setCategory(null);
                setPaymentMethod(null);
            } else {
                Alert.alert('Error', responseData.detail || `Failed to add ${type}.`);
                console.error('API Error:', responseData);
            }
        } catch (error) {
            Alert.alert('Network Error', 'Could not connect to the server.');
            console.error('Network Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className={`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <Header title="Add Transaction" showBackButton={false} showProfileIcon={false} />
            <View className="p-6">
                {/* Type Selection */}
                <View className={`rounded-xl p-1 mb-6 flex-row ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <TouchableOpacity
                        className={`flex-1 py-3 rounded-lg items-center ${type === 'Expense' && (isDarkMode ? 'bg-gray-600' : 'bg-white shadow')}`}
                        onPress={() => setType('Expense')}
                    >
                        <Text className={`font-semibold text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Expense</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className={`flex-1 py-3 rounded-lg items-center ${type === 'Income' && (isDarkMode ? 'bg-gray-600' : 'bg-white shadow')}`}
                        onPress={() => setType('Income')}
                    >
                        <Text className={`font-semibold text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Income</Text>
                    </TouchableOpacity>
                </View>

                {/* Amount Input */}
                <View className="mb-6">
                    <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Amount</Text>
                    <TextInput
                        className={`text-4xl font-bold border-b pb-2 ${isDarkMode ? 'text-white border-gray-600' : 'text-gray-900 border-gray-300'}`}
                        placeholder="रू0.00"
                        placeholderTextColor={isDarkMode ? '#6B7280' : '#A0AEC0'}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>

                {/* Category Selection */}
                <View className="mb-6">
                    <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Category</Text>
                    {categoriesLoading ? (
                        <View className="items-center py-4">
                            <ActivityIndicator size="small" color={colors.primary} />
                            <Text className={`mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading categories...</Text>
                        </View>
                    ) : (
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {categories.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    className={`items-center mr-4 p-3 rounded-xl ${category?.name === item.name ? 'bg-purple-700' : (isDarkMode ? 'bg-gray-700' : 'bg-white')}`}
                                    onPress={() => setCategory(item)}
                                >
                                    <MaterialCommunityIcons
                                        name={item.icon}
                                        size={32}
                                        color={category?.name === item.name ? '#FFF' : colors.primary}
                                    />
                                    <Text className={`mt-1 font-semibold text-center ${category?.name === item.name ? 'text-white' : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </View>

                {/* Other Inputs */}
                <View className="space-y-4">
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} className={`flex-row items-center p-4 rounded-xl ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
                        <MaterialCommunityIcons name="calendar-month-outline" size={24} color={colors.primary} />
                        <Text className={`ml-3 text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{date.toDateString()}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}

                    <TextInput
                        className={`p-4 rounded-xl text-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}
                        placeholder="Description (optional)"
                        placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                        value={description}
                        onChangeText={setDescription}
                    />
                </View>

                {/* Payment Method Selection */}
                <View className="mt-6 mb-6">
                    <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>Payment Method</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {paymentMethods.map((item, index) => (
                            <TouchableOpacity
                                key={index}
                                className={`items-center mr-4 p-3 rounded-xl ${paymentMethod?.name === item.name ? 'bg-purple-700' : (isDarkMode ? 'bg-gray-700' : 'bg-white')}`}
                                onPress={() => setPaymentMethod(item)}
                            >
                                <MaterialCommunityIcons
                                    name={item.icon}
                                    size={32}
                                    color={paymentMethod?.name === item.name ? '#FFF' : colors.primary}
                                />
                                <Text className={`mt-1 font-semibold text-center ${paymentMethod?.name === item.name ? 'text-white' : (isDarkMode ? 'text-white' : 'text-gray-900')}`}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    onPress={handleSave}
                    className="w-full bg-purple-700 py-4 rounded-full items-center"
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text className="text-white text-lg font-bold">Add {type}</Text>
                    )}
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default AddScreen;