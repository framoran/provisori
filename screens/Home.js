import React, { useState, useEffect } from 'react';
import { Alert, Linking, ScrollView, View, Text, Image, TextInput, Button, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfettiCannon from 'react-native-confetti-cannon';
import Spinner from 'react-native-spinkit';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
// Import api.js from the model folder
import api from '../model/api';
import { Dimensions } from 'react-native';

// Import iap-manager
import iapManager from '../model/iap-manager';

const EnigmaView = () => {
  const [answer, setAnswer] = useState('');
  const [hintPurchased, setHintPurchased] = useState('');
  const [hintEmail, setEmail] = useState(false);
  const [showResponse, setShowResponse] = useState(false);
  const [getMessage, setMessage] = useState('');
  const [animatedValue, setAnimatedValue] = useState(new Animated.Value(0));
  const [isLoading, setIsLoading] = useState(false);
  const [getHint, setHint] = useState('');
  const [getHintElement, setHintElement] = useState('');
  const [response, setResponse] = useState('...');
  const [name, setName] = useState('');
  const [enigme, setEnigme] = useState('');
  const [enigmeDisplay, setEnigmeDisplay] = useState('display_none');
  const [points, setPoints] = useState('Loading ...');
  const [totPoints, setTotPoints] = useState('');
  const [msg, setMsg] = useState('Connexion au serveur ...');
  const [hintVisible, setHintVisible] = useState(false);
  const navigation = useNavigation();
  const [refresh, setRefresh] = useState(false);
  const [winnerPopup, setWinnerPopup] = useState(false);
  const [winnerUsername, setWinnerUsername] = useState(false);
  const [winnerPrice, setwinnerPrice] = useState(false);
  const [winnerPriceURL, setwinnerPriceURL] = useState(false);
  const [price, setPrice] = useState('');
  const [priceURL, setPriceURL] = useState('');
  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = await AsyncStorage.getItem('email');
        const name = await AsyncStorage.getItem('name');
        setResponse('');
        if (email !== null) {
        }
        if (name !== null) {
          setName(name);
        }
        const gameData = await api.game(email);

        if (gameData.msg) {
          setMsg(gameData.msg);
        }

        if (gameData.status) {
          setEnigmeDisplay(gameData.status);
        }

        console.log('status2 ' +enigmeDisplay)

        //setEnigmeDisplay('not_found')
        if (gameData.popup_winner) {
          const winnerPriceLink = `${gameData.winnerPriceUrl}`;
          Alert.alert(
            'Le gagnant a été tiré au sort !\n',
            `Le joueur ${gameData.winner_username} remporte `,
            [
              {
                text: 'OK',
                onPress: () => console.log('OK Pressed'),
              },
              {
                text: gameData.winner_price,
                onPress: () => Linking.openURL(gameData.winner_price_url),
              },

            ],
            {
              cancelable: false,
              style: 'large',
              contentContainerStyle: { alignItems: 'center' },
              titleStyle: { fontSize: 24 },
              messageStyle: { fontSize: 19 },
              buttonStyle: { height: 60, justifyContent: 'center' },
              buttonTextStyle: { fontSize: 19 },
            }
          );
        }

        if (gameData.question) {
          setEnigme(gameData.question);
        }

        if (gameData.tot_points) {
          setTotPoints(gameData.tot_points);
        }

        if (gameData.response) {
          setResponse(gameData.response);
        }

        if (gameData.price) {
          setPrice(gameData.price);
        }

        if (gameData.price_url) {
          setPriceURL(gameData.price_url);
        }

        if (gameData.status == 'show_response'){
          setMessage("Réponse à l'énigme du jour = " +response)
          console.log('ENIGMEEEEEE')
        }
        // init hint
        setHintPurchased(false)
        setHintElement('');
        setHintVisible(false);
        setHint('');

        if (gameData.hint) {
          setHintPurchased(true);
          setHint(gameData.hint);
          setHintElement('L\'indice du jour = ')
          setHintVisible(true);
        }

        if (gameData.points) {
          setPoints(gameData.points);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      setRefresh(refresh => !refresh); // toggle the refresh state to trigger a re-render
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };
  }, [refresh]); // add refresh to the dependency array

  const checkAnswer = async () => {
    setMessage('');
    setIsLoading(true);

    // Vérifie la réponse de l'utilisateur ici
    if (api.getEmail() !== null) {
      const email2 = await AsyncStorage.getItem('email');
      const response = await api.checkResponse(answer, email2);
      if (response.status === 'success') {
        setShowResponse(true);
        setIsLoading(false);
        setMessage('');
      } else if(response.status === 'not_loggued'){

          await AsyncStorage.setItem('name', '');
          await AsyncStorage.setItem('email', '');
          Alert.alert(
            'Vous devez être connecté pour jouer au jeu',
            '',
            [
              {
                text: 'Annuler',
                onPress: () => console.log('Annuler Pressed'),
                style: 'cancel',
              },
              {
                text: 'Connectez-vous',
                onPress: () => navigation.navigate('LoginScreen'),
              },
            ],
            { cancelable: false },
          );
      }else {
        setResponse('...');
        // anime le texte et affiche la réponse
        Animated.sequence([
          Animated.timing(animatedValue, { toValue: 100, duration: 500, useNativeDriver: true }),
          Animated.timing(animatedValue, { toValue: -100, duration: 500, useNativeDriver: true }),
          Animated.timing(animatedValue, { toValue: 100, duration: 500, useNativeDriver: true }),
          Animated.timing(animatedValue, { toValue: 0, duration: 500, useNativeDriver: true })
        ]).start(() => {
          if (response.error !== null){
            setMessage(response.error)
          }else{
            setMessage(getRandomErrorMessage)
          }
          setIsLoading(false);
          setResponse('');
        });
      }
    } else {
      // affiche une boîte d'alerte
      Alert.alert(
        'Vous devez être connecté pour jouer au jeu',
        '',
        [
          {
            text: 'Annuler',
            onPress: () => console.log('Annuler Pressed'),
            style: 'cancel',
          },
          {
            text: 'Connectez-vous',
            onPress: () => navigation.navigate('LoginScreen'),
          },
        ],
        { cancelable: false },
      );
      setIsLoading(false);
    }
  };

  const getRandomErrorMessage = () => {
    const messages = [
      "T'es sérieux là",
      "Essaie encore !",
      "On sait que tu peux y arriver !"
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const purchaseHint = async () => {
    console.log('init')
    await iapManager.buyProduct();
    await iapManager.consumeProducts();

    await api.setHint();
    setRefresh(refresh => !refresh); // toggle the refresh state to trigger a re-render

  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {enigmeDisplay !== 'not_loggued' ? (
          <View>
            <Text style={styles.text_points}>
              <Ionicons name="ribbon" type="font-awesome" color="#873e58" size={24} />
                <Text> Points {totPoints}</Text>
            </Text>
            <View style={styles.box}>
              {enigmeDisplay !== 'display_none' ? (
                enigmeDisplay === 'not_found' ? (
                  <Text style={styles.boxText}> Vous jouez pour {points} points !</Text>
                ) : (
                  <>
                    {enigmeDisplay === 'has_found' && (
                      <>
                        <Text style={styles.boxTextHasFound}> Vous avez trouvé la réponse ! </Text>
                      </>
                    )}
                    {enigmeDisplay === 'show_response' && (
                      <Text style={styles.boxText}> La réponse à l'énigme </Text>
                    )}
                  </>
                )
              ) : (
                <Text style={styles.boxText}> Pas d'énigme pour le moment </Text>
              )}
            </View>
          </View>
        ) : (
          <TouchableOpacity style={styles.title_right} onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.title_right}>
              <Ionicons name="person-outline" type="font-awesome" color="#000" size={24} />
              Se connecter
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.paddingEnigme}>
          <Text style={styles.title}>Énigme</Text>
          {enigmeDisplay !== 'display_none' ? (
            <>
              <View style={styles.enigmaContainer}>
                <Text style={styles.enigmaText}>{enigme}</Text>
              </View>
              {enigmeDisplay !== 'has_found' && enigmeDisplay !== 'display_none' ? (
                <>

                {enigmeDisplay !== 'show_response' && (
                  <View style={styles.answerContainer}>
                    <TextInput
                      style={styles.answerInput}
                      onChangeText={setAnswer}
                      value={answer}
                      placeholder="Réponse"
                      placeholderTextColor="#000"
                    />
                    <TouchableOpacity style={styles.hintButton} onPress={checkAnswer}>
                      <Text style={styles.checkAnswerButton}>
                        <Ionicons name="send-outline" type="font-awesome" color="#fff" size={15} />
                      </Text>
                    </TouchableOpacity>
                  </View>
                  )}
                  {!hintPurchased && enigmeDisplay !== 'show_response' && (
                    <TouchableOpacity style={styles.hintButton} onPress={purchaseHint}>
                      <AntDesign name="questioncircle" size={24} color="#fff" />
                      <Text style={styles.hintButtonText}>Indice ?</Text>
                    </TouchableOpacity>
                  )}
                  <View style={styles.enigmaContainer}>
                    <Text style={[styles.indiceText, { marginTop: 0, fontStyle: 'italic', display: hintVisible ? 'flex' : 'none' }]}>{getHintElement} {getHint}</Text>
                  </View>
                  {showResponse}
                  <Animated.View style={{ transform: [{ translateX: animatedValue }] }}>
                    <Text style={[styles.errorMessage, {marginTop: 0, fontStyle: 'italic'}]}>{getMessage} {response}</Text>
                  </Animated.View>
                </>
              ) : (
                <Text style={styles.responseDisplay}>Réponse: {response}</Text>
              )}
            </>
          ) : (
            <Text style={[styles.title_sm, {fontStyle: 'italic'}]}>{msg}</Text>
          )}

        </View>

        <Text style={styles.priceButton}>
         <AntDesign name="star" size={24} color="gold" />
         <AntDesign name="star" size={24} color="gold" />
         <AntDesign name="star" size={24} color="gold" />
         <Text style={styles.priceText}>   Prix   </Text>
         <AntDesign name="star" size={24} color="gold" />
         <AntDesign name="star" size={24} color="gold" />
         <AntDesign name="star" size={24} color="gold" />
        </Text>

        {price !== '' && priceURL !== '' ? (
          <>
            <Image source={{ uri: priceURL }} style={styles.image} />
            <Text style={styles.text}>Vous jouez pour une {price}</Text>
          </>
        ) : (
          <Text style={styles.text_bottom}>Aucun prix disponible pour le moment !</Text>
        )}

      </View>
    </ScrollView>

  );
};

const styles = StyleSheet.create({

  box: {
    backgroundColor: '#873e58',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    borderWidth: 3,
    borderColor: '#873e58',
    width: '100%',
    marginTop: 10,
    padding: 10,
    paddingRight: 0,
    paddingLeft: 0,
    textAlign: 'center'
  },
  boxText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 0,
    textAlign: 'center',
    width: '100%'
  },
  boxTextHasFound: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 0,
    textAlign: 'center',
    width: '100%'
  },
  checkAnswerButton: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#FFF',
    paddingHorizontal: 35,
    paddingVertical: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 30,
    marginTop: 25,
    marginLeft:0,
    alignSelf: 'center',
  },
  title_nm: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 15,
    marginBottom: 10,
    alignSelf: 'center',
  },
  title_sm: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 40,
    marginTop: 5,
    alignSelf: 'flex-start',
    textAlign: 'left'
  },
  title_right: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-end',
  },
  text_points: {
    fontSize: 17,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    color: '#873e58',
    borderColor: '#fff',
    borderRadius: 10,
    borderWidth: 2,
    borderRadius: 5,
    marginTop: 15,
    marginBottom: 10,
    width: '100%',
    paddingRight: 0,
    paddingLeft: 0,
    margin: 0
  },
  text_bottom: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    textAlign: 'left',
    alignSelf: 'flex-start', // add this line
    width: '100%', // add this line
    marginBottom: 200
  },
  enigmaContainer: {
    flexDirection: 'row',
    marginBottom: 30,
    alignSelf: 'center',
    width: '100%',
  },
  enigmaText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 0,
    marginRight: 0,
    textAlign: 'justify',
    textAlignVertical: 'center',
    width: '100%',
  },
  image: {
    height: 300,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center',
  },
  indiceText: {
    color: '#46b1c8',
    fontSize: 17,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    width: '100%',
    marginTop: 15
  },
  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    alignSelf: 'center',
    height: 50,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 20
  },
  answerInput: {
    flex: 1,
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    fontSize: 17,
    color: '#000',
    height: 50,
  },
  hintButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignSelf: 'center',
    marginTop: 20,
    height: 50,
    marginBottom: 20
  },
  hintButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  hintText: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  indice: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  paddingEnigme:{
    padding:10,
    paddingLeft: 0,
    paddingRight: 0
  },
  responseContainer: {
    alignItems: 'center',
    marginBottom: 30,
    alignSelf: 'flex-start',
  },
  responseText: {
    fontSize: 17,
    marginTop: 10,
    fontWeight: 'bold',
    color: '#873e58',
    marginBottom: 10,
    alignSelf: 'center',
  },
  response:{
    fontSize: 17,
    color: 'green',
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 25,
    alignSelf: 'center',
    width: '100%', // add this line
  },
  responseDisplay:{
    fontSize: 17,
    fontStyle: 'italic',
    color: '#000',
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 25,
    alignSelf: 'center',
    width: '100%', // add this line
  },
  priceButton:{
    width: '100%',
    marginTop: 20,
    backgroundColor: '#46b1c8',
    borderRadius: 5,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
  },
  priceText:{
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  errorMessage: {
    fontSize: 17,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#873e58',
    marginBottom: 0,
    alignSelf: 'center',
  },
  text_points_ml:{
    marginLeft: 10
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 10,
    textAlign: 'left',
    alignSelf: 'flex-start', // add this line
    width: '100%', // add this line
  }
});

export default EnigmaView;
