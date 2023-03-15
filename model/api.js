import { Platform } from 'react-native';
import axios from 'axios';
import StorageManager from './storage-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const webservicesURL = 'https://website.com/api/';

async function register(email, password, name, firstname) {
  const json = JSON.stringify({
    email,
    password,
    name,
    firstname
  });
  return postJSON(webservicesURL+'/register', json);
}

async function login(email, password) {
  console.log('Logging in with email', email, 'and password', password);
  try {
    const response = await axios.post(webservicesURL+'login', {
      email: email,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseJson = response.data;
    console.log('s'+responseJson);
    return responseJson;
  } catch (error) {
    console.log('An error occurred while logging in:', error);
    throw error;
  }
}

async function setHint(email) {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0'); // get the day as a 2-digit string with leading zeros
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // get the month as a 2-digit string with leading zeros
  const year = currentDate.getFullYear().toString(); // get the year as a 4-digit string
  const formattedDate = `${day}_${month}_${year}`; // combine the day, month, and year with underscores

  const secretCode = await AsyncStorage.getItem('secret');
  const code = secretCode + formattedDate; // concatenate the secret code with the formatted date

  const json = JSON.stringify({
    email,
    secretCode
  });
  return postJSON(webservicesURL+'/hint', json);
}

async function game(email) {
  try {
    const secretCode = await AsyncStorage.getItem('secret');
    console.log('secret_code : ' +secretCode)
    console.log('email : ' +email)

    const response = await axios.post(webservicesURL+'game', {
      email: email,
      code: secretCode
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseJson = response.data;

    console.log('Response', responseJson);

    return responseJson;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function postJSON(url, json, showAlert = true) {
  console.log(url);
  const useragent = Platform.OS === 'android' ? 'okhttp' : 'ios';

  try {
    const response = await axios.post(url, json, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': useragent,
      },
    });
    const responseJson = response.data;
    console.log(responseJson);
    return responseJson;
  } catch (error) {
    console.warn(error);
    if (showAlert) {
      alert(
        "Oups.. Vérifiez que vous êtes bien connecté à internet et relancer l'application"
      );
    }
    return postJSON(url, json, false);
  }
}

async function checkResponse(answer, email) {

  console.log('emasillll'+ email)
  const response = await axios.post(webservicesURL+'response', {
    response: answer,
    email: email
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const responseJson = response.data;
  console.log('response'+responseJson.status);
  return responseJson;
}

async function getEmail() {
  try {
    const email = await AsyncStorage.getItem('email');
    return email;
  } catch (error) {
    console.error(error);
  }
}

export default {
  register,
  login,
  getEmail,
  game,
  checkResponse,
};
