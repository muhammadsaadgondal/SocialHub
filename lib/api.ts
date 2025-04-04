"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import mongoose from "mongoose"
import SocialMediaAccount from "@/models/SocialMediaAccount"
import User from "@/models/User"
import type { SocialAccount, SocialPlatform, OverviewAnalytics, PlatformAnalyticsData } from "./types"
import axios from "axios"
import { fetchFacebookData, fetchYoutubeData } from "./fetchData";

// Connect to MongoDB
export const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log("Already connected to MongoDB");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI || "");
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error; // Ensure the error propagates
    }
};


// Get current user ID from session
export const getCurrentUserId = async () => {
    const session = await getServerSession()
    if (!session?.user?.email) {
        throw new Error("Not authenticated")
    }

    await connectDB()
    const user = await User.findOne({ email: session.user.email })
    if (!user) {
        throw new Error("User not found")
    }

    return user._id
}

// Fetch social accounts for the current user
export async function fetchSocialAccounts(): Promise<SocialAccount[]> {
    try {
        await connectDB()
        const userId = await getCurrentUserId()

        const accounts = await SocialMediaAccount.find({ userId })
        console.log(`TOTAL ACCOUNTS FOUND ${accounts[4]}`)
        return accounts.map((account) => ({
            id: account._id.toString(),
            platform: account.platform,
            username: account.handle,
            followers: account.followers,
            posts: account.posts,
            engagementRate: account.engagementRate,
            lastUpdated: new Date(account.updatedAt).toLocaleDateString(),
        }))
    } catch (error) {
        console.error("Error fetching social accounts:", error)
        throw error
    }
}


export async function connectUsernameAccount(platform: SocialPlatform, username: string): Promise<SocialAccount> {
    try {
        await connectDB();
        const userId = await getCurrentUserId();

        // Check if user already has 5 accounts
        const accountCount = await SocialMediaAccount.countDocuments({ userId });
        if (accountCount >= 5) {
            throw new Error("Maximum number of accounts (5) reached");
        }

        // Check if platform is already connected
        const existingAccount = await SocialMediaAccount.findOne({ userId, platform });
        if (existingAccount) {
            throw new Error(`${platform} account already connected`);
        }

        let accountData;

        switch (platform) {
            case "tiktok":
                // Call TikTok API with username
                const tiktokData = await axios.get(`http://localhost:3000/api/tiktok-public/${username}`);
                accountData = {
                    followers: tiktokData.data.followers || 0,
                    posts: tiktokData.data.totalVideos || 0,
                    engagementRate: tiktokData.data.engagementRate || 0,
                    followersGrowth: tiktokData.data.followersGrowth || {},
                    recentEngagement: {
                        total: tiktokData.data.recentEngagement?.total || 0,
                        topPosts: tiktokData.data.recentEngagement?.topPosts || []
                    }
                };
                break;

            case "linkedin":
                const linkedinData = await axios.get(`http://localhost:3000/api/linkedin/${username}`);
                accountData = {
                    followers: linkedinData.data.followers || 0,
                    posts: linkedinData.data.posts || 0,
                    engagementRate: linkedinData.data.engagementRate || 0,
                    followersGrowth: linkedinData.data.followersGrowth || {},
                    recentEngagement: {
                        total: linkedinData.data.recentEngagement?.total || 0,
                        topPosts: linkedinData.data.recentEngagement?.topPosts || []
                    }
                };
                break;

            default:
                throw new Error(`Unsupported platform for username connection: ${platform}`);
        }

        // Create the account in the database
        const newAccount = await SocialMediaAccount.create({
            userId,
            platform,
            handle: username,
            followers: accountData.followers,
            accessToken: '', // No access token for public data
            posts: accountData.posts,
            engagementRate: accountData.engagementRate,
            followersGrowth: accountData.followersGrowth,
            recentEngagement: accountData.recentEngagement
        });

        revalidatePath("/dashboard");

        return {
            id: newAccount._id.toString(),
            platform: newAccount.platform,
            username: newAccount.handle,
            followers: newAccount.followers,
            posts: newAccount.posts,
            engagementRate: newAccount.engagementRate,
            lastUpdated: new Date(newAccount.updatedAt).toLocaleDateString(),
        };
    } catch (error) {
        console.error("Error connecting social account:", error);
        throw error;
    }
}


