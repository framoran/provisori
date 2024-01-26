import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as InAppPurchases from 'react-native-iap';
import {finishTransaction, flushFailedPurchasesCachedAsPendingAndroid, consumePurchase, getPurchaseHistory, getAvailablePurchases} from 'react-native-iap';
// Import api.js from the model folder
import api from '../model/api';


// Set the product IDs for your in-app purchases
const items = Platform.select({
  ios: ['ch.provisori.indice'],
  android: ['ch.provisori.indice']
});

async function connectAsync() {
//   await InAppPurchases.initConnection();
if (Platform.OS === 'android') {
    InAppPurchases.initConnection()
      .then(result => {
        console.log('Connected to Google Play');
      })
      .catch(error => {
        console.log('Failed to connect to Google Play', error);
      });
  } else if (Platform.OS === 'ios') {
    InAppPurchases.initConnection()
      .then(result => {
        console.log('Connected to App Store');
      })
      .catch(error => {
        console.log('Failed to connect to App Store', error);
      });
  }
}

async function getProducts() {
    try {
        const products = await InAppPurchases.getProducts({skus:['ch.provisori.indice']});
        console.log(products);
        return products
      } catch (error) {
        console.log('Failed to get products', error);
        return error
      }

}

async function buyProduct() {
  await connectAsync();
  const products = await getProducts();
  console.log("products  ",products);
  //const isConsumable = true; // or false, depending on your use case
  // Assuming you have a string representing the developer payload for Android
  //const developerPayloadAndroid = "Achat d'indice Provisori";
  try {
    const purchase = await InAppPurchases.requestPurchase({skus: ["ch.provisori.indice"]});
    //  const finishTransaction = await finishTransaction({purchase, isConsumable, developerPayloadAndroid});
    console.log("OKOK", purchase);
    // { productId: 'product_id_1', transactionId: 'transaction_id_1', purchaseToken: 'purchase_token_1' }
    await api.setHint();
  } catch (error) {
    console.log('Failed to purchase product', error);
  }

  //const message = "L'indice n'a pas été acheté";
  //Alert.alert('Erreur', message);
  return false;
}

async function consumeProducts() {
  await connectAsync();
  try {
     const purchases = await getAvailablePurchases();
     flushFailedPurchasesCachedAsPendingAndroid();
     const isConsumable = true; // or false, depending on your use case
     // Assuming you have a string representing the developer payload for Android
     const developerPayloadAndroid = "Achat d'indice Provisori";
     await Promise.all(purchases.map(async purchase => {

        await finishTransaction({purchase, isConsumable, developerPayloadAndroid});

       }

     ))

     /*Alert.alert(
      'Achat réussit',
      `Vous avez acheté un indice !`,
    );*/

  } catch (error) {
    console.warn(error);
    Alert.alert(error.message);
  }

}

const IAP = {
buyProduct:  buyProduct,
consumeProducts:  consumeProducts,
};

export default IAP;
