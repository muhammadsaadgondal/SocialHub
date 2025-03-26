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
  },
  { timestamps: true }
);

export default mongoose.models.SocialMediaAccount || mongoose.model<ISocialMediaAccount>("SocialMediaAccount", SocialMediaAccountSchema);