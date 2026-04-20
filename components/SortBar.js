// components/SortBar.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function SortBar({ sortOption, onSortChange }) {
  const options = [
    { label: '⛽ Petrol ↑', value: 'petrol_asc' },
    { label: '⛽ Petrol ↓', value: 'petrol_desc' },
    { label: '🛢 Diesel ↑', value: 'diesel_asc' },
    { label: '🛢 Diesel ↓', value: 'diesel_desc' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Sort by:</Text>
      <View style={styles.buttons}>
        {options.map(option => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.button,
              sortOption === option.value && styles.activeButton
            ]}
            onPress={() => onSortChange(option.value)}
          >
            <Text style={[
              styles.buttonText,
              sortOption === option.value && styles.activeText
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', padding: 10,
    borderRadius: 10, marginBottom: 10, elevation: 2
  },
  label: { fontWeight: '700', marginBottom: 6, color: '#333' },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  button: {
    paddingHorizontal: 10, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1,
    borderColor: '#ddd', backgroundColor: '#f5f5f5'
  },
  activeButton: { backgroundColor: '#2196F3', borderColor: '#2196F3' },
  buttonText: { fontSize: 12, color: '#333' },
  activeText: { color: '#fff', fontWeight: '600' },
});