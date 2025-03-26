import { type NextRequest, NextResponse } from "next/server";
import { getUserProfileByUsername } from "@/lib/user-controller";

// GET a specific user by username
export async function GET(request: NextRequest, { params }: { params: { username: string } }) {
  try {
    const username = params.username;
    const user = await getUserProfileByUsername(username);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(`Error in GET /api/users/username/${params.username}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
