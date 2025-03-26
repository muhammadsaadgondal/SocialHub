"use server"

import { revalidatePath } from "next/cache"
import { getServerSession } from "next-auth"
import mongoose from "mongoose"
import SocialMediaAccount from "@/models/SocialMediaAccount"
import User from "@/models/User"
import type { SocialAccount, SocialPlatform, OverviewAnalytics, PlatformAnalyticsData } from "./types"
import axios from "axios"

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
        console.log(`TOTAL ACCOUNTS FOUND ${accounts[3]}`)
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
        await connectDB()
        const userId = await getCurrentUserId()

        // Check if user already has 5 accounts
        const accountCount = await SocialMediaAccount.countDocuments({ userId })
        if (accountCount >= 5) {
            throw new Error("Maximum number of accounts (5) reached")
        }

        // Check if platform is already connected
        const existingAccount = await SocialMediaAccount.findOne({ userId, platform })
        if (existingAccount) {
            throw new Error(`${platform} account already connected`)
        }

        let accountData

        switch (platform) {
            case "tiktok":
                // Call TikTok API with username
                // For now, using mock data
                const data = await axios.get(`http://localhost:3000/api/tiktok-public/${username}`);
                accountData = {
                    followers: data.data.followers,
                    posts: data.data.totalVideos,
                    engagementRate: data.data.engagementRate
                }
                break
            case "linkedin":
                const linkedinData = await axios.get(`http://localhost:3000/api/linkedin/${username}`);
                accountData = {
                    followers: linkedinData.data.followers,
                    posts: linkedinData.data.posts,
                    engagementRate: linkedinData.data.engagementRate
                }
                break
            default:
                throw new Error(`Unsupported platform for username connection: ${platform}`)
        }

        // Create the account in the database
        const newAccount = await SocialMediaAccount.create({
            userId,
            platform,
            handle: username,
            followers: accountData.followers,
            accessToken: '',
            posts: accountData.posts,
            engagementRate: accountData.engagementRate,
        })

        revalidatePath("/dashboard")

        return {
            id: newAccount._id.toString(),
            platform: newAccount.platform,
            username: newAccount.handle,
            followers: newAccount.followers,
            posts: newAccount.posts,
            engagementRate: newAccount.engagementRate,
            lastUpdated: new Date(newAccount.updatedAt).toLocaleDateString(),
        }
    } catch (error) {
        console.error("Error connecting social account:", error)
        throw error
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

// Refresh social media data
export async function refreshSocialData(): Promise<boolean> {
    try {
        await connectDB()
        const userId = await getCurrentUserId()

        const accounts = await SocialMediaAccount.find({ userId })

        // For each account, fetch fresh data from the respective platform's API
        for (const account of accounts) {
            // In a real app, this would call the platform's API using the stored access token
            // For now, we'll update with random values for demonstration

            // Different logic based on platform
            switch (account.platform) {
                case "facebook":
                case "instagram":
                case "twitter":
                case "youtube":
                    // For OAuth platforms, we would use the access token to fetch data
                    // For now, using mock data
                    account.followers = Math.floor(Math.random() * 10000)
                    account.posts = Math.floor(Math.random() * 100)
                    account.engagementRate = Math.random() * 5
                    break

                case "tiktok":
                case "linkedin":
                    // For username-based platforms, we would call the API with the username
                    // For now, using mock data
                    account.followers = Math.floor(Math.random() * 5000)
                    account.posts = Math.floor(Math.random() * 50)
                    account.engagementRate = Math.random() * 3
                    break

                default:
                    console.warn(`Unknown platform: ${account.platform}`)
            }

            await account.save()
        }

        revalidatePath("/dashboard")
        return true
    } catch (error) {
        console.error("Error refreshing social data:", error)
        throw error
    }
}

// Fetch overview analytics
export async function fetchOverviewAnalytics(): Promise<OverviewAnalytics | undefined> {
    try {
        await connectDB()
        const userId = await getCurrentUserId()

        const accounts = await SocialMediaAccount.find({ userId })

        // Calculate total followers
        const totalFollowers = accounts.reduce((sum, account) => sum + (account.followers || 0), 0)

        // Calculate average engagement rate
        const totalEngagementRate = accounts.reduce((sum, account) => sum + (account.engagementRate || 0), 0)
        const avgEngagementRate = accounts.length > 0 ? totalEngagementRate / accounts.length : 0

        // Generate audience growth data based on connected platforms
        const audienceGrowth = Array.from({ length: 6 }, (_, i) => {
            const month = new Date()
            month.setMonth(month.getMonth() - 5 + i)

            // Create an object with the month name
            const growthData: any = {
                name: month.toLocaleDateString("en-US", { month: "short" }),
            }

            // Add data only for connected platforms
            accounts.forEach((account) => {
                // Generate consistent but random-looking growth data
                const baseValue = account.followers ? account.followers / 6 : 1000
                const randomFactor = 0.8 + 0.4 * Math.sin(i + accounts.indexOf(account))
                growthData[account.platform] = Math.floor(baseValue * (i + 1) * randomFactor)
            })

            return growthData
        })

        return {
            metrics: {
                followers: {
                    title: "Total Followers",
                    value: totalFollowers.toLocaleString(),
                    trend: "up",
                    change: "12%",
                },
                engagement: {
                    title: "Engagement Rate",
                    value: `${avgEngagementRate.toFixed(2)}%`,
                    trend: "up",
                    change: "5%",
                },
                shares: {
                    title: "Total Shares",
                    value: Math.floor(Math.random() * 1000).toLocaleString(),
                    trend: "up",
                    change: "18%",
                },
                impressions: {
                    title: "Total Impressions",
                    value: Math.floor(Math.random() * 100000).toLocaleString(),
                    trend: "down",
                    change: "3%",
                },
            },
            audienceGrowth,
        }
    } catch (error) {
        console.error("Error fetching overview analytics:", error)
        return undefined
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

