import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';
import * as InAppPurchases from 'expo-in-app-purchases';

// Set the product IDs for your in-app purchases
const items = Platform.select({
  ios: ['ch.provisori.clue'],
  android: ['ch.provisori.clue']
});

async function connectAsync() {
  await InAppPurchases.connectAsync();
}

async function getProducts() {
  const { responseCode, results } = await InAppPurchases.getProductsAsync(items);
  if (responseCode === InAppPurchases.IAPResponseCode.OK) {
    return results;
  } else {
    throw new Error('Failed to get products');
  }
}

async function buyProduct() {
  await connectAsync();
  const products = await getProducts();
  if (products.length > 0) {
    const purchase = await InAppPurchases.purchaseItemAsync(products[0].productId);
    if (purchase) {
      const message = `Purchase successful: ${JSON.stringify(purchase)}`;
      Alert.alert('Success', message);
      return true;
    }
  }
  const message = 'Purchase failed';
  Alert.alert('Error', message);
  return false;
}

async function consumeProduct() {
  await connectAsync();
  const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();
  if (responseCode === InAppPurchases.IAPResponseCode.OK) {
    for (const purchase of results) {
      const message = `Consumed product: ${purchase.productId}`;
      Alert.alert('Success', message);
      await InAppPurchases.finishTransactionAsync(purchase, true);
    }
  } else {
    const message = 'Failed to get purchase history';
    Alert.alert('Error', message);
    throw new Error(message);
  }
}

// Mock implementation for Expo Go
async function mockBuyProduct() {
  console.warn('In-app purchases are not supported in Expo Go.');
  return false;
}
async function mockConsumeProduct() {
  console.warn('In-app purchases are not supported in Expo Go.');
}

const IAP = {
  buyProduct: Constants.appOwnership === 'expo' ? mockBuyProduct : buyProduct,
  consumeProduct: Constants.appOwnership === 'expo' ? mockConsumeProduct : consumeProduct,
};

export default IAP;
