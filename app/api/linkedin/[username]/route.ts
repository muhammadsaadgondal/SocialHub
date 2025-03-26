import { NextResponse } from 'next/server';
import axios from 'axios';

export const fetchLinkedInDataWithRapidAPI = async (linkedinUrl: string, rapidApiKey: string) => {
  try {
    console.log(`Fetching LinkedIn data for ${linkedinUrl}...`);

    const result = {
      username: '',
      followers: 0,
      posts: 0,
      totalLikes: 0,
      engagementRate: 0,
      followersGrowth: {},
      recentEngagement: { total: 0, topPosts: [], note: '' }
    };

    const currentDate = new Date();
    const sixDaysAgo = new Date(currentDate);
    sixDaysAgo.setDate(sixDaysAgo.getDate() - 6);

    // Step 1: Fetch user profile
    console.log('Fetching LinkedIn profile...');
    const profileResponse = await axios.get('https://fresh-linkedin-profile-data.p.rapidapi.com/get-linkedin-profile', {
      params: {
        linkedin_url: linkedinUrl,
        include_skills: 'true',
      },
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'fresh-linkedin-profile-data.p.rapidapi.com',
      },
    });

    console.log('Raw LinkedIn profile response:', profileResponse.data);

    if (!profileResponse.data || !profileResponse.data.data) {
      throw new Error('LinkedIn profile fetch failed: User not found');
    }

    const profileData = profileResponse.data.data;
    result.username = profileData.username || linkedinUrl.split('/in/')[1]?.replace('/', '') || '';
    result.followers = profileData.connection_count || profileData.followers || 0;
    console.log('LinkedIn username:', result.username, 'Followers:', result.followers);

    // Step 2: Set followersGrowth (limited by API)
    result.followersGrowth = {
      note: "LinkedIn RapidAPI doesn't provide historical follower data. Current count only.",
      current: result.followers
    };
    console.log('LinkedIn followers growth:', result.followersGrowth);

    // Step 3: Fetch user's posts
    console.log('Fetching LinkedIn posts...');
    const postsResponse = await axios.get('https://fresh-linkedin-profile-data.p.rapidapi.com/get-profile-posts', {
      params: {
        linkedin_url: linkedinUrl,
        start: 0,
        count: 50,
      },
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'fresh-linkedin-profile-data.p.rapidapi.com',
      },
    });

    console.log('Raw LinkedIn posts response:', JSON.stringify(postsResponse.data, null, 2));

    if (!postsResponse.data || !postsResponse.data.data) {
      console.warn('No posts data returned from LinkedIn API');
      result.posts = 0;
      result.totalLikes = 0;
      result.engagementRate = 0;
      result.recentEngagement = { total: 0, topPosts: [], note: 'No posts available from API' };
      console.log('Final LinkedIn result (no posts):', result);
      return result;
    }

    const posts = postsResponse.data.data;
    if (posts.length > 0) {
      console.log('First LinkedIn post structure:', JSON.stringify(posts[0], null, 2));
    }
    console.log('Total LinkedIn posts fetched:', posts.length);

    // Step 4: Calculate overall posts, total likes, and engagement rate
    console.log('Processing all LinkedIn posts...');
    result.posts = posts.length;
    console.log('LinkedIn total posts:', result.posts);

    let totalLikes = 0;
    posts.forEach((post: any) => {
      const likes = post.num_likes || post.likes || post.reaction_count || 0;
      totalLikes += likes;
      const timestamp = post.reshared && post.reposted ? post.reposted : post.posted;
      console.log(`LinkedIn Post ${post.urn || post.id}: Likes: ${likes}, Timestamp: ${timestamp}`);
    });
    result.totalLikes = totalLikes;
    result.engagementRate = result.followers > 0 ? (totalLikes / result.followers) * 100 : 0;
    console.log('LinkedIn total likes (overall):', result.totalLikes, 'Engagement rate (overall):', result.engagementRate);

    // Step 5: Filter posts for the last 6 days and calculate recent engagement
    console.log('Processing LinkedIn posts for last 6 days...');
    const recentPosts = posts.filter((post: any) => {
      const timestamp = post.reshared && post.reposted ? post.reposted : post.posted;
      if (!timestamp) return false; // Exclude for recent engagement if no timestamp
      const postDate = new Date(timestamp);
      if (isNaN(postDate.getTime())) return false; // Exclude invalid dates
      return postDate >= sixDaysAgo && postDate <= currentDate;
    });

    const postsWithEngagement = recentPosts.map((post: any) => {
      const engagement = post.num_likes || post.likes || post.reaction_count || 0;
      return { ...post, engagement };
    });

    result.recentEngagement.total = postsWithEngagement.reduce((sum: number, post: any) => sum + post.engagement, 0);
    result.recentEngagement.topPosts = postsWithEngagement
      .sort((a: any, b: any) => b.engagement - a.engagement)
      .slice(0, 3)
      .map((post: any) => ({
        id: post.urn || post.id || '',
        text: post.text?.substring(0, 50) || '',
        engagement: post.engagement,
        timestamp: post.reshared && post.reposted ? post.reposted : post.posted
      }));
    console.log('LinkedIn recent engagement (last 6 days):', result.recentEngagement);

    console.log('Final LinkedIn result:', result);
    return result;

  } catch (error: any) {
    console.error('Detailed LinkedIn error:', {
      message: error.message,
      config: error.config,
      response: error.response?.data
    });
    throw new Error(`Failed to fetch LinkedIn data: ${error.message}`);
  }
};

export async function GET(request: Request, context: { params: Promise<{ username: string }> | { username: string } }) {
  try {
    const params = await (context.params as Promise<{ username: string }>) || context.params;
    const { username } = params;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const rapidApiKey = process.env.RAPIDAPI_KEY;
    if (!rapidApiKey) {
      return NextResponse.json({ error: 'RapidAPI key is missing' }, { status: 500 });
    }

    const linkedinUrl = `https://www.linkedin.com/in/${username}`;
    const data = await fetchLinkedInDataWithRapidAPI(linkedinUrl, rapidApiKey);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ 
      error: 'Failed to fetch LinkedIn data',
      details: error.message 
    }, { status: 500 });
  }
}