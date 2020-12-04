const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/minionsOfD',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  });

// eslint-disable-next-line no-console
mongoose.connection.on('error', (err) => console.log(err));
const db = mongoose.connection;

module.exports = db;