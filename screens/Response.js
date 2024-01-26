import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

// Import translations
import strings_de from '../utils/strings-de';
import strings_fr from '../utils/strings-fr';

const ResponsesScreen = () => {
  const [data, setData] = useState([]);
  const [strings, setStrings] = useState('fr');
  const [getLang, setLang] = useState('fr');

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://provisori.com/api/responses');
      const jsonData = await response.json();
      setData(jsonData);
    };

    checkLang();

    fetchData();
  }, []);

  const checkLang = async () => {
    try {
      let lang = await AsyncStorage.getItem('lang');
      let selectedStrings = lang === 'de' ? strings_de : strings_fr;
      if (lang != null) {
        setLang(lang);
      } else {
        setLang('fr');
      }
      if (!selectedStrings) {
        await AsyncStorage.setItem('lang', 'fr');
        selectedStrings = strings_de;
      }
      setStrings(selectedStrings);
    } catch (error) {
      console.log(error); // Log the error for debugging purposes
    }
  };

  const fetchData = async () => {
    const response = await fetch('https://provisori.com/api/responses');
    const jsonData = await response.json();
    setData(jsonData);
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.date}>{item.date}</Text>
        {getLang === 'fr' ? (
          <>
            <Text style={styles.question}>{item.question}</Text>
            <Text style={styles.response}>{item.response}</Text>
          </>
        ) : (
          <>
            {item.question_de === null ? (
              <Text style={styles.question}>{item.question}</Text>
            ) : (
              <Text style={styles.question}>{item.question_de}</Text>
            )}
            {item.response_de === null ? (
              <Text style={styles.response}>{item.response}</Text>
            ) : (
              <Text style={styles.response}>{item.response_de}</Text>
            )}
          </>
        )}
      </View>
    );
  };

  useFocusEffect(() => {
    // This function will be called when the screen gains focus
    fetchData();
  });

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>{strings.responses}</Text>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  item: {
    backgroundColor: '#46b1c81A',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#46b1c81A',
  },
  date: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  question: {
    fontStyle: 'italic',
    marginBottom: 5,
  },
  title: {
    marginTop: 25,
    marginBottom: 25,
    fontWeight: 'bold',
    fontSize: 24,
    textAlign: 'center',
  },
  response: {
    fontWeight: 'bold',
  },
});

export default ResponsesScreen;
