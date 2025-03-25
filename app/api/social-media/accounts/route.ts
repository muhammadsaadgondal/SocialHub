import { NextResponse } from "next/server";
import SocialMediaAccount from "@/models/SocialMediaAccount";
import connectDB from "@/lib/db";

export async function POST(request: Request) {
  await connectDB();

  try {
    const { userId, platform, handle, accessToken, refreshToken, expiresAt } = await request.json();

    const account = new SocialMediaAccount({
      userId,
      platform,
      handle,
      accessToken,
      refreshToken,
      expiresAt,
    });
    await account.save();

    return NextResponse.json({ message: "Account added successfully", account }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add account" }, { status: 500 });
  }
}