const mongoose = require('mongoose');
const { mongo } = require('../../config/vars');

const setupTestDB = () => {
  beforeAll(async () => {
    await mongoose.connect(mongo.uri, {
      keepAlive: true,
      useNewUrlParser: true,
    });
  });

  beforeEach(async () => {
    await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany()));
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};

module.exports = setupTestDB;
