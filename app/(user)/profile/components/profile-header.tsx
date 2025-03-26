"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { 
  PencilSquareIcon, 
  MapPinIcon, 
  LinkIcon, 
  CalendarDaysIcon, 
  UserCircleIcon,
  CheckBadgeIcon
} from "@heroicons/react/24/solid";
import { motion } from "framer-motion";
import { Bold } from "lucide-react";

export interface ProfileHeaderProps {
  username: string;
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  profileImage?: string;
  isActive?: boolean;
  memberSince?: string;
  verified?: boolean;
}

export function ProfileHeader({
  username,
  name,
  bio,
  location,
  website,
  profileImage,
  isActive,
  memberSince,
  verified = false,
}: ProfileHeaderProps) {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push(`/profile/${username}/edit`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-800 via-purple-700 to-purple-600 text-white rounded-2xl shadow-xl overflow-hidden border border-white/10"
    >
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image with animated border */}
          <motion.div 
            whileHover={{ scale: 1.03 }}
            className="relative w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white/30 shadow-2xl overflow-hidden flex-shrink-0 group"
          >
            {profileImage ? (
              <Image
                src={profileImage}
                alt={username}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
            ) : (
              <Image
                src="/images/default-avatar.png"
                alt="Default avatar"
                fill
                className="object-cover"
                priority
              />
            )}
            {verified && (
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1.5 border-2 border-white">
                <CheckBadgeIcon className="w-5 h-5 text-white" />
              </div>
            )}
          </motion.div>

          {/* User Info */}
          <div className="flex-1 space-y-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-100">
                    {name || username}
                  </h1>
                </div>
                {name && (
                  <div className="flex items-center gap-2">
                    <p className="text-purple-200/90 text-md">@{username}</p>
                    {verified && (
                      <CheckBadgeIcon className="w-5 h-5 text-blue-400" />
                    )}
                  </div>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleEditProfile}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-5 py-2.5 rounded-xl transition-all duration-200 border border-white/20 shadow-md hover:shadow-lg"
              >
                <PencilSquareIcon className="w-5 h-5" />
                <span className="font-medium">Edit Profile</span>
              </motion.button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {bio && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-start gap-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm"
                >
                  <UserCircleIcon className="w-6 h-6 flex-shrink-0 mt-1 text-purple-300" />
                  <div>
                    <p className="text-md text-white/90 leading-relaxed">{bio}</p>
                  </div>
                </motion.div>
              )}

              {location && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm"
                >
                  <MapPinIcon className="w-6 h-6 text-purple-300" />
                  <div>
                    <p className="text-md text-white/90">{location}</p>
                  </div>
                </motion.div>
              )}

              {website && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm"
                >
                  <LinkIcon className="w-6 h-6 text-purple-300" />
                  <div>
                    <a
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-md text-white/90 hover:underline flex items-center gap-1"
                    >
                      {website.replace(/^https?:\/\//, '')}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              )}

              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center gap-3 bg-white/5 p-3 rounded-lg backdrop-blur-sm"
              >
                <CalendarDaysIcon className="w-6 h-6 text-purple-300" />
                <div className="flex flex-col">
                  {memberSince && (
                    <span className="text-md text-white/90 mb-1"><span className="font-bold">Joined Since:</span> {memberSince}</span>
                  )}
                  <span className={`px-3 py-1.5 rounded-md text-sm font-medium ${isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {isActive ? 'Active Now' : 'Currently Inactive'}
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}