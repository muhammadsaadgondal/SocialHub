import React from "react";
import type { IUser } from "@/models/User";
import {
  EnvelopeIcon,
  GlobeAltIcon,
  LinkIcon,
  UserGroupIcon,
  ChatBubbleLeftRightIcon,
  CameraIcon,
  VideoCameraIcon,
  MusicalNoteIcon,
  CodeBracketIcon,
  BuildingStorefrontIcon,
  HashtagIcon
} from "@heroicons/react/24/outline";
import {
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaPinterest,
  FaReddit,
  FaTwitch,
  FaSnapchat,
  FaDiscord
} from "react-icons/fa";

export interface SocialMediaProps {
  user: IUser;
}

export function SocialMedia({ user }: SocialMediaProps) {
  const { socialMediaProfiles } = user;

  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    switch (platformLower) {
      case 'twitter': return <FaTwitter className="w-5 h-5 text-blue-400" />;
      case 'instagram': return <FaInstagram className="w-5 h-5 text-pink-600" />;
      case 'facebook': return <FaFacebook className="w-5 h-5 text-blue-600" />;
      case 'linkedin': return <FaLinkedin className="w-5 h-5 text-blue-700" />;
      case 'youtube': return <FaYoutube className="w-5 h-5 text-red-600" />;
      case 'tiktok': return <FaTiktok className="w-5 h-5 text-black" />;
      case 'pinterest': return <FaPinterest className="w-5 h-5 text-red-500" />;
      case 'reddit': return <FaReddit className="w-5 h-5 text-orange-500" />;
      case 'twitch': return <FaTwitch className="w-5 h-5 text-purple-600" />;
      case 'snapchat': return <FaSnapchat className="w-5 h-5 text-yellow-400" />;
      case 'other': return <HashtagIcon className="w-5 h-5 text-gray-500" />;
      default: return <LinkIcon className="w-5 h-5 text-gray-500" />;
    }
  };

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
        <UserGroupIcon className="w-5 h-5 text-gray-700" />
        Social Profiles
      </h2>
      
      {socialMediaProfiles && socialMediaProfiles.length > 0 ? (
        <ul className="space-y-4">
          {socialMediaProfiles.map((profile, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="mt-0.5">
                {getPlatformIcon(profile.platform)}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-baseline gap-1">
                  <span className="font-medium text-gray-900 capitalize">
                    {profile.platform}
                  </span>
                  <a
                    href={profile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    @{profile.handle}
                  </a>
                </div>
                {profile.followers > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formatFollowers(profile.followers)} followers
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <GlobeAltIcon className="w-10 h-10 text-gray-300 mb-3" />
          <p className="text-gray-500">No social media profiles added yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Add your social links to connect with your audience
          </p>
        </div>
      )}
    </div>
  );
}