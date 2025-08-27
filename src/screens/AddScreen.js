import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

const categories = [
    { name: 'Food', icon: 'food-apple' },
    { name: 'Transport', icon: 'car-side' },
    { name: 'Shopping', icon: 'shopping' },
    { name: 'Entertainment', icon: 'movie-open' },
    { name: 'Bills', icon: 'receipt' },
    { name: 'Health', icon: 'heart-pulse' },
    { name: 'Education', icon: 'school' },
    { name: 'Others', icon: 'dots-horizontal' },
];

const AddScreen = () => {
    const [isExpense, setIsExpense] = useState(true);

    return (
        <ScrollView className="flex-1 bg-gray-100 p-6">
            <Text className="text-3xl font-bold text-gray-800 mt-12 mb-6">Add Transaction</Text>

            {/* Income/Expense Toggle */}
            <View className="flex-row rounded-full p-1 bg-gray-200 mb-6">
                <TouchableOpacity
                    className={`flex-1 items-center py-2 px-4 rounded-full ${isExpense ? 'bg-white shadow' : ''}`}
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
                />
            </View>

            {/* Category Section */}
            <View className="mb-6">
                <Text className="text-gray-600 mb-2">Category</Text>
                <View className="flex-row flex-wrap justify-between">
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat.name}
                            className="w-[48%] flex-row items-center justify-center p-3 mb-2 rounded-xl border border-gray-300 bg-white"
                        >
                            <MaterialCommunityIcons name={cat.icon} size={20} color="#6D28D9" />
                            <Text className="ml-2 text-gray-700">{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Description Input */}
            <View className="mb-6">
                <Text className="text-gray-600 mb-2">Description</Text>
                <TextInput
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white"
                    placeholder="e.g., Dinner with friends"
                />
            </View>

            {/* Save Button */}
            <TouchableOpacity className="w-full bg-purple-700 py-4 rounded-xl">
                <Text className="text-white text-center font-bold">Add Transaction</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default AddScreen;