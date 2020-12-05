const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_CONNECTION,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
    useCreateIndex: true,
  });

// eslint-disable-next-line no-console
mongoose.connection.on('error', (err) => console.log(err));
const db = mongoose.connection;

db.once('open', () => {
  console.log(' ⛵ DB is connected 🚣');
})

module.exports = db;