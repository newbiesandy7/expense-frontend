import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomHeader from '../components/CustomHeader';

const SetBudgetGoal = () => {
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSaveBudget = async () => {
    if (!budget || isNaN(budget) || Number(budget) <= 0) {
      Alert.alert('Invalid Input', 'Please enter a valid budget amount.');
      return;
    }
    setLoading(true);
    try {
      await AsyncStorage.setItem('budget_goal', budget);
      Alert.alert('Success', 'Budget goal saved!');
      setBudget('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save budget goal.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      <CustomHeader title="Set Budget Goal" showBackButton={true} />
      <View className="flex-1 justify-center items-center px-6">
        <View className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-sm">
          <Text className="text-2xl font-bold text-purple-700 mb-4 text-center">Set Your Monthly Budget</Text>
          <TextInput
            className="w-full px-4 py-3 rounded-xl border border-gray-300 mb-4 text-lg"
            placeholder="Enter budget amount"
            keyboardType="numeric"
            value={budget}
            onChangeText={setBudget}
          />
          <TouchableOpacity
            className="w-full bg-blue-600 py-4 rounded-xl items-center"
            onPress={handleSaveBudget}
            disabled={loading}
          >
            <Text className="text-white text-lg font-bold">{loading ? 'Saving...' : 'Save Budget'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SetBudgetGoal;
