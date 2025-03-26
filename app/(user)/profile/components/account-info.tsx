"use client";
import React from "react"
import { 
  PencilIcon, 
  UserIcon, 
  AtSymbolIcon, 
  MapPinIcon, 
  CalendarIcon, 
  TagIcon 
} from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { BadgeAlertIcon, BadgeCentIcon, MailCheckIcon, TicketCheckIcon } from "lucide-react";

interface AccountInfoProps {
  user: {
    name?: string | null
    username: string
    email?: string | null
    accountType?: string
    status?: string
    memberSince?: string
    niche?: string
    interests?: string[]
    location?: string | null
  }
}

export function AccountInfo({ user }: AccountInfoProps) {
  const router = useRouter();
  const { data: session } = useSession();

  // Navigate to edit profile page
  const handleEdit = () => {
    if (session?.user?.username) {
      router.push(`/profile/${session.user.username}/edit`);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Header with single edit button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Account Information</h2>
        {session?.user?.username === user.username && (
          <button
            onClick={handleEdit}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors text-sm"
          >
            <PencilIcon className="w-4 h-4 mr-1" />
            Edit
          </button>
        )}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
       
        {/* USERNAME */}
        <DataRow 
          icon={<AtSymbolIcon className="w-5 h-5 text-gray-500" />} 
          label="Username" 
          value={user.username} 
        />

        {/* EMAIL */}
        <DataRow 
          icon={<MailCheckIcon className="w-5 h-5 text-gray-500" />} 
          label="Email" 
          value={user.email || "Not specified"} 
        />

        {/* ACCOUNT TYPE */}
        <DataRow 
          icon={<BadgeAlertIcon className="w-5 h-5 text-gray-500" />} 
          label="Account Type" 
          value={user.accountType ? user.accountType.replace('_', ' ') : "Not specified"}
        />

       
        {/* NICHE */}
        <DataRow
          icon={<TagIcon className="w-5 h-5 text-gray-500" />} 
          label="Niche"
          value={user.niche ? user.niche.toUpperCase() : "Not specified"}
        />

        {/* INTERESTS */}
        {user.interests && user.interests.length > 0 ? (
          <div className="sm:col-span-2 flex items-center gap-2">
            <TagIcon className="w-5 h-5 text-gray-500 mr-2" />
            <span className="font-medium whitespace-nowrap">Interests:</span>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest, index) => (
                <span 
                  key={index} 
                  className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <DataRow 
            icon={<TagIcon className="w-5 h-5 text-gray-500" />} 
            label="Interests" 
            value="Not specified" 
          />
        )}
      </div>
    </div>
  )
}

/** A flexible row for label + value with icon. */
function DataRow({ 
  icon,
  label, 
  value, 
  valueClassName = 'text-gray-700' 
}: { 
  icon?: React.ReactNode;
  label: string; 
  value: string; 
  valueClassName?: string 
}) {
  return (
    <div className="flex items-center gap-3">
      {icon}
      <div className="flex items-center gap-2">
        <span className="font-medium whitespace-nowrap">{label}:</span>
        <span className={valueClassName}>{value}</span>
      </div>
    </div>
  )
}