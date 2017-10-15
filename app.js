const config = require('./config.js');
const express = require('express');
const LogUpdater = require('./log.js');
const DB = require('./database.js');
const rpi = require('./gpio.js');

const app = express();
const log = new LogUpdater();
const DATABASE_URL = config.MONGO_URL;
const db = new DB(DATABASE_URL);


function setupLights() {
  db.lights.getData().then((list) => {
    log.update(list);
    rpi.setup(list);
  });
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
  setupLights();
  startExpress();
}).catch((err) => {
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
    log.update('mHome R | Send lights list');
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

// Switch light by ID
app.get('/lights/switch/id/:id', (req, res) => {
  const id = req.params.id;
  db.lights.getState(id).then((state) => {
    const newState = !state;
    return db.lights.updateState(id, newState);
  }).then((newState) => {
    log.update(`mHome L | Set state of id ${id} - ${newState ? 'ON' : 'OFF'}`);
    res.send(newState);
  }).catch((err) => {
    log.update(`MongoDB | ${err.message}`);
    res.status(404).send(err.message);
  });
});

// Switch lights by room ID
app.get('/lights/switch/room/:id/off', (req, res) => {
  const id = req.params.id;
  db.lights.getList().then((data) => {
    for (const light in data) {
      const roomID = data[light].room_id;
      if (roomID === id) {
        const pin = data[light].pin;
        // switchPin(pin, false);
      }
    }
    return db.lights.updateRoom(id, false);
  }).then(() => {
    log.update(`mHome L | Set lights in room with id ${id} OFF`);
    res.json({ success: true });
  }).catch((err) => {
    log.update(`MongoDB | ${err.message}`);
    res.status(404).send(err.message);
  });
});
