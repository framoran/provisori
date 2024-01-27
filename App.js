import React, { useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/Home';
import LoginScreen from './screens/Login';
import RegisterScreen from './screens/Register';
import ResponseScreen from './screens/Response';
import PrixScreen from './screens/Prices';
import RankingScreen from './screens/Ranking';
import PartnerScreen from './screens/Partners';
import ContactScreen from './screens/Contact';
import AccountScreen from './screens/Account';
import ConditionsScreen from './screens/Conditions';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
import { requestUserPermission, notificationListener, notificationPopupRef } from './utils/pushNotification';
import NotificationPopup from 'react-native-push-notification-popup';
import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import usePushNotification from './utils/usePushNotification';

// Import lang manager
import * as i18n from 'i18n-js';
// Import translations
import strings_de from './utils/strings-de';
import strings_fr from './utils/strings-fr';

// Import api.js from the model folder
import api from './model/api';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const navigationRef = useRef();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [strings, setStrings] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [firstRefresh, setFirstRefresh] = useState(true);
  const [langParams, setLangParams] = useState(false);

  // const notificationListener = useRef();
  const responseListener = useRef();

  const {
    requestUserPermission,
    getFCMToken,
    listenToBackgroundNotifications,
    listenToForegroundNotifications,
    onNotificationOpenedAppFromBackground,
    onNotificationOpenedAppFromQuit,
  } = usePushNotification();

  useEffect(() => {

    fetchData();

    const listenToNotifications = () => {
      try {
        getFCMToken();
        requestUserPermission();
        onNotificationOpenedAppFromQuit();
        listenToBackgroundNotifications();
        listenToForegroundNotifications();
        onNotificationOpenedAppFromBackground();
      } catch (error) {
        console.log(error);
      }
    };

    listenToNotifications();

  }, [refresh]);

  const fetchData = async () => {

    const params = await api.params();

    if (params.lang) {
      setLangParams(params.lang);
    }

  }

  const renderCustomPopup = ({ appIconSource, appTitle, timeText, title, body }) => (
    <View style={{
      backgroundColor: 'white',  // TEMP
      borderRadius: 12,
      minHeight: 86,
      elevation: 2,
      shadowColor: '#000000',
      shadowOpacity: 0.5,
      shadowRadius: 3,
      shadowOffset: {
        height: 1,
        width: 0,
      }
    }}>
      <Text style={{fontSize:15, marginHorizontal:10, marginTop:5}}>{title}</Text>
      <Text style={{fontSize:12, marginHorizontal:10, marginTop:5}}>{body}</Text>
    </View>
  );

  // THIS SHOULD BE REPLACED WITH SECRET CODE FOR PRODUCTION
  const secretCode = 'BQlye3wxvPXytmd6oQyh5FMzZj1dGJfunXmIExR17kLbLHKdhptbNe76exdCo87S4dknRcOpCjRYMS11zOB1wZ0gNiFSS98sGwmUY4jWHk30dMA6xolhBdgy3AX6B9j6VD24OyIPWkk4BVRa3FOJvFnViYUtGCE4zqK9Id9ahLtUqb5rWeqD2LwNVK39CO2JbzYiTYPKjUVhjV7YL6oPXiuFHKXUYvkkBNbVLT9YMR5wWwhDWeOgeYt11jkGuGU1';
  AsyncStorage.setItem('secret', secretCode);

  const checkLogin = async () => {
    try {
      const value = await AsyncStorage.getItem('email');
      if (value !== null) {
        setmIsLoggedIn(true);
        // email is present, navigate to HomeScreen
        navigationRef.current.navigate('HomeScreen');
      } else {
        setIsLoggedIn(false);
        // email is not present, navigate to Login screen
        navigationRef.current.navigate('LoginScreen');
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  const checkUser = async () => {
    try {
      const value = await AsyncStorage.getItem('email');
      if (value !== null) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      // Error retrieving data
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

  const setLanguage = async (lang) => {
    try {
      await AsyncStorage.setItem('lang', lang);
      if (firstRefresh){
        setRefresh(refresh => !refresh); // toggle the refresh state to trigger a re-render
        navigationRef.current.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: navigationRef.current?.getCurrentRoute().name }],
          })
        );
      }
     } catch (error) {
      console.log(error); // Log the error for debugging purposes
    }
  };

  useEffect(() => {

    const unsubscribe = navigationRef.current?.addListener('state', (event) => {

      checkUser();
      setRefresh(refresh => !refresh); // toggle the refresh state to trigger a re-render

    });

    checkLogin();
    checkLang();

  }, [refresh]);


  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <NavigationContainer ref={navigationRef}>
        <Drawer.Navigator initialRouteName="HomeScreen" screenOptions={{ drawerStyle: { width: 260 } }}>
          <Drawer.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              title: 'BrainDeals',
              headerStyle: {
                backgroundColor: '#46b1c8',
              },
              headerTintColor: 'white',
              drawerIcon: ({ focused, color, size }) => (
                <FontAwesome
                  name={focused ? 'home' : 'home'}
                  size={size}
                  color={color}
                  style={{ width: 35 }}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Réponses"
            component={ResponseScreen}
            options={{
              title: strings.answers,
              headerStyle: {
                backgroundColor: '#46b1c8',
              },
              headerTintColor: 'white',
              drawerIcon: ({ focused, color, size }) => (
                <FontAwesome
                  name={focused ? 'puzzle-piece' : 'puzzle-piece'}
                  size={size}
                  color={color}
                  style={{ width: 35 }}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Prix"
            component={PrixScreen}
            options={{
              title: strings.pricelist,
              headerStyle: {
                backgroundColor: '#46b1c8',
              },
              headerTintColor: 'white',
              drawerIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? 'trophy' : 'trophy-outline'}
                  size={size}
                  color={color}
                  style={{ width: 35 }}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Classement"
            component={RankingScreen}
            options={{
              title: strings.ranking,
              headerStyle: {
                backgroundColor: '#46b1c8',
              },
              headerTintColor: 'white',
              drawerIcon: ({ focused, color, size }) => (
                <FontAwesome
                  name={focused ? 'bar-chart' : 'bar-chart'}
                  size={size}
                  color={color}
                  style={{ width: 35 }}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Condition"
            component={ConditionsScreen}
            options={{
              title: strings.terms,
              headerStyle: {
                backgroundColor: '#46b1c8',
              },
              headerTintColor: 'white',
              drawerIcon: ({ focused, color, size }) => (
                <FontAwesome
                  name={focused ? 'file-text-o' : 'file-text-o'}
                  size={size}
                  color={color}
                  style={{ width: 35 }}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Partner"
            component={PartnerScreen}
            options={{
              title: strings.partners,
              headerStyle: {
                backgroundColor: '#46b1c8',
              },
              headerTintColor: 'white',
              drawerIcon: ({ focused, color, size }) => (
                <FontAwesome
                  name={focused ? 'handshake-o' : 'handshake-o'}
                  size={size}
                  color={color}
                  style={{ width: 35 }}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Contact"
            component={ContactScreen}
            options={{
              title: 'Contact',
              headerStyle: {
                backgroundColor: '#46b1c8',
              },
              headerTintColor: 'white',
              drawerIcon: ({ focused, color, size }) => (
                <FontAwesome
                  name={focused ? 'envelope-o' : 'envelope-o'}
                  size={size}
                  color={color}
                  style={{ width: 35 }}
                />
              ),
            }}
          />

          <Drawer.Screen
            name="Account"
            component={AccountScreen}
            options={{
              title: strings.account,
              headerStyle: {
                backgroundColor: '#46b1c8',
              },
              headerTintColor: 'white',
              drawerIcon: ({ focused, color, size }) => (
                <Ionicons
                  name={focused ? 'ios-create' : 'ios-create'}
                  size={size}
                  color={color}
                  style={{ width: 35 }}
                />
              ),
            }}
          />

          {!isLoggedIn ? (
            <>
              <Drawer.Screen
                name="LoginScreen"
                component={LoginScreen}
                options={{
                  title: strings.login,
                  headerStyle: {
                    backgroundColor: '#46b1c8',
                  },
                  headerTintColor: 'white',
                  drawerIcon: ({ focused, color, size }) => (
                    <FontAwesome
                      name={focused ? 'user' : 'user'}
                      size={size}
                      color={color}
                      style={{ width: 35 }}
                    />
                  ),
                }}
              />
              <Drawer.Screen
                name="Register"
                component={RegisterScreen}
                options={{
                  title: strings.register,
                  headerStyle: {
                    backgroundColor: '#46b1c8',
                  },
                  headerTintColor: 'white',
                  drawerIcon: ({ focused, color, size }) => (
                    <FontAwesome
                      name={focused ? 'user-o' : 'user-o'}
                      size={size}
                      color={color}
                      style={{ width: 35 }}
                    />
                  ),
                }}
              />
            </>
          ) : null}
        </Drawer.Navigator>
        {langParams == true && (
         <View style={{ position: 'absolute', right: 0, flexDirection: 'row', paddingVertical: 55 }}>
          <TouchableOpacity onPress={() => setLanguage('fr')}>
            <Image source={require('./assets/fr-flag.png')} style={{ width: 25, height: 20 }} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLanguage('de')} style={{ marginHorizontal: 10 }}>
            <Image source={require('./assets/de-flag.png')} style={{ width: 25, height: 20 }} />
          </TouchableOpacity>
        </View>
        )}
      </NavigationContainer>
      
    </>
  );
}
