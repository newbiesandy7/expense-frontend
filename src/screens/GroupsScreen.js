import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';

const dummyGroups = [
    { id: '1', name: 'Trip to Manali', members: 4, expenses: 'रू15,000', yourShare: 'रू3,750' },
    { id: '2', name: 'Roommates', members: 3, expenses: 'रू8,500', yourShare: 'रू2,833' },
];

const GroupsScreen = () => {
    return (
        <ScrollView className="flex-1 bg-gray-100">
            <Header
                title="Group Expenses"
                subtitle="Manage shared expenses with friends"
            />
            <View className="p-6">
                <View className="flex-row justify-between mb-6">
                    <View className="flex-1 p-4 bg-red-100 rounded-2xl mr-2">
                        <Text className="text-gray-500">You Owe</Text>
                        <Text className="text-red-600 font-bold mt-1">रू1,500</Text>
                    </View>
                    <View className="flex-1 p-4 bg-green-100 rounded-2xl ml-2">
                        <Text className="text-gray-500">You're Owed</Text>
                        <Text className="text-green-600 font-bold mt-1">रू500</Text>
                    </View>
                </View>

                <TouchableOpacity className="flex-row items-center justify-center p-4 mb-6 bg-purple-700 rounded-2xl shadow-md">
                    <MaterialCommunityIcons name="plus-circle-outline" size={24} color="white" />
                    <Text className="text-white font-bold text-lg ml-2">Create New Group</Text>
                </TouchableOpacity>

                <Text className="text-lg font-bold text-gray-700 mb-4">Your Groups</Text>
                {dummyGroups.map((group) => (
                    <View key={group.id} className="p-4 mb-3 bg-white rounded-2xl shadow-sm">
                        <Text className="text-xl font-bold text-gray-800">{group.name}</Text>
                        <View className="flex-row items-center mt-2">
                            <MaterialCommunityIcons name="account-group" size={20} color="#6D28D9" />
                            <Text className="ml-2 text-gray-500">{group.members} members</Text>
                        </View>
                        <View className="flex-row items-center justify-between mt-2">
                            <View>
                                <Text className="text-sm text-gray-500">Total Expenses</Text>
                                <Text className="text-lg font-bold text-gray-700">{group.expenses}</Text>
                            </View>
                            <View>
                                <Text className="text-sm text-gray-500">Your Share</Text>
                                <Text className="text-lg font-bold text-purple-700">{group.yourShare}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default GroupsScreen;