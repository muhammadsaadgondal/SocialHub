import mongoose, { Schema, Document } from "mongoose"

export interface IUser extends Document {
  email: string
  password: string
  username: string
  accountType: "INFLUENCER" | "CAMPAIGN_MANAGER"
  status: string
  createdAt: Date
  updatedAt: Date
  // Influencer-specific fields
  niche?: string
  interests?: string[]
  socialMediaProfiles?: {
    platform: string
    handle: string
    url: string
    followers: number
  }[]
  // Campaign Manager-specific fields
  associatedCompany?: string
  level?: string
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    accountType: { type: String, required: true, enum: ["INFLUENCER", "CAMPAIGN_MANAGER"] },
    status: { type: String, default: "ACTIVE" },
    // Influencer-specific fields
    niche: { type: String },
    interests: { type: [String] },
    socialMediaProfiles: { type: Array },
    // Campaign Manager-specific fields
    associatedCompany: { type: String },
    level: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema)