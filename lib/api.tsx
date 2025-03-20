import type { SocialAccount, SocialPlatform, OverviewAnalytics, PlatformAnalyticsData } from "./types"

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Fetch connected social accounts
export async function fetchSocialAccounts(): Promise<SocialAccount[]> {
  // In a real app, this would be an API call
  await delay(800)

  return [
    {
      id: "1",
      platform: "facebook",
      username: "johndoe",
      connected: true,
      lastUpdated: "2 days ago",
    },
    {
      id: "2",
      platform: "instagram",
      username: "john.doe",
      connected: true,
      lastUpdated: "1 day ago",
    },
  ]
}

// Connect a new social account
export async function connectSocialAccount(platform: SocialPlatform): Promise<SocialAccount> {
  // In a real app, this would initiate OAuth flow and return the connected account
  await delay(1200)

  return {
    id: Date.now().toString(),
    platform,
    username: platform === "facebook" ? "johndoe" : platform === "instagram" ? "john.doe" : "johndoe-linkedin",
    connected: true,
    lastUpdated: "just now",
  }
}

// Disconnect a social account
export async function disconnectSocialAccount(id: string): Promise<boolean> {
  // In a real app, this would revoke access tokens
  await delay(500)

  return true
}

// Fetch overview analytics for all platforms
export async function fetchOverviewAnalytics(): Promise<OverviewAnalytics> {
  await delay(1000)

  return {
    metrics: {
      followers: {
        title: "Total Followers",
        value: "24,532",
        change: "+12.3%",
        trend: "up",
      },
      engagement: {
        title: "Engagement Rate",
        value: "3.8%",
        change: "-0.4%",
        trend: "down",
      },
      shares: {
        title: "Total Shares",
        value: "1,024",
        change: "+8.1%",
        trend: "up",
      },
      impressions: {
        title: "Total Impressions",
        value: "87,432",
        change: "+23.5%",
        trend: "up",
      },
    },
    audienceGrowth: [
      {
        name: "Jan",
        facebook: 4000,
        instagram: 2400,
        linkedin: 1800,
      },
      {
        name: "Feb",
        facebook: 3000,
        instagram: 2800,
        linkedin: 2200,
      },
      {
        name: "Mar",
        facebook: 5000,
        instagram: 3200,
        linkedin: 2400,
      },
      {
        name: "Apr",
        facebook: 4500,
        instagram: 4000,
        linkedin: 2600,
      },
      {
        name: "May",
        facebook: 6000,
        instagram: 5000,
        linkedin: 3000,
      },
      {
        name: "Jun",
        facebook: 7000,
        instagram: 6000,
        linkedin: 3500,
      },
    ],
  }
}

// Fetch platform-specific analytics
export async function fetchPlatformAnalytics(platform: SocialPlatform): Promise<PlatformAnalyticsData> {
  await delay(800)

  const platformData: Record<SocialPlatform, PlatformAnalyticsData> = {
    facebook: {
      metrics: {
        followers: "12,345",
        engagement: "2.8%",
        posts: "156",
        reach: "45,678",
      },
      postPerformance: [
        { name: "Mon", value: 400 },
        { name: "Tue", value: 300 },
        { name: "Wed", value: 500 },
        { name: "Thu", value: 450 },
        { name: "Fri", value: 600 },
        { name: "Sat", value: 700 },
        { name: "Sun", value: 500 },
      ],
      topContent: [
        { id: "1", title: "Product Launch", likes: 245, comments: 32, shares: 18, date: "2023-06-15" },
        { id: "2", title: "Company Update", likes: 189, comments: 24, shares: 12, date: "2023-06-10" },
        { id: "3", title: "Industry News", likes: 156, comments: 18, shares: 8, date: "2023-06-05" },
      ],
      demographics: {
        ageGroups: [
          { range: "18-24", percentage: 35 },
          { range: "25-34", percentage: 45 },
          { range: "35-44", percentage: 15 },
          { range: "45-54", percentage: 3 },
          { range: "55+", percentage: 2 },
        ],
        gender: { male: 48, female: 52, other: 0 },
      },
    },
    instagram: {
      metrics: {
        followers: "8,765",
        engagement: "4.2%",
        posts: "98",
        reach: "32,109",
      },
      postPerformance: [
        { name: "Mon", value: 240 },
        { name: "Tue", value: 280 },
        { name: "Wed", value: 320 },
        { name: "Thu", value: 400 },
        { name: "Fri", value: 500 },
        { name: "Sat", value: 600 },
        { name: "Sun", value: 400 },
      ],
      topContent: [
        { id: "1", title: "Product Showcase", likes: 432, comments: 56, shares: 24, date: "2023-06-18" },
        { id: "2", title: "Behind the Scenes", likes: 378, comments: 42, shares: 18, date: "2023-06-12" },
        { id: "3", title: "Customer Spotlight", likes: 289, comments: 34, shares: 12, date: "2023-06-08" },
      ],
      demographics: {
        ageGroups: [
          { range: "18-24", percentage: 42 },
          { range: "25-34", percentage: 38 },
          { range: "35-44", percentage: 12 },
          { range: "45-54", percentage: 5 },
          { range: "55+", percentage: 3 },
        ],
        gender: { male: 45, female: 54, other: 1 },
      },
    },
    linkedin: {
      metrics: {
        followers: "3,422",
        engagement: "1.9%",
        posts: "42",
        reach: "9,645",
      },
      postPerformance: [
        { name: "Mon", value: 180 },
        { name: "Tue", value: 220 },
        { name: "Wed", value: 240 },
        { name: "Thu", value: 260 },
        { name: "Fri", value: 300 },
        { name: "Sat", value: 150 },
        { name: "Sun", value: 100 },
      ],
      topContent: [
        { id: "1", title: "Industry Insights", likes: 156, comments: 28, shares: 14, date: "2023-06-16" },
        { id: "2", title: "Company Milestone", likes: 132, comments: 22, shares: 10, date: "2023-06-11" },
        { id: "3", title: "Job Openings", likes: 98, comments: 15, shares: 8, date: "2023-06-07" },
      ],
      demographics: {
        ageGroups: [
          { range: "18-24", percentage: 15 },
          { range: "25-34", percentage: 48 },
          { range: "35-44", percentage: 25 },
          { range: "45-54", percentage: 8 },
          { range: "55+", percentage: 4 },
        ],
        gender: { male: 58, female: 41, other: 1 },
      },
    },
  }

  return platformData[platform]
}

// Fetch comparison data for all platforms
export async function fetchComparisonData(): Promise<any[]> {
  await delay(600)

  return [
    { name: "Mon", facebook: 400, instagram: 240, linkedin: 180 },
    { name: "Tue", facebook: 300, instagram: 280, linkedin: 220 },
    { name: "Wed", facebook: 500, instagram: 320, linkedin: 240 },
    { name: "Thu", facebook: 450, instagram: 400, linkedin: 260 },
    { name: "Fri", facebook: 600, instagram: 500, linkedin: 300 },
    { name: "Sat", facebook: 700, instagram: 600, linkedin: 150 },
    { name: "Sun", facebook: 500, instagram: 400, linkedin: 100 },
  ]
}

