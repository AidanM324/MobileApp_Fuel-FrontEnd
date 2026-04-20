import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import authApi from '../api/authApi';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      return Alert.alert('Validation', 'All fields are required');
    }
    if (password.length < 6) {
      return Alert.alert('Validation', 'Password must be at least 6 characters');
    }
    try {
      setLoading(true);
      const data = await authApi.signup(name, email, password);
      Alert.alert('Account Created!', `Welcome ${data.user.name}! Please log in.`);
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Registration Error', String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to save your favourite stations</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />
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
        placeholder="Password (min 6 characters)"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Register'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLink}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: '#f5f5f5' },
  title: { fontSize: 26, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#666', textAlign: 'center', marginBottom: 32 },
  input: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd',
    borderRadius: 8, padding: 12, marginBottom: 12
  },
  button: {
    backgroundColor: '#2196F3', padding: 14,
    borderRadius: 8, alignItems: 'center', marginTop: 8
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  loginLink: { textAlign: 'center', color: '#2196F3', marginTop: 20, fontSize: 14 },
});