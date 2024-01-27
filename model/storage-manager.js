import { AsyncStorage} from 'react-native';

export default {

  async getValue(key){
      return AsyncStorage.getItem(key).then( (value) => {
         return value;
      });
  },

  async getLang(){
    return await this.getValue('lang');
  },

  async setLang(lang){
    await AsyncStorage.setItem('lang', lang)
      .then(json => console.log('success!'))
      .catch(error => console.log('error!'));
  },

  registerEmail(email){
    console.log(email);

    AsyncStorage.setItem('email', email)
      .then(json => console.log('success!'))
      .catch(error => console.log('error!'));
  },

  async getEmail(){
    return await this.getValue('email');
  },

  async isLoged(){
      email = await this.getEmail();
      console.log(email);
      return !(email == null || email == "");
  },

  /* ANSWER */
  async getAnswered(date){
    if(date == null){return false;}
    console.log("getAnswered : " + date);
    return AsyncStorage.getItem(date).then( (value) => {
      console.log(value);
       return value == '1';
    });
  },

  async setAnswered(date){
    console.log("setAnswered : " + date);
    AsyncStorage.setItem(date, '1')
      .then(json => console.log('success!'))
      .catch(error => console.log('error!'));
  },


  /* PRODUCT */

  buyProduct(date){
    AsyncStorage.setItem('product-' + date, date)
      .then(json => console.log('success!'))
      .catch(error => console.log('error!'));
  },

  async wasBought(date){
      product = await this.getValue('product-' + date);

      return !(product == null || product == "");
  },

}
