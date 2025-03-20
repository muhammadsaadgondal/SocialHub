import mongoose from "mongoose"
import connectDB from "@/lib/db"

async function testConnection() {
  try {
    await connectDB()
    console.log("✅ MongoDB connection successful")
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error)
  } finally {
    await mongoose.disconnect()
  }
}

testConnection()