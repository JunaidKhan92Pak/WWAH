
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// ✅ Extend globalThis safely
interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Ensure mongooseCache is always initialized
const globalWithMongoose = globalThis as unknown as { mongooseCache: MongooseCache };

// ✅ Initialize cache if not already present
globalWithMongoose.mongooseCache = globalWithMongoose.mongooseCache || { conn: null, promise: null };

export const connectToDatabase = async (): Promise<mongoose.Connection> => {
  const cache = globalWithMongoose.mongooseCache; // ✅ Always exists

  if (cache.conn) {
    console.log("Using existing database connection");
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(MONGODB_URI).then((conn) => conn.connection);
  }

  try {
    cache.conn = await cache.promise;
    console.log("New database connection established");
  } catch (error) {
    cache.promise = null; // Reset on failure
    throw new Error("Failed to connect to the database: " + error);
  }

  return cache.conn;
};
