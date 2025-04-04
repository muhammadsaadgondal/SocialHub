"use client"

import { useState, useEffect } from "react"
import ExploreHeader from "./explore-header"
import InfluencerCard from "./influencer-card"
import { getAllInfluencers, getFilteredInfluencers } from "@/lib/mock-data"

export default function ExplorePage() {
  const [influencers, setInfluencers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("trending")

  useEffect(() => {
    // Simulate API call with our mock data
    const fetchInfluencers = () => {
      setLoading(true)
      // In a real app, replace this with an actual API call
      setTimeout(() => {
        const data = filter === "trending" ? getAllInfluencers() : getFilteredInfluencers(filter)
        setInfluencers(data)
        setLoading(false)
      }, 500)
    }

    fetchInfluencers()
  }, [filter])

  const handleFilterChange = (newFilter: string) => {
    setFilter(newFilter)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <ExploreHeader onFilterChange={handleFilterChange} activeFilter={filter} />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : (
        <>
          <div className="my-6">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{filter}</span> influencers
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {influencers.map((influencer) => (
              <InfluencerCard
                key={influencer.id}
                id={influencer.id}
                name={influencer.name}
                image={influencer.image}
                tags={influencer.tags}
                followers={influencer.followers}
                likes={influencer.likes}
                impressions={influencer.impressions}
              />
            ))}
          </div>

          {influencers.length === 0 && (
            <div className="bg-gray-50 rounded-lg p-8 text-center my-8">
              <p className="text-gray-500">No influencers found for this category.</p>
            </div>
          )}
        </>
      )}
    </div>
  )
}