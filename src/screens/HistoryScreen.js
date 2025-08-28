import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeContext';

const HistoryScreen = () => {
    const { colors, isDarkMode } = useContext(ThemeContext);
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchTransactions = async () => {
        setIsLoading(true);
        setError(null);
        // Replace with your actual Django backend URL
        const transactionsUrl = 'http://127.0.0.1:8000/expense/transactions/';
        
        try {
            const accessToken = await AsyncStorage.getItem('access_token');
            const response = await fetch(transactionsUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (response.ok) {
                setTransactions(data);
            } else {
                setError('Failed to fetch transactions.');
                console.error('API Error:', data.detail || data);
            }
        } catch (err) {
            setError('Network error. Could not connect to the server.');
            console.error('Network Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const renderTransactionItem = ({ item }) => (
        <View className={`${colors.card} p-4 rounded-xl mb-3 flex-row items-center justify-between shadow-sm`}>
            <View className="flex-row items-center">
                <View className={`w-10 h-10 rounded-full justify-center items-center mr-3`} style={{ backgroundColor: item.color || colors.primary }}>
                    <MaterialCommunityIcons name={item.icon || 'cash'} size={24} color="#FFFFFF" />
                </View>
                <View>
                    <Text className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {item.description || 'No Description'}
                    </Text>
                    <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {new Date(item.created_at).toDateString()}
                    </Text>
                </View>
            </View>
            <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                <Text className="text-red-500">- </Text>रू{item.amount}
            </Text>
        </View>
    );

    const filteredTransactions = transactions.filter(item => 
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View className={`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <Header title="Transaction History" showBackButton={false} />
            <View className="p-6">
                {/* Search Bar */}
                <View className={`flex-row items-center rounded-full p-2 mb-6 ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-sm`}>
                    <MaterialCommunityIcons name="magnify" size={24} color={isDarkMode ? '#D1D5DB' : '#6B7280'} />
                    <TextInput
                        className={`flex-1 ml-2 text-base ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                        placeholder="Search transactions..."
                        placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
                
                {isLoading ? (
                    <View className="flex-1 justify-center items-center">
                        <ActivityIndicator size="large" color={colors.primary} />
                        <Text className={`mt-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading transactions...</Text>
                    </View>
                ) : error ? (
                    <View className="flex-1 justify-center items-center">
                        <Text className="text-red-500 text-base">{error}</Text>
                        <TouchableOpacity onPress={fetchTransactions} className="mt-4 px-4 py-2 rounded-full bg-purple-500">
                            <Text className="text-white font-semibold">Retry</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={filteredTransactions}
                        renderItem={renderTransactionItem}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={() => (
                            <View className="flex-1 items-center justify-center mt-20">
                                <MaterialCommunityIcons name="format-list-bulleted-square" size={64} color={isDarkMode ? colors.subtext : colors.subtext} />
                                <Text className={`mt-4 text-center text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>No transactions found.</Text>
                            </View>
                        )}
                    />
                )}
            </View>
        </View>
    );
};

export default HistoryScreen;