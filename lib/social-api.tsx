import SocialMediaAccount from "@/models/SocialMediaAccount";
import connectDB from "@/lib/db";
import { fetchFacebookData, fetchYouTubeData } from "@/lib/fetchData";

export const fetchSocialAccounts = async (userId: string) => {
  await connectDB();
  const accounts = await SocialMediaAccount.find({ userId });
  return accounts;
};
export const fetchOverviewAnalytics = async (userId: string) => {
  await connectDB();
  const accounts = await SocialMediaAccount.find({ userId });

  const analytics = await Promise.all(
    accounts.map(async (account) => {
      let data;
      switch (account.platform) {
        case "facebook":
          data = await fetchFacebookData(account.accessToken);
          break;
        case "youtube":
          data = await fetchYouTubeData(account.accessToken);
          break;
        // Add cases for other platforms
      }
      return {
        platform: account.platform,
        followers: data?.followers || 0,
        posts: data?.posts || 0,
        engagementRate: data?.engagementRate || 0,
      };
    })
  );

  return analytics;
};
export const refreshSocialData = async (userId: string) => {
  await connectDB();
  const accounts = await SocialMediaAccount.find({ userId });

  await Promise.all(
    accounts.map(async (account) => {
      let data;
      switch (account.platform) {
        case "facebook":
          data = await fetchFacebookData(account.accessToken);
          break;
        case "youtube":
          data = await fetchYouTubeData(account.accessToken);
          break;
        // Add cases for other platforms
      }

      account.followers = data?.followers || 0;
      account.posts = data?.posts || 0;
      account.engagementRate = data?.engagementRate || 0;
      await account.save();
    })
  );
};