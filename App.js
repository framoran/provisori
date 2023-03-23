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
import ConditionsScreen from './screens/Conditions';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'react-native';
// import {requestUserPermission, notificationListener }
import { requestUserPermission, notificationListener, notificationPopupRef } from './utils/pushNotification';
import NotificationPopup from 'react-native-push-notification-popup';
import { View, Text, Button } from 'react-native';
// import * as Device from 'expo-device';
// import * as Notifications from 'expo-notifications';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// Can use this function below OR use Expo's Push Notification Tool from: https://expo.dev/notifications
async function sendPushNotification(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

async function registerForPushNotificationsAsync() {

}

export default function App() {
  const navigationRef = useRef();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  // const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    let FCMToken = getPermission()
    notificationListener();

  }, []);

  const getPermission = async () => {
    return await requestUserPermission();
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
  const secretCode = '';
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

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <>
      <StatusBar translucent backgroundColor="transparent" />
      <NavigationContainer ref={navigationRef}>
        <Drawer.Navigator initialRouteName="HomeScreen" screenOptions={{ drawerStyle: { width: 260 } }}>
          <Drawer.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              title: 'Provisori',
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
              title: 'Réponses',
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
              title: 'Prix',
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
              title: 'Classement',
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
              title: 'Conditions',
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
          {!isLoggedIn ? (
            <>
              <Drawer.Screen
                name="Register"
                component={RegisterScreen}
                options={{
                  title: "S'enregistrer",
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
                name="LoginScreen"
                component={LoginScreen}
                options={{
                  title: 'Se connecter',
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
            </>
          ) : null}
        </Drawer.Navigator>
      </NavigationContainer>
      <NotificationPopup
        ref={notificationPopupRef}
        renderPopupContent={renderCustomPopup}
        shouldChildHandleResponderStart={true}
        shouldChildHandleResponderMove={true}
      />
    </>
  );
}
