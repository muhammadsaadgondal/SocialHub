import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email?: string;
  password?: string; // Make password optional
  username: string;
  name?: string;
  bio?: string;
  website?: string;
  location?: string;
  profileImage?: string;
  accountType: "INFLUENCER" | "CAMPAIGN_MANAGER";
  status: string;
  createdAt: Date;
  updatedAt: Date;
  // OAuth-specific fields
  provider?: string; // e.g., "google"
  providerId?: string; // Unique ID provided by the OAuth provider
  // Influencer-specific fields
  niche?: string;
  interests?: string[];
  socialMediaProfiles?: {
    platform: string;
    handle: string;
    url: string;
    followers: number;
  }[];
  // Campaign Manager-specific fields
  associatedCompany?: string;
  level?: string;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, unique: true },
    password: { type: String }, // Make password optional
    username: { type: String, required: true,unique:true },
    accountType: { type: String, required: true, enum: ["INFLUENCER", "CAMPAIGN_MANAGER"] },
    status: { type: String, default: "ACTIVE" },
    name: { type: String },
    bio: { type: String },
    website: { type: String },
    location: { type: String },
    profileImage: {
      type: String,
      default: "/images/default-avatar.png",
    },
    
    // OAuth-specific fields
    provider: { type: String }, // e.g., "google"
    providerId: { type: String }, // Unique ID provided by the OAuth provider
    // Influencer-specific fields
    niche: { type: String },
    interests: { type: [String] },
    socialMediaProfiles: { type: Array },
    // Campaign Manager-specific fields
    associatedCompany: { type: String },
    level: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);