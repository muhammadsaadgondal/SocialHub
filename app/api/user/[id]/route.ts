import { type NextRequest, NextResponse } from "next/server";
import { getUserById, updateUser, getUserByUsername, isValidObjectId } from "@/lib/user-service";
import type { IUser } from "@/models/User"; // Ensure User type is imported

// GET a specific user by ID
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string } >}) {
  try {
    const id = (await params).id;
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(`Error in GET /api/users/${(await params).id}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT - Update a user (full replace)
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params;
    const userData = await request.json();

    // Check if user exists
    const existingUser = await getUserById(id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent changing username to one that already exists
    if (userData.username !== existingUser.username) {
      const userWithSameUsername = await getUserByUsername(userData.username);
      if (
        userWithSameUsername &&
        userWithSameUsername._id &&
        userWithSameUsername._id.toString() !== id
      ) {
        return NextResponse.json({ error: "Username already taken" }, { status: 409 });
      }
    }

    // Add updatedAt timestamp
    userData.updatedAt = new Date().toISOString();

    // Update the user
    const result = await updateUser(id, userData);

    if (!result) {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }

    return NextResponse.json({
      message: "User updated successfully",
      user: result,
    });
  } catch (error) {
    console.error(`Error in PUT /api/users/${(await params).id}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PATCH - Partially update a user
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Validate if the id is a valid MongoDB ObjectId
    if (!id || !isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
    }

    const body = await req.json();

    // (Optional) Validate the request body here

    // Add updatedAt timestamp to partial update
    body.updatedAt = new Date().toISOString();

    const updatedUser = await updateUser(id, body);

    if (!updatedUser) {
      return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error in PATCH /api/user/[id]:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}