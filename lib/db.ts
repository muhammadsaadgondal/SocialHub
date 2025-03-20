import mongoose, { Mongoose } from "mongoose"

const MONGODB_URI: string = process.env.MONGODB_URI || ""

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

let cached: { conn: Mongoose | null; promise: Promise<Mongoose> | null } = {
  conn: null,
  promise: null,
}

async function connectDB(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "mydatabase", // Specify the database name here
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default connectDB