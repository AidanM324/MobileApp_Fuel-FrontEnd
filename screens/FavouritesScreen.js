import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator,
  StyleSheet, Alert, TouchableOpacity, Linking
} from 'react-native';
import stationApi from '../api/stationApi';
import SortBar from '../components/SortBar';
import { sortStations } from '../hooks/useSortStations';

export default function FavouritesScreen({ token }) {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState(null);

  useEffect(() => {
    if (token) loadFavourites();
  }, [token]);

  const loadFavourites = async () => {
    try {
      setLoading(true);
      const data = await stationApi.getFavourites(token);
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

  const openDirections = (station) => {
    const lat = station.location?.coordinates[1];
    const lng = station.location?.coordinates[0];
    const name = encodeURIComponent(station.name);
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${name}`;
    Linking.openURL(url);
  }; 

  const sortedFavourites = sortStations(favourites, sortOption);

  if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⭐ My Favourite Stations</Text>

      {favourites.length > 0 && (
        <SortBar sortOption={sortOption} onSortChange={setSortOption} />
      )}

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
            <TouchableOpacity
              style={styles.dirButton}
              onPress={() => openDirections(item)}
            >
              <Text style={styles.dirButtonText}>Get Directions</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No favourites yet. Browse stations to add some!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2 },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  address: { color: '#666', marginBottom: 8 },
  prices: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  petrol: { color: '#2196F3', fontWeight: '600' },
  diesel: { color: '#4CAF50', fontWeight: '600' },
  removeButton: { backgroundColor: '#f44336', padding: 10, borderRadius: 8, alignItems: 'center' },
  removeButtonText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#666', marginTop: 40, fontSize: 14 },
  dirButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  dirButtonText: { color: '#fff', fontWeight: '600' },
}); 
