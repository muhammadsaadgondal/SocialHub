import axios from "axios";

export const fetchFacebookData = async (access_token: string) => {
  try {
    console.log('Starting fetchSocialMediaData with access_token:', access_token);

    const result = {
      facebook: {
        username: '',
        followers: 0,
        posts: 0,
        engagementRate: 0,
        totalShares: 0,
        totalImpressions: 0,
        followersGrowth: {}, // Will store week-wise growth for last month
        recentEngagement: { total: 0, topPosts: [] }
      },
      instagram: {
        username: '',
        followers: 0,
        posts: 0,
        reach: 0,
        engagementRate: 0,
        followersGrowth: {}, // Will store week-wise growth for last month
        recentEngagement: { total: 0, topPosts: [] }
      }
    };

    const currentDate = new Date();
    const oneMonthAgo = new Date(currentDate);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const sixDaysAgo = new Date(currentDate);
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

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

    // Step 2: Get the 2nd managed Page
    const page = facebookResponse.data.data[1];
    const pageId = page.id;
    const pageAccessToken = page.access_token;
    console.log('Selected Page ID:', pageId, 'with Page Access Token:', pageAccessToken, 'Page name: ', page.name);

    // Step 3: Get Facebook followers count
    console.log('Fetching Facebook followers...');
    const pageInfoResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}`,
      {
        params: {
          access_token: pageAccessToken,
          fields: 'followers_count,username,name,instagram_business_account{username}'
        }
      }
    );
    result.facebook.username = pageInfoResponse.data.name || '';
    result.facebook.followers = pageInfoResponse.data?.followers_count || 0;
    console.log('Facebook followers:', result.facebook.followers);

    if (pageInfoResponse.data.instagram_business_account?.username) {
      result.instagram.username = pageInfoResponse.data.instagram_business_account.username;
    }

    // Step 4: Get Facebook post count
    console.log('Fetching Facebook posts...');
    const postsResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}/posts`,
      { params: { access_token: pageAccessToken, fields: 'id' } }
    );
    result.facebook.posts = postsResponse.data?.data?.length || 0;
    console.log('Facebook post count:', result.facebook.posts);

    // Step 5: Get Facebook engagement metrics (likes, comments, shares) - Last month
    console.log('Fetching Facebook engagement data...');
    const engagementsResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}/posts`,
      {
        params: {
          access_token: pageAccessToken,
          fields: 'id,shares,likes.summary(true),comments.summary(true)',
          since: oneMonthAgo.toISOString().split('T')[0],
          until: currentDate.toISOString().split('T')[0]
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

    // Step 6: Get Facebook total impressions - Last month
    console.log('Fetching Facebook impressions...');
    const impressionsResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}/insights/page_impressions`,
      {
        params: {
          access_token: pageAccessToken,
          since: oneMonthAgo.toISOString().split('T')[0],
          until: currentDate.toISOString().split('T')[0]
        }
      }
    );
    result.facebook.totalImpressions = impressionsResponse.data?.data[0]?.values.reduce((sum: number, val: any) => sum + val.value, 0) || 0;
    console.log('Facebook total impressions:', result.facebook.totalImpressions);

    // Step 7: Get Facebook followers growth - Last month, week-wise
    console.log('Fetching Facebook followers growth...');
    const followersGrowthResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}/insights/page_fans`,
      {
        params: {
          access_token: pageAccessToken,
          since: oneMonthAgo.toISOString().split('T')[0],
          until: currentDate.toISOString().split('T')[0],
          period: 'day' // Fetch daily data to aggregate into weeks
        }
      }
    );

    const dailyData = followersGrowthResponse.data?.data[0]?.values || [];
    const weekWiseGrowth: { [key: string]: number } = {};
    dailyData.forEach((entry: any) => {
      const date = new Date(entry.end_time);
      const daysSinceStart = Math.floor(((date as Date).getTime() - (oneMonthAgo as Date).getTime()) / (1000 * 60 * 60 * 24));
      const weekNumber = Math.min(Math.floor(daysSinceStart / 7) + 1, 4); // Cap at 4 weeks
      weekWiseGrowth[`week${weekNumber}`] = entry.value; // Last value of each week
    });
    result.facebook.followersGrowth = weekWiseGrowth;
    console.log('Facebook followers growth (last month, week-wise):', result.facebook.followersGrowth);

    // Step 8: Get last 6 days engagement and top posts
    console.log('Fetching recent Facebook posts...');
    const recentPostsResponse = await axios.get(
      `https://graph.facebook.com/v18.0/${pageId}/posts`,
      {
        params: {
          access_token: pageAccessToken,
          fields: 'id,created_time,shares,likes.summary(true),comments.summary(true),message',
          since: sixDaysAgo.toISOString().split('T')[0],
          until: currentDate.toISOString().split('T')[0]
        }
      }
    );

    const postsWithEngagement = recentPostsResponse.data.data.map((post: any) => {
      const engagement = (post.likes?.summary?.total_count || 0) +
        (post.comments?.summary?.total_count || 0) +
        (post.shares?.count || 0);
      return { ...post, engagement };
    });

    result.facebook.recentEngagement.total = postsWithEngagement.reduce((sum: number, post: any) => sum + post.engagement, 0);
    result.facebook.recentEngagement.topPosts = postsWithEngagement
      .sort((a: any, b: any) => b.engagement - a.engagement)
      .slice( 0, 3)
      .map((post: any) => ({
        id: post.id,
        message: post.message?.substring(0, 50) || '',
        engagement: post.engagement,
        created_time: post.created_time
      }));

    // Step 9: Get Instagram Business Account ID
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

    if (instagramAccountId) {
      console.log('Instagram Account ID:', instagramAccountId);

      // Step 10: Get Instagram followers growth - Last month, week-wise
      console.log('Fetching Instagram followers growth...');
      const igFollowersGrowthResponse = await axios.get(
        `https://graph.facebook.com/v18.0/${instagramAccountId}/insights`,
        {
          params: {
            access_token,
            metric: 'follower_count',
            period: 'day',
            since: oneMonthAgo.toISOString().split('T')[0],
            until: currentDate.toISOString().split('T')[0]
          }
        }
      );

      const igDailyData = igFollowersGrowthResponse.data?.data[0]?.values || [];
      const igWeekWiseGrowth: { [key: string]: number } = {};
      igDailyData.forEach((entry: any) => {
        const date = new Date(entry.end_time);
        const daysSinceStart = Math.floor((date.getTime() - oneMonthAgo.getTime()) / (1000 * 60 * 60 * 24));
        const weekNumber = Math.min(Math.floor(daysSinceStart / 7) + 1, 4); // Cap at 4 weeks
        igWeekWiseGrowth[`week${weekNumber}`] = entry.value; // Last value of each week
      });
      result.instagram.followersGrowth = igWeekWiseGrowth;
      console.log('Instagram followers growth (last month, week-wise):', result.instagram.followersGrowth);

      // Step 11: Get Instagram followers and media count
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

      // Step 12: Get Instagram media and engagement - Last month
      console.log('Fetching Instagram media and engagement data...');
      const instagramMediaResponse = await axios.get(
        `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
        {
          params: {
            access_token,
            fields: 'id,like_count,comments_count,timestamp',
            since: oneMonthAgo.toISOString().split('T')[0],
            until: currentDate.toISOString().split('T')[0]
          }
        }
      );

      let totalEngagements = 0;
      instagramMediaResponse.data.data.forEach((post: any) => {
        const likes = post.like_count || 0;
        const comments = post.comments_count || 0;
        totalEngagements += likes + comments;
      });
      result.instagram.engagementRate = result.instagram.followers > 0
        ? (totalEngagements / result.instagram.followers) * 100
        : 0;

      // Step 13: Get Instagram reach - Last month
      console.log('Fetching Instagram reach...');
      const instagramInsightsResponse = await axios.get(
        `https://graph.facebook.com/v18.0/${instagramAccountId}/insights`,
        {
          params: {
            access_token,
            metric: 'reach',
            period: 'day',
            since: oneMonthAgo.toISOString().split('T')[0],
            until: currentDate.toISOString().split('T')[0]
          }
        }
      );
      result.instagram.reach = instagramInsightsResponse.data?.data[0]?.values.reduce((sum: number, val: any) => sum + val.value, 0) || 0;

      // Step 14: Get Instagram recent engagement - Last 6 days
      console.log('Fetching recent Instagram posts...');
      const igRecentMediaResponse = await axios.get(
        `https://graph.facebook.com/v18.0/${instagramAccountId}/media`,
        {
          params: {
            access_token,
            fields: 'id,like_count,comments_count,timestamp,caption',
            since: sixDaysAgo.toISOString().split('T')[0],
            until: currentDate.toISOString().split('T')[0]
          }
        }
      );

      const igPostsWithEngagement = igRecentMediaResponse.data.data.map((post: any) => {
        const engagement = (post.like_count || 0) + (post.comments_count || 0);
        return { ...post, engagement };
      });

      result.instagram.recentEngagement.total = igPostsWithEngagement.reduce((sum: number, post: any) => sum + post.engagement, 0);
      result.instagram.recentEngagement.topPosts = igPostsWithEngagement
        .sort((a: any, b: any) => b.engagement - a.engagement)
        .slice(0, 3)
        .map((post: any) => ({
          id: post.id,
          caption: post.caption?.substring(0, 50) || '',
          engagement: post.engagement,
          timestamp: post.timestamp
        }));
    } else {
      console.warn('No Instagram Business Account linked to this Facebook Page.');
    }

    console.log('Final data fetched successfully:', result);
    return result;
  } catch (error: any) {
    console.error('Error in fetchFacebookData:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error(`Failed to fetch social media data: ${error.message}`);
  }
};


