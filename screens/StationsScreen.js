import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator,
  StyleSheet, Alert, TouchableOpacity, TextInput
} from 'react-native';
import stationApi from '../api/stationApi';
import authApi from '../api/authApi';
import { requestNotificationPermission, sendFavouriteNotification } from '../hooks/useNotifications';

export default function StationsScreen() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [pendingFavId, setPendingFavId] = useState(null);
  const [pendingFavName, setPendingFavName] = useState(null);

  useEffect(() => {
    fetchStations();
    requestNotificationPermission(); // ask for notification permission on load
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      const data = await stationApi.getAllStations();
      setStations(data);
    } catch (err) {
      Alert.alert('Error', String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFavourite = (stationId, stationName) => {
    // If not logged in, show login form and remember which station they wanted
    if (!token) {
      setPendingFavId(stationId);
      setPendingFavName(stationName);
      setShowLogin(true);
      return;
    }
    saveFavourite(stationId, stationName, token);
  };

  const saveFavourite = async (stationId, stationName, authToken) => {
    try {
      await stationApi.addFavourite(stationId, authToken);
      await sendFavouriteNotification(stationName); // 🔔 send notification
      Alert.alert('⭐ Saved!', 'Station added to your favourites');
    } catch (err) {
      Alert.alert('Error', String(err));
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return Alert.alert('Validation', 'Please enter email and password');
    }
    try {
      const data = await authApi.login(email, password);
      setToken(data.token);
      setShowLogin(false);
      Alert.alert('Logged in!', `Welcome ${data.user.name}`);

      // Save the pending favourite if there was one
      if (pendingFavId) {
        saveFavourite(pendingFavId, pendingFavName, data.token);
        setPendingFavId(null);
        setPendingFavName(null);
      }
    } catch (err) {
      Alert.alert('Login Error', String(err));
    }
  };

  const renderStation = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.address}>{item.address}</Text>
      <View style={styles.prices}>
        <Text style={styles.petrol}>⛽ Petrol: €{item.prices?.petrol ?? 'N/A'}</Text>
        <Text style={styles.diesel}>🛢 Diesel: €{item.prices?.diesel ?? 'N/A'}</Text>
      </View>
      <TouchableOpacity
        style={styles.favButton}
        onPress={() => handleFavourite(item._id, item.name)}
      >
        <Text style={styles.favButtonText}>⭐ Save as Favourite</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>

      {/* Login popup when user tries to favourite without being logged in */}
      {showLogin && (
        <View style={styles.loginBox}>
          <Text style={styles.loginTitle}>Login to save favourites</Text>
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
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowLogin(false)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Show logged in status */}
      {token && (
        <View style={styles.loggedInBar}>
          <Text style={styles.loggedInText}>✅ Logged in — tap ⭐ to save favourites</Text>
        </View>
      )}

      <FlatList
        data={stations}
        keyExtractor={(item) => item._id}
        renderItem={renderStation}
        ListEmptyComponent={<Text style={styles.empty}>No stations found.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2 },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  address: { color: '#666', marginBottom: 8 },
  prices: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  petrol: { color: '#2196F3', fontWeight: '600' },
  diesel: { color: '#4CAF50', fontWeight: '600' },
  favButton: { backgroundColor: '#FF9800', padding: 10, borderRadius: 8, alignItems: 'center' },
  favButtonText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#666', marginTop: 40 },
  loginBox: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 4 },
  loginTitle: { fontWeight: '700', fontSize: 16, marginBottom: 12, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 8 },
  loginButton: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, alignItems: 'center' },
  loginButtonText: { color: '#fff', fontWeight: '600' },
  cancelText: { textAlign: 'center', color: '#666', marginTop: 10 },
  loggedInBar: { backgroundColor: '#E8F5E9', padding: 10, borderRadius: 8, marginBottom: 8 },
  loggedInText: { color: '#2E7D32', textAlign: 'center', fontWeight: '600' },
});