import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import authApi from '../api/authApi';

export default function LoginScreen({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return Alert.alert('Validation', 'Please enter email and password');
    }
    try {
      setLoading(true);
      const data = await authApi.login(email, password);
      onLogin(data.token, data.user.name);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err) {
      Alert.alert('Login Failed', 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>⛽ Fuel Tracker</Text>
      <Text style={styles.subtitle}>Find the cheapest fuel near you</Text>

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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 32, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#666', textAlign: 'center', marginBottom: 40, fontSize: 16 },
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
});