import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList, Linking, Text, TouchableOpacity, View } from 'react-native';
import Header from '../components/Header';

const financialContent = [
    {
        id: '1',
        type: 'Video',
        title: 'How to Budget Like a Pro',
        source: 'The Financial Diet',
        duration: '10 min',
        url: 'https://www.youtube.com/watch?v=zYKJdzyAviE',
        icon: 'youtube',
    },
    {
        id: '2',
        type: 'Video',
        title: 'Building Your Investment Portfolio',
        source: 'The Money Guy Show',
        duration: '15 min',
        url: 'https://www.youtube.com/watch?v=wz3Ea74_p9k',
        icon: 'youtube',
    },
    {
        id: '3',
        type: 'Blog Post',
        title: 'The 50/30/20 Budget Rule Explained',
        source: 'NerdWallet Blog',
        duration: '6 min read',
        url: 'https://www.nerdwallet.com/article/finance/how-to-build-a-budget',
        icon: 'file-document',
    },
    {
        id: '4',
        type: 'Video',
        title: 'Understanding Compound Interest',
        source: 'Khan Academy',
        duration: '8 min',
        url: 'https://www.youtube.com/watch?v=5_9W68OjJkY',
        icon: 'youtube',
    },
    {
        id: '5',
        type: 'Blog Post',
        title: 'Smart Ways to Save Money Daily',
        source: 'Investopedia',
        duration: '5 min read',
        url: 'https://www.investopedia.com/articles/pf/08/everyday-money-saving-tips.asp',
        icon: 'file-document',
    },
];

const LearnScreen = () => {
    const handlePress = (url) => {
        if (url) {
            Linking.openURL(url);
        }
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            onPress={() => handlePress(item.url)}
            className="p-4 mb-3 bg-white rounded-2xl shadow-sm flex-row items-center"
        >
            <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color={item.source.includes('YouTube') || item.source.includes('Khan Academy') ? 'red' : '#6D28D9'}
            />
            <View className="ml-4 flex-1">
                <Text className="text-lg font-bold text-gray-800">{item.title}</Text>
                <Text className="text-gray-500 mt-1">{item.source} • {item.duration}</Text>
            </View>
            <MaterialCommunityIcons name="arrow-right-circle" size={24} color="#6D28D9" />
        </TouchableOpacity>
    );

    return (
        <View className="flex-1 bg-gray-100">
            <Header
                title="Financial Literacy"
                subtitle="Expand your financial knowledge"
            />
            <FlatList
                data={financialContent}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={{ padding: 16 }}
                ListHeaderComponent={
                    <View className="p-6 mb-6 bg-white rounded-2xl shadow-sm">
                        <Text className="text-lg font-bold text-gray-700">Learning Progress</Text>
                        <Text className="text-sm text-gray-500">You've completed 2 of 5 topics</Text>
                        <View className="w-full h-2 rounded-full bg-gray-200 mt-4">
                            <View className="w-2/5 h-2 rounded-full bg-purple-700" />
                        </View>
                    </View>
                }
            />
        </View>
    );
};

export default LearnScreen;