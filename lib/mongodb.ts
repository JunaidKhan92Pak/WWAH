// import { MongoClient } from "mongodb";

// if (!process.env.MONGODB_URI) {
//   throw new Error("Please define the MONGODB_URI environment variable");
// }

// const uri = process.env.MONGODB_URI;
// let client: MongoClient;
// let clientPromise: Promise<MongoClient>;

// if (process.env.NODE_ENV === "development") {
//   // In development mode, use a global variable so that the value
//   // is preserved across module reloads caused by HMR (Hot Module Replacement).
//   const globalWithMongo = global as typeof global & {
//     _mongoClientPromise?: Promise<MongoClient>;
//   };

//   if (!globalWithMongo._mongoClientPromise) {
//     client = new MongoClient(uri);
//     globalWithMongo._mongoClientPromise = client.connect();
//   }
//   clientPromise = globalWithMongo._mongoClientPromise;
// } else {
//   // In production mode, it's best to not use a global variable.
//   client = new MongoClient(uri);
//   clientPromise = client.connect();
// }

// export default clientPromise;
// lib/mongodb.ts
import { MongoClient } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

interface MongoClientCache {
  client: MongoClient | null;
  promise: Promise<MongoClient> | null;
}

const globalWithMongo = globalThis as unknown as {
  mongoClientCache: MongoClientCache;
};

globalWithMongo.mongoClientCache = globalWithMongo.mongoClientCache || {
  client: null,
  promise: null,
};

async function connectToMongo(): Promise<MongoClient> {
  const cache = globalWithMongo.mongoClientCache;

  if (cache.client) {
    console.log("Using existing MongoDB client connection");
    return cache.client;
  }

  if (!cache.promise) {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 15000, 
      socketTimeoutMS: 60000,
    };
    
    cache.promise = MongoClient.connect(MONGODB_URI, options);
  }

  try {
    cache.client = await cache.promise;
    console.log("New MongoDB client connection established");
  } catch (error) {
    cache.promise = null; // Reset on failure
    throw new Error("Failed to connect to MongoDB: " + error);
  }

  return cache.client;
}

const clientPromise = connectToMongo();
export default clientPromise;