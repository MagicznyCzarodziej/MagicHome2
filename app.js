const config = require('./config.js');
const express = require('express');
const log = require('./log.js');
const DB = require('./database.js');
const rpi = require('./gpio.js');

const app = express();
const DATABASE_URL = config.MONGO_URL;
const db = new DB(DATABASE_URL);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Open light pins
function setupLights() {
  return db.lights.getPins()
    .then(pins => rpi.setup(pins))
    .catch((err) => {
      log.update(err);
    });

  // TODO: Switch some lights on
}

function startExpress() {
  app.listen(3000, () => {
    log.update('Express | Listening at port 3000');
  });
}

db.connect().then((database) => {
  log.update('MongoDB | Connected to database');
  db.rooms.collection = database.collection('rooms');
  db.lights.collection = database.collection('lights');
  db.thermometers.collection = database.collection('thermometers');
  setupLights().then(() => {
    startExpress();
  });
}).catch((err) => {
  log.update(err.message);
  log.update('MongoDB | Failed to connect to database');
});

// Rooms

app.get('/rooms/list', (req, res) => {
  db.rooms.getList().then((data) => {
    log.update('mHome R | Send rooms list');
    res.send(data);
  }).catch((err) => {
    log.update(`MongoDB | ${err.message}`);
    res.status(404).send(err.message);
  });
});


// Lights

// Send lights list
app.get('/lights/list', (req, res) => {
  db.lights.getList().then((data) => {
    log.update('mHome L | Send lights list');
    res.send(data);
  }).catch((err) => {
    log.update(`MongoDB | ${err.message}`);
    res.status(404).send(err.message);
  });
});

// Send state of light by ID
app.get('/lights/state/id/:id', (req, res) => {
  const id = req.params.id;
  db.lights.getState(id).then((state) => {
    log.update(`mHome L | Send state of id ${id} - ${state ? 'ON' : 'OFF'}`);
    res.json(state);
  }).catch((err) => {
    log.update(`MongoDB | ${err.message}`);
    res.status(404).send(err.message);
  });
});

// Send data of light by ID
app.get('/lights/data/id/:id', (req, res) => {
  const id = req.params.id;
  db.lights.getData(id).then((data) => {
    log.update(`mHome L | Send data of id ${id}`);
    res.send(data);
  }).catch((err) => {
    log.update(`MongoDB | ${err.message}`);
    res.status(404).send(err.message);
  });
});

// Send data of all lights
app.get('/lights/data/all', (req, res) => {
  db.lights.getDataAll().then((data) => {
    log.update('mHome L | Send data of all lights');
    res.send(data);
  }).catch((err) => {
    log.update(`MongoDB | ${err.message}`);
    res.status(404).send(err.message);
  });
});

// Set light by ID
app.get('/lights/set/id/:id/:newState', (req, res) => {
  const id = req.params.id;
  let newState = req.params.newState;
  newState = newState === 'on';

  db.lights.getPin(id)
    .then(pin => rpi.update(pin, newState))
    .then(() => db.lights.updateState(id, newState))
    .then(() => {
      log.update(`mHome L | Set state of id ${id} - ${newState ? 'ON' : 'OFF'}`);
      res.send(newState);
    })
    .catch((err) => {
      log.update(` Error  | ${err.message}`);
      res.status(404).send(err.message);
    });
});

// Switch light by ID
app.get('/lights/switch/id/:id', (req, res) => {
  const id = req.params.id;
  let newState;

  db.lights.getState(id)
    .then((state) => {
      newState = !state;
      return db.lights.getPin(id);
    })
    .then(pin => rpi.update(pin, newState))
    .then(() => db.lights.updateState(id, newState))
    .then(() => {
      log.update(`mHome L | Set state of id ${id} - ${newState ? 'ON' : 'OFF'}`);
      res.send(newState);
    })
    .catch((err) => {
      log.update(` Error  | ${err.message}`);
      res.status(404).send(err.message);
    });
});

// Set lights by room ID
app.get('/lights/set/room/id/:id/:newState', (req, res) => {
  const id = req.params.id;
  let newState = req.params.newState;
  newState = newState === 'on';

  db.lights.getList().then((data) => {
    const promises = [];
    for (const lightId of data) {
      const promise = db.lights.getData(lightId);
      promises.push(promise);
    }
    const pinPromises = [];
    Promise.all(promises).then((lights) => {
      for (const light of lights) {
        const roomId = light.room_id;
        if (roomId == id) {
          const pin = light.pin;
          const promise = rpi.update(pin, newState);
          pinPromises.push(promise);
        }
      }
      return Promise.all(pinPromises);
    }).then(() => db.lights.updateRoom(id, newState))
      .then(() => {
        log.update(`mHome L | Set lights in room with id ${id} - ${newState ? 'ON' : 'OFF'}`);
        res.json({ success: true });
      });
  }).catch((err) => {
    log.update(`MongoDB | ${err.message}`);
    res.status(404).send(err.message);
  });
});

// Thermometers

// Send thermometes list
app.get('/thermometers/list/all', (req, res) => {
  db.thermometers.getList().then((data) => {
    log.update('mHome T | Send thermometers list');
    res.send(data);
  }).catch((err) => {
    log.update(`MongoDB | ${err.message}`);
    res.status(404).send(err.message);
  });
});

// Send temperature by ID
app.get('/thermometers/temp/id/:id', (req, res) => {
  const id = req.params.id;
  db.thermometers.getTemp(id).then((data) => {
    log.update(`mHome T | Send temp of id ${id}`);
    res.send(data);
  }).catch((err) => {
    log.update(`MongoDB | ${err.message}`);
    res.status(404).send(err.message);
  });
});

// Send thermometer data by ID
app.get('/thermometers/data/id/:id', (req, res) => {
  const id = req.params.id;
  let thermometerData;
  db.thermometers.getData(id)
    .then((data) => {
      thermometerData = data;
      return db.thermometers.getTemp(id);
    })
    .then((tempAndDate) => {
      thermometerData.temp = tempAndDate[1];
      log.update(`mHome T | Send temp of id ${id}`);
      res.send(thermometerData);
    }).catch((err) => {
      log.update(`MongoDB | ${err.message}`);
      res.status(404).send(err.message);
    });
});
