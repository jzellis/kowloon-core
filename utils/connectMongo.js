
import mongoose from 'mongoose';

const connectMongo = async () => mongoose.connect(process.env.MONGO_URI, {
    autoIndex: true
  }).then(() => {
    console.log("Successfully connected to database");
  })
  .catch((error) => {
    console.log("database connection failed. exiting now...");
    console.error(error);
    process.exit(1);
  });;
export default connectMongo;


