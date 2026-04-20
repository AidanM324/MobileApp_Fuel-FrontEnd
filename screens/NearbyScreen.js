import React, { useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator,
  StyleSheet, Alert, TouchableOpacity, Linking
} from 'react-native';
import * as Location from 'expo-location';
import stationApi from '../api/stationApi';
import SortBar from '../components/SortBar';
import { sortStations } from '../hooks/useSortStations';

export default function NearbyScreen() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationText, setLocationText] = useState('');
  const [sortOption, setSortOption] = useState(null);

  const searchNearby = async () => {
    try {
      setLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Please enable location permissions in your phone settings.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setLocationText(`📍 ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
      const data = await stationApi.getNearbyStations(latitude, longitude);
      setStations(data);
      if (data.length === 0) {
        Alert.alert('No Stations Found', 'No fuel stations found within 5km of your location.');
      }
    } catch (err) {
      Alert.alert('Error', String(err));
    } finally {
      setLoading(false);
    }
  };

  const openDirections = (station) => {
    const lat = station.location?.coordinates[1];
    const lng = station.location?.coordinates[0];
    const name = encodeURIComponent(station.name);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${name}`;
    Linking.openURL(url);
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
        style={styles.dirButton}
        onPress={() => openDirections(item)}
      >
        <Text style={styles.dirButtonText}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  );

  const sortedStations = sortStations(stations, sortOption);

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <Text style={styles.searchTitle}>Find Stations Near You</Text>
        <TouchableOpacity style={styles.button} onPress={searchNearby}>
          <Text style={styles.buttonText}>📍 Use My Location</Text>
        </TouchableOpacity>
        {locationText ? (
          <Text style={styles.locationText}>{locationText}</Text>
        ) : null}
      </View>

      {stations.length > 0 && (
        <SortBar sortOption={sortOption} onSortChange={setSortOption} />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#2196F3" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={sortedStations}
          keyExtractor={(item) => item._id}
          renderItem={renderStation}
          ListEmptyComponent={
            <Text style={styles.empty}>
              Tap "Use My Location" to find nearby stations.
            </Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#f5f5f5' },
  searchBox: {
    backgroundColor: '#fff', padding: 16,
    borderRadius: 10, marginBottom: 12, elevation: 2
  },
  searchTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  button: { backgroundColor: '#2196F3', padding: 14, borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  locationText: { textAlign: 'center', color: '#666', marginTop: 8, fontSize: 12 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2 },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  address: { color: '#666', marginBottom: 8 },
  prices: { flexDirection: 'row', justifyContent: 'space-between' },
  petrol: { color: '#2196F3', fontWeight: '600' },
  diesel: { color: '#4CAF50', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#666', marginTop: 40, fontSize: 14 },
  dirButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  dirButtonText: { color: '#fff', fontWeight: '600' },
});