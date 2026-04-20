import React, { useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator,
  StyleSheet, Alert, TouchableOpacity, TextInput
} from 'react-native';
import authApi from '../api/authApi';
import stationApi from '../api/stationApi';
import SortBar from '../components/SortBar';
import { sortStations } from '../hooks/useSortStations';

export default function FavouritesScreen({ navigation }) {
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortOption, setSortOption] = useState(null);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return Alert.alert('Validation', 'Please enter email and password');
    }
    try {
      setLoading(true);
      const data = await authApi.login(email, password);
      setToken(data.token);
      Alert.alert('Welcome back!', `Logged in as ${data.user.name}`);
      loadFavourites(data.token);
    } catch (err) {
      Alert.alert('Login Error', String(err));
    } finally {
      setLoading(false);
    }
  };

  const loadFavourites = async (authToken) => {
    try {
      setLoading(true);
      const data = await stationApi.getFavourites(authToken);
      setFavourites(data);
    } catch (err) {
      Alert.alert('Error', String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (stationId) => {
    try {
      await stationApi.removeFavourite(stationId, token);
      setFavourites(prev => prev.filter(s => s._id !== stationId));
      Alert.alert('Removed', 'Station removed from favourites');
    } catch (err) {
      Alert.alert('Error', String(err));
    }
  };

  if (!token) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>⭐ My Favourites</Text>
        <Text style={styles.subtitle}>Login to view your saved stations</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.registerButton]}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sortedFavourites = sortStations(favourites, sortOption);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⭐ My Favourite Stations</Text>

      {favourites.length > 0 && (
        <SortBar sortOption={sortOption} onSortChange={setSortOption} />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" />
      ) : (
        <FlatList
          data={sortedFavourites}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.address}>{item.address}</Text>
              <View style={styles.prices}>
                <Text style={styles.petrol}>⛽ Petrol: €{item.prices?.petrol ?? 'N/A'}</Text>
                <Text style={styles.diesel}>🛢 Diesel: €{item.prices?.diesel ?? 'N/A'}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemove(item._id)}
              >
                <Text style={styles.removeButtonText}>🗑 Remove Favourite</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.empty}>No favourites yet. Browse stations to add some!</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#666', textAlign: 'center', marginBottom: 24 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8, padding: 12, marginBottom: 12
  },
  button: {
    backgroundColor: '#2196F3', padding: 14,
    borderRadius: 8, alignItems: 'center', marginBottom: 12
  },
  registerButton: { backgroundColor: '#4CAF50' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2 },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  address: { color: '#666', marginBottom: 8 },
  prices: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  petrol: { color: '#2196F3', fontWeight: '600' },
  diesel: { color: '#4CAF50', fontWeight: '600' },
  removeButton: { backgroundColor: '#f44336', padding: 10, borderRadius: 8, alignItems: 'center' },
  removeButtonText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#666', marginTop: 40, fontSize: 14 },
});