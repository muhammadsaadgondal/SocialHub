"use client";

import Image from "next/image";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProfileHeaderProps {
  name?: string;
  username?: string;
  bio?: string;
  location?: string;
  website?: string;
  profileImage?: string;
  isActive?: boolean;      // Shows "ACTIVE" if true
  memberSince?: string;    // Shows "Member Since" if provided
}

export default function ProfileHeader({
  name,
  username = "username",
  bio,
  location,
  website,
  profileImage,
  isActive = false,
  memberSince,
}: ProfileHeaderProps) {
  // If the user doesn't have a "name," fall back to username
  const displayName = name?.trim() || username;

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Profile Image */}
          <div className="relative border-4 border-white rounded-full overflow-hidden w-48 h-48 bg-white">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={displayName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-gray-300">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Basic Info */}
          <div className="flex-1 space-y-2">
            <h1 className="text-4xl font-bold">{displayName}</h1>

            {/* Location */}
            {location && (
              <div className="flex items-center gap-2 text-lg">
                <MapPin className="h-5 w-5 text-white/80" />
                <span>{location}</span>
              </div>
            )}

            {/* Member Since */}
            {memberSince && (
              <p className="text-sm text-white/90">
                Member Since: {memberSince}
              </p>
            )}

            {/* Status */}
            {isActive && (
              <Badge className="bg-blue-500 text-white">ACTIVE</Badge>
            )}
          </div>

          {/* Edit Button */}
          <div>
            <Button
              variant="outline"
              className="bg-transparent text-white border-white hover:bg-blue-700"
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Bio */}
        {bio && <p className="mt-4 text-lg text-white/90">{bio}</p>}
      </div>
    </div>
  );
}