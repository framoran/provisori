import { Platform } from 'react-native';
import * as RNIap from 'react-native-iap';
import StorageManager from './storage-manager.js';
import { Alert } from 'react-native';

const items = Platform.select({
  ios: ['ch.provisori.clue'],
  android: ['ch.provisori.clue']
});

async function buyProduct() {
  await RNIap.prepare();

    return RNIap.getProducts(items).then(async (products) => {
      console.log("products");
      return await RNIap.buyProduct(items[0]).then(async purchase => {
       console.log("purchase :" + purchase);
       return true;
      }).catch((error) => {
       console.log(error.message);
       return false;
     });

    }).catch((error) => {
      console.log(error.message);
    })

}

async function consumeProduct() {
  try {
    await RNIap.prepare();
    const purchases = await RNIap.getAvailablePurchases();
    purchases.forEach(async (purchase) => {
      console.log('consume : ' + purchase.productId);
      await RNIap.consumePurchase(purchase.purchaseToken);
    });
  } catch (error) {
    console.log(error.message);
  }
}

export default { buyProduct, consumeProduct };
