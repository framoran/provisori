import { Platform, NativeModules } from "react-native";
import StorageManager from '../model/storage-manager';

export default{
  async getLang(){
    let langRegionLocale = "en_US";

    // If we have an Android phone
    if (Platform.OS === "android") {
      langRegionLocale = NativeModules.I18nManager.localeIdentifier || "";
    } else if (Platform.OS === "ios") {
      langRegionLocale = NativeModules.SettingsManager.settings.AppleLocale || "";
    }

    // "en_US" -> "en", "es_CL" -> "es", etc
    lang = langRegionLocale.substring(0, 2);

    storedLang = await StorageManager.getLang();

    if(storedLang != undefined){
      lang = storedLang;
    }

    switch (lang) {
      case 'fr':
       return 'fr';
        break;
      default:
        return 'de';
        break;
    }
  }
}
