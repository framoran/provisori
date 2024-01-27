import React from 'react';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PermissionsAndroid} from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native'
export const notificationPopupRef = React.createRef(null);

export async function requestUserPermission() {
    // if Android -> request permissions to send Notifications (NEEDED TO BE PUT IN requestUserPermission method
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
    }
    // if iOS
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
        console.log('Authorization status for request:', authStatus);
        return getFcmToken()
    }

}
const getFcmToken = async () => {
    let checkToken = await AsyncStorage.getItem('fcmToken')
    console.log("the old token", checkToken)
    if (!checkToken) {
        try {
            const fcmToken = await messaging().getToken()
            if (!!fcmToken) {
                console.log("fcme token generated", fcmToken)
                await AsyncStorage.setItem('fcmToken', fcmToken)

                return fcmToken;
            }
        } catch (error) {
            console.log("error in fcmToken", error)
            alert("Please check your internet connection")
        }
    }
    else return checkToken;
}

export const notificationListener = async () =>{
  // const navigation = useNavigation();

    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
          'Notification caused app to open from background state:',
          remoteMessage.notification
        );
          console.log("backgrund state",remoteMessage.notification)
      });
      messaging().onMessage(remoteMessage => {
        console.log('A new FCM message arrived!',remoteMessage);
        if(remoteMessage.notification?.title || remoteMessage.notification?.body) {
          notificationPopupRef?.current?.show({
            // onPress: function () {
            //   console.log('Pressed');
            //   navigation.navigate('BEFORE_BOOKING_DETAILSSCREEN');
            // },
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            soundName:'default',
            vibrate: true,
            slideOutTime: 5000,
          });

        }
      });

      messaging().setBackgroundMessageHandler(remoteMessage => {
        console.log('Message handled in the background!', remoteMessage);
        if(remoteMessage?.notification?.title || remoteMessage?.notification?.body) {
          notificationPopupRef?.current?.show({
              // onPress: function () {
              //   console.log('Pressed');
              //   navigation.navigate('BEFORE_BOOKING_DETAILSSCREEN');
              // },
              title: remoteMessage?.notification?.title,
              body: remoteMessage?.notification?.body,
              soundName:'default',
              vibrate: true,
              slideOutTime: 5000
            });
        }
      });

      // Check whether an initial notification is available
      messaging()
      .getInitialNotification()
      ?.then((remoteMessage) => {
        if (remoteMessage) {
          console.log("remote message Details", remoteMessage);
        }
      })
      .catch((error) => {
        console.log("error in getInitialNotification", error);
      })
      .finally(() => {
        // This code will run regardless of whether the Promise resolves or rejects
      });
}
