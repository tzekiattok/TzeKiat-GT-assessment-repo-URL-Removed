import {reactLocalStorage} from 'reactjs-localstorage';
//local storage guide https://stackoverflow.com/questions/70832675/losing-usestate-value-on-refresh-in-react-js

//called by account class to set localstorage session : logged in?
class Authenticate {
    constructor() {
      this.authenticated = false;
      if (reactLocalStorage.getObject('Auth')===undefined){
        reactLocalStorage.setObject('Auth', {'logged': false})
      }


    }

    login() {
      this.authenticated = true;
      reactLocalStorage.setObject('Auth', {'logged': true})
      //getRole of user
    }
  
    logout() {
      this.authenticated = false;
      reactLocalStorage.setObject('Auth', {'logged': false})
      reactLocalStorage.setObject('Role', {'role': ''})
      reactLocalStorage.setObject('Loading', {'load': false})
    }

    isAuthenticated() {
      return this.authenticated;
    }
  }
  
  export default new Authenticate();