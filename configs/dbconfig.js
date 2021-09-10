const mongoose = require('mongoose');
const { MONGODB_PATH } = require('./config');

module.exports.connectDb = () => {
  mongoose.connect(MONGODB_PATH, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};
