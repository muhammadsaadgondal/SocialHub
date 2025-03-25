import SocialMediaAccount from "@/models/SocialMediaAccount";
import connectDB from "@/lib/db";
import { fetchFacebookData, fetchInstagramData, fetchLinkedInData, fetchTwitterData, fetchYoutubeData } from "./fetchData";

export const saveSocialAccount = async (userId: string, platform: string, accessToken: string) => {
  await connectDB();

  let data;
  let additionalParam;
  console.log("ACCESS TOKEN TEST :", userId, platform, accessToken)
  switch (platform) {
    case "facebook-dashboard":
      data = await fetchFacebookData(accessToken);
      break;
    case "youtube-dashboard":
        data = await fetchYoutubeData(accessToken);
      break;
    case "linkedin-dashboard":
      additionalParam = await fetchLinkedInOrganizationId(accessToken);
      if (additionalParam) {
        data = await fetchLinkedInData(accessToken, additionalParam);
      } else {
        throw new Error("Failed to fetch LinkedIn Organization ID");
      }
      break;
    case "twitter-dashboard":
      additionalParam = await fetchTwitterUsername(accessToken);
      if (additionalParam) {
        data = await fetchTwitterData(accessToken, additionalParam);
      } else {
        throw new Error("Failed to fetch Twitter Username");
      }
      break;
  }

  console.log("DATA FINAL :", data);
  // Save the account and data to the database
  // const account = new SocialMediaAccount({
  //   userId,
  //   platform: platform.replace("-dashboard", ""),
  //   accessToken,
  //   followers: data?.followers || 0,
  //   posts: data?.posts || 0,
  //   engagementRate: data && 'engagementRate' in data ? data.engagementRate : 0,
  // });
  // await account.save();
};


export const fetchYoutubeChannelId = async (accessToken: string): Promise<string | null> => {
  try {

    console.log("FETCHING CHANNEL ID ")
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&mine=true`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/json",
        },
      }
    );

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].id;
    }
    return null;
  } catch (error) {
    console.error("Error fetching YouTube Channel ID:", error);
    return null;
  }
};


export const fetchLinkedInOrganizationId = async (accessToken: string): Promise<string | null> => {
  try {
    const response = await fetch(`https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Restli-Protocol-Version": "2.0.0",
        Accept: "application/json",
      },
    });

    const data = await response.json();
    if (data.elements && data.elements.length > 0) {
      const organizationUrn = data.elements[0]["organizationalTarget"];
      return organizationUrn.split(":").pop(); // Extracts the numeric ID from URN
    }
    return null;
  } catch (error) {
    console.error("Error fetching LinkedIn Organization ID:", error);
    return null;
  }
};

export const fetchTwitterUsername = async (bearerToken: string): Promise<string | null> => {
  try {
    const response = await fetch("https://api.twitter.com/2/users/me", {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
        Accept: "application/json",
      },
    });

    const data = await response.json();
    if (data.data) {
      return data.data.username;
    }
    return null;
  } catch (error) {
    console.error("Error fetching Twitter Username:", error);
    return null;
  }
};


