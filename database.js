const { MongoClient: mongo } = require('mongodb');

const rooms = {
  collection: undefined,
  getList() {
    return new Promise((resolve, reject) => {
      const query = {};
      const projection = { _id: 0 };
      this.collection.find(query, projection).toArray().then((data) => {
        resolve(data);
      }).catch((err) => {
        reject(err);
      });
    });
  },
};

const lights = {
  collection: undefined,
  getState(id) {
    return new Promise((resolve, reject) => {
      const query = { id: parseInt(id, 10) };
      const projection = { _id: 0, state: 1 };
      this.collection.findOne(query, projection).then((data) => {
        let state;
        if (data) {
          state = data.state;
          resolve(state);
        } else {
          reject(new Error(`Light not found (ID: ${id})`));
        }
      }).catch((err) => {
        reject(err);
      });
    });
  },
  getData(id) {
    return new Promise((resolve, reject) => {
      const query = { id: parseInt(id, 10) };
      const projection = { _id: 0 };
      this.collection.findOne(query, projection).then((data) => {
        if (data) resolve(data);
        else reject(new Error(`Light not found (ID: ${id})`));
      }).catch((err) => {
        reject(err);
      });
    });
  },
  getDataAll() {
    return new Promise((resolve, reject) => {
      const query = {};
      const projection = { _id: 0 };
      this.collection.find(query, projection).toArray().then((data) => {
        if (data) resolve(data);
        else reject(new Error('Lights not found'));
      }).catch((err) => {
        reject(err);
      });
    });
  },
  getList() {
    return new Promise((resolve, reject) => {
      const query = {};
      const projection = { _id: 0, id: 1 };
      this.collection.find(query, projection).toArray().then((data) => {
        const list = data.map(light => light.id);
        resolve(list);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  getPins() {
    return new Promise((resolve, reject) => {
      const query = {};
      const projection = { _id: 0, pin: 1 };
      this.collection.find(query, projection).toArray().then((data) => {
        let list = data.map(light => light.pin);
        list = [...new Set(list)];
        resolve(list);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  getPin(id) {
    return new Promise((resolve, reject) => {
      const query = { id: parseInt(id, 10) };
      const projection = { _id: 0, pin: 1 };
      this.collection.findOne(query, projection).then((data) => {
        let pin;
        if (data) {
          pin = data.pin;
          resolve(pin);
        } else {
          reject(new Error(`Light not found (ID: ${id})`));
        }
      }).catch((err) => {
        reject(err);
      });
    });
  },
  updateState(id, state) {
    return new Promise((resolve, reject) => {
      const query = { id: parseInt(id, 10) };
      const update = { $set: { state } };
      this.collection.update(query, update).then(() => {
        resolve(state);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  updateRoom(id, state) {
    return new Promise((resolve, reject) => {
      const query = { room_id: parseInt(id, 10) };
      const update = { $set: { state } };
      const multi = { multi: true };
      this.collection.update(query, update, multi).then(() => {
        resolve();
      }).catch((err) => {
        reject(err);
      });
    });
  },
};

const thermometers = {
  collection: undefined,
  getList(roomId) {
    return new Promise((resolve, reject) => {
      const query = {};
      const projection = { _id: 0, id: 1 };
      this.collection.find(query, projection).toArray().then((data) => {
        const list = data.map(thermometer => thermometer.id);
        resolve(list);
      }).catch((err) => {
        reject(err);
      });
    });
  },
  getTemp(id) {
    return new Promise((resolve, reject) => {
      const query = { id: parseInt(id, 10) };
      const projection = { temps: { $slice: -1 }, _id: 0, id: 0, description: 0 };
      this.collection.findOne(query, projection).then((data) => {
        let dateAndTemp;
        if (data) {
          dateAndTemp = data.temps[0];
          resolve(dateAndTemp);
        } else {
          reject(new Error(`Therm ometer not found (ID: ${id})`));
        }
      }).catch((err) => {
        reject(err);
      });
    });
  },
  getData(id) {
    return new Promise((resolve, reject) => {
      const query = { id: parseInt(id, 10) };
      const projection = { _id: 0, device_id: 0, temps: 0 };
      this.collection.findOne(query, projection).then((data) => {
        if (data) {
          resolve(data);
        } else {
          reject(new Error(`Thermometer not found (ID: ${id})`));
        }
      }).catch((err) => {
        reject(err);
      });
    });
  },
};

class DB {
  constructor(url) {
    this.url = url;
    this.rooms = rooms;
    this.lights = lights;
    this.thermometers = thermometers;
  }

  connect() {
    return mongo.connect(this.url);
  }
}

module.exports = DB;
