import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Text, TouchableOpacity, View } from 'react-native';

const Header = ({ title, subtitle, showProfileIcon = true, showBackButton = false }) => {
    const navigation = useNavigation();

    return (
        <View className="px-6 pt-12 pb-4 bg-white shadow-sm flex-row items-center justify-between">
            <View className="flex-row items-center">
                {showBackButton && (
                    <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#6D28D9" />
                    </TouchableOpacity>
                )}
                <View>
                    <Text className="text-3xl font-bold text-purple-700">{title}</Text>
                    {subtitle && <Text className="text-gray-500 mt-1">{subtitle}</Text>}
                </View>
            </View>
            {showProfileIcon && (
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <View className="w-12 h-12 rounded-full bg-purple-200 justify-center items-center">
                        <Text className="text-xl font-bold text-purple-700">A</Text>
                    </View>
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Header;