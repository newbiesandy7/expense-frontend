import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import screens and context
import { ThemeProvider } from './src/context/ThemeContext';
import GroupsScreen from './src/screens/GroupsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import HomeScreen from './src/screens/HomeScreen';
import LearnScreen from './src/screens/LearnScreen';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
//Import global CSS for Nativewind
import './global.css';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName;
                    if (route.name === 'Home') {
                        iconName = 'home';
                    } else if (route.name === 'History') {
                        iconName = 'history';
                    } else if (route.name === 'Add') {
                        iconName = 'plus-circle';
                    } else if (route.name === 'Groups') {
                        iconName = 'account-group';
                    } else if (route.name === 'Learn') {
                        iconName = 'book-education';
                    }
                    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#6D28D9',
                tabBarInactiveTintColor: '#A78BFA',
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Add" component={LoginScreen} options={{ tabBarLabel: () => null }} />
            <Tab.Screen name="Groups" component={GroupsScreen} />
            <Tab.Screen name="Learn" component={LearnScreen} />
        </Tab.Navigator>
    );
}

export default function App() {
    return (
          <ThemeProvider>
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Main" component={MainTabs} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
            </Stack.Navigator>
        </NavigationContainer>
        </ThemeProvider>
    );
}