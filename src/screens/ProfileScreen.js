import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext } from 'react';
import { ScrollView, Switch, Text, View, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeContext';

const ProfileScreen = ({ navigation }) => {
    const user = {
        name: 'Alex Johnson',
        email: 'alex.johnson@email.com',
        netWorth: 'रू48,766',
        daysStreak: 45,
        totalTransactions: 234,
        categoriesUsed: 12,
        groupsJoined: 3,
        daysActive: 45,
    };

    const { isDarkMode, toggleTheme } = useContext(ThemeContext);

    const containerStyle = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';
    const cardBgColor = isDarkMode ? 'bg-gray-700' : 'bg-white';
    const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
    const subtextColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
    const iconColor = isDarkMode ? 'yellow' : 'gray';

    // Logout function
    const handleLogout = async () => {
  if (typeof window !== 'undefined') {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (!confirmLogout) return;

    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Profile' }], // or 'Login'
    });
  } else {
    // Native behavior for mobile
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('access_token');
          await AsyncStorage.removeItem('refresh_token');
          navigation.reset({
            index: 0,
            routes: [{ name: 'Profile' }],
          });
        },
      },
    ]);
  }
};

    return (
        <ScrollView className={`flex-1 ${containerStyle}`}>
            <Header
                title="Profile"
                subtitle="Your personal dashboard"
                showProfileIcon={false}
                showBackButton={true}
            />
            <View className="p-6">
                {/* User Info */}
                <View className={`${cardBgColor} rounded-3xl p-6 mb-6 shadow-md items-center`}>
                    <View className="w-24 h-24 rounded-full bg-purple-200 justify-center items-center mb-4">
                        <Text className="text-4xl font-bold text-purple-700">A</Text>
                    </View>
                    <Text className={`text-2xl font-bold ${textStyle}`}>{user.name}</Text>
                    <Text className={`text-sm ${subtextColor}`}>{user.email}</Text>
                    <View className="bg-yellow-400 rounded-full px-3 py-1 mt-2">
                        <Text className="text-xs font-bold text-white">Premium Member</Text>
                    </View>
                </View>

                {/* Activity Cards */}
                <View className="flex-row justify-between mb-6">
                    <View className={`flex-1 p-4 rounded-3xl ${cardBgColor} mr-2 shadow-sm items-center`}>
                        <Text className="text-2xl font-bold text-purple-700">{user.netWorth}</Text>
                        <Text className="text-sm text-gray-500 mt-1">Net Worth</Text>
                    </View>
                    <View className={`flex-1 p-4 rounded-3xl ${cardBgColor} ml-2 shadow-sm items-center`}>
                        <Text className="text-2xl font-bold text-purple-700">{user.daysStreak}</Text>
                        <Text className="text-sm text-gray-500 mt-1">Days Streak</Text>
                    </View>
                </View>

                {/* Appearance */}
                <Text className={`text-lg font-bold ${textStyle} mb-4`}>Appearance</Text>
                <View className={`flex-row justify-between items-center p-4 rounded-xl ${cardBgColor} shadow-sm mb-6`}>
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons name="lightbulb" size={24} color={iconColor} />
                        <Text className={`text-lg font-medium ml-4 ${textStyle}`}>Light mode</Text>
                    </View>
                    <Switch value={isDarkMode} onValueChange={toggleTheme} trackColor={{ false: "#E5E7EB", true: "#8B5CF6" }} thumbColor={isDarkMode ? "#F9FAFB" : "#F3F4F6"} />
                </View>

                {/* Your Activity */}
                <Text className={`text-lg font-bold ${textStyle} mb-4`}>Your Activity</Text>
                <View className="flex-row flex-wrap justify-between">
                    <View className={`w-[48%] p-4 ${cardBgColor} rounded-2xl shadow-sm mb-4 items-center`}>
                        <Text className="text-lg font-bold text-purple-700">{user.totalTransactions}</Text>
                        <Text className="text-sm text-gray-500 mt-1 text-center">Total Transactions</Text>
                    </View>
                    <View className={`w-[48%] p-4 ${cardBgColor} rounded-2xl shadow-sm mb-4 items-center`}>
                        <Text className="text-lg font-bold text-purple-700">{user.categoriesUsed}</Text>
                        <Text className="text-sm text-gray-500 mt-1 text-center">Categories Used</Text>
                    </View>
                    <View className={`w-[48%] p-4 ${cardBgColor} rounded-2xl shadow-sm mb-4 items-center`}>
                        <Text className="text-lg font-bold text-purple-700">{user.groupsJoined}</Text>
                        <Text className="text-sm text-gray-500 mt-1 text-center">Groups Joined</Text>
                    </View>
                    <View className={`w-[48%] p-4 ${cardBgColor} rounded-2xl shadow-sm mb-4 items-center`}>
                        <Text className="text-lg font-bold text-purple-700">{user.daysActive}</Text>
                        <Text className="text-sm text-gray-500 mt-1 text-center">Days Active</Text>
                    </View>
                </View>

                {/* Logout Button */}
                <TouchableOpacity
                    className="w-full bg-red-500 py-4 rounded-xl mt-6"
                    onPress={handleLogout}
                >
                    <Text className="text-white text-center font-bold">Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ProfileScreen;
