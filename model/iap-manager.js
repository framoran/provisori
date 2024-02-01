import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as InAppPurchases from 'react-native-iap';
import {finishTransaction, flushFailedPurchasesCachedAsPendingAndroid, consumePurchase, getPurchaseHistory, getAvailablePurchases} from 'react-native-iap';
// Import api.js from the model folder
import api from '../model/api';

var isPurchasing = false;


// Set the product IDs for your in-app purchases
const items = Platform.select({
  ios: {
    sku: 'com.braindeal.indice',
    andDangerouslyFinishTransactionAutomaticallyIOS: false
  },
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
      
        const products = await InAppPurchases.getProducts({skus:['ch.provisori.indice', "com.gamequestion.ios.indice"]});

        return products
      } catch (error) {
        console.log('Failed to get products', error);
        return error
      }

}

async function buyProduct() {
  //to prevent issues with double clicking
  if(isPurchasing) return;

  isPurchasing = true;
  await connectAsync();
  const products = await getProducts();



  try {
    const productId = Platform.OS === 'ios' ? "com.gamequestion.ios.indice" : "ch.provisori.indice";
    const purchase = await InAppPurchases.requestPurchase({sku: productId});


    //consume products immediatly after purchase no need to await this
    consumeProducts();

    console.log("OKOK", purchase);
    await api.setHint();
    isPurchasing = false;
  } catch (error) {
    isPurchasing = false;
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


     const developerPayloadAndroid = "Achat d'indice Provisori";
     purchases.forEach(async purchase => {
      const isConsumable = true;
      if(purchase.productId == "com.gamequestion.ios.indice" || purchase.purchaseId == "ch.provisori.indice"){
        await finishTransaction({purchase, isConsumable, developerPayloadAndroid});
        await consumePurchase(purchase.purchaseToken);
      }
      
    });

     //throws error on ios, so run for android only
     if(Platform.OS === 'android'){
      flushFailedPurchasesCachedAsPendingAndroid();
     }
     

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
