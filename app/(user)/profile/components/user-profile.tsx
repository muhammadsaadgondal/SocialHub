"use client"

import React from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { MapPin, Globe } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// Define a shape for social links
interface SocialLink {
  platform: string
  url: string
}

// Define a shape for user profile data
interface UserProfileData {
  profileImage?: string
  name?: string
  bio?: string
  location?: string
  website?: string
  status?: string
  username?: string
  email?: string
  accountType?: string
  memberSince?: string
  niche?: string
  interests?: string[]
  socialLinks?: SocialLink[]
}

// Props for this component
interface UserProfileProps {
  profile?: UserProfileData
  initialData?: UserProfileData // Sometimes data is passed as initialData
}

export default function UserProfile({ profile, initialData }: UserProfileProps) {
  const userData = profile || initialData
  const router = useRouter()

  if (!userData) {
    return <div>No user data available</div>
  }

  // Safely handle social links (avoid undefined)
  const socialLinks = Array.isArray(userData.socialLinks) ? userData.socialLinks : []

  return (
    <div className="w-full">
      {/* Profile Header - Blue Box */}
      <div className="w-full bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 relative">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Profile Image */}
            <div className="relative border-4 border-white rounded-full overflow-hidden w-48 h-48 bg-white">
              {userData.profileImage ? (
                <Image
                  src={userData.profileImage || "/placeholder.svg"}
                  alt={userData.name || userData.username || "Profile"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                  {userData.name?.charAt(0).toUpperCase() ||
                    userData.username?.charAt(0).toUpperCase() ||
                    "U"}
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-1 space-y-4">
              {/* Name */}
              {userData.name && <h1 className="text-2xl font-bold">{userData.name}</h1>}

              {/* Bio */}
              {userData.bio && <p className="text-white/90">{userData.bio}</p>}

              {/* Location & Website */}
              <div className="flex items-center gap-4">
                {userData.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-5 w-5 text-white/80" />
                    <span className="text-sm">{userData.location}</span>
                  </div>
                )}

                {userData.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-5 w-5 text-white/80" />
                    <a
                      href={
                        userData.website.startsWith("http")
                          ? userData.website
                          : `https://${userData.website}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                    >
                      {userData.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Status */}
              {userData.status === "ACTIVE" && (
                <Badge className="bg-blue-500 hover:bg-blue-500 text-white">ACTIVE</Badge>
              )}
            </div>

            {/* Edit Profile Button */}
            <Button
              variant="outline"
              className="absolute top-6 right-4 bg-transparent text-white border-white hover:bg-blue-700 hover:text-white"
              onClick={() => router.push(`/profile/${userData.username}/edit`)}
            >
              Edit Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Account Information & Social Media */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-6">
        {/* Account Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <InfoItem label="Username" value={userData.username} />
            <InfoItem label="Email" value={userData.email} />
            <InfoItem label="Account Type">
              {userData.accountType && (
                <Badge variant="outline" className="bg-gray-900 text-white">
                  {userData.accountType}
                </Badge>
              )}
            </InfoItem>
            <InfoItem label="Status" value={userData.status} />
            <InfoItem label="Member Since" value={userData.memberSince || "Unknown"} />
            <InfoItem
              label="Niche"
              value={userData.niche || "Not specified"}
              isHighlighted={!userData.niche}
            />

            {/* Interests */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Interests</h3>
              {userData.interests && userData.interests.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {userData.interests.map((interest: string, index: number) => (
                    <Badge key={index} variant="secondary">
                      {interest}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-red-500">No interests specified</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Social Media Card */}
        <Card>
          <CardHeader>
            <CardTitle>Social Media</CardTitle>
          </CardHeader>
          <CardContent>
            {socialLinks.length > 0 ? (
              <div className="space-y-3">
                {socialLinks.map((link: SocialLink, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-blue-600 hover:underline"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No social media links added yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/** Reusable info item for labels and values. */
interface InfoItemProps {
  label: string
  value?: string
  children?: React.ReactNode
  isHighlighted?: boolean
}

function InfoItem({ label, value, children, isHighlighted = false }: InfoItemProps) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium">{label}</h3>
      {children || (
        <p className={`text-sm ${isHighlighted ? "text-red-500" : ""}`}>{value || "Not specified"}</p>
      )}
    </div>
  )
}