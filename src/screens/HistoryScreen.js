import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';

const HistoryScreen = () => {
    const dummyTransactions = [
        { id: '1', description: 'Groceries', category: 'Food', amount: '-रू50', date: '25th Aug, 2025', icon: 'food-apple' },
        { id: '2', description: 'Salary', category: 'Income', amount: '+रू2000', date: '20th Aug, 2025', icon: 'currency-usd' },
        { id: '3', description: 'Uber', category: 'Transport', amount: '-रू15', date: '24th Aug, 2025', icon: 'car-side' },
        { id: '4', description: 'Movie Tickets', category: 'Entertainment', amount: '-रू30', date: '23rd Aug, 2025', icon: 'movie-open' },
    ];
    
    return (
        <View className="flex-1 bg-gray-100">
            <Header
                title="Transaction History"
                subtitle="Check all your transactions here"
            />
            <View className="p-4">
                <View className="flex-row items-center rounded-xl p-3 mt-4 bg-gray-100">
                    <MaterialCommunityIcons name="magnify" size={24} color="#9CA3AF" />
                    <TextInput className="flex-1 ml-2" placeholder="Search" />
                </View>

                <View className="flex-row justify-between mb-4">
                    <View className="flex-1 p-3 bg-white rounded-xl shadow-sm mr-2">
                        <Text className="text-gray-500">Total Income</Text>
                        <Text className="text-green-600 font-bold mt-1">+रू45,000</Text>
                    </View>
                    <View className="flex-1 p-3 bg-white rounded-xl shadow-sm ml-2">
                        <Text className="text-gray-500">Total Expenses</Text>
                        <Text className="text-red-600 font-bold mt-1">-रू12,450</Text>
                    </View>
                </View>

                <View className="flex-row justify-around mb-4">
                    {['All', 'Income', 'Expenses', 'Food'].map((filter) => (
                        <TouchableOpacity key={filter} className="p-2 rounded-full border border-gray-300">
                            <Text className="text-sm text-gray-700">{filter}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Text className="text-lg font-bold text-gray-700 mb-2">All Transactions</Text>
                {dummyTransactions.map((item) => (
                    <View key={item.id} className="flex-row items-center p-4 mb-3 bg-white rounded-2xl shadow-sm">
                        <View className="w-12 h-12 rounded-full justify-center items-center bg-purple-100 mr-4">
                            <MaterialCommunityIcons name={item.icon} size={24} color="#6D28D9" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-lg font-bold text-gray-800">{item.description}</Text>
                            <Text className="text-sm text-gray-500">{item.category} • {item.date}</Text>
                        </View>
                        <Text className={`text-lg font-bold ${item.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {item.amount}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

export default HistoryScreen;