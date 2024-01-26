import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAvoidingView, Platform } from 'react-native';

// Import translations
import strings_de from '../utils/strings-de';
import strings_fr from '../utils/strings-fr';

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [last_name, setLast_name] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorText, setErrorText] = useState('');
  const isFocused = useIsFocused();
  const [buttonOpacity, setButtonOpacity] = useState(0);
  const [strings, setStrings] = useState(false);

  const handleRegistration = async () => {
    // Vérifier que tous les champs sont remplis
    if (!name || !last_name || !email || !password || !username) {
      setErrorText("Tous les champs sont requis.");
      return;
    }
    // Vérifier que l'email est bien formaté
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      setErrorText("Veuillez entrer une adresse email valide.");
      return;
    }
    try {
      const response = await fetch('https://provisori.com/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          last_name,
          username,
          email,
          password,
        }),
      });
      const data = await response.json();
      console.log(data);
      // Handle success
      if (data.success)
      {
        await AsyncStorage.setItem('email', email);
        await AsyncStorage.setItem('name', `${name}`);

        let email_check = await AsyncStorage.getItem('email');
        console.log('emaiiiiiiiiiiiil', email_check)

         // Set a timeout before navigating
         setTimeout(() => {

          // if email is empty -> retry all operation in 1 second
          if (email_check ==  null){

            // retry
            AsyncStorage.setItem('email', email);
            
            setTimeout(() => {

              navigation.navigate('HomeScreen');
             
            }, 1000); // 1000 milliseconds delay
    
            
          }else{

            navigation.navigate('HomeScreen');

          }

        }, 1000); // 1000 milliseconds delay

        // if email has not been set retry in 1 second
        

      }else {
        setErrorText(data.error)
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const checkLang = async () => {
    try {
      let lang = await AsyncStorage.getItem('lang');
      let selectedStrings = lang === 'de' ? strings_de : strings_fr;
      if (!selectedStrings) {
        await AsyncStorage.setItem('lang', 'fr');
        selectedStrings = strings_de;
      }
      setStrings(selectedStrings);
    } catch (error) {
      console.log(error); // Log the error for debugging purposes
    }

  };

  useEffect(() => {

    checkLang();

    const checkLogin = async () => {
      try {
        const value = await AsyncStorage.getItem('email');
        if (value !== null) {
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
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
    
      <View style={styles.container}>
        <Text style={styles.title}>{strings.register}</Text>
        <TextInput
          style={styles.input}
          placeholder={strings.firstname}
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder={strings.name}
          value={last_name}
          onChangeText={setLast_name}
        />
        <TextInput
          style={styles.input}
          placeholder={strings.username}
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder={strings.password}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        {errorText !== '' &&
          <Text style={styles.errorText}>* {errorText}</Text>
        }
        <TouchableOpacity style={[styles.button, { opacity: buttonOpacity }]} onPress={handleRegistration}>
          <Text style={styles.buttonText}>{strings.register}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.link}>{strings.register_link_login_text}</Text>
        </TouchableOpacity>

      </View>
    </KeyboardAvoidingView>
    );
  }
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#FFF',
      paddingHorizontal:20
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 30,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
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
    errorText: {
      marginTop: 10,
      marginBottom: 10,
      color: 'red',
      fontSize: 16,
      textAlign: 'center',
    },
  });
