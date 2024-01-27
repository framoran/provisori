import { Platform } from 'react-native';
import axios from 'axios';
import StorageManager from './storage-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';

const webservicesURL = 'https://provisori.com/api/';

// Create a centralized Axios configuration
const axiosConfig = {
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'User-Agent': Platform.OS === 'android' ? 'okhttp' : 'ios',
  },
};

// Centralized error handling function
function handleRequestError(error) {
  console.warn(error);
  alert("Oops.. Vérifiez votre connexion à Internet et relancez l'application.");
}

async function postJSON(url, json, showAlert = true) {
  try {
    const response = await axios.post(url, json, axiosConfig);
    const responseJson = response.data;
    console.log(responseJson);
    return responseJson;
  } catch (error) {
    if (showAlert) {
      handleRequestError(error);
    }
    return postJSON(url, json, false);
  }
}

async function register(email, password, name, firstname) {
  const json = JSON.stringify({
    email,
    password,
    name,
    firstname
  });
  return postJSON(webservicesURL + '/register', json);
}

async function login(email, password) {
  try {
    const response = await axios.post(
      webservicesURL + 'login',
      { email, password },
      axiosConfig
    );
    return response.data;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
}

async function setHint() {
  const currentDate = new Date();
  const day = currentDate.getDate().toString().padStart(2, '0');
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const year = currentDate.getFullYear().toString();
  const formattedDate = `${day}_${month}_${year}`;
  const email = await AsyncStorage.getItem('email');
  const secretCode = await AsyncStorage.getItem('secret');
  const code = secretCode;

  const json = JSON.stringify({
    email,
    code
  });
  return postJSON(webservicesURL + 'hint', json);
}

async function account() {
  try {
    const email = await AsyncStorage.getItem('email');
    const secretCode = await AsyncStorage.getItem('secret');
    const lang = await AsyncStorage.getItem('lang');

    const response = await axios.post(
      webservicesURL + 'account',
      { email, code: secretCode, lang },
      axiosConfig
    );

    return response.data;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
}

async function game(email) {
  try {
    const secretCode = await AsyncStorage.getItem('secret');
    const lang = await AsyncStorage.getItem('lang');

    const response = await axios.post(
      webservicesURL + 'game',
      { email, code: secretCode, lang },
      axiosConfig
    );

    return response.data;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
}

async function params() {
  try {
    const response = await axios.get(webservicesURL + 'parameters', axiosConfig);
    return response.data;
  } catch (error) {
    handleRequestError(error);
    throw error;
  }
}

async function checkResponse(answer, email) {
  const lang = await AsyncStorage.getItem('lang');

  console.log('data to be sent: ', email)

  const response = await axios.post(
    webservicesURL + 'response',
    { response: answer, email, lang },
    axiosConfig
  );

  const responseJson = response.data;
  console.log('response ' + responseJson.status);
  console.log('response ' + responseJson.error);
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
  setHint,
  params,
  account,
};
