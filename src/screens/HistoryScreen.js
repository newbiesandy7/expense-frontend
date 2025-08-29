import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';

const HistoryScreen = () => {
    const { colors, isDarkMode } = useContext(ThemeContext);
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [isFilterModalVisible, setFilterModalVisible] = useState(false);
    const [filters, setFilters] = useState({
        startDate: null,
        endDate: null,
        type: 'All',
    });

    const categories = ['All', 'Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other'];

    const fetchTransactions = async () => {
        setIsLoading(true);
        setError(null);
        const transactionsUrl = 'http://127.0.0.1:8000/expense/reports/transactions/'; 
        
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
                const formattedData = data.map(item => ({
                    ...item,
                    type: item.is_income ? 'Income' : 'Expense',
                    icon: item.is_income ? 'arrow-top-right' : 'arrow-bottom-left',
                    category_name: item.category?.name || 'Uncategorized',
                    category_color: item.category?.color || (item.is_income ? '#10B981' : '#EF4444'),
                }));
                setTransactions(formattedData);
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

    // Removed stray JSX block that was outside of any function/component
    const renderTransactionItem = ({ item }) => {
        let dateObj = item.created_at ? new Date(item.created_at) : null;
        let isValidDate = dateObj && !isNaN(dateObj.getTime());
        let dateStr = isValidDate ? dateObj.toDateString() : 'Unknown Date';
        let timeStr = isValidDate ? dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
        return (
            <View className={`${isDarkMode ? 'bg-gray-900' : 'bg-white'} p-4 rounded-xl mb-3 flex-row items-center justify-between shadow-sm`}>
                <View className="flex-row items-center">
                    <View className={`w-10 h-10 rounded-full justify-center items-center mr-3`} style={{ backgroundColor: item.category_color }}>
                        <MaterialCommunityIcons name={item.icon} size={24} color="#FFFFFF" />
                    </View>
                    <View>
                        <Text className={`text-base font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {item.description || 'No Description'}
                        </Text>
                        <Text className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {dateStr}{timeStr ? ` at ${timeStr}` : ''}
                        </Text>
                    </View>
                </View>
                <View className="items-end">
                <Text className={`text-lg font-bold ${item.type === 'Income' ? 'text-green-500' : 'text-red-500'}`}>
                    {item.type === 'Expense' ? '-' : '+'} रू{item.amount}
                </Text>
                <View className={`rounded-full px-2 py-1 mt-1`} style={{ backgroundColor: item.category_color }}>
                    <Text className="text-white text-xs font-medium">{item.category_name}</Text>
                </View>
            </View>
        </View>
    );

};}

export default HistoryScreen;