import mongoose from 'mongoose';

// eslint-disable-next-line no-console
async function connectDB(): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    await mongoose.connect(
      'mongodb+srv://awesomeMinions:ES8w2kgUgSj7@cluster0.qaxna.mongodb.net/minionsOfD?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: true,
        useCreateIndex: true,
      }
    );
    console.log('⛵ successfully connected 🚣');
  } catch (error) {
    console.log(error);
  }
}

export default connectDB;
