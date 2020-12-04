const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true
  });

// eslint-disable-next-line no-console
mongoose.connection.on('error', (err) => console.log(err));
const db = mongoose.connection;

module.exports = db;