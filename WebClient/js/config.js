class Config {
  constructor() {
    this.API_IP = Cookies.get('API_IP');
    if (this.API_IP === undefined) {
      this.API_IP = 'http://192.168.100.28:3000'; // Default API Address
      Cookies.set('API_IP', this.API_IP, {expires: new Date(9999, 12, 31)});
    }
    this.LIGHT_REFRESH_TIME = Cookies.get('LIGHTS_REFRESH_TIME');
    if (this.LIGHTS_REFRESH_TIME === undefined) {
      this.LIGHTS_REFRESH_TIME = 1000; // Default API Address
      Cookies.set('LIGHTS_REFRESH_TIME', this.LIGHTS_REFRESH_TIME, {expires: new Date(9999, 12, 31)});
    }
    this.THERMOMETERS_REFRESH_TIME = Cookies.get('THERMOMETERS_REFRESH_TIME');
    if (this.THERMOMETERS_REFRESH_TIME === undefined) {
      this.THERMOMETERS_REFRESH_TIME = 60 * 1000; // Default thermometers Address
      Cookies.set('THERMOMETERS_REFRESH_TIME', this.THERMOMETERS_REFRESH_TIME, {expires: new Date(9999, 12, 31)});
    }
  }
}
