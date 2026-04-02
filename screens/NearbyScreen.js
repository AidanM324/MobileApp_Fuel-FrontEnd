import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import stationApi from '../api/stationApi';

export default function NearbyScreen() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lat, setLat] = useState('53.3498');
  const [lng, setLng] = useState('-6.2603');

  const searchNearby = async () => {
    try {
      setLoading(true);
      const data = await stationApi.getNearbyStations(lat, lng);
      setStations(data);
      if (data.length === 0) Alert.alert('No stations found nearby');
    } catch (err) {
      Alert.alert('Error', String(err));
    } finally {
      setLoading(false);
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
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput style={styles.input} placeholder="Latitude" value={lat} onChangeText={setLat} keyboardType="numeric" />
        <TextInput style={styles.input} placeholder="Longitude" value={lng} onChangeText={setLng} keyboardType="numeric" />
        <TouchableOpacity style={styles.button} onPress={searchNearby}>
          <Text style={styles.buttonText}>Search Nearby</Text>
        </TouchableOpacity>
      </View>

      {loading ? <ActivityIndicator size="large" /> : (
        <FlatList
          data={stations}
          keyExtractor={(item) => item._id}
          renderItem={renderStation}
          ListEmptyComponent={<Text style={styles.empty}>Search for nearby stations above.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#f5f5f5' },
  searchBox: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 8 },
  button: { backgroundColor: '#2196F3', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2 },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  address: { color: '#666', marginBottom: 8 },
  prices: { flexDirection: 'row', justifyContent: 'space-between' },
  petrol: { color: '#2196F3', fontWeight: '600' },
  diesel: { color: '#4CAF50', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#666', marginTop: 40 },
});