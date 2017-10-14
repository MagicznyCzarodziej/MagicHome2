const express = require('express');
const config = require('./config.js');
const LogUpdater = require('./log.js');
const DB = require('./database.js');

const app = express();
const log = new LogUpdater();

const DATABASE_URL = config.MONGO_URL;
const db = new DB(DATABASE_URL);
function startExpress() {
  app.listen(3000, () => {
    log.update('Express | Listening at port 3000');
  });
}

db.connect().then((database) => {
  log.update('MongoDB | Connected to database');
  db.lights.collection = database.collection('lights');
  startExpress();
}).catch((err) => {
  log.update('MongoDB | Failed to connect to database');
});


// Lights

app.get('/lights/state/id/:id', (req, res) => {
  const id = req.params.id;
  db.lights.getState(id).then((state) => {
    log.update(`mHome L | Send state of id ${id} - ${state ? 'ON' : 'OFF'}`);
    res.send(state);
  }).catch((err) => {
    log.update(`MongoDB | ${err.message}`);
    res.status(404).send(err.message);
  });
});

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
