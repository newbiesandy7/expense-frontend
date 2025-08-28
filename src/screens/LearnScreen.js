import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, LayoutAnimation, Linking, Platform, ScrollView, Text, TouchableOpacity, UIManager, View } from 'react-native';
import Header from '../components/Header';
import { ThemeContext } from '../context/ThemeContext';
import { learnContent } from '../data/learnContent'; // Import the new data file

if (
    Platform.OS === 'android' &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

const LearnScreen = () => {
    const { colors, isDarkMode } = useContext(ThemeContext);
    const [expandedFAQ, setExpandedFAQ] = useState(null);
    const [content, setContent] = useState({ blogs: [], videos: [], faqs: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate an API call with a delay
        const fetchContent = () => {
            setTimeout(() => {
                setContent(learnContent);
                setIsLoading(false);
            }, 1000); // 1-second delay
        };

        fetchContent();
    }, []);

    const toggleFAQ = (id) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setExpandedFAQ(expandedFAQ === id ? null : id);
    };

    const handlePressLink = (url) => {
        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
    };

    const containerStyle = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';
    const cardBgColor = isDarkMode ? 'bg-gray-700' : 'bg-white';
    const textStyle = isDarkMode ? 'text-white' : 'text-gray-900';
    const subtextStyle = isDarkMode ? 'text-gray-400' : 'text-gray-600';

    if (isLoading) {
        return (
            <View className={`flex-1 justify-center items-center ${containerStyle}`}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text className={`mt-4 text-lg ${textStyle}`}>Loading content...</Text>
            </View>
        );
    }

    return (
        <ScrollView className={`flex-1 ${containerStyle}`}>
            <Header title="Financial Literacy" showBackButton={false} />
            <View className="p-6">
                {/* Financial Blogs Section */}
                <Text className={`text-xl font-bold ${textStyle} mb-4`}>Financial Health Blogs</Text>
                {content.blogs.map(blog => (
                    <TouchableOpacity
                        key={blog.id}
                        className={`${cardBgColor} p-4 rounded-xl mb-4 shadow-sm flex-row items-center`}
                        onPress={() => handlePressLink(blog.link)}
                    >
                        <MaterialCommunityIcons name={blog.icon} size={32} color={colors.primary} />
                        <View className="ml-4 flex-1">
                            <Text className={`text-lg font-semibold ${textStyle}`}>{blog.title}</Text>
                            <Text className={`text-sm ${subtextStyle}`}>{blog.summary}</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* Videos Section */}
                <View className="h-6" />
                <Text className={`text-xl font-bold ${textStyle} mb-4`}>Videos to Watch</Text>
                {content.videos.map(video => (
                    <TouchableOpacity
                        key={video.id}
                        className={`${cardBgColor} p-4 rounded-xl mb-4 shadow-sm flex-row items-center`}
                        onPress={() => handlePressLink(video.link)}
                    >
                        <MaterialCommunityIcons name={video.icon} size={32} color="#FF0000" />
                        <View className="ml-4 flex-1">
                            <Text className={`text-lg font-semibold ${textStyle}`}>{video.title}</Text>
                        </View>
                    </TouchableOpacity>
                ))}

                {/* FAQ Section */}
                <View className="h-6" />
                <Text className={`text-xl font-bold ${textStyle} mb-4`}>FAQs about Finance</Text>
                {content.faqs.map(faq => (
                    <View key={faq.id} className={`${cardBgColor} p-4 rounded-xl mb-4 shadow-sm`}>
                        <TouchableOpacity
                            onPress={() => toggleFAQ(faq.id)}
                            className="flex-row justify-between items-center"
                        >
                            <Text className={`text-lg font-semibold flex-1 ${textStyle}`}>
                                {faq.question}
                            </Text>
                            <MaterialCommunityIcons
                                name={expandedFAQ === faq.id ? 'chevron-up' : 'chevron-down'}
                                size={24}
                                color={colors.subtext}
                            />
                        </TouchableOpacity>
                        {expandedFAQ === faq.id && (
                            <Text className={`mt-2 ${subtextStyle}`}>
                                {faq.answer}
                            </Text>
                        )}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default LearnScreen;