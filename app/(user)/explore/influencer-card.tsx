import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"

interface InfluencerCardProps {
  id: string
  name: string
  image?: string
  tags: string[]
  followers: string
  likes: string
  impressions: string
}

export default function InfluencerCard({
  id,
  name,
  image,
  tags,
  followers,
  likes,
  impressions,
}: InfluencerCardProps) {
  return (
    <Link href={`/influencer/${id}`} className="block">
      {/* Fixed width and taller image container for a bigger card */}
      <div className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow w-80">
        <div className="relative h-64 w-full">
          <Image
            src={image ? image : "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
          />
          <button className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white">
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>
        </div>
        <div className="p-4 text-center">
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex justify-center gap-2 my-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className={`text-xs px-2 py-1 rounded-full ${
                  index % 2 === 0
                    ? "bg-purple-100 text-purple-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
            <div>
              <p className="text-gray-500">Followers</p>
              <p className="font-medium">{followers}</p>
            </div>
            <div>
              <p className="text-gray-500">Likes</p>
              <p className="font-medium">{likes}</p>
            </div>
            <div>
              <p className="text-gray-500">Impressions</p>
              <p className="font-medium">{impressions}</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}