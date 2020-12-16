import mongoose from 'mongoose';

// eslint-disable-next-line no-console
async function connectDB(): Promise<void> {
  try {
    await mongoose.connect(process.env.DATABASE_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true,
    });
    console.log('⛵ successfully connected 🚣');
  } catch (error) {
    console.log(error);
  }
}

export default connectDB;