// Disconnect a social account
export async function disconnectSocialAccount(accountId: string): Promise<boolean> {
    try {
        await connectDB()
        const userId = await getCurrentUserId()

        const result = await SocialMediaAccount.deleteOne({
            _id: accountId,
            userId,
        })

        if (result.deletedCount === 0) {
            throw new Error("Account not found or not authorized to delete")
        }

        revalidatePath("/dashboard")
        return true
    } catch (error) {
        console.error("Error disconnecting social account:", error)
        throw error
    }
}



export async function refreshSocialData(): Promise<boolean> {
    try {
        await connectDB();
        const userId = await getCurrentUserId();

        const accounts = await SocialMediaAccount.find({ userId });

        // For each account, fetch fresh data from the respective platform's API
        for (const account of accounts) {
            let updatedData;

            switch (account.platform) {
                case "facebook":
                    updatedData = await fetchFacebookData(account.accessToken);
                    account.followers = updatedData.facebook.followers || 0;
                    account.posts = updatedData.facebook.posts || 0;
                    account.engagementRate = updatedData.facebook.engagementRate || 0;
                    account.followersGrowth = updatedData.facebook.followersGrowth || {};
                    account.recentEngagement = {
                        total: updatedData.facebook.recentEngagement?.total || 0,
                        topPosts: updatedData.facebook.recentEngagement?.topPosts || []
                    };
                    break;

                case "instagram":
                    updatedData = await fetchFacebookData(account.accessToken); // Instagram data comes from the same Facebook API call
                    account.followers = updatedData.instagram.followers || 0;
                    account.posts = updatedData.instagram.posts || 0;
                    account.engagementRate = updatedData.instagram.engagementRate || 0;
                    account.followersGrowth = updatedData.instagram.followersGrowth || {};
                    account.recentEngagement = {
                        total: updatedData.instagram.recentEngagement?.total || 0,
                        topPosts: updatedData.instagram.recentEngagement?.topPosts || []
                    };
                    break;

                case "youtube":
                    updatedData = await fetchYoutubeData(account.accessToken);
                    account.followers = updatedData.youtube.subscribers || 0; // YouTube uses subscribers as followers
                    account.posts = updatedData.youtube.videos || 0; // YouTube uses videos as posts
                    account.engagementRate = updatedData.youtube.engagementRate || 0;
                    account.followersGrowth = updatedData.youtube.followersGrowth || {};
                    account.recentEngagement = {
                        total: updatedData.youtube.recentEngagement?.total || 0,
                        topPosts: updatedData.youtube.recentEngagement?.topPosts || []
                    };
                    break;

                case "tiktok":
                    updatedData = await axios.get(`http://localhost:3000/api/tiktok-public/${account.handle}`);
                    account.followers = updatedData.data.followers || 0;
                    account.posts = updatedData.data.totalVideos || 0;
                    account.engagementRate = updatedData.data.engagementRate || 0;
                    break;

                case "linkedin":
                    updatedData = await axios.get(`http://localhost:3000/api/linkedin/${account.handle}`);
                    account.followers = updatedData.data.followers || 0;
                    account.posts = updatedData.data.posts || 0;
                    account.engagementRate = updatedData.data.engagementRate || 0;
                    account.followersGrowth = updatedData.data.followersGrowth || {};
                    account.recentEngagement = {
                        total: updatedData.data.recentEngagement?.total || 0,
                        topPosts: updatedData.data.recentEngagement?.topPosts || []
                    };
                    break;

                case "twitter":
                    console.warn("Twitter data refresh not implemented yet");
                    continue; // Skip Twitter for now as no fetch function is provided

                default:
                    console.warn(`Unknown platform: ${account.platform}`);
                    continue; // Skip unknown platforms
            }

            await account.save();
            console.log(`Updated ${account.platform} account for ${account.handle}:`, {
                followers: account.followers,
                posts: account.posts,
                engagementRate: account.engagementRate,
                followersGrowth: account.followersGrowth,
                recentEngagement: account.recentEngagement
            });
        }

        revalidatePath("/dashboard");
        return true;
    } catch (error) {
        console.error("Error refreshing social data:", error);
        throw error;
    }
}



