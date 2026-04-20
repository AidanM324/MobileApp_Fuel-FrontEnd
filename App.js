// App
// - Purpose: Application entry point. Sets up React Navigation with Home and Inventory screens.
// - Output: NavigationContainer with stack navigator containing `Home` and `Inventory`.

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import StationsScreen from './screens/StationsScreen';
import NearbyScreen from './screens/NearbyScreen';
import FavouritesScreen from './screens/FavouritesScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState(null);
  const [userName, setUserName] = useState('');

  const handleLogin = (userToken, name) => {
    setToken(userToken);
    setUserName(name);
  };

  const handleLogout = (navigation) => {
    setToken(null);
    setUserName('');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={token ? 'Home' : 'Login'}>

        {/* Auth screens — shown when not logged in */}
        <Stack.Screen
          name="Login"
          options={{ headerShown: false }}
        >
          {props => <LoginScreen {...props} onLogin={handleLogin} />}
        </Stack.Screen>

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Create Account' }}
        />

        {/* Main app screens — shown when logged in */}
        <Stack.Screen
          name="Home"
          options={({ navigation }) => ({
            title: '⛽ Fuel Tracker',
            headerRight: () => (
              <TouchableOpacity onPress={() => handleLogout(navigation)}>
                <Text style={{ color: '#f44336', fontWeight: '600', marginRight: 8 }}>
                  Logout
                </Text>
              </TouchableOpacity>
            ),
          })}
        >
          {props => <HomeScreen {...props} userName={userName} />}
        </Stack.Screen>

        <Stack.Screen
          name="Stations"
          options={({ navigation }) => ({
            title: 'All Stations',
            headerRight: () => (
              <TouchableOpacity onPress={() => handleLogout(navigation)}>
                <Text style={{ color: '#f44336', fontWeight: '600', marginRight: 8 }}>
                  Logout
                </Text>
              </TouchableOpacity>
            ),
          })}
        >
          {props => <StationsScreen {...props} token={token} />}
        </Stack.Screen>

        <Stack.Screen
          name="Nearby"
          options={({ navigation }) => ({
            title: 'Nearby Stations',
            headerRight: () => (
              <TouchableOpacity onPress={() => handleLogout(navigation)}>
                <Text style={{ color: '#f44336', fontWeight: '600', marginRight: 8 }}>
                  Logout
                </Text>
              </TouchableOpacity>
            ),
          })}
          component={NearbyScreen}
        />

        <Stack.Screen
          name="Favourites"
          options={({ navigation }) => ({
            title: 'My Favourites',
            headerRight: () => (
              <TouchableOpacity onPress={() => handleLogout(navigation)}>
                <Text style={{ color: '#f44336', fontWeight: '600', marginRight: 8 }}>
                  Logout
                </Text>
              </TouchableOpacity>
            ),
          })}
        >
          {props => <FavouritesScreen {...props} token={token} />}
        </Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}