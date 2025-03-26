import { type NextRequest, NextResponse } from "next/server"
import {  getUserByUsername } from "@/lib/user-service"
import { createUser } from "@/lib/user-api"

// GET all users (you might want to add pagination later)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const username = searchParams.get("username")

    if (username) {
      const user = await getUserByUsername(username)
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }
      return NextResponse.json(user)
    }

    // If you want to implement getting all users, you can add that logic here
    return NextResponse.json({ error: "Username parameter is required" }, { status: 400 })
  } catch (error) {
    console.error("Error in GET /api/users:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// POST - Create a new user
export async function POST(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validate required fields
    if (!userData.username || !userData.email || !userData.name) {
      return NextResponse.json({ error: "Username, email, and name are required" }, { status: 400 })
    }

    // Check if username already exists
    const existingUser = await getUserByUsername(userData.username)
    if (existingUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 409 })
    }

    // Add creation date
    userData.memberSince = new Date().toISOString()

    const result = await createUser(userData)
    return NextResponse.json({ message: "User created successfully", id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/users:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}