"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { IUser } from "@/models/User";

interface EditProfileFormProps {
  user: IUser;
}

export const EditProfileForm = ({ user }: EditProfileFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileImage, setProfileImage] = useState(user.profileImage || "");

  // Extract social media handles from the user's socialMediaProfiles array
  const initialSocialMedia = {
    instagram:
      user.socialMediaProfiles?.find(
        (profile) => profile.platform.toLowerCase() === "instagram"
      )?.handle || "",
    facebook:
      user.socialMediaProfiles?.find(
        (profile) => profile.platform.toLowerCase() === "facebook"
      )?.handle || "",
    twitter:
      user.socialMediaProfiles?.find(
        (profile) => profile.platform.toLowerCase() === "twitter"
      )?.handle || "",
    linkedin:
      user.socialMediaProfiles?.find(
        (profile) => profile.platform.toLowerCase() === "linkedin"
      )?.handle || "",
  };

  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    name: user.name || "", // Added name field
    location: user.location || "",
    niche: user.niche || "",
    bio: user.bio || "",
    ...initialSocialMedia,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file selection and auto-upload the image
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Check file size (maximum 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB. Please select a smaller file.");
      return;
    }

    setUploading(true);

    // Create a FormData instance and append the selected file
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.url) {
        setProfileImage(data.url);
      } else {
        console.error("Upload failed:", data);
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Build the socialMediaProfiles array from formData
      const socialMediaProfiles = [];
      if (formData.instagram.trim()) {
        socialMediaProfiles.push({
          platform: "instagram",
          handle: formData.instagram,
          url: `https://instagram.com/${formData.instagram}`,
          followers: 0,
        });
      }
      if (formData.facebook.trim()) {
        socialMediaProfiles.push({
          platform: "facebook",
          handle: formData.facebook,
          url: `https://facebook.com/${formData.facebook}`,
          followers: 0,
        });
      }
      if (formData.twitter.trim()) {
        socialMediaProfiles.push({
          platform: "twitter",
          handle: formData.twitter,
          url: `https://twitter.com/${formData.twitter}`,
          followers: 0,
        });
      }
      if (formData.linkedin.trim()) {
        socialMediaProfiles.push({
          platform: "linkedin",
          handle: formData.linkedin,
          url: `https://linkedin.com/in/${formData.linkedin}`,
          followers: 0,
        });
      }

      // Build the payload to update the profile, including the uploaded image URL
      const updatedData = {
        username: formData.username,
        email: formData.email,
        name: formData.name, // Added name field
        location: formData.location,
        niche: formData.niche,
        bio: formData.bio,
        profileImage, // This is the URL returned from the file upload
        socialMediaProfiles,
      };

      // Use user._id to update the profile
      const response = await fetch(`/api/user/${user._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      router.refresh();
      router.push(`/profile/${formData.username}`);
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-6 rounded-md shadow-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Your full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="City, Country"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="niche">Niche</Label>
          <Input
            id="niche"
            name="niche"
            value={formData.niche}
            onChange={handleChange}
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          disabled={isLoading}
          rows={4}
        />
      </div>

      {/* Profile Image Upload Field (Direct File Upload) */}
      <div className="space-y-2">
        <Label htmlFor="profileImage">Upload Profile Image</Label>
        <Input
          id="profileImage"
          name="profileImage"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading || isLoading}
        />
        {uploading && (
          <p className="text-sm text-gray-600">Uploading image...</p>
        )}
        {profileImage && (
          <div className="mt-2">
            <img
              src={profileImage}
              alt="Uploaded Profile"
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Social Media</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="instagram">Instagram</Label>
            <Input
              id="instagram"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="username (without @)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="facebook">Facebook</Label>
            <Input
              id="facebook"
              name="facebook"
              value={formData.facebook}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="username or profile ID"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter</Label>
            <Input
              id="twitter"
              name="twitter"
              value={formData.twitter}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="username (without @)"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="username"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || uploading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
};