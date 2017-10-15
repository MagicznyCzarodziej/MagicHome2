const gpio = require('rpi-gpio-promise');

const RPI = {
  update(pin, state) {
    gpio.write(pin, state).then(() => {
      // log.update(`RPIGPIO | Set pin ${pin} to ${state}`);
    }).catch((err) => {
      // log.update(err);
    });
  },
  setup(lights) {
    for (const light in lights) {
      const pin = light.pin;
      gpio.setup(pin, gpio.DIR_OUT).then(() => {
        this.update(pin, false);
      });
    }
  },
};

module.exports = RPI;
