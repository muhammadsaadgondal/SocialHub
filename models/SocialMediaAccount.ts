import mongoose, { Schema, Document } from "mongoose";

export interface ISocialMediaAccount extends Document {
  userId: mongoose.Schema.Types.ObjectId; // Reference to the user
  platform: "facebook" | "instagram" | "linkedin" | "tiktok" | "youtube";
  handle: string; // Username or handle on the platform
  accessToken?: string; // Access token for the platform
  refreshToken?: string; // Optional refresh token
  expiresAt?: Date; // Token expiration date
  followers?: number; // Latest follower count
  posts?: number; // Latest post count
  engagementRate?: number; // Latest engagement rate
  followersGrowth?: {
    [key: string]: number | string; // For week-wise growth or YouTube note/current
  };
  recentEngagement?: {
    total: number;
    topPosts: Array<{
      id: string;
      message?: string; // Facebook
      caption?: string; // Instagram
      title?: string; // YouTube
      engagement: number;
      created_time?: string; // Facebook
      timestamp?: string; // Instagram
      publishedAt?: string; // YouTube
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const SocialMediaAccountSchema: Schema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    platform: { type: String, required: true, enum: ["facebook", "instagram", "linkedin", "tiktok", "youtube"] },
    handle: { type: String, required: true },
    accessToken: { type: String },
    refreshToken: { type: String },
    expiresAt: { type: Date },
    followers: { type: Number },
    posts: { type: Number },
    engagementRate: { type: Number },
    followersGrowth: {
      type: Map, // Flexible key-value store for week-wise data or note/current
      of: Schema.Types.Mixed, // Can be number (week values) or string (YouTube note)
      default: {}
    },
    recentEngagement: {
      total: { type: Number, default: 0 },
      topPosts: [{
        id: { type: String, required: true },
        message: { type: String }, // Facebook-specific
        caption: { type: String }, // Instagram-specific
        title: { type: String }, // YouTube-specific
        engagement: { type: Number, required: true },
        created_time: { type: String }, // Facebook-specific
        timestamp: { type: String }, // Instagram-specific
        publishedAt: { type: String } // YouTube-specific
      }]
    }
  },
  { timestamps: true }
);

export default mongoose.models.SocialMediaAccount || mongoose.model<ISocialMediaAccount>("SocialMediaAccount", SocialMediaAccountSchema);