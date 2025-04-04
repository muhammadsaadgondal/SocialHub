import { type NextRequest, NextResponse } from "next/server";
import { getUserProfileByUsername } from "@/lib/user-controller";

// GET a specific user by username
export async function GET(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  try {
    const {username} = await params;
    const user = await getUserProfileByUsername(username);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(`Error in GET /api/users/username/${(await params).username}:`, error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
