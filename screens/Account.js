import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, TouchableOpacity, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

// Import translations
import strings_de from '../utils/strings-de';
import strings_fr from '../utils/strings-fr';

// Import api.js from the model folder
import api from '../model/api';

const AccountScreen = () => {
  const [totPoints, setTotPoints] = useState(0);
  const [username, setUsername] = useState('');
  const [repCor, setRepCor] = useState(0);
  const [nbEssais, setNbEssais] = useState(0);
  const [msg, setMsg] = useState('');
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(false);
  const [strings, setStrings] = useState(false);
  const [getLang, setLang] = useState('fr');
  const [email, setEmail] = useState('');

  const handleDeleteAccount = async () => {
    Alert.alert(
      strings.confirm,
      strings.confirm_text,
      [
        {text: 'Annuler', style: 'cancel'},
        {text: 'Continuer', style: 'destructive', onPress: () => deleteAccount()},
      ],
    );
  };

  // this function is called here and not in api.js because of navigation logic
  async function deleteAccount() {

    Linking.openURL('mailto:mail@provisori.com');

  }

  const fetchData = async () => {
    try {
      const accountData = await api.account();

      if (accountData.username) setUsername(accountData.username);
      if (accountData.nb_rep) setRepCor(accountData.nb_rep);
      if (accountData.nb_tentatives) setNbEssais(accountData.nb_tentatives);
      if (accountData.nb_points) setTotPoints(accountData.nb_points);
      if (accountData.email) setEmail(accountData.email);

      console.log('data fecthed !!!!', accountData)

    } catch (error) {
      console.error(error);
    }
  };

  const checkLang = async () => {
    try {
      let lang = await AsyncStorage.getItem('lang');
      let selectedStrings = lang === 'de' ? strings_de : strings_fr;
      setLang(lang);
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

    // refresh screen when it is loaded
    const unsubscribe = navigation.addListener('focus', async () => {
      // Fetch data and update state here
      setRefresh(!refresh); // Toggle refresh state to force component to re-render
    });

    fetchData();

    checkLang();

    email_check = AsyncStorage.getItem('email');

    if (email_check == '') {
      navigation.navigate('LoginScreen');
    }

  }, [refresh]);

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.title}>Account</Text>
        <View style={styles.item}>
          <Ionicons name="md-star" size={24} color="#46b1c8" />
          <Text style={styles.list}>{strings.nb_points}: {totPoints}</Text>
        </View>
        <View style={styles.item}>
          <Ionicons name="md-timer" size={24} color="#46b1c8" />
          <Text style={styles.list}>{strings.nb_tentatives}: {nbEssais}</Text>
        </View>
        <View style={styles.item}>
          <Ionicons name="md-calendar" size={24} color="#46b1c8" />
          <Text style={styles.list}>{strings.nb_rep}: {repCor}</Text>
        </View>
        <View style={styles.item}>
          <Ionicons name="md-mail" size={24} color="#46b1c8" />
          <Text style={styles.list}>Email: { email }</Text>
        </View>
        <View style={styles.item}>
          <Ionicons name="md-person" size={24} color="#46b1c8" />
          <Text style={styles.list}>{strings.util}: {username}</Text>
        </View>
        <TouchableOpacity onPress={handleDeleteAccount} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>{strings.delete}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#46b1c81A',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#46b1c81A',
  },
  title:{
    marginTop: 25,
    marginBottom: 25,
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
  list:{
    fontWeight: 'bold',
    fontSize: 17,
    marginLeft: 15,
    marginRight: 25,
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: '#873e58',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 35,
    marginBottom: 35,
    alignSelf: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AccountScreen;
