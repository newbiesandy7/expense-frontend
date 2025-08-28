import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useContext, useState } from 'react';
import { Alert, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeContext';

const expenseCategories = [
    { name: 'Food', icon: 'food-fork-drink' },
    { name: 'Transport', icon: 'bus' },
    { name: 'Shopping', icon: 'shopping' },
    { name: 'Bills', icon: 'receipt' },
    { name: 'Entertainment', icon: 'movie' },
    { name: 'Health', icon: 'hospital' },
    { name: 'Groceries', icon: 'cart' },
    { name: 'Education', icon: 'school' },
    { name: 'Other', icon: 'dots-horizontal-circle' },
];

const incomeCategories = [
    { name: 'Salary', icon: 'cash-multiple' },
    { name: 'Freelance', icon: 'account-hard-hat' },
    { name: 'Gift', icon: 'gift' },
    { name: 'Rental', icon: 'home-city' },
    { name: 'Investments', icon: 'chart-line' },
    { name: 'Other', icon: 'dots-horizontal-circle' },
];

const paymentMethods = [
    { name: 'eSewa', icon: 'cellphone' },
    { name: 'Khalti', icon: 'credit-card' },
    { name: 'Cash', icon: 'cash' },
    { name: 'Bank Transfer', icon: 'bank-transfer' },
];

const AddScreen = () => {
    const { colors, isDarkMode } = useContext(ThemeContext);

    const [transactionType, setTransactionType] = useState('Expense');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSaveTransaction = () => {
        if (!amount || !selectedCategory) {
            Alert.alert('Missing Information', 'Please enter an amount and select a category.');
            return;
        }

        const transactionData = {
            type: transactionType,
            amount: parseFloat(amount),
            category: selectedCategory,
            description: description,
            date: date.toISOString().split('T')[0],
            paymentMethod: selectedPaymentMethod,
        };
        
        console.log('Saving Transaction:', transactionData);
        Alert.alert('Success', `${transactionType} of रू${amount} added successfully!`);

        // This is where you would use fetch() to send data to your Django backend.
        // Example:
        // fetch('http://YOUR_LOCAL_IP:8000/api/transactions/create/', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //         'Authorization': `Bearer ${token}` // Add authorization token
        //     },
        //     body: JSON.stringify(transactionData),
        // }).then(response => response.json())
        //   .then(data => console.log('Backend response:', data))
        //   .catch(error => console.error('Error saving transaction:', error));

        // Reset the form after saving
        setAmount('');
        setDescription('');
        setSelectedCategory(null);
        setSelectedPaymentMethod(null);
        setDate(new Date());
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const containerStyle = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';
    const cardBgColor = isDarkMode ? 'bg-gray-700' : 'bg-white';
    const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
    const inputBg = isDarkMode ? 'bg-gray-600' : 'bg-gray-200';

    const currentCategories = transactionType === 'Expense' ? expenseCategories : incomeCategories;
    const saveButtonColor = transactionType === 'Expense' ? 'bg-red-500' : 'bg-green-500';

    return (
        <ScrollView className={`flex-1 ${containerStyle}`} showsVerticalScrollIndicator={false}>
            <Header title={`Add ${transactionType}`} showBackButton={false} />
            <View className="p-6">
                {/* Type Selector */}
                <View className={`flex-row rounded-full p-1 mb-6 ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
                    <TouchableOpacity
                        onPress={() => setTransactionType('Expense')}
                        className={`flex-1 items-center py-2 rounded-full ${transactionType === 'Expense' ? 'bg-red-500' : ''}`}
                    >
                        <Text className={`font-semibold ${transactionType === 'Expense' ? 'text-white' : colors.subtext}`}>Expense</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setTransactionType('Income')}
                        className={`flex-1 items-center py-2 rounded-full ${transactionType === 'Income' ? 'bg-green-500' : ''}`}
                    >
                        <Text className={`font-semibold ${transactionType === 'Income' ? 'text-white' : colors.subtext}`}>Income</Text>
                    </TouchableOpacity>
                </View>

                {/* Main Inputs */}
                <View className={`${cardBgColor} p-6 rounded-3xl shadow-sm mb-6`}>
                    <Text className={`text-xl font-bold ${textStyle} mb-4`}>Transaction Details</Text>
                    
                    <Text className={`text-base font-medium ${textStyle} mb-2`}>Amount</Text>
                    <TextInput
                        className={`w-full h-14 rounded-xl px-4 text-xl font-bold mb-4 ${inputBg} ${textStyle}`}
                        placeholder="Enter amount"
                        placeholderTextColor={isDarkMode ? '#A78BFA' : '#9CA3AF'}
                        keyboardType="numeric"
                        value={amount}
                        onChangeText={setAmount}
                    />

                    <Text className={`text-base font-medium ${textStyle} mb-2`}>Description</Text>
                    <TextInput
                        className={`w-full h-12 rounded-xl px-4 text-lg mb-4 ${inputBg} ${textStyle}`}
                        placeholder="e.g., Dinner with friends"
                        placeholderTextColor={isDarkMode ? '#A78BFA' : '#9CA3AF'}
                        value={description}
                        onChangeText={setDescription}
                    />

                    <Text className={`text-base font-medium ${textStyle} mb-2`}>Date</Text>
                    <TouchableOpacity 
                        onPress={() => setShowDatePicker(true)}
                        className={`w-full h-12 rounded-xl px-4 mb-4 justify-center ${inputBg}`}
                    >
                        <Text className={`text-lg ${textStyle}`}>
                            {date.toDateString()}
                        </Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                            maximumDate={new Date()}
                        />
                    )}
                </View>

                {/* Categories Section */}
                <View className={`${cardBgColor} p-6 rounded-3xl shadow-sm mb-6`}>
                    <Text className={`text-xl font-bold ${textStyle} mb-4`}>Select a Category</Text>
                    <View className="flex-row flex-wrap justify-between">
                        {currentCategories.map((item) => (
                            <TouchableOpacity
                                key={item.name}
                                onPress={() => setSelectedCategory(item.name)}
                                className={`w-[30%] p-3 mb-4 rounded-xl items-center ${
                                    selectedCategory === item.name
                                        ? isDarkMode ? 'bg-purple-600' : 'bg-purple-200 border-2 border-purple-700'
                                        : isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                                }`}
                            >
                                <MaterialCommunityIcons 
                                    name={item.icon} 
                                    size={36} 
                                    color={selectedCategory === item.name ? colors.primary : colors.subtext}
                                />
                                <Text className={`text-xs font-medium mt-2 text-center ${
                                    selectedCategory === item.name ? 'text-purple-700' : isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                    {item.name}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Payment Method Section (only for expenses) */}
                {transactionType === 'Expense' && (
                    <View className={`${cardBgColor} p-6 rounded-3xl shadow-sm mb-6`}>
                        <Text className={`text-xl font-bold ${textStyle} mb-4`}>Paid by</Text>
                        <View className="flex-row flex-wrap justify-between">
                            {paymentMethods.map((item) => (
                                <TouchableOpacity
                                    key={item.name}
                                    onPress={() => setSelectedPaymentMethod(item.name)}
                                    className={`w-[48%] p-3 mb-4 rounded-xl items-center flex-row ${
                                        selectedPaymentMethod === item.name
                                            ? isDarkMode ? 'bg-purple-600' : 'bg-purple-200 border-2 border-purple-700'
                                            : isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
                                    }`}
                                >
                                    <MaterialCommunityIcons name={item.icon} size={24} color={selectedPaymentMethod === item.name ? colors.primary : colors.subtext} />
                                    <Text className={`text-sm font-medium ml-2 ${
                                        selectedPaymentMethod === item.name ? 'text-purple-700' : isDarkMode ? 'text-white' : 'text-gray-900'
                                    }`}>
                                        {item.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}

                {/* Save Button */}
                <TouchableOpacity
                    onPress={handleSaveTransaction}
                    className={`w-full py-4 rounded-full shadow-md items-center ${saveButtonColor}`}
                >
                    <Text className="text-white font-bold text-lg">Save {transactionType}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default AddScreen;