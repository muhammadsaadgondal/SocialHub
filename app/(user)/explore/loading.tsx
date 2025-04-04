import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600" />
        <p className="text-lg text-gray-500">Loading influencers...</p>
      </div>
    </div>
  )
}