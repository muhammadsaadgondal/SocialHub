import { notFound } from "next/navigation";
import { getUserByUsername } from "@/lib/user-service";
import { EditProfileForm } from "./../../components/profile/edit-profile-form";
import { use } from "react";

interface EditProfilePageProps {
  params: {
    username: string;
  };
}

export default function EditProfilePage({ params }: { params: Promise<EditProfilePageProps> }) {
  const { username } = use(params).params;

  console.log("📩 Received username:", username);

  // Fetch the Mongoose document
  const userDoc = getUserByUsername(username);

  if (!userDoc) {
    console.warn("🚫 User not found:", username);
    return notFound();
  }

  console.log("✅ User found:", userDoc);

  // Convert the Mongoose document to a plain object
  const user = JSON.parse(JSON.stringify(userDoc));

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
      <EditProfileForm user={user} />
    </div>
  );
}