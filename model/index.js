const mongoose = require('mongoose');


// eslint-disable-next-line no-console
async function connectDB () {
  console.log(process.env.DATABASE_CONNECTION);
  try {
    await mongoose.connect(process.env.DATABASE_CONNECTION,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true,
      });
      console.log('successfully connected')
  } catch (error) {
    console.log(error);
  }
  

}

module.exports = connectDB;