import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import User from "@/models/User"
import connectDB from "@/lib/db"

export async function POST(request: Request) {
  try {
    // Connect to MongoDB
    await connectDB()

    // Parse the request body
    const {
      email,
      password,
      username,
      accountType,
      niche,
      interests,
      socialMediaProfiles,
      associatedCompany,
      level,
    } = await request.json()

    // Validate required fields
    if (!email || !password || !username || !accountType) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      )
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      )
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      username,
      accountType,
      // Influencer-specific fields
      ...(accountType === "INFLUENCER" && { niche, interests, socialMediaProfiles }),
      // Campaign Manager-specific fields
      ...(accountType === "CAMPAIGN_MANAGER" && { associatedCompany, level }),
    })

    // Save the user to the database
    await newUser.save()

    // Return the created user (without the password)
    const userResponse = { ...newUser.toObject(), password: undefined }
    return NextResponse.json({ user: userResponse }, { status: 201 })
  } catch (error) {
    console.error("Error in signup route:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}