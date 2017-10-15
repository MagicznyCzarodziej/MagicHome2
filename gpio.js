const gpio = require('rpi-gpio-promise');

const RPI = {
  update(pin, state) {
    return gpio.write(pin, state);
  },
  setup(pins) {
    return new Promise((resolve, reject) => {
      const promises = [];
      pins.forEach((pin) => {
        const promise = gpio.setup(pin, gpio.DIR_OUT);
        promises.push(promise);
      });

      Promise.all(promises).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  },
};

module.exports = RPI;
