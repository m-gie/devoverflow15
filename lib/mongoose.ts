import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MongoDB connection string is required");
}

interface MongooseCache {
  connection: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { connection: null, promise: null };
}

const dbConnect = async (): Promise<Mongoose> => {
  console.log("starting connection to DB");
  if (cached.connection) {
    console.log("using cached connection");
    return cached.connection;
  }
  if (!cached.promise) {
    console.log("creating new connection");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "devflow15",
      })
      .then((result) => {
        console.log("Connected to MongoDB");
        return result;
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB", error);
        return error;
      });
  }
  cached.connection = await cached.promise;
  return cached.connection;
};

export default dbConnect;
