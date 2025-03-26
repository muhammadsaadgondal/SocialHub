import UserModel, { IUser } from "@/models/User";
import { ObjectId } from "mongodb";
import { connectDB } from "./api";

// Helper function to validate MongoDB ObjectId
export function isValidObjectId(id: string): boolean {
  try {
    new ObjectId(id);
    return true;
  } catch (error) {
    return false;
  }
}

// Get user by username (returns a plain JS object)
export async function getUserByUsername(username: string): Promise<IUser | null> {
  try {
    if (!username) {
      console.error("❌ Username is required");
      return null;
    }

    await connectDB();

    console.log("🔍 Querying user with username:", username);
    const user = await UserModel.findOne({ username }).lean() as IUser | null;

    if (!user) {
      console.warn("⚠️ No user found with username:", username);
    }

    return user;
  } catch (error) {
    console.error("❌ Error fetching user by username:", error);
    return null;
  }
}

// Get user by ID (returns a plain JS object)
export async function getUserById(id: string): Promise<IUser | null> {
  try {
    if (!id || !isValidObjectId(id)) {
      console.error("❌ Invalid user ID format:", id);
      return null;
    }

    await connectDB();

    console.log("🔍 Querying user with ID:", id);
    const user = await UserModel.findById(id).lean() as IUser | null;

    if (!user) {
      console.warn("⚠️ No user found with ID:", id);
    }

    return user;
  } catch (error) {
    console.error("❌ Error fetching user by ID:", error);
    return null;
  }
}

// Optional: Get user profile by username (wrapper around getUserByUsername)
export async function getUserProfile(username: string): Promise<IUser | null> {
  return getUserByUsername(username);
}

// Update user by ID; returns the updated document
export async function updateUser(userId: string, data: Partial<IUser>): Promise<IUser | null> {
  try {
    if (!userId || !isValidObjectId(userId)) {
      console.error("❌ Invalid user ID format:", userId);
      return null;
    }

    await connectDB();

    console.log("🛠️ Updating user:", userId);
    const updatedUser = await UserModel.findByIdAndUpdate(userId, data, { new: true }).lean() as IUser | null;

    if (!updatedUser) {
      console.warn("⚠️ No user found to update with ID:", userId);
    }

    return updatedUser;
  } catch (error) {
    console.error("❌ Error updating user:", error);
    return null;
  }
}