import { NextResponse } from "next/server";
import SocialMediaAccount from "@/models/SocialMediaAccount";
import connectDB from "@/lib/db";
import { fetchPlatformData } from "@/lib/fetchData";

export async function POST(request: Request, { params }: { params: { accountId: string } }) {
  await connectDB();

  try {
    const { accountId } = params;
    const account = await SocialMediaAccount.findById(accountId);

    if (!account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const data = await fetchPlatformData(account.platform, account.accessToken);
    account.followers = data.followers;
    account.posts = data.posts;
    account.engagementRate = data.engagementRate;
    await account.save();

    return NextResponse.json({ message: "Data refreshed successfully", account }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to refresh data" }, { status: 500 });
  }
}