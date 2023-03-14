import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import api.js from the model folder
import api from '../model/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const isFocused = useIsFocused();
  const [buttonOpacity, setButtonOpacity] = useState(0);

  const handleLogin = async () => {
    console.log('Logging in with email', email, 'and password', password);
    try {
      const response = await api.login(email, password);
      console.log("test"+response.success);

      if (response.success) { // Check if the success property is truthy
        await AsyncStorage.setItem('email', email);
        navigation.navigate('HomeScreen');
      } else {
        setErrorMessage('Email ou mot de passe incorrect');
      }
    } catch (error) {
      console.error(error);
      // handle error here
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const email = await api.getEmail();
        if (email !== null) {
          // email is present, navigate to HomeScreen
          navigation.navigate('HomeScreen');
        }
      } catch (error) {
        // Error retrieving data
      }
    };

    if (isFocused) {
      checkLogin();
    }
  }, [isFocused, navigation]);

  useEffect(() => {
    setButtonOpacity(1);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Se connecter</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage !== '' && <Text style={styles.error}>{errorMessage}</Text>}
      <TouchableOpacity style={[styles.button, { opacity: buttonOpacity }]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Pas encore de compte ? S'enregister</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    //backgroundColor: '#FFF5EE',
    paddingHorizontal: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 4,
    width: '80%',
    marginBottom: 20,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 4,
    padding: 10,
    width: '80%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    marginTop: 20,
    color: '#000',
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});