export async function fetchOverviewAnalytics(): Promise<OverviewAnalytics | undefined> {
  try {
    await connectDB();
    const userId = await getCurrentUserId();

    const accounts = await SocialMediaAccount.find({ userId });

    // Calculate total followers
    const totalFollowers = accounts.reduce((sum, account) => sum + (account.followers || 0), 0);

    // Calculate average engagement rate
    const totalEngagementRate = accounts.reduce((sum, account) => sum + (account.engagementRate || 0), 0);
    const avgEngagementRate = accounts.length > 0 ? totalEngagementRate / accounts.length : 0;

    // Calculate total posts
    const totalPosts = accounts.reduce((sum, account) => sum + (account.posts || 0), 0);

    // Calculate total impressions (placeholder; estimated from followers and engagement)
    const totalImpressions = accounts.reduce((sum, account) => {
      return sum + Math.floor((account.followers || 0) * (account.engagementRate || 0) / 100);
    }, 0);

    // Generate audience growth data based on followersGrowth
    const audienceGrowth = Array.from({ length: 6 }, (_, i) => {
      const month = new Date();
      month.setMonth(month.getMonth() - 5 + i);

      const growthData: any = {
        name: month.toLocaleString("en-US", { month: "short" }),
      };

      accounts.forEach((account) => {
        if (account.followersGrowth && account.followersGrowth.size > 0) {
          const growthMap = account.followersGrowth as Map<string, number | string>;
          if (growthMap.has("current")) {
            // For TikTok, LinkedIn, YouTube: only current count available
            const current = Number(growthMap.get("current")) || account.followers || 0;
            const baseValue = current / 6;
            growthData[account.platform] = Math.floor(baseValue * (i + 1));
          } else {
            // For Facebook, Instagram: use week-wise data if available
            const weekKey = `week${i + 1}`; // Adjust based on actual keys
            growthData[account.platform] = growthMap.get(weekKey) || account.followers || 0;
          }
        } else {
          // Fallback: distribute current followers linearly
          const baseValue = (account.followers || 0) / 6;
          growthData[account.platform] = Math.floor(baseValue * (i + 1));
        }
      });

      return growthData;
    });

    // Calculate trends and changes (simplified)
    const prevFollowers = audienceGrowth[4][accounts[0]?.platform] || 0; // Previous month's value for first platform
    const followersChange = totalFollowers > prevFollowers ? ((totalFollowers - prevFollowers) / prevFollowers * 100).toFixed(1) : "0";
    const engagementChange = avgEngagementRate > 0 ? "5" : "0"; // Placeholder
    const postsChange = totalPosts > 0 ? "10" : "0"; // Placeholder; adjust based on real trends if available
    const impressionsChange = totalImpressions > 0 ? "3" : "0"; // Placeholder

    return {
      metrics: {
        followers: {
          title: "Total Followers",
          value: totalFollowers.toLocaleString(),
          trend: totalFollowers > prevFollowers ? "up" : "down",
          change: `${followersChange}%`,
        },
        engagement: {
          title: "Engagement Rate",
          value: `${avgEngagementRate.toFixed(2)}%`,
          trend: avgEngagementRate > 0 ? "up" : "down",
          change: `${engagementChange}%`,
        },
        posts: {
          title: "Total Posts",
          value: totalPosts.toLocaleString(),
          trend: totalPosts > 0 ? "up" : "down",
          change: `${postsChange}%`,
        },
        impressions: {
          title: "Total Impressions",
          value: totalImpressions.toLocaleString(),
          trend: totalImpressions > 0 ? "up" : "down",
          change: `${impressionsChange}%`,
        },
      },
      audienceGrowth,
    };
  } catch (error) {
    console.error("Error fetching overview analytics:", error);
    return undefined;
  }
}

