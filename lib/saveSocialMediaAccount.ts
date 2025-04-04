import SocialMediaAccount from "@/models/SocialMediaAccount";
import { connectDB, getCurrentUserId } from "@/lib/api";
import { fetchFacebookData, fetchYoutubeData } from "./fetchData";
import mongoose from "mongoose";

export const saveSocialAccount = async (platform: string, accessToken: string) => {
  try {
    await connectDB();

    // Validate userId
    const userId = await getCurrentUserId();
    try {
      // Assuming userId is already validated by getCurrentUserId
    } catch (idError) {
      console.error("Error converting userId:", idError);
      throw new Error(`Invalid userId: ${userId}`);
    }

    let data;
    console.log("ACCESS TOKEN TEST:", userId, platform, accessToken);

    switch (platform) {
      case "facebook-dashboard":
        data = await fetchFacebookData(accessToken);
        break;
      case "youtube-dashboard":
        data = await fetchYoutubeData(accessToken);
        break;
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }

    console.log("DATA FINAL:", data);

    if (data && platform === "facebook-dashboard" && "facebook" in data ) {
      console.log(`SAVING ${platform} DATA`);
      try {
        const FbAccount = new SocialMediaAccount({
          userId,
          platform: "facebook",
          handle: data.facebook.username,
          accessToken,
          followers: data.facebook.followers || 0,
          posts: data.facebook.posts || 0,
          engagementRate: data.facebook.engagementRate || 0,
          followersGrowth: data.facebook.followersGrowth || {}, // Week-wise growth
          recentEngagement: {
            total: data.facebook.recentEngagement.total || 0,
            topPosts: data.facebook.recentEngagement.topPosts || []
          }
        });
        await FbAccount.save();

        const instaAccount = new SocialMediaAccount({
          userId,
          platform: "instagram",
          handle: data.instagram.username,
          accessToken,
          followers: data.instagram.followers || 0,
          posts: data.instagram.posts || 0,
          engagementRate: data.instagram.engagementRate || 0,
          followersGrowth: data.instagram.followersGrowth || {}, // Week-wise growth
          recentEngagement: {
            total: data.instagram.recentEngagement.total || 0,
            topPosts: data.instagram.recentEngagement.topPosts || []
          }
        });
        await instaAccount.save();

        console.log("Facebook account saved:", FbAccount);
        console.log("Instagram account saved:", instaAccount);
      } catch (error) {
        console.error("Error saving Facebook/Instagram accounts:", error);
        throw error;
      }
    }

    if (data && platform === "youtube-dashboard" && "youtube" in data) {
      console.log(`SAVING ${platform} DATA`);
      try {
        const account = new SocialMediaAccount({
          userId,
          platform: "youtube",
          handle: data.youtube.username,
          accessToken,
          followers: data.youtube.subscribers || 0,
          posts: data.youtube.videos || 0,
          engagementRate: data.youtube.engagementRate || 0,
          followersGrowth: data.youtube.followersGrowth || {}, // Current count + note
          recentEngagement: {
            total: data.youtube.recentEngagement.total || 0,
            topPosts: data.youtube.recentEngagement.topPosts || []
          }
        });
        await account.save();
        console.log("YouTube account saved:", account);
      } catch (error) {
        console.error("Error saving YouTube account:", error);
        throw error;
      }
    }
  } catch (error) {
    console.error("Error in saveSocialAccount:", error);
    throw error;
  }
};