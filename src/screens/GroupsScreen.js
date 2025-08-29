import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';

const GroupScreen = () => {
  const { authData } = useContext(AuthContext);
  const { colors, isDarkMode } = useContext(ThemeContext);
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);

  // State for modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/expense/groups/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setGroups(data);
      } else {
        Alert.alert('Error', data.detail || 'Failed to fetch groups.');
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    setMembersLoading(true);
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.10:8000/auth/list/', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (response.ok) {
        setMembers(data);
      } else {
        Alert.alert('Error', data.detail || 'Failed to fetch members.');
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    } finally {
      setMembersLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert('Invalid Name', 'Group name cannot be empty.');
      return;
    }

    setIsCreatingGroup(true);

    const memberIds = [
      ...(Array.isArray(selectedMembers) ? selectedMembers.filter(id => id != null) : []),
      authData && authData.id ? authData.id : null
    ].filter(id => id != null);

    const groupData = {
      name: newGroupName,
      member_ids: memberIds,
    };

    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/expense/groups/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
      });

      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Group created successfully!');
        setModalVisible(false);
        setNewGroupName('');
        setSelectedMembers([]);
        fetchGroups();
      } else {
        Alert.alert('Error', data.detail || 'Failed to create group.');
      }
    } catch (error) {
      console.error('Network error:', error);
      Alert.alert('Network Error', 'Could not connect to the server.');
    } finally {
      setIsCreatingGroup(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const renderGroupItem = ({ item }) => (
    <TouchableOpacity
      className={`p-4 mb-4 rounded-lg flex-row items-center ${isDarkMode ? 'bg-gray-700' : 'bg-white shadow'}`}
      onPress={() => navigation.navigate('GroupDetails', { groupId: item.id, groupName: item.name })}
    >
      <View className={`w-12 h-12 rounded-full justify-center items-center ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}>
        <MaterialCommunityIcons name="account-group" size={24} color={colors.primary} />
      </View>
      <View className="ml-4 flex-1">
        <Text className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.name}</Text>
        <Text className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.members.length} members</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className={`flex-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <Header title="Groups" showBackButton={false} showProfileIcon={true} />

      <View className="p-6 flex-1">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderGroupItem}
            ListEmptyComponent={() => (
              <View className="flex-1 justify-center items-center">
                <Text className={`text-center text-lg mt-10 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  You are not a member of any group yet.
                </Text>
              </View>
            )}
            contentContainerStyle={{ flexGrow: 1 }}
          />
        )}
      </View>

      <TouchableOpacity
        className="absolute bottom-6 right-6 bg-purple-700 w-16 h-16 rounded-full items-center justify-center shadow-lg"
        onPress={() => {
          setModalVisible(true);
          fetchMembers();
        }}
      >
        <MaterialCommunityIcons name="plus" size={30} color="#fff" />
      </TouchableOpacity>

      {/* The Modal Component */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className={`w-11/12 p-6 rounded-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <Text className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create New Group</Text>
            
            <TextInput
              className={`w-full p-4 mb-4 rounded-lg text-lg ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
              placeholder="Group Name"
              placeholderTextColor={isDarkMode ? '#9CA3AF' : '#6B7280'}
              value={newGroupName}
              onChangeText={setNewGroupName}
            />

            <Text className={`text-md font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Select Members</Text>
            {membersLoading ? (
              <ActivityIndicator size="small" color={colors.primary} className="my-4" />
            ) : (
              <ScrollView className="max-h-48 mb-4 border rounded-lg p-2" style={{ borderColor: isDarkMode ? '#4B5563' : '#E5E7EB' }}>
                {(Array.isArray(members) ? members : []).filter(m => m.id !== authData.id).map(member => (
                  <TouchableOpacity
                    key={member.id}
                    onPress={() => {
                      setSelectedMembers(prev => 
                        prev.includes(member.id) 
                          ? prev.filter(id => id !== member.id)
                          : [...prev, member.id]
                      );
                    }}
                    className={`flex-row items-center p-2 rounded-lg my-1 ${selectedMembers.includes(member.id) ? 'bg-purple-200' : ''}`}
                  >
                    <MaterialCommunityIcons
                      name={selectedMembers.includes(member.id) ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                      size={20}
                      color={selectedMembers.includes(member.id) ? colors.primary : (isDarkMode ? '#9CA3AF' : '#6B7280')}
                    />
                    <Text className={`ml-2 text-md ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{member.username}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <TouchableOpacity
              className="w-full bg-purple-700 py-4 rounded-full items-center mb-2"
              onPress={handleCreateGroup}
              disabled={isCreatingGroup}
            >
              {isCreatingGroup ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-white text-lg font-bold">Create</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="w-full py-4 rounded-full items-center"
              onPress={() => setModalVisible(false)}
            >
              <Text className={`text-lg font-bold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default GroupScreen;