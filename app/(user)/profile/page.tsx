// app/(user)/profile/[username]/page.tsx
import { notFound } from "next/navigation";
import { getUserProfile } from "@/lib/user-service";
import { ProfileHeader } from "./components/profile-header";
import { AccountInfo } from "./components/account-info";
import { SocialMedia } from "./components/social-media";
import { formatDate } from "@/lib/utils";

interface ProfilePageProps {
  params: {
    username: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { username } = params;

  // Fetch the user document.
  const userDoc = await getUserProfile(username);
  if (!userDoc) {
    return notFound();
  }

  // Convert Mongoose document to a plain object.
  const user = JSON.parse(JSON.stringify(userDoc));

  // Compute "memberSince" using createdAt.
  const memberSince = user.createdAt ? formatDate(user.createdAt) : "Unknown";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <ProfileHeader
        username={user.username}
        name={user.name}
        bio={user.bio}
        location={user.location}
        website={user.website}
        profileImage={user.profileImage}
        isActive={user.status === "ACTIVE"}
        memberSince={memberSince}
      />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AccountInfo
            user={{
              username: user.username,
              email: user.email,
              accountType: user.accountType,
              status: user.status,
              memberSince,
              niche: user.niche,
              interests: user.interests || [],
              location: user.location,
            }}
          />

          <SocialMedia user={user} />
        </div>
      </div>
    </div>
  );
}