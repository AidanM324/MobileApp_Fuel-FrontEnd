import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const IRISH_COUNTIES = [
  'All Counties',
  'Antrim', 'Armagh', 'Carlow', 'Cavan', 'Clare',
  'Cork', 'Derry', 'Donegal', 'Down', 'Dublin',
  'Fermanagh', 'Galway', 'Kerry', 'Kildare', 'Kilkenny',
  'Laois', 'Leitrim', 'Limerick', 'Longford', 'Louth',
  'Mayo', 'Meath', 'Monaghan', 'Offaly', 'Roscommon',
  'Sligo', 'Tipperary', 'Tyrone', 'Waterford', 'Westmeath',
  'Wexford', 'Wicklow'
];

export default function CountyPicker({ selectedCounty, onCountyChange }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Filter by county:</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedCounty}
          onValueChange={onCountyChange}
          style={styles.picker}
          dropdownIconColor="#2196F3"
        >
          {IRISH_COUNTIES.map(county => (
            <Picker.Item key={county} label={county} value={county} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff', padding: 12,
    borderRadius: 10, marginBottom: 10, elevation: 2
  },
  label: { fontWeight: '700', fontSize: 13, color: '#333', marginBottom: 4 },
  pickerWrapper: {
    borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8, overflow: 'hidden',
    backgroundColor: '#f9f9f9'
  },
  picker: { height: Platform.OS === 'ios' ? 150 : 48 },
});