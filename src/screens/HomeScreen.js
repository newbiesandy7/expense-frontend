import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const HomeScreen = () => {
    const { isDarkMode, colors } = useContext(ThemeContext);
    const { userName } = useContext(AuthContext);
    const screenWidth = Dimensions.get("window").width;

    const [isLoading, setIsLoading] = useState(true);
    const [financeData, setFinanceData] = useState({
        totalBalance: '0',
        income: '0',
        expenses: '0',
        dailyExpenses: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                data: [0, 0, 0, 0, 0, 0, 0]
            }]
        },
        expenseBreakdown: [],
    });

    const chartConfig = {
        backgroundGradientFrom: colors.card,
        backgroundGradientTo: colors.card,
        color: (opacity = 1) => colors.primary,
        barPercentage: 0.5,
        fillShadowGradient: colors.primary,
        fillShadowGradientOpacity: 1,
        propsForBackgroundLines: {
            strokeDasharray: "",
            stroke: isDarkMode ? colors.subtext : colors.background,
        },
        decimalPlaces: 0,
        labelColor: (opacity = 1) => isDarkMode ? colors.text : colors.subtext,
    };

    const fetchFinancialData = async () => {
        setIsLoading(true);
        const dataUrl = 'http://YOUR_LOCAL_IP:8000/api/financial-summary/';
        
        try {
            const accessToken = await AsyncStorage.getItem('access_token');
            const response = await fetch(dataUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (response.ok) {
                setFinanceData({
                    totalBalance: `रू${data.total_balance}`,
                    income: `रू${data.total_income}`,
                    expenses: `रू${data.total_expenses}`,
                    dailyExpenses: {
                        labels: data.daily_expenses.map(item => item.day_of_week),
                        datasets: [{
                            data: data.daily_expenses.map(item => item.total_amount)
                        }]
                    },
                    expenseBreakdown: data.expense_breakdown.map(item => ({
                        name: item.category_name,
                        amount: item.total_amount,
                        color: item.color,
                    })),
                });
            } else {
                console.error("Failed to fetch data:", data.detail);
            }
        } catch (error) {
            console.error('Network error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFinancialData();
    }, []);

    if (isLoading) {
        return (
            <View className={`flex-1 justify-center items-center ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text className={`mt-4 text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Loading financial data...</Text>
            </View>
        );
    }

    const { dailyExpenses, expenseBreakdown } = financeData;
    const hasDailyData = dailyExpenses.datasets[0].data.some(d => d > 0);
    const hasBreakdownData = expenseBreakdown.length > 0;

    return (
        <ScrollView className={`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <Header
                title={`Hello, ${userName || 'User'}`}
                subtitle="Welcome back!"
                userName={userName}
            />
            <View className="p-6">
                <View className="bg-purple-700 rounded-3xl p-6 mb-6 shadow-md">
                    <Text className="text-white text-base font-medium opacity-80">Total Balance</Text>
                    <Text className="text-white text-4xl font-bold mt-1">{financeData.totalBalance}</Text>
                    <View className="flex-row items-center mt-2">
                        <MaterialCommunityIcons name="chart-line" size={16} color="white" />
                        <Text className="text-white text-sm opacity-80 ml-1"> +12.5% from last month</Text>
                    </View>
                </View>

                <View className="flex-row justify-between mb-6">
                    <View className={`${colors.card} rounded-2xl p-4 w-[48%] shadow-sm`}>
                        <Text className="text-gray-500 font-medium">Income</Text>
                        <View className="flex-row items-center justify-between mt-1">
                            <Text className="text-lg font-bold text-green-600">{financeData.income}</Text>
                            <MaterialCommunityIcons name="arrow-up-circle-outline" size={32} color="#10B981" />
                        </View>
                    </View>
                    <View className={`${colors.card} rounded-2xl p-4 w-[48%] shadow-sm`}>
                        <Text className="text-gray-500 font-medium">Expenses</Text>
                        <View className="flex-row items-center justify-between mt-1">
                            <Text className="text-lg font-bold text-red-600">{financeData.expenses}</Text>
                            <MaterialCommunityIcons name="arrow-down-circle-outline" size={32} color="#EF4444" />
                        </View>
                    </View>
                </View>

                {/* Bar Chart Section */}
                <View className={`${colors.card} rounded-2xl p-6 shadow-sm mb-6`}>
                    <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-700'} mb-4`}>Daily Spending</Text>
                    {hasDailyData ? (
                        <BarChart
                            style={{ borderRadius: 16 }}
                            data={dailyExpenses}
                            width={screenWidth - 48}
                            height={220}
                            yAxisLabel="रू"
                            chartConfig={chartConfig}
                            fromZero={true}
                            showBarTops={false}
                        />
                    ) : (
                        <Text className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No daily spending data to display.</Text>
                    )}
                </View>

                {/* Expense Breakdown Section */}
                <View className={`${colors.card} rounded-2xl p-6 shadow-sm`}>
                    <Text className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-700'} mb-4`}>Expense Breakdown</Text>
                    {hasBreakdownData ? (
                        <View className="flex-row flex-wrap">
                            {expenseBreakdown.map((item, index) => (
                                <View key={index} className="flex-row items-center w-1/2 mb-2">
                                    <View style={{ backgroundColor: item.color }} className="w-2 h-2 rounded-full mr-2" />
                                    <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{item.name} <Text className="font-bold">रू{item.amount}</Text></Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>No expense data available.</Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
};

export default HomeScreen;