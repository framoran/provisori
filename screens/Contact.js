import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import strings_de from '../utils/strings-de';
import strings_fr from '../utils/strings-fr';

const ContactForm = () => {

  const [strings, setStrings] = useState(false);

  useEffect(() => {

    checkLang();

  }, []);

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

  const handleEmailPress = () => {
  Linking.openURL('mailto:mail@provisori.com');
};

const handleFacebookPress = () => {
  Linking.openURL('https://www.facebook.com/provisoriGAME');
};

const handleInstagramPress = () => {
  Linking.openURL('https://www.instagram.com/provisori_media/');
};

const handleLinkedinPress = () => {
  Linking.openURL('https://www.linkedin.com/company/provisori/');
};

const CustomEmailButton = ({title, onPress, icon}) => (
  <TouchableOpacity style={styles.emailButton} onPress={onPress}>
    <FontAwesome name={icon} size={24} color="#fff" style={{alignSelf: 'center', alignItems: 'center'}} />
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

const CustomButton = ({title, onPress, icon}) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <FontAwesome name={icon} size={24} color="#fff" style={{alignSelf: 'center', alignItems: 'center'}} />
    <Text style={styles.buttonText}>{title}</Text>
  </TouchableOpacity>
);

return (
  <View style={styles.container}>
    <Text style={styles.title}>{strings.contact_us}</Text>
    <View style={styles.infoContainer}>
      <Text style={styles.infoText}>Email: mail@provisori.com</Text>
      <CustomEmailButton title="Envoyer un email" onPress={handleEmailPress} icon="envelope" />
    </View>
    <Text style={styles.title}>{strings.follow}</Text>
    <View style={styles.socialContainer}>
      <CustomButton onPress={handleFacebookPress} style={styles.socialElements} icon="facebook-square" />
      <CustomButton onPress={handleInstagramPress} icon="instagram" />
      <CustomButton onPress={handleLinkedinPress} icon="linkedin-square" />
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#fff',
padding: 20,
alignItems: 'center',
justifyContent: 'center',
},
title: {
fontWeight: 'bold',
fontSize: 24,
textAlign: 'center',
marginBottom: 30,
color: '#2b2d42',
},
infoContainer: {
alignItems: 'center',
marginBottom: 30,
},
infoText: {
fontSize: 17,
marginBottom: 20,
color: '#2b2d42',
fontWeight: 'bold',
},
socialContainer: {
flexDirection: 'row',
justifyContent: 'space-between',
width: '70%',
marginBottom: 50,
},
socialElements:{
  alignSelf: 'center'
},
emailButton: {
backgroundColor: '#46b1c8',
borderRadius: 5,
paddingVertical: 15,
paddingHorizontal: 20,
alignItems: 'center',
marginBottom: 20,
flexDirection: 'row',
},
button: {
backgroundColor: '#46b1c8',
borderRadius: 5,
paddingVertical: 15,
paddingLeft: 20,
paddingHorizontal: 10,
alignItems: 'center',
marginBottom: 20,
flexDirection: 'row',
},
buttonText: {
color: '#fff',
fontWeight: 'bold',
fontSize: 17,
marginLeft: 10,
},
footerText: {
position: 'absolute',
bottom: 0,
marginBottom: 20,
fontSize: 12,
color: '#2b2d42',
},
});

export default ContactForm;
