const mongoose = require('mongoose');

module.exports.connectDb = () => {
  mongoose.connect('mongodb://localhost/bitfilmsdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
};
