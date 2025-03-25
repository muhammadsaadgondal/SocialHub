import axios from "axios";


export const fetchFacebookData = async (access_token: string) => {
  try {
    console.log('Starting fetchSocialMediaData with access_token:', access_token);

    // Default return object for both platforms
    const result = {
      facebook: { followers: 0, posts: 0, engagementRate: 0, totalShares: 0, totalImpressions: 0, followersGrowth: [] },
      instagram: { followers: 0, posts: 0, reach: 0, engagementRate: 0 }
    };

    // Step 1: Get the user's Facebook pages
    console.log('Fetching Facebook pages...');
    const facebookResponse = await axios.get(
      'https://graph.facebook.com/v18.0/me/accounts',
      { params: { access_token } }
    );

    if (!facebookResponse.data?.data?.length) {
      console.error('User does not manage a Facebook Page.');
      throw new Error('No Facebook Pages found for this user.');
    }

    // Step 2: Get the first managed Page
    const page = facebookResponse.data.data[0];
    const pageId = page.id;
    const pageAccessToken = page.access_token;
    console.log('Selected Page ID:', pageId, 'with Page Access Token:', pageAccessToken,'Page name: ',page.name);

    // Step 3: Get Facebook followers count
    console.log('Fetching Facebook followers...');
    const pageInfoResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}`,
      { params: { access_token: pageAccessToken, fields: 'followers_count' } }
    );
    result.facebook.followers = pageInfoResponse.data?.followers_count || 0;
    console.log('Facebook followers:', result.facebook.followers);

    // Step 4: Get Facebook post count
    console.log('Fetching Facebook posts...');
    const postsResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}/posts`,
      { params: { access_token: pageAccessToken, fields: 'id' } }
    );
    result.facebook.posts = postsResponse.data?.data?.length || 0;
    console.log('Facebook post count:', result.facebook.posts);

    // Step 5: Get Facebook engagement metrics (likes, comments, shares)
    console.log('Fetching Facebook engagement data...');
    const engagementsResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}/posts`,
      {
        params: {
          access_token: pageAccessToken,
          fields: 'id,shares,likes.summary(true),comments.summary(true)',
          since: '2025-02-24', // Previous month start
          until: '2025-03-24'  // Current date
        }
      }
    );

    let totalEngagements = 0;
    let totalShares = 0;
    engagementsResponse.data.data.forEach((post: any) => {
      const likes = post.likes?.summary?.total_count || 0;
      const comments = post.comments?.summary?.total_count || 0;
      const shares = post.shares?.count || 0;
      totalEngagements += likes + comments + shares;
      totalShares += shares;
    });
    result.facebook.totalShares = totalShares;
    result.facebook.engagementRate = result.facebook.followers > 0
      ? (totalEngagements / result.facebook.followers) * 100
      : 0;
    console.log('Facebook engagement rate:', result.facebook.engagementRate, 'Total shares:', totalShares);

    // Step 6: Get Facebook total impressions
    console.log('Fetching Facebook impressions...');
    const impressionsResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}/insights/page_impressions`,
      { params: { access_token: pageAccessToken, since: '2025-02-24', until: '2025-03-24' } }
    );
    result.facebook.totalImpressions = impressionsResponse.data?.data[0]?.values.reduce((sum: number, val: any) => sum + val.value, 0) || 0;
    console.log('Facebook total impressions:', result.facebook.totalImpressions);

    // Step 7: Get Facebook followers growth over time
    console.log('Fetching Facebook followers growth...');
    const followersGrowthResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}/insights/page_fans?since=2025-02-24&until=2025-03-24`,
      { params: { access_token: pageAccessToken } }
    );
    result.facebook.followersGrowth = followersGrowthResponse.data?.data[0]?.values || [];
    console.log('Facebook followers growth:', result.facebook.followersGrowth);

    // Step 8: Get Instagram Business Account ID from the Facebook Page
    console.log('Fetching linked Instagram Business Account...');
    const instagramResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}`,
      {
        params: {
          access_token: pageAccessToken,
          fields: 'instagram_business_account'
        }
      }
    );
    const instagramAccountId = instagramResponse.data?.instagram_business_account?.id;
    if (!instagramAccountId) {
      console.warn('No Instagram Business Account linked to this Facebook Page.');
    } else {
      console.log('Instagram Account ID:', instagramAccountId);

      // Step 9: Get Instagram followers and media count
      console.log('Fetching Instagram profile data...');
      const instagramProfileResponse = await axios.get(
        `https://graph.facebook.com/v18.0/${instagramAccountId}`,
        {
          params: {
            access_token,
            fields: 'followers_count,media_count'
          }
        }
      );
      result.instagram.followers = instagramProfileResponse.data?.followers_count || 0;
      result.instagram.posts = instagramProfileResponse.data?.media_count || 0;
      console.log('Instagram followers:', result.instagram.followers, 'Posts:', result.instagram.posts);

      // Step 10: Get Instagram media and engagement for the previous month
      console.log('Fetching Instagram media and engagement data...');
      const instagramMediaResponse = await axios.get(
        `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
        {
          params: {
            access_token,
            fields: 'id,like_count,comments_count,timestamp',
            since: '2025-02-24', // Previous month start
            until: '2025-03-24'  // Current date
          }
        }
      );

      let totalEngagements = 0;
      instagramMediaResponse.data.data.forEach((post: any) => {
        const likes = post.like_count || 0;
        const comments = post.comments_count || 0;
        totalEngagements += likes + comments;
        console.log(`Post ${post.id} (Date: ${post.timestamp}): Likes: ${likes}, Comments: ${comments}`);
      });
      result.instagram.engagementRate = result.instagram.followers > 0
        ? (totalEngagements / result.instagram.followers) * 100
        : 0;
      console.log('Instagram engagement rate:', result.instagram.engagementRate);

      // Step 11: Get Instagram reach for the previous month
      console.log('Fetching Instagram reach...');
      const instagramInsightsResponse = await axios.get(
        `https://graph.facebook.com/v18.0/${instagramAccountId}/insights`,
        {
          params: {
            access_token,
            metric: 'reach',
            period: 'day',
            since: '2025-02-24', // Previous month start
            until: '2025-03-24'  // Current date
          }
        }
      );
      result.instagram.reach = instagramInsightsResponse.data?.data[0]?.values.reduce((sum: number, val: any) => sum + val.value, 0) || 0;
      console.log('Instagram total reach for previous month:', result.instagram.reach);
    }

    console.log('Final data fetched successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Error in fetchSocialMediaData:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error(`Failed to fetch social media data: ${error.message}`);
  }
};



