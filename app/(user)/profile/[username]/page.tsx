import { notFound } from "next/navigation";
import { getUserProfile } from "@/lib/user-service";
import { ProfileHeader } from "./../components/profile-header";
import { AccountInfo } from "./../components/account-info";
import { SocialMedia } from "./../components/social-media";
import { formatDate } from "@/lib/utils";
import { use } from "react";

interface ProfilePageProps {
    username: string;
}

export default async function ProfilePage({ params }: { params: Promise<ProfilePageProps> }) {
  const { username } = use(params);

  // Call getUserProfile with the username argument.
  const user = await getUserProfile(username);
  if (!user) {
    return notFound();
  }

  // Compute "memberSince" using createdAt.
  const memberSince = user.createdAt ? formatDate(user.createdAt) : "Unknown";

  // Prepare props for ProfileHeader.
  const profileHeaderProps = {
    username: user.username,
    name: user.name,
    bio: user.bio,
    location: user.location,
    website: user.website,
    profileImage: user.profileImage,
    isActive: user.status === "ACTIVE",
    memberSince,
  };

  return (
    <div className="flex flex-col gap-y-4">
      <ProfileHeader {...profileHeaderProps} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AccountInfo
          user={{
            username: user.username,
            email: user.email,
            accountType: user.accountType,
            status: user.status,
            memberSince,
            niche: user.niche,
            interests: user.interests || [],
          }}
        />
        <SocialMedia user={user} />
      </div>
    </div>
  );
}