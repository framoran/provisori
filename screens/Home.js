import React, { useState, useEffect } from 'react';
import { Alert, Linking, ScrollView, View, Text, Image, TextInput, Button, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Animated } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ConfettiCannon from 'react-native-confetti-cannon';
import Spinner from 'react-native-spinkit';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import { Dimensions } from 'react-native';
import LottieView from 'lottie-react-native';
import { format, getDayOfYear } from 'date-fns';
import { KeyboardAvoidingView, Platform } from 'react-native';

// Import iap-manager
import iapManager from '../model/iap-manager';
// Import api.js from the model folder
import api from '../model/api';

// Import translations
import strings_de from '../utils/strings-de';
import strings_fr from '../utils/strings-fr';

const EnigmaView = ({navigation}) => {
  const [answer, setAnswer] = useState('');
  const [hintPurchased, setHintPurchased] = useState('');
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
  const [msg, setMsg] = useState('Loading ...');
  const [hintVisible, setHintVisible] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [winnerPopup, setWinnerPopup] = useState(false);
  const [winnerUsername, setWinnerUsername] = useState(false);
  const [winnerPrice, setwinnerPrice] = useState(false);
  const [winnerPriceURL, setwinnerPriceURL] = useState(false);
  const [price, setPrice] = useState('');
  const [priceURL, setPriceURL] = useState('');
  const [eveningResponse, setEveningResponse] = useState('');
  const [priceRedirectURL, setPriceRedirectURL] = useState('');
  const windowHeight = Dimensions.get('window').height;
  const [emailHint, setEmailHint] = useState('');
  const [strings, setStrings] = useState(false);
  const [eveningPopupWinner, setEveningPopupWinner] = useState(false);
  const [popupWinnerDisplayed, setPopupWinnerDisplayed] = useState(false);
  const [popupDisplayDate, setPopupDisplayDate] = useState('0');
  const [textWin, setWin] = useState('');
  const [textWin2, setWin2] = useState('');
  const [welcome, setWelcome] = useState('');

  let today = '0';
  let dayOfYear = '1';

  const email = '';

  useEffect(() => {
    // refresh screen when it is loaded
    const unsubscribe = navigation.addListener('focus', async () => {
      // Fetch data and update state here
      setRefresh(!refresh); // Toggle refresh state to force component to re-render
    });

    const fetchData = async () => {
      try {
        const email = await AsyncStorage.getItem('email');
        setEmailHint(email)
        const name = await AsyncStorage.getItem('name');
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

        console.log(gameData.status)

        // for current version of Provisori => popup that announce monthly winnner
        if (gameData.popup_winner) {
          const winnerPriceLink = `${gameData.winnerPriceUrl}`;
          Alert.alert(
            `${strings.winner} \n`,
            `${gameData.winner_username} remporte `,
            [
              {
                text: 'OK',
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

        if (gameData.textWin) {
          setWin(gameData.textWin);
        }

        if (gameData.textWin2) {
          setWin2(gameData.textWin2);
        }

        if (gameData.tot_points) {
          setTotPoints(gameData.tot_points);
        }

        setResponse(''); // reset response

        if (gameData.response) {
          setResponse(gameData.response);
        }

        if (gameData.welcome) {
          setWelcome(gameData.welcome);
        }

        if (gameData.evening_response) {
          setEveningResponse(gameData.evening_response);
        }

        if (gameData.price) {
          setPrice(gameData.price);
        }

        if (gameData.price_url) {
          setPriceURL(gameData.price_url);
        }

        if (gameData.price_redirect_url){
          setPriceRedirectURL(gameData.price_redirect_url);
        }

        if (gameData.winner_message){
          setPopupWinnerDisplayed(gameData.winner_message)
        }else{
          setPopupWinnerDisplayed(false)
        }

        // init hint
        setHintPurchased(false)
        setHintElement('');
        setHintVisible(false);
        setHint('');

        if (gameData.hint) {
          setHintPurchased(true);
          setHint(gameData.hint);
          setHintElement(strings.clue + ' = ')
          setHintVisible(true);
        }

        if (gameData.points) {
          setPoints(gameData.points);
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkLang();

    fetchData();

    const intervalId = setInterval(() => {
      setRefresh(refresh => !refresh); // toggle the refresh state to trigger a re-render
    }, 60000);

    return () => {
      clearInterval(intervalId);
    };

    // Return a function to unsubscribe from the event listener
    return unsubscribe;

  }, [refresh, navigation]); // add refresh to the dependency array

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

  const handleRegisterNavigation = () => {
    navigation.navigate('LoginScreen');
  };

  const checkAnswer = async () => {
    setMessage('');
    setIsLoading(true);

    // Vérifie la réponse de l'utilisateur ici
    if (api.getEmail() !== null) {
      const email2 = await AsyncStorage.getItem('email');
      const response = await api.checkResponse(answer, email2);
      if (response.status === 'success') {

        setRefresh(refresh => !refresh); // toggle the refresh state to trigger a re-render
        setShowResponse(true);
        setIsLoading(false);
        setMessage('');

      } else if(response.status === 'not_loggued'){

          await AsyncStorage.setItem('name', '');
          await AsyncStorage.setItem('email', '');
          Alert.alert(
            `${strings.playLoginFalse}`,
            ``,
            [
              {
                text: 'Se connecter',
                onPress: handleRegisterNavigation, // Call the navigation function here
                style: 'cancel',
              },
            ],
            { cancelable: false }
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
        `${strings.playLoginFalse}`,
        '',
        [
          {
            text: `${strings.cancel}`,
            onPress: () => console.log('Annuler Pressed'),
            style: 'cancel',
          },
          {
            text: `${strings.login}`,
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
      `${strings.incorrectAnswer}`,
      `${strings.incorrectAnswer2}`,
      `${strings.incorrectAnswer3}`,
      `${strings.incorrectAnswer4}`,
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const purchaseHint = async () => {
    console.log('init')
    await iapManager.buyProduct();

    setRefresh(refresh => !refresh); // toggle the refresh state to trigger a re-render

  };

  const handleImagePress = () => {
    // Redirect to a new screen when the image is clicked
    // For example, using the navigation prop from React Navigation:
    Linking.openURL(priceRedirectURL);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      >
      <ScrollView>
        <View style={styles.container}>
          {enigmeDisplay !== 'not_loggued' ? (
            <View>
              <View style={styles.box}>
                {enigmeDisplay !== 'display_none' ? (
                  enigmeDisplay === 'not_found' ? (
                    <>
                      <Text style={styles.boxText}>
                        {welcome} !
                      </Text>
                    </>
                  ) : (
                    <>
                      {enigmeDisplay === 'has_found' && (
                        <>
                          <Text style={styles.boxText}>
                            <Ionicons
                              name={'md-happy'}
                              size={15}
                              color={'gold'}
                              style={{ width: 35, marginRight: 10 }}
                            /> {strings.findAnswer} ! <Ionicons
                              name={'md-happy'}
                              size={15}
                              color={'gold'}
                              style={{ width: 35 }}
                            />

                          </Text>
                        </>
                      )}
                      {enigmeDisplay === 'show_response' && (
                        <Text style={styles.boxText}> {strings.enigmaAnswer} </Text>
                      )}
                    </>
                  )
                ) : (
                  <Text style={styles.boxText}> {strings.enigmaNotPresent} </Text>
                )}
              </View>
            </View>
          ) : (
            <TouchableOpacity style={styles.title_right} onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.title_right}>
                <Ionicons name="person-outline" type="font-awesome" color="#000" size={24} />
                {strings.login}
              </Text>
            </TouchableOpacity>
          )}
          {enigmeDisplay === 'has_found' && (
            <ConfettiCannon count={200} origin={{ x: -200, y: -200 }} fadeOut={true} />
          )}
          <View style={styles.paddingEnigme}>
            <Text style={styles.title}>{strings.enigma}</Text>
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
                        placeholder={strings.response}
                        placeholderTextColor="#000"
                      />
                      <TouchableOpacity style={styles.hintButton} onPress={checkAnswer}>
                        <Text style={styles.checkAnswerButton}>
                          <Ionicons name="send-outline" type="font-awesome" color="#fff" size={15} />
                        </Text>
                      </TouchableOpacity>
                    </View>
                    )}
                    {!hintPurchased && enigmeDisplay && emailHint != null && (
                      <TouchableOpacity style={styles.hintButton} onPress={purchaseHint}>
                        <AntDesign name="questioncircle" size={24} color="#fff" />
                        <Text style={styles.hintButtonText}>{strings.clue} ?</Text>
                      </TouchableOpacity>
                    )}
                    <View style={styles.enigmaContainer}>
                      <Text style={[styles.indiceText, { marginTop: 0, fontStyle: 'italic', display: hintVisible ? 'flex' : 'none' }]}>{strings.clue} = {getHint}</Text>
                    </View>

                    {showResponse}

                    {enigmeDisplay !== 'show_response' ? (
                      <Animated.View style={{ transform: [{ translateX: animatedValue }] }}>
                        <Text style={[styles.errorMessage, {marginTop: 0, fontStyle: 'italic'}]}>{getMessage} {response}</Text>
                      </Animated.View>
                    ) : (
                      <>
                        <Text style={[styles.eveningResponse, {marginTop: 0, fontStyle: 'italic'}]}>{strings.responseFinal} = {eveningResponse}</Text>
                      </>
                    )}

                  </>
                ) : (
                  <Text style={styles.errorMessage}>{strings.responseFinal} = {response}</Text>
                )}
              </>
            ) : (
              <Text style={[styles.title_sm, {fontStyle: 'italic'}]}>{msg}</Text>
            )}

          </View>

          {popupWinnerDisplayed ? (

            <TouchableOpacity style={[styles.priceButtonWin, {textAlign: 'left'}]} onPress={() => Linking.openURL(priceRedirectURL)}>
              <Text style={[styles.textCenter, styles.priceButton]}>
                <Text>💪</Text> {/* Emoji de biceps */}
                <Text style={styles.priceText}> {strings.found_resp} </Text>
                <Text>💪</Text> {/* Emoji de biceps */}
              </Text>
              <Text style={[styles.priceText, {textAlign: 'left'}]}>{textWin} </Text>
              <Text style={[styles.priceText, {textAlign: 'left'}]}>{textWin2}</Text>
            </TouchableOpacity>
          ):(
            <TouchableOpacity style={[styles.priceButtonWin, {textAlign: 'left'}]} onPress={() => Linking.openURL(priceRedirectURL)}>
              <Text style={styles.priceButton}>
              <Ionicons
                name={'trophy'}
                size={20}
                color={'gold'}
                style={{ width: 35, marginRight: 10 }}
              />
              <Text style={styles.priceText}>   {strings.prix}   </Text>
              <Ionicons
                    name={'trophy'}
                    size={20}
                    color={'gold'}
                    style={{ width: 35, marginRight: 10 }}
                  />
              </Text>
            </TouchableOpacity>

          )}

          {price !== '' && priceURL !== '' ? (
            <>
              <TouchableWithoutFeedback onPress={handleImagePress}>
                <Image source={{ uri: priceURL }} style={styles.image} />
              </TouchableWithoutFeedback>
              <TouchableOpacity onPress={handleImagePress} style={styles.price} >
                <Text style={styles.price_text_redirect}>{strings.play} {price}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text style={styles.text_bottom}>{strings.noPrice} !</Text>
          )}

        </View>
      </ScrollView>

    </KeyboardAvoidingView>

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
  textCenter :{
    textAlign: 'center',
    alignSelf: 'center'
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
  },
  enigmaText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 0,
    marginRight: 0,
    textAlign: 'justify',
    textAlignVertical: 'center',
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
    paddingRight: 10
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
  price:{
    width: '90%',
    marginBottom: 25,
  },
  priceButton:{
    width: '100%',
    backgroundColor: '#46b1c8',
    borderRadius: 5,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
  },
  priceButtonWin:{
    width: '100%',
    marginTop: 20,
    backgroundColor: '#46b1c8',
    borderRadius: 5,
    padding: 10,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'left',
  },
  priceText:{
    fontSize: 17,
    fontWeight: 'bold',
    color: '#fff',
  },
  price_text_redirect :{
    fontSize: 17,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    color: '#46b1c8'
  },
  errorMessage: {
    fontSize: 17,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#873e58',
    marginBottom: 0,
    alignSelf: 'center',
  },
  eveningResponse: {
    fontSize: 17,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#873e58',
    marginBottom: 0,
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
