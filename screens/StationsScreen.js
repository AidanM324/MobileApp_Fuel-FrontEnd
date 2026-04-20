import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, ActivityIndicator,
  StyleSheet, Alert, TouchableOpacity, Linking
} from 'react-native';
import stationApi from '../api/stationApi';
import { sendFavouriteNotification, requestNotificationPermission } from '../hooks/useNotifications';
import { initDB, cacheStations, getCachedStations } from '../hooks/useStationCache';
import SortBar from '../components/SortBar';
import { sortStations } from '../hooks/useSortStations';
import CountyPicker from '../components/CountyPicker';

export default function StationsScreen({ token }) {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [sortOption, setSortOption] = useState(null);
  const [selectedCounty, setSelectedCounty] = useState('All Counties');

  useEffect(() => {
    initDB();
    fetchStations();
    requestNotificationPermission();
  }, []);

  const fetchStations = async () => {
    try {
      setLoading(true);
      setIsOffline(false);

      const cached = getCachedStations();
      if (cached.length > 0) {
        setStations(cached);
        setLoading(false);
      }

      try {
        const data = await stationApi.getAllStations();
        setStations(data);
        cacheStations(data);
      } catch (apiErr) {
        if (cached.length > 0) {
          setIsOffline(true);
        } else {
          Alert.alert('No Connection', 'Could not load stations and no cached data available.');
        }
      }
    } catch (err) {
      Alert.alert('Error', String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleFavourite = (stationId, stationName) => {
    saveFavourite(stationId, stationName, token);
  };

  const saveFavourite = async (stationId, stationName, authToken) => {
    try {
      await stationApi.addFavourite(stationId, authToken);
      await sendFavouriteNotification(stationName);
      Alert.alert('⭐ Saved!', 'Station added to your favourites');
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
  }

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
      <TouchableOpacity
        style={styles.dirButton}
        onPress={() => openDirections(item)}
      >
        <Text style={styles.dirButtonText}>Get Directions</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading && stations.length === 0) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  }

  const sortedStations = sortStations(stations, sortOption);

  const filteredStations = selectedCounty === 'All Counties'
    ? sortedStations
    : sortedStations.filter(s =>
        s.address?.toLowerCase().includes(selectedCounty.toLowerCase())
      );

  return (
    <View style={styles.container}>
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>📴 Offline — showing cached data</Text>
        </View>
      )}

      {token && (
        <View style={styles.loggedInBar}>
          <Text style={styles.loggedInText}>✅ Logged in — tap ⭐ to save favourites</Text>
        </View>
      )}

      <CountyPicker
        selectedCounty={selectedCounty}
        onCountyChange={setSelectedCounty}
      />

      <SortBar sortOption={sortOption} onSortChange={setSortOption} />

      <FlatList
        data={filteredStations}
        keyExtractor={(item) => item._id}
        renderItem={renderStation}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {selectedCounty === 'All Counties'
              ? 'No stations found.'
              : `No stations found in ${selectedCounty}.`}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: '#f5f5f5' },
  offlineBanner: { backgroundColor: '#FF5722', padding: 10, borderRadius: 8, marginBottom: 8 },
  offlineText: { color: '#fff', textAlign: 'center', fontWeight: '600' },
  loggedInBar: { backgroundColor: '#E8F5E9', padding: 10, borderRadius: 8, marginBottom: 8 },
  loggedInText: { color: '#2E7D32', textAlign: 'center', fontWeight: '600' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2 },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  address: { color: '#666', marginBottom: 8 },
  prices: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  petrol: { color: '#2196F3', fontWeight: '600' },
  diesel: { color: '#4CAF50', fontWeight: '600' },
  favButton: { backgroundColor: '#FF9800', padding: 10, borderRadius: 8, alignItems: 'center' },
  favButtonText: { color: '#fff', fontWeight: '600' },
  dirButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 8, alignItems: 'center', marginTop: 8 },
  dirButtonText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#666', marginTop: 40 },
});