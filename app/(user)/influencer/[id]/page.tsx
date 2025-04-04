import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  MessageSquare,
  Instagram,
  Twitter,
  Globe,
  Award,
  Youtube,
  Linkedin,
} from "lucide-react"
import { getInfluencerById } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { use } from "react"

// Custom TikTok icon since it's not in Lucide
const TikTok = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
)

export default async function InfluencerProfile({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  // Await params to unwrap the promise before accessing properties.
  const { id } = use(params);
  const influencer = getInfluencerById(id)

  if (!influencer) {
    console.error(`Influencer with id "${id}" not found`)
    return (
      <div className="container mx-auto px-4 py-8">
        <Link href="/explore" className="flex items-center text-purple-600 mb-6">
          <ArrowLeft className="mr-2" size={20} />
          Back to Explore
        </Link>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Influencer Not Found</h1>
          <p>The influencer you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  function cleanUrl(image: any): string | import("next/dist/shared/lib/get-img-props").StaticImport {
    if (typeof image === "string" && image.startsWith("http")) {
      return image;
    }
    return "/placeholder.svg";
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/explore" className="flex items-center text-purple-600 mb-6">
        <ArrowLeft className="mr-2" size={20} />
        Back to Explore
      </Link>

      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <Image
              src={influencer.image || "/placeholder.svg"}
              alt={influencer.name}
              width={300}
              height={300}
              className="h-64 w-full object-cover md:w-64"
            />
          </div>
          <div className="p-8 w-full">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{influencer.name}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {influencer.tags.map((tag: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className={`${index % 2 === 0
                          ? "bg-purple-100 text-purple-600 hover:bg-purple-100"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-100"
                        } border-0`}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <p className="mt-4 text-gray-600">{influencer.bio}</p>
                <p className="mt-2 text-gray-500">
                  <span className="font-medium">Location:</span> {influencer.location}
                </p>
                <p className="text-gray-500">
                  <span className="font-medium">Languages:</span> {influencer.languages.join(", ")}
                </p>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <MessageSquare className="mr-2" size={18} />
                Message
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mt-6 border-t pt-6">
              <div className="text-center">
                <p className="text-gray-500 text-sm">Followers</p>
                <p className="font-bold text-lg">{influencer.followers}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm">Likes</p>
                <p className="font-bold text-lg">{influencer.likes}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm">Impressions</p>
                <p className="font-bold text-lg">{influencer.impressions}</p>
              </div>
              <div className="text-center">
                <p className="text-gray-500 text-sm">Engagement</p>
                <p className="font-bold text-lg">{influencer.engagement}</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 mt-6">
              {influencer.socialLinks.instagram && (
                <a
                  href={influencer.socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-pink-500"
                >
                  <Instagram size={20} />
                </a>
              )}
              {influencer.socialLinks.twitter && (
                <a
                  href={influencer.socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-blue-400"
                >
                  <Twitter size={20} />
                </a>
              )}
              {influencer.socialLinks.website && (
                <a
                  href={influencer.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-700"
                >
                  <Globe size={20} />
                </a>
              )}
              {influencer.socialLinks.youtube && (
                <a
                  href={influencer.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-red-600"
                >
                  <Youtube size={20} />
                </a>
              )}
              {influencer.socialLinks.tiktok && (
                <a
                  href={influencer.socialLinks.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-black"
                >
                  <TikTok />
                </a>
              )}
              {influencer.socialLinks.linkedin && (
                <a
                  href={influencer.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-blue-700"
                >
                  <Linkedin size={20} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Information */}
      {influencer.pricing && (
        <div className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Pricing Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500 mb-1">Instagram Post</p>
              <p className="text-2xl font-bold text-purple-600">{influencer.pricing.post}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500 mb-1">Story</p>
              <p className="text-2xl font-bold text-purple-600">{influencer.pricing.story}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-gray-500 mb-1">Video Content</p>
              <p className="text-2xl font-bold text-purple-600">{influencer.pricing.video}</p>
            </div>
          </div>
        </div>
      )}

      {/* Past Campaigns */}
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <Award className="mr-2" size={20} />
          Past Campaigns
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {influencer.campaigns.map((campaign: any) => (
            <div
              key={campaign.id}
              className="bg-white rounded-lg shadow-sm overflow-hidden border hover:shadow-md transition-shadow"
            >
              <Image
                src={campaign.image ? cleanUrl(campaign.image) : "/placeholder.svg"}
                alt={campaign.title}
                width={300}
                height={200}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-lg">{campaign.title}</h3>
                <p className="text-purple-600">{campaign.brand}</p>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{campaign.description}</p>
                <div className="flex justify-between mt-3 text-sm text-gray-500">
                  <span>{campaign.date}</span>
                  <span className="font-medium text-green-600">{campaign.performance}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-500">Engagement</p>
                    <p className="font-medium">{campaign.engagement}</p>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-center">
                    <p className="text-xs text-gray-500">Reach</p>
                    <p className="font-medium">{campaign.reach}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {influencer.campaigns.length === 0 && (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-500">No past campaigns found for this influencer.</p>
          </div>
        )}
      </div>
    </div>
  )
}