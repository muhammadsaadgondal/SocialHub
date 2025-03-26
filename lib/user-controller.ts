import User from "@/models/User"
import { connectDB } from "./api"

export type UserProfile = {
  _id?: string
  username?: string
  email?: string
  name?: string
  bio?: string
  profileImage?: string
  location?: string
  website?: string
  accountType?: string
  status?: string
  memberSince?: Date
  niche?: string
  interests?: string[]
  socialLinks?: {
    platform: string
    url: string
  }[]
}

/**
 * Fetches a user profile by username
 */
export async function getUserProfileByUsername(username: string): Promise<UserProfile | null> {
  try {
    // Ensure MongoDB is connected
    await connectDB();

    // Find the user by username
    const user = await User.findOne({ username }).lean()

    if (!user) {
      console.error(`User not found with username: ${username}`)
      return null
    }

    // Transform the user document to match our UserProfile type
    return transformUserToProfile(user)
  } catch (error) {
    console.error("Error fetching user profile by username:", error)
    return null
  }
}

/**
 * Fetches a user profile by ID
 */
export async function getUserProfileById(userId: string): Promise<UserProfile | null> {
  try {
    // Ensure MongoDB is connected
    await connectDB();

    // Find the user by ID
    const user = await User.findById(userId).lean()

    if (!user) {
      console.error(`User not found with ID: ${userId}`)
      return null
    }

    // Transform the user document to match our UserProfile type
    return transformUserToProfile(user)
  } catch (error) {
    console.error("Error fetching user profile by ID:", error)
    return null
  }
}

/**
 * Transform a Mongoose user document to our UserProfile type
 */
function transformUserToProfile(user: any): UserProfile {
  return {
    _id: user._id.toString(),
    username: user.username,
    email: user.email,
    name: user.name || user.username, // Fallback to username if name is not set
    bio: user.bio,
    profileImage: user.profileImage,
    location: user.location,
    website: user.website,
    accountType: user.accountType,
    status: user.status,
    memberSince: user.createdAt,
    niche: user.niche,
    interests: user.interests || [],
    // Transform socialMediaProfiles to socialLinks format
    socialLinks:
      user.socialMediaProfiles?.map((profile: any) => ({
        platform: profile.platform,
        url: profile.url,
      })) || [],
  }
}

/**
 * Formats the member since date to show month name
 */
export function formatMemberSince(date: Date | string | undefined): string {
  if (!date) return "Unknown"

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const d = new Date(date)
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}