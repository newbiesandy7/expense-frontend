import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import { Dimensions, ScrollView, Text, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit'; // Import PieChart
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeContext'; // Import ThemeContext

const HomeScreen = () => {
    const dummyData = {
        totalBalance: 'रू42,550',
        income: 'रू45,000',
        expenses: 'रू12,450',
        expenseAnalysis: [
            { category: 'Food', amount: 4500, color: '#6D28D9', legendFontColor: '#7F7F7F', legendFontSize: 15 },
            { category: 'Transport', amount: 2800, color: '#EF4444', legendFontColor: '#7F7F7F', legendFontSize: 15 },
            { category: 'Entertainment', amount: 1800, color: '#10B981', legendFontColor: '#7F7F7F', legendFontSize: 15 },
            { category: 'Bills', amount: 2200, color: '#FCD34D', legendFontColor: '#7F7F7F', legendFontSize: 15 },
            { category: 'Shopping', amount: 1150, color: '#F59E0B', legendFontColor: '#7F7F7F', legendFontSize: 15 },
        ],
    };

    const { isDarkMode } = useContext(ThemeContext);

    const screenWidth = Dimensions.get("window").width;

    // Data for the pie chart
    const pieChartData = dummyData.expenseAnalysis.map(item => ({
        name: item.category,
        amount: item.amount,
        color: item.color,
        legendFontColor: isDarkMode ? '#FFFFFF' : '#7F7F7F',
        legendFontSize: 14,
    }));

    const chartConfig = {
        backgroundGradientFrom: "#1E2923",
        backgroundGradientFromOpacity: 0,
        backgroundGradientTo: "#08130D",
        backgroundGradientToOpacity: 0,
        color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false
    };

    const containerStyle = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';

    return (
        <ScrollView className={`flex-1 ${containerStyle}`}>
            <Header title="Welcome back, Alex" subtitle="Good Morning!" />
            <View className="p-6">
                <View className="bg-purple-700 rounded-3xl p-6 mb-6 shadow-md">
                    <Text className="text-white text-base font-medium opacity-80">Total Balance</Text>
                    <Text className="text-white text-4xl font-bold mt-1">{dummyData.totalBalance}</Text>
                    <View className="flex-row items-center mt-2">
                        <MaterialCommunityIcons name="chart-line" size={16} color="white" />
                        <Text className="text-white text-sm opacity-80 ml-1"> +12.5% from last month</Text>
                    </View>
                </View>

                <View className="flex-row justify-between mb-6">
                    <View className="bg-white rounded-2xl p-4 w-[48%] shadow-sm">
                        <Text className="text-gray-500 font-medium">Income</Text>
                        <View className="flex-row items-center justify-between mt-1">
                            <Text className="text-lg font-bold text-green-600">{dummyData.income}</Text>
                            <MaterialCommunityIcons name="arrow-up-circle-outline" size={32} color="#10B981" />
                        </View>
                    </View>
                    <View className="bg-white rounded-2xl p-4 w-[48%] shadow-sm">
                        <Text className="text-gray-500 font-medium">Expenses</Text>
                        <View className="flex-row items-center justify-between mt-1">
                            <Text className="text-lg font-bold text-red-600">{dummyData.expenses}</Text>
                            <MaterialCommunityIcons name="arrow-down-circle-outline" size={32} color="#EF4444" />
                        </View>
                    </View>
                </View>

                {/* Pie Chart Section */}
                <View className="bg-white rounded-2xl p-6 shadow-sm mb-6">
                    <Text className="text-lg font-bold text-gray-700 mb-4">Expense Analysis</Text>
                    <PieChart
                        data={pieChartData}
                        width={screenWidth - 48}
                        height={220}
                        chartConfig={chartConfig}
                        accessor={"amount"}
                        backgroundColor={"transparent"}
                        paddingLeft={"15"}
                        center={[10, 0]}
                        absolute
                    />
                </View>

                {/* Expense Analysis Section (from previous version) - You can choose to keep this or remove it. */}
                <View className="bg-white rounded-2xl p-6 shadow-sm">
                    <Text className="text-lg font-bold text-gray-700 mb-4">Expense Breakdown</Text>
                    <View className="flex-row flex-wrap">
                        {dummyData.expenseAnalysis.map((item, index) => (
                            <View key={index} className="flex-row items-center w-1/2 mb-2">
                                <View style={{ backgroundColor: item.color }} className="w-2 h-2 rounded-full mr-2" />
                                <Text className="text-sm text-gray-600">{item.category} <Text className="font-bold">{item.amount}</Text></Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default HomeScreen;