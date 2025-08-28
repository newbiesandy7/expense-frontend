import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert, ScrollView, RefreshControl } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
const HistoryScreen = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Fetch categories for filter options
    const fetchCategories = async () => {
        try {
            const token = await AsyncStorage.getItem('access_token');
            if (!token) {
                Alert.alert('Error', 'You must be logged in to access categories.');
                return;
            }

            const response = await fetch('http://127.0.0.1:8000/categories/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (response.ok) {
                const data = await response.json();
                setCategories(data.results || data || []);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    // Build query parameters
    const buildQueryParams = (page = 1, categoryId = null, search = '') => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        
        if (categoryId) {
            params.append('category', categoryId.toString());
        }
        
        if (search.trim()) {
            params.append('search', search.trim());
        }
        
        return params.toString();
    };

    // Fetch expenses from API with filters
    const fetchTransactions = async (page = 1, categoryId = null, search = '', append = false) => {
        try {
            if (!append) setLoading(page === 1);
            if (append) setLoadingMore(true);

            const token = await AsyncStorage.getItem('access_token');
            if (!token) {
                Alert.alert('Error', 'You must be logged in to access transactions.');
                return;
            }

            const queryParams = buildQueryParams(page, categoryId, search);
            const url = `http://127.0.0.1:8000/expense/?${queryParams}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication failed. Please login again.');
                }
                throw new Error('Failed to fetch expenses');
            }
            
            const data = await response.json();
            
            if (append) {
                setTransactions(prev => [...prev, ...(data.results || [])]);
            } else {
                setTransactions(data.results || []);
            }
            
            setHasNextPage(!!data.next);
            setCurrentPage(page);
            
        } catch (error) {
            console.error('Error fetching expenses:', error);
            Alert.alert('Error', error.message || 'Failed to fetch expenses. Please try again.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
            setRefreshing(false);
        }
    };

    // Initial load
    useEffect(() => {
        fetchCategories();
        fetchTransactions();
    }, []);

    // Handle filter change
    const handleFilterChange = (filter) => {
        setSelectedFilter(filter);
        setCurrentPage(1);
        
        const categoryId = filter === 'All' ? null : categories.find(cat => cat.name === filter)?.id;
        fetchTransactions(1, categoryId, searchQuery);
    };

    // Handle search
    const handleSearch = useCallback((text) => {
        setSearchQuery(text);
        setCurrentPage(1);
        
        const categoryId = selectedFilter === 'All' ? null : categories.find(cat => cat.name === selectedFilter)?.id;
        fetchTransactions(1, categoryId, text);
    }, [selectedFilter, categories]);

    // Load more data (pagination)
    const loadMore = () => {
        if (hasNextPage && !loadingMore) {
            const nextPage = currentPage + 1;
            const categoryId = selectedFilter === 'All' ? null : categories.find(cat => cat.name === selectedFilter)?.id;
            fetchTransactions(nextPage, categoryId, searchQuery, true);
        }
    };

    // Refresh data
    const onRefresh = () => {
        setRefreshing(true);
        setCurrentPage(1);
        const categoryId = selectedFilter === 'All' ? null : categories.find(cat => cat.name === selectedFilter)?.id;
        fetchTransactions(1, categoryId, searchQuery);
    };

    // Format date to readable format
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        
        const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                      day === 2 || day === 22 ? 'nd' :
                      day === 3 || day === 23 ? 'rd' : 'th';
        
        return `${day}${suffix} ${month}, ${year}`;
    };

    // Format amount with currency and negative sign
    const formatAmount = (amount) => {
        const numAmount = parseFloat(amount);
        return `-रू${numAmount.toFixed(0)}`;
    };

    // Calculate total expenses
    const calculateTotal = () => {
        return transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
    };

    // Get filter options
    const getFilterOptions = () => {
        return ['All', ...categories.map(cat => cat.name)];
    };

    if (loading && transactions.length === 0) {
        return (
            <View className="flex-1 bg-gray-100">
                <Header
                    title="Expense History"
                    subtitle="Check all your expenses here"
                />
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#6D28D9" />
                    <Text className="mt-2 text-gray-600">Loading expenses...</Text>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-gray-100">
            <Header
                title="Expense History"
                subtitle="Check all your expenses here"
            />
            
            <ScrollView 
                className="flex-1"
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                onMomentumScrollEnd={(event) => {
                    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
                    const paddingToBottom = 20;
                    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom) {
                        loadMore();
                    }
                }}
            >
                <View className="p-4">
                    {/* Search Bar */}
                    <View className="flex-row items-center rounded-xl p-3 mt-4 bg-white shadow-sm">
                        <MaterialCommunityIcons name="magnify" size={24} color="#9CA3AF" />
                        <TextInput 
                            className="flex-1 ml-2" 
                            placeholder="Search expenses..." 
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                        {searchQuery.length > 0 && (
                            <TouchableOpacity onPress={() => handleSearch('')}>
                                <MaterialCommunityIcons name="close" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        )}
                    </View>

                    {/* Total Expenses */}
                    <View className="p-4 bg-white rounded-xl shadow-sm mt-4 mb-4">
                        <Text className="text-gray-500 text-center">
                            {selectedFilter === 'All' ? 'Total Expenses' : `Total ${selectedFilter} Expenses`}
                        </Text>
                        <Text className="text-red-600 font-bold text-xl text-center mt-1">
                            रू{calculateTotal().toFixed(0)}
                        </Text>
                        <Text className="text-gray-400 text-sm text-center mt-1">
                            {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                        </Text>
                    </View>

                    {/* Filter Buttons */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                        <View className="flex-row space-x-2">
                            {getFilterOptions().map((filter) => (
                                <TouchableOpacity 
                                    key={filter} 
                                    className={`px-4 py-2 rounded-full border ${
                                        selectedFilter === filter 
                                            ? 'border-purple-500 bg-purple-500' 
                                            : 'border-gray-300 bg-white'
                                    }`}
                                    onPress={() => handleFilterChange(filter)}
                                >
                                    <Text className={`text-sm font-medium ${
                                        selectedFilter === filter ? 'text-white' : 'text-gray-700'
                                    }`}>
                                        {filter}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>

                    {/* Section Title */}
                    <Text className="text-lg font-bold text-gray-700 mb-3">
                        {selectedFilter === 'All' ? 'All Expenses' : `${selectedFilter} Expenses`}
                    </Text>
                    
                    {/* Transactions List */}
                    {transactions.length === 0 ? (
                        <View className="flex-1 justify-center items-center mt-12 mb-12">
                            <MaterialCommunityIcons name="receipt-text-outline" size={64} color="#9CA3AF" />
                            <Text className="text-gray-500 mt-4 text-lg">No expenses found</Text>
                            <Text className="text-gray-400 mt-1 text-center">
                                {searchQuery ? 'Try adjusting your search or filters' : 'Start adding your expenses'}
                            </Text>
                        </View>
                    ) : (
                        <>
                            {transactions.map((item) => (
                                <TouchableOpacity 
                                    key={item.id} 
                                    className="flex-row items-center p-4 mb-3 bg-white rounded-2xl shadow-sm active:bg-gray-50"
                                >
                                    <View className="w-12 h-12 rounded-full justify-center items-center bg-purple-100 mr-4">
                                        <MaterialCommunityIcons 
                                            name={item.category.icon || 'help-circle'} 
                                            size={24} 
                                            color="#6D28D9" 
                                        />
                                    </View>
                                    <View className="flex-1">
                                        <Text className="text-lg font-bold text-gray-800 mb-1">
                                            {item.description}
                                        </Text>
                                        <Text className="text-sm text-gray-500">
                                            {item.category.name} • {formatDate(item.date)}
                                        </Text>
                                    </View>
                                    <Text className="text-lg font-bold text-red-600">
                                        {formatAmount(item.amount)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                            
                            {/* Load More Indicator */}
                            {loadingMore && (
                                <View className="py-4 justify-center items-center">
                                    <ActivityIndicator size="small" color="#6D28D9" />
                                    <Text className="text-gray-500 mt-2 text-sm">Loading more...</Text>
                                </View>
                            )}
                            
                            {/* End of Results */}
                            {!hasNextPage && transactions.length > 0 && (
                                <View className="py-6 justify-center items-center">
                                    <Text className="text-gray-400 text-sm">You've reached the end</Text>
                                </View>
                            )}
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default HistoryScreen;