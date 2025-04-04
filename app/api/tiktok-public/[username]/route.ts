import { NextResponse } from 'next/server';
import axios from 'axios';

const fetchTikTokDataWithRapidAPI = async (username: string, rapidApiKey: string) => {
  try {
    console.log(`Fetching TikTok data for @${username}...`);

    // Step 1: Fetch user info
    const userResponse = await axios.get('https://tiktok-scraper7.p.rapidapi.com/user/info', {
      params: { unique_id: username },
      headers: {
        'X-RapidAPI-Key': rapidApiKey,
        'X-RapidAPI-Host': 'tiktok-scraper7.p.rapidapi.com',
      },
    });

    // Validate response
    if (userResponse.data.code !== 0 || !userResponse.data.data?.stats) {
      throw new Error('Failed to fetch user stats');
    }

    // Extract metrics directly from API stats
    const stats = userResponse.data.data.stats;
    const result = {
      followers: stats.followerCount || 0,
      totalLikes: stats.heartCount || 0, // This is the heartCount from the response
      totalVideos: stats.videoCount || 0,
      engagementRate: 0,
    };

    // Calculate engagement rate
    result.engagementRate = result.followers > 0
      ? (result.totalLikes / result.followers) * 100
      : 0;

    console.log('Final result:', result);
    return result;

  } catch (error: any) {
    console.error('Error:', error.response?.data || error.message);
    throw new Error(`Failed to fetch TikTok stats: ${error.message}`);
  }
};




// Keep the GET function the same
export async function GET(request: Request, context: { params: Promise<{ username: string }> }) {
  try {
    const params = await (context.params as Promise<{ username: string }>) || context.params;
    const { username } = params;
    const rapidApiKey = process.env.RAPIDAPI_KEY;

    if (!username || !rapidApiKey) {
      return NextResponse.json(
        { error: 'Missing username or API key' },
        { status: 400 }
      );
    }

    const data = await fetchTikTokDataWithRapidAPI(username, rapidApiKey);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error.message },
      { status: 500 }
    );
  }
}