export const fetchYoutubeData = async (youtubeAccessToken: string) => {
  try {
    console.log('Starting fetchYouTubeData with access_token:', youtubeAccessToken);

    const result = {
      username: '',
      subscribers: 0,
      videos: 0,
      totalViews: 0,
      engagementRate: 0,
      followersGrowth: {}, // Will note limitation for week-wise data
      recentEngagement: { total: 0, topPosts: [] }
    };

    const currentDate = new Date();
    const oneMonthAgo = new Date(currentDate);
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const sixDaysAgo = new Date(currentDate);
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

    // Step 1: Get the authenticated user's channel
    console.log('Fetching YouTube channel...');
    const channelResponse = await axios.get(
      'https://www.googleapis.com/youtube/v3/channels',
      {
        params: {
          access_token: youtubeAccessToken,
          part: 'snippet,id,statistics',
          mine: true
        }
      }
    );
    if (!channelResponse.data.items?.length) {
      console.error('No YouTube channel found for this user.');
      throw new Error('No YouTube channel associated with this account.');
    }

    const channel = channelResponse.data.items[0];
    result.username = channel.snippet.customUrl?.replace('@', '') || '';
    const channelId = channel.id;
    result.subscribers = parseInt(channel.statistics.subscriberCount || '0');
    result.videos = parseInt(channel.statistics.videoCount || '0');
    result.totalViews = parseInt(channel.statistics.viewCount || '0');
    console.log('YouTube Channel ID:', channelId, 'Subscribers:', result.subscribers, 'Videos:', result.videos, 'Total Views:', result.totalViews);

    // Step 2: Fetch videos from the previous month
    console.log('Fetching YouTube videos for previous month...');
    const videosResponse = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          access_token: youtubeAccessToken,
          channelId,
          part: 'id',
          maxResults: 50,
          type: 'video',
          publishedAfter: oneMonthAgo.toISOString(),
          publishedBefore: currentDate.toISOString()
        }
      }
    );
    const videoIds = videosResponse.data.items.map((item: any) => item.id.videoId).join(',');

    let totalEngagements = 0;
    if (videoIds) {
      const videoStatsResponse = await axios.get(
        'https://www.googleapis.com/youtube/v3/videos',
        {
          params: {
            access_token: youtubeAccessToken,
            id: videoIds,
            part: 'statistics'
          }
        }
      );
      videoStatsResponse.data.items.forEach((video: any) => {
        const likes = parseInt(video.statistics.likeCount || '0');
        const comments = parseInt(video.statistics.commentCount || '0');
        totalEngagements += likes + comments;
      });
      result.engagementRate = result.subscribers > 0 ? (totalEngagements / result.subscribers) * 100 : 0;
      console.log('YouTube engagement rate (last month):', result.engagementRate);
    }

    // Step 3: Subscriber growth - Limited by API
    console.log('Fetching YouTube subscriber growth...');
    result.followersGrowth = {
      note: "YouTube API doesn't provide historical subscriber data for week-wise breakdown. Current count only.",
      current: result.subscribers
    };
    console.log('YouTube followers growth:', result.followersGrowth);

    // Step 4: Last 6 days engagement and top posts
    console.log('Fetching recent YouTube videos...');
    const recentVideosResponse = await axios.get(
      'https://www.googleapis.com/youtube/v3/search',
      {
        params: {
          access_token: youtubeAccessToken,
          channelId,
          part: 'id,snippet',
          maxResults: 50,
          type: 'video',
          publishedAfter: sixDaysAgo.toISOString(),
          publishedBefore: currentDate.toISOString()
        }
      }
    );

    const recentVideoIds = recentVideosResponse.data.items.map((item: any) => item.id.videoId).join(',');
    if (recentVideoIds) {
      const videoStatsResponse = await axios.get(
        'https://www.googleapis.com/youtube/v3/videos',
        {
          params: {
            access_token: youtubeAccessToken,
            id: recentVideoIds,
            part: 'statistics,snippet'
          }
        }
      );

      const videosWithEngagement = videoStatsResponse.data.items.map((video: any) => {
        const engagement = parseInt(video.statistics.likeCount || '0') +
          parseInt(video.statistics.commentCount || '0');
        return { ...video, engagement };
      });

      result.recentEngagement.total = videosWithEngagement.reduce((sum: number, video: any) => sum + video.engagement, 0);
      result.recentEngagement.topPosts = videosWithEngagement
        .sort((a: any, b: any) => b.engagement - a.engagement)
        .slice(0, 3)
        .map((video: any) => ({
          id: video.id,
          title: video.snippet.title.substring(0, 50),
          engagement: video.engagement,
          publishedAt: video.snippet.publishedAt
        }));
      console.log('YouTube recent engagement (last 6 days):', result.recentEngagement);
    }

    console.log('Final YouTube data:', result);
    return { youtube: result };
  } catch (error: any) {
    console.error('Error in fetchYouTubeData:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    throw new Error(`Failed to fetch YouTube data: ${error.message}`);
  }
};