// Fetch platform-specific analytics
export async function fetchPlatformAnalytics(platform: SocialPlatform): Promise<PlatformAnalyticsData | undefined> {
    try {
        await connectDB()
        const userId = await getCurrentUserId()

        const account = await SocialMediaAccount.findOne({ userId, platform })

        if (!account) {
            console.log(`No ${platform} account found`);
            return undefined; // Explicitly return undefined if no account is found
        }

        // Generate mock data for post performance
        const postPerformance = Array.from({ length: 7 }, (_, i) => {
            const day = new Date()
            day.setDate(day.getDate() - 6 + i)

            return {
                name: day.toLocaleDateString("en-US", { weekday: "short" }),
                value: Math.floor(Math.random() * 100),
            }
        })

        // Generate mock data for top content
        const topContent = Array.from({ length: 3 }, (_, i) => ({
            id: `post-${i}`,
            title: `Top performing post ${i + 1}`,
            likes: Math.floor(Math.random() * 500),
            comments: Math.floor(Math.random() * 100),
        }))

        // Generate mock data for demographics
        const demographics = {
            ageGroups: [
                { range: "18-24", percentage: 25 },
                { range: "25-34", percentage: 35 },
                { range: "35-44", percentage: 20 },
                { range: "45-54", percentage: 15 },
                { range: "55+", percentage: 5 },
            ],
            gender: {
                male: 48,
                female: 52,
            },
        }

        return {
            metrics: {
                followers: account.followers?.toLocaleString() || "0",
                engagement: `${account.engagementRate?.toFixed(2) || "0"}%`,
                posts: account.posts?.toString() || "0",
                reach: Math.floor(Math.random() * 50000).toLocaleString(),
            },
            postPerformance,
            topContent,
            demographics,
        }
    } catch (error) {
        console.error("Error fetching platform analytics:", error)
        return undefined; // Explicitly return undefined in case of an error
    }
}

// export async function fetchPlatformAnalyticsOriginal(platform: SocialPlatform): Promise<PlatformAnalyticsData | undefined> {
//     try {
//       await connectDB();
//       const userId = await getCurrentUserId();
  
//       const account = await SocialMediaAccount.findOne({ userId, platform });
  
//       if (!account) {
//         console.log(`No ${platform} account found`);
//         return undefined;
//       }
  
//       // Generate post performance data from recentEngagement (last 6 days)
//       const postPerformance = Array.from({ length: 7 }, (_, i) => {
//         const day = new Date();
//         day.setDate(day.getDate() - 6 + i);
//         const dayName = day.toLocaleDateString("en-US", { weekday: "short" });
  
//         // Sum engagement for posts on this day
//         const dailyEngagement = (account.recentEngagement?.topPosts || [])
//           .filter((post: { timestamp: string | number | Date }) => {
//             const postDate = new Date(post.timestamp);
//             return (
//               postDate.getDate() === day.getDate() &&
//               postDate.getMonth() === day.getMonth() &&
//               postDate.getFullYear() === day.getFullYear()
//             );
//           })
//           .reduce((sum: any, post: { engagement: any }) => sum + (post.engagement || 0), 0);
  
//         return {
//           name: dayName,
//           value: dailyEngagement,
//         };
//       });
  
//       // Use top posts from recentEngagement
//       const topContent = (account.recentEngagement?.topPosts || []).slice(0, 3).map((post: { id: any; text: any; caption: any; engagement: any }) => ({
//         id: post.id || `post-${Math.random().toString(36).substr(2, 9)}`,
//         title: post.text || post.caption || "Untitled Post", // Use text (LinkedIn) or caption (others)
//         likes: post.engagement || 0, // Engagement is likes for most platforms
//         comments: 0, // Placeholder; not available in current data
//       }));
  
//       return {
//         metrics: {
//           followers: account.followers?.toLocaleString() || "0",
//           engagement: `${account.engagementRate?.toFixed(2) || "0"}%`,
//           posts: account.posts?.toString() || "0",
//           reach: Math.floor((account.followers || 0) * (account.engagementRate || 0) / 100).toLocaleString(), // Estimated
//         },
//         postPerformance,
//         topContent,
//       };
//     } catch (error) {
//       console.error("Error fetching platform analytics:", error);
//       return undefined;
//     }
//   }

// Fetch comparison data for all platforms


export async function fetchComparisonData(): Promise<any[]> {
    try {
        await connectDB()
        const userId = await getCurrentUserId()

        const accounts = await SocialMediaAccount.find({ userId })

        // Generate data for platform comparison
        return Array.from({ length: 6 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - 5 + i)

            const result: any = {
                name: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            }

            // Add data for each connected platform
            for (const account of accounts) {
                // Generate consistent but random-looking data
                const baseValue = 50
                const randomFactor = 0.7 + 0.6 * Math.sin(i + accounts.indexOf(account))
                result[account.platform] = Math.floor(baseValue * randomFactor)
            }

            return result
        })
    } catch (error) {
        console.error("Error fetching comparison data:", error)
        throw error
    }
}

