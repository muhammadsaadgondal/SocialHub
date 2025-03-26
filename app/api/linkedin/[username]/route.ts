import { NextResponse } from 'next/server';
import axios from 'axios';

export const fetchLinkedInDataWithRapidAPI = async (linkedinUrl: string, rapidApiKey: string) => {
  try {
    console.log(`Fetching LinkedIn data for ${linkedinUrl}...`);

    const result = {
      followers: 0,
      posts: 0,
      totalLikes: 0,
      engagementRate: 0,
    };

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

    // Validate profile response
    if (!profileResponse.data || !profileResponse.data.data) {
      throw new Error('LinkedIn profile fetch failed: User not found');
    }

    const profileData = profileResponse.data.data;
    result.followers = profileData.connection_count || profileData.followers || 0;
    console.log('LinkedIn connections (used as followers):', result.followers);

    // Step 2: Fetch user's posts
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

    console.log('Raw LinkedIn posts response:', postsResponse.data);

    // Validate posts response
    if (!postsResponse.data || !postsResponse.data.data) {
      throw new Error('LinkedIn posts fetch failed');
    }

    const posts = postsResponse.data.data;
    if (posts.length > 0) {
      console.log('First LinkedIn post structure:', JSON.stringify(posts[0], null, 2));
    }

    console.log('Total LinkedIn posts fetched:', posts.length);

    // Step 3: Use all posts (no date range filtering)
    result.posts = posts.length;
    console.log('Total LinkedIn posts:', result.posts);

    // Step 4: Calculate total likes and engagement
    let totalLikes = 0;
    posts.forEach((post: any) => {
      const likes = post.num_likes || post.likes || post.reaction_count || 0;
      const timestamp = post.reshared && post.reposted ? post.reposted : post.posted;
      totalLikes += likes;
      console.log(`LinkedIn Post ${post.urn || post.id}: Likes: ${likes}, Timestamp: ${new Date(timestamp)}`);
    });
    
    result.totalLikes = totalLikes;
    result.engagementRate = result.followers > 0 
      ? (totalLikes / result.followers) * 100 
      : 0;

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
    // Await params to ensure it's resolved
    const params = await (context.params as Promise<{ username: string }>) || context.params;
    const { username } = params;

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const rapidApiKey = process.env.RAPIDAPI_KEY;
    if (!rapidApiKey) {
      return NextResponse.json({ error: 'RapidAPI key is missing' }, { status: 500 });
    }

    // Construct LinkedIn URL from username
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