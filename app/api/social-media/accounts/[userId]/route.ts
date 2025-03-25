import { NextResponse } from "next/server";
import SocialMediaAccount from "@/models/SocialMediaAccount";
import connectDB from "@/lib/db";

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  await connectDB();

  try {
    const { userId } = params;
    const accounts = await SocialMediaAccount.find({ userId });

    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch accounts" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { accountId: string } }) {
    await connectDB();
  
    try {
      const { accountId } = params;
      await SocialMediaAccount.findByIdAndDelete(accountId);
  
      return NextResponse.json({ message: "Account removed successfully" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to remove account" }, { status: 500 });
    }
  }