// App
// - Purpose: Application entry point. Sets up React Navigation with Home and Inventory screens.
// - Output: NavigationContainer with stack navigator containing `Home` and `Inventory`.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import StationsScreen from './screens/StationsScreen';
import NearbyScreen from './screens/NearbyScreen';
import FavouritesScreen from './screens/FavouritesScreen';
import RegisterScreen from './screens/RegisterScreen';  

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Stations" component={StationsScreen} options={{ title: 'Stations' }} />
        <Stack.Screen name="Nearby" component={NearbyScreen} options={{ title: 'Nearby' }} />
        <Stack.Screen name="Favourites" component={FavouritesScreen} options={{ title: 'Favourites' }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Create Account' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}