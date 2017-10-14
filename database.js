const { MongoClient: mongo } = require('mongodb');
// const LogUpdater = require('./log.js');

// const log = new LogUpdater();

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
};

class DB {
  constructor(url) {
    this.url = url;
    this.lights = lights;
  }

  connect() {
    return mongo.connect(this.url);
  }
}

module.exports = DB;