export const fetchYoutubeData = async (apiKey: string, channelId: string) => {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/youtube/v3/channels`,
      {
        params: {
          part: "statistics",
          id: channelId,
          key: apiKey,
        },
      }
    );

    const stats = response.data.items[0].statistics;
    return {
      followers: stats.subscriberCount,
      posts: stats.videoCount,
      totalImpressions: stats.viewCount, // Approximation using views
    };
  } catch (error) {
    console.error("Error fetching YouTube data:", error);
    return null;
  }
};


export const fetchLinkedInData = async (accessToken: string, organizationId: string) => {
  try {
    const followersResponse = await axios.get(
      `https://api.linkedin.com/v2/networkSizes/${organizationId}?edgeType=CompanyFollowedByMember`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const engagementResponse = await axios.get(
      `https://api.linkedin.com/v2/organizationalEntityShareStatistics?q=organizationalEntity&organizationalEntity=${organizationId}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const totalEngagements = engagementResponse.data.elements.reduce((acc: any, post: { totalShareStatistics: { shareCount: any; commentCount: any; }; }) => {
      return acc + post.totalShareStatistics.shareCount + post.totalShareStatistics.commentCount;
    }, 0);

    return {
      followers: followersResponse.data.firstDegreeSize,
      posts: engagementResponse.data.elements.length,
      engagementRate: totalEngagements,
    };
  } catch (error) {
    console.error("Error fetching LinkedIn data:", error);
    return null;
  }
};


export const fetchTwitterData = async (bearerToken: string, username: string) => {
  try {
    const userResponse = await axios.get(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: { Authorization: `Bearer ${bearerToken}` },
      }
    );

    const userId = userResponse.data.data.id;

    const statsResponse = await axios.get(
      `https://api.twitter.com/2/users/${userId}?user.fields=public_metrics`,
      {
        headers: { Authorization: `Bearer ${bearerToken}` },
      }
    );

    const stats = statsResponse.data.data.public_metrics;
    return {
      followers: stats.followers_count,
      posts: stats.tweet_count,
      engagementRate: stats.retweet_count + stats.reply_count + stats.like_count,
    };
  } catch (error) {
    console.error("Error fetching Twitter data:", error);
    return null;
  }
};


export const fetchInstagramData = async (accessToken: string, instagramId: string) => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/${instagramId}?fields=followers_count,media_count`,
      { params: { access_token: accessToken } }
    );

    const insightsResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${instagramId}/insights?metric=impressions,reach`,
      { params: { access_token: accessToken } }
    );

    const totalImpressions = insightsResponse.data.data.find((m: { name: string; }) => m.name === "impressions")?.values[0]?.value || 0;

    return {
      followers: response.data.followers_count,
      posts: response.data.media_count,
      totalImpressions,
    };
  } catch (error) {
    console.error("Error fetching Instagram data:", error);
    return null;
  }
};
