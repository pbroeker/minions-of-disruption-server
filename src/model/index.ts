import mongoose from 'mongoose';

async function connectDB(): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await mongoose.connect(process.env.DATABASE_CONNECTION, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
      useCreateIndex: true,
    });
    console.log('db: ', process.env.DATABASE_CONNECTION);
    console.log('⛵ successfully connected 🚣');
  } catch (error) {
    console.log(error);
  }
}

export default connectDB;
