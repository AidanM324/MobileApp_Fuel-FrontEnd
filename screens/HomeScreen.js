import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>⛽ Fuel Price Tracker</Text>
      <Text style={styles.subtitle}>Find the cheapest fuel near you</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Stations')}>
        <Text style={styles.buttonText}>All Stations</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Nearby')}>
        <Text style={styles.buttonText}>📍 Nearby Stations</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.favButton]} onPress={() => navigation.navigate('Favourites')}>
        <Text style={styles.buttonText}>⭐ My Favourites</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  button: { backgroundColor: '#2196F3', padding: 16, borderRadius: 10, marginBottom: 16, alignItems: 'center' },
  favButton: { backgroundColor: '#FF9800' